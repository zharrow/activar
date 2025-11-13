import type { Metadata } from 'next'
import Link from 'next/link'
import { generateMetadata as genMeta } from '@/lib/seo'
import FAQ from '@/components/FAQ'
import '@/styles/pages/faq.scss'

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
      <main className="faq-page">
        <section className="faq-hero">
          <div className="container">
            <h1 className="faq-hero__title">Questions fréquentes</h1>
            <p className="faq-hero__subtitle">
              Tout ce que vous devez savoir sur ActivityAround
            </p>
          </div>
        </section>

        <section className="faq-content">
          <div className="container">
            <FAQ items={faqItems} />

            <div className="faq-cta">
              <h2 className="faq-cta__title">Vous n&apos;avez pas trouvé de réponse ?</h2>
              <p className="faq-cta__text">
                Explorez notre catalogue d&apos;activités ou consultez notre blog pour plus d&apos;informations
              </p>
              <div className="faq-cta__buttons">
                <Link href="/activites" className="btn btn--primary">
                  Découvrir les activités
                </Link>
                <Link href="/blog" className="btn btn--secondary">
                  Lire le blog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
