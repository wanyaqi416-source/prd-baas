import { useState } from 'react'
import {
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Edit3,
  Eye,
  FileCheck2,
  LineChart,
  Play,
  Search,
  UserRound,
  WalletCards,
  X,
  XCircle,
} from 'lucide-react'

import { initialAccountTypeConfigs } from '../data/accountTypeConfig'

const application = {
  id: 'SG-OPEN-20260714-001',
  customerName: 'WANYARA WAN',
  customerChineseName: '万雅拉',
  customerEnglishName: 'WANYARA WAN',
  customerType: '个人客户',
  accountName: '新加坡账户',
  userId: 'UID-10001',
  submittedAt: '2026-07-14 11:20',
  status: '待运营配置',
  phone: '+852 9123 4567',
  email: 'xr3kes66@123mails.org',
  nationality: '中国香港',
  customerNo: 'CUST-20260529-0154',
  existingTrustAccounts: '香港账户 / 美国账户',
  fee: {
    amount: 'USD 1,000.00',
    debitAccount: '香港账户 USD 余额',
    debitStatus: '扣费成功',
    debitedAt: '2026-07-14 11:18:42',
    transactionNo: 'TXN-SG-OPEN-1000-0454',
  },
}

const fallbackReceivingAccount = {
  accountName: 'FIDERE TRUST LIMITED',
  accountNumber: '11020160454',
  bankName: 'Green Link Digital Bank Pte. Ltd.',
  bankAddress: '20 PASIR PANJANG ROAD #07-25-28 MAPLETREE BUSINESS CITY SINGAPORE 117439',
  receivingBank: 'Green Link Digital Bank',
  swiftCode: 'GLDTSGSG',
}

const openingReviewRows = [
  {
    initials: 'WW',
    name: application.customerName,
    id: application.userId,
    email: application.email,
    accountName: application.accountName,
    submittedAt: application.submittedAt,
    status: '审核中',
  },
  {
    initials: 'QA',
    name: 'QIXUE AN',
    id: 'UID-10002',
    email: 'voigtus1@123mails.org',
    accountName: '新加坡账户',
    submittedAt: '2026-07-13 15:10',
    status: '待处理',
  },
  {
    initials: 'LC',
    name: 'LUNA CHEN',
    id: 'UID-10003',
    email: 'luna.chen@example.com',
    accountName: '新加坡账户',
    submittedAt: '2026-07-12 09:36',
    status: '已开户',
  },
  {
    initials: 'MT',
    name: 'MING TANG',
    id: 'UID-10004',
    email: 'ming.tang@example.com',
    accountName: '新加坡账户',
    submittedAt: '2026-07-11 16:28',
    status: '已拒绝',
    rejectReason: '客户提交的身份证明文件已过期，请更新证件后重新提交申请。',
  },
]

function AdminShell({ children }) {
  return (
    <main className="min-h-screen bg-[#f4f5fb] pt-[64px] pl-[220px]">
      <div className="mx-auto w-[1254px] pb-10 pt-[16px]">{children}</div>
    </main>
  )
}

function Panel({ children, className = '' }) {
  return (
    <section className={`rounded-[6px] border border-[#e2e4ec] bg-white shadow-[0_7px_16px_rgba(28,29,42,0.08)] ${className}`}>
      {children}
    </section>
  )
}

function StatCard({ title, value, desc, tone, icon: Icon }) {
  const toneClass = {
    violet: 'bg-[#e7d6ff] text-[#8b4fff]',
    green: 'bg-[#d9f3ca] text-[#56cf2d]',
    red: 'bg-[#ffd9dd] text-[#ff565f]',
    amber: 'bg-[#fff0c9] text-[#f3a600]',
    blue: 'bg-[#d8efff] text-[#24a8f3]',
  }[tone]

  return (
    <section className="relative h-[116px] rounded-[5px] border border-[#e2e4ec] bg-white px-[18px] py-[18px] shadow-[0_8px_16px_rgba(28,29,42,0.12)]">
      <div className="text-[14px] font-semibold text-[#1f1f37]">{title}</div>
      <div className="mt-[9px] text-[24px] font-bold leading-none text-[#292842]">{value}</div>
      <div className="mt-[10px] text-[12px] text-[#55556e]">{desc}</div>
      <div className={`absolute right-[19px] top-[19px] flex h-[38px] w-[38px] items-center justify-center rounded-[5px] ${toneClass}`}>
        <Icon className="h-[24px] w-[24px]" strokeWidth={2} />
      </div>
    </section>
  )
}

