import { useState } from 'react'

import { transferScenarioKeys, transferSimulatorScenarios } from '../../data/prdData'
import { money } from '../../lib/utils'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { KeyValueTable } from './KeyValueTable'
import { SectionHeader } from './SectionHeader'

function MiniStepper({ steps, current }) {
  return (
    <div className="grid gap-2 md:grid-cols-4 xl:grid-cols-6">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`rounded-2xl border p-3 text-xs font-semibold ${
            index < current
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : index === current
                ? 'border-primary bg-primary text-primary-foreground'
                : 'bg-muted/60 text-muted-foreground'
          }`}
        >
          <div className="text-[10px] uppercase tracking-wide">步骤 {index + 1}</div>
          <div className="mt-1 leading-snug">{step}</div>
        </div>
      ))}
    </div>
  )
}

export function TransferInOutSimulator({ embedded = false }) {
  const [activeScenario, setActiveScenario] = useState('inA')
  const [currentStep, setCurrentStep] = useState(0)
  const scenario = transferSimulatorScenarios[activeScenario]
  const currentStatus = scenario.steps[currentStep]
  const progressRatio = scenario.steps.length <= 1 ? 1 : currentStep / (scenario.steps.length - 1)
  const posted = currentStep === scenario.steps.length - 1
  const balance = {
    ...scenario.balance,
    client_available_balance: scenario.balance.client_available_balance + (posted && activeScenario.startsWith('in') ? scenario.amount : 0),
    pending_incoming_balance: activeScenario === 'inA' && posted ? 0 : scenario.balance.pending_incoming_balance,
    pending_transfer_in_balance: activeScenario === 'inB' && posted ? 0 : scenario.balance.pending_transfer_in_balance,
    processing_outgoing_balance: activeScenario.startsWith('out') && posted ? 0 : scenario.balance.processing_outgoing_balance,
    frozen_balance: posted ? 0 : scenario.balance.frozen_balance,
  }
  const balanceRows = Object.entries(scenario.balance).map(([key, value]) => [
    key,
    money(balance[key] ?? value),
    key === 'interlace_actual_balance' ? '仅后台可见' : '台账影响',
  ])

  const selectScenario = (key) => {
    setActiveScenario(key)
    setCurrentStep(0)
  }

  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, scenario.steps.length - 1))
  const goPrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 0))
  const reset = () => setCurrentStep(0)

  const content = (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="交互式演示"
        title="转入 / 转出模拟器"
        description="通过四种场景模拟转入 / 转出的状态变化、客户端视图、后台 Admin 视图、余额影响和客户不可见字段。所有数据均为本地模拟状态。"
        badges={['本地状态', '不调用 API', '必须审计留痕']}
      />
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 rounded-2xl bg-muted p-2">
          {transferScenarioKeys.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => selectScenario(key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeScenario === key
                  ? 'bg-card text-foreground'
                  : 'text-muted-foreground hover:bg-card/60 hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle>{scenario.title}</CardTitle>
                {scenario.subtitle ? <p className="mt-1 text-xs text-muted-foreground">{scenario.subtitle}</p> : null}
                <p className="mt-2 text-sm text-muted-foreground">
                  当前状态：<Badge>{currentStatus}</Badge>
                  <span className="ml-2">步骤 {currentStep + 1} / {scenario.steps.length}</span>
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary transition-all" style={{ width: `${progressRatio * 100}%` }} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" disabled={currentStep === 0} onClick={goPrevious}>上一步</Button>
                <Button type="button" disabled={currentStep === scenario.steps.length - 1} onClick={goNext}>下一步</Button>
                <Button type="button" variant="secondary" onClick={reset}>重置演示</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <MiniStepper steps={scenario.steps} current={currentStep} />
            <div className="grid gap-4 xl:grid-cols-2">
              <Card className="border-emerald-200 bg-emerald-50/50">
                <CardHeader><CardTitle className="text-base">客户端视图 / Client Portal</CardTitle></CardHeader>
                <CardContent><KeyValueTable rows={scenario.client} /></CardContent>
              </Card>
              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader><CardTitle className="text-base">后台 Admin 视图 / Admin Console</CardTitle></CardHeader>
                <CardContent><KeyValueTable rows={scenario.admin} /></CardContent>
              </Card>
            </div>
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <Card>
                <CardHeader><CardTitle className="text-base">余额影响 / Balance Impact</CardTitle></CardHeader>
                <CardContent>
                  <KeyValueTable rows={balanceRows} />
                </CardContent>
              </Card>
              <Card className="border-red-200 bg-red-50/60">
                <CardHeader><CardTitle className="text-base">客户不可见 / 严禁展示</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {scenario.hidden.map((item) => <Badge key={item} variant="danger">{item}</Badge>)}
                  </div>
                  <p className="mt-4 text-sm text-red-900">
                    这些字段只能用于 Admin 执行、成本核算、内部对账或审计，不能出现在 Client Portal。
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  if (embedded) return content

  return <section id="transfer-simulator" className="space-y-6">{content}</section>
}
