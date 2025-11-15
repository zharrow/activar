'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { generateSlug } from '@/lib/seo'

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

interface ActivitiesMapProps {
  activities: Activity[]
  center?: [number, number]
  zoom?: number
  scrollWheelZoom?: boolean
  dragging?: boolean
  touchZoom?: boolean
  doubleClickZoom?: boolean
  boxZoom?: boolean
  keyboard?: boolean
  userCoordinates?: { latitude: number; longitude: number } | null
}

// Fix for default marker icons in Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Custom icon for user location (blue marker)
const userLocationIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = defaultIcon

export default function ActivitiesMap({
  activities,
  center = [43.6047, 1.4442], // Default center (France center)
  zoom = 13,
  scrollWheelZoom = false,
  dragging = false,
  touchZoom = false,
  doubleClickZoom = false,
  boxZoom = false,
  keyboard = false,
  userCoordinates = null
}: ActivitiesMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const userMarkerRef = useRef<L.Marker | null>(null)

  // Determine initial center based on user coordinates or activities
  const getInitialCenter = (): [number, number] => {
    if (userCoordinates) {
      return [userCoordinates.latitude, userCoordinates.longitude]
    }

    // If activities exist, calculate center from them
    const validActivities = activities.filter(
      (activity) => activity.latitude && activity.longitude
    )

    if (validActivities.length > 0) {
      const avgLat = validActivities.reduce((sum, a) => sum + (a.latitude || 0), 0) / validActivities.length
      const avgLng = validActivities.reduce((sum, a) => sum + (a.longitude || 0), 0) / validActivities.length
      return [avgLat, avgLng]
    }

    return center
  }

  useEffect(() => {
    // Initialize map only once
    if (!mapContainerRef.current || mapRef.current) return

    const initialCenter = getInitialCenter()
    const map = L.map(mapContainerRef.current, {
      scrollWheelZoom,
      dragging,
      touchZoom,
      doubleClickZoom,
      boxZoom,
      keyboard,
      zoomControl: dragging // Only show zoom controls if dragging is enabled
    }).setView(initialCenter, zoom)
    mapRef.current = map

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map)

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [center, zoom, scrollWheelZoom, dragging, touchZoom, doubleClickZoom, boxZoom, keyboard])

  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing markers (except user marker)
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer !== userMarkerRef.current) {
        mapRef.current?.removeLayer(layer)
      }
    })

    // Add markers for activities with coordinates
    const validActivities = activities.filter(
      (activity) => activity.latitude && activity.longitude
    )

    if (validActivities.length === 0) return

    const bounds = L.latLngBounds([])

    // Add user location to bounds if available
    if (userCoordinates) {
      bounds.extend([userCoordinates.latitude, userCoordinates.longitude])
    }

    validActivities.forEach((activity) => {
      if (!activity.latitude || !activity.longitude) return

      const marker = L.marker([activity.latitude, activity.longitude]).addTo(
        mapRef.current!
      )

      // Create popup content
      const slug = generateSlug(activity.name)
      const popupContent = `
        <div class="map-popup">
          <h3 class="map-popup__title">${activity.name}</h3>
          ${
            activity.subcategory
              ? `<span class="map-popup__category">${activity.subcategory}</span>`
              : ''
          }
          <p class="map-popup__address">${activity.address}</p>
          ${
            activity.phone
              ? `<p class="map-popup__contact">📞 ${activity.phone}</p>`
              : ''
          }
          ${
            activity.website
              ? `<p class="map-popup__contact">🌐 <a href="${activity.website}" target="_blank" rel="noopener noreferrer">Site web</a></p>`
              : ''
          }
          <a href="/activity/${activity.id}/${slug}" class="map-popup__link">Voir les détails →</a>
        </div>
      `

      marker.bindPopup(popupContent)
      bounds.extend([activity.latitude, activity.longitude])
    })

    // Fit map to show all markers
    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [activities, userCoordinates])

  // Separate effect for user location marker
  useEffect(() => {
    if (!mapRef.current) return

    // Remove existing user marker
    if (userMarkerRef.current) {
      mapRef.current.removeLayer(userMarkerRef.current)
      userMarkerRef.current = null
    }

    // Add user location marker if coordinates are available
    if (userCoordinates) {
      const userMarker = L.marker(
        [userCoordinates.latitude, userCoordinates.longitude],
        { icon: userLocationIcon }
      ).addTo(mapRef.current)

      userMarker.bindPopup(`
        <div class="map-popup">
          <h3 class="map-popup__title">📍 Votre position</h3>
          <p class="map-popup__address">Centre de recherche</p>
        </div>
      `)

      userMarkerRef.current = userMarker

      // Recenter map on user location
      mapRef.current.setView([userCoordinates.latitude, userCoordinates.longitude], zoom)
    }
  }, [userCoordinates, zoom])

  return (
    <div className="activities-map">
      <div ref={mapContainerRef} className="activities-map__container" />
    </div>
  )
}