function SearchBox({ placeholder, width = 'w-[397px]' }) {
  return (
    <label className={`flex h-[50px] ${width} items-center gap-[11px] rounded-[4px] border border-[#cfd1dc] bg-white px-[15px] text-[13px] text-[#9a9cab]`}>
      <Search className="h-[16px] w-[16px] text-[#20213a]" strokeWidth={1.8} />
      <input className="h-full flex-1 bg-transparent outline-none" placeholder={placeholder} />
    </label>
  )
}

function StatusBadge({ children, tone = 'blue' }) {
  const className = {
    blue: 'bg-[#e7f5ff] text-[#2586d9]',
    orange: 'bg-[#fff1d6] text-[#f39800]',
    violet: 'bg-[#f0e7ff] text-[#8b4fff]',
    green: 'bg-[#e9f8ee] text-[#20a05a]',
    red: 'bg-[#ffe8eb] text-[#f04f5f]',
    gray: 'bg-[#f0f1f6] text-[#5b5c70]',
  }[tone]

  return <span className={`inline-flex whitespace-nowrap rounded-full px-[9px] py-[3px] text-[12px] font-semibold ${className}`}>{children}</span>
}

function openingStatusTone(status) {
  if (status === '已开户') return 'green'
  if (status === '已拒绝') return 'red'
  if (status === '审核中') return 'blue'
  return 'orange'
}

function PageTitle({ title, subtitle }) {
  return (
    <div className="px-[4px]">
      <h1 className="text-[16px] font-semibold leading-none text-[#20213a]">{title}</h1>
      {subtitle ? <p className="mt-[8px] text-[12px] text-[#66677f]">{subtitle}</p> : null}
    </div>
  )
}

