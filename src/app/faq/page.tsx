import type { Metadata } from 'next'
import Link from 'next/link'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { HelpCircle, ArrowRight, BookOpen, Sparkles } from 'lucide-react'

export const metadata: Metadata = genMeta({
  title: 'FAQ - Questions fréquentes | ActivityAround',
  description: 'Toutes les réponses à vos questions sur ActivityAround : comment trouver une activité, comment s\'inscrire, quelles activités sont disponibles à Toulouse.',
})

const faqItems = [
  {
    question: 'Quelles activités sportives peut-on trouver à Toulouse ?',
    answer: 'Toulouse propose une grande variété d\'activités sportives : football, rugby, basketball, tennis, natation, arts martiaux (karaté, judo, taekwondo), escalade, yoga, fitness, danse, et bien plus encore. Notre plateforme recense plus de 500 clubs et associations sportives répartis dans tous les quartiers de Toulouse.'
  },
  {
    question: 'Comment trouver un club d\'échecs ou une activité intellectuelle à Toulouse ?',
    answer: 'ActivityAround répertorie toutes les activités intellectuelles à Toulouse : clubs d\'échecs, associations de bridge, clubs de go, ateliers d\'écriture, clubs de débat, et bien d\'autres. Utilisez nos filtres par catégorie ou explorez la carte interactive pour trouver l\'activité près de chez vous.'
  },
  {
    question: 'Est-ce que ActivityAround est gratuit ?',
    answer: 'Oui ! ActivityAround est 100% gratuit. Vous pouvez explorer toutes les activités, utiliser la carte interactive, et accéder à toutes nos fonctionnalités sans aucun abonnement ni frais cachés.'
  },
  {
    question: 'Comment rechercher une activité dans un quartier spécifique ?',
    answer: 'Utilisez notre filtre par quartier sur la page de recherche, ou explorez directement la carte interactive. Vous pouvez zoomer sur votre quartier et voir toutes les activités disponibles à proximité. Chaque activité affiche son adresse exacte et ses coordonnées.'
  },
  {
    question: 'Les informations sont-elles à jour ?',
    answer: 'Nous mettons à jour notre base de données quotidiennement via un système de scraping automatisé. Cependant, nous vous recommandons de contacter directement le club pour vérifier les horaires, tarifs et disponibilités avant de vous déplacer.'
  },
  {
    question: 'Puis-je m\'inscrire directement depuis ActivityAround ?',
    answer: 'ActivityAround est un service d\'annuaire et de recherche. L\'inscription se fait directement auprès du club ou de l\'association que vous avez choisi. Nous fournissons toutes les informations de contact (téléphone, email, site web) pour faciliter votre démarche.'
  },
  {
    question: 'Y a-t-il des activités pour les enfants ?',
    answer: 'Oui ! De nombreux clubs proposent des cours pour enfants. Utilisez nos filtres pour trouver des activités adaptées à l\'âge de votre enfant. Les activités les plus populaires pour enfants sont le judo, le karaté, le football, la natation et la danse.'
  },
  {
    question: 'Comment fonctionne la future application de rencontres autour d\'activités ?',
    answer: 'Notre future application permettra de connecter des personnes partageant les mêmes centres d\'intérêt sportifs ou intellectuels. Vous pourrez trouver des partenaires pour pratiquer ensemble, former des groupes, ou simplement échanger avec d\'autres passionnés. L\'application est actuellement en développement. Restez connectés !'
  },
  {
    question: 'Puis-je suggérer l\'ajout d\'un club qui n\'est pas listé ?',
    answer: 'Absolument ! Si vous connaissez un club ou une association qui n\'apparaît pas sur ActivityAround, contactez-nous via notre formulaire de contact. Nous ferons notre possible pour l\'ajouter rapidement à notre base de données.'
  },
  {
    question: 'ActivityAround est-il disponible sur mobile ?',
    answer: 'Oui ! ActivityAround est entièrement responsive et fonctionne parfaitement sur mobile, tablette et desktop. Notre interface s\'adapte automatiquement à la taille de votre écran pour une expérience optimale.'
  }
]

export default function FAQPage() {
  // Generate FAQPage JSON-LD schema
  const faqPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
      />
      <main className="bg-white">
        {/* Hero Section - Modern gradient */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 border-b border-neutral-200">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full opacity-20 blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              {faqItems.length} questions fréquentes
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
              Questions fréquentes
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur ActivityAround
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* FAQ Accordion */}
            <Card className="border-neutral-200 shadow-sm mb-16">
              <Accordion type="single" collapsible className="divide-y divide-neutral-200">
                {faqItems.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-none px-6 sm:px-8"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-6 text-lg font-semibold text-neutral-900 hover:text-primary-600 transition-colors">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-neutral-700 leading-relaxed pb-6">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>

            {/* CTA Cards */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 text-center mb-8">
                Vous n&apos;avez pas trouvé de réponse ?
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Activities CTA */}
                <Card className="border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white hover:border-primary-300 transition-colors group">
                  <Link href="/activites" className="block p-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">
                          Découvrir les activités
                        </h3>
                        <p className="text-neutral-600 mb-4">
                          Explorez notre catalogue de 500+ activités à Toulouse
                        </p>
                        <Button className="bg-primary-600 hover:bg-primary-700">
                          Explorer
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>

                {/* Blog CTA */}
                <Card className="border-2 border-accent-200 bg-gradient-to-br from-accent-50 to-white hover:border-accent-300 transition-colors group">
                  <Link href="/blog" className="block p-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">
                          Lire le blog
                        </h3>
                        <p className="text-neutral-600 mb-4">
                          Guides et conseils pour choisir votre activité
                        </p>
                        <Button variant="outline" className="border-accent-300 text-accent-700 hover:bg-accent-50">
                          Consulter
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
