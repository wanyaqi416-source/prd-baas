import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export function ApiWebhookSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API / Webhook Planning</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        本 MVP PRD 手册不实现真实接口。未来接口必须过滤客户不可见字段，并把 Interlace raw response、actual balance、USDT address、fee 和 margin 留在 Admin only 范围内。
      </CardContent>
    </Card>
  )
}
