import { AlertTriangle, Info } from 'lucide-react'

import { cn } from '../../lib/utils'

export function Alert({ className, variant = 'default', children }) {
  const Icon = variant === 'destructive' ? AlertTriangle : Info
  return (
    <div
      className={cn(
        'flex gap-3 rounded-2xl border p-4 text-sm',
        variant === 'destructive'
          ? 'border-red-200 bg-red-50 text-red-900'
          : 'border-amber-200 bg-amber-50 text-amber-900',
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  )
}
