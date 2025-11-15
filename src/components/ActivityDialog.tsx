'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Globe } from 'lucide-react'
import { generateSlug } from '@/lib/seo'

interface Activity {
  id: number
  name: string
  category: string
  subcategory?: string | null
  address: string
  phone?: string | null
  email?: string | null
  website?: string | null
  latitude?: number | null
  longitude?: number | null
  description?: string | null
}

interface ActivityDialogProps {
  activity: Activity
  children?: React.ReactNode
}

export default function ActivityDialog({ activity, children }: ActivityDialogProps) {
  const slug = generateSlug(activity.name)

  const getCategoryColor = (category: string) => {
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
    <Dialog>
      <DialogTrigger asChild>
        {children || <Button variant="outline">Voir les détails</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            {activity.subcategory && (
              <Badge variant={getCategoryColor(activity.category)}>
                {activity.subcategory}
              </Badge>
            )}
            <Badge variant="outline">{activity.category === 'sport' ? 'Sport' : 'Intellectuel'}</Badge>
          </div>
          <DialogTitle className="text-2xl">{activity.name}</DialogTitle>
          <DialogDescription className="text-base">
            Toutes les informations sur cette activité
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Localisation */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Localisation
            </h3>
            <p className="text-sm text-muted-foreground pl-7">{activity.address}</p>
            {activity.latitude && activity.longitude && (
              <a
                href={`https://www.google.com/maps?q=${activity.latitude},${activity.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline pl-7 inline-block"
              >
                Voir sur Google Maps →
              </a>
            )}
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold">Contact</h3>
            <div className="space-y-2 pl-7">
              {activity.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${activity.phone}`} className="text-sm hover:text-primary transition-colors">
                    {activity.phone}
                  </a>
                </div>
              )}
              {activity.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={activity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-primary transition-colors truncate"
                  >
                    {activity.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {!activity.phone && !activity.website && (
                <p className="text-sm text-muted-foreground">Aucune information de contact disponible</p>
              )}
            </div>
          </div>

          {/* Description */}
          {activity.description && (
            <div className="space-y-2">
              <h3 className="font-semibold">Description</h3>
              <p className="text-sm text-muted-foreground pl-7">{activity.description}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button className="flex-1" asChild>
              <a href={`/activity/${activity.id}/${slug}`}>
                Page complète
              </a>
            </Button>
            {activity.website && (
              <Button variant="outline" className="flex-1" asChild>
                <a href={activity.website} target="_blank" rel="noopener noreferrer">
                  Site web
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
