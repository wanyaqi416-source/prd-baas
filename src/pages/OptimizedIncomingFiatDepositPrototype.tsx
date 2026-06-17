import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Clock3,
  Copy,
  Landmark,
  ShieldCheck,
  Upload,
  UserRound,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

type Currency = 'USD' | 'HKD'
type AccountType = 'hk' | 'us'
type DepositStatus = 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'

type BankAccount = {
  bank_name: string
  swift_code: string
  routing_number: string
  bank_address: string
  account_name: string
  account_number: string
  country: string
  city: string
}

type IncomingRecord = {
  id: string
  account_type: AccountType
  amount: number
  currency: Currency
  fee_amount: number
  receiving_bank: string
  remitting_bank: string
  remitting_account_number: string
  created_at: string
  status: DepositStatus
}

type FieldErrors = {
  amount?: string
  remittingBank?: string
  channel?: string
  purpose?: string
  sourceOfFunds?: string
}

const accountLabels: Record<AccountType, string> = {
  hk: '香港账户',
  us: '美国账户',
}

const receivingBankAccounts: Record<AccountType, Record<Currency, BankAccount>> = {
  hk: {
    USD: {
      bank_name: 'Fidere Hong Kong Receiving Bank',
      swift_code: 'FIDRHKHHUSD',
      routing_number: 'HK-USD-001',
      bank_address: '88 Queens Road Central, Hong Kong',
      account_name: 'Fidere Trust Limited - HK USD',
      account_number: 'HK-VA-USD-00012345',
      country: 'Hong Kong',
      city: 'Hong Kong',
    },
    HKD: {
      bank_name: 'Fidere Hong Kong Receiving Bank',
      swift_code: 'FIDRHKHHHKD',
      routing_number: 'HK-HKD-001',
      bank_address: '88 Queens Road Central, Hong Kong',
      account_name: 'Fidere Trust Limited - HK HKD',
      account_number: 'HK-VA-HKD-00012345',
      country: 'Hong Kong',
      city: 'Hong Kong',
    },
  },
  us: {
    USD: {
      bank_name: 'Fidere US Receiving Bank',
      swift_code: 'FIDRUS33USD',
      routing_number: '026009593',
      bank_address: '110 North Carpenter Street, Chicago, IL',
      account_name: 'Fidere Trust Limited - US USD',
      account_number: 'US-VA-USD-00067890',
      country: 'United States',
      city: 'Chicago',
    },
    HKD: {
      bank_name: 'Fidere US Receiving Bank',
      swift_code: 'FIDRUS33HKD',
      routing_number: '026009594',
      bank_address: '110 North Carpenter Street, Chicago, IL',
      account_name: 'Fidere Trust Limited - US HKD',
      account_number: 'US-VA-HKD-00067890',
      country: 'United States',
      city: 'Chicago',
    },
  },
}

const whitelistBanks: Record<string, BankAccount & { id: string; label: string }> = {
  hsbc: {
    id: 'hsbc',
    label: 'HSBC Hong Kong - 个人白名单',
    bank_name: 'HSBC Hong Kong',
    swift_code: 'HSBCHKHHHKH',
    routing_number: '004',
    bank_address: '1 Queens Road Central, Hong Kong',
    account_name: 'WANYARA OP WAN',
    account_number: '808-123456-838',
    country: 'Hong Kong',
    city: 'Hong Kong',
  },
  chase: {
    id: 'chase',
    label: 'Chase Bank - 个人白名单',
    bank_name: 'JPMorgan Chase Bank, N.A.',
    swift_code: 'CHASUS33',
    routing_number: '021000021',
    bank_address: '383 Madison Avenue, New York, NY',
    account_name: 'WANYARA OP WAN',
    account_number: '7788990011',
    country: 'United States',
    city: 'New York',
  },
}

