import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ExternalLink,
  FileSignature,
  FileText,
  Info,
  Landmark,
  Loader2,
  PenLine,
  Upload,
  WalletCards,
} from 'lucide-react'
import { useMemo, useState } from 'react'

const brokerConfigs = [
  {
    id: 'ibkr',
    name: 'IBKR',
    logo: 'IB',
    website: 'https://www.interactivebrokers.com',
    feeSchedule: 'https://www.interactivebrokers.com/en/pricing/commissions-stocks.php',
    description:
      'IBKR 是平台支持的合作券商之一，可为客户提供多市场证券账户服务。客户提交开户申请及所需资料后，平台将协助进行人工开户处理。具体账户功能、费用标准及支持市场以券商最终规则为准。',
    marketAvailability: '美股、港股、全球市场，具体以券商实际支持范围为准。',
    openingFee: { amount: 100, currency: 'USD' },
    monthlyFee: { amount: 0, currency: 'USD' },
    enabled: true,
    flowType: 'upload',
  },
  {
    id: 'webull',
    name: 'Webull',
    logo: 'WB',
    website: 'https://www.webull.com',
    feeSchedule: 'https://www.webull.com/pricing',
    description:
      'Webull 是平台支持的合作券商之一，可为客户提供证券账户申请服务。客户完成相关文件签署并提交开户申请后，平台将协助进行后续开户处理。具体账户功能、费用标准及支持市场以券商最终规则为准。',
    marketAvailability: '美股、港股，具体以券商实际支持范围为准。',
    openingFee: { amount: 100, currency: 'USD' },
    monthlyFee: { amount: 0, currency: 'USD' },
    enabled: true,
    flowType: 'signature',
  },
]

const paymentAccounts = [
  { id: 'usd-main', label: 'USD 账户', currency: 'USD', balance: 320 },
  { id: 'usd-low', label: '备用 USD 账户', currency: 'USD', balance: 40 },
]

const uploadRequirements = [
  {
    id: 'utility_bill',
    title: '水电费账单',
    description: '请上传可用于辅助核验地址信息的水电费账单。具体文件要求以后续正式说明为准。',
    accept: '.pdf,.jpg,.jpeg,.png',
  },
  {
    id: 'proof_of_address',
    title: '地址证明',
    description: '请上传包含您姓名和地址信息的地址证明文件。具体可接受文件类型以后续正式说明为准。',
    accept: '.pdf,.jpg,.jpeg,.png',
  },
]

const webullDocuments = [
  { id: 'opening_documents', title: 'Webull 开户相关文件' },
  { id: 'service_disclosure', title: 'Webull 授权 / 风险披露 / 账户服务相关文件' },
]

const processSteps = [
  { title: '选择券商', description: '查看合作券商介绍、支持市场和费用说明。' },
  { title: '确认开户费用', description: '确认开户费、扣款金额和支付账户余额。' },
  { title: '上传资料或签署文件', description: '根据券商要求完成材料上传或文件签署。' },
  { title: '提交开户申请', description: '资料完整后提交申请，平台进入人工处理。' },
  { title: '等待人工处理', description: '后台人员协助推进券商开户流程。' },
  { title: '查看账户信息', description: '开户完成后查看券商账户号码和状态。' },
]

const statusMap = {
  not_started: { label: '未开始', tone: 'bg-slate-100 text-slate-600', action: '开始申请' },
  documents_required: { label: '资料待上传', tone: 'bg-amber-50 text-amber-700', action: '继续上传资料' },
  signature_required: { label: '文件待签署', tone: 'bg-amber-50 text-amber-700', action: '继续签署文件' },
  submitted: { label: '已提交', tone: 'bg-blue-50 text-blue-700', action: '查看申请详情' },
  manual_review: { label: '人工审核中', tone: 'bg-blue-50 text-blue-700', action: '查看申请详情' },
  processing: { label: '开户处理中', tone: 'bg-purple-50 text-purple-700', action: '查看进度' },
  opened: { label: '已开户', tone: 'bg-emerald-50 text-emerald-700', action: '查看券商账户' },
  returned: { label: '需补充资料', tone: 'bg-amber-50 text-amber-700', action: '补充资料' },
  rejected: { label: '已拒绝', tone: 'bg-red-50 text-red-700', action: '查看拒绝原因' },
}

function formatFee(fee) {
  return `${fee.amount} ${fee.currency}`
}

