'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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

L.Marker.prototype.options.icon = defaultIcon

export default function ActivitiesMap({
  activities,
  center = [43.6047, 1.4442], // Toulouse center
  zoom = 13,
  scrollWheelZoom = false,
  dragging = false,
  touchZoom = false,
  doubleClickZoom = false,
  boxZoom = false,
  keyboard = false
}: ActivitiesMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize map only once
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, {
      scrollWheelZoom,
      dragging,
      touchZoom,
      doubleClickZoom,
      boxZoom,
      keyboard,
      zoomControl: dragging // Only show zoom controls if dragging is enabled
    }).setView(center, zoom)
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
  }, [center, zoom])

  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer)
      }
    })

    // Add markers for activities with coordinates
    const validActivities = activities.filter(
      (activity) => activity.latitude && activity.longitude
    )

    if (validActivities.length === 0) return

    const bounds = L.latLngBounds([])

    validActivities.forEach((activity) => {
      if (!activity.latitude || !activity.longitude) return

      const marker = L.marker([activity.latitude, activity.longitude]).addTo(
        mapRef.current!
      )

      // Create popup content
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
          <a href="/activity/${activity.id}" class="map-popup__link">Voir les détails →</a>
        </div>
      `

      marker.bindPopup(popupContent)
      bounds.extend([activity.latitude, activity.longitude])
    })

    // Fit map to show all markers
    if (validActivities.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [activities])

  return (
    <div className="activities-map">
      <div ref={mapContainerRef} className="activities-map__container" />
    </div>
  )
}
