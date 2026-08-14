import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  FolderOpen,
  Landmark,
  LineChart,
  ListFilter,
  MousePointerClick,
  Percent,
  Plus,
  ShieldAlert,
  WalletCards,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { CurrencyIcon } from '../components/baas/CurrencyIcon'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { ClientTopNav } from './BaasOpeningPrototype'

const products = [
  {
    id: 'hkd-fixed-30',
    name: '港币',
    subtitle: '港币 30 天定期收益产品',
    currency: 'HKD',
    type: '定期',
    risk: '低风险',
    tags: ['低风险', '港币'],
    annualYield: 5.5,
    minInvestment: 100,
    maxInvestment: 200000,
    lockPeriod: '30天',
    payoutMethod: '到期派息',
    aum: 88000,
    investors: 22,
    description: '30 天锁定期港币定期理财，用于展示到期持仓、每日收益和赎回流程。',
    risks: ['到期赎回规则', '收益率调整风险', '资金到账时效风险'],
  },
  {
    id: 'galaxy-digital-lending',
    name: 'Galaxy Digital Lending',
    subtitle: '面向数字资产持有者的短周期稳健理财',
    currency: 'USD',
    type: '活期',
    risk: '低风险',
    tags: ['低风险', '加密资产'],
    annualYield: 10,
    minInvestment: 1,
    maxInvestment: 50000,
    lockPeriod: '-',
    payoutMethod: '每日派息',
    aum: 128500,
    investors: 28,
    description: '适合希望在保持流动性的同时获取收益的客户，申购资金可来自已开通的多银行账户。',
    risks: ['加密货币价格波动风险', '市场流动性风险', '智能合约安全风险', '监管政策变化风险'],
  },
  {
    id: 'usd-flex-313213',
    name: '313213',
    subtitle: '美元现金管理类产品',
    currency: 'USD',
    type: '活期',
    risk: '低风险',
    tags: ['低风险'],
    annualYield: 0,
    minInvestment: 0,
    maxInvestment: 10000,
    lockPeriod: '-',
    payoutMethod: '每日派息',
    aum: 2100,
    investors: 3,
    description: '用于展示 0 收益率产品在目录、申购和持仓中的状态。',
    risks: ['收益率调整风险', '账户余额不足风险'],
  },
  {
    id: 'usd-fixed-30',
    name: '美元',
    subtitle: '111',
    currency: 'USD',
    type: '定期',
    risk: '低风险',
    tags: ['低风险', '加密资产'],
    annualYield: 5,
    minInvestment: 1,
    maxInvestment: 10000,
    lockPeriod: '30天',
    payoutMethod: '每日派息',
    aum: 2100,
    investors: 3,
    description: '30 天锁定期美元定期理财，适合明确期限和稳定收益目标的客户。',
    risks: ['到期赎回规则', '市场流动性风险', '收益率变更风险', '监管政策变化风险'],
  },
  {
    id: 'gldb-usd-1m',
    name: 'GLDB USD 1-Month Fixed Deposit',
    subtitle: '1-month USD fixed-term deposit with an interest rate floor',
    currency: 'USD',
    type: '定期',
    risk: '低风险',
    tags: ['低风险'],
    annualYield: 3.5,
    minInvestment: 10000,
    maxInvestment: 250000,
    lockPeriod: '30天',
    payoutMethod: '到期派息',
    aum: 74200,
    investors: 11,
    description: '面向大额美元闲置资金的固定期限产品，强调资金期限管理和账户来源校验。',
    risks: ['到期赎回规则', '收益率调整风险', '资金到账时效风险'],
  },
]

const fundingAccounts = [
  {
    id: 'sg-0950',
    name: '新加坡账户',
    number: 'SG-0950',
    owner: 'current-customer',
    status: 'active',
    capabilities: ['wealthPayment', 'wealthSettlement'],
    supportedCurrencies: ['USD', 'HKD'],
    receivableCurrencies: ['USD', 'HKD'],
    balances: { USD: 50000, HKD: 50000 },
    canReceive: true,
  },
  {
    id: 'hk-1234',
    name: '香港账户',
    number: 'HK-1234',
    owner: 'current-customer',
    status: 'active',
    capabilities: ['wealthPayment', 'wealthSettlement'],
    supportedCurrencies: ['USD', 'HKD'],
    receivableCurrencies: ['USD', 'HKD'],
    balances: { USD: 20000, HKD: 20000 },
    canReceive: true,
  },
  {
    id: 'us-5678',
    name: '美国账户',
    number: 'US-5678',
    owner: 'current-customer',
    status: 'active',
    capabilities: ['wealthPayment', 'wealthSettlement'],
    supportedCurrencies: ['USD'],
    receivableCurrencies: ['USD'],
    balances: { USD: 20000 },
    canReceive: true,
  },
  {
    id: 'bh-0950',
    name: '巴林账户',
    number: 'BH-0950',
    owner: 'current-customer',
    status: 'active',
    capabilities: ['wealthPayment', 'wealthSettlement'],
    supportedCurrencies: ['USD'],
    receivableCurrencies: ['USD'],
    balances: { USD: 500 },
    canReceive: true,
  },
]

const initialOrders = [
  {
    id: 'INV-20260512-4d343f2b',
    displayId: '22',
    redeemId: '67',
    holdingId: 'holding-hkd-fixed-30',
    productId: 'hkd-fixed-30',
    productName: '港币',
    accountName: '新加坡账户 · ••••0950',
    paymentAccountId: 'sg-0950',
    paymentAccountLabel: '新加坡账户 · ••••0950',
    paymentCurrency: 'HKD',
    fee: 0.19,
    actualDebit: 199.19,
    subscriptionType: '首次认购',
    amount: 199,
    currentValue: 199.92,
    currency: 'HKD',
    type: '申购',
    status: '已到期',
    date: '2026-05-12',
    time: '10:20:00',
    term: '2026-05-12 至 2026-06-11',
    income: 0.92,
    dailyIncome: 0.02,
    purchaseDate: '2026-05-12',
    maturityDate: '2026-06-11',
  },
  {
    id: 'INV-20260812-db21aa6c',
    holdingId: 'holding-usd-fixed-30',
    productId: 'usd-fixed-30',
    productName: '美元',
    accountName: '香港账户 · ••••1234',
    paymentAccountId: 'hk-1234',
    paymentAccountLabel: '香港账户 · ••••1234',
    paymentCurrency: 'USD',
    fee: 0.38,
    actualDebit: 38.38,
    subscriptionType: '首次认购',
    amount: 38,
    currency: 'USD',
    type: '申购',
    status: '待审核',
    date: '2026-08-12',
    time: '16:35:39',
    term: '-',
    income: 0,
  },
  {
    id: 'INV-20260812-9b34f5a2',
    holdingId: 'holding-usd-fixed-30',
    productId: 'usd-fixed-30',
    productName: '美元',
    accountName: '美国账户 · ••••5678',
    paymentAccountId: 'us-5678',
    paymentAccountLabel: '美国账户 · ••••5678',
    paymentCurrency: 'USD',
    fee: 0.01,
    actualDebit: 1.01,
    subscriptionType: '追加认购',
    amount: 1,
    currency: 'USD',
    type: '申购',
    status: '持有中',
    date: '2026-08-12',
    time: '14:31:12',
    term: '2026-08-12 至 2026-09-11',
    income: 0,
  },
]

const redemptionHistoryOrders = [
  {
    id: 'RED-20260611-00067',
    redeemId: '67',
    productName: '港币',
    type: '赎回',
    status: '已通过',
    date: '2026-06-11',
    time: '14:45:10',
    currency: 'HKD',
    redemptionAmount: 199.92,
    fee: 0.19,
    actualReceipt: 199.73,
    paymentAccountId: 'sg-0950',
    paymentAccountLabel: '新加坡账户 · ••••0950',
    returnCurrency: 'HKD',
  },
  {
    id: 'RED-20260812-00031',
    redeemId: '31',
    productName: 'GLDB USD 1-Month Fixed Deposit',
    type: '赎回',
    status: '待审核',
    date: '2026-08-12',
    time: '17:20:08',
    currency: 'USD',
    redemptionAmount: 10320,
    fee: 20,
    actualReceipt: 10300,
    paymentAccountId: 'sg-0950',
    paymentAccountLabel: '新加坡账户 · ••••0950',
    returnCurrency: 'USD',
  },
  {
    id: 'RED-20260809-00023',
    redeemId: '23',
    productName: 'GLDB USD 1-Month Fixed Deposit',
    type: '赎回',
    status: '已通过',
    date: '2026-08-09',
    time: '11:28:12',
    completedDate: '2026-08-09',
    currency: 'USD',
    redemptionAmount: 10320,
    fee: 20,
    actualReceipt: 10300,
    paymentAccountId: 'us-5678',
    paymentAccountLabel: '美国账户 · ••••5678',
    returnCurrency: 'USD',
  },
  {
    id: 'RED-20260810-00024',
    redeemId: '24',
    productName: '美元',
    type: '赎回',
    status: '已拒绝',
    date: '2026-08-10',
    time: '09:37:22',
    currency: 'USD',
    redemptionAmount: 120,
    fee: 0,
    actualReceipt: 120,
    paymentAccountId: 'us-5678',
    paymentAccountLabel: '美国账户 · ••••5678',
    returnCurrency: 'USD',
    rejectReason: '赎回审核未通过，资金未入账。',
  },
]

