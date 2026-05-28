import { ListChecks, Network, ShieldCheck } from 'lucide-react'

import {
  exceptionItems,
  guardrails,
  openingFeeAdminActions,
  openingFeeConfig,
  openingFeeRecordFields,
  openingFeeStatuses,
  phaseComparison,
  stateRows,
  transferApiRows,
  transferAuditLogs,
  transferDataModels,
  transferGuardrails,
  transferModules,
} from '../../data/prdData'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Accordion } from '../ui/accordion'
import { BalanceModelSection } from './BalanceModelSection'
import { ClientAdminVisibility } from './ClientAdminVisibility'
import { FlowDiagram } from './FlowDiagram'
import { GuardrailAlert } from './GuardrailAlert'
import { ScopeCard } from './ScopeCard'
import { SectionHeader } from './SectionHeader'
import { TransferInOutSimulator } from './TransferInOutSimulator'
import { AdminDemo } from './AdminDemo'

function StepFlow({ steps }) {
  return (
    <div className="grid gap-2">
      {steps.map((step, index) => (
        <div key={step} className="flex gap-3 rounded-2xl border bg-card p-3 text-sm">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">{index + 1}</div>
          <div>{step}</div>
        </div>
      ))}
    </div>
  )
}

function CompactList({ title, items, tone = 'default' }) {
  const toneClass = {
    visible: 'border-emerald-200 bg-emerald-50/60',
    hidden: 'border-red-200 bg-red-50/60',
    admin: 'border-amber-200 bg-amber-50/60',
    default: 'bg-card',
  }[tone]

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}

