import { ArrowRight, ClipboardCheck, MonitorSmartphone } from 'lucide-react'

import { ProductManualLayout } from '../components/portal/ProductManualLayout'
import { PrdBackLink } from '../components/portal/PrdBackLink'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export function AccountManagementPrototypeHome({
  onBack,
  onNavigate,
  title = '用户新加坡账户配置',
  description = '将客户端开户流程和后台审核拆成两个入口：开户流程进入客户侧页面，后台审核进入当前运营审核页面。',
  baseRoute = '/admin/product-manual/account-management-prototype',
  featureBadge = '新加坡账户',
}) {
  const accountManagementEntries = [
    {
      title: '开户流程',
      description: '复用 BaaS 原型的完整客户端开户流程，客户从账户入口发起开户、确认开户费并进入待审核状态。',
      buttonLabel: '进入客户端',
      icon: MonitorSmartphone,
      route: `${baseRoute}/opening`,
    },
    {
      title: '后台审核',
      description: '进入当前新加坡账户后台审核页面，由运营查看申请列表并完成开户审核处理。',
      buttonLabel: '进入后台页面',
      icon: ClipboardCheck,
      route: `${baseRoute}/admin-review`,
    },
  ]

  return (
    <ProductManualLayout>
      <main className="mx-auto min-h-screen max-w-[1160px] px-6 py-10 md:px-10 md:py-14">
        <div className="space-y-8">
          <PrdBackLink onClick={onBack} />

          <section className="space-y-4 border-b pb-8">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">原型</Badge>
              <Badge variant="secondary">{featureBadge}</Badge>
              <Badge variant="secondary">开户审核</Badge>
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">{title}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
                {description}
              </p>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            {accountManagementEntries.map((entry) => {
              const Icon = entry.icon

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
                  <CardContent>
                    <button
                      type="button"
                      onClick={() => onNavigate(entry.route)}
                      className="inline-flex items-center gap-2 rounded-full border bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
                    >
                      {entry.buttonLabel}
                      <ArrowRight className="h-3.5 w-3.5" />
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
