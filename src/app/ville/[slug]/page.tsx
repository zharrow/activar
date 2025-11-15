import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Search, TrendingUp, Users } from 'lucide-react';
import { cities, getCityBySlug } from '@/data/cities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CityPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all cities
 */
export async function generateStaticParams() {
  return cities.map((city) => ({
    slug: city.slug,
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    return {
      title: 'Ville non trouvée',
    };
  }

  return {
    title: `Activités à ${city.name} - Sports & Intellectuel | ActivityAround`,
    description: `Découvrez les clubs de sport et activités intellectuelles à ${city.name}. Carte interactive, recherche par distance, géolocalisation. ${city.description.slice(0, 100)}...`,
    keywords: city.keywords.join(', '),
    openGraph: {
      title: `Activités à ${city.name} - Sports & Intellectuel`,
      description: city.description,
      type: 'website',
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Activités à ${city.name}`,
      description: city.description,
    },
  };
}

/**
 * City landing page
 */
export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  // CollectionPage JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Activités à ${city.name}`,
    description: city.description,
    about: {
      '@type': 'Place',
      name: city.name,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: city.latitude,
        longitude: city.longitude,
      },
      address: {
        '@type': 'PostalAddress',
        addressRegion: city.region,
        addressCountry: 'FR',
      },
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Accueil',
          item: process.env.NEXT_PUBLIC_BASE_URL || 'https://activityaround.vercel.app',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Villes',
          item: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://activityaround.vercel.app'}/activites`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: city.name,
          item: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://activityaround.vercel.app'}/ville/${city.slug}`,
        },
      ],
    },
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-neutral-600 hover:text-primary-600 transition-colors">
                Accueil
              </Link>
            </li>
            <li className="text-neutral-400">/</li>
            <li>
              <Link href="/activites" className="text-neutral-600 hover:text-primary-600 transition-colors">
                Villes
              </Link>
            </li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-900 font-medium">{city.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        {/* Decorative blur orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Region Badge */}
          <Badge variant="outline" className="mb-4 border-primary-200 text-primary-700 bg-primary-50/50">
            <MapPin className="w-3 h-3 mr-1" />
            {city.region}
          </Badge>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            Activités à <span className="text-gradient-primary">{city.name}</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            {city.description}
          </p>

          {/* CTA */}
          <Link href={`/activites?city=${city.slug}`}>
            <Button size="lg" className="text-lg px-8 shadow-lg hover:shadow-xl transition-shadow">
              <Search className="w-5 h-5 mr-2" />
              Rechercher des activités
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Population */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gradient-primary mb-1">{city.population}</p>
              <p className="text-neutral-600">habitants</p>
            </div>

            {/* Region */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 mb-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-neutral-900 mb-1">{city.region}</p>
              <p className="text-neutral-600">région</p>
            </div>

            {/* Activities */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gradient-primary mb-1">100+</p>
              <p className="text-neutral-600">activités disponibles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Pourquoi chercher des activités à {city.name} ?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Découvrez tous les avantages de notre plateforme pour trouver l'activité parfaite près de chez vous.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Sports */}
            <Card className="card-hover border-primary-100">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Activités sportives</CardTitle>
                <CardDescription className="text-base">
                  Football, tennis, échecs, arts martiaux, yoga... Trouvez tous les clubs de sport à {city.name}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/activites?city=${city.slug}&category=sport`}>
                  <Button variant="outline" className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Voir les sports
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Intellectual */}
            <Card className="card-hover border-accent-100">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Activités intellectuelles</CardTitle>
                <CardDescription className="text-base">
                  Échecs, lecture, débat, philosophie... Explorez les clubs et associations intellectuelles à {city.name}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/activites?city=${city.slug}&category=intellectual`}>
                  <Button variant="outline" className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Voir les activités intellectuelles
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à découvrir {city.name} ?
          </h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Explorez toutes les activités disponibles et trouvez celle qui vous correspond.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/activites?city=${city.slug}`}>
              <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100">
                <Search className="w-5 h-5 mr-2" />
                Rechercher des activités
              </Button>
            </Link>
            <Link href="/activites">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <MapPin className="w-5 h-5 mr-2" />
                Voir toutes les villes
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
