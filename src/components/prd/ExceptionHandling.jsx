import { exceptionItems } from '../../data/prdData'
import { Accordion } from '../ui/accordion'
import { SectionHeader } from './SectionHeader'

export function ExceptionHandling() {
  return (
    <section id="exceptions" className="space-y-5">
      <SectionHeader
        eyebrow="Risk Boundary"
        title="异常处理与边界情况"
        description="MVP 虽然是半自动流程，但仍需要把关键异常和不允许发生的客户可见数据泄露写清楚。"
        badges={['Out-of-Scope', 'No Client Visibility']}
      />
      <Accordion items={exceptionItems} />
    </section>
  )
}
