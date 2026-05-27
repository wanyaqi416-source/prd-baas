import { Check } from 'lucide-react'

import { cn } from '../../lib/utils'

const descriptions = {
  Draft: '客户尚未正式提交开户申请。',
  'Pending Payment': '系统已生成 500 USD 开户费，等待付款。',
  'Payment Success': '开户费已确认。',
  'Awaiting Manual Opening': '等待 Admin 在 Interlace 手动开户。',
  'Account Created In Interlace': '外部账户已创建，等待绑定。',
  'Binding Required': '需要 Admin 绑定 Interlace accountId。',
  Completed: '客户可见美国账户状态已完成。',
}

export function StatusStepper({ steps, currentIndex }) {
  const current = steps[currentIndex]

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-7">
        {steps.map((step, index) => {
          const done = index < currentIndex
          const active = index === currentIndex
          return (
            <div key={step.status} className="relative">
              <div
                className={cn(
                  'flex min-h-[92px] flex-col justify-between rounded-2xl border p-3 transition-colors',
                  done && 'border-emerald-200 bg-emerald-50 text-emerald-900',
                  active && 'border-primary bg-primary text-primary-foreground',
                  !done && !active && 'bg-muted/50 text-muted-foreground',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wide">步骤 {index + 1}</span>
                  {done ? <Check className="h-4 w-4" /> : null}
                </div>
                <div className="text-xs font-semibold leading-snug">{step.status}</div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="rounded-2xl border bg-card p-4">
        <div className="text-sm font-semibold">{current.status}</div>
        <p className="mt-1 text-sm text-muted-foreground">{descriptions[current.status] || '当前状态等待业务处理。'}</p>
      </div>
    </div>
  )
}
