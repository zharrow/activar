import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * GET /api/activities/nearby
 * Find activities near given coordinates within specified distance
 *
 * Query params:
 * - lat: Latitude (required)
 * - lng: Longitude (required)
 * - distance: Max distance in km (default: 10)
 * - category: Filter by category (optional)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const distance = searchParams.get('distance') || '10'
    const category = searchParams.get('category')

    // Validate required parameters
    if (!lat || !lng) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: lat and lng',
        },
        { status: 400 }
      )
    }

    const latitude = parseFloat(lat)
    const longitude = parseFloat(lng)
    const maxDistance = parseFloat(distance)

    if (isNaN(latitude) || isNaN(longitude) || isNaN(maxDistance)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid coordinates or distance value',
        },
        { status: 400 }
      )
    }

    // Fetch all activities with coordinates
    // TODO: Optimize with geographic bounding box filter
    const whereClause: any = {
      latitude: { not: null },
      longitude: { not: null },
    }

    if (category && category !== 'all') {
      whereClause.category = category
    }

    const allActivities = await prisma.activity.findMany({
      where: whereClause,
    })

    // Filter activities by distance
    const nearbyActivities = allActivities
      .map((activity) => {
        if (!activity.latitude || !activity.longitude) {
          return null
        }

        const dist = calculateDistance(
          latitude,
          longitude,
          activity.latitude,
          activity.longitude
        )

        return {
          ...activity,
          distance: Math.round(dist * 10) / 10, // Round to 1 decimal
        }
      })
      .filter((activity): activity is NonNullable<typeof activity> =>
        activity !== null && activity.distance <= maxDistance
      )
      .sort((a, b) => a.distance - b.distance) // Sort by distance (closest first)

    return NextResponse.json({
      success: true,
      data: nearbyActivities,
      count: nearbyActivities.length,
      filters: {
        latitude,
        longitude,
        maxDistance,
        category: category || 'all',
      },
    })
  } catch (error) {
    console.error('Error fetching nearby activities:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch nearby activities',
      },
      { status: 500 }
    )
  }
}
