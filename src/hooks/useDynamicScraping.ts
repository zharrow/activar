import { useState, useCallback } from 'react'
import { Coordinates } from '@/lib/geolocation'

export interface ScrapeResult {
  success: boolean
  stats?: {
    total: number
    created: number
    updated: number
    sources: {
      overpass: number
      googlePlaces: number
    }
  }
  error?: string
  duration?: string
}

export function useDynamicScraping() {
  const [isScrapingActive, setIsScrapingActive] = useState(false)
  const [scrapeError, setScrapeError] = useState<string | null>(null)
  const [lastScrapeResult, setLastScrapeResult] = useState<ScrapeResult | null>(null)

  /**
   * Trigger scraping for a specific location
   */
  const scrapeLocation = useCallback(
    async (
      coordinates: Coordinates,
      radiusKm: number,
      cityName: string
    ): Promise<ScrapeResult> => {
      setIsScrapingActive(true)
      setScrapeError(null)

      try {
        const response = await fetch('/api/scrape-location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            radiusKm,
            cityName,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Scraping failed')
        }

        setLastScrapeResult(data)
        setIsScrapingActive(false)

        return data
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred'
        setScrapeError(errorMessage)
        setIsScrapingActive(false)

        return {
          success: false,
          error: errorMessage,
        }
      }
    },
    []
  )

  const clearError = useCallback(() => {
    setScrapeError(null)
  }, [])

  return {
    scrapeLocation,
    isScrapingActive,
    scrapeError,
    lastScrapeResult,
    clearError,
  }
}
