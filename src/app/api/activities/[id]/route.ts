import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid activity ID' },
        { status: 400 }
      )
    }

    const activity = await prisma.activity.findUnique({
      where: { id },
    })

    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: activity,
    })
  } catch (error) {
    console.error('Error fetching activity:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity' },
      { status: 500 }
    )
  }
}
