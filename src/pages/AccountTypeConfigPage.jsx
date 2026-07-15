import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Pencil,
  Plus,
  Search,
  WalletCards,
  X,
  XCircle,
} from 'lucide-react'

import {
  accountTypeCurrencyOptions,
  accountTypeStatusOptions,
  bankFieldLabels,
  createBankRecord,
  createIntermediaryBank,
  createReceivingAccount,
  initialAccountTypeConfigs,
  intermediaryBankFieldLabels,
} from '../data/accountTypeConfig'

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

function PrimaryButton({ icon: Icon, children, onClick }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex h-[36px] items-center gap-[8px] rounded-[5px] bg-[#8b4fff] px-[16px] text-[13px] font-semibold text-white shadow-sm hover:bg-[#7f42f2]">
      {Icon ? <Icon className="h-[15px] w-[15px]" strokeWidth={2} /> : null}
      {children}
    </button>
  )
}

function FormInput({ label, value, onChange, placeholder = '', type = 'text', readOnly = false }) {
  return (
    <label className="block">
      <span className="mb-[-8px] ml-[10px] inline-block bg-white px-[4px] text-[12px] text-[#66677f]">{label}</span>
      <input
        type={type}
        value={value ?? ''}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`h-[50px] w-full rounded-[5px] border px-[12px] text-[14px] outline-none ${
          readOnly
            ? 'border-[#d8dae4] bg-[#eef0f4] font-semibold text-[#66677f]'
            : 'border-[#cfd1dc] bg-white text-[#24243d] focus:border-[#8b4fff]'
        }`}
      />
    </label>
  )
}

