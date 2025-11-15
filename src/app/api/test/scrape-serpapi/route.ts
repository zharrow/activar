import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scrapeSerpApi } from '@/lib/scrapers/serpApi'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0

// Endpoint de test pour scraper uniquement SerpApi
export async function GET() {
  const startTime = Date.now()

  try {
    console.log('[Test SerpApi] Starting SerpApi scraping...')

    // Check if API key is configured
    if (!process.env.SERPAPI_KEY || process.env.SERPAPI_KEY === 'your-serpapi-key-here') {
      return NextResponse.json({
        success: false,
        error: 'SERPAPI_KEY not configured',
        message: 'Please sign up at https://serpapi.com/users/sign_up and add your API key to .env.local',
      }, { status: 400 })
    }

    // Scrape from SerpApi
    const activities = await scrapeSerpApi()

    console.log(`[Test SerpApi] Found ${activities.length} activities`)

    // Insert activities to database
    let createdCount = 0
    let updatedCount = 0
    let skippedCount = 0

    for (const activity of activities) {
      try {
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
      } catch (error) {
        console.error(`[Test SerpApi] Error inserting ${activity.name}:`, error)
        skippedCount++
      }
    }

    const duration = Date.now() - startTime

    return NextResponse.json({
      success: true,
      scraped: activities.length,
      created: createdCount,
      updated: updatedCount,
      skipped: skippedCount,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Test SerpApi] Error:', error)
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
