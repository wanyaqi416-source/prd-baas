import {
  Banknote,
  Building2,
  Check,
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
import { IncomingFiatDepositPrototype } from './IncomingFiatDepositPrototype'

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

const internalTransferDirections = {
  'trust-to-us': {
    title: '资金互转至美国账户',
    sourceAccount: '香港账户',
    targetAccount: '美国账户',
    sourceBalance: 'USD 96,037.39',
    targetBalance: 'USD 82,430.27',
  },
  'us-to-trust': {
    title: '资金互转至香港账户',
    sourceAccount: '美国账户',
    targetAccount: '香港账户',
    sourceBalance: 'USD 82,430.27',
    targetBalance: 'USD 96,037.39',
  },
}

const transferFeeConfig = {
  fixedAmount: 15,
  percentRate: 0.0025,
}

const formatCurrencyAmount = (currency, amount) => `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const feeModes = {
  fixed: {
    label: '固定值',
    description: '按单笔固定手续费展示',
    ruleDisplay: (currency) => formatCurrencyAmount(currency, transferFeeConfig.fixedAmount),
  },
  percent: {
    label: '百分比',
    description: '按转账金额比例展示',
    ruleDisplay: () => '0.25%',
  },
}

const formatTransferTime = () => {
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

const formatChineseDate = (text) => {
  const datePart = String(text || '').split(' ')[0]
  const [year, month, day] = datePart.split('-')
  return year && month && day ? `${year}年${Number(month)}月${Number(day)}日` : text
}

const makeTransactionId = () => {
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `TXN-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${Date.now().toString(16).slice(-8)}`
}

function ClickMark() {
  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[12px] font-bold leading-none text-white shadow-sm ring-2 ring-white/70">
      ?
    </span>
  )
}

function DemoBar({ status, onStatusChange, onPrototypeHome }) {
  return (
    <div className="border-b border-blue-100 bg-blue-50/95 px-5 py-3">
      <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onPrototypeHome} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
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

function AccountHero({ status, activeAccount, onAccountChange, onOpenJurisdiction, onOpenIncomingDeposit, onOpenFiatTransferOut }) {
  const hasUsAccount = status !== 'not_opened'
  const opened = status === 'opened'
  const usMeta = usStatusMeta[status]
  const showUsAccount = hasUsAccount && activeAccount === 'us'
  const blocksUsActions = showUsAccount && (status === 'submitted' || status === 'reviewing' || status === 'failed')
  const accountTabs = [
    { id: 'trust', Icon: Landmark, label: '信托账户', enabled: true },
    { id: 'digital', Icon: WalletCards, label: '数字资产账户', enabled: false },
    ...(hasUsAccount && !opened ? [{ id: 'us', Icon: Globe2, label: '美国账户', enabled: true }] : []),
  ]

  return (
    <section className="relative overflow-hidden bg-[#052744] px-5 py-8 text-white md:px-7 md:py-9">
      <div className="absolute inset-y-0 right-0 w-1/2 rounded-l-full bg-blue-500/10" />
      <div className="relative mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <div className="inline-flex flex-wrap gap-1 rounded-xl border border-white/10 bg-black/20 p-1">
            {accountTabs.map(({ id, Icon, label, enabled }) => {
              const active = activeAccount === id
              return (
                <button
                  key={label}
                  type="button"
                  onClick={enabled ? () => onAccountChange(id) : undefined}
                  disabled={!enabled}
                  aria-pressed={active}
                  className={active ? 'rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900' : enabled ? 'rounded-lg px-4 py-2 text-sm font-semibold text-blue-100 hover:bg-white/10' : 'cursor-default rounded-lg px-4 py-2 text-sm font-semibold text-blue-100/70'}
                >
                  <Icon className="mr-2 inline h-4 w-4" />
                  {label}
                  {label === '美国账户' && usMeta ? <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] text-blue-700">{usMeta.label}</span> : null}
                </button>
              )
            })}
          </div>
          {showUsAccount ? (
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
              <div className="mt-7 text-sm font-medium text-blue-100">账户余额：信托账户</div>
              <div className="mt-2 text-5xl font-bold tracking-tight md:text-6xl">$96037.39</div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-blue-100">
                信托账户
                <span>处理中：$25.66</span>
                <RefreshCw className="h-4 w-4" />
              </div>
            </>
          )}
          {blocksUsActions ? null : (
            <div className="mt-7 flex flex-wrap gap-3">
              {showUsAccount && opened ? (
                <>
                  <button type="button" className="inline-flex h-11 items-center gap-2 rounded-lg bg-sky-500 px-5 text-sm font-semibold text-white shadow-sm">
                    <Banknote className="h-4 w-4" />
                    存入资金
                  </button>
                  <button type="button" onClick={onOpenFiatTransferOut} className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#083861] px-5 text-sm font-semibold text-white hover:bg-[#0a4776]">
                    <Send className="h-4 w-4" />
                    <ClickMark />
                    法币转出
                  </button>
                </>
              ) : (
                <>
                  <button type="button" onClick={opened ? onOpenIncomingDeposit : undefined} className="inline-flex h-11 items-center gap-2 rounded-lg bg-sky-500 px-5 text-sm font-semibold text-white shadow-sm">
                    <Banknote className="h-4 w-4" />
                    {opened ? <ClickMark /> : null}
                    存入资金
                  </button>
                  <button type="button" onClick={opened ? onOpenFiatTransferOut : undefined} className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#083861] px-5 text-sm font-semibold text-white hover:bg-[#0a4776]">
                    <Send className="h-4 w-4" />
                    {opened ? <ClickMark /> : null}
                    法币转出
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-blue-400/20 bg-blue-900/45 p-6 shadow-inner">
          <h2 className="text-xl font-bold">{showUsAccount ? '美国账户服务' : '管理信托资产'}</h2>
          <p className="mt-3 text-sm leading-6 text-blue-100">
            {showUsAccount
              ? '美国账户用于查看银行收款账户、同币种入金、法币转出和账户信息。'
              : '连接您的全球银行账户，无缝管理您的信托投资组合和分配。'}
          </p>
          <div className="mt-5 grid gap-3 text-sm text-blue-50 sm:grid-cols-2">
            {(showUsAccount ? ['银行收款账户', '同币种交易', '账户信息', '账户状态'] : ['财富管理', '法币转出', '信托账单']).map((item) => (
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
              <ClickMark />
              开设其他法域账户
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function QuickActionDock({ status, activeAccount, onOpenAccountInfo, onOpenIncomingDeposit, onOpenFiatTransferOut, onOpenInternalTransfer }) {
  if (activeAccount === 'us' && (status === 'submitted' || status === 'reviewing' || status === 'failed')) {
    return null
  }

  const opened = status === 'opened'
  const actions = activeAccount === 'us' && opened
    ? [
        [Banknote, '存入资金', undefined],
        [Send, '法币转出', undefined],
        [RefreshCw, '资金互转', () => onOpenInternalTransfer('us-to-trust')],
        [RefreshCw, '兑换', undefined],
      ]
    : activeAccount === 'trust' && opened
      ? [
          [Landmark, '银行存入', onOpenIncomingDeposit],
          [WalletCards, '数字资产存入', undefined],
          [Send, '法币转出', onOpenFiatTransferOut],
          [RefreshCw, '资金互转', () => onOpenInternalTransfer('trust-to-us')],
          [Send, '转账给受益人', undefined],
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
              <span className="mt-1 inline-flex items-center justify-center gap-1">
                {label === '银行存入' || label === '法币转出' || label === '资金互转' ? <ClickMark /> : null}
                {label}
              </span>
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
                <span className="font-bold text-slate-950">美国账户</span>
                <span className="mt-1 block text-sm text-slate-500">创建/继续填写开户申请，提交后进入开户费扣费流程。</span>
              </span>
            </div>
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

function FeeConfirmModal({ balanceMode, onBalanceModeChange, onClose, onConfirm }) {
  const currentBalance = balanceMode === 'sufficient' ? 'USD 1,200.00' : 'USD 120.00'
  const rows = [
    ['扣费账户', '信托账户'],
    ['扣费币种', 'USD'],
    ['扣费金额', 'USD 500.00'],
    ['当前可用余额', currentBalance],
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[480px] rounded-3xl bg-white p-6 shadow-2xl">
        <ModalHeader eyebrow="Opening fee" title="确认开通并扣费" onClose={onClose} />
        <p className="mt-2 text-sm leading-6 text-slate-500">开通美国账户将扣除 USD 500 开户费。扣费成功后，系统生成开户申请记录并进入待审核状态。</p>
        <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-amber-900">开户费用支付状态</span>
            <Badge variant="warning">PENDING_PAYMENT · 待支付</Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-amber-800">客户尚未确认或费用尚未入账。确认扣费后，系统会根据余额判断进入 PAID 或 FAILED。</p>
        </div>
        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <div className="text-xs font-semibold text-blue-700">仅原型演示使用：扣费余额判断</div>
          <div className="mt-3 flex gap-2">
            {[
              ['sufficient', '余额充足'],
              ['insufficient', '余额不足'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => onBalanceModeChange(value)}
                className={balanceMode === value ? 'inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white' : 'inline-flex h-9 items-center gap-2 rounded-lg bg-white px-3 text-sm font-semibold text-slate-600'}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
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
            确认开通并扣费
          </Button>
          <Button type="button" onClick={onClose} variant="outline" className="rounded-lg">
            取消
          </Button>
        </div>
      </div>
    </div>
  )
}

function FeeResultModal({ type, onClose, onContinue }) {
  const success = type === 'success'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[480px] rounded-3xl bg-white p-6 shadow-2xl">
        <ModalHeader eyebrow="Opening fee result" title={success ? '扣费成功' : '扣费失败'} onClose={onClose} />
        <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <span className="text-sm font-semibold text-slate-700">开户费用支付状态</span>
          <Badge variant={success ? 'success' : 'danger'}>{success ? 'PAID · 已支付' : 'FAILED · 失败'}</Badge>
        </div>
        <div className={success ? 'mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5' : 'mt-6 rounded-2xl border border-red-100 bg-red-50 p-5'}>
          <div className={success ? 'text-sm font-semibold text-emerald-900' : 'text-sm font-semibold text-red-900'}>
            {success ? 'USD 500 开户费已扣除' : 'USD 余额不足，扣费未完成'}
          </div>
          <p className={success ? 'mt-2 text-sm leading-6 text-emerald-800' : 'mt-2 text-sm leading-6 text-red-800'}>
            {success
              ? '系统已生成美国账户开户申请记录。下一步进入待审核状态，等待 Fidere Admin 后台处理。'
              : '当前可用余额为 USD 120.00，低于 USD 500 开户费。扣费失败时不会生成开户申请记录。'}
          </p>
        </div>
        <div className="mt-6 flex gap-3">
          {success ? (
            <Button type="button" onClick={onContinue} className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700">
              查看待审核状态
            </Button>
          ) : (
            <Button type="button" className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700">
              去充值
            </Button>
          )}
          <Button type="button" onClick={onClose} variant="outline" className="rounded-lg">
            关闭
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

function MainContent({ status, activeAccount, onOpenAccountInfo }) {
  if (status === 'opened') {
    return <AssetDistribution status={status} />
  }

  if (activeAccount === 'trust' || status === 'not_opened') {
    return <TrustAccountAssets />
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
    submitted: '开户费用已支付，开户申请已创建，当前等待 Fidere Admin 在后台处理。此时美国账户暂不可用，也不会展示银行收款账户信息。',
    reviewing: 'Fidere Admin 已提交开户申请，当前由外部机构审核。审核完成且 accountId 绑定前，美国账户仍不可用。',
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
            <Button type="button" className="rounded-lg bg-blue-600 hover:bg-blue-700">重新申请</Button>
            <Button type="button" variant="outline" className="rounded-lg">
              <HelpCircle className="h-4 w-4" />
              联系客服
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
              <td className="px-6 py-5 text-slate-400">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AssetDistribution({ status }) {
  const opened = status === 'opened'
  const openedCards = [
    {
      accountType: '香港账户',
      totalUsd: '$96,037.39',
      rows: [
        {
          currency: 'HKD 港币',
          balance: '626,120.40 HKD',
          available: '625,919.40 HKD',
          frozen: '201.00 HKD',
          usdValue: '79,806.95',
        },
        {
          currency: 'USD 美元',
          balance: '16,230.44 USD',
          available: '16,230.44 USD',
          frozen: '0.00 USD',
          usdValue: '16,230.44',
        },
      ],
    },
    {
      accountType: '美国账户',
      totalUsd: '$82,430.27',
      rows: [
        {
          currency: 'USD 美元',
          balance: '82,630.27 USD',
          available: '82,430.27 USD',
          frozen: '200.00 USD',
          usdValue: '82,430.27',
        },
      ],
    },
  ]

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">资产分布</h3>
          <p className="mt-1 text-sm text-slate-500">{opened ? '香港账户 / 美国账户' : '美国账户资产'}</p>
        </div>
        <div className="text-lg font-bold text-blue-600">{opened ? '$178467.66' : '$0.00'}</div>
      </div>

      {opened ? (
        <div className="grid gap-5">
          {openedCards.map((card) => (
            <section key={card.accountType} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h4 className="text-base font-bold text-slate-950">{card.accountType}</h4>
                  <p className="mt-1 text-sm text-slate-500">{card.rows.map((row) => row.currency.split(' ')[0]).join(' / ')}</p>
                </div>
                <div className="text-base font-bold text-blue-600">{card.totalUsd}</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
                    <tr>
                      {['币种', '余额', '可用余额', '冻结金额', '美元价值'].map((item) => (
                        <th key={item} className="px-5 py-4">{item}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {card.rows.map((row) => (
                      <tr key={row.currency} className="border-t border-slate-100">
                        <td className="px-5 py-5 font-semibold text-slate-900">{row.currency}</td>
                        <td className="px-5 py-5">{row.balance}</td>
                        <td className="px-5 py-5">{row.available}</td>
                        <td className="px-5 py-5">{row.frozen}</td>
                        <td className="px-5 py-5 font-bold">{row.usdValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
          <div className="mx-auto flex max-w-md flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <WalletCards className="h-5 w-5" />
            </div>
            <div className="mt-3 font-semibold text-slate-900">暂无正式资产数据</div>
            <p className="mt-2 text-sm leading-6 text-slate-500">美国账户尚未完成开户或 accountId 绑定，仅保留 USD 币种占位。开户成功后展示真实资产分布。</p>
          </div>
        </div>
      )}
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
                    <button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100" aria-label={`复制${label}`}>
                      <Copy className="h-4 w-4" />
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

const fiatTransferOutAccounts = {
  hk: {
    label: '香港账户',
    holderName: 'WANYARA OP WAN',
    accountName: '香港账户',
    accountNumber: 'HK-AC-202604-dbff4be8',
    balance: {
      USD: 'USD 16,230.44',
      HKD: 'HKD 625,919.40',
    },
  },
  us: {
    label: '美国账户',
    holderName: 'WANYARA OP WAN',
    accountName: '美国账户',
    accountNumber: 'US-AC-202604-9a31f2c0',
    balance: {
      USD: 'USD 82,430.27',
      HKD: 'HKD 0.00',
    },
  },
}

const fiatTransferOutBanks = [
  {
    id: 'wo-main',
    name: 'WO',
    bank: '万银',
    accountNumber: '232232',
    swift: '12313231',
    country: '阿富汗',
    currency: 'USD',
  },
  {
    id: 'wo-test',
    name: 'WO',
    bank: '测试银行',
    accountNumber: '232232',
    swift: '12313232',
    country: '香港',
    currency: 'USD',
  },
  {
    id: 'wo-011',
    name: 'WO111',
    bank: '测试银行',
    accountNumber: '12',
    swift: '12313233',
    country: '美国',
    currency: 'USD',
  },
]

function ExternalFiatTransferOutDetailPage({ record, onBack, onClose }) {
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <main className="mx-auto min-h-screen max-w-[460px] bg-[#f7faff] shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Landmark className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-base font-bold text-slate-950">法币转出 详情</h1>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">TRANSACTION DETAIL</div>
            </div>
          </div>
          <button type="button" onClick={onBack} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <section className="rounded-3xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600">
              <Check className="h-6 w-6" />
            </div>
            <div className="mt-5 text-sm text-slate-500">{record.statusLabel}</div>
            <div className="mt-3 text-3xl font-bold text-red-500">
              - {record.amount}
              <span className="ml-2 text-base font-semibold text-slate-500">{record.currency}</span>
            </div>
            <div className="mt-3 text-sm text-slate-500">手续费: {record.feeAmount} {record.currency}</div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold text-slate-700">支账账户</h2>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
                  <Landmark className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-slate-950">{record.accountHolder}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-400">{record.accountNumber}</div>
                  <div className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{record.accountLabel}</div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold text-slate-700">指示详情</h2>
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              {[
                ['创建日期', formatChineseDate(record.createdAt)],
                ['交易编号', record.id],
                ['审核时间', formatChineseDate(record.reviewedAt)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 py-2 text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="inline-flex items-center gap-2 text-right font-bold text-slate-950">
                    {value}
                    {label === '交易编号' || label === '银行账号' ? (
                      <button type="button" className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-blue-50 hover:text-blue-600" aria-label={`复制${label}`}>
                        <Copy className="h-4 w-4" />
                      </button>
                    ) : null}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold text-slate-700">收款银行账户</h2>
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              {[
                ['账户持有人姓名', record.beneficiary],
                ['银行名称', record.beneficiaryBank],
                ['银行账号', record.beneficiaryAccount],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 py-2 text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="inline-flex items-center gap-2 text-right font-bold text-slate-950">
                    {value}
                    {label === '银行账号' ? (
                      <button type="button" className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-blue-50 hover:text-blue-600" aria-label={`复制${label}`}>
                        <Copy className="h-4 w-4" />
                      </button>
                    ) : null}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-3 pb-8">
            <Button type="button" onClick={onBack} variant="outline" className="rounded-lg">返回表单</Button>
            <Button type="button" onClick={onClose} className="rounded-lg bg-blue-600 hover:bg-blue-700">返回账户</Button>
          </div>
        </div>
      </main>
    </div>
  )
}

function ExternalFiatTransferOutPage({ onBack, records, onSubmit }) {
  const [view, setView] = useState('form')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [accountType, setAccountType] = useState('hk')
  const [currency, setCurrency] = useState('USD')
  const [selectedBankId, setSelectedBankId] = useState('wo-main')
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const account = fiatTransferOutAccounts[accountType]
  const selectedBank = fiatTransferOutBanks.find((bank) => bank.id === selectedBankId) || fiatTransferOutBanks[0]
  const scopedRecords = records.filter((record) => record.accountType === accountType && record.currency === currency)

  const openDetail = (record) => {
    setSelectedRecord(record)
    setAccountType(record.accountType)
    setCurrency(record.currency)
    setView('detail')
  }

  const submit = () => {
    const numericAmount = Number(amount)
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('请输入大于 0 的转账金额。')
      return
    }
    setError('')
    const createdAt = formatTransferTime()
    const record = {
      id: makeTransactionId(),
      accountType,
      accountLabel: account.label,
      accountHolder: account.holderName,
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      beneficiary: selectedBank.name,
      beneficiaryBank: selectedBank.bank,
      beneficiaryAccount: selectedBank.accountNumber,
      currency,
      amount: numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      feeAmount: '2.00',
      purpose: purpose || '-',
      note: note || '-',
      createdAt,
      reviewedAt: createdAt,
      status: 'COMPLETED',
      statusLabel: '已完成',
    }
    onSubmit(record)
    setSelectedRecord(record)
    setView('detail')
    setAmount('')
    setPurpose('')
    setNote('')
  }

  if (view === 'detail' && selectedRecord) {
    return (
      <ExternalFiatTransferOutDetailPage
        record={selectedRecord}
        onBack={() => setView('form')}
        onClose={onBack}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] pb-24 text-slate-950">
      <ClientTopNav onBack={onBack} />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-6">
          <button type="button" onClick={onBack} className="text-2xl text-slate-500 hover:text-slate-800">‹</button>
          <div>
            <h1 className="text-xl font-bold text-slate-950">法币转出</h1>
            <p className="text-xs text-slate-500">向您已保存的银行账户发起银行转账</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-5">
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-slate-900">选择账户</span>
            {[
              ['hk', '香港账户'],
              ['us', '美国账户'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setAccountType(value)}
                className={accountType === value ? 'h-10 rounded-xl bg-blue-50 px-4 text-sm font-bold text-slate-950 shadow-sm' : 'h-10 rounded-xl bg-slate-100 px-4 text-sm font-bold text-slate-600 hover:bg-slate-200'}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[0.68fr_0.32fr]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-blue-500 bg-white shadow-[0_8px_24px_rgba(37,99,235,0.16)]">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="flex items-center gap-2 text-base font-bold text-slate-950">
                  <WalletCards className="h-5 w-5 text-blue-600" />
                  转账账户信息
                </h2>
              </div>
              <div className="grid gap-6 p-6 md:grid-cols-2">
                <div>
                  {[
                    ['账户名称', account.accountName],
                    ['账户号码', account.accountNumber],
                    ['可用余额', account.balance[currency]],
                    ['扣款币种', currency],
                  ].map(([label, value]) => (
                    <div key={label} className="border-b border-slate-100 py-3">
                      <div className="text-xs text-slate-500">{label}</div>
                      <div className="mt-1 font-bold text-slate-950">{value}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="mb-3 text-sm font-bold text-slate-950">收款人信息</div>
                  {[
                    ['收款人名称', selectedBank.name],
                    ['收款人账户', selectedBank.accountNumber],
                    ['银行名称 / 钱包地址', `${selectedBank.bank}${selectedBank.swift}`],
                    ['国家/地区', selectedBank.country],
                    ['SWIFT / Routing / Network', selectedBank.swift],
                  ].map(([label, value]) => (
                    <div key={label} className="border-b border-slate-100 py-3">
                      <div className="text-xs text-slate-500">{label}</div>
                      <div className="mt-1 font-bold text-slate-950">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h2 className="flex items-center gap-2 text-base font-bold text-slate-950">
                  <Landmark className="h-5 w-5 text-blue-600" />
                  银行地址
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-bold text-slate-900">选择银行地址</div>
                  <button type="button" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                    <span className="text-lg">＋</span>
                    添加新银行地址
                  </button>
                </div>
                <div className="mb-4 flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm text-slate-400">
                  <span className="text-lg">⌕</span>
                  搜索银行地址
                </div>
                <div className="space-y-3">
                  {fiatTransferOutBanks.map((bank) => {
                    const selected = selectedBankId === bank.id
                    return (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBankId(bank.id)}
                        className={selected ? 'w-full rounded-xl bg-blue-50 p-4 text-left' : 'w-full rounded-xl bg-white p-4 text-left hover:bg-slate-50'}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                              <Landmark className="h-5 w-5" />
                            </span>
                            <div>
                              <div className="font-bold text-slate-950">{bank.name}</div>
                              <div className="text-sm text-slate-500">{bank.bank} · {bank.accountNumber}</div>
                            </div>
                          </div>
                          <div className="text-right text-xs text-slate-500">
                            <div>接收币种</div>
                            <div className="text-sm font-bold text-slate-950">{currency}</div>
                          </div>
                        </div>
                        {selected ? (
                          <div className="mt-5 grid gap-5 text-sm md:grid-cols-2">
                            <div>
                              <div className="text-xs text-slate-500">SWIFT代码</div>
                              <div className="font-bold text-slate-950">{bank.swift}</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500">国家/地区</div>
                              <div className="font-bold text-slate-950">{bank.country}</div>
                            </div>
                          </div>
                        ) : null}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr]">
                  <label className="flex h-12 overflow-hidden rounded-full border border-slate-200 bg-white">
                    <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="w-24 border-r border-slate-200 bg-white px-4 text-sm font-bold outline-none">
                      <option value="USD">USD</option>
                      <option value="HKD">HKD</option>
                    </select>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      placeholder="0.00"
                      className="min-w-0 flex-1 px-4 text-sm font-semibold outline-none"
                    />
                  </label>
                  <select value={purpose} onChange={(event) => setPurpose(event.target.value)} className="h-12 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 outline-none">
                    <option value="">转账用途</option>
                    <option value="Investment">Investment</option>
                    <option value="Settlement">Settlement</option>
                    <option value="Family Support">Family Support</option>
                  </select>
                </div>
                <input
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="附言 / 付款备注"
                  className="mt-4 h-12 w-full rounded-full border border-slate-200 px-5 text-sm font-semibold outline-none"
                />

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">预计手续费</span>
                    <span className="font-bold text-slate-950">-</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-slate-500">预计到账时间</span>
                    <span className="font-bold text-slate-950">1-3 个工作日</span>
                  </div>
                  <div className="mt-2 text-right text-xs text-slate-400">以实际到账和银行处理结果为准</div>
                </div>

                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  <div className="font-bold text-amber-900">转账提示</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>请确认收款账户信息准确无误</li>
                    <li>提交后当前原型仅生成待处理记录，不调用真实 API</li>
                  </ul>
                </div>
                {error ? <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div> : null}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="flex items-center gap-2 text-base font-bold text-slate-950">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  本次转账摘要
                </h2>
              </div>
              <div className="space-y-4 p-5 text-sm">
                {[
                  ['付款账户', account.accountName],
                  ['收款人', selectedBank.name],
                  ['转账金额', amount ? `${currency} ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'],
                  ['手续费', '-'],
                  ['实际扣款', '-'],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-slate-100 pb-3 last:border-0">
                    <div className="text-xs text-slate-500">{label}</div>
                    <div className="mt-1 font-bold text-slate-950">{value}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-base font-bold text-slate-950">最近转账记录</h2>
              </div>
              {scopedRecords.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center text-slate-400">
                  <CircleAlert className="h-8 w-8" />
                  <div className="mt-3 text-sm">暂无转账记录</div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {scopedRecords.map((record) => (
                    <button key={record.id} type="button" onClick={() => openDetail(record)} className="block w-full p-5 text-left text-sm hover:bg-blue-50">
                      <div className="flex justify-between gap-3">
                        <span className="font-bold text-slate-950">{record.currency} {record.amount}</span>
                        <Badge variant={record.status === 'COMPLETED' ? 'success' : 'warning'}>{record.statusLabel}</Badge>
                      </div>
                      <div className="mt-2 text-slate-500">{record.accountLabel} · {record.beneficiary} · {record.createdAt}</div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-6 py-4 shadow-2xl backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] justify-end gap-3">
          <Button type="button" onClick={onBack} variant="outline" className="rounded-lg">取消</Button>
          <Button type="button" onClick={submit} className="rounded-lg bg-blue-600 px-8 hover:bg-blue-700">继续确认</Button>
        </div>
      </footer>
    </div>
  )
}

function InternalTransferConfirmModal({ draft, onClose, onConfirm }) {
  const rows = [
    ['转出账户', draft.sourceAccount],
    ['转入账户', draft.targetAccount],
    ['币种', draft.currency],
    ['金额', `${draft.currency} ${draft.amount}`],
    ['手续费', `预估 ${draft.feeAmountDisplay}`],
    ['预估到账金额', draft.arrivalAmountDisplay],
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[520px] rounded-3xl bg-white p-6 shadow-2xl">
        <ModalHeader eyebrow="Transfer confirmation" title="确认提交转账申请" onClose={onClose} />
        <p className="mt-2 text-sm leading-6 text-slate-500">请确认以下转账信息。确认后记录将进入待后台审核状态，转账金额会冻结并从转出账户可用余额中扣除。</p>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 border-b border-slate-200 py-3 last:border-b-0">
              <span className="text-sm text-slate-500">{label}</span>
              <span className="text-right text-sm font-bold text-slate-950">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <Button type="button" onClick={onConfirm} className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700">
            确认提交
          </Button>
          <Button type="button" onClick={onClose} variant="outline" className="rounded-lg">
            取消
          </Button>
        </div>
      </div>
    </div>
  )
}

function InternalTransferPage({ direction, onBack, onSubmit, onViewRecords }) {
  const [currentDirection, setCurrentDirection] = useState(direction)
  const config = internalTransferDirections[currentDirection]
  const [currency, setCurrency] = useState('USD')
  const [amount, setAmount] = useState('')
  const [feeMode, setFeeMode] = useState('fixed')
  const [error, setError] = useState('')
  const [confirmDraft, setConfirmDraft] = useState(null)
  const activeFeeMode = feeModes[feeMode]
  const numericAmount = Number(amount)
  const hasValidAmount = Number.isFinite(numericAmount) && numericAmount > 0
  const estimatedFeeAmount = hasValidAmount
    ? (feeMode === 'fixed' ? transferFeeConfig.fixedAmount : numericAmount * transferFeeConfig.percentRate)
    : 0
  const estimatedArrivalAmount = hasValidAmount ? Math.max(numericAmount - estimatedFeeAmount, 0) : 0
  const feeRuleDisplay = activeFeeMode.ruleDisplay(currency)
  const feeAmountDisplay = formatCurrencyAmount(currency, hasValidAmount ? estimatedFeeAmount : 0)
  const arrivalAmountDisplay = formatCurrencyAmount(currency, hasValidAmount ? estimatedArrivalAmount : 0)

  const submitTransfer = () => {
    const numericAmount = Number(amount)
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('请输入大于 0 的转账金额。')
      return
    }

    setError('')
    setConfirmDraft({
      direction: currentDirection,
      sourceAccount: config.sourceAccount,
      targetAccount: config.targetAccount,
      currency,
      amount: numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      feeMode,
      feeModeLabel: activeFeeMode.label,
      feeDisplay: feeRuleDisplay,
      feeAmountDisplay,
      arrivalAmountDisplay,
    })
  }

  const confirmTransfer = () => {
    onSubmit({
      ...confirmDraft,
      id: `IT-${Date.now()}`,
      createdAt: formatTransferTime(),
      status: 'UNDER_REVIEW',
      statusLabel: '待后台审核',
    })
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
            返回账户
          </button>
          <Button type="button" onClick={onViewRecords} variant="outline" className="rounded-lg">
            查看转账记录
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-[1180px] px-5 py-8">
        <div className="mb-6">
          <Badge variant="secondary">内部法币转账</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{config.title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">当前为前端原型流程。提交后生成待后台审核记录，实际余额、手续费和审核结果以后台配置与处理为准。</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.72fr_0.28fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="text-sm font-semibold text-blue-700">转出账户</div>
                <div className="mt-2 text-xl font-bold text-slate-950">{config.sourceAccount}</div>
                <div className="mt-2 text-sm text-slate-500">参考余额：{config.sourceBalance}</div>
              </div>
              <button
                type="button"
                onClick={() => setCurrentDirection((current) => (current === 'trust-to-us' ? 'us-to-trust' : 'trust-to-us'))}
                className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-700 shadow-sm hover:bg-blue-50"
                aria-label="互换转出和转入账户"
                title="互换转出和转入账户"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <div className="text-sm font-semibold text-emerald-700">转入账户</div>
                <div className="mt-2 text-xl font-bold text-slate-950">{config.targetAccount}</div>
                <div className="mt-2 text-sm text-slate-500">参考余额：{config.targetBalance}</div>
              </div>
            </div>

            <div className="mt-6 grid gap-5">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">币种</span>
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                >
                  <option value="USD">USD 美元</option>
                  <option value="HKD">HKD 港币</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">金额</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="请输入转账金额"
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                />
              </label>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">手续费模式</div>
                  <p className="mt-1 text-sm text-slate-500">实际手续费以后台配置为准。</p>
                </div>
                <div className="flex rounded-xl border border-slate-200 bg-white p-1">
                  {Object.entries(feeModes).map(([value, item]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFeeMode(value)}
                      className={feeMode === value ? 'h-9 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white' : 'h-9 rounded-lg px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100'}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className={`mt-4 grid gap-3 ${feeMode === 'percent' ? 'md:grid-cols-2' : ''}`}>
                <div className="rounded-xl bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-400">手续费规则</div>
                      <p className="mt-1 text-xs text-slate-500">{activeFeeMode.description}</p>
                    </div>
                    <div className="shrink-0 text-right text-lg font-bold text-slate-950">{feeRuleDisplay}</div>
                  </div>
                </div>
                {feeMode === 'percent' ? (
                  <div className="rounded-xl bg-white px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold text-slate-400">预估手续费金额</div>
                        <p className="mt-1 text-xs text-slate-500">按当前输入金额预估</p>
                      </div>
                      <div className="shrink-0 text-right text-lg font-bold text-slate-950">{feeAmountDisplay}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-emerald-900">预估到账金额</div>
                  <p className="mt-1 text-sm text-emerald-700">按转账金额扣除预估手续费后计算，实际到账以后台审核结果为准。</p>
                </div>
                <div className="text-2xl font-bold text-emerald-950">{arrivalAmountDisplay}</div>
              </div>
            </div>

            {error ? <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button type="button" onClick={submitTransfer} className="rounded-lg bg-blue-600 px-6 hover:bg-blue-700">
                提交审核
              </Button>
              <Button type="button" onClick={onBack} variant="outline" className="rounded-lg">
                取消
              </Button>
            </div>
          </section>

          <aside className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <div className="text-sm font-semibold text-amber-900">审核说明</div>
            <p className="mt-2 text-sm leading-6 text-amber-800">该记录提交后需要后台审核。提交成功后转账金额会被冻结，并从转出账户可用余额中扣除；审核通过后转入账户增加可用余额，审核拒绝或取消时释放冻结金额。</p>
            <div className="mt-5 space-y-3 text-sm text-amber-900">
              <div className="rounded-xl bg-white/70 p-3">状态：UNDER_REVIEW</div>
              <div className="rounded-xl bg-white/70 p-3">后台动作：审核通过 / 拒绝</div>
              <div className="rounded-xl bg-white/70 p-3">审计：记录客户提交与确认动作</div>
            </div>
          </aside>
        </div>
      </main>
      {confirmDraft ? (
        <InternalTransferConfirmModal
          draft={confirmDraft}
          onClose={() => setConfirmDraft(null)}
          onConfirm={confirmTransfer}
        />
      ) : null}
    </div>
  )
}

function InternalTransferRecordsPage({ records, onBack, onCreate }) {
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
            返回账户
          </button>
          <Button type="button" onClick={onCreate} className="rounded-lg bg-blue-600 hover:bg-blue-700">
            新增转账
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-[1180px] px-5 py-8">
        <div className="mb-6">
          <Badge variant="warning">待后台审核</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">内部转账记录</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">客户提交香港账户与美国账户之间的法币转账申请后，金额会先冻结并扣减转出账户可用余额，后台审核通过后再入账到转入账户。</p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-slate-950">转账申请列表</h2>
              <p className="mt-1 text-sm text-slate-500">共 {records.length} 条记录</p>
            </div>
          </div>
          {records.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="font-semibold text-slate-900">暂无转账记录</div>
              <p className="mt-2 text-sm text-slate-500">提交转账申请后会在这里展示待审核记录。</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
                  <tr>
                    {['申请编号', '转出账户', '转入账户', '币种', '金额', '手续费', '预估到账', '状态', '提交时间'].map((item) => (
                      <th key={item} className="px-6 py-4">{item}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-t border-slate-100">
                      <td className="px-6 py-5 font-semibold text-slate-900">{record.id}</td>
                      <td className="px-6 py-5">{record.sourceAccount}</td>
                      <td className="px-6 py-5">{record.targetAccount}</td>
                      <td className="px-6 py-5">{record.currency}</td>
                      <td className="px-6 py-5 font-semibold">{record.currency} {record.amount}</td>
                      <td className="px-6 py-5">{record.feeAmountDisplay}</td>
                      <td className="px-6 py-5 font-semibold">{record.arrivalAmountDisplay}</td>
                      <td className="px-6 py-5"><Badge variant="warning">{record.statusLabel}</Badge></td>
                      <td className="px-6 py-5 text-slate-500">{record.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export function BaasOpeningPrototype({ onBack, onOpenApplication, onPrototypeHome }) {
  const [status, setStatus] = useState('not_opened')
  const [activeAccount, setActiveAccount] = useState('trust')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [feeConfirmOpen, setFeeConfirmOpen] = useState(false)
  const [feeBalanceMode, setFeeBalanceMode] = useState('sufficient')
  const [feeResult, setFeeResult] = useState(null)
  const [accountInfoOpen, setAccountInfoOpen] = useState(false)
  const [activeOpenedPage, setActiveOpenedPage] = useState('account')
  const [internalTransferDirection, setInternalTransferDirection] = useState('trust-to-us')
  const [internalTransferRecords, setInternalTransferRecords] = useState([])
  const [fiatTransferOutRecords, setFiatTransferOutRecords] = useState([])

  const changeStatus = (nextStatus) => {
    setStatus(nextStatus)
    setActiveAccount(nextStatus === 'submitted' || nextStatus === 'reviewing' || nextStatus === 'failed' ? 'us' : 'trust')
  }

  const selectUsAccount = () => {
    setPickerOpen(false)
    onOpenApplication()
  }

  const confirmFee = () => {
    setFeeConfirmOpen(false)
    setFeeResult(feeBalanceMode === 'sufficient' ? 'success' : 'failed')
  }

  const continueAfterFeeSuccess = () => {
    setFeeResult(null)
    changeStatus('submitted')
  }

  const openInternalTransfer = (direction) => {
    setInternalTransferDirection(direction)
    setActiveOpenedPage('internal-transfer')
  }

  const submitInternalTransfer = (record) => {
    setInternalTransferRecords((current) => [record, ...current])
    setActiveOpenedPage('internal-transfer-records')
  }

  const submitFiatTransferOut = (record) => {
    setFiatTransferOutRecords((current) => [record, ...current])
  }

  if (status === 'opened' && activeOpenedPage === 'external-fiat-transfer-in') {
    return <IncomingFiatDepositPrototype onBack={() => setActiveOpenedPage('account')} />
  }

  if (status === 'opened' && activeOpenedPage === 'external-fiat-transfer-out') {
    return (
      <ExternalFiatTransferOutPage
        onBack={() => setActiveOpenedPage('account')}
        records={fiatTransferOutRecords}
        onSubmit={submitFiatTransferOut}
      />
    )
  }

  if (activeOpenedPage === 'internal-transfer') {
    return (
      <InternalTransferPage
        direction={internalTransferDirection}
        onBack={() => setActiveOpenedPage('account')}
        onSubmit={submitInternalTransfer}
        onViewRecords={() => setActiveOpenedPage('internal-transfer-records')}
      />
    )
  }

  if (activeOpenedPage === 'internal-transfer-records') {
    return (
      <InternalTransferRecordsPage
        records={internalTransferRecords}
        onBack={() => setActiveOpenedPage('account')}
        onCreate={() => setActiveOpenedPage('internal-transfer')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <DemoBar status={status} onStatusChange={changeStatus} onPrototypeHome={onPrototypeHome} />
      <ClientTopNav onBack={onBack} />
      <AccountHero
        status={status}
        activeAccount={activeAccount}
        onAccountChange={setActiveAccount}
        onOpenJurisdiction={() => setPickerOpen(true)}
        onOpenIncomingDeposit={() => setActiveOpenedPage('external-fiat-transfer-in')}
        onOpenFiatTransferOut={() => setActiveOpenedPage('external-fiat-transfer-out')}
      />
      <QuickActionDock
        status={status}
        activeAccount={activeAccount}
        onOpenAccountInfo={() => setAccountInfoOpen(true)}
        onOpenIncomingDeposit={() => setActiveOpenedPage('external-fiat-transfer-in')}
        onOpenFiatTransferOut={() => setActiveOpenedPage('external-fiat-transfer-out')}
        onOpenInternalTransfer={openInternalTransfer}
      />
      <main className="mx-auto max-w-[1280px] px-5 py-8">
        <MainContent status={status} activeAccount={activeAccount} onOpenAccountInfo={() => setAccountInfoOpen(true)} />
      </main>
      {pickerOpen ? <JurisdictionPicker onClose={() => setPickerOpen(false)} onSelectUs={selectUsAccount} /> : null}
      {feeConfirmOpen ? (
        <FeeConfirmModal
          balanceMode={feeBalanceMode}
          onBalanceModeChange={setFeeBalanceMode}
          onClose={() => setFeeConfirmOpen(false)}
          onConfirm={confirmFee}
        />
      ) : null}
      {feeResult ? (
        <FeeResultModal
          type={feeResult}
          onClose={() => setFeeResult(null)}
          onContinue={continueAfterFeeSuccess}
        />
      ) : null}
      {accountInfoOpen ? <AccountInfoDrawer onClose={() => setAccountInfoOpen(false)} /> : null}
    </div>
  )
}
