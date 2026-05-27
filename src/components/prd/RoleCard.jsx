import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export function RoleCard({ icon: Icon, title, badge, rows, tone = 'default' }) {
  const toneClass = {
    client: 'border-sky-200 bg-sky-50/50',
    admin: 'border-amber-200 bg-amber-50/50',
    system: 'border-emerald-200 bg-emerald-50/50',
    default: '',
  }[tone]

  return (
    <Card className={`h-full ${toneClass}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            {Icon ? <Icon className="h-4 w-4 text-accent" /> : null}
            {title}
          </span>
          <Badge variant="secondary">{badge}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-card/70 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
              <div className="mt-1 text-sm font-medium">{value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
