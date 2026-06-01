import {
  AlertCircle,
  AlertTriangle,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowDownUp,
  ArrowUpFromLine,
  Banknote,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Globe,
  Eye,
  EyeOff,
  Info,
  Landmark,
  ListChecks,
  Network,
  Plus,
  ReceiptText,
  Search,
  Send,
  User,
} from 'lucide-react'
import { useState } from 'react'

import { PrdBackLink } from '../components/portal/PrdBackLink'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const operatorProfile = {
  name: 'Ethan Xie',
  email: 'ethan.xie@fidere.example',
  role: '运营人员',
}

const clients = [
  {
    id: 'CL-2003001',
    name: 'SHENBAO LAW FIRM LTD',
    trustName: 'Fidere Trust - Shenbao',
    status: 'KYB 已通过',
    accountManager: 'Operations Desk A',
    accounts: [
      { id: 'trust-usd', label: '香港信托账户', type: 'TRUST', currency: 'USD', available: 96037.39, frozen: 1000, processing: 0 },
      { id: 'us-global-usd', label: '美国账户', type: 'US_ACCOUNT', currency: 'USD', available: 82430.27, frozen: 800, processing: 1200 },
      { id: 'digital-usdt', label: '数字资产账户', type: 'DIGITAL', currency: 'USDT', available: 10011.2, frozen: 0, processing: 0 },
    ],
    baasUserAccounts: [
      { id: 'baas-user-shenbao-main', label: 'SHENBAO LAW FIRM LTD', accountId: 'BAAS-CL-2003001' },
    ],
    globalAccounts: [
      ['Singapore Global Account', 'USD', 'ZA Bank Limited', 'SWIFT', 'ACTIVE', '2026-05-29 20:51'],
      ['Hong Kong Collection Account', 'HKD', 'ZA Bank Limited', 'FPS', 'READY', '2026-05-26 09:14'],
    ],
    counterparties: [
      ['SHENBAO LAW FIRM LTD · BAAS-CL-2003001', 'SELF OWNED', 'SHENBAO LAW FIRM LTD', 'USD', 'Active', 'Self owned settlement'],
      ['SHENBAO LAW FIRM LTD · BAAS-CL-2003001', 'THIRD PARTY', 'SURF INDUSTRIES LIMITED', 'USD', 'Active', 'Vendor payout'],
    ],
  },
  {
    id: 'CL-2003002',
    name: 'APEXIS INC',
    trustName: 'Fidere Trust - Apexis',
    status: '账户已开通',
    accountManager: 'Operations Desk B',
    accounts: [
      { id: 'trust-usd', label: '香港信托账户', type: 'TRUST', currency: 'USD', available: 122800, frozen: 0, processing: 5000 },
      { id: 'us-global-usd', label: '美国账户', type: 'US_ACCOUNT', currency: 'USD', available: 56010.42, frozen: 0, processing: 0 },
      { id: 'digital-usdt', label: '数字资产账户', type: 'DIGITAL', currency: 'USDT', available: 0.455073, frozen: 0, processing: 0 },
    ],
    baasUserAccounts: [
      { id: 'baas-user-apexis-main', label: 'APEXIS INC', accountId: 'BAAS-CL-2003002' },
    ],
    globalAccounts: [
      ['Singapore Global Account', 'USD', 'ZA Bank Limited', 'SWIFT', 'ACTIVE', '2026-05-28 17:42'],
    ],
    counterparties: [
      ['APEXIS INC · BAAS-CL-2003002', 'SELF OWNED', 'APEXIS INC', 'USD', 'Active', 'Internal treasury'],
      ['APEXIS INC · BAAS-CL-2003002', 'THIRD PARTY', 'EASTWOOD TECH LIMITED', 'USD', 'Active', 'Service provider'],
    ],
  },
]

const navGroups = [
  {
    label: 'Accounts & Funding',
    items: [
      { id: 'accounts', label: '账户信息', icon: Landmark },
    ],
  },
  {
    label: 'Business Network',
    items: [
      { id: 'counterparties', label: '收款人管理', icon: Network },
      { id: 'crypto-whitelist', label: '数字币白名单', icon: ListChecks },
    ],
  },
  {
    label: 'Payments',
    items: [
      { id: 'create-transfer', label: '创建交易', icon: Send },
      { id: 'convert', label: 'Convert', icon: ArrowDownUp },
    ],
  },
  {
    label: 'Transaction History',
    items: [
      { id: 'transfer-in-orders', label: '转入订单', icon: ReceiptText },
      { id: 'transfer-out-orders', label: '转出订单', icon: Send },
      { id: 'convert-orders', label: 'Convert订单', icon: ArrowDownUp },
    ],
  },
]

const initialOrders = [
  {
    id: 'PI-1780051298001',
    createdByRole: 'OPERATOR',
    createdForClientId: 'CL-2003001',
    type: '转入订单',
    historyCategory: 'transfer-in',
    sourceAccountType: 'EXTERNAL_BANK',
    targetAccountType: 'GLOBAL_ACCOUNT',
    sourceDisplay: 'External Bank Account',
    targetDisplay: 'Singapore Global Account',
    currency: 'USD',
    amountDisplay: 'USD 25,000.00',
    feeAmountDisplay: 'USD 0.00',
    estimatedArrivalAmount: 'USD 25,000.00',
    clientVisibleStatus: '已入账',
    adminExecutionStatus: 'COMPLETED',
    createdAt: '2026-05-29 15:08',
    auditTrail: ['运营匹配外部入金', '后台确认入账', '客户可用余额增加'],
  },
  {
    id: 'IT-1780051300428',
    createdByRole: 'OPERATOR',
    createdForClientId: 'CL-2003001',
    type: '内部转账',
    historyCategory: 'transfer-out',
    sourceAccountType: 'TRUST',
    targetAccountType: 'US_ACCOUNT',
    sourceDisplay: '香港信托账户',
    targetDisplay: '美国账户',
    currency: 'USD',
    amountDisplay: 'USD 1,000.00',
    feeAmountDisplay: 'USD 15.00',
    estimatedArrivalAmount: 'USD 985.00',
    clientVisibleStatus: '待后台审核',
    adminExecutionStatus: 'UNDER_REVIEW',
    createdAt: '2026-05-29 18:41',
    auditTrail: ['运营为客户创建内部转账', '系统冻结转出账户可用余额', '等待后台审核'],
  },
  {
    id: 'PO-1780051301889',
    createdByRole: 'OPERATOR',
    createdForClientId: 'CL-2003001',
    type: '转出订单',
    historyCategory: 'transfer-out',
    sourceAccountType: 'US_ACCOUNT',
    targetAccountType: 'BENEFICIARY',
    sourceDisplay: '美国账户',
    targetDisplay: 'SURF INDUSTRIES LIMITED',
    currency: 'USD',
    amountDisplay: 'USD 6,500.00',
    feeAmountDisplay: 'USD 18.00',
    estimatedArrivalAmount: 'USD 6,482.00',
    clientVisibleStatus: '处理中',
    adminExecutionStatus: 'MANUAL_EXECUTION_PENDING',
    createdAt: '2026-05-30 10:26',
    auditTrail: ['运营创建转出订单', '系统冻结转出账户可用余额', '等待 BaaS 手动执行'],
  },
  {
    id: 'CV-1780051302671',
    createdByRole: 'OPERATOR',
    createdForClientId: 'CL-2003001',
    type: 'Convert订单',
    historyCategory: 'convert',
    sourceAccountType: 'USD',
    targetAccountType: 'HKD',
    sourceDisplay: 'USD 账户',
    targetDisplay: 'HKD 账户',
    currency: 'USD/HKD',
    amountDisplay: 'USD 8,000.00',
    feeAmountDisplay: 'HKD 0.00',
    estimatedArrivalAmount: 'HKD 62,340.00',
    exchangeRate: '1 USD = 7.7925 HKD',
    clientVisibleStatus: '已完成',
    adminExecutionStatus: 'COMPLETED',
    createdAt: '2026-05-30 14:35',
    auditTrail: ['运营创建 Convert 订单', '报价确认', '兑换完成并记账'],
  },
]

const transactionOrderConfigs = {
  'transfer-in': {
    title: '转入订单',
    description: '展示外部入金、账户转入和入账匹配记录，运营可按客户、账户、币种和入账状态筛选。',
    note: '调用接口 GET /open-api/v3/business/accounts/transactions 以及 GET /open-api/v3/cryptoconnect/transfers 落库订单，然后按类型筛选转入。',
    webhookNote: 'Webhook 通知文档：https://developer.interlace.money/docs/api-notifications#event-types-13',
    filterPlaceholders: ['搜索客户 / Account ID', 'Order ID', '币种', '入账状态', '提交时间 → 完成时间'],
    emptyText: '暂无转入订单',
  },
  'transfer-out': {
    title: '转出订单',
    description: '展示转出至收款人、账户转出和内部转出记录，运营可按付款账户、收款人、币种和执行状态筛选。',
    note: '调用接口 GET /open-api/v3/business/accounts/transactions 以及 GET /open-api/v3/cryptoconnect/transfers 落库订单，然后按类型筛选转出。',
    webhookNote: 'Webhook 通知文档：https://developer.interlace.money/docs/api-notifications#event-types-13',
    filterPlaceholders: ['搜索付款账户', '搜索收款人', 'Order ID', '币种', '执行状态'],
    emptyText: '暂无转出订单',
  },
  convert: {
    title: 'Convert订单',
    titleSuffix: 'https://developer.interlace.money/docs/cryptoconnect-converting-overview',
    description: '展示换汇订单、报价、兑换金额和执行状态，运营可按兑换币对、客户、状态和时间筛选。',
    filterPlaceholders: ['搜索客户 / Account ID', 'Order ID', '兑换币对', '订单状态', '创建时间 → 完成时间'],
    emptyText: '暂无 Convert 订单',
  },
}

const payeeCountries = [
  { code: 'US', name: 'United States' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'SG', name: 'Singapore' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'AU', name: 'Australia' },
]

const payeeCurrencies = ['CNH', 'USD', 'HKD', 'GBP', 'EUR', 'AUD', 'AED', 'ILS', 'CAD', 'SGD', 'MYR', 'JPY', 'IDR']

