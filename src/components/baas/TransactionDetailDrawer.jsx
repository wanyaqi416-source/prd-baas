import { CheckCircle2, Clock3, FileText, Loader2, UserRound, X, XCircle } from 'lucide-react'

const fallbackText = '--'

const toneStyles = {
  blue: {
    headerIcon: 'bg-blue-50 text-blue-600',
  },
  success: {
    statusIcon: 'border-emerald-100 bg-emerald-50 text-emerald-600',
    amount: 'text-red-500',
  },
  credit: {
    statusIcon: 'border-emerald-100 bg-emerald-50 text-emerald-600',
    amount: 'text-emerald-600',
  },
  warning: {
    statusIcon: 'border-amber-100 bg-amber-50 text-amber-600',
    amount: 'text-slate-950',
  },
  danger: {
    statusIcon: 'border-red-100 bg-red-50 text-red-600',
    amount: 'text-slate-950',
  },
  processing: {
    statusIcon: 'border-blue-100 bg-blue-50 text-blue-600',
    amount: 'text-slate-950',
  },
  neutral: {
    statusIcon: 'border-slate-100 bg-slate-50 text-slate-600',
    amount: 'text-slate-950',
  },
}

const isBlank = (value) => value === null || value === undefined || value === ''

export const displayDetailValue = (value) => {
  if (isBlank(value)) return fallbackText
  return value
}

export const formatDetailAmount = (value) => {
  if (isBlank(value)) return fallbackText
  if (typeof value === 'number') {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const normalized = String(value).replace(/,/g, '')
  const numericValue = Number(normalized)
  if (Number.isFinite(numericValue)) {
    return numericValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return value
}

export const formatDetailCurrencyAmount = (currency, amount) => {
  const amountText = formatDetailAmount(amount)
  const currencyText = displayDetailValue(currency)
  if (amountText === fallbackText && currencyText === fallbackText) return fallbackText
  if (currencyText === fallbackText) return amountText
  return `${currencyText} ${amountText}`
}

function getStatusIcon(statusTone) {
  if (statusTone === 'danger') return XCircle
  if (statusTone === 'warning') return Clock3
  if (statusTone === 'processing') return Loader2
  return CheckCircle2
}

function TransactionDetailRow({ label, value, strong = false }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={strong ? 'max-w-[220px] break-words text-right text-sm font-bold text-slate-950' : 'max-w-[220px] break-words text-right text-sm font-semibold text-slate-700'}>
        {displayDetailValue(value)}
      </span>
    </div>
  )
}

function TransactionDetailSection({ title, children, className = '' }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-bold text-slate-700">{title}</h2>
      <div className={className}>{children}</div>
    </section>
  )
}

export function TransactionDetailDrawer({
  title,
  subtitle = 'TRANSACTION DETAIL',
  headerIcon: HeaderIcon = FileText,
  headerTone = 'blue',
  statusTone = 'success',
  amountTone = 'success',
  amountPrefix = '',
  statusLabel,
  amount,
  currency,
  feeLabel,
  feeAmount,
  feeCurrency,
  customer,
  businessRows = [],
  instructionRows = [],
  description,
  tabs,
  activeTab,
  onTabChange,
  onBack,
}) {
  const StatusIcon = getStatusIcon(statusTone)
  const headerIconClass = toneStyles[headerTone]?.headerIcon || toneStyles.blue.headerIcon
  const statusIconClass = toneStyles[statusTone]?.statusIcon || toneStyles.neutral.statusIcon
  const amountClass = toneStyles[amountTone]?.amount || toneStyles.neutral.amount
  const formattedAmount = formatDetailAmount(amount)
  const formattedCurrency = displayDetailValue(currency)
  const shouldShowFee = feeLabel || !isBlank(feeAmount)

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <main className="mx-auto min-h-screen max-w-[460px] bg-[#f7faff] shadow-sm">
        <div className="border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${headerIconClass}`}>
                <HeaderIcon className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-base font-bold text-slate-950">{displayDetailValue(title)}</h1>
                <div className="text-xs font-bold uppercase tracking-wide text-slate-400">{displayDetailValue(subtitle)}</div>
              </div>
            </div>
            <button type="button" onClick={onBack} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          {tabs?.length ? (
            <div className="mt-4 inline-flex rounded-xl bg-slate-100 p-1">
              {tabs.map((tab) => {
                const selected = tab.id === activeTab
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange?.(tab.id)}
                    className={selected ? 'h-8 rounded-lg bg-white px-4 text-sm font-bold text-blue-700 shadow-sm' : 'h-8 rounded-lg px-4 text-sm font-semibold text-slate-500 hover:text-slate-900'}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>

        <div className="space-y-6 px-6 py-6">
          <section className="rounded-3xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm">
            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border ${statusIconClass}`}>
              <StatusIcon className="h-6 w-6" />
            </div>
            <div className="mt-5 text-sm text-slate-500">{displayDetailValue(statusLabel)}</div>
            <div className={`mt-3 text-3xl font-bold ${amountClass}`}>
              {formattedAmount === fallbackText ? fallbackText : `${amountPrefix} ${formattedAmount}`.trim()}
              {formattedAmount !== fallbackText ? <span className="ml-2 text-base font-semibold text-slate-500">{formattedCurrency}</span> : null}
            </div>
            {shouldShowFee ? (
              <div className="mt-3 text-sm text-slate-500">
                {feeLabel || '手续费'}: {formatDetailAmount(feeAmount)} {displayDetailValue(feeCurrency || currency)}
              </div>
            ) : null}
          </section>

          <TransactionDetailSection title="客户" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
                <UserRound className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <div className="font-bold text-slate-950">{displayDetailValue(customer?.name)}</div>
                <div className="mt-1 text-sm text-slate-500">ID: {displayDetailValue(customer?.id)}</div>
                <div className="mt-1 break-all text-sm text-slate-500">{displayDetailValue(customer?.email)}</div>
              </div>
            </div>
          </TransactionDetailSection>

          <TransactionDetailSection title="业务信息" className="rounded-3xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            {businessRows.map((row) => (
              <TransactionDetailRow key={row.label} label={row.label} value={row.value} strong={row.strong} />
            ))}
          </TransactionDetailSection>

          <TransactionDetailSection title="指示详情" className="rounded-3xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            {instructionRows.map((row) => (
              <TransactionDetailRow key={row.label} label={row.label} value={row.value} strong={row.strong} />
            ))}
          </TransactionDetailSection>

          <TransactionDetailSection title="说明" className="rounded-3xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-sm">
            {displayDetailValue(description)}
          </TransactionDetailSection>
        </div>
      </main>
    </div>
  )
}
