import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  Clock3,
  Eye,
  Pencil,
  Search,
  UserRound,
  WalletCards,
  X,
} from 'lucide-react'

import { initialAccountTypeConfigs } from '../data/accountTypeConfig'
import {
  createSingaporeAccountRecord,
  initialUserAccountConfigs,
  singaporeAccountStatusOptions,
} from '../data/userAccountConfig'

const SG_ACCOUNT_CODE = 'SG_ACCOUNT'

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
    orange: 'bg-[#fff1d6] text-[#f39800]',
    violet: 'bg-[#f0e7ff] text-[#8b4fff]',
    green: 'bg-[#e9f8ee] text-[#20a05a]',
    red: 'bg-[#ffe8eb] text-[#f04f5f]',
    gray: 'bg-[#f0f1f6] text-[#5b5c70]',
  }[tone]

  return <span className={`inline-flex whitespace-nowrap rounded-full px-[9px] py-[3px] text-[12px] font-semibold ${className}`}>{children}</span>
}

function ActionButton({ icon: Icon, children, onClick, danger = false, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-[31px] items-center gap-[6px] whitespace-nowrap rounded-[4px] border px-[9px] text-[12px] font-semibold disabled:cursor-not-allowed disabled:border-[#d8dae5] disabled:text-[#a4a6b7] ${
        danger
          ? 'border-[#f04f5f] text-[#f04f5f] hover:bg-[#ffe8eb]'
          : 'border-[#8b4fff] text-[#8b4fff] hover:bg-[#f6f0ff]'
      }`}
    >
      {Icon ? <Icon className="h-[14px] w-[14px]" strokeWidth={1.9} /> : null}
      {children}
    </button>
  )
}

function FormInput({ label, value, onChange, placeholder = '' }) {
  return (
    <label className="block">
      <span className="mb-[-8px] ml-[10px] inline-block bg-white px-[4px] text-[12px] text-[#66677f]">{label}</span>
      <input
        type="text"
        value={value ?? ''}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="h-[50px] w-full rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] text-[14px] text-[#24243d] outline-none focus:border-[#8b4fff]"
      />
    </label>
  )
}

function FormSelect({ label, value, onChange, children }) {
  return (
    <label className="block">
      <span className="mb-[-8px] ml-[10px] inline-block bg-white px-[4px] text-[12px] text-[#66677f]">{label}</span>
      <select
        value={value ?? ''}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-[50px] w-full rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] text-[14px] font-semibold text-[#24243d] outline-none focus:border-[#8b4fff]"
      >
        {children}
      </select>
    </label>
  )
}

function CenterModal({ title, subtitle, children, footer, onClose, width = 'w-[720px]' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#252236]/55 px-[24px] py-[28px]">
      <section className={`${width} flex max-h-[88vh] flex-col overflow-hidden rounded-[8px] bg-white shadow-[0_18px_48px_rgba(28,29,42,0.28)]`}>
        <div className="flex h-[62px] shrink-0 items-center justify-between border-b border-[#e5e6ef] px-[22px]">
          <div>
            <h2 className="text-[16px] font-semibold text-[#20213a]">{title}</h2>
            {subtitle ? <div className="mt-[3px] text-[11px] font-semibold uppercase text-[#8a8ca0]">{subtitle}</div> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-[4px] p-[7px] text-[#66677f] hover:bg-[#f6f7fb]">
            <X className="h-[16px] w-[16px]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-white px-[22px] py-[18px]">{children}</div>
        {footer ? <div className="border-t border-[#e5e6ef] bg-white p-[14px]">{footer}</div> : null}
      </section>
    </div>
  )
}

function formatStamp() {
  const value = new Date()
  const pad = (item) => String(item).padStart(2, '0')

  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}`
}

function singaporeStatusTone(status) {
  if (status === '已开户') return 'green'
  if (status === '审核中') return 'blue'
  if (status === '待处理') return 'orange'
  if (status === '已拒绝') return 'red'
  return 'gray'
}

function singaporeAccountActionLabel(status) {
  if (status === '未开通') return '开通账户'
  if (status === '已开户') return '编辑新加坡账户'
  return '查看申请'
}

function findSingaporeAccountType(accountTypes) {
  return accountTypes.find((item) => item.code === SG_ACCOUNT_CODE)
    || initialAccountTypeConfigs.find((item) => item.code === SG_ACCOUNT_CODE)
}

function shortAccountNumber(accountNumber = '') {
  if (!accountNumber) return ''
  return accountNumber.length > 4 ? accountNumber.slice(-4) : accountNumber
}

function getEffectiveReceivingAccount(singaporeType, userAccount) {
  const defaultAccount = singaporeType?.receivingAccount || {}
  return {
    beneficiaryName: userAccount?.beneficiaryName || defaultAccount.beneficiaryName || '',
    accountNumber: userAccount?.accountNumber || shortAccountNumber(defaultAccount.accountNumber) || '',
    bankName: defaultAccount.bankName || '',
    bankAddress: defaultAccount.bankAddress || '',
    receivingBank: defaultAccount.receivingBank || '',
    swiftCode: defaultAccount.swiftCode || '',
  }
}

function SingaporeAccountEditModal({ user, singaporeType, onClose, onSave }) {
  const userAccount = user?.singaporeAccount || createSingaporeAccountRecord()
  const defaultAccount = singaporeType?.receivingAccount || {}
  const supportedCurrencies = singaporeType?.currencies?.map((currency) => currency.code).join(' / ') || 'USD / CNY / SGD / AED / JPY'
  const [form, setForm] = useState({
    beneficiaryName: userAccount.beneficiaryName || '',
    accountNumber: userAccount.accountNumber || '',
  })
  const [error, setError] = useState('')

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  const submit = () => {
    if (!form.beneficiaryName.trim() || !form.accountNumber.trim()) {
      setError('请填写收款人名称和账户号码。')
      return
    }
    onSave({
      beneficiaryName: form.beneficiaryName.trim(),
      accountNumber: form.accountNumber.trim(),
    })
  }

  return (
    <CenterModal
      title="编辑新加坡账户"
      subtitle={`${user?.userName || '-'} / ${user?.userId || '-'}`}
      width="w-[760px]"
      onClose={onClose}
      footer={(
        <div className="grid grid-cols-2 gap-[10px]">
          <button type="button" onClick={onClose} className="h-[40px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">取消</button>
          <button type="button" onClick={submit} className="h-[40px] rounded-[5px] bg-[#8b4fff] text-[13px] font-semibold text-white hover:bg-[#7f42f2]">保存</button>
        </div>
      )}
    >
      <div className="space-y-[16px]">
        {error ? <div className="rounded-[5px] bg-[#ffe8eb] px-[12px] py-[10px] text-[12px] font-semibold text-[#f04f5f]">{error}</div> : null}
        <div className="grid grid-cols-2 gap-[14px]">
          <FormInput label="收款人名称 *" value={form.beneficiaryName} onChange={(value) => updateField('beneficiaryName', value)} placeholder={defaultAccount.beneficiaryName || '请输入客户名称'} />
          <FormInput label="账户号码 *" value={form.accountNumber} onChange={(value) => updateField('accountNumber', value)} placeholder={shortAccountNumber(defaultAccount.accountNumber) || '请输入账户号码'} />
        </div>
        <div className="rounded-[5px] border border-[#e2e4ec] bg-[#fbfbfd] p-[12px]">
          <div className="mb-[10px] text-[13px] font-semibold text-[#20213a]">不可编辑信息</div>
          <div className="grid grid-cols-2 gap-[10px]">
            {[
              ['银行名称', defaultAccount.bankName],
              ['银行地址', defaultAccount.bankAddress],
              ['收款银行', defaultAccount.receivingBank],
              ['SWIFT Code', defaultAccount.swiftCode],
              ['支持币种', supportedCurrencies],
            ].map(([label, value]) => (
              <div key={label} className={`${label === '银行地址' || label === '支持币种' ? 'col-span-2' : ''} rounded-[5px] border border-[#e2e4ec] bg-white px-[11px] py-[9px]`}>
                <div className="text-[12px] text-[#66677f]">{label}</div>
                <div className="mt-[6px] break-words text-[13px] font-semibold text-[#20213a]">{value || '-'}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[5px] bg-[#fff1d6] px-[12px] py-[10px] text-[12px] font-semibold leading-[20px] text-[#9a6500]">
          当前版本仅允许运营维护该用户的新加坡账户收款人名称和账户号码；其他银行信息读取系统默认配置。
        </div>
      </div>
    </CenterModal>
  )
}

function SingaporeAccountDetail({ user, singaporeType, onBack, onEdit }) {
  const userAccount = user?.singaporeAccount || createSingaporeAccountRecord()
  const receivingAccount = getEffectiveReceivingAccount(singaporeType, userAccount)
  const isConfigured = Boolean(userAccount.beneficiaryName && userAccount.accountNumber)
  const canMaintainAccount = ['未开通', '已开户'].includes(userAccount.status)
  const userInitials = (user.userName || user.userId || 'U').slice(0, 2).toUpperCase()
  const accountOverviewRows = [
    ['账户类型', '新加坡账户'],
    ['账户状态', userAccount.status || '-'],
    ['账户号码', receivingAccount.accountNumber || '-'],
    ['收款人', receivingAccount.beneficiaryName || '-'],
    ['开户完成时间', userAccount.approvedAt || '-'],
    ['信息来源', isConfigured ? '运营配置' : '系统默认模板'],
  ]
  const receivingRows = [
    ['收款人', receivingAccount.beneficiaryName],
    ['账户号码', receivingAccount.accountNumber],
    ['银行名称', receivingAccount.bankName],
    ['收款银行', receivingAccount.receivingBank],
    ['SWIFT Code', receivingAccount.swiftCode],
    ['银行地址', receivingAccount.bankAddress],
  ]

  return (
    <AdminShell>
      <Panel className="px-[18px] py-[22px]">
        <div className="flex items-center justify-between gap-[20px]">
          <div>
            <button type="button" onClick={onBack} className="mb-[12px] inline-flex items-center gap-[6px] text-[12px] font-semibold text-[#8b4fff] hover:underline">
              <ArrowLeft className="h-[14px] w-[14px]" />
              返回用户新加坡账户列表
            </button>
            <PageTitle
              title={`${user.userName} - 新加坡账户配置`}
              subtitle="当前版本只维护该用户的新加坡实际账户信息。"
            />
          </div>
          <div className="flex items-center gap-[8px]">
            <ActionButton icon={Pencil} onClick={onEdit} disabled={!canMaintainAccount}>{singaporeAccountActionLabel(userAccount.status)}</ActionButton>
          </div>
        </div>
      </Panel>

      <div className="mt-[21px] grid grid-cols-[320px_1fr] gap-[18px]">
        <Panel className="p-[18px]">
          <div className="flex flex-col items-center pb-[18px]">
            <div className="flex h-[88px] w-[88px] items-center justify-center rounded-[5px] bg-[#d9c5ff] text-[26px] font-bold text-[#8b4fff]">{userInitials}</div>
            <div className="mt-[14px] text-center text-[16px] font-semibold text-[#20213a]">{user.userName}</div>
            <StatusBadge tone="gray">{user.userStatus}</StatusBadge>
          </div>
          <div className="space-y-[14px] border-t border-[#e5e6ef] pt-[16px] text-[13px] text-[#55556e]">
            <div className="flex gap-[12px]">
              <WalletCards className="h-[18px] w-[18px] text-[#8b4fff]" />
              <div>
                <div className="font-semibold text-[#20213a]">新加坡账户</div>
                <div className="text-[12px]">账户类型</div>
              </div>
            </div>
            <div className="flex gap-[12px]">
              <UserRound className="h-[18px] w-[18px] text-[#8b4fff]" />
              <div>
                <div className="font-semibold text-[#20213a]">{user.userId}</div>
                <div className="text-[12px]">用户 ID</div>
              </div>
            </div>
            <div className="flex gap-[12px]">
              <CalendarDays className="h-[18px] w-[18px] text-[#8b4fff]" />
              <div>
                <div className="font-semibold text-[#20213a]">{user.registeredAt || '-'}</div>
                <div className="text-[12px]">注册时间</div>
              </div>
            </div>
          </div>
          <button type="button" className="mt-[18px] flex h-[36px] w-full items-center justify-center gap-[7px] rounded-[5px] border border-[#8b4fff] text-[12px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">
            <Eye className="h-[14px] w-[14px]" />
            查看客户完整资料
          </button>
        </Panel>

        <Panel className="overflow-hidden">
          <div className="border-b border-[#e5e6ef] bg-[#fbfbfd] px-[18px] py-[18px]">
            <div className="flex items-center justify-between gap-[16px]">
              <div className="flex items-center gap-[10px] text-[16px] font-semibold text-[#20213a]">
                <WalletCards className="h-[18px] w-[18px] text-[#8b4fff]" />
                新加坡账户概览
              </div>
              <StatusBadge tone={singaporeStatusTone(userAccount.status)}>{userAccount.status}</StatusBadge>
            </div>
            <div className="mt-[18px] grid grid-cols-3 border border-[#e2e4ec] bg-white">
              {accountOverviewRows.map(([label, value], index) => (
                <div key={label} className={`px-[14px] py-[13px] ${index > 2 ? 'border-t border-[#e5e6ef]' : ''} ${(index + 1) % 3 === 0 ? '' : 'border-r border-[#e5e6ef]'}`}>
                  <div className="text-[12px] text-[#66677f]">{label}</div>
                  <div className="mt-[7px] break-words text-[14px] font-semibold text-[#20213a]">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-[18px] p-[18px]">
            <div>
              <div className="mb-[12px] flex items-center justify-between gap-[12px]">
                <div className="flex items-center gap-[8px] text-[14px] font-semibold text-[#20213a]">
                  <Banknote className="h-[17px] w-[17px] text-[#8b4fff]" />
                  收款信息
                </div>
                <span className="text-[12px] text-[#8a8ca0]">收款人和账户号码支持用户级配置，其他银行信息读取系统默认配置。</span>
              </div>
              <div className="rounded-[5px] border border-[#e2e4ec]">
                {receivingRows.map(([label, value], index) => (
                  <div key={label} className={`grid grid-cols-[112px_1fr] gap-[14px] px-[12px] py-[11px] text-[13px] ${index === receivingRows.length - 1 ? '' : 'border-b border-[#e5e6ef]'}`}>
                    <div className="text-[#66677f]">{label}</div>
                    <div className="break-words font-semibold text-[#20213a]">{value || '-'}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Panel>
      </div>

    </AdminShell>
  )
}

export function UserAccountConfigPage({
  users = initialUserAccountConfigs,
  onChangeUsers,
  accountTypes = initialAccountTypeConfigs,
  initialSelectedUserId = null,
}) {
  const [localUsers, setLocalUsers] = useState(initialUserAccountConfigs)
  const sourceUsers = onChangeUsers ? users : localUsers
  const commitUsers = onChangeUsers || setLocalUsers
  const singaporeType = useMemo(() => findSingaporeAccountType(accountTypes), [accountTypes])
  const [filters, setFilters] = useState({ keyword: '', status: '' })
  const [selectedUserId, setSelectedUserId] = useState(initialSelectedUserId)
  const [editingUserId, setEditingUserId] = useState('')
  const selectedUser = sourceUsers.find((user) => user.id === selectedUserId) || null
  const editingUser = sourceUsers.find((user) => user.id === editingUserId) || null

  const filteredUsers = useMemo(() => sourceUsers.filter((user) => {
    const keyword = filters.keyword.trim().toLowerCase()
    const sgAccount = user.singaporeAccount || createSingaporeAccountRecord()
    const keywordMatched = !keyword
      || user.userName.toLowerCase().includes(keyword)
      || user.userId.toLowerCase().includes(keyword)
      || sgAccount.beneficiaryName.toLowerCase().includes(keyword)
      || sgAccount.accountNumber.toLowerCase().includes(keyword)
    const statusMatched = !filters.status || sgAccount.status === filters.status

    return keywordMatched && statusMatched
  }), [filters, sourceUsers])

  const updateUserSingaporeAccount = (userId, patch) => {
    const nextStamp = formatStamp()
    commitUsers(sourceUsers.map((user) => {
      if (user.id !== userId) return user
      const currentAccount = user.singaporeAccount || createSingaporeAccountRecord()

      return {
        ...user,
        updatedAt: nextStamp,
        singaporeAccount: {
          ...currentAccount,
          ...patch,
          status: '已开户',
          approvedAt: currentAccount.approvedAt || nextStamp,
          updatedAt: nextStamp,
          updatedBy: '运营管理员',
        },
      }
    }))
  }

  if (selectedUser) {
    return (
      <>
        <SingaporeAccountDetail
          user={selectedUser}
          singaporeType={singaporeType}
          onBack={() => setSelectedUserId(null)}
          onEdit={() => setEditingUserId(selectedUser.id)}
        />
        {editingUser ? (
          <SingaporeAccountEditModal
            user={editingUser}
            singaporeType={singaporeType}
            onClose={() => setEditingUserId('')}
            onSave={(patch) => {
              updateUserSingaporeAccount(editingUser.id, patch)
              setEditingUserId('')
            }}
          />
        ) : null}
      </>
    )
  }

  return (
    <AdminShell>
      <Panel className="px-[18px] py-[22px]">
        <div className="flex items-center justify-between gap-[20px]">
          <PageTitle
            title="用户新加坡账户配置"
            subtitle="当前版本只维护用户的新加坡实际账户信息：收款人名称和账户号码。"
          />
        </div>
      </Panel>

      <Panel className="mt-[21px] px-[15px] py-[18px]">
        <div className="flex items-center justify-between">
          <div className="text-[16px] font-semibold text-[#20213a]">筛选条件</div>
          <span className="text-[12px] text-[#8a8ca0]">支持按用户、账户状态、收款人或账户号码查询。</span>
        </div>
        <div className="mt-[15px] flex items-center gap-[10px]">
          <label className="flex h-[50px] min-w-0 flex-1 items-center gap-[11px] rounded-[4px] border border-[#cfd1dc] bg-white px-[15px] text-[13px] text-[#9a9cab]">
            <Search className="h-[16px] w-[16px] text-[#20213a]" strokeWidth={1.8} />
            <input value={filters.keyword} onChange={(event) => setFilters((current) => ({ ...current, keyword: event.target.value }))} className="h-full flex-1 bg-transparent outline-none" placeholder="用户名称、用户ID、收款人、账户号码" />
          </label>
          <div className="w-[200px] shrink-0">
            <FormSelect label="账户状态" value={filters.status} onChange={(value) => setFilters((current) => ({ ...current, status: value }))}>
              <option value="">全部</option>
              {singaporeAccountStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </FormSelect>
          </div>
          <div className="flex w-[156px] shrink-0 items-center justify-end">
            <ActionButton icon={Clock3} onClick={() => setFilters({ keyword: '', status: '' })}>重置</ActionButton>
          </div>
        </div>
      </Panel>

      <Panel className="mt-[21px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full border-collapse text-left text-[13px] text-[#55556e]">
            <thead>
              <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
                {['用户名称', '用户ID', '新加坡账户状态', '收款人', '账户号码', '更新时间', '操作'].map((item) => (
                  <th key={item} className="whitespace-nowrap px-[14px]">{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const sgAccount = user.singaporeAccount || createSingaporeAccountRecord()
                const effectiveReceivingAccount = getEffectiveReceivingAccount(singaporeType, sgAccount)

                return (
                  <tr key={user.id} className="h-[74px] cursor-pointer border-b border-[#e7e8ef] bg-white hover:bg-[#fbfbfd]" onClick={() => setSelectedUserId(user.id)}>
                    <td className="whitespace-nowrap px-[14px] font-semibold text-[#20213a]">{user.userName}</td>
                    <td className="whitespace-nowrap px-[14px] font-mono font-semibold text-[#237be8]">{user.userId}</td>
                    <td className="whitespace-nowrap px-[14px]"><StatusBadge tone={singaporeStatusTone(sgAccount.status)}>{sgAccount.status}</StatusBadge></td>
                    <td className="whitespace-nowrap px-[14px]">{effectiveReceivingAccount.beneficiaryName || '-'}</td>
                    <td className="whitespace-nowrap px-[14px] font-mono font-semibold text-[#20213a]">{effectiveReceivingAccount.accountNumber || '-'}</td>
                    <td className="whitespace-nowrap px-[14px]">{sgAccount.updatedAt || user.updatedAt || '-'}</td>
                    <td className="px-[14px]" onClick={(event) => event.stopPropagation()}>
                      <div className="flex flex-wrap gap-[8px]">
                        <ActionButton icon={Eye} onClick={() => setSelectedUserId(user.id)}>查看</ActionButton>
                        <ActionButton icon={Pencil} disabled={!['未开通', '已开户'].includes(sgAccount.status)} onClick={() => setEditingUserId(user.id)}>编辑</ActionButton>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!filteredUsers.length ? (
                <tr>
                  <td colSpan={7} className="px-[18px] py-[36px] text-center text-[13px] text-[#8a8ca0]">暂无符合条件的用户新加坡账户配置</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#e5e6ef] px-[18px] py-[14px] text-[13px] text-[#66677f]">
          共 {filteredUsers.length} 个用户。用户维度只维护新加坡账户收款人名称和账户号码，其他银行信息读取系统默认配置。
        </div>
      </Panel>

      {editingUser ? (
        <SingaporeAccountEditModal
          user={editingUser}
          singaporeType={singaporeType}
          onClose={() => setEditingUserId('')}
          onSave={(patch) => {
            updateUserSingaporeAccount(editingUser.id, patch)
            setEditingUserId('')
          }}
        />
      ) : null}
    </AdminShell>
  )
}
