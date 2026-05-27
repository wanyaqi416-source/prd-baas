import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { ArrowRight, User, Monitor, Database, Wallet } from "lucide-react"

const flowSteps = [
  { icon: User, label: "查看产品", actor: "用户", desc: "浏览产品列表与详情" },
  { icon: Monitor, label: "输入金额", actor: "用户", desc: "输入认购金额" },
  { icon: Monitor, label: "确认风险", actor: "用户", desc: "勾选风险提示" },
  { icon: Database, label: "提交订单", actor: "系统", desc: "创建认购订单" },
  { icon: Database, label: "后台确认", actor: "系统", desc: "自动或人工确认" },
  { icon: Wallet, label: "资金冻结", actor: "系统", desc: "冻结或扣款" },
  { icon: Database, label: "起息", actor: "系统", desc: "T+1 开始计息" },
  { icon: Database, label: "累计收益", actor: "系统", desc: "按规则计算" },
  { icon: Database, label: "到期结算", actor: "系统", desc: "生成结算记录" },
  { icon: Wallet, label: "本息到账", actor: "系统", desc: "资金入账" },
]

export function FixedIncomeFlow() {
  return (
    <section id="fixed-income-flow" className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">05</span>
          <h2 className="text-lg font-semibold text-foreground">固定收益产品规则</h2>
        </div>
        <p className="text-sm text-muted-foreground">从用户浏览到本息到账的完整业务流程</p>
      </div>

      {/* Flow Diagram */}
      <Card className="p-6 overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="flex items-center gap-1">
            {flowSteps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center gap-2 w-20">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    step.actor === "用户" 
                      ? "bg-primary/10 text-primary" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-foreground leading-tight">{step.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                  </div>
                </div>
                {index < flowSteps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-border mx-1 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Calculation Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">固定收益计算规则</h3>
            <Badge variant="outline" className="text-xs">单利</Badge>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-muted/50 rounded-md font-mono text-xs space-y-1">
              <p className="text-muted-foreground">客户收益公式</p>
              <p className="text-foreground">客户收益 = 本金 × 客户年化收益率 × 实际计息天数 ÷ 365</p>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-md font-mono text-xs space-y-1">
              <p className="text-muted-foreground">到期本息公式</p>
              <p className="text-foreground">到期本息 = 本金 + 客户收益</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <p className="text-xs font-medium text-foreground">计算示例</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <span className="text-muted-foreground">本金</span>
              <span className="text-foreground font-mono">100,000 USDT</span>
              <span className="text-muted-foreground">客户年化收益率</span>
              <span className="text-foreground font-mono">5.00%</span>
              <span className="text-muted-foreground">持有天数</span>
              <span className="text-foreground font-mono">30 天</span>
              <span className="text-muted-foreground">客户收益</span>
              <span className="text-accent font-mono font-medium">410.96 USDT</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">第一版明确采用的计算口径</h3>
          
          <div className="space-y-2">
            {[
              { status: "单利", desc: "不做复利", detail: "收益不滚入本金再次计息", color: "bg-emerald-500" },
              { status: "365 天", desc: "年计息天数", detail: "所有固定收益产品统一口径", color: "bg-blue-500" },
              { status: "T+1", desc: "默认起息", detail: "认购日不计息，起息日开始计息", color: "bg-blue-500" },
              { status: "自然日", desc: "第一版口径", detail: "不处理节假日和工作日顺延", color: "bg-amber-500" },
              { status: "分段", desc: "收益率变化", detail: "跨版本持仓按版本区间分段计算", color: "bg-emerald-500" },
              { status: "后端为准", desc: "前端展示", detail: "前端展示结果以后端计算结果为准", color: "bg-slate-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <div className="flex-1 grid grid-cols-3 gap-2 text-xs">
                  <span className="font-medium text-foreground">{item.status}</span>
                  <span className="text-muted-foreground">{item.desc}</span>
                  <span className="text-muted-foreground/70">{item.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Key Rules */}
      <Card className="p-5 bg-muted/30">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-sm font-semibold text-primary">!</span>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">补充说明</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                收益按单利计算，年计息天数 365 天
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                默认 T+1 起息
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                收益率支持后台调整，按生效日期分段计算
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                追加认购生成独立子订单
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                特殊提前退出走管理员审核和人工确认
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                外部采购收益率只用于后台内部测算，不参与客户收益计算
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </section>
  )
}
