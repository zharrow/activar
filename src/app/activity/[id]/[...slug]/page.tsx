import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
    slug?: string[]
  }>
}

// This catch-all route handles URLs with any slug or no slug
// It simply redirects to the main [id] page which handles everything
export default async function ActivitySlugPage({ params }: PageProps) {
  const resolvedParams = await params

  // Redirect to the main activity page without the slug in the path
  // The slug is only for SEO, not for routing
  redirect(`/activity/${resolvedParams.id}`)
}
