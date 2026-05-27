import { cn } from "../../lib/utils"
import { useEffect, useState } from "react"

const sections = [
  { id: "overview", label: "文档概览", num: "1" },
  { id: "core-rules", label: "核心规则结论", num: "2" },
  { id: "product-overview", label: "产品逻辑", num: "3" },
  { id: "module-architecture", label: "模块职责", num: "4" },
  { id: "fixed-income-flow", label: "固定收益规则", num: "5" },
  { id: "yield-rate-versioning", label: "收益率版本", num: "6" },
  { id: "position-structure", label: "追加与提前退出", num: "7" },
  { id: "maturity-rules", label: "到期日规则", num: "8" },
  { id: "data-model", label: "账务与审计", num: "9" },
  { id: "permissions", label: "角色权限", num: "10" },
  { id: "mvp-scope", label: "MVP 与第二阶段", num: "11" },
  { id: "acceptance-checklist", label: "验收关注点", num: "12" },
  { id: "phase2-ipo-flow", label: "第二阶段 IPO", num: "13" },
  { id: "phase2-ipo-profit", label: "IPO 收益确认", num: "14" },
  { id: "comments", label: "备注与点评", num: "15" },
]

export function TableOfContents() {
  const [activeSection, setActiveSection] = useState("overview")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0px -70% 0px" }
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 border-r border-border bg-card/50 print:hidden">
      <div className="p-6 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xs font-semibold text-muted-foreground">目录</h2>
          <p className="text-xs text-muted-foreground">理财产品 PRD</p>
        </div>
        
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-sm transition-colors",
                activeSection === section.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="w-5 h-5 rounded bg-muted text-xs flex items-center justify-center font-mono">
                {section.num}
              </span>
              <span className="truncate">{section.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-border space-y-2">
          <p className="text-xs text-muted-foreground">文档信息</p>
          <div className="space-y-1 text-xs">
            <p className="text-foreground">版本：<span className="text-muted-foreground">1.0.0</span></p>
            <p className="text-foreground">范围：<span className="text-accent font-medium">MVP</span></p>
            <p className="text-foreground">更新：<span className="text-muted-foreground">2026-05-08</span></p>
          </div>
        </div>
      </div>
    </aside>
  )
}
