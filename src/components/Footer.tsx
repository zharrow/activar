import Link from 'next/link'
import { Sparkles, MapPin, Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const navigationLinks = [
    { href: '/activites', label: 'Rechercher des activités' },
    { href: '/sport', label: 'Activités sportives' },
    { href: '/intellectuel', label: 'Activités intellectuelles' },
    { href: '/blog', label: 'Blog' },
  ]

  const resourceLinks = [
    { href: '/faq', label: 'Questions fréquentes' },
    { href: '/sitemap.xml', label: 'Plan du site' },
  ]

  const cityLinks = [
    { href: '/ville/paris', label: 'Paris' },
    { href: '/ville/lyon', label: 'Lyon' },
    { href: '/ville/marseille', label: 'Marseille' },
    { href: '/ville/toulouse', label: 'Toulouse' },
  ]

  return (
    <footer className="bg-gradient-to-b from-neutral-50 to-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-neutral-900">
                ActivityAround
              </span>
            </Link>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              Trouvez votre prochaine activité sportive ou intellectuelle près de chez vous.
              Des centaines de clubs et associations répertoriés dans toute la France.
            </p>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <MapPin className="w-4 h-4" />
              <span>Partout en France</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Navigation</h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Ressources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities Column */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Villes populaires</h3>
            <ul className="space-y-3">
              {cityLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500">
            &copy; {currentYear} ActivityAround. Tous droits réservés.
          </p>
          <div className="flex items-center gap-1.5 text-sm text-neutral-500">
            <span>Fait avec</span>
            <Heart className="w-4 h-4 text-error-500 fill-error-500" />
            <span>en France</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
