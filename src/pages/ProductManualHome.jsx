import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { moduleTypeFilters, prdModules } from '../data/prdModules'
import { PrdModuleCard } from '../components/portal/PrdModuleCard'
import { ProductManualLayout } from '../components/portal/ProductManualLayout'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

const PAGE_SIZE = 12

function deriveBusinessCategory(module) {
  if (module.category && module.category !== '原型') return module.category

  const tags = module.tags.join(' ')
  const searchableText = `${module.title} ${module.subtitle} ${tags}`

  if (searchableText.includes('券商')) return '券商账户'
  if (
    searchableText.includes('开户流程')
    || searchableText.includes('开户申请')
    || searchableText.includes('新加坡账户')
    || searchableText.includes('批量加账户')
  ) return '开户与审核'
  if (searchableText.includes('投资') || searchableText.includes('交易')) return '投资与交易'
  if (searchableText.includes('配置') || searchableText.includes('后台管理')) return '后台配置'
  if (
    searchableText.includes('BaaS')
    || searchableText.includes('账户')
    || searchableText.includes('资金')
    || searchableText.includes('转账')
    || searchableText.includes('入金')
    || searchableText.includes('出金')
  ) return '账户与资金'

  return '其他'
}

function readNavigationState() {
  const savedState = window.history.state?.productManualHome

  return {
    activeType: savedState?.activeType || 'prototype',
    page: Number(savedState?.page || 1),
  }
}

function matchesType(module, activeType) {
  if (activeType === 'all') return true

  const filter = moduleTypeFilters.find((item) => item.id === activeType)
  if (filter?.moduleType) return module.moduleType === filter.moduleType
  if (filter?.phase) return module.phase === filter.phase

  return true
}

