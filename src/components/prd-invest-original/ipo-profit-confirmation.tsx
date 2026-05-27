import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { ArrowRight, FileText, Calculator, CheckCircle, Upload } from "lucide-react"

const approvalSteps = [
  { icon: Calculator, label: "管理员录入配售结果", desc: "录入获配和退款结果", actor: "管理员" },
  { icon: Calculator, label: "管理员录入最终收益", desc: "录入退出和收益结果", actor: "管理员" },
  { icon: CheckCircle, label: "管理员确认结算", desc: "确认最终金额", actor: "管理员" },
  { icon: FileText, label: "系统记录结果", desc: "记录流水和操作日志", actor: "系统" },
]

const inputFields = [
  { label: "实际获配股数", example: "2,000 股" },
  { label: "实际使用金额", example: "48,000 HKD" },
  { label: "未获配退款金额", example: "52,000 HKD" },
  { label: "退出价格", example: "28.50 HKD" },
  { label: "退出日期", example: "2026-06-15" },
  { label: "毛收益", example: "9,000 HKD" },
  { label: "手续费", example: "500 HKD" },
  { label: "融资成本", example: "200 HKD" },
  { label: "净收益", example: "8,300 HKD" },
  { label: "最终到账金额", example: "60,300 HKD" },
]

export function IPOProfitConfirmation() {
  return (
    <section id="phase2-ipo-profit" className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">14</span>
          <h2 className="text-lg font-semibold text-foreground">第二阶段：IPO 最终收益确认规则</h2>
        </div>
        <p className="text-sm text-muted-foreground">本内容作为第二阶段开发说明：管理员人工录入配售、退款和最终收益，管理员确认后由系统结算并记录流水。</p>
      </div>

      {/* Approval Flow */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">管理员录入 → 管理员确认 → 系统结算</h3>
        
        <div className="overflow-x-auto">
        <div className="min-w-[720px] flex items-center justify-between">
          {approvalSteps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  index === 0 ? "bg-primary/10 text-primary" :
                  index === 1 ? "bg-blue-500/10 text-blue-500" :
                  index === 2 ? "bg-accent/10 text-accent" :
                  "bg-emerald-500/10 text-emerald-500"
                }`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-foreground">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                  <Badge variant="outline" className="text-xs mt-1">{step.actor}</Badge>
                </div>
              </div>
              {index < approvalSteps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-border mx-4" />
              )}
            </div>
          ))}
        </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Fields */}
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">人工确认内容</h3>
          
          <div className="space-y-2">
            {inputFields.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
                <span className="text-xs font-mono text-foreground">{item.example}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Attachment Requirements */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">附件留痕要求</h3>
          </div>
          
          <p className="text-xs text-muted-foreground">
            管理员应支持上传附件，用于后续对账和追溯。
          </p>

          <div className="space-y-2">
            {[
              { type: "配售确认文件", desc: "券商发出的正式配售通知", required: true },
              { type: "券商成交单", desc: "股票买卖交易确认", required: true },
              { type: "退出成交记录", desc: "卖出股票的交易记录", required: true },
              { type: "费用明细", desc: "手续费、融资成本等明细", required: false },
              { type: "用户确认文件", desc: "用户签字确认（如适用）", required: false },
              { type: "内部处理记录", desc: "管理员处理过程截图或说明", required: false },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${item.required ? "bg-primary" : "bg-muted-foreground/50"}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">{item.type}</span>
                    {item.required && <Badge variant="outline" className="text-xs">必需</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Example Calculation */}
      <Card className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">结算示例</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Initial */}
          <div className="p-4 bg-muted/30 rounded-md space-y-3">
            <p className="text-xs font-medium text-foreground">用户认购</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">认购金额</span>
                <span className="font-mono text-foreground">100,000 HKD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IPO 项目</span>
                <span className="text-foreground">XXX Tech (1234.HK)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">招股价</span>
                <span className="font-mono text-foreground">24.00 HKD</span>
              </div>
            </div>
          </div>

          {/* Allocation */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-md space-y-3">
            <p className="text-xs font-medium text-foreground">配售结果</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">获配股数</span>
                <span className="font-mono text-foreground">2,000 股</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">获配金额</span>
                <span className="font-mono text-foreground">48,000 HKD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">退款金额</span>
                <span className="font-mono text-primary">52,000 HKD</span>
              </div>
            </div>
          </div>

          {/* Final */}
          <div className="p-4 bg-accent/10 border border-accent/30 rounded-md space-y-3">
            <p className="text-xs font-medium text-foreground">最终结算</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">退出价格</span>
                <span className="font-mono text-foreground">28.50 HKD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">毛收益</span>
                <span className="font-mono text-foreground">9,000 HKD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">费用合计</span>
                <span className="font-mono text-foreground">-700 HKD</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-accent/30">
                <span className="font-medium text-foreground">最终到账</span>
                <span className="font-mono font-semibold text-accent">60,300 HKD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">说明：</span>
            最终到账 = 退款金额 (52,000) + 净收益 (8,300) = 60,300 HKD。
            用户端仅展示最终确认金额，不展示系统预估。
          </p>
        </div>
      </Card>

      <Card className="p-5 bg-accent/5 border-accent/20 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">确认和调整原则</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs text-muted-foreground">
          {[
            "IPO 收益涉及人工确认，必须由管理员确认后才能结算。",
            "不同用户退出条件可能不同，不能用统一公式直接推导最终收益。",
            "第一版不做复杂审批流，但必须保留操作记录。",
            "已结算结果不能直接修改。",
            "如结算后需要调整，应走调整流程。",
            "本页只解释业务逻辑，不展开具体账务设计。",
          ].map((rule) => (
            <li key={rule} className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  )
}
