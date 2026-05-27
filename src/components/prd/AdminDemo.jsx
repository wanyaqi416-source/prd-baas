import { Monitor, ServerCog, UserRound } from 'lucide-react'
import { useMemo, useState } from 'react'

import { mockApplication, openingDemoSteps, openingFeeConfig } from '../../data/prdData'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { DemoControlBar } from './DemoControlBar'
import { KeyValueTable } from './KeyValueTable'
import { RoleCard } from './RoleCard'
import { SectionHeader } from './SectionHeader'
import { StatusStepper } from './StatusStepper'

function toRows(items) {
  return items.map((item, index) => [`Item ${index + 1}`, item])
}

export function AdminDemo({ embedded = false }) {
  const [step, setStep] = useState(0)
  const [view, setView] = useState('client')
  const active = openingDemoSteps[step]
  const completed = active.status === 'Completed'

  const accountId = useMemo(() => (step >= 5 ? mockApplication.interlaceAccountId : 'Not bound yet'), [step])

  const content = (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="交互式演示"
        title="模拟开户流程演示"
        description="本演示只使用本地模拟状态。开发团队可点击推进状态，理解客户端、Admin 和技术视角。"
        badges={['本地状态', '不调用 API', '演示数据']}
      />
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle>美国账户开户演示</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">当前状态：<Badge>{active.status}</Badge></p>
            </div>
            <DemoControlBar
              onReset={() => setStep(0)}
              onNext={() => setStep((value) => Math.min(value + 1, openingDemoSteps.length - 1))}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <StatusStepper steps={openingDemoSteps} currentIndex={step} />
          <div className="grid items-stretch gap-4 md:grid-cols-3">
            <RoleCard icon={UserRound} title="客户看到的信息" badge="客户端" tone="client" rows={toRows(active.client)} />
            <RoleCard icon={Monitor} title="Admin 需要处理的信息" badge="Admin" tone="admin" rows={toRows(active.admin)} />
            <RoleCard icon={ServerCog} title="技术 / 台账信息" badge="系统" tone="system" rows={toRows(active.technical)} />
          </div>
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="text-base">开户费用记录 / Opening Fee Record</CardTitle>
            </CardHeader>
            <CardContent>
              <KeyValueTable rows={[
                ['费用类型', openingFeeConfig.feeType, '可配置'],
                ['默认金额', `${openingFeeConfig.currency} ${openingFeeConfig.defaultAmount}`, '客户确认前展示'],
                ['账户类型', 'US_ACCOUNT', '费用维度'],
                ['客户 ID', mockApplication.trustClientId, '记录字段'],
                ['申请 ID', mockApplication.applicationId, '记录字段'],
                ['支付状态', step >= 2 ? 'PAID / 已支付' : 'PENDING_PAYMENT / 待支付', 'Admin 可标记'],
              ]} />
              <p className="mt-3 text-sm text-muted-foreground">
                Admin 后台应可查看开户费用记录，并支持手动标记为“已支付”或“豁免”；所有状态变更必须写入 audit_logs。
              </p>
            </CardContent>
          </Card>

          <Tabs value={view} onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="client" activeValue={view} onSelect={setView}>客户端视图</TabsTrigger>
              <TabsTrigger value="admin" activeValue={view} onSelect={setView}>后台 Admin 视图</TabsTrigger>
              <TabsTrigger value="technical" activeValue={view} onSelect={setView}>技术视图</TabsTrigger>
            </TabsList>
            <TabsContent value="client" activeValue={view}>
              <Card>
                <CardHeader><CardTitle className="text-base">客户端预览 / Client Portal</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <KeyValueTable rows={[
                    ['开户状态', active.status, '客户可见'],
                    ['开户费', `USD ${mockApplication.openingFeeAmount}`, '客户可见'],
                    ['账户信息', completed ? `${mockApplication.bankName} / ${mockApplication.accountNumber}` : '尚不可见', '待复核'],
                  ]} />
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                    客户不可见 Interlace actual balance、USDT 地址、Interlace fee、OTC cost、Fidere margin。
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="admin" activeValue={view}>
              <Card>
                <CardHeader><CardTitle className="text-base">后台 Admin 预览 / Admin Console</CardTitle></CardHeader>
                <CardContent>
                  <KeyValueTable rows={[
                    ['Application ID', mockApplication.applicationId, 'Admin'],
                    ['Interlace accountId', accountId, '仅后台可见'],
                    ['Admin Remark', mockApplication.adminRemark, '仅后台可见'],
                    ['下一步动作', completed ? '无需继续处理' : '继续手动开户 / 绑定 / 复核', '手动处理'],
                  ]} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="technical" activeValue={view}>
              <Card>
                <CardHeader><CardTitle className="text-base">技术视图</CardTitle></CardHeader>
                <CardContent>
                  <KeyValueTable rows={[
                    ['paymentStatus', step >= 2 ? 'success' : 'pending', '演示状态'],
                    ['openingStatus', active.status, '状态机'],
                    ['audit_logs', step > 0 ? '写入当前状态流转的演示审计日志' : '暂无台账记录', '审计'],
                    ['API', '仅演示，不发起真实 API 请求。', '不调用 API'],
                  ]} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )

  if (embedded) return content

  return <section id="admin-demo" className="space-y-6">{content}</section>
}
