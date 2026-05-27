import { Badge } from "../ui/badge"
import { Card } from "../ui/card"
import { CheckCircle2, Shield } from "lucide-react"

const userPermissions = [
  "查看产品",
  "提交认购",
  "查看订单",
  "查看持仓",
  "查看收益",
  "查看退款",
  "查看结算状态",
  "提交提前退出申请",
]

const adminPermissions = [
  "管理产品",
  "管理收益率",
  "管理订单",
  "管理持仓",
  "处理提前退出",
  "执行结算",
  "查看资金流水",
  "查看操作记录",
]

export function RolePermissionMatrix() {
  return (
    <section id="permissions" className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">10</span>
          <h2 className="text-lg font-semibold text-foreground">第一版角色权限说明</h2>
        </div>
        <p className="text-sm text-muted-foreground">第一版 MVP 只区分用户和管理员，不做复杂角色分层。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PermissionCard title="用户端权限" badge="用户" items={userPermissions} tone="primary" />
        <PermissionCard title="管理员权限" badge="管理员" items={adminPermissions} tone="accent" />
      </div>

      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">第一版权限边界</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="p-3 bg-muted/30 rounded">用户只能查看自己的订单、持仓、退款、收益和结算结果。</div>
          <div className="p-3 bg-muted/30 rounded">用户不能看到外部采购收益率、平台利差或其他用户数据。</div>
          <div className="p-3 bg-muted/30 rounded">管理员统一处理固定收益产品、订单、收益率、提前退出和结算。</div>
          <div className="p-3 bg-muted/30 rounded">管理员关键操作必须有操作记录，资金变化必须有资金流水。</div>
        </div>
      </Card>

      <Card className="p-5 bg-primary/5 border-primary/20">
        <p className="text-sm font-medium text-foreground">
          第一版不做复杂角色分层，所有后台操作统一由管理员完成；第二阶段再拆分运营、财务、合规、复核人等角色。
        </p>
      </Card>
    </section>
  )
}

function PermissionCard({ title, badge, items, tone }: {
  title: string
  badge: string
  items: string[]
  tone: "primary" | "accent"
}) {
  const iconClass = tone === "primary" ? "text-primary" : "text-accent"

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Badge variant="outline" className="text-xs">{badge}</Badge>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${iconClass}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
