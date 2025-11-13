'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import ActivitiesListModern from '@/components/ActivitiesListModern'

// Dynamic import for the map to avoid SSR issues
const ActivitiesMap = dynamic(() => import('@/components/ActivitiesMap'), {
  ssr: false,
  loading: () => <div className="map-sidebar__loading">Chargement de la carte...</div>
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
}

export default function ActivitesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/activities', {
        cache: 'no-store',
      })
      const data = await response.json()

      if (data.success) {
        setActivities(data.data)
        setFilteredActivities(data.data)
        setError(null)
      } else {
        setError('Failed to load activities')
      }
    } catch {
      setError('An error occurred while fetching activities')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleFilteredActivitiesChange = useCallback((filtered: Activity[]) => {
    setFilteredActivities(filtered)
  }, [])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  return (
    <main className="main-layout">
      <div className="main-layout__content">
        <ActivitiesListModern
          activities={activities}
          loading={loading}
          error={error}
          onRefreshActivities={fetchActivities}
          onFilteredActivitiesChange={handleFilteredActivitiesChange}
        />
      </div>

      {!loading && filteredActivities.length > 0 && (
        <aside className="main-layout__sidebar">
          <div className="map-sidebar">
            <ActivitiesMap
              activities={filteredActivities}
              scrollWheelZoom={true}
              dragging={true}
              touchZoom={true}
              doubleClickZoom={true}
            />
          </div>
        </aside>
      )}
    </main>
  )
}