function ModuleDetailsModal({ module, businessCategory, onClose, onOpen }) {
  if (!module) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="module-details-title"
        className="flex max-h-[86vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border bg-card shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant={module.status === 'MVP' ? 'success' : module.status === 'Prototype' ? 'outline' : 'warning'}>
                {module.status}
              </Badge>
              <Badge variant="secondary">{businessCategory}</Badge>
            </div>
            <h2 id="module-details-title" className="text-xl font-semibold leading-7">{module.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭详情"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-5 overflow-y-auto px-5 py-5">
          <p className="text-sm leading-6 text-muted-foreground">{module.description}</p>
          <dl className="grid gap-3 text-sm sm:grid-cols-[88px_1fr]">
            <dt className="text-muted-foreground">分类</dt>
            <dd className="font-medium">{businessCategory}</dd>
            <dt className="text-muted-foreground">阶段</dt>
            <dd className="font-medium">{module.phase}</dd>
            <dt className="text-muted-foreground">来源</dt>
            <dd className="break-all font-medium">
              {module.source.startsWith('http') ? (
                <a
                  href={module.source}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  {module.source}
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              ) : module.source}
            </dd>
          </dl>
          <div>
            <div className="mb-2 text-sm font-medium">全部标签</div>
            <div className="flex flex-wrap gap-2">
              {module.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
          </div>
        </div>

        <footer className="flex justify-end gap-2 border-t px-5 py-4">
          <Button variant="outline" onClick={onClose} className="rounded-md">关闭</Button>
          <Button onClick={() => onOpen(module)} className="rounded-md">
            {module.moduleType === 'prd' ? '进入文档' : module.moduleType === 'prototype' ? '进入原型' : '查看详情'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </footer>
      </section>
    </div>
  )
}

export function ProductManualHome({ onNavigate }) {
  const initialState = useMemo(readNavigationState, [])
  const [activeType, setActiveType] = useState(initialState.activeType)
  const [page, setPage] = useState(initialState.page)
  const [detailModule, setDetailModule] = useState(null)
  const contentRef = useRef(null)

  const modulesWithMeta = useMemo(() => prdModules.map((module, index) => ({
    ...module,
    businessCategory: deriveBusinessCategory(module),
    originalIndex: index,
  })), [])

  const filteredModules = useMemo(() => {
    return modulesWithMeta
      .filter((module) => matchesType(module, activeType))
      .sort((left, right) => {
        if (left.updatedAt || right.updatedAt) {
          if (!left.updatedAt) return 1
          if (!right.updatedAt) return -1
          const updatedDifference = new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
          if (updatedDifference) return updatedDifference
        }

        return left.originalIndex - right.originalIndex
      })
  }, [activeType, modulesWithMeta])

  const totalPages = Math.max(1, Math.ceil(filteredModules.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const visibleModules = filteredModules.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const hasActiveFilters = activeType !== 'all'

  useEffect(() => {
    if (page !== safePage) setPage(safePage)
  }, [page, safePage])

  useEffect(() => {
    window.history.replaceState({
      ...window.history.state,
      productManualHome: {
        activeType,
        page: safePage,
      },
    }, '', window.location.href)
  }, [activeType, safePage])

  const resetAndGoFirstPage = (update) => {
    update()
    setPage(1)
  }

  const resetFilters = () => {
    setActiveType('all')
    setPage(1)
  }

  const openModule = (module) => {
    if (/^https?:\/\//.test(module.route)) {
      window.open(module.route, '_blank', 'noopener,noreferrer')
      return
    }
    onNavigate(module.route)
  }

  const goToPage = (nextPage) => {
    setPage(nextPage)
    window.requestAnimationFrame(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <ProductManualLayout>
      <main className="mx-auto min-h-screen max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <header className="border-b pb-7">
          <h1 className="text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">文档与原型导航</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            集中查找产品文档、功能原型和独立模块，可通过类型、业务分类或关键词快速定位。
          </p>
        </header>

        <section className="sticky top-0 z-20 -mx-4 border-b bg-[#f7f4ef]/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="mx-auto max-w-[1216px]">
            <div className="flex gap-1 overflow-x-auto rounded-lg border bg-card p-1">
              {moduleTypeFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => resetAndGoFirstPage(() => setActiveType(filter.id))}
                  className={`h-9 shrink-0 rounded-md px-4 text-sm font-semibold transition ${
                    activeType === filter.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section ref={contentRef} className="scroll-mt-44 pt-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">全部项目</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                共 {filteredModules.length} 个结果
              </p>
            </div>
            {hasActiveFilters ? (
              <div className="flex flex-wrap gap-2">
                {activeType !== 'all' ? <Badge variant="secondary">{moduleTypeFilters.find((item) => item.id === activeType)?.label}</Badge> : null}
              </div>
            ) : null}
          </div>

          {visibleModules.length ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleModules.map((module) => (
                <PrdModuleCard
                  key={module.id}
                  module={module}
                  businessCategory={module.businessCategory}
                  onOpen={openModule}
                  onShowDetails={setDetailModule}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed bg-card/60 px-6 text-center">
              <Search className="h-8 w-8 text-muted-foreground" />
              <h3 className="mt-4 text-base font-semibold">没有找到匹配的内容</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">请调整关键词、类型或业务分类后重试。</p>
              <Button type="button" onClick={resetFilters} className="mt-5 rounded-md">重置筛选</Button>
            </div>
          )}

          <nav className="mt-7 flex flex-col items-center justify-between gap-3 border-t pt-5 sm:flex-row" aria-label="分页">
            <p className="text-sm text-muted-foreground">
              第 {safePage} / {totalPages} 页，每页最多 {PAGE_SIZE} 个
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage === 1}
                aria-label="上一页"
                className="flex h-9 w-9 items-center justify-center rounded-md border bg-card text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => goToPage(pageNumber)}
                  aria-current={safePage === pageNumber ? 'page' : undefined}
                  className={`h-9 min-w-9 rounded-md border px-3 text-sm font-semibold ${
                    safePage === pageNumber
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'bg-card text-foreground hover:bg-muted'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage === totalPages}
                aria-label="下一页"
                className="flex h-9 w-9 items-center justify-center rounded-md border bg-card text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </nav>
        </section>
      </main>

      <ModuleDetailsModal
        module={detailModule}
        businessCategory={detailModule ? deriveBusinessCategory(detailModule) : ''}
        onClose={() => setDetailModule(null)}
        onOpen={openModule}
      />
    </ProductManualLayout>
  )
}
