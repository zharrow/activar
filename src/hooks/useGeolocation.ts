import { useState, useEffect } from 'react'

export interface GeolocationCoordinates {
  latitude: number
  longitude: number
}

export interface GeolocationState {
  coordinates: GeolocationCoordinates | null
  error: string | null
  loading: boolean
  permissionState: 'prompt' | 'granted' | 'denied' | null
}

export interface UseGeolocationReturn extends GeolocationState {
  requestLocation: () => void
  clearError: () => void
}

/**
 * Custom hook to manage browser geolocation
 * Handles permission states, loading, errors, and coordinates
 */
export function useGeolocation(): UseGeolocationReturn {
  const [coordinates, setCoordinates] = useState<GeolocationCoordinates | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | null>(null)

  // Check if geolocation is supported
  const isGeolocationSupported = typeof window !== 'undefined' && 'geolocation' in navigator

  // Check permission state on mount (if supported)
  useEffect(() => {
    if (!isGeolocationSupported) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur')
      return
    }

    // Check permission state using Permissions API (if available)
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionState(result.state as 'prompt' | 'granted' | 'denied')

        // Listen for permission changes
        result.addEventListener('change', () => {
          setPermissionState(result.state as 'prompt' | 'granted' | 'denied')
        })
      }).catch(() => {
        // Permissions API not fully supported, fallback to prompt
        setPermissionState('prompt')
      })
    } else {
      setPermissionState('prompt')
    }
  }, [isGeolocationSupported])

  /**
   * Request user's geolocation
   */
  const requestLocation = () => {
    if (!isGeolocationSupported) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLoading(false)
        setPermissionState('granted')
      },
      // Error callback
      (error) => {
        let errorMessage = 'Une erreur est survenue lors de la récupération de votre position'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Vous avez refusé l\'accès à votre position'
            setPermissionState('denied')
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Votre position est actuellement indisponible'
            break
          case error.TIMEOUT:
            errorMessage = 'La demande de géolocalisation a expiré'
            break
        }

        setError(errorMessage)
        setLoading(false)
      },
      // Options
      {
        enableHighAccuracy: false,
        timeout: 10000, // 10 seconds
        maximumAge: 300000, // 5 minutes cache
      }
    )
  }

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null)
  }

  return {
    coordinates,
    error,
    loading,
    permissionState,
    requestLocation,
    clearError,
  }
}
