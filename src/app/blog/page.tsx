import type { Metadata } from 'next'
import Link from 'next/link'
import { generateMetadata as genMeta } from '@/lib/seo'
import { getAllBlogPosts } from '@/data/blog-posts'
import '@/styles/pages/blog.scss'

export const metadata: Metadata = genMeta({
  title: 'Blog - Guides et Conseils sur les Activités à Toulouse | ActivityAround',
  description: 'Découvrez nos guides complets sur les activités sportives et intellectuelles à Toulouse : meilleurs clubs, conseils pour débutants, quartiers recommandés et plus encore.',
})

export default function BlogPage() {
  const posts = getAllBlogPosts()

  return (
    <main className="blog-page">
      <section className="blog-hero">
        <div className="container">
          <h1 className="blog-hero__title">Blog ActivityAround</h1>
          <p className="blog-hero__subtitle">
            Guides, conseils et actualités sur les activités à Toulouse
          </p>
        </div>
      </section>

      <section className="blog-content">
        <div className="container">
          <div className="blog-grid">
            {posts.map((post) => (
              <article key={post.slug} className="blog-card">
                <div className="blog-card__image">
                  <div className="blog-card__category">{post.category}</div>
                </div>
                <div className="blog-card__content">
                  <div className="blog-card__meta">
                    <span className="blog-card__date">
                      {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="blog-card__read-time">{post.readTime} de lecture</span>
                  </div>
                  <h2 className="blog-card__title">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className="blog-card__excerpt">{post.excerpt}</p>
                  <div className="blog-card__footer">
                    <span className="blog-card__author">Par {post.author}</span>
                    <Link href={`/blog/${post.slug}`} className="blog-card__link">
                      Lire l'article
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="blog-cta">
            <h2 className="blog-cta__title">Découvrez toutes les activités à Toulouse</h2>
            <p className="blog-cta__text">
              Trouvez le club parfait pour vous grâce à notre carte interactive
            </p>
            <Link href="/activites" className="btn btn--primary">
              Explorer les activités
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
