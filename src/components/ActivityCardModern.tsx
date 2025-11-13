'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

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

interface ActivityCardModernProps {
  activity: Activity
  index: number
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

export default function ActivityCardModern({
  activity,
  index
}: ActivityCardModernProps) {
  const [isHovered, setIsHovered] = useState(false)
  const slug = generateSlug(activity.name)
  const activityUrl = `/activity/${activity.id}/${slug}`

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
    <motion.div
      className="activity-card-modern"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={activityUrl} className="activity-card-modern__link">
        <div className="activity-card-modern__number">
          {String(index + 1).padStart(2, '0')}
        </div>

        <div className="activity-card-modern__header">
          <div className="activity-card-modern__title-group">
            <h3 className="activity-card-modern__title">{activity.name}</h3>
            {activity.subcategory && (
              <motion.span
                className="activity-card-modern__category"
                style={{
                  backgroundColor: getCategoryColor(activity.category)
                }}
                animate={{
                  scale: isHovered ? 1.05 : 1
                }}
                transition={{ duration: 0.2 }}
              >
                {activity.subcategory}
              </motion.span>
            )}
          </div>
        </div>

        <div className="activity-card-modern__content">
          <div className="activity-card-modern__info-item">
            <svg
              className="activity-card-modern__icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="activity-card-modern__text">{activity.address}</span>
          </div>

          <div className="activity-card-modern__meta">
            {activity.phone && (
              <div className="activity-card-modern__meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>Téléphone</span>
              </div>
            )}
            {activity.website && (
              <div className="activity-card-modern__meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>Site web</span>
              </div>
            )}
            {activity.latitude && activity.longitude && (
              <div className="activity-card-modern__meta-item activity-card-modern__meta-item--accent">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>Sur la carte</span>
              </div>
            )}
          </div>
        </div>

        <motion.div
          className="activity-card-modern__arrow"
          animate={{
            x: isHovered ? 5 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.div>

        <motion.div
          className="activity-card-modern__bg"
          style={{
            backgroundColor: getCategoryColor(activity.category)
          }}
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.4 }}
        />
      </Link>
    </motion.div>
  )
}
