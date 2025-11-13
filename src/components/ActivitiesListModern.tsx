'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ActivityCardModern from './ActivityCardModern'
import ActivityCardSkeleton from './ActivityCardSkeleton'
import SmartSearchBar from './SmartSearchBar'

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

interface ActivitiesListModernProps {
  activities: Activity[]
  loading: boolean
  error: string | null
  onRefreshActivities?: () => void // Callback to refresh activities
  onFilteredActivitiesChange?: (filtered: Activity[]) => void // Callback when filters change
}

export default function ActivitiesListModern({
  activities,
  loading,
  error,
  onRefreshActivities,
  onFilteredActivitiesChange
}: ActivitiesListModernProps) {
  const router = useRouter()
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(activities)

  const handleSearch = (results: Activity[]) => {
    setFilteredActivities(results)
    // Notify parent component of filtered activities change
    if (onFilteredActivitiesChange) {
      onFilteredActivitiesChange(results)
    }
  }

  const handleSelectActivity = (activity: Activity) => {
    router.push(`/activity/${activity.id}`)
  }

  if (loading) {
    return (
      <div className="grid-container">
        <div className="grid-content">
          <div className="activities-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <ActivityCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid-container">
        <div className="grid-content">
          <div className="text-center text-error">
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="grid-container">
        <div className="grid-content">
          <div className="text-center">
            <p>
              Aucune activité disponible pour le moment. Lancez le scraping pour
              collecter des données !
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid-container">
      <div className="grid-content">
        <SmartSearchBar
          activities={activities}
          onSearch={handleSearch}
          onSelectActivity={handleSelectActivity}
          onActivitiesUpdate={onRefreshActivities}
        />

        <div className="activities-stats">
          <p>
            {filteredActivities.length} activité
            {filteredActivities.length > 1 ? 's' : ''} trouvée
            {filteredActivities.length > 1 ? 's' : ''}
          </p>
        </div>

        {filteredActivities.length > 0 ? (
          <div className="activities-list-modern">
            {filteredActivities.map((activity, index) => (
              <ActivityCardModern
                key={activity.id}
                activity={activity}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center" style={{ padding: '4rem 0' }}>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>
              Aucun résultat ne correspond à votre recherche
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
