import { OverpassActivity } from './overpass'

interface ScrapeOptions {
  latitude?: number
  longitude?: number
  cityName?: string
  radiusKm?: number
}

export async function scrapeSerpApi(options: ScrapeOptions = {}): Promise<OverpassActivity[]> {
  const apiKey = process.env.SERPAPI_KEY

  if (!apiKey) {
    console.warn('[SerpApi] API key not configured, skipping')
    return []
  }

  // Use provided location or default to Toulouse
  const { latitude, longitude, cityName = 'Toulouse', radiusKm = 10 } = options
  const locationQuery = cityName || 'Toulouse'

  console.log(`[SerpApi] Scraping for location: ${locationQuery} (radius: ${radiusKm}km)`)

  const queries = [
    { query: `club echecs ${locationQuery}`, subcategory: 'echecs', category: 'intellectual' },
    { query: `club football ${locationQuery}`, subcategory: 'football', category: 'sport' },
    { query: `club basketball ${locationQuery}`, subcategory: 'basketball', category: 'sport' },
    { query: `club tennis ${locationQuery}`, subcategory: 'tennis', category: 'sport' },
    { query: `club rugby ${locationQuery}`, subcategory: 'rugby', category: 'sport' },
    { query: `salle escalade ${locationQuery}`, subcategory: 'escalade', category: 'sport' },
    { query: `piscine ${locationQuery}`, subcategory: 'natation', category: 'sport' },
    { query: `club natation ${locationQuery}`, subcategory: 'natation', category: 'sport' },
    { query: `club yoga ${locationQuery}`, subcategory: 'yoga', category: 'sport' },
    { query: `club danse ${locationQuery}`, subcategory: 'danse', category: 'sport' },
    { query: `dojo ${locationQuery}`, subcategory: 'arts_martiaux', category: 'sport' },
    { query: `salle musculation ${locationQuery}`, subcategory: 'musculation', category: 'sport' },
    { query: `salle fitness ${locationQuery}`, subcategory: 'fitness', category: 'sport' },
    { query: `club athletisme ${locationQuery}`, subcategory: 'athletisme', category: 'sport' },
    { query: `club cyclisme ${locationQuery}`, subcategory: 'cyclisme', category: 'sport' },
    { query: `club volley ${locationQuery}`, subcategory: 'volleyball', category: 'sport' },
    { query: `club handball ${locationQuery}`, subcategory: 'handball', category: 'sport' },
    { query: `gymnase ${locationQuery}`, subcategory: 'gymnase', category: 'sport' },
    { query: `stade ${locationQuery}`, subcategory: 'stade', category: 'sport' },
    { query: `club badminton ${locationQuery}`, subcategory: 'badminton', category: 'sport' },
  ]

  const activities: OverpassActivity[] = []

  try {
    for (const searchQuery of queries) {
      console.log(`[SerpApi] Searching: ${searchQuery.query}`)

      const url = new URL('https://serpapi.com/search')
      url.searchParams.append('engine', 'google_maps')
      url.searchParams.append('q', searchQuery.query)
      url.searchParams.append('type', 'search')

      // Add coordinates if provided for more precise results
      if (latitude && longitude) {
        url.searchParams.append('ll', `@${latitude},${longitude},${radiusKm * 1000}m`)
      }

      url.searchParams.append('api_key', apiKey)

      const response = await fetch(url.toString())

      if (!response.ok) {
        console.error(`[SerpApi] Error for "${searchQuery.query}":`, response.statusText)
        continue
      }

      const data = await response.json()

      if (data.error) {
        console.error(`[SerpApi] API Error:`, data.error)
        continue
      }

      // Parse local results
      const results = data.local_results || []

      for (const result of results) {
        if (!result.title || !result.gps_coordinates) {
          continue
        }

        const activity: OverpassActivity = {
          name: result.title,
          category: searchQuery.category,
          subcategory: searchQuery.subcategory,
          address: result.address || 'Adresse non spécifiée',
          postalCode: extractPostalCode(result.address),
          city: cityName || extractCity(result.address) || 'Non spécifié',
          phone: result.phone,
          email: undefined,
          website: result.website,
          latitude: result.gps_coordinates.latitude,
          longitude: result.gps_coordinates.longitude,
        }

        activities.push(activity)
      }

      // Respect rate limits (SerpApi recommends not overwhelming their servers)
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    console.log(`[SerpApi] Scraped ${activities.length} activities`)
    return activities
  } catch (error) {
    console.error('[SerpApi] Scraping error:', error)
    return []
  }
}

// Helper function to extract postal code from address
function extractPostalCode(address?: string): string | undefined {
  if (!address) return undefined

  // Match French postal codes (5 digits)
  const match = address.match(/\b(\d{5})\b/)
  return match ? match[1] : undefined
}

// Helper function to extract city name from address
function extractCity(address?: string): string | undefined {
  if (!address) return undefined

  // Try to extract city name (usually after postal code)
  const parts = address.split(',')
  if (parts.length >= 2) {
    // Usually city is in the last part or second to last
    const cityPart = parts[parts.length - 1].trim()
    // Remove postal code if present
    const withoutPostal = cityPart.replace(/\b\d{5}\b/, '').trim()
    return withoutPostal || cityPart
  }

  return undefined
}
