import { ArrowLeft } from 'lucide-react'

import { Button } from '../ui/button'

export function PrdBackLink({ onClick }) {
  return (
    <Button variant="ghost" onClick={onClick} className="mb-5">
      <ArrowLeft className="h-4 w-4" />
      返回 PRD 首页
    </Button>
  )
}
