import { Badge } from '../ui/badge'

export function KeyValueTable({ rows }) {
  return (
    <div className="divide-y rounded-2xl border bg-card">
      {rows.map(([key, value, badge]) => (
        <div key={key} className="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[180px_minmax(0,1fr)]">
          <div className="font-medium text-muted-foreground">{key}</div>
          <div className="min-w-0">
            <span className="break-words font-mono text-[13px]">{value}</span>
            {badge ? <Badge className="ml-2" variant="secondary">{badge}</Badge> : null}
          </div>
        </div>
      ))}
    </div>
  )
}