const paymentMethodMeta = {
  WIRE: { label: 'WIRE', description: '美国本地清算网络支付', time: '1~3个工作日内到账', routingCodeType: 'ROUTING_NUMBER', routingCodeLabel: '路由号码' },
  ACH: { label: 'ACH', description: '美国 ACH 本地清算', time: '1~3个工作日内到账', routingCodeType: 'ACH_CODE', routingCodeLabel: 'ACH 代码' },
  SWIFT: { label: 'SWIFT', description: '国际银行转账', time: '0~1个工作日内到账', routingCodeType: 'SWIFT_CODE', routingCodeLabel: 'SWIFT 代码' },
  SEPA: { label: 'SEPA', description: '欧洲单一欧元支付区转账', time: '1~2个工作日内到账', routingCodeType: 'IBAN', routingCodeLabel: 'IBAN' },
}

const defaultPayeeForm = {
  accountId: '',
  country: 'US',
  currency: 'USD',
  paymentMethod: '',
  paymentType: 'COMPANY',
  payeeName: '',
  accountNumber: '',
  bankName: '',
  routingCode: '',
  bankCountry: 'US',
  bankState: '',
  bankCity: '',
  bankAddress: '',
  bankPostalCode: '',
  payeeCountry: 'US',
  payeeState: '',
  payeeCity: '',
  payeeAddress: '',
  payeePostalCode: '',
  comments: '',
}

const defaultCreateAccountForm = {
  phoneCountryCode: '86',
  phoneNumber: '14155552671',
  email: 'ops+shenbao@fidere.example',
  name: 'SHENBAO LAW FIRM LTD',
  username: 'shenbao_ops',
  password: 'TempPass123',
}

const createBaasAccountApiNotes = [
  '当前BaaS：创建 baas_account',
  '当前BaaS：绑定 trust_user_account_id',
  '当前BaaS：写入操作审计日志',
]

const baasUserOperationApiNotes = [
  ['提交KYC资料', 'POST /api/interlace/accounts/{accountId}/legal-entity', 'POST /api/interlace/accounts/{accountId}/kyc', '第三方接口：POST /open-api/v3/accounts/{accountId}/kyc'],
  ['查询KYC结果', 'GET /api/interlace/accounts/{accountId}/kyc/verification'],
  ['创建VA账户', 'POST /api/interlace/accounts/{accountId}/bank-account', '第三方接口：POST /open-api/v3/business/account/{accountId}/bank-account'],
]

