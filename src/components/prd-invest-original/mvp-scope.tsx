import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { CheckCircle2, Circle, Clock, Rocket } from "lucide-react"

const mvpItems = [
  "用户端产品列表。",
  "用户端产品详情。",
  "用户认购固定收益。",
  "用户查看订单和持仓。",
  "管理员创建和管理产品。",
  "管理员调整收益率版本。",
  "管理员处理提前退出申请。",
  "管理员手动录入提前退出结算金额。",
  "管理员执行结算。",
  "资金流水。",
  "操作记录。",
]

const phase2Items = [
  "多角色权限。",
  "运营角色。",
  "财务角色。",
  "合规角色。",
  "双人审批。",
  "财务复核。",
  "合规审核。",
  "多级审批流。",
  "更细粒度权限控制。",
  "批量结算。",
  "客户分层收益率。",
  "自动对接外部券商或托管机构。",
  "复利。",
  "工作日历。",
  "节假日顺延。",
  "自动 FIFO 赎回。",
  "自动提前赎回收益计算。",
  "客户手动选择赎回 Lot。",
  "部分赎回自动拆分。",
  "IPO 认购产品。",
  "IPO 产品配置。",
  "IPO 配售结果录入。",
  "IPO 退款处理。",
  "IPO 退出结果和最终收益确认。",
  "IPO 相关附件上传。",
]

export function MVPScope() {
  return (
    <section id="mvp-scope" className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">11</span>
          <h2 className="text-lg font-semibold text-foreground">MVP 与第二阶段</h2>
        </div>
        <p className="text-sm text-muted-foreground">第一阶段先保证稳定、清晰、可测、可对账，不一次性完成复杂金融产品引擎。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">MVP 必须包含</h3>
            <Badge className="bg-accent text-accent-foreground">第一阶段</Badge>
          </div>
          <div className="space-y-2">
            {mvpItems.map((item) => (
              <div key={item} className="flex items-start gap-3 py-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">第二阶段再考虑</h3>
            <Badge variant="outline">Phase 2</Badge>
          </div>
          <div className="space-y-2">
            {phase2Items.map((item) => (
              <div key={item} className="flex items-start gap-3 py-1">
                <Circle className="w-4 h-4 text-muted-foreground/50 mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5 bg-primary/5 border-primary/20">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">给开发和测试的核心总结</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            固定收益第一版采用单利、T+1 起息、自然日、收益率版本分段计算、追加独立 Lot。固定期限产品默认不支持用户自主提前赎回，特殊提前退出走用户申请、管理员人工确认和系统记录。
            这些规则要优先做清楚，确保金额能解释、能复测、能对账。IPO 认购产品保留在本文档底部，作为第二阶段开发内容。
          </p>
        </div>
      </Card>
    </section>
  )
}
