import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { cn } from '../../lib/utils'

export function Accordion({ items, className }) {
  const [open, setOpen] = useState(items?.[0]?.title)

  return (
    <div className={cn('divide-y rounded-2xl border bg-card', className)}>
      {items.map((item) => {
        const active = open === item.title
        return (
          <div key={item.title}>
            <button
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold"
              onClick={() => setOpen(active ? '' : item.title)}
            >
              {item.title}
              <ChevronDown className={cn('h-4 w-4 transition-transform', active && 'rotate-180')} />
            </button>
            {active ? <div className="px-5 pb-5 text-sm text-muted-foreground">{item.content}</div> : null}
          </div>
        )
      })}
    </div>
  )
}
