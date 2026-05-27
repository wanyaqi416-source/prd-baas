import { transferApiRows, transferAuditLogs, transferDataModels, transferModules } from '../../data/prdData'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { SectionHeader } from './SectionHeader'

export function TransferTechnicalSection() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Transfer Technical Contract"
        title="转入 / 转出状态机、数据模型、API 与审计补充"
        description="本章节只补充 PRD 规划，不实现真实转入、转出、Webhook、数据库或 Interlace API。"
        badges={['PRD Only', 'No Real API', 'No DB Write']}
      />

      <Card>
        <CardHeader><CardTitle>转入 / 转出状态机</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scenario</TableHead>
                <TableHead>Status Machine</TableHead>
                <TableHead>Balance Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transferModules.map((module) => (
                <TableRow key={module.title}>
                  <TableCell className="font-medium">{module.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {module.status.map((status) => <Badge key={status} variant="secondary">{status}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {module.balanceImpact.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>转入 / 转出数据模型补充</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Key Fields</TableHead>
                <TableHead>Client Visible?</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transferDataModels.map(([table, purpose, fields, visible, notes]) => (
                <TableRow key={table}>
                  <TableCell className="font-mono text-xs">{table}</TableCell>
                  <TableCell>{purpose}</TableCell>
                  <TableCell>{fields}</TableCell>
                  <TableCell><Badge variant={visible === 'No' ? 'danger' : 'secondary'}>{visible}</Badge></TableCell>
                  <TableCell>{notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>转入 / 转出 API / Webhook 规划补充</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Used By</TableHead>
                <TableHead>Phase</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transferApiRows.map(([method, endpoint, purpose, usedBy, phase]) => (
                <TableRow key={`${method}-${endpoint}`}>
                  <TableCell><Badge>{method}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{endpoint}</TableCell>
                  <TableCell>{purpose}</TableCell>
                  <TableCell>{usedBy}</TableCell>
                  <TableCell>{phase}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Webhook 规则：incoming-deposit 可以生成 incoming_fiat_deposits，但不能自动进入 client_available_balance；必须 Admin approve 后才更新客户可用余额；internal USDT funding event 不得被当作客户 deposit。
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>转入 / 转出 audit_logs 补充</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {transferAuditLogs.map((item) => (
              <div key={item} className="rounded-xl border bg-muted/40 px-3 py-2 text-sm">{item}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
