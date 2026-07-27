import { ArrowRight, Info } from 'lucide-react'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

function statusVariant(status) {
  if (status === 'MVP') return 'success'
  if (status === 'Prototype') return 'outline'
  return 'warning'
}

function actionLabel(module) {
  if (module.moduleType === 'prd') return '进入文档'
  if (module.moduleType === 'prototype') return '进入原型'
  return '查看详情'
}

export function PrdModuleCard({
  module,
  businessCategory,
  onOpen,
  onShowDetails,
}) {
  const visibleTags = module.tags.slice(0, 4)
  const hiddenTagCount = Math.max(module.tags.length - visibleTags.length, 0)
  const openModule = () => onOpen(module)

  return (
    <Card
      role="link"
      tabIndex={0}
      onClick={openModule}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openModule()
        }
      }}
      className="group flex h-full min-h-[435px] cursor-pointer flex-col rounded-lg border bg-card shadow-[0_2px_10px_rgba(38,48,58,0.04)] transition hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-[0_8px_22px_rgba(38,48,58,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <CardHeader className="space-y-4 p-5 pb-4 sm:p-6 sm:pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant(module.status)} className="max-w-full px-3 py-1 text-[12px]">
                <span className="truncate">{module.status}</span>
              </Badge>
            </div>
            <CardTitle className="line-clamp-2 min-h-[56px] text-[18px] font-semibold leading-7">{module.title}</CardTitle>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              title="查看完整信息"
              aria-label={`查看${module.title}完整信息`}
              onClick={(event) => {
                event.stopPropagation()
                onShowDetails(module)
              }}
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-secondary hover:text-primary"
            >
              <Info className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 p-5 pt-0 sm:p-6 sm:pt-0">
        <p className="line-clamp-2 min-h-[44px] text-[14px] leading-[22px] text-muted-foreground">{module.description}</p>
        <div className="flex min-h-[30px] flex-wrap gap-2">
          {visibleTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="max-w-[136px] px-3 py-1 text-[12px] font-medium">
              <span className="truncate">{tag}</span>
            </Badge>
          ))}
          {hiddenTagCount ? <Badge variant="outline" className="px-3 py-1 text-[12px]">+{hiddenTagCount}</Badge> : null}
        </div>
        <div className="mt-auto grid grid-cols-[84px_1fr] gap-x-3 gap-y-2 border-t pt-4 text-[14px] leading-6">
          <span className="text-muted-foreground">业务分类</span>
          <span className="truncate font-medium text-foreground">{businessCategory}</span>
          <span className="text-muted-foreground">阶段</span>
          <span className="truncate font-medium text-foreground" title={module.phase}>{module.phase}</span>
        </div>
        <Button
          onClick={(event) => {
            event.stopPropagation()
            openModule()
          }}
          size="sm"
          className="mt-1 h-10 w-full rounded-md px-4 text-[15px]"
        >
          {actionLabel(module)}
          <ArrowRight className="h-[18px] w-[18px]" />
        </Button>
      </CardContent>
    </Card>
  )
}
