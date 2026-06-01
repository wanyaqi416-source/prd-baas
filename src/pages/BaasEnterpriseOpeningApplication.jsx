import { ChevronDown, Download, FileUp, HelpCircle, UsersRound, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import {
  beneficialOwnerConfirmationFields,
  companyBaseFields,
  createMockEnterpriseFile,
  enterpriseApplicantRoleLabels,
  enterpriseApplicantRoleOptions,
  enterpriseDirectorAddressFields,
  enterpriseDirectorAttachmentFields,
  enterpriseDirectorInfoFields,
  getEnterpriseApplicantSelection,
  getByPath,
  getCompanyAttachmentFields,
  getEnterpriseSections,
  hasAtLeastOneBeneficialOwner,
  mockEnterpriseApplication,
  personAttachmentFields,
  personFields,
  registrationAddressFields,
  setByPath,
  shareholderExtraFields,
  validateEnterpriseApplication,
} from '../data/baasEnterpriseOpeningApplication'

const fileLimit = 8 * 1024 * 1024
const passportFileLimit = 20 * 1024 * 1024
const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png']
const passportAcceptedTypes = ['image/jpeg', 'image/png']
const baseFieldGroups = ['认证前确认', '企业主体信息', '业务信息', '注册地址', '实际经营地址', '经营规模与场所']
const listedCompanyFields = ['stockExchangeName', 'stockCode', 'authorizedCapital', 'issuedCapital', 'capitalCurrency']

function getModuleStatus(missingCount, revisionCount) {
  if (missingCount > 0) return { label: `待补充 ${missingCount} 项`, tone: 'warning' }
  if (revisionCount > 0) return { label: `需转换 ${revisionCount} 项`, tone: 'danger' }
  return { label: '已完成', tone: 'success' }
}

function formatValue(value) {
  if (Array.isArray(value)) return value.length ? value.join('、') : '—'
  if (value?.name) return value.name
  return value || '—'
}

function optionValue(option) {
  return typeof option === 'string' ? option : option.value
}

function optionLabel(option) {
  return typeof option === 'string' ? option : option.label
}

function optionDescription(option) {
  return typeof option === 'string' ? '' : option.description
}

function formatYesNo(value) {
  if (value === true) return '是'
  if (value === false) return '否'
  return value || '—'
}

function fieldDomId(item) {
  return `enterprise-field-${item.id.replace(/[^A-Za-z0-9_-]/g, '-')}`
}

function personDisplayName(person) {
  return `${person.firstName || '未填写'} ${person.lastName || ''}`.trim()
}

function getPersonRoleLabels(person) {
  return (person.roles || []).map((role) => enterpriseApplicantRoleLabels[role] || role)
}

function isCurrentApplicant(data, person) {
  return data.currentApplicant?.matchStatus === 'matched' && data.currentApplicant.personId === person.id
}

function shouldShowFieldGroup(item) {
  return item.group !== '企业基础资料' && item.group !== '企业董事' && !item.group?.startsWith('股东')
}

function shouldRenderAsPlainValue(item) {
  return item.path.endsWith('country') || item.path.endsWith('identityType')
}

function DownloadButton({ file, alwaysVisible = false }) {
  if (!file?.downloadUrl) {
    return alwaysVisible ? (
      <button
        type="button"
        disabled
        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-slate-100 px-3 text-xs font-bold text-slate-400"
      >
        <Download className="h-4 w-4" />
        下载
      </button>
    ) : null
  }

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

function FieldValue({ item }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">{item.label}</span>
        {shouldShowFieldGroup(item) ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">{item.group}</span> : null}
      </div>
      <div className="mt-1 min-h-6 text-sm font-bold text-slate-950">{formatValue(item.value)}</div>
      {item.hint ? <div className="mt-1 text-xs leading-5 text-slate-400">{item.hint}</div> : null}
      {item.value?.status ? <div className="mt-1 text-xs font-semibold text-emerald-700">{item.value.status}</div> : null}
      <div className="mt-3">
        <DownloadButton file={item.value} />
      </div>
    </div>
  )
}

function RevisionNotice({ item }) {
  return (
    <div id={fieldDomId(item)} className="scroll-mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-red-700">{item.label}</span>
        {shouldShowFieldGroup(item) ? <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-red-600">{item.group}</span> : null}
      </div>
      <div className="mt-1 min-h-6 text-sm font-bold text-slate-950">{formatValue(item.value)}</div>
      <div className="mt-1 text-xs leading-5 text-red-700">{item.error}</div>
    </div>
  )
}

function TextEditor({ item, value, error, onChange }) {
  const isIdentityType = item.path.endsWith('identityType')
  const isGender = item.path.endsWith('gender')

  return (
    <label id={fieldDomId(item)} className="block scroll-mt-8 rounded-xl border border-slate-200 bg-white p-4">
      <span className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">{item.label}</span>
        {shouldShowFieldGroup(item) ? <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">{item.group}</span> : null}
      </span>
      {isIdentityType || isGender ? (
        <select
          value={value || ''}
          onChange={(event) => onChange(item.path, event.target.value, item.id)}
          className={error ? 'mt-2 h-11 w-full rounded-lg border border-red-300 bg-red-50 px-3 text-sm font-semibold text-slate-950 outline-none focus:border-red-400' : 'mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-400'}
        >
          {(isIdentityType ? ['CN-RIC', 'PASSPORT'] : ['MALE', 'FEMALE']).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          value={value || ''}
          onChange={(event) => onChange(item.path, sanitizeFieldValue(item, event.target.value), item.id)}
          placeholder={item.placeholder || item.hint || '请输入'}
          className={error ? 'mt-2 h-11 w-full rounded-lg border border-red-300 bg-red-50 px-3 text-sm font-semibold text-slate-950 outline-none focus:border-red-400' : 'mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-400'}
        />
      )}
      {item.hint ? <span className="mt-1 block text-xs leading-5 text-slate-400">{item.hint}</span> : null}
      {error ? <span className="mt-1 block text-xs leading-5 text-red-600">{error}</span> : null}
    </label>
  )
}

function UploadEditor({ item, file, error, onFileChange }) {
  const accept = item.accept || '.pdf,.jpeg,.jpg,.png,application/pdf,image/jpeg,image/png'
  const acceptDescription = item.acceptDescription || '支持 pdf / jpeg / png，单个文件大小限制 8M。'

  return (
    <div id={fieldDomId(item)} className={error ? 'scroll-mt-8 rounded-xl border border-red-200 bg-red-50 p-4' : 'scroll-mt-8 rounded-xl border border-slate-200 bg-white p-4'}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-slate-950">{item.label}</span>
            {shouldShowFieldGroup(item) ? <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">{item.group}</span> : null}
          </div>
          {item.hint ? <div className="mt-1 whitespace-pre-line text-xs leading-5 text-slate-500">{item.hint}</div> : null}
          <div className="mt-1 text-xs leading-5 text-slate-500">{acceptDescription}</div>
          {file?.name ? <div className="mt-2 text-xs font-semibold text-blue-700">{file.name} · {file.status || '已上传'}</div> : null}
          {error ? <div className="mt-2 text-xs leading-5 text-red-600">{error}</div> : null}
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          <DownloadButton file={file} alwaysVisible />
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-blue-50 px-3 text-xs font-bold text-blue-700 hover:bg-blue-100">
            <FileUp className="h-4 w-4" />
            上传
            <input
              type="file"
              accept={accept}
              className="hidden"
              onChange={(event) => {
                onFileChange(item.path, event.target.files?.[0], item.id, item)
                event.target.value = ''
              }}
            />
          </label>
        </div>
      </div>
    </div>
  )
}

function isFieldActive(data, field) {
  if (!field.dependsOn) return true
  return getByPath(data, field.dependsOn.path) === field.dependsOn.value
}

function sanitizeFieldValue(field, value) {
  if (field.sanitize === 'digits') return value.replace(/\D/g, '')
  if (field.sanitize === 'currency') return value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3)
  if (field.sanitize === 'chinese') return value.replace(/[^\u3400-\u9fff]/g, '')
  return value
}

function EnterpriseFieldLabel({ field }) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-slate-500">{field.label}</span>
      {field.supplement ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">补充资料</span> : null}
      {field.tooltip ? (
        <span className="group relative inline-flex" title={field.tooltip}>
          <HelpCircle className="h-4 w-4 text-slate-400" />
          <span className="pointer-events-none absolute left-1/2 top-6 z-20 hidden w-64 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold leading-5 text-slate-600 shadow-xl group-hover:block">
            {field.tooltip}
          </span>
        </span>
      ) : null}
    </span>
  )
}

function EnterpriseBaseEditor({ field, value, error, onChange }) {
  const rootRef = useRef(null)
  const [descriptiveOpen, setDescriptiveOpen] = useState(false)
  const [multiOpen, setMultiOpen] = useState(false)
  const baseClass = error
    ? 'mt-2 h-11 w-full rounded-lg border border-red-300 bg-red-50 px-3 text-sm font-semibold text-slate-950 outline-none focus:border-red-400'
    : 'mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-400'

  useEffect(() => {
    if (!descriptiveOpen && !multiOpen) return undefined
    const closeDropdowns = (event) => {
      if (rootRef.current?.contains(event.target)) return
      setDescriptiveOpen(false)
      setMultiOpen(false)
    }
    document.addEventListener('mousedown', closeDropdowns)
    return () => document.removeEventListener('mousedown', closeDropdowns)
  }, [descriptiveOpen, multiOpen])

  if (field.inputType === 'radioCards') {
    return (
      <div id={fieldDomId(field)} className={error ? 'block scroll-mt-8 rounded-xl border border-red-200 bg-red-50 p-4' : 'block scroll-mt-8 rounded-xl border border-slate-200 bg-white p-4'}>
        <EnterpriseFieldLabel field={field} />
        <div className="mt-3 grid gap-3">
          {field.options.map((option) => {
            const optionText = optionLabel(option)
            const selected = value === optionValue(option)
            return (
              <button
                type="button"
                key={optionText}
                onClick={() => onChange(field.path, optionValue(option), field.id)}
                className={selected ? 'flex min-h-12 w-full items-center gap-3 rounded-lg border border-blue-500 bg-blue-50 px-4 py-3 text-left text-sm font-bold text-slate-950 shadow-sm' : 'flex min-h-12 w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50'}
              >
                <span className={selected ? 'flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500 ring-4 ring-blue-100' : 'h-4 w-4 shrink-0 rounded-full border border-slate-300 bg-white'} />
                <span className="min-w-0 leading-5">{optionText}</span>
              </button>
            )
          })}
        </div>
        {field.hint ? <span className="mt-2 block text-xs leading-5 text-slate-400">{field.hint}</span> : null}
        {error ? <span className="mt-1 block text-xs leading-5 text-red-600">{error}</span> : null}
      </div>
    )
  }

  if (field.inputType === 'segmented') {
    return (
      <div id={fieldDomId(field)} className={error ? 'block scroll-mt-8 rounded-xl border border-red-200 bg-red-50 p-4' : 'block scroll-mt-8 rounded-xl border border-slate-200 bg-white p-4'}>
        <EnterpriseFieldLabel field={field} />
        <div className="mt-2 grid grid-cols-2 gap-2">
          {field.options.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => onChange(field.path, option, field.id)}
              className={value === option ? 'h-10 rounded-lg bg-blue-600 text-sm font-bold text-white' : 'h-10 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:border-blue-200 hover:bg-blue-50'}
            >
              {option}
            </button>
          ))}
        </div>
        {error ? <span className="mt-1 block text-xs leading-5 text-red-600">{error}</span> : null}
      </div>
    )
  }

  if (field.inputType === 'descriptiveSelect') {
    const selectedOption = field.options.find((option) => optionValue(option) === value)
    return (
      <div ref={rootRef} id={fieldDomId(field)} className={error ? 'relative block scroll-mt-8 rounded-xl border border-red-200 bg-red-50 p-4' : 'relative block scroll-mt-8 rounded-xl border border-slate-200 bg-white p-4'}>
        <EnterpriseFieldLabel field={field} />
        <button
          type="button"
          onClick={() => setDescriptiveOpen((open) => !open)}
          className={`${baseClass} flex items-center justify-between text-left`}
        >
          <span className={selectedOption ? 'truncate' : 'truncate text-slate-400'}>{selectedOption ? optionLabel(selectedOption) : field.placeholder || '请选择'}</span>
          <ChevronDown className={descriptiveOpen ? 'h-4 w-4 shrink-0 rotate-180 text-slate-400' : 'h-4 w-4 shrink-0 text-slate-400'} />
        </button>
        {descriptiveOpen ? (
          <div className="absolute left-4 right-4 top-[88px] z-30 max-h-80 overflow-auto rounded-lg border border-slate-200 bg-white py-2 shadow-xl">
            {field.options.map((option) => (
              <button
                type="button"
                key={optionValue(option)}
                onClick={() => {
                  onChange(field.path, optionValue(option), field.id)
                  setDescriptiveOpen(false)
                }}
                className={value === optionValue(option) ? 'block w-full bg-blue-50 px-4 py-3 text-left' : 'block w-full px-4 py-3 text-left hover:bg-slate-50'}
              >
                <span className="block text-sm font-bold text-slate-950">{optionLabel(option)}</span>
                {optionDescription(option) ? <span className="mt-1 block text-xs leading-5 text-slate-400">{optionDescription(option)}</span> : null}
              </button>
            ))}
          </div>
        ) : null}
        {error ? <span className="mt-1 block text-xs leading-5 text-red-600">{error}</span> : null}
      </div>
    )
  }

  if (field.inputType === 'multiselect' || field.inputType === 'groupedMultiselect') {
    const selectedValues = Array.isArray(value) ? value : []
    const selectedText = selectedValues.length ? selectedValues.join('、') : field.placeholder || '请选择'
    const groups = field.inputType === 'groupedMultiselect'
      ? field.groups
      : [{ label: '', options: field.options || [] }]
    const atLimit = field.maxSelections && selectedValues.length >= field.maxSelections

    return (
      <div ref={rootRef} id={fieldDomId(field)} className={error ? 'relative block scroll-mt-8 rounded-xl border border-red-200 bg-red-50 p-4' : 'relative block scroll-mt-8 rounded-xl border border-slate-200 bg-white p-4'}>
        <EnterpriseFieldLabel field={field} />
        <button
          type="button"
          onClick={() => setMultiOpen((open) => !open)}
          className={`${baseClass} flex items-center justify-between text-left`}
        >
          <span className={selectedValues.length ? 'truncate' : 'truncate text-slate-400'}>{selectedText}</span>
          <ChevronDown className={multiOpen ? 'h-4 w-4 shrink-0 rotate-180 text-slate-400' : 'h-4 w-4 shrink-0 text-slate-400'} />
        </button>
        {selectedValues.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedValues.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => onChange(field.path, selectedValues.filter((valueItem) => valueItem !== item), field.id)}
                className="inline-flex max-w-full items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700"
              >
                <span className="truncate">{item}</span>
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        ) : null}
        {multiOpen ? (
          <div className="absolute left-4 right-4 top-[88px] z-30 max-h-80 overflow-auto rounded-lg border border-slate-200 bg-white py-2 shadow-xl">
            {groups.map((group) => (
              <div key={group.label || 'options'}>
                {group.label ? <div className="px-4 py-2 text-xs font-bold text-slate-400">{group.label}</div> : null}
                {(group.options || []).map((option) => {
                  const currentValue = optionValue(option)
                  const selected = selectedValues.includes(currentValue)
                  const disabled = !selected && atLimit
                  return (
                    <button
                      type="button"
                      key={currentValue}
                      disabled={disabled}
                      onClick={() => {
                        const next = selected
                          ? selectedValues.filter((item) => item !== currentValue)
                          : [...selectedValues, currentValue]
                        onChange(field.path, next, field.id)
                      }}
                      className={selected ? 'flex w-full items-center gap-3 bg-blue-50 px-4 py-2 text-left text-sm font-bold text-slate-950' : disabled ? 'flex w-full items-center gap-3 px-4 py-2 text-left text-sm font-semibold text-slate-300' : 'flex w-full items-center gap-3 px-4 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50'}
                    >
                      <span className={selected ? 'flex h-4 w-4 shrink-0 items-center justify-center rounded border border-blue-500 bg-blue-500' : 'h-4 w-4 shrink-0 rounded border border-slate-300 bg-white'}>
                        {selected ? <span className="h-1.5 w-1.5 rounded-sm bg-white" /> : null}
                      </span>
                      <span>{optionLabel(option)}</span>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        ) : null}
        {field.maxSelections ? <span className="mt-1 block text-xs leading-5 text-slate-400">最多可选 {field.maxSelections} 项</span> : null}
        {error ? <span className="mt-1 block text-xs leading-5 text-red-600">{error}</span> : null}
      </div>
    )
  }

  if (field.inputType === 'select') {
    return (
      <label id={fieldDomId(field)} className={error ? 'block scroll-mt-8 rounded-xl border border-red-200 bg-red-50 p-4' : 'block scroll-mt-8 rounded-xl border border-slate-200 bg-white p-4'}>
        <EnterpriseFieldLabel field={field} />
        <select value={value || ''} onChange={(event) => onChange(field.path, event.target.value, field.id)} className={baseClass}>
          <option value="">{field.placeholder || '请选择'}</option>
          {field.options.map((option) => <option key={optionValue(option)} value={optionValue(option)}>{optionLabel(option)}</option>)}
        </select>
        {field.hint ? <span className="mt-1 block text-xs leading-5 text-slate-400">{field.hint}</span> : null}
        {error ? <span className="mt-1 block text-xs leading-5 text-red-600">{error}</span> : null}
      </label>
    )
  }

  if (field.inputType === 'textarea') {
    return (
      <label id={fieldDomId(field)} className={error ? 'block scroll-mt-8 rounded-xl border border-red-200 bg-red-50 p-4 md:col-span-2 lg:col-span-3' : 'block scroll-mt-8 rounded-xl border border-slate-200 bg-white p-4 md:col-span-2 lg:col-span-3'}>
        <EnterpriseFieldLabel field={field} />
        <textarea
          value={value || ''}
          onChange={(event) => onChange(field.path, event.target.value, field.id)}
          placeholder={field.placeholder || '请输入'}
          className={error ? 'mt-2 min-h-28 w-full rounded-lg border border-red-300 bg-red-50 px-3 py-3 text-sm font-semibold text-slate-950 outline-none focus:border-red-400' : 'mt-2 min-h-28 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-400'}
        />
        {field.hint ? <span className="mt-1 block text-xs leading-5 text-slate-400">{field.hint}</span> : null}
        {error ? <span className="mt-1 block text-xs leading-5 text-red-600">{error}</span> : null}
      </label>
    )
  }

  return (
    <label id={fieldDomId(field)} className={error ? 'block scroll-mt-8 rounded-xl border border-red-200 bg-red-50 p-4' : 'block scroll-mt-8 rounded-xl border border-slate-200 bg-white p-4'}>
      <EnterpriseFieldLabel field={field} />
      <input
        value={value || ''}
        onChange={(event) => onChange(field.path, sanitizeFieldValue(field, event.target.value), field.id)}
        inputMode={field.sanitize === 'digits' ? 'numeric' : undefined}
        placeholder={field.placeholder || '请输入'}
        className={baseClass}
      />
      {field.hint ? <span className="mt-1 block text-xs leading-5 text-slate-400">{field.hint}</span> : null}
      {error ? <span className="mt-1 block text-xs leading-5 text-red-600">{error}</span> : null}
    </label>
  )
}

function EnterpriseReadOnlyValue({ field, value }) {
  return (
    <div id={fieldDomId(field)} className="scroll-mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">{field.label}</span>
        {field.tooltip ? (
          <span className="group relative inline-flex" title={field.tooltip}>
            <HelpCircle className="h-4 w-4 text-slate-400" />
            <span className="pointer-events-none absolute left-1/2 top-6 z-20 hidden w-64 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold leading-5 text-slate-600 shadow-xl group-hover:block">
              {field.tooltip}
            </span>
          </span>
        ) : null}
      </div>
      <div className="mt-1 min-h-6 text-sm font-bold text-slate-950">{formatValue(value)}</div>
      {field.hint ? <div className="mt-1 text-xs leading-5 text-slate-400">{field.hint}</div> : null}
    </div>
  )
}

function EnterpriseBaseForm({
  data,
  fields,
  companyFileFields,
  sections,
  errors,
  onlyProblems,
  isListedCompany,
  onChange,
  onFileChange,
  onCopyRegistrationAddress,
}) {
  const visibleFields = fields
    .filter((field) => isFieldActive(data, field))
    .map((field) => {
      const item = { ...field, id: `企业基础资料:${field.path}`, group: '企业基础资料', value: getByPath(data, field.path) }
      const problem = itemByPath(sections.missing, '企业基础资料', field.path) || itemByPath(sections.revision, '企业基础资料', field.path)
      return { ...item, problem }
    })
    .filter((field) => !onlyProblems || field.problem)

  if (!visibleFields.length) {
    return <EmptyFilteredState />
  }

  return (
    <div className="mt-5 grid gap-5">
      {baseFieldGroups.map((group) => {
        const groupFields = visibleFields.filter((field) => field.section === group)
        const showNonListedFiles = !isListedCompany && group === '认证前确认'
        if (!groupFields.length && !showNonListedFiles) return null

        return (
          <div key={group} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h5 className="text-sm font-bold text-slate-950">{group}</h5>
                {group === '认证前确认' ? (
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Interlace 将根据是否上市决定后续资料路径，请在开始认证前确认企业名称和上市状态。
                  </p>
                ) : null}
              </div>
              {group === '实际经营地址' ? (
                <Button type="button" size="sm" variant="outline" onClick={onCopyRegistrationAddress} className="rounded-lg">
                  与注册地址一致，点击填充
                </Button>
              ) : null}
            </div>
            {groupFields.length ? (
              <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {groupFields.map((field) => (
                  field.readOnly
                    ? <EnterpriseReadOnlyValue key={field.id} field={field} value={getByPath(data, field.path)} />
                    : (
                      <EnterpriseBaseEditor
                        key={field.id}
                        field={field}
                        value={getByPath(data, field.path)}
                        error={errors[field.id] || errors[field.path]}
                        onChange={onChange}
                      />
                    )
                ))}
              </div>
            ) : null}
            {showNonListedFiles ? (
              <div className="mt-5 border-t border-slate-200 pt-5">
                <h5 className="text-sm font-bold text-slate-950">请上传如下文件</h5>
                <ModuleFieldGrid
                  data={data}
                  fields={companyFileFields}
                  group="企业基础资料"
                  sections={sections}
                  errors={errors}
                  onChange={onChange}
                  onFileChange={onFileChange}
                  onlyProblems={onlyProblems}
                />
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function ApplicantRoleSelector({ selectedRole, onChange }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <h5 className="text-sm font-bold text-slate-950">您的身份为</h5>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {enterpriseApplicantRoleOptions.map((option) => {
          const selected = selectedRole === option.value
          return (
            <button
              type="button"
              key={option.value}
              onClick={() => onChange(option.value)}
              className={selected ? 'rounded-xl border border-blue-400 bg-blue-50 p-4 text-left shadow-sm' : 'rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-blue-200 hover:bg-blue-50'}
            >
              <span className="flex items-center gap-2">
                <span className={selected ? 'flex h-4 w-4 items-center justify-center rounded-full border border-blue-500 bg-blue-500' : 'h-4 w-4 rounded-full border border-slate-300 bg-white'}>
                  {selected ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                </span>
                <span className="text-sm font-bold text-slate-950">{option.label}</span>
              </span>
              <span className="mt-2 block text-xs leading-5 text-slate-500">{option.description}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function directorFieldValue(field, person) {
  if (field.fixedValue) return field.fixedValue
  const value = getByPath(person, field.path)
  if (field.path === 'isBeneficialOwner') return formatYesNo(value)
  if (field.uppercase && value) return String(value).toUpperCase()
  return value
}

function isDirectorFieldVisible(field, person) {
  if (!field.visibleWhen) return true
  const value = directorFieldValue({ path: field.visibleWhen.path }, person)
  return value === field.visibleWhen.value
}

function createDirectorItem(field, pathPrefix, person) {
  const path = `${pathPrefix}${field.path}`
  return {
    ...field,
    id: `企业董事:${path}`,
    path,
    group: '企业董事',
    value: directorFieldValue(field, person),
  }
}

function EnterpriseDirectorField({ data, person, pathPrefix, field, sections, errors, onChange }) {
  const item = createDirectorItem(field, pathPrefix, person)
  const missingItem = itemByPath(sections.missing, '企业董事', item.path)
  const revisionItem = itemByPath(sections.revision, '企业董事', item.path)
  const fieldItem = missingItem || revisionItem || item

  if (field.readOnly) {
    return <EnterpriseReadOnlyValue key={item.id} field={item} value={directorFieldValue(field, person)} />
  }

  return (
    <EnterpriseBaseEditor
      key={item.id}
      field={fieldItem}
      value={getByPath(data, item.path)}
      error={errors[fieldItem.id] || errors[fieldItem.path]}
      onChange={onChange}
    />
  )
}

function EnterpriseDirectorAttachment({ data, person, pathPrefix, field, sections, errors, onFileChange }) {
  const item = createDirectorItem(field, pathPrefix, person)
  const missingItem = itemByPath(sections.missing, '企业董事', item.path)
  const acquiredItem = itemByPath(sections.acquired, '企业董事', item.path)
  const fieldItem = missingItem || acquiredItem || item
  const file = getByPath(data, item.path)

  return (
    <UploadEditor
      key={item.id}
      item={fieldItem}
      file={file}
      error={errors[fieldItem.id] || errors[fieldItem.path]}
      onFileChange={onFileChange}
    />
  )
}

function EnterpriseDirectorModule({ data, sections, errors, onRoleChange, onChange, onFileChange }) {
  const { role, index, person } = getEnterpriseApplicantSelection(data)
  const roleLabel = enterpriseApplicantRoleLabels[role] || '企业董事'
  const pathPrefix = index >= 0 ? `directors.${index}.` : ''
  const infoTitle = role === 'authorizedRepresentative' ? '被授权人信息' : '董事信息'
  const infoBeforePassport = enterpriseDirectorInfoFields.slice(0, 2).filter((field) => isDirectorFieldVisible(field, person))
  const infoAfterPassport = enterpriseDirectorInfoFields.slice(2).filter((field) => isDirectorFieldVisible(field, person))

  return (
    <div className="mt-4 grid gap-4">
      <ApplicantRoleSelector selectedRole={role} onChange={onRoleChange} />
      {!person ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-800">
          系统暂未获取该身份对应的人员资料，当前模块不产生待补项。
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <UsersRound className="h-5 w-5" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-950">{roleLabel}：{personDisplayName(person)}</span>
                  <Badge variant="success">当前选择</Badge>
                </div>
                <div className="mt-1 text-xs text-slate-500">系统已有资料只读展示，缺失的中文姓名、护照与手持护照照片在本模块补充。</div>
              </div>
            </div>
          </div>
          <div className="grid gap-5 p-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <h5 className="text-sm font-bold text-slate-950">{infoTitle}</h5>
              <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {infoBeforePassport.map((field) => (
                  <EnterpriseDirectorField
                    key={field.path}
                    data={data}
                    person={person}
                    pathPrefix={pathPrefix}
                    field={field}
                    sections={sections}
                    errors={errors}
                    onChange={onChange}
                  />
                ))}
                {enterpriseDirectorAttachmentFields.map((field) => (
                  <EnterpriseDirectorAttachment
                    key={field.path}
                    data={data}
                    person={person}
                    pathPrefix={pathPrefix}
                    field={field}
                    sections={sections}
                    errors={errors}
                    onFileChange={onFileChange}
                  />
                ))}
                {infoAfterPassport.map((field) => (
                  <EnterpriseDirectorField
                    key={field.path}
                    data={data}
                    person={person}
                    pathPrefix={pathPrefix}
                    field={field}
                    sections={sections}
                    errors={errors}
                    onChange={onChange}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <h5 className="text-sm font-bold text-slate-950">实际居住地址</h5>
              <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {enterpriseDirectorAddressFields.map((field) => (
                  <EnterpriseDirectorField
                    key={field.path}
                    data={data}
                    person={person}
                    pathPrefix={pathPrefix}
                    field={field}
                    sections={sections}
                    errors={errors}
                    onChange={onChange}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function isYesValue(value) {
  return formatYesNo(value) === '是' || String(value || '').trim().toUpperCase() === 'YES'
}

function ownerDisplayName(owner) {
  return owner.name || `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || '未获取姓名'
}

function BeneficialOwnerConfirmation({ data, sections, errors }) {
  const group = '受益所有人确认'
  const confirmationField = beneficialOwnerConfirmationFields[0]
  const confirmationItem = {
    ...confirmationField,
    id: `${group}:${confirmationField.path}`,
    group,
    value: getByPath(data, confirmationField.path),
  }
  const fieldItem = itemByPath(sections.missing, group, confirmationField.path)
    || itemByPath(sections.revision, group, confirmationField.path)
    || itemByPath(sections.acquired, group, confirmationField.path)
    || confirmationItem
  const hasOtherBeneficialOwners = getByPath(data, confirmationField.path)
  const otherBeneficialOwners = data.beneficialOwnerConfirmation?.otherBeneficialOwners || []
  const directorBeneficialOwners = (data.directors || []).filter((person) => isYesValue(person.isBeneficialOwner))
  const minimumProblem = itemByPath(sections.missing, group, 'beneficialOwnerMinimum')
  const listProblem = itemByPath(sections.missing, group, 'beneficialOwnerConfirmation.otherBeneficialOwners')
  const fieldError = errors[fieldItem.id] || errors[fieldItem.path]
  const minimumError = errors[minimumProblem?.id] || minimumProblem?.error
  const listError = errors[listProblem?.id] || listProblem?.error

  return (
    <div className="mt-4 grid gap-4">
      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <EnterpriseReadOnlyValue field={fieldItem} value={formatYesNo(hasOtherBeneficialOwners)} />
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="text-xs font-semibold text-slate-500">系统已识别受益所有人</div>
            <div className="mt-1 text-sm font-bold text-slate-950">
              {hasAtLeastOneBeneficialOwner(data) ? `${directorBeneficialOwners.length + otherBeneficialOwners.length} 人` : '—'}
            </div>
            <div className="mt-1 text-xs leading-5 text-slate-400">本页仅展示已有资料；新增或变更需走企业资料变更并人工审核。</div>
          </div>
        </div>
        {fieldError ? <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{fieldError}</div> : null}
        {minimumError ? <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{minimumError}</div> : null}
      </div>

      {directorBeneficialOwners.length ? (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <h5 className="text-sm font-bold text-slate-950">董事/被授权人中的受益所有人</h5>
          <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {directorBeneficialOwners.map((person) => (
              <div key={person.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-950">{personDisplayName(person)}</span>
                  {(person.roles || []).map((role) => <Badge key={role} variant="secondary">{enterpriseApplicantRoleLabels[role] || role}</Badge>)}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>持股比例：{formatValue(person.beneficialOwnerRatio)}</span>
                  <span className="group relative inline-flex" title="若持股比例<25%，则非受益所有人">
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                    <span className="pointer-events-none absolute left-1/2 top-6 z-20 hidden w-64 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold leading-5 text-slate-600 shadow-xl group-hover:block">
                      若持股比例&lt;25%，则非受益所有人
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {hasOtherBeneficialOwners === '是' ? (
        otherBeneficialOwners.length ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <h5 className="text-sm font-bold text-slate-950">其他受益所有人</h5>
            <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {otherBeneficialOwners.map((owner) => (
                <div key={owner.id || owner.name} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-950">{ownerDisplayName(owner)}</span>
                    <Badge variant="secondary">{owner.role || owner.relationship || '其他受益所有人'}</Badge>
                  </div>
                  <div className="mt-2 grid gap-1 text-xs font-semibold text-slate-500">
                    <span>持股比例：{formatValue(owner.beneficialOwnerRatio)}</span>
                    <span>资料状态：{owner.status || '系统已获取'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-800">
            {listError || '系统显示存在其他受益所有人，但名单资料未获取。需通过企业资料变更提交，提交后进入人工审核。'}
          </div>
        )
      ) : hasOtherBeneficialOwners === '否' ? (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-800">
          系统显示暂无其他受益所有人；如需新增或变更，请通过企业资料变更流程提交并进入人工审核。
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-800">
          系统尚未获取“贵公司是否还有其他受益所有人”的确认结果，请先通过企业资料变更补充并进入人工审核。
        </div>
      )}
    </div>
  )
}

function Section({ id, title, description, badge, tone = 'secondary', action, children }) {
  return (
    <section id={id} className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-slate-950">{title}</h4>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {action}
          <Badge variant={tone}>{badge}</Badge>
        </div>
      </div>
      {children}
    </section>
  )
}

function itemByPath(items, group, path) {
  return items.find((item) => item.group === group && item.path === path)
}

function EmptyFilteredState() {
  return (
    <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
      该模块暂无待补或需修正字段。
    </div>
  )
}

function ModuleFieldGrid({ data, fields, group, sections, errors, onChange, onFileChange, onlyProblems = false, editable = true, uploadExisting = true }) {
  const visibleFields = onlyProblems && editable
    ? fields.filter((field) => itemByPath(sections.missing, group, field.path) || itemByPath(sections.revision, group, field.path))
    : fields

  if (!visibleFields.length) {
    return <EmptyFilteredState />
  }

  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {visibleFields.map((field) => {
        const missingItem = itemByPath(sections.missing, group, field.path)
        const revisionItem = itemByPath(sections.revision, group, field.path)
        const acquiredItem = itemByPath(sections.acquired, group, field.path)
        const item = missingItem || revisionItem || acquiredItem || { ...field, id: `${group}:${field.path}`, group, value: getByPath(data, field.path) }
        const file = getByPath(data, field.path)
        if (field.inputType === 'file') {
          if (!editable || (file?.fileId && !uploadExisting)) {
            return <FieldValue key={item.id} item={{ ...item, value: file }} />
          }
          return (
            <UploadEditor
              key={item.id}
              item={item}
              file={file}
              error={errors[item.id] || errors[item.path]}
              onFileChange={onFileChange}
            />
          )
        }
        if (!editable) {
          return <FieldValue key={item.id} item={item} />
        }
        if (missingItem) {
          return <TextEditor key={item.id} item={item} value={getByPath(data, field.path)} error={errors[item.id] || errors[item.path]} onChange={onChange} />
        }
        if (revisionItem && shouldRenderAsPlainValue(revisionItem)) {
          return <FieldValue key={item.id} item={item} />
        }
        if (revisionItem) {
          return <RevisionNotice key={item.id} item={item} />
        }
        return <FieldValue key={item.id} item={item} />
      })}
    </div>
  )
}

function PersonCard({ data, person, collectionKey, type, index, sections, errors, focusedGroup, onlyProblems, onChange, onFileChange, canSupplement = true }) {
  const [open, setOpen] = useState(index === 0)
  const group = `${type}${index + 1}：${person.firstName || ''} ${person.lastName || ''}`.trim()
  const fields = type === '股东' ? [...personFields, ...shareholderExtraFields] : personFields
  const pathPrefix = `${collectionKey}.${index}.`
  const cardFields = fields.map((field) => ({ ...field, path: `${pathPrefix}${field.path}` }))
  const cardAttachments = personAttachmentFields.map((field) => ({ ...field, inputType: 'file', path: `${pathPrefix}${field.path}` }))
  const missingItems = sections.missing.filter((item) => item.group === group)
  const revisionItems = sections.revision.filter((item) => item.group === group)
  const missingNames = missingItems.map((item) => item.label.split(' ')[0].replace(/attachment/, '')).slice(0, 4)
  const status = canSupplement ? getModuleStatus(missingItems.length, revisionItems.length) : { label: '只读', tone: 'secondary' }
  const currentPerson = isCurrentApplicant(data, person)
  const roleBadges = getPersonRoleLabels(person)

  useEffect(() => {
    if (focusedGroup === group) {
      setOpen(true)
    }
  }, [focusedGroup, group])

  return (
    <div id={`${collectionKey === 'shareholders' ? 'shareholder' : 'director'}-${index}`} className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <UsersRound className="h-5 w-5" />
          </span>
          <span>
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-950">{type}{index + 1}：{personDisplayName(person) || '未填写'}</span>
              {roleBadges.map((role) => <Badge key={role} variant="secondary">{role}</Badge>)}
              {currentPerson ? <Badge variant="success">当前用户</Badge> : null}
            </span>
            <span className="mt-1 block text-xs text-slate-500">
              {canSupplement ? (
                <>
                  {missingItems.length ? `缺失：${missingNames.join('、')}${missingItems.length > 4 ? '…' : ''}` : '缺失：无'}
                  {revisionItems.length ? `｜需转换：${revisionItems.length} 项` : ''}
                </>
              ) : '系统已有资料只读展示，缺失项不在本页补充'}
            </span>
          </span>
        </span>
        <span className="flex items-center gap-2">
          <Badge variant={status.tone}>{status.label}</Badge>
          <ChevronDown className={open ? 'h-4 w-4 rotate-180 text-slate-400' : 'h-4 w-4 text-slate-400'} />
        </span>
      </button>
      {open ? (
        <div className="border-t border-slate-100 p-4">
          <ModuleFieldGrid data={data} fields={cardFields} group={group} sections={sections} errors={errors} onChange={onChange} onFileChange={onFileChange} onlyProblems={onlyProblems} editable={canSupplement} />
          <ModuleFieldGrid data={data} fields={cardAttachments} group={group} sections={sections} errors={errors} onChange={onChange} onFileChange={onFileChange} onlyProblems={onlyProblems} editable={canSupplement} uploadExisting={collectionKey !== 'directors'} />
        </div>
      ) : null}
    </div>
  )
}

function checklistGroup(item) {
  if (item.group === '企业基础资料') return '企业基础资料'
  if (item.group === '企业董事') return '企业董事'
  if (item.group === '受益所有人确认') return '受益所有人确认'
  if (item.group.startsWith('股东')) return '股东信息'
  return item.group
}

function ChecklistModal({ items, onClose, onJump }) {
  const groups = ['企业基础资料', '企业董事', '受益所有人确认', '股东信息']
    .map((group) => [group, items.filter((item) => checklistGroup(item) === group)])
    .filter(([, groupItems]) => groupItems.length)

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="flex max-h-[86vh] w-full max-w-[760px] flex-col overflow-hidden rounded-3xl bg-[#f8fafc] shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-blue-500">Supplement Checklist</div>
            <h3 className="mt-1 text-xl font-bold text-slate-950">待补 / 需修正清单</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">点击后定位到正文对应字段，填写仍在模块内完成。</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 overflow-auto p-5">
          {groups.length ? groups.map(([group, groupItems]) => (
            <section key={group} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-bold text-slate-950">{group}</h4>
                <Badge variant="warning">{groupItems.length} 项</Badge>
              </div>
              <div className="mt-3 grid gap-2">
                {groupItems.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="text-sm font-semibold text-slate-900">{item.label}</div>
                    <div className="mt-1 text-xs leading-5 text-slate-500">{item.group}</div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <Badge variant={item.inputType === 'file' ? 'warning' : item.error ? 'danger' : 'secondary'}>
                        {item.inputType === 'file' ? '待上传' : item.error?.includes('格式') || item.error?.includes('转换') || item.error?.includes('映射') ? '需修正' : '待填写'}
                      </Badge>
                      <Button type="button" size="sm" onClick={() => onJump(item)} className="rounded-lg bg-blue-600 hover:bg-blue-700">
                        {item.inputType === 'file' ? '去上传' : '去填写'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )) : (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">当前没有待补或需修正字段。</div>
          )}
        </div>
      </div>
    </div>
  )
}

export function BaasEnterpriseOpeningApplication({ onRegisterActions, onStatsChange, onSubmitSuccess }) {
  const [data, setData] = useState(mockEnterpriseApplication)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const [checklistOpen, setChecklistOpen] = useState(false)
  const [focusedGroup, setFocusedGroup] = useState('')
  const [onlyProblems, setOnlyProblems] = useState({ base: false, shareholders: false, directors: false })

  const sections = useMemo(() => getEnterpriseSections(data), [data])
  const isListedCompany = data.isListedCompany === '是'
  const companyFileFields = getCompanyAttachmentFields(data).map((field) => ({ ...field, inputType: 'file' }))
  const enterpriseBaseFields = [...companyBaseFields, ...registrationAddressFields]
  const actionItems = useMemo(() => [...sections.missing, ...sections.revision], [sections.missing, sections.revision])

  useEffect(() => {
    onStatsChange?.({
      acquired: sections.acquired.length,
      missing: sections.missing.length,
      revision: sections.revision.length,
    })
  }, [onStatsChange, sections.acquired.length, sections.missing.length, sections.revision.length])

  const changeValue = (path, value, itemId) => {
    setData((current) => setByPath(current, path, value))
    setErrors((current) => ({ ...current, [path]: '', [itemId]: '' }))
  }

  const changeApplicantRole = (role) => {
    setData((current) => {
      const person = current.directors.find((item) => item.roles?.includes(role))
      return {
        ...current,
        currentApplicant: {
          ...current.currentApplicant,
          role,
          personId: person?.id || '',
          matchStatus: person ? 'matched' : 'unmatched',
        },
      }
    })
    setErrors((current) => Object.fromEntries(
      Object.entries(current).filter(([key]) => !key.startsWith('企业董事:') && !key.startsWith('directors.')),
    ))
    setFocusedGroup('')
  }

  const changeBaseValue = (path, value, itemId) => {
    setData((current) => {
      let next = setByPath(current, path, value)
      if (path === 'isListedCompany' && value !== '是') {
        listedCompanyFields.forEach((fieldPath) => {
          next = setByPath(next, fieldPath, '')
        })
      }
      if (path === 'hasOfficialWebsite') {
        next = setByPath(next, value === '有网站' ? 'businessDescription' : 'officialWebsite', '')
      }
      return next
    })
    setErrors((current) => {
      const next = { ...current, [path]: '', [itemId]: '' }
      if (path === 'isListedCompany' && value !== '是') {
        listedCompanyFields.forEach((fieldPath) => {
          next[fieldPath] = ''
          next[`企业基础资料:${fieldPath}`] = ''
        })
      }
      if (path === 'hasOfficialWebsite') {
        next.officialWebsite = ''
        next.businessDescription = ''
        next['企业基础资料:officialWebsite'] = ''
        next['企业基础资料:businessDescription'] = ''
      }
      return next
    })
  }

  const copyRegistrationAddress = () => {
    setData((current) => {
      let next = setByPath(current, 'operatingAddress.country', current.registrationPlace || '')
      next = setByPath(next, 'operatingAddress.state', current.registrationAddress?.state || '')
      next = setByPath(next, 'operatingAddress.city', current.registrationAddress?.city || '')
      next = setByPath(next, 'operatingAddress.addressLine1', current.registrationAddress?.addressLine1 || '')
      next = setByPath(next, 'operatingAddress.postalCode', current.registrationAddress?.postalCode || '')
      return next
    })
    setErrors((current) => ({
      ...current,
      'operatingAddress.country': '',
      'operatingAddress.state': '',
      'operatingAddress.city': '',
      'operatingAddress.addressLine1': '',
      'operatingAddress.postalCode': '',
      '企业基础资料:operatingAddress.country': '',
      '企业基础资料:operatingAddress.state': '',
      '企业基础资料:operatingAddress.city': '',
      '企业基础资料:operatingAddress.addressLine1': '',
      '企业基础资料:operatingAddress.postalCode': '',
    }))
  }

  const changeFile = (path, file, itemId, fieldConfig = {}) => {
    if (!file) return
    const isPassportUpload = path.startsWith('directors.') && (
      path.endsWith('attachments.attachmentIdentity') || path.endsWith('attachments.attachmentPassportHolding')
    )
    const allowedTypes = fieldConfig.acceptedTypes || (isPassportUpload ? passportAcceptedTypes : acceptedTypes)
    const allowedExtensions = fieldConfig.allowedExtensions || (isPassportUpload ? ['jpg', 'jpeg', 'png'] : ['pdf', 'jpg', 'jpeg', 'png'])
    const extension = file.name.split('.').pop()?.toLowerCase()
    const limit = fieldConfig.fileLimit || (isPassportUpload ? passportFileLimit : fileLimit)
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
      const message = isPassportUpload
        ? '仅支持 JPG、JPEG、PNG 格式。'
        : `仅支持 ${allowedExtensions.map((item) => item.toUpperCase()).join(' / ')} 文件。`
      setErrors((current) => ({ ...current, [path]: message, [itemId]: message }))
      return
    }
    if (file.size > limit) {
      const message = `文件大小不能超过${Math.round(limit / 1024 / 1024)}MB。`
      setErrors((current) => ({ ...current, [path]: message, [itemId]: message }))
      return
    }
    setData((current) => setByPath(current, path, createMockEnterpriseFile(file)))
    setErrors((current) => ({ ...current, [path]: '', [itemId]: '' }))
  }

  const saveDraft = () => {
    setNotice('草稿已保存。')
  }

  const jumpToItem = (item) => {
    setChecklistOpen(false)
    setFocusedGroup(item.group)
    window.setTimeout(() => {
      const fallbackId = item.group === '企业董事'
        ? 'enterprise-directors'
        : item.group === '受益所有人确认'
          ? 'enterprise-beneficial-owners'
          : item.group.startsWith('股东')
            ? `shareholder-${Math.max(Number(item.group.match(/^股东(\d+)/)?.[1] || 1) - 1, 0)}`
            : ''
      const target = document.getElementById(fieldDomId(item)) || document.getElementById(fallbackId)
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
  }

  const jumpToNextItem = () => {
    if (actionItems.length) {
      jumpToItem(actionItems[0])
    } else {
      setNotice('当前没有待补或需修正字段。')
    }
  }

  const submit = () => {
    const nextErrors = validateEnterpriseApplication(data)
    setErrors(nextErrors)
    setNotice('')
    if (Object.keys(nextErrors).length) {
      setChecklistOpen(true)
      setNotice('仍有资料待补充或需修正，请查看清单并定位到对应模块处理。')
      return false
    }
    onSubmitSuccess()
    return true
  }

  useEffect(() => {
    onRegisterActions?.({
      openChecklist: () => setChecklistOpen(true),
      nextItem: jumpToNextItem,
      saveDraft,
      submit,
    })
  }, [onRegisterActions, data, errors, actionItems])

  const toggleOnlyProblems = (key) => {
    setOnlyProblems((current) => ({ ...current, [key]: !current[key] }))
  }

  const filterButton = (key) => (
    <Button type="button" size="sm" onClick={() => toggleOnlyProblems(key)} variant="outline" className="rounded-lg">
      {onlyProblems[key] ? '显示全部字段' : '只看待补项'}
    </Button>
  )

  const baseMissing = sections.missing.filter((item) => item.group === '企业基础资料').length
  const baseRevision = sections.revision.filter((item) => item.group === '企业基础资料').length
  const baseStatus = getModuleStatus(baseMissing, baseRevision)
  const directorMissing = sections.missing.filter((item) => item.group === '企业董事').length
  const directorRevision = sections.revision.filter((item) => item.group === '企业董事').length
  const directorStatus = getModuleStatus(directorMissing, directorRevision)
  const beneficialOwnerMissing = sections.missing.filter((item) => item.group === '受益所有人确认').length
  const beneficialOwnerRevision = sections.revision.filter((item) => item.group === '受益所有人确认').length
  const beneficialOwnerStatus = getModuleStatus(beneficialOwnerMissing, beneficialOwnerRevision)

  return (
    <div className="grid gap-5">
      {checklistOpen ? <ChecklistModal items={actionItems} onClose={() => setChecklistOpen(false)} onJump={jumpToItem} /> : null}
      {notice ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-800">
          <span>{notice}</span>
          {actionItems.length ? (
            <Button type="button" size="sm" onClick={() => setChecklistOpen(true)} className="rounded-lg bg-blue-600 hover:bg-blue-700">
              查看清单
            </Button>
          ) : null}
        </div>
      ) : null}

      <Section
        id="enterprise-base"
        title="企业基础资料"
        description="企业主体字段、银行地址和企业文件统一在本模块确认和补充，避免与股东/董事资料混在一起。"
        badge={baseStatus.label}
        tone={baseStatus.tone}
        action={filterButton('base')}
      >
        <EnterpriseBaseForm
          data={data}
          fields={enterpriseBaseFields}
          companyFileFields={companyFileFields}
          sections={sections}
          errors={errors}
          isListedCompany={isListedCompany}
          onChange={changeBaseValue}
          onFileChange={changeFile}
          onCopyRegistrationAddress={copyRegistrationAddress}
          onlyProblems={onlyProblems.base}
        />
        {isListedCompany ? (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <h5 className="text-sm font-bold text-slate-950">企业文件</h5>
            <ModuleFieldGrid data={data} fields={companyFileFields} group="企业基础资料" sections={sections} errors={errors} onChange={changeValue} onFileChange={changeFile} onlyProblems={onlyProblems.base} />
          </div>
        ) : null}
      </Section>

      <Section
        id="enterprise-directors"
        title="企业董事"
        description="身份由用户主动选择，系统已有资料只读展示，仅补充当前身份下缺失的中文姓名、护照文件和手持护照照片。"
        badge={directorStatus.label}
        tone={directorStatus.tone}
      >
        <EnterpriseDirectorModule
          data={data}
          sections={sections}
          errors={errors}
          onRoleChange={changeApplicantRole}
          onChange={changeValue}
          onFileChange={changeFile}
        />
      </Section>

      <Section
        id="enterprise-beneficial-owners"
        title="受益所有人确认"
        description="仅展示系统已有受益所有人判断和名单；新增或变更需通过企业资料变更并进入人工审核。"
        badge={beneficialOwnerStatus.label}
        tone={beneficialOwnerStatus.tone}
      >
        <BeneficialOwnerConfirmation data={data} sections={sections} errors={errors} />
      </Section>

      <Section
        id="enterprise-shareholders"
        title="股东信息"
        description="每个股东只展示自己的缺失项和需转换项，避免附件归属混乱。"
        badge={`${data.shareholders.length} 名`}
        action={filterButton('shareholders')}
      >
        <div className="mt-4 grid gap-3">
          {data.shareholders.map((person, index) => (
            <PersonCard
              key={person.id}
              data={data}
              person={person}
              collectionKey="shareholders"
              type="股东"
              index={index}
              sections={sections}
              errors={errors}
              focusedGroup={focusedGroup}
              onlyProblems={onlyProblems.shareholders}
              onChange={changeValue}
              onFileChange={changeFile}
            />
          ))}
          {errors.shareholders ? <div className="text-sm font-semibold text-red-600">{errors.shareholders}</div> : null}
        </div>
      </Section>

      {Object.keys(errors).some((key) => errors[key]) ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-700">
          请到对应模块补充缺失资料、上传必填附件，并处理字段格式转换提示后再提交。
        </div>
      ) : null}
    </div>
  )
}
