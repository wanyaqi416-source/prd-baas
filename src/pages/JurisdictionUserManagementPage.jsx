import { useMemo, useState } from 'react'
import {
  Clock3,
  Eye,
  FileText,
  Pencil,
  Plus,
  Search,
  UserCheck,
  UsersRound,
  X,
} from 'lucide-react'

import { initialAccountTypeConfigs } from '../data/accountTypeConfig'
import {
  createJurisdictionAccountRecord,
  createSingaporeAccountRecord,
  initialUserAccountConfigs,
} from '../data/userAccountConfig'

const MANAGED_ACCOUNT_CODES = ['SG_ACCOUNT', 'BH_ACCOUNT']

const accountTypeFallbacks = {
  SG_ACCOUNT: {
    id: 'acct-sg-fallback',
    name: '新加坡账户',
    englishName: 'Singapore Account',
    code: 'SG_ACCOUNT',
    status: '启用',
    requiresDocuments: false,
    receivingAccount: {},
    currencies: [],
  },
  BH_ACCOUNT: {
    id: 'acct-bh-fallback',
    name: '巴林账户',
    englishName: 'Bahrain Account',
    code: 'BH_ACCOUNT',
    status: '启用',
    requiresDocuments: false,
    receivingAccount: {},
    currencies: [],
  },
}

function normalizeAccountStatus(status) {
  if (status === '已开户' || status === '已开通') return '已开通'
  if (status === '待处理' || status === '审核中') return '审核中'
  if (status === '已拒绝') return '已拒绝'
  return '未开通'
}

function accountStatusTone(status) {
  if (status === '已开通') return 'green'
  if (status === '审核中') return 'blue'
  if (status === '已拒绝') return 'red'
  return 'gray'
}

function allowsManualOpening(accountType) {
  if (typeof accountType?.allowManualOpening === 'boolean') return accountType.allowManualOpening
  return accountType?.requiresDocuments !== true
}

function getManagedAccountTypes(accountTypes = []) {
  return MANAGED_ACCOUNT_CODES.map((code) => (
    accountTypes.find((accountType) => accountType.code === code) || accountTypeFallbacks[code]
  ))
}

function getReceivingDefaults(accountType) {
  const receivingAccount = accountType?.receivingAccount || {}
  return {
    beneficiaryName: receivingAccount.beneficiaryName || '',
    accountNumber: receivingAccount.accountNumber || '',
    bankName: receivingAccount.bankName || '-',
    receivingBank: receivingAccount.receivingBank || '-',
    swiftCode: receivingAccount.swiftCode || '-',
    bankAddress: receivingAccount.bankAddress || '-',
    currencies: (accountType?.currencies || [])
      .filter((currency) => currency.enabled !== false)
      .map((currency) => currency.code)
      .join(' / ') || '-',
  }
}

function getFeeStatus(record, accountType) {
  if (record?.feeStatus) return record.feeStatus
  if (normalizeAccountStatus(record?.status) === '未开通') return '未扣费'
  return Number(accountType?.openingFeeAmount || 0) > 0 ? '扣费成功' : '无需扣费'
}

