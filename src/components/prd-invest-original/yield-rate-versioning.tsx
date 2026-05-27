import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { AlertTriangle } from "lucide-react"

export function YieldRateVersioning() {
  return (
    <section id="yield-rate-versioning" className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">06</span>
          <h2 className="text-lg font-semibold text-foreground">收益率版本机制</h2>
        </div>
        <p className="text-sm text-muted-foreground">收益率按生效日期版本化管理，支持分段计息</p>
      </div>

      {/* Why Version Control */}
      <Card className="p-5 border-l-4 border-l-accent bg-accent/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">为什么需要收益率版本管理？</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              如果直接覆盖收益率，历史订单会算错。客户持仓期间收益率可能变化，所以收益率变化必须有生效日期，
              历史版本需要保留，方便审计、对账和客户解释。已经结算过的收益率不能随意修改。
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Version Table Example */}
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">收益率版本示例</h3>
          
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-xs h-8">版本</TableHead>
                <TableHead className="text-xs h-8">生效区间</TableHead>
                <TableHead className="text-xs h-8">客户收益率</TableHead>
                <TableHead className="text-xs h-8">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-border">
                <TableCell className="text-xs py-2 font-mono">v1</TableCell>
                <TableCell className="text-xs py-2">2026-05-01 ~ 2026-05-31</TableCell>
                <TableCell className="text-xs py-2 font-mono text-foreground">5.00%</TableCell>
                <TableCell className="text-xs py-2 text-muted-foreground">历史版本保留</TableCell>
              </TableRow>
              <TableRow className="border-border bg-accent/5">
                <TableCell className="text-xs py-2 font-mono">v2</TableCell>
                <TableCell className="text-xs py-2">2026-06-01 起生效</TableCell>
                <TableCell className="text-xs py-2 font-mono text-foreground">4.50%</TableCell>
                <TableCell className="text-xs py-2 text-muted-foreground">新订单和跨期持仓使用</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="pt-3 border-t border-border space-y-2">
            <p className="text-xs font-medium text-foreground">开发需要理解的规则</p>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {[
                "收益率调整不是覆盖旧值，而是新增一个从指定日期开始生效的版本。",
                "已经发生的历史持仓和已结算记录，需要按当时有效的收益率解释。",
                "如果客户持仓跨越两个收益率版本，收益必须分段计算。",
                "收益率调整需要记录操作原因和操作记录，方便后续对账和追溯。",
              ].map((rule) => (
                <div key={rule} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="text-muted-foreground">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Timeline Visualization */}
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">收益率时间轴</h3>
          
          <div className="relative pt-4">
            {/* Timeline */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-muted rounded" />
            
            {/* Version 1 */}
            <div className="relative flex justify-between mb-8">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary z-10" />
                <div className="mt-2 text-center">
                  <p className="text-xs font-mono text-foreground">2026-05-01</p>
                  <p className="text-xs text-muted-foreground">版本 1 生效</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-accent z-10" />
                <div className="mt-2 text-center">
                  <p className="text-xs font-mono text-foreground">2026-06-01</p>
                  <p className="text-xs text-muted-foreground">版本 2 生效</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/50 z-10" />
                <div className="mt-2 text-center">
                  <p className="text-xs font-mono text-foreground">持续</p>
                  <p className="text-xs text-muted-foreground">持续</p>
                </div>
              </div>
            </div>

            {/* Rate Display */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
                <p className="text-xs text-muted-foreground">版本 1</p>
                <p className="text-sm font-mono text-primary font-medium">5.00%</p>
                <p className="text-xs text-muted-foreground mt-1">31 天</p>
              </div>
              <div className="p-3 bg-accent/10 border border-accent/30 rounded-md">
                <p className="text-xs text-muted-foreground">版本 2</p>
                <p className="text-sm font-mono text-accent font-medium">4.50%</p>
                <p className="text-xs text-muted-foreground mt-1">30 天</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Segmented Calculation */}
      <Card className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">跨版本持仓的分段收益计算</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Example Setup */}
          <div className="p-4 bg-muted/30 rounded-md space-y-3">
            <p className="text-xs font-medium text-foreground">计算示例设定</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">客户本金</span>
                <span className="font-mono text-foreground">100,000 USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">产品开始日</span>
                <span className="font-mono text-foreground">2026-05-01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">产品到期日</span>
                <span className="font-mono text-foreground">2026-06-30</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground">05-01 ~ 05-31</span>
                <span className="font-mono text-primary">5.00%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">06-01 ~ 06-30</span>
                <span className="font-mono text-accent">4.50%</span>
              </div>
            </div>
          </div>

          {/* Calculation Formula */}
          <div className="p-4 bg-muted/30 rounded-md space-y-3">
            <p className="text-xs font-medium text-foreground">分段计算公式</p>
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2 bg-background rounded border border-border">
                <p className="text-muted-foreground">第一段收益</p>
                <p className="text-foreground">100,000 × 5.00% × 31 ÷ 365</p>
                <p className="text-primary font-medium">= 424.66 USDT</p>
              </div>
              <div className="p-2 bg-background rounded border border-border">
                <p className="text-muted-foreground">第二段收益</p>
                <p className="text-foreground">100,000 × 4.50% × 30 ÷ 365</p>
                <p className="text-accent font-medium">= 369.86 USDT</p>
              </div>
            </div>
          </div>

          {/* Final Result */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-md space-y-3">
            <p className="text-xs font-medium text-foreground">最终结果</p>
            <div className="space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">第一段收益</span>
                  <span className="font-mono text-foreground">424.66 USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">第二段收益</span>
                  <span className="font-mono text-foreground">369.86 USDT</span>
                </div>
              </div>
              <div className="pt-3 border-t border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">客户总收益</span>
                  <span className="text-lg font-mono font-semibold text-primary">794.52 USDT</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frontend Display Note */}
        <div className="flex items-start gap-3 pt-4 border-t border-border">
          <Badge variant="outline" className="text-xs shrink-0">前端展示</Badge>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>用户端展示当前年化收益率，并提示收益率可能调整。</p>
            <p>如果客户已经持仓，实际收益按持仓期间命中的收益率版本分段计算。</p>
            <p className="font-mono bg-muted px-2 py-1 rounded inline-block">
              {"当前年化收益率：4.50% | 收益率说明：实际收益以系统结算结果为准"}
            </p>
          </div>
        </div>
      </Card>
    </section>
  )
}
