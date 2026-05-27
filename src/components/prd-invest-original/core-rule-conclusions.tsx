import { Badge } from "../ui/badge"
import { Card } from "../ui/card"
import { CheckCircle2, TrendingUp } from "lucide-react"

const fixedIncomeRules = [
  "第一版只做单利，不做复利。",
  "默认 T+1 起息，认购日不计息。",
  "第一版按自然日计算，不处理节假日和工作日顺延。",
  "收益率变更必须保留历史版本，不能覆盖原收益率。",
  "每次追加认购都生成独立子订单 / Lot。",
  "固定收益产品默认不支持用户自主提前赎回。",
  "特殊提前退出只能由用户提交申请，管理员人工确认本金、收益和费用。",
  "管理员确认后，系统才执行提前退出结算并记录流水。",
  "外部采购收益率只在后台内部使用，客户收益率用于客户展示和收益计算。",
]

export function CoreRuleConclusions() {
  return (
    <section id="core-rules" className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">02</span>
          <h2 className="text-lg font-semibold text-foreground">核心规则结论</h2>
        </div>
        <p className="text-sm text-muted-foreground">先把固定收益第一版最需要确认的规则放在最前面。</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RuleCard
          icon={TrendingUp}
          title="固定收益产品"
          badge="固定收益"
          tone="primary"
          rules={fixedIncomeRules}
        />
      </div>

      <Card className="p-5 bg-primary/5 border-primary/20">
        <p className="text-sm font-medium text-foreground">
          第一版只聚焦固定收益产品，不做复杂金融产品引擎，优先保证规则清楚、金额可对账、操作可审计、测试可复测、开发难度可控。
        </p>
      </Card>
    </section>
  )
}

function RuleCard({
  icon: Icon,
  title,
  badge,
  tone,
  rules,
}: {
  icon: typeof TrendingUp
  title: string
  badge: string
  tone: "primary" | "accent"
  rules: string[]
}) {
  const iconClass = tone === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
  const dotClass = tone === "primary" ? "text-primary" : "text-accent"

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <Badge variant="outline" className="text-xs">{badge}</Badge>
      </div>

      <ul className="space-y-2">
        {rules.map((rule) => (
          <li key={rule} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
            <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${dotClass}`} />
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
