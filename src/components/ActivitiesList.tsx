'use client'

import { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import ActivityCard from './ActivityCard'
import ActivityCardSkeleton from './ActivityCardSkeleton'
import CategoryFilter from './CategoryFilter'

// Dynamic import for the map to avoid SSR issues
const ActivitiesMap = dynamic(() => import('./ActivitiesMap'), {
  ssr: false,
  loading: () => <div className="text-center">Chargement de la carte...</div>
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

export default function ActivitiesList() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch('/api/activities')
        const data = await response.json()

        if (data.success) {
          setActivities(data.data)
        } else {
          setError('Failed to load activities')
        }
      } catch {
        setError('An error occurred while fetching activities')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  // Filter activities based on selected category
  const filteredActivities = useMemo(() => {
    if (activeCategory === 'all') {
      return activities
    }
    return activities.filter((activity) => activity.category === activeCategory)
  }, [activities, activeCategory])

  if (loading) {
    return (
      <div className="activities-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <ActivityCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="activities-grid">
        <p className="text-center text-error">{error}</p>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="activities-grid">
        <p className="text-center">
          Aucune activité disponible pour le moment. Lancez le scraping pour
          collecter des données !
        </p>
      </div>
    )
  }

  return (
    <>
      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="activities-stats">
        <p>
          {filteredActivities.length} activité{filteredActivities.length > 1 ? 's' : ''} trouvée{filteredActivities.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="activities-grid">
        {filteredActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>

      {filteredActivities.length > 0 && (
        <ActivitiesMap activities={filteredActivities} />
      )}
    </>
  )
}
