import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Clock3,
  Landmark,
  RefreshCw,
  TrendingUp,
  WalletCards,
} from 'lucide-react'

import { Button } from '../components/ui/button'
import { ClientTopNav } from './BaasOpeningPrototype'
import {
  getFeaturedRecommendedArticles,
  getHomeRecommendedArticle,
} from '../data/recommendedArticles'

const clientBaseRoute = '/admin/product-manual/recommended-articles-prototype/client'
const clientNavLabels = ['仪表板', '投资']

function ClientPrototypeBar({ onBack, onOpenAdmin }) {
  return (
    <div className="border-b border-blue-100 bg-blue-50/95 px-5 py-2.5">
      <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
          <ArrowLeft className="h-4 w-4" />
          返回原型导航
        </button>
        <button type="button" onClick={onOpenAdmin} className="text-xs font-semibold text-blue-700 hover:text-blue-900">
          打开推荐文章管理
        </button>
      </div>
    </div>
  )
}

function EmptyRecommendation({ title, description }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 text-center">
      <BookOpenText className="h-8 w-8 text-slate-300" strokeWidth={1.6} />
      <h2 className="mt-3 text-base font-semibold text-slate-800">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
    </div>
  )
}

function RecommendationCard({ article, variant = 'featured', onOpen }) {
  const isHome = variant === 'home'

  return (
    <button
      type="button"
      onClick={() => onOpen(article.articleId)}
      className="group flex h-full w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={`打开文章：${article.title}`}
    >
      <span className={`block w-full overflow-hidden bg-slate-100 ${isHome ? 'aspect-[16/8.5]' : 'aspect-[16/9]'}`}>
        <img src={article.cover} alt={article.title} className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.015]" />
      </span>
      <span className="flex min-h-0 flex-1 flex-col px-5 py-4">
        <span className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-normal text-blue-600">
          <BookOpenText className="h-3.5 w-3.5" />
          {isHome ? '热门推荐' : '特色推荐'}
        </span>
        <span className="mt-2 line-clamp-2 text-base font-semibold leading-6 text-slate-900">{article.title}</span>
        <span className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{article.summary}</span>
        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-800">
          {article.buttonText || 'Learn More'}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </button>
  )
}

function ClientPageFrame({ activeNavLabel, onBack, onNavigate, children }) {
  const selectNav = (label) => {
    if (label === '仪表板') onNavigate(clientBaseRoute)
    if (label === '投资') onNavigate(`${clientBaseRoute}/funds`)
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-950">
      <ClientPrototypeBar
        onBack={onBack}
        onOpenAdmin={() => onNavigate('/admin/product-manual/recommended-articles-prototype')}
      />
      <ClientTopNav
        onBack={onBack}
        activeNavLabel={activeNavLabel}
        onNavSelect={selectNav}
        clickableNavLabels={clientNavLabels}
      />
      {children}
    </div>
  )
}

