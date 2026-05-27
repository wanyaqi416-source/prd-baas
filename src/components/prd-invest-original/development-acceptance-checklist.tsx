import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { CheckSquare, ClipboardCheck } from "lucide-react"

const checklist = {
  user: [
    "用户只能看到自己的订单、持仓和结算结果。",
    "用户可以认购已上架产品。",
    "用户不能看到外部采购收益率。",
    "用户不能看到其他用户数据。",
    "用户不能直接修改订单和收益。",
    "用户只能提交提前退出申请，不能自行计算或执行赎回。",
  ],
  admin: [
    "管理员可以创建、编辑、上架、下架产品。",
    "管理员可以调整客户收益率版本。",
    "管理员可以查看所有用户订单。",
    "管理员可以手动处理提前退出。",
    "管理员可以执行结算。",
    "管理员的关键操作必须有操作记录。",
    "所有资金变化必须有资金流水。",
  ],
  phase2: [
    "多角色权限。",
    "财务复核。",
    "合规审批。",
    "双人审批。",
    "操作人和复核人不能相同。",
    "权限分层展示。",
    "IPO 产品认购、配售、退款和最终收益确认。",
  ],
}

export function DevelopmentAcceptanceChecklist() {
  return (
    <section id="acceptance-checklist" className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">12</span>
          <h2 className="text-lg font-semibold text-foreground">开发验收关注点</h2>
        </div>
        <p className="text-sm text-muted-foreground">用于开发自测、测试用例设计、复测 bug 和管理员对账确认。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChecklistCard title="用户端" badge="MVP" items={checklist.user} tone="primary" />
        <ChecklistCard title="管理员端" badge="MVP" items={checklist.admin} tone="accent" />
        <ChecklistCard title="第二阶段再验收" badge="Phase 2" items={checklist.phase2} tone="muted" />
      </div>
    </section>
  )
}

function ChecklistCard({
  title,
  badge,
  items,
  tone,
}: {
  title: string
  badge: string
  items: string[]
  tone: "primary" | "accent" | "muted"
}) {
  const iconClass = tone === "primary" ? "text-primary" : tone === "accent" ? "text-accent" : "text-muted-foreground"

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardCheck className={`w-4 h-4 ${iconClass}`} />
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <Badge variant="outline" className="text-xs">{badge}</Badge>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
            <CheckSquare className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${iconClass}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
