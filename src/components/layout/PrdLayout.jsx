import { navItems } from '../../data/prdData'
import { HeaderBar } from './HeaderBar'
import { SidebarNav } from './SidebarNav'

export function PrdLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <div className="grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <SidebarNav items={navItems} />
        <main className="min-w-0">
          <HeaderBar />
          <div className="mx-auto max-w-[1160px] space-y-14 px-6 py-10 md:px-10 md:py-14">{children}</div>
        </main>
      </div>
    </div>
  )
}
