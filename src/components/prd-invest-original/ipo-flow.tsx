import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { ArrowDown, User, Monitor, Database, Wallet, FileCheck, Users } from "lucide-react"

const customerFlow = [
  { icon: User, label: "查看 IPO 产品", desc: "浏览 IPO 列表" },
  { icon: Monitor, label: "输入认购金额", desc: "填写申购金额" },
  { icon: Monitor, label: "确认风险提示", desc: "勾选 IPO 风险" },
  { icon: Database, label: "提交认购订单", desc: "创建订单" },
  { icon: Wallet, label: "资金冻结", desc: "冻结认购资金" },
]

const backendFlow = [
  { icon: Database, label: "认购截止", desc: "停止接单" },
  { icon: FileCheck, label: "录入配售结果", desc: "管理员操作" },
  { icon: Wallet, label: "未获配退款", desc: "退款处理" },
  { icon: Database, label: "上市/退出", desc: "等待退出" },
  { icon: Users, label: "人工录入收益", desc: "后台确认" },
  { icon: FileCheck, label: "管理员确认结算", desc: "确认最终金额" },
  { icon: Wallet, label: "用户结算到账", desc: "资金入账" },
]

export function IPOFlow() {
  return (
    <section id="phase2-ipo-flow" className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">13</span>
          <h2 className="text-lg font-semibold text-foreground">第二阶段：IPO 认购、配售与退款规则</h2>
        </div>
        <p className="text-sm text-muted-foreground">本内容保留为第二阶段开发范围，第一版 MVP 主线不包含 IPO 认购产品。</p>
      </div>

      {/* Flow Diagram */}
      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Side */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-0">用户流程</Badge>
              <span className="text-xs text-muted-foreground">用户端操作</span>
            </div>
            <div className="space-y-3">
              {customerFlow.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium text-foreground">{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground pt-1">0{index + 1}</span>
                  </div>
                  {index < customerFlow.length - 1 && (
                    <div className="absolute left-5 top-12 w-px h-4 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Backend Side */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-accent/20 text-accent-foreground border-0">后台流程</Badge>
              <span className="text-xs text-muted-foreground">管理员操作</span>
            </div>
            <div className="space-y-3">
              {backendFlow.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <step.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium text-foreground">{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground pt-1">0{index + 6}</span>
                  </div>
                  {index < backendFlow.length - 1 && (
                    <div className="absolute left-5 top-12 w-px h-4 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">为什么 IPO 不自动计算最终收益</h3>
          
          <ul className="space-y-2 text-xs text-muted-foreground">
            {[
              "每个用户认购金额不同。",
              "实际获配金额不同。",
              "每个用户退出时间可能不同。",
              "退出价格可能不同。",
              "费用、融资成本、渠道费用可能不同。",
              "可能存在未获配、部分获配、全额获配。",
              "可能存在分批退出或特殊安排。",
            ].map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">第二阶段处理原则</h3>
          
          <ul className="space-y-2 text-xs text-muted-foreground">
            {[
              "系统管理流程，不自动推导最终收益。",
              "系统记录认购、冻结、配售、退款、退出和收益确认。",
              "最终收益由管理员人工录入。",
              "管理员确认后才结算给用户。",
              "用户端只展示确认后的结果，不展示预估收益。",
            ].map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">IPO 配售和退款规则</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "未获配",
              rules: ["获配金额为 0。", "认购资金扣除必要费用后退回。"],
            },
            {
              title: "部分获配",
              rules: ["部分认购资金被使用。", "只扣除实际获配金额和相关费用，剩余金额退回。"],
            },
            {
              title: "全额获配",
              rules: ["认购资金全部使用。", "退款金额可能为 0。"],
            },
          ].map((item) => (
            <div key={item.title} className="p-4 bg-muted/30 rounded-md border border-border space-y-3">
              <Badge variant="outline" className="text-xs">{item.title}</Badge>
              <ul className="space-y-1.5">
                {item.rules.map((rule) => (
                  <li key={rule} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          配售和退款结果由管理员确认后，才更新用户资金展示。
        </p>
      </Card>

      {/* Key Rules */}
      <Card className="p-5 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-sm font-semibold text-accent">!</span>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">IPO 核心业务规则</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-accent" />
                IPO 最终收益不自动计算，以人工确认为准
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-accent" />
                每个用户的退出时间和条件可能不同
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-accent" />
                最终收益由管理员人工确认
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-accent" />
                支持上传券商成交单、配售确认文件等附件
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-accent" />
                用户端不展示预估收益
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-accent" />
                收益结算需要管理员确认
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </section>
  )
}
