import { Badge } from "../ui/badge"
import { Card } from "../ui/card"
import { ArrowRight, CalendarDays, CheckCircle2 } from "lucide-react"

const rules = [
  "起息日 = 认购日 + 1 天。",
  "到期日 = 起息日 + 产品期限。",
  "结算日 = 到期日。",
  "第一版按自然日处理。",
  "不处理工作日顺延。",
  "不接入节假日市场日历。",
]

const reasons = [
  "第一版规则需要简单稳定。",
  "不同市场节假日规则复杂，容易带来解释和测试成本。",
  "按自然日方便开发、测试、管理员和用户统一理解。",
  "工作日历和节假日顺延放到第二阶段。",
]

export function MaturityDateRules() {
  return (
    <section id="maturity-rules" className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">08</span>
          <h2 className="text-lg font-semibold text-foreground">到期日规则</h2>
        </div>
        <p className="text-sm text-muted-foreground">第一版按自然日和固定公式处理，先保证规则稳定可复测。</p>
      </div>

      <Card className="p-6 overflow-x-auto">
        <div className="min-w-[720px] flex items-center justify-between gap-4">
          <DateNode title="认购日" date="2026-05-01" desc="用户提交认购" />
          <ArrowRight className="w-5 h-5 text-border shrink-0" />
          <DateNode title="起息日" date="2026-05-02" desc="T+1 开始计息" active />
          <ArrowRight className="w-5 h-5 text-border shrink-0" />
          <DateNode title="到期日" date="2026-06-01" desc="起息日 + 30 天" />
          <ArrowRight className="w-5 h-5 text-border shrink-0" />
          <DateNode title="结算日" date="2026-06-01" desc="到期日即结算日" accent />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">第一版采用规则</h3>
          </div>
          <ul className="space-y-2">
            {rules.map((rule) => (
              <li key={rule} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 space-y-4 bg-muted/30">
          <h3 className="text-sm font-semibold text-foreground">这样处理的原因</h3>
          <ul className="space-y-2">
            {reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  )
}

function DateNode({ title, date, desc, active = false, accent = false }: {
  title: string
  date: string
  desc: string
  active?: boolean
  accent?: boolean
}) {
  const style = active
    ? "border-primary/30 bg-primary/5"
    : accent
      ? "border-accent/30 bg-accent/10"
      : "border-border bg-background"

  return (
    <div className={`w-40 rounded-md border p-3 text-center ${style}`}>
      <Badge variant="outline" className="text-xs mb-2">{title}</Badge>
      <p className="text-sm font-mono font-semibold text-foreground">{date}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </div>
  )
}