export function PrinciplesSection() {
  return (
    <section id="principles" className="space-y-6">
      <SectionHeader
        eyebrow="产品原则"
        title="产品定位与核心原则"
        description="本章集中放置所有业务边界，后续章节不再重复展开。"
        badges={['统一边界', '仅后台可见', '客户安全']}
      />
      <GuardrailAlert>
        Fidere Trust 是客户可见主系统；Interlace / BaaS 是底层执行工具。客户只看 Fidere client_available_balance，不看 Interlace actual balance、USDT 地址、底层成本或毛利。
      </GuardrailAlert>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...guardrails, ...transferGuardrails.filter((item) => !guardrails.some((g) => item.includes(g[0]))).map((item) => ['Transfer Guardrail', item])].map(([title, body], index) => (
          <Card key={`${title}-${index}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-4 w-4 text-accent" />
                {title === 'Transfer Guardrail' ? '转入 / 转出边界' : title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{body}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function ArchitectureOverviewSection() {
  const rows = [
    {
      label: '客户 / Client',
      desc: '客户只能使用 Fidere Trust 客户端，不直接访问 Interlace / BaaS。',
      items: ['申请美国账户', '维护收款人', '发起转入 / 转出', '查看客户可见余额'],
      tone: 'default',
    },
    {
      label: '客户端 / Client Portal',
      desc: '客户可见入口，展示 Fidere 计算后的账户信息、订单状态和客户可用余额。',
      items: ['美国账户展示', '收款人 Beneficiary', '转入 Transfer In', '转出 Transfer Out', '回单 Receipt'],
      tone: 'default',
    },
    {
      label: 'Fidere Trust Core / 核心系统',
      desc: 'Fidere 自有业务主系统，承载申请、指令、台账和余额模型。',
      items: ['美国账户申请', '收款人', '转入', '转出', '客户台账', '余额模型'],
      tone: 'primary',
    },
    {
      label: 'Fidere Trust Admin Console / 信托后台',
      desc: '业务主后台，负责客户、信托、台账、费用、审核与审计。',
      items: ['客户管理', '信托账户', '手动开户', '手动录入 BaaS', '入账审核', '费用与利润', '审计日志', '客户台账', '余额模型'],
      tone: 'primary',
      arrow: '业务审核与指令生成',
    },
    {
      label: 'Interlace / BaaS Admin Console / BaaS 执行后台',
      desc: '底层执行后台，负责 Interlace 账户、余额、入账、收款人、汇款及内部资金调拨操作。',
      items: ['Account / 账户', 'Balance / 余额', 'Payee / 收款人', 'Incoming Deposit / 入账', 'Payout / 汇款', 'Internal Funding / OTC', 'Reference / 执行编号回填'],
      tone: 'secondary',
      arrow: 'Manual Operation / Result Sync · 手动执行与结果回填',
    },
    {
      label: '银行 / 外部交易对手',
      desc: '外部付款人、收款银行、Payout 网络和 OTC 对手方。',
      items: ['外部付款人', '收款银行', 'Payout 网络', 'OTC 对手方'],
      tone: 'default',
    },
  ]

  return (
    <section id="architecture" className="space-y-6">
      <SectionHeader
        eyebrow="系统架构"
        title="系统架构总览"
        description="本章只展示整体关系，不展开详细状态机或字段。Fidere Trust 是客户可见主系统；Interlace / BaaS 是底层执行工具，客户不能登录或直接访问。"
        badges={['客户端', '后台 Admin', 'Interlace / BaaS']}
      />
      <GuardrailAlert>
        客户不能看到 Interlace actual balance、USDT 地址、tx hash、Interlace fee、OTC cost、Fidere margin。Internal Funding / OTC 只属于后台执行链路，严禁客户可见；所有关键 Admin 操作必须写入 audit_logs。
      </GuardrailAlert>
      <div className="grid gap-3">
        {rows.map((row, index) => (
          <div key={row.label}>
            {index > 0 ? (
              <div className="py-2 text-center">
                <div className="mx-auto w-fit rounded-full border bg-card px-4 py-1 text-xs font-medium text-muted-foreground">
                  {row.arrow || '↓'}
                </div>
                <div className="text-accent">↓</div>
              </div>
            ) : null}
            <Card className={row.tone === 'primary' ? 'border-primary/30 bg-primary/5' : row.tone === 'secondary' ? 'border-accent/30 bg-accent/5' : ''}>
              <CardContent className="grid gap-4 p-5 md:grid-cols-[240px_minmax(0,1fr)]">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-primary">
                    <Network className="h-4 w-4" />
                    {row.label}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{row.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {row.items.map((item) => (
                    <Badge key={item} variant={row.tone === 'primary' ? 'success' : row.tone === 'secondary' ? 'warning' : 'secondary'}>
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  )
}

export function MvpScopeSection() {
  return (
    <section id="mvp-scope" className="space-y-6">
      <SectionHeader
        eyebrow="MVP 范围"
        title="Phase 1 / Phase 2 MVP 范围"
        description="Phase 1 是半自动执行与 PRD 手册演示；Phase 2 才逐步自动化。"
        badges={['一期', '二期']}
      />
      <Card>
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>范围</TableHead>
                <TableHead>一期 MVP</TableHead>
                <TableHead>二期 MVP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {phaseComparison.map(([area, p1, p2]) => (
                <TableRow key={area}>
                  <TableCell className="font-medium">{area}</TableCell>
                  <TableCell>{p1}</TableCell>
                  <TableCell>{p2}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <ScopeCard title="一期关键词" type="in" items={['半自动执行 / Semi-manual', 'Admin 手动开户', 'Admin 手动 BaaS payout', 'Admin 审核入账', '仅 PRD 演示', '不接真实 API']} />
        <ScopeCard title="二期关键词" type="in" items={['自动开户', '自动 Payee', '自动 Payout', 'Webhook 状态更新', '费用引擎 / Fee Engine', '自动对账', '月结单 / Statement']} />
      </div>
    </section>
  )
}

export function BusinessFlowsSection() {
  const flows = [
    ['美国账户开户', '客户申请 → 扣 USD 500 → Admin 手动 Interlace 开户 → 绑定 ID → 复核账户信息 → 客户看到 Completed'],
    ['转入 / Transfer In', '外部法币入账 / 信托账户转入 → Admin 审核或执行 → 进入 pending / available balance'],
    ['转出 / Transfer Out', '客户选择收款人 → 生成转出订单 → Admin 手动 BaaS 执行 → 上传回单 → 已完成'],
    ['外部入账审核', 'Interlace 检测入账 → Fidere 匹配客户 → 客户看到“审核中” → Admin 审核通过 → 入 client_available_balance'],
  ]

  return (
    <section id="business-flows" className="space-y-6">
      <SectionHeader
        eyebrow="核心业务流程"
        title="核心业务流程总览"
        description="这里只放主流程概览，完整状态机、数据模型和 API 放在后续技术规划章节。"
        badges={['仅概览']}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {flows.map(([title, body]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListChecks className="h-4 w-4 text-accent" />
                {title}
              </CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">{body}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function AccountOpeningModuleSection() {
  return (
    <section id="us-account-opening" className="space-y-6">
      <SectionHeader
        eyebrow="美国账户开户"
        title="美国账户开户模块"
        description="客户申请美国账户并确认 USD 500 开户费；Admin 手动在 Interlace 开户、绑定 ID、复核账户信息后，客户才看到“已完成”。"
        badges={['USD 500 开户费', '手动开户', 'Admin 复核']}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <CompactList title="客户端操作" tone="visible" items={['申请美国账户', '确认 USD 500 开户费', '查看开户状态', 'Completed 后查看账户信息']} />
        <CompactList title="Admin 操作" tone="admin" items={['查看开户请求', '手动 Interlace 开户', '绑定 Interlace accountId', '复核账户信息', '点击完成开户']} />
        <CompactList title="系统 / 台账操作" items={['创建 application', '记录 US_ACCOUNT_OPENING_FEE', '保存绑定关系', '写 audit_logs', '控制 client_visible']} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>开户费用配置与确认</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border bg-card p-4">
              <div className="text-sm font-semibold">默认费用</div>
              <div className="mt-2 text-3xl font-semibold">{openingFeeConfig.currency} {openingFeeConfig.defaultAmount}</div>
              <p className="mt-2 text-sm text-muted-foreground">{openingFeeConfig.description}</p>
            </div>
            <GuardrailAlert>
              {openingFeeConfig.clientNotice}
            </GuardrailAlert>
          </div>
          <CompactList title="Admin 后台能力" tone="admin" items={openingFeeAdminActions} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>开户费用记录字段</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>字段名</TableHead>
                <TableHead>中文说明</TableHead>
                <TableHead>示例 / 枚举</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openingFeeRecordFields.map(([field, label, example]) => (
                <TableRow key={field}>
                  <TableCell className="font-mono text-xs">{field}</TableCell>
                  <TableCell>{label}</TableCell>
                  <TableCell>{example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>开户费用支付状态</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>状态枚举</TableHead>
                <TableHead>中文文案</TableHead>
                <TableHead>说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openingFeeStatuses.map(([status, label, note]) => (
                <TableRow key={status}>
                  <TableCell><Badge variant="secondary">{status}</Badge></TableCell>
                  <TableCell>{label}</TableCell>
                  <TableCell>{note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <FlowDiagram embedded />
    </section>
  )
}

export function BalanceModelManualSection() {
  const rows = [
    ['interlace_actual_balance', 'Interlace / BaaS 返回的真实底层余额', 'No', 'Yes', '仅用于后台对账和执行判断。'],
    ['client_available_balance', 'Fidere 计算后的客户可用余额', 'Yes', 'Yes', '客户前端主要展示余额。'],
    ['pending_incoming_balance', '外部法币入账审核中金额', 'Yes', 'Yes', 'Admin approve 前不可用。'],
    ['pending_transfer_in_balance', '信托账户转入美国账户处理中金额', 'Yes', 'Yes', '完成后转入可用余额。'],
    ['processing_outgoing_balance', '转出处理中金额', 'Yes', 'Yes', '订单完成或取消后释放。'],
    ['frozen_balance', '冻结 / 锁定金额', 'Maybe', 'Yes', '客户可按产品需要看到摘要。'],
    ['ledger_balance', 'Fidere 内部台账余额', 'No', 'Yes', '后台账务基础。'],
    ['difference_amount', 'Interlace 与 Fidere 账面差异', 'No', 'Yes', '必须可解释。'],
    ['difference_reason', '差异原因', 'No', 'Yes', '如 fee、pending、frozen、timing difference。'],
  ]

  return (
    <section id="balance-model" className="space-y-6">
      <SectionHeader
        eyebrow="余额模型"
        title="余额模型与客户可见余额"
        description="客户不能看到 Interlace actual balance。客户看到的是 Fidere 经过台账、费用、冻结和审核规则计算后的 client_available_balance。"
        badges={['客户安全', '后台对账']}
      />
      <BalanceModelSection />
      <Card>
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>余额字段</TableHead>
                <TableHead>含义</TableHead>
                <TableHead>客户可见？</TableHead>
                <TableHead>Admin 可见？</TableHead>
                <TableHead>说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row[0]}>
                  <TableCell className="font-mono text-xs">{row[0]}</TableCell>
                  <TableCell>{row[1]}</TableCell>
                  <TableCell><Badge variant={row[2] === 'No' ? 'danger' : 'success'}>{row[2]}</Badge></TableCell>
                  <TableCell><Badge>{row[3]}</Badge></TableCell>
                  <TableCell>{row[4]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}

function TransferModuleSection({ id, title, type }) {
  const modules = transferModules.filter((item) => item.type === type)
  return (
    <section id={id} className="space-y-6">
      <SectionHeader
        eyebrow={type === 'Transfer In' ? '转入' : '转出'}
        title={title}
        description={type === 'Transfer In' ? '转入分为外部法币入账和信托账户资金转入美国账户两类。' : '转出分为美国账户已有实际余额转出和信托账户资金调拨后转出两类。'}
        badges={['客户视图', 'Admin 执行', '余额影响']}
      />
      {id === 'transfer-in' ? (
        <GuardrailAlert>转入 / 转出边界：信托资金转入美国账户只支持同币种转入，不涉及换汇、数字货币兑换或 OTC；Internal USDT Funding、tx hash、BaaS address 如出现在其他后台流程中，必须标记为“仅后台可见 / 严禁客户可见”。</GuardrailAlert>
      ) : null}
      <div className="grid gap-5">
        {modules.map((module) => (
          <Card key={module.title}>
            <CardHeader>
              <CardTitle>{module.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{module.summary}</p>
            </CardHeader>
            <CardContent className="grid gap-5 xl:grid-cols-[1fr_1fr]">
              <div>
                <div className="mb-3 text-sm font-semibold text-muted-foreground">流程图</div>
                <StepFlow steps={module.flow} />
              </div>
              <div className="grid gap-4">
                <CompactList title="客户可见内容" tone="visible" items={module.clientVisible} />
                <CompactList title="客户不可见内容" tone="hidden" items={module.clientHidden} />
                <CompactList title="Admin 可见内容" tone="admin" items={module.adminVisible} />
                <CompactList title="余额影响" items={module.balanceImpact} />
                <div className="flex flex-wrap gap-2">
                  {module.status.slice(0, 6).map((status) => <Badge key={status} variant="secondary">{status}</Badge>)}
                  {module.status.length > 6 ? <Badge variant="outline">完整状态机见后文</Badge> : null}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function TransferInSection() {
  return <TransferModuleSection id="transfer-in" title="转入 / Transfer In 模块" type="Transfer In" />
}

export function TransferOutSection() {
  return <TransferModuleSection id="transfer-out" title="转出 / Transfer Out 模块" type="Transfer Out" />
}

export function IncomingReviewSection() {
  const fields = ['interlace_transaction_id', 'payer_name', 'payer_bank', 'amount', 'currency', 'received_at', 'matched client', 'raw_response', 'review action', 'ledger posting result']
  return (
    <section id="incoming-review" className="space-y-6">
      <SectionHeader
        eyebrow="入账审核"
        title="外部法币入账审核模块"
        description="Interlace incoming webhook / API 只生成 incoming_fiat_deposits；Admin 审核通过后才计入客户可用余额。"
        badges={['审核中', 'Admin 审核通过']}
      />
      <StepFlow steps={['Interlace 检测到入账', 'Fidere 生成 pending incoming_fiat_deposit', '系统匹配客户', '客户看到“审核中”', 'Admin 审核付款人 / 金额 / 用途', 'Admin 审核通过 / 拒绝', '系统计入 client_available_balance']} />
      <Card>
        <CardHeader><CardTitle>审核字段</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {fields.map((field) => <Badge key={field} variant="secondary">{field}</Badge>)}
        </CardContent>
      </Card>
    </section>
  )
}

export function BeneficiarySection() {
  return (
    <section id="beneficiary" className="space-y-6">
      <SectionHeader
        eyebrow="收款人"
        title="收款人 / Beneficiary 模块"
        description="Fidere Beneficiary 是客户可见主数据；BaaS Payee 是 Admin 内部执行对象。Phase 1 不自动同步 Payee。"
        badges={['Fidere Beneficiary', 'BaaS Payee']}
      />
      <StepFlow steps={['Fidere Beneficiary / Fidere 收款人', 'Admin 审核', '手动录入 BaaS', '记录 BaaS Payee ID', '发起 Payout']} />
      <div className="grid gap-4 md:grid-cols-2">
        <CompactList title="客户端" tone="visible" items={['新增 / 编辑 / 停用收款人', '发起转账时只能选择 Fidere 系统内收款人', '不看到 BaaS Payee ID']} />
        <CompactList title="Admin" tone="admin" items={['审核收款人', '手动把银行资料录入 Interlace', '记录 BaaS Payee ID', '查看相关转账记录']} />
      </div>
    </section>
  )
}

export function InteractiveDemosSection() {
  return (
    <section id="interactive-demos" className="space-y-8">
      <SectionHeader
        eyebrow="交互式演示"
        title="交互式演示区"
        description="以下为本地模拟状态，仅用于 PRD 演示，不调用真实 API、不写数据库。"
        badges={['本地状态', '仅演示数据']}
      />
      <AdminDemo embedded />
      <TransferInOutSimulator embedded />
      <ClientAdminVisibility embedded />
    </section>
  )
}

export function DataModelsSection() {
  const baseRows = [
    ['us_account_applications', '美国账户申请', 'id、client_id、trust_id、application_status、opening_fee_amount、opening_fee_ledger_entry_id、requested_at、completed_at', '部分可见', 'Yes', '记录申请和 USD 500 开户费流程。'],
    ['us_account_opening_fees', '美国账户开户费用记录', 'id、fee_type、amount、currency、account_type、client_id、application_id、payment_status、created_at', '部分可见', 'Yes', '默认 USD 500；金额应来自配置，不在前端写死；Admin 可手动标记已支付或豁免。'],
    ['us_accounts', '美国账户主数据', 'id、client_id、trust_id、provider、interlace_customer_id、interlace_account_id、account_holder_name、bank_name、routing_number、account_number、client_visible', '复核后部分可见', 'Yes', '账户信息必须 Admin 复核后展示。'],
    ['account_balances', '余额模型', 'interlace_actual_balance、client_available_balance、pending_incoming_balance、pending_transfer_in_balance、processing_outgoing_balance、frozen_balance、ledger_balance、difference_reason', '部分可见', 'Yes', 'Interlace actual balance 仅 Admin 可见。'],
    ['beneficiaries', 'Fidere 收款人主数据', 'id、client_id、trust_id、beneficiary_type、name、country、relationship_to_client、status、risk_level', 'Yes', 'Yes', '客户可见收款人。'],
    ['beneficiary_bank_accounts', '收款人银行账户', 'beneficiary_id、account_name、bank_name、bank_country、account_number、swift_bic、iban、routing_number、currency', 'Yes', 'Yes', '用于 Admin 手动录入 BaaS。'],
    ['baas_manual_entries', '手动 BaaS 执行记录', 'transfer_id、interlace_payee_id、interlace_payout_id、interlace_reference_id、entered_by、receipt_url、entry_status', '回单部分可见', 'Yes', '内部执行 ID 不客户可见。'],
    ['audit_logs', '审计日志', 'entity_type、entity_id、action、actor_id、before_value、after_value、created_at', 'No', 'Yes', '关键操作留痕。'],
  ]
  const transferRows = transferDataModels.map(([table, purpose, fields, visible, notes]) => [table, purpose, fields, visible, 'Yes', notes])

  return (
    <section id="data-models" className="space-y-6">
      <SectionHeader eyebrow="技术规划" title="数据模型规划" description="所有数据表集中在本章展示，业务流程章节不展开完整表结构。" badges={['数据模型']} />
      <Card>
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>表名</TableHead>
                <TableHead>用途</TableHead>
                <TableHead>关键字段</TableHead>
                <TableHead>客户可见？</TableHead>
                <TableHead>Admin 可见？</TableHead>
                <TableHead>说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...baseRows, ...transferRows].map((row) => (
                <TableRow key={row[0]}>
                  <TableCell className="font-mono text-xs">{row[0]}</TableCell>
                  <TableCell>{row[1]}</TableCell>
                  <TableCell>{row[2]}</TableCell>
                  <TableCell><Badge variant={row[3] === 'No' ? 'danger' : 'secondary'}>{row[3]}</Badge></TableCell>
                  <TableCell>{row[4]}</TableCell>
                  <TableCell>{row[5]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}

export function StateMachinesSection() {
  const clientStatusLabel = (status) => {
    if (status.includes('UNDER_REVIEW')) return '审核中'
    if (status.includes('APPROVED')) return '已审核'
    if (status.includes('COMPLETED') || status === 'Completed') return '已完成'
    if (status.includes('FAILED') || status === 'Failed') return '失败'
    if (status.includes('CANCELLED')) return '已取消'
    if (status.includes('REJECTED') || status === 'Rejected') return '已拒绝'
    if (status.includes('POSTED_TO_CLIENT_BALANCE')) return '已计入客户可用余额'
    if (status.includes('PENDING') || status.includes('SUBMITTED') || status.includes('FROZEN')) return '处理中'
    return status
  }

  const allRows = [
    ...stateRows.map(([status, description, owner, next]) => ['美国账户开户', status, owner, clientStatusLabel(status), '开户状态流转，不直接影响余额', next]),
    ...transferModules.flatMap((module) => module.status.map((status, index) => [
      module.title,
      status,
      status.includes('ADMIN') || status.includes('BAAS') || status.includes('OTC') || status.includes('FUNDING') ? 'Admin / System' : 'Client / System',
      clientStatusLabel(status),
      module.balanceImpact[Math.min(index, module.balanceImpact.length - 1)] || 'See balance impact rules',
      index < module.status.length - 1 ? module.status[index + 1] : 'Terminal state',
    ])),
    ['外部入账', 'DETECTED', 'Webhook / System', '审核中', 'pending_incoming_balance 增加，client_available_balance 不变', 'MATCHED'],
    ['外部入账', 'POSTED_TO_CLIENT_BALANCE', 'System', '已审核 / 可用', 'pending_incoming_balance 减少，client_available_balance 增加', 'Terminal state'],
    ['Internal Funding / 内部资金调拨', 'FUNDING_PENDING → FUNDING_CONFIRMED → OTC_COMPLETED → PAYOUT_READY', '仅后台可见', '严禁客户可见', '仅内部执行，不作为客户入账', '手动 BaaS payout'],
  ]

  return (
    <section id="state-machines" className="space-y-6">
      <SectionHeader eyebrow="技术规划" title="状态机规划" description="所有状态机集中在本章，流程章节只保留简版状态摘要。" badges={['状态机']} />
      <Card>
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>场景</TableHead>
                <TableHead>状态枚举</TableHead>
                <TableHead>责任方</TableHead>
                <TableHead>客户显示文案</TableHead>
                <TableHead>余额影响</TableHead>
                <TableHead>下一步规则</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allRows.map((row, index) => (
                <TableRow key={`${row[0]}-${row[1]}-${index}`}>
                  <TableCell className="font-medium">{row[0]}</TableCell>
                  <TableCell><Badge variant="secondary">{row[1]}</Badge></TableCell>
                  <TableCell>{row[2]}</TableCell>
                  <TableCell>{row[3]}</TableCell>
                  <TableCell>{row[4]}</TableCell>
                  <TableCell>{row[5]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}

export function ApiWebhooksSection() {
  return (
    <section id="api-webhooks" className="space-y-6">
      <SectionHeader eyebrow="技术规划" title="API / Webhook 规划" description="所有 API 和 webhook 集中在本章；本页面不实现真实接口。" badges={['客户端 API', 'Admin API', 'Webhooks']} />
      <Card>
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>方法</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>用途</TableHead>
                <TableHead>使用方</TableHead>
                <TableHead>阶段</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transferApiRows.map(([method, endpoint, purpose, usedBy, phase]) => (
                <TableRow key={`${method}-${endpoint}`}>
                  <TableCell><Badge>{method}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{endpoint}</TableCell>
                  <TableCell>{purpose}</TableCell>
                  <TableCell>{usedBy}</TableCell>
                  <TableCell>{phase}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <GuardrailAlert>API 边界：Client API 不得返回 Interlace actual balance、USDT address、Interlace fee、OTC cost、Fidere margin；Webhook incoming-deposit 只创建 pending record；Admin 审核通过后才更新 client_available_balance。</GuardrailAlert>
    </section>
  )
}

export function AuditLogsSection() {
  const groups = [
    ['开户审计日志', ['客户申请美国账户', '客户确认 USD 500 开户费', 'Admin 绑定 Interlace ID', 'Admin 确认账户信息']],
    ['转入审计日志', transferAuditLogs.slice(0, 8)],
    ['转出审计日志', transferAuditLogs.slice(8, 17)],
    ['外部入账审计日志', transferAuditLogs.slice(17)],
    ['余额调整审计日志', ['Manual adjustment', 'TRANSFER_FROZEN', 'TRANSFER_RELEASED', 'client_available_balance updated']],
    ['敏感字段查看 / 修改日志', ['查看 Interlace accountId', '查看 raw_response', '修改 adminRemark', '查看 internal funding / OTC records']],
  ]
  const rows = groups.flatMap(([group, items]) =>
    items.map((item) => [
      item,
      item.startsWith('Client') ? '客户端' : item.startsWith('System') || item.includes('Webhook') ? '系统 / Webhook' : 'Admin',
      group,
      'actor_id、entity_type、entity_id、before_value、after_value、created_at',
      group,
    ]),
  )

  return (
    <section id="audit-logs" className="space-y-6">
      <SectionHeader eyebrow="审计日志" title="审计日志规划" description="所有 audit_logs 集中在本章，按模块归类。" badges={['必须审计留痕']} />
      <Card>
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>动作</TableHead>
                <TableHead>触发方</TableHead>
                <TableHead>实体</TableHead>
                <TableHead>必填字段</TableHead>
                <TableHead>说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={`${row[0]}-${index}`}>
                  <TableCell>{row[0]}</TableCell>
                  <TableCell>{row[1]}</TableCell>
                  <TableCell>{row[2]}</TableCell>
                  <TableCell>{row[3]}</TableCell>
                  <TableCell>{row[4]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}

export function ExceptionsSection() {
  const extra = [
    { title: '入账无法匹配客户', content: '保持 DETECTED / MATCHED 异常状态，Admin 手动匹配，不进入客户可用余额。' },
    { title: 'Admin 错误绑定 accountId', content: '冻结客户展示，记录审计日志，Admin 纠正绑定并复核。' },
    { title: 'Transfer 被取消', content: '释放 frozen balance，processing / pending 余额减少，写 audit_logs。' },
    { title: 'Internal funding 已发生但 payout 失败', content: '保留 internal_funding_events，Admin 处理退款、再执行或人工调整，不客户可见。' },
    { title: 'OTC 成本与客户费用出现差异', content: '只在 Admin Fee & Profit 视图解释，不向客户展示。' },
    { title: 'Webhook 重复推送', content: '按 provider transaction id 幂等处理，避免重复入账。' },
    { title: '手动完成订单后发现回单错误', content: 'Admin 更正 receipt，记录 before / after audit log。' },
  ]
  return (
    <section id="exceptions" className="space-y-6">
      <SectionHeader eyebrow="风险边界" title="异常情况与边界处理" description="异常处理集中在本章，用于开发和测试设计。" badges={['异常处理']} />
      <Accordion items={[...exceptionItems, ...extra]} />
    </section>
  )
}

export function OutOfScopeSection() {
  const items = ['不自动开户', '不接真实 Interlace API', '不自动创建 BaaS Payee', '不自动 payout', '不做真实 webhook', '不写数据库', '不做客户钱包', '不开放 USDT 充值', '不展示 USDT 地址', '不展示链上流水', '不展示 Interlace actual balance', '不展示 Interlace fee', '不展示 OTC cost', '不展示 Fidere margin', '不做复杂 RBAC', '不做多角色后台', '不做多通道路由']
  return (
    <section id="out-of-scope" className="space-y-6">
      <SectionHeader eyebrow="一期边界" title="一期不做事项" description="所有 Out-of-Scope 集中在本章，避免在各业务模块重复出现。" badges={['警示']} />
      <ScopeCard title="一期不做 / Out-of-Scope" type="out" items={items} />
    </section>
  )
}

export function DeveloperNotesSection() {
  return (
    <section id="developer-notes" className="space-y-6 pb-12">
      <SectionHeader eyebrow="开发注意事项" title="开发注意事项 / Developer Notes" description="本章放在最后，作为未来接入真实业务功能时的开发边界。" badges={['不调用 API', '不写数据库']} />
      <GuardrailAlert variant="destructive">本页面是 PRD 手册，不是业务功能；所有演示数据都是本地 mock；未来实现时必须做 Client API 与 Admin API 字段过滤，Admin 全部关键动作必须 audit log。</GuardrailAlert>
      <div className="grid gap-4 md:grid-cols-2">
        <CompactList title="实现边界" items={['不调用真实 API', '不写数据库', '不接真实 Interlace', '不改变业务规则', '不新增客户钱包或 USDT 充值']} />
        <CompactList title="未来实现原则" items={['余额展示以 client_available_balance 为准', 'Interlace actual balance 只能 Admin 后台对账使用', 'Client API 和 Admin API 返回字段必须分离', 'Internal funding 不得作为客户 deposit']} />
      </div>
    </section>
  )
}
