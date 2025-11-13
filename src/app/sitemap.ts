import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

const neighborhoods = [
  'capitole',
  'carmes',
  'saint-cyprien',
  'compans-caffarelli',
  'borderouge',
  'rangueil',
  'minimes',
  'arnaud-bernard',
  'jolimont',
  'empalot',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://activityaround.vercel.app'

  // Get all activities from database
  const activities = await prisma.activity.findMany({
    select: {
      id: true,
      name: true,
      updatedAt: true,
    },
  })

  // Generate activity URLs
  const activityUrls = activities.map((activity) => ({
    url: `${baseUrl}/activity/${activity.id}/${generateSlug(activity.name)}`,
    lastModified: activity.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Category pages
  const categoryPages = [
    {
      url: `${baseUrl}/sport`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/intellectuel`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  // Neighborhood pages
  const neighborhoodPages = neighborhoods.map((neighborhood) => ({
    url: `${baseUrl}/quartier/${neighborhood}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
  ]

  return [...staticPages, ...categoryPages, ...neighborhoodPages, ...activityUrls]
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}