const fundTabs = ['概览', '产品目录', '我的投资', '交易历史']

function ClickHint({ className = 'text-blue-500' }) {
  return <MousePointerClick className={`h-3.5 w-3.5 ${className}`} />
}

function formatUsd(value) {
  return `${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
}

function formatCurrencyAmount(currency, value) {
  return `${currency} ${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function getAccountLabel(account) {
  return account ? account.name : '-'
}

function getAccountTraceLabel(account) {
  if (!account) return '-'
  return account.name
}

function getAccountDisplayName(accountLabel) {
  if (!accountLabel) return '-'
  return String(accountLabel).split('·')[0].trim() || String(accountLabel)
}

function getOrderPaymentAccountName(order) {
  return getAccountDisplayName(order.paymentAccountLabel || order.accountName)
}

function getAccountBalance(account, currency) {
  return Number(account?.balances?.[currency] || 0)
}

function findAccount(accountId) {
  return fundingAccounts.find((account) => account.id === accountId)
}

function canUseForPayment(account, currency) {
  return account?.owner === 'current-customer'
    && account.status === 'active'
    && account.capabilities.includes('wealthPayment')
    && account.supportedCurrencies.includes(currency)
}

function getPaymentAccounts(currency) {
  return fundingAccounts.filter((account) => canUseForPayment(account, currency))
}

function getSubscriptionFee(amount) {
  return Math.round(Number(amount || 0) * 0.01 * 100) / 100
}

function getOrderFee(order) {
  return Number(order?.fee ?? getSubscriptionFee(order?.amount))
}

function getOrderDebit(order) {
  return Number(order?.actualDebit ?? Number(order?.amount || 0) + getOrderFee(order))
}

function getRedemptionAmount(order) {
  return Number(order?.redemptionAmount ?? order?.redeemAmount ?? order?.amount ?? 0)
}

function getRedemptionFee(order) {
  return Number(order?.fee ?? 0)
}

function getRedemptionActualReceipt(order) {
  return Number(order?.actualReceipt ?? Math.max(getRedemptionAmount(order) - getRedemptionFee(order), 0))
}

function getRedemptionReturnAccountName(order) {
  const account = findAccount(order.paymentAccountId)
  return getAccountDisplayName(order.paymentAccountLabel || (account ? getAccountTraceLabel(account) : order.accountName))
}

function getClientRedemptionStatus(status) {
  if (status === '待审核') return '审核中'
  if (status === '已通过') return '已完成'
  return status
}

function getHistoryDisplayStatus(order) {
  return order.type === '赎回' ? getClientRedemptionStatus(order.status) : order.status
}

function getHistoryAmountMeta(order) {
  if (order.type === '赎回') {
    const settled = order.status === '已通过'
    const amount = settled ? getRedemptionActualReceipt(order) : getRedemptionAmount(order)
    return {
      text: `${settled ? '+' : ''}${amount.toFixed(2)} ${order.currency}`,
      className: settled ? 'text-emerald-600' : order.status === '已拒绝' ? 'text-slate-500' : 'text-slate-700',
    }
  }

  return {
    text: `-${Number(order.amount || 0).toFixed(2)} ${order.currency}`,
    className: 'text-red-600',
  }
}

function getHistoryStatusVariant(status) {
  if (status === '已通过' || status === '已完成' || status === '持有中') return 'success'
  if (status === '已拒绝') return 'danger'
  return 'warning'
}

function getDailyYield(product, amount) {
  return (Number(amount || 0) * Number(product?.annualYield || 0)) / 100 / 365
}

function getHoldingId(order) {
  return order?.holdingId || `holding-${order?.productId || 'unknown'}`
}

function getHoldingStatus(orders) {
  if (orders.some((order) => order.status === '已到期')) return '已到期'
  if (orders.some((order) => order.status === '持有中')) return '持有中'
  return orders[0]?.status || '待审核'
}

function buildHoldings(orders) {
  const groups = orders.reduce((map, order) => {
    const holdingId = getHoldingId(order)
    const next = map.get(holdingId) || []
    next.push(order)
    map.set(holdingId, next)
    return map
  }, new Map())

  return Array.from(groups.entries()).map(([holdingId, holdingOrders]) => {
    const sortedOrders = [...holdingOrders].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    const firstOrder = sortedOrders[0]
    const product = getOrderProduct(firstOrder)
    return {
      id: holdingId,
      product,
      productId: firstOrder.productId,
      productName: firstOrder.productName,
      currency: firstOrder.currency,
      displayId: firstOrder.displayId || firstOrder.id.slice(-2),
      orders: sortedOrders,
      amount: sortedOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0),
      currentValue: sortedOrders.reduce((sum, order) => sum + getOrderValue(order), 0),
      income: sortedOrders.reduce((sum, order) => sum + Number(order.income || 0), 0),
      status: getHoldingStatus(sortedOrders),
    }
  })
}

const accountModelBusinessRules = [
  '0. 页面中的黄色高亮仅用于原型演示本次新增/调整字段，正式开发不要按黄色底样式落地。',
  '1. 付款账户为认购订单级，每笔首次认购或追加认购都独立记录实际付款账户。',
  '2. 赎回资金固定返回该笔认购订单记录的原付款账户。',
  '3. 赎回阶段不提供结算账户、回款账户或其他到账账户选择。',
  '4. 不同认购订单可以来自不同付款账户，每次只能选择一个付款账户，不支持拼余额。',
  '5. 同一持仓下不同到期订单按各自认购订单的原付款账户分别回款。',
  '6. 固定期限理财到期后才显示赎回按钮，不支持提前赎回。',
  '7. 认购失败、取消或后台拒绝时，资金必须原路退回该笔认购实际付款账户。',
  '8. 赎回审核通过后，FIDERE 内部账本将实际到账金额入账至原付款账户。',
  '9. 若原付款账户不可入账，客户端或运营侧应拦截/拒绝本次赎回，不改入其他账户。',
  '10. 资金链需追溯：原付款账户 → 认购订单 → 到期赎回订单 → 原付款账户入账流水。',
]

const subscribeBusinessRules = [
  '付款账户读取系统通用账户能力：当前客户本人、账户激活、支持理财付款、支持当前产品投资币种。',
  '不针对香港、新加坡、美国、巴林账户写死逻辑；后续新增账户类型只配置账户能力。',
  '手续费采用外扣，投资本金与手续费从本次选择的付款账户扣除。',
  '认购阶段只记录付款账户；产品到期赎回时资金返回该笔订单原付款账户。',
  '客户勾选服务条款与风险披露时，需要留存客户 ID、订单 ID、条款版本、风险披露版本、确认时间与电子确认结果。',
  ...accountModelBusinessRules,
]

const holdingsBusinessRules = accountModelBusinessRules

const redeemBusinessRules = [
  '固定期限理财到期后才显示赎回按钮，不设计提前赎回流程。',
  '赎回资金返回本笔认购订单的原付款账户，不允许客户重新选择结算/回款账户。',
  '确认赎回前仅展示原付款账户、赎回金额、手续费和实际到账金额。',
  '点击确认赎回后进入 2FA 或安全密钥验证，验证通过后正式生成赎回申请。',
  '客户端需防重复点击；服务端需做请求幂等、订单状态校验和重复入账校验。',
  '管理端审核不通过时客户重新发起赎回，不在客户端提供改账户入口。',
  ...accountModelBusinessRules,
]

const arrivalAccountRules = [
  '赎回回款固定返回本笔订单原付款账户。',
  '客户无需也不能选择其他到账账户。',
  '提交前系统校验原付款账户是否可正常入账。',
  '原付款账户不可用时，不生成赎回申请或由运营拒绝处理。',
]

function BusinessRulesPanel({ rules, title = '业务规则' }) {
  return (
    <aside className="h-fit rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-sm shadow-sm">
      <div className="flex items-center gap-2 font-semibold text-amber-900">
        <ShieldAlert className="h-4 w-4" />
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-xs leading-5 text-amber-900/85">
        {rules.map((rule) => (
          <li key={rule} className="rounded-lg bg-white/60 p-2">{rule}</li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-5 text-amber-800">此区域为原型业务注释，不属于客户端实际展示内容。</p>
    </aside>
  )
}

function AccountSelectionModal({ title, accounts, currency, selectedAccountId, onSelect, onClose, rules, helperText }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 px-4 py-8">
      <section className="w-full max-w-[820px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{helperText || `仅展示可接收 ${currency} 的有效账户`}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={`关闭${title}`} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-3">
            {accounts.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => onSelect(account.id)}
                className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors ${
                  selectedAccountId === account.id ? 'border-blue-500 bg-blue-50/70' : 'border-slate-200 bg-white hover:border-blue-200'
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Landmark className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-slate-900">{getAccountLabel(account)}</span>
                  <span className="mt-1 block text-sm text-slate-500">{currency}</span>
                </span>
                {selectedAccountId === account.id ? <CheckCircle2 className="h-5 w-5 text-blue-600" /> : <ClickHint />}
              </button>
            ))}
          </div>
          <BusinessRulesPanel rules={rules || arrivalAccountRules} />
        </div>
      </section>
    </div>
  )
}

function FundBadgeGroup({ product }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge className="border-blue-100 bg-blue-50 text-blue-700">{product.type}</Badge>
      {product.tags.map((tag) => (
        <Badge key={tag} variant={tag === '低风险' ? 'success' : 'secondary'}>{tag}</Badge>
      ))}
    </div>
  )
}

