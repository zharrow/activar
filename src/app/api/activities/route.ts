import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const querySchema = z.object({
  category: z.string().nullish(),
  subcategory: z.string().nullish(),
  limit: z.string().nullish(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const params = querySchema.parse({
      category: searchParams.get('category'),
      subcategory: searchParams.get('subcategory'),
      limit: searchParams.get('limit'),
    })

    const where: any = {}
    if (params.category) {
      where.category = params.category
    }
    if (params.subcategory) {
      where.subcategory = params.subcategory
    }

    const activities = await prisma.activity.findMany({
      where,
      take: params.limit ? parseInt(params.limit) : undefined,
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      count: activities.length,
      data: activities,
    })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}
