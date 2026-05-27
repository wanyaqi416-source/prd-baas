import { ShieldCheck, Workflow } from 'lucide-react'

import { guardrails, phaseComparison } from '../../data/prdData'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { GuardrailAlert } from './GuardrailAlert'
import { ScopeCard } from './ScopeCard'
import { SectionHeader } from './SectionHeader'

export function OverviewSection() {
  return (
    <>
      <section id="guardrails" className="space-y-5">
        <SectionHeader
          eyebrow="Overview"
          title="核心业务边界 / Guardrails"
          description="Fidere Trust 是客户可见主系统；Interlace / BaaS 是底层执行工具。客户不能看到真实底层余额、成本、USDT 地址或毛利。"
          badges={['MVP', 'Admin Only', 'No API']}
        />
        <GuardrailAlert>
          <strong>重要提醒：</strong> 后台只有一个 Admin 角色，不做复杂 RBAC；MVP 阶段不做自动开户，Admin 手动在 Interlace / BaaS 完成。
        </GuardrailAlert>
        <div className="grid gap-4 lg:grid-cols-2">
          <ScopeCard title="In-Scope" type="in" items={['记录开户申请', '记录 500 USD 开户费状态', '绑定 Interlace accountId', '展示复核后的账户信息', '状态管理与 audit_logs']} />
          <ScopeCard title="Out-of-Scope" type="out" items={['不自动开户', '不接真实 Interlace API', '不展示 actual balance', '不展示 USDT 地址', '不做复杂 RBAC']} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {guardrails.map(([title, body]) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  {title}
                </CardTitle>
                <CardDescription>{body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="mvp" className="space-y-5">
        <SectionHeader
          eyebrow="Scope"
          title="Phase 1 / Phase 2 MVP Scope"
          description="Phase 1 聚焦半自动开户、扣费、绑定、展示和状态管理；Phase 2 才逐步自动化。"
          badges={['Phase 1', 'Phase 2']}
        />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-accent" />
              Phase 1 vs Phase 2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Area</TableHead>
                  <TableHead>Phase 1 MVP</TableHead>
                  <TableHead>Phase 2 MVP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {phaseComparison.map(([area, p1, p2]) => (
                  <TableRow key={area}>
                    <TableCell className="font-medium">{area}</TableCell>
                    <TableCell>{p1}</TableCell>
                    <TableCell>{p2}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="flex flex-wrap gap-2">
          {['不接真实 API', '不写数据库', '不自动开户', '不展示 actual balance', 'Demo Data only'].map((item) => (
            <Badge key={item} variant="warning">{item}</Badge>
          ))}
        </div>
      </section>
    </>
  )
}
