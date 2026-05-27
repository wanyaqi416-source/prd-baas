import { Badge } from '../ui/badge'

export function HeaderBar() {
  return (
    <header id="overview" className="border-b bg-card px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-[1160px]">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent">交互式 PRD 手册</div>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
          Fidere Trust BaaS / Interlace 美国账户集成系统
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
          面向开发团队、产品和运营人员的交互式产品手册。Fidere Trust 是客户可见主系统，Interlace / BaaS 是底层执行工具；页面只展示本地演示数据，不调用真实 API，不接入真实 Interlace，不写数据库。
        </p>
        <div className="mt-7 flex flex-wrap gap-2">
          {['内部 PRD', '后台 Admin', '客户端 Client Portal', 'React Flow', '半自动 MVP', '仅演示数据'].map((item) => (
            <Badge key={item} variant="secondary">{item}</Badge>
          ))}
        </div>
      </div>
    </header>
  )
}
