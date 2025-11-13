import Link from 'next/link'
import '../styles/components/footer.scss'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__section">
            <h3 className="footer__title">ActivityAround</h3>
            <p className="footer__description">
              Trouvez votre prochaine activité sportive ou intellectuelle à Toulouse.
              Des centaines de clubs et associations répertoriés.
            </p>
          </div>

          <div className="footer__section">
            <h4 className="footer__heading">Navigation</h4>
            <ul className="footer__links">
              <li><Link href="/activites">Rechercher des activités</Link></li>
              <li><Link href="/sport">Activités sportives</Link></li>
              <li><Link href="/intellectuel">Activités intellectuelles</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__heading">Ressources</h4>
            <ul className="footer__links">
              <li><Link href="/faq">Questions fréquentes</Link></li>
              <li><Link href="/sitemap.xml">Plan du site</Link></li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__heading">Quartiers populaires</h4>
            <ul className="footer__links">
              <li><Link href="/quartier/capitole">Capitole</Link></li>
              <li><Link href="/quartier/saint-cyprien">Saint-Cyprien</Link></li>
              <li><Link href="/quartier/minimes">Minimes</Link></li>
              <li><Link href="/quartier/compans-caffarelli">Compans-Caffarelli</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} ActivityAround. Tous droits réservés.
          </p>
          <div className="footer__social">
            <span className="footer__made-with">
              Fait avec ❤️ à Toulouse
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