const formatAmount = (currency, value) => `${currency} ${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const formatDateTime = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const createInitialBaasUsers = (client) => (client.baasUserAccounts || []).map((account, index) => ({
  id: account.id,
  trustUserAccountId: client.id,
  trustUserAccountName: client.name,
  baasAccountId: account.accountId,
  name: account.label,
  email: index === 0 ? 'ops+shenbao@fidere.example' : '-',
  username: index === 0 ? 'shenbao_ops' : '-',
  phone: '-',
  createdAt: '2026-05-29 20:51',
  kycStatus: 'KYC已通过',
  vaStatus: 'VA已创建',
}))

const getPaymentMethods = (country, currency) => {
  if (currency === 'EUR') return ['SEPA', 'SWIFT']
  if (country === 'US' && currency === 'USD') return ['WIRE', 'ACH', 'SWIFT']
  if (country === 'HK' && ['HKD', 'USD'].includes(currency)) return ['SWIFT']
  if (country === 'GB' && ['GBP', 'EUR', 'USD'].includes(currency)) return ['SWIFT']
  return ['SWIFT']
}

const getCountryName = (countryCode) => payeeCountries.find((country) => country.code === countryCode)?.name || countryCode

const createCounterpartyMap = () => Object.fromEntries(clients.map((client) => [client.id, client.counterparties]))

const getBaasUserAccountLabel = (client, accountId) => {
  const account = client.baasUserAccounts?.find((item) => item.id === accountId)
  return account ? `${account.label} · ${account.accountId}` : accountId
}

function Sidebar({ activeNav, onNavChange }) {
  return (
    <aside className="sticky top-0 h-screen w-[260px] shrink-0 border-r border-slate-200 bg-white px-4 py-6">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-950">Fidere BaaS Ops</div>
          <div className="text-xs text-slate-500">运营操作台</div>
        </div>
      </div>

      <nav className="mt-8 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="px-2 text-xs font-semibold uppercase text-slate-400">{group.label}</div>
            <div className="mt-2 space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const active = activeNav === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavChange(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors ${active ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}

function TopContextBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
      <div className="flex flex-wrap items-center justify-end gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-950">{operatorProfile.name}</div>
            <div className="text-xs text-slate-500">{operatorProfile.role}</div>
          </div>
        </div>
      </div>
    </header>
  )
}

function PageHeader({ title, titleSuffix, description, actions }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="flex max-w-5xl flex-wrap items-baseline gap-x-3 gap-y-2 text-3xl font-bold tracking-tight text-slate-950">
          <span>{title}</span>
          {titleSuffix ? <span className="break-all font-mono text-sm font-semibold text-blue-600">{titleSuffix}</span> : null}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {actions}
    </div>
  )
}

function FilterBar({ placeholders = ['搜索客户或账户 ID', '状态', '起始时间 → 结束时间'], actionLabel = 'Download CSV' }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {placeholders.map((placeholder) => (
        <div key={placeholder} className="flex h-11 min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-400">
          <Search className="h-4 w-4" />
          {placeholder}
        </div>
      ))}
      <Button type="button" className="h-11 rounded-xl bg-slate-950 px-5 text-white hover:bg-slate-800">
        <Download className="h-4 w-4" />
        {actionLabel}
      </Button>
    </div>
  )
}

function buildAccountDetail(row) {
  const [accountName, currency, bankName, network, status, createdAt] = row
  const isDomestic = network === 'ACH' || network === 'WIRE'
  const accountNo = accountName.includes('Hong Kong') ? '894 200 731 114' : '102438270915'
  const routingNumber = isDomestic ? '026009593' : ''
  const swift = network === 'SWIFT' ? 'ZABKSGSGXXX' : 'ZABKHKHHXXX'
  const bankAddress = accountName.includes('Hong Kong')
    ? '18/F, ZA Tower, 12 Hoi Bun Road, Kwun Tong, Hong Kong'
    : '9 Raffles Place, Republic Plaza, Singapore 048619'

  return {
    accountName,
    currency,
    bankName,
    network,
    status,
    createdAt,
    accountNo,
    routingNumber,
    swift,
    routingType: isDomestic ? 'ABA_CODE' : 'SWIFT',
    reference: accountName.includes('Hong Kong') ? 'FIDERE-HK-CLIENT' : 'FIDERE-SG-CLIENT',
    bankAddress,
    available: currency === 'USD' ? '82,430.27' : '96,037.39',
  }
}

function AccountVaInfoTab({ account, isDomestic, showAccountNumber, onToggleAccountNumber }) {
  const maskedAccountNo = account.accountNo ? `*****${account.accountNo.slice(-4)}` : '-'

  return (
    <div className="space-y-5">
      {isDomestic ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          为确保入账能够准确识别，请在转账时正确填写账户信息和 Reference。填写错误可能造成到账延迟或需要人工处理。
        </div>
      ) : null}

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>现有 VA 账户信息</CardTitle>
          <p className="text-sm text-slate-500">
            {isDomestic
              ? '用于显示现有 VA 账户的美国本地汇款信息。'
              : '用于显示现有 VA 账户的国际汇款信息。'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-blue-700">账户名称 | Account Name</p>
                <p className="mt-1 font-bold text-slate-950">{account.accountName}</p>
              </div>
              {isDomestic ? (
                <div>
                  <p className="text-sm font-semibold text-blue-700">收款路线号码 | ABA Routing Number</p>
                  <p className="mt-1 font-mono font-bold text-slate-950">{account.routingNumber} (Wire&ACH)</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-blue-700">SWIFT | BIC Code</p>
                  <p className="mt-1 font-mono font-bold text-slate-950">{account.swift}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-blue-700">银行账号 | Account Number</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="font-mono font-bold text-slate-950">{showAccountNumber ? account.accountNo : maskedAccountNo}</p>
                  <button type="button" onClick={onToggleAccountNumber} className="rounded-md p-1 text-slate-500 hover:bg-slate-100">
                    {showAccountNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-700">银行名称 | Bank Name</p>
                <p className="mt-1 font-bold text-slate-950">{account.bankName}</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-blue-700">银行地址 | Bank Address</p>
                <p className="mt-1 font-bold leading-6 text-slate-950">{account.bankAddress}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-700">Reference</p>
                <p className="mt-1 font-mono font-bold text-slate-950">{account.reference}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-700">币种 | Currency</p>
                <p className="mt-1 font-bold text-slate-950">{account.currency}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-700">状态 | Status</p>
                <Badge variant={account.status === 'ACTIVE' ? 'success' : 'secondary'}>{account.status === 'ACTIVE' ? '激活' : account.status}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const internalTransferApi = 'https://api-sandbox.interlace.money/open-api/v3/business/transfer/internal'

function GlobalAccountAssetsTab({ selectedClient, account, onStartConvert }) {
  const [assetAction, setAssetAction] = useState(null)
  const [assetCurrency, setAssetCurrency] = useState('USD')
  const [assetAmount, setAssetAmount] = useState('')
  const [assetNetwork, setAssetNetwork] = useState('TRX')
  const [assetAddress, setAssetAddress] = useState('')
  const [submittedAssetAction, setSubmittedAssetAction] = useState(null)
  const fiatAssets = selectedClient.accounts.filter((account) => account.type === 'US_ACCOUNT')
  const digitalAssets = selectedClient.accounts.filter((account) => account.type === 'DIGITAL')
  const allAssets = [...fiatAssets, ...digitalAssets]
  const selectedAsset = allAssets.find((asset) => asset.currency === assetCurrency) || allAssets[0]
  const numericAmount = Number(assetAmount || 0)
  const cryptoWithdrawFee = assetCurrency === 'USDT' && assetAction === 'withdraw' ? 1 : 0
  const estimatedReceive = Math.max(numericAmount - cryptoWithdrawFee, 0)
  const accountLabel = account?.accountName || selectedClient.globalAccounts?.[0]?.[0] || 'Singapore Global Account'
  const walletId = `cc-wallet-${selectedClient.id.toLowerCase()}`
  const balanceId = `balance-${selectedClient.id.toLowerCase()}-${(account?.currency || 'usd').toLowerCase()}`
  const primaryUserAccount = selectedClient.baasUserAccounts?.[0]

  const startConvert = (asset) => {
    onStartConvert?.({
      requestId: Date.now(),
      userAccountId: primaryUserAccount?.id || '',
      userAccountLabel: primaryUserAccount?.label || selectedClient.name,
      userAccountDisplayId: primaryUserAccount?.accountId || selectedClient.id,
      sourceAccountName: accountLabel,
      sourceAssetId: asset.id,
      sourceCurrency: asset.currency,
      sourceAvailable: asset.available,
    })
  }

  const openAssetAction = (action) => {
    setAssetAction(action)
    setAssetCurrency('USD')
    setAssetAmount('')
    setAssetNetwork('TRX')
    setAssetAddress('')
    setSubmittedAssetAction(null)
  }

  const closeAssetAction = () => {
    setAssetAction(null)
    setSubmittedAssetAction(null)
  }

  const submitAssetAction = () => {
    const isCryptoDeposit = assetAction === 'deposit' && assetCurrency !== 'USD'
    setSubmittedAssetAction({
      id: `${assetAction === 'deposit' ? 'DP' : 'WD'}-${Date.now().toString().slice(-8)}`,
      status: isCryptoDeposit ? '等待链上入账' : 'PROCESSING',
    })
  }

  return (
    <div className="space-y-5">
      <Card className="bg-white">
        <CardHeader className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle>全球账户资产</CardTitle>
            <p className="text-sm text-slate-500">用于展示全球账户中的法币资产和数字资产。</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={() => openAssetAction('deposit')} className="rounded-xl bg-blue-600 text-white hover:bg-blue-700">
              <ArrowDownToLine className="h-4 w-4" />
              充值
            </Button>
            <Button type="button" variant="outline" onClick={() => openAssetAction('withdraw')} className="rounded-xl">
              <ArrowUpFromLine className="h-4 w-4" />
              提现
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <div className="mb-3 text-sm font-bold text-slate-950">法币资产</div>
            <div className="grid gap-4 md:grid-cols-2">
              {fiatAssets.map((asset) => (
                <div
                  key={asset.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => startConvert(asset)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      startConvert(asset)
                    }
                  }}
                  className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-2xl font-bold text-slate-950">{formatAmount(asset.currency, asset.available)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{asset.currency}</Badge>
                      <Button type="button" size="sm" variant="outline" onClick={(event) => { event.stopPropagation(); startConvert(asset) }} className="rounded-xl bg-white">
                        <ArrowDownUp className="h-3.5 w-3.5" />
                        Convert
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-white px-3 py-2">
                      <div className="text-slate-500">冻结金额</div>
                      <div className="mt-1 font-bold text-slate-950">{formatAmount(asset.currency, asset.frozen)}</div>
                    </div>
                    <div className="rounded-xl bg-white px-3 py-2">
                      <div className="text-slate-500">处理中</div>
                      <div className="mt-1 font-bold text-slate-950">{formatAmount(asset.currency, asset.processing)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 text-sm font-bold text-slate-950">数字资产</div>
            <div className="grid gap-4 md:grid-cols-2">
              {digitalAssets.map((asset) => (
                <div
                  key={asset.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => startConvert(asset)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      startConvert(asset)
                    }
                  }}
                  className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-2xl font-bold text-slate-950">{asset.available.toLocaleString('en-US')} {asset.currency}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{asset.currency}</Badge>
                      <Button type="button" size="sm" variant="outline" onClick={(event) => { event.stopPropagation(); startConvert(asset) }} className="rounded-xl bg-white">
                        <ArrowDownUp className="h-3.5 w-3.5" />
                        Convert
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-white px-3 py-2">
                      <div className="text-slate-500">冻结金额</div>
                      <div className="mt-1 font-bold text-slate-950">{asset.frozen.toLocaleString('en-US')} {asset.currency}</div>
                    </div>
                    <div className="rounded-xl bg-white px-3 py-2">
                      <div className="text-slate-500">处理中</div>
                      <div className="mt-1 font-bold text-slate-950">{asset.processing.toLocaleString('en-US')} {asset.currency}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {assetAction ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">{assetAction === 'deposit' ? 'Deposit' : 'Withdraw'}</p>
                <h3 className="mt-1 text-xl font-bold text-slate-950">{assetAction === 'deposit' ? '充值' : '提现'}</h3>
              </div>
              <button type="button" onClick={closeAssetAction} className="rounded-full px-3 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700">×</button>
            </div>

            <div className="space-y-5 px-6 py-5">
              {submittedAssetAction ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <div>
                      <div className="font-bold text-emerald-900">操作已生成</div>
                      <p className="mt-1 text-sm leading-6 text-emerald-800">
                        编号 {submittedAssetAction.id}，状态 {submittedAssetAction.status}。原型中不连接真实 API，实际提交后由后台按接口返回结果更新余额和流水。
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">币种</span>
                  <select
                    value={assetCurrency}
                    onChange={(event) => {
                      setAssetCurrency(event.target.value)
                      setAssetAmount('')
                      setAssetAddress('')
                    }}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-500"
                  >
                    {allAssets.map((asset) => <option key={asset.id} value={asset.currency}>{asset.currency}</option>)}
                  </select>
                </label>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold text-slate-500">当前可用</div>
                  <div className="mt-1 text-lg font-bold text-slate-950">
                    {selectedAsset?.type === 'DIGITAL'
                      ? `${selectedAsset.available.toLocaleString('en-US')} ${selectedAsset.currency}`
                      : formatAmount(selectedAsset?.currency || 'USD', selectedAsset?.available || 0)}
                  </div>
                </div>
              </div>

              {assetCurrency === 'USD' ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs font-semibold text-slate-500">{assetAction === 'deposit' ? '转出账户' : '转出钱包'}</div>
                      <div className="mt-2 font-bold text-slate-950">{assetAction === 'deposit' ? accountLabel : 'Crypto Connect · USD 钱包'}</div>
                      <div className="mt-1 text-xs text-slate-500">{assetAction === 'deposit' ? `balanceId: ${balanceId}` : `walletId: ${walletId}`}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs font-semibold text-slate-500">{assetAction === 'deposit' ? '充值到' : '提现到'}</div>
                      <div className="mt-2 font-bold text-slate-950">{assetAction === 'deposit' ? 'Crypto Connect · USD 钱包' : accountLabel}</div>
                      <div className="mt-1 text-xs text-slate-500">{assetAction === 'deposit' ? `walletId: ${walletId}` : `balanceId: ${balanceId}`}</div>
                    </div>
                  </div>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">{assetAction === 'deposit' ? '充值金额' : '提现金额'}</span>
                    <div className="relative mt-2">
                      <input
                        type="number"
                        min="0"
                        value={assetAmount}
                        onChange={(event) => setAssetAmount(event.target.value)}
                        placeholder="10.00"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 pr-16 text-sm font-semibold text-slate-950 outline-none focus:border-blue-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">USD</span>
                    </div>
                  </label>

                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-600">手续费</span>
                      <span className="font-bold text-slate-950">USD 0.00</span>
                    </div>
                    <div className="mt-2 flex justify-between gap-4">
                      <span className="text-slate-600">预计到账</span>
                      <span className="font-bold text-slate-950">{formatAmount('USD', numericAmount)}</span>
                    </div>
                    <div className="mt-3 rounded-xl bg-white px-3 py-2 font-mono text-xs text-blue-700">
                      POST {internalTransferApi}
                    </div>
                  </div>
                </div>
              ) : assetAction === 'deposit' ? (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">充值网络</span>
                    <select value={assetNetwork} onChange={(event) => setAssetNetwork(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-500">
                      {['TRX', 'ETH', 'ARB', 'BASE'].map((network) => <option key={network} value={network}>{network}</option>)}
                    </select>
                  </label>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-semibold text-slate-700">充值地址</div>
                    <div className="mt-2 break-all rounded-xl bg-white p-3 font-mono text-sm font-semibold text-slate-950">
                      {assetNetwork === 'TRX' ? 'TQz9nA4Gv8m2fFidereDemo7aL9' : '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'}
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">复用原资产管理逻辑：若该网络无地址，则调用创建地址接口后展示；链上入账后由后台同步余额。</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">提现网络</span>
                    <select value={assetNetwork} onChange={(event) => setAssetNetwork(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-500">
                      {['TRX', 'ETH', 'ARB', 'BASE'].map((network) => <option key={network} value={network}>{network}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">提现地址</span>
                    <input value={assetAddress} onChange={(event) => setAssetAddress(event.target.value)} placeholder="请输入链上钱包地址" className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-500" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">提现金额</span>
                    <input type="number" min="0" value={assetAmount} onChange={(event) => setAssetAmount(event.target.value)} placeholder="10.00" className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-500" />
                  </label>
                  <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-600">预估链上手续费</span>
                      <span className="font-bold text-slate-950">1.00 USDT</span>
                    </div>
                    <div className="mt-2 flex justify-between gap-4">
                      <span className="text-slate-600">预计到账</span>
                      <span className="font-bold text-slate-950">{estimatedReceive.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
              <Button type="button" variant="outline" className="rounded-xl" onClick={closeAssetAction}>关闭</Button>
              <Button
                type="button"
                className="rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                disabled={submittedAssetAction || (assetCurrency === 'USD' && numericAmount <= 0) || (assetAction === 'withdraw' && assetCurrency !== 'USD' && (!assetAddress || numericAmount <= 0))}
                onClick={submitAssetAction}
              >
                {assetAction === 'deposit' ? '确认充值' : '确认提现'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function AccountPayeesTab({ selectedClient, counterparties, onCreateCounterparty }) {
  const [isAddingPayee, setIsAddingPayee] = useState(false)
  const primaryBaasAccountId = selectedClient.baasUserAccounts?.[0]?.id || ''
  const primaryBaasAccountLabel = getBaasUserAccountLabel(selectedClient, primaryBaasAccountId)
  const accountCounterparties = counterparties.filter((row) => row[0] === primaryBaasAccountLabel)

  if (isAddingPayee) {
    return (
      <AddPayeeFlow
        selectedClient={selectedClient}
        onCancel={() => setIsAddingPayee(false)}
        onSubmit={(counterparty) => {
          onCreateCounterparty(counterparty)
          setIsAddingPayee(false)
        }}
      />
    )
  }

  return (
    <Card className="overflow-hidden bg-white">
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <CardTitle>收款人</CardTitle>
          <p className="text-sm text-slate-500">展示当前账户已维护的收款人，可从这里继续添加收款人。</p>
        </div>
        <Button type="button" onClick={() => setIsAddingPayee(true)} className="rounded-xl bg-slate-950 text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" />
          新增收款人
        </Button>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
            <tr>
              {['BaaS Account', 'Relation', 'Legal Name', 'Currency', 'Status', 'Purpose'].map((item) => (
                <th key={item} className="px-5 py-4">{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {accountCounterparties.map((row) => (
              <tr key={row.join('-')} className="border-t border-slate-100">
                {row.map((value, index) => (
                  <td key={`${value}-${index}`} className="px-5 py-4">
                    {index === 4 ? <Badge variant="success">{value}</Badge> : value}
                  </td>
                ))}
              </tr>
            ))}
            {accountCounterparties.length === 0 ? (
              <tr>
                <td colSpan={6} className="border-t border-slate-100 px-5 py-10 text-center text-sm text-slate-500">暂无收款人</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function AccountDetailView({ row, selectedClient, counterparties, onCreateCounterparty, onStartConvert, onStartCreateTransfer, onBack }) {
  const [showAccountNumber, setShowAccountNumber] = useState(false)
  const [activeTab, setActiveTab] = useState('va')
  const account = buildAccountDetail(row)
  const isDomestic = account.routingType === 'ABA_CODE'
  const primaryUserAccount = selectedClient.baasUserAccounts?.[0]
  const tabs = [
    { id: 'va', label: '现有 VA 账户', description: '用于显示现有的账户信息' },
    { id: 'global', label: '全球账户', description: '用于显示全球账户中的数字资产、法币资产' },
    { id: 'payees', label: '收款人', description: '当前账户所拥有的收款人' },
  ]

  return (
    <div className="space-y-6">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
        <ArrowLeft className="h-4 w-4" />
        返回账户列表
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">{account.accountName}</h1>
          <p className="mt-2 text-sm text-slate-500">Create Time: {account.createdAt}</p>
        </div>
        <div className="flex flex-wrap items-start justify-end gap-4">
          <Button
            type="button"
            onClick={() => onStartCreateTransfer?.({
              requestId: Date.now(),
              userAccountId: primaryUserAccount?.id || '',
              userAccountLabel: primaryUserAccount?.label || selectedClient.name,
              userAccountDisplayId: primaryUserAccount?.accountId || selectedClient.id,
              sourceAccountName: account.accountName,
              sourceCurrency: account.currency,
              sourceAvailable: Number(String(account.available).replace(/,/g, '')) || 0,
            })}
            className="rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
            创建交易
          </Button>
          <div className="text-right">
            <div className="text-sm text-slate-500">可用余额</div>
            <div className="mt-1 text-2xl font-bold text-slate-950">{account.available} {account.currency}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {tabs.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-2xl border px-4 py-4 text-left transition-colors ${active ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'}`}
            >
              <div className="text-base font-bold">{tab.label}</div>
              <div className="mt-1 text-xs leading-5">{tab.description}</div>
            </button>
          )
        })}
      </div>

      {activeTab === 'va' ? (
        <AccountVaInfoTab
          account={account}
          isDomestic={isDomestic}
          showAccountNumber={showAccountNumber}
          onToggleAccountNumber={() => setShowAccountNumber((current) => !current)}
        />
      ) : null}
      {activeTab === 'global' ? <GlobalAccountAssetsTab selectedClient={selectedClient} account={account} onStartConvert={onStartConvert} /> : null}
      {activeTab === 'payees' ? (
        <AccountPayeesTab
          selectedClient={selectedClient}
          counterparties={counterparties}
          onCreateCounterparty={onCreateCounterparty}
        />
      ) : null}
    </div>
  )
}

