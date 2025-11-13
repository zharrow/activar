import { Metadata } from 'next'

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://activityaround.vercel.app'

export interface SEOConfig {
  title: string
  description: string
  url?: string
  image?: string
  type?: 'website' | 'article'
  keywords?: string[]
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    url = baseUrl,
    image = `${baseUrl}/og-image.jpg`,
    type = 'website',
    keywords = [],
    author = 'ActivityAround',
    publishedTime,
    modifiedTime,
  } = config

  const fullTitle = title.includes('ActivityAround') ? title : `${title} | ActivityAround`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    creator: author,
    publisher: 'ActivityAround',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: 'ActivityAround - Activités à Toulouse',
      locale: 'fr_FR',
        images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@ActivityAround',
      site: '@ActivityAround',
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .slice(0, 100) // Limit length
}

export interface OpeningHours {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

export interface Review {
  id: number
  authorName: string
  rating: number
  comment: string
  createdAt: Date
}

export interface Activity {
  id: number
  name: string
  category: string
  subcategory?: string | null
  address: string
  postalCode?: string | null
  city: string
  phone?: string | null
  email?: string | null
  website?: string | null
  latitude?: number | null
  longitude?: number | null
  description?: string | null
  openingHours?: any
  neighborhood?: string | null
}

export function generateActivityJsonLd(
  activity: Activity,
  reviews?: Review[]
) {
  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : undefined

  const baseSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/activity/${activity.id}/${generateSlug(activity.name)}`,
    name: activity.name,
    description: activity.description || `${activity.name} - ${activity.subcategory || activity.category} à ${activity.city}`,
    url: activity.website || `${baseUrl}/activity/${activity.id}/${generateSlug(activity.name)}`,
    telephone: activity.phone,
    email: activity.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: activity.address,
      addressLocality: activity.city,
      postalCode: activity.postalCode,
      addressCountry: 'FR',
    },
    areaServed: {
      '@type': 'City',
      name: 'Toulouse',
    },
    priceRange: '$$',
  }

  // Add geo coordinates if available
  if (activity.latitude && activity.longitude) {
    baseSchema.geo = {
      '@type': 'GeoCoordinates',
      latitude: activity.latitude,
      longitude: activity.longitude,
    }
  }

  // Add opening hours if available
  if (activity.openingHours) {
    baseSchema.openingHoursSpecification = generateOpeningHoursSchema(activity.openingHours)
  }

  // Add aggregate rating if reviews exist
  if (reviews && reviews.length > 0) {
    baseSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating!.toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return baseSchema
}

function generateOpeningHoursSchema(openingHours: any) {
  const dayMap: { [key: string]: string } = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  }

  return Object.entries(openingHours)
    .filter(([_, hours]) => hours)
    .map(([day, hours]) => {
      const timeRange = String(hours).split('-')
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayMap[day],
        opens: timeRange[0]?.trim() || '09:00',
        closes: timeRange[1]?.trim() || '18:00',
      }
    })
}

export function generateReviewsJsonLd(activity: Activity, reviews: Review[]) {
  if (reviews.length === 0) return null

  return reviews.map((review) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'LocalBusiness',
      name: activity.name,
    },
    author: {
      '@type': 'Person',
      name: review.authorName,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: review.comment,
    datePublished: review.createdAt.toISOString(),
  }))
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ActivityAround',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Découvrez toutes les activités sportives et intellectuelles à Toulouse',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Toulouse',
      addressCountry: 'FR',
    },
    sameAs: [
      // Add social media links when available
    ],
  }
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export const defaultKeywords = [
  'activités Toulouse',
  'sport Toulouse',
  'activités intellectuelles Toulouse',
  'clubs sportifs Toulouse',
  'associations Toulouse',
  'loisirs Toulouse',
  'échecs Toulouse',
  'arts martiaux Toulouse',
  'football Toulouse',
  'basket Toulouse',
  'yoga Toulouse',
  'danse Toulouse',
]

export interface FAQItem {
  question: string
  answer: string
}

export function generateFAQJsonLd(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
