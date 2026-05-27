import { ArrowRight, RotateCcw } from 'lucide-react'

import { Button } from '../ui/button'

export function DemoControlBar({ onNext, onReset }) {
  return (
    <div className="flex shrink-0 gap-2">
      <Button variant="outline" onClick={onReset}>
        <RotateCcw className="h-4 w-4" />
        重置演示
      </Button>
      <Button onClick={onNext}>
        下一步
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
