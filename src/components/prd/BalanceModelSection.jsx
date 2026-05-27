import { Alert } from '../ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export function BalanceModelSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>余额模型边界</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          Interlace Actual Balance / Interlace 实际余额仅后台可见。客户只能看到 Fidere Client Available Balance / Fidere 客户可用余额。
        </Alert>
        <pre className="overflow-auto rounded-2xl bg-stone-900 p-4 text-sm text-stone-100">
{`client_available_balance =
  approved incoming          已审核入账
  + approved internal transfer in   已审核内部转入
  - completed outgoing       已完成转出
  - frozen / processing amount      冻结 / 处理中金额
  - fidere fees              Fidere 手续费
  +/- manual adjustments     人工调整项`}
        </pre>
      </CardContent>
    </Card>
  )
}
