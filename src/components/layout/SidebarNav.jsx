import { useEffect, useState } from 'react'

import { ScrollArea } from '../ui/scroll-area'

export function SidebarNav({ items }) {
  const [activeId, setActiveId] = useState(items[0]?.[0])
  const groups = [
    ['总览', items.slice(0, 5)],
    ['业务模块', items.slice(5, 13)],
    ['技术规划', items.slice(13)],
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible?.target?.id) setActiveId(visible.target.id)
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    )

    items.forEach(([id]) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [items])

  return (
    <aside className="sticky top-0 hidden h-screen border-r bg-card/90 p-5 backdrop-blur lg:block">
      <div className="rounded-2xl border bg-background/60 p-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">内部手册</div>
        <h1 className="mt-2 text-lg font-semibold leading-tight">Fidere BaaS / Interlace PRD</h1>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">面向 MVP 交付的交互式产品手册。</p>
      </div>
      <ScrollArea className="mt-5 h-[calc(100vh-150px)] pr-1">
        <nav className="space-y-5">
          {groups.map(([group, links]) => (
            <div key={group}>
              <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{group}</div>
              <div className="grid gap-1">
                {links.map(([id, label]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`rounded-xl px-3 py-2 text-sm transition-colors ${
                      activeId === id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  )
}