const initialRecords: Record<AccountType, Record<Currency, IncomingRecord[]>> = {
  hk: {
    USD: [
      { id: 'TXN-20260518-c91f7712', account_type: 'hk', amount: 111, currency: 'USD', fee_amount: 0, receiving_bank: 'Fidere Hong Kong Receiving Bank', remitting_bank: 'HSBC Hong Kong', remitting_account_number: '808-123456-838', created_at: '2026-05-18 10:42', status: 'UNDER_REVIEW' },
      { id: 'TXN-20260511-6f7c120a', account_type: 'hk', amount: 86, currency: 'USD', fee_amount: 0, receiving_bank: 'Fidere Hong Kong Receiving Bank', remitting_bank: 'HSBC Hong Kong', remitting_account_number: '808-123456-838', created_at: '2026-05-11 11:05', status: 'APPROVED' },
    ],
    HKD: [
      { id: 'TXN-20260517-210af998', account_type: 'hk', amount: 10000, currency: 'HKD', fee_amount: 0, receiving_bank: 'Fidere Hong Kong Receiving Bank', remitting_bank: 'HSBC Hong Kong', remitting_account_number: '808-123456-838', created_at: '2026-05-17 16:20', status: 'UNDER_REVIEW' },
    ],
  },
  us: {
    USD: [
      { id: 'TXN-20260515-b65e881c', account_type: 'us', amount: 123, currency: 'USD', fee_amount: 0, receiving_bank: 'Fidere US Receiving Bank', remitting_bank: 'JPMorgan Chase Bank, N.A.', remitting_account_number: '7788990011', created_at: '2026-05-15 16:53', status: 'REJECTED' },
      { id: 'TXN-20260427-e2f005c4', account_type: 'us', amount: 20, currency: 'USD', fee_amount: 0, receiving_bank: 'Fidere US Receiving Bank', remitting_bank: 'JPMorgan Chase Bank, N.A.', remitting_account_number: '7788990011', created_at: '2026-04-27 15:15', status: 'APPROVED' },
    ],
    HKD: [],
  },
}

const statusLabel: Record<DepositStatus, string> = {
  UNDER_REVIEW: '审核中',
  APPROVED: '已完成',
  REJECTED: '已拒绝',
}

const statusClass: Record<DepositStatus, string> = {
  UNDER_REVIEW: 'bg-amber-50 text-amber-700',
  APPROVED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-red-50 text-red-700',
}

