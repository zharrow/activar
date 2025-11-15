import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scrapeOverpassAPI } from '@/lib/scrapers/overpass'
import { scrapeGooglePlaces } from '@/lib/scrapers/googlePlaces'
import { scrapeSerpApi } from '@/lib/scrapers/serpApi'
import { getTopCities } from '@/data/cities'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0

/**
 * Multi-city scraping strategy:
 * - Scrapes 2-3 cities per day (rotation)
 * - Prioritizes Top 10 French cities
 * - Cycles through all cities over time
 * - Respects API quotas (Google Places: 40,000/month = ~1,300/day)
 */
export async function GET(request: Request) {
  // Verify Vercel Cron secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()

  try {
    console.log('[Scraper] Starting multi-city scraping job...')

    // Get priority cities (Top 10)
    const cities = getTopCities(10)

    // Determine which cities to scrape today (rotation based on day of month)
    const today = new Date()
    const dayOfMonth = today.getDate()
    const citiesToScrape = getCitiesToScrapeToday(cities, dayOfMonth)

    console.log(`[Scraper] Scraping cities today:`, citiesToScrape.map(c => c.name).join(', '))

    // Scrape each city
    const allActivities = []
    const cityResults: Record<string, number> = {}

    for (const city of citiesToScrape) {
      console.log(`[Scraper] Scraping ${city.name}...`)

      // Scrape from multiple sources for this city
      const [overpassData, serpApiData, googleData] = await Promise.all([
        scrapeOverpassAPI(city.latitude, city.longitude, city.name),
        scrapeSerpApi({
          latitude: city.latitude,
          longitude: city.longitude,
          cityName: city.name,
          radiusKm: 20
        }),
        scrapeGooglePlaces(city.latitude, city.longitude, city.name),
      ])

      const cityActivities = [...overpassData, ...serpApiData, ...googleData]
      allActivities.push(...cityActivities)
      cityResults[city.name] = cityActivities.length

      console.log(`[Scraper] Found ${cityActivities.length} activities in ${city.name}`)
    }

    // Merge and deduplicate data from all sources
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
      cities: citiesToScrape.map(c => c.name),
      cityResults,
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

/**
 * Determines which cities to scrape today based on rotation
 * Strategy: Scrape 2-3 cities per day, cycling through all cities
 */
function getCitiesToScrapeToday(cities: any[], dayOfMonth: number) {
  const CITIES_PER_DAY = 2 // Scrape 2 cities per day
  const totalCities = cities.length

  // Calculate starting index based on day of month
  // This creates a rotating schedule that cycles through all cities
  const cycleLength = Math.ceil(totalCities / CITIES_PER_DAY)
  const cycleDay = (dayOfMonth - 1) % cycleLength
  const startIndex = (cycleDay * CITIES_PER_DAY) % totalCities

  // Get the cities to scrape today
  const citiesToScrape = []
  for (let i = 0; i < CITIES_PER_DAY; i++) {
    const index = (startIndex + i) % totalCities
    citiesToScrape.push(cities[index])
  }

  return citiesToScrape
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
