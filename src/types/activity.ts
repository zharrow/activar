/**
 * Type definitions for Activity entities
 * Centralized type system to avoid duplication across the codebase
 */

/**
 * Complete Activity type matching Prisma schema
 * Use this for full activity data from database
 */
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
  neighborhood?: string | null
  description?: string | null
  schedule?: any // JSONB type
  openingHours?: any // JSONB type
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Basic Activity type for UI components
 * Use this when only basic fields are needed (cards, lists, etc.)
 */
export interface ActivityBasic {
  id: number
  name: string
  category: string
  subcategory?: string | null
  address: string
  phone?: string | null
  website?: string | null
  latitude?: number | null
  longitude?: number | null
}

/**
 * Activity with location data
 * Use this for map components and geographic filtering
 */
export interface ActivityWithLocation extends ActivityBasic {
  latitude: number
  longitude: number
}

/**
 * Activity for SEO/metadata generation
 * Includes all fields needed for structured data
 */
export interface ActivityForSEO {
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
}

/**
 * Activity category types
 */
export type ActivityCategory = 'sport' | 'intellectual'

/**
 * Common subcategories for sports
 */
export const SPORT_SUBCATEGORIES = [
  'Football',
  'Basketball',
  'Tennis',
  'Arts martiaux',
  'Yoga',
  'Danse',
  'Natation',
  'Rugby',
  'Athlétisme',
  'Cyclisme',
] as const

/**
 * Common subcategories for intellectual activities
 */
export const INTELLECTUAL_SUBCATEGORIES = [
  'Échecs',
  'Jeux de société',
  'Lecture',
  'Débats',
  'Langues',
  'Bridge',
  'Musique',
  'Arts plastiques',
] as const

/**
 * Type guard to check if coordinates are valid
 */
export function hasValidCoordinates(
  activity: ActivityBasic
): activity is ActivityWithLocation {
  return (
    activity.latitude !== null &&
    activity.latitude !== undefined &&
    activity.longitude !== null &&
    activity.longitude !== undefined
  )
}

/**
 * Helper to get category color
 */
export function getCategoryColor(category: string): string {
  switch (category) {
    case 'sport':
      return 'var(--color-primary)'
    case 'intellectual':
      return 'var(--color-secondary)'
    default:
      return 'var(--color-accent)'
  }
}

/**
 * Helper to get category icon
 */
export function getCategoryIcon(category: string): string {
  switch (category) {
    case 'sport':
      return '⚽'
    case 'intellectual':
      return '🧠'
    default:
      return '🎯'
  }
}
