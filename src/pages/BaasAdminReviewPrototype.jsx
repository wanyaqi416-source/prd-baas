import { useMemo, useState } from 'react'
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock3,
  Download,
  Droplet,
  Eye,
  FileCheck2,
  FileText,
  Gauge,
  KeyRound,
  Languages,
  LineChart,
  ListChecks,
  PauseCircle,
  Percent,
  Play,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sun,
  UserCheck,
  UserRound,
  UsersRound,
  WalletCards,
  X,
  XCircle,
} from 'lucide-react'

const pendingApplications = [
  {
    initials: 'WW',
    name: 'WANYARA WAN',
    id: '154',
    email: 'xr3kes66@123mails.org',
    submittedAt: '2026-05-29 17:38:14',
    status: '审核中',
  },
  {
    initials: 'L',
    name: 'LA LA LA',
    id: '152',
    email: 'tuntonxx@swagpapa.com',
    submittedAt: '2026-05-26 19:43:20',
    status: '待提交',
  },
  {
    initials: 'S',
    name: 'SAD SDA ASD',
    id: '150',
    email: 'axedclon@rulersonline.com',
    submittedAt: '2026-05-22 18:30:29',
    status: '审核通过',
  },
]

const reviewProfile = {
  firstName: 'Wanyara',
  lastName: 'Wan',
  fullName: 'Wanyara Wan',
  birthday: '1990-03-18',
  gender: '女',
  nationality: 'HKG',
  phoneCode: '852',
  phone: '91234567',
  documentNumber: 'K1234567',
  documentIssueDate: '2020-06-01',
  documentExpiryDate: '2030-06-01',
  region: 'HK',
  address: '88 Queens Road Central',
  city: 'Hong Kong',
  state: 'Hong Kong',
  country: 'HKG',
  postalCode: '999077',
  documentType: 'PASSPORT',
  email: 'xr3kes66@123mails.org',
  submittedAt: '2026-05-29 17:38:14',
  userId: '154',
}

const reviewFieldGroups = [
  {
    title: '基本信息',
    fields: [
      { label: '名', value: reviewProfile.firstName },
      { label: '姓', value: reviewProfile.lastName },
      { label: '出生日期', value: reviewProfile.birthday },
      { label: '性别', value: reviewProfile.gender },
      { label: '国籍', value: reviewProfile.nationality },
      { label: '手机号', value: reviewProfile.phone },
      {
        label: '电话国家代码',
        value: reviewProfile.phoneCode,
        note: '模拟从 Sumsub / 手机号国家代码读取。',
      },
      {
        label: '地区',
        value: reviewProfile.region,
        note: '模拟 Sumsub / 护照国家读取，当前 mock 为 HK。',
      },
    ],
  },
  {
    title: '证件与地址信息',
    fields: [
      {
        label: '证件号码',
        value: reviewProfile.documentNumber,
        note: '模拟从 Sumsub 护照资料读取。',
      },
      {
        label: '证件签发日期',
        value: reviewProfile.documentIssueDate,
        note: '模拟从 Sumsub 护照资料读取。',
      },
      {
        label: '证件到期日',
        value: reviewProfile.documentExpiryDate,
        note: '模拟从 Sumsub 护照资料读取。',
      },
      { label: '证件类型', value: reviewProfile.documentType },
      { label: '居住地街道地址', value: reviewProfile.address },
      { label: '居住地城市', value: reviewProfile.city },
      { label: '居住地州/地区', value: reviewProfile.state },
      { label: '居住地所在国家', value: reviewProfile.country },
      { label: '居住地邮编', value: reviewProfile.postalCode },
    ],
  },
]

const attachmentRows = [
  { name: '护照文件', fileName: 'passport-wanyara-wan.pdf', status: '已上传' },
  { name: '身份证明文件', fileName: 'identity-proof-wanyara-wan.pdf', status: '已上传' },
  { name: '自拍照', fileName: 'selfie-wanyara-wan.jpg', status: '已上传' },
  { name: '地址证明', fileName: 'address-proof-hk.pdf', status: '已上传' },
  { name: '资金来源证明', fileName: 'source-of-funds.pdf', status: '已上传' },
  { name: 'FATCA 第三方文档签署', fileName: 'fatca-signature.pdf', status: '已签署', signatureStatus: 'signed' },
  { name: 'FATCA 第三方文档签署', fileName: 'fatca-pending-demo.pdf', status: '未签署', signatureStatus: 'pending' },
]

const userRows = [
  { initials: 'jwy', name: 'jin wu ye', id: '130', email: 'orvafrew@123mails.org', type: '个人', approvedAt: '2026-05-21 15:19:02', lastActiveAt: '2026-05-28 10:26:51' },
  { initials: 'wt', name: 'wanyara test', id: '120', email: 'tougzguy75@pdf-cutter.com', type: '个人', approvedAt: '2026-05-20 16:47:23', lastActiveAt: '2026-05-21 17:51:35' },
  { initials: 'y', name: 'yarafivewewe', id: '110', email: 'nr5bob@mediaeast.uk', type: '企业', approvedAt: '2026-05-19 14:12:22', lastActiveAt: '2026-05-29 15:18:34' },
  { initials: '2', name: '2342', id: '98', email: 'ac1yanch@gongjua.com', type: '企业', approvedAt: '2026-05-13 17:13:39', lastActiveAt: '2026-05-19 17:04:53' },
]

const transferRows = [
  {
    requestId: 'IT-1780221843260',
    customer: { name: 'yejin', id: '130', email: 'orvafrew@123mails.org' },
    fromAccount: '香港账户',
    toAccount: '美国账户',
    currency: 'USD',
    amount: 'USD 1.00',
    transferAmount: 'USD 1.00',
    fee: 'USD 15.00',
    estimatedArrival: 'USD 0.00',
    actualArrivalAmount: 'USD 1.00',
    status: '待审核',
    submittedAt: '2026-05-31 18:04',
    completedAt: '',
  },
  {
    requestId: 'IT-1780221843261',
    customer: { name: 'QIXUE', id: '4', email: 'voigtus1@123mails.org' },
    fromAccount: '美国账户',
    toAccount: '香港账户',
    currency: 'USD',
    amount: 'USD 8.00',
    transferAmount: 'USD 8.00',
    fee: 'USD 15.00',
    estimatedArrival: 'USD 0.00',
    actualArrivalAmount: 'USD 8.00',
    status: '已完成',
    submittedAt: '2026-05-31 18:16',
    completedAt: '2026-05-31 19:08',
  },
  {
    requestId: 'IT-1780221843262',
    customer: { name: 'LUZHOU LU', id: '86', email: 'luzhou.lu@example.com' },
    fromAccount: '香港账户',
    toAccount: '美国账户',
    currency: 'USD',
    amount: 'USD 3.00',
    transferAmount: 'USD 3.00',
    fee: 'USD 15.00',
    estimatedArrival: 'USD 0.00',
    actualArrivalAmount: 'USD 3.00',
    status: '已拒绝',
    submittedAt: '2026-05-31 18:29',
    completedAt: '2026-05-31 19:20',
    rejectReason: '客户资料与收款账户信息不一致，需补充说明后重新提交。',
  },
]

const manualAccountOptions = ['香港账户', '美国账户']

const incomingClaimRows = [
  {
    id: 'IC-20260522-001',
    submittedAt: '2026-05-22 18:54:17',
    accountType: '香港账户',
    currencyAmount: 'USD 10',
    payer: 'JW',
    channel: '电汇',
    referenceNo: '-',
    voucher: '-',
    matchedCustomer: 'yejin',
    matchStatus: '已匹配',
    status: '处理完成',
  },
  {
    id: 'IC-20260522-002',
    submittedAt: '2026-05-22 18:53:41',
    accountType: '美国账户',
    currencyAmount: 'USD 12',
    claimableAmount: 'USD 12',
    payer: 'JW',
    channel: '电汇',
    referenceNo: '-',
    voucher: '-',
    matchedCustomer: 'yejin',
    matchStatus: '已匹配',
    status: '待审核',
  },
  {
    id: 'IC-20260520-001',
    submittedAt: '2026-05-20 14:05:44',
    accountType: '香港账户',
    currencyAmount: 'HKD 100',
    payer: 'LL',
    channel: '电汇',
    referenceNo: '-',
    voucher: '-',
    matchedCustomer: 'luluzhuo',
    matchStatus: '已匹配',
    status: '处理完成',
  },
]

