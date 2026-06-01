import { ArrowRight, CheckCircle2, Database, Layers3, ListChecks, RefreshCw, ShieldCheck, Workflow } from 'lucide-react'

import { PrdBackLink } from '../components/portal/PrdBackLink'
import { ProductManualLayout } from '../components/portal/ProductManualLayout'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const reformGoals = [
  '统一客户侧、Admin 后台和 BaaS / Interlace 执行侧的账户、余额、费用与审核口径。',
  '把开户、入金、出金、内部转账、冻结解冻和后台手动执行流程拆成可落地的业务模块。',
  '明确哪些数据客户可见、哪些仅后台可见，避免 BaaS 底层执行信息误暴露给客户。',
]

const workstreams = [
  {
    title: '账户体系改造',
    description: '梳理香港信托账户、美国账户、数字资产账户之间的账户层级、状态流转、开户资料复用和账户切换规则。',
    items: ['账户状态统一', '开户资料补齐', '账户入口切换', '客户可见信息边界'],
  },
  {
    title: '资金与余额改造',
    description: '定义可用余额、冻结余额、待审核金额、到账金额和后台实际余额之间的关系，确保每笔转账都可解释。',
    items: ['可用余额', '冻结金额', '预估手续费', '预估到账', '后台对账'],
  },
  {
    title: '审核与执行改造',
    description: '把客户提交、二次确认、后台审核、BaaS 手动执行、回单上传和审计日志串成闭环。',
    items: ['待审核列表', '审核通过 / 拒绝', '手动执行记录', '操作审计', '异常处理'],
  },
]

const adminNavigationModules = [
  ['Accounts & Funding', '账户信息 / 入金指令', '香港信托账户、美国账户、数字资产账户、Global Account 与入金指引。'],
  ['Business Network', '收款人/交易对手', '运营为客户维护 beneficiary/counterparty，后台保留 BaaS Payee 映射。'],
  ['Payments', '创建转账', '运营选择客户、账户、币种、金额和费用，使用 2-3 步向导提交。'],
  ['Transaction History', '订单记录', 'PayIn、Payout、内部转账、Conversion 统一列表、筛选和 CSV 下载。'],
  ['Approvals', '审批中心', '待审核、待手动执行、待上传回单、异常处理。'],
]

const operatorActionMappings = [
  ['开户', '运营为客户提交/补齐资料，确认开户费，后台手动开户并绑定 accountId。'],
  ['入金', '运营为客户生成入金指令，或审核外部入账后入客户可用余额。'],
  ['内部转账', '运营选择客户、转出账户、转入账户、币种、金额、手续费，确认后生成待审核记录。'],
  ['出金', '运营选择客户收款人、付款账户、金额和费用，提交后冻结余额，进入后台执行。'],
  ['订单查看', '所有原客户订单状态改为运营可筛选、可查看、可处理的列表。'],
]

const dataModelFields = [
  'selectedClient',
  'selectedTrust',
  'selectedAccount',
  'createdByRole = OPERATOR',
  'createdForClientId',
  'clientVisibleStatus / adminExecutionStatus',
  'feeAmountDisplay / estimatedArrivalAmount',
  'auditTrail',
]

const apiDirections = [
  '客户端 API 不作为主交互入口推进。',
  '管理端 API 增加运营创建能力，例如 POST /api/admin/clients/:clientId/internal-transfers。',
  'Payout 使用 POST /api/admin/clients/:clientId/payouts，并统一进入审批与后台执行链路。',
  '所有运营发起动作必须写 audit log，记录运营人员、客户、动作、提交前后数据和原因备注。',
]

const implementationSummary = [
  {
    title: '账户切换与快捷入口',
    description: '开户原型已支持在香港信托账户与美国账户之间切换视图；快捷链接分别提供“转账至美国账户”和“转账至香港账户”。',
    tags: ['香港信托账户', '美国账户', '账户切换', '快捷链接'],
  },
  {
    title: '内部法币互转表单',
    description: '互转页面展示转出账户、转入账户、币种、金额、手续费模式、预估手续费和预估到账金额；币种默认 USD，手续费支持固定值与百分比演示切换。',
    tags: ['转出账户', '转入账户', '币种', '手续费', '预估到账'],
  },
  {
    title: '二次确认与待审核记录',
    description: '提交前进入确认弹窗，确认后生成 UNDER_REVIEW 记录；记录列表展示申请编号、账户方向、币种、金额、手续费金额、预估到账、状态和提交时间。',
    tags: ['二次确认', 'UNDER_REVIEW', '待后台审核', '转账记录'],
  },
  {
    title: '资金冻结口径',
    description: '页面文案已明确：提交成功后转账金额先被冻结并从转出账户可用余额中扣除；审核通过后转入账户增加可用余额，拒绝或取消时释放冻结金额。',
    tags: ['冻结金额', '可用余额扣减', '审核通过入账', '释放冻结'],
  },
]

const phases = [
  ['Phase 1', '原型与 PRD 对齐', '补齐页面入口、流程说明、状态文案和关键交互，供产品与开发确认。'],
  ['Phase 2', 'Admin 流程落地', '拆分后台审核、手动 BaaS 录入、回单上传、冻结解冻和审计日志。'],
  ['Phase 3', '接口与数据落地', '对接真实 API 前完成字段映射、权限过滤、错误处理和对账模型。'],
]

