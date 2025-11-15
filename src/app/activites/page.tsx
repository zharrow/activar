'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Search, MapPin, Loader2, AlertCircle, Navigation, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import CategorySelect from '@/components/CategorySelect'
import CityInput from '@/components/CityInput'
import ActivityCardShadcn from '@/components/ActivityCardShadcn'
import { useGeolocation } from '@/hooks/useGeolocation'

// Dynamic import for the map to avoid SSR issues
const ActivitiesMap = dynamic(() => import('@/components/ActivitiesMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-neutral-50 rounded-xl">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
    </div>
  )
})

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
  neighborhood?: string | null
  city?: string | null
  distance?: number
}

export default function ActivitesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Geolocation
  const { coordinates, error: geoError, loading: geoLoading, requestLocation, permissionState } = useGeolocation()
  const [showGeoBanner, setShowGeoBanner] = useState(true)
  const [distance, setDistance] = useState([10]) // Default 10km
  const [userCity, setUserCity] = useState('')
  const [userCoordinates, setUserCoordinates] = useState<{ latitude: number; longitude: number } | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  // Sync geolocation hook coordinates with local state
  useEffect(() => {
    if (coordinates) {
      setUserCoordinates(coordinates)
      setShowGeoBanner(false)
    }
  }, [coordinates])

  // Fetch activities near user location
  const fetchNearbyActivities = useCallback(async () => {
    if (!userCoordinates) {
      setError('Veuillez autoriser la géolocalisation ou saisir une ville')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        lat: userCoordinates.latitude.toString(),
        lng: userCoordinates.longitude.toString(),
        distance: distance[0].toString(),
        ...(selectedCategory && selectedCategory !== 'all' ? { category: selectedCategory } : {}),
      })

      const response = await fetch(`/api/activities/nearby?${params}`, {
        cache: 'no-store',
      })
      const data = await response.json()

      if (data.success) {
        setActivities(data.data)
        setFilteredActivities(data.data)
      } else {
        setError(data.error || 'Erreur lors du chargement des activités')
      }
    } catch {
      setError('Une erreur est survenue lors de la recherche')
    } finally {
      setLoading(false)
    }
  }, [userCoordinates, distance, selectedCategory])

  // Handle manual city selection
  const handleCitySelect = (coords: { latitude: number; longitude: number }) => {
    setUserCoordinates(coords)
    setShowGeoBanner(false)
  }

  // Handle geolocation request
  const handleRequestGeolocation = () => {
    requestLocation()
  }

  // Apply search filter (category already filtered in API)
  useEffect(() => {
    let filtered = activities

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(activity =>
        activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.subcategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.city?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredActivities(filtered)
  }, [activities, searchQuery])

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setUserCity('')
    setUserCoordinates(null)
    setShowGeoBanner(true)
  }

  const hasActiveFilters = searchQuery || selectedCategory || userCoordinates

  return (
    <main className="bg-white">
      {/* Geolocation Banner */}
      {showGeoBanner && permissionState !== 'granted' && (
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Navigation className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm sm:text-base">
                  Autorisez la géolocalisation pour trouver des activités près de chez vous
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleRequestGeolocation}
                  disabled={geoLoading}
                  size="sm"
                  className="bg-white text-primary-600 hover:bg-neutral-100"
                >
                  {geoLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    'Autoriser'
                  )}
                </Button>
                <Button
                  onClick={() => setShowGeoBanner(false)}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {geoError && (
              <p className="text-sm text-white/90 mt-2">
                {geoError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
              Trouvez des activités près de chez vous
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              Utilisez votre géolocalisation ou saisissez une ville pour découvrir les clubs et associations autour de vous
            </p>

            {/* Geolocation Controls */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  Votre localisation
                </CardTitle>
                <CardDescription>
                  Choisissez votre méthode de localisation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Geolocation Button */}
                  <Button
                    onClick={handleRequestGeolocation}
                    disabled={geoLoading}
                    variant={userCoordinates && coordinates ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {geoLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Localisation...
                      </>
                    ) : userCoordinates && coordinates ? (
                      <>
                        <Navigation className="w-4 h-4 mr-2" />
                        Position actuelle
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4 mr-2" />
                        Utiliser ma position
                      </>
                    )}
                  </Button>

                  {/* Manual City Input */}
                  <div className="flex-1">
                    <CityInput
                      value={userCity}
                      onChange={setUserCity}
                      onCitySelect={handleCitySelect}
                    />
                  </div>
                </div>

                {/* Distance Slider */}
                {userCoordinates && (
                  <div className="pt-4 border-t border-neutral-200">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-neutral-700">
                        Rayon de recherche
                      </label>
                      <Badge variant="secondary" className="text-sm">
                        {distance[0]} km
                      </Badge>
                    </div>
                    <Slider
                      value={distance}
                      onValueChange={setDistance}
                      min={5}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-neutral-500 mt-2">
                      <span>5 km</span>
                      <span>100 km</span>
                    </div>
                  </div>
                )}

                {/* Search Button */}
                {userCoordinates && (
                  <Button
                    onClick={fetchNearbyActivities}
                    disabled={loading}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Recherche en cours...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Rechercher autour de moi
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Search Bar (for filtering results) */}
            {activities.length > 0 && (
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Filtrer les résultats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-base bg-white border-neutral-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      {(activities.length > 0 || loading || error || (userCoordinates && !loading)) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Header */}
          {activities.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <CategorySelect
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              />

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  Nouvelle recherche
                </Button>
              )}

              <div className="ml-auto text-sm text-neutral-600">
                {filteredActivities.length} activité{filteredActivities.length > 1 ? 's' : ''} trouvée{filteredActivities.length > 1 ? 's' : ''}
              </div>
            </div>
          )}

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Activities List */}
          <div className="space-y-6">
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                <p className="text-neutral-600">Chargement des activités...</p>
              </div>
            )}

            {error && (
              <Card className="p-8 text-center border-error-200 bg-error-50">
                <AlertCircle className="w-12 h-12 text-error-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Une erreur est survenue
                </h3>
                <p className="text-neutral-600 mb-4">{error}</p>
                <Button onClick={fetchNearbyActivities} variant="outline">
                  Réessayer
                </Button>
              </Card>
            )}

            {!loading && !error && filteredActivities.length === 0 && activities.length === 0 && (
              <Card className="p-12 text-center border-neutral-200">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Aucune activité dans cette zone
                </h3>
                <p className="text-neutral-600 mb-4">
                  Il n'y a pas d'activités enregistrées dans un rayon de <strong>{distance[0]} km</strong> autour de votre position.
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-neutral-500">
                    Suggestions :
                  </p>
                  <div className="flex flex-col gap-2 text-sm text-neutral-600">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      <span>Augmentez le rayon de recherche (actuellement {distance[0]} km)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      <span>Essayez une grande ville (Paris, Lyon, Toulouse...)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      <span>Changez de catégorie d'activités</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {!loading && !error && filteredActivities.length === 0 && activities.length > 0 && (
              <Card className="p-12 text-center border-neutral-200">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Aucun résultat pour votre recherche
                </h3>
                <p className="text-neutral-600 mb-6">
                  Aucune activité ne correspond à <strong>"{searchQuery}"</strong> parmi les {activities.length} activités trouvées.
                </p>
                <Button onClick={() => setSearchQuery('')} variant="outline">
                  Effacer la recherche
                </Button>
              </Card>
            )}

            {!loading && !error && filteredActivities.length > 0 && (
              <div className="space-y-4">
                {filteredActivities.map((activity, index) => (
                  <div key={activity.id} className="relative">
                    <ActivityCardShadcn activity={activity} index={index} />
                    {activity.distance !== undefined && (
                      <Badge
                        variant="secondary"
                        className="absolute top-4 right-4 bg-primary-100 text-primary-700 border-primary-200"
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        {activity.distance} km
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map - Sticky */}
          <div className="hidden lg:block">
            <div className="sticky top-20 h-[calc(100vh-8rem)]">
              {!loading && filteredActivities.length > 0 ? (
                <div className="h-full rounded-xl overflow-hidden border border-neutral-200 shadow-sm">
                  <ActivitiesMap
                    activities={filteredActivities}
                    scrollWheelZoom={true}
                    dragging={true}
                    touchZoom={true}
                    doubleClickZoom={true}
                    userCoordinates={userCoordinates}
                  />
                </div>
              ) : (
                <Card className="h-full flex flex-col items-center justify-center bg-neutral-50 border-neutral-200">
                  <MapPin className="w-16 h-16 text-neutral-300 mb-4" />
                  <p className="text-neutral-500">
                    La carte s&apos;affichera ici
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
        </div>
      )}
    </main>
  )
}
