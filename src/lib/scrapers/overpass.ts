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

export async function scrapeOverpassAPI(): Promise<OverpassActivity[]> {
  const query = `
    [out:json][timeout:25];
    area["name"="Toulouse"]["admin_level"="8"]->.searchArea;
    (
      node["sport"](area.searchArea);
      way["sport"](area.searchArea);
      node["leisure"~"sports_centre|fitness_centre|fitness_station"](area.searchArea);
      way["leisure"~"sports_centre|fitness_centre"](area.searchArea);
      node["club"~"sport"](area.searchArea);
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
        city: tags['addr:city'] || 'Toulouse',
        phone: tags.phone,
        email: tags.email,
        website: tags.website || tags['contact:website'],
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      }

      activities.push(activity)
    })

    console.log(`[Overpass] Scraped ${activities.length} activities`)
    return activities
  } catch (error) {
    console.error('[Overpass] Scraping error:', error)
    return []
  }
}
