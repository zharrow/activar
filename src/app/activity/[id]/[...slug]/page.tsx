import { redirect } from 'next/navigation'

interface PageProps {
  params: {
    id: string
    slug?: string[]
  }
}

// This catch-all route handles URLs with any slug or no slug
// It simply redirects to the main [id] page which handles everything
export default function ActivitySlugPage({ params }: PageProps) {
  // Redirect to the main activity page without the slug in the path
  // The slug is only for SEO, not for routing
  redirect(`/activity/${params.id}`)
}
