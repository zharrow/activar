import { OverpassActivity } from './overpass'

export async function scrapeGooglePlaces(): Promise<OverpassActivity[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    console.warn('[Google Places] API key not configured, skipping')
    return []
  }

  const categories = [
    'dojo toulouse',
    'club echecs toulouse',
    'club football toulouse',
    'club basket toulouse',
    'club tennis toulouse',
    'club rugby toulouse',
    'salle escalade toulouse',
    'club natation toulouse',
    'club yoga toulouse',
    'club danse toulouse',
  ]

  const activities: OverpassActivity[] = []

  try {
    for (const category of categories) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          category
        )}&key=${apiKey}`
      )

      if (!response.ok) {
        console.error(`[Google Places] Error for "${category}":`, response.statusText)
        continue
      }

      const data = await response.json()

      if (data.status !== 'OK') {
        console.warn(`[Google Places] Status ${data.status} for "${category}"`)
        continue
      }

      data.results?.forEach((place: any) => {
        const activity: OverpassActivity = {
          name: place.name,
          category: 'sport',
          subcategory: category.split(' ')[1], // Extract sport type
          address: place.formatted_address || 'Adresse non spécifiée',
          postalCode: undefined,
          city: 'Toulouse',
          phone: undefined,
          email: undefined,
          website: undefined,
          latitude: place.geometry?.location?.lat,
          longitude: place.geometry?.location?.lng,
        }

        activities.push(activity)
      })

      // Respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    console.log(`[Google Places] Scraped ${activities.length} activities`)
    return activities
  } catch (error) {
    console.error('[Google Places] Scraping error:', error)
    return []
  }
}