const acceptanceItems = [
  '客户侧不能看到 BaaS Payee ID、Payout ID、USDT 地址、底层手续费、OTC 成本和平台利润。',
  '任何需要后台审核的资金动作，提交后必须先冻结并扣减转出账户可用余额。',
  '审核拒绝、取消或失败时必须释放冻结金额，并保留完整操作记录。',
  'Admin 手动执行 BaaS 动作时，必须记录参考编号、执行人、时间、结果和回单。',
]

function SectionTitle({ icon: Icon, eyebrow, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="text-xs font-bold uppercase text-blue-700">{eyebrow}</div>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </div>
  )
}

export function BaasSystemReformPage({ onBack, onOpenWorkbench }) {
  return (
    <ProductManualLayout>
      <main className="mx-auto max-w-[1160px] px-6 py-8 md:px-10">
        <PrdBackLink onClick={onBack} />

        <section className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">BaaS</Badge>
            <Badge variant="secondary">系统改造</Badge>
            <Badge variant="secondary">PRD Draft</Badge>
          </div>
          <h1 className="mt-5 text-4xl font-semibold text-slate-950 md:text-5xl">BaaS系统改造</h1>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
            本模块用于承载 BaaS / Interlace 相关系统改造规划，重点把客户账户、后台审核、资金冻结、手动执行、费用展示和审计记录统一到同一套产品口径中；最新代码中的账户互转客户端逻辑已并入下方总结。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={onOpenWorkbench} className="rounded-xl bg-slate-950 text-white hover:bg-slate-800">
              进入管理端运营工作台原型
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Badge variant="secondary" className="px-3 py-2">旧 BaaS 客户端原型保留为参考入口</Badge>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {reformGoals.map((goal) => (
            <Card key={goal} className="border bg-white">
              <CardContent className="flex h-full gap-3 p-5">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-sm leading-6 text-slate-700">{goal}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-10 space-y-5">
          <SectionTitle
            icon={Workflow}
            eyebrow="Workbench"
            title="管理端运营工作台"
            description="将原客户端功能迁移为运营操作，固定采用左侧模块导航、顶部客户/主体上下文和主区列表/向导/详情。"
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {adminNavigationModules.map(([group, title, description]) => (
              <Card key={`${group}-${title}`} className="border bg-white">
                <CardContent className="p-5">
                  <Badge variant="secondary">{group}</Badge>
                  <h3 className="mt-3 text-lg font-semibold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[0.55fr_0.45fr]">
          <Card className="border bg-white">
            <CardHeader>
              <SectionTitle
                icon={ShieldCheck}
                eyebrow="On Behalf Of Client"
                title="客户端动作迁移"
                description="运营人员必须先选客户/信托/账户，再以客户角度发起动作，同时保留管理端执行字段。"
              />
            </CardHeader>
            <CardContent className="space-y-3">
              {operatorActionMappings.map(([action, description]) => (
                <div key={action} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="font-semibold text-slate-950">{action}</div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border bg-white">
            <CardHeader>
              <SectionTitle
                icon={Database}
                eyebrow="Data & API"
                title="接口与数据模型"
                description="原型先沉淀字段和接口方向，后续接真实后台时保持客户可见状态与后台执行状态分离。"
              />
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="text-sm font-semibold text-slate-950">核心状态字段</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {dataModelFields.map((field) => <Badge key={field} variant="secondary">{field}</Badge>)}
                </div>
              </div>
              <div className="space-y-3">
                {apiDirections.map((item) => (
                  <div key={item} className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-slate-700">{item}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 space-y-5">
          <SectionTitle
            icon={RefreshCw}
            eyebrow="Merged Summary"
            title="已合并代码总结"
            description="基于最新拉取的账户互转客户端逻辑，沉淀为后续后台审核、余额冻结和接口落地的产品摘要。"
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {implementationSummary.map((item) => (
              <Card key={item.title} className="border bg-white">
                <CardHeader>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-10 space-y-5">
          <SectionTitle
            icon={Layers3}
            eyebrow="Scope"
            title="改造范围"
            description="先按业务责任拆分模块，再逐步落到页面、接口、数据字段和后台操作。"
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {workstreams.map((stream) => (
              <Card key={stream.title} className="border bg-white">
                <CardHeader>
                  <CardTitle className="text-xl">{stream.title}</CardTitle>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{stream.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {stream.items.map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[0.58fr_0.42fr]">
          <Card className="border bg-white">
            <CardHeader>
              <SectionTitle
                icon={ListChecks}
                eyebrow="Roadmap"
                title="阶段路径"
                description="当前先服务 PRD 与原型确认，后续再向后台和接口实现推进。"
              />
            </CardHeader>
            <CardContent className="space-y-4">
              {phases.map(([phase, title, description]) => (
                <div key={phase} className="rounded-2xl border bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Badge variant="secondary">{phase}</Badge>
                    <span className="text-sm font-semibold text-slate-950">{title}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">验收关注点</CardTitle>
              <p className="mt-2 text-sm leading-6 text-slate-600">用于判断改造方案是否满足客户可见边界、资金安全和后台审计要求。</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {acceptanceItems.map((item) => (
                <div key={item} className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </ProductManualLayout>
  )
}
