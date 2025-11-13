import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPost, getAllBlogPosts } from '@/data/blog-posts'
import { generateMetadata as genMeta, generateBreadcrumbJsonLd } from '@/lib/seo'
import '@/styles/pages/blog-post.scss'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug)

  if (!post) {
    return genMeta({
      title: 'Article non trouvé',
      description: 'Cet article n\'existe pas.',
    })
  }

  return genMeta({
    title: `${post.title} | Blog ActivityAround`,
    description: post.excerpt,
  })
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Accueil', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ])

  // Generate Article JSON-LD
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.publishedAt,
    publisher: {
      '@type': 'Organization',
      name: 'ActivityAround',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://activityaround.vercel.app'}/logo.png`,
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, articleJsonLd]) }}
      />
      <main className="blog-post">
        <article className="blog-post__article">
          <div className="container container--narrow">
            <nav className="blog-post__breadcrumb">
              <Link href="/">Accueil</Link>
              <span>/</span>
              <Link href="/blog">Blog</Link>
              <span>/</span>
              <span>{post.title}</span>
            </nav>

            <header className="blog-post__header">
              <div className="blog-post__category">{post.category}</div>
              <h1 className="blog-post__title">{post.title}</h1>
              <div className="blog-post__meta">
                <span className="blog-post__author">Par {post.author}</span>
                <span className="blog-post__separator">•</span>
                <time className="blog-post__date">
                  {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </time>
                <span className="blog-post__separator">•</span>
                <span className="blog-post__read-time">{post.readTime} de lecture</span>
              </div>
            </header>

            <div
              className="blog-post__content"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
            />

            <footer className="blog-post__footer">
              <Link href="/blog" className="btn btn--secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Retour au blog
              </Link>
              <Link href="/activites" className="btn btn--primary">
                Découvrir les activités
              </Link>
            </footer>
          </div>
        </article>
      </main>
    </>
  )
}
