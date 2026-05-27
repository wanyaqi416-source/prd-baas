import { Badge } from "../ui/badge"
import { Card } from "../ui/card"
import { TrendingUp, Shield, FileText } from "lucide-react"

export function PRDHeader() {
  return (
    <section id="overview" className="space-y-6">
      {/* Document Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">产品需求文档</p>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">理财产品 PRD - 业务规则与 MVP 逻辑说明</h1>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-normal">v1.0</Badge>
          <Badge className="bg-accent text-accent-foreground text-xs font-normal">MVP</Badge>
        </div>
      </div>

      {/* Subtitle & Description */}
      <div className="border-l-2 border-primary pl-4 py-1">
        <p className="text-sm font-medium text-foreground">固定收益产品规则说明</p>
        <p className="text-sm text-muted-foreground mt-1">
          本页面用于帮助开发、测试、产品和管理员统一理解第一版固定收益产品规则。重点说明收益计算、追加认购、特殊提前退出、到期、管理员结算和操作记录要求，不展开 API、数据库字段或接口字段设计。
        </p>
      </div>

      {/* Product Type Card */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="p-5 border-border bg-card hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">固定收益产品</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                固定收益类产品，支持收益率版本管理、分段计息、追加认购。固定期限产品默认不支持用户自主提前赎回，特殊提前退出走管理员审核和人工确认。
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <Badge variant="secondary" className="text-xs font-normal">单利计算</Badge>
                <Badge variant="secondary" className="text-xs font-normal">T+1 起息</Badge>
                <Badge variant="secondary" className="text-xs font-normal">人工提前退出</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Key Principles */}
      <Card className="p-4 bg-muted/30 border-border">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-semibold text-foreground">核心原则</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <p className="font-medium text-foreground">可审计</p>
            <p className="text-muted-foreground">所有关键操作记录审计日志</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">收益率版本</p>
            <p className="text-muted-foreground">收益率按生效日期版本化管理</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">收益率隔离</p>
            <p className="text-muted-foreground">采购利率与客户利率分离</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">人工结算</p>
            <p className="text-muted-foreground">特殊提前退出由管理员确认</p>
          </div>
        </div>
      </Card>
    </section>
  )
}
