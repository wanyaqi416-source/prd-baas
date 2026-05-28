import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  Copy,
  FileText,
  Globe2,
  HelpCircle,
  Landmark,
  Languages,
  LayoutDashboard,
  RefreshCw,
  Send,
  ShieldCheck,
  Sun,
  UserRound,
  WalletCards,
  X,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

const demoStatuses = [
  { id: 'not_opened', label: '未开通' },
  { id: 'submitted', label: '扣费成功 / 待审核' },
  { id: 'reviewing', label: '审核中' },
  { id: 'failed', label: '审核拒绝' },
  { id: 'opened', label: '开户成功' },
]

const usStatusMeta = {
  submitted: { label: '待审核', badge: 'warning', title: '开户申请已提交', icon: Clock3 },
  reviewing: { label: '审核中', badge: 'secondary', title: '开户审核中', icon: ShieldCheck },
  failed: { label: '开户失败', badge: 'danger', title: '开户失败', icon: CircleAlert },
  opened: { label: '已开通', badge: 'success' },
}

const bankAccountRows = [
  ['账户持有人姓名', 'WANYARA OP WAN'],
  ['银行名称', 'Fidere Partner Bank'],
  ['账户号码', '232232'],
  ['Routing Number', '026009593'],
  ['币种', 'USD'],
]

