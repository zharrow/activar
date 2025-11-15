import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0

// Endpoint de test pour insérer quelques données de test
export async function GET() {
  try {
    const testActivities = [
      {
        name: 'Club d\'Échecs de Toulouse',
        category: 'intellectual',
        subcategory: 'echecs',
        address: '12 Rue de la Colombette',
        postalCode: '31000',
        city: 'Toulouse',
        phone: '05 61 23 45 67',
        email: 'contact@echecs-toulouse.fr',
        website: 'https://echecs-toulouse.fr',
        latitude: 43.6108,
        longitude: 1.4442,
      },
      {
        name: 'Stade Toulousain Rugby',
        category: 'sport',
        subcategory: 'rugby',
        address: '114 Rue des Troènes',
        postalCode: '31200',
        city: 'Toulouse',
        phone: '05 61 16 27 27',
        website: 'https://www.stadetoulousain.fr',
        latitude: 43.5846,
        longitude: 1.4928,
      },
      {
        name: 'Toulouse Football Club',
        category: 'sport',
        subcategory: 'football',
        address: '1 Allée Gabriel Biénès',
        postalCode: '31400',
        city: 'Toulouse',
        phone: '05 34 40 70 00',
        website: 'https://www.tfc.info',
        latitude: 43.5831,
        longitude: 1.4342,
      },
      {
        name: 'Salle d\'Escalade Climb Up',
        category: 'sport',
        subcategory: 'escalade',
        address: '33 Chemin de Garonne',
        postalCode: '31200',
        city: 'Toulouse',
        phone: '05 61 48 82 82',
        website: 'https://toulouse.climb-up.fr',
        latitude: 43.6193,
        longitude: 1.4592,
      },
      {
        name: 'Club de Natation de Toulouse',
        category: 'sport',
        subcategory: 'natation',
        address: 'Piscine Nakache, 2 Rue Paul Mesple',
        postalCode: '31100',
        city: 'Toulouse',
        phone: '05 61 32 45 78',
        latitude: 43.5988,
        longitude: 1.4473,
      },
    ]

    let createdCount = 0

    for (const activity of testActivities) {
      // Check if already exists
      const existing = await prisma.activity.findFirst({
        where: {
          name: activity.name,
          city: activity.city,
        },
      })

      if (!existing) {
        await prisma.activity.create({
          data: activity,
        })
        createdCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `${createdCount} test activities created`,
      total: testActivities.length,
    })
  } catch (error) {
    console.error('Error seeding test data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed test data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
