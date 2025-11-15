import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPost, getAllBlogPosts } from '@/data/blog-posts'
import { generateMetadata as genMeta, generateBreadcrumbJsonLd } from '@/lib/seo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, Calendar, Clock, User, ChevronRight } from 'lucide-react'

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
      <main className="bg-white">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-neutral-200 bg-neutral-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-neutral-600">
              <Link href="/" className="hover:text-primary-600 transition-colors">
                Accueil
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/blog" className="hover:text-primary-600 transition-colors">
                Blog
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-neutral-900 font-medium truncate">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Article */}
        <article className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <header className="mb-12">
              {/* Category Badge */}
              <Badge
                className={post.category === 'Sport'
                  ? 'bg-primary-100 text-primary-700 border-primary-200 mb-6'
                  : 'bg-accent-100 text-accent-700 border-accent-200 mb-6'
                }
              >
                {post.category}
              </Badge>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-neutral-600">
                {/* Author */}
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {post.author}
                    </p>
                  </div>
                </div>

                <span className="text-neutral-300">•</span>

                {/* Date */}
                <time className="flex items-center gap-1.5 text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </time>

                <span className="text-neutral-300">•</span>

                {/* Read Time */}
                <span className="flex items-center gap-1.5 text-sm">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
            </header>

            {/* Content */}
            <div
              className="prose prose-lg prose-neutral max-w-none
                prose-headings:text-neutral-900 prose-headings:font-bold
                prose-p:text-neutral-700 prose-p:leading-relaxed
                prose-a:text-primary-600 prose-a:no-underline hover:prose-a:text-primary-700
                prose-strong:text-neutral-900 prose-strong:font-semibold
                prose-ul:text-neutral-700 prose-ol:text-neutral-700
                prose-li:my-2
                mb-12"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
            />

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-6 pt-12 border-t border-neutral-200">
              {/* Back to Blog */}
              <Card className="border-neutral-200 hover:border-primary-300 transition-colors">
                <Link href="/blog" className="block p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <ArrowLeft className="w-5 h-5 text-neutral-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 mb-1">Retour au blog</p>
                      <p className="text-sm text-neutral-600">Découvrez plus d&apos;articles</p>
                    </div>
                  </div>
                </Link>
              </Card>

              {/* Discover Activities */}
              <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-white hover:border-primary-300 transition-colors">
                <Link href="/activites" className="block p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-primary-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 mb-1">Découvrir les activités</p>
                      <p className="text-sm text-neutral-600">Trouvez votre activité idéale</p>
                    </div>
                  </div>
                </Link>
              </Card>
            </div>
          </div>
        </article>
      </main>
    </>
  )
}
