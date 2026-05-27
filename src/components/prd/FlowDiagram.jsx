import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'

import { useMemo, useState } from 'react'

import { openingFlowEdges, openingFlowNodes } from '../../data/prdData'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { FlowNodeDetailPanel } from './FlowNodeDetailPanel'

export function FlowDiagram({ embedded = false }) {
  const [selectedNode, setSelectedNode] = useState(openingFlowNodes[0])
  const nodes = useMemo(
    () =>
      openingFlowNodes.map((node) => ({
        ...node,
        type: 'default',
        data: {
          ...node.data,
          label: (
            <div className="max-w-[190px] text-center text-xs font-semibold leading-snug">
              {node.data.label}
            </div>
          ),
        },
        style: {
          border: selectedNode?.id === node.id ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
          borderRadius: 14,
          background: 'hsl(var(--card))',
          color: 'hsl(var(--foreground))',
          padding: 12,
          width: 210,
        },
      })),
    [selectedNode],
  )

  const content = (
    <div className="space-y-5">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">开户流程 React Flow</h2>
        <p className="mt-2 max-w-4xl text-muted-foreground">
          点击节点查看当前步骤说明、涉及系统、输入输出字段、状态变化、异常情况和开发注意事项。
        </p>
      </div>
      <div className="flex w-full flex-col gap-5">
        <Card>
          <CardHeader>
            <CardTitle>美国账户开户流程图</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[640px] min-h-[560px] overflow-hidden rounded-2xl border bg-muted/30">
              <ReactFlow
                nodes={nodes}
                edges={openingFlowEdges}
                fitView
                onNodeClick={(_, node) => {
                  const original = openingFlowNodes.find((item) => item.id === node.id)
                  setSelectedNode(original)
                }}
              >
                <Background />
                <MiniMap pannable zoomable />
                <Controls />
              </ReactFlow>
            </div>
          </CardContent>
        </Card>
        <FlowNodeDetailPanel node={selectedNode} />
      </div>
    </div>
  )

  if (embedded) return content

  return <section id="architecture" className="space-y-5">{content}</section>
}
