import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { prdModules } from '../data/prdModules'
import { PrdModuleCard } from '../components/portal/PrdModuleCard'
import { ProductManualLayout } from '../components/portal/ProductManualLayout'
import { Badge } from '../components/ui/badge'

export function ProductManualHome({ onNavigate }) {
  const [query, setQuery] = useState('')
  const filteredModules = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return prdModules
    return prdModules.filter((module) =>
      [module.title, module.subtitle, module.category, module.status, module.tags.join(' ')].join(' ').toLowerCase().includes(q),
    )
  }, [query])

  return (
    <ProductManualLayout>
      <main className="mx-auto flex min-h-screen max-w-[1160px] flex-col justify-center space-y-10 px-6 py-12 md:px-10">
        <section className="space-y-6 text-center">
          <div className="mx-auto flex w-fit flex-wrap justify-center gap-2">
            <Badge variant="secondary">内部 PRD</Badge>
            <Badge variant="secondary">产品手册中心</Badge>
            <Badge variant="secondary">模块独立</Badge>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">请选择 PRD 产品模块</h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
              BaaS / Interlace 与 prd-invest 是两个独立 PRD 模块。请选择要查看的产品手册，进入后可查看对应模块的业务流程、系统边界、数据模型、交互 Demo 和开发说明。
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-4xl">
          <div className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索模块，例如 BaaS、Interlace、Investment"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredModules.map((module) => (
              <PrdModuleCard key={module.id} module={module} onOpen={onNavigate} />
            ))}
          </div>
        </section>
      </main>
    </ProductManualLayout>
  )
}
