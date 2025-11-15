import type { Metadata } from 'next'
import Link from 'next/link'
import { generateMetadata as genMeta } from '@/lib/seo'
import { getAllBlogPosts } from '@/data/blog-posts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, Clock, User, BookOpen, Sparkles } from 'lucide-react'

export const metadata: Metadata = genMeta({
  title: 'Blog - Guides et Conseils sur les Activités à Toulouse | ActivityAround',
  description: 'Découvrez nos guides complets sur les activités sportives et intellectuelles à Toulouse : meilleurs clubs, conseils pour débutants, quartiers recommandés et plus encore.',
})

export default function BlogPage() {
  const posts = getAllBlogPosts()

  return (
    <main className="bg-white">
      {/* Hero Section - Modern gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 border-b border-neutral-200">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-100 rounded-full opacity-20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              {posts.length} articles
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
              Blog ActivityAround
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed">
              Guides, conseils et actualités sur les activités sportives et intellectuelles à Toulouse
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full border-neutral-200 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200">
                  <CardHeader>
                    {/* Category Badge */}
                    <Badge
                      className={post.category === 'Sport'
                        ? 'bg-primary-100 text-primary-700 border-primary-200 self-start mb-4'
                        : 'bg-accent-100 text-accent-700 border-accent-200 self-start mb-4'
                      }
                    >
                      {post.category}
                    </Badge>

                    {/* Title */}
                    <CardTitle className="text-2xl text-neutral-900 group-hover:text-primary-600 transition-colors mb-3">
                      {post.title}
                    </CardTitle>

                    {/* Excerpt */}
                    <CardDescription className="text-base text-neutral-600 leading-relaxed">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-neutral-700">
                        {post.author}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="w-full group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors"
                    >
                      Lire l&apos;article
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {/* CTA Section */}
          <Card className="border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white shadow-lg relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-200 rounded-full opacity-20" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-accent-200 rounded-full opacity-20" />

            <CardContent className="relative py-12 px-6 sm:px-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm text-primary-700 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                500+ activités à découvrir
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Découvrez toutes les activités à Toulouse
              </h2>
              <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
                Trouvez le club parfait pour vous grâce à notre carte interactive et nos filtres avancés
              </p>

              <Link href="/activites">
                <Button
                  size="lg"
                  className="bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  Explorer les activités
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
