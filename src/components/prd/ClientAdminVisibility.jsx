import { useState } from 'react'

import { mockApplication } from '../../data/prdData'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { KeyValueTable } from './KeyValueTable'
import { SectionHeader } from './SectionHeader'

export function ClientAdminVisibility({ embedded = false }) {
  const [view, setView] = useState('client')

  const content = (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="可见范围"
        title="字段可见性说明"
        description="同一份演示数据，在不同视角下必须返回不同字段。这里用于定义未来接口字段过滤边界。"
        badges={['客户不可见字段', '仅后台字段']}
      />
      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="client" activeValue={view} onSelect={setView}>客户端视图</TabsTrigger>
          <TabsTrigger value="admin" activeValue={view} onSelect={setView}>后台 Admin 视图</TabsTrigger>
          <TabsTrigger value="technical" activeValue={view} onSelect={setView}>技术视图</TabsTrigger>
        </TabsList>
        <TabsContent value="client" activeValue={view}>
          <Card>
            <CardHeader><CardTitle>客户端 / Client Portal</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <KeyValueTable rows={[
                ['账户名称 / Account Holder', mockApplication.accountHolderName, '客户可见'],
                ['银行 / Bank', mockApplication.bankName, '客户可见'],
                ['Routing Number', mockApplication.routingNumber, '客户可见'],
                ['账户号码 / Account Number', mockApplication.accountNumber, '客户可见'],
                ['状态 / Status', mockApplication.accountStatus, '客户可见'],
              ]} />
              <div className="text-muted-foreground">不可见：Interlace actual balance、USDT 地址、Interlace fee、OTC cost、Fidere margin。</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="admin" activeValue={view}>
          <Card>
            <CardHeader><CardTitle>后台管理端 / Admin Console</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <KeyValueTable rows={[
                ['Application ID', mockApplication.applicationId, 'Admin'],
                ['Trust Client ID', mockApplication.trustClientId, 'Admin'],
                ['Interlace Account ID', mockApplication.interlaceAccountId, '仅后台可见'],
                ['Admin Remark', mockApplication.adminRemark, '仅后台可见'],
              ]} />
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                Admin 可处理：手动开户、绑定 accountId、复核账户信息、完成状态、记录 audit_logs。
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="technical" activeValue={view}>
          <Card>
            <CardHeader><CardTitle>技术契约 / Technical Contract</CardTitle></CardHeader>
            <CardContent>
              <KeyValueTable rows={[
                ['演示数据来源', 'src/data/prdData.js', '演示数据'],
                ['API 请求', '不发起真实 API 请求，不写数据库。', '不调用 API'],
                ['客户端 endpoint', '必须过滤仅后台可见字段。', '安全边界'],
                ['状态映射', '未来 API 应将 openingStatus 映射到状态机。', '接口契约'],
              ]} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  if (embedded) return content

  return <section className="space-y-6">{content}</section>
}
