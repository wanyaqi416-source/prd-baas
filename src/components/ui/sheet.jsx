import { X } from 'lucide-react'

import { Button } from './button'

export function Sheet({ open, onOpenChange, title, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/20" onClick={() => onOpenChange(false)}>
      <aside
        className="ml-auto h-full w-full max-w-xl overflow-auto border-l bg-card p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </aside>
    </div>
  )
}
