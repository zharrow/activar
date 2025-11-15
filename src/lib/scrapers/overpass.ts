export interface OverpassActivity {
  name: string
  category: string
  subcategory?: string
  address: string
  postalCode?: string
  city: string
  phone?: string
  email?: string
  website?: string
  latitude: number
  longitude: number
}

export async function scrapeOverpassAPI(
  latitude: number = 43.6047,
  longitude: number = 1.4442,
  cityName: string = 'Toulouse'
): Promise<OverpassActivity[]> {
  // Search radius: 20km around city center
  const radiusKm = 20000 // in meters

  const query = `
    [out:json][timeout:25];
    (
      node["sport"](around:${radiusKm},${latitude},${longitude});
      way["sport"](around:${radiusKm},${latitude},${longitude});
      node["leisure"~"sports_centre|fitness_centre|fitness_station"](around:${radiusKm},${latitude},${longitude});
      way["leisure"~"sports_centre|fitness_centre"](around:${radiusKm},${latitude},${longitude});
      node["club"~"sport"](around:${radiusKm},${latitude},${longitude});
    );
    out center;
    >;
    out skel qt;
  `

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'data=' + encodeURIComponent(query),
    })

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.statusText}`)
    }

    const data = await response.json()
    const activities: OverpassActivity[] = []

    data.elements?.forEach((element: any) => {
      const tags = element.tags || {}

      // Skip if no name
      if (!tags.name) return

      const lat = element.lat || element.center?.lat
      const lon = element.lon || element.center?.lon

      if (!lat || !lon) return

      const activity: OverpassActivity = {
        name: tags.name,
        category: 'sport',
        subcategory: tags.sport || tags.leisure || 'autre',
        address: tags['addr:street']
          ? `${tags['addr:housenumber'] || ''} ${tags['addr:street']}`.trim()
          : 'Adresse non spécifiée',
        postalCode: tags['addr:postcode'],
        city: tags['addr:city'] || cityName,
        phone: tags.phone,
        email: tags.email,
        website: tags.website || tags['contact:website'],
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      }

      activities.push(activity)
    })

    console.log(`[Overpass] Scraped ${activities.length} activities from ${cityName}`)
    return activities
  } catch (error) {
    console.error(`[Overpass] Scraping error for ${cityName}:`, error)
    return []
  }
}