function FormTextarea({ label, value, onChange, placeholder = '' }) {
  return (
    <label className="block">
      <span className="mb-[-8px] ml-[10px] inline-block bg-white px-[4px] text-[12px] text-[#66677f]">{label}</span>
      <textarea
        value={value ?? ''}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] py-[12px] text-[14px] text-[#24243d] outline-none focus:border-[#8b4fff]"
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

function ModalSection({ title, children }) {
  return (
    <section className="rounded-[5px] border border-[#e2e4ec] bg-white p-[13px]">
      <div className="mb-[12px] text-[13px] font-semibold text-[#20213a]">{title}</div>
      {children}
    </section>
  )
}

function CenterModal({ title, subtitle, children, footer, onClose, width = 'w-[920px]' }) {
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

function currencyName(code) {
  return accountTypeCurrencyOptions.find((currency) => currency.code === code)?.name || code
}

function createEmptyAccountType() {
  return {
    id: '',
    name: '',
    englishName: '',
    code: '',
    status: '启用',
    isDefault: false,
    allowDeposit: true,
    allowWithdraw: true,
    allowInternalTransfer: true,
    displayOrder: 1,
    updatedAt: '',
    updatedBy: '',
    receivingAccount: createReceivingAccount(),
    currencies: [],
  }
}

function createCurrencyConfig(account, currencyCode) {
  return {
    code: currencyCode,
    name: currencyName(currencyCode),
    enabled: true,
    allowDeposit: true,
    allowWithdraw: true,
    allowInternalTransfer: true,
    displayOrder: (account?.currencies?.length || 0) + 1,
    showInDeposit: true,
    banks: [createBankRecord({ enabled: false })],
  }
}

function CurrencyTags({ currencies = [] }) {
  return (
    <div className="flex flex-wrap gap-[6px]">
      {currencies.map((currency) => (
        <span key={currency.code} className={`inline-flex h-[26px] items-center rounded-full px-[9px] text-[12px] font-semibold ${currency.enabled ? 'bg-[#e7f5ff] text-[#237be8]' : 'bg-[#f0f1f6] text-[#8a8ca0]'}`}>
          {currency.code}
        </span>
      ))}
    </div>
  )
}

function InfoItem({ label, value, wide = false }) {
  return (
    <div className={`${wide ? 'col-span-3' : ''} min-h-[64px] rounded-[5px] border border-[#e2e4ec] bg-[#fbfbfd] px-[12px] py-[10px]`}>
      <div className="text-[12px] text-[#66677f]">{label}</div>
      <div className="mt-[7px] break-words text-[13px] font-semibold text-[#20213a]">{value || '-'}</div>
    </div>
  )
}

function AccountTypeModal({ initialValue, configs, onClose, onSave }) {
  const [form, setForm] = useState(initialValue || createEmptyAccountType())
  const [error, setError] = useState('')
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false)
  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }
  const toggleCurrencySelection = (currencyOption) => {
    setForm((current) => {
      const exists = current.currencies.some((currency) => currency.code === currencyOption.code)
      const nextCurrencies = exists
        ? current.currencies.filter((currency) => currency.code !== currencyOption.code)
        : [
            ...current.currencies,
            createCurrencyConfig(current, currencyOption.code),
          ]

      return {
        ...current,
        currencies: nextCurrencies.map((currency, index) => ({
          ...currency,
          displayOrder: index + 1,
        })),
      }
    })
    setError('')
  }

  const submit = () => {
    const normalizedCode = form.code.trim().toUpperCase()
    if (!form.name.trim() || !form.englishName.trim() || !normalizedCode) {
      setError('请填写账户类型名称、英文名称和账户类型代码。')
      return
    }

    if (configs.some((item) => item.code === normalizedCode && item.id !== form.id)) {
      setError('账户类型代码不允许重复。')
      return
    }

    onSave?.({
      ...form,
      id: form.id || `acct-${normalizedCode.toLowerCase()}-${Date.now()}`,
      code: normalizedCode,
      displayOrder: Number(form.displayOrder || 0),
      currencies: [...form.currencies].sort((left, right) => Number(left.displayOrder || 0) - Number(right.displayOrder || 0)),
      updatedAt: formatStamp(),
      updatedBy: '运营管理员',
    })
  }

  return (
    <CenterModal
      title={form.id ? '编辑账户类型' : '新增账户类型'}
      subtitle="维护账户类型基础信息、状态与支持币种"
      width="w-[980px]"
      onClose={onClose}
      footer={(
        <div className="grid grid-cols-2 gap-[10px]">
          <button type="button" onClick={onClose} className="h-[40px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">取消</button>
          <button type="button" onClick={submit} className="h-[40px] rounded-[5px] bg-[#8b4fff] text-[13px] font-semibold text-white hover:bg-[#7f42f2]">保存配置</button>
        </div>
      )}
    >
      <div className="space-y-[16px]">
        {error ? <div className="rounded-[5px] bg-[#ffe8eb] px-[12px] py-[10px] text-[12px] font-semibold text-[#f04f5f]">{error}</div> : null}
        <ModalSection title="基础信息">
          <div className="grid grid-cols-2 gap-[13px]">
            <FormInput label="账户类型名称 *" value={form.name} onChange={(value) => updateField('name', value)} placeholder="例如：香港账户" />
            <FormInput label="账户类型英文名称 *" value={form.englishName} onChange={(value) => updateField('englishName', value)} placeholder="例如：Hong Kong Account" />
            <FormInput label="账户类型代码 *" value={form.code} onChange={(value) => updateField('code', value)} placeholder="例如：HK_ACCOUNT" />
            <FormInput label="展示排序 *" type="number" value={form.displayOrder} onChange={(value) => updateField('displayOrder', value)} />
            <FormSelect label="状态 *" value={form.status} onChange={(value) => updateField('status', value)}>
              {accountTypeStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </FormSelect>
          </div>
        </ModalSection>
        <ModalSection title="支持币种">
          <div className="mb-[12px] flex flex-wrap gap-[8px]">
            {form.currencies.length ? form.currencies.map((currency) => (
              <span key={currency.code} className="inline-flex h-[28px] items-center rounded-full bg-[#e7f5ff] px-[10px] font-mono text-[12px] font-bold text-[#237be8]">
                {currency.code}
              </span>
            )) : <span className="text-[12px] font-semibold text-[#8a8ca0]">暂未选择支持币种</span>}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setCurrencyDropdownOpen((current) => !current)}
              className="flex h-[50px] w-full items-center justify-between rounded-[5px] border border-[#cfd1dc] bg-white px-[13px] text-left text-[13px] font-semibold text-[#24243d]"
            >
              <span>{form.currencies.length ? form.currencies.map((currency) => currency.code).join(' / ') : '请选择后台启用的法币'}</span>
              <ChevronDown className={`h-[17px] w-[17px] text-[#66677f] transition ${currencyDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {currencyDropdownOpen ? (
              <div className="absolute left-0 right-0 top-[56px] z-10 rounded-[5px] border border-[#d9dbe6] bg-white p-[8px] shadow-[0_12px_24px_rgba(28,29,42,0.14)]">
                <div className="mb-[8px] px-[4px] text-[12px] font-semibold text-[#8a8ca0]">下拉内容展示后台启用的法币</div>
                <div className="grid grid-cols-2 gap-[8px]">
                  {accountTypeCurrencyOptions.map((currency) => {
                    const selected = form.currencies.some((item) => item.code === currency.code)

                    return (
                      <button
                        key={currency.code}
                        type="button"
                        onClick={() => toggleCurrencySelection(currency)}
                        className={`flex h-[38px] items-center justify-between rounded-[4px] px-[10px] text-left text-[13px] font-semibold ${
                          selected
                            ? 'bg-[#f6f0ff] text-[#8b4fff]'
                            : 'bg-[#fbfbfd] text-[#24243d] hover:bg-[#f6f0ff]'
                        }`}
                      >
                        <span>
                          <span className="font-mono">{currency.code}</span>
                          <span className="ml-[6px] text-[12px] font-medium text-[#66677f]">{currency.name}</span>
                        </span>
                        <span className={`flex h-[16px] w-[16px] items-center justify-center rounded-[3px] border ${selected ? 'border-[#8b4fff] bg-[#8b4fff]' : 'border-[#b8bbc9]'}`}>
                          {selected ? <CheckCircle2 className="h-[12px] w-[12px] text-white" strokeWidth={3} /> : null}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
          <div className="mt-[12px] rounded-[5px] bg-[#f6f7fb] px-[12px] py-[10px] text-[12px] font-semibold leading-[20px] text-[#66677f]">
            此处只选择账户类型支持哪些币种；每个币种的入金、出金、资金互转能力仍在账户详情页单独配置。
          </div>
        </ModalSection>
      </div>
    </CenterModal>
  )
}

function BankEditModal({ account, currency, onClose, onSave }) {
  const initialBank = currency?.banks?.[0] || createBankRecord()
  const initialIntermediaryBank = currency?.intermediaryBank || createIntermediaryBank()
  const [form, setForm] = useState({
    ...createBankRecord(),
    ...initialBank,
    isDefault: initialBank.isDefault !== false,
    enabled: initialBank.enabled !== false,
  })
  const [intermediaryForm, setIntermediaryForm] = useState({
    ...createIntermediaryBank(),
    ...initialIntermediaryBank,
  })

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }
  const updateIntermediaryField = (field, value) => {
    setIntermediaryForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <CenterModal
      title="编辑收款银行"
      subtitle={`${account?.name || '-'} / ${currency?.code || '-'}`}
      width="w-[1080px]"
      onClose={onClose}
      footer={(
        <div className="grid grid-cols-2 gap-[10px]">
          <button type="button" onClick={onClose} className="h-[40px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">取消</button>
          <button type="button" onClick={() => onSave({ bank: form, intermediaryBank: intermediaryForm })} className="h-[40px] rounded-[5px] bg-[#8b4fff] text-[13px] font-semibold text-white hover:bg-[#7f42f2]">保存收款银行</button>
        </div>
      )}
    >
      <div className="space-y-[16px]">
        <ModalSection title="收款银行信息">
          <div className="grid grid-cols-3 gap-[14px]">
            {bankFieldLabels.map(([field, label]) => (
              field === 'bankAddress' || field === 'remark'
                ? <FormTextarea key={field} label={label} value={form[field]} onChange={(value) => updateField(field, value)} />
                : <FormInput key={field} label={label} value={form[field]} onChange={(value) => updateField(field, value)} />
            ))}
          </div>
        </ModalSection>
        <ModalSection title="中转银行信息">
          <div className="grid grid-cols-3 gap-[14px]">
            {intermediaryBankFieldLabels.map(([field, label]) => (
              field === 'remark'
                ? <FormTextarea key={field} label={label} value={intermediaryForm[field]} onChange={(value) => updateIntermediaryField(field, value)} />
                : <FormInput key={field} label={label} value={intermediaryForm[field]} onChange={(value) => updateIntermediaryField(field, value)} />
            ))}
          </div>
        </ModalSection>
      </div>
    </CenterModal>
  )
}

export function AccountTypeConfigPage({
  configs = initialAccountTypeConfigs,
  onChangeConfigs,
}) {
  const [localConfigs, setLocalConfigs] = useState(initialAccountTypeConfigs)
  const sourceConfigs = onChangeConfigs ? configs : localConfigs
  const commitConfigs = (nextConfigs) => {
    if (onChangeConfigs) {
      onChangeConfigs(nextConfigs)
      return
    }
    setLocalConfigs(nextConfigs)
  }

  const [filters, setFilters] = useState({ keyword: '', currency: '', status: '' })
  const [selectedId, setSelectedId] = useState(null)
  const [bankConfigId, setBankConfigId] = useState(null)
  const [accountModal, setAccountModal] = useState(null)
  const [bankEditModal, setBankEditModal] = useState(null)
  const [expandedCurrency, setExpandedCurrency] = useState('')

  const selectedAccount = sourceConfigs.find((item) => item.id === selectedId) || null
  const bankConfigAccount = sourceConfigs.find((item) => item.id === bankConfigId) || null
  const sortedConfigs = useMemo(() => [...sourceConfigs].sort((left, right) => Number(left.displayOrder || 0) - Number(right.displayOrder || 0)), [sourceConfigs])
  const filteredConfigs = useMemo(() => sortedConfigs.filter((item) => {
    const keyword = filters.keyword.trim().toLowerCase()
    const keywordMatched = !keyword
      || item.name.toLowerCase().includes(keyword)
      || item.englishName.toLowerCase().includes(keyword)
      || item.code.toLowerCase().includes(keyword)
    const currencyMatched = !filters.currency || item.currencies.some((currency) => currency.code === filters.currency)
    const statusMatched = !filters.status || item.status === filters.status

    return keywordMatched && currencyMatched && statusMatched
  }), [filters, sortedConfigs])

  const upsertAccount = (nextAccount) => {
    const exists = sourceConfigs.some((item) => item.id === nextAccount.id)
    const nextConfigs = exists
      ? sourceConfigs.map((item) => (item.id === nextAccount.id ? nextAccount : item))
      : [...sourceConfigs, nextAccount]
    commitConfigs(nextConfigs)
    setAccountModal(null)
    if (!selectedId) setSelectedId(nextAccount.id)
  }

  const updateAccountById = (accountId, updater) => {
    const targetAccount = sourceConfigs.find((item) => item.id === accountId)
    if (!targetAccount) return
    const nextAccount = {
      ...updater(targetAccount),
      updatedAt: formatStamp(),
      updatedBy: '运营管理员',
    }
    commitConfigs(sourceConfigs.map((item) => (item.id === accountId ? nextAccount : item)))
  }

  const updateSelectedAccount = (updater) => {
    if (!selectedAccount) return
    updateAccountById(selectedAccount.id, updater)
  }

  const toggleAccountStatus = (account) => {
    upsertAccount({
      ...account,
      status: account.status === '启用' ? '禁用' : '启用',
      updatedAt: formatStamp(),
      updatedBy: '运营管理员',
    })
  }

  const saveBankConfig = (currencyCode, bankConfigPayload) => {
    if (!bankConfigAccount) return
    const bankConfig = bankConfigPayload.bank || bankConfigPayload
    const nextIntermediaryBank = bankConfigPayload.intermediaryBank
    updateAccountById(bankConfigAccount.id, (account) => ({
      ...account,
      currencies: account.currencies.map((currency) => (
        currency.code === currencyCode
          ? {
              ...currency,
              intermediaryBank: nextIntermediaryBank
                ? {
                    ...createIntermediaryBank(),
                    ...currency.intermediaryBank,
                    ...nextIntermediaryBank,
                  }
                : currency.intermediaryBank,
              banks: [{
                ...createBankRecord(),
                ...bankConfig,
                id: bankConfig.id || `BANK-${currencyCode}-${Date.now()}`,
                isDefault: bankConfig.isDefault !== false,
                enabled: bankConfig.enabled !== false,
              }],
            }
          : currency
      )),
    }))
    setBankEditModal(null)
  }

  if (bankConfigAccount) {
    const sortedCurrencies = [...bankConfigAccount.currencies].sort((left, right) => Number(left.displayOrder || 0) - Number(right.displayOrder || 0))

    return (
      <AdminShell>
        <Panel className="px-[18px] py-[22px]">
          <div className="flex items-center justify-between gap-[20px]">
            <div>
              <button type="button" onClick={() => setBankConfigId(null)} className="mb-[12px] inline-flex items-center gap-[6px] text-[12px] font-semibold text-[#8b4fff] hover:underline">
                <ArrowLeft className="h-[14px] w-[14px]" />
                返回账户类型列表
              </button>
              <PageTitle
                title={`${bankConfigAccount.name} - 收款银行配置`}
                subtitle="从列表页直达银行配置，按币种维护该账户类型下唯一一组收款银行信息。"
              />
            </div>
            <div className="rounded-[5px] border border-[#e2e4ec] bg-[#fbfbfd] px-[14px] py-[10px] text-right">
              <div className="text-[12px] text-[#66677f]">账户类型</div>
              <div className="mt-[5px] text-[13px] font-semibold text-[#20213a]">{bankConfigAccount.name}</div>
            </div>
          </div>
        </Panel>

        <Panel className="mt-[21px] p-[18px]">
          <div className="mb-[14px] flex items-center justify-between">
            <div className="flex items-center gap-[8px] text-[16px] font-semibold text-[#20213a]">
              <CircleDollarSign className="h-[18px] w-[18px] text-[#8b4fff]" />
              支持币种
            </div>
            <CurrencyTags currencies={sortedCurrencies} />
          </div>
          <div className="rounded-[5px] bg-[#f6f7fb] px-[12px] py-[10px] text-[12px] font-semibold leading-[20px] text-[#66677f]">
            银行配置维度保持为账户类型 + 币种 + 收款银行；一个账户类型下，一个币种对应一个收款银行。
          </div>
        </Panel>

        <div className="mt-[21px] space-y-[12px]">
          {sortedCurrencies.map((currency) => {
            const bank = currency.banks?.[0] || createBankRecord({ enabled: false, isDefault: false })
            const intermediaryBank = currency.intermediaryBank || createIntermediaryBank()
            const open = expandedCurrency === currency.code

            return (
              <Panel key={currency.code} className="overflow-hidden">
                <div className="flex min-h-[64px] items-center justify-between gap-[12px] bg-white px-[18px]">
                  <button
                    type="button"
                    onClick={() => setExpandedCurrency(open ? '' : currency.code)}
                    className="flex min-w-0 flex-1 items-center justify-between gap-[16px] py-[15px] pr-[12px] text-left"
                  >
                    <span className="flex min-w-0 items-center gap-[10px]">
                      <span className="inline-flex h-[30px] items-center rounded-full bg-[#e7f5ff] px-[11px] font-mono text-[13px] font-bold text-[#237be8]">{currency.code}</span>
                      <span className="text-[15px] font-semibold text-[#20213a]">{currency.name}</span>
                      <StatusBadge tone={currency.enabled ? 'green' : 'gray'}>{currency.enabled ? '币种启用' : '币种禁用'}</StatusBadge>
                    </span>
                    <span className="flex shrink-0 items-center text-[#66677f]">
                      <ChevronDown className={`h-[17px] w-[17px] shrink-0 transition ${open ? 'rotate-180' : ''}`} />
                    </span>
                  </button>
                  <div className="shrink-0">
                    <ActionButton icon={Pencil} onClick={() => setBankEditModal({ currency })}>编辑收款银行</ActionButton>
                  </div>
                </div>
                {open ? (
                  <div className="border-t border-[#e5e6ef] bg-white p-[18px]">
                    <div className="mb-[12px] text-[13px] font-semibold text-[#20213a]">收款银行信息</div>
                    <div className="grid grid-cols-3 gap-[12px]">
                      {bankFieldLabels.map(([field, label]) => (
                        <InfoItem key={field} label={label} value={bank[field]} wide={field === 'bankAddress'} />
                      ))}
                    </div>
                    <div className="mb-[10px] mt-[16px] text-[13px] font-semibold text-[#20213a]">中转银行信息</div>
                    <div className="mt-[10px] grid grid-cols-3 gap-[12px]">
                      {intermediaryBankFieldLabels.map(([field, label]) => (
                        <InfoItem key={field} label={label} value={intermediaryBank[field]} wide={field === 'remark'} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </Panel>
            )
          })}
        </div>

        {bankEditModal ? (
          <BankEditModal
            account={bankConfigAccount}
            currency={bankEditModal.currency}
            onClose={() => setBankEditModal(null)}
            onSave={(bankConfig) => saveBankConfig(bankEditModal.currency.code, bankConfig)}
          />
        ) : null}
      </AdminShell>
    )
  }

  if (selectedAccount) {
    const sortedCurrencies = [...selectedAccount.currencies].sort((left, right) => Number(left.displayOrder || 0) - Number(right.displayOrder || 0))

    return (
      <AdminShell>
        <Panel className="px-[18px] py-[22px]">
          <div className="flex items-center justify-between gap-[20px]">
            <div>
              <button type="button" onClick={() => setSelectedId(null)} className="mb-[12px] inline-flex items-center gap-[6px] text-[12px] font-semibold text-[#8b4fff] hover:underline">
                <ArrowLeft className="h-[14px] w-[14px]" />
                返回账户类型列表
              </button>
              <PageTitle
                title={selectedAccount.name}
                subtitle="详情页用于查看基础信息、账户能力和支持币种配置；收款银行维护请从列表页“银行配置”进入。"
              />
            </div>
            <div className="flex items-center gap-[8px]">
              <ActionButton icon={Pencil} onClick={() => setAccountModal(selectedAccount)}>编辑基础信息</ActionButton>
            </div>
          </div>
        </Panel>

        <Panel className="mt-[21px] p-[18px]">
          <div className="mb-[16px] flex items-center gap-[8px] text-[16px] font-semibold text-[#20213a]">
            <WalletCards className="h-[18px] w-[18px] text-[#8b4fff]" />
            基础信息
          </div>
          <div className="grid grid-cols-3 gap-[12px]">
            <InfoItem label="账户类型名称" value={selectedAccount.name} />
            <InfoItem label="账户类型英文名称" value={selectedAccount.englishName} />
            <InfoItem label="账户类型代码" value={selectedAccount.code} />
            <InfoItem label="展示排序" value={selectedAccount.displayOrder} />
            <InfoItem label="状态" value={selectedAccount.status} />
            <InfoItem label="是否默认账户" value={selectedAccount.isDefault ? '是' : '否'} />
            <InfoItem label="支持入金" value={selectedAccount.allowDeposit ? '支持' : '不支持'} />
            <InfoItem label="支持出金" value={selectedAccount.allowWithdraw ? '支持' : '不支持'} />
            <InfoItem label="支持资金互转" value={selectedAccount.allowInternalTransfer ? '支持' : '不支持'} />
          </div>
        </Panel>

        <Panel className="mt-[21px] p-[18px]">
          <div className="mb-[16px] flex items-center justify-between">
            <div className="flex items-center gap-[8px] text-[16px] font-semibold text-[#20213a]">
              <CircleDollarSign className="h-[18px] w-[18px] text-[#8b4fff]" />
              支持币种
            </div>
            <span className="text-[12px] text-[#8a8ca0]">点击币种展开查看对应收款银行信息。</span>
          </div>
          <div className="space-y-[10px]">
            {sortedCurrencies.map((currency) => {
              const open = expandedCurrency === currency.code
              const bank = currency.banks?.[0] || createBankRecord({ enabled: false, isDefault: false })
              const intermediaryBank = currency.intermediaryBank || createIntermediaryBank()

              return (
                <div key={currency.code} className="overflow-hidden rounded-[6px] border border-[#e2e4ec] bg-white">
                  <div className="flex min-h-[58px] w-full items-center bg-[#fbfbfd] px-[14px]">
                    <button
                      type="button"
                      onClick={() => setExpandedCurrency(open ? '' : currency.code)}
                      className="flex min-w-0 flex-1 items-center justify-between gap-[16px] py-[13px] pr-[14px] text-left"
                    >
                      <span className="flex min-w-0 items-center gap-[10px]">
                        <span className="inline-flex h-[28px] items-center rounded-full bg-[#e7f5ff] px-[10px] font-mono text-[13px] font-bold text-[#237be8]">{currency.code}</span>
                        <span className="text-[14px] font-semibold text-[#20213a]">{currency.name}</span>
                        <StatusBadge tone={currency.enabled ? 'green' : 'gray'}>{currency.enabled ? '币种启用' : '币种禁用'}</StatusBadge>
                      </span>
                      <span className="flex shrink-0 items-center text-[#66677f]">
                        <ChevronDown className={`h-[17px] w-[17px] shrink-0 transition ${open ? 'rotate-180' : ''}`} />
                      </span>
                    </button>
                  </div>
                  {open ? (
                    <div className="border-t border-[#e5e6ef] bg-white p-[14px]">
                      <div className="mb-[12px] flex items-center justify-between">
                        <div className="text-[13px] font-semibold text-[#20213a]">收款银行信息</div>
                        <div className="flex items-center gap-[8px]">
                          <StatusBadge tone={bank.isDefault ? 'violet' : 'gray'}>{bank.isDefault ? '默认收款银行' : '非默认'}</StatusBadge>
                          <StatusBadge tone={bank.enabled ? 'green' : 'gray'}>{bank.enabled ? '启用' : '禁用'}</StatusBadge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-[12px]">
                        {bankFieldLabels.map(([field, label]) => (
                          <InfoItem key={field} label={label} value={bank[field]} wide={field === 'bankAddress' || field === 'remark'} />
                        ))}
                      </div>
                      <div className="mb-[12px] mt-[16px] text-[13px] font-semibold text-[#20213a]">中转银行信息</div>
                      <div className="grid grid-cols-3 gap-[12px]">
                        {intermediaryBankFieldLabels.map(([field, label]) => (
                          <InfoItem key={field} label={label} value={intermediaryBank[field]} wide={field === 'remark'} />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </Panel>

        {accountModal ? <AccountTypeModal initialValue={accountModal} configs={sourceConfigs} onClose={() => setAccountModal(null)} onSave={upsertAccount} /> : null}
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <Panel className="px-[18px] py-[22px]">
        <div className="flex items-center justify-between gap-[20px]">
          <PageTitle
            title="账户类型配置"
            subtitle="按账户类型维护支持币种与收款银行，适配香港账户、美国账户、新加坡账户等多账户类型场景。"
          />
          <PrimaryButton icon={Plus} onClick={() => setAccountModal(createEmptyAccountType())}>新增账户类型</PrimaryButton>
        </div>
      </Panel>

      <Panel className="mt-[21px] px-[15px] py-[18px]">
        <div className="flex items-center justify-between">
          <div className="text-[16px] font-semibold text-[#20213a]">筛选条件</div>
          <span className="text-[12px] text-[#8a8ca0]">币种筛选会匹配支持该币种的账户类型</span>
        </div>
        <div className="mt-[15px] flex items-center gap-[10px]">
          <label className="flex h-[50px] min-w-0 flex-1 items-center gap-[11px] rounded-[4px] border border-[#cfd1dc] bg-white px-[15px] text-[13px] text-[#9a9cab]">
            <Search className="h-[16px] w-[16px] text-[#20213a]" strokeWidth={1.8} />
            <input value={filters.keyword} onChange={(event) => setFilters((current) => ({ ...current, keyword: event.target.value }))} className="h-full flex-1 bg-transparent outline-none" placeholder="账户类型名称、英文名称、代码" />
          </label>
          <div className="w-[220px] shrink-0">
            <FormSelect label="币种" value={filters.currency} onChange={(value) => setFilters((current) => ({ ...current, currency: value }))}>
              <option value="">全部</option>
              {accountTypeCurrencyOptions.map((currency) => <option key={currency.code} value={currency.code}>{currency.code} - {currency.name}</option>)}
            </FormSelect>
          </div>
          <div className="w-[180px] shrink-0">
            <FormSelect label="状态" value={filters.status} onChange={(value) => setFilters((current) => ({ ...current, status: value }))}>
              <option value="">全部</option>
              {accountTypeStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </FormSelect>
          </div>
          <div className="flex w-[156px] shrink-0 items-center justify-end">
            <ActionButton icon={Clock3} onClick={() => setFilters({ keyword: '', currency: '', status: '' })}>重置</ActionButton>
          </div>
        </div>
      </Panel>

      <Panel className="mt-[21px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1040px] w-full border-collapse text-left text-[13px] text-[#55556e]">
            <thead>
              <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
                {['账户类型名称', '账户类型英文名称', '账户类型代码', '支持币种', '状态', '展示排序', '操作'].map((item) => (
                  <th key={item} className="whitespace-nowrap px-[14px]">{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredConfigs.map((account) => (
                <tr key={account.id} className="h-[74px] cursor-pointer border-b border-[#e7e8ef] bg-white hover:bg-[#fbfbfd]" onClick={() => setSelectedId(account.id)}>
                  <td className="whitespace-nowrap px-[14px] font-semibold text-[#20213a]">{account.name}</td>
                  <td className="whitespace-nowrap px-[14px]">{account.englishName}</td>
                  <td className="whitespace-nowrap px-[14px] font-mono font-semibold text-[#237be8]">{account.code}</td>
                  <td className="px-[14px]"><CurrencyTags currencies={account.currencies} /></td>
                  <td className="whitespace-nowrap px-[14px]"><StatusBadge tone={account.status === '启用' ? 'green' : 'gray'}>{account.status}</StatusBadge></td>
                  <td className="whitespace-nowrap px-[14px]">{account.displayOrder}</td>
                  <td className="px-[14px]" onClick={(event) => event.stopPropagation()}>
                    <div className="flex flex-wrap gap-[8px]">
                      <ActionButton icon={Banknote} onClick={() => setSelectedId(account.id)}>详情</ActionButton>
                      <ActionButton icon={WalletCards} onClick={() => {
                        setSelectedId(null)
                        setBankConfigId(account.id)
                      }}>银行配置</ActionButton>
                      <ActionButton icon={Pencil} onClick={() => setAccountModal(account)}>编辑</ActionButton>
                      <ActionButton icon={account.status === '启用' ? XCircle : CheckCircle2} danger={account.status === '启用'} onClick={() => toggleAccountStatus(account)}>{account.status === '启用' ? '禁用' : '启用'}</ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredConfigs.length ? (
                <tr>
                  <td colSpan={7} className="px-[18px] py-[36px] text-center text-[13px] text-[#8a8ca0]">暂无符合条件的账户类型配置</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#e5e6ef] px-[18px] py-[14px] text-[13px] text-[#66677f]">
          共 {filteredConfigs.length} 个账户类型。列表按账户类型展示，不再直接按币种展示；禁用配置只影响新入口和后续业务操作，历史资产和记录不受影响。
        </div>
      </Panel>

      {accountModal ? <AccountTypeModal initialValue={accountModal} configs={sourceConfigs} onClose={() => setAccountModal(null)} onSave={upsertAccount} /> : null}
    </AdminShell>
  )
}
