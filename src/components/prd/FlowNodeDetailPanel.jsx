import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

function DetailCard({ title, children, className = '' }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function List({ items }) {
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  )
}

export function FlowNodeDetailPanel({ node }) {
  const detail = node?.data?.detail

  if (!detail) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>当前步骤详情</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">点击 React Flow 节点查看字段、状态、异常和开发注意事项。</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold tracking-tight">当前步骤详情</h3>
        <p className="mt-1 text-sm text-muted-foreground">点击流程图中的不同节点，下方详情会同步更新。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailCard title="步骤说明" className="xl:col-span-2">
          <div className="text-base font-semibold">{node.data.label}</div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{detail.description}</p>
        </DetailCard>
        <DetailCard title="所属系统 / 操作方">
          <div className="flex flex-wrap gap-2">
            {detail.systems.map((system) => <Badge key={system}>{system}</Badge>)}
          </div>
        </DetailCard>
        <DetailCard title="输入字段">
          <List items={detail.inputs} />
        </DetailCard>
        <DetailCard title="输出字段">
          <List items={detail.outputs} />
        </DetailCard>
        <DetailCard title="状态变化">
          <Badge variant="success">{detail.statusChange}</Badge>
        </DetailCard>
        <DetailCard title="异常情况" className="xl:col-span-1">
          <List items={detail.exceptions} />
        </DetailCard>
        <DetailCard title="开发注意事项" className="md:col-span-2">
          <List items={detail.devNotes} />
        </DetailCard>
      </div>
    </div>
  )
}
