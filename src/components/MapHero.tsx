'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

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

interface MapHeroProps {
  activities: Activity[]
}

// Dynamic import for the map to avoid SSR issues
const ActivitiesMap = dynamic(() => import('./ActivitiesMap'), {
  ssr: false,
  loading: () => (
    <div className="map-hero__loading">
      <div className="map-hero__spinner"></div>
    </div>
  )
})

export default function MapHero({ activities }: MapHeroProps) {
  return (
    <section className="map-hero">
      <div className="map-hero__map-container">
        <ActivitiesMap
          activities={activities}
          zoom={12}
          scrollWheelZoom={false}
          dragging={false}
          touchZoom={false}
          doubleClickZoom={false}
          boxZoom={false}
          keyboard={false}
        />
      </div>

      <div className="map-hero__overlay">
        <div className="grid-container">
          <div className="grid-content">
            <motion.div
              className="map-hero__content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.h1
                className="map-hero__title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Activités à Toulouse
              </motion.h1>
              <motion.p
                className="map-hero__subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                Découvrez tous les clubs sportifs et intellectuels de Toulouse
                sur une carte interactive
              </motion.p>
              <motion.div
                className="map-hero__stats"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <div className="map-hero__stat">
                  <span className="map-hero__stat-number">
                    {activities.length}
                  </span>
                  <span className="map-hero__stat-label">Activités</span>
                </div>
                <div className="map-hero__stat">
                  <span className="map-hero__stat-number">
                    {
                      activities.filter(
                        (a) => a.latitude && a.longitude
                      ).length
                    }
                  </span>
                  <span className="map-hero__stat-label">Localisées</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="map-hero__scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <span>Explorez</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
