import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scrapeOverpassAPI } from '@/lib/scrapers/overpass'
import { scrapeGooglePlaces } from '@/lib/scrapers/googlePlaces'
import { scrapeSerpApi } from '@/lib/scrapers/serpApi'

export async function GET(request: Request) {
  // Verify Vercel Cron secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()

  try {
    console.log('[Scraper] Starting scraping job...')

    // Scrape from multiple sources in parallel
    // Try SerpApi first, fallback to Google Places if not configured
    const [overpassData, serpApiData, googleData] = await Promise.all([
      scrapeOverpassAPI(),
      scrapeSerpApi(),
      scrapeGooglePlaces(),
    ])

    // Merge and deduplicate data from all sources
    const allActivities = [...overpassData, ...serpApiData, ...googleData]
    const uniqueActivities = deduplicateActivities(allActivities)

    console.log(`[Scraper] Found ${uniqueActivities.length} unique activities`)

    // Insert activities to database (check for duplicates by name)
    let upsertedCount = 0
    for (const activity of uniqueActivities) {
      // Check if activity already exists by name and approximate location
      const existing = await prisma.activity.findFirst({
        where: {
          name: activity.name,
          city: activity.city,
        },
      })

      if (existing) {
        // Update existing activity
        await prisma.activity.update({
          where: { id: existing.id },
          data: {
            category: activity.category,
            subcategory: activity.subcategory,
            address: activity.address,
            postalCode: activity.postalCode,
            phone: activity.phone || existing.phone,
            email: activity.email || existing.email,
            website: activity.website || existing.website,
            latitude: activity.latitude,
            longitude: activity.longitude,
            updatedAt: new Date(),
          },
        })
      } else {
        // Create new activity
        await prisma.activity.create({
          data: {
            name: activity.name,
            category: activity.category,
            subcategory: activity.subcategory,
            address: activity.address,
            postalCode: activity.postalCode,
            city: activity.city,
            phone: activity.phone,
            email: activity.email,
            website: activity.website,
            latitude: activity.latitude,
            longitude: activity.longitude,
          },
        })
      }
      upsertedCount++
    }

    const duration = Date.now() - startTime

    return NextResponse.json({
      success: true,
      count: upsertedCount,
      sources: {
        overpass: overpassData.length,
        serpApi: serpApiData.length,
        googlePlaces: googleData.length,
      },
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Scraper] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Scraping failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

function deduplicateActivities(activities: any[]) {
  const seen = new Map()

  for (const activity of activities) {
    // Create a unique key based on name and coordinates
    const key = `${activity.name.toLowerCase()}_${activity.latitude?.toFixed(
      4
    )}_${activity.longitude?.toFixed(4)}`

    if (!seen.has(key)) {
      seen.set(key, activity)
    } else {
      // Merge data if we have more complete information
      const existing = seen.get(key)
      seen.set(key, {
        ...existing,
        ...activity,
        // Prefer non-null values
        phone: activity.phone || existing.phone,
        email: activity.email || existing.email,
        website: activity.website || existing.website,
      })
    }
  }

  return Array.from(seen.values())
}