function formatAmount(amount: number, currency: Currency) {
  return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function nowText() {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

function makeTransactionId() {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `TXN-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${Date.now().toString(16).slice(-8)}`
}

function TopNav({ onBack }: { onBack: () => void }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-5">
        <div className="flex items-center gap-7">
          <button type="button" onClick={onBack} className="text-xl font-bold tracking-tight text-slate-800">FIDERE</button>
          <nav className="hidden items-center gap-2 text-sm text-slate-500 md:flex">
            {['仪表板', '账户', '投资', '交易', '信托服务'].map((item) => (
              <button key={item} type="button" className={item === '账户' ? 'inline-flex h-9 items-center rounded-lg bg-blue-600 px-4 font-semibold text-white shadow-sm' : 'inline-flex h-9 items-center rounded-lg px-3 font-medium hover:bg-slate-100'}>
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <span>文</span>
          <span>☼</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
            <UserRound className="h-4 w-4" />
          </span>
        </div>
      </div>
    </header>
  )
}

function StepTitle({ step, title, desc }: { step: number; title: string; desc?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{step}</span>
      <div>
        <h2 className="text-base font-bold text-slate-950">{title}</h2>
        {desc ? <p className="mt-1 text-sm leading-6 text-slate-500">{desc}</p> : null}
      </div>
    </div>
  )
}

function FormLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <span className="mb-2 block text-sm font-bold text-slate-700">
      {children}
      {required ? <span className="ml-1 text-red-500">*</span> : null}
    </span>
  )
}

function CopyButton({
  value,
  label = '复制',
  onCopied,
}: {
  value: string
  label?: string
  onCopied: () => void
}) {
  const copy = async () => {
    await navigator.clipboard?.writeText(value)
    onCopied()
  }

  return (
    <button
      type="button"
      title="复制"
      onClick={copy}
      className="inline-flex h-8 items-center gap-1.5 rounded-md bg-blue-50 px-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
    >
      <Copy className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

function DetailRow({
  label,
  value,
  hint,
  copy = false,
  onCopied,
}: {
  label: string
  value: string
  hint?: string
  copy?: boolean
  onCopied?: () => void
}) {
  return (
    <div className="grid grid-cols-[132px_1fr_auto] items-start gap-3 border-b border-slate-100 py-3 last:border-b-0">
      <div>
        <div className="text-sm text-slate-500">{label}</div>
        {hint ? <div className="mt-1 text-xs leading-5 text-slate-400">{hint}</div> : null}
      </div>
      <span className="break-words text-sm font-semibold leading-6 text-slate-950">{value}</span>
      {copy && onCopied ? <CopyButton value={value} onCopied={onCopied} /> : <span />}
    </div>
  )
}

function RecordDetailPage({
  record,
  onBack,
  onClose,
}: {
  record: IncomingRecord
  onBack: () => void
  onClose: () => void
}) {
  const receivingBank = receivingBankAccounts[record.account_type][record.currency]
  const amountPrefix = record.status === 'REJECTED' ? '' : '+ '
  const noop = () => {}

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <TopNav onBack={onClose} />
      <main className="mx-auto min-h-screen max-w-[460px] bg-[#f7faff] shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Banknote className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-base font-bold text-slate-950">法币转入 详情</h1>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">TRANSACTION DETAIL</div>
            </div>
          </div>
          <button type="button" onClick={onBack} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">×</button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-orange-500">
              <Clock3 className="h-5 w-5" />
            </div>
            <div className="mt-4 text-sm text-slate-500">{statusLabel[record.status]}</div>
            <div className="mt-2 text-3xl font-bold text-emerald-600">
              {amountPrefix}{record.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="ml-2 text-base font-semibold text-slate-600">{record.currency}</span>
            </div>
            <div className="mt-3 text-sm text-slate-500">手续费: {record.fee_amount.toFixed(2)} {record.currency}</div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold text-slate-700">详情</h2>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <DetailRow label="交易编号" value={record.id} copy onCopied={noop} />
              <DetailRow label="账户类型" value={accountLabels[record.account_type]} />
              <DetailRow label="创建日期" value={record.created_at} />
              <DetailRow label="审核时间" value={record.status === 'UNDER_REVIEW' ? '-' : record.created_at} />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold text-slate-700">收款银行详情</h2>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-600 shadow-sm">
              <p>请注意，您必须在电汇的备注或说明字段中填写指令交易编号，以便资金到达您的现金账户。</p>
              <div className="mt-4 grid gap-2">
                <DetailRow label="交易编号" value={record.id} copy onCopied={noop} />
                <DetailRow label="收款银行" value={receivingBank.bank_name} />
                <DetailRow label="收款账户" value={receivingBank.account_number} copy onCopied={noop} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold text-slate-700">来自银行账户</h2>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
              <div className="mb-3 text-sm font-bold text-slate-700">附加文件</div>
              <button type="button" className="inline-flex h-9 items-center gap-2 rounded-full bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700">
                <Upload className="h-4 w-4" />
                上传文件
              </button>
              <div className="mt-3 text-sm text-slate-500">jpg/png 文件，文件大小不能超过 5M</div>
              <div className="my-4 h-px bg-slate-200" />
              <div className="text-sm font-bold text-slate-700">银行费用说明</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">您的银行可能会对此交易收取费用，我们无法确定或影响此费用。</p>
              <div className="mt-3 text-sm text-slate-500">打款银行：{record.remitting_bank} · {record.remitting_account_number}</div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-3 pb-6">
            <button type="button" onClick={onBack} className="h-10 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50">返回入金表单</button>
            <button type="button" onClick={onClose} className="h-10 rounded-lg bg-blue-600 text-sm font-bold text-white hover:bg-blue-700">返回账户</button>
          </div>
        </div>
      </main>
    </div>
  )
}

function ConfirmModal({
  open,
  amount,
  currency,
  remittingBank,
  channel,
  submitting,
  onCancel,
  onConfirm,
}: {
  open: boolean
  amount: string
  currency: Currency
  remittingBank: string
  channel: string
  submitting: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-[460px] rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-950">确认提交入金申请？</h2>
          <button type="button" onClick={onCancel} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3 px-5 py-5 text-sm">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-800">请确认以下信息与实际银行转账记录一致。</div>
          <div className="grid gap-3">
            <div className="flex justify-between gap-3"><span className="text-slate-500">入金金额</span><span className="font-bold text-slate-950">{currency} {amount || '0.00'}</span></div>
            <div className="flex justify-between gap-3"><span className="text-slate-500">币种</span><span className="font-bold text-slate-950">{currency}</span></div>
            <div className="flex justify-between gap-3"><span className="text-slate-500">打款银行</span><span className="text-right font-bold text-slate-950">{remittingBank}</span></div>
            <div className="flex justify-between gap-3"><span className="text-slate-500">打款渠道</span><span className="font-bold text-slate-950">{channel}</span></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 px-5 py-4">
          <button type="button" onClick={onCancel} disabled={submitting} className="h-10 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">取消</button>
          <button type="button" onClick={onConfirm} disabled={submitting} className="h-10 rounded-lg bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">
            {submitting ? '提交中...' : '确认提交'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function OptimizedIncomingFiatDepositPrototype({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<'form' | 'detail'>('form')
  const [selectedRecord, setSelectedRecord] = useState<IncomingRecord | null>(null)
  const [accountType, setAccountType] = useState<AccountType>('hk')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [selectedRemittingBankId, setSelectedRemittingBankId] = useState('hsbc')
  const [records, setRecords] = useState<Record<AccountType, Record<Currency, IncomingRecord[]>>>(initialRecords)
  const [amount, setAmount] = useState('')
  const [remittingChannel, setRemittingChannel] = useState('电汇')
  const [purpose, setPurpose] = useState('')
  const [sourceOfFunds, setSourceOfFunds] = useState('')
  const [referenceNote, setReferenceNote] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [copyToast, setCopyToast] = useState('')
  const [successToast, setSuccessToast] = useState('')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const bankOptions = Object.values(whitelistBanks)
  const activeReceivingBank = receivingBankAccounts[accountType][currency]
  const activeRemittingBank = selectedRemittingBankId ? whitelistBanks[selectedRemittingBankId] : undefined
  const activeRecords = records[accountType][currency]
  const transferMemo = `FIDERE-${accountType.toUpperCase()}-${currency}-WANYARA`

  const balanceHint = useMemo(() => {
    const pending = activeRecords
      .filter((record) => record.status === 'UNDER_REVIEW')
      .reduce((total, record) => total + record.amount, 0)
    const approved = activeRecords
      .filter((record) => record.status === 'APPROVED')
      .reduce((total, record) => total + record.amount, 0)
    return { pending, approved }
  }, [activeRecords])

  const showCopied = () => {
    setCopyToast('已复制')
    window.setTimeout(() => setCopyToast(''), 1600)
  }

  const changeAccountType = (nextType: AccountType) => {
    setAccountType(nextType)
    if (nextType === 'us') {
      setCurrency('USD')
    }
    setFieldErrors({})
  }

  const changeCurrency = (nextCurrency: Currency) => {
    setCurrency(accountType === 'us' ? 'USD' : nextCurrency)
    setFieldErrors({})
  }

  const copyAllBankInfo = async () => {
    const text = [
      `账户类型：${accountLabels[accountType]}`,
      `币种：${currency}`,
      `收款人名称：${activeReceivingBank.account_name}`,
      `收款银行：${activeReceivingBank.bank_name}`,
      `银行地址：${activeReceivingBank.bank_address}`,
      `账户号码：${activeReceivingBank.account_number}`,
      `BIC/SWIFT：${activeReceivingBank.swift_code}`,
      `汇款备注：${transferMemo}`,
    ].join('\n')
    await navigator.clipboard?.writeText(text)
    showCopied()
  }

  const validateForm = () => {
    const nextErrors: FieldErrors = {}
    const numericAmount = Number(amount)
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      nextErrors.amount = '请输入大于 0 的实际转账金额。'
    }
    if (!selectedRemittingBankId || !activeRemittingBank) {
      nextErrors.remittingBank = '请选择您实际用于转账的打款银行。'
    }
    if (!remittingChannel) {
      nextErrors.channel = '请选择打款渠道。'
    }
    if (!purpose) {
      nextErrors.purpose = '请选择打款用途。'
    }
    if (!sourceOfFunds) {
      nextErrors.sourceOfFunds = '请选择资金来源。'
    }
    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const requestSubmit = () => {
    if (validateForm()) {
      setIsConfirmOpen(true)
    }
  }

  const confirmSubmit = () => {
    if (!validateForm() || !activeRemittingBank) return
    setIsSubmitting(true)
    window.setTimeout(() => {
      const numericAmount = Number(amount)
      const nextRecord: IncomingRecord = {
        id: makeTransactionId(),
        account_type: accountType,
        amount: numericAmount,
        currency,
        fee_amount: 0,
        receiving_bank: activeReceivingBank.bank_name,
        remitting_bank: activeRemittingBank.bank_name,
        remitting_account_number: activeRemittingBank.account_number,
        created_at: nowText(),
        status: 'UNDER_REVIEW',
      }

      setRecords((current) => ({
        ...current,
        [accountType]: {
          ...current[accountType],
          [currency]: [nextRecord, ...current[accountType][currency]],
        },
      }))
      setSelectedRecord(nextRecord)
      setAmount('')
      setPurpose('')
      setSourceOfFunds('')
      setReferenceNote('')
      setFieldErrors({})
      setIsSubmitting(false)
      setIsConfirmOpen(false)
      setSuccessToast('入金申请已提交，请等待审核。')
      window.setTimeout(() => setSuccessToast(''), 1800)
      setView('detail')
    }, 500)
  }

  const resetForm = () => {
    setAmount('')
    setRemittingChannel('电汇')
    setPurpose('')
    setSourceOfFunds('')
    setReferenceNote('')
    setFieldErrors({})
  }

  const openDetail = (record: IncomingRecord) => {
    setSelectedRecord(record)
    setAccountType(record.account_type)
    setCurrency(record.currency)
    setView('detail')
  }

  if (view === 'detail' && selectedRecord) {
    return <RecordDetailPage record={selectedRecord} onBack={() => setView('form')} onClose={onBack} />
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <TopNav onBack={onBack} />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-[86px] max-w-[1280px] items-center gap-4 px-5 py-4">
          <button type="button" onClick={onBack} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-950">银行电汇入金</h1>
            <p className="mt-1 text-sm text-slate-500">先复制平台收款信息完成银行转账，再回来提交入金申请。</p>
          </div>
          <div className="hidden items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 md:flex">
            <ShieldCheck className="h-4 w-4" />
            1-3 个工作日处理
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-5 py-6">
        <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50 px-5 py-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <div className="font-bold text-blue-900">操作顺序</div>
              <p className="mt-1 text-sm leading-6 text-blue-800">请选择账户和币种，复制收款银行信息去完成线下转账，然后选择您的打款银行并提交入金申请。</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <StepTitle step={1} title="选择入金账户" desc="请选择本次入金到账的账户和币种，系统将根据选择展示对应收款信息。" />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label>
                  <FormLabel>入金到账账户</FormLabel>
                  <select value={accountType} onChange={(event) => changeAccountType(event.target.value as AccountType)} className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold outline-none hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option value="hk">香港账户</option>
                    <option value="us">美国账户</option>
                  </select>
                </label>
                <label>
                  <FormLabel>币种</FormLabel>
                  <select value={currency} onChange={(event) => changeCurrency(event.target.value as Currency)} disabled={accountType === 'us'} className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold outline-none hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500">
                    <option value="USD">USD 美元</option>
                    {accountType === 'hk' ? <option value="HKD">HKD 港币</option> : null}
                  </select>
                  {accountType === 'us' ? <span className="mt-2 block text-xs text-slate-500">美国账户当前只支持 USD 入金。</span> : null}
                </label>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <StepTitle step={2} title="收款银行信息" desc="请使用以下信息通过您的银行完成电汇，转账完成后请在下方提交入金申请。" />
                <button type="button" onClick={copyAllBankInfo} className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200">
                  <Copy className="h-4 w-4" />
                  复制全部收款信息
                </button>
              </div>
              <div className="mt-5 grid gap-x-8 rounded-lg border border-slate-200 bg-slate-50/50 p-4 md:grid-cols-2">
                <div>
                  <DetailRow label="收款详情" value={`${accountLabels[accountType]} ${currency}`} />
                  <DetailRow label="收款人名称" value={activeReceivingBank.account_name} copy onCopied={showCopied} />
                  <DetailRow label="银行名称" value={activeReceivingBank.bank_name} copy onCopied={showCopied} />
                  <DetailRow label="银行地址" value={activeReceivingBank.bank_address} copy onCopied={showCopied} />
                </div>
                <div>
                  <DetailRow label="网络" value="SWIFT" />
                  <DetailRow label="账户号码" value={activeReceivingBank.account_number} hint="请确保填写完整，避免入金失败" copy onCopied={showCopied} />
                  <DetailRow label="BIC / SWIFT" value={activeReceivingBank.swift_code} hint="用于跨境电汇识别银行" copy onCopied={showCopied} />
                  <DetailRow label="汇款备注" value={transferMemo} hint="建议填写到银行转账备注中" copy onCopied={showCopied} />
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                请确保转账账户名称与平台账户实名信息一致，否则可能影响入金审核。
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <StepTitle step={3} title="选择您的打款银行" desc="请选择您实际用于转账的银行账户，便于平台核对入金来源。" />
              {bankOptions.length ? (
                <div className="mt-5 grid gap-4 md:grid-cols-[1fr_260px]">
                  <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                    <div className="text-xs font-bold uppercase tracking-wide text-blue-600">当前已选打款银行</div>
                    {activeRemittingBank ? (
                      <>
                        <div className="mt-2 text-base font-bold text-slate-950">{activeRemittingBank.bank_name}</div>
                        <div className="mt-1 text-sm text-slate-600">{activeRemittingBank.account_name} · {activeRemittingBank.account_number}</div>
                        <div className="mt-2 text-xs text-slate-500">SWIFT {activeRemittingBank.swift_code} · {activeRemittingBank.country}</div>
                      </>
                    ) : (
                      <div className="mt-2 text-sm text-slate-500">请选择您的打款银行。</div>
                    )}
                  </div>
                  <label>
                    <FormLabel required>切换打款银行</FormLabel>
                    <select value={selectedRemittingBankId} onChange={(event) => setSelectedRemittingBankId(event.target.value)} className={`h-12 w-full rounded-lg border bg-white px-3 text-sm font-bold outline-none hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${fieldErrors.remittingBank ? 'border-red-300' : 'border-slate-200'}`}>
                      {bankOptions.map((bank) => <option key={bank.id} value={bank.id}>{bank.label}</option>)}
                    </select>
                    {fieldErrors.remittingBank ? <div className="mt-2 text-xs font-semibold text-red-600">{fieldErrors.remittingBank}</div> : null}
                  </label>
                </div>
              ) : (
                <div className="mt-5 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">暂无可用打款银行，请先添加打款银行账户。</div>
              )}
            </section>

            <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">
              请先完成银行转账，再提交入金申请。提交金额需与实际转账金额一致，否则可能导致审核延迟。
            </div>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <StepTitle step={4} title="提交入金申请" desc="完成银行转账后，请提交以下信息，平台将根据您的转账记录进行审核。" />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label>
                  <FormLabel required>入金金额</FormLabel>
                  <div className={`flex h-12 items-center rounded-lg border bg-white px-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 ${fieldErrors.amount ? 'border-red-300' : 'border-slate-200'}`}>
                    <span className="mr-3 rounded-md bg-slate-100 px-2.5 py-1 text-sm font-bold text-slate-700">{currency}</span>
                    <input value={amount} onChange={(event) => { setAmount(event.target.value); setFieldErrors((current) => ({ ...current, amount: undefined })) }} inputMode="decimal" className="h-full min-w-0 flex-1 bg-transparent text-sm font-bold outline-none" placeholder="请输入实际转账金额" />
                  </div>
                  {fieldErrors.amount ? <div className="mt-2 text-xs font-semibold text-red-600">{fieldErrors.amount}</div> : null}
                </label>
                <label>
                  <FormLabel required>打款渠道</FormLabel>
                  <select value={remittingChannel} onChange={(event) => { setRemittingChannel(event.target.value); setFieldErrors((current) => ({ ...current, channel: undefined })) }} className={`h-12 w-full rounded-lg border bg-white px-3 text-sm font-bold outline-none hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${fieldErrors.channel ? 'border-red-300' : 'border-slate-200'}`}>
                    <option value="电汇">电汇</option>
                    <option value="FPS">FPS</option>
                    <option value="ACH">ACH</option>
                  </select>
                  {fieldErrors.channel ? <div className="mt-2 text-xs font-semibold text-red-600">{fieldErrors.channel}</div> : null}
                </label>
                <label>
                  <FormLabel required>打款用途</FormLabel>
                  <select value={purpose} onChange={(event) => { setPurpose(event.target.value); setFieldErrors((current) => ({ ...current, purpose: undefined })) }} className={`h-12 w-full rounded-lg border bg-white px-3 text-sm font-bold outline-none hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${fieldErrors.purpose ? 'border-red-300' : 'border-slate-200'}`}>
                    <option value="">请选择</option>
                    <option value="Investment">Investment</option>
                    <option value="Deposit">Deposit</option>
                    <option value="Settlement">Settlement</option>
                  </select>
                  {fieldErrors.purpose ? <div className="mt-2 text-xs font-semibold text-red-600">{fieldErrors.purpose}</div> : null}
                </label>
                <label>
                  <FormLabel required>资金来源</FormLabel>
                  <select value={sourceOfFunds} onChange={(event) => { setSourceOfFunds(event.target.value); setFieldErrors((current) => ({ ...current, sourceOfFunds: undefined })) }} className={`h-12 w-full rounded-lg border bg-white px-3 text-sm font-bold outline-none hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${fieldErrors.sourceOfFunds ? 'border-red-300' : 'border-slate-200'}`}>
                    <option value="">请选择</option>
                    <option value="Salary">Salary</option>
                    <option value="Business Income">Business Income</option>
                    <option value="Savings">Savings</option>
                  </select>
                  {fieldErrors.sourceOfFunds ? <div className="mt-2 text-xs font-semibold text-red-600">{fieldErrors.sourceOfFunds}</div> : null}
                </label>
                <label className="md:col-span-2">
                  <FormLabel>转账附言</FormLabel>
                  <input value={referenceNote} onChange={(event) => setReferenceNote(event.target.value)} className="h-12 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="请填写银行转账备注或附言，如无可不填" />
                </label>
                <div className="md:col-span-2">
                  <FormLabel>上传凭证</FormLabel>
                  <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 text-sm font-bold text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-100">
                    <Upload className="h-4 w-4" />
                    上传凭证（可选）
                  </button>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <button type="button" onClick={resetForm} disabled={isSubmitting} className="h-11 min-w-[120px] rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">重置</button>
                <button type="button" onClick={requestSubmit} disabled={isSubmitting} className="h-11 min-w-[180px] rounded-lg bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">
                  {isSubmitting ? '提交中...' : '提交入金申请'}
                </button>
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-5 lg:self-start">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-base font-bold text-slate-950">
                <Landmark className="h-5 w-5 text-blue-600" />
                最近入金申请
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-orange-50 p-3">
                  <div className="text-xs text-orange-600">审核中</div>
                  <div className="mt-1 font-bold text-slate-950">{formatAmount(balanceHint.pending, currency)}</div>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <div className="text-xs text-green-600">已完成</div>
                  <div className="mt-1 font-bold text-slate-950">{formatAmount(balanceHint.approved, currency)}</div>
                </div>
              </div>
              <div className="mt-4 divide-y divide-slate-100">
                {activeRecords.length ? activeRecords.map((record) => (
                  <button key={record.id} type="button" onClick={() => openDetail(record)} className="block w-full py-4 text-left hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-100">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-bold text-slate-950">{formatAmount(record.amount, record.currency)}</span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass[record.status]}`}>{statusLabel[record.status]}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-[72px_1fr] gap-y-1 text-xs text-slate-500">
                      <span>收款银行</span>
                      <span className="text-right text-slate-700">{record.receiving_bank || '暂无'}</span>
                      <span>提交时间</span>
                      <span className="text-right text-slate-700">{record.created_at}</span>
                    </div>
                  </button>
                )) : (
                  <div className="py-8 text-center text-sm text-slate-400">暂无入金申请记录</div>
                )}
              </div>
              <button type="button" className="mt-4 h-10 w-full rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50">查看全部</button>
            </section>
          </aside>
        </div>
      </main>

      {copyToast ? (
        <div className="fixed right-6 top-20 z-50 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-lg">{copyToast}</div>
      ) : null}
      {successToast ? (
        <div className="fixed right-6 top-20 z-50 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg">{successToast}</div>
      ) : null}
      <ConfirmModal
        open={isConfirmOpen}
        amount={amount}
        currency={currency}
        remittingBank={activeRemittingBank?.bank_name || '暂无'}
        channel={remittingChannel}
        submitting={isSubmitting}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={confirmSubmit}
      />
    </div>
  )
}
