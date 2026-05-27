import { transferGuardrails, transferModules } from '../../data/prdData'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { GuardrailAlert } from './GuardrailAlert'
import { SectionHeader } from './SectionHeader'
import { ScopeCard } from './ScopeCard'

function FlowList({ steps }) {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div key={step} className="flex gap-3 text-sm">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">{index + 1}</div>
          <div>{step}</div>
        </div>
      ))}
    </div>
  )
}

export function TransferOverviewSection() {
  return (
    <section id="transfer-overview" className="space-y-6">
      <SectionHeader
        eyebrow="Transfer Module"
        title="Transfer In / Transfer Out 模块总览"
        description="本章节把转入、转出、入账审核、内部资金调拨、手续费、客户可见余额和 Admin 执行流程合并到同一套 PRD 视图中。"
        badges={['Transfer In', 'Transfer Out', 'Admin Manual Execution']}
      />
      <GuardrailAlert variant="destructive">
        <strong>Transfer Guardrails：</strong>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {transferGuardrails.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </GuardrailAlert>

      <div className="grid gap-4 lg:grid-cols-2">
        <ScopeCard title="Transfer In / 转入模块" type="in" items={[
          'Transfer In A：外部法币转入美国账户，Admin 审核后入 client_available_balance。',
          'Transfer In B：信托账户资金转入美国账户，可涉及内部 funding / OTC，客户不可见底层执行。',
          'Under Review / Processing 阶段只影响 pending 余额，不直接变成可用余额。',
        ]} />
        <ScopeCard title="Transfer Out / 转出模块" type="out" items={[
          'Transfer Out A：美国账户已有实际余额，Admin 手动 BaaS payout。',
          'Transfer Out B：信托资金调拨后转出，internal funding / OTC / BaaS 手动执行仅后台可见。',
          '客户只看本金、Fidere fee、total deduction、status、receipt。',
        ]} />
      </div>

      <div className="grid gap-5">
        {transferModules.map((module) => (
          <Card key={module.title}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <CardTitle>{module.title}</CardTitle>
                <Badge variant={module.type === 'Transfer In' ? 'success' : 'warning'}>{module.type}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{module.summary}</p>
            </CardHeader>
            <CardContent className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
              <div>
                <div className="mb-3 text-sm font-semibold text-muted-foreground">流程图</div>
                <FlowList steps={module.flow} />
              </div>
              <div className="grid gap-4">
                <div className="rounded-2xl border bg-emerald-50/60 p-4">
                  <div className="text-sm font-semibold">客户可见内容</div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                    {module.clientVisible.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border bg-red-50/60 p-4">
                  <div className="text-sm font-semibold">客户不可见内容</div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                    {module.clientHidden.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border bg-amber-50/60 p-4">
                  <div className="text-sm font-semibold">Admin 可见内容</div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                    {module.adminVisible.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