function ActionButton({ icon: Icon, children, onClick, disabled = false, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-[31px] items-center gap-[6px] whitespace-nowrap rounded-[4px] border px-[9px] text-[12px] font-semibold disabled:cursor-not-allowed disabled:border-[#d8dae5] disabled:text-[#a4a6b7] ${
        danger ? 'border-[#f04f5f] text-[#f04f5f] hover:bg-[#ffe8eb]' : 'border-[#8b4fff] text-[#8b4fff] hover:bg-[#f6f0ff]'
      }`}
    >
      {Icon ? <Icon className="h-[14px] w-[14px]" strokeWidth={1.9} /> : null}
      {children}
    </button>
  )
}

function PrimaryButton({ icon: Icon, children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-[36px] items-center justify-center gap-[8px] rounded-[5px] bg-[#8b4fff] px-[16px] text-[13px] font-semibold text-white shadow-sm hover:bg-[#7f42f2] disabled:cursor-not-allowed disabled:bg-[#c9c5d4]"
    >
      {Icon ? <Icon className="h-[15px] w-[15px]" strokeWidth={2} /> : null}
      {children}
    </button>
  )
}

function ReadOnlyField({ label, value, subdued = false }) {
  return (
    <div className={`min-h-[58px] rounded-[5px] border border-[#e2e4ec] px-[12px] py-[9px] ${subdued ? 'bg-[#fbfbfd]' : 'bg-white'}`}>
      <div className="text-[12px] text-[#66677f]">{label}</div>
      <div className="mt-[6px] break-words text-[13px] font-semibold text-[#20213a]">{value || '-'}</div>
    </div>
  )
}

function ConfirmModal({ customerName, accountName, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#252236]/55 px-[24px] py-[28px]">
      <section className="w-[520px] overflow-hidden rounded-[8px] bg-white shadow-[0_18px_48px_rgba(28,29,42,0.28)]">
        <div className="flex h-[62px] items-center justify-between border-b border-[#e5e6ef] px-[22px]">
          <div className="flex items-center gap-[8px] text-[16px] font-semibold text-[#20213a]">
            <ClipboardCheck className="h-[18px] w-[18px] text-[#8b4fff]" />
            确认开户
          </div>
          <button type="button" onClick={onCancel} className="rounded-[4px] p-[7px] text-[#66677f] hover:bg-[#f6f7fb]">
            <X className="h-[16px] w-[16px]" />
          </button>
        </div>
        <div className="space-y-[10px] px-[22px] py-[18px]">
          <div className="rounded-[5px] bg-[#fff1d6] px-[12px] py-[10px] text-[12px] font-semibold leading-[20px] text-[#9a6500]">
            确认后系统将完成该客户的新加坡账户开户，并记录开户操作日志。
          </div>
          <ReadOnlyField label="客户名称" value={customerName} subdued />
          <ReadOnlyField label="申请账户" value={accountName} subdued />
        </div>
        <div className="grid grid-cols-2 gap-[10px] border-t border-[#e5e6ef] bg-white p-[14px]">
          <ActionButton icon={XCircle} onClick={onCancel}>取消</ActionButton>
          <PrimaryButton icon={CheckCircle2} onClick={onConfirm}>确认开户</PrimaryButton>
        </div>
      </section>
    </div>
  )
}

function formatStamp() {
  const value = new Date()
  const pad = (item) => String(item).padStart(2, '0')

  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}`
}

function SingaporeOpeningReviewTable({ rows = openingReviewRows, onOpenDetail, onOpenProcess }) {
  return (
    <div className="mt-[15px] border-t border-[#e5e6ef] pt-[15px]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
            <th className="w-[420px] px-[18px]">客户信息</th>
            <th className="w-[170px] px-[18px]">申请账户</th>
            <th className="w-[220px] px-[18px]">提交日期</th>
            <th className="w-[130px] px-[18px]">状态</th>
            <th className="px-[18px]">操作</th>
          </tr>
        </thead>
        <tbody className="text-[13px] text-[#55556e]">
          {rows.map((row) => {
            const canProcess = !['已开户', '已拒绝'].includes(row.status)

            return (
              <tr key={row.id} className="h-[86px] border-b border-[#e7e8ef] bg-white">
                <td className="px-[18px]">
                  <div className="flex items-center gap-[14px]">
                    <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#eeeeef] text-[13px] font-medium text-[#4b4b62]">{row.initials}</div>
                    <div className="leading-[1.6]">
                      <div className="text-[14px] font-semibold text-[#2b2940]">{row.name}</div>
                      <div>ID: {row.id}</div>
                      <div>{row.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-[18px] font-semibold text-[#20213a]">{row.accountName}</td>
                <td className="px-[18px]">{row.submittedAt}</td>
                <td className="px-[18px]"><StatusBadge tone={openingStatusTone(row.status)}>{row.status}</StatusBadge></td>
                <td className="px-[18px]">
                  <div className="flex items-center gap-[7px]">
                    <ActionButton icon={Eye} onClick={() => onOpenDetail(row)}>查看详情</ActionButton>
                    {canProcess ? <ActionButton icon={Play} onClick={() => onOpenProcess(row)}>开始处理</ActionButton> : null}
                  </div>
                </td>
              </tr>
            )
          })}
          {rows.length === 0 ? (
            <tr className="h-[86px] border-b border-[#e7e8ef] bg-white">
              <td colSpan={5} className="px-[18px] text-center text-[13px] text-[#8a8ca0]">暂无符合条件的开户审核记录</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}

function SingaporeOpeningReviewList({ onOpenDetail, onOpenProcess }) {
  const [accountType, setAccountType] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const filteredRows = openingReviewRows.filter((row) => (
    (!accountType || row.accountName === accountType) && (!statusFilter || row.status === statusFilter)
  ))

  return (
    <AdminShell>
      <div className="grid w-[936px] grid-cols-3 gap-[21px]">
        <StatCard title="待处理" value="8" desc="待运营配置开户结果" tone="amber" icon={Clock3} />
        <StatCard title="审核中" value="21" desc="正在处理" tone="blue" icon={LineChart} />
        <StatCard title="已开户" value="36" desc="已完成账户配置" tone="green" icon={CheckCircle2} />
      </div>

      <Panel className="mt-[21px] px-[15px] pb-[18px] pt-[21px]">
        <PageTitle title="开户审核" subtitle="新加坡账户申请由客户确认并扣费后生成，运营在此完成开户审核及账户配置。" />
        <div className="mt-[21px] flex flex-wrap items-center gap-[12px]">
          <SearchBox placeholder="搜索客户名称、用户 ID、审核类型..." width="w-[440px]" />
          <label className="flex h-[50px] w-[260px] items-center justify-between rounded-[4px] border border-[#cfd1dc] bg-white px-[14px] text-[13px] text-[#4c4c68]">
            <span className="whitespace-nowrap">账户类型</span>
            <select
              value={accountType}
              onChange={(event) => setAccountType(event.target.value)}
              className="h-full min-w-[136px] bg-transparent text-right font-semibold text-[#20213a] outline-none"
            >
              <option value="">全部账户</option>
              <option value="美国账户">美国账户</option>
              <option value="新加坡账户">新加坡账户</option>
            </select>
          </label>
          <label className="flex h-[50px] w-[240px] items-center justify-between rounded-[4px] border border-[#cfd1dc] bg-white px-[14px] text-[13px] text-[#4c4c68]">
            <span className="whitespace-nowrap">状态</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-full min-w-[116px] bg-transparent text-right font-semibold text-[#20213a] outline-none"
            >
              <option value="">全部状态</option>
              <option value="待处理">待处理</option>
              <option value="审核中">审核中</option>
              <option value="已开户">已开户</option>
              <option value="已拒绝">已拒绝</option>
            </select>
          </label>
        </div>
        <SingaporeOpeningReviewTable rows={filteredRows} onOpenDetail={onOpenDetail} onOpenProcess={onOpenProcess} />
      </Panel>
    </AdminShell>
  )
}

export function SingaporeAccountOpeningReviewPage({
  accountTypes = initialAccountTypeConfigs,
  onOpenUserAccountConfig,
}) {
  const [reviewMode, setReviewMode] = useState('list')
  const [selectedApplication, setSelectedApplication] = useState(openingReviewRows[0])

  const openDetail = (row) => {
    setSelectedApplication(row)
    setReviewMode('detail')
  }

  const openProcess = (row) => {
    setSelectedApplication(row)
    setReviewMode('process')
  }

  if (reviewMode === 'detail' || reviewMode === 'process') {
    return (
      <SingaporeAccountOpeningReviewDetailPage
        accountTypes={accountTypes}
        record={selectedApplication}
        onOpenUserAccountConfig={onOpenUserAccountConfig}
        onBack={() => setReviewMode('list')}
        mode={reviewMode}
      />
    )
  }

  return (
    <SingaporeOpeningReviewList
      onOpenDetail={openDetail}
      onOpenProcess={openProcess}
    />
  )
}

function SingaporeAccountOpeningReviewDetailPage({
  accountTypes = initialAccountTypeConfigs,
  record = openingReviewRows[0],
  onOpenUserAccountConfig,
  onBack,
  mode = 'process',
}) {
  const viewOnly = mode === 'detail'
  const detailApplication = {
    ...application,
    customerName: record.name || application.customerName,
    customerEnglishName: record.name || application.customerEnglishName,
    userId: record.id || application.userId,
    email: record.email || application.email,
    accountName: record.accountName || application.accountName,
    submittedAt: record.submittedAt || application.submittedAt,
  }
  const initialReviewResult = record.status === '已拒绝' ? 'reject' : 'approve'
  const singaporeAccountType = accountTypes.find((item) => item.code === 'SG_ACCOUNT')
  const supportedCurrencies = singaporeAccountType?.currencies
    ?.filter((currency) => currency.enabled !== false)
    .map((currency) => currency.code) || ['USD', 'CNY', 'SGD', 'AED', 'JPY']
  const [reviewResult, setReviewResult] = useState(initialReviewResult)
  const [rejectReason, setRejectReason] = useState(record.rejectReason || '')
  const [opened, setOpened] = useState(record.status === '已开户')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [, setLogs] = useState([
    { time: '2026-07-14 11:18', operator: '系统', action: '扣费成功', detail: '已扣除新加坡账户开户费 USD 1,000.00，并生成开户申请。' },
    { time: '2026-07-14 11:20', operator: '运营 Jane', action: '进入审核', detail: '待完成新加坡账户开户审核。' },
  ])
  const readonly = viewOnly || opened || record.status === '已拒绝'
  const rejectedReadonly = readonly && reviewResult === 'reject'
  const feeFailed = application.fee.debitStatus !== '扣费成功'
  const canConfirm = reviewResult === 'reject'
    ? Boolean(rejectReason.trim())
    : !feeFailed
  const applicationStatus = opened ? '已开户' : reviewResult === 'reject' ? '已拒绝' : record.status === '审核中' ? '审核中' : '待审核'
  const accountConfigStatus = '待处理'

  const addLog = (action, detail) => {
    setLogs((current) => [
      { time: formatStamp(), operator: '运营 Jane', action, detail },
      ...current,
    ])
  }

  const submitReview = () => {
    if (reviewResult === 'reject') {
      if (!rejectReason.trim()) {
        setMessage('请选择拒绝原因后再提交。')
        return
      }
      setOpened(false)
      setEditingOpenedAccount(false)
      setMessage('申请已拒绝，操作日志已记录。')
      addLog('拒绝申请', rejectReason)
      return
    }

    if (feeFailed) {
      setMessage('开户费扣款失败，不能确认开户。')
      return
    }
    setConfirmOpen(true)
  }

  const confirmAccountOpening = () => {
    setOpened(true)
    setConfirmOpen(false)
    setMessage('开户成功，页面已切换为只读状态。')
    addLog('确认开户', '已完成开户审核，客户实际账户信息需在用户管理页面维护。')
  }

  const openUserAccountConfig = () => {
    if (onOpenUserAccountConfig) {
      onOpenUserAccountConfig()
      return
    }
    setMessage('请前往 KYC审核 - 用户管理页面维护客户实际账户信息。')
  }

  return (
    <AdminShell>
      {onBack ? (
        <div className="mb-[12px]">
          <ActionButton icon={ChevronDown} onClick={onBack}>返回开户审核</ActionButton>
        </div>
      ) : null}
      <div className="mb-[16px] flex items-center justify-between">
        <PageTitle title="新加坡账户开户审核" subtitle="运营查看客户申请信息并完成开户审核；客户实际账户信息在用户管理页面维护。" />
        <div className="flex items-center gap-[10px]">
          <StatusBadge tone={viewOnly ? 'blue' : opened ? 'green' : 'blue'}>{viewOnly ? '查看详情' : applicationStatus}</StatusBadge>
        </div>
      </div>

      <div className="grid grid-cols-[360px_1fr] gap-[18px]">
        <div className="space-y-[18px]">
          <Panel className="p-[18px]">
            <div className="flex flex-col items-center pb-[18px]">
              <div className="flex h-[96px] w-[96px] items-center justify-center rounded-[5px] bg-[#d9c5ff] text-[28px] font-bold text-[#8b4fff]">WW</div>
              <div className="mt-[14px] text-[16px] font-semibold text-[#20213a]">{detailApplication.customerName}</div>
              <StatusBadge tone="gray">{application.customerType}</StatusBadge>
            </div>
            <div className="space-y-[14px] border-t border-[#e5e6ef] pt-[16px] text-[13px] text-[#55556e]">
              <div className="flex gap-[12px]">
                <WalletCards className="h-[18px] w-[18px] text-[#8b4fff]" />
                <div>
                  <div className="font-semibold text-[#20213a]">{detailApplication.accountName}</div>
                  <div className="text-[12px]">申请账户</div>
                </div>
              </div>
              <div className="flex gap-[12px]">
                <UserRound className="h-[18px] w-[18px] text-[#8b4fff]" />
                <div>
                  <div className="font-semibold text-[#20213a]">{detailApplication.userId}</div>
                  <div className="text-[12px]">用户 ID</div>
                </div>
              </div>
              <div className="flex gap-[12px]">
                <CalendarDays className="h-[18px] w-[18px] text-[#8b4fff]" />
                <div>
                  <div className="font-semibold text-[#20213a]">{detailApplication.submittedAt}</div>
                  <div className="text-[12px]">申请时间</div>
                </div>
              </div>
            </div>
            <div className="mt-[16px] border-t border-[#e5e6ef] pt-[14px]">
              <ReadOnlyField label="当前开户状态" value={applicationStatus} subdued />
            </div>
          </Panel>

          <Panel className="p-[18px]">
            <div className="mb-[14px] flex items-center gap-[8px] text-[14px] font-semibold text-[#20213a]">
              <FileCheck2 className="h-[17px] w-[17px] text-[#8b4fff]" />
              审核操作
            </div>
            <div className="space-y-[12px]">
              {rejectedReadonly ? (
                <div className="rounded-[5px] border border-[#ffd0d5] bg-[#fff4f5] px-[14px] py-[13px]">
                  <div className="flex items-center justify-between gap-[12px]">
                    <span className="text-[12px] font-semibold text-[#9f2f3c]">审核结果</span>
                    <StatusBadge tone="red">已拒绝</StatusBadge>
                  </div>
                  <div className="mt-[12px] border-t border-[#ffd0d5] pt-[12px]">
                    <div className="text-[12px] font-semibold text-[#9f2f3c]">拒绝原因</div>
                    <div className="mt-[7px] text-[13px] font-semibold leading-[22px] text-[#f04f5f]">
                      {rejectReason || '未填写拒绝原因'}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <label className="block">
                    <span className="mb-[-8px] ml-[10px] inline-block bg-white px-[4px] text-[12px] text-[#66677f]">审核结果</span>
                    <select
                      value={reviewResult}
                      onChange={(event) => setReviewResult(event.target.value)}
                      disabled={readonly}
                      className="h-[50px] w-full rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] text-[14px] font-semibold text-[#24243d] outline-none focus:border-[#8b4fff] disabled:bg-[#f6f7fb]"
                    >
                      <option value="approve">确认开户</option>
                      <option value="reject">拒绝申请</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-[-8px] ml-[10px] inline-block bg-white px-[4px] text-[12px] text-[#66677f]">拒绝原因</span>
                    <textarea
                      value={rejectReason}
                      onChange={(event) => setRejectReason(event.target.value)}
                      disabled={readonly || reviewResult !== 'reject'}
                      rows={3}
                      placeholder="选择拒绝申请时必填"
                      className="w-full rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] py-[12px] text-[14px] text-[#24243d] outline-none focus:border-[#8b4fff] disabled:bg-[#f6f7fb]"
                    />
                  </label>
                  <div className="grid grid-cols-1 gap-[10px]">
                    <PrimaryButton icon={CheckCircle2} onClick={submitReview} disabled={readonly || !canConfirm}>
                      {reviewResult === 'reject' ? '确认拒绝' : '确认开户'}
                    </PrimaryButton>
                  </div>
                </>
              )}
              {message ? (
                <div className="rounded-[5px] bg-[#e7f5ff] px-[12px] py-[10px] text-[12px] font-semibold leading-[20px] text-[#2586d9]">{message}</div>
              ) : null}
            </div>
          </Panel>
        </div>

        <div className="space-y-[18px]">
          <Panel className="p-[18px]">
            <div className="mb-[16px] flex items-center justify-between">
              <div className="flex items-center gap-[8px] text-[14px] font-semibold text-[#20213a]">
                <UserRound className="h-[17px] w-[17px] text-[#8b4fff]" />
                客户基本信息
              </div>
              <ActionButton icon={Eye}>查看客户完整资料</ActionButton>
            </div>
            <div className="grid grid-cols-4 gap-[10px]">
              <ReadOnlyField label="客户中文名称" value={application.customerChineseName} subdued />
              <ReadOnlyField label="客户英文名称" value={detailApplication.customerEnglishName} subdued />
              <ReadOnlyField label="客户类型" value={application.customerType} subdued />
              <ReadOnlyField label="手机号" value={application.phone} subdued />
              <ReadOnlyField label="邮箱" value={detailApplication.email} subdued />
              <ReadOnlyField label="国籍" value={application.nationality} subdued />
              <ReadOnlyField label="客户编号" value={application.customerNo} subdued />
              <ReadOnlyField label="现有信托账户" value={application.existingTrustAccounts} subdued />
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <div className="border-b border-[#e5e6ef] bg-[#fbfbfd] px-[18px] py-[16px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[8px] text-[14px] font-semibold text-[#20213a]">
                  <Banknote className="h-[17px] w-[17px] text-[#8b4fff]" />
                  新加坡账户申请信息
                </div>
                <div className="flex items-center gap-[8px]">
                  {accountConfigStatus === '待处理' ? <ActionButton icon={Edit3} onClick={openUserAccountConfig}>配置账户</ActionButton> : null}
                </div>
              </div>
            </div>
            <div className="p-[18px]">
              <div className="grid grid-cols-2 gap-[12px]">
                <ReadOnlyField label="账户类型" value="新加坡账户" subdued />
                <ReadOnlyField label="申请状态" value={applicationStatus} subdued />
                <ReadOnlyField label="申请时间" value={detailApplication.submittedAt} subdued />
                <ReadOnlyField label="支持币种" value={supportedCurrencies.join(' / ')} subdued />
              </div>
              <div className="mt-[12px] rounded-[5px] bg-[#f6f7fb] px-[12px] py-[10px] text-[12px] font-semibold leading-[20px] text-[#66677f]">
                系统默认收款银行配置仅在账户类型配置页面维护；客户实际账户信息仅在用户管理页面维护。
              </div>
            </div>
          </Panel>

        </div>
      </div>

      {confirmOpen ? (
        <ConfirmModal
          customerName={detailApplication.customerName}
          accountName={detailApplication.accountName}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={confirmAccountOpening}
        />
      ) : null}
    </AdminShell>
  )
}