const withdrawalApprovalRows = [
  {
    id: 'WO-20260525-001',
    appliedAt: '2026-05-25 16:01:10',
    customer: { name: 'yejin', id: '130', email: 'orvafrew@123mails.org' },
    accountType: '香港账户',
    currencyAmount: 'HKD 10',
    transferAmount: 'HKD 10',
    fee: 'HKD 2',
    actualArrivalAmount: 'HKD 8',
    recipient: 'JW',
    purpose: '未知',
    status: '待处理',
    channel: '电汇',
    bank: '测试银行',
  },
  {
    id: 'WO-20260525-002',
    appliedAt: '2026-05-25 14:49:52',
    customer: { name: 'QIXUE', id: '4', email: 'voigtus1@123mails.org' },
    accountType: '美国账户',
    currencyAmount: 'USD 11',
    transferAmount: 'USD 11',
    fee: 'USD 2.2',
    actualArrivalAmount: 'USD 8.8',
    recipient: 'YQ',
    purpose: '未知',
    status: '待处理',
    channel: '电汇',
    bank: 'WO Bank',
  },
  {
    id: 'WO-20260524-001',
    appliedAt: '2026-05-24 10:49:22',
    customer: { name: 'wanyara', id: '120', email: 'wanyara@example.com' },
    accountType: '香港账户',
    currencyAmount: 'USD 4',
    transferAmount: 'USD 4',
    fee: 'USD 0.8',
    actualArrivalAmount: 'USD 3.2',
    recipient: 'JW',
    purpose: '未知',
    status: '处理完成',
    channel: '电汇',
    bank: 'Fidere Partner Bank',
  },
  {
    id: 'WO-20260523-001',
    appliedAt: '2026-05-23 10:12:18',
    customer: { name: '2342', id: '98', email: 'ac1yanch@gongjua.com' },
    accountType: '美国账户',
    currencyAmount: 'USD 100',
    transferAmount: 'USD 100',
    fee: 'USD 3',
    actualArrivalAmount: 'USD 97',
    recipient: '忘记时间',
    purpose: '未知',
    status: '已拒绝',
    channel: '电汇',
    bank: 'WO Bank',
    rejectReason: '客户收款银行账户信息不完整。',
  },
]

const customers = [
  { id: '65', email: 'vigze5606@justdefinition.com' },
  { id: '34', email: 'perumily2@mediaholy.com' },
  { id: '6', email: 'wanyaqi416@gmail.com' },
  { id: '4', email: 'voigtus1@123mails.org' },
]

const initialFeeConfigs = [
  { id: '65', email: 'vigze5606@justdefinition.com', mode: 'platform', value: '使用平台默认', usePlatformDefault: true },
  { id: '34', email: 'perumily2@mediaholy.com', mode: 'percent', value: '0.20%', usePlatformDefault: false },
  { id: '6', email: 'wanyaqi416@gmail.com', mode: 'fixed', value: 'USD 15.00', usePlatformDefault: false },
  { id: '4', email: 'voigtus1@123mails.org', mode: 'combo', value: 'USD 10.00 + 0.20%', usePlatformDefault: false },
]

const fiatTabs = ['总览', '客户资产', '流水查询', '入账认领', '出金审批', '资金互转', '对账中心']
const markedFiatTabs = new Set(['总览', '入账认领', '出金审批', '资金互转'])

function Header({ onBack }) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-[64px] items-center justify-between border-b border-[#dedfe8] bg-white px-[18px]">
      <button type="button" onClick={onBack} className="flex items-center gap-[10px] text-left">
        <span className="flex h-[27px] w-[27px] items-center justify-center rounded-full border border-[#496982] text-[#496982]">
          <Droplet className="h-[18px] w-[18px]" strokeWidth={1.9} />
        </span>
        <span className="text-[20px] font-bold leading-none text-[#22223a]">FIDERE TRUST</span>
        <CircleDot className="ml-[12px] h-[18px] w-[18px] text-[#69667c]" strokeWidth={2.2} />
      </button>

      <div className="flex items-center gap-[18px] pr-[12px] text-[#5f5c70]">
        <Languages className="h-[18px] w-[18px]" strokeWidth={2} />
        <Sun className="h-[18px] w-[18px]" strokeWidth={2} />
        <div className="relative flex h-[39px] w-[39px] items-center justify-center rounded-full bg-[#ececf3] text-[#252236]">
          <UserRound className="h-[22px] w-[22px]" fill="#252236" strokeWidth={0} />
          <span className="absolute bottom-[3px] right-[1px] h-[8px] w-[8px] rounded-full bg-[#58cf16] ring-[2px] ring-white" />
        </div>
      </div>
    </header>
  )
}

