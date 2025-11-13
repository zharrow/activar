import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import {
  generateMetadata as genMeta,
  generateActivityJsonLd,
  generateBreadcrumbJsonLd,
  generateSlug,
  baseUrl
} from '@/lib/seo'

interface PageProps {
  params: {
    id: string
  }
}

async function getActivity(id: number) {
  const activity = await prisma.activity.findUnique({
    where: { id },
  })

  return activity
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const id = parseInt(params.id)

  if (isNaN(id)) {
    return {}
  }

  const activity = await getActivity(id)

  if (!activity) {
    return {}
  }

  const slug = generateSlug(activity.name)
  const url = `${baseUrl}/activity/${activity.id}/${slug}`
  const title = `${activity.name} - ${activity.subcategory || activity.category} à ${activity.city}`
  const description = `Découvrez ${activity.name}, ${activity.subcategory?.toLowerCase() || activity.category.toLowerCase()} à ${activity.city}. ${activity.address}. ${activity.phone ? `Téléphone: ${activity.phone}` : ''}`

  const keywords = [
    activity.name,
    activity.subcategory || activity.category,
    `${activity.subcategory || activity.category} ${activity.city}`,
    `${activity.subcategory || activity.category} Toulouse`,
    activity.city,
    'club',
    'association',
    'activité',
  ]

  return genMeta({
    title,
    description,
    url,
    keywords,
    type: 'article',
    modifiedTime: activity.updatedAt.toISOString(),
  })
}

export default async function ActivityPage({ params }: PageProps) {
  const id = parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const activity = await getActivity(id)

  if (!activity) {
    notFound()
  }

  const slug = generateSlug(activity.name)
  const activityJsonLd = generateActivityJsonLd(activity)
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Accueil', url: baseUrl },
    {
      name: activity.name,
      url: `${baseUrl}/activity/${activity.id}/${slug}`,
    },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(activityJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="main">
        <div className="container">
        <Link href="/" className="back-link">
          ← Retour aux activités
        </Link>

        <div className="activity-detail">
          <div className="activity-detail__header">
            <h1>{activity.name}</h1>
            {activity.subcategory && (
              <span className="badge">{activity.subcategory}</span>
            )}
          </div>

          <div className="activity-detail__content">
            <section className="activity-detail__section">
              <h2>Informations</h2>

              <div className="info-list">
                <div className="info-item">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    <strong>Adresse</strong>
                    <p>{activity.address}</p>
                    {activity.postalCode && <p>{activity.postalCode} {activity.city}</p>}
                  </div>
                </div>

                {activity.phone && (
                  <div className="info-item">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <div>
                      <strong>Téléphone</strong>
                      <p>
                        <a href={`tel:${activity.phone}`}>{activity.phone}</a>
                      </p>
                    </div>
                  </div>
                )}

                {activity.email && (
                  <div className="info-item">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <div>
                      <strong>Email</strong>
                      <p>
                        <a href={`mailto:${activity.email}`}>{activity.email}</a>
                      </p>
                    </div>
                  </div>
                )}

                {activity.website && (
                  <div className="info-item">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <div>
                      <strong>Site web</strong>
                      <p>
                        <a href={activity.website} target="_blank" rel="noopener noreferrer">
                          Visiter le site
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {activity.latitude && activity.longitude && (
              <section className="activity-detail__section">
                <h2>Localisation</h2>
                <p className="text-secondary">
                  Coordonnées: {activity.latitude.toFixed(4)}, {activity.longitude.toFixed(4)}
                </p>
                <p className="text-sm text-secondary">
                  La carte interactive sera bientôt disponible avec Leaflet.js
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
    </>
  )
}
