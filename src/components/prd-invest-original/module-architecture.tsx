import { Card } from "../ui/card"
import { cn } from "../../lib/utils"

export function ModuleArchitecture() {
  return (
    <section id="module-architecture" className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">04</span>
          <h2 className="text-lg font-semibold text-foreground">模块职责</h2>
        </div>
        <p className="text-sm text-muted-foreground">固定收益第一版的系统模块结构与各端职责划分</p>
      </div>

      <Card className="p-6 space-y-6">
        {/* Architecture Diagram */}
        <div className="space-y-4">
          {/* Root */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm font-semibold text-foreground">理财产品模块</span>
          </div>

          <div className="ml-4 grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="w-3 h-3 rounded bg-primary/20" />
                <span className="text-sm font-medium text-foreground">固定收益产品</span>
              </div>
              <div className="ml-4 space-y-2">
                <TreeNode label="产品创建与配置" desc="上架、下架、额度、期限" />
                <TreeNode label="收益率版本管理" desc="按生效日期保留历史" highlight />
                <TreeNode label="认购订单处理" desc="用户下单、确认、冻结或扣款" />
                <TreeNode label="持仓与 Lot 管理" desc="每次追加生成独立 Lot" highlight />
                <TreeNode label="收益计算" desc="单利、自然日、分段计算" />
                <TreeNode label="特殊提前退出" desc="用户申请、管理员确认" />
                <TreeNode label="到期结算" desc="到期日还本付息" />
              </div>
            </div>
          </div>
        </div>

        {/* System Layers */}
        <div className="pt-4 border-t border-border space-y-4">
          <p className="text-xs font-medium text-muted-foreground">系统分层</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <LayerCard 
              title="用户端" 
              titleCn="用户自助操作入口"
              items={["产品列表", "产品详情", "认购下单", "我的持仓", "收益和结算查看"]}
              color="primary"
            />
            <LayerCard 
              title="管理员端" 
              titleCn="后台统一处理入口"
              items={["产品管理", "订单处理", "收益率调整", "提前退出处理", "到期结算", "执行结算"]}
              color="secondary"
            />
            <LayerCard 
              title="系统记录" 
              titleCn="资金流水和操作记录"
              items={["资金流水", "操作记录", "结算结果", "调整痕迹", "对账追溯"]}
              color="muted"
            />
          </div>
        </div>
      </Card>
    </section>
  )
}

function TreeNode({ label, desc, highlight = false }: { label: string; desc: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-3 group">
      <div className="flex items-center gap-1.5">
        <div className="w-px h-4 bg-border" />
        <div className={cn(
          "w-1.5 h-1.5 rounded-full",
          highlight ? "bg-accent" : "bg-muted-foreground/50"
        )} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className={cn(
          "text-xs",
          highlight ? "font-medium text-foreground" : "text-muted-foreground"
        )}>{label}</span>
        <span className="text-xs text-muted-foreground/70">{desc}</span>
      </div>
    </div>
  )
}

function LayerCard({ 
  title, 
  titleCn, 
  items, 
  color 
}: { 
  title: string
  titleCn: string
  items: string[]
  color: "primary" | "secondary" | "accent" | "muted"
}) {
  const colorStyles = {
    primary: "border-l-primary bg-primary/5",
    secondary: "border-l-foreground/30 bg-secondary/50",
    accent: "border-l-accent bg-accent/5",
    muted: "border-l-muted-foreground/30 bg-muted/50",
  }

  return (
    <div className={cn("border-l-2 pl-3 py-2 rounded-r-md", colorStyles[color])}>
      <p className="text-xs font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mb-2">{titleCn}</p>
      <ul className="space-y-0.5">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/50" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
