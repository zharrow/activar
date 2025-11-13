/**
 * Calcule la distance de Levenshtein entre deux chaînes
 * Permet de mesurer la similarité et tolérer les fautes de frappe
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length
  const matrix: number[][] = []

  // Initialisation de la matrice
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j
  }

  // Calcul des distances
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Suppression
        matrix[i][j - 1] + 1, // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      )
    }
  }

  return matrix[len1][len2]
}

/**
 * Normalise une chaîne pour la recherche (lowercase, trim, accents)
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Retire les accents
}

/**
 * Vérifie si une chaîne contient une sous-chaîne avec tolérance stricte
 * RÉDUCTION DE LA PERMISSIVITÉ: maxErrors réduit et pas de fuzzy sur sous-chaînes
 */
export function fuzzyMatch(
  searchTerm: string,
  targetString: string
): boolean {
  const normalizedSearch = normalizeString(searchTerm)
  const normalizedTarget = normalizeString(targetString)

  // Recherche exacte d'abord (inclusion)
  if (normalizedTarget.includes(normalizedSearch)) {
    return true
  }

  // Si la recherche est trop courte, pas de fuzzy match
  if (normalizedSearch.length < 4) {
    return false
  }

  // Découpe le target en mots
  const words = normalizedTarget.split(/\s+/)

  // Vérifie chaque mot avec une tolérance minimale
  for (const word of words) {
    // Correspondance au début du mot (sans erreur)
    if (word.startsWith(normalizedSearch)) {
      return true
    }

    // Fuzzy match uniquement pour les mots de longueur très similaire
    // ET avec une tolérance maximale basée sur la longueur du terme
    const allowedErrors = normalizedSearch.length >= 6 ? 1 : 0

    if (Math.abs(word.length - normalizedSearch.length) <= allowedErrors) {
      const distance = levenshteinDistance(normalizedSearch, word)
      if (distance <= allowedErrors) {
        return true
      }
    }
  }

  return false
}

/**
 * Score de pertinence pour le tri des résultats (plus bas = plus pertinent)
 */
export function calculateRelevanceScore(
  searchTerm: string,
  targetString: string
): number {
  const normalizedSearch = normalizeString(searchTerm)
  const normalizedTarget = normalizeString(targetString)

  // Correspondance exacte au début = meilleur score
  if (normalizedTarget.startsWith(normalizedSearch)) {
    return 0
  }

  // Correspondance exacte n'importe où
  if (normalizedTarget.includes(normalizedSearch)) {
    return 1
  }

  // Calcul de la distance minimum avec les mots
  const words = normalizedTarget.split(/\s+/)
  let minDistance = Infinity

  for (const word of words) {
    if (word.startsWith(normalizedSearch.substring(0, normalizedSearch.length - 1))) {
      minDistance = Math.min(minDistance, 2)
    }

    const distance = levenshteinDistance(normalizedSearch, word)
    minDistance = Math.min(minDistance, distance + 2)

    // Sous-chaînes
    for (let i = 0; i <= word.length - normalizedSearch.length; i++) {
      const substring = word.substring(i, i + normalizedSearch.length)
      const subDistance = levenshteinDistance(normalizedSearch, substring)
      minDistance = Math.min(minDistance, subDistance + 1)
    }
  }

  return minDistance
}

export interface SearchResult<T> {
  item: T
  score: number
  matchedField: string
}

/**
 * Recherche fuzzy dans un tableau d'objets
 */
export function fuzzySearch<T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
  maxResults: number = 10
): SearchResult<T>[] {
  if (!searchTerm.trim()) {
    return []
  }

  const results: SearchResult<T>[] = []

  for (const item of items) {
    let bestScore = Infinity
    let matchedField = ''

    for (const field of searchFields) {
      const value = item[field]
      if (typeof value !== 'string') continue

      if (fuzzyMatch(searchTerm, value)) {
        const score = calculateRelevanceScore(searchTerm, value)
        if (score < bestScore) {
          bestScore = score
          matchedField = String(field)
        }
      }
    }

    if (bestScore !== Infinity) {
      results.push({
        item,
        score: bestScore,
        matchedField
      })
    }
  }

  // Tri par pertinence et limitation des résultats
  return results.sort((a, b) => a.score - b.score).slice(0, maxResults)
}

/**
 * Highlight des parties correspondantes dans le texte
 */
export function highlightMatch(text: string, searchTerm: string): string {
  const normalizedText = normalizeString(text)
  const normalizedSearch = normalizeString(searchTerm)

  // Recherche exacte
  const index = normalizedText.indexOf(normalizedSearch)
  if (index !== -1) {
    return (
      text.substring(0, index) +
      '<mark>' +
      text.substring(index, index + searchTerm.length) +
      '</mark>' +
      text.substring(index + searchTerm.length)
    )
  }

  return text
}
