import { ArrowRight, FileText } from 'lucide-react'

import { baasPrototypeEntries } from '../data/prdModules'
import { ProductManualLayout } from '../components/portal/ProductManualLayout'
import { PrdBackLink } from '../components/portal/PrdBackLink'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export function BaasPrototypeHome({ onBack, onNavigate }) {
  return (
    <ProductManualLayout>
      <main className="mx-auto min-h-screen max-w-[1160px] px-6 py-10 md:px-10 md:py-14">
        <div className="space-y-8">
          <PrdBackLink onClick={onBack} />

          <section className="space-y-4 border-b pb-8">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">原型</Badge>
              <Badge variant="secondary">BaaS</Badge>
              <Badge variant="secondary">Interlace</Badge>
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">BaaS 原型</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
                这里用于汇总 BaaS / Interlace 的产品原型页面
              </p>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            {baasPrototypeEntries.map((entry) => (
              <Card key={entry.title} className="border bg-card transition-colors hover:border-primary/40">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl leading-tight">{entry.title}</CardTitle>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.description}</p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <FileText className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <button
                    type="button"
                    disabled={!entry.route}
                    onClick={() => entry.route && onNavigate(entry.route)}
                    className="inline-flex items-center gap-2 rounded-full border bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {entry.buttonLabel || '占位入口'}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </section>
        </div>
      </main>
    </ProductManualLayout>
  )
}