function FundProductCard({ product, onDetail, onSubscribe }) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <CurrencyIcon currency={product.currency} className="h-9 w-9" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold text-slate-900">{product.name}</h3>
              <Badge>{product.type}</Badge>
            </div>
            <p className="mt-1 line-clamp-1 text-xs text-slate-500">{product.subtitle}</p>
          </div>
        </div>

        <div className="mt-7">
          <p className="text-xs text-slate-500">当前年化收益率</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl font-semibold tracking-normal text-[#18bd00]">{product.annualYield.toFixed(2)}%</span>
            <Badge variant="success">{product.risk}</Badge>
          </div>
        </div>

        <dl className="mt-7 grid grid-cols-2 gap-5 text-sm">
          <div>
            <dt className="text-xs text-slate-500">最低投资</dt>
            <dd className="mt-2 font-semibold text-slate-800">{product.currency} {product.minInvestment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">锁定期</dt>
            <dd className="mt-2 font-semibold text-slate-800">{product.lockPeriod}</dd>
          </div>
        </dl>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3">
        <button type="button" onClick={() => onDetail(product)} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800">
          产品介绍 <ArrowUpRight className="h-4 w-4" />
        </button>
        <Button type="button" size="sm" onClick={() => onSubscribe(product)} className="rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          <ClickHint className="text-white/90" /> 申购
        </Button>
      </div>
    </article>
  )
}

