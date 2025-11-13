import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scrapeSerpApi } from '@/lib/scrapers/serpApi'
import { OverpassActivity } from '@/lib/scrapers/overpass'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // Maximum duration for the request (60s for Vercel Pro, 10s for Hobby)

/**
 * Scrape activities dynamically based on location coordinates and radius using SerpAPI
 * POST /api/scrape-location
 * Body: { latitude, longitude, radiusKm, cityName }
 */
export async function POST(request: Request) {
  const startTime = Date.now()

  try {
    const body = await request.json()
    const { latitude, longitude, radiusKm, cityName } = body

    // Validation
    if (!latitude || !longitude || !radiusKm) {
      return NextResponse.json(
        { error: 'Missing required parameters: latitude, longitude, radiusKm' },
        { status: 400 }
      )
    }

    if (radiusKm > 50) {
      return NextResponse.json(
        { error: 'Radius cannot exceed 50km' },
        { status: 400 }
      )
    }

    console.log(
      `[Dynamic Scraper] Starting SerpAPI scrape for location: ${cityName || 'Unknown'} (${latitude}, ${longitude}) - Radius: ${radiusKm}km`
    )

    // Scrape using SerpAPI with location parameters
    const serpApiData = await scrapeSerpApi({
      latitude,
      longitude,
      cityName,
      radiusKm,
    })

    // Deduplicate results
    const uniqueActivities = deduplicateActivities(serpApiData)

    console.log(
      `[Dynamic Scraper] Found ${uniqueActivities.length} unique activities from SerpAPI`
    )

    // Insert/Update activities in database
    let createdCount = 0
    let updatedCount = 0

    for (const activity of uniqueActivities) {
      const existing = await prisma.activity.findFirst({
        where: {
          name: activity.name,
          // Check within ~100m to avoid duplicates from slightly different coordinates
          latitude: {
            gte: activity.latitude - 0.001,
            lte: activity.latitude + 0.001,
          },
          longitude: {
            gte: activity.longitude - 0.001,
            lte: activity.longitude + 0.001,
          },
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
            city: activity.city,
            phone: activity.phone || existing.phone,
            email: activity.email || existing.email,
            website: activity.website || existing.website,
            latitude: activity.latitude,
            longitude: activity.longitude,
            updatedAt: new Date(),
          },
        })
        updatedCount++
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
        createdCount++
      }
    }

    const duration = Date.now() - startTime

    return NextResponse.json({
      success: true,
      location: {
        cityName: cityName || 'Unknown',
        latitude,
        longitude,
        radiusKm,
      },
      stats: {
        total: uniqueActivities.length,
        created: createdCount,
        updated: updatedCount,
        sources: {
          serpApi: serpApiData.length,
        },
      },
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Dynamic Scraper] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Dynamic scraping failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Deduplicate activities based on name and location
 */
function deduplicateActivities(activities: OverpassActivity[]): OverpassActivity[] {
  const seen = new Map<string, OverpassActivity>()

  for (const activity of activities) {
    // Create unique key from name + approximate location
    const key = `${activity.name.toLowerCase().trim()}_${activity.latitude?.toFixed(
      3
    )}_${activity.longitude?.toFixed(3)}`

    if (!seen.has(key)) {
      seen.set(key, activity)
    } else {
      // Merge data - prefer non-null values
      const existing = seen.get(key)!
      seen.set(key, {
        ...existing,
        ...activity,
        phone: activity.phone || existing.phone,
        email: activity.email || existing.email,
        website: activity.website || existing.website,
        postalCode: activity.postalCode || existing.postalCode,
      })
    }
  }

  return Array.from(seen.values())
}