function CreateAccountDialog({ selectedClient, onClose, onCreated }) {
  const [form, setForm] = useState({
    ...defaultCreateAccountForm,
    name: selectedClient.name,
  })
  const [submittedAccount, setSubmittedAccount] = useState(null)
  const canSubmit = Boolean(
    form.email.trim() &&
    form.name.trim() &&
    form.username.trim() &&
    form.password.length >= 8 &&
    (!isCompany || form.accountId.trim()),
  )

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const submit = () => {
    if (!canSubmit || submittedAccount) return

    const timestamp = Date.now()
    const createdAccount = {
      id: `baas-user-${timestamp}`,
      trustUserAccountId: selectedClient.id,
      trustUserAccountName: selectedClient.name,
      baasAccountId: `BAAS-${selectedClient.id}-${timestamp.toString().slice(-6)}`,
      createdAt: formatDateTime(),
      name: form.name.trim(),
      email: form.email.trim(),
      username: form.username.trim(),
      phone: form.phoneCountryCode && form.phoneNumber ? `+${form.phoneCountryCode} ${form.phoneNumber}` : '-',
      kycStatus: '未提交',
      vaStatus: '未创建',
    }
    setSubmittedAccount(createdAccount)
    onCreated?.(createdAccount)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-blue-600">BaaS 账户创建</div>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">创建BaaS账户</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              这里仅创建当前 BaaS 内部账户，并关联信托项目中的用户账号。KYC 资料提交需要在创建后的用户列表中针对该用户继续操作。
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700">×</button>
        </div>

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-2">
              <div className="lg:col-span-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm">
                <div className="text-slate-500">关联信托项目用户账号</div>
                <div className="mt-1 font-bold text-slate-950">{selectedClient.name} · {selectedClient.id}</div>
              </div>
              <FormField label="BaaS账户名称" required>
                <input value={form.name} onChange={(event) => updateForm('name', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-500" placeholder="请输入BaaS账户名称" />
              </FormField>
              <FormField label="登录邮箱" required>
                <input type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-500" placeholder="user@example.com" />
              </FormField>
              <FormField label="用户名" required>
                <input value={form.username} onChange={(event) => updateForm('username', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-500" placeholder="用于登录的用户名" />
              </FormField>
              <FormField label="密码" required>
                <input type="password" value={form.password} onChange={(event) => updateForm('password', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-500" placeholder="至少 8 位" />
              </FormField>
              <FormField label="国际拨号代码">
                <input value={form.phoneCountryCode} onChange={(event) => updateForm('phoneCountryCode', event.target.value.replace(/\D/g, '').slice(0, 3))} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-500" placeholder="86" />
              </FormField>
              <FormField label="电话号码">
                <input value={form.phoneNumber} onChange={(event) => updateForm('phoneNumber', event.target.value.replace(/\D/g, '').slice(0, 15))} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-500" placeholder="14155552671" />
              </FormField>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                <div>
                  <div className="font-bold text-slate-950">流程说明</div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    创建成功后，页面会在 BaaS 用户列表中新增该用户。后续提交 KYC 资料、等待 KYC 审核、创建 VA 账户，都从用户列表的操作按钮进入。
                  </p>
                </div>
              </div>
            </div>

            {submittedAccount ? (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                  <div>
                    <div className="font-bold text-emerald-900">BaaS账户已创建</div>
                    <p className="mt-1 text-sm leading-6 text-emerald-800">
                      BaaS账户ID：{submittedAccount.baasAccountId}。下一步请回到用户列表，对该用户执行“提交KYC资料”。
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-bold text-slate-950">提交摘要</div>
              <div className="mt-4 space-y-3 text-sm">
                {[
                  ['客户', selectedClient.name],
                  ['信托项目用户账号', selectedClient.id],
                  ['BaaS账户名称', form.name || '-'],
                  ['登录邮箱', form.email || '-'],
                  ['用户名', form.username || '-'],
                  ['KYC状态', '创建后未提交'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <span className="text-slate-500">{label}</span>
                    <span className="text-right font-bold text-slate-950">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <div className="text-sm font-bold text-amber-900">关键接口注释</div>
              <div className="mt-3 space-y-2">
                {createBaasAccountApiNotes.map((note) => (
                  <div key={note} className="break-all rounded-xl bg-white/80 px-3 py-2 font-mono text-xs font-semibold text-slate-800">
                    {note}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-amber-800">
                当前弹窗不提交第三方 KYC 接口。KYC 与 VA 创建在用户列表中针对具体用户继续执行。
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
          <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>{submittedAccount ? '关闭' : '取消'}</Button>
          <Button type="button" disabled={!canSubmit || Boolean(submittedAccount)} className="rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300" onClick={submit}>
            <Plus className="h-4 w-4" />
            {submittedAccount ? '已创建' : '确认创建BaaS账户'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function getKycBadgeVariant(status) {
  if (status === 'KYC已通过') return 'success'
  if (status === 'KYC审核中') return 'warning'
  return 'secondary'
}

function getVaBadgeVariant(status) {
  if (status === 'VA已创建') return 'success'
  return 'secondary'
}

function getBaasUserAction(user) {
  if (user.kycStatus === '未提交') return { label: '提交KYC资料', patch: { kycStatus: 'KYC审核中' } }
  if (user.kycStatus === 'KYC审核中') return { label: '演示KYC通过', patch: { kycStatus: 'KYC已通过' } }
  if (user.kycStatus === 'KYC已通过' && user.vaStatus !== 'VA已创建') return { label: '创建VA账户', patch: { vaStatus: 'VA已创建' } }
  return null
}

function BaasUserList({ users, onUpdateUser }) {
  return (
    <Card className="overflow-hidden bg-white">
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <CardTitle>BaaS用户列表</CardTitle>
          <p className="text-sm text-slate-500">创建 BaaS 账户后，在这里对具体用户提交 KYC 资料；KYC 审核通过后才能继续创建 VA 账户。</p>
        </div>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
            <tr>
              {['信托项目用户账号', 'BaaS账户', '登录信息', 'KYC状态', 'VA账户状态', '创建时间', '操作'].map((item) => (
                <th key={item} className="px-5 py-4">{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const action = getBaasUserAction(user)
              return (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-950">{user.trustUserAccountName}</div>
                    <div className="mt-1 text-xs text-slate-500">{user.trustUserAccountId}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-950">{user.name}</div>
                    <div className="mt-1 font-mono text-xs text-slate-500">{user.baasAccountId}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div>{user.email}</div>
                    <div className="mt-1 text-xs text-slate-500">{user.username}</div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={getKycBadgeVariant(user.kycStatus)}>{user.kycStatus}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={getVaBadgeVariant(user.vaStatus)}>{user.vaStatus}</Badge>
                  </td>
                  <td className="px-5 py-4">{user.createdAt}</td>
                  <td className="px-5 py-4">
                    {action ? (
                      <Button type="button" variant="outline" className="rounded-xl" onClick={() => onUpdateUser(user.id, action.patch)}>
                        {action.label}
                      </Button>
                    ) : (
                      <span className="text-sm font-semibold text-slate-400">已完成</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 border-t border-slate-100 bg-slate-50 p-4 lg:grid-cols-3">
        {baasUserOperationApiNotes.map(([title, ...apis]) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-bold text-slate-950">{title}</div>
            <div className="mt-3 space-y-2">
              {apis.map((api) => (
                <div key={api} className="break-all rounded-xl bg-slate-50 px-3 py-2 font-mono text-xs font-semibold text-slate-700">
                  {api}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function AccountsView({ selectedClient, counterparties, onCreateCounterparty, onStartConvert, onStartCreateTransfer }) {
  const [selectedAccountRow, setSelectedAccountRow] = useState(null)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [createdAccount, setCreatedAccount] = useState(null)
  const [baasUsers, setBaasUsers] = useState(() => createInitialBaasUsers(selectedClient))

  const handleCreatedAccount = (account) => {
    setCreatedAccount(account)
    setBaasUsers((current) => [account, ...current])
  }

  const updateBaasUser = (userId, patch) => {
    setBaasUsers((current) => current.map((user) => {
      if (user.id !== userId) return user
      const updatedUser = { ...user, ...patch }
      if (createdAccount?.id === userId) {
        setCreatedAccount(updatedUser)
      }
      return updatedUser
    }))
  }

  if (selectedAccountRow) {
    return (
      <AccountDetailView
        row={selectedAccountRow}
        selectedClient={selectedClient}
        counterparties={counterparties}
        onCreateCounterparty={onCreateCounterparty}
        onStartConvert={onStartConvert}
        onStartCreateTransfer={onStartCreateTransfer}
        onBack={() => setSelectedAccountRow(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="账户信息"
        description="集中展示客户名下 Global Account、香港信托账户、美国账户和数字资产账户，运营可从这里复制执行信息。"
        actions={(
          <Button type="button" onClick={() => setIsCreatingAccount(true)} className="rounded-xl bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            创建账户
          </Button>
        )}
      />
      {createdAccount ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-semibold">最近创建BaaS账户：{createdAccount.name} · {createdAccount.baasAccountId}</span>
          </div>
          <span>{createdAccount.kycStatus} · {createdAccount.vaStatus}</span>
        </div>
      ) : null}
      <BaasUserList users={baasUsers} onUpdateUser={updateBaasUser} />
      <FilterBar placeholders={['搜索账户名或 Account ID', '币种', '状态']} actionLabel="导出账户" />
      <Card className="overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
              <tr>
                {['Account Name', 'Currency', 'Bank Name', 'Network', 'Status', 'Create Time', 'Action'].map((item) => (
                  <th key={item} className="px-5 py-4">{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedClient.globalAccounts.map((row) => (
                <tr key={row.join('-')} className="border-t border-slate-100">
                  {row.map((value, index) => (
                    <td key={`${value}-${index}`} className="px-5 py-4">
                      {index === 4 ? <Badge variant="success">{value}</Badge> : value}
                    </td>
                  ))}
                  <td className="px-5 py-4">
                    <button type="button" onClick={() => setSelectedAccountRow(row)} className="font-semibold text-slate-900 underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {isCreatingAccount ? (
        <CreateAccountDialog
          selectedClient={selectedClient}
          onClose={() => setIsCreatingAccount(false)}
          onCreated={handleCreatedAccount}
        />
      ) : null}
    </div>
  )
}

function PayeeWorkflowStepper({ step }) {
  const steps = [
    { id: 1, label: '选择汇款方式', icon: Globe },
    { id: 2, label: '填写账户信息', icon: CreditCard },
    { id: 3, label: '确认提交', icon: CheckCircle2 },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
      {steps.map((item) => {
        const Icon = item.icon
        const active = step === item.id
        const completed = step > item.id
        return (
          <div key={item.id} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${active ? 'bg-blue-50 text-blue-700' : completed ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'}`}>
            {completed ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
            {item.label}
          </div>
        )
      })}
    </div>
  )
}

function FormField({ label, required, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{required ? <span className="text-red-500">*</span> : null} {label}</span>
      <div className="mt-2">{children}</div>
    </label>
  )
}

function AddPayeeFlow({ selectedClient, onCancel, onSubmit }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ ...defaultPayeeForm, accountId: selectedClient.baasUserAccounts?.[0]?.id || '' })
  const [paymentMethods, setPaymentMethods] = useState([])
  const [methodError, setMethodError] = useState('')
  const selectedMethod = paymentMethodMeta[form.paymentMethod]
  const canUseStep1 = Boolean(form.accountId && form.country && form.currency && form.paymentMethod)
  const canUseStep2 = Boolean(
    form.paymentType &&
    form.payeeName.trim() &&
    form.accountNumber.trim() &&
    form.routingCode.trim() &&
    form.bankCountry &&
    form.payeeCountry &&
    form.payeeAddress.trim(),
  )

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleCountryChange = (country) => {
    setForm((current) => ({
      ...current,
      country,
      bankCountry: country,
      paymentMethod: '',
    }))
    setPaymentMethods([])
    setMethodError('')
  }

  const handleCurrencyChange = (currency) => {
    setForm((current) => ({ ...current, currency, paymentMethod: '' }))
    setPaymentMethods([])
    setMethodError('')
  }

  const fetchPaymentMethods = () => {
    if (!form.country || !form.currency) {
      setMethodError('请先选择国家/地区和币种')
      return
    }
    setPaymentMethods(getPaymentMethods(form.country, form.currency))
    setMethodError('')
  }

  const nextStep = () => {
    if (step === 1 && !canUseStep1) return
    if (step === 2 && !canUseStep2) return
    setStep((current) => Math.min(current + 1, 3))
  }

  const submitPayee = () => {
    const method = paymentMethodMeta[form.paymentMethod]
    onSubmit([
      getBaasUserAccountLabel(selectedClient, form.accountId),
      form.paymentType === 'COMPANY' ? 'THIRD PARTY' : 'INDIVIDUAL',
      form.payeeName.trim().toUpperCase(),
      form.currency,
      'Active',
      `${method.label} · ${form.bankName || 'Bank'} · ${form.comments || '收款方账户'}`,
    ])
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="添加收款方"
        description={`当前客户：${selectedClient.name}。先选择收款方所属 BaaS 用户账户，再选择国家/币种、付款方式、账户信息并确认提交。`}
        actions={<Button type="button" variant="outline" className="rounded-xl" onClick={onCancel}>返回列表</Button>}
      />
      <PayeeWorkflowStepper step={step} />

      {step === 1 ? (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>选择汇款方式</CardTitle>
            <p className="text-sm text-slate-500">收款方必须归属于 BaaS 中的用户账户，不绑定香港信托账户或美国账户等资金账户。</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-3">
              <FormField label="所属 BaaS 用户账户" required>
                <select value={form.accountId} onChange={(event) => updateForm('accountId', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500">
                  {(selectedClient.baasUserAccounts || []).map((account) => (
                    <option key={account.id} value={account.id}>{account.label} · {account.accountId}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="选择国家/地区" required>
                <select value={form.country} onChange={(event) => handleCountryChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500">
                  {payeeCountries.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}
                </select>
              </FormField>
              <FormField label="选择币种" required>
                <select value={form.currency} onChange={(event) => handleCurrencyChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500">
                  {payeeCurrencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
                </select>
              </FormField>
            </div>
            <Button type="button" className="w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800" onClick={fetchPaymentMethods}>
              获取付款方式
            </Button>
            {methodError ? (
              <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4" />
                {methodError}
              </div>
            ) : null}
            {paymentMethods.length > 0 ? (
              <div className="space-y-3">
                <div className="text-sm font-semibold text-slate-700">付款方式</div>
                {paymentMethods.map((methodId) => {
                  const method = paymentMethodMeta[methodId]
                  const active = form.paymentMethod === methodId
                  return (
                    <button
                      key={methodId}
                      type="button"
                      onClick={() => updateForm('paymentMethod', methodId)}
                      className={`w-full rounded-xl border px-4 py-4 text-left transition-colors ${active ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-200'}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-bold text-slate-950">{method.label}</div>
                          <div className="mt-1 text-sm text-slate-500">{method.description}</div>
                        </div>
                        <Badge variant={active ? 'default' : 'secondary'}>{method.time}</Badge>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>填写账户信息</CardTitle>
            <p className="text-sm text-slate-500">请准确填写收款方的银行账户、银行地址和收款方地址。</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <FormField label="账户类型" required>
                <select value={form.paymentType} onChange={(event) => updateForm('paymentType', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500">
                  <option value="COMPANY">企业</option>
                  <option value="INDIVIDUAL">个人</option>
                </select>
              </FormField>
              <FormField label="收款方名称" required>
                <input value={form.payeeName} onChange={(event) => updateForm('payeeName', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" placeholder="请输入收款方名称" />
              </FormField>
              <FormField label="币种" required>
                <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-950">{form.currency}</div>
              </FormField>
              <FormField label="银行账号/IBAN" required>
                <input value={form.accountNumber} onChange={(event) => updateForm('accountNumber', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" placeholder="请输入银行账号或 IBAN" />
              </FormField>
              <FormField label={selectedMethod?.routingCodeLabel || '路由代码'} required>
                <input value={form.routingCode} onChange={(event) => updateForm('routingCode', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" placeholder={`请输入${selectedMethod?.routingCodeLabel || '路由代码'}`} />
              </FormField>
              <FormField label="银行名称">
                <input value={form.bankName} onChange={(event) => updateForm('bankName', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" placeholder="请输入银行名称" />
              </FormField>
            </div>

            <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-2">
              <div className="lg:col-span-2 text-sm font-bold text-slate-950">银行地址</div>
              <FormField label="银行国家" required>
                <select value={form.bankCountry} onChange={(event) => updateForm('bankCountry', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500">
                  {payeeCountries.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}
                </select>
              </FormField>
              <FormField label="银行城市">
                <input value={form.bankCity} onChange={(event) => updateForm('bankCity', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
              </FormField>
              <FormField label="银行州/省">
                <input value={form.bankState} onChange={(event) => updateForm('bankState', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
              </FormField>
              <FormField label="银行邮编">
                <input value={form.bankPostalCode} onChange={(event) => updateForm('bankPostalCode', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
              </FormField>
              <div className="lg:col-span-2">
                <FormField label="银行地址">
                  <input value={form.bankAddress} onChange={(event) => updateForm('bankAddress', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
                </FormField>
              </div>
            </div>

            <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-2">
              <div className="lg:col-span-2 text-sm font-bold text-slate-950">收款方地址</div>
              <FormField label="收款方国家" required>
                <select value={form.payeeCountry} onChange={(event) => updateForm('payeeCountry', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500">
                  {payeeCountries.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}
                </select>
              </FormField>
              <FormField label="收款方城市">
                <input value={form.payeeCity} onChange={(event) => updateForm('payeeCity', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
              </FormField>
              <FormField label="收款方州/省">
                <input value={form.payeeState} onChange={(event) => updateForm('payeeState', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
              </FormField>
              <FormField label="收款方邮编">
                <input value={form.payeePostalCode} onChange={(event) => updateForm('payeePostalCode', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
              </FormField>
              <div className="lg:col-span-2">
                <FormField label="收款方地址" required>
                  <input value={form.payeeAddress} onChange={(event) => updateForm('payeeAddress', event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
                </FormField>
              </div>
              <div className="lg:col-span-2">
                <FormField label="备注">
                  <textarea value={form.comments} onChange={(event) => updateForm('comments', event.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold outline-none focus:border-blue-500" placeholder="请输入备注" />
                </FormField>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              错误的银行账户信息可能导致汇款延迟或失败，请仔细核对收款方提供的账户信息。
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === 3 ? (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>确认提交</CardTitle>
            <p className="text-sm text-slate-500">请确认以下信息无误后提交。</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-center">
                <Globe className="mx-auto h-5 w-5 text-blue-700" />
                <div className="mt-2 text-xs font-semibold text-blue-700">国家/币种</div>
                <div className="mt-1 font-bold text-slate-950">{getCountryName(form.country)} / {form.currency}</div>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-center">
                <CreditCard className="mx-auto h-5 w-5 text-blue-700" />
                <div className="mt-2 text-xs font-semibold text-blue-700">付款方式</div>
                <div className="mt-1 font-bold text-slate-950">{selectedMethod?.label}</div>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-center">
                <User className="mx-auto h-5 w-5 text-blue-700" />
                <div className="mt-2 text-xs font-semibold text-blue-700">账户类型</div>
                <div className="mt-1 font-bold text-slate-950">{form.paymentType === 'COMPANY' ? '企业' : '个人'}</div>
              </div>
            </div>
            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
              {[
                ['所属 BaaS 用户账户', getBaasUserAccountLabel(selectedClient, form.accountId)],
                ['收款方名称', form.payeeName || '-'],
                ['银行账号/IBAN', form.accountNumber || '-'],
                [selectedMethod?.routingCodeLabel || '路由代码', form.routingCode || '-'],
                ['银行名称', form.bankName || '-'],
                ['银行地址', `${getCountryName(form.bankCountry)} ${form.bankCity} ${form.bankAddress}`.trim()],
                ['收款方地址', `${getCountryName(form.payeeCountry)} ${form.payeeCity} ${form.payeeAddress}`.trim()],
                ['备注', form.comments || '-'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-white px-4 py-3 text-sm">
                  <div className="text-slate-500">{label}</div>
                  <div className="mt-1 font-bold text-slate-950">{value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex justify-end gap-3">
        {step > 1 ? <Button type="button" variant="outline" className="rounded-xl" onClick={() => setStep(step - 1)}>上一步</Button> : null}
        {step < 3 ? (
          <Button type="button" disabled={(step === 1 && !canUseStep1) || (step === 2 && !canUseStep2)} className="rounded-xl bg-slate-950 text-white hover:bg-slate-800" onClick={nextStep}>下一步</Button>
        ) : (
          <Button type="button" className="rounded-xl bg-blue-600 text-white hover:bg-blue-700" onClick={submitPayee}>提交收款方</Button>
        )}
      </div>
    </div>
  )
}

function CounterpartiesView({ selectedClient, counterparties, onCreateCounterparty }) {
  const [isAddingPayee, setIsAddingPayee] = useState(false)

  if (isAddingPayee) {
    return (
      <AddPayeeFlow
        selectedClient={selectedClient}
        onCancel={() => setIsAddingPayee(false)}
        onSubmit={(counterparty) => {
          onCreateCounterparty(counterparty)
          setIsAddingPayee(false)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="收款人管理"
        description="运营为客户维护 beneficiary/counterparty，客户视角只看到收款人资料，BaaS Payee 映射仅管理端可见。"
        actions={<Button type="button" onClick={() => setIsAddingPayee(true)} className="rounded-xl bg-slate-950 text-white hover:bg-slate-800"><Plus className="h-4 w-4" />新增收款人</Button>}
      />
      <FilterBar placeholders={['选择客户账户', '搜索 Legal Name', 'Status']} actionLabel="导出名单" />
      <Card className="overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
              <tr>
                {['BaaS Account', 'Relation', 'Legal Name', 'Currency', 'Status', 'Purpose', 'Actions'].map((item) => (
                  <th key={item} className="px-5 py-4">{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {counterparties.map((row) => (
                <tr key={row.join('-')} className="border-t border-slate-100">
                  {row.map((value, index) => (
                    <td key={`${value}-${index}`} className="px-5 py-4">
                      {index === 4 ? <Badge variant="success">{value}</Badge> : value}
                    </td>
                  ))}
                  <td className="px-5 py-4">
                    <div className="flex gap-3">
                      <button type="button" className="font-semibold underline">View</button>
                      <button type="button" className="font-semibold underline">Inactive</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

const paymentPurposeOptions = [
  { id: 'GOODS_SERVICE', label: '货物贸易 / 服务费' },
  { id: 'VENDOR_PAYMENT', label: '供应商付款' },
  { id: 'TREASURY', label: '资金调拨' },
  { id: 'OTHER_BUSINESS', label: '其他商业付款' },
]

const convertCurrencyMeta = {
  USDT: { label: 'USDT', color: 'bg-emerald-500', text: '₮' },
  USDGO: { label: 'USDGO', color: 'bg-lime-400', text: '$' },
  USD: { label: 'USD', color: 'bg-blue-500', text: '$' },
  HKD: { label: 'HKD', color: 'bg-rose-500', text: 'HK' },
}

const getDefaultConvertTarget = (currency) => {
  if (currency === 'USDT') return 'USDGO'
  if (currency === 'USDGO') return 'USDT'
  if (currency === 'USD') return 'HKD'
  return 'USD'
}

const getConvertRate = (fromCurrency, toCurrency) => {
  const pair = `${fromCurrency}/${toCurrency}`
  const rates = {
    'USDT/USDGO': 0.99834,
    'USDGO/USDT': 1.00166,
    'USD/HKD': 7.7925,
    'HKD/USD': 0.1283,
  }
  return rates[pair] || 1
}

const createPaymentPayees = (selectedClient, counterparties, userAccountId) => {
  const baasAccountLabel = getBaasUserAccountLabel(selectedClient, userAccountId)
  return counterparties
    .filter((row) => row[0] === baasAccountLabel && row[4] === 'Active')
    .map((row, index) => {
      const currency = row[3]
      return {
        id: `${userAccountId}-${index}-${row[2]}`,
        name: row[2],
        relation: row[1],
        currency,
        paymentType: row[1] === 'INDIVIDUAL' ? '个人账户' : '企业账户',
        bankName: row[5]?.split('·')[1]?.trim() || (row[1] === 'SELF OWNED' ? 'ZA Bank Limited' : 'HSBC Hong Kong'),
        accountNumber: index === 0 ? '894200731114' : `8800${index + 7311}9042`,
        swift: currency === 'USD' ? 'CITIUS33XXX' : 'ZABKHKHHXXX',
        country: currency === 'HKD' ? 'Hong Kong' : 'United States',
        transferMethod: currency === 'EUR' ? 'SEPA汇款' : currency === 'USD' ? 'WIRE / SWIFT' : 'SWIFT汇款',
        purpose: row[5],
      }
    })
}

function CreateTransferView({ selectedClient, counterparties, initialContext, onSubmitOrder }) {
  const [selectedUserAccountId, setSelectedUserAccountId] = useState(initialContext?.userAccountId || selectedClient.baasUserAccounts?.[0]?.id || '')
  const paymentAccounts = selectedClient.accounts.filter((account) => account.type !== 'DIGITAL')
  const [recipientId, setRecipientId] = useState('')
  const [amount, setAmount] = useState('1000')
  const [remittancePurpose, setRemittancePurpose] = useState(paymentPurposeOptions[0].id)
  const [note, setNote] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const selectedUserAccount = selectedClient.baasUserAccounts?.find((account) => account.id === selectedUserAccountId)
  const selectedPaymentAccount = paymentAccounts[0]
  const payees = createPaymentPayees(selectedClient, counterparties, selectedUserAccountId)
  const selectedPayee = payees.find((payee) => payee.id === recipientId) || payees[0]
  const numericAmount = Number(amount)
  const hasAmount = Number.isFinite(numericAmount) && numericAmount > 0
  const balance = selectedPaymentAccount?.available || 0
  const baseFee = selectedPayee?.transferMethod.includes('SWIFT') ? 18 : 12
  const serviceFee = selectedPayee ? 5 : 0
  const totalFee = hasAmount && selectedPayee ? baseFee + serviceFee : 0
  const totalPayment = hasAmount ? numericAmount + totalFee : 0
  const recipientReceives = hasAmount ? numericAmount : 0
  const currency = selectedPaymentAccount?.currency || selectedPayee?.currency || 'USD'
  const canSubmit = Boolean(selectedUserAccount && selectedPaymentAccount && selectedPayee && hasAmount && remittancePurpose && totalPayment <= balance)
  const selectedPurpose = paymentPurposeOptions.find((purpose) => purpose.id === remittancePurpose)
  const paymentAccountDisplayName = selectedPaymentAccount?.type === 'TRUST' ? 'va账户' : selectedPaymentAccount?.label

  const handleUserAccountChange = (accountId) => {
    setSelectedUserAccountId(accountId)
    setRecipientId('')
  }

  const submitOrder = () => {
    if (!canSubmit) return
    onSubmitOrder({
      id: `PO-${Date.now()}`,
      createdByRole: 'OPERATOR',
      createdForClientId: selectedClient.id,
      type: '转出订单',
      historyCategory: 'transfer-out',
      sourceAccountType: selectedPaymentAccount.type,
      targetAccountType: 'BENEFICIARY',
      sourceDisplay: paymentAccountDisplayName,
      targetDisplay: selectedPayee.name,
      currency,
      amountDisplay: formatAmount(currency, numericAmount),
      feeAmountDisplay: formatAmount(currency, totalFee),
      estimatedArrivalAmount: formatAmount(selectedPayee.currency, recipientReceives),
      clientVisibleStatus: '处理中',
      adminExecutionStatus: 'PAYMENT_SUBMITTED',
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
      auditTrail: [
        `${operatorProfile.name} 为 ${selectedUserAccount.accountId} 发起付款`,
        `付款账户 ${paymentAccountDisplayName}`,
        `收款人 ${selectedPayee.name}`,
        `用途 ${selectedPurpose?.label || remittancePurpose}`,
      ],
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="发起付款"
        description="运营先确认 BaaS 用户账户，再确认付款账户、收款人、金额和汇款用途，最后确认提交付款。"
        actions={(
          <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Clock className="h-4 w-4" />
            预计到账：1-3 个工作日
          </div>
        )}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Card className="overflow-hidden border-l-4 border-l-blue-500 bg-white">
            <CardHeader className="bg-blue-50/60">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <User className="h-4 w-4" />
                </div>
                <CardTitle>用户账户确认</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="BaaS 用户账户" required>
                <select value={selectedUserAccountId} onChange={(event) => handleUserAccountChange(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500">
                  {(selectedClient.baasUserAccounts || []).map((account) => (
                    <option key={account.id} value={account.id}>{account.label} · {account.accountId}</option>
                  ))}
                </select>
              </FormField>
              {selectedUserAccount ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                  <div className="text-slate-500">本次付款发起账户</div>
                  <div className="mt-1 font-bold text-slate-950">{selectedUserAccount.label} · {selectedUserAccount.accountId}</div>
                </div>
              ) : null}
              {initialContext ? (
                <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm">
                  <div className="font-bold text-blue-900">已带入当前用户账户：{initialContext.userAccountLabel} · {initialContext.userAccountDisplayId}</div>
                  <div className="mt-1 text-blue-700">来源账户：{initialContext.sourceAccountName} · {initialContext.sourceCurrency} 可用 {initialContext.sourceAvailable.toLocaleString('en-US')}</div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-blue-500 bg-white">
            <CardHeader className="bg-blue-50/60">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Banknote className="h-4 w-4" />
                </div>
                <CardTitle>付款账户</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPaymentAccount ? (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">
                  <div>
                    <div className="font-bold text-slate-950">{paymentAccountDisplayName}</div>
                    <div className="mt-1 text-sm text-slate-500">{selectedPaymentAccount.currency} 账户 · {selectedPaymentAccount.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">可用余额</div>
                    <div className="mt-1 text-2xl font-bold text-blue-700">{formatAmount(selectedPaymentAccount.currency, selectedPaymentAccount.available)}</div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-blue-500 bg-white">
            <CardHeader className="bg-blue-50/60">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <CreditCard className="h-4 w-4" />
                </div>
                <CardTitle>收款人账户</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="选择收款人" required>
                <select value={recipientId || selectedPayee?.id || ''} onChange={(event) => setRecipientId(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500">
                  {payees.map((payee) => (
                    <option key={payee.id} value={payee.id}>{payee.name} · {payee.bankName} · {payee.currency}</option>
                  ))}
                </select>
              </FormField>
              {selectedPayee ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      {selectedPayee.paymentType === '企业账户' ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-bold text-slate-950">{selectedPayee.name}</div>
                        <Badge variant="secondary">{selectedPayee.paymentType}</Badge>
                      </div>
                      <div className="mt-2 grid gap-3 text-sm md:grid-cols-2">
                        <div>
                          <div className="text-slate-500">银行信息</div>
                          <div className="mt-1 font-semibold text-slate-950">{selectedPayee.bankName}</div>
                          <div className="text-slate-500">账号尾号 {selectedPayee.accountNumber.slice(-4)} · {selectedPayee.transferMethod}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">地址信息</div>
                          <div className="mt-1 font-semibold text-slate-950">{selectedPayee.country}</div>
                          <div className="text-slate-500">SWIFT {selectedPayee.swift}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">当前用户账户下暂无可用收款人，请先在收款人模块添加。</div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-slate-950 bg-white">
            <CardHeader className="bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <CardTitle>汇款金额</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0.00"
                  className="h-16 w-full rounded-2xl border-2 border-slate-200 px-4 pr-24 text-3xl font-bold outline-none focus:border-blue-500"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-950">{currency}</div>
              </div>
              {hasAmount && totalPayment > balance ? (
                <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  余额不足，请调整汇款金额。
                </div>
              ) : null}
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                <Info className="h-4 w-4 text-blue-700" />
                汇率：1 {currency} = 1 {selectedPayee?.currency || currency}（原型按同币种付款展示）
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-slate-950 bg-white">
            <CardHeader className="bg-slate-50">
              <CardTitle>汇款用途</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField label="用途" required>
                <select value={remittancePurpose} onChange={(event) => setRemittancePurpose(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500">
                  {paymentPurposeOptions.map((purpose) => (
                    <option key={purpose.id} value={purpose.id}>{purpose.label}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="备注">
                <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="请输入付款备注" className="h-12 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
              </FormField>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-6">
            <Card className="overflow-hidden bg-white">
              <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-slate-950" />
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>费用明细</CardTitle>
                  {selectedPayee ? <Badge variant="success">已获取报价</Badge> : <Badge variant="secondary">待选择收款人</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">基础服务费</span>
                  <span className="font-bold text-slate-950">{selectedPayee ? formatAmount(currency, serviceFee) : '-'}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">银行通道费</span>
                  <span className="font-bold text-slate-950">{selectedPayee ? formatAmount(currency, baseFee) : '-'}</span>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <div className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-700" />
                    实际手续费、可用通道和到账时间以后端返回为准。
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden bg-slate-950 text-white">
              <CardHeader>
                <CardTitle>费用总览</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-300">汇款金额</span>
                  <span className="font-bold">{formatAmount(currency, numericAmount || 0)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-300">手续费</span>
                  <span className="font-bold">{formatAmount(currency, totalFee)}</span>
                </div>
                <div className="border-t border-white/15 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold">需从账户扣除</span>
                    <span className="text-2xl font-bold">{formatAmount(currency, totalPayment)}</span>
                  </div>
                </div>
                <div className="rounded-xl bg-blue-500 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold">对方实际收到</span>
                    <span className="text-xl font-bold">{formatAmount(selectedPayee?.currency || currency, recipientReceives)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              type="button"
              disabled={!canSubmit}
              onClick={() => setShowConfirmDialog(true)}
              className="h-14 w-full rounded-2xl bg-blue-600 text-base font-bold text-white hover:bg-blue-700"
            >
              确认付款
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {showConfirmDialog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-blue-700">Payment Confirmation</div>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">付款信息确认</h2>
              </div>
              <button type="button" onClick={() => setShowConfirmDialog(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">×</button>
            </div>

            <div className="mt-6 space-y-4">
              {[
                ['BaaS 用户账户', selectedUserAccount ? `${selectedUserAccount.label} · ${selectedUserAccount.accountId}` : '-'],
                ['付款账户', selectedPaymentAccount ? `${paymentAccountDisplayName} · ${formatAmount(currency, selectedPaymentAccount.available)}` : '-'],
                ['收款人', selectedPayee ? `${selectedPayee.name} · ${selectedPayee.bankName}` : '-'],
                ['汇款用途', selectedPurpose?.label || '-'],
                ['汇款金额', formatAmount(currency, numericAmount || 0)],
                ['手续费', formatAmount(currency, totalFee)],
                ['需从账户扣除', formatAmount(currency, totalPayment)],
                ['对方实际收到', formatAmount(selectedPayee?.currency || currency, recipientReceives)],
                ['备注', note || '-'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-right font-bold text-slate-950">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => setShowConfirmDialog(false)}>返回修改</Button>
              <Button type="button" className="rounded-xl bg-blue-600 text-white hover:bg-blue-700" onClick={submitOrder}>确认提交</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function TransactionOrdersView({ orders, category }) {
  const config = transactionOrderConfigs[category]
  const pageOrders = orders.filter((order) => order.historyCategory === category)

  return (
    <div className="space-y-6">
      <PageHeader title={config.title} titleSuffix={config.titleSuffix} description={config.description} />
      {config.note ? (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold leading-6 text-blue-800">
          {config.note}
        </div>
      ) : null}
      {config.webhookNote ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-800">
          {config.webhookNote}
        </div>
      ) : null}
      <FilterBar placeholders={config.filterPlaceholders} />
      <Card className="overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
              <tr>
                {['Order ID', 'Type', 'Client', 'Source', 'Target', 'Currency', 'Amount', 'Fee', 'Estimated Arrival', 'Client Status', 'Admin Status', 'Create Time', 'Action'].map((item) => (
                  <th key={item} className="px-5 py-4">{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageOrders.map((order) => (
                <tr key={order.id} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-semibold text-slate-950">{order.id}</td>
                  <td className="px-5 py-4">{order.type}</td>
                  <td className="px-5 py-4">{order.createdForClientId}</td>
                  <td className="px-5 py-4">{order.sourceDisplay || order.sourceAccountType}</td>
                  <td className="px-5 py-4">{order.targetDisplay || order.targetAccountType}</td>
                  <td className="px-5 py-4">{order.currency}</td>
                  <td className="px-5 py-4 font-semibold">{order.amountDisplay}</td>
                  <td className="px-5 py-4">{order.feeAmountDisplay}</td>
                  <td className="px-5 py-4 font-semibold">
                    <div>{order.estimatedArrivalAmount}</div>
                    {order.exchangeRate ? <div className="mt-1 text-xs font-normal text-slate-500">{order.exchangeRate}</div> : null}
                  </td>
                  <td className="px-5 py-4"><Badge variant="warning">{order.clientVisibleStatus}</Badge></td>
                  <td className="px-5 py-4"><Badge variant="secondary">{order.adminExecutionStatus}</Badge></td>
                  <td className="px-5 py-4 text-slate-500">{order.createdAt}</td>
                  <td className="px-5 py-4"><button type="button" className="font-semibold underline">View</button></td>
                </tr>
              ))}
              {pageOrders.length === 0 ? (
                <tr>
                  <td colSpan={13} className="border-t border-slate-100 px-5 py-10 text-center text-sm text-slate-500">{config.emptyText}</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function TokenSelectDisplay({ currency }) {
  const meta = convertCurrencyMeta[currency] || convertCurrencyMeta.USD

  return (
    <div className="flex items-center gap-3">
      <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-white ${meta.color}`}>{meta.text}</span>
      <span className="text-2xl font-black text-slate-950">{meta.label}</span>
      <span className="text-2xl text-slate-500">⌄</span>
    </div>
  )
}

function ConvertAmountPanel({ title, currency, amount, available, onCurrencyChange, onAmountChange, showMax, showError }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3 className="text-2xl font-bold text-slate-400">{title}</h3>
        {typeof available === 'number' ? <span className="text-lg font-semibold text-slate-500">Available: {available.toLocaleString('en-US')}</span> : null}
      </div>
      <div className="grid min-h-[130px] grid-cols-[minmax(220px,0.9fr)_1px_minmax(180px,1fr)] items-center rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
        <div className="flex items-center gap-3">
          <TokenSelectDisplay currency={currency} />
          <select value={currency} onChange={(event) => onCurrencyChange(event.target.value)} className="h-12 max-w-[140px] rounded-xl border border-transparent bg-transparent text-sm font-bold text-slate-500 outline-none hover:border-slate-200">
            {Object.keys(convertCurrencyMeta).map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="h-full bg-slate-200" />
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
          className="w-full bg-transparent text-right text-5xl font-black text-slate-950 outline-none"
        />
      </div>
      <div className="mt-4 flex min-h-8 items-center justify-end">
        {showError ? <span className="text-xl font-medium text-red-500">Insufficient balance</span> : null}
      </div>
      {showMax ? (
        <button type="button" onClick={() => onAmountChange(String(available || 0))} className="ml-auto block text-xl font-bold text-lime-300">
          Max
        </button>
      ) : null}
    </section>
  )
}

function ConvertView({ selectedClient, initialContext, onSubmitOrder }) {
  const initialFromCurrency = initialContext?.sourceCurrency || 'USDT'
  const [subAccountId, setSubAccountId] = useState(initialContext?.userAccountId || selectedClient.baasUserAccounts?.[0]?.id || '')
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency)
  const [toCurrency, setToCurrency] = useState(getDefaultConvertTarget(initialFromCurrency))
  const [fromAmount, setFromAmount] = useState('100')
  const rate = getConvertRate(fromCurrency, toCurrency)
  const numericAmount = Number(fromAmount)
  const hasAmount = Number.isFinite(numericAmount) && numericAmount > 0
  const fromAsset = selectedClient.accounts.find((account) => account.currency === fromCurrency)
  const available = initialContext?.sourceCurrency === fromCurrency ? initialContext.sourceAvailable : fromAsset?.available || 0
  const toAmount = hasAmount ? numericAmount * rate : 0
  const insufficient = hasAmount && numericAmount > available
  const canConvert = hasAmount && !insufficient && fromCurrency !== toCurrency
  const selectedSubAccount = selectedClient.baasUserAccounts?.find((account) => account.id === subAccountId)

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const submitConvert = () => {
    if (!canConvert) return
    onSubmitOrder({
      id: `CV-${Date.now()}`,
      createdByRole: 'OPERATOR',
      createdForClientId: selectedClient.id,
      type: 'Convert订单',
      historyCategory: 'convert',
      sourceAccountType: fromCurrency,
      targetAccountType: toCurrency,
      sourceDisplay: `${fromCurrency} 账户`,
      targetDisplay: `${toCurrency} 账户`,
      currency: `${fromCurrency}/${toCurrency}`,
      amountDisplay: `${fromAmount} ${fromCurrency}`,
      feeAmountDisplay: `${toCurrency} 0.00`,
      estimatedArrivalAmount: `${toAmount.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} ${toCurrency}`,
      exchangeRate: `1 ${fromCurrency} = ${rate} ${toCurrency}`,
      clientVisibleStatus: '已提交',
      adminExecutionStatus: 'CONVERT_SUBMITTED',
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
      auditTrail: [
        `${operatorProfile.name} 为 ${selectedSubAccount?.accountId || selectedClient.id} 创建 Convert`,
        initialContext?.sourceAccountName ? `从 ${initialContext.sourceAccountName} 带入 ${fromCurrency} 资产` : '从 Convert 菜单创建',
        `${fromAmount} ${fromCurrency} → ${toAmount.toFixed(3)} ${toCurrency}`,
        'No fees',
      ],
    })
  }

  return (
    <div className="mx-auto max-w-[1320px] py-4">
      <h1 className="text-center text-5xl font-black tracking-tight text-slate-950">Convert</h1>

      <div className="mx-auto mt-12 max-w-[1040px] rounded-[32px] border border-slate-200 bg-white p-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-slate-950">Convert</h2>
            <span className="rounded-full bg-blue-100 px-4 py-1 text-xl font-bold text-blue-700">No fees</span>
          </div>
          <ListChecks className="h-8 w-8 text-lime-500" />
        </div>

        <div className="mt-12">
          <label className="text-xl font-black uppercase tracking-wide text-slate-400">Sub-account</label>
          <select value={subAccountId} onChange={(event) => setSubAccountId(event.target.value)} className="mt-4 h-20 w-full rounded-2xl border border-slate-200 bg-white px-6 text-2xl font-semibold text-slate-950 outline-none focus:border-blue-500">
            {(selectedClient.baasUserAccounts || []).map((account) => (
            <option key={account.id} value={account.id}>{account.label} (ID: {account.accountId})</option>
            ))}
          </select>
          {initialContext ? (
            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-900">
              <div className="font-bold">已带入当前用户账户：{initialContext.userAccountLabel} · {initialContext.userAccountDisplayId}</div>
              <div className="mt-1 text-blue-700">来源账户：{initialContext.sourceAccountName} · {initialContext.sourceCurrency} 可用 {initialContext.sourceAvailable.toLocaleString('en-US')}</div>
            </div>
          ) : null}
        </div>

        <div className="my-8 h-px bg-slate-200" />

        <div className="relative space-y-14">
          <ConvertAmountPanel
            title="From"
            currency={fromCurrency}
            amount={fromAmount}
            available={available}
            onCurrencyChange={setFromCurrency}
            onAmountChange={setFromAmount}
            showMax
            showError={insufficient}
          />

          <button
            type="button"
            onClick={swapCurrencies}
            className="absolute left-1/2 top-[calc(50%-2.8rem)] z-10 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-4xl font-bold text-lime-500 shadow-lg"
          >
            ⇅
          </button>

          <ConvertAmountPanel
            title="To"
            currency={toCurrency}
            amount={toAmount.toFixed(3)}
            onCurrencyChange={setToCurrency}
            onAmountChange={() => {}}
          />
        </div>

        <div className="mt-12 flex items-center justify-center gap-5 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-7">
          <span className="text-2xl font-black text-slate-950">1 {fromCurrency} = {rate} {toCurrency}</span>
          <span className="flex items-center gap-2 text-2xl font-bold text-lime-600">
            <Clock className="h-5 w-5" />
            00:58
          </span>
        </div>

        <Button
          type="button"
          disabled={!canConvert}
          onClick={submitConvert}
          className={`mt-8 h-20 w-full rounded-full text-3xl font-black ${canConvert ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-300 text-white hover:bg-slate-300'}`}
        >
          Convert
        </Button>
      </div>
    </div>
  )
}

function PlaceholderView({ title, description }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <Card className="bg-white">
        <CardContent className="p-10 text-center">
          <ListChecks className="mx-auto h-10 w-10 text-slate-300" />
          <div className="mt-4 text-lg font-semibold text-slate-950">原型占位</div>
          <p className="mt-2 text-sm text-slate-500">本区保留信息架构位置，后续按管理端执行链路补全详细交互。</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function BaasAdminWorkbenchPrototype({ onBack }) {
  const selectedClient = clients[0]
  const [activeNav, setActiveNav] = useState('accounts')
  const [orders, setOrders] = useState(initialOrders)
  const [counterpartyMap, setCounterpartyMap] = useState(createCounterpartyMap)
  const [convertContext, setConvertContext] = useState(null)
  const [transferContext, setTransferContext] = useState(null)

  const submitOrder = (order) => {
    setOrders((current) => [order, ...current])
    if (order.historyCategory === 'convert') {
      setActiveNav('convert-orders')
      return
    }
    setActiveNav('transfer-out-orders')
  }

  const createCounterparty = (counterparty) => {
    setCounterpartyMap((current) => ({
      ...current,
      [selectedClient.id]: [counterparty, ...(current[selectedClient.id] || [])],
    }))
  }

  const startConvertFromAccount = (context) => {
    setConvertContext(context)
    setActiveNav('convert')
  }

  const startCreateTransferFromAccount = (context) => {
    setTransferContext(context)
    setActiveNav('create-transfer')
  }

  const handleNavChange = (navId) => {
    if (navId === 'convert') {
      setConvertContext(null)
    }
    if (navId === 'create-transfer') {
      setTransferContext(null)
    }
    setActiveNav(navId)
  }

  const renderContent = () => {
    if (activeNav === 'accounts') {
      return (
        <AccountsView
          selectedClient={selectedClient}
          counterparties={counterpartyMap[selectedClient.id] || []}
          onCreateCounterparty={createCounterparty}
          onStartConvert={startConvertFromAccount}
          onStartCreateTransfer={startCreateTransferFromAccount}
        />
      )
    }
    if (activeNav === 'counterparties') {
      return (
        <CounterpartiesView
          selectedClient={selectedClient}
          counterparties={counterpartyMap[selectedClient.id] || []}
          onCreateCounterparty={createCounterparty}
        />
      )
    }
    if (activeNav === 'crypto-whitelist') {
      return (
        <PlaceholderView
          title="数字币白名单"
          description="管理客户数字资产提现地址白名单，后续用于提交、审核、启用和停用链上地址。"
        />
      )
    }
    if (activeNav === 'create-transfer') {
      return (
        <CreateTransferView
          selectedClient={selectedClient}
          counterparties={counterpartyMap[selectedClient.id] || []}
          initialContext={transferContext}
          onSubmitOrder={submitOrder}
        />
      )
    }
    if (activeNav === 'transfer-in-orders') return <TransactionOrdersView orders={orders} category="transfer-in" />
    if (activeNav === 'transfer-out-orders') return <TransactionOrdersView orders={orders} category="transfer-out" />
    if (activeNav === 'convert-orders') return <TransactionOrdersView orders={orders} category="convert" />
    if (activeNav === 'convert') return <ConvertView key={convertContext?.requestId || 'convert-default'} selectedClient={selectedClient} initialContext={convertContext} onSubmitOrder={submitOrder} />
    return (
      <AccountsView
        selectedClient={selectedClient}
        counterparties={counterpartyMap[selectedClient.id] || []}
        onCreateCounterparty={createCounterparty}
        onStartConvert={startConvertFromAccount}
        onStartCreateTransfer={startCreateTransferFromAccount}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <div className="flex">
        <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
        <div className="min-w-0 flex-1">
          <TopContextBar />
          <main className="mx-auto max-w-[1480px] px-6 py-6">
            <div className="mb-6">
              <PrdBackLink onClick={onBack} />
            </div>
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}
