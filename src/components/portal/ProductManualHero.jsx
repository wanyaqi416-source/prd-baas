import { Badge } from '../ui/badge'

export function ProductManualHero({ eyebrow = '内部 PRD 手册', title, subtitle, description, tags = [] }) {
  return (
    <header id="overview" className="border-b bg-card px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-[1160px]">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{eyebrow}</div>
        <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-tight md:text-6xl">{title}</h1>
        {subtitle ? <p className="mt-4 max-w-4xl text-xl text-foreground/80">{subtitle}</p> : null}
        {description ? <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{description}</p> : null}
        {tags.length ? (
          <div className="mt-7 flex flex-wrap gap-2">
            {tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </div>
        ) : null}
      </div>
    </header>
  )
}
