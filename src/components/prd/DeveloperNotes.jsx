import { Code2 } from 'lucide-react'

import { developerNotes } from '../../data/prdData'
import { Alert } from '../ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ApiWebhookSection } from './ApiWebhookSection'
import { BalanceModelSection } from './BalanceModelSection'
import { SectionHeader } from './SectionHeader'

export function DeveloperNotes() {
  return (
    <section id="developer-notes" className="space-y-5 pb-12">
      <SectionHeader
        eyebrow="Developer Notes"
        title="开发注意事项"
        description="本手册是未来正式业务功能的开发说明，不是业务功能本身。"
        badges={['No API', 'No DB Write']}
      />
      <Alert variant="destructive">
        禁止在本 PRD 手册页面中新增真实 API 调用、数据库写入、真实 webhook、客户钱包、USDT 充值或链上流水页面。
      </Alert>
      <BalanceModelSection />
      <ApiWebhookSection />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-accent" />
            Implementation Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {developerNotes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
