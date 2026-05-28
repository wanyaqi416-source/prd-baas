import { ArrowRight } from 'lucide-react'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export function PrdModuleCard({ module, onOpen }) {
  return (
    <Card className="flex h-full flex-col border bg-card transition-colors hover:border-primary/40">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-2xl leading-tight">{module.title}</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{module.subtitle}</p>
          </div>
          <Badge variant={module.status === 'MVP' ? 'success' : 'warning'}>{module.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <p className="text-sm leading-6 text-muted-foreground">{module.description}</p>
        <div className="flex flex-wrap gap-2">
          {module.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
        </div>
        <div className="mt-auto grid gap-2 text-sm text-muted-foreground">
          <div>分类：{module.category}</div>
          <div>阶段：{module.phase}</div>
          <div>来源：{module.source}</div>
        </div>
        <Button onClick={() => onOpen(module.route)} className="mt-2 w-fit">
          {module.buttonLabel || '进入文档'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
