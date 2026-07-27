import {
  ArrowRight,
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  CircleAlert,
  CircleHelp,
  Clock3,
  Copy,
  FileText,
  Globe2,
  Landmark,
  Languages,
  LayoutDashboard,
  LoaderCircle,
  Mail,
  MousePointerClick,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sun,
  UserRound,
  WalletCards,
  X,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { CurrencyIcon } from '../components/baas/CurrencyIcon'
import { TransactionDetailDrawer, formatDetailCurrencyAmount } from '../components/baas/TransactionDetailDrawer'
import {
  getCurrencyName,
  getEnabledAccountCurrencyCodes,
  initialAccountCurrencyConfigs,
  mapBrokerNameToAccountCurrencyType,
} from '../data/accountCurrencyConfig'
import { IncomingFiatDepositPrototype } from './IncomingFiatDepositPrototype'

const demoStatuses = [
  { id: 'not_opened', label: '未开通' },
  { id: 'reviewing', label: '审核中' },
  { id: 'failed', label: '审核拒绝' },
  { id: 'opened', label: '审核通过' },
]

const usStatusMeta = {
  not_opened: {
    label: '未开通',
    badge: 'secondary',
    title: '美国账户未开通',
    description: '美国账户尚未提交开户申请，当前不展示金额数据。',
  },
  reviewing: {
    label: '审核中',
    badge: 'warning',
    title: '美国账户审核中',
    description: '开户申请已进入后台与外部机构审核流程，审核完成前不展示金额和账户收款信息。',
  },
  failed: {
    label: '审核拒绝',
    badge: 'danger',
    title: '美国账户审核拒绝',
    description: '外部机构审核未通过，该申请不可在当前原型中重新申请。',
    reason: '护照资料与 KYC 信息存在差异，需由运营人员线下确认后再处理。',
  },
  opened: {
    label: '审核通过',
    badge: 'success',
    title: '美国账户审核通过',
    description: '美国账户已作为信托账户下的资产分类开通，可在信托账户资产分布中查看。',
  },
}

const brokerageStatusMeta = {
  not_opened: {
    label: '未开通',
    badge: 'secondary',
  },
  reviewing: {
    label: '审核中',
    badge: 'warning',
  },
  failed: {
    label: '已拒绝',
    badge: 'danger',
  },
  opened: {
    label: '已开户',
    badge: 'success',
  },
}

const jurisdictionStatusMeta = {
  not_opened: {
    label: '未申请',
    badge: 'secondary',
    actionLabel: '立即申请',
    description: '尚未提交开户申请，可随时发起申请。',
  },
  reviewing: {
    label: '审核中',
    badge: 'warning',
    description: '申请已提交，当前正在审核中。',
  },
  opened: {
    label: '已开户',
    badge: 'success',
    description: '账户已开通，可在资产分布中查看。',
  },
  failed: {
    label: '已拒绝',
    badge: 'danger',
    actionLabel: '重新申请',
    description: '申请未通过，可根据审核意见重新提交。',
  },
}

const brokerageAccountDefinitions = [
  { brokerId: 'ibkr', label: 'IBKR 盈透证券账户', brokerName: 'IBKR 盈透证券' },
  { brokerId: 'webull', label: 'Webull 微牛证券账户', brokerName: 'Webull 微牛证券' },
]

function normalizeBrokerageAccountCards(cards = []) {
  return brokerageAccountDefinitions.map((definition) => {
    const card = cards.find((item) => item.brokerId === definition.brokerId) || {}
    const status = card.status || 'not_opened'

    return {
      ...definition,
      ...card,
      brokerId: definition.brokerId,
      label: card.label || definition.label,
      brokerName: card.brokerName || definition.brokerName,
      status,
      statusLabel: brokerageStatusMeta[status]?.label || card.statusLabel || '未开通',
      currencies: card.currencies?.length ? card.currencies : ['USD', 'HKD', 'CNY'],
      totalUsd: Number(card.totalUsd || 0),
      balance: card.balance || {},
      transferAccountId: card.transferAccountId || card.id || definition.brokerId,
    }
  })
}

function getBrokerageSummary(cards = []) {
  const openedCards = cards.filter((card) => card.status === 'opened')
  const totalUsd = openedCards.reduce((sum, card) => sum + Number(card.totalUsd || 0), 0)

  return {
    totalUsd,
    totalDisplay: `$${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    openedCards,
    hasAnyActivity: cards.some((card) => card.status !== 'not_opened'),
  }
}

const bankAccountRows = [
  ['账户持有人姓名', 'WANYARA OP WAN'],
  ['银行名称', 'Fidere Partner Bank'],
  ['账户号码', '232232'],
  ['Routing Number', '026009593'],
  ['币种', 'USD'],
]

const internalTransferFiatAccounts = [
  {
    id: 'hk',
    kind: 'fiat',
    name: '香港账户',
    currencies: ['USD', 'HKD', 'CNY', 'SGD'],
    balance: {
      USD: 'USD 96,037.39',
      HKD: 'HKD 625,106.36',
      CNY: 'CNY 238,000.00',
      EUR: 'EUR 18,600.00',
      SGD: 'SGD 42,800.00',
    },
  },
  {
    id: 'us',
    kind: 'fiat',
    name: '美国账户',
    helper: '美国账户当前仅支持 USD 互转。',
    currencies: ['USD'],
    balance: {
      USD: 'USD 82,430.27',
    },
  },
  {
    id: 'sg',
    kind: 'fiat',
    name: '新加坡账户',
    helper: '新加坡账户支持 USD / CNY / SGD / AED / JPY 互转。',
    currencies: ['USD', 'CNY', 'SGD', 'AED', 'JPY'],
    balance: {
      USD: 'USD 36,280.00',
      CNY: 'CNY 128,600.00',
      SGD: 'SGD 74,920.50',
      AED: 'AED 91,400.00',
      JPY: 'JPY 4,280,000',
    },
  },
  {
    id: 'bh',
    kind: 'fiat',
    name: '巴林账户',
    helper: '巴林账户支持 USD / BHD 互转。',
    currencies: ['USD', 'BHD'],
    balance: {
      USD: 'USD 12,500.00',
      BHD: 'BHD 18,500.000',
    },
  },
]

const defaultInternalTransferBrokerageAccounts = [
  {
    id: 'ibkr-transfer',
    label: 'IBKR 盈透证券账户',
    brokerName: 'IBKR 盈透证券',
    accountName: 'WANYARA OP WAN',
    accountNumber: 'U88912045',
    currencies: ['USD', 'HKD', 'CNY'],
    balance: {
      USD: 'USD 58,600.00',
      HKD: 'HKD 210,000.00',
      CNY: 'CNY 86,500.00',
    },
  },
  {
    id: 'webull-transfer',
    label: 'Webull 微牛证券账户',
    brokerName: 'Webull 微牛证券',
    accountName: 'WANYARA OP WAN',
    accountNumber: 'WB2026070950',
    currencies: ['USD', 'HKD'],
    balance: {
      USD: 'USD 24,900.00',
      HKD: 'HKD 112,000.00',
    },
  },
]

const getInternalTransferBalance = (account, currency) => account?.balance?.[currency] || `${currency} --`

const formatCurrencyAmount = (currency, amount) => `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const getConfiguredTransferCurrencies = (configs, accountType, fallback = []) => {
  const configuredCurrencies = getEnabledAccountCurrencyCodes(configs, accountType)
  return configuredCurrencies.length ? configuredCurrencies : fallback
}

const formatTransferCurrencyLabel = (currency) => `${currency} ${getCurrencyName(currency)}`

const userTransferCurrencyNames = {
  USD: '美元',
  HKD: '港币',
  CNY: '人民币',
  EUR: '欧元',
  SGD: '新加坡元',
  AED: '阿联酋迪拉姆',
  JPY: '日元',
  BHD: '巴林第纳尔',
}

const userTransferAccountOptions = [
  {
    id: 'hk',
    label: '香港账户',
    helper: '适合处理香港本地及多币种资金。',
    currencies: ['HKD', 'CNY', 'USD', 'EUR', 'SGD'],
    balance: {
      HKD: 'HKD 625,106.36',
      CNY: 'CNY 238,000.00',
      USD: 'USD 96,037.39',
      EUR: 'EUR 18,600.00',
      SGD: 'SGD 42,800.00',
    },
  },
  {
    id: 'us',
    label: '美国账户',
    helper: '美国账户当前仅支持 USD 转账。',
    currencies: ['USD'],
    balance: {
      USD: 'USD 82,430.27',
    },
  },
  {
    id: 'sg',
    label: '新加坡账户',
    helper: '适合覆盖新加坡及跨境多币种资金。',
    currencies: ['USD', 'CNY', 'SGD', 'AED', 'JPY'],
    balance: {
      USD: 'USD 36,280.00',
      CNY: 'CNY 128,600.00',
      SGD: 'SGD 74,920.50',
      AED: 'AED 91,400.00',
      JPY: 'JPY 4,280,000',
    },
  },
  {
    id: 'bh',
    label: '巴林账户',
    helper: '巴林账户当前支持 USD 与 BHD 转账。',
    currencies: ['USD', 'BHD'],
    balance: {
      USD: 'USD 12,500.00',
      BHD: 'BHD 18,500.000',
    },
  },
]

const formatUserTransferCurrencyLabel = (currency) => `${currency} ${userTransferCurrencyNames[currency] || getCurrencyName(currency)}`

const defaultFiatTransferPurposeOptions = [
  'Investment',
  'Settlement',
  'Family Support',
]

const usFiatTransferPurposeOptions = [
  '充值-为量子账户进行充值',
  '收款-资金来自海外客户',
  '收款-资金来自电商平台（如：Amazon/Aliexpress）',
  '收款-资金来自收单工具（如：Stripe/Paypal）',
  '收款-资金来自投资人/合伙人',
  '在自己的企业之间进行资金周转',
  '付款-至供货商或经销商',
  '付款-至合同工、自由职业者或员工',
  '结汇-目前仅支持电商货物类卖家结汇',
  '换汇-将资金换汇至其他币种',
  '其他',
]

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

const internalTransferStatusMeta = {
  COMPLETED: {
    label: '已完成',
    badge: 'success',
    statusTone: 'success',
    description: '资金互转申请已完成，资金已从转出账户划转至转入账户。',
  },
  UNDER_REVIEW: {
    label: '待审核',
    badge: 'warning',
    statusTone: 'warning',
    description: '资金互转申请已提交，等待后台审核处理。',
  },
  PENDING_REVIEW: {
    label: '待审核',
    badge: 'warning',
    statusTone: 'warning',
    description: '资金互转申请已提交，等待后台审核处理。',
  },
  PROCESSING: {
    label: '处理中',
    badge: 'warning',
    statusTone: 'processing',
    description: '资金互转申请正在处理中，请等待后台处理结果。',
  },
  REJECTED: {
    label: '已拒绝',
    badge: 'danger',
    statusTone: 'danger',
    description: '资金互转申请已被拒绝，具体原因请查看审核结果。',
  },
}

const getInternalTransferStatusMeta = (record) => {
  const rawStatus = String(record?.status || record?.statusLabel || '').toUpperCase()
  const rawLabel = String(record?.statusLabel || record?.status || '')
  let meta = internalTransferStatusMeta[rawStatus]

  if (!meta && rawLabel.includes('完成')) meta = internalTransferStatusMeta.COMPLETED
  if (!meta && (rawLabel.includes('待') || rawLabel.includes('审核'))) meta = internalTransferStatusMeta.UNDER_REVIEW
  if (!meta && rawLabel.includes('拒')) meta = internalTransferStatusMeta.REJECTED
  if (!meta && rawLabel.includes('处理')) meta = internalTransferStatusMeta.PROCESSING

  const fallbackMeta = meta || internalTransferStatusMeta.PROCESSING
  return {
    ...fallbackMeta,
    label: record?.statusLabel || fallbackMeta.label,
  }
}

const stripCurrencyPrefix = (currency, value) => {
  if (value === null || value === undefined || value === '') return value
  const currencyText = String(currency || '').trim()
  const valueText = String(value).trim()
  if (currencyText && valueText.toUpperCase().startsWith(currencyText.toUpperCase())) {
    return valueText.slice(currencyText.length).trim()
  }
  if (currencyText && valueText.toUpperCase().endsWith(currencyText.toUpperCase())) {
    return valueText.slice(0, -currencyText.length).trim()
  }
  return value
}

const formatTransferDetailCurrencyAmount = (currency, value) => {
  if (value === null || value === undefined || value === '') return '--'
  const valueText = String(value)
  if (currency && valueText.trim().toUpperCase().startsWith(String(currency).toUpperCase())) return value
  return formatDetailCurrencyAmount(currency, value)
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

function DemoBar({ status, onStatusChange, onPrototypeHome, prototypeLabel = 'BaaS 原型', statusLabelOverrides = {} }) {
  return (
    <div className="border-b border-blue-100 bg-blue-50/95 px-5 py-3">
      <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onPrototypeHome} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
          返回 {prototypeLabel}
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">仅原型演示使用</span>
          <span className="text-xs text-slate-500">快速切换开户流程状态，不属于真实客户端功能</span>
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="h-9 rounded-lg border border-blue-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none"
          >
            {demoStatuses.map((item) => (
              <option key={item.id} value={item.id}>{statusLabelOverrides[item.id] || item.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export function ClientTopNav({
  onBack,
  activeNavLabel = '账户',
  investmentMenu = [],
  onNavSelect,
  clickableNavLabels = [],
}) {
  const [investmentMenuOpen, setInvestmentMenuOpen] = useState(false)
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
            {navItems.map(([Icon, label]) => {
              const active = label === activeNavLabel
              const showClickHint = clickableNavLabels.includes(label)
              const className = active
                ? 'inline-flex h-9 items-center gap-2 rounded-xl bg-blue-600 px-4 font-semibold text-white shadow-sm'
                : 'inline-flex h-9 items-center gap-2 rounded-xl px-3 font-medium hover:bg-slate-100'

              if (label === '投资' && investmentMenu.length) {
                return (
                  <div key={label} className="relative">
                    <button
                      type="button"
                      onClick={() => setInvestmentMenuOpen((current) => !current)}
                      className={className}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                    {investmentMenuOpen ? (
                      <div className="absolute left-0 top-[42px] z-40 min-w-[132px] rounded-xl border border-slate-200 bg-white p-1 text-sm shadow-xl">
                        {investmentMenu.map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => {
                              setInvestmentMenuOpen(false)
                              item.onClick?.()
                            }}
                            className="block h-9 w-full rounded-lg px-3 text-left font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )
              }

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => onNavSelect?.(label)}
                  className={`${className} ${showClickHint ? 'cursor-pointer' : ''}`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {showClickHint ? (
                    <span
                      title="可点击切换页面"
                      className={active ? 'text-white/80' : 'text-blue-500'}
                    >
                      <MousePointerClick className="h-3 w-3" />
                    </span>
                  ) : null}
                </button>
              )
            })}
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

function AccountHero({
  status,
  activeAccount,
  onAccountChange,
  onOpenJurisdiction,
  onOpenIncomingDeposit,
  onOpenFiatTransferOut,
  brokerageAccountCards = [],
  showBrokerageTab = false,
  showGuidanceMarks = true,
}) {
  const hasUsAccount = status !== 'not_opened'
  const opened = status === 'opened'
  const usMeta = usStatusMeta[status]
  const showUsAccount = hasUsAccount && activeAccount === 'us'
  const showBrokerageAccount = showBrokerageTab && activeAccount === 'brokerage'
  const showJurisdictionEntry = !showBrokerageAccount && activeAccount === 'trust'
  const brokerageDisplayCards = status === 'opened'
    ? brokerageAccountCards.map((card) => ({ ...card, status: 'opened', statusLabel: brokerageStatusMeta.opened.label }))
    : []
  const brokerageSummary = getBrokerageSummary(brokerageDisplayCards)
  const accountTabs = [
    { id: 'trust', Icon: Landmark, label: '信托账户', enabled: true },
    { id: 'digital', Icon: WalletCards, label: '数字资产账户', enabled: true },
    ...(showBrokerageTab ? [{ id: 'brokerage', Icon: Building2, label: '券商账户', enabled: true }] : []),
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
                  className={active ? 'inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900' : enabled ? 'inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-blue-100 hover:bg-white/10' : 'inline-flex cursor-default items-center rounded-lg px-4 py-2 text-sm font-semibold text-blue-100/70'}
                >
                  <Icon className="mr-2 inline h-4 w-4" />
                  {label}
                  {id === 'brokerage' ? <span className="ml-2 inline-flex"><ClickMark /></span> : null}
                </button>
              )
            })}
          </div>
          {showBrokerageAccount ? (
            <>
              <div className="mt-7 text-sm font-medium text-blue-100">券商账户总资产</div>
              <div className="mt-2 text-5xl font-bold tracking-tight md:text-6xl">{brokerageSummary.totalDisplay}</div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-blue-100">
                {brokerageSummary.openedCards.map((card) => (
                  <span key={card.brokerId}>{card.brokerId === 'ibkr' ? 'IBKR' : 'Webull'}：${Number(card.totalUsd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                ))}
                <RefreshCw className="h-4 w-4" />
              </div>
            </>
          ) : showUsAccount ? (
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
          {showBrokerageAccount ? null : (
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={opened ? onOpenIncomingDeposit : undefined} className="inline-flex h-11 items-center gap-2 rounded-lg bg-sky-500 px-5 text-sm font-semibold text-white shadow-sm">
              <Banknote className="h-4 w-4" />
              {opened && showGuidanceMarks ? <ClickMark /> : null}
              存入资金
            </button>
            <button type="button" onClick={opened ? onOpenFiatTransferOut : undefined} className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#083861] px-5 text-sm font-semibold text-white hover:bg-[#0a4776]">
              <Send className="h-4 w-4" />
              {opened && showGuidanceMarks ? <ClickMark /> : null}
              法币转出
            </button>
          </div>
          )}
        </div>
        <div className="rounded-2xl border border-blue-400/20 bg-blue-900/45 p-6 shadow-inner">
          <h2 className="text-xl font-bold">{showBrokerageAccount ? '管理券商资产' : showUsAccount ? '美国账户服务' : activeAccount === 'digital' ? '管理数字资产' : '管理信托资产'}</h2>
          <p className="mt-3 text-sm leading-6 text-blue-100">
            {showBrokerageAccount
              ? '查看您的 IBKR、Webull 券商账户资产、账户状态及资金互转。'
              : showUsAccount
              ? '美国账户用于查看银行收款账户、同币种入金、法币转出和账户信息。'
              : activeAccount === 'digital'
                ? '查看数字资产账户余额与资产分类，当前原型仅展示账户层级。'
                : '连接您的全球银行账户，管理您的信托资产。'}
          </p>
          <div className="mt-5 grid gap-3 text-sm text-blue-50 sm:grid-cols-2">
            {(showBrokerageAccount
              ? ['券商账户管理', '券商资金互转', '资产分布', '账户详情']
              : showUsAccount
                ? ['银行收款账户', '同币种交易', '账户信息', '账户状态']
                : activeAccount === 'digital'
                  ? ['USDT', 'ETH', 'BTC']
                  : ['理财', '法币转出', '其他法域账户']).map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-sky-300" />
                {item}
              </div>
            ))}
          </div>
          {showJurisdictionEntry ? (
            <button
              type="button"
              onClick={onOpenJurisdiction}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-sky-500 px-5 text-sm font-semibold text-white shadow-sm hover:bg-sky-400"
            >
              <Globe2 className="h-4 w-4" />
              {showGuidanceMarks ? <ClickMark /> : null}
              查看其他法域账户
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function QuickActionDock({
  status,
  activeAccount,
  brokerageAccountCards = [],
  onOpenAccountInfo,
  onOpenBrokerageDetail,
  onOpenIncomingDeposit,
  onOpenFiatTransferOut,
  onOpenInternalTransfer,
  onOpenUserTransfer,
  showGuidanceMarks = true,
  forceInternalTransferMark = false,
  forceUserTransferMark = false,
  enableUserTransfer = false,
}) {
  if (activeAccount === 'us' && (status === 'reviewing' || status === 'failed')) {
    return null
  }

  const opened = status === 'opened'
  const openedBrokerageCards = opened
    ? brokerageAccountCards.map((card) => ({ ...card, status: 'opened', statusLabel: brokerageStatusMeta.opened.label }))
    : []
  const hasOpenedBrokerageAccount = openedBrokerageCards.length > 0
  if (activeAccount === 'brokerage' && !hasOpenedBrokerageAccount) {
    return null
  }
  const trustOpenedActions = [
    [Landmark, '银行存入', onOpenIncomingDeposit],
    [WalletCards, '数字资产存入', undefined],
    [Send, '法币转出', onOpenFiatTransferOut],
    [RefreshCw, '资金互转', () => onOpenInternalTransfer('trust-to-us')],
    ...(enableUserTransfer ? [[Send, '转账给其他用户', onOpenUserTransfer]] : []),
    [Send, '转账给受益人', undefined],
  ]
  const closedActions = [
    [Landmark, '银行存入', undefined],
    [WalletCards, '数字资产存入', undefined],
    ...(enableUserTransfer ? [[Send, '转账给其他用户', onOpenUserTransfer]] : []),
    [Send, '转账给受益人', undefined],
    [RefreshCw, '兑换', undefined],
  ]
  const actions = activeAccount === 'brokerage'
    ? [
        ...(hasOpenedBrokerageAccount ? [[RefreshCw, '资金互转', () => onOpenInternalTransfer('trust-to-us', { transferMode: 'brokerage' })]] : []),
        ...openedBrokerageCards.map((card) => [Building2, `${card.brokerId === 'ibkr' ? 'IBKR' : 'Webull'} 账户详情`, () => onOpenBrokerageDetail?.(card.brokerId)]),
      ]
    : activeAccount === 'digital'
      ? [
          [WalletCards, '数字资产存入', undefined],
          [RefreshCw, '兑换', undefined],
        ]
    : activeAccount === 'us' && opened
    ? [
        [Banknote, '存入资金', undefined],
        [Send, '法币转出', undefined],
        [RefreshCw, '资金互转', () => onOpenInternalTransfer('us-to-trust')],
        [RefreshCw, '兑换', undefined],
      ]
    : activeAccount === 'trust' && opened
      ? trustOpenedActions
      : closedActions

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
                {(showGuidanceMarks && (label === '银行存入' || label === '法币转出' || label === '资金互转')) || (forceInternalTransferMark && label === '资金互转') || (forceUserTransferMark && label === '转账给其他用户') ? <ClickMark /> : null}
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function JurisdictionPicker({
  balanceMode,
  onBalanceModeChange,
  onClose,
  onSelectUs,
  onSelectSingapore,
  onSelectBahrain,
  onReapplySingapore,
  accountStatuses,
  onAccountStatusChange,
  enableSingaporeOpening = false,
  enableBahrainOpening = false,
  jurisdictionAccountConfigs = {},
  embedded = false,
}) {
  const accounts = [
    {
      id: 'us',
      title: '美国账户',
      Icon: Landmark,
      tone: 'blue',
      fee: 'USD 500',
      description: '保留原有美国账户开户资料提交流程，提交后进入开户费扣费与审核。',
      status: accountStatuses.us,
      onApply: onSelectUs,
      onReapply: onSelectUs,
    },
    {
      id: 'singapore',
      title: '新加坡账户',
      Icon: Building2,
      tone: 'emerald',
      fee: 'USD 1,000',
      description: '无需上传或填写额外资料，确认扣费后进入后台审核与账户配置。',
      status: accountStatuses.singapore,
      onApply: onSelectSingapore,
      onReapply: onReapplySingapore,
      disabled: !enableSingaporeOpening,
      disabledLabel: '待开放',
    },
    {
      id: 'bahrain',
      title: '巴林账户',
      Icon: Landmark,
      tone: 'amber',
      fee: '按配置',
      description: '无需上传开户资料，确认开户费用后进入后台审核流程。',
      status: accountStatuses.bahrain || 'not_opened',
      onApply: onSelectBahrain,
      onReapply: onSelectBahrain,
      disabled: !enableBahrainOpening,
      disabledLabel: '待开放',
    },
  ].map((account) => {
    const config = jurisdictionAccountConfigs[account.id] || {}
    const hasExistingAccountOrApplication = account.status !== 'not_opened'
    const hidden = config.clientVisible === false && !hasExistingAccountOrApplication
    const configurationDisabled = config.configurationEnabled === false
    const applicationDisabled = config.allowClientApplication === false
    const disabledByConfiguration = !hasExistingAccountOrApplication && (configurationDisabled || applicationDisabled)
    const configuredFee = Number.isFinite(Number(config.openingFeeAmount))
      ? formatCurrencyAmount(config.openingFeeCurrency || 'USD', Number(config.openingFeeAmount))
      : account.fee

    return {
      ...account,
      title: config.name || account.title,
      englishName: config.englishName || '',
      description: config.description || account.description,
      fee: configuredFee,
      currencies: config.currencies || [],
      requiresDocuments: config.requiresDocuments === true,
      hidden,
      disabled: account.disabled || disabledByConfiguration,
      disabledLabel: configurationDisabled
        ? '配置已禁用'
        : applicationDisabled
          ? '不支持客户端申请'
          : account.disabledLabel,
    }
  }).filter((account) => !account.hidden)

  const getAction = (account) => {
    if (account.disabled) return null
    if (account.status === 'failed') return { label: jurisdictionStatusMeta.failed.actionLabel, action: account.onReapply }
    if (account.status === 'not_opened') return { label: jurisdictionStatusMeta.not_opened.actionLabel, action: account.onApply }
    return null
  }

  const content = (
    <div className={embedded ? 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm' : 'w-full max-w-[760px] rounded-3xl bg-white p-6 shadow-2xl'}>
        <ModalHeader eyebrow="Jurisdiction accounts" title="其他法域账户" onClose={onClose} />
        <p className="mt-2 text-sm leading-6 text-slate-500">
          不同法域账户独立维护申请状态，可分别查看状态、发起申请或重新申请。
        </p>
        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <div className="text-xs font-semibold text-blue-700">仅原型演示使用：开户费余额校验</div>
          <div className="mt-3 flex flex-wrap gap-2">
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
        <div className="mt-6 grid gap-4">
          {accounts.map((account) => {
            const meta = jurisdictionStatusMeta[account.disabled ? 'not_opened' : account.status]
            const action = getAction(account)
            const toneClass = account.tone === 'emerald'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
              : account.tone === 'amber'
                ? 'border-amber-200 bg-amber-50 text-amber-600'
                : 'border-blue-200 bg-blue-50 text-blue-600'
            const Icon = account.Icon

            return (
              <div key={account.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-white shadow-sm ${toneClass}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-slate-950">{account.title}</h4>
                        <Badge variant={account.disabled ? 'secondary' : meta.badge}>{account.disabled ? account.disabledLabel : meta.label}</Badge>
                      </div>
                      {account.englishName ? <div className="mt-1 text-xs font-semibold text-slate-400">{account.englishName}</div> : null}
                      <p className="mt-1 text-sm leading-6 text-slate-500">{account.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1">开户费 {account.fee}</span>
                        {account.currencies.length ? <span className="rounded-full bg-slate-100 px-3 py-1">支持币种 {account.currencies.join(' / ')}</span> : null}
                        <span className="rounded-full bg-slate-100 px-3 py-1">{account.requiresDocuments ? '需要开户资料' : '无需上传资料'}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">{account.disabled ? '当前不可申请' : meta.description}</span>
                      </div>
                      {account.status === 'failed' && !account.disabled ? (
                        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
                          <span className="font-semibold">申请未通过：</span>
                          {account.id === 'bahrain' ? '当前开户资格审核未通过，请确认申请信息后重新提交。' : '身份证明文件不完整，请补充后重新提交。'}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-3">
                    {action ? (
                      <Button
                        type="button"
                        onClick={action.action}
                        className="rounded-lg"
                      >
                        {action.label}
                      </Button>
                    ) : null}
                    <select
                      value={account.status}
                      onChange={(event) => onAccountStatusChange(account.id, event.target.value)}
                      disabled={account.disabled}
                      className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-500 outline-none"
                      aria-label={`${account.title}原型状态`}
                    >
                      {Object.entries(jurisdictionStatusMeta).map(([value, item]) => (
                        <option key={value} value={value}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
  )

  if (embedded) return content

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      {content}
    </div>
  )
}

function JurisdictionAccountsPage({
  onBack,
  topNavProps,
  ...jurisdictionProps
}) {
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <ClientTopNav onBack={onBack} {...topNavProps} />
      <main className="mx-auto max-w-[980px] px-5 py-8">
        <Button type="button" variant="outline" onClick={onBack} className="mb-5 rounded-lg">
          返回账户
        </Button>
        <JurisdictionPicker embedded onClose={onBack} {...jurisdictionProps} />
      </main>
    </div>
  )
}

function BahrainFeeConfirmationModal({
  config,
  balanceMode,
  submissionMode,
  onClose,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const submitGuard = useRef(false)
  const feeAmount = Math.max(Number(config.openingFeeAmount || 0), 0)
  const feeCurrency = config.openingFeeCurrency || 'USD'
  const sufficientBalance = Math.max(5000, feeAmount + 1250)
  const insufficientBalance = Math.max(0, feeAmount - Math.max(50, Math.min(250, feeAmount / 2)))
  const availableBalance = balanceMode === 'insufficient' ? insufficientBalance : sufficientBalance
  const insufficient = availableBalance < feeAmount
  const remainingBalance = Math.max(availableBalance - feeAmount, 0)
  const accountName = config.name || '当前账户'

  const submit = () => {
    if (insufficient || submitting || submitGuard.current) return

    submitGuard.current = true
    setSubmitting(true)
    setSubmitError('')
    window.setTimeout(() => {
      if (submissionMode === 'failure') {
        submitGuard.current = false
        setSubmitting(false)
        setSubmitError('申请提交失败：开户费用扣除未完成，请稍后重试。本次未生成申请记录，账户余额未发生变化。')
        return
      }

      onSuccess()
    }, 700)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[600px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <ModalHeader eyebrow="Opening application" title={`确认申请${accountName}`} onClose={() => {
            if (!submitting) onClose()
          }} />
        </div>
        <div className="max-h-[72vh] overflow-y-auto px-6 py-5">
          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
            {[
              ['申请账户', accountName],
              ['开户费用', formatCurrencyAmount(feeCurrency, feeAmount)],
              ['扣费账户', '香港账户'],
              ['扣费币种', feeCurrency],
              ['当前可用余额', formatCurrencyAmount(feeCurrency, availableBalance)],
              ['扣费后预计剩余', formatCurrencyAmount(feeCurrency, remainingBalance)],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0 rounded-lg bg-white px-4 py-3">
                <div className="text-xs text-slate-500">{label}</div>
                <div className="mt-1 break-words text-sm font-bold text-slate-950">{value}</div>
              </div>
            ))}
          </div>

          {insufficient ? (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
              <span>当前账户可用余额不足，无法支付开户费用，请先完成入金或兑换。</span>
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
              <span>提交申请后将从指定账户扣除开户费用。申请提交后将进入审核流程，请确认相关信息无误。</span>
            </div>
          )}

          {submitError ? (
            <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              {submitError}
            </div>
          ) : null}
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting} className="rounded-lg">
            取消
          </Button>
          <Button
            type="button"
            onClick={submit}
            disabled={insufficient || submitting}
            className="min-w-[128px] rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                提交中
              </span>
            ) : '确认并提交'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function BahrainAccountApplicationPage({
  config,
  status,
  balanceMode,
  onBalanceModeChange,
  onBack,
  onSubmit,
  topNavProps,
}) {
  const [feeConfirmOpen, setFeeConfirmOpen] = useState(false)
  const [submissionMode, setSubmissionMode] = useState('success')
  const accountName = config.name || '当前账户'
  const englishName = config.englishName || ''
  const description = config.description || '确认开户费用后提交账户申请。'
  const feeAmount = Math.max(Number(config.openingFeeAmount || 0), 0)
  const feeCurrency = config.openingFeeCurrency || 'USD'
  const currencies = config.currencies || []
  const statusMeta = jurisdictionStatusMeta[status] || jurisdictionStatusMeta.not_opened
  const canApply = status === 'not_opened' || status === 'failed'

  return (
    <div className="min-h-screen bg-[#f4f7fb] pb-10 text-slate-950">
      <ClientTopNav onBack={onBack} {...topNavProps} />
      <main className="mx-auto max-w-[980px] px-5 py-8">
        <Button type="button" variant="outline" onClick={onBack} className="mb-5 rounded-lg">
          返回其他法域账户
        </Button>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-5 border-b border-slate-200 px-6 py-6">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700">
                <Landmark className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-950">{accountName}</h1>
                  <Badge variant={statusMeta.badge}>{statusMeta.label}</Badge>
                </div>
                {englishName ? <div className="mt-1 text-sm font-semibold text-slate-400">{englishName}</div> : null}
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
              </div>
            </div>
            {canApply ? (
              <Button type="button" onClick={() => setFeeConfirmOpen(true)} className="rounded-lg bg-blue-600 hover:bg-blue-700">
                {status === 'failed' ? '重新申请' : '立即申请'}
              </Button>
            ) : null}
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-[1fr_0.9fr]">
            <section>
              <h2 className="text-base font-bold text-slate-950">账户申请信息</h2>
              <dl className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200">
                {[
                  ['账户名称', accountName],
                  ['英文名称', englishName || '-'],
                  ['开户费用', formatCurrencyAmount(feeCurrency, feeAmount)],
                  ['资料要求', config.requiresDocuments ? '需要上传开户资料' : '无需上传开户资料'],
                  ['提交后状态', '审核中'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-5 px-4 py-3">
                    <dt className="text-sm text-slate-500">{label}</dt>
                    <dd className="text-right text-sm font-bold text-slate-950">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-950">支持币种</h2>
              <div className="mt-4 flex min-h-[60px] flex-wrap content-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                {currencies.length
                  ? currencies.map((currency) => (
                      <span key={currency} className="inline-flex h-8 items-center rounded-full bg-white px-3 text-xs font-bold text-blue-700 shadow-sm">
                        {currency}
                      </span>
                    ))
                  : <span className="text-sm text-slate-500">暂未配置支持币种</span>}
              </div>
            </section>
          </div>
        </section>

        {status === 'failed' ? (
          <section className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
            <div className="text-sm font-bold text-red-800">审核拒绝</div>
            <p className="mt-1 text-sm leading-6 text-red-700">当前开户资格审核未通过，请确认申请信息后重新提交。</p>
          </section>
        ) : null}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-950">原型状态模拟</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">用于检查余额不足与提交失败时的页面反馈。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                ['sufficient', '余额充足'],
                ['insufficient', '余额不足'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onBalanceModeChange(value)}
                  className={balanceMode === value ? 'h-9 rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white' : 'h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600'}
                >
                  {label}
                </button>
              ))}
              {[
                ['success', '正常提交'],
                ['failure', '模拟失败'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSubmissionMode(value)}
                  className={submissionMode === value ? 'h-9 rounded-lg bg-slate-800 px-3 text-sm font-semibold text-white' : 'h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600'}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {feeConfirmOpen ? (
        <BahrainFeeConfirmationModal
          config={config}
          balanceMode={balanceMode}
          submissionMode={submissionMode}
          onClose={() => setFeeConfirmOpen(false)}
          onSuccess={onSubmit}
        />
      ) : null}
    </div>
  )
}

function InsufficientBalanceModal({ onClose, openingAccountVariant = 'us' }) {
  const feeAmount = openingAccountVariant === 'singapore'
    ? 'USD 1,000'
    : openingAccountVariant === 'bahrain'
      ? '按账户类型配置'
      : 'USD 500'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[480px] rounded-3xl bg-white p-6 shadow-2xl">
        <ModalHeader eyebrow="Opening fee" title="余额不足" onClose={onClose} />
        <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <span className="text-sm font-semibold text-slate-700">开户费余额校验</span>
          <Badge variant="danger">暂不可申请</Badge>
        </div>
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5">
          <div className="text-sm font-semibold text-red-900">
            当前可用余额低于 {feeAmount} 开户费
          </div>
          <p className="mt-2 text-sm leading-6 text-red-800">
            请先充值或换入足够 USD 后再申请。
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="button" onClick={onClose} variant="outline" className="rounded-lg">
            关闭
          </Button>
        </div>
      </div>
    </div>
  )
}

function SingaporeReapplyModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[520px] rounded-3xl bg-white p-6 shadow-2xl">
        <ModalHeader eyebrow="Singapore account" title="重新提交新加坡账户申请" onClose={onClose} />
        <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
              <CircleAlert className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-semibold text-red-900">拒绝原因</div>
              <p className="mt-2 text-sm leading-6 text-red-800">
                身份证明文件不完整，请补充后重新提交。
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm leading-6 text-blue-800">
          您可以根据审核意见修改信息后重新提交申请。系统会保留历史申请记录，并为本次重新提交生成新的申请记录。
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button type="button" onClick={onClose} variant="outline" className="rounded-lg">
            取消
          </Button>
          <Button type="button" onClick={onConfirm} className="rounded-lg bg-blue-600 px-6 hover:bg-blue-700">
            重新申请
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
      <button type="button" aria-label="关闭" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

function MainContent({
  status,
  activeAccount,
  brokerageAccountCards = [],
  onOpenBrokerageTransfer,
  onOpenBrokerageDetail,
  onOpenBrokerageService,
  showSingaporeAccount = false,
  showBahrainAccount = false,
  bahrainAccountConfig = {},
}) {
  if (activeAccount === 'brokerage') {
    return (
      <BrokerageAccountContent
        status={status}
        cards={brokerageAccountCards}
        onOpenBrokerageTransfer={onOpenBrokerageTransfer}
        onOpenBrokerageDetail={onOpenBrokerageDetail}
        onOpenBrokerageService={onOpenBrokerageService}
      />
    )
  }

  if (activeAccount === 'digital') {
    return <DigitalAssetDistribution />
  }

  return (
    <AssetDistribution
      status={status}
      showSingaporeAccount={showSingaporeAccount}
      showBahrainAccount={showBahrainAccount}
      bahrainAccountConfig={bahrainAccountConfig}
    />
  )
}

function UsAccountStatusPanel({ status }) {
  const meta = usStatusMeta[status]
  const Icon = status === 'failed' ? X : RefreshCw

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className={status === 'failed' ? 'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-700' : 'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700'}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <Badge variant={meta.badge}>{meta.label}</Badge>
          <h3 className="mt-3 text-2xl font-bold text-slate-950">{meta.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{meta.description}</p>
        </div>
      </div>
      {status === 'failed' ? (
        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
            <div className="text-sm font-semibold text-red-900">失败原因</div>
            <p className="mt-2 text-sm leading-6 text-red-800">{meta.reason}</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <div className="text-sm font-semibold text-amber-900">开户费处理说明</div>
            <p className="mt-2 text-sm leading-6 text-amber-800">开户失败后 USD 500 开户费是否退回、自动退回还是人工处理，当前 PRD 未明确，标注为待确认。</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" className="rounded-lg">
              联系客服
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

const hkAssetRows = [
  {
    currency: 'HKD 港币',
    balance: '625106.36 HKD',
    available: '624905.36 HKD',
    frozen: '201.00 HKD',
    usdValue: '79806.95',
    rate: '1 HKD = 0.12 USD',
  },
  {
    currency: 'USD 美元',
    balance: '16230.44 USD',
    available: '16230.44 USD',
    frozen: '0.00 USD',
    usdValue: '16230.44',
    rate: '1 USD = 1.00 USD',
  },
]

const usAssetRows = [
  {
    currency: 'USD 美元',
    balance: '82630.27 USD',
    available: '82430.27 USD',
    frozen: '200.00 USD',
    usdValue: '82430.27',
    rate: '1 USD = 1.00 USD',
  },
]

const sgAssetRows = [
  {
    currency: 'USD 美元',
    balance: '36,280.00 USD',
    available: '36,280.00 USD',
    frozen: '0.00 USD',
    usdValue: '36,280.00',
    rate: '1 USD = 1.00 USD',
  },
  {
    currency: 'CNY 人民币',
    balance: '128,600.00 CNY',
    available: '128,600.00 CNY',
    frozen: '0.00 CNY',
    usdValue: '17,804.71',
    rate: '1 CNY = 0.14 USD',
  },
  {
    currency: 'SGD 新加坡元',
    balance: '74,920.50 SGD',
    available: '74,920.50 SGD',
    frozen: '0.00 SGD',
    usdValue: '55,071.99',
    rate: '1 SGD = 0.74 USD',
  },
  {
    currency: 'AED 阿联酋迪拉姆',
    balance: '91,400.00 AED',
    available: '91,400.00 AED',
    frozen: '0.00 AED',
    usdValue: '24,886.41',
    rate: '1 AED = 0.27 USD',
  },
  {
    currency: 'JPY 日元',
    balance: '4,280,000 JPY',
    available: '4,280,000 JPY',
    frozen: '0 JPY',
    usdValue: '27,192.80',
    rate: '1 JPY = 0.0064 USD',
  },
]

const bhAssetRows = [
  {
    currency: 'USD 美元',
    balance: '12,600.00 USD',
    available: '12,600.00 USD',
    frozen: '0.00 USD',
    usdValue: '12,600.00',
    rate: '1 USD = 1.00 USD',
  },
  {
    currency: 'BHD 巴林第纳尔',
    balance: '18,500.000 BHD',
    available: '18,500.000 BHD',
    frozen: '0.000 BHD',
    usdValue: '49,025.00',
    rate: '1 BHD = 2.65 USD',
  },
]

function AssetAccountCard({ title, subtitle, total, badge, badgeVariant, rows, statusInfo, showQuickColumn = true }) {
  const headers = showQuickColumn ? ['币种', '余额', '可用余额', '冻结金额', '美元价值', '24H汇率', '快捷操作'] : ['币种', '余额', '可用余额', '冻结金额', '美元价值', '24H汇率']

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h4 className="text-base font-bold text-slate-950">{title}</h4>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          {total ? <div className="text-lg font-bold text-blue-600">{total}</div> : null}
          {badge ? <Badge variant={badgeVariant}>{badge}</Badge> : null}
        </div>
      </div>
      {rows?.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
              <tr>
                {headers.map((item) => (
                  <th key={item} className="px-6 py-4">{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.currency} className="border-t border-slate-100">
                  <td className="px-6 py-5">
                    <div className="inline-flex items-center gap-2 font-semibold text-slate-900">
                      <CurrencyIcon currency={row.currency} />
                      <span>{row.currency}</span>
                    </div>
                    <br />
                    <span className="text-xs font-normal text-slate-500">{title}</span>
                  </td>
                  <td className="px-6 py-5">{row.balance}</td>
                  <td className="px-6 py-5">{row.available}</td>
                  <td className="px-6 py-5">{row.frozen}</td>
                  <td className="px-6 py-5 font-bold">{row.usdValue}</td>
                  <td className="px-6 py-5">{row.rate}</td>
                  {showQuickColumn ? <td className="px-6 py-5 text-slate-400">—</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : statusInfo?.length ? (
        <div className="grid gap-3 p-6 sm:grid-cols-2">
          {statusInfo.map(([label, value, tone]) => (
            <div key={label} className={tone === 'danger' ? 'rounded-2xl border border-red-100 bg-red-50 p-4 sm:col-span-2' : 'rounded-2xl border border-slate-100 bg-slate-50 p-4'}>
              <div className="text-xs font-semibold text-slate-500">{label}</div>
              <div className={tone === 'danger' ? 'mt-2 text-sm font-semibold leading-6 text-red-800' : 'mt-2 text-sm font-bold text-slate-950'}>{value}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function AssetDistribution({
  status,
  showSingaporeAccount = false,
  showBahrainAccount = false,
  bahrainAccountConfig = {},
}) {
  const usMeta = usStatusMeta[status]
  const showUsCard = status !== 'not_opened'
  const usOpened = status === 'opened'
  const sgOpened = showSingaporeAccount
  const bhOpened = showBahrainAccount
  const bahrainName = bahrainAccountConfig.name || '巴林账户'
  const bahrainCurrencies = bahrainAccountConfig.currencies?.length ? bahrainAccountConfig.currencies : ['USD', 'BHD']
  const bahrainRows = bhAssetRows.filter((row) => bahrainCurrencies.includes(row.currency.split(' ')[0]))
  const accountNames = ['香港账户', '美国账户']
  if (showSingaporeAccount) accountNames.push('新加坡账户')
  if (showBahrainAccount) accountNames.push(bahrainName)
  const usStatusInfo = [
    ...(status === 'failed' ? [['拒绝原因', usMeta.reason, 'danger']] : []),
  ]

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">资产分布</h3>
          <p className="mt-1 text-sm text-slate-500">信托账户下的{accountNames.join(' / ')}分类</p>
          <p className="mt-1 text-xs font-semibold text-amber-700">说明：其他法域账户仅在已开户时展示资产卡片，关闭客户端入口不影响已开户资产。</p>
        </div>
      </div>

      <div className="grid gap-5">
        <AssetAccountCard
          title="香港账户"
          subtitle="信托账户下的香港法币资产分类，支持 HKD / USD。"
          total="$96037.39"
          rows={hkAssetRows}
        />
        {showUsCard ? (
          <AssetAccountCard
            title="美国账户"
            subtitle="信托账户下的美国法币资产分类，仅支持 USD。"
            total={usOpened ? '$82430.27' : ''}
            badge={usOpened ? '' : usMeta.label}
            badgeVariant={usOpened ? undefined : usMeta.badge}
            rows={usOpened ? usAssetRows : []}
            statusInfo={usStatusInfo}
          />
        ) : null}
        {sgOpened ? (
          <AssetAccountCard
            title="新加坡账户"
            subtitle="信托账户下的新加坡法币资产分类，支持 USD / CNY / SGD / AED / JPY。"
            total="$161235.91"
            rows={sgAssetRows}
          />
        ) : null}
        {bhOpened ? (
          <AssetAccountCard
            title={bahrainName}
            subtitle={`信托账户下的巴林法币资产分类，支持 ${bahrainCurrencies.join(' / ')}。`}
            total="$61,625.00"
            rows={bahrainRows}
          />
        ) : null}
      </div>

      {status === 'failed' ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <div className="text-sm font-semibold text-amber-900">处理说明</div>
          <p className="mt-2 text-sm leading-6 text-amber-800">审核拒绝后当前原型不提供重新申请入口，如需继续处理需联系运营或客服线下确认。</p>
        </div>
      ) : null}
    </div>
  )
}

function DigitalAssetDistribution() {
  const rows = [
    { currency: 'USDT', balance: '0.00 USDT', available: '0.00 USDT', frozen: '0.00 USDT', usdValue: '0.00', rate: '1 USDT = 1.00 USD' },
    { currency: 'ETH', balance: '0.00 ETH', available: '0.00 ETH', frozen: '0.00 ETH', usdValue: '0.00', rate: '1 ETH = -- USD' },
    { currency: 'BTC', balance: '0.00 BTC', available: '0.00 BTC', frozen: '0.00 BTC', usdValue: '0.00', rate: '1 BTC = -- USD' },
  ]

  return (
    <div className="grid gap-5">
      <div>
        <h3 className="text-lg font-bold text-slate-950">数字资产账户</h3>
        <p className="mt-1 text-sm text-slate-500">数字资产账户下的 USDT / ETH / BTC 分类，当前原型仅展示账户层级。</p>
      </div>
      <AssetAccountCard
        title="数字资产账户"
        subtitle="数字资产分类账户"
        total="$0.00"
        rows={rows}
        showQuickColumn={false}
      />
    </div>
  )
}

function buildBrokerageAssetRows(card) {
  return (card.currencies || ['USD', 'HKD', 'CNY']).map((currency) => {
    const balance = card.balance?.[currency] || `${currency} 0.00`
    const amount = balance.replace(`${currency} `, '')

    return {
      currency: `${currency} ${getCurrencyName(currency)}`,
      balance,
      available: balance,
      frozen: `${currency} 0.00`,
      usdValue: currency === 'USD' ? amount : currency === 'HKD' ? '25,384.62' : '0.00',
      rate: currency === 'USD' ? '1 USD = 1.00 USD' : currency === 'HKD' ? '1 HKD = 0.12 USD' : '1 CNY = 0.14 USD',
    }
  })
}

function BrokerageAccountContent({ status, cards = [], onOpenBrokerageTransfer, onOpenBrokerageDetail, onOpenBrokerageService }) {
  const displayCards = status === 'opened'
    ? cards.map((card) => ({ ...card, status: 'opened', statusLabel: brokerageStatusMeta.opened.label }))
    : []

  if (status === 'not_opened') {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Building2 className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-xl font-bold text-slate-950">暂无可用券商账户</h3>
        <p className="mx-auto mt-2 max-w-[520px] text-sm leading-6 text-slate-500">
          您可前往「投资 - 券商服务」开通 IBKR / Webull 券商账户。
        </p>
        <Button type="button" className="mt-6 rounded-lg bg-blue-600 px-6 hover:bg-blue-700" onClick={onOpenBrokerageService}>
          前往券商服务
        </Button>
      </section>
    )
  }

  return (
    <div className="grid gap-6">
      <div>
        <h3 className="text-lg font-bold text-slate-950">券商资产分类</h3>
        <p className="mt-1 text-sm text-slate-500">目前仅展示券商账户资产分类，不展示股票、基金、持仓等明细。</p>
      </div>
      <div className="grid gap-5">
        {displayCards.map((card) => (
          <AssetAccountCard
            key={card.brokerId}
            title={card.brokerName}
            subtitle={`${card.label} · 支持 ${(card.currencies || ['USD', 'HKD', 'CNY']).join(' / ')}`}
            total={`$${Number(card.totalUsd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            rows={buildBrokerageAssetRows(card)}
            showQuickColumn={false}
          />
        ))}
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

function BrokerageAccountDetailDrawer({ card, onClose }) {
  if (!card) return null

  const statusMeta = brokerageStatusMeta[card.status] || brokerageStatusMeta.not_opened
  const rows = [
    ['券商账户', card.label],
    ['券商名称', card.brokerName],
    ['当前状态', statusMeta.label],
    ['账户名称', card.status === 'opened' ? card.accountName : '--'],
    ['账户号码', card.status === 'opened' ? card.accountNumber : '--'],
    ['支持币种', (card.currencies || ['USD', 'HKD', 'CNY']).join(' / ')],
    ['开户日期', card.status === 'opened' ? card.openedAt : '--'],
  ]

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-sm">
      <aside className="h-full w-full max-w-[460px] overflow-auto bg-[#f8fafc] shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-950">券商账户详情</h3>
              <p className="text-xs uppercase tracking-wide text-slate-400">BROKERAGE ACCOUNT</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-5 p-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-bold text-slate-950">{card.label}</h4>
              <Badge variant={statusMeta.badge}>{statusMeta.label}</Badge>
            </div>
            <div className="mt-5 space-y-3">
              {rows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="text-right text-sm font-bold text-slate-950">{value}</span>
                </div>
              ))}
            </div>
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
  sg: {
    label: '新加坡账户',
    holderName: 'WANYARA OP WAN',
    accountName: '新加坡账户',
    accountNumber: 'SG-AC-202607-11020160454',
    balance: {
      USD: 'USD 36,280.00',
      CNY: 'CNY 128,600.00',
      SGD: 'SGD 74,920.50',
      AED: 'AED 91,400.00',
      JPY: 'JPY 4,280,000',
    },
  },
  bh: {
    label: '巴林账户',
    holderName: 'WANYARA OP WAN',
    accountName: '巴林账户',
    accountNumber: 'BH-AC-202607-0950',
    balance: {
      USD: 'USD 12,500.00',
      BHD: 'BHD 18,500.000',
    },
  },
}

const fiatTransferOutBanks = [
  {
    id: 'hk-usd-main',
    accountTypes: ['hk'],
    currencies: ['USD'],
    name: 'WO',
    bank: '万银',
    accountNumber: '232232',
    swift: '12313231',
    country: '阿富汗',
    currency: 'USD',
  },
  {
    id: 'hk-hkd-main',
    accountTypes: ['hk'],
    currencies: ['HKD'],
    name: 'WO',
    bank: 'Bank of China (Hong Kong)',
    accountNumber: '232232',
    swift: '12313232',
    country: '香港',
    currency: 'HKD',
  },
  {
    id: 'us-usd-main',
    accountTypes: ['us'],
    currencies: ['USD'],
    name: 'WO111',
    bank: 'JPMorgan Chase Bank, N.A.',
    accountNumber: '12',
    swift: '12313233',
    country: '美国',
    currency: 'USD',
  },
  {
    id: 'sg-usd-main',
    accountTypes: ['sg'],
    currencies: ['USD'],
    name: 'FIDERE TRUST LIMITED',
    bank: 'Green Link Digital Bank Pte. Ltd.',
    accountNumber: '11020160454',
    swift: 'GLDTSGSG',
    country: '新加坡',
    currency: 'USD',
  },
  {
    id: 'sg-cny-main',
    accountTypes: ['sg'],
    currencies: ['CNY'],
    name: 'FIDERE TRUST LIMITED',
    bank: 'Green Link Digital Bank Pte. Ltd.',
    accountNumber: '11020160454',
    swift: 'GLDTSGSG',
    country: '新加坡',
    currency: 'CNY',
  },
  {
    id: 'sg-sgd-main',
    accountTypes: ['sg'],
    currencies: ['SGD'],
    name: 'FIDERE TRUST LIMITED',
    bank: 'Green Link Digital Bank Pte. Ltd.',
    accountNumber: '11020160454',
    swift: 'GLDTSGSG',
    country: '新加坡',
    currency: 'SGD',
  },
  {
    id: 'sg-aed-main',
    accountTypes: ['sg'],
    currencies: ['AED'],
    name: 'FIDERE TRUST LIMITED',
    bank: 'Green Link Digital Bank Pte. Ltd.',
    accountNumber: '11020160454',
    swift: 'GLDTSGSG',
    country: '新加坡',
    currency: 'AED',
  },
  {
    id: 'sg-jpy-main',
    accountTypes: ['sg'],
    currencies: ['JPY'],
    name: 'FIDERE TRUST LIMITED',
    bank: 'Green Link Digital Bank Pte. Ltd.',
    accountNumber: '11020160454',
    swift: 'GLDTSGSG',
    country: '新加坡',
    currency: 'JPY',
  },
  {
    id: 'bh-usd-main',
    accountTypes: ['bh'],
    currencies: ['USD'],
    name: 'WANYARA OP WAN',
    bank: 'Bahrain Receiving Bank',
    accountNumber: 'BH-0950',
    swift: 'BHRNBHBM',
    country: '巴林',
    currency: 'USD',
  },
  {
    id: 'bh-bhd-main',
    accountTypes: ['bh'],
    currencies: ['BHD'],
    name: 'WANYARA OP WAN',
    bank: 'Bahrain Receiving Bank',
    accountNumber: 'BH-0950',
    swift: 'BHRNBHBM',
    country: '巴林',
    currency: 'BHD',
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
            <div className="mt-3 text-sm text-slate-500">服务费: {record.serviceFeeAmount || record.feeAmount} {record.currency}</div>
            <div className="mt-1 text-sm font-semibold text-slate-700">实际到账: {record.actualArrivalAmount || record.amount} {record.currency}</div>
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
                ['转账金额', `${record.currency} ${record.amount}`],
                ['实际到账金额', `${record.currency} ${record.actualArrivalAmount || record.amount}`],
                ['服务费', `${record.currency} ${record.serviceFeeAmount || record.feeAmount}`],
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

function ExternalFiatTransferOutPage({
  onBack,
  records,
  onSubmit,
  topNavProps,
  showGuidanceMarks = true,
  includeSingaporeAccount = false,
  includeBahrainAccount = false,
}) {
  const [view, setView] = useState('form')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [accountType, setAccountType] = useState('hk')
  const [currency, setCurrency] = useState('USD')
  const [selectedBankId, setSelectedBankId] = useState('hk-usd-main')
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const accountOptions = [
    'hk',
    'us',
    ...(includeSingaporeAccount ? ['sg'] : []),
    ...(includeBahrainAccount ? ['bh'] : []),
  ]
  const account = fiatTransferOutAccounts[accountType]
  const currencyOptions = Object.keys(account.balance)
  const filteredBanks = fiatTransferOutBanks.filter((bank) => (
    bank.accountTypes.includes(accountType) && bank.currencies.includes(currency)
  ))
  const selectedBank = filteredBanks.find((bank) => bank.id === selectedBankId) || filteredBanks[0]
  const scopedRecords = records.filter((record) => record.accountType === accountType && record.currency === currency)
  const serviceFeeAmount = 2
  const serviceFeeDisplay = formatCurrencyAmount(currency, serviceFeeAmount)
  const serviceFeeDescription = '服务费由后台按用户配置，可能包含固定服务费、按转账金额百分比计费，或固定服务费 + 百分比组合。页面金额为预估，最终以后台配置和审核结果为准。'
  const numericPreviewAmount = Number(amount)
  const hasValidPreviewAmount = Number.isFinite(numericPreviewAmount) && numericPreviewAmount > 0
  const actualArrivalPreview = hasValidPreviewAmount
    ? formatCurrencyAmount(currency, Math.max(numericPreviewAmount - serviceFeeAmount, 0))
    : '-'

  const changeAccountType = (nextType) => {
    setAccountType(nextType)
    const nextCurrency = Object.keys(fiatTransferOutAccounts[nextType].balance)[0] || 'USD'
    const nextBank = fiatTransferOutBanks.find((bank) => (
      bank.accountTypes.includes(nextType) && bank.currencies.includes(nextCurrency)
    ))
    setCurrency(nextCurrency)
    setSelectedBankId(nextBank?.id || '')
    setError('')
  }

  const changeCurrency = (nextCurrency) => {
    const nextBank = fiatTransferOutBanks.find((bank) => (
      bank.accountTypes.includes(accountType) && bank.currencies.includes(nextCurrency)
    ))
    setCurrency(nextCurrency)
    setSelectedBankId(nextBank?.id || '')
    setError('')
  }

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
    if (!selectedBank) {
      setError('当前账户币种暂无可用收款银行。')
      return
    }
    setError('')
    const createdAt = formatTransferTime()
    const actualArrivalAmount = Math.max(numericAmount - serviceFeeAmount, 0)
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
      feeAmount: serviceFeeAmount.toFixed(2),
      serviceFeeAmount: serviceFeeAmount.toFixed(2),
      actualArrivalAmount: actualArrivalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
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
      <ClientTopNav onBack={onBack} {...topNavProps} />
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
          <div className="grid gap-3 md:grid-cols-[220px_220px_1fr]">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">选择账户</span>
              <select
                value={accountType}
                onChange={(event) => changeAccountType(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-500"
              >
                {accountOptions.map((value) => (
                  <option key={value} value={value}>{fiatTransferOutAccounts[value].label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">选择币种</span>
              <select
                value={currency}
                onChange={(event) => changeCurrency(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-500"
              >
                {currencyOptions.map((value) => (
                  <option key={value} value={value}>{formatTransferCurrencyLabel(value)}</option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">
                收款银行将按所选账户和币种自动展示。
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[0.68fr_0.32fr]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-blue-500 bg-white shadow-[0_8px_24px_rgba(37,99,235,0.16)]">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="flex items-center gap-2 text-base font-bold text-slate-950">
                  <WalletCards className="h-5 w-5 text-blue-600" />
                  收款人信息
                </h2>
              </div>
              <div className="grid gap-4 p-6 md:grid-cols-2">
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
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h2 className="flex items-center gap-2 text-base font-bold text-slate-950">
                  <Landmark className="h-5 w-5 text-blue-600" />
                  银行地址
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-5 max-w-sm rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                  <div className="text-xs font-semibold text-blue-700">可用余额</div>
                  <div className="mt-1 text-lg font-bold text-slate-950">{account.balance[currency]}</div>
                </div>
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
                  {filteredBanks.map((bank) => {
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
                  {filteredBanks.length === 0 ? (
                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                      当前账户币种暂无可用收款银行。
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr]">
                  <label className="flex h-12 overflow-hidden rounded-full border border-slate-200 bg-white">
                    <span className="flex w-24 items-center border-r border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-950">{currency}</span>
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
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      服务费
                      {showGuidanceMarks ? (
                        <span className="group relative inline-flex" title={serviceFeeDescription}>
                          <CircleHelp className="h-4 w-4 text-slate-400" />
                          <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-72 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold leading-5 text-slate-600 shadow-xl group-hover:block">
                            {serviceFeeDescription}
                          </span>
                        </span>
                      ) : null}
                    </span>
                    <span className="font-bold text-slate-950">{serviceFeeDisplay}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-slate-500">预计到账时间</span>
                    <span className="font-bold text-slate-950">1-3 个工作日</span>
                  </div>
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
                  ['服务费', serviceFeeDisplay],
                  ['实际到账金额', actualArrivalPreview],
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
                        <span className="font-bold text-slate-950">转账 {record.currency} {record.amount}</span>
                        <Badge variant={record.status === 'COMPLETED' ? 'success' : 'warning'}>{record.statusLabel}</Badge>
                      </div>
                      <div className="mt-2 text-slate-500">实际到账 {record.currency} {record.actualArrivalAmount || record.amount} · {record.accountLabel} · {record.beneficiary}</div>
                      <div className="mt-1 text-xs text-slate-400">服务费 {record.currency} {record.serviceFeeAmount || record.feeAmount} · {record.createdAt}</div>
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
    ...(draft.purpose && draft.purpose !== '-' ? [['转账用途', draft.purpose]] : []),
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

const currentUserTransferEmail = 'xr3kes66@123mails.org'

const maskTransferEmail = (email) => {
  const [localPart = '', domain = ''] = String(email || '').split('@')
  if (!domain) return email
  const visiblePrefix = localPart.slice(0, Math.min(3, localPart.length))
  return `${visiblePrefix}${localPart.length > 3 ? '***' : '*'}@${domain}`
}

const getUserTransferBalanceValue = (balance) => {
  const parsed = Number(String(balance || '').replace(/[^\d.-]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

const getUserTransferPrecision = (currency) => (currency === 'JPY' ? 0 : 2)

function UserTransferConfirmModal({
  recipient,
  account,
  currency,
  amountDisplay,
  isSubmitting,
  onClose,
  onConfirm,
}) {
  const rows = [
    ['收款用户', recipient.name],
    ['收款邮箱', recipient.maskedEmail],
    ['转出账户', account.label],
    ['币种', formatUserTransferCurrencyLabel(currency)],
    ['转账金额', amountDisplay],
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" role="presentation">
      <div className="w-full max-w-[540px] rounded-lg bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="user-transfer-confirm-title">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="user-transfer-confirm-title" className="text-xl font-bold text-slate-950">确认提交转账申请</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">请再次核对收款用户和转账信息。</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="关闭确认弹窗"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-slate-50 px-5">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-5 py-3.5 text-sm">
              <span className="text-slate-500">{label}</span>
              <span className="max-w-[65%] break-words text-right font-semibold text-slate-950">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />
          <p>提交后申请进入待审核状态。实际费用、资金处理方式及最终结果以后端审核为准。</p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" onClick={onClose} disabled={isSubmitting} variant="outline" className="rounded-md px-5">
            取消
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isSubmitting} className="rounded-md bg-blue-600 px-5 hover:bg-blue-700">
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? '提交中' : '确认提交'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function UserTransferPage({
  onBack,
  topNavProps,
  onTransferSubmitted,
  accountOptions = userTransferAccountOptions,
}) {
  const [email, setEmail] = useState('')
  const [recipientState, setRecipientState] = useState('idle')
  const [recipient, setRecipient] = useState(null)
  const [accountId, setAccountId] = useState(accountOptions[0].id)
  const [currency, setCurrency] = useState(accountOptions[0].currencies[0])
  const [amount, setAmount] = useState('')
  const [amountTouched, setAmountTouched] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submittedRecord, setSubmittedRecord] = useState(null)
  const verificationRequestRef = useRef(0)
  const selectedAccount = accountOptions.find((account) => account.id === accountId) || accountOptions[0]
  const currencyOptions = selectedAccount?.currencies || []
  const effectiveCurrency = currencyOptions.includes(currency) ? currency : currencyOptions[0] || ''
  const selectedBalance = selectedAccount?.balance?.[effectiveCurrency] || `${effectiveCurrency || '--'} --`
  const selectedBalanceValue = getUserTransferBalanceValue(selectedBalance)
  const currencyPrecision = getUserTransferPrecision(effectiveCurrency)
  const numericAmount = Number(amount)
  const amountPattern = currencyPrecision === 0 ? /^\d+$/ : new RegExp(`^\\d+(\\.\\d{1,${currencyPrecision}})?$`)
  const amountFormatInvalid = Boolean(amount) && !amountPattern.test(amount)
  const amountError = !amount
    ? ''
    : amountFormatInvalid
      ? `${effectiveCurrency || '当前币种'}最多支持 ${currencyPrecision} 位小数。`
      : !Number.isFinite(numericAmount) || numericAmount <= 0
        ? '转账金额必须大于 0。'
        : numericAmount > selectedBalanceValue
          ? '转账金额不能超过当前可用余额。'
          : ''
  const hasValidAmount = Boolean(amount) && !amountError
  const amountDisplay = hasValidAmount
    ? formatCurrencyAmount(effectiveCurrency, numericAmount)
    : `${effectiveCurrency || '--'} --`
  const recipientVerified = recipientState === 'verified' && Boolean(recipient)
  const canSubmit = recipientVerified
    && Boolean(selectedAccount)
    && Boolean(effectiveCurrency)
    && hasValidAmount
    && !isSubmitting

  const resetRecipient = (nextEmail) => {
    verificationRequestRef.current += 1
    setEmail(nextEmail)
    setRecipientState('idle')
    setRecipient(null)
    setSubmitError('')
  }

  const verifyRecipient = () => {
    const normalizedEmail = email.trim().toLowerCase()
    const requestId = verificationRequestRef.current + 1
    verificationRequestRef.current = requestId
    setRecipient(null)
    setSubmitError('')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setRecipientState('invalid')
      return
    }
    if (normalizedEmail === currentUserTransferEmail.toLowerCase()) {
      setRecipientState('self')
      return
    }

    setRecipientState('verifying')
    window.setTimeout(() => {
      if (verificationRequestRef.current !== requestId) return
      if (normalizedEmail.includes('notfound')) {
        setRecipientState('not-found')
        return
      }
      if (normalizedEmail.includes('disabled')) {
        setRecipientState('disabled')
        return
      }
      if (normalizedEmail.includes('suspended')) {
        setRecipientState('abnormal')
        return
      }
      setRecipient({
        name: normalizedEmail.includes('fail') ? '提交失败演示用户' : 'Alex Chen',
        email: normalizedEmail,
        maskedEmail: maskTransferEmail(normalizedEmail),
        status: '账户正常',
      })
      setRecipientState('verified')
    }, 450)
  }

  const changeAccount = (nextAccountId) => {
    const nextAccount = accountOptions.find((account) => account.id === nextAccountId) || accountOptions[0]
    setAccountId(nextAccount.id)
    setCurrency(nextAccount.currencies[0] || '')
    setAmount('')
    setAmountTouched(false)
    setSubmitError('')
  }

  const changeCurrency = (nextCurrency) => {
    setCurrency(nextCurrency)
    setAmount('')
    setAmountTouched(false)
    setSubmitError('')
  }

  const fillAllBalance = () => {
    const nextAmount = selectedBalanceValue.toFixed(currencyPrecision)
    setAmount(nextAmount)
    setAmountTouched(true)
    setSubmitError('')
  }

  const openConfirmation = () => {
    setAmountTouched(true)
    setSubmitError('')
    if (!canSubmit) return
    setConfirmOpen(true)
  }

  const confirmSubmit = () => {
    if (!canSubmit || isSubmitting) return
    setIsSubmitting(true)
    setSubmitError('')
    window.setTimeout(() => {
      if (recipient.email.includes('fail')) {
        setIsSubmitting(false)
        setConfirmOpen(false)
        setSubmitError('提交失败，请稍后重试。表单内容已为你保留。')
        return
      }
      const nextRecord = {
        id: `TXN-UT-${Date.now()}`,
        recipientName: recipient.name,
        recipientEmail: recipient.maskedEmail,
        accountLabel: selectedAccount.label,
        currency: effectiveCurrency,
        amountValue: numericAmount,
        amount: numericAmount.toLocaleString('en-US', {
          minimumFractionDigits: currencyPrecision,
          maximumFractionDigits: currencyPrecision,
        }),
        statusLabel: '待审核',
        createdAt: formatTransferTime(),
      }
      setSubmittedRecord(nextRecord)
      onTransferSubmitted?.(nextRecord)
      setIsSubmitting(false)
      setConfirmOpen(false)
    }, 650)
  }

  const resetForm = () => {
    verificationRequestRef.current += 1
    setEmail('')
    setRecipientState('idle')
    setRecipient(null)
    setAccountId(accountOptions[0].id)
    setCurrency(accountOptions[0].currencies[0])
    setAmount('')
    setAmountTouched(false)
    setSubmitError('')
    setSubmittedRecord(null)
  }

  const recipientFeedback = {
    verifying: {
      icon: LoaderCircle,
      title: '正在确认收款用户',
      description: '请稍候，正在核对平台账户状态。',
      className: 'border-blue-100 bg-blue-50 text-blue-800',
      iconClassName: 'animate-spin text-blue-600',
    },
    invalid: {
      icon: CircleAlert,
      title: '邮箱格式不正确',
      description: '请输入完整、有效的邮箱地址。',
      className: 'border-red-100 bg-red-50 text-red-800',
      iconClassName: 'text-red-600',
    },
    'not-found': {
      icon: CircleAlert,
      title: '未找到该收款用户',
      description: '请核对邮箱，收款方需要先注册并完成账户开通。',
      className: 'border-red-100 bg-red-50 text-red-800',
      iconClassName: 'text-red-600',
    },
    self: {
      icon: CircleAlert,
      title: '不能转账给本人',
      description: '请填写其他信托用户的邮箱地址。',
      className: 'border-red-100 bg-red-50 text-red-800',
      iconClassName: 'text-red-600',
    },
    abnormal: {
      icon: CircleAlert,
      title: '收款用户当前不可用',
      description: '该用户账户状态异常，暂时无法接收转账。',
      className: 'border-red-100 bg-red-50 text-red-800',
      iconClassName: 'text-red-600',
    },
    disabled: {
      icon: CircleAlert,
      title: '收款用户已被禁用',
      description: '该用户已被平台禁用，无法接收转账。请更换收款用户或联系运营人员。',
      className: 'border-red-100 bg-red-50 text-red-800',
      iconClassName: 'text-red-600',
    },
  }[recipientState]

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <ClientTopNav onBack={onBack} {...topNavProps} />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-5">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
            返回账户
          </button>
          <Badge variant="warning">提交后待审核</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-4 py-6 sm:px-5">
        {submittedRecord ? (
          <section className="mx-auto max-w-[720px] rounded-lg border border-slate-200 bg-white px-5 py-8 shadow-sm sm:px-8">
            <div className="text-center">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <Badge variant="warning" className="mt-4">待审核</Badge>
              <h1 className="mt-3 text-2xl font-bold text-slate-950">转账申请已提交</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">后台审核完成后，你可以在转账记录中查看最终结果。</p>
            </div>
            <div className="mx-auto mt-6 max-w-[560px] divide-y divide-slate-200 rounded-lg border border-slate-200 bg-slate-50 px-5">
              {[
                ['申请编号', submittedRecord.id],
                ['收款用户', submittedRecord.recipientName],
                ['收款邮箱', submittedRecord.recipientEmail],
                ['转出账户', submittedRecord.accountLabel],
                ['转账金额', `${submittedRecord.currency} ${submittedRecord.amount}`],
                ['提交时间', submittedRecord.createdAt],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-5 py-3.5 text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="max-w-[65%] break-words text-right font-semibold text-slate-950">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {topNavProps.onNavSelect ? (
                <Button
                  type="button"
                  onClick={() => topNavProps.onNavSelect('交易')}
                  className="rounded-md bg-blue-600 px-6 hover:bg-blue-700"
                >
                  查看交易记录
                </Button>
              ) : null}
              <Button type="button" onClick={onBack} variant="outline" className="rounded-md px-6">
                返回账户
              </Button>
              <Button type="button" onClick={resetForm} variant="outline" className="rounded-md px-6">
                继续转账
              </Button>
            </div>
          </section>
        ) : (
          <>
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">转账给其他用户</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">向同平台信托用户发起转账申请，提交后由后台人工审核。</p>
            </div>

            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-blue-600">01</span>
                    <h2 className="text-base font-bold text-slate-950">确认收款用户</h2>
                  </div>
                  <label className="mt-4 block">
                    <span className="text-sm font-semibold text-slate-700">收款用户邮箱</span>
                    <div className={`mt-2 flex min-h-11 items-center rounded-md border bg-white pl-3 transition focus-within:border-blue-500 ${
                      ['invalid', 'not-found', 'self', 'abnormal', 'disabled'].includes(recipientState) ? 'border-red-300' : 'border-slate-200'
                    }`}>
                      <Mail className="mr-2 h-4 w-4 shrink-0 text-blue-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => resetRecipient(event.target.value)}
                        onBlur={() => {
                          if (email.trim() && recipientState === 'idle') verifyRecipient()
                        }}
                        placeholder="recipient@fidere.com"
                        className="min-w-0 flex-1 bg-transparent py-2.5 text-sm font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
                        aria-describedby="recipient-feedback"
                      />
                      <button
                        type="button"
                        onClick={verifyRecipient}
                        disabled={!email.trim() || recipientState === 'verifying'}
                        className="mr-1 inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 disabled:text-slate-300"
                      >
                        {recipientState === 'verifying' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        查询
                      </button>
                    </div>
                  </label>

                  {recipientState === 'verified' && recipient ? (
                    <div id="recipient-feedback" className="mt-3 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-blue-600">
                        <UserRound className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-950">{recipient.name}</span>
                          <Badge variant="success">{recipient.status}</Badge>
                        </div>
                        <div className="mt-1 truncate text-sm text-slate-500">{recipient.maskedEmail}</div>
                      </div>
                      <Check className="h-5 w-5 shrink-0 text-emerald-600" />
                    </div>
                  ) : null}

                  {recipientFeedback ? (
                    <div id="recipient-feedback" className={`mt-3 flex gap-3 rounded-lg border px-4 py-3 ${recipientFeedback.className}`}>
                      <recipientFeedback.icon className={`mt-0.5 h-4 w-4 shrink-0 ${recipientFeedback.iconClassName}`} />
                      <div>
                        <div className="text-sm font-semibold">{recipientFeedback.title}</div>
                        <div className="mt-1 text-sm leading-5 opacity-90">{recipientFeedback.description}</div>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="my-6 h-px bg-slate-200" />

                <fieldset disabled={!recipientVerified} className={!recipientVerified ? 'opacity-55' : ''}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-blue-600">02</span>
                      <h2 className="text-base font-bold text-slate-950">填写转账信息</h2>
                    </div>
                    {!recipientVerified ? <span className="text-xs font-medium text-slate-400">请先确认收款用户</span> : null}
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">转出账户</span>
                      <select
                        value={accountId}
                        onChange={(event) => changeAccount(event.target.value)}
                        className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 disabled:bg-slate-50"
                      >
                        {accountOptions.map((account) => (
                          <option key={account.id} value={account.id}>{account.label}</option>
                        ))}
                      </select>
                      <span className="mt-1.5 block text-xs leading-5 text-slate-500">{selectedAccount.helper}</span>
                    </label>

                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">币种</span>
                      <select
                        value={effectiveCurrency}
                        onChange={(event) => changeCurrency(event.target.value)}
                        disabled={!currencyOptions.length}
                        className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 disabled:bg-slate-50"
                      >
                        {currencyOptions.map((option) => (
                          <option key={option} value={option}>{formatUserTransferCurrencyLabel(option)}</option>
                        ))}
                      </select>
                      <span className="mt-1.5 block text-xs leading-5 text-slate-500">
                        {currencyOptions.length ? '仅展示该账户支持且可用的币种。' : '当前账户暂无可用币种。'}
                      </span>
                    </label>
                  </div>

                  {!currencyOptions.length ? (
                    <div className="mt-3 flex gap-3 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                      当前账户没有可用币种，请返回账户页检查账户状态。
                    </div>
                  ) : null}

                  <label className="mt-4 block">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-700">转账金额</span>
                      <span className="text-xs text-slate-500">可用余额：<strong className="font-semibold text-slate-700">{selectedBalance}</strong></span>
                    </div>
                    <div className={`mt-2 flex h-12 items-center rounded-md border bg-white transition focus-within:border-blue-500 ${
                      amountTouched && amountError ? 'border-red-300' : 'border-slate-200'
                    }`}>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        onChange={(event) => {
                          setAmount(event.target.value.trim())
                          setAmountTouched(true)
                          setSubmitError('')
                        }}
                        onBlur={() => setAmountTouched(true)}
                        placeholder="0.00"
                        className="min-w-0 flex-1 bg-transparent px-3 text-lg font-bold text-slate-950 outline-none placeholder:font-normal placeholder:text-slate-300"
                      />
                      <span className="border-l border-slate-200 px-3 text-sm font-semibold text-slate-500">{effectiveCurrency || '--'}</span>
                      <button
                        type="button"
                        onClick={fillAllBalance}
                        disabled={!effectiveCurrency || selectedBalanceValue <= 0}
                        className="mr-1 h-9 rounded-md px-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 disabled:text-slate-300"
                      >
                        全部
                      </button>
                    </div>
                    {amountTouched && amountError ? <span className="mt-1.5 block text-xs font-medium text-red-600">{amountError}</span> : null}
                  </label>
                </fieldset>

                <div className="my-6 h-px bg-slate-200" />

                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-blue-600">03</span>
                    <h2 className="text-base font-bold text-slate-950">转账摘要</h2>
                  </div>
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <div className="text-xs font-medium text-slate-500">转账金额</div>
                        <div className="mt-1 text-2xl font-bold text-slate-950">{amountDisplay}</div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-slate-500">预计手续费：<span className="font-semibold text-slate-700">以后端审核为准</span></div>
                        <div className="mt-1 text-slate-500">预计到账：<span className="font-semibold text-slate-700">以后端审核为准</span></div>
                      </div>
                    </div>
                    <p className="mt-3 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-500">当前页面不计算前端手续费，实际费用及最终结果以后端审核为准。</p>
                  </div>
                </div>

                {submitError ? (
                  <div className="mt-4 flex gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    {submitError}
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                  <Button type="button" onClick={onBack} variant="outline" className="rounded-md px-5">
                    取消
                  </Button>
                  <Button
                    type="button"
                    onClick={openConfirmation}
                    disabled={!canSubmit}
                    className="rounded-md bg-blue-600 px-6 hover:bg-blue-700"
                  >
                    提交审核
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </section>

              <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-slate-950">审核说明</h2>
                    <p className="mt-0.5 text-xs text-slate-500">提交前请确认以下信息</p>
                  </div>
                </div>

                <dl className="mt-5 divide-y divide-slate-100 text-sm">
                  <div className="py-3">
                    <dt className="text-xs text-slate-500">当前转出账户</dt>
                    <dd className="mt-1 font-semibold text-slate-950">{selectedAccount.label}</dd>
                  </div>
                  <div className="py-3">
                    <dt className="text-xs text-slate-500">支持币种</dt>
                    <dd className="mt-1 break-words font-semibold leading-6 text-slate-950">{currencyOptions.length ? currencyOptions.join(' / ') : '-'}</dd>
                  </div>
                  <div className="py-3">
                    <dt className="text-xs text-slate-500">提交后的初始状态</dt>
                    <dd className="mt-1"><Badge variant="warning">待审核</Badge></dd>
                  </div>
                </dl>

                <div className="mt-5 border-t border-slate-200 pt-5">
                  <div className="text-xs font-semibold text-slate-700">处理流程</div>
                  <div className="mt-4 space-y-4">
                    {[
                      ['1', '提交申请'],
                      ['2', '后台审核'],
                      ['3', '完成或拒绝'],
                    ].map(([step, label], index) => (
                      <div key={step} className="relative flex items-center gap-3">
                        {index < 2 ? <span className="absolute left-[11px] top-6 h-5 w-px bg-slate-200" /> : null}
                        <span className="relative inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">{step}</span>
                        <span className="text-sm font-medium text-slate-700">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex gap-2.5 rounded-lg bg-slate-50 px-3 py-3 text-xs leading-5 text-slate-600">
                  <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  当前页面不预先展示资金冻结；实际资金处理遵循现有后台审核逻辑。
                </div>
              </aside>
            </div>
          </>
        )}
      </main>

      {confirmOpen && recipient ? (
        <UserTransferConfirmModal
          recipient={recipient}
          account={selectedAccount}
          currency={effectiveCurrency}
          amountDisplay={amountDisplay}
          isSubmitting={isSubmitting}
          onClose={() => {
            if (!isSubmitting) setConfirmOpen(false)
          }}
          onConfirm={confirmSubmit}
        />
      ) : null}
    </div>
  )
}

function InternalTransferPage({
  direction,
  initialTransferMode = 'fiat',
  defaultBrokerageSourceAccountId = '',
  onBack,
  onSubmit,
  onViewRecords,
  brokerageAccounts = [],
  accountCurrencyConfigs = initialAccountCurrencyConfigs,
  includeSingaporeAccount = false,
  includeBahrainAccount = false,
}) {
  const [transferMode, setTransferMode] = useState(initialTransferMode)
  const [currency, setCurrency] = useState('USD')
  const [sourceAccountId, setSourceAccountId] = useState(initialTransferMode === 'brokerage' ? defaultBrokerageSourceAccountId : 'hk')
  const [targetAccountId, setTargetAccountId] = useState(direction === 'us-to-trust' ? 'hk' : 'us')
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [error, setError] = useState('')
  const [confirmDraft, setConfirmDraft] = useState(null)
  const configuredFiatAccounts = useMemo(() => internalTransferFiatAccounts
    .filter((account) => {
      if (account.id === 'sg') return includeSingaporeAccount
      if (account.id === 'bh') return includeBahrainAccount
      return true
    })
    .map((account) => ({
      ...account,
      currencies: getConfiguredTransferCurrencies(accountCurrencyConfigs, account.name, account.currencies),
    })), [accountCurrencyConfigs, includeBahrainAccount, includeSingaporeAccount])
  const transferBrokerageAccounts = (includeSingaporeAccount || includeBahrainAccount) && brokerageAccounts.length === 0
    ? defaultInternalTransferBrokerageAccounts
    : brokerageAccounts
  const normalizedBrokerageAccounts = useMemo(() => transferBrokerageAccounts.map((account) => ({
    id: account.id,
    kind: 'brokerage',
    name: account.label || account.brokerName || account.accountName || '券商账户',
    helper: account.accountNumber ? `账户号码：${account.accountNumber}` : account.accountName,
    currencies: [...new Set([
      ...(account.currencies?.length ? account.currencies : ['USD', 'HKD', 'CNY']),
      ...getConfiguredTransferCurrencies(
        accountCurrencyConfigs,
        mapBrokerNameToAccountCurrencyType(account.brokerName || account.label || account.accountName),
        []
      ),
    ])],
    balance: account.balance || {
      USD: 'USD 0.00',
      HKD: 'HKD 0.00',
      CNY: 'CNY 0.00',
    },
  })), [transferBrokerageAccounts, accountCurrencyConfigs])
  const hasBrokerageAccounts = normalizedBrokerageAccounts.length > 0
  const brokerageTransferAccounts = useMemo(() => [
    ...configuredFiatAccounts,
    ...normalizedBrokerageAccounts,
  ], [configuredFiatAccounts, normalizedBrokerageAccounts])
  const selectedRawSourceAccount = brokerageTransferAccounts.find((account) => account.id === sourceAccountId)
  const selectedRawTargetAccount = brokerageTransferAccounts.find((account) => account.id === targetAccountId)
  const allBrokerageTransferCurrencies = [...new Set(brokerageTransferAccounts.flatMap((account) => account.currencies))]
  const oppositeCurrencyOptions = selectedRawSourceAccount
    ? [...new Set(brokerageTransferAccounts
        .filter((account) => account.kind !== selectedRawSourceAccount.kind)
        .flatMap((account) => account.currencies))]
    : allBrokerageTransferCurrencies
  const brokerageCurrencyOptions = (selectedRawSourceAccount?.currencies || selectedRawTargetAccount?.currencies || allBrokerageTransferCurrencies)
    .filter((currencyCode) => oppositeCurrencyOptions.includes(currencyCode))
  const effectiveBrokerageCurrency = brokerageCurrencyOptions.includes(currency) ? currency : brokerageCurrencyOptions[0] || 'USD'
  const selectedRawFiatSourceAccount = configuredFiatAccounts.find((account) => account.id === sourceAccountId) || configuredFiatAccounts[0]
  const fiatOppositeCurrencyOptions = selectedRawFiatSourceAccount
    ? [...new Set(configuredFiatAccounts
        .filter((account) => account.id !== selectedRawFiatSourceAccount.id)
        .flatMap((account) => account.currencies))]
    : [...new Set(configuredFiatAccounts.flatMap((account) => account.currencies))]
  const fiatCurrencyOptions = (selectedRawFiatSourceAccount?.currencies || ['USD'])
    .filter((currencyCode) => fiatOppositeCurrencyOptions.includes(currencyCode))
  const effectiveFiatCurrency = fiatCurrencyOptions.includes(currency) ? currency : fiatCurrencyOptions[0] || 'USD'
  const activeCurrency = transferMode === 'brokerage' ? effectiveBrokerageCurrency : effectiveFiatCurrency
  const numericAmount = Number(amount)
  const hasValidAmount = Number.isFinite(numericAmount) && numericAmount > 0
  const arrivalAmountDisplay = formatCurrencyAmount(activeCurrency, hasValidAmount ? numericAmount : 0)
  const brokerageSourceOptions = brokerageTransferAccounts.filter((account) => account.currencies.includes(activeCurrency))
  const brokerageSourceAccount = brokerageSourceOptions.find((account) => account.id === sourceAccountId) || (sourceAccountId ? brokerageSourceOptions[0] : null)
  const brokerageTargetOptions = brokerageTransferAccounts.filter((account) => (
    account.currencies.includes(activeCurrency)
    && account.id !== brokerageSourceAccount?.id
    && account.kind !== brokerageSourceAccount?.kind
  ))
  const brokerageTargetAccount = brokerageTargetOptions.find((account) => account.id === targetAccountId) || (brokerageSourceAccount ? brokerageTargetOptions[0] : null)
  const fiatSourceOptions = configuredFiatAccounts.filter((account) => account.currencies.includes(activeCurrency))
  const fiatSourceAccount = fiatSourceOptions.find((account) => account.id === sourceAccountId) || fiatSourceOptions[0]
  const fiatTargetOptions = configuredFiatAccounts.filter((account) => (
    account.currencies.includes(activeCurrency)
    && account.id !== fiatSourceAccount?.id
  ))
  const fiatTargetAccount = fiatTargetOptions.find((account) => account.id === targetAccountId) || (fiatSourceAccount ? fiatTargetOptions[0] : null)

  const switchMode = (nextMode) => {
    setTransferMode(nextMode)
    if (nextMode === 'brokerage') {
      setSourceAccountId('hk')
      setTargetAccountId(normalizedBrokerageAccounts[0]?.id || '')
    } else {
      setSourceAccountId(direction === 'us-to-trust' ? 'us' : 'hk')
      setTargetAccountId(direction === 'us-to-trust' ? 'hk' : 'us')
    }
    setError('')
    setConfirmDraft(null)
  }

  const submitTransfer = () => {
    const numericAmount = Number(amount)
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('请输入大于 0 的转账金额。')
      return
    }

    if (transferMode === 'brokerage') {
      if (!brokerageSourceAccount || !brokerageTargetAccount) {
        setError('当前币种下没有可用的付款账户或收款账户。')
        return
      }
      if (!brokerageSourceAccount.currencies.includes(activeCurrency) || !brokerageTargetAccount.currencies.includes(activeCurrency)) {
        setError('付款账户与收款账户必须支持相同币种。')
        return
      }
      if (!purpose.trim()) {
        setError('请填写转账用途。')
        return
      }
    } else {
      if (!fiatSourceAccount || !fiatTargetAccount) {
        setError('当前币种下没有可用的转出账户或转入账户。')
        return
      }
      if (fiatSourceAccount.id === fiatTargetAccount.id) {
        setError('转出账户和转入账户不能相同。')
        return
      }
      if (!fiatSourceAccount.currencies.includes(activeCurrency) || !fiatTargetAccount.currencies.includes(activeCurrency)) {
        setError('转出账户与转入账户必须支持相同币种。')
        return
      }
    }

    const sourceAccount = transferMode === 'brokerage' ? brokerageSourceAccount.name : fiatSourceAccount.name
    const targetAccount = transferMode === 'brokerage' ? brokerageTargetAccount.name : fiatTargetAccount.name

    setError('')
    setConfirmDraft({
      direction: transferMode === 'brokerage'
        ? brokerageSourceAccount.kind === 'brokerage' ? 'brokerage-to-fiat' : 'fiat-to-brokerage'
        : `${fiatSourceAccount.id}-to-${fiatTargetAccount.id}`,
      transferMode,
      sourceAccount,
      targetAccount,
      currency: activeCurrency,
      amount: numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      arrivalAmountDisplay,
      actualArrivalAmountDisplay: arrivalAmountDisplay,
      purpose: transferMode === 'brokerage' ? purpose.trim() : '-',
      type: transferMode === 'brokerage' ? '券商账户转账' : '资金互转',
    })
  }

  const confirmTransfer = () => {
    onSubmit({
      ...confirmDraft,
      id: `IT-${Date.now()}`,
      transactionType: 'internal_transfer',
      type: confirmDraft.type || '资金互转',
      customerName: 'Wanyara Wan',
      customerId: '154',
      customerEmail: 'xr3kes66@123mails.org',
      actualArrivalAmount: confirmDraft.amount,
      transferPurpose: confirmDraft.purpose,
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
          <Badge variant="secondary">{transferMode === 'brokerage' ? '券商账户转账' : '内部法币转账'}</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{transferMode === 'brokerage' ? '券商账户资金互转' : '账户资金互转'}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">当前为前端原型流程。提交后生成待后台审核记录，实际余额和审核结果以后台处理为准。</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.72fr_0.28fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
              <button
                type="button"
                onClick={() => switchMode('fiat')}
                className={transferMode === 'fiat' ? 'rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm' : 'rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-white'}
              >
                法币账户互转
              </button>
              {hasBrokerageAccounts ? (
                <button
                  type="button"
                  onClick={() => switchMode('brokerage')}
                  className={transferMode === 'brokerage' ? 'rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm' : 'rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-white'}
                >
                  券商账户转账
                </button>
              ) : null}
            </div>

            {transferMode === 'fiat' ? (
              <div className="grid items-start gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <label className="block">
                    <span className="text-sm font-semibold text-blue-700">付款账户</span>
                    <select
                      value={fiatSourceAccount?.id || ''}
                      onChange={(event) => {
                        const nextSourceId = event.target.value
                        const nextTargetAccount = configuredFiatAccounts.find((account) => (
                          account.id !== nextSourceId
                          && account.currencies.includes(activeCurrency)
                        ))
                        setSourceAccountId(nextSourceId)
                        setTargetAccountId(nextTargetAccount?.id || '')
                        if (nextSourceId === 'us') setCurrency('USD')
                        setError('')
                      }}
                      className="mt-2 h-11 w-full rounded-xl border border-blue-100 bg-white px-3 text-sm font-semibold text-slate-900 outline-none"
                    >
                      {fiatSourceOptions.map((account) => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                      ))}
                    </select>
                  </label>
                  <div className="mt-3 text-sm text-slate-500">{fiatSourceAccount?.helper || '当前币种下暂无可用付款账户'}</div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">参考余额：{getInternalTransferBalance(fiatSourceAccount, activeCurrency)}</div>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                  <label className="block">
                    <span className="text-sm font-semibold text-emerald-700">收款账户</span>
                    <select
                      value={fiatTargetAccount?.id || ''}
                      onChange={(event) => {
                        setTargetAccountId(event.target.value)
                        if (event.target.value === 'us') setCurrency('USD')
                        setError('')
                      }}
                      className="mt-2 h-11 w-full rounded-xl border border-emerald-100 bg-white px-3 text-sm font-semibold text-slate-900 outline-none"
                    >
                      {fiatTargetOptions.map((account) => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                      ))}
                    </select>
                  </label>
                  <div className="mt-3 text-sm text-slate-500">{fiatTargetAccount?.helper || '当前币种下暂无可用收款账户'}</div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">参考余额：{getInternalTransferBalance(fiatTargetAccount, activeCurrency)}</div>
                </div>
              </div>
            ) : (
              <div className="grid gap-5">
                <div className="grid items-start gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                    <label className="block">
                      <span className="text-sm font-semibold text-blue-700">付款账户</span>
                      <select
                        value={brokerageSourceAccount?.id || ''}
                        onChange={(event) => {
                          const nextSourceId = event.target.value
                          const nextSourceAccount = brokerageTransferAccounts.find((account) => account.id === nextSourceId)
                          setSourceAccountId(nextSourceId)
                          setTargetAccountId(nextSourceId ? nextSourceAccount?.kind === 'brokerage' ? 'hk' : normalizedBrokerageAccounts[0]?.id || '' : '')
                          if (nextSourceId === 'us') setCurrency('USD')
                        }}
                        className="mt-2 h-11 w-full rounded-xl border border-blue-100 bg-white px-3 text-sm font-semibold text-slate-900 outline-none"
                      >
                        <option value="">请选择转出账户</option>
                        {brokerageSourceOptions.map((account) => (
                          <option key={account.id} value={account.id}>{account.name}</option>
                        ))}
                      </select>
                    </label>
                    <div className="mt-3 text-sm text-slate-500">{brokerageSourceAccount?.helper || '当前币种下暂无可用付款账户'}</div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">参考余额：{getInternalTransferBalance(brokerageSourceAccount, activeCurrency)}</div>
                  </div>
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                    <label className="block">
                      <span className="text-sm font-semibold text-emerald-700">收款账户</span>
                      <select
                        value={brokerageTargetAccount?.id || ''}
                        onChange={(event) => {
                          setTargetAccountId(event.target.value)
                          if (event.target.value === 'us') setCurrency('USD')
                        }}
                        className="mt-2 h-11 w-full rounded-xl border border-emerald-100 bg-white px-3 text-sm font-semibold text-slate-900 outline-none"
                      >
                        <option value="">请选择转入账户</option>
                        {brokerageTargetOptions.map((account) => (
                          <option key={account.id} value={account.id}>{account.name}</option>
                        ))}
                      </select>
                    </label>
                    <div className="mt-3 text-sm text-slate-500">{brokerageTargetAccount?.helper || '当前币种下暂无可用收款账户'}</div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">参考余额：{getInternalTransferBalance(brokerageTargetAccount, activeCurrency)}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-5">
              {transferMode === 'fiat' ? (
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">币种</span>
                  <select
                    value={activeCurrency}
                    onChange={(event) => {
                      setCurrency(event.target.value)
                      setError('')
                    }}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  >
                    {fiatCurrencyOptions.map((option) => (
                      <option key={option} value={option}>{formatTransferCurrencyLabel(option)}</option>
                    ))}
                  </select>
                  <div className="mt-2 text-xs leading-5 text-slate-500">法币账户互转仅展示转出与转入账户共同启用的币种。</div>
                </label>
              ) : (
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">币种</span>
                  <select
                    value={activeCurrency}
                    onChange={(event) => {
                      setCurrency(event.target.value)
                      setError('')
                    }}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  >
                    {brokerageCurrencyOptions.map((option) => (
                      <option key={option} value={option}>{formatTransferCurrencyLabel(option)}</option>
                    ))}
                  </select>
                  <div className="mt-2 text-xs leading-5 text-slate-500">币种来自账户币种配置，仅允许同币种转账。</div>
                </label>
              )}
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
              {transferMode === 'brokerage' ? (
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">转账用途</span>
                  <input
                    value={purpose}
                    onChange={(event) => setPurpose(event.target.value)}
                    placeholder="例如：证券交易资金调拨"
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  />
                </label>
              ) : null}
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-emerald-900">预估到账金额</div>
                  <p className="mt-1 text-sm text-emerald-700">资金互转不收取手续费，实际到账以后台审核结果为准。</p>
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
              {hasBrokerageAccounts ? <div className="rounded-xl bg-white/70 p-3">券商账户：仅展示已开户账户</div> : null}
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

function InternalTransferDetailPage({ record, onBack }) {
  const statusMeta = getInternalTransferStatusMeta(record)
  const currency = record.currency || record.transferCurrency
  const amount = stripCurrencyPrefix(currency, record.amount || record.transferAmount)
  const actualArrivalAmount = stripCurrencyPrefix(
    currency,
    record.actualArrivalAmount || record.actualArrivalAmountDisplay || record.arrivalAmountDisplay || record.estimatedArrival || record.amount,
  )
  const customer = record.customer || {
    name: record.customerName,
    id: record.customerId,
    email: record.customerEmail,
  }

  return (
    <TransactionDetailDrawer
      title="资金互转详情"
      subtitle="INTERNAL TRANSFER DETAIL"
      headerIcon={RefreshCw}
      statusTone={statusMeta.statusTone}
      amountTone="neutral"
      statusLabel={statusMeta.label}
      amount={amount}
      currency={currency}
      customer={customer}
      businessRows={[
        { label: '交易类型', value: record.type || '资金互转', strong: true },
        { label: '转出账户', value: record.sourceAccount || record.fromAccount },
        { label: '转入账户', value: record.targetAccount || record.toAccount },
        { label: '币种', value: currency },
        { label: '转账金额', value: formatTransferDetailCurrencyAmount(currency, amount) },
        { label: '实际到账金额', value: formatTransferDetailCurrencyAmount(currency, actualArrivalAmount) },
        ...(record.transferPurpose && record.transferPurpose !== '-' ? [{ label: '转账用途', value: record.transferPurpose }] : []),
      ]}
      instructionRows={[
        { label: '申请编号', value: record.requestId || record.id, strong: true },
        { label: '提交时间', value: record.submittedAt || record.createdAt },
        { label: '完成时间', value: record.completedAt },
      ]}
      description={statusMeta.description}
      onBack={onBack}
    />
  )
}

function InternalTransferRecordsPage({ records, onBack, onCreate }) {
  const [selectedRecord, setSelectedRecord] = useState(null)

  if (selectedRecord) {
    return <InternalTransferDetailPage record={selectedRecord} onBack={() => setSelectedRecord(null)} />
  }

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
          <p className="mt-2 text-sm leading-6 text-slate-500">客户提交账户间法币转账申请后，金额会先冻结并扣减转出账户可用余额，后台审核通过后再入账到转入账户。</p>
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
              <table className="w-full min-w-[1120px] text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
                  <tr>
                    {['申请编号', '转出账户', '转入账户', '币种', '转账金额', '状态', '提交时间', '操作'].map((item) => (
                      <th key={item} className="px-6 py-4">{item}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => {
                    const statusMeta = getInternalTransferStatusMeta(record)
                    return (
                      <tr key={record.id} className="border-t border-slate-100">
                        <td className="px-6 py-5 font-semibold text-slate-900">{record.id}</td>
                        <td className="px-6 py-5">{record.sourceAccount}</td>
                        <td className="px-6 py-5">{record.targetAccount}</td>
                        <td className="px-6 py-5">{record.currency}</td>
                        <td className="px-6 py-5 font-semibold">{record.currency} {record.amount}</td>
                        <td className="px-6 py-5"><Badge variant={statusMeta.badge}>{statusMeta.label}</Badge></td>
                        <td className="px-6 py-5 text-slate-500">{record.createdAt}</td>
                        <td className="px-6 py-5">
                          <Button type="button" onClick={() => setSelectedRecord(record)} variant="outline" size="sm" className="rounded-lg">
                            详情
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export function BaasOpeningPrototype({
  onBack,
  onOpenApplication,
  onPrototypeHome,
  initialStatus = 'not_opened',
  IncomingFiatDepositComponent = IncomingFiatDepositPrototype,
  prototypeLabel = 'BaaS 原型',
  showGuidanceMarks = true,
  forceInternalTransferMark = false,
  enableUserTransfer = false,
  forceUserTransferMark = false,
  investmentMenu = [],
  brokerageAccounts = [],
  brokerageAccountCards = [],
  hideBrokerageAccountEntry = false,
  accountCurrencyConfigs = initialAccountCurrencyConfigs,
  onOpenBrokerageService,
  enableSingaporeOpening = false,
  enableBahrainOpening = false,
  jurisdictionAccountConfigs = {},
  initialJurisdictionStatuses,
  onJurisdictionStatusesChange,
  demoStatusAccount,
  demoStatusAccounts,
  topNavActiveLabel = '账户',
  onTopNavSelect,
  topNavClickableLabels = [],
  onUserTransferSubmitted,
}) {
  const [status, setStatus] = useState(initialStatus)
  const [jurisdictionStatuses, setJurisdictionStatuses] = useState(() => ({
    us: initialStatus,
    singapore: enableSingaporeOpening ? (initialStatus === 'failed' ? 'reviewing' : initialStatus) : 'not_opened',
    bahrain: 'not_opened',
    ...initialJurisdictionStatuses,
  }))
  const [activeAccount, setActiveAccount] = useState('trust')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [feeBalanceMode, setFeeBalanceMode] = useState('sufficient')
  const [balanceWarningOpen, setBalanceWarningOpen] = useState(false)
  const [pendingOpeningVariant, setPendingOpeningVariant] = useState('us')
  const [singaporeReapplyOpen, setSingaporeReapplyOpen] = useState(false)
  const [accountInfoOpen, setAccountInfoOpen] = useState(false)
  const [activeOpenedPage, setActiveOpenedPage] = useState('account')
  const [internalTransferDirection, setInternalTransferDirection] = useState('trust-to-us')
  const [internalTransferMode, setInternalTransferMode] = useState('fiat')
  const [defaultBrokerageSourceAccountId, setDefaultBrokerageSourceAccountId] = useState('')
  const [internalTransferRecords, setInternalTransferRecords] = useState([])
  const [fiatTransferOutRecords, setFiatTransferOutRecords] = useState([])
  const [selectedBrokerageDetailId, setSelectedBrokerageDetailId] = useState('')
  const normalizedBrokerageCards = useMemo(
    () => normalizeBrokerageAccountCards(brokerageAccountCards),
    [brokerageAccountCards]
  )
  const bahrainAccountConfig = jurisdictionAccountConfigs.bahrain || {}
  const brokerageSummary = getBrokerageSummary(normalizedBrokerageCards)
  const showBrokerageTab = !hideBrokerageAccountEntry
    && status === 'opened'
    && (Boolean(onOpenBrokerageService) || brokerageSummary.hasAnyActivity)
  const showSingaporeAccount = enableSingaporeOpening && jurisdictionStatuses.singapore === 'opened'
  const showBahrainAccount = enableBahrainOpening && jurisdictionStatuses.bahrain === 'opened'
  const demoStatusTargets = demoStatusAccounts?.length
    ? demoStatusAccounts
    : demoStatusAccount
      ? [demoStatusAccount]
      : []
  const demoStatus = demoStatusTargets.length ? (jurisdictionStatuses[demoStatusTargets[0]] || 'not_opened') : status

  const updateJurisdictionStatuses = (updater) => {
    setJurisdictionStatuses((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater
      onJurisdictionStatusesChange?.(next)
      return next
    })
  }

  const changeStatus = (nextStatus) => {
    if (demoStatusTargets.length) {
      updateJurisdictionStatuses((current) => {
        const next = { ...current }
        demoStatusTargets.forEach((accountId) => {
          next[accountId] = nextStatus
        })
        return next
      })
      if (demoStatusTargets.includes('us')) {
        setStatus(nextStatus)
      }
      setActiveAccount('trust')
      setActiveOpenedPage('account')
      return
    }

    setStatus(nextStatus)
    updateJurisdictionStatuses((current) => ({ ...current, us: nextStatus }))
    setActiveAccount('trust')
    setActiveOpenedPage('account')
  }

  const selectOpeningAccount = (variant) => {
    const jurisdictionId = variant === 'singapore' || variant === 'bahrain' ? variant : 'us'
    setPendingOpeningVariant(variant)
    setPickerOpen(false)
    if (jurisdictionId === 'bahrain') {
      setActiveOpenedPage('bahrain-application')
      return
    }
    setActiveOpenedPage('account')
    if (feeBalanceMode === 'insufficient') {
      setBalanceWarningOpen(true)
      return
    }
    updateJurisdictionStatuses((current) => ({ ...current, [jurisdictionId]: 'reviewing' }))
    if (onOpenApplication) {
      onOpenApplication(variant)
      return
    }
    changeStatus('reviewing')
  }

  const selectUsAccount = () => {
    selectOpeningAccount('us')
  }

  const selectSingaporeAccount = () => {
    selectOpeningAccount('singapore')
  }

  const selectBahrainAccount = () => {
    selectOpeningAccount('bahrain')
  }

  const confirmSingaporeReapply = () => {
    setSingaporeReapplyOpen(false)
    selectSingaporeAccount()
  }

  const confirmBahrainApplication = () => {
    updateJurisdictionStatuses((current) => ({ ...current, bahrain: 'reviewing' }))
    setActiveOpenedPage('jurisdiction-list')
  }

  const changeJurisdictionStatus = (accountId, nextStatus) => {
    updateJurisdictionStatuses((current) => ({ ...current, [accountId]: nextStatus }))
    if (accountId === 'us') {
      setStatus(nextStatus)
    }
  }

  const topNavProps = {
    investmentMenu,
    activeNavLabel: topNavActiveLabel,
    onNavSelect: onTopNavSelect,
    clickableNavLabels: topNavClickableLabels,
  }

  const openInternalTransfer = (direction, options = {}) => {
    setInternalTransferDirection(direction)
    setInternalTransferMode(options.transferMode || 'fiat')
    setDefaultBrokerageSourceAccountId(options.defaultBrokerageSourceAccountId || '')
    setActiveOpenedPage('internal-transfer')
  }

  const openBrokerageTransfer = (card) => {
    openInternalTransfer('trust-to-us', {
      transferMode: 'brokerage',
      defaultBrokerageSourceAccountId: card.transferAccountId,
    })
  }

  const openBrokerageDetail = (brokerId) => {
    setSelectedBrokerageDetailId(brokerId)
  }

  const openUserTransfer = () => {
    setActiveOpenedPage('user-transfer')
  }

  const submitInternalTransfer = (record) => {
    setInternalTransferRecords((current) => [record, ...current])
    setActiveOpenedPage('internal-transfer-records')
  }

  const submitFiatTransferOut = (record) => {
    setFiatTransferOutRecords((current) => [record, ...current])
  }

  if (status === 'opened' && activeOpenedPage === 'external-fiat-transfer-in') {
    return (
      <IncomingFiatDepositComponent
        onBack={() => setActiveOpenedPage('account')}
        includeSingaporeAccount={showSingaporeAccount}
        includeBahrainAccount={showBahrainAccount}
      />
    )
  }

  if (status === 'opened' && activeOpenedPage === 'external-fiat-transfer-out') {
    return (
      <ExternalFiatTransferOutPage
        onBack={() => setActiveOpenedPage('account')}
        records={fiatTransferOutRecords}
        onSubmit={submitFiatTransferOut}
        topNavProps={topNavProps}
        showGuidanceMarks={showGuidanceMarks}
        includeSingaporeAccount={showSingaporeAccount}
        includeBahrainAccount={showBahrainAccount}
      />
    )
  }

  if (activeOpenedPage === 'internal-transfer') {
    return (
      <InternalTransferPage
        direction={internalTransferDirection}
        initialTransferMode={internalTransferMode}
        defaultBrokerageSourceAccountId={defaultBrokerageSourceAccountId}
        onBack={() => setActiveOpenedPage('account')}
        onSubmit={submitInternalTransfer}
        onViewRecords={() => setActiveOpenedPage('internal-transfer-records')}
        brokerageAccounts={brokerageAccounts}
        accountCurrencyConfigs={accountCurrencyConfigs}
        includeSingaporeAccount={showSingaporeAccount}
        includeBahrainAccount={showBahrainAccount}
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

  if (status === 'opened' && activeOpenedPage === 'user-transfer') {
    return (
      <UserTransferPage
        onBack={() => setActiveOpenedPage('account')}
        topNavProps={topNavProps}
        onTransferSubmitted={onUserTransferSubmitted}
        accountOptions={userTransferAccountOptions.filter((account) => {
          if (account.id === 'hk') return true
          if (account.id === 'us') return status === 'opened'
          if (account.id === 'sg') return showSingaporeAccount
          if (account.id === 'bh') return showBahrainAccount
          return false
        })}
      />
    )
  }

  if (activeOpenedPage === 'bahrain-application') {
    return (
      <BahrainAccountApplicationPage
        config={bahrainAccountConfig}
        status={jurisdictionStatuses.bahrain || 'not_opened'}
        balanceMode={feeBalanceMode}
        onBalanceModeChange={setFeeBalanceMode}
        onBack={() => setActiveOpenedPage('jurisdiction-list')}
        onSubmit={confirmBahrainApplication}
        topNavProps={topNavProps}
      />
    )
  }

  if (activeOpenedPage === 'jurisdiction-list') {
    return (
      <JurisdictionAccountsPage
        onBack={() => setActiveOpenedPage('account')}
        topNavProps={topNavProps}
        balanceMode={feeBalanceMode}
        onBalanceModeChange={setFeeBalanceMode}
        onSelectUs={selectUsAccount}
        onSelectSingapore={selectSingaporeAccount}
        onSelectBahrain={selectBahrainAccount}
        onReapplySingapore={() => {
          setActiveOpenedPage('account')
          setSingaporeReapplyOpen(true)
        }}
        accountStatuses={jurisdictionStatuses}
        onAccountStatusChange={changeJurisdictionStatus}
        enableSingaporeOpening={enableSingaporeOpening}
        enableBahrainOpening={enableBahrainOpening}
        jurisdictionAccountConfigs={jurisdictionAccountConfigs}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <DemoBar
        status={demoStatus}
        onStatusChange={changeStatus}
        onPrototypeHome={onPrototypeHome}
        prototypeLabel={prototypeLabel}
      />
      <ClientTopNav onBack={onBack} {...topNavProps} />
      <AccountHero
        status={status}
        activeAccount={activeAccount}
        onAccountChange={setActiveAccount}
        onOpenJurisdiction={() => setActiveOpenedPage('jurisdiction-list')}
        onOpenIncomingDeposit={() => setActiveOpenedPage('external-fiat-transfer-in')}
        onOpenFiatTransferOut={() => setActiveOpenedPage('external-fiat-transfer-out')}
        brokerageAccountCards={normalizedBrokerageCards}
        showBrokerageTab={showBrokerageTab}
        showGuidanceMarks={showGuidanceMarks}
      />
      <QuickActionDock
        status={status}
        activeAccount={activeAccount}
        brokerageAccountCards={normalizedBrokerageCards}
        onOpenAccountInfo={() => setAccountInfoOpen(true)}
        onOpenBrokerageDetail={openBrokerageDetail}
        onOpenIncomingDeposit={() => setActiveOpenedPage('external-fiat-transfer-in')}
        onOpenFiatTransferOut={() => setActiveOpenedPage('external-fiat-transfer-out')}
        onOpenInternalTransfer={openInternalTransfer}
        onOpenUserTransfer={openUserTransfer}
        showGuidanceMarks={showGuidanceMarks}
        forceInternalTransferMark={forceInternalTransferMark}
        enableUserTransfer={enableUserTransfer}
        forceUserTransferMark={forceUserTransferMark}
      />
      <main className="mx-auto max-w-[1280px] px-5 py-8">
        <MainContent
          status={status}
          activeAccount={activeAccount}
          brokerageAccountCards={normalizedBrokerageCards}
          onOpenBrokerageTransfer={openBrokerageTransfer}
          onOpenBrokerageDetail={openBrokerageDetail}
          onOpenBrokerageService={onOpenBrokerageService}
          showSingaporeAccount={showSingaporeAccount}
          showBahrainAccount={showBahrainAccount}
          bahrainAccountConfig={bahrainAccountConfig}
        />
      </main>
      {pickerOpen ? (
        <JurisdictionPicker
          balanceMode={feeBalanceMode}
          onBalanceModeChange={setFeeBalanceMode}
          onClose={() => setPickerOpen(false)}
          onSelectUs={selectUsAccount}
          onSelectSingapore={selectSingaporeAccount}
          onSelectBahrain={selectBahrainAccount}
          onReapplySingapore={() => {
            setPickerOpen(false)
            setSingaporeReapplyOpen(true)
          }}
          accountStatuses={jurisdictionStatuses}
          onAccountStatusChange={changeJurisdictionStatus}
          enableSingaporeOpening={enableSingaporeOpening}
          enableBahrainOpening={enableBahrainOpening}
          jurisdictionAccountConfigs={jurisdictionAccountConfigs}
        />
      ) : null}
      {balanceWarningOpen ? <InsufficientBalanceModal onClose={() => setBalanceWarningOpen(false)} openingAccountVariant={pendingOpeningVariant} /> : null}
      {singaporeReapplyOpen ? (
        <SingaporeReapplyModal
          onClose={() => setSingaporeReapplyOpen(false)}
          onConfirm={confirmSingaporeReapply}
        />
      ) : null}
      {accountInfoOpen ? <AccountInfoDrawer onClose={() => setAccountInfoOpen(false)} /> : null}
      {selectedBrokerageDetailId ? (
        <BrokerageAccountDetailDrawer
          card={(() => {
            const detailCard = normalizedBrokerageCards.find((card) => card.brokerId === selectedBrokerageDetailId)
            return status === 'opened' && detailCard
              ? { ...detailCard, status: 'opened', statusLabel: brokerageStatusMeta.opened.label }
              : detailCard
          })()}
          onClose={() => setSelectedBrokerageDetailId('')}
        />
      ) : null}
    </div>
  )
}