function nowText() {
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

function TopNav({ onBack }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-5">
        <div className="flex items-center gap-8">
          <button type="button" onClick={onBack} className="text-xl font-black tracking-tight text-slate-900">
            FIDERE
          </button>
          <nav className="hidden items-center gap-2 text-sm text-slate-500 md:flex">
            {['仪表板', '账户'].map((item) => (
              <button key={item} type="button" className="h-9 rounded-lg px-3 font-medium hover:bg-slate-100 hover:text-slate-900">
                {item}
              </button>
            ))}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="inline-flex h-9 items-center gap-1 rounded-lg bg-blue-600 px-4 font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                投资
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {open ? (
                <div className="absolute left-0 top-11 z-30 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    开通券商账户
                    <PenLine className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : null}
            </div>
            {['交易', '信托服务'].map((item) => (
              <button key={item} type="button" className="h-9 rounded-lg px-3 font-medium hover:bg-slate-100 hover:text-slate-900">
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-slate-500">
          <span className="hidden rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold md:inline-flex">简体中文</span>
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
            WW
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500" />
          </span>
        </div>
      </div>
    </header>
  )
}

function PageHeader({ onBack, stepLabel }) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-5 py-5">
        <button type="button" onClick={onBack} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-black text-slate-950">开通券商账户</h1>
          <p className="mt-1 text-sm text-slate-500">{stepLabel || '选择券商、确认费用并提交开户申请'}</p>
        </div>
      </div>
    </div>
  )
}

function PrimaryButton({ children, disabled, onClick, loading, className = '' }) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-black text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 ${className}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  )
}

function SecondaryButton({ children, onClick, className = '' }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex h-12 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 hover:bg-slate-50 ${className}`}>
      {children}
    </button>
  )
}

function StatusBadge({ status }) {
  const config = statusMap[status]
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${config.tone}`}>{config.label}</span>
}

function BrokerLogo({ broker, size = 'md' }) {
  const dimension = size === 'lg' ? 'h-14 w-14 text-base' : 'h-11 w-11 text-sm'
  const bg = broker.id === 'ibkr' ? 'bg-red-600' : 'bg-blue-600'
  return <div className={`${dimension} flex shrink-0 items-center justify-center rounded-2xl ${bg} font-black text-white`}>{broker.logo}</div>
}