function DemoBar({ status, onStatusChange, onPrototypeHome }) {
  return (
    <div className="border-b border-blue-100 bg-blue-50/95 px-5 py-3">
      <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onPrototypeHome} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
          <ArrowLeft className="h-4 w-4" />
          返回 BaaS 原型
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">仅原型演示使用</span>
          <span className="text-xs text-slate-500">快速切换美国账户状态，不属于真实客户端功能</span>
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="h-9 rounded-lg border border-blue-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none"
          >
            {demoStatuses.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

function ClientTopNav({ onBack }) {
  const navItems = [
    [LayoutDashboard, '仪表板'],
    [WalletCards, '账户'],
    [Banknote, '卡片'],
    [Globe2, '投资'],
    [RefreshCw, '交易'],
    [FileText, '信托服务'],
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1380px] items-center justify-between px-6">
        <div className="flex items-center gap-7">
          <button type="button" onClick={onBack} className="text-xl font-bold tracking-tight text-slate-800">
            FIDERE
          </button>
          <nav className="hidden items-center gap-2 text-sm text-slate-500 md:flex">
            {navItems.map(([Icon, label]) => (
              <button
                key={label}
                type="button"
                className={label === '账户' ? 'inline-flex h-9 items-center gap-2 rounded-xl bg-blue-600 px-4 font-semibold text-white shadow-sm' : 'inline-flex h-9 items-center gap-2 rounded-xl px-3 font-medium hover:bg-slate-100'}
              >
                <Icon className="h-4 w-4" />
                {label}
                {label === '投资' ? <ChevronDown className="h-3.5 w-3.5" /> : null}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <Languages className="h-4 w-4" />
          <Sun className="h-4 w-4" />
          <div className="h-7 w-px bg-slate-200" />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
            <UserRound className="h-4 w-4" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
          </div>
        </div>
      </div>
    </header>
  )
}

function AccountHero({ status, onOpenJurisdiction }) {
  const hasUsAccount = status !== 'not_opened'
  const opened = status === 'opened'
  const usMeta = usStatusMeta[status]
  const accountTabs = [
    [Landmark, '香港信托账户', !hasUsAccount],
    [WalletCards, '数字资产账户', false],
    ...(hasUsAccount ? [[Globe2, '美国账户', true]] : []),
  ]

  return (
    <section className="relative overflow-hidden bg-[#052744] px-5 py-8 text-white md:px-7 md:py-9">
      <div className="absolute inset-y-0 right-0 w-1/2 rounded-l-full bg-blue-500/10" />
      <div className="relative mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <div className="inline-flex flex-wrap gap-1 rounded-xl border border-white/10 bg-black/20 p-1">
            {accountTabs.map(([Icon, label, active]) => (
              <button
                key={label}
                type="button"
                className={active ? 'rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900' : 'rounded-lg px-4 py-2 text-sm font-semibold text-blue-100 hover:bg-white/10'}
              >
                <Icon className="mr-2 inline h-4 w-4" />
                {label}
                {label === '美国账户' && usMeta ? <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] text-blue-700">{usMeta.label}</span> : null}
              </button>
            ))}
          </div>
          {hasUsAccount ? (
            <>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-blue-100">账户余额：美国账户</span>
                <Badge variant={usMeta.badge}>{usMeta.label}</Badge>
              </div>
              <div className="mt-2 text-5xl font-bold tracking-tight md:text-6xl">{opened ? '$82430.27' : '$0.00'}</div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-blue-100">
                <span>冻结金额：{opened ? 'USD 200.00' : 'USD 0.00'}</span>
                <RefreshCw className="h-4 w-4" />
              </div>
            </>
          ) : (
            <>
              <div className="mt-7 text-sm font-medium text-blue-100">账户余额：香港信托</div>
              <div className="mt-2 text-5xl font-bold tracking-tight md:text-6xl">$96037.39</div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-blue-100">
                在岸信托账户
                <span>处理中：$25.66</span>
                <RefreshCw className="h-4 w-4" />
              </div>
            </>
          )}
          {status === 'submitted' || status === 'reviewing' || status === 'failed' ? null : (
            <div className="mt-7 flex flex-wrap gap-3">
              {opened ? (
                <>
                  <button type="button" className="inline-flex h-11 items-center gap-2 rounded-lg bg-sky-500 px-5 text-sm font-semibold text-white shadow-sm">
                    <Banknote className="h-4 w-4" />
                    ↗ 存入资金
                  </button>
                  <button type="button" className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#083861] px-5 text-sm font-semibold text-white hover:bg-[#0a4776]">
                    <Send className="h-4 w-4" />
                    ↗ 法币转出
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="inline-flex h-11 items-center gap-2 rounded-lg bg-sky-500 px-5 text-sm font-semibold text-white shadow-sm">
                    <Banknote className="h-4 w-4" />
                    ↗ 存入资金
                  </button>
                  <button type="button" className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#083861] px-5 text-sm font-semibold text-white hover:bg-[#0a4776]">
                    <Send className="h-4 w-4" />
                    ↗ 法币转出
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-blue-400/20 bg-blue-900/45 p-6 shadow-inner">
          <h2 className="text-xl font-bold">{hasUsAccount ? '美国账户服务' : '管理信托资产'}</h2>
          <p className="mt-3 text-sm leading-6 text-blue-100">
            {hasUsAccount
              ? '美国账户用于查看银行收款账户、同币种入金、法币转出和账户信息。'
              : '连接您的全球银行账户，无缝管理您的信托投资组合和分配。'}
          </p>
          <div className="mt-5 grid gap-3 text-sm text-blue-50 sm:grid-cols-2">
            {(hasUsAccount ? ['银行收款账户', '同币种交易', '账户信息', '账户状态'] : ['财富管理', '法币转出', '信托账单']).map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-sky-300" />
                {item}
              </div>
            ))}
          </div>
          {!hasUsAccount ? (
            <button
              type="button"
              onClick={onOpenJurisdiction}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-sky-500 px-5 text-sm font-semibold text-white shadow-sm hover:bg-sky-400"
            >
              <Globe2 className="h-4 w-4" />
              ↗ 开设其他法域账户
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function QuickActionDock({ status, onOpenAccountInfo }) {
  if (status === 'submitted' || status === 'reviewing' || status === 'failed') {
    return null
  }

  const opened = status === 'opened'
  const actions = opened
    ? [
        [Banknote, '存入资金', undefined],
        [Send, '法币转出', undefined],
        [Landmark, '查看账户信息', onOpenAccountInfo],
        [RefreshCw, '兑换', undefined],
      ]
    : [
        [Landmark, '银行存入', undefined],
        [WalletCards, '数字资产存入', undefined],
        [Send, '转账给受益人', undefined],
        [RefreshCw, '兑换', undefined],
      ]

  return (
    <section className="mx-auto -mt-7 max-w-[1280px] px-5">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex gap-6 overflow-x-auto">
          <div className="flex min-w-[72px] items-center border-r border-slate-100 pr-5 text-sm font-bold text-blue-700">快捷<br />链接</div>
          {actions.map(([Icon, label, action]) => (
            <button
              key={label}
              type="button"
              onClick={action}
              className="min-w-[128px] rounded-lg bg-slate-50 p-4 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-500 shadow-sm">
                <Icon className="h-5 w-5" />
              </span>
              ↗ {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function JurisdictionPicker({ onClose, onSelectUs }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[520px] rounded-3xl bg-white p-6 shadow-2xl">
        <ModalHeader eyebrow="Open jurisdiction account" title="选择开通账户" onClose={onClose} />
        <p className="mt-2 text-sm leading-6 text-slate-500">当前可申请美国账户；新加坡账户为后续法域，暂不可提交。</p>
        <div className="mt-6 grid gap-3">
          <button type="button" onClick={onSelectUs} className="flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 p-4 text-left hover:border-blue-400">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <Landmark className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-bold text-slate-950">↗ 美国账户</span>
                <span className="mt-1 block text-sm text-slate-500">开户费 USD 500，扣费成功后进入后台开户流程。</span>
              </span>
            </div>
            <ArrowRight className="h-5 w-5 text-blue-600" />
          </button>
          <button type="button" disabled className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left opacity-70">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                <Building2 className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-bold text-slate-700">新加坡账户</span>
                <span className="mt-1 block text-sm text-slate-500">后续支持，当前不可申请。</span>
              </span>
            </div>
            <Badge variant="secondary">待开放</Badge>
          </button>
        </div>
      </div>
    </div>
  )
}

function FeeConfirmModal({ onClose, onConfirm }) {
  const rows = [
    ['扣费账户', '香港信托账户'],
    ['扣费币种', 'USD'],
    ['扣费金额', 'USD 500.00'],
    ['当前可用余额', 'USD 1,200.00'],
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[480px] rounded-3xl bg-white p-6 shadow-2xl">
        <ModalHeader eyebrow="Opening fee" title="确认开通并扣费" onClose={onClose} />
        <p className="mt-2 text-sm leading-6 text-slate-500">开通美国账户将扣除 USD 500 开户费。扣费成功后，系统生成开户申请记录并进入待审核状态。</p>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between border-b border-slate-200 py-3 last:border-b-0">
              <span className="text-sm text-slate-500">{label}</span>
              <span className="text-sm font-bold text-slate-950">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <Button type="button" onClick={onConfirm} className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700">
            ↗ 确认开通并扣费
          </Button>
          <Button type="button" onClick={onClose} variant="outline" className="rounded-lg">
            取消
          </Button>
        </div>
      </div>
    </div>
  )
}

function ModalHeader({ eyebrow, title, onClose }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-semibold uppercase tracking-wide text-blue-500">{eyebrow}</div>
        <h3 className="mt-1 text-2xl font-bold text-slate-950">{title}</h3>
      </div>
      <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

function MainContent({ status, onOpenAccountInfo }) {
  if (status === 'not_opened') {
    return <TrustAccountAssets />
  }

  if (status === 'opened') {
    return <AssetDistribution status={status} />
  }

  return (
    <div className="grid gap-6">
      <UsAccountStatusPanel status={status} onOpenAccountInfo={onOpenAccountInfo} />
      <AssetDistribution status={status} />
    </div>
  )
}

function UsAccountStatusPanel({ status }) {
  const meta = usStatusMeta[status]
  const Icon = meta.icon
  const descriptions = {
    submitted: '开户费用已扣除，申请已进入 Fidere 后台处理队列。Fidere Admin 将在外部 BaaS 后台手动提交开户申请。',
    reviewing: '开户申请正在由外部机构审核。用户端只展示审核状态，不展示 BaaS / Interlace 内部操作细节。',
    failed: '外部机构审核未通过。请查看失败原因，并联系客服或重新申请。',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className={status === 'failed' ? 'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-700' : 'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700'}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <Badge variant={meta.badge}>{meta.label}</Badge>
          <h3 className="mt-3 text-2xl font-bold text-slate-950">{meta.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{descriptions[status]}</p>
        </div>
      </div>
      {status === 'failed' ? (
        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
            <div className="text-sm font-semibold text-red-900">失败原因</div>
            <p className="mt-2 text-sm leading-6 text-red-800">外部机构审核未通过。具体原因由客服或运营人员进一步确认。</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <div className="text-sm font-semibold text-amber-900">开户费处理说明</div>
            <p className="mt-2 text-sm leading-6 text-amber-800">开户失败后 USD 500 开户费是否退回、自动退回还是人工处理，当前 PRD 未明确，标注为待确认。</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" className="rounded-lg bg-blue-600 hover:bg-blue-700">↗ 重新申请</Button>
            <Button type="button" variant="outline" className="rounded-lg">
              <HelpCircle className="h-4 w-4" />
              ↗ 联系客服
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function TrustAccountAssets() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h3 className="text-lg font-bold text-slate-950">资产分布</h3>
          <p className="mt-1 text-sm text-slate-500">法币资产</p>
        </div>
        <div className="text-lg font-bold text-blue-600">$96063.04</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
            <tr>
              {['币种', '余额', '可用余额', '冻结金额', '美元价值', '24H汇率', '快捷操作'].map((item) => (
                <th key={item} className="px-6 py-4">{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="px-6 py-5 font-semibold text-slate-900">HKD 港币<br /><span className="text-xs font-normal text-slate-500">信托账户</span></td>
              <td className="px-6 py-5">625106.36 HKD</td>
              <td className="px-6 py-5">624905.36 HKD</td>
              <td className="px-6 py-5">201.00 HKD</td>
              <td className="px-6 py-5 font-bold">79806.95</td>
              <td className="px-6 py-5">1 HKD = 0.12 USD</td>
              <td className="px-6 py-5 text-slate-400">↗ ↙ ⇆</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AssetDistribution({ status }) {
  const opened = status === 'opened'
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h3 className="text-lg font-bold text-slate-950">资产分布</h3>
          <p className="mt-1 text-sm text-slate-500">美国账户资产</p>
        </div>
        <div className="text-lg font-bold text-blue-600">{opened ? '$82430.27' : '$0.00'}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
            <tr>
              {['币种', '余额', '可用余额', '冻结金额', '美元价值', '24H变化', '快捷操作'].map((item) => (
                <th key={item} className="px-6 py-4">{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="px-6 py-5 font-semibold text-slate-900">USD 美元<br /><span className="text-xs font-normal text-slate-500">美国账户</span></td>
              <td className="px-6 py-5">{opened ? '82630.27 USD' : '0.00 USD'}</td>
              <td className="px-6 py-5">{opened ? '82430.27 USD' : '0.00 USD'}</td>
              <td className="px-6 py-5">{opened ? '200.00 USD' : '0.00 USD'}</td>
              <td className="px-6 py-5 font-bold">{opened ? '82430.27' : '0.00'}</td>
              <td className="px-6 py-5">— 0%</td>
              <td className="px-6 py-5 text-slate-400">{opened ? '↗ ↙ ⇆' : '—'}</td>
            </tr>
            {!opened ? (
              <tr className="border-t border-slate-100">
                <td colSpan={7} className="px-6 py-10 text-center">
                  <div className="mx-auto flex max-w-md flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <WalletCards className="h-5 w-5" />
                    </div>
                    <div className="mt-3 font-semibold text-slate-900">暂无正式资产数据</div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">美国账户尚未完成开户或 accountId 绑定，仅保留 USD 币种占位。开户成功后展示真实资产分布。</p>
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AccountInfoDrawer({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-sm">
      <aside className="h-full w-full max-w-[460px] overflow-auto bg-[#f8fafc] shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Landmark className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-950">查看账户信息</h3>
              <p className="text-xs uppercase tracking-wide text-slate-400">BANK RECEIVING ACCOUNT</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-5 p-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-950">银行收款账户</h4>
              <Button type="button" size="sm" className="rounded-lg bg-blue-600 hover:bg-blue-700">
                <Copy className="h-4 w-4" />
                复制全部
              </Button>
            </div>
            <div className="mt-5 space-y-3">
              {bankAccountRows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="flex items-center gap-2 text-right text-sm font-bold text-slate-950">
                    {value}
                    <button type="button" className="text-slate-400 hover:text-blue-600" aria-label={`复制${label}`}>
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm leading-6 text-amber-800">
            用户通过线下银行转账或其他平台向该银行收款账户转账；入金记录需经后台审核后才增加可用余额。
          </div>
        </div>
      </aside>
    </div>
  )
}

export function BaasOpeningPrototype({ onBack, onPrototypeHome }) {
  const [status, setStatus] = useState('not_opened')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [feeConfirmOpen, setFeeConfirmOpen] = useState(false)
  const [accountInfoOpen, setAccountInfoOpen] = useState(false)

  const selectUsAccount = () => {
    setPickerOpen(false)
    setFeeConfirmOpen(true)
  }

  const confirmFee = () => {
    setFeeConfirmOpen(false)
    setStatus('submitted')
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <DemoBar status={status} onStatusChange={setStatus} onPrototypeHome={onPrototypeHome} />
      <ClientTopNav onBack={onBack} />
      <AccountHero status={status} onOpenJurisdiction={() => setPickerOpen(true)} />
      <QuickActionDock status={status} onOpenAccountInfo={() => setAccountInfoOpen(true)} />
      <main className="mx-auto max-w-[1280px] px-5 py-8">
        <MainContent status={status} onOpenAccountInfo={() => setAccountInfoOpen(true)} />
      </main>
      {pickerOpen ? <JurisdictionPicker onClose={() => setPickerOpen(false)} onSelectUs={selectUsAccount} /> : null}
      {feeConfirmOpen ? <FeeConfirmModal onClose={() => setFeeConfirmOpen(false)} onConfirm={confirmFee} /> : null}
      {accountInfoOpen ? <AccountInfoDrawer onClose={() => setAccountInfoOpen(false)} /> : null}
    </div>
  )
}
