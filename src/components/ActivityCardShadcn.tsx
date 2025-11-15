'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Phone, Globe, MapIcon } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import ActivityDialog from './ActivityDialog'
import { generateSlug } from '@/lib/seo'
import { cn } from '@/lib/utils'
import { ActivityBasic } from '@/types/activity'

interface ActivityCardShadcnProps {
  activity: ActivityBasic
  index: number
}

export default function ActivityCardShadcn({
  activity,
  index
}: ActivityCardShadcnProps) {
  const slug = generateSlug(activity.name)
  const activityUrl = `/activity/${activity.id}/${slug}`

  const getCategoryVariant = (category: string): 'default' | 'secondary' | 'outline' => {
    switch (category) {
      case 'sport':
        return 'default'
      case 'intellectual':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 relative group">
        {/* Numéro d'index */}
        <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center text-sm font-bold z-10 shadow-md">
          {String(index + 1).padStart(2, '0')}
        </div>

        <Link href={activityUrl} className="flex flex-col flex-1">
          <CardHeader className="pb-3 pt-16">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                {activity.name}
              </CardTitle>
              {activity.subcategory && (
                <Badge variant={getCategoryVariant(activity.category)} className="shrink-0">
                  {activity.subcategory}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-3">
            {/* Adresse */}
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{activity.address}</span>
            </div>

            {/* Métadonnées */}
            <div className="flex flex-wrap gap-2">
              {activity.phone && (
                <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                  <Phone className="h-3 w-3" />
                  <span>Téléphone</span>
                </div>
              )}
              {activity.website && (
                <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                  <Globe className="h-3 w-3" />
                  <span>Site web</span>
                </div>
              )}
              {activity.latitude && activity.longitude && (
                <div className="inline-flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-2 py-1 rounded-md">
                  <MapIcon className="h-3 w-3" />
                  <span>Sur la carte</span>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex gap-2 pt-4 border-t">
            <ActivityDialog activity={activity}>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                Aperçu rapide
              </Button>
            </ActivityDialog>
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Cliquez pour voir les détails →
            </div>
          </CardFooter>
        </Link>

        {/* Effet de gradient au hover */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg pointer-events-none",
            activity.category === 'sport' ? 'from-primary to-primary/20' : 'from-secondary to-secondary/20'
          )}
        />
      </Card>
    </motion.div>
  )
}
