import { NextResponse } from 'next/server'
import { scrapeOverpassAPI } from '@/lib/scrapers/overpass'
import { scrapeGooglePlaces } from '@/lib/scrapers/googlePlaces'
import { getTopCities } from '@/data/cities'

/**
 * Test route for cron job scraping
 * This route allows manual testing of the scraping system without waiting for the cron schedule
 *
 * Usage: GET /api/test/cron-test
 */
export async function GET() {
  const startTime = Date.now()

  try {
    console.log('[Test Cron] Starting test scraping...')

    // Test with Paris only (first city)
    const cities = getTopCities(1)
    const testCity = cities[0]

    console.log(`[Test Cron] Testing with ${testCity.name}...`)

    // Test Overpass API
    console.log('[Test Cron] Testing Overpass API...')
    const overpassData = await scrapeOverpassAPI(
      testCity.latitude,
      testCity.longitude,
      testCity.name
    )
    console.log(`[Test Cron] Overpass returned ${overpassData.length} activities`)

    // Test Google Places API (if configured)
    console.log('[Test Cron] Testing Google Places API...')
    const googleData = await scrapeGooglePlaces(
      testCity.latitude,
      testCity.longitude,
      testCity.name
    )
    console.log(`[Test Cron] Google Places returned ${googleData.length} activities`)

    const duration = Date.now() - startTime

    // Return detailed results
    return NextResponse.json({
      success: true,
      city: testCity.name,
      results: {
        overpass: {
          count: overpassData.length,
          sample: overpassData.slice(0, 3), // First 3 activities
        },
        googlePlaces: {
          count: googleData.length,
          sample: googleData.slice(0, 3), // First 3 activities
        },
      },
      total: overpassData.length + googleData.length,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Test Cron] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