function getUserAccountRecord(user, accountType) {
  const directRecord = (user.jurisdictionAccounts || []).find(
    (account) => account.accountTypeCode === accountType.code,
  )
  if (directRecord) {
    return {
      ...directRecord,
      status: normalizeAccountStatus(directRecord.status),
      feeStatus: getFeeStatus(directRecord, accountType),
    }
  }

  if (accountType.code === 'SG_ACCOUNT' && user.singaporeAccount) {
    const legacy = user.singaporeAccount
    return {
      ...legacy,
      accountTypeCode: accountType.code,
      status: normalizeAccountStatus(legacy.status),
      rejectReason: legacy.rejectReason || legacy.remark || '',
      feeStatus: getFeeStatus(legacy, accountType),
    }
  }

  const manualRecord = (user.manualAccounts || []).find(
    (account) => account.accountTypeCode === accountType.code,
  )
  if (manualRecord) {
    return {
      ...manualRecord,
      status: normalizeAccountStatus(manualRecord.status),
      feeStatus: getFeeStatus(manualRecord, accountType),
    }
  }

  const baseRecord = (user.accounts || []).find(
    (account) => account.accountTypeCode === accountType.code,
  )
  if (baseRecord) {
    const beneficiary = baseRecord.receivingAccountOverride || {}
    return {
      ...baseRecord,
      accountTypeCode: accountType.code,
      status: normalizeAccountStatus(baseRecord.status),
      beneficiaryName: beneficiary.beneficiaryName || '',
      accountNumber: beneficiary.accountNumber || baseRecord.accountNo || '',
      openingSource: accountType.isDefault ? '系统自动创建' : '历史账户',
      approvedAt: baseRecord.openedAt || '',
      feeStatus: getFeeStatus(baseRecord, accountType),
    }
  }

  return {
    accountTypeCode: accountType.code,
    status: '未开通',
    beneficiaryName: '',
    accountNumber: '',
    openingSource: '',
    appliedAt: '',
    approvedAt: '',
    feeStatus: '未扣费',
    rejectReason: '',
    updatedAt: user.updatedAt || '',
  }
}

function getManagementStamp() {
  const value = new Date()
  const pad = (item) => String(item).padStart(2, '0')
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}`
}

function ensureUnopenedDemoUser(users, accountType) {
  if (users.some((user) => getUserAccountRecord(user, accountType).status === '未开通')) return users

  const stamp = getManagementStamp()
  const serial = users.length + 1
  const accountSlug = accountType.code.toLowerCase().replaceAll('_', '-')
  const demoUser = {
    id: `user-${accountSlug}-unopened-demo-${serial}`,
    userId: `DEMO-${String(serial).padStart(3, '0')}`,
    userName: `${accountType.name}未开通Demo`,
    email: `${accountSlug}-demo-${serial}@example.com`,
    customerType: '个人',
    userStatus: '正常',
    createdAt: stamp,
    registeredAt: stamp,
    updatedAt: stamp,
    accounts: [],
    singaporeAccount: createSingaporeAccountRecord({
      status: '未开通',
      updatedAt: stamp,
      updatedBy: '系统',
    }),
    jurisdictionAccounts: accountType.code === 'BH_ACCOUNT'
      ? [createJurisdictionAccountRecord('BH_ACCOUNT', {
        status: '未开通',
        updatedAt: stamp,
        updatedBy: '系统',
      })]
      : [],
  }
  return [...users, demoUser]
}

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

function PageTitle({ title, subtitle }) {
  return (
    <div className="px-[4px]">
      <h1 className="text-[16px] font-semibold leading-none text-[#20213a]">{title}</h1>
      {subtitle ? <p className="mt-[8px] text-[12px] text-[#66677f]">{subtitle}</p> : null}
    </div>
  )
}

function StatusBadge({ children, tone = 'blue' }) {
  const className = {
    blue: 'bg-[#e7f5ff] text-[#2586d9]',
    orange: 'bg-[#fff1d6] text-[#bd7200]',
    green: 'bg-[#e9f8ee] text-[#20894f]',
    red: 'bg-[#ffe8eb] text-[#f04f5f]',
    gray: 'bg-[#f0f1f6] text-[#5b5c70]',
  }[tone]
  return <span className={`inline-flex whitespace-nowrap rounded-full px-[9px] py-[3px] text-[12px] font-semibold ${className}`}>{children}</span>
}

function ActionButton({ icon: Icon, children, onClick, disabled = false, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="inline-flex h-[31px] items-center gap-[6px] whitespace-nowrap rounded-[4px] border border-[#8b4fff] px-[9px] text-[12px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff] disabled:cursor-not-allowed disabled:border-[#d8d9e3] disabled:bg-[#f6f7fb] disabled:text-[#a0a2b1]"
    >
      {Icon ? <Icon className="h-[14px] w-[14px]" strokeWidth={1.9} /> : null}
      {children}
    </button>
  )
}

function StatCard({ title, value, desc, tone, icon: Icon }) {
  const toneClass = {
    violet: 'bg-[#e7d6ff] text-[#8b4fff]',
    green: 'bg-[#d9f3ca] text-[#42ad1d]',
    red: 'bg-[#ffd9dd] text-[#e84751]',
  }[tone]
  return (
    <section className="relative h-[116px] rounded-[5px] border border-[#e2e4ec] bg-white px-[18px] py-[18px] shadow-[0_8px_16px_rgba(28,29,42,0.12)]">
      <div className="text-[14px] font-semibold text-[#1f1f37]">{title}</div>
      <div className="mt-[9px] text-[24px] font-bold leading-none text-[#292842]">{value}</div>
      <div className="mt-[10px] text-[12px] text-[#55556e]">{desc}</div>
      <div className={`absolute right-[19px] top-[19px] flex h-[38px] w-[38px] items-center justify-center rounded-[5px] ${toneClass}`}>
        <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
      </div>
    </section>
  )
}

function ReadOnlyField({ label, value, wide = false }) {
  return (
    <div className={`${wide ? 'col-span-2' : ''} min-h-[66px] rounded-[5px] border border-[#e2e4ec] bg-[#f7f8fb] px-[12px] py-[10px]`}>
      <div className="text-[12px] text-[#66677f]">{label}</div>
      <div className="mt-[7px] break-words text-[13px] font-semibold leading-[20px] text-[#20213a]">{value || '-'}</div>
    </div>
  )
}

