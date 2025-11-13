import type { Metadata } from 'next'
import Link from 'next/link'
import { generateMetadata as genMeta } from '@/lib/seo'
import '@/styles/pages/home.scss'

export const metadata: Metadata = genMeta({
  title: 'ActivityAround - Trouvez votre activité à Toulouse',
  description: 'Découvrez les activités sportives et intellectuelles à Toulouse. Recherchez parmi des centaines de clubs ou rejoignez notre future application de rencontres autour d\'activités communes.',
})

export default function HomePage() {
  return (
    <main className="home">
      <section className="home-hero">
        <div className="container">
          <div className="home-hero__content">
            <h1 className="home-hero__title">
              Trouvez votre prochaine activité à <span className="highlight">Toulouse</span>
            </h1>
            <p className="home-hero__subtitle">
              Que vous cherchiez un club de sport, une association intellectuelle,
              ou des personnes partageant vos passions, nous avons ce qu'il vous faut.
            </p>

            <div className="home-hero__cta-group">
              <Link href="/activites" className="cta-card cta-card--primary">
                <div className="cta-card__icon">🔍</div>
                <h2 className="cta-card__title">Recherche d'activités</h2>
                <p className="cta-card__description">
                  Explorez notre catalogue de clubs sportifs et intellectuels à Toulouse.
                  Carte interactive, filtres avancés, et informations détaillées.
                </p>
                <span className="cta-card__link">
                  Découvrir les activités
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </Link>

              <div className="cta-card cta-card--secondary cta-card--disabled">
                <div className="cta-card__badge">Bientôt disponible</div>
                <div className="cta-card__icon">💬</div>
                <h2 className="cta-card__title">Rencontres autour d'activités</h2>
                <p className="cta-card__description">
                  Trouvez des partenaires pour vos activités favorites.
                  Connectez-vous avec des passionnés près de chez vous.
                </p>
                <span className="cta-card__link cta-card__link--demo">
                  Voir la démo
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div className="home-hero__stats">
            <div className="stat-item">
              <span className="stat-item__value">500+</span>
              <span className="stat-item__label">Activités recensées</span>
            </div>
            <div className="stat-item">
              <span className="stat-item__value">20+</span>
              <span className="stat-item__label">Catégories</span>
            </div>
            <div className="stat-item">
              <span className="stat-item__value">100%</span>
              <span className="stat-item__label">Gratuit</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="container">
          <h2 className="home-features__title">Pourquoi ActivityAround ?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card__icon">🗺️</div>
              <h3 className="feature-card__title">Carte interactive</h3>
              <p className="feature-card__description">
                Visualisez toutes les activités sur une carte et trouvez celles près de chez vous.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">🔎</div>
              <h3 className="feature-card__title">Recherche avancée</h3>
              <p className="feature-card__description">
                Filtrez par catégorie, quartier, et trouvez exactement ce que vous cherchez.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">📱</div>
              <h3 className="feature-card__title">100% Responsive</h3>
              <p className="feature-card__description">
                Accessible sur tous vos appareils : mobile, tablette, desktop.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">🆓</div>
              <h3 className="feature-card__title">Gratuit</h3>
              <p className="feature-card__description">
                Pas d'abonnement, pas de frais cachés. Toutes nos fonctionnalités sont gratuites.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="container">
          <div className="home-cta__content">
            <h2 className="home-cta__title">Prêt à découvrir votre prochaine passion ?</h2>
            <p className="home-cta__subtitle">
              Des centaines d'activités vous attendent à Toulouse
            </p>
            <Link href="/activites" className="btn btn--large btn--primary">
              Commencer maintenant
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
