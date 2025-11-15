import type { Metadata } from 'next'
import Link from 'next/link'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Search, MessageCircle, Map, Filter, Smartphone, Sparkles, Clock, TrendingUp } from 'lucide-react'

export const metadata: Metadata = genMeta({
  title: 'ActivityAround - Trouvez des activités près de chez vous',
  description: 'Découvrez les activités sportives et intellectuelles près de chez vous. Recherchez parmi des centaines de clubs dans toute la France ou rejoignez notre future application de rencontres autour d\'activités communes.',
})

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* Hero Section - Modern with subtle gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              500+ activités à découvrir
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 animate-slide-up">
              Trouvez votre prochaine activité{' '}
              <span className="text-gradient-primary">près de chez vous</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-neutral-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Que vous cherchiez un club de sport, une association intellectuelle,
              ou des personnes partageant vos passions, nous avons ce qu&apos;il vous faut.
            </p>

            {/* CTA Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Primary CTA - Search Activities */}
              <Link href="/activites" className="group">
                <Card className="h-full border-2 border-primary-200 bg-white hover:border-primary-400 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1">
                  <CardHeader className="space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200">
                      <Search className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-neutral-900">
                      Recherche d&apos;activités
                    </CardTitle>
                    <CardDescription className="text-base text-neutral-600">
                      Explorez notre catalogue de clubs sportifs et intellectuels.
                      Carte interactive, filtres avancés, et infos détaillées.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white group">
                      Découvrir les activités
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              {/* Secondary CTA - Coming Soon */}
              <Card className="h-full border-2 border-neutral-200 bg-neutral-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-400 to-primary-500" />
                <CardHeader className="space-y-4">
                  <Badge variant="secondary" className="self-start bg-accent-100 text-accent-700 border-accent-200">
                    Bientôt disponible
                  </Badge>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center mx-auto">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-neutral-900">
                    Rencontres autour d&apos;activités
                  </CardTitle>
                  <CardDescription className="text-base text-neutral-600">
                    Trouvez des partenaires pour vos activités favorites.
                    Connectez-vous avec des passionnés près de chez vous.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" disabled>
                    Bientôt disponible
                    <Clock className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12 border-t border-neutral-200">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-sm sm:text-base text-neutral-600 font-medium">Activités recensées</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">20+</div>
              <div className="text-sm sm:text-base text-neutral-600 font-medium">Catégories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">100%</div>
              <div className="text-sm sm:text-base text-neutral-600 font-medium">Gratuit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Bento Grid */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              ✨ Fonctionnalités
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
              Pourquoi ActivityAround ?
            </h2>
            <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto">
              Tous les outils dont vous avez besoin pour trouver votre activité idéale près de chez vous
            </p>
          </div>

          {/* Bento Grid - Asymmetric Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Feature 1 - Map (Large - spans 2 columns on lg) */}
            <Card className="lg:col-span-2 border-0 bg-gradient-to-br from-primary-50 to-accent-50 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-200 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500" />
              <CardHeader className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Map className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl text-neutral-900 mb-3">
                  Carte interactive
                </CardTitle>
                <CardDescription className="text-base sm:text-lg text-neutral-700">
                  Visualisez toutes les activités sur une carte interactive.
                  Utilisez votre géolocalisation et trouvez les clubs les plus proches de chez vous en un coup d&apos;œil.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 - Search */}
            <Card className="border-0 bg-gradient-to-br from-accent-50 to-white shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-accent-200 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500" />
              <CardHeader className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Filter className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl text-neutral-900 mb-3">
                  Recherche avancée
                </CardTitle>
                <CardDescription className="text-base text-neutral-700">
                  Filtrez par catégorie, sous-catégorie, et distance pour trouver exactement ce que vous cherchez.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 - Responsive */}
            <Card className="border-0 bg-gradient-to-br from-primary-50 to-white shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
              <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-primary-200 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500" />
              <CardHeader className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Smartphone className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl text-neutral-900 mb-3">
                  100% Responsive
                </CardTitle>
                <CardDescription className="text-base text-neutral-700">
                  Accessible partout : sur mobile, tablette ou desktop. Votre recherche vous suit où que vous soyez.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 - Free (Large - spans 2 columns on lg) */}
            <Card className="lg:col-span-2 border-0 bg-gradient-to-br from-success-50 to-white shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
              <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-success-200 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500" />
              <CardHeader className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success-500 to-success-600 text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl text-neutral-900 mb-3">
                  100% Gratuit
                </CardTitle>
                <CardDescription className="text-base sm:text-lg text-neutral-700">
                  Pas d&apos;abonnement, pas de frais cachés, pas de limite.
                  Toutes nos fonctionnalités sont gratuites et le resteront toujours.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Refined */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900" />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />

        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500 rounded-full opacity-20 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center space-y-8">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Commencez gratuitement
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white max-w-3xl mx-auto leading-tight">
              Prêt à découvrir votre prochaine{' '}
              <span className="relative inline-block">
                <span className="relative z-10">passion</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-accent-400 opacity-30 -skew-y-1" />
              </span>
              {' '}?
            </h2>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              Rejoignez des centaines de personnes qui ont déjà trouvé leur activité idéale.
              Commencez votre recherche en quelques secondes.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Link href="/activites">
                <Button
                  size="lg"
                  className="group bg-white text-neutral-900 hover:bg-neutral-50 text-lg font-semibold px-10 py-7 h-auto rounded-xl shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105"
                >
                  Découvrir les activités
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {/* Trust indicator */}
              <p className="text-sm text-neutral-400 mt-6">
                500+ activités • 20+ catégories • 100% gratuit
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
