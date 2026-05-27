import { useMemo, useState } from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Input } from "../ui/input"
import { ArrowDownToLine, ArrowRight, CheckCircle2, FileCheck2, Layers, ShieldCheck } from "lucide-react"

type DemoLot = {
  id: string
  label: string
  source: string
  principal: number
  valueDate: string
  maturityDate: string
  rate: number
  tone: "primary" | "accent" | "muted"
}

const initialDemoLots: DemoLot[] = [
  {
    id: "A",
    label: "订单 A",
    source: "首次认购",
    principal: 100000,
    valueDate: "2026-05-02",
    maturityDate: "2026-06-01",
    rate: 0.05,
    tone: "primary",
  },
  {
    id: "B",
    label: "订单 B",
    source: "追加认购",
    principal: 50000,
    valueDate: "2026-05-11",
    maturityDate: "2026-06-10",
    rate: 0.05,
    tone: "accent",
  },
]

const topUpLot: DemoLot = {
  id: "C",
  label: "订单 C",
  source: "追加认购",
  principal: 30000,
  valueDate: "2026-05-21",
  maturityDate: "2026-06-20",
  rate: 0.045,
  tone: "muted",
}

const exitFlow = [
  "用户提交提前退出申请",
  "管理员审核",
  "管理员录入退款金额和收益",
  "管理员确认结算",
  "系统记录流水和操作日志",
  "用户查看到账结果",
]

const firstVersionRules = [
  "固定收益产品默认不支持用户自主提前赎回。",
  "不做自动 FIFO 赎回。",
  "不做自动提前赎回收益计算。",
  "不允许用户自行选择赎回哪一笔 Lot。",
  "如果产品确实允许特殊提前退出，只能由用户提交申请。",
  "管理员审核申请，并手动录入退还本金、应付收益、扣减费用和最终结算金额。",
  "管理员确认后执行结算。",
  "所有人工录入、审核和结算动作必须有操作记录。",
  "所有资金变化必须有对应资金流水。",
]

const designReasons = [
  "第一版开发难度更低。",
  "固定期限产品本身通常不鼓励提前赎回。",
  "底层资产提前退出可能存在不确定成本。",
  "自动计算容易产生争议。",
  "人工确认可以根据实际外部退出情况处理。",
  "管理员人工确认可以根据实际外部退出情况处理。",
  "保留审计和流水后，后续可以追溯。",
]

const phase2Rules = [
  "自动 FIFO 赎回。",
  "自动提前赎回收益计算。",
  "用户选择具体 Lot 赎回。",
  "部分赎回自动拆分。",
]

