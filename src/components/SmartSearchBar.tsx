'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fuzzySearch } from '@/lib/fuzzySearch'
import { filterByDistance } from '@/lib/geolocation'
import LocationFilter, { LocationFilterState } from './LocationFilter'
import { useDynamicScraping } from '@/hooks/useDynamicScraping'

interface Activity {
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

interface SmartSearchBarProps {
  activities: Activity[]
  onSearch: (results: Activity[]) => void
  onSelectActivity?: (activity: Activity) => void
  onActivitiesUpdate?: () => void // Callback to refresh activities after scraping
}

export default function SmartSearchBar({
  activities,
  onSearch,
  onSelectActivity,
  onActivitiesUpdate
}: SmartSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [locationFilter, setLocationFilter] = useState<LocationFilterState>({
    cityName: '',
    coordinates: null,
    radiusKm: 10
  })
  const [showScrapeNotification, setShowScrapeNotification] = useState(false)
  const [pendingScrape, setPendingScrape] = useState(false) // Indique si un scraping est en attente
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const scrapeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Dynamic scraping hook
  const { scrapeLocation, isScrapingActive, scrapeError, lastScrapeResult, clearError } =
    useDynamicScraping()

  // Filtre géographique d'abord si applicable
  const geographicallyFilteredActivities = useMemo(() => {
    if (locationFilter.coordinates) {
      return filterByDistance(
        activities,
        locationFilter.coordinates.latitude,
        locationFilter.coordinates.longitude,
        locationFilter.radiusKm
      )
    }
    return activities
  }, [activities, locationFilter])

  // Recherche fuzzy avec mémoization sur les activités filtrées géographiquement
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return []

    return fuzzySearch<Activity>(
      geographicallyFilteredActivities,
      searchTerm,
      ['name', 'subcategory', 'address'],
      8
    )
  }, [geographicallyFilteredActivities, searchTerm])

  // Mise à jour des résultats de recherche
  useEffect(() => {
    if (searchTerm.trim()) {
      const results = searchResults.map((r) => r.item)
      onSearch(results)
    } else {
      // Si pas de terme de recherche mais filtre géographique actif
      onSearch(geographicallyFilteredActivities)
    }
  }, [searchResults, searchTerm, geographicallyFilteredActivities, onSearch])

  // Fonction pour lancer le scraping
  const triggerScraping = useCallback(
    async (filter: LocationFilterState) => {
      if (!filter.coordinates || !filter.cityName) return

      console.log(
        `[SmartSearchBar] Triggering scrape for ${filter.cityName} (${filter.radiusKm}km)`
      )

      setPendingScrape(false)

      const result = await scrapeLocation(
        filter.coordinates,
        filter.radiusKm,
        filter.cityName
      )

      if (result.success) {
        setShowScrapeNotification(true)
        // Refresh activities list
        if (onActivitiesUpdate) {
          await onActivitiesUpdate()
        }
        // Auto-hide notification after 5 seconds
        setTimeout(() => setShowScrapeNotification(false), 5000)
      }
    },
    [scrapeLocation, onActivitiesUpdate]
  )

  // Callback pour le changement de localisation SANS scraping automatique
  const handleLocationChange = useCallback(
    (filter: LocationFilterState) => {
      setLocationFilter(filter)

      // Annuler tout scraping en attente
      if (scrapeTimeoutRef.current) {
        clearTimeout(scrapeTimeoutRef.current)
        scrapeTimeoutRef.current = null
      }

      // Marquer qu'un scraping est disponible mais ne pas le lancer
      if (filter.coordinates && filter.cityName) {
        setPendingScrape(true)
      } else {
        setPendingScrape(false)
      }
    },
    []
  )

  // Bouton manuel pour lancer le scraping
  const handleManualScrape = useCallback(() => {
    if (locationFilter.coordinates && locationFilter.cityName) {
      triggerScraping(locationFilter)
    }
  }, [locationFilter, triggerScraping])

  // Reset l'index de sélection quand les résultats changent
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchResults])

  // Gestion du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused || searchResults.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
          break
        case 'Enter':
          e.preventDefault()
          if (searchResults[selectedIndex] && onSelectActivity) {
            onSelectActivity(searchResults[selectedIndex].item)
            setSearchTerm('')
            inputRef.current?.blur()
          }
          break
        case 'Escape':
          e.preventDefault()
          setSearchTerm('')
          inputRef.current?.blur()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFocused, searchResults, selectedIndex, onSelectActivity])

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClear = () => {
    setSearchTerm('')
    inputRef.current?.focus()
  }

  const handleSelectSuggestion = (activity: Activity) => {
    if (onSelectActivity) {
      onSelectActivity(activity)
    }
    setSearchTerm('')
    setIsFocused(false)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sport':
        return '⚽'
      case 'intellectual':
        return '🧠'
      default:
        return '🎯'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sport':
        return 'var(--color-primary)'
      case 'intellectual':
        return 'var(--color-secondary)'
      default:
        return 'var(--color-accent)'
    }
  }

  return (
    <div className="smart-search">
      <motion.div
        className="smart-search__container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Scraping notification */}
        <AnimatePresence>
          {isScrapingActive && (
            <motion.div
              className="smart-search__scraping-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="smart-search__scraping-content">
                <div className="smart-search__scraping-spinner" />
                <div>
                  <strong>Recherche en cours...</strong>
                  <p>
                    Nous scannons les activités autour de{' '}
                    <strong>{locationFilter.cityName}</strong> ({locationFilter.radiusKm} km)
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {showScrapeNotification && lastScrapeResult?.success && (
            <motion.div
              className="smart-search__success-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div>
                <strong>Recherche terminée !</strong>
                <p>
                  {lastScrapeResult.stats?.total || 0} activités trouvées (
                  {lastScrapeResult.stats?.created || 0} nouvelles,{' '}
                  {lastScrapeResult.stats?.updated || 0} mises à jour)
                </p>
              </div>
              <button
                className="smart-search__banner-close"
                onClick={() => setShowScrapeNotification(false)}
                aria-label="Fermer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </motion.div>
          )}

          {scrapeError && (
            <motion.div
              className="smart-search__error-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <strong>Erreur lors de la recherche</strong>
                <p>{scrapeError}</p>
              </div>
              <button
                className="smart-search__banner-close"
                onClick={clearError}
                aria-label="Fermer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtre géographique */}
        <LocationFilter onLocationChange={handleLocationChange} defaultRadius={10} />

        {/* Bouton pour lancer le scraping manuellement */}
        <AnimatePresence>
          {pendingScrape && !isScrapingActive && (
            <motion.button
              className="smart-search__scrape-button"
              onClick={handleManualScrape}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span>
                Rechercher des activités à <strong>{locationFilter.cityName}</strong> ({locationFilter.radiusKm} km)
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        <div
          className={`smart-search__input-wrapper ${
            isFocused ? 'smart-search__input-wrapper--focused' : ''
          }`}
        >
          <svg
            className="smart-search__icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            className="smart-search__input"
            placeholder="Recherchez une activité, sport, lieu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />

          <AnimatePresence>
            {searchTerm && (
              <motion.button
                className="smart-search__clear"
                onClick={handleClear}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isFocused && searchResults.length > 0 && (
            <motion.div
              ref={dropdownRef}
              className="smart-search__dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="smart-search__results">
                <div className="smart-search__results-header">
                  <span>
                    {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
                  </span>
                  <span className="smart-search__results-hint">
                    ↑↓ pour naviguer • ↵ pour sélectionner
                  </span>
                </div>

                {searchResults.map((result, index) => (
                  <motion.div
                    key={result.item.id}
                    className={`smart-search__suggestion ${
                      index === selectedIndex
                        ? 'smart-search__suggestion--selected'
                        : ''
                    }`}
                    onClick={() => handleSelectSuggestion(result.item)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    <div className="smart-search__suggestion-icon">
                      {getCategoryIcon(result.item.category)}
                    </div>

                    <div className="smart-search__suggestion-content">
                      <div className="smart-search__suggestion-title">
                        {result.item.name}
                      </div>
                      <div className="smart-search__suggestion-meta">
                        {result.item.subcategory && (
                          <span
                            className="smart-search__suggestion-category"
                            style={{
                              color: getCategoryColor(result.item.category)
                            }}
                          >
                            {result.item.subcategory}
                          </span>
                        )}
                        <span className="smart-search__suggestion-address">
                          {result.item.address.substring(0, 50)}
                          {result.item.address.length > 50 ? '...' : ''}
                        </span>
                      </div>
                    </div>

                    <svg
                      className="smart-search__suggestion-arrow"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                ))}
              </div>

              {searchTerm.length < 3 && (
                <div className="smart-search__hint">
                  Tapez au moins 3 caractères pour la recherche intelligente
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {isFocused && searchTerm && searchResults.length === 0 && (
          <motion.div
            className="smart-search__dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="smart-search__no-results">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <p>Aucun résultat trouvé</p>
              <span>Essayez avec d&apos;autres mots-clés</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
