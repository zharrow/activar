export default function ActivityCardSkeleton() {
  return (
    <div className="activity-card-skeleton">
      <div className="activity-card-skeleton__header">
        <div className="activity-card-skeleton__title"></div>
        <div className="activity-card-skeleton__category"></div>
      </div>
      <div className="activity-card-skeleton__info">
        <div className="activity-card-skeleton__line"></div>
        <div className="activity-card-skeleton__line activity-card-skeleton__line--short"></div>
      </div>
    </div>
  )
}