function SecondaryTabs({ activeTab, onChange }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {fundTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`h-10 rounded-lg px-4 text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <span className="inline-flex items-center gap-1">
              {tab}
              <ClickHint className={activeTab === tab ? 'text-white/85' : 'text-blue-500'} />
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

function OverviewPage({ orders, onTabChange, onDetail, onSubscribe }) {
  const activeOrders = orders.filter((order) => order.status === '持有中')
  const totalValue = activeOrders.reduce((sum, order) => sum + order.amount, 0)
  const averageYield = activeOrders.length
    ? activeOrders.reduce((sum, order) => {
      const product = products.find((item) => item.id === order.productId)
      return sum + (product?.annualYield || 0)
    }, 0) / activeOrders.length
    : 5

  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <WalletCards className="h-6 w-6" />
            </span>
            <div>
              <p className="text-base font-semibold text-slate-900">总资产价值</p>
              <p className="mt-1 text-sm text-slate-500">您的投资组合总价值</p>
            </div>
          </div>
          <div className="mt-7 text-4xl font-semibold tracking-normal text-slate-900">{(totalValue || 1).toFixed(2)}</div>
          <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
            <LineChart className="h-4 w-4" />
            0.00 (0.00)
          </p>
          <div className="mt-6 grid gap-5 border-t border-slate-200 pt-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">年初至今回报</p>
              <p className="mt-2 text-xl font-semibold text-[#18bd00]">0.00</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">平均年化</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{averageYield.toFixed(2)}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">快速操作</h2>
          <div className="mt-4 space-y-3">
            {[
              ['申购产品', Plus, '产品目录'],
              ['查看投资组合', FileText, '我的投资'],
              ['探索产品', BarChart3, '产品目录'],
            ].map(([label, Icon, tab]) => (
              <button
                key={label}
                type="button"
                onClick={() => onTabChange(tab)}
                className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left text-sm font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex-1">{label}</span>
                <ArrowRight className="h-4 w-4 text-blue-500" />
              </button>
            ))}
          </div>
        </section>
      </div>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">推荐产品</h2>
          <p className="mt-1 text-sm text-slate-500">探索符合您投资目标的理财产品</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {products.map((product) => (
            <FundProductCard key={product.id} product={product} onDetail={onDetail} onSubscribe={onSubscribe} />
          ))}
        </div>
      </section>
    </div>
  )
}

function CatalogPage({ onDetail, onSubscribe }) {
  const [typeFilter, setTypeFilter] = useState('全部资金类型')
  const visibleProducts = products.filter((product) => (
    typeFilter === '全部资金类型' || product.type === typeFilter
  ))

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">产品目录</h1>
          <p className="mt-1 text-sm text-slate-500">探索我们全面的理财产品</p>
        </div>
        <p className="text-sm text-slate-500">显示 {visibleProducts.length} 个产品，共 {products.length} 个产品</p>
      </div>

      <label className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm">
        <ListFilter className="h-4 w-4 text-slate-400" />
        <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="bg-transparent outline-none">
          <option>全部资金类型</option>
          <option>活期</option>
          <option>定期</option>
        </select>
      </label>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {visibleProducts.map((product) => (
          <FundProductCard key={product.id} product={product} onDetail={onDetail} onSubscribe={onSubscribe} />
        ))}
      </div>
    </section>
  )
}

function DetailPage({ product, onBack, onSubscribe }) {
  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
        <ArrowDownLeft className="h-4 w-4" /> 返回产品列表
      </button>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row">
          <div className="flex items-start gap-4">
            <CurrencyIcon currency={product.currency} className="h-16 w-16" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold text-slate-900">{product.name}</h1>
                <FundBadgeGroup product={product} />
              </div>
              <p className="mt-2 text-sm text-slate-500">{product.subtitle}</p>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">{product.description}</p>
            </div>
          </div>
          <div className="text-left lg:text-right">
            <p className="text-xs text-slate-500">当前年化收益率</p>
            <p className="mt-2 text-4xl font-semibold tracking-normal text-[#18bd00]">{product.annualYield.toFixed(2)}%</p>
            <Badge variant="success" className="mt-3">稳定收益</Badge>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-4">
          <section className="grid gap-4 sm:grid-cols-4">
            {[
              ['管理规模', formatUsd(product.aum), FolderOpen, 'bg-emerald-50 text-emerald-600'],
              ['投资人数', product.investors, WalletCards, 'bg-blue-50 text-blue-600'],
              ['锁定期', product.lockPeriod, CalendarDays, 'bg-amber-50 text-amber-600'],
              ['派息方式', product.payoutMethod, Percent, 'bg-fuchsia-50 text-fuchsia-600'],
            ].map(([label, value, Icon, tone]) => (
              <article key={label} className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-lg ${tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
              </article>
            ))}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex gap-2 border-b border-slate-100 pb-4">
              <Button type="button" size="sm" className="rounded-lg bg-blue-600 text-white hover:bg-blue-700">产品概览</Button>
              <Button type="button" size="sm" variant="ghost" className="rounded-lg">详细信息</Button>
              <Button type="button" size="sm" variant="ghost" className="rounded-lg">历史收益</Button>
            </div>
            <p className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              {product.description}
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <ShieldAlert className="h-5 w-5 text-amber-500" /> 风险提示
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {product.risks.map((risk) => (
                <div key={risk} className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50/50 p-3 text-sm text-slate-700">
                  <ShieldAlert className="h-4 w-4 text-amber-500" />
                  {risk}
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm">
          <div className="bg-blue-600 p-5 text-white">
            <h2 className="text-xl font-semibold">快速认购</h2>
            <p className="mt-1 text-sm text-blue-100">确认您的投资信息</p>
          </div>
          <dl className="space-y-3 p-5 text-sm">
            {[
              ['当前年化收益率', `${product.annualYield.toFixed(2)}%`],
              ['锁定期', product.lockPeriod],
              ['最低投资', `${product.currency} ${product.minInvestment.toFixed(2)}`],
              ['最高投资', `${product.currency} ${product.maxInvestment.toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
              ['派息方式', product.payoutMethod],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <dt className="text-slate-500">{label}</dt>
                <dd className="font-semibold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="px-5 pb-5">
            <Button type="button" onClick={() => onSubscribe(product)} className="h-11 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              立即认购
            </Button>
            <p className="mt-3 text-center text-xs text-slate-500">投资有风险，请仔细阅读产品说明</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function SubscribePage({
  product,
  onBack,
  onSubmit,
  mode = 'initial',
  holdingId,
}) {
  const paymentAccounts = getPaymentAccounts(product.currency)
  const [amount, setAmount] = useState(product.minInvestment ? String(Math.max(product.minInvestment, 1000)) : '1000')
  const [accountId, setAccountId] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const selectedAccount = findAccount(accountId)
  const numericAmount = Number(amount)
  const validAmount = Number.isFinite(numericAmount) && numericAmount >= product.minInvestment && numericAmount <= product.maxInvestment
  const fee = getSubscriptionFee(numericAmount)
  const actualDebit = Number(numericAmount || 0) + fee
  const hasBalance = selectedAccount && getAccountBalance(selectedAccount, product.currency) >= actualDebit
  const canSubmit = validAmount && hasBalance && agreed && selectedAccount && !submitting
  const dailyYield = getDailyYield(product, numericAmount)
  const isAdditional = mode === 'additional'

  const changePaymentAccount = (nextAccountId) => {
    setAccountId(nextAccountId)
  }

  const submit = () => {
    if (!canSubmit) return
    setSubmitting(true)
    window.setTimeout(() => {
      onSubmit({
        product,
        accountId: selectedAccount.id,
        accountName: getAccountLabel(selectedAccount),
        paymentAccountLabel: getAccountLabel(selectedAccount),
        paymentCurrency: product.currency,
        holdingId,
        amount: numericAmount,
        fee,
        actualDebit,
        subscriptionType: isAdditional ? '追加认购' : '首次认购',
      })
    }, 450)
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-4">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
          <ArrowDownLeft className="h-4 w-4" /> 返回产品
        </button>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <button type="button" className="flex w-full items-center justify-between text-left">
            <span className="flex items-center gap-3">
              <CurrencyIcon currency={product.currency} className="h-10 w-10" />
              <span>
                <span className="block text-lg font-semibold text-slate-900">{product.name}</span>
                <span className="mt-1 flex gap-2"><FundBadgeGroup product={product} /></span>
              </span>
            </span>
            <Badge className="border-blue-100 bg-blue-50 text-blue-700">{isAdditional ? '追加认购' : '首次认购'}</Badge>
          </button>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Percent className="h-5 w-5" />
            </span>
            <h2 className="text-base font-semibold text-slate-900">选择投资金额</h2>
          </div>
          <label className="mt-5 block text-sm text-slate-500">自定义金额</label>
          <div className="mt-2 flex h-12 items-center rounded-lg border border-slate-300 bg-white px-4 focus-within:border-blue-500">
            <span className="text-slate-500">$</span>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value.replace(/[^\d.]/g, ''))}
              className="min-w-0 flex-1 bg-transparent px-2 text-lg outline-none"
            />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{product.currency}</span>
          </div>
          <p className={`mt-3 text-sm ${validAmount ? 'text-slate-500' : 'text-red-600'}`}>
            最低投资 {formatCurrencyAmount(product.currency, product.minInvestment)}，最高投资 {formatCurrencyAmount(product.currency, product.maxInvestment)}
          </p>
        </section>

        <section className="rounded-xl border border-amber-300 bg-amber-50 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <WalletCards className="h-5 w-5" />
            </span>
            <h2 className="text-base font-semibold text-slate-900">选择付款账户</h2>
          </div>
          <div className="mt-5 space-y-3">
            {paymentAccounts.map((account) => {
              const balance = getAccountBalance(account, product.currency)
              const insufficient = balance < actualDebit
              return (
                <label
                  key={account.id}
                  className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                    insufficient
                      ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-70'
                      : accountId === account.id
                        ? 'cursor-pointer border-blue-500 bg-blue-50/40'
                        : 'cursor-pointer border-slate-200 bg-white hover:border-blue-200'
                  }`}
                >
                  <input
                    type="radio"
                    checked={accountId === account.id}
                    disabled={insufficient}
                    onChange={() => changePaymentAccount(account.id)}
                    className="h-4 w-4 accent-blue-600 disabled:accent-slate-300"
                  />
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Landmark className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-900">{getAccountLabel(account)}</span>
                    <span className="mt-1 block text-sm text-slate-500">{product.currency}</span>
                    <span className="mt-1 block text-sm text-slate-500">可用余额：{formatCurrencyAmount(product.currency, balance)}</span>
                  </span>
                  {insufficient ? <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">余额不足</span> : null}
                </label>
              )
            })}
          </div>
          {!selectedAccount ? <p className="mt-3 text-sm font-semibold text-blue-600">请选择一个付款账户后继续。</p> : null}
          {selectedAccount && !hasBalance ? <p className="mt-3 text-sm font-semibold text-red-600">当前付款账户余额不足，请切换账户或降低投资金额。</p> : null}
        </section>

        <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-0.5 h-4 w-4 accent-teal-600" />
          <span>
            我已阅读并同意
            <button type="button" className="mx-1 font-semibold text-blue-600 hover:text-blue-800">《服务条款》</button>
            和
            <button type="button" className="mx-1 font-semibold text-blue-600 hover:text-blue-800">《风险披露声明》</button>
          </span>
        </label>
      </div>

      <aside className="space-y-4">
        <section className="h-fit overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-blue-600 p-5 text-white">
            <h2 className="text-xl font-semibold">投资详情</h2>
            <p className="mt-1 text-sm text-blue-100">确认您的投资信息</p>
          </div>
          <dl className="space-y-4 p-5 text-sm">
            {[
              ['产品名称', product.name],
              ['投资期限', product.lockPeriod],
              ['每日收益', `${dailyYield.toFixed(6)} ${product.currency}`],
              ['日收益率', `${(product.annualYield / 365).toFixed(4)}%`],
              ['付款账户', getAccountLabel(selectedAccount)],
              ['投资金额', formatCurrencyAmount(product.currency, numericAmount)],
              ['手续费', formatCurrencyAmount(product.currency, fee)],
              ['实际扣款', formatCurrencyAmount(product.currency, actualDebit)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0">
                <dt className="text-slate-500">{label}</dt>
                <dd className="text-right font-semibold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="border-t border-slate-200 p-5">
            <div className="mb-4 flex items-center justify-between text-lg font-semibold">
              <span>共</span>
              <span className="text-blue-600">{formatCurrencyAmount(product.currency, actualDebit)}</span>
            </div>
            <Button
              type="button"
              disabled={!canSubmit}
              onClick={submit}
              className="h-11 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? '提交中...' : isAdditional ? '确认追加认购' : '确认并提交'}
            </Button>
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-xs font-semibold text-red-600">投资有风险，请仔细阅读产品说明</p>
          </div>
        </section>
        <BusinessRulesPanel rules={subscribeBusinessRules} />
      </aside>
    </div>
  )
}

function LegacyHoldingsPage({ orders, onDetail, onSubscribe, onTabChange }) {
  return (
    <section>
      <div>
        <h1 className="text-xl font-semibold text-slate-900">当前持仓</h1>
        <p className="mt-1 text-sm text-slate-500">查看您当前的投资产品持仓情况</p>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {orders.map((order) => {
          const product = products.find((item) => item.id === order.productId) || products[0]
          return (
            <div key={order.id} className="border-b border-slate-100 last:border-b-0">
              <div className="grid gap-5 p-5 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto] lg:items-center">
                <div className="flex items-center gap-3">
                  <CurrencyIcon currency={order.currency} className="h-10 w-10" />
                  <div>
                    <h3 className="font-semibold text-slate-900">{order.productName}</h3>
                    <p className="mt-1 text-xs text-slate-500">{product.type} · {getOrderPaymentAccountName(order)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">总投资金额</p>
                  <p className="mt-1 font-semibold text-slate-900">{order.amount} {order.currency}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">当前价值</p>
                  <p className="mt-1 font-semibold text-slate-900">{order.amount} {order.currency}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">累计收益</p>
                  <p className="mt-1 font-semibold text-[#18bd00]">+{order.income} {order.currency}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">当前年化收益率</p>
                  <p className="mt-1 font-semibold text-orange-500">{product.annualYield.toFixed(2)}%</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={order.status === '持有中' ? 'success' : 'warning'}>{order.status}</Badge>
                  <button type="button" onClick={() => onTabChange('交易历史')} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                    <Eye className="h-4 w-4" /> 详情
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3">
                <button type="button" onClick={() => onDetail(product)} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                  <ChevronDown className="h-4 w-4" /> 持仓详情 <ClickHint />
                </button>
                <Button type="button" variant="outline" size="sm" onClick={() => onSubscribe(product)} className="rounded-lg text-blue-600">
                  <Plus className="h-4 w-4" /> 添加认购 <ClickHint />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function getOrderProduct(order) {
  return products.find((item) => item.id === order.productId) || products[0]
}

function getOrderValue(order) {
  return Number(order.currentValue ?? order.amount)
}

function getDailyIncomeRows(order) {
  const start = new Date('2026-06-11T00:00:00')
  return Array.from({ length: 16 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() - index)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return {
      date: `${date.getFullYear()}-${month}-${day}`,
      amount: Number(order.dailyIncome || 0.02),
      currency: order.currency,
    }
  })
}

function DailyIncomeModal({ order, onClose }) {
  if (!order) return null
  const rows = getDailyIncomeRows(order)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8">
      <section className="w-full max-w-[600px] overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-slate-200" />
        <header className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <h2 className="text-xl font-semibold text-slate-900">每日收益</h2>
          <button type="button" onClick={onClose} aria-label="关闭每日收益" className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="px-4 pb-3 pt-3">
          <div className="max-h-[400px] overflow-y-auto rounded-md border border-slate-200 bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="sticky top-0 bg-white text-slate-600">
                <tr>
                  <th className="px-3 py-3 font-medium">日期</th>
                  <th className="px-3 py-3 text-right font-medium">当日收益</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.date} className="border-t border-slate-200">
                    <td className="px-3 py-3 font-medium text-slate-700">{row.date}</td>
                    <td className="px-3 py-3 text-right font-semibold text-[#18bd00]">{row.amount.toFixed(2)} {row.currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-center gap-5 py-4 text-sm text-slate-600">
            <ChevronLeft className="h-4 w-4 text-slate-400" />
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-semibold text-white">1</span>
            <span className="font-medium">2</span>
            <ChevronRight className="h-4 w-4 text-slate-700" />
          </div>
        </div>
      </section>
    </div>
  )
}

function RedeemModal({ order, onClose, onConfirm }) {
  const [submitting, setSubmitting] = useState(false)
  const fee = Math.max(getOrderValue(order) * 0.001, 0.19)
  const actualReceipt = Math.max(getOrderValue(order) - fee, 0)
  const paymentAccount = findAccount(order.paymentAccountId)
  const returnAccount = getAccountDisplayName(order.paymentAccountLabel || getAccountTraceLabel(paymentAccount))
  const handleConfirm = () => {
    setSubmitting(true)
    onConfirm?.({
      paymentAccountId: order.paymentAccountId,
      paymentAccountLabel: returnAccount,
      returnCurrency: order.currency,
      fee,
      actualReceipt,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8">
      <section className="w-full max-w-[600px] overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-slate-200" />
        <header className="flex items-start justify-between px-6 pt-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">确认赎回</h2>
            <p className="mt-2 text-sm text-slate-500">订单 ID: {order.redeemId || order.displayId || order.id}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭赎回确认" className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="px-6 py-4">
          <div className="border border-blue-200 bg-blue-50 px-4 py-3">
            <dl className="space-y-3 text-sm">
              {[
                ['赎回金额', `${getOrderValue(order).toFixed(2)} ${order.currency}`],
                ['手续费', `${fee.toFixed(2)} ${order.currency}`],
                ['实际到账', `${actualReceipt.toFixed(2)} ${order.currency}`],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className={`font-semibold ${label === '实际到账' ? 'text-blue-700' : 'text-slate-900'}`}>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 rounded-lg border border-blue-100 bg-white/70 px-3 py-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">原付款账户</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {returnAccount} / {order.currency}
                  </p>
                </div>
                <Badge className="border-blue-100 bg-blue-50 text-blue-700">自动返回</Badge>
              </div>
              <p className="mt-2 text-xs text-slate-500">本金及收益扣除手续费后，将原路返回该笔认购订单的原付款账户。</p>
            </div>
          </div>
          <p className="mt-4 flex items-start gap-2 border-b border-slate-200 pb-5 text-sm leading-6 text-slate-500">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            点击确认后将进入安全验证，验证通过后执行赎回。
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Button type="button" variant="outline" onClick={onClose} className="h-10 rounded-lg border-blue-600 text-blue-600">
              取消
            </Button>
            <Button
              type="button"
              disabled={submitting}
              onClick={handleConfirm}
              className="h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? '提交中...' : '确认赎回'}
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}

function HoldingDetailPanel({ holding, onDailyIncome, onRedeem }) {
  return (
    <div className="border-t border-slate-200 bg-slate-50">
      <div className="overflow-x-auto">
        <table className="min-w-[1280px] w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs font-medium text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="px-6 py-3">订单编号</th>
              <th className="px-6 py-3 text-amber-800">付款账户</th>
              <th className="px-6 py-3">投资金额</th>
              <th className="px-6 py-3">认购类型</th>
              <th className="px-6 py-3">购买日期</th>
              <th className="px-6 py-3">投资期限</th>
              <th className="px-6 py-3">累计收益</th>
              <th className="px-6 py-3">状态</th>
              <th className="px-6 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="bg-slate-50">
            {holding.orders.map((order) => (
              <tr key={order.id} className="border-b border-slate-200">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-700">{order.displayId || '1'}</div>
                  <div className="mt-1 font-mono text-xs text-blue-600">{order.id}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-md border border-amber-300 bg-amber-100 px-2 py-1 font-semibold text-amber-900">{getOrderPaymentAccountName(order)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{order.amount} {order.currency}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">{order.subscriptionType || order.type}</td>
                <td className="px-6 py-4 text-slate-600">{order.purchaseDate || order.date}</td>
                <td className="px-6 py-4 text-slate-600">{order.maturityDate || order.term}</td>
                <td className="px-6 py-4 font-semibold text-[#18bd00]">{Number(order.income || 0).toFixed(2)} {order.currency}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex min-w-[130px] justify-center rounded-full bg-sky-50 px-4 py-1 text-sm font-semibold text-blue-600">
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-6 whitespace-nowrap">
                    <button type="button" onClick={() => onDailyIncome(order)} className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800">
                      <LineChart className="h-4 w-4" /> 查看每日收益 <ClickHint />
                    </button>
                    {order.status === '已到期' ? (
                      <button type="button" onClick={() => onRedeem(order)} className="inline-flex items-center gap-1 font-semibold text-red-500 hover:text-red-600">
                        <ArrowUpRight className="h-4 w-4" /> 赎回 <ClickHint className="text-red-400" />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 bg-white px-6 py-3 text-xs text-slate-500">
        <span>订单数：{holding.orders.length}</span>
        <span>每笔订单独立记录付款账户；到期赎回资金返回对应订单原付款账户。</span>
      </div>
    </div>
  )
}

function HoldingProductDetailPage({ holding, onBack, onSubscribe }) {
  if (!holding?.product) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">持仓详情暂不可用</h1>
        <p className="mt-2 text-sm text-slate-500">请返回我的投资后重新选择持仓详情。</p>
        <Button type="button" onClick={onBack} className="mt-5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          返回我的投资
        </Button>
      </section>
    )
  }

  const product = holding.product
  const flowSteps = ['选择投资金额', '确认投资期限', '选择付款账户', '完成身份验证', '确认投资订单', '开始计息获取收益']

  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
        <ChevronLeft className="h-4 w-4" /> 返回产品列表
      </button>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <CurrencyIcon currency={holding.currency} className="h-16 w-16" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold text-slate-900">{holding.productName}</h1>
                <Badge className="border-blue-100 bg-blue-50 text-blue-700">{product.type}</Badge>
                <Badge variant="success">{product.risk}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-500">持仓 ID {holding.displayId}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant={tag === '低风险' ? 'success' : 'secondary'}>{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="text-left lg:text-right">
            <p className="text-xs text-slate-500">当前年化收益率</p>
            <p className="mt-2 text-4xl font-semibold tracking-normal text-[#18bd00]">{product.annualYield.toFixed(2)}%</p>
            <Badge variant="success" className="mt-3">稳定收益</Badge>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        {[
          ['管理规模', formatCurrencyAmount(product.currency, product.aum), FolderOpen, 'bg-emerald-50 text-emerald-600'],
          ['投资人数', product.investors, WalletCards, 'bg-blue-50 text-blue-600'],
          ['锁定期', product.lockPeriod, CalendarDays, 'bg-amber-50 text-amber-600'],
          ['派息方式', product.payoutMethod, Percent, 'bg-fuchsia-50 text-fuchsia-600'],
        ].map(([label, value, Icon, tone]) => (
          <article key={label} className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-lg ${tone}`}>
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-4">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex gap-2 border-b border-slate-100 p-3">
              {['产品概览', '详细信息', '历史收益'].map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={`h-10 rounded-lg px-4 text-sm font-semibold ${index === 0 ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <p className="min-h-[110px] p-6 text-center text-sm text-slate-500">{product.description || '暂无概览内容'}</p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <ArrowRight className="h-5 w-5 text-blue-600" /> 投资流程
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              {flowSteps.map((step, index) => (
                <div key={step} className="relative rounded-lg border border-slate-200 bg-white p-3 text-center shadow-sm">
                  <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">{index + 1}</span>
                  <p className="mt-3 text-xs font-semibold text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <ShieldAlert className="h-5 w-5 text-amber-500" /> 风险提示
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {product.risks.map((risk) => (
                <div key={risk} className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50/50 p-3 text-sm text-slate-700">
                  <ShieldAlert className="h-4 w-4 text-amber-500" />
                  {risk}
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm">
          <div className="bg-blue-600 p-5 text-white">
            <h2 className="text-xl font-semibold">快速认购</h2>
            <p className="mt-1 text-sm text-blue-100">确认您的投资信息</p>
          </div>
          <dl className="space-y-3 p-5 text-sm">
            {[
              ['当前年化收益率', `${product.annualYield.toFixed(2)}%`],
              ['锁定期', product.lockPeriod],
              ['最低投资', formatCurrencyAmount(product.currency, product.minInvestment)],
              ['最高投资', formatCurrencyAmount(product.currency, product.maxInvestment)],
              ['派息方式', product.payoutMethod],
              ['订单资金链', '付款账户 → 认购订单 → 到期赎回'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2">
                <dt className="text-slate-500">{label}</dt>
                <dd className="text-right font-semibold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="px-5 pb-5">
            <Button type="button" onClick={() => onSubscribe(product, { mode: 'additional', holdingId: holding.id })} className="h-11 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              追加认购
            </Button>
            <p className="mt-3 text-center text-xs text-slate-500">投资有风险，请仔细阅读产品说明</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function HoldingsPage({ holdings, onSubscribe, onHoldingDetail, onRedeemSubmitted }) {
  const defaultExpandedId = holdings.find((holding) => holding.status === '已到期')?.id || holdings[0]?.id
  const [expandedId, setExpandedId] = useState(defaultExpandedId)
  const [dailyIncomeOrder, setDailyIncomeOrder] = useState(null)
  const [redeemRequest, setRedeemRequest] = useState(null)

  return (
    <section>
      <div>
        <h1 className="text-xl font-semibold text-slate-900">当前持仓</h1>
        <p className="mt-1 text-sm text-slate-500">查看您当前的投资产品持仓情况</p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {holdings.map((holding) => {
            const product = holding.product
            const expanded = expandedId === holding.id
            const currentValue = holding.currentValue
            return (
              <article key={holding.id} className={`overflow-hidden rounded-xl border bg-white shadow-sm ${expanded ? 'border-blue-300' : 'border-slate-200'}`}>
                <div className="grid gap-5 p-5 lg:grid-cols-[1.25fr_1fr_1fr_1fr_1fr_auto] lg:items-center">
                  <div className="flex items-center gap-3">
                    <CurrencyIcon currency={holding.currency} className="h-10 w-10" />
                    <div>
                      <h3 className="font-semibold text-slate-900">{holding.productName}</h3>
                      <p className="mt-1 text-xs text-slate-500">{product.type} · 持仓 ID {holding.displayId}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">总投资金额</p>
                    <p className="mt-1 font-semibold text-slate-900">{formatCurrencyAmount(holding.currency, holding.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">当前价值</p>
                    <p className="mt-1 font-semibold text-slate-900">{formatCurrencyAmount(holding.currency, currentValue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">累计收益</p>
                    <p className="mt-1 font-semibold text-[#18bd00]">+{formatCurrencyAmount(holding.currency, Number(holding.income || 0))}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">当前年化收益率</p>
                    <p className="mt-1 font-semibold text-orange-500">{product.annualYield.toFixed(2)}%</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={holding.status === '持有中' ? 'success' : holding.status === '已到期' ? 'outline' : 'warning'} className={holding.status === '已到期' ? 'border-sky-100 bg-sky-50 text-blue-600' : ''}>{holding.status}</Badge>
                    <button type="button" onClick={() => onHoldingDetail(holding)} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                      <Eye className="h-4 w-4" /> 详情
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? '' : holding.id)}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-blue-700"
                  >
                    持仓详情 <ClickHint /> <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  </button>
                  <Button type="button" variant="outline" size="sm" onClick={() => onSubscribe(product, { mode: 'additional', holdingId: holding.id })} className="rounded-lg border-blue-600 text-blue-600">
                    <Plus className="h-4 w-4" /> 追加认购 <ClickHint />
                  </Button>
                </div>

                {expanded ? (
                  <HoldingDetailPanel
                    holding={holding}
                    onDailyIncome={setDailyIncomeOrder}
                    onRedeem={(order) => setRedeemRequest({ order, holding })}
                  />
                ) : null}
              </article>
            )
          })}
        </div>
        <BusinessRulesPanel rules={holdingsBusinessRules} />
      </div>

      <DailyIncomeModal order={dailyIncomeOrder} onClose={() => setDailyIncomeOrder(null)} />
      {redeemRequest ? (
        <RedeemModal
          key={redeemRequest.order.id}
          order={redeemRequest.order}
          onClose={() => setRedeemRequest(null)}
          onConfirm={(payload) => {
            onRedeemSubmitted?.({
              ...payload,
              sourceOrder: redeemRequest.order,
            })
            setRedeemRequest(null)
          }}
        />
      ) : null}
    </section>
  )
}

function DetailSection({ title, rows }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <dl className="mt-4 space-y-3 text-sm">
        {rows.map(([label, value]) => {
          const highlighted = label === '付款账户' || label === '原付款账户'
          return (
          <div key={label} className={`flex items-center justify-between gap-6 ${highlighted ? 'rounded-lg border border-amber-300 bg-amber-100 px-3 py-2' : ''}`}>
            <dt className={highlighted ? 'font-semibold text-amber-900' : 'text-slate-500'}>{label}</dt>
            <dd className={`text-right font-semibold ${highlighted ? 'text-amber-900' : 'text-slate-900'}`}>{value}</dd>
          </div>
          )
        })}
      </dl>
    </section>
  )
}

function TransactionHistoryDetail({ order, onBack }) {
  const isRedeem = order.type === '赎回'
  const amountMeta = getHistoryAmountMeta(order)
  const displayStatus = getHistoryDisplayStatus(order)
  const product = getOrderProduct(order)
  const detailRows = [
    ['订单编号', order.id],
    ['创建日期', order.date],
    ['完成日期', order.status === '已通过' ? (order.completedDate || order.date) : '-'],
    ['状态', displayStatus],
  ]
  const productRows = [
    ['产品名称', order.productName],
    ['产品币种', order.currency],
    ['产品类型', product?.type || '-'],
    ['年化收益率', product?.annualYield ? `${product.annualYield.toFixed(4)}%` : '-'],
    ['投资期限', order.maturityDate || order.term || '-'],
  ]
  const tradeRows = isRedeem
    ? [
        ['交易类型', '赎回'],
        ['赎回金额', `${getRedemptionAmount(order).toFixed(2)} ${order.currency}`],
        ['手续费', `${getRedemptionFee(order).toFixed(2)} ${order.currency}`],
        ['实际到账', `${getRedemptionActualReceipt(order).toFixed(2)} ${order.currency}`],
        ['原付款账户', getRedemptionReturnAccountName(order)],
        ['回款币种', order.returnCurrency || order.currency],
      ]
    : [
        ['交易类型', order.subscriptionType || '首次认购'],
        ['投资金额', `${Number(order.amount || 0).toFixed(2)} ${order.currency}`],
        ['实际扣款', `${getOrderDebit(order).toFixed(2)} ${order.currency}`],
        ['付款账户', getOrderPaymentAccountName(order)],
      ]
  const feeRows = isRedeem
    ? []
    : [['手续费', `${getOrderFee(order).toFixed(2)} ${order.currency}`]]

  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
        <ChevronLeft className="h-4 w-4" /> 返回交易 <ClickHint />
      </button>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <LineChart className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">理财-{isRedeem ? '赎回' : '申购'} 详情</h1>
              <p className="mt-1 text-xs text-slate-500">{order.date} {order.time}</p>
            </div>
          </div>
          <Badge variant={getHistoryStatusVariant(displayStatus)}>{displayStatus}</Badge>
        </header>
        <div className="mx-auto max-w-[720px] px-6 py-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lime-50 text-[#18bd00]">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <p className="mt-4 text-sm text-slate-500">{displayStatus}</p>
            <p className={`mt-2 text-3xl font-semibold tracking-normal ${amountMeta.className}`}>{amountMeta.text}</p>
            <p className="mt-2 text-sm text-slate-500">手续费：{(isRedeem ? getRedemptionFee(order) : getOrderFee(order)).toFixed(2)} {order.currency}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[720px] space-y-4">
        <DetailSection title="详情" rows={detailRows} />
        <DetailSection title="产品信息" rows={productRows} />
        <DetailSection title={isRedeem ? '赎回信息' : '申购信息'} rows={tradeRows} />
        {feeRows.length ? <DetailSection title="收益信息" rows={feeRows} /> : null}
        {isRedeem && order.rejectReason ? <DetailSection title="拒绝原因" rows={[['拒绝原因', order.rejectReason]]} /> : null}
      </div>
    </div>
  )
}

function HistoryPage({ orders }) {
  const [activeHistoryType, setActiveHistoryType] = useState('赎回')
  const historyRows = activeHistoryType === '赎回'
    ? redemptionHistoryOrders
    : activeHistoryType === '申购'
      ? orders.filter((order) => order.type === '申购')
      : []

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">交易历史</h1>
          <p className="mt-1 text-sm text-slate-500">申购、赎回和收益记录</p>
        </div>
        <label className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm text-slate-600">
          <ListFilter className="h-4 w-4" />
          <select className="bg-transparent outline-none">
            <option>状态</option>
            <option>审核中</option>
            <option>已完成</option>
            <option>已拒绝</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex gap-6 border-b border-slate-200 text-sm font-semibold text-slate-600">
        {['申购', '赎回', '收益'].map((item) => {
          const showClickHint = item !== '收益'
          return (
            <button
              key={item}
              type="button"
              onClick={() => setActiveHistoryType(item)}
              className={`pb-3 ${activeHistoryType === item ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
            >
              <span className="inline-flex items-center gap-1">
                {item}
                {showClickHint ? <ClickHint className={activeHistoryType === item ? 'text-blue-600' : 'text-blue-500'} /> : null}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-[920px] w-full border-collapse text-left text-sm">
          <thead className="text-xs font-semibold text-slate-500">
            <tr>
              <th className="px-4 py-3">日期 & 编号</th>
              <th className="px-4 py-3">产品</th>
              {activeHistoryType === '申购' ? <th className="px-4 py-3 text-amber-800">付款账户</th> : null}
              <th className="px-4 py-3">类型</th>
              <th className="px-4 py-3">金额</th>
              {activeHistoryType === '赎回' ? <th className="px-4 py-3 text-amber-800">原付款账户</th> : null}
              {activeHistoryType === '赎回' ? <th className="px-4 py-3">手续费</th> : null}
              <th className="px-4 py-3">状态</th>
            </tr>
          </thead>
          <tbody>
            {historyRows.map((order) => {
              const amountMeta = getHistoryAmountMeta(order)
              const displayStatus = getHistoryDisplayStatus(order)
              return (
                <tr
                  key={order.id}
                  className="border-t border-slate-100"
                >
                  <td className="px-4 py-4">
                    <div className="font-semibold text-slate-800">{order.date} {order.time}</div>
                    <div className="mt-1 font-mono text-xs text-slate-400">{order.id}</div>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-800">{order.productName}</td>
                  {activeHistoryType === '申购' ? (
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-md border border-amber-300 bg-amber-100 px-2 py-1 font-semibold text-amber-900">{getOrderPaymentAccountName(order)}</span>
                    </td>
                  ) : null}
                  <td className="px-4 py-4"><Badge className="border-blue-100 bg-blue-50 text-blue-700">{order.type}</Badge></td>
                  <td className={`px-4 py-4 font-semibold ${amountMeta.className}`}>{amountMeta.text}</td>
                  {activeHistoryType === '赎回' ? (
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-md border border-amber-300 bg-amber-100 px-2 py-1 font-semibold text-amber-900">{getRedemptionReturnAccountName(order)}</span>
                    </td>
                  ) : null}
                  {activeHistoryType === '赎回' ? <td className="px-4 py-4 text-slate-600">{getRedemptionFee(order).toFixed(2)} {order.currency}</td> : null}
                  <td className="px-4 py-4"><Badge variant={getHistoryStatusVariant(displayStatus)}>{displayStatus}</Badge></td>
                </tr>
              )
            })}
            {historyRows.length === 0 ? (
              <tr className="border-t border-slate-100">
                <td colSpan={activeHistoryType === '赎回' ? 7 : activeHistoryType === '申购' ? 6 : 5} className="px-4 py-8 text-center text-sm text-slate-500">暂无{activeHistoryType}记录</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-slate-500">显示 {historyRows.length} 条交易记录</p>
    </section>
  )
}

function TopTradePage({ orders, redemptions, selectedOrder, onSelectOrder, onBackDetail }) {
  const topTradeRows = [
    orders.find((order) => order.type === '申购'),
    redemptions[0],
  ].filter(Boolean)

  if (selectedOrder) {
    return <TransactionHistoryDetail order={selectedOrder} onBack={onBackDetail} />
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">交易</h1>
          <p className="mt-1 text-sm text-slate-500">查看最近一笔申购和最近一笔赎回的资金追溯详情</p>
        </div>
        <Badge className="border-blue-100 bg-blue-50 text-blue-700">顶部交易入口</Badge>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-[860px] w-full border-collapse text-left text-sm">
          <thead className="text-xs font-semibold text-slate-500">
            <tr>
              <th className="px-4 py-3">日期 & 编号</th>
              <th className="px-4 py-3">产品</th>
              <th className="px-4 py-3">类型</th>
              <th className="px-4 py-3">金额</th>
              <th className="px-4 py-3">状态</th>
            </tr>
          </thead>
          <tbody>
            {topTradeRows.map((order) => {
              const amountMeta = getHistoryAmountMeta(order)
              const displayStatus = getHistoryDisplayStatus(order)
              return (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder?.(order)}
                  className="cursor-pointer border-t border-slate-100 hover:bg-blue-50/40"
                >
                  <td className="px-4 py-4">
                    <div className="font-semibold text-slate-800">{order.date} {order.time}</div>
                    <div className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-slate-400">
                      {order.id} <ClickHint />
                    </div>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-800">{order.productName}</td>
                  <td className="px-4 py-4"><Badge className="border-blue-100 bg-blue-50 text-blue-700">{order.type}</Badge></td>
                  <td className={`px-4 py-4 font-semibold ${amountMeta.className}`}>{amountMeta.text}</td>
                  <td className="px-4 py-4"><Badge variant={getHistoryStatusVariant(displayStatus)}>{displayStatus}</Badge></td>
                </tr>
              )
            })}
            {topTradeRows.length === 0 ? (
              <tr className="border-t border-slate-100">
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">暂无交易记录</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-slate-500">显示 {topTradeRows.length} 条交易记录</p>
    </section>
  )
}

function AccountsPage({ onOpenFunds }) {
  const totalUsd = fundingAccounts.reduce((sum, account) => sum + getAccountBalance(account, 'USD'), 0)

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">理财多账户</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">多银行账户资金来源可用于基金申购、持仓和交易记录查看。</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-4 text-right">
            <p className="text-xs font-semibold text-blue-700">可用于理财申购</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{formatUsd(totalUsd)}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        {fundingAccounts.map((account) => (
          <article key={account.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Landmark className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-slate-900">{account.name}</h3>
            <p className="mt-1 text-xs text-slate-500">{getAccountLabel(account)}</p>
            <div className="mt-5 space-y-2">
              {account.supportedCurrencies.map((currency) => (
                <div key={currency} className="rounded-lg bg-slate-50 px-3 py-2">
                  <p className="text-xs text-slate-500">{currency} 可用余额</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{formatCurrencyAmount(currency, getAccountBalance(account, currency))}</p>
                </div>
              ))}
            </div>
            <Button type="button" size="sm" onClick={onOpenFunds} className="mt-5 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              <ClickHint className="text-white/90" /> 进入基金
            </Button>
          </article>
        ))}
      </section>
    </div>
  )
}

export function WealthMultiAccountPrototype({ onBack }) {
  const [activeArea, setActiveArea] = useState('fund')
  const [activeTab, setActiveTab] = useState('概览')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedHoldingOrder, setSelectedHoldingOrder] = useState(null)
  const [subscribingProduct, setSubscribingProduct] = useState(null)
  const [subscriptionContext, setSubscriptionContext] = useState({ mode: 'initial', holdingId: '' })
  const [orders, setOrders] = useState(() => initialOrders)
  const [redemptions, setRedemptions] = useState(() => redemptionHistoryOrders)
  const [historyDetailOrder, setHistoryDetailOrder] = useState(null)
  const holdings = useMemo(() => buildHoldings(orders), [orders])
  const activeSelectedHolding = selectedHoldingOrder
    ? holdings.find((holding) => holding.id === selectedHoldingOrder.id) || selectedHoldingOrder
    : null
  const investmentMenu = useMemo(() => [
    {
      label: '基金',
      onClick: () => {
        setActiveArea('fund')
        setActiveTab('产品目录')
        setSelectedProduct(null)
        setSelectedHoldingOrder(null)
        setSubscribingProduct(null)
        setHistoryDetailOrder(null)
      },
    },
  ], [])

  const openDetail = (product) => {
    setSelectedProduct(product)
    setSelectedHoldingOrder(null)
    setSubscribingProduct(null)
    setHistoryDetailOrder(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openHoldingDetail = (order) => {
    setSelectedHoldingOrder(order)
    setSelectedProduct(null)
    setSubscribingProduct(null)
    setHistoryDetailOrder(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openSubscribe = (product, context = {}) => {
    setSubscribingProduct(product)
    setSubscriptionContext({
      mode: context.mode || 'initial',
      holdingId: context.holdingId || '',
    })
    setSelectedProduct(null)
    setSelectedHoldingOrder(null)
    setHistoryDetailOrder(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const changeFundTab = (tab) => {
    setActiveTab(tab)
    setHistoryDetailOrder(null)
  }

  const submitOrder = ({
    product,
    accountId,
    accountName,
    paymentAccountLabel,
    paymentCurrency,
    holdingId,
    amount,
    fee,
    actualDebit,
    subscriptionType,
  }) => {
    const now = new Date()
    const pad = (value) => String(value).padStart(2, '0')
    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    const nextHoldingId = holdingId || `holding-${product.id}-${date.replaceAll('-', '')}-${Math.random().toString(16).slice(2, 6)}`
    const nextOrder = {
      id: `INV-${date.replaceAll('-', '')}-${Math.random().toString(16).slice(2, 8)}`,
      displayId: String(orders.length + 23),
      holdingId: nextHoldingId,
      productId: product.id,
      productName: product.name,
      accountName,
      paymentAccountId: accountId,
      paymentAccountLabel,
      paymentCurrency,
      fee,
      actualDebit,
      subscriptionType,
      amount,
      currentValue: amount,
      currency: product.currency,
      type: '申购',
      status: '待审核',
      date,
      time,
      term: product.lockPeriod === '-' ? '-' : `${date} 至 30天后`,
      income: 0,
      dailyIncome: getDailyYield(product, amount),
      purchaseDate: date,
      maturityDate: product.lockPeriod === '-' ? '-' : '30天后',
    }

    setOrders((current) => [nextOrder, ...current])
    setSubscribingProduct(null)
    setSubscriptionContext({ mode: 'initial', holdingId: '' })
    setSelectedProduct(null)
    setSelectedHoldingOrder(null)
    setHistoryDetailOrder(nextOrder)
    setActiveArea('transactions')
    setActiveTab('交易历史')
  }

  const submitRedemption = ({
    sourceOrder,
    paymentAccountId,
    paymentAccountLabel,
    returnCurrency,
    fee,
    actualReceipt,
  }) => {
    const now = new Date()
    const pad = (value) => String(value).padStart(2, '0')
    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    const nextRedemption = {
      id: `RED-${date.replaceAll('-', '')}-${Math.random().toString(16).slice(2, 8)}`,
      redeemId: sourceOrder.displayId || sourceOrder.id,
      productId: sourceOrder.productId,
      productName: sourceOrder.productName,
      type: '赎回',
      status: '待审核',
      date,
      time,
      currency: sourceOrder.currency,
      redemptionAmount: getOrderValue(sourceOrder),
      fee,
      actualReceipt,
      paymentAccountId,
      paymentAccountLabel,
      returnCurrency,
    }

    setRedemptions((current) => [nextRedemption, ...current])
    setHistoryDetailOrder(nextRedemption)
    setSelectedProduct(null)
    setSelectedHoldingOrder(null)
    setSubscribingProduct(null)
    setActiveArea('transactions')
    setActiveTab('交易历史')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectNav = (label) => {
    if (label === '仪表板') {
      setActiveArea('accounts')
      setSelectedProduct(null)
      setSelectedHoldingOrder(null)
      setSubscribingProduct(null)
      setHistoryDetailOrder(null)
      return
    }
    if (label === '账户') {
      setActiveArea('accounts')
      setSelectedProduct(null)
      setSelectedHoldingOrder(null)
      setSubscribingProduct(null)
      setHistoryDetailOrder(null)
      return
    }
    if (label === '交易') {
      setActiveArea('transactions')
      setSelectedProduct(null)
      setSelectedHoldingOrder(null)
      setSubscribingProduct(null)
      setHistoryDetailOrder(null)
    }
  }

  const renderFundContent = () => {
    if (subscribingProduct) {
      return (
        <SubscribePage
          product={subscribingProduct}
          mode={subscriptionContext.mode}
          holdingId={subscriptionContext.holdingId}
          onBack={() => setSubscribingProduct(null)}
          onSubmit={submitOrder}
        />
      )
    }
    if (selectedProduct) {
      return <DetailPage product={selectedProduct} onBack={() => setSelectedProduct(null)} onSubscribe={openSubscribe} />
    }
    if (activeSelectedHolding) {
      return (
        <HoldingProductDetailPage
          holding={activeSelectedHolding}
          onBack={() => setSelectedHoldingOrder(null)}
          onSubscribe={openSubscribe}
        />
      )
    }
    if (activeTab === '产品目录') {
      return <CatalogPage onDetail={openDetail} onSubscribe={openSubscribe} />
    }
    if (activeTab === '我的投资') {
      return <HoldingsPage holdings={holdings} onSubscribe={openSubscribe} onHoldingDetail={openHoldingDetail} onRedeemSubmitted={submitRedemption} />
    }
    if (activeTab === '交易历史') {
      return <HistoryPage orders={orders} />
    }
    return <OverviewPage orders={orders} onTabChange={changeFundTab} onDetail={openDetail} onSubscribe={openSubscribe} />
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-950">
      <ClientTopNav
        onBack={onBack}
        activeNavLabel={activeArea === 'transactions' ? '交易' : activeArea === 'fund' ? '投资' : '账户'}
        investmentMenu={investmentMenu}
        onNavSelect={selectNav}
        clickableNavLabels={['投资', '交易']}
      />

      <main className="mx-auto max-w-[1380px] space-y-5 px-5 py-6">
        {activeArea === 'accounts' ? (
          <AccountsPage onOpenFunds={() => {
            setActiveArea('fund')
            setActiveTab('产品目录')
            setHistoryDetailOrder(null)
          }}
          />
        ) : activeArea === 'transactions' ? (
          <TopTradePage
            orders={orders}
            redemptions={redemptions}
            selectedOrder={historyDetailOrder}
            onSelectOrder={setHistoryDetailOrder}
            onBackDetail={() => setHistoryDetailOrder(null)}
          />
        ) : (
          <>
            {subscribingProduct || selectedProduct || selectedHoldingOrder ? null : <SecondaryTabs activeTab={activeTab} onChange={changeFundTab} />}
            {renderFundContent()}
          </>
        )}
      </main>
    </div>
  )
}
