import {
  Banknote,
  Building2,
  Check,
  CircleAlert,
  CircleHelp,
  Copy,
  FileText,
  Globe2,
  Landmark,
  Languages,
  LayoutDashboard,
  Mail,
  RefreshCw,
  Send,
  Sun,
  UserRound,
  WalletCards,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

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
    currencies: ['USD'],
    balance: {
      USD: 'USD 82,430.27',
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

const trustUserTransferCurrencies = [
  { value: 'HKD', label: 'HKD 港币' },
  { value: 'USD', label: 'USD 美元' },
  { value: 'CNY', label: 'CNY 人民币' },
  { value: 'EUR', label: 'EUR 欧元' },
  { value: 'SGD', label: 'SGD 新币' },
]

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

function DemoBar({ status, onStatusChange, onPrototypeHome, prototypeLabel = 'BaaS 原型' }) {
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
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export function ClientTopNav({ onBack, activeNavLabel = '账户', investmentMenu = [] }) {
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
                <button key={label} type="button" className={className}>
                  <Icon className="h-4 w-4" />
                  {label}
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
                : '连接您的全球银行账户，无缝管理您的信托投资组合和分配。'}
          </p>
          <div className="mt-5 grid gap-3 text-sm text-blue-50 sm:grid-cols-2">
            {(showBrokerageAccount
              ? ['券商账户管理', '券商资金互转', '资产分布', '账户详情']
              : showUsAccount
                ? ['银行收款账户', '同币种交易', '账户信息', '账户状态']
                : activeAccount === 'digital'
                  ? ['USDT', 'ETH', 'BTC']
                  : ['财富管理', '法币转出', '信托账单']).map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-sky-300" />
                {item}
              </div>
            ))}
          </div>
          {!showBrokerageAccount && !hasUsAccount ? (
            <button
              type="button"
              onClick={onOpenJurisdiction}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-sky-500 px-5 text-sm font-semibold text-white shadow-sm hover:bg-sky-400"
            >
              <Globe2 className="h-4 w-4" />
              {showGuidanceMarks ? <ClickMark /> : null}
              开设其他法域账户
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

function JurisdictionPicker({ balanceMode, onBalanceModeChange, onClose, onSelectUs }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[520px] rounded-3xl bg-white p-6 shadow-2xl">
        <ModalHeader eyebrow="Open jurisdiction account" title="选择开通账户" onClose={onClose} />
        <p className="mt-2 text-sm leading-6 text-slate-500">开设美国账户需扣除 USD 500 开户费，提交资料并确认扣费后等待审核。</p>
        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <div className="text-xs font-semibold text-blue-700">仅原型演示使用：选择美国账户后接口余额判断</div>
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

function InsufficientBalanceModal({ onClose }) {
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
            当前可用余额低于 USD 500 开户费
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

function MainContent({
  status,
  activeAccount,
  brokerageAccountCards = [],
  onOpenBrokerageTransfer,
  onOpenBrokerageDetail,
  onOpenBrokerageService,
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

  return <AssetDistribution status={status} />
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

function AssetDistribution({ status }) {
  const usMeta = usStatusMeta[status]
  const showUsCard = status !== 'not_opened'
  const usOpened = status === 'opened'
  const usStatusInfo = [
    ...(status === 'failed' ? [['拒绝原因', usMeta.reason, 'danger']] : []),
  ]

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">资产分布</h3>
          <p className="mt-1 text-sm text-slate-500">信托账户下的香港账户 / 美国账户分类</p>
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

function ExternalFiatTransferOutPage({ onBack, records, onSubmit, topNavProps, showGuidanceMarks = true }) {
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
    if (nextType === 'us') {
      setCurrency('USD')
    }
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
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-slate-900">选择账户</span>
            {[
              ['hk', '香港账户'],
              ['us', '美国账户'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => changeAccountType(value)}
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
                    {accountType === 'us' ? (
                      <span className="flex w-24 items-center border-r border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-950">USD</span>
                    ) : (
                      <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="w-24 border-r border-slate-200 bg-white px-4 text-sm font-bold outline-none">
                        <option value="USD">USD</option>
                        <option value="HKD">HKD</option>
                      </select>
                    )}
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

function UserTransferPage({ onBack, topNavProps }) {
  const [email, setEmail] = useState('')
  const [currency, setCurrency] = useState('HKD')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [submittedRecord, setSubmittedRecord] = useState(null)
  const numericAmount = Number(amount)
  const hasValidAmount = Number.isFinite(numericAmount) && numericAmount > 0
  const amountDisplay = formatCurrencyAmount(currency, hasValidAmount ? numericAmount : 0)

  const submit = () => {
    if (!email.trim()) {
      setError('请输入收款用户邮箱。')
      return
    }
    if (!currency) {
      setError('请选择币种。')
      return
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('请输入大于 0 的转账金额。')
      return
    }

    setError('')
    setSubmittedRecord({
      id: `UT-${Date.now()}`,
      email: email.trim(),
      currency,
      amount: numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      statusLabel: '待审核',
      createdAt: formatTransferTime(),
    })
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <ClientTopNav onBack={onBack} {...topNavProps} />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
            返回账户
          </button>
          <Badge variant="warning">待后台审核</Badge>
        </div>
      </header>
      <main className="mx-auto max-w-[1180px] px-5 py-8">
        <div className="mb-6">
          <Badge variant="secondary">Trust user transfer</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">转账给其他用户</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">用于信托用户之间的同平台转账。当前为前端原型，提交后生成本地待审核记录。</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.68fr_0.32fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">收款用户邮箱</span>
                <div className="mt-2 flex h-12 items-center rounded-xl border border-slate-200 bg-white px-3 focus-within:border-blue-500">
                  <Mail className="mr-2 h-4 w-4 text-blue-500" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="请输入收款用户邮箱"
                    className="min-w-0 flex-1 text-sm font-semibold text-slate-900 outline-none"
                  />
                </div>
              </label>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">币种</span>
                  <select
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  >
                    {trustUserTransferCurrencies.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
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
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  />
                </label>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-emerald-900">预计转账金额</div>
                    <p className="mt-1 text-sm text-emerald-700">当前原型不计算手续费，实际处理以后端审核结果为准。</p>
                  </div>
                  <div className="text-2xl font-bold text-emerald-950">{amountDisplay}</div>
                </div>
              </div>

              {error ? <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}

              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                <Button type="button" onClick={submit} className="rounded-lg bg-blue-600 px-6 hover:bg-blue-700">
                  提交审核
                </Button>
                <Button type="button" onClick={onBack} variant="outline" className="rounded-lg">
                  取消
                </Button>
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <div className="text-sm font-semibold text-amber-900">审核说明</div>
              <p className="mt-2 text-sm leading-6 text-amber-800">提交后记录进入待审核状态，后台人工处理后客户可查看转账状态。</p>
              <div className="mt-5 space-y-3 text-sm text-amber-900">
                <div className="rounded-xl bg-white/70 p-3">支持币种：HKD / USD / CNY / EUR / SGD</div>
                <div className="rounded-xl bg-white/70 p-3">初始状态：待审核</div>
              </div>
            </section>
            {submittedRecord ? (
              <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                <Badge variant="success">已提交</Badge>
                <h2 className="mt-3 text-lg font-bold text-slate-950">转账申请摘要</h2>
                <div className="mt-4 space-y-3 text-sm">
                  {[
                    ['申请编号', submittedRecord.id],
                    ['收款邮箱', submittedRecord.email],
                    ['转账金额', `${submittedRecord.currency} ${submittedRecord.amount}`],
                    ['状态', submittedRecord.statusLabel],
                    ['提交时间', submittedRecord.createdAt],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-3 last:border-0">
                      <span className="text-slate-500">{label}</span>
                      <span className="text-right font-bold text-slate-950">{value}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </main>
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
}) {
  const [currentDirection, setCurrentDirection] = useState(direction)
  const [transferMode, setTransferMode] = useState(initialTransferMode)
  const [currency, setCurrency] = useState('USD')
  const [sourceAccountId, setSourceAccountId] = useState(initialTransferMode === 'brokerage' ? defaultBrokerageSourceAccountId : 'hk')
  const [targetAccountId, setTargetAccountId] = useState('')
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [error, setError] = useState('')
  const [confirmDraft, setConfirmDraft] = useState(null)
  const config = internalTransferDirections[currentDirection]
  const configuredFiatAccounts = useMemo(() => internalTransferFiatAccounts.map((account) => ({
    ...account,
    currencies: getConfiguredTransferCurrencies(accountCurrencyConfigs, account.name, account.currencies),
  })), [accountCurrencyConfigs])
  const normalizedBrokerageAccounts = useMemo(() => brokerageAccounts.map((account) => ({
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
  })), [brokerageAccounts, accountCurrencyConfigs])
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
  const fiatSourceAccount = configuredFiatAccounts.find((account) => account.name === config.sourceAccount)
  const fiatTargetAccount = configuredFiatAccounts.find((account) => account.name === config.targetAccount)
  const fiatCurrencyOptions = (fiatSourceAccount?.currencies || ['USD'])
    .filter((currencyCode) => (fiatTargetAccount?.currencies || ['USD']).includes(currencyCode))
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

  const switchMode = (nextMode) => {
    setTransferMode(nextMode)
    if (nextMode === 'brokerage') {
      setSourceAccountId('hk')
      setTargetAccountId(normalizedBrokerageAccounts[0]?.id || '')
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
    }

    const sourceAccount = transferMode === 'brokerage' ? brokerageSourceAccount.name : config.sourceAccount
    const targetAccount = transferMode === 'brokerage' ? brokerageTargetAccount.name : config.targetAccount

    setError('')
    setConfirmDraft({
      direction: transferMode === 'brokerage'
        ? brokerageSourceAccount.kind === 'brokerage' ? 'brokerage-to-fiat' : 'fiat-to-brokerage'
        : currentDirection,
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
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{transferMode === 'brokerage' ? '券商账户资金互转' : config.title}</h1>
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
}) {
  const [status, setStatus] = useState(initialStatus)
  const [activeAccount, setActiveAccount] = useState('trust')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [feeBalanceMode, setFeeBalanceMode] = useState('sufficient')
  const [balanceWarningOpen, setBalanceWarningOpen] = useState(false)
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
  const brokerageSummary = getBrokerageSummary(normalizedBrokerageCards)
  const showBrokerageTab = !hideBrokerageAccountEntry
    && status === 'opened'
    && (Boolean(onOpenBrokerageService) || brokerageSummary.hasAnyActivity)

  const changeStatus = (nextStatus) => {
    setStatus(nextStatus)
    setActiveAccount('trust')
    setActiveOpenedPage('account')
  }

  const selectUsAccount = () => {
    setPickerOpen(false)
    if (feeBalanceMode === 'insufficient') {
      setBalanceWarningOpen(true)
      return
    }
    if (onOpenApplication) {
      onOpenApplication()
      return
    }
    changeStatus('reviewing')
  }

  const topNavProps = {
    investmentMenu,
    activeNavLabel: '账户',
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
    return <IncomingFiatDepositComponent onBack={() => setActiveOpenedPage('account')} />
  }

  if (status === 'opened' && activeOpenedPage === 'external-fiat-transfer-out') {
    return (
      <ExternalFiatTransferOutPage
        onBack={() => setActiveOpenedPage('account')}
        records={fiatTransferOutRecords}
        onSubmit={submitFiatTransferOut}
        topNavProps={topNavProps}
        showGuidanceMarks={showGuidanceMarks}
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
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <DemoBar status={status} onStatusChange={changeStatus} onPrototypeHome={onPrototypeHome} prototypeLabel={prototypeLabel} />
      <ClientTopNav onBack={onBack} {...topNavProps} />
      <AccountHero
        status={status}
        activeAccount={activeAccount}
        onAccountChange={setActiveAccount}
        onOpenJurisdiction={() => setPickerOpen(true)}
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
        />
      </main>
      {pickerOpen ? (
        <JurisdictionPicker
          balanceMode={feeBalanceMode}
          onBalanceModeChange={setFeeBalanceMode}
          onClose={() => setPickerOpen(false)}
          onSelectUs={selectUsAccount}
        />
      ) : null}
      {balanceWarningOpen ? <InsufficientBalanceModal onClose={() => setBalanceWarningOpen(false)} /> : null}
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
