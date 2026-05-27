import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { ArrowRight } from "lucide-react"

export function ProductOverview() {
  return (
    <section id="product-overview" className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">03</span>
          <h2 className="text-lg font-semibold text-foreground">固定收益产品逻辑总览</h2>
        </div>
        <p className="text-sm text-muted-foreground">第一版只保留固定收益产品的核心定义、收益率口径和状态说明。</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">固定收益产品逻辑</h3>
            <Badge className="bg-primary/10 text-primary border-0">固定收益</Badge>
          </div>
          
          <p className="text-xs text-muted-foreground leading-relaxed">
            平台从外部机构采购固定收益产品，外部产品给平台一个年化收益率（如 7%），平台配置给客户展示和结算的客户收益率（如 5%），差额为平台利差收益。
            用户端只展示客户收益率，外部采购收益率属于后台敏感信息。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3 rounded-md bg-muted/30 p-4">
            <RateNode title="外部采购收益率" value="7.00%" desc="后台内部使用" />
            <ArrowRight className="w-4 h-4 text-border mx-auto rotate-90 md:rotate-0" />
            <RateNode title="平台内部利差" value="2.00%" desc="内部测算" muted />
            <ArrowRight className="w-4 h-4 text-border mx-auto rotate-90 md:rotate-0" />
            <RateNode title="客户收益率" value="5.00%" desc="用户展示和结算" active />
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-xs h-8">项目</TableHead>
                <TableHead className="text-xs h-8">示例</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-border">
                <TableCell className="text-xs py-2 text-muted-foreground">外部采购收益率</TableCell>
                <TableCell className="text-xs py-2 font-mono">7.00%</TableCell>
              </TableRow>
              <TableRow className="border-border">
                <TableCell className="text-xs py-2 text-muted-foreground">用户展示收益率</TableCell>
                <TableCell className="text-xs py-2 font-mono">5.00%</TableCell>
              </TableRow>
              <TableRow className="border-border">
                <TableCell className="text-xs py-2 text-muted-foreground">平台利差</TableCell>
                <TableCell className="text-xs py-2 font-mono">2.00%</TableCell>
              </TableRow>
              <TableRow className="border-border">
                <TableCell className="text-xs py-2 text-muted-foreground">产品期限</TableCell>
                <TableCell className="text-xs py-2">30 / 90 / 180 天</TableCell>
              </TableRow>
              <TableRow className="border-border">
                <TableCell className="text-xs py-2 text-muted-foreground">起投金额</TableCell>
                <TableCell className="text-xs py-2 font-mono">1,000 USDT</TableCell>
              </TableRow>
              <TableRow className="border-border">
                <TableCell className="text-xs py-2 text-muted-foreground">收益方式</TableCell>
                <TableCell className="text-xs py-2">到期一次性还本付息</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <p className="text-xs font-medium text-foreground">
            规则结论：客户收益计算永远使用客户收益率，不使用外部采购收益率。
          </p>
        </Card>
      </div>

      {/* Product Status States */}
      <Card className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">产品状态说明</h3>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">固定收益</p>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="草稿" desc="用户不可见" />
              <StatusBadge status="已上架" desc="可认购" variant="success" />
              <StatusBadge status="额度已满" desc="停止认购" variant="warning" />
              <StatusBadge status="已下架" desc="用户不可认购" />
              <StatusBadge status="结算中" desc="正在处理到期结算" variant="info" />
              <StatusBadge status="已完成" desc="本息已结算" variant="success" />
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}

function RateNode({ title, value, desc, active = false, muted = false }: {
  title: string
  value: string
  desc: string
  active?: boolean
  muted?: boolean
}) {
  const styles = active
    ? "border-primary/30 bg-primary/5"
    : muted
      ? "border-border bg-background/60"
      : "border-accent/30 bg-accent/5"

  return (
    <div className={`rounded-md border p-3 text-center ${styles}`}>
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-lg font-mono font-semibold text-foreground mt-1">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </div>
  )
}

function StatusBadge({ status, desc, variant = "default" }: { 
  status: string
  desc: string
  variant?: "default" | "success" | "warning" | "info" 
}) {
  const variantStyles = {
    default: "bg-muted text-muted-foreground",
    success: "bg-emerald-500/10 text-emerald-600",
    warning: "bg-amber-500/10 text-amber-600",
    info: "bg-blue-500/10 text-blue-600",
  }
  
  return (
    <div className="group relative">
      <Badge className={`${variantStyles[variant]} border-0 text-xs font-normal cursor-help`}>
        {status}
      </Badge>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {desc}
      </div>
    </div>
  )
}
