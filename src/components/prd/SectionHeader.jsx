import { Badge } from '../ui/badge'

export function SectionHeader({ eyebrow, title, description, badges = [] }) {
  return (
    <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{eyebrow}</div>
        ) : null}
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">{description}</p> : null}
      </div>
      {badges.length ? (
        <div className="flex shrink-0 flex-wrap gap-2">
          {badges.map((badge) => (
            <Badge key={badge} variant="secondary">{badge}</Badge>
          ))}
        </div>
      ) : null}
    </div>
  )
}
