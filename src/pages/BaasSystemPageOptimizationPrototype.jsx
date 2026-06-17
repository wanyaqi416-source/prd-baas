import { ArrowRight, Banknote, FileText, RefreshCw, Send } from 'lucide-react'

import { ProductManualLayout } from '../components/portal/ProductManualLayout'
import { PrdBackLink } from '../components/portal/PrdBackLink'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const optimizationEntries = [
  {
    title: '开户流程优化',
    description: '复用当前 BaaS 开户原型流程，在系统页面优化入口中接入更清晰的银行电汇入金页面。',
    tags: ['开户', '状态流转', '信托账户'],
    buttonLabel: '进入开户流程优化',
    icon: FileText,
    route: '/admin/product-manual/system-page-optimization/opening',
  },
  {
    title: '银行电汇入金优化',
    description: '直达优化后的银行电汇入金页，重点展示步骤、当前任务、复制收款信息和提交申请。',
    tags: ['入金', '电汇', '步骤化'],
    buttonLabel: '查看入金优化页',
    icon: Banknote,
    route: '/admin/product-manual/system-page-optimization/incoming-fiat-deposit',
  },
  {
    title: '法币转出优化',
    description: '后续用于重构出金页面的任务顺序、确认信息和审核反馈。',
    tags: ['出金', '待优化'],
    buttonLabel: '后续扩展',
    icon: Send,
  },
  {
    title: '资金互转优化',
    description: '后续用于优化香港账户与美国账户之间的资金互转页面。',
    tags: ['资金互转', '待优化'],
    buttonLabel: '后续扩展',
    icon: RefreshCw,
  },
]

export function BaasSystemPageOptimizationPrototype({ onBack, onNavigate }) {
  return (
    <ProductManualLayout>
      <main className="mx-auto min-h-screen max-w-[1160px] px-6 py-10 md:px-10 md:py-14">
        <div className="space-y-8">
          <PrdBackLink onClick={onBack} />

          <section className="space-y-4 border-b pb-8">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">原型</Badge>
              <Badge variant="secondary">系统页面优化</Badge>
              <Badge variant="secondary">用户任务流</Badge>
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">系统页面优化</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
                这里独立收纳重新设计后的系统页面原型。第一版先把开户流程带入新入口，并重点优化银行电汇入金页，让用户知道当前处在哪一步、要点击哪里、提交后会发生什么。
              </p>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            {optimizationEntries.map((entry) => {
              const Icon = entry.icon
              const enabled = Boolean(entry.route)

              return (
                <Card key={entry.title} className="border bg-card transition-colors hover:border-primary/40">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl leading-tight">{entry.title}</CardTitle>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.description}</p>
                      </div>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                    <button
                      type="button"
                      disabled={!enabled}
                      onClick={() => enabled && onNavigate(entry.route)}
                      className="inline-flex items-center gap-2 rounded-full border bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {entry.buttonLabel}
                      {enabled ? <ArrowRight className="h-3.5 w-3.5" /> : null}
                    </button>
                  </CardContent>
                </Card>
              )
            })}
          </section>
        </div>
      </main>
    </ProductManualLayout>
  )
}
