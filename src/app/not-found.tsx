import Link from 'next/link'
import type { Metadata } from 'next'
import '@/styles/pages/not-found.scss'

export const metadata: Metadata = {
  title: 'Page non trouvée | ActivityAround',
  description: 'La page que vous recherchez n\'existe pas.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="container">
        <div className="not-found__content">
          <div className="not-found__icon">404</div>
          <h1 className="not-found__title">Page non trouvée</h1>
          <p className="not-found__text">
            Oups ! La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>

          <div className="not-found__suggestions">
            <h2 className="not-found__suggestions-title">Suggestions :</h2>
            <div className="suggestions-grid">
              <Link href="/activites" className="suggestion-card">
                <div className="suggestion-card__icon">🔍</div>
                <h3 className="suggestion-card__title">Rechercher des activités</h3>
                <p className="suggestion-card__text">
                  Explorez notre catalogue complet d&apos;activités à Toulouse
                </p>
              </Link>

              <Link href="/sport" className="suggestion-card">
                <div className="suggestion-card__icon">⚽</div>
                <h3 className="suggestion-card__title">Activités sportives</h3>
                <p className="suggestion-card__text">
                  Découvrez tous les clubs sportifs de Toulouse
                </p>
              </Link>

              <Link href="/intellectuel" className="suggestion-card">
                <div className="suggestion-card__icon">🧠</div>
                <h3 className="suggestion-card__title">Activités intellectuelles</h3>
                <p className="suggestion-card__text">
                  Échecs, bridge, go et autres activités cérébrales
                </p>
              </Link>

              <Link href="/blog" className="suggestion-card">
                <div className="suggestion-card__icon">📚</div>
                <h3 className="suggestion-card__title">Blog</h3>
                <p className="suggestion-card__text">
                  Lisez nos guides et conseils sur les activités
                </p>
              </Link>
            </div>
          </div>

          <div className="not-found__actions">
            <Link href="/" className="btn btn--primary">
              Retour à l&apos;accueil
            </Link>
            <Link href="/faq" className="btn btn--secondary">
              Questions fréquentes
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