function HeroSection({ onSelectBroker, onViewRecord }) {
  return (
    <section className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
      <div className="flex flex-col justify-center">
        <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          <Landmark className="h-4 w-4" />
          券商账户开户
        </div>
        <h2 className="max-w-2xl text-4xl font-black leading-tight text-slate-950">通过券商账户拓展您的全球投资机会</h2>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
          您可以通过平台合作券商申请开通证券账户。开户申请提交后，平台将根据您选择的券商要求收集资料，并由后台人员协助处理开户流程。
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <PrimaryButton onClick={onSelectBroker} className="min-w-36">选择券商</PrimaryButton>
          <SecondaryButton onClick={onViewRecord} className="min-w-36">查看申请记录</SecondaryButton>
        </div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-600 p-6 text-white">
        <div className="flex min-h-[300px] flex-col justify-between rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
          <div>
            <div className="text-sm font-bold text-blue-100">投资组合概览</div>
            <div className="mt-6 grid grid-cols-6 items-end gap-3">
              {[44, 72, 52, 92, 64, 82].map((height, index) => (
                <div key={height} className="rounded-t-xl bg-white/25" style={{ height: `${height + index * 3}px` }} />
              ))}
            </div>
            <div className="mt-5 h-1 rounded-full bg-gradient-to-r from-emerald-300 via-sky-300 to-white" />
          </div>
          <div className="grid gap-3 rounded-2xl bg-white/10 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-100">开户费</span>
              <span className="font-black">100 USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-100">处理方式</span>
              <span className="font-black">人工处理</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-100">当前阶段</span>
              <span className="font-black">MVP 原型</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-black text-slate-950">开户流程</h2>
        <p className="mt-1 text-sm text-slate-500">了解完整步骤后再开始申请，减少来回补充资料。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {processSteps.map((step, index) => (
          <div key={step.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">{index + 1}</div>
              <div className="font-black text-slate-950">{step.title}</div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function BrokerSection({ selectedBrokerId, onSelect }) {
  const defaultFee = brokerConfigs[0].openingFee
  const defaultMonthlyFee = brokerConfigs[0].monthlyFee

  return (
    <section id="broker-list" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-950">选择合作券商</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            请选择您希望开通的券商账户。同一时间仅支持提交一个券商开户申请，开户处理时间以券商及人工审核进度为准。
          </p>
        </div>
        <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 px-4 py-3 text-sm text-slate-900">
          <div>
            开户费：<span className="font-black">{formatFee(defaultFee)}</span>
          </div>
          <div className="mt-1">
            账户月费：<span className="font-black">{formatFee(defaultMonthlyFee)}</span> / 月 / 每个券商账户
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {brokerConfigs.map((broker) => {
          const active = selectedBrokerId === broker.id
          return (
            <article key={broker.id} className={`flex flex-col rounded-2xl border p-5 ${active ? 'border-blue-500 bg-blue-50/40 shadow-lg shadow-blue-100' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-start gap-4">
                <BrokerLogo broker={broker} size="lg" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-black text-slate-950">{broker.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm font-semibold text-blue-600">
                    <a href={broker.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
                      官方网站
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <span className="text-slate-300">•</span>
                    <a href={broker.feeSchedule} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
                      费用说明
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
              <p className="mt-5 flex-1 text-sm leading-7 text-slate-600">{broker.description}</p>
              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <div className="text-xs font-bold text-slate-500">支持市场</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{broker.marketAvailability}</div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoTile label="开户费" value={formatFee(broker.openingFee)} />
                <InfoTile label="账户月费" value={formatFee(broker.monthlyFee)} />
              </div>
              <PrimaryButton onClick={() => onSelect(broker.id)} className="mt-5 w-full">选择</PrimaryButton>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="text-xs font-bold text-slate-400">{label}</div>
      <div className="mt-1 font-black text-slate-950">{value}</div>
    </div>
  )
}

function HomePage({ selectedBrokerId, onSelectBroker, onViewRecord }) {
  return (
    <div className="space-y-6">
      <HeroSection
        onSelectBroker={() => document.getElementById('broker-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        onViewRecord={onViewRecord}
      />
      <ProcessSection />
      <BrokerSection selectedBrokerId={selectedBrokerId} onSelect={onSelectBroker} />
    </div>
  )
}

function ConfirmationPage({
  broker,
  selectedPaymentAccountId,
  setSelectedPaymentAccountId,
  remarks,
  setRemarks,
  acknowledged,
  setAcknowledged,
  onBack,
  onConfirm,
}) {
  const selectedAccount = paymentAccounts.find((account) => account.id === selectedPaymentAccountId) || paymentAccounts[0]
  const insufficient = selectedAccount.balance < broker.openingFee.amount
  const canSubmit = acknowledged && !insufficient

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-950">确认开户申请</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">请确认券商、开户费和扣款账户。确认后将进入该券商要求的资料提交步骤。</p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-4">
            <BrokerLogo broker={broker} size="lg" />
            <div>
              <div className="text-sm font-bold text-slate-500">已选择券商</div>
              <div className="mt-1 text-2xl font-black text-slate-950">{broker.name}</div>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InfoTile label="开户费" value={formatFee(broker.openingFee)} />
            <InfoTile label="扣款金额" value={formatFee(broker.openingFee)} />
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 p-5">
          <label className="text-sm font-black text-slate-700" htmlFor="payment-account">支付账户</label>
          <select
            id="payment-account"
            value={selectedPaymentAccountId}
            onChange={(event) => setSelectedPaymentAccountId(event.target.value)}
            className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
          >
            {paymentAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.label} - 可用余额：{account.balance} {account.currency}
              </option>
            ))}
          </select>
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
            当前可用余额：<span className="font-black text-slate-950">{selectedAccount.balance} {selectedAccount.currency}</span>
          </div>
          {insufficient ? <Notice tone="red" text="余额不足，请更换支付账户或先完成入金后再提交申请。" /> : null}
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 p-5">
          <label className="text-sm font-black text-slate-700" htmlFor="remarks">备注</label>
          <textarea
            id="remarks"
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)}
            placeholder="如有需要，请填写本次开户申请备注，非必填。"
            className="mt-3 h-28 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-slate-700">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(event) => setAcknowledged(event.target.checked)}
            className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>我确认已阅读并同意相关费用说明，知晓本次开户申请将收取开户费，后续账户服务费用以券商规则及平台展示为准。</span>
        </label>

        <div className="mt-6 flex flex-wrap gap-3">
          <SecondaryButton onClick={onBack}>返回选择券商</SecondaryButton>
          <PrimaryButton disabled={!canSubmit} onClick={onConfirm} className="min-w-40">确认提交</PrimaryButton>
        </div>
      </section>

      <SummaryAside broker={broker} selectedAccount={selectedAccount} status="not_started" />
    </div>
  )
}

function UploadPage({ broker, files, setFiles, onBack, onSubmit, submitting }) {
  const missing = uploadRequirements.filter((item) => !files[item.id]?.fileName)

  const updateFile = (item, file) => {
    if (!file) return
    setFiles((current) => ({
      ...current,
      [item.id]: {
        fileName: file.name,
        uploadedAt: nowText(),
        status: '已上传',
      },
    }))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">上传开户资料</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">请根据 {broker.name} 开户要求上传以下资料。资料提交后，平台将进行人工审核并协助处理开户申请。</p>
        <div className="mt-6 grid gap-4">
          {uploadRequirements.map((item) => {
            const current = files[item.id]
            return (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-black text-slate-950">{item.title}<span className="text-red-500"> *</span></div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                    <p className="mt-1 text-xs text-slate-400">支持 PDF、JPG、PNG。</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${current ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {current?.status || '未上传'}
                  </span>
                </div>
                <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50 p-4 text-sm font-black text-blue-700 hover:bg-blue-100">
                  <Upload className="h-4 w-4" />
                  上传文件
                  <input type="file" accept={item.accept} className="hidden" onChange={(event) => updateFile(item, event.target.files?.[0])} />
                </label>
                {current ? (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
                    <div className="font-bold text-slate-900">{current.fileName}</div>
                    <div className="mt-1 text-slate-500">上传时间：{current.uploadedAt}</div>
                    <div className="mt-1 text-slate-500">文件状态：待审核</div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
        {missing.length ? <Notice tone="amber" text="请先上传所有必传文件后再提交开户申请。" /> : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <SecondaryButton onClick={onBack}>上一步</SecondaryButton>
          <PrimaryButton disabled={missing.length > 0} loading={submitting} onClick={onSubmit} className="min-w-40">提交开户申请</PrimaryButton>
        </div>
      </section>

      <SummaryAside broker={broker} status="documents_required" />
    </div>
  )
}

function SignaturePage({ broker, signedDocs, setSignedDocs, onBack, onSubmit, submitting }) {
  const allSigned = webullDocuments.every((doc) => signedDocs[doc.id] === 'signed')

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">签署开户文件</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">请完成以下文件的查看与签署。全部文件签署完成后，才可以提交开户申请。</p>
        <div className="mt-6 grid gap-4">
          {webullDocuments.map((doc) => {
            const signed = signedDocs[doc.id] === 'signed'
            return (
              <div key={doc.id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <FileSignature className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-lg font-black text-slate-950">{doc.title}</div>
                    <div className={`mt-2 text-sm font-bold ${signed ? 'text-emerald-700' : 'text-amber-700'}`}>{signed ? '已签署' : '未签署'}</div>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <SecondaryButton>查看文件</SecondaryButton>
                  <PrimaryButton onClick={() => setSignedDocs((current) => ({ ...current, [doc.id]: 'signed' }))}>{signed ? '重新签署' : '前往签署'}</PrimaryButton>
                </div>
              </div>
            )
          })}
        </div>
        {!allSigned ? <Notice tone="amber" text="两份文件均签署完成后，才可以提交开户申请。" /> : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <SecondaryButton onClick={onBack}>上一步</SecondaryButton>
          <PrimaryButton disabled={!allSigned} loading={submitting} onClick={onSubmit} className="min-w-40">提交开户申请</PrimaryButton>
        </div>
      </section>

      <SummaryAside broker={broker} status="signature_required" />
    </div>
  )
}

function StatusPage({ broker, status, setStatus, application, accountInfo, onNextAction }) {
  const config = statusMap[status]
  const statusButtons = ['manual_review', 'processing', 'opened', 'returned', 'rejected']

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">{status === 'opened' ? '券商账户详情' : '申请状态'}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">查看当前券商开户申请状态，开户完成后可在此查看券商账户信息。</p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-center gap-4">
            <BrokerLogo broker={broker} size="lg" />
            <div>
              <div className="text-sm font-bold text-blue-700">当前券商</div>
              <div className="mt-1 text-2xl font-black text-slate-950">{broker.name}</div>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoTile label="申请编号" value={application.id} />
            <InfoTile label="提交时间" value={application.submittedAt} />
            <InfoTile label="开户费" value={formatFee(broker.openingFee)} />
            <InfoTile label="审核备注" value={application.reviewNote} />
          </div>
        </div>

        {status === 'returned' ? <Notice tone="amber" text="退回原因：地址证明文件较模糊，请补充上传更清晰的文件。" /> : null}
        {status === 'rejected' ? <Notice tone="red" text="拒绝原因：当前资料暂不符合券商开户要求，请联系客户经理确认。" /> : null}

        {status === 'opened' ? (
          <div className="mt-6 rounded-2xl border border-slate-200 p-5">
            <h3 className="text-xl font-black text-slate-950">券商账户信息</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InfoTile label="券商名称" value={broker.name} />
              <InfoTile label="账户名称" value={accountInfo.accountName} />
              <InfoTile label="券商账户号码" value={accountInfo.accountNumber} />
              <InfoTile label="账户币种" value={accountInfo.currency} />
              <InfoTile label="开户日期" value={accountInfo.openedAt} />
              <InfoTile label="账户状态" value={accountInfo.status} />
              <div className="sm:col-span-2">
                <InfoTile label="备注信息" value={accountInfo.remark} />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 h-5 w-5 text-blue-600" />
              <div>
                <div className="font-black text-slate-950">{config.label}</div>
                <p className="mt-2 text-sm leading-6 text-slate-500">申请已进入平台人工处理流程。状态更新后，您可以在此查看最新进度。</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryButton onClick={onNextAction} className="min-w-40">{config.action}</PrimaryButton>
          {statusButtons.map((item) => (
            <button key={item} type="button" onClick={() => setStatus(item)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-50">
              演示：{statusMap[item].label}
            </button>
          ))}
        </div>
      </section>

      <SummaryAside broker={broker} status={status} />
    </div>
  )
}

function SummaryAside({ broker, selectedAccount, status }) {
  if (!broker) return null

  return (
    <aside className="space-y-4 lg:sticky lg:top-5 lg:self-start">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-base font-black text-slate-950">
          <WalletCards className="h-5 w-5 text-blue-600" />
          本次申请摘要
        </div>
        <div className="mt-4 grid gap-3">
          <SummaryRow label="券商" value={broker.name} />
          <SummaryRow label="开户费" value={formatFee(broker.openingFee)} />
          <SummaryRow label="账户月费" value={`${formatFee(broker.monthlyFee)} / 月`} />
          {selectedAccount ? <SummaryRow label="支付账户" value={`${selectedAccount.label} · ${selectedAccount.balance} ${selectedAccount.currency}`} /> : null}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">当前状态</span>
            <StatusBadge status={status} />
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-black text-slate-950">MVP 边界</div>
        <p className="mt-3 text-sm leading-6 text-slate-500">第一阶段仅覆盖客户选择券商、确认开户费、上传或签署资料、提交申请，以及后台人工录入开户结果。</p>
      </section>
    </aside>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm last:border-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-black text-slate-950">{value}</span>
    </div>
  )
}

function Notice({ tone, text }) {
  const cls = tone === 'red' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
  return (
    <div className={`mt-5 flex gap-3 rounded-xl p-4 text-sm font-bold ${cls}`}>
      <AlertCircle className="h-5 w-5 shrink-0" />
      {text}
    </div>
  )
}

function BackendReservePanel() {
  const items = [
    '券商配置：名称、Logo、官网、费用说明、介绍文案、支持市场、开户费、账户月费、启用状态',
    '开户资料文案配置：IBKR 水电费账单说明、IBKR 地址证明说明、Webull 文件说明',
    '开户申请管理：申请人、所选券商、提交时间、开户费、支付状态、上传文件、签署状态',
    '人工处理：更新开户状态、填写审核备注、填写退回原因、录入券商账户信息',
  ]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
      <div className="mb-3 font-black text-slate-950">后台预留能力</div>
      <div className="grid gap-2 md:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="flex gap-2 rounded-xl bg-slate-50 p-3">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function SecuritiesAccountOpeningPrototype({ onBack }) {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedBrokerId, setSelectedBrokerId] = useState('')
  const [selectedPaymentAccountId, setSelectedPaymentAccountId] = useState(paymentAccounts[0].id)
  const [remarks, setRemarks] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState({})
  const [signedDocs, setSignedDocs] = useState({})
  const [applicationStatus, setApplicationStatus] = useState('not_started')
  const [application, setApplication] = useState({
    id: 'SA-20260617-0018',
    submittedAt: '-',
    reviewNote: '尚未提交申请',
  })
  const [toast, setToast] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const selectedBroker = useMemo(() => brokerConfigs.find((broker) => broker.id === selectedBrokerId), [selectedBrokerId])

  const accountInfo = {
    accountName: 'Wanyara Wan Securities',
    accountNumber: `${selectedBroker?.name || 'SEC'}-202606-0018`,
    currency: 'USD / HKD',
    openedAt: '2026-06-17',
    status: '已启用',
    remark: '由后台人工录入，第一阶段仅展示开户结果。',
  }

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 1800)
  }

  const selectBroker = (brokerId) => {
    setSelectedBrokerId(brokerId)
    setApplicationStatus('not_started')
    setAcknowledged(false)
    setCurrentPage('confirm')
  }

  const goRequirementPage = () => {
    if (!selectedBroker) return
    setApplicationStatus(selectedBroker.flowType === 'upload' ? 'documents_required' : 'signature_required')
    setCurrentPage(selectedBroker.flowType === 'upload' ? 'upload' : 'signature')
  }

  const submitApplication = () => {
    if (!selectedBroker) return
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      setApplicationStatus('manual_review')
      setApplication({
        id: `SA-${Date.now()}`,
        submittedAt: nowText(),
        reviewNote: remarks || '申请已提交，等待平台人工审核。',
      })
      setCurrentPage('status')
      showToast('开户申请已提交，请等待人工处理。')
    }, 600)
  }

  const pageLabel = {
    home: '选择券商、确认费用并提交开户申请',
    confirm: '确认开户申请',
    upload: '上传开户资料',
    signature: '签署开户文件',
    status: '查看申请状态',
  }[currentPage]

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <TopNav onBack={onBack} />
      <PageHeader onBack={onBack} stepLabel={pageLabel} />
      <main className="mx-auto max-w-[1200px] space-y-6 px-5 py-6">
        {currentPage === 'home' ? (
          <HomePage
            selectedBrokerId={selectedBrokerId}
            onSelectBroker={selectBroker}
            onViewRecord={() => {
              if (!selectedBrokerId) setSelectedBrokerId('ibkr')
              setCurrentPage('status')
            }}
          />
        ) : null}
        {currentPage === 'confirm' && selectedBroker ? (
          <ConfirmationPage
            broker={selectedBroker}
            selectedPaymentAccountId={selectedPaymentAccountId}
            setSelectedPaymentAccountId={setSelectedPaymentAccountId}
            remarks={remarks}
            setRemarks={setRemarks}
            acknowledged={acknowledged}
            setAcknowledged={setAcknowledged}
            onBack={() => setCurrentPage('home')}
            onConfirm={goRequirementPage}
          />
        ) : null}
        {currentPage === 'upload' && selectedBroker ? (
          <UploadPage
            broker={selectedBroker}
            files={uploadedFiles}
            setFiles={setUploadedFiles}
            submitting={submitting}
            onBack={() => setCurrentPage('confirm')}
            onSubmit={submitApplication}
          />
        ) : null}
        {currentPage === 'signature' && selectedBroker ? (
          <SignaturePage
            broker={selectedBroker}
            signedDocs={signedDocs}
            setSignedDocs={setSignedDocs}
            submitting={submitting}
            onBack={() => setCurrentPage('confirm')}
            onSubmit={submitApplication}
          />
        ) : null}
        {currentPage === 'status' && selectedBroker ? (
          <StatusPage
            broker={selectedBroker}
            status={applicationStatus}
            setStatus={setApplicationStatus}
            application={application}
            accountInfo={accountInfo}
            onNextAction={() => {
              if (applicationStatus === 'documents_required' || applicationStatus === 'returned') setCurrentPage('upload')
              if (applicationStatus === 'signature_required') setCurrentPage('signature')
              if (applicationStatus === 'rejected') showToast('请查看拒绝原因后联系客户经理。')
              if (applicationStatus === 'opened') showToast('券商账户信息已展示。')
            }}
          />
        ) : null}
        <BackendReservePanel />
      </main>
      {toast ? <div className="fixed right-6 top-20 z-50 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-xl">{toast}</div> : null}
    </div>
  )
}
