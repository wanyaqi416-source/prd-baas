import { ChevronDown, Download, FileUp, UsersRound, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import {
  buildEnterpriseLegalEntityPayload,
  businessAddressFields,
  businessAttachmentFields,
  businessInfoFields,
  createBlankShareholder,
  createMockEnterpriseFile,
  enterpriseIdentityFields,
  getByPath,
  getEnterpriseSections,
  mockEnterpriseApplication,
  personAddressFields,
  personAttachmentFields,
  personInfoFields,
  setByPath,
  shareholderAddressFields,
  shareholderAttachmentFields,
  shareholderPersonFields,
  shareholderRatioField,
  validateEnterpriseApplication,
} from '../data/baasEnterpriseOpeningApplication'

const fileLimit = 8 * 1024 * 1024
const acceptedExtensions = ['pdf', 'jpeg', 'png']

function getModuleStatus(missingCount, revisionCount) {
  if (missingCount > 0) return { label: `待补充 ${missingCount} 项`, tone: 'warning' }
  if (revisionCount > 0) return { label: `需修正 ${revisionCount} 项`, tone: 'danger' }
  return { label: '已完成', tone: 'success' }
}

function formatValue(value) {
  if (Array.isArray(value)) return value.length ? value.join('、') : '—'
  if (value?.name) return value.name
  if (value?.fileId) return value.fileId
  return value || '—'
}

function hasFieldValue(value) {
  if (Array.isArray(value)) return value.length > 0
  if (value?.fileId) return true
  return String(value || '').trim().length > 0
}

function isFidereAcquired(field, value) {
  return field.source === 'fidere' && hasFieldValue(value)
}

function isFieldReadOnly(field, value) {
  return Boolean(field.readOnly || isFidereAcquired(field, value))
}

function fieldDomId(item) {
  return `enterprise-field-${item.id.replace(/[^A-Za-z0-9_-]/g, '-')}`
}

function itemByPath(items, group, path) {
  return items.find((item) => item.group === group && item.path === path)
}

function sanitizeFieldValue(field, value) {
  if (field.sanitize === 'digits') return value.replace(/\D/g, '').slice(0, field.maxLength || undefined)
  if (field.validation === 'countryCode') return value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2)
  if (field.validation === 'phonePrefix') {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    return digits ? `+${digits}` : ''
  }
  return value
}

function sourceBadge(field, value) {
  if (isFidereAcquired(field, value)) return <Badge variant="success">Fidere已获取</Badge>
  if (field.required === false) return <Badge variant="secondary">可选</Badge>
  return <Badge variant="warning">补充资料</Badge>
}

function FieldLabel({ field, value }) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-slate-500">{field.label}</span>
      {sourceBadge(field, value)}
    </span>
  )
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
    <div id={fieldDomId(item)} className="scroll-mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <FieldLabel field={item} value={item.value} />
      <div className="mt-1 min-h-6 text-sm font-bold text-slate-950">{formatValue(item.value)}</div>
      {item.hint ? <div className="mt-1 text-xs leading-5 text-slate-400">{item.hint}</div> : null}
      {item.value?.status ? <div className="mt-1 text-xs font-semibold text-emerald-700">{item.value.status}</div> : null}
      {item.value?.downloadUrl ? (
        <div className="mt-3">
          <DownloadButton file={item.value} />
        </div>
      ) : null}
    </div>
  )
}

function RevisionNotice({ item }) {
  return (
    <div id={fieldDomId(item)} className="scroll-mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
      <FieldLabel field={item} value={item.value} />
      <div className="mt-1 min-h-6 text-sm font-bold text-slate-950">{formatValue(item.value)}</div>
      <div className="mt-1 text-xs leading-5 text-red-700">{item.error}</div>
    </div>
  )
}