function SidebarItem({ icon: Icon, label, active = false, marked = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[43px] w-full items-center gap-[14px] rounded-r-[23px] pl-[23px] pr-4 text-[14px] transition ${
        active ? 'bg-[#9b63f5] font-semibold text-white' : 'text-[#24243d] hover:bg-white/70'
      }`}
    >
      <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
      <span className="flex min-w-0 items-center gap-[6px]">
        <span className="truncate">{label}</span>
        {marked ? (
          <span className={`flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${active ? 'bg-white text-[#8b4fff]' : 'bg-[#e7d6ff] text-[#8b4fff]'}`}>
            ?
          </span>
        ) : null}
      </span>
    </button>
  )
}

function QuestionMark({ active = false, inverse = false }) {
  const className = inverse
    ? 'bg-white text-[#8b4fff]'
    : active
      ? 'bg-[#8b4fff] text-white'
      : 'bg-[#e7d6ff] text-[#8b4fff]'

  return (
    <span className={`inline-flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${className}`}>
      ?
    </span>
  )
}

function SidebarGroup({ icon: Icon, label }) {
  return (
    <div className="mt-[7px] flex h-[42px] w-full items-center justify-between rounded-r-[23px] bg-[#e2e3eb] pl-[19px] pr-[18px] text-[14px] font-semibold text-[#24243d]">
      <span className="flex items-center gap-[13px]">
        <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
        {label}
      </span>
      <ChevronDown className="h-[17px] w-[17px]" strokeWidth={1.8} />
    </div>
  )
}

function Sidebar({ activePage, onSelect }) {
  return (
    <aside className="fixed bottom-0 left-0 top-[64px] z-20 w-[220px] overflow-y-auto bg-[#f4f5fb] pr-[4px]">
      <nav className="pb-8 pt-[2px]">
        <SidebarGroup icon={ShieldCheck} label="KYC审核" />
        <div className="mt-[10px] space-y-[4px]">
          <SidebarItem icon={BriefcaseBusiness} label="案件工作台" onClick={() => onSelect('opening-review')} />
          <SidebarItem icon={ListChecks} label="开户审核" marked active={activePage === 'opening-review'} onClick={() => onSelect('opening-review')} />
          <SidebarItem icon={UsersRound} label="用户管理" active={activePage === 'user-management'} onClick={() => onSelect('user-management')} />
          <SidebarItem icon={Gauge} label="处理中审核" />
          <SidebarItem icon={WalletCards} label="法币账户审核" />
          <SidebarItem icon={FileCheck2} label="数字资产地址审核" />
          <SidebarItem icon={FileText} label="信托管理" />
          <SidebarItem icon={Gauge} label="审核日志" />
        </div>

        <SidebarGroup icon={ListChecks} label="运营" />
        <div className="mt-[9px] space-y-[4px]">
          <SidebarItem icon={Gauge} label="概览" />
          <SidebarItem icon={UserRound} label="客户" />
          <SidebarItem icon={UserRound} label="资产中心" />
          <SidebarItem icon={ShoppingCart} label="法币资产管理" marked active={activePage === 'fiat-assets'} onClick={() => onSelect('fiat-assets')} />
          <SidebarItem icon={CircleDot} label="数字资产管理" />
          <SidebarItem icon={LineChart} label="理财产品" />
          <SidebarItem icon={CircleDot} label="交易管理" />
          <SidebarItem icon={Percent} label="提现服务费配置" marked active={activePage === 'fee-config'} onClick={() => onSelect('fee-config')} />
        </div>
      </nav>
    </aside>
  )
}

function AdminShell({ children }) {
  return (
    <main className="min-h-screen bg-[#f4f5fb] pl-[220px] pt-[64px]">
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

function SelectBox({ label, width = 'w-[396px]' }) {
  return (
    <label className={`flex h-[50px] ${width} items-center justify-between rounded-[4px] border border-[#cfd1dc] bg-white px-[14px] text-[13px] text-[#4c4c68]`}>
      <span>{label}</span>
      <ChevronDown className="h-[16px] w-[16px] text-[#5b5c70]" strokeWidth={1.8} />
    </label>
  )
}

function StatusBadge({ children, tone = 'blue' }) {
  const className = {
    blue: 'bg-[#e7f5ff] text-[#2586d9]',
    orange: 'bg-[#fff1d6] text-[#f39800]',
    green: 'bg-[#e9f8ee] text-[#20a05a]',
    red: 'bg-[#ffe8eb] text-[#f04f5f]',
    gray: 'bg-[#f0f1f6] text-[#5b5c70]',
  }[tone]

  return <span className={`inline-flex rounded-full px-[9px] py-[3px] text-[12px] font-semibold ${className}`}>{children}</span>
}

function openingStatusTone(status) {
  if (status === '审核通过') return 'green'
  if (status === '审核中') return 'blue'
  return 'gray'
}

function transferStatusTone(status) {
  if (status === '已完成') return 'green'
  if (status === '已拒绝') return 'red'
  return 'orange'
}

function ActionButton({ icon: Icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-[31px] items-center gap-[6px] whitespace-nowrap rounded-[4px] border border-[#8b4fff] px-[9px] text-[12px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]"
    >
      <Icon className="h-[14px] w-[14px]" strokeWidth={1.9} />
      {children}
    </button>
  )
}

function PrimaryButton({ icon: Icon, children, onClick }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex h-[36px] items-center gap-[8px] rounded-[5px] bg-[#8b4fff] px-[16px] text-[13px] font-semibold text-white shadow-sm hover:bg-[#7f42f2]">
      {Icon ? <Icon className="h-[15px] w-[15px]" strokeWidth={2} /> : null}
      {children}
    </button>
  )
}

function StatusSwitch() {
  return (
    <span className="inline-flex h-[17px] w-[28px] items-center justify-end rounded-full bg-[#8c52f5] px-[2px] align-middle">
      <span className="h-[13px] w-[13px] rounded-full bg-white shadow-sm" />
    </span>
  )
}

function PageTitle({ title, subtitle }) {
  return (
    <div className="px-[4px]">
      <h1 className="text-[16px] font-semibold leading-none text-[#20213a]">{title}</h1>
      {subtitle ? <p className="mt-[8px] text-[12px] text-[#66677f]">{subtitle}</p> : null}
    </div>
  )
}

function AccountTypeTabs({ value, onChange }) {
  return (
    <Panel className="mb-[21px] px-[12px] py-[10px]">
      <div className="flex gap-[8px]">
        {[
          ['personal', '个人用户'],
          ['business', '企业用户'],
        ].map(([key, label]) => (
          <button
            type="button"
            key={key}
            onClick={() => onChange(key)}
            className={`h-[38px] rounded-[20px] px-[18px] text-[14px] font-semibold ${
              value === key ? 'bg-[#9b63f5] text-white' : 'text-[#24243d] hover:bg-[#f6f0ff]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </Panel>
  )
}

function PendingReviewTable({ onOpenDetail, onOpenProcess }) {
  return (
    <div className="mt-[15px] border-t border-[#e5e6ef] pt-[15px]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
            <th className="w-[470px] px-[18px]">客户信息</th>
            <th className="w-[260px] px-[18px]">提交日期</th>
            <th className="w-[160px] px-[18px]">状态</th>
            <th className="px-[18px]">操作</th>
          </tr>
        </thead>
        <tbody className="text-[13px] text-[#55556e]">
          {pendingApplications.map((row) => (
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
              <td className="px-[18px]">{row.submittedAt}</td>
              <td className="px-[18px]"><StatusBadge tone={openingStatusTone(row.status)}>{row.status}</StatusBadge></td>
              <td className="px-[18px]">
                <div className="flex items-center gap-[7px]">
                  <ActionButton icon={Eye} onClick={onOpenDetail}>查看详情</ActionButton>
                  <ActionButton icon={Play} onClick={onOpenProcess}>开始处理</ActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OpeningReviewPage({ onOpenDetail, onOpenProcess }) {
  const [accountType, setAccountType] = useState('personal')

  return (
    <AdminShell>
      <AccountTypeTabs value={accountType} onChange={setAccountType} />
      <div className="grid w-[936px] grid-cols-3 gap-[21px]">
        <StatCard title="待提交" value="12" desc="开户资料待提交" tone="amber" icon={Clock3} />
        <StatCard title="审核中" value="36" desc="正在处理" tone="blue" icon={LineChart} />
        <StatCard title="审核通过" value="20" desc="全部" tone="green" icon={CheckCircle2} />
      </div>

      <Panel className="mt-[21px] px-[15px] pb-[18px] pt-[21px]">
        <PageTitle title="开户审核" subtitle="开户申请状态仅包含待提交、审核中和审核通过" />
        <div className="mt-[21px]">
          <SearchBox placeholder="搜索客户名称、审核类型..." width="w-[440px]" />
        </div>
        <PendingReviewTable onOpenDetail={onOpenDetail} onOpenProcess={onOpenProcess} />
      </Panel>
    </AdminShell>
  )
}

function ReviewFieldCard({ label, value, note, editable = false }) {
  return (
    <div className="min-h-[82px] rounded-[5px] border border-[#e2e4ec] bg-[#fbfbfd] p-[14px]">
      <div className="text-[12px] text-[#66677f]">{label}</div>
      {editable ? (
        <input
          defaultValue={value}
          className="mt-[8px] h-[34px] w-full rounded-[4px] border border-[#cfd1dc] bg-white px-[10px] text-[13px] font-semibold text-[#24243d] outline-none focus:border-[#8b4fff]"
        />
      ) : (
        <div className="mt-[8px] text-[13px] font-semibold text-[#24243d]">{value}</div>
      )}
      {note ? <div className="mt-[8px] text-[12px] leading-[18px] text-[#8a8ca0]">{note}</div> : null}
    </div>
  )
}

function OpeningReviewDecisionCard() {
  return (
    <Panel className="p-[18px]">
      <div className="flex items-center gap-[8px] text-[14px] font-semibold text-[#20213a]">
        <FileCheck2 className="h-[17px] w-[17px] text-[#8b4fff]" />
        审核决定
      </div>
      <div className="mt-[14px] text-[12px] leading-[20px] text-[#55556e]">提交审核前可先修改右侧用户资料；确认后保存修改并提交审核结论。</div>
      <label className="mt-[10px] flex h-[46px] items-center justify-between rounded-[5px] border border-[#8b4fff] bg-white px-[12px] text-[13px] font-semibold text-[#20213a]">
        <span>通过审核</span>
        <ChevronDown className="h-[16px] w-[16px] text-[#55556e]" />
      </label>
      <textarea className="mt-[10px] h-[94px] w-full resize-none rounded-[5px] border border-[#d8d9e3] bg-white px-[12px] py-[10px] text-[13px] outline-none focus:border-[#8b4fff]" placeholder="审核备注" />
      <button type="button" className="mt-[12px] flex h-[38px] w-full items-center justify-center gap-[8px] rounded-[5px] bg-[#bda2f9] text-[13px] font-semibold text-white hover:bg-[#9b63f5]">
        <FileCheck2 className="h-[15px] w-[15px]" />
        保存修改并提交审核
      </button>
    </Panel>
  )
}

function OpeningReviewDetailPage({ onBack, mode = 'detail' }) {
  const isProcess = mode === 'process'

  return (
    <AdminShell>
      <div className="grid grid-cols-[360px_1fr] gap-[18px]">
        <div className="space-y-[18px]">
          <Panel className="p-[18px]">
            <div className="flex flex-col items-center pb-[18px]">
              <div className="flex h-[96px] w-[96px] items-center justify-center rounded-[5px] bg-[#d9c5ff] text-[28px] font-bold text-[#8b4fff]">WW</div>
              <div className="mt-[14px] text-[16px] font-semibold text-[#20213a]">WANYARA WAN</div>
              <StatusBadge tone="gray">个人客户</StatusBadge>
            </div>
            <div className="space-y-[14px] border-t border-[#e5e6ef] pt-[16px] text-[13px] text-[#55556e]">
              <div className="flex gap-[12px]">
                <CalendarDays className="h-[18px] w-[18px] text-[#8b4fff]" />
                <div>
                  <div className="font-semibold text-[#20213a]">{reviewProfile.submittedAt}</div>
                  <div className="text-[12px]">提交时间</div>
                </div>
              </div>
              <div className="flex gap-[12px]">
                <UserRound className="h-[18px] w-[18px] text-[#8b4fff]" />
                <div>
                  <div className="font-semibold text-[#20213a]">{reviewProfile.userId}</div>
                  <div className="text-[12px]">用户ID</div>
                </div>
              </div>
            </div>
            <div className="mt-[18px] border-t border-[#e5e6ef] pt-[16px] text-[13px] leading-[28px] text-[#55556e]">
              <div className="font-semibold text-[#20213a]">详细信息</div>
              <div>手机号：+ {reviewProfile.phoneCode} {reviewProfile.phone}</div>
              <div>邮箱地址：{reviewProfile.email}</div>
              <div>职业：其他</div>
              <div>职位：-</div>
            </div>
          </Panel>
          {isProcess ? <OpeningReviewDecisionCard /> : null}
        </div>

        <div className="space-y-[18px]">
          <div className="flex items-center justify-between">
            <ActionButton icon={ChevronDown} onClick={onBack}>返回开户审核</ActionButton>
            <StatusBadge tone="blue">{isProcess ? '开始处理' : '查看详情'}</StatusBadge>
          </div>

          {reviewFieldGroups.map((group) => (
            <Panel key={group.title} className="p-[18px]">
              <div className="mb-[16px] flex items-center gap-[8px] text-[14px] font-semibold text-[#20213a]">
                <ShieldCheck className="h-[17px] w-[17px] text-[#8b4fff]" />
                {group.title}
              </div>
              <div className="grid grid-cols-3 gap-[10px]">
                {group.fields.map((field) => (
                  <ReviewFieldCard key={field.label} {...field} editable={isProcess} />
                ))}
              </div>
            </Panel>
          ))}

          <Panel className="p-[18px]">
            <div className="mb-[16px] flex items-center gap-[8px] text-[14px] font-semibold text-[#20213a]">
              <FileText className="h-[17px] w-[17px] text-[#8b4fff]" />
              文件与第三方签署
            </div>
            <div className="grid grid-cols-2 gap-[10px]">
              {attachmentRows.map((item, index) => (
                <div key={`${item.name}-${index}`} className="rounded-[5px] border border-[#e2e4ec] bg-white p-[14px]">
                  <div className="flex items-start justify-between gap-[12px]">
                    <div>
                      <div className="text-[13px] font-semibold text-[#20213a]">{item.name}</div>
                      <div className="mt-[5px] text-[12px] text-[#66677f]">{item.fileName}</div>
                    </div>
                    {item.signatureStatus ? <StatusBadge tone={item.signatureStatus === 'signed' ? 'green' : 'orange'}>{item.status}</StatusBadge> : <StatusBadge tone="gray">{item.status}</StatusBadge>}
                  </div>
                  <div className="mt-[13px] flex gap-[8px]">
                    <ActionButton icon={Download}>下载</ActionButton>
                    <ActionButton icon={Eye}>查看</ActionButton>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AdminShell>
  )
}

function UserManagementTable() {
  return (
    <div className="mt-[15px] border-t border-[#e5e6ef] pt-[15px]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
            <th className="w-[320px] px-[18px]">客户信息</th>
            <th className="w-[132px] px-[18px]">申请类型</th>
            <th className="w-[220px] px-[18px]">通过时间</th>
            <th className="w-[118px] px-[18px]">账户状态</th>
            <th className="w-[220px] px-[18px]">最后活动</th>
            <th className="px-[18px]">操作</th>
          </tr>
        </thead>
        <tbody className="text-[13px] text-[#55556e]">
          {userRows.map((row) => (
            <tr key={row.id} className="h-[86px] border-b border-[#e7e8ef] bg-white">
              <td className="px-[18px]">
                <div className="flex items-center gap-[14px]">
                  <div className="flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full bg-[#eeeeef] text-[13px] font-medium text-[#4b4b62]">{row.initials}</div>
                  <div className="leading-[1.6]">
                    <div className="text-[14px] font-semibold text-[#2b2940]">{row.name}</div>
                    <div>ID: {row.id}</div>
                    <div>{row.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-[18px]"><span className="inline-flex items-center gap-[7px] text-[#424258]"><FileText className="h-[15px] w-[15px] text-[#6b687d]" strokeWidth={1.8} />{row.type}</span></td>
              <td className="px-[18px]">{row.approvedAt}</td>
              <td className="px-[18px]"><StatusSwitch /></td>
              <td className="px-[18px]">{row.lastActiveAt}</td>
              <td className="px-[18px]"><div className="flex items-center gap-[7px]"><ActionButton icon={Eye}>查看详情</ActionButton><ActionButton icon={KeyRound}>修改密码</ActionButton></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function UserManagementPage() {
  return (
    <AdminShell>
      <div className="grid w-[936px] grid-cols-3 gap-[21px]">
        <StatCard title="通过总数" value="89" desc="已通过KYC审核" tone="violet" icon={UsersRound} />
        <StatCard title="活跃账户" value="37" desc="账户已启用" tone="green" icon={UserCheck} />
        <StatCard title="暂停账户" value="1" desc="账户已暂停" tone="red" icon={PauseCircle} />
      </div>
      <Panel className="mt-[21px] px-[15px] pb-[18px] pt-[21px]">
        <PageTitle title="用户管理" subtitle="已通过KYC审核的活跃用户账户" />
        <div className="mt-[21px] flex items-center gap-[18px]">
          <SearchBox placeholder="搜索用户名、ID或客户编号..." />
          <SelectBox label="账户状态" />
        </div>
        <UserManagementTable />
      </Panel>
    </AdminShell>
  )
}

function TransferAuditDrawer({ record, onClose }) {
  if (!record) return null

  const isPending = record.status === '待审核'
  const detailRows = [
    ['申请编号', record.requestId],
    ['转出账户', record.fromAccount],
    ['转入账户', record.toAccount],
    ['币种', record.currency],
    ['转账金额', record.transferAmount || record.amount],
    ['实际到账金额', record.actualArrivalAmount || record.estimatedArrival],
    ['提交时间', record.submittedAt],
  ]

  if (record.completedAt) {
    detailRows.push(['完成时间', record.completedAt])
  }

  if (record.rejectReason) {
    detailRows.push(['拒绝原因', record.rejectReason])
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#252236]/55">
      <aside className="fixed bottom-0 right-0 top-0 flex w-[390px] flex-col bg-white shadow-[0_18px_48px_rgba(28,29,42,0.28)]">
        <div className="flex h-[58px] items-center justify-between border-b border-[#e5e6ef] px-[18px]">
          <div>
            <h2 className="text-[15px] font-semibold text-[#20213a]">{isPending ? '资金互转审核' : '资金互转详情'}</h2>
            <div className="mt-[3px] text-[11px] font-semibold uppercase text-[#8a8ca0]">{isPending ? 'INTERNAL TRANSFER REVIEW' : 'INTERNAL TRANSFER DETAIL'}</div>
          </div>
          <button type="button" onClick={onClose} className="rounded-[4px] p-[7px] text-[#66677f] hover:bg-[#f6f7fb]">
            <X className="h-[16px] w-[16px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f7f8fb] px-[10px] py-[14px]">
          <div className="rounded-[5px] bg-[#fff1d6] px-[12px] py-[13px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[10px]">
                <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] bg-[#f4a600] text-[13px] font-bold text-white">!</span>
                <span className="text-[13px] text-[#55556e]">资金互转申请</span>
              </div>
              <div className="text-[13px] font-semibold text-[#20213a]">{record.transferAmount || record.amount}</div>
            </div>
          </div>

          <div className="mt-[10px] rounded-[5px] bg-white px-[12px] py-[12px] shadow-sm">
            <div className="mb-[12px] flex items-center justify-between">
              <span className="text-[12px] text-[#66677f]">当前状态</span>
              <StatusBadge tone={transferStatusTone(record.status)}>{record.status}</StatusBadge>
            </div>
            <div className="border-t border-[#e5e6ef] py-[11px]">
              <div className="text-[12px] text-[#66677f]">客户</div>
              <div className="mt-[5px] text-[13px] font-semibold text-[#20213a]">{record.customer.name}</div>
              <div className="mt-[3px] text-[12px] text-[#66677f]">ID: {record.customer.id}</div>
              <div className="mt-[3px] break-all text-[12px] text-[#66677f]">{record.customer.email}</div>
            </div>
            {detailRows.map(([label, value]) => (
              <div key={label} className="border-t border-[#e5e6ef] py-[11px]">
                <div className="text-[12px] text-[#66677f]">{label}</div>
                <div className="mt-[5px] break-all text-[13px] font-semibold text-[#20213a]">{value}</div>
              </div>
            ))}
          </div>

          {isPending ? (
            <div className="mt-[10px] space-y-[8px]">
              <SelectBox label="审核结论 *" width="w-full" />
              <textarea className="h-[102px] w-full resize-none rounded-[4px] border border-[#ff4c57] bg-white px-[12px] py-[10px] text-[13px] outline-none" placeholder="审核备注 *" />
              <div className="text-[12px] text-[#ff4c57]">此字段为必填项</div>
            </div>
          ) : null}
        </div>

        {isPending ? (
          <div className="grid grid-cols-2 gap-[8px] border-t border-[#e5e6ef] bg-white p-[10px]">
            <button type="button" className="h-[36px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">拒绝</button>
            <button type="button" className="h-[36px] rounded-[5px] bg-[#bda2f9] text-[13px] font-semibold text-white hover:bg-[#9b63f5]">批准</button>
          </div>
        ) : (
          <div className="border-t border-[#e5e6ef] bg-white p-[10px]">
            <button type="button" onClick={onClose} className="h-[36px] w-full rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">关闭</button>
          </div>
        )}
      </aside>
    </div>
  )
}

function fiatStatusTone(status) {
  if (status === '处理完成' || status === '已匹配') return 'green'
  if (status === '已拒绝') return 'red'
  return 'orange'
}

function DrawerShell({ title, eyebrow, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#252236]/55">
      <aside className="fixed bottom-0 right-0 top-0 flex w-[456px] flex-col bg-white shadow-[0_18px_48px_rgba(28,29,42,0.28)]">
        <div className="flex h-[58px] items-center justify-between border-b border-[#e5e6ef] px-[18px]">
          <div>
            <h2 className="text-[15px] font-semibold text-[#20213a]">{title}</h2>
            {eyebrow ? <div className="mt-[3px] text-[11px] font-semibold uppercase text-[#8a8ca0]">{eyebrow}</div> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-[4px] p-[7px] text-[#66677f] hover:bg-[#f6f7fb]">
            <X className="h-[16px] w-[16px]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-white px-[12px] py-[14px]">{children}</div>
        {footer ? <div className="border-t border-[#e5e6ef] bg-white p-[10px]">{footer}</div> : null}
      </aside>
    </div>
  )
}

function DrawerSelectField({ label, value, onChange, options, placeholder }) {
  return (
    <label className="block">
      <span className="mb-[-8px] ml-[10px] inline-block bg-white px-[4px] text-[12px] text-[#66677f]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-[54px] w-full rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] text-[14px] text-[#24243d] outline-none"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function DrawerInputField({ label, placeholder = '', prefix = '' }) {
  return (
    <label className="block">
      <span className="mb-[-8px] ml-[10px] inline-block bg-white px-[4px] text-[12px] text-[#66677f]">{label}</span>
      <div className="flex h-[54px] items-center rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] text-[14px] text-[#24243d]">
        {prefix ? <span className="mr-[8px] font-semibold">{prefix}</span> : null}
        <input className="h-full min-w-0 flex-1 bg-transparent outline-none" placeholder={placeholder} />
      </div>
    </label>
  )
}

function DrawerTextareaField({ label, placeholder }) {
  return (
    <label className="block">
      <span className="mb-[-8px] ml-[10px] inline-block bg-white px-[4px] text-[12px] text-[#66677f]">{label}</span>
      <textarea className="h-[106px] w-full resize-none rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] py-[12px] text-[14px] outline-none" placeholder={placeholder} />
    </label>
  )
}

function ManualFiatDrawer({ type, accountType, onAccountTypeChange, onClose }) {
  const isDeposit = type === 'deposit'
  const title = isDeposit ? '手动入金' : '手动出金'
  const toneClass = isDeposit ? 'bg-[#d8f0ff] text-[#1295d8]' : 'bg-[#fff1d6] text-[#f39800]'
  const confirmClass = isDeposit ? 'bg-[#46c800] hover:bg-[#3bb000]' : 'bg-[#ff4c57] hover:bg-[#e53d48]'
  const message = isDeposit
    ? '手动入金将直接增加客户账户余额，请谨慎操作并确保信息准确。'
    : '手动出金将直接扣减客户账户余额，请谨慎操作并确保客户有足够余额。'

  return (
    <DrawerShell
      title={title}
      onClose={onClose}
      footer={(
        <div className="grid grid-cols-2 gap-[8px]">
          <button type="button" onClick={onClose} className="h-[38px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">取消</button>
          <button type="button" className={`h-[38px] rounded-[5px] text-[13px] font-semibold text-white ${confirmClass}`}>{isDeposit ? '确认入金' : '确认出金'}</button>
        </div>
      )}
    >
      <div className="space-y-[14px]">
        <div className={`rounded-[5px] px-[14px] py-[13px] text-[13px] font-semibold leading-[22px] ${toneClass}`}>
          {message}
        </div>
        <DrawerSelectField label="选择客户 *" value="" options={customers.map((customer) => `ID: ${customer.id} / ${customer.email}`)} placeholder="选择客户 *" />
        <DrawerSelectField label="选择账户 *" value={accountType} onChange={onAccountTypeChange} options={manualAccountOptions} />
        <DrawerSelectField label="币种 *" value="USD - 美元" options={['USD - 美元', 'HKD - 港币']} />
        <DrawerSelectField label="打款渠道" value="电汇" options={['电汇', 'FPS', 'ACH']} />
        {!isDeposit ? <DrawerSelectField label="银行账号 *" value="" options={['WO · 测试银行 · 232232', 'JW · Fidere Partner Bank · 026009593']} placeholder="银行账号 *" /> : null}
        <DrawerInputField label={isDeposit ? '入金金额 *' : '出金金额 *'} prefix="USD" placeholder="请输入正确的金额" />
        <DrawerTextareaField label="备注说明 *" placeholder="必填项，用于审计追踪" />
        <button type="button" className="flex h-[40px] w-full items-center justify-center gap-[8px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">
          <FileText className="h-[15px] w-[15px]" />
          上传凭证（可选）
        </button>
      </div>
    </DrawerShell>
  )
}

function FiatOverviewPanel({ onOpenManual, onChangeTab }) {
  const quickActions = [
    { label: '手动入金', tone: 'bg-[#46c800] hover:bg-[#3bb000]', marked: true, action: () => onOpenManual('deposit') },
    { label: '手动出金', tone: 'bg-[#ff4c57] hover:bg-[#e53d48]', marked: true, action: () => onOpenManual('withdraw') },
    { label: '入账认领', tone: 'bg-[#8b4fff] hover:bg-[#7f42f2]', action: () => onChangeTab('入账认领') },
    { label: '出金审批', tone: 'bg-[#f4a600] hover:bg-[#db9400]', action: () => onChangeTab('出金审批') },
    { label: '流水查询', tone: 'border border-[#24a8f3] bg-white text-[#24a8f3] hover:bg-[#eaf7ff]', action: () => onChangeTab('流水查询') },
  ]

  return (
    <div className="space-y-[21px]">
      <Panel className="px-[18px] py-[20px]">
        <div className="text-[16px] font-semibold text-[#20213a]">快捷操作</div>
        <div className="mt-[18px] flex flex-wrap gap-[12px]">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.action}
              className={`inline-flex h-[38px] items-center gap-[8px] rounded-[5px] px-[16px] text-[13px] font-semibold text-white shadow-sm ${action.tone}`}
            >
              <Plus className="h-[14px] w-[14px]" />
              {action.marked ? <QuestionMark inverse /> : null}
              {action.label}
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-5 gap-[18px]">
        <StatCard title="AUM" value="1069225.64" desc="较昨日" tone="green" icon={CircleDot} />
        <StatCard title="今日净流入" value="0" desc="较昨日" tone="green" icon={LineChart} />
        <StatCard title="待认领" value="18" desc="较昨日" tone="amber" icon={Clock3} />
        <StatCard title="待审批" value="10" desc="较昨日" tone="blue" icon={FileCheck2} />
        <StatCard title="未匹配来账" value="0" desc="全部" tone="violet" icon={Gauge} />
      </div>

      <div className="grid grid-cols-[0.95fr_0.95fr_1fr] gap-[21px]">
        <Panel className="h-[278px] p-[18px]">
          <div className="text-[17px] font-semibold text-[#20213a]">资产分布</div>
          <div className="mt-[48px] flex items-center justify-center">
            <div className="relative h-[132px] w-[132px] rounded-full border-[28px] border-[#8d9198]">
              <div className="absolute right-[-54px] top-[48px] text-[13px] font-semibold text-[#8b4fff]">USD 10.2477%</div>
            </div>
          </div>
        </Panel>
        <Panel className="h-[278px] p-[18px]">
          <div className="text-[17px] font-semibold text-[#20213a]">AUM 趋势</div>
          <div className="mt-[8px] text-[13px] text-[#8a8ca0]">近7天</div>
          <div className="mt-[28px] h-[150px] border-b border-l border-dashed border-[#d8d9e3] bg-gradient-to-t from-[#d8c7ff] to-[#f5efff]" />
        </Panel>
        <Panel className="h-[278px] p-[18px]">
          <div className="text-[17px] font-semibold text-[#20213a]">资金流动</div>
          <div className="mt-[8px] text-[13px] text-[#8a8ca0]">入金 vs 出金</div>
          <div className="mt-[26px] grid h-[150px] grid-cols-6 items-end gap-[13px] border-b border-dashed border-[#d8d9e3]">
            {[42, 92, 28, 78, 38, 64].map((height, index) => (
              <div key={index} className="rounded-t-[4px] bg-[#8b4fff]" style={{ height }} />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function FiatFilterPanel({ variant = 'default' }) {
  return (
    <Panel className="mt-[21px] px-[15px] py-[18px]">
      <div className="flex items-center gap-[12px]">
        <SelectBox label="状态：全部" width="w-[296px]" />
        {variant === 'incoming' ? <SelectBox label="匹配状态：全部" width="w-[296px]" /> : null}
        <SelectBox label="开始日期" width="w-[296px]" />
        <SelectBox label="结束日期" width="w-[296px]" />
        <SearchBox placeholder={variant === 'incoming' ? '参考号、付款人、备注...' : '客户、收款人...'} width="w-[296px]" />
      </div>
      <div className="mt-[18px] flex gap-[10px]">
        <PrimaryButton icon={Search}>查询</PrimaryButton>
        <ActionButton icon={Clock3}>重置</ActionButton>
      </div>
    </Panel>
  )
}

function IncomingClaimDrawer({ record, onClose }) {
  if (!record) return null
  const isPending = record.status === '待审核'

  return (
    <DrawerShell
      title="入账认领"
      onClose={onClose}
      footer={(
        <div className="grid grid-cols-2 gap-[8px]">
          <button type="button" onClick={onClose} className="h-[38px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">取消</button>
          <button type="button" className="h-[38px] rounded-[5px] bg-[#b0e68d] text-[13px] font-semibold text-white hover:bg-[#87d35d]">确认认领</button>
        </div>
      )}
    >
      <div className="space-y-[12px]">
        <div className="rounded-[5px] bg-[#d8f0ff] px-[14px] py-[13px]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#55556e]">原始来账金额</span>
            <span className="text-[13px] font-semibold text-[#20213a]">{record.currencyAmount}</span>
          </div>
          {isPending ? (
            <label className="mt-[12px] block">
              <span className="text-[12px] font-semibold text-[#2586d9]">可认领入账金额</span>
              <input
                defaultValue={record.claimableAmount || record.currencyAmount}
                className="mt-[7px] h-[38px] w-full rounded-[4px] border border-[#8ac9ff] bg-white px-[10px] text-[13px] font-semibold text-[#20213a] outline-none focus:border-[#2586d9]"
              />
            </label>
          ) : (
            <div className="mt-[9px] flex items-center justify-between border-t border-[#bde5ff] pt-[9px]">
              <span className="text-[13px] text-[#55556e]">实际入账金额</span>
              <span className="text-[13px] font-semibold text-[#20213a]">{record.claimableAmount || record.currencyAmount}</span>
            </div>
          )}
        </div>
        <div className="rounded-[5px] bg-white px-[12px] py-[12px] shadow-sm">
          {[
            ['账户类型', record.accountType],
            ['付款人', record.payer],
            ['渠道', record.channel],
            ['参考号', record.referenceNo],
            ['提交时间', record.submittedAt],
            ['匹配客户', record.matchedCustomer],
          ].map(([label, value]) => (
            <div key={label} className="border-b border-[#e5e6ef] py-[11px] last:border-b-0">
              <div className="text-[12px] text-[#66677f]">{label}</div>
              <div className="mt-[5px] text-[13px] font-semibold text-[#20213a]">{value}</div>
            </div>
          ))}
        </div>
        <div className="rounded-[5px] border border-[#cfd1dc] bg-white p-[12px]">
          <div className="flex items-center gap-[10px]">
            <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#4bd20c] text-[13px] font-semibold text-white">{record.matchedCustomer.slice(0, 1).toUpperCase()}</span>
            <span className="text-[13px] font-semibold text-[#20213a]">{record.matchedCustomer}</span>
          </div>
          <div className="mt-[8px] text-[12px] text-[#66677f]">该记录已匹配客户</div>
        </div>
        <DrawerTextareaField label="认领备注 *" placeholder="必填项，用于审计追踪" />
      </div>
    </DrawerShell>
  )
}

function IncomingClaimPanel({ onOpenRecord }) {
  return (
    <>
      <FiatFilterPanel variant="incoming" />
      <Panel className="mt-[21px] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#e5e6ef] px-[18px] py-[14px]">
          <PrimaryButton icon={FileCheck2}>批量认领</PrimaryButton>
          <div className="flex gap-[10px]">
            <SearchBox placeholder="参考号、付款人、备注..." width="w-[256px]" />
            <ActionButton icon={Clock3}>重置</ActionButton>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full border-collapse text-left text-[13px] text-[#55556e]">
            <thead>
              <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
                {['', '提交时间', '账户类型', '币种/金额', '付款人', '渠道', '参考号', '转账凭证', '匹配客户', '匹配状态', '状态', '操作'].map((item) => (
                  <th key={item} className="px-[18px]">{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {incomingClaimRows.map((row) => (
                <tr key={row.id} className="h-[62px] border-b border-[#e7e8ef] bg-white">
                  <td className="px-[18px]"><input type="checkbox" className="h-[15px] w-[15px]" /></td>
                  <td className="px-[18px]">{row.submittedAt}</td>
                  <td className="px-[18px] font-semibold text-[#20213a]">{row.accountType}</td>
                  <td className="px-[18px]">{row.currencyAmount}</td>
                  <td className="px-[18px]">{row.payer}</td>
                  <td className="px-[18px]">{row.channel}</td>
                  <td className="px-[18px]">{row.referenceNo}</td>
                  <td className="px-[18px]">{row.voucher}</td>
                  <td className="px-[18px]">{row.matchedCustomer}</td>
                  <td className="px-[18px]"><StatusBadge tone={fiatStatusTone(row.matchStatus)}>{row.matchStatus}</StatusBadge></td>
                  <td className="px-[18px]"><StatusBadge tone={fiatStatusTone(row.status)}>{row.status}</StatusBadge></td>
                  <td className="px-[18px]"><ActionButton icon={FileCheck2} onClick={() => onOpenRecord(row)}>查看详情</ActionButton></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}

function WithdrawalApprovalDrawer({ record, onClose }) {
  if (!record) return null

  return (
    <DrawerShell
      title="出金审批"
      onClose={onClose}
      footer={(
        <div className="grid grid-cols-2 gap-[8px]">
          <button type="button" className="h-[38px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">拒绝</button>
          <button type="button" className="h-[38px] rounded-[5px] bg-[#bda2f9] text-[13px] font-semibold text-white hover:bg-[#9b63f5]">批准</button>
        </div>
      )}
    >
      <div className="space-y-[12px]">
        <div className="rounded-[5px] bg-[#fff1d6] px-[14px] py-[13px]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#55556e]">转账金额</span>
            <span className="text-[13px] font-semibold text-[#20213a]">{record.transferAmount || record.currencyAmount}</span>
          </div>
          <div className="mt-[9px] flex items-center justify-between border-t border-[#ffd894] pt-[9px]">
            <span className="text-[13px] text-[#55556e]">实际到账金额</span>
            <span className="text-[13px] font-semibold text-[#20213a]">{record.actualArrivalAmount || record.currencyAmount}</span>
          </div>
        </div>
        <div className="rounded-[5px] bg-white px-[12px] py-[12px] shadow-sm">
          <div className="border-b border-[#e5e6ef] py-[11px]">
            <div className="text-[12px] text-[#66677f]">客户</div>
            <div className="mt-[5px] text-[13px] font-semibold text-[#20213a]">{record.customer.name}</div>
            <div className="mt-[3px] text-[12px] text-[#66677f]">{record.customer.email}</div>
          </div>
          {[
            ['账户类型', record.accountType],
            ['转账金额', record.transferAmount || record.currencyAmount],
            ['实际到账金额', record.actualArrivalAmount || record.currencyAmount],
            ['收款人', record.recipient],
            ['用途', record.purpose],
            ['申请时间', record.appliedAt],
            ['出金服务费', record.fee],
            ['状态', record.status],
            ...(record.rejectReason ? [['拒绝原因', record.rejectReason]] : []),
          ].map(([label, value]) => (
            <div key={label} className="border-b border-[#e5e6ef] py-[11px] last:border-b-0">
              <div className="text-[12px] text-[#66677f]">{label}</div>
              <div className="mt-[5px] text-[13px] font-semibold text-[#20213a]">{value}</div>
            </div>
          ))}
        </div>
        <DrawerSelectField label="打款渠道 *" value={record.channel} options={['电汇', 'FPS', 'ACH']} />
        <DrawerSelectField label="打款银行 *" value={record.bank} options={['测试银行', 'WO Bank', 'Fidere Partner Bank']} />
        <button type="button" className="flex h-[40px] w-full items-center justify-center gap-[8px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">
          <FileText className="h-[15px] w-[15px]" />
          选择文件
        </button>
        <div className="text-[12px] text-[#66677f]">支持 JPG, PNG 格式，最大 10MB</div>
        <DrawerTextareaField label="审批备注 *" placeholder="此字段为必填项" />
      </div>
    </DrawerShell>
  )
}

function WithdrawalApprovalPanel({ onOpenRecord }) {
  return (
    <>
      <FiatFilterPanel />
      <Panel className="mt-[21px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full border-collapse text-left text-[13px] text-[#55556e]">
            <thead>
              <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
                {['申请时间', '客户', '账户类型', '转账金额', '出金服务费', '实际到账金额', '收款人', '用途', '状态', '操作'].map((item) => (
                  <th key={item} className="px-[18px]">{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {withdrawalApprovalRows.map((row) => (
                <tr key={row.id} className="h-[78px] border-b border-[#e7e8ef] bg-white">
                  <td className="px-[18px]">{row.appliedAt}</td>
                  <td className="px-[18px]">
                    <div className="leading-[1.55]">
                      <div className="font-semibold text-[#20213a]">{row.customer.name}</div>
                      <div>ID: {row.customer.id}</div>
                      <div>{row.customer.email}</div>
                    </div>
                  </td>
                  <td className="px-[18px] font-semibold text-[#20213a]">{row.accountType}</td>
                  <td className="px-[18px]">{row.transferAmount || row.currencyAmount}</td>
                  <td className="px-[18px]">{row.fee}</td>
                  <td className="px-[18px]">{row.actualArrivalAmount || row.currencyAmount}</td>
                  <td className="px-[18px]">{row.recipient}</td>
                  <td className="px-[18px]">{row.purpose}</td>
                  <td className="px-[18px]"><StatusBadge tone={fiatStatusTone(row.status)}>{row.status}</StatusBadge></td>
                  <td className="px-[18px]"><ActionButton icon={FileCheck2} onClick={() => onOpenRecord(row)}>查看详情</ActionButton></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}

function FiatTransferPanel({ onOpenRecord }) {
  return (
    <>
      <FiatFilterPanel />
      <Panel className="mt-[21px] overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-[1360px] w-full border-collapse text-left text-[13px] text-[#55556e]">
          <thead>
            <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
              <th className="px-[18px]">申请编号</th>
              <th className="px-[18px]">客户</th>
              <th className="px-[18px]">转出账户</th>
              <th className="px-[18px]">转入账户</th>
              <th className="px-[18px]">币种</th>
              <th className="px-[18px]">转账金额</th>
              <th className="px-[18px]">实际到账金额</th>
              <th className="px-[18px]">状态</th>
              <th className="px-[18px]">提交时间</th>
              <th className="px-[18px]">完成时间</th>
              <th className="px-[18px]">操作</th>
            </tr>
          </thead>
          <tbody>
            {transferRows.map((row) => (
              <tr key={row.requestId} className="h-[74px] border-b border-[#e7e8ef] bg-white">
                <td className="px-[18px] font-semibold text-[#20213a]">{row.requestId}</td>
                <td className="px-[18px]">
                  <div className="leading-[1.55]">
                    <div className="font-semibold text-[#20213a]">{row.customer.name}</div>
                    <div>ID: {row.customer.id}</div>
                    <div>{row.customer.email}</div>
                  </div>
                </td>
                <td className="px-[18px]">{row.fromAccount}</td>
                <td className="px-[18px]">{row.toAccount}</td>
                <td className="px-[18px]">{row.currency}</td>
                <td className="px-[18px]">{row.transferAmount || row.amount}</td>
                <td className="px-[18px]">{row.actualArrivalAmount || row.estimatedArrival}</td>
                <td className="px-[18px]"><StatusBadge tone={transferStatusTone(row.status)}>{row.status}</StatusBadge></td>
                <td className="px-[18px]">{row.submittedAt}</td>
                <td className="px-[18px]">{row.completedAt || ''}</td>
                <td className="px-[18px]">
                  {row.status === '待审核' ? (
                    <ActionButton icon={FileCheck2} onClick={() => onOpenRecord(row)}>审核</ActionButton>
                  ) : (
                    <ActionButton icon={Eye} onClick={() => onOpenRecord(row)}>查看详情</ActionButton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Panel>
    </>
  )
}

function FiatAssetManagementPage() {
  const [activeTab, setActiveTab] = useState('总览')
  const [selectedTransfer, setSelectedTransfer] = useState(null)
  const [manualDrawerType, setManualDrawerType] = useState(null)
  const [manualAccountType, setManualAccountType] = useState('香港账户')
  const [selectedIncomingClaim, setSelectedIncomingClaim] = useState(null)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null)

  const openManualDrawer = (type) => {
    setManualAccountType('香港账户')
    setManualDrawerType(type)
  }

  return (
    <AdminShell>
      <Panel className="px-[18px] py-[22px]">
        <div className="flex items-center justify-between">
          <PageTitle title="法币资产管理" subtitle="管理法币资产、出入金审批与资金互转申请" />
          <span className="rounded-[5px] bg-[#f6f7fb] px-[14px] py-[9px] text-[12px] text-[#66677f]">最后同步: 2026-05-31 18:02:39</span>
        </div>
        <div className="mt-[24px] flex gap-[24px] border-b border-[#e5e6ef]">
          {fiatTabs.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-[6px] pb-[14px] text-[13px] font-semibold ${
                activeTab === tab ? 'border-[#8b4fff] text-[#8b4fff]' : 'border-transparent text-[#4c4c68]'
              }`}
            >
              <span className="inline-flex items-center gap-[6px]">
                {markedFiatTabs.has(tab) ? <QuestionMark active={activeTab === tab} /> : null}
                {tab}
              </span>
            </button>
          ))}
        </div>
      </Panel>

      <div className="mt-[21px]">
        {activeTab === '总览' ? <FiatOverviewPanel onOpenManual={openManualDrawer} onChangeTab={setActiveTab} /> : null}
        {activeTab === '入账认领' ? <IncomingClaimPanel onOpenRecord={setSelectedIncomingClaim} /> : null}
        {activeTab === '出金审批' ? <WithdrawalApprovalPanel onOpenRecord={setSelectedWithdrawal} /> : null}
        {activeTab === '资金互转' ? <FiatTransferPanel onOpenRecord={setSelectedTransfer} /> : null}
        {!['总览', '入账认领', '出金审批', '资金互转'].includes(activeTab) ? (
          <Panel className="p-[36px] text-center text-[13px] text-[#66677f]">{activeTab} 数据占位，当前原型重点展示总览、入账认领、出金审批和资金互转。</Panel>
        ) : null}
      </div>

      {manualDrawerType ? (
        <ManualFiatDrawer
          type={manualDrawerType}
          accountType={manualAccountType}
          onAccountTypeChange={setManualAccountType}
          onClose={() => setManualDrawerType(null)}
        />
      ) : null}
      <IncomingClaimDrawer record={selectedIncomingClaim} onClose={() => setSelectedIncomingClaim(null)} />
      <WithdrawalApprovalDrawer record={selectedWithdrawal} onClose={() => setSelectedWithdrawal(null)} />
      <TransferAuditDrawer record={selectedTransfer} onClose={() => setSelectedTransfer(null)} />
    </AdminShell>
  )
}

function modeLabel(mode) {
  if (mode === 'percent') return '百分比'
  if (mode === 'fixed') return '固定金额'
  if (mode === 'combo') return '固定手续费 + 百分比'
  return '平台默认'
}

function FeeConfigModal({ draft, onChange, onClose, onSave, editingFee }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#252236]/45">
      <div className="w-[540px] rounded-[6px] bg-white p-[18px] shadow-[0_16px_40px_rgba(28,29,42,0.25)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[8px] text-[15px] font-semibold text-[#20213a]">
            <Plus className="h-[16px] w-[16px]" />
            {editingFee ? '编辑提现服务费配置' : '新增提现服务费配置'}
          </div>
          <button type="button" onClick={onClose} className="rounded-[4px] p-[7px] text-[#66677f] hover:bg-[#f6f7fb]">
            <X className="h-[16px] w-[16px]" />
          </button>
        </div>

        <div className="mt-[18px] space-y-[12px]">
          <select value={draft.customerId} onChange={(event) => onChange({ ...draft, customerId: event.target.value })} className="h-[48px] w-full rounded-[4px] border border-[#cfd1dc] bg-white px-[12px] text-[13px] outline-none">
            {customers.map((customer) => <option key={customer.id} value={customer.id}>ID: {customer.id} / {customer.email}</option>)}
          </select>
          <select value={draft.mode} onChange={(event) => onChange({ ...draft, mode: event.target.value })} className="h-[48px] w-full rounded-[4px] border border-[#cfd1dc] bg-white px-[12px] text-[13px] outline-none">
            <option value="platform">使用平台默认</option>
            <option value="percent">百分比</option>
            <option value="fixed">固定金额</option>
            <option value="combo">固定手续费 + 百分比</option>
          </select>
          {draft.mode !== 'platform' ? (
            <input
              value={draft.value}
              onChange={(event) => onChange({ ...draft, value: event.target.value })}
              className="h-[48px] w-full rounded-[4px] border border-[#cfd1dc] px-[12px] text-[13px] outline-none"
              placeholder={draft.mode === 'percent' ? '百分比值，例如 0.3' : draft.mode === 'combo' ? '固定金额 + 百分比，例如 10.00 + 0.20' : '固定金额，例如 15.00'}
            />
          ) : null}
          <div className="rounded-[5px] bg-[#e7f5ff] px-[14px] py-[12px] text-[13px] text-[#2586d9]">未单独设置的用户，将默认使用平台级提现服务费配置；可配置固定金额、百分比，或固定手续费 + 百分比组合。</div>
        </div>

        <div className="mt-[18px] flex justify-end gap-[10px]">
          <ActionButton icon={X} onClick={onClose}>取消</ActionButton>
          <PrimaryButton icon={FileCheck2} onClick={onSave}>保存</PrimaryButton>
        </div>
      </div>
    </div>
  )
}

function FeeConfigPage() {
  const [configs, setConfigs] = useState(initialFeeConfigs)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFee, setEditingFee] = useState(null)
  const [draft, setDraft] = useState({ customerId: '65', mode: 'fixed', value: '15.00' })

  const selectedCustomer = useMemo(() => customers.find((customer) => customer.id === draft.customerId) || customers[0], [draft.customerId])

  const openCreate = () => {
    setEditingFee(null)
    setDraft({ customerId: customers[0].id, mode: 'fixed', value: '15.00' })
    setModalOpen(true)
  }

  const openEdit = (config) => {
    setEditingFee(config)
    setDraft({ customerId: config.id, mode: config.mode, value: config.mode === 'platform' ? '' : config.value.replace('USD ', '').replace('%', '') })
    setModalOpen(true)
  }

  const saveConfig = () => {
    const normalizedDraftValue = String(draft.value || '').replace(/%+$/g, '')
    const value = draft.mode === 'platform'
      ? '使用平台默认'
      : draft.mode === 'percent'
        ? `${normalizedDraftValue}%`
        : draft.mode === 'combo'
          ? `USD ${normalizedDraftValue}%`
          : `USD ${draft.value}`
    const nextConfig = {
      id: selectedCustomer.id,
      email: selectedCustomer.email,
      mode: draft.mode,
      value,
      usePlatformDefault: draft.mode === 'platform',
    }

    setConfigs((current) => {
      if (current.some((item) => item.id === nextConfig.id)) {
        return current.map((item) => (item.id === nextConfig.id ? nextConfig : item))
      }
      return [nextConfig, ...current]
    })
    setModalOpen(false)
  }

  return (
    <AdminShell>
      <Panel className="px-[18px] py-[22px]">
        <PageTitle title="提现服务费配置" subtitle="设置平台级默认服务费，并为指定用户配置固定金额、百分比或组合收费。" />
      </Panel>

      <div className="mt-[21px] grid grid-cols-[360px_1fr] gap-[18px]">
        <Panel className="p-[18px]">
          <div className="mb-[16px] flex items-center gap-[8px] text-[14px] font-semibold text-[#20213a]">
            <Percent className="h-[17px] w-[17px] text-[#8b4fff]" />
            平台级服务费设置
          </div>
          <div className="grid grid-cols-3 gap-[10px]">
            <div className="rounded-[5px] border border-[#8b4fff] bg-[#f6f0ff] p-[14px]">
              <div className="text-[12px] text-[#66677f]">固定金额</div>
              <div className="mt-[8px] text-[22px] font-bold text-[#20213a]">USD 15.00</div>
              <div className="mt-[6px] text-[12px] text-[#8b4fff]">当前默认</div>
            </div>
            <div className="rounded-[5px] border border-[#e2e4ec] bg-white p-[14px]">
              <div className="text-[12px] text-[#66677f]">百分比</div>
              <div className="mt-[8px] text-[22px] font-bold text-[#20213a]">0.30%</div>
              <div className="mt-[6px] text-[12px] text-[#66677f]">备选配置</div>
            </div>
            <div className="rounded-[5px] border border-[#e2e4ec] bg-white p-[14px]">
              <div className="text-[12px] text-[#66677f]">固定 + 百分比</div>
              <div className="mt-[8px] text-[18px] font-bold text-[#20213a]">USD 10 + 0.20%</div>
              <div className="mt-[6px] text-[12px] text-[#66677f]">组合配置</div>
            </div>
          </div>
          <div className="mt-[14px] rounded-[5px] bg-[#f6f7fb] p-[14px] text-[13px] leading-[22px] text-[#66677f]">未设置用户将默认使用平台级固定金额 USD 15.00；服务费规则用于提现/法币转出场景。</div>
        </Panel>

        <Panel className="px-[15px] pb-[18px] pt-[21px]">
          <div className="flex items-center justify-between px-[4px]">
            <PageTitle title="用户级配置" subtitle="支持按用户覆盖平台默认服务费规则" />
            <PrimaryButton icon={Plus} onClick={openCreate}>新增</PrimaryButton>
          </div>
          <div className="mt-[21px] flex items-center gap-[12px]">
            <SearchBox placeholder="搜索用户ID" width="w-[300px]" />
            <SearchBox placeholder="搜索用户邮箱" width="w-[300px]" />
            <PrimaryButton icon={Search}>搜索</PrimaryButton>
          </div>
          <div className="mt-[15px] border-t border-[#e5e6ef] pt-[15px]">
            <table className="w-full border-collapse text-left text-[13px] text-[#55556e]">
              <thead>
                <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
                  <th className="px-[18px]">用户 ID</th>
                  <th className="px-[18px]">邮箱</th>
                  <th className="px-[18px]">计费方式</th>
                  <th className="px-[18px]">服务费规则</th>
                  <th className="px-[18px]">是否使用平台默认</th>
                  <th className="px-[18px]">操作</th>
                </tr>
              </thead>
              <tbody>
                {configs.map((config) => (
                  <tr key={config.id} className="h-[74px] border-b border-[#e7e8ef] bg-white">
                    <td className="px-[18px] font-semibold text-[#20213a]">{config.id}</td>
                    <td className="px-[18px]">{config.email}</td>
                    <td className="px-[18px]">{modeLabel(config.mode)}</td>
                    <td className="px-[18px] text-[#8b4fff]">{config.value}</td>
                    <td className="px-[18px]"><StatusBadge tone={config.usePlatformDefault ? 'gray' : 'green'}>{config.usePlatformDefault ? '是' : '否'}</StatusBadge></td>
                    <td className="px-[18px]"><ActionButton icon={FileText} onClick={() => openEdit(config)}>编辑</ActionButton></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      {modalOpen ? <FeeConfigModal draft={draft} onChange={setDraft} onClose={() => setModalOpen(false)} onSave={saveConfig} editingFee={editingFee} /> : null}
    </AdminShell>
  )
}

export function BaasAdminReviewPrototype({ onBack }) {
  const [activePage, setActivePage] = useState('opening-review')
  const [reviewMode, setReviewMode] = useState('list')

  const selectPage = (page) => {
    setActivePage(page)
    setReviewMode('list')
  }

  return (
    <div className="min-h-screen bg-[#f4f5fb] font-sans text-[#24243d]">
      <Header onBack={onBack} />
      <Sidebar activePage={activePage} onSelect={selectPage} />
      {activePage === 'opening-review' && reviewMode === 'list' ? <OpeningReviewPage onOpenDetail={() => setReviewMode('detail')} onOpenProcess={() => setReviewMode('process')} /> : null}
      {activePage === 'opening-review' && reviewMode !== 'list' ? <OpeningReviewDetailPage mode={reviewMode} onBack={() => setReviewMode('list')} /> : null}
      {activePage === 'user-management' ? <UserManagementPage /> : null}
      {activePage === 'fiat-assets' ? <FiatAssetManagementPage /> : null}
      {activePage === 'fee-config' ? <FeeConfigPage /> : null}
      <button
        type="button"
        className="fixed right-0 top-[180px] z-40 flex h-[36px] w-[36px] items-center justify-center rounded-l-full bg-[#8b4fff] text-white shadow-lg"
        aria-label="后台设置"
      >
        <Settings className="h-[18px] w-[18px]" strokeWidth={2} />
      </button>
    </div>
  )
}
