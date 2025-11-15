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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MapPin, Phone, Mail, Globe, ArrowLeft, ExternalLink, Navigation, ChevronRight, Tag } from 'lucide-react'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

async function getActivity(id: number) {
  const activity = await prisma.activity.findUnique({
    where: { id },
  })

  return activity
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id)

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
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id)

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
      <main className="bg-white">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-neutral-200 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-neutral-600">
              <Link href="/" className="hover:text-primary-600 transition-colors">
                Accueil
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/activites" className="hover:text-primary-600 transition-colors">
                Activités
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-neutral-900 font-medium truncate">{activity.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section - Modern gradient */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 border-b border-neutral-200">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full opacity-20 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* Back button */}
            <Link href="/activites">
              <Button variant="ghost" className="mb-6 text-neutral-700 hover:text-neutral-900 hover:bg-white/80">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux activités
              </Button>
            </Link>

            {/* Hero content */}
            <div className="max-w-4xl">
              {/* Category badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-primary-100 text-primary-700 border-primary-200 hover:bg-primary-200">
                  <Tag className="w-3 h-3 mr-1" />
                  {activity.category === 'sport' ? 'Sport' : 'Intellectuel'}
                </Badge>
                {activity.subcategory && (
                  <Badge variant="secondary" className="bg-accent-100 text-accent-700 border-accent-200">
                    {activity.subcategory}
                  </Badge>
                )}
                {activity.neighborhood && (
                  <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    {activity.neighborhood}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-6">
                {activity.name}
              </h1>

              {/* Location */}
              <div className="flex items-start gap-3 text-lg text-neutral-600">
                <MapPin className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">{activity.address}</p>
                  {activity.postalCode && (
                    <p className="text-base text-neutral-500">
                      {activity.postalCode} {activity.city}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content - 2 Column Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Info Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information Card */}
              <Card className="border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl text-neutral-900">
                    Coordonnées
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-neutral-900 mb-1">Adresse</h3>
                      <p className="text-neutral-700">{activity.address}</p>
                      {activity.postalCode && (
                        <p className="text-neutral-500 text-sm">
                          {activity.postalCode} {activity.city}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  {activity.phone && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-accent-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-neutral-900 mb-1">Téléphone</h3>
                        <a
                          href={`tel:${activity.phone}`}
                          className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                        >
                          {activity.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {activity.email && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-neutral-900 mb-1">Email</h3>
                        <a
                          href={`mailto:${activity.email}`}
                          className="text-primary-600 hover:text-primary-700 font-medium transition-colors break-all"
                        >
                          {activity.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Website */}
                  {activity.website && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-5 h-5 text-accent-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-neutral-900 mb-1">Site web</h3>
                        <a
                          href={activity.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 font-medium transition-colors inline-flex items-center gap-1 break-all"
                        >
                          Visiter le site web
                          <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Location Card */}
              {activity.latitude && activity.longitude && (
                <Card className="border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-2xl text-neutral-900 flex items-center gap-2">
                      <Navigation className="w-6 h-6 text-primary-600" />
                      Localisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-neutral-500">
                        Coordonnées GPS: {activity.latitude.toFixed(6)}, {activity.longitude.toFixed(6)}
                      </p>

                      {/* Map Placeholder */}
                      <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-12 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                          <MapPin className="w-8 h-8 text-neutral-400" />
                        </div>
                        <p className="text-neutral-600 font-medium mb-2">Carte interactive</p>
                        <p className="text-sm text-neutral-500 text-center">
                          Bientôt disponible sur cette page
                        </p>
                      </div>

                      {/* Google Maps Button */}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${activity.latitude},${activity.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button variant="outline" className="w-full" size="lg">
                          <Navigation className="w-4 h-4 mr-2" />
                          Voir sur Google Maps
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Sticky Quick Actions */}
            <div className="space-y-6">
              {/* Quick Actions Card */}
              <Card className="border-2 border-primary-200 shadow-sm sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg text-neutral-900">
                    Actions rapides
                  </CardTitle>
                  <p className="text-sm text-neutral-500">
                    Contactez cette activité directement
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activity.phone && (
                    <a href={`tel:${activity.phone}`} className="block">
                      <Button
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md transition-all"
                        size="lg"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Appeler
                      </Button>
                    </a>
                  )}

                  {activity.email && (
                    <a href={`mailto:${activity.email}`} className="block">
                      <Button
                        variant="outline"
                        className="w-full border-neutral-300 hover:bg-neutral-50 hover:border-primary-300 transition-all"
                        size="lg"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Envoyer un email
                      </Button>
                    </a>
                  )}

                  {activity.website && (
                    <a href={activity.website} target="_blank" rel="noopener noreferrer" className="block">
                      <Button
                        variant="outline"
                        className="w-full border-neutral-300 hover:bg-neutral-50 hover:border-primary-300 transition-all group"
                        size="lg"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Visiter le site
                        <ExternalLink className="w-3 h-3 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </a>
                  )}

                  {activity.latitude && activity.longitude && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${activity.latitude},${activity.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-accent-300 bg-accent-50/50 hover:bg-accent-50 hover:border-accent-400 text-accent-900 transition-all group"
                        size="lg"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Itinéraire
                        <ExternalLink className="w-3 h-3 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="border-neutral-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-neutral-900">
                    Informations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                    <span className="text-sm text-neutral-600">Catégorie</span>
                    <Badge className="bg-primary-100 text-primary-700 border-primary-200">
                      {activity.category === 'sport' ? 'Sport' : 'Intellectuel'}
                    </Badge>
                  </div>

                  {activity.subcategory && (
                    <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                      <span className="text-sm text-neutral-600">Type</span>
                      <Badge variant="secondary" className="bg-accent-100 text-accent-700 border-accent-200">
                        {activity.subcategory}
                      </Badge>
                    </div>
                  )}

                  {activity.neighborhood && (
                    <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                      <span className="text-sm text-neutral-600">Quartier</span>
                      <span className="text-sm font-medium text-neutral-900">{activity.neighborhood}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-neutral-600">Ville</span>
                    <span className="text-sm font-medium text-neutral-900">{activity.city}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Share CTA */}
              <Card className="border-neutral-200 bg-gradient-to-br from-neutral-50 to-white shadow-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-neutral-600 mb-4">
                      Cette activité vous intéresse ?
                    </p>
                    <Link href="/activites">
                      <Button variant="outline" className="w-full">
                        Découvrir d&apos;autres activités
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
