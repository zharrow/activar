import Link from 'next/link'
import { generateSlug } from '@/lib/seo'

interface Activity {
  id: number
  name: string
  category: string
  subcategory?: string | null
  address: string
}

interface RelatedActivitiesProps {
  activities: Activity[]
  title?: string
}

export default function RelatedActivities({
  activities,
  title = 'Activités similaires',
}: RelatedActivitiesProps) {
  if (activities.length === 0) return null

  return (
    <section className="related-activities">
      <h2 className="related-activities__title">{title}</h2>
      <div className="related-activities__grid">
        {activities.map((activity) => {
          const slug = generateSlug(activity.name)
          const url = `/activity/${activity.id}/${slug}`

          return (
            <Link key={activity.id} href={url} className="related-activities__card">
              <div className="related-activities__card-header">
                <h3 className="related-activities__card-title">{activity.name}</h3>
                {activity.subcategory && (
                  <span className="related-activities__card-badge">
                    {activity.subcategory}
                  </span>
                )}
              </div>
              <p className="related-activities__card-address">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {activity.address}
              </p>
              <span className="related-activities__card-link" aria-hidden="true">
                Voir les détails →
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
