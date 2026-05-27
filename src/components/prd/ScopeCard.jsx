import { CheckCircle2, XCircle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export function ScopeCard({ title, items, type = 'in' }) {
  const Icon = type === 'in' ? CheckCircle2 : XCircle
  const tone = type === 'in' ? 'border-emerald-200 bg-emerald-50/60' : 'border-red-200 bg-red-50/60'

  return (
    <Card className={tone}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </CardContent>
    </Card>
  )
}
