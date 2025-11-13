'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { searchCities, getCityCoordinates, Coordinates } from '@/lib/geolocation'

export interface LocationFilterState {
  cityName: string
  coordinates: Coordinates | null
  radiusKm: number
}

interface LocationFilterProps {
  onLocationChange: (filter: LocationFilterState) => void
  defaultRadius?: number
}

export default function LocationFilter({
  onLocationChange,
  defaultRadius = 10
}: LocationFilterProps) {
  const [cityInput, setCityInput] = useState('')
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [radiusKm, setRadiusKm] = useState(defaultRadius)
  const [citySuggestions, setCitySuggestions] = useState<string[]>([])
  const [isCityFocused, setIsCityFocused] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0)

  const cityInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Recherche de suggestions de villes
  useEffect(() => {
    if (cityInput.trim().length >= 2) {
      const suggestions = searchCities(cityInput, 8)
      setCitySuggestions(suggestions)
      setSelectedSuggestionIndex(0)
    } else {
      setCitySuggestions([])
    }
  }, [cityInput])

  // Émission des changements de filtre
  useEffect(() => {
    if (selectedCity) {
      const coords = getCityCoordinates(selectedCity)
      onLocationChange({
        cityName: selectedCity,
        coordinates: coords,
        radiusKm
      })
    } else {
      onLocationChange({
        cityName: '',
        coordinates: null,
        radiusKm
      })
    }
  }, [selectedCity, radiusKm, onLocationChange])

  // Gestion du clavier pour les suggestions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isCityFocused || citySuggestions.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedSuggestionIndex((prev) =>
            prev < citySuggestions.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0))
          break
        case 'Enter':
          e.preventDefault()
          if (citySuggestions[selectedSuggestionIndex]) {
            handleSelectCity(citySuggestions[selectedSuggestionIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          setCityInput('')
          setIsCityFocused(false)
          cityInputRef.current?.blur()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCityFocused, citySuggestions, selectedSuggestionIndex])

  // Fermer les suggestions au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        cityInputRef.current &&
        !cityInputRef.current.contains(e.target as Node)
      ) {
        setIsCityFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectCity = (city: string) => {
    setSelectedCity(city)
    setCityInput(city)
    setCitySuggestions([])
    setIsCityFocused(false)
  }

  const handleClearCity = () => {
    setCityInput('')
    setSelectedCity(null)
    setCitySuggestions([])
    cityInputRef.current?.focus()
  }

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadiusKm(Number(e.target.value))
  }

  return (
    <div className="location-filter">
      <div className="location-filter__city-search">
        <label htmlFor="city-input" className="location-filter__label">
          <svg
            className="location-filter__label-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Localisation
        </label>

        <div className="location-filter__input-wrapper">
          <input
            ref={cityInputRef}
            id="city-input"
            type="text"
            className={`location-filter__input ${
              selectedCity ? 'location-filter__input--has-value' : ''
            }`}
            placeholder="Toulouse, Blagnac, Colomiers..."
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onFocus={() => setIsCityFocused(true)}
          />

          {cityInput && (
            <button
              type="button"
              className="location-filter__clear"
              onClick={handleClearCity}
              aria-label="Effacer la ville"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <AnimatePresence>
          {isCityFocused && citySuggestions.length > 0 && (
            <motion.div
              ref={suggestionsRef}
              className="location-filter__suggestions"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {citySuggestions.map((city, index) => (
                <motion.button
                  key={city}
                  type="button"
                  className={`location-filter__suggestion ${
                    index === selectedSuggestionIndex
                      ? 'location-filter__suggestion--selected'
                      : ''
                  }`}
                  onClick={() => handleSelectCity(city)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1, delay: index * 0.02 }}
                >
                  <svg
                    className="location-filter__suggestion-icon"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {city}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedCity && (
          <motion.div
            className="location-filter__radius"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <label htmlFor="radius-slider" className="location-filter__radius-label">
              <span>Rayon de recherche</span>
              <span className="location-filter__radius-value">{radiusKm} km</span>
            </label>

            <div className="location-filter__slider-wrapper">
              <input
                id="radius-slider"
                type="range"
                min="1"
                max="50"
                step="1"
                value={radiusKm}
                onChange={handleRadiusChange}
                className="location-filter__slider"
                style={{
                  background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${
                    ((radiusKm - 1) / 49) * 100
                  }%, var(--color-grey-light) ${((radiusKm - 1) / 49) * 100}%, var(--color-grey-light) 100%)`
                }}
              />

              <div className="location-filter__slider-labels">
                <span>1 km</span>
                <span>25 km</span>
                <span>50 km</span>
              </div>
            </div>

            <p className="location-filter__help-text">
              Recherche les activités dans un rayon de <strong>{radiusKm} km</strong> autour de{' '}
              <strong>{selectedCity}</strong>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
