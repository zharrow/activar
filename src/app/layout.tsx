import type { Metadata } from 'next'
import '@/styles/main.scss'
import { generateMetadata as genMeta, defaultKeywords, generateOrganizationJsonLd } from '@/lib/seo'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = genMeta({
  title: 'ActivityAround - Activités Sportives et Intellectuelles à Toulouse',
  description: 'Découvrez les meilleures activités sportives et intellectuelles à Toulouse : échecs, arts martiaux, football, basket, yoga, danse et bien plus. Trouvez le club parfait près de chez vous avec notre carte interactive.',
  keywords: defaultKeywords,
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationJsonLd = generateOrganizationJsonLd()

  return (
    <html lang="fr" style={{ scrollBehavior: 'smooth' }}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
