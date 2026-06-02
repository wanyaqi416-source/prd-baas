import {
  Banknote,
  Building2,
  CheckCircle2,
  Download,
  FileText,
  FileUp,
  Globe2,
  Languages,
  LayoutDashboard,
  RefreshCw,
  Sun,
  UserRound,
  WalletCards,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import {
  createEmptyBaasApplication,
  createMockFile,
  getBaasApplicationSections,
  mockBaasOpeningProfile,
  validateBaasApplication,
} from '../data/baasOpeningApplication'
import { BaasEnterpriseOpeningApplication } from './BaasEnterpriseOpeningApplication'

const fileLimit = 8 * 1024 * 1024
const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png']

const formatOpeningFeeTime = () => {
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

const makeOpeningFeeTransactionId = () => {
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `TXN-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${Date.now().toString(16).slice(-8)}`
}

const createOpeningFeeRecord = () => {
  const createdAt = formatOpeningFeeTime()
  return {
    id: makeOpeningFeeTransactionId(),
    type: '开户费扣款',
    statusLabel: '已完成',
    amount: '500.00',
    currency: 'USD',
    feeAmount: '0.00',
    customerName: 'Wanyara Wan',
    customerId: '154',
    customerEmail: 'xr3kes66@123mails.org',
    applicationName: '个人 BaaS 开户申请',
    debitAccount: '信托账户',
    accountType: '美国账户开户申请',
    createdAt,
    transactionTime: createdAt,
    chargedAt: createdAt,
    nextStatus: '开户审核中',
    description: '开户资料提交后，开户费扣款成功，申请进入后台审核流程。',
  }
}

function ModalShell({ children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[480px] rounded-3xl bg-white p-6 shadow-2xl">{children}</div>
    </div>
  )
}

function ApplicationTopNav({ onBack }) {
  const navItems = [
    [LayoutDashboard, '仪表板'],
    [WalletCards, '账户'],
    [Banknote, '卡片'],
    [Globe2, '投资'],
    [RefreshCw, '交易'],
    [FileText, '信托服务'],
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
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

function FatcaSigningModal({ onCancel, onConfirm }) {
  return (
    <ModalShell>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-blue-500">Third-party signing</div>
          <h3 className="mt-1 text-2xl font-bold text-slate-950">签署 FATCA 文档</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">当前为第三方文档签署模拟。确认后将回填 FATCA 已签署状态，不再要求上传 FATCA 文件。</p>
        </div>
        <button type="button" onClick={onCancel} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-sm font-bold text-slate-950">W-8BEN / W-9 模拟签署包</div>
        <p className="mt-2 text-sm leading-6 text-slate-500">模拟跳转第三方签署服务、完成身份确认、签名并回传签署结果。</p>
      </div>
      <div className="mt-6 flex gap-3">
        <Button type="button" onClick={onConfirm} className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700">确认已签署</Button>
        <Button type="button" onClick={onCancel} variant="outline" className="rounded-lg">取消</Button>
      </div>
    </ModalShell>
  )
}

function FeeConfirmModal({ onClose, onConfirm }) {
  const rows = [
    ['扣费账户', '信托账户'],
    ['扣费币种', 'USD'],
    ['扣费金额', 'USD 500.00'],
  ]

  return (
    <ModalShell>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-blue-500">Opening fee</div>
          <h3 className="mt-1 text-2xl font-bold text-slate-950">确认开通并扣费</h3>
        </div>
        <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-500">开通美国账户将扣除 USD 500 开户费。扣费成功后生成开户交易记录。</p>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between border-b border-slate-200 py-3 last:border-b-0">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-sm font-bold text-slate-950">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <Button type="button" onClick={onConfirm} className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700">确认扣费</Button>
        <Button type="button" onClick={onClose} variant="outline" className="rounded-lg">取消</Button>
      </div>
    </ModalShell>
  )
}

function FeeResultModal({ type, onClose, onProceedToAccount, onViewPrototypeRecord }) {
  return (
    <ModalShell>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-2xl font-bold text-slate-950">扣费成功</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        USD 500 开户费已扣除，并生成开户交易记录。
      </p>
      <div className="mt-6 flex gap-3">
        <Button type="button" onClick={onProceedToAccount} className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700">返回账户页面</Button>
        <Button type="button" onClick={onViewPrototypeRecord} variant="outline" className="rounded-lg">查看开户费交易记录（原型展示）</Button>
        <Button type="button" onClick={onClose} variant="outline" className="rounded-lg">关闭</Button>
      </div>
    </ModalShell>
  )
}

function TransactionDetailRow({ label, value, strong = false }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={strong ? 'max-w-[220px] text-right text-sm font-bold text-slate-950' : 'max-w-[220px] text-right text-sm font-semibold text-slate-700'}>{value}</span>
    </div>
  )
}

function OpeningFeeTransactionDetailPage({ record, onBack, onProceedToOpeningStatus }) {
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <main className="mx-auto min-h-screen max-w-[460px] bg-[#f7faff] shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-base font-bold text-slate-950">开户费 详情</h1>
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
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="mt-5 text-sm text-slate-500">{record.statusLabel}</div>
            <div className="mt-3 text-3xl font-bold text-red-500">
              - {record.amount}
              <span className="ml-2 text-base font-semibold text-slate-500">{record.currency}</span>
            </div>
            <div className="mt-3 text-sm text-slate-500">手续费: {record.feeAmount} {record.currency}</div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold text-slate-700">客户</h2>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
                  <UserRound className="h-6 w-6" />
                </span>
                <div>
                  <div className="font-bold text-slate-950">{record.customerName}</div>
                  <div className="mt-1 text-sm text-slate-500">ID: {record.customerId}</div>
                  <div className="mt-1 text-sm text-slate-500">{record.customerEmail}</div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold text-slate-700">业务信息</h2>
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
              <TransactionDetailRow label="交易类型" value={record.type} strong />
              <TransactionDetailRow label="扣费账户" value={record.debitAccount} />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold text-slate-700">指示详情</h2>
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
              <TransactionDetailRow label="交易编号" value={record.id} strong />
              <TransactionDetailRow label="交易时间" value={record.transactionTime || record.createdAt} />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold text-slate-700">说明</h2>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-sm">
              {record.description}
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}

function FieldValue({ field, value }) {
  const sourceValue = field.sourceValue ?? value
  const baasValue = field.convertedValue ?? field.value ?? value
  const simpleValue = sourceValue || baasValue
  const simpleDisplay = simpleValue?.name ? `${simpleValue.name} · ${simpleValue.status || '已上传'}` : simpleValue

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">{field.label}</span>
        {field.note ? <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">{field.note}</span> : null}
        {field.conversionStatus ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">{field.conversionStatus}</span> : null}
      </div>
      <div className="mt-2 min-h-6 text-sm font-bold text-slate-950">{simpleDisplay || '-'}</div>
      {field.error ? <div className="mt-2 text-xs leading-5 text-amber-700">{field.error}</div> : null}
      {field.hint ? <div className="mt-1 text-xs leading-5 text-slate-400">{field.hint}</div> : null}
      <div className="mt-3">
        <DownloadButton file={field.value} />
      </div>
    </div>
  )
}

function DownloadButton({ file }) {
  if (!file?.downloadUrl) return null

  return (
    <a
      href={file.downloadUrl}
      download={file.name || 'attachment'}
      className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-emerald-50 px-3 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
    >
      <Download className="h-4 w-4" />
      下载
    </a>
  )
}

function PersonalFileUpload({ field, file, error, onFileChange }) {
  return (
    <div className={error ? 'rounded-xl border border-red-200 bg-red-50 p-4' : 'rounded-xl border border-slate-200 bg-white p-4'}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-slate-950">{field.label}</div>
          <div className="mt-1 text-xs leading-5 text-slate-500">{field.hint ? `${field.hint}；` : ''}支持 pdf / jpeg / png，单个文件大小限制 8M。</div>
          {file ? <div className="mt-2 text-xs font-semibold text-blue-700">{file.name} · {file.status || '已上传'}</div> : null}
          {error ? <div className="mt-2 text-xs leading-5 text-red-600">{error}</div> : null}
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          <DownloadButton file={file} />
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-blue-50 px-3 text-xs font-bold text-blue-700 hover:bg-blue-100">
            <FileUp className="h-4 w-4" />
            上传
            <input
              type="file"
              accept=".pdf,.jpeg,.jpg,.png,application/pdf,image/jpeg,image/png"
              className="hidden"
              onChange={(event) => {
                onFileChange(field.key, event.target.files?.[0])
                event.target.value = ''
              }}
            />
          </label>
        </div>
      </div>
    </div>
  )
}

function PersonalTextInput({ field, value, error, onChange }) {
  const isPassportType = field.key === 'identityType'

  return (
    <label className={error ? 'block rounded-xl border border-red-200 bg-red-50 p-4' : 'block rounded-xl border border-slate-200 bg-white p-4'}>
      <span className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-slate-950">{field.label}</span>
      </span>
      {field.note ? <span className="mt-2 block text-xs leading-5 text-amber-700">{field.note}</span> : null}
      {isPassportType ? (
        <select
          value={value || ''}
          onChange={(event) => onChange(field.key, event.target.value)}
          className={error ? 'mt-3 h-11 w-full rounded-lg border border-red-300 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-red-400' : 'mt-3 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-400'}
        >
          <option value="">请选择</option>
          <option value="PASSPORT">PASSPORT</option>
        </select>
      ) : (
        <input
          value={value || ''}
          onChange={(event) => onChange(field.key, event.target.value)}
          placeholder={field.hint || '请输入'}
          className={error ? 'mt-3 h-11 w-full rounded-lg border border-red-300 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-red-400' : 'mt-3 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-400'}
        />
      )}
      {field.requirements?.length ? (
        <div className="mt-2 grid gap-1 text-xs leading-5 text-slate-500">
          {field.requirements.map((requirement) => <span key={requirement}>{requirement}</span>)}
        </div>
      ) : field.hint ? <span className="mt-1 block text-xs leading-5 text-slate-500">{field.hint}</span> : null}
      {error ? <span className="mt-2 block text-xs leading-5 text-red-600">{error}</span> : null}
    </label>
  )
}

function FatcaSigningCard({ signed, error, onOpen }) {
  return (
    <div className={error ? 'rounded-xl border border-red-200 bg-red-50 p-4' : signed ? 'rounded-xl border border-emerald-200 bg-emerald-50 p-4' : 'rounded-xl border border-slate-200 bg-white p-4'}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <span className={signed ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm' : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700'}>
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-bold text-slate-950">FATCA 第三方文档签署</div>
            <div className="mt-1 text-xs leading-5 text-slate-500">通过第三方签署模拟完成 W-8BEN / W-9，不作为文件上传。</div>
            <div className={signed ? 'mt-2 text-xs font-bold text-emerald-700' : 'mt-2 text-xs font-bold text-amber-700'}>
              {signed ? '已签署' : '待签署'}
            </div>
            {error ? <div className="mt-2 text-xs leading-5 text-red-600">{error}</div> : null}
          </div>
        </div>
        <Button type="button" onClick={onOpen} variant={signed ? 'outline' : 'default'} className={signed ? 'shrink-0 rounded-lg' : 'shrink-0 rounded-lg bg-blue-600 hover:bg-blue-700'}>
          {signed ? '重新签署' : '去签署'}
        </Button>
      </div>
    </div>
  )
}

export function BaasOpeningApplicationPage({ onBack, onProceedToOpeningStatus, defaultAccountType = 'personal' }) {
  const [accountType, setAccountType] = useState(defaultAccountType)
  const [profileValues] = useState(mockBaasOpeningProfile)
  const [supplementValues, setSupplementValues] = useState(createEmptyBaasApplication)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const [feeConfirmOpen, setFeeConfirmOpen] = useState(false)
  const [feeResult, setFeeResult] = useState(null)
  const [openingFeeRecord, setOpeningFeeRecord] = useState(null)
  const [openingFeeDetailOpen, setOpeningFeeDetailOpen] = useState(false)
  const [fatcaSigned, setFatcaSigned] = useState(false)
  const [fatcaSignOpen, setFatcaSignOpen] = useState(false)
  const [enterpriseStats, setEnterpriseStats] = useState({ acquired: 0, missing: 0, revision: 0 })
  const [enterpriseActions, setEnterpriseActions] = useState(null)

  const sections = useMemo(() => getBaasApplicationSections(profileValues, supplementValues), [profileValues, supplementValues])
  const pendingCount = sections.missing.length + (fatcaSigned ? 0 : 1)
  const personalStats = { acquired: sections.acquired.length, missing: pendingCount, revision: 0 }
  const activeStats = accountType === 'enterprise' ? enterpriseStats : personalStats

  const changePersonalFile = (key, file) => {
    if (!file) return
    if (!acceptedTypes.includes(file.type)) {
      setErrors((current) => ({ ...current, [key]: '仅支持 pdf / jpeg / png 文件。' }))
      return
    }
    if (file.size > fileLimit) {
      setErrors((current) => ({ ...current, [key]: '单个文件大小不能超过 8M。' }))
      return
    }
    setSupplementValues((current) => ({ ...current, [key]: createMockFile(file) }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  const changePersonalValue = (key, value) => {
    setSupplementValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  const saveDraft = () => {
    if (accountType === 'enterprise') {
      enterpriseActions?.saveDraft?.()
      return
    }
    setNotice('草稿已保存。')
  }

  const submitApplication = () => {
    if (accountType === 'enterprise') {
      const ok = enterpriseActions?.submit?.()
      if (ok) setFeeConfirmOpen(true)
      return
    }

    const nextErrors = validateBaasApplication(profileValues, supplementValues)
    if (!fatcaSigned) {
      nextErrors.fatcaSigning = '请先完成 FATCA 第三方文档签署。'
    }
    setErrors(nextErrors)
    setNotice('')
    if (Object.keys(nextErrors).length > 0) {
      setNotice('仍有资料待补充或需修正，请补充后再提交。')
      return
    }
    // 开发说明：提交后走自动开户流程。Fidere 将 KYC 和 VA 信息给到 BaaS，BaaS 提交给 Interlace；
    // Interlace 分两次判断 KYC 和 VA 是否通过，通过后回传 BaaS，BaaS 再通知 Fidere 审核通过。
    setFeeConfirmOpen(true)
  }

  const confirmFee = () => {
    setFeeConfirmOpen(false)
    setOpeningFeeRecord(createOpeningFeeRecord())
    setFeeResult('success')
  }

  const openOpeningFeeDetail = () => {
    setFeeResult(null)
    setOpeningFeeDetailOpen(true)
  }

  const proceedToOpeningStatus = () => {
    setOpeningFeeDetailOpen(false)
    onProceedToOpeningStatus()
  }

  if (openingFeeDetailOpen && openingFeeRecord) {
    return (
      <OpeningFeeTransactionDetailPage
        record={openingFeeRecord}
        onBack={() => setOpeningFeeDetailOpen(false)}
        onProceedToOpeningStatus={proceedToOpeningStatus}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] pb-28 text-slate-950">
      <ApplicationTopNav onBack={onBack} />
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-[1280px] flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div>
            <button type="button" onClick={onBack} className="text-sm font-semibold text-blue-700 hover:text-blue-900">返回开户流程</button>
            <h1 className="mt-1 text-2xl font-bold text-slate-950">BaaS 开户申请</h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">先复用系统已有 KYC / KYB / Sumsub 资料，仅补充 BaaS 必需但系统缺失的资料。带出的资料格式需要符合 BaaS Create Legal Entity API 要求。</p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1280px] gap-5 px-5 py-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-950">原型开户类型切换</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">仅用于原型演示切换。真实用户会根据账户类型自动进入个人或企业开户资料页面。</p>
            </div>
            <Badge variant={accountType === 'enterprise' ? 'warning' : 'secondary'}>{accountType === 'enterprise' ? '企业开户' : '个人开户'}</Badge>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setAccountType('personal')}
              className={accountType === 'personal' ? 'flex items-center gap-3 rounded-2xl border border-blue-300 bg-blue-50 p-4 text-left' : 'flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-blue-200'}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm"><UserRound className="h-5 w-5" /></span>
              <span><span className="block font-bold text-slate-950">个人开户</span><span className="mt-1 block text-sm text-slate-500">复用个人 KYC / Sumsub 资料。</span></span>
            </button>
            <button
              type="button"
              onClick={() => setAccountType('enterprise')}
              className={accountType === 'enterprise' ? 'flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-left' : 'flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-amber-200'}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm"><Building2 className="h-5 w-5" /></span>
              <span><span className="block font-bold text-slate-950">企业开户</span><span className="mt-1 block text-sm text-slate-500">复用企业 KYB 资料，补充企业信息、法人代表和股东信息。</span></span>
            </button>
          </div>
        </section>

        {notice ? <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-800">{notice}</div> : null}

        {accountType === 'enterprise' ? (
          <BaasEnterpriseOpeningApplication
            onRegisterActions={setEnterpriseActions}
            onStatsChange={setEnterpriseStats}
            onSubmitSuccess={() => setFeeConfirmOpen(true)}
          />
        ) : (
          <div className="grid gap-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-950">已获取资料</h2>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-500">当前系统已有字段自动带出，只读展示，供用户确认。</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {sections.acquired.map((field) => <FieldValue key={field.id} field={field} value={field.value} />)}
              </div>
            </section>
            <section className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-950">待补充资料</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">当前系统缺失的 BaaS 必填字段在这里填写或上传；证件类型已固定为 PASSPORT 并展示在已获取资料中。</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 lg:grid-cols-2">
                {sections.missing.map((field) => (
                  field.inputType === 'file'
                    ? <PersonalFileUpload key={field.id} field={field} file={supplementValues[field.key]} error={errors[field.key]} onFileChange={changePersonalFile} />
                    : <PersonalTextInput key={field.id} field={field} value={supplementValues[field.key]} error={errors[field.key]} onChange={changePersonalValue} />
                ))}
                <FatcaSigningCard signed={fatcaSigned} error={errors.fatcaSigning} onOpen={() => setFatcaSignOpen(true)} />
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-5 py-4 shadow-2xl backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-600">
            {accountType === 'enterprise' ? (
              <>
                <span>{`还有 ${activeStats.missing} 项待补充`}</span>
                <Button type="button" onClick={() => enterpriseActions?.nextItem?.()} variant="outline" size="sm" className="rounded-lg">下一项</Button>
              </>
            ) : null}
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <Button type="button" onClick={onBack} variant="outline" className="rounded-lg">取消</Button>
            <Button type="button" onClick={saveDraft} variant="outline" className="rounded-lg">保存草稿</Button>
            <Button type="button" onClick={submitApplication} className="rounded-lg bg-blue-600 hover:bg-blue-700">提交开户申请</Button>
          </div>
        </div>
      </footer>

      {fatcaSignOpen ? <FatcaSigningModal onCancel={() => setFatcaSignOpen(false)} onConfirm={() => { setFatcaSigned(true); setErrors((current) => ({ ...current, fatcaSigning: '' })); setFatcaSignOpen(false) }} /> : null}
      {feeConfirmOpen ? <FeeConfirmModal onClose={() => setFeeConfirmOpen(false)} onConfirm={confirmFee} /> : null}
      {feeResult ? (
        <FeeResultModal
          type={feeResult}
          onClose={() => setFeeResult(null)}
          onProceedToAccount={proceedToOpeningStatus}
          onViewPrototypeRecord={openOpeningFeeDetail}
        />
      ) : null}
    </div>
  )
}