function AccountTypeSwitch({ accountTypes, value, onChange }) {
  return (
    <div className="flex h-[50px] items-center gap-[10px]">
      <span className="whitespace-nowrap text-[12px] font-semibold text-[#66677f]">账户类型</span>
      <div className="flex h-[42px] items-center rounded-[5px] border border-[#cfd1dc] bg-[#f6f7fb] p-[3px]">
        {accountTypes.map((accountType) => {
          const active = value === accountType.code
          return (
            <button
              key={accountType.code}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(accountType.code)}
              className={`h-[34px] min-w-[122px] rounded-[4px] px-[13px] text-[12px] font-semibold transition-colors ${
                active
                  ? 'bg-white text-[#8b4fff] shadow-[0_1px_5px_rgba(28,29,42,0.12)]'
                  : 'text-[#66677f] hover:text-[#20213a]'
              }`}
            >
              {accountType.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function AccountEditorModal({ user, accountType, record, mode, onClose, onSave }) {
  const defaults = getReceivingDefaults(accountType)
  const manualAllowed = allowsManualOpening(accountType)
  const [beneficiaryName, setBeneficiaryName] = useState(record.beneficiaryName || defaults.beneficiaryName)
  const [accountNumber, setAccountNumber] = useState(record.accountNumber || defaults.accountNumber)
  const [documentName, setDocumentName] = useState('')
  const [error, setError] = useState('')
  const isOpening = mode === 'open'

  const submit = () => {
    if (isOpening && !manualAllowed) {
      setError('该账户类型不允许后台手动开通，请通过客户端申请及开户审核流程处理。')
      return
    }
    if (!beneficiaryName.trim() || !accountNumber.trim()) {
      setError('请填写收款人和账户号码。')
      return
    }
    if (isOpening && accountType.requiresDocuments && !documentName) {
      setError('该账户类型要求上传开户资料，请先选择资料文件。')
      return
    }

    const result = onSave({
      beneficiaryName: beneficiaryName.trim(),
      accountNumber: accountNumber.trim(),
      documentName,
      mode,
    })
    if (result?.error) {
      setError(result.error)
      return
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#252236]/55 px-6 py-8">
      <section className="flex max-h-[88vh] w-[760px] flex-col overflow-hidden rounded-[8px] bg-white shadow-[0_18px_48px_rgba(28,29,42,0.28)]">
        <header className="flex h-[64px] shrink-0 items-center justify-between border-b border-[#e5e6ef] px-[22px]">
          <div>
            <h2 className="text-[16px] font-semibold text-[#20213a]">
              {isOpening ? `手动开通${accountType.name}` : `编辑${accountType.name}`}
            </h2>
            <p className="mt-[3px] text-[11px] font-semibold uppercase text-[#8a8ca0]">{accountType.englishName || accountType.code}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭" className="rounded-[4px] p-[7px] text-[#66677f] hover:bg-[#f6f7fb]">
            <X className="h-[16px] w-[16px]" />
          </button>
        </header>

        <div className="flex-1 space-y-[16px] overflow-y-auto px-[22px] py-[18px]">
          {error ? <div className="rounded-[5px] bg-[#ffe8eb] px-[12px] py-[10px] text-[12px] font-semibold text-[#f04f5f]">{error}</div> : null}
          <div className="grid grid-cols-2 gap-[12px]">
            <ReadOnlyField label="用户名称" value={user.userName} />
            <ReadOnlyField label="账户类型" value={`${accountType.name} / ${accountType.englishName || '-'}`} />
            <ReadOnlyField label="开户来源" value={isOpening ? '后台手动开通' : record.openingSource || '-'} />
            <ReadOnlyField label="是否需要资料" value={accountType.requiresDocuments ? '是' : '否'} />
          </div>

          {isOpening && accountType.requiresDocuments && manualAllowed ? (
            <label className="block rounded-[5px] border border-dashed border-[#c9b2f5] bg-[#faf7ff] p-[14px]">
              <span className="text-[12px] font-semibold text-[#6d43b5]">开户资料 *</span>
              <input
                type="file"
                onChange={(event) => setDocumentName(event.target.files?.[0]?.name || '')}
                className="mt-[10px] block w-full text-[12px] text-[#66677f]"
              />
              {documentName ? <span className="mt-[8px] block text-[12px] font-semibold text-[#20894f]">已选择：{documentName}</span> : null}
            </label>
          ) : null}

          <div className="rounded-[5px] border border-[#e2e4ec] bg-[#fbfbfd] p-[12px]">
            <div className="mb-[12px] text-[13px] font-semibold text-[#20213a]">账户收款信息</div>
            <div className="grid grid-cols-2 gap-[12px]">
              <label className="block">
                <span className="mb-1 block text-[12px] text-[#66677f]">收款人 *</span>
                <input value={beneficiaryName} onChange={(event) => setBeneficiaryName(event.target.value)} className="h-[46px] w-full rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] text-[14px] outline-none focus:border-[#8b4fff]" />
              </label>
              <label className="block">
                <span className="mb-1 block text-[12px] text-[#66677f]">账户号码 *</span>
                <input value={accountNumber} onChange={(event) => setAccountNumber(event.target.value)} className="h-[46px] w-full rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] text-[14px] outline-none focus:border-[#8b4fff]" />
              </label>
              <ReadOnlyField label="银行名称" value={defaults.bankName} />
              <ReadOnlyField label="收款银行" value={defaults.receivingBank} />
              <ReadOnlyField label="SWIFT Code" value={defaults.swiftCode} />
              <ReadOnlyField label="支持币种" value={defaults.currencies} />
              <ReadOnlyField label="银行地址" value={defaults.bankAddress} wide />
            </div>
          </div>

          <div className="rounded-[5px] bg-[#f6f7fb] px-[12px] py-[10px] text-[12px] leading-[20px] text-[#66677f]">
            {accountType.requiresDocuments
              ? '该账户类型需要开户资料，是否允许后台手动开通以账户类型配置为准。'
              : `${accountType.name}无需上传资料，可直接录入账户信息完成后台手动开通。`}
          </div>
        </div>

        <footer className="grid shrink-0 grid-cols-2 gap-[10px] border-t border-[#e5e6ef] p-[14px]">
          <button type="button" onClick={onClose} className="h-[40px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff]">取消</button>
          <button type="button" onClick={submit} className="h-[40px] rounded-[5px] bg-[#8b4fff] text-[13px] font-semibold text-white hover:bg-[#7f42f2]">
            {isOpening ? '确认开通' : '保存账户'}
          </button>
        </footer>
      </section>
    </div>
  )
}

function AccountDetailModal({ user, accountType, record, onClose }) {
  const defaults = getReceivingDefaults(accountType)
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#252236]/55 px-6 py-8">
      <section className="w-[700px] overflow-hidden rounded-[8px] bg-white shadow-[0_18px_48px_rgba(28,29,42,0.28)]">
        <header className="flex h-[64px] items-center justify-between border-b border-[#e5e6ef] px-[22px]">
          <div>
            <h2 className="text-[16px] font-semibold text-[#20213a]">{accountType.name}详情</h2>
            <p className="mt-[3px] text-[11px] font-semibold uppercase text-[#8a8ca0]">{user.userName} / {user.userId}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭" className="rounded-[4px] p-[7px] text-[#66677f] hover:bg-[#f6f7fb]"><X className="h-[16px] w-[16px]" /></button>
        </header>
        <div className="grid max-h-[72vh] grid-cols-2 gap-[12px] overflow-y-auto p-[22px]">
          <ReadOnlyField label="客户名称" value={user.userName} />
          <ReadOnlyField label="用户ID" value={user.userId} />
          <ReadOnlyField label="账户类型" value={`${accountType.name} / ${accountType.englishName || '-'}`} wide />
          <ReadOnlyField label="账户状态" value={record.status} />
          <ReadOnlyField label="开户方式" value={record.openingSource || '-'} />
          <ReadOnlyField label="申请时间" value={record.appliedAt || '-'} />
          <ReadOnlyField label="开户时间" value={record.approvedAt || record.openedAt || '-'} />
          <ReadOnlyField label="账户号码" value={record.accountNumber || '-'} />
          <ReadOnlyField label="收款人" value={record.beneficiaryName || '-'} />
          <ReadOnlyField label="开户费扣费状态" value={getFeeStatus(record, accountType)} />
          <ReadOnlyField label="支持币种" value={defaults.currencies} />
          <ReadOnlyField label="银行名称" value={defaults.bankName} />
          <ReadOnlyField label="SWIFT Code" value={defaults.swiftCode} />
          <ReadOnlyField label="银行地址" value={defaults.bankAddress} wide />
        </div>
      </section>
    </div>
  )
}

function AccountApplicationModal({ user, accountType, record, onClose }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#252236]/55 px-6 py-8">
      <section className="w-[620px] overflow-hidden rounded-[8px] bg-white shadow-[0_18px_48px_rgba(28,29,42,0.28)]">
        <header className="flex h-[64px] items-center justify-between border-b border-[#e5e6ef] px-[22px]">
          <div>
            <h2 className="text-[16px] font-semibold text-[#20213a]">{accountType.name}申请</h2>
            <p className="mt-[3px] text-[11px] font-semibold uppercase text-[#8a8ca0]">{accountType.englishName || accountType.code}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭" className="rounded-[4px] p-[7px] text-[#66677f] hover:bg-[#f6f7fb]"><X className="h-[16px] w-[16px]" /></button>
        </header>
        <div className="grid grid-cols-2 gap-[12px] p-[22px]">
          <ReadOnlyField label="申请用户" value={`${user.userName} / ${user.userId}`} wide />
          <ReadOnlyField label="申请状态" value={record.status} />
          <ReadOnlyField label="申请时间" value={record.appliedAt || '-'} />
          <ReadOnlyField label="开户方式" value={record.openingSource || '客户申请'} />
          <ReadOnlyField label="开户费扣费状态" value={getFeeStatus(record, accountType)} />
          {record.status === '已拒绝' ? (
            <div className="col-span-2 rounded-[5px] border border-[#ffd0d5] bg-[#fff4f5] px-[12px] py-[11px]">
              <div className="text-[12px] text-[#9a2732]">拒绝原因</div>
              <div className="mt-[6px] text-[13px] font-semibold leading-[20px] text-[#f04f5f]">{record.rejectReason || '未填写拒绝原因'}</div>
            </div>
          ) : null}
        </div>
        <footer className="border-t border-[#e5e6ef] p-[14px] text-right">
          <button type="button" onClick={onClose} className="h-[38px] rounded-[5px] bg-[#8b4fff] px-[24px] text-[13px] font-semibold text-white">关闭</button>
        </footer>
      </section>
    </div>
  )
}

function SelectedAccountInfo({ record }) {
  if (record.status === '已开通') {
    return (
      <div className="text-[12px] leading-[20px] text-[#66677f]">
        <div>账户号码：<span className="font-semibold text-[#20213a]">{record.accountNumber || '-'}</span></div>
        <div>收款人：<span className="font-semibold text-[#20213a]">{record.beneficiaryName || '-'}</span></div>
      </div>
    )
  }
  if (record.status === '审核中') {
    return (
      <div className="text-[12px] leading-[20px] text-[#66677f]">
        <div>申请时间</div>
        <div className="font-semibold text-[#20213a]">{record.appliedAt || '-'}</div>
      </div>
    )
  }
  if (record.status === '已拒绝') {
    return <span className="line-clamp-2 text-[12px] font-semibold leading-[19px] text-[#f04f5f]">{record.rejectReason || '申请已拒绝'}</span>
  }
  return <span className="text-[12px] text-[#8a8ca0]">-</span>
}

function UserManagementTable({
  users,
  accountType,
  keyword,
  onView,
  onEdit,
  onViewApplication,
  onManualOpen,
}) {
  const normalizedKeyword = keyword.trim().toLowerCase()
  const rows = users
    .filter((user) => (
      !normalizedKeyword
      || `${user.userName} ${user.userId} ${user.email}`.toLowerCase().includes(normalizedKeyword)
    ))
    .map((user) => ({
      user,
      record: getUserAccountRecord(user, accountType),
    }))

  return (
    <div className="mt-[15px] overflow-x-auto border-t border-[#e5e6ef] pt-[15px]">
      <table className="w-full min-w-[1370px] border-collapse text-left">
        <thead>
          <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
            <th className="w-[250px] px-[18px]">客户信息</th>
            <th className="w-[105px] px-[18px]">申请类型</th>
            <th className="w-[155px] px-[18px]">通过时间</th>
            <th className="w-[105px] px-[18px]">账户状态</th>
            <th className="w-[150px] px-[18px]">当前所选账户状态</th>
            <th className="w-[235px] px-[18px]">当前所选账户信息</th>
            <th className="w-[155px] px-[18px]">最后活动</th>
            <th className="sticky right-0 w-[300px] bg-[#f6f7fb] px-[18px]">操作</th>
          </tr>
        </thead>
        <tbody className="text-[13px] text-[#55556e]">
          {rows.map(({ user, record }) => {
            const manualAllowed = allowsManualOpening(accountType)
            const manualReason = accountType.requiresDocuments
              ? '该账户类型需要用户提交开户资料，请通过客户端申请及开户审核流程开通。'
              : '该账户类型当前不允许后台手动开通。'
            return (
              <tr key={user.id} className="min-h-[92px] border-b border-[#e7e8ef] bg-white align-middle">
                <td className="px-[18px] py-[14px]">
                  <div className="flex items-center gap-[13px]">
                    <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#eeeeef] text-[12px] font-semibold text-[#4b4b62]">
                      {(user.userName || user.userId || 'U').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="leading-[1.6]">
                      <div className="text-[14px] font-semibold text-[#2b2940]">{user.userName}</div>
                      <div>ID: {user.userId}</div>
                      <div>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-[18px] py-[14px]"><span className="inline-flex items-center gap-[6px]"><FileText className="h-[14px] w-[14px]" />{user.customerType || '个人'}</span></td>
                <td className="px-[18px] py-[14px]">{user.createdAt || user.registeredAt || '-'}</td>
                <td className="px-[18px] py-[14px]"><StatusBadge tone={user.userStatus === '正常' ? 'green' : 'orange'}>{user.userStatus || '正常'}</StatusBadge></td>
                <td className="px-[18px] py-[14px]"><StatusBadge tone={accountStatusTone(record.status)}>{record.status}</StatusBadge></td>
                <td className="px-[18px] py-[14px]"><SelectedAccountInfo record={record} /></td>
                <td className="px-[18px] py-[14px]">{record.updatedAt || user.updatedAt || '-'}</td>
                <td className="sticky right-0 bg-white px-[18px] py-[14px]">
                  <div className="flex flex-wrap items-center gap-[7px]">
                    <ActionButton icon={Eye} onClick={() => onView(user, record)}>查看</ActionButton>
                    {record.status === '已开通' ? (
                      <ActionButton icon={Pencil} onClick={() => onEdit(user, record)}>编辑{accountType.name}</ActionButton>
                    ) : null}
                    {record.status === '审核中' || record.status === '已拒绝' ? (
                      <ActionButton icon={FileText} onClick={() => onViewApplication(user, record)}>查看申请</ActionButton>
                    ) : null}
                    {record.status === '未开通' ? (
                      <ActionButton
                        icon={Plus}
                        disabled={!manualAllowed}
                        title={!manualAllowed ? manualReason : ''}
                        onClick={() => onManualOpen(user, record)}
                      >
                        手动开通{accountType.name}
                      </ActionButton>
                    ) : null}
                  </div>
                </td>
              </tr>
            )
          })}
          {!rows.length ? (
            <tr>
              <td colSpan={8} className="h-[110px] text-center text-[13px] text-[#8a8ca0]">暂无符合搜索条件的用户</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}

export function UserManagementPage({
  focusedCustomer,
  users = initialUserAccountConfigs,
  onChangeUsers,
  accountTypes = initialAccountTypeConfigs,
}) {
  const [selectedAccountCode, setSelectedAccountCode] = useState('SG_ACCOUNT')
  const [keyword, setKeyword] = useState('')
  const [editor, setEditor] = useState(null)
  const [detail, setDetail] = useState(null)
  const [application, setApplication] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const managedAccountTypes = useMemo(() => getManagedAccountTypes(accountTypes), [accountTypes])
  const selectedAccountType = managedAccountTypes.find((accountType) => accountType.code === selectedAccountCode)
    || managedAccountTypes[0]
  const reviewingCount = users.filter(
    (user) => getUserAccountRecord(user, selectedAccountType).status === '审核中',
  ).length

  const saveAccount = (user, accountType, currentRecord, patch) => {
    const latestType = accountTypes.find((item) => item.code === accountType.code)
    if (!latestType || latestType.status !== '启用') {
      return { error: '账户类型已禁用或不存在，请刷新后重试。' }
    }
    if (patch.mode === 'open' && !allowsManualOpening(latestType)) {
      return { error: '账户类型配置不允许后台手动开通，请通过客户端申请及开户审核流程处理。' }
    }
    if (!onChangeUsers) return { error: '当前为只读演示数据，无法保存账户信息。' }

    const stamp = getManagementStamp()
    let nextUsers = users.map((item) => {
      if (item.id !== user.id) return item
      const existingRecord = getUserAccountRecord(item, latestType)
      const nextRecord = createJurisdictionAccountRecord(latestType.code, {
        ...existingRecord,
        beneficiaryName: patch.beneficiaryName,
        accountNumber: patch.accountNumber,
        status: '已开通',
        openingSource: patch.mode === 'open' ? '后台手动开通' : existingRecord.openingSource || '后台手动开通',
        approvedAt: existingRecord.approvedAt || stamp,
        feeStatus: patch.mode === 'open' ? '无需扣费（后台手动开通）' : getFeeStatus(existingRecord, latestType),
        updatedAt: stamp,
        updatedBy: '运营管理员',
        documentName: patch.documentName || existingRecord.documentName || '',
      })
      const nextUser = {
        ...item,
        updatedAt: stamp,
        jurisdictionAccounts: [
          ...(item.jurisdictionAccounts || []).filter((account) => account.accountTypeCode !== latestType.code),
          nextRecord,
        ],
      }

      if (latestType.code === 'SG_ACCOUNT') {
        nextUser.singaporeAccount = createSingaporeAccountRecord({
          ...(item.singaporeAccount || {}),
          status: '已开户',
          beneficiaryName: patch.beneficiaryName,
          accountNumber: patch.accountNumber,
          openingSource: nextRecord.openingSource,
          approvedAt: nextRecord.approvedAt,
          updatedAt: stamp,
          updatedBy: '运营管理员',
        })
      }
      return nextUser
    })

    nextUsers = ensureUnopenedDemoUser(nextUsers, latestType)
    onChangeUsers(nextUsers)
    setSuccessMessage(`${user.userName} 的${latestType.name}已更新。`)
    return { ok: true }
  }

  if (focusedCustomer) {
    return (
      <AdminShell>
        <Panel className="px-[18px] py-[22px]">
          <PageTitle title="用户管理详情" subtitle="后台用户管理详情页，用于查看客户已归档资料" />
          <div className="mt-[18px] grid grid-cols-3 gap-[12px]">
            <ReadOnlyField label="客户名称" value={focusedCustomer.name} />
            <ReadOnlyField label="用户ID" value={focusedCustomer.id} />
            <ReadOnlyField label="邮箱地址" value={focusedCustomer.email} />
            <ReadOnlyField label="手机号" value={focusedCustomer.phone} />
            <ReadOnlyField label="客户类型" value={focusedCustomer.type} />
          </div>
        </Panel>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <div className="grid w-[936px] grid-cols-3 gap-[21px]">
        <StatCard title="通过总数" value="89" desc="已通过 KYC 审核" tone="violet" icon={UsersRound} />
        <StatCard title="活跃账户" value="37" desc="用户账户已启用" tone="green" icon={UserCheck} />
        <StatCard title={`${selectedAccountType.name}审核中`} value={reviewingCount} desc="等待开户审核处理" tone="red" icon={Clock3} />
      </div>

      <Panel className="mt-[21px] px-[15px] pb-[18px] pt-[21px]">
        <PageTitle title="用户管理" subtitle="切换账户类型后，列表同步展示对应账户状态、账户信息和操作" />
        {successMessage ? (
          <div className="mt-[14px] flex items-center justify-between rounded-[5px] bg-[#e9f8ee] px-[12px] py-[10px] text-[12px] font-semibold text-[#20894f]">
            <span>{successMessage}</span>
            <button type="button" onClick={() => setSuccessMessage('')} className="hover:underline">关闭</button>
          </div>
        ) : null}

        <div className="mt-[21px] flex items-center justify-between gap-[16px]">
          <label className="flex h-[50px] w-[470px] items-center gap-[10px] rounded-[4px] border border-[#cfd1dc] bg-white px-[14px]">
            <Search className="h-[16px] w-[16px] text-[#20213a]" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索用户名、用户ID或邮箱"
              className="min-w-0 flex-1 text-[13px] outline-none"
            />
          </label>
          <AccountTypeSwitch
            accountTypes={managedAccountTypes}
            value={selectedAccountType.code}
            onChange={(code) => {
              setSelectedAccountCode(code)
              setSuccessMessage('')
            }}
          />
        </div>

        <UserManagementTable
          users={users}
          accountType={selectedAccountType}
          keyword={keyword}
          onView={(user, record) => setDetail({ user, record })}
          onEdit={(user, record) => setEditor({ user, record, mode: 'edit' })}
          onViewApplication={(user, record) => setApplication({ user, record })}
          onManualOpen={(user, record) => setEditor({ user, record, mode: 'open' })}
        />
      </Panel>

      {editor ? (
        <AccountEditorModal
          user={editor.user}
          accountType={selectedAccountType}
          record={editor.record}
          mode={editor.mode}
          onClose={() => setEditor(null)}
          onSave={(patch) => saveAccount(editor.user, selectedAccountType, editor.record, patch)}
        />
      ) : null}
      {detail ? (
        <AccountDetailModal
          user={detail.user}
          accountType={selectedAccountType}
          record={detail.record}
          onClose={() => setDetail(null)}
        />
      ) : null}
      {application ? (
        <AccountApplicationModal
          user={application.user}
          accountType={selectedAccountType}
          record={application.record}
          onClose={() => setApplication(null)}
        />
      ) : null}
    </AdminShell>
  )
}