function TextEditor({ item, value, error, onChange }) {
  const inputClass = error
    ? 'mt-2 h-11 w-full rounded-lg border border-red-300 bg-red-50 px-3 text-sm font-semibold text-slate-950 outline-none focus:border-red-400'
    : 'mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-400'

  if (item.inputType === 'select') {
    return (
      <label id={fieldDomId(item)} className="block scroll-mt-8 rounded-xl border border-slate-200 bg-white p-4">
        <FieldLabel field={item} value={value} />
        <select value={value || ''} onChange={(event) => onChange(item.path, event.target.value, item.id)} className={inputClass}>
          <option value="">请选择</option>
          {(item.options || []).map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        {item.hint ? <span className="mt-1 block text-xs leading-5 text-slate-400">{item.hint}</span> : null}
        {error ? <span className="mt-1 block text-xs leading-5 text-red-600">{error}</span> : null}
      </label>
    )
  }

  return (
    <label id={fieldDomId(item)} className="block scroll-mt-8 rounded-xl border border-slate-200 bg-white p-4">
      <FieldLabel field={item} value={value} />
      <input
        value={value || ''}
        type={item.validation === 'email' ? 'email' : item.validation === 'date' ? 'date' : 'text'}
        inputMode={item.sanitize === 'digits' || item.validation === 'phone' ? 'numeric' : undefined}
        onChange={(event) => onChange(item.path, sanitizeFieldValue(item, event.target.value), item.id)}
        placeholder={item.placeholder || item.hint || '请输入'}
        className={inputClass}
      />
      {item.hint ? <span className="mt-1 block text-xs leading-5 text-slate-400">{item.hint}</span> : null}
      {error ? <span className="mt-1 block text-xs leading-5 text-red-600">{error}</span> : null}
    </label>
  )
}

function UploadEditor({ item, file, error, onFileChange }) {
  const accept = item.accept || '.pdf,.jpeg,.png,application/pdf,image/jpeg,image/png'
  const acceptDescription = item.acceptDescription || '支持 PDF / JPEG / PNG，单个文件大小限制 8MB。'

  return (
    <div id={fieldDomId(item)} className={error ? 'scroll-mt-8 rounded-xl border border-red-200 bg-red-50 p-4' : 'scroll-mt-8 rounded-xl border border-slate-200 bg-white p-4'}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-slate-950">{item.label}</span>
            {sourceBadge(item, file)}
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

function EmptyFilteredState() {
  return (
    <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
      该模块暂无待补或需修正字段。
    </div>
  )
}

function ModuleFieldGrid({ data, fields, group, sections, errors, onChange, onFileChange, onlyProblems = false }) {
  const visibleFields = onlyProblems
    ? fields.filter((field) => itemByPath(sections.missing, group, field.path) || itemByPath(sections.revision, group, field.path))
    : fields

  if (!visibleFields.length) {
    return <EmptyFilteredState />
  }

  return (
    <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {visibleFields.map((field) => {
        const missingItem = itemByPath(sections.missing, group, field.path)
        const revisionItem = itemByPath(sections.revision, group, field.path)
        const acquiredItem = itemByPath(sections.acquired, group, field.path)
        const value = getByPath(data, field.path)
        const item = missingItem || revisionItem || acquiredItem || { ...field, id: `${group}:${field.path}`, group, value }
        const readOnly = isFieldReadOnly(field, value)

        if (field.inputType === 'file') {
          if (readOnly) {
            return <FieldValue key={item.id} item={{ ...item, value }} />
          }
          return (
            <UploadEditor
              key={item.id}
              item={item}
              file={value}
              error={errors[item.id] || errors[item.path]}
              onFileChange={onFileChange}
            />
          )
        }

        if (revisionItem && readOnly) {
          return <RevisionNotice key={item.id} item={item} />
        }

        if (readOnly) {
          return <FieldValue key={item.id} item={{ ...item, value }} />
        }

        return (
          <TextEditor
            key={item.id}
            item={item}
            value={value}
            error={errors[item.id] || errors[item.path]}
            onChange={onChange}
          />
        )
      })}
    </div>
  )
}

function FieldGroups({ data, fields, group, sections, errors, onChange, onFileChange, onlyProblems }) {
  const sectionNames = [...new Set(fields.map((field) => field.section))]
  const hasVisibleProblem = !onlyProblems || fields.some((field) => itemByPath(sections.missing, group, field.path) || itemByPath(sections.revision, group, field.path))

  if (!hasVisibleProblem) return <EmptyFilteredState />

  return (
    <div className="mt-5 grid gap-5">
      {sectionNames.map((section) => {
        const sectionFields = fields.filter((field) => field.section === section)
        if (onlyProblems && !sectionFields.some((field) => itemByPath(sections.missing, group, field.path) || itemByPath(sections.revision, group, field.path))) {
          return null
        }
        return (
          <div key={section} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <h5 className="text-sm font-bold text-slate-950">{section}</h5>
            <ModuleFieldGrid
              data={data}
              fields={sectionFields}
              group={group}
              sections={sections}
              errors={errors}
              onChange={onChange}
              onFileChange={onFileChange}
              onlyProblems={onlyProblems}
            />
          </div>
        )
      })}
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

function shareholderDisplayName(shareholder) {
  const person = shareholder.personInfo || {}
  return `${person.firstName || '未填写'} ${person.lastName || ''}`.trim()
}

function shareholderGroup(shareholder, index) {
  const person = shareholder.personInfo || {}
  return `股东${index + 1}：${person.firstName || ''} ${person.lastName || ''}`.trim()
}

function shareholderFields(index) {
  return [
    { ...shareholderRatioField, path: `shareholders.${index}.${shareholderRatioField.path}` },
    ...shareholderPersonFields.map((field) => ({ ...field, path: `shareholders.${index}.${field.path}` })),
    ...shareholderAddressFields.map((field) => ({ ...field, path: `shareholders.${index}.${field.path}` })),
    ...shareholderAttachmentFields.map((field) => ({ ...field, path: `shareholders.${index}.${field.path}` })),
  ]
}

function ShareholderCard({ data, shareholder, index, sections, errors, focusedGroup, onlyProblems, onChange, onFileChange }) {
  const [open, setOpen] = useState(index === 0)
  const group = shareholderGroup(shareholder, index)
  const fields = shareholderFields(index)
  const missingItems = sections.missing.filter((item) => item.group === group)
  const revisionItems = sections.revision.filter((item) => item.group === group)
  const missingNames = missingItems.map((item) => item.label).slice(0, 4)
  const status = getModuleStatus(missingItems.length, revisionItems.length)

  useEffect(() => {
    if (focusedGroup === group || focusedGroup === '股东信息') {
      setOpen(true)
    }
  }, [focusedGroup, group])

  return (
    <div id={`shareholder-${index}`} className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <UsersRound className="h-5 w-5" />
          </span>
          <span>
            <span className="font-bold text-slate-950">股东{index + 1}：{shareholderDisplayName(shareholder)}</span>
            <span className="mt-1 block text-xs text-slate-500">
              {missingItems.length ? `缺失：${missingNames.join('、')}${missingItems.length > 4 ? '…' : ''}` : '缺失：无'}
              {revisionItems.length ? `｜需修正：${revisionItems.length} 项` : ''}
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
          <FieldGroups
            data={data}
            fields={fields}
            group={group}
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
}

function checklistGroup(item) {
  if (item.group.startsWith('股东')) return '股东信息'
  return item.group
}

function ChecklistModal({ items, onClose, onJump }) {
  const groups = ['企业信息', '法人代表信息', '股东信息']
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
                        {item.inputType === 'file' ? '待上传' : item.error?.includes('格式') || item.error?.includes('修正') || item.error?.includes('代码') ? '需修正' : '待填写'}
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
  const [lastPayload, setLastPayload] = useState(null)
  const [onlyProblems, setOnlyProblems] = useState({ business: false, person: false, shareholders: false })

  const sections = useMemo(() => getEnterpriseSections(data), [data])
  const businessFields = useMemo(() => [...enterpriseIdentityFields, ...businessInfoFields, ...businessAddressFields, ...businessAttachmentFields], [])
  const legalPersonFields = useMemo(() => [...personInfoFields, ...personAddressFields, ...personAttachmentFields], [])
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
    setLastPayload(null)
  }

  const changeFile = (path, file, itemId, fieldConfig = {}) => {
    if (!file) return
    const allowedFileExtensions = fieldConfig.allowedExtensions || acceptedExtensions
    const extension = file.name.split('.').pop()?.toLowerCase()
    const limit = fieldConfig.fileLimit || fileLimit

    if (!allowedFileExtensions.includes(extension)) {
      const message = `仅支持 ${allowedFileExtensions.map((item) => item.toUpperCase()).join(' / ')} 文件。`
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
    setLastPayload(null)
  }

  const addShareholder = () => {
    setData((current) => ({ ...current, shareholders: [...(current.shareholders || []), createBlankShareholder()] }))
    setLastPayload(null)
  }

  const saveDraft = () => {
    setNotice('草稿已保存。')
  }

  const jumpToItem = (item) => {
    setChecklistOpen(false)
    setFocusedGroup(item.group)
    window.setTimeout(() => {
      const fallbackId = item.group === '企业信息'
        ? 'enterprise-business'
        : item.group === '法人代表信息'
          ? 'enterprise-legal-person'
          : item.group.startsWith('股东')
            ? `shareholder-${Math.max(Number(item.group.match(/^股东(\d+)/)?.[1] || 1) - 1, 0)}`
            : 'enterprise-shareholders'
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

    const payload = buildEnterpriseLegalEntityPayload(data)
    setLastPayload(payload)
    onSubmitSuccess?.()
    return true
  }

  useEffect(() => {
    onRegisterActions?.({
      openChecklist: () => setChecklistOpen(true),
      nextItem: jumpToNextItem,
      saveDraft,
      submit,
    })
  }, [onRegisterActions, data, actionItems])

  const toggleOnlyProblems = (key) => {
    setOnlyProblems((current) => ({ ...current, [key]: !current[key] }))
  }

  const filterButton = (key) => (
    <Button type="button" size="sm" onClick={() => toggleOnlyProblems(key)} variant="outline" className="rounded-lg">
      {onlyProblems[key] ? '显示全部字段' : '只看待补项'}
    </Button>
  )

  const countForGroup = (items, group) => items.filter((item) => item.group === group || (group === '股东信息' && item.group.startsWith('股东'))).length
  const businessStatus = getModuleStatus(countForGroup(sections.missing, '企业信息'), countForGroup(sections.revision, '企业信息'))
  const personStatus = getModuleStatus(countForGroup(sections.missing, '法人代表信息'), countForGroup(sections.revision, '法人代表信息'))
  const shareholderStatus = getModuleStatus(countForGroup(sections.missing, '股东信息'), countForGroup(sections.revision, '股东信息'))

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

      {lastPayload ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          已生成 COMPANY legal-entity payload：企业文件、法人代表和股东信息均已按最终结构整理。
        </div>
      ) : null}

      <Section
        id="enterprise-business"
        title="企业信息"
        description="展示 personType、businessInfo 基本信息、注册地址和企业文件；Fidere 已获取字段只读，缺失字段在本模块补充。"
        badge={businessStatus.label}
        tone={businessStatus.tone}
        action={filterButton('business')}
      >
        <FieldGroups
          data={data}
          fields={businessFields}
          group="企业信息"
          sections={sections}
          errors={errors}
          onChange={changeValue}
          onFileChange={changeFile}
          onlyProblems={onlyProblems.business}
        />
      </Section>

      <Section
        id="enterprise-legal-person"
        title="法人代表信息"
        description="法人代表/负责人使用通用个人信息结构 personInfo；本模块直接维护最终提交所需的负责人资料。"
        badge={personStatus.label}
        tone={personStatus.tone}
        action={filterButton('person')}
      >
        <FieldGroups
          data={data}
          fields={legalPersonFields}
          group="法人代表信息"
          sections={sections}
          errors={errors}
          onChange={changeValue}
          onFileChange={changeFile}
          onlyProblems={onlyProblems.person}
        />
      </Section>

      <Section
        id="enterprise-shareholders"
        title="股东信息"
        description="每个股东最终提交为 { ratio, personInfo }；股东比例范围为 0 到 1，所有股东比例总和不能超过 1。"
        badge={data.shareholders?.length ? `${data.shareholders.length} 名 · ${shareholderStatus.label}` : shareholderStatus.label}
        tone={shareholderStatus.tone}
        action={(
          <div className="flex flex-wrap items-center gap-2">
            {filterButton('shareholders')}
            <Button type="button" size="sm" onClick={addShareholder} variant="outline" className="rounded-lg">
              添加股东
            </Button>
          </div>
        )}
      >
        <div className="mt-4 grid gap-3">
          {(data.shareholders || []).map((shareholder, index) => (
            <ShareholderCard
              key={shareholder.id}
              data={data}
              shareholder={shareholder}
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
          {errors['股东信息:shareholdersRatioTotal'] ? <div className="text-sm font-semibold text-red-600">{errors['股东信息:shareholdersRatioTotal']}</div> : null}
        </div>
      </Section>

      {Object.keys(errors).some((key) => errors[key]) ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-700">
          请到对应模块补充缺失资料、上传必填附件，并处理字段格式修正提示后再提交。
        </div>
      ) : null}
    </div>
  )
}
