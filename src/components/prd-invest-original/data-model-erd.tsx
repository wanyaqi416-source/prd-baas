import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { FileCheck2, Landmark, ShieldCheck } from "lucide-react"

const ledgerActions = [
  "认购冻结",
  "认购扣款",
  "到期本金返还",
  "收益入账",
  "特殊提前退出结算",
  "人工调整",
]

const auditActions = [
  "产品创建",
  "产品修改",
  "收益率调整",
  "管理员确认",
  "结算执行",
  "人工调整",
]

export function DataModelERD() {
  return (
    <section id="data-model" className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">09</span>
          <h2 className="text-lg font-semibold text-foreground">账务与审计原则</h2>
        </div>
        <p className="text-sm text-muted-foreground">这里不展开数据库字段或接口设计，只说明开发实现时必须满足的追溯原则。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PrincipleCard
          icon={Landmark}
          title="账务原则"
          badge="Ledger"
          desc="每一笔资金变化，都必须有对应的资金流水记录。资金流水需要能解释金额从哪里来、到哪里去、由什么业务动作触发。"
          items={ledgerActions}
          tone="primary"
        />
        <PrincipleCard
          icon={ShieldCheck}
          title="审计原则"
          badge="Audit Log"
          desc="每一次管理员关键操作，都必须有可追溯的操作记录。第一版不做复杂多级处理流程，但必须保留操作痕迹，方便后续对账、用户解释和内部追踪。"
          items={auditActions}
          tone="accent"
        />
      </div>

      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">实现时需要坚持的边界</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "资金动作不能只改状态，必须留下可对账的流水。",
            "后台关键操作不能只保存最终结果，必须能追溯谁在什么时候做了什么。",
            "已结算记录不能直接覆盖修改，调整应形成新的调整记录。",
            "用户端展示金额需要能从后台流水和确认记录解释清楚。",
          ].map((rule) => (
            <div key={rule} className="p-3 bg-muted/30 rounded text-xs text-muted-foreground">
              {rule}
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}

function PrincipleCard({
  icon: Icon,
  title,
  badge,
  desc,
  items,
  tone,
}: {
  icon: typeof Landmark
  title: string
  badge: string
  desc: string
  items: string[]
  tone: "primary" | "accent"
}) {
  const color = tone === "primary" ? "text-primary bg-primary/10" : "text-accent bg-accent/10"
  const dot = tone === "primary" ? "bg-primary" : "bg-accent"

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <Badge variant="outline" className="text-xs">{badge}</Badge>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={`w-1 h-1 rounded-full ${dot}`} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