function HomePage({ articles, onBack, onNavigate, onOpenArticle }) {
  const homeArticle = getHomeRecommendedArticle(articles)

  return (
    <ClientPageFrame activeNavLabel="仪表板" onBack={onBack} onNavigate={onNavigate}>
      <main className="mx-auto max-w-[1380px] px-5 py-6">
        <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.7fr)_420px]">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm text-slate-500">总资产</p>
                <div className="mt-2 text-4xl font-semibold text-slate-800">$14,334.32</div>
                <p className="mt-2 text-sm text-red-500">-$1,566.96 · -9.85%</p>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="rounded-lg" onClick={() => onNavigate(`${clientBaseRoute}/funds`)}>
                  <TrendingUp className="h-4 w-4" />
                  查看投资
                </Button>
                <Button type="button" className="rounded-lg bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="h-4 w-4" />
                  兑换
                </Button>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Landmark, label: '香港账户', value: '$9,120.00', detail: '5 个可用币种' },
                { icon: WalletCards, label: '新加坡账户', value: '$4,384.32', detail: '5 个可用币种' },
                { icon: TrendingUp, label: '投资持仓', value: '$830.00', detail: '2 个持仓产品' },
              ].map(({ icon: Icon, label, value, detail }) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Icon className="h-4 w-4 text-blue-500" />
                    {label}
                  </div>
                  <div className="mt-3 text-lg font-semibold text-slate-900">{value}</div>
                  <div className="mt-1 text-xs text-slate-500">{detail}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">最近活动</h2>
                  <p className="mt-1 text-xs text-slate-500">最近完成的账户交易</p>
                </div>
                <Clock3 className="h-5 w-5 text-slate-400" />
              </div>
              <div className="mt-4 divide-y divide-slate-100">
                {[
                  ['资产兑换', '新加坡账户 · USD → SGD', '-500.00 USD'],
                  ['法币转入', '香港账户 · HKD', '+2,000.00 HKD'],
                  ['资金互转', '香港账户 → IBKR', '-50.00 USD'],
                ].map(([label, detail, amount]) => (
                  <div key={`${label}-${detail}`} className="flex items-center gap-3 py-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <RefreshCw className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-slate-800">{label}</span>
                      <span className="block truncate text-xs text-slate-500">{detail}</span>
                    </span>
                    <span className={`text-sm font-semibold ${amount.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>{amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside aria-label="首页热门推荐" className="min-h-[520px]">
            {homeArticle ? (
              <RecommendationCard article={homeArticle} variant="home" onOpen={onOpenArticle} />
            ) : (
              <EmptyRecommendation title="暂无热门推荐" description="后台发布并配置首页热门推荐后，文章将在此处展示。" />
            )}
          </aside>
        </div>
      </main>
    </ClientPageFrame>
  )
}

function FundsPage({ articles, onBack, onNavigate, onOpenArticle }) {
  const featuredArticles = getFeaturedRecommendedArticles(articles)

  return (
    <ClientPageFrame activeNavLabel="投资" onBack={onBack} onNavigate={onNavigate}>
      <main className="mx-auto max-w-[1380px] px-5 py-7">
        <section className="border-b border-slate-200 pb-5">
          <p className="text-sm font-semibold text-blue-600">Investment</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">基金产品</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">查看基金产品与后台配置的英文特色推荐文章。</p>
        </section>

        <section className="py-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">特色推荐</h2>
              <p className="mt-1 text-sm text-slate-500">Featured insights selected for Fidere clients</p>
            </div>
            <span className="text-xs font-medium text-slate-400">{featuredArticles.length} / 3</span>
          </div>

          {featuredArticles.length ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredArticles.map((article) => (
                <RecommendationCard key={article.articleId} article={article} onOpen={onOpenArticle} />
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyRecommendation title="暂无特色推荐" description="已发布且配置为特色推荐的文章会按后台排序展示。" />
            </div>
          )}
        </section>

        <section className="border-t border-slate-200 py-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Global Income Fund', 'Income', 'Moderate', '4.20%'],
              ['Asia Growth Opportunities', 'Growth', 'High', '7.85%'],
              ['USD Liquidity Fund', 'Liquidity', 'Low', '3.68%'],
            ].map(([name, category, risk, returnValue]) => (
              <div key={name} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">{category}</span>
                  <span className="text-xs text-slate-500">Risk: {risk}</span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{name}</h3>
                <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-500">1Y performance</span>
                  <span className="text-lg font-semibold text-emerald-600">{returnValue}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </ClientPageFrame>
  )
}

function ArticleDetailPage({ articles, articleId, onBack, onNavigate }) {
  const article = articles.find((item) => item.articleId === articleId && item.status === 'published') || null

  return (
    <ClientPageFrame activeNavLabel="投资" onBack={onBack} onNavigate={onNavigate}>
      <main className="mx-auto max-w-[980px] px-5 py-7">
        <Button type="button" variant="ghost" onClick={() => onNavigate(`${clientBaseRoute}/funds`)} className="rounded-lg px-2 text-slate-600">
          <ArrowLeft className="h-4 w-4" />
          返回推荐文章
        </Button>

        {article ? (
          <article className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="aspect-[16/7] overflow-hidden bg-slate-100">
              <img src={article.cover} alt={article.title} className="h-full w-full object-cover object-top" />
            </div>
            <div className="px-6 py-7 sm:px-10 sm:py-9">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-normal text-blue-600">
                <BookOpenText className="h-4 w-4" />
                Article
                <span className="text-slate-300">·</span>
                <span className="text-slate-500">English</span>
                <span className="text-slate-300">·</span>
                <span className="font-mono text-slate-500">{article.articleId}</span>
              </div>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-slate-950">{article.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-500">{article.summary}</p>
              <div className="my-7 h-px bg-slate-200" />
              <div
                className="max-w-none text-[15px] leading-7 text-slate-700 [&_a]:font-semibold [&_a]:text-blue-600 [&_a]:underline [&_h2]:mb-3 [&_h2]:mt-7 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-950 [&_img]:my-6 [&_img]:max-h-[520px] [&_img]:w-full [&_img]:rounded-lg [&_img]:object-cover [&_li]:ml-5 [&_li]:py-1 [&_ol]:list-decimal [&_p]:my-4 [&_ul]:list-disc"
                dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
              />
            </div>
          </article>
        ) : (
          <div className="mt-4">
            <EmptyRecommendation title="文章不可访问" description="该文章不存在或已下架。返回推荐页面后将不再看到该文章入口。" />
          </div>
        )}
      </main>
    </ClientPageFrame>
  )
}

export function RecommendedArticlesClientPrototype({
  articles,
  page = 'home',
  articleId = '',
  onBack,
  onNavigate,
}) {
  const openArticle = (nextArticleId) => {
    onNavigate(`${clientBaseRoute}/articles/${encodeURIComponent(nextArticleId)}`)
  }

  if (page === 'article') {
    return (
      <ArticleDetailPage
        articles={articles}
        articleId={articleId}
        onBack={onBack}
        onNavigate={onNavigate}
      />
    )
  }

  if (page === 'funds') {
    return (
      <FundsPage
        articles={articles}
        onBack={onBack}
        onNavigate={onNavigate}
        onOpenArticle={openArticle}
      />
    )
  }

  return (
    <HomePage
      articles={articles}
      onBack={onBack}
      onNavigate={onNavigate}
      onOpenArticle={openArticle}
    />
  )
}
