'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Review {
  id: number
  authorName: string
  rating: number
  comment: string
  createdAt: Date
}

interface ReviewsProps {
  reviews: Review[]
  activityName: string
}

export default function Reviews({ reviews, activityName }: ReviewsProps) {
  const [showAll, setShowAll] = useState(false)

  if (reviews.length === 0) {
    return (
      <div className="reviews reviews--empty">
        <p>Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
      </div>
    )
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3)

  // Count reviews by star rating
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: (reviews.filter(r => r.rating === star).length / reviews.length) * 100
  }))

  return (
    <section className="reviews" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="reviews__title">
        Avis et notes
      </h2>

      <div className="reviews__summary">
        <div className="reviews__average">
          <div className="reviews__average-score">{avgRating.toFixed(1)}</div>
          <div className="reviews__average-stars">
            <StarRating rating={avgRating} size="large" />
          </div>
          <div className="reviews__average-count">
            Basé sur {reviews.length} avis
          </div>
        </div>

        <div className="reviews__distribution">
          {ratingCounts.map(({ star, count, percentage }) => (
            <div key={star} className="reviews__distribution-row">
              <span className="reviews__distribution-star">{star}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <div className="reviews__distribution-bar">
                <div
                  className="reviews__distribution-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="reviews__distribution-count">({count})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="reviews__list">
        <AnimatePresence>
          {displayedReviews.map((review, index) => (
            <motion.article
              key={review.id}
              className="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="review__header">
                <div className="review__author">
                  <div className="review__avatar">
                    {review.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="review__meta">
                    <strong className="review__author-name">{review.authorName}</strong>
                    <time className="review__date">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="review__comment">{review.comment}</p>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {reviews.length > 3 && (
        <button
          className="reviews__show-more"
          onClick={() => setShowAll(!showAll)}
          aria-expanded={showAll}
        >
          {showAll ? 'Voir moins d\'avis' : `Voir les ${reviews.length - 3} autres avis`}
        </button>
      )}
    </section>
  )
}

interface StarRatingProps {
  rating: number
  size?: 'small' | 'medium' | 'large'
}

export function StarRating({ rating, size = 'medium' }: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  const sizeClass = `stars stars--${size}`

  return (
    <div className={sizeClass} role="img" aria-label={`${rating} sur 5 étoiles`}>
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      {hasHalfStar && (
        <svg viewBox="0 0 24 24" fill="currentColor" className="star--half">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}
