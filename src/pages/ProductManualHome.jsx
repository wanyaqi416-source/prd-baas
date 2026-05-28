import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { moduleTypeFilters, prdModules } from '../data/prdModules'
import { PrdModuleCard } from '../components/portal/PrdModuleCard'
import { ProductManualLayout } from '../components/portal/ProductManualLayout'
import { Badge } from '../components/ui/badge'

export function ProductManualHome({ onNavigate }) {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const filteredModules = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filter = moduleTypeFilters.find((item) => item.id === activeFilter)

    return prdModules.filter((module) => {
      const matchesFilter = !filter?.moduleType || module.moduleType === filter.moduleType
      const searchableText = [
        module.title,
        module.subtitle,
        module.description,
        module.category,
        module.status,
        module.phase,
        module.source,
        module.buttonLabel,
        module.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase()
      const matchesQuery = !q || searchableText.includes(q)

      return matchesFilter && matchesQuery
    })
  }, [activeFilter, query])

  return (
    <ProductManualLayout>
      <main className="mx-auto flex min-h-screen max-w-[1160px] flex-col justify-center space-y-10 px-6 py-12 md:px-10">
        <section className="space-y-6 text-center">
          <div className="mx-auto flex w-fit flex-wrap justify-center gap-2">
            {moduleTypeFilters.map((filter) => (
              <button key={filter.id} type="button" onClick={() => setActiveFilter(filter.id)} className="rounded-full">
                <Badge variant={activeFilter === filter.id ? 'default' : 'secondary'} className="cursor-pointer">
                  {filter.label}
                </Badge>
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">请选择 PRD 产品模块</h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
              BaaS / Interlace、prd-invest 与原型入口统一收纳在当前 PRD Portal 中。请选择要查看的产品手册或原型入口，进入后可查看对应模块的业务流程、系统边界、数据模型、交互 Demo 和开发说明。
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-4xl">
          <div className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索模块，例如 BaaS、Interlace、Investment、原型"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </section>

        <section className="space-y-4">
          {filteredModules.length ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredModules.map((module) => (
                <PrdModuleCard key={module.id} module={module} onOpen={onNavigate} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
              没有找到匹配的模块。
            </div>
          )}
        </section>
      </main>
    </ProductManualLayout>
  )
}
