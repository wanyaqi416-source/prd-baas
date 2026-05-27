import { cn } from '../../lib/utils'

export function Tabs({ value, onValueChange, children, className }) {
  return <div className={cn('space-y-4', className)} data-value={value}>{children}</div>
}

export function TabsList({ className, ...props }) {
  return <div className={cn('inline-flex flex-wrap gap-1 rounded-full bg-muted p-1', className)} {...props} />
}

export function TabsTrigger({ value, activeValue, onSelect, className, ...props }) {
  const active = value === activeValue
  return (
    <button
      className={cn(
        'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
        active ? 'bg-card text-foreground' : 'text-muted-foreground hover:text-foreground',
        className,
      )}
      onClick={() => onSelect(value)}
      {...props}
    />
  )
}

export function TabsContent({ value, activeValue, className, ...props }) {
  if (value !== activeValue) return null
  return <div className={cn('space-y-4', className)} {...props} />
}
