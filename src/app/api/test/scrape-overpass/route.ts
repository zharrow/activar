import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scrapeOverpassAPI } from '@/lib/scrapers/overpass'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// Endpoint de test pour scraper uniquement Overpass API
export async function GET() {
  const startTime = Date.now()

  try {
    console.log('[Test Scraper] Starting Overpass API scraping...')

    // Scrape from Overpass API only
    const activities = await scrapeOverpassAPI()

    console.log(`[Test Scraper] Found ${activities.length} activities from Overpass`)

    // Insert activities to database
    let createdCount = 0
    let updatedCount = 0

    for (const activity of activities) {
      // Check if activity already exists by name and city
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
      scraped: activities.length,
      created: createdCount,
      updated: updatedCount,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Test Scraper] Error:', error)
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