export function PositionLotStructure() {
  const [demoLots, setDemoLots] = useState(initialDemoLots)
  const [exitAmount, setExitAmount] = useState("120000")
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)

  const totalPrincipal = demoLots.reduce((sum, lot) => sum + lot.principal, 0)
  const numericExitAmount = Math.max(0, Number(exitAmount) || 0)
  const manualSettlement = useMemo(() => {
    const requestedPrincipal = Math.min(numericExitAmount, totalPrincipal)
    const payableInterest = applicationSubmitted ? 680 : 0
    const fee = applicationSubmitted ? 120 : 0
    return {
      requestedPrincipal,
      payableInterest,
      fee,
      finalAmount: requestedPrincipal + payableInterest - fee,
    }
  }, [applicationSubmitted, numericExitAmount, totalPrincipal])

  const handleTopUp = () => {
    setDemoLots((lots) => lots.some((lot) => lot.id === topUpLot.id) ? lots : [...lots, topUpLot])
    setApplicationSubmitted(false)
  }

  const handleSubmitApplication = () => {
    if (numericExitAmount <= 0) return
    setApplicationSubmitted(true)
  }

  const handleReset = () => {
    setDemoLots(initialDemoLots)
    setExitAmount("120000")
    setApplicationSubmitted(false)
  }

  return (
    <section id="position-structure" className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">07</span>
          <h2 className="text-lg font-semibold text-foreground">追加认购与提前退出规则</h2>
        </div>
        <p className="text-sm text-muted-foreground">追加认购生成独立 Lot；固定收益默认不支持用户自主提前赎回。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">追加认购规则</h3>
          </div>
          
          <p className="text-xs text-muted-foreground leading-relaxed">
            追加认购不合并到原订单。每一次追加都生成一笔独立子订单 / Lot。每笔资金有自己的起息日、到期日和收益计算区间。
          </p>

          <div className="p-4 bg-muted/30 rounded-md space-y-4">
            <div className="text-center">
              <Badge className="bg-primary/10 text-primary border-0">用户持仓聚合视图</Badge>
              <p className="text-xs text-muted-foreground mt-2">30 天固定收益产品</p>
              <p className="text-sm font-mono font-semibold text-foreground">总持仓: 150,000 USDT</p>
            </div>

            <div className="flex justify-center">
              <ArrowDownToLine className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <StaticLotCard label="订单 A - 首次认购" amount="100,000 USDT" valueDate="2026-05-02" maturityDate="2026-06-01" tone="primary" />
              <StaticLotCard label="订单 B - 追加认购" amount="50,000 USDT" valueDate="2026-05-11" maturityDate="2026-06-10" tone="accent" />
            </div>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-md space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-foreground">追加认购计算演示</p>
              <Badge variant="outline" className="text-xs">单利 / 365 天</Badge>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 bg-background rounded border border-border space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-sans font-medium text-foreground">订单 A 收益</span>
                  <span className="text-primary font-semibold">410.96 USDT</span>
                </div>
                <p className="text-muted-foreground">100,000 × 5.00% × 30 ÷ 365</p>
              </div>

              <div className="p-3 bg-background rounded border border-accent/30 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-sans font-medium text-foreground">订单 B 收益</span>
                  <span className="text-accent font-semibold">205.48 USDT</span>
                </div>
                <p className="text-muted-foreground">50,000 × 5.00% × 30 ÷ 365</p>
              </div>
            </div>

            <div className="pt-3 border-t border-primary/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">总本金</span>
                <span className="font-mono font-semibold text-foreground">150,000 USDT</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">累计收益</span>
                <span className="font-mono font-semibold text-primary">616.44 USDT</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">到期本息合计</span>
                <span className="font-mono font-semibold text-foreground">150,616.44 USDT</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              页面可以聚合展示总本金和累计收益，但底层必须按每一笔 Lot 独立计算后再汇总。
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">独立 Lot 的优势</p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {[
                "每笔资金有自己的起息日和到期日。",
                "每笔资金可以按命中的收益率版本独立计算。",
                "收益计算更清晰，避免混合计算复杂度。",
                "对账、追溯、用户解释都更简单。",
                "特殊提前退出时，管理员可以清楚看到用户每笔资金的来源和期限。",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold text-foreground">提前退出 / 提前赎回规则</h3>
          </div>

          <div className="p-4 bg-accent/5 border border-accent/20 rounded-md space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-accent/20 text-accent-foreground border-0 text-xs">MVP</Badge>
              <span className="text-xs font-medium text-foreground">只走申请和人工确认</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              第一版不开放用户自主提前赎回入口，也不由系统自动计算提前退出金额。确有特殊提前退出时，用户只能提交申请，管理员人工确认金额并执行结算。
            </p>
          </div>

          <ul className="space-y-2">
            {firstVersionRules.map((rule) => (
              <li key={rule} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5 space-y-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">特殊提前退出流程</h3>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[960px] flex items-center gap-2">
            {exitFlow.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-28 min-h-20 rounded-md border p-3 text-center ${
                  index === 0 ? "border-primary/30 bg-primary/5" :
                  index >= 6 ? "border-accent/30 bg-accent/10" :
                  "border-border bg-muted/30"
                }`}>
                  <p className="text-xs font-medium text-foreground leading-relaxed">{step}</p>
                </div>
                {index < exitFlow.length - 1 && <ArrowRight className="w-4 h-4 text-border mx-2 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-5 space-y-5 border-primary/20 bg-primary/5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-0">用户端 Demo</Badge>
              <h3 className="text-sm font-semibold text-foreground">提前退出申请演示</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              用户端只展示申请入口，不展示自动赎回、自动收益或选择 Lot 的功能；结算金额由管理员人工确认。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={handleTopUp} disabled={demoLots.some((lot) => lot.id === topUpLot.id)}>
              追加 30,000
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset}>
              重置
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <DemoMetric label="用户持仓本金" value={`${formatMoney(totalPrincipal)} USDT`} active />
          <DemoMetric label="可自主赎回金额" value="0 USDT" />
          <DemoMetric label="当前处理方式" value="提交申请" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-foreground">持仓 Lot 明细</p>
              <span className="text-xs text-muted-foreground">用户不能自行选择具体 Lot 退出</span>
            </div>
            <div className="space-y-2">
              {demoLots.map((lot) => (
                <div key={lot.id} className="rounded-md border border-border bg-background p-3">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${lot.tone === "primary" ? "bg-primary" : lot.tone === "accent" ? "bg-accent" : "bg-muted-foreground"}`} />
                      <span className="text-xs font-semibold text-foreground">{lot.label}</span>
                      <Badge variant="outline" className="text-xs">{lot.source}</Badge>
                    </div>
                    <span className="text-xs font-mono text-foreground">{formatMoney(lot.principal)} USDT</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                    <span>起息 {lot.valueDate}</span>
                    <span>到期 {lot.maturityDate}</span>
                    <span>收益率 {(lot.rate * 100).toFixed(2)}%</span>
                    <span>状态 持有中</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-md border border-border bg-background p-4">
            <p className="text-xs font-medium text-foreground">提前退出申请</p>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground" htmlFor="exit-amount">
                申请退出金额
              </label>
              <Input
                id="exit-amount"
                value={exitAmount}
                onChange={(event) => {
                  setExitAmount(event.target.value)
                  setApplicationSubmitted(false)
                }}
                inputMode="numeric"
                className="h-9 text-sm"
              />
              <Button size="sm" onClick={handleSubmitApplication} disabled={numericExitAmount <= 0}>
                提交提前退出申请
              </Button>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-medium text-foreground">管理员人工确认结果示例</p>
              {applicationSubmitted ? (
                <div className="space-y-2">
                  <SettlementLine label="人工确认退还本金" value={manualSettlement.requestedPrincipal} />
                  <SettlementLine label="人工确认应付收益" value={manualSettlement.payableInterest} />
                  <SettlementLine label="人工确认扣减费用" value={manualSettlement.fee} negative />
                  <div className="flex items-center justify-between rounded bg-primary/10 px-3 py-2 text-xs">
                    <span className="text-foreground font-medium">管理员确认后到账</span>
                    <span className="font-mono text-primary font-semibold">{formatMoney(manualSettlement.finalAmount)} USDT</span>
                  </div>
                </div>
              ) : (
                <p className="rounded bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  用户提交申请后，管理员才会人工录入本金、收益、费用和最终结算金额。
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">为什么这样设计</h3>
          <ul className="space-y-2">
            {designReasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 space-y-4 bg-muted/30">
          <h3 className="text-sm font-semibold text-foreground">第二阶段再考虑</h3>
          <ul className="space-y-2">
            {phase2Rules.map((rule) => (
              <li key={rule} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">页面展示与底层计算口径</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            "前端持仓列表可以聚合展示总本金、累计收益和产品名称。",
            "持仓详情页需要分开展示订单 A、订单 B 等每一笔 Lot。",
            "底层收益必须按每一笔 Lot 独立计算，再汇总展示。",
            "聚合持仓金额必须等于所有未结清 Lot 的剩余本金合计。",
            "固定收益默认不展示自主赎回按钮。",
            "特殊提前退出申请不能自动生成结算金额。",
            "人工录入、审核、确认和结算动作必须可追溯。",
            "每一笔退款、收益、费用扣减和最终到账都必须有资金流水。",
          ].map((rule) => (
            <div key={rule} className="flex items-start gap-2 p-3 bg-muted/30 rounded">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{rule}</span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}

function StaticLotCard({ label, amount, valueDate, maturityDate, tone }: {
  label: string
  amount: string
  valueDate: string
  maturityDate: string
  tone: "primary" | "accent"
}) {
  return (
    <div className={`p-3 bg-background rounded border ${tone === "primary" ? "border-border" : "border-accent/30"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${tone === "primary" ? "bg-primary" : "bg-accent"}`} />
          <span className="text-xs font-medium text-foreground">{label}</span>
        </div>
        <span className="text-xs font-mono text-foreground">{amount}</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <span>起息日: {valueDate}</span>
        <span>到期日: {maturityDate}</span>
      </div>
    </div>
  )
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function DemoMetric({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={`rounded-md border p-3 ${active ? "border-primary/30 bg-background" : "border-border bg-background/70"}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-mono font-semibold text-foreground">{value}</p>
    </div>
  )
}

function SettlementLine({ label, value, negative = false }: { label: string; value: number; negative?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded bg-muted/40 px-3 py-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-foreground">{negative ? "-" : ""}{formatMoney(value)} USDT</span>
    </div>
  )
}
