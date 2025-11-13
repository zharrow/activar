/**
 * Calcule la distance entre deux points géographiques avec la formule de Haversine
 * @param lat1 Latitude du point 1
 * @param lon1 Longitude du point 1
 * @param lat2 Latitude du point 2
 * @param lon2 Longitude du point 2
 * @returns Distance en kilomètres
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Rayon de la Terre en km
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export interface Coordinates {
  latitude: number
  longitude: number
}

/**
 * Base de données des principales villes autour de Toulouse
 * Source: données géographiques françaises
 */
export const TOULOUSE_AREA_CITIES: Record<string, Coordinates> = {
  // Toulouse et centre
  toulouse: { latitude: 43.6047, longitude: 1.4442 },

  // Nord de Toulouse
  'l\'union': { latitude: 43.6531, longitude: 1.4797 },
  'union': { latitude: 43.6531, longitude: 1.4797 },
  'castelnau-d\'estretefonds': { latitude: 43.7869, longitude: 1.3569 },
  'castelnau': { latitude: 43.7869, longitude: 1.3569 },
  'fenouillet': { latitude: 43.6786, longitude: 1.3936 },
  'gagnac-sur-garonne': { latitude: 43.6967, longitude: 1.3614 },
  'gagnac': { latitude: 43.6967, longitude: 1.3614 },
  'blagnac': { latitude: 43.6353, longitude: 1.3889 },
  'aucamville': { latitude: 43.6650, longitude: 1.4311 },
  'saint-jean': { latitude: 43.6622, longitude: 1.5053 },
  'castelginest': { latitude: 43.6911, longitude: 1.4350 },

  // Est de Toulouse
  'balma': { latitude: 43.6100, longitude: 1.4989 },
  'quint-fonsegrives': { latitude: 43.5808, longitude: 1.5236 },
  'quint': { latitude: 43.5808, longitude: 1.5236 },
  'l\'ayguesmortes': { latitude: 43.5964, longitude: 1.5403 },
  'pin-balma': { latitude: 43.6172, longitude: 1.5489 },
  'flourens': { latitude: 43.5936, longitude: 1.5658 },
  'saint-orens': { latitude: 43.5506, longitude: 1.5236 },
  'saint-orens-de-gameville': { latitude: 43.5506, longitude: 1.5236 },
  'labege': { latitude: 43.5406, longitude: 1.5153 },
  'escalquens': { latitude: 43.5194, longitude: 1.5619 },

  // Sud de Toulouse
  'ramonville': { latitude: 43.5464, longitude: 1.4828 },
  'ramonville-saint-agne': { latitude: 43.5464, longitude: 1.4828 },
  'castanet-tolosan': { latitude: 43.5144, longitude: 1.4989 },
  'castanet': { latitude: 43.5144, longitude: 1.4989 },
  'pechabou': { latitude: 43.5014, longitude: 1.5089 },
  'auzeville-tolosane': { latitude: 43.5278, longitude: 1.4889 },
  'auzeville': { latitude: 43.5278, longitude: 1.4889 },
  'pompertuzat': { latitude: 43.5017, longitude: 1.5189 },
  'vigoulet-auzil': { latitude: 43.4847, longitude: 1.4578 },
  'portet-sur-garonne': { latitude: 43.5236, longitude: 1.4094 },
  'portet': { latitude: 43.5236, longitude: 1.4094 },
  'roques': { latitude: 43.4969, longitude: 1.3575 },
  'muret': { latitude: 43.4631, longitude: 1.3264 },

  // Ouest de Toulouse
  'colomiers': { latitude: 43.6108, longitude: 1.3344 },
  'tournefeuille': { latitude: 43.5858, longitude: 1.3436 },
  'cugnaux': { latitude: 43.5372, longitude: 1.3453 },
  'plaisance-du-touch': { latitude: 43.5642, longitude: 1.2986 },
  'plaisance': { latitude: 43.5642, longitude: 1.2986 },
  'fonsorbes': { latitude: 43.5406, longitude: 1.2356 },
  'leguevin': { latitude: 43.5989, longitude: 1.2328 },
  'pibrac': { latitude: 43.6203, longitude: 1.2861 },
  'cornebarrieu': { latitude: 43.6519, longitude: 1.3275 },
  'mondonville': { latitude: 43.6739, longitude: 1.2856 },
  'aussonne': { latitude: 43.6833, longitude: 1.3150 },

  // Sud-Ouest
  'seysses': { latitude: 43.4992, longitude: 1.3103 },
  'frouzins': { latitude: 43.5219, longitude: 1.3278 },
  'villeneuve-tolosane': { latitude: 43.5267, longitude: 1.3444 },
  'villeneuve': { latitude: 43.5267, longitude: 1.3444 },

  // Villes importantes autour (> 20km)
  'montauban': { latitude: 44.0178, longitude: 1.3556 },
  'albi': { latitude: 43.9289, longitude: 2.1478 },
  'castres': { latitude: 43.6056, longitude: 2.2400 },
  'auch': { latitude: 43.6458, longitude: 0.5861 },
  'tarbes': { latitude: 43.2333, longitude: 0.0781 },
  'foix': { latitude: 42.9650, longitude: 1.6053 },
  'pamiers': { latitude: 43.1167, longitude: 1.6097 },
  'saint-gaudens': { latitude: 43.1083, longitude: 0.7239 },
  'saint-girons': { latitude: 42.9836, longitude: 1.1456 },
}

/**
 * Normalise le nom d'une ville pour la recherche
 */
export function normalizeCityName(cityName: string): string {
  return cityName
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Retire les accents
    .replace(/\s+/g, '-') // Remplace espaces par tirets
}

/**
 * Recherche les coordonnées d'une ville
 * Retourne null si la ville n'est pas trouvée
 */
export function getCityCoordinates(cityName: string): Coordinates | null {
  const normalized = normalizeCityName(cityName)

  // Recherche exacte
  if (TOULOUSE_AREA_CITIES[normalized]) {
    return TOULOUSE_AREA_CITIES[normalized]
  }

  // Recherche partielle (commence par)
  for (const [city, coords] of Object.entries(TOULOUSE_AREA_CITIES)) {
    if (city.startsWith(normalized) || normalized.startsWith(city)) {
      return coords
    }
  }

  return null
}

/**
 * Recherche les villes correspondant à un terme de recherche
 * Retourne un tableau de suggestions
 */
export function searchCities(searchTerm: string, maxResults: number = 5): string[] {
  if (!searchTerm.trim() || searchTerm.length < 2) {
    return []
  }

  const normalized = normalizeCityName(searchTerm)
  const results: string[] = []

  // Recherche dans la base de villes
  for (const city of Object.keys(TOULOUSE_AREA_CITIES)) {
    if (city.includes(normalized) || normalized.includes(city)) {
      // Formatte le nom pour l'affichage
      const displayName = city
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-')
        .replace("L'", "L'")
        .replace("D'", "d'")

      if (!results.includes(displayName)) {
        results.push(displayName)
      }

      if (results.length >= maxResults) {
        break
      }
    }
  }

  return results
}

/**
 * Filtre les activités par distance géographique
 */
export function filterByDistance<T extends { latitude?: number | null; longitude?: number | null }>(
  items: T[],
  centerLat: number,
  centerLon: number,
  radiusKm: number
): T[] {
  return items.filter((item) => {
    if (!item.latitude || !item.longitude) {
      return false // Exclut les activités sans coordonnées
    }

    const distance = calculateDistance(
      centerLat,
      centerLon,
      item.latitude,
      item.longitude
    )

    return distance <= radiusKm
  })
}
