import { ChevronDown, Download, FileUp, UsersRound, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import {
  companyAttachmentFields,
  companyBaseFields,
  createMockEnterpriseFile,
  getByPath,
  getEnterpriseSections,
  mockEnterpriseApplication,
  personAttachmentFields,
  personFields,
  registrationAddressFields,
  setByPath,
  shareholderExtraFields,
  validateEnterpriseApplication,
} from '../data/baasEnterpriseOpeningApplication'

const fileLimit = 8 * 1024 * 1024
const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png']

function getModuleStatus(missingCount, revisionCount) {
  if (missingCount > 0) return { label: `待补充 ${missingCount} 项`, tone: 'warning' }
  if (revisionCount > 0) return { label: `需转换 ${revisionCount} 项`, tone: 'danger' }
  return { label: '已完成', tone: 'success' }
}

function formatValue(value) {
  if (value?.name) return value.name
  return value || '—'
}

function fieldDomId(item) {
  return `enterprise-field-${item.id.replace(/[^A-Za-z0-9_-]/g, '-')}`
}

function shouldShowFieldGroup(item) {
  return !item.group?.startsWith('股东')
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
      <div className="mt-1 text-xs leading-5 text-red-500">开发备注：该字段需在调取/提交 BaaS 前做格式转换或映射。</div>
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
          onChange={(event) => onChange(item.path, event.target.value, item.id)}
          placeholder={item.hint || '请输入'}
          className={error ? 'mt-2 h-11 w-full rounded-lg border border-red-300 bg-red-50 px-3 text-sm font-semibold text-slate-950 outline-none focus:border-red-400' : 'mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-400'}
        />
      )}
      {item.hint ? <span className="mt-1 block text-xs leading-5 text-slate-400">{item.hint}</span> : null}
      {error ? <span className="mt-1 block text-xs leading-5 text-red-600">{error}</span> : null}
    </label>
  )
}

function UploadEditor({ item, file, error, onFileChange }) {
  return (
    <div id={fieldDomId(item)} className={error ? 'scroll-mt-8 rounded-xl border border-red-200 bg-red-50 p-4' : 'scroll-mt-8 rounded-xl border border-slate-200 bg-white p-4'}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-slate-950">{item.label}</span>
            {shouldShowFieldGroup(item) ? <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">{item.group}</span> : null}
          </div>
          <div className="mt-1 text-xs leading-5 text-slate-500">
            {item.hint ? `${item.hint}；` : ''}支持 pdf / jpeg / png，单个文件大小限制 8M。
          </div>
          {file?.name ? <div className="mt-2 text-xs font-semibold text-blue-700">{file.name} · {file.status || '已上传'}</div> : null}
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
                onFileChange(item.path, event.target.files?.[0], item.id)
                event.target.value = ''
              }}
            />
          </label>
        </div>
      </div>
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

function ModuleFieldGrid({ data, fields, group, sections, errors, onChange, onFileChange, onlyProblems = false }) {
  const visibleFields = onlyProblems
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
        if (missingItem) {
          return field.inputType === 'file'
            ? <UploadEditor key={item.id} item={item} file={getByPath(data, field.path)} error={errors[item.id] || errors[item.path]} onFileChange={onFileChange} />
            : <TextEditor key={item.id} item={item} value={getByPath(data, field.path)} error={errors[item.id] || errors[item.path]} onChange={onChange} />
        }
        if (revisionItem) {
          return <RevisionNotice key={item.id} item={item} />
        }
        return <FieldValue key={item.id} item={item} />
      })}
    </div>
  )
}

function PersonCard({ data, person, collectionKey, type, index, sections, errors, focusedGroup, onlyProblems, onChange, onFileChange }) {
  const [open, setOpen] = useState(index === 0)
  const group = `${type}${index + 1}：${person.firstName || ''} ${person.lastName || ''}`.trim()
  const fields = type === '股东' ? [...personFields, ...shareholderExtraFields] : personFields
  const pathPrefix = `${collectionKey}.${index}.`
  const cardFields = fields.map((field) => ({ ...field, path: `${pathPrefix}${field.path}` }))
  const cardAttachments = personAttachmentFields.map((field) => ({ ...field, inputType: 'file', path: `${pathPrefix}${field.path}` }))
  const missingItems = sections.missing.filter((item) => item.group === group)
  const revisionItems = sections.revision.filter((item) => item.group === group)
  const missingNames = missingItems.map((item) => item.label.split(' ')[0].replace(/attachment/, '')).slice(0, 4)
  const status = getModuleStatus(missingItems.length, revisionItems.length)

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
            <span className="block font-bold text-slate-950">{type}{index + 1}：{person.firstName || '未填写'} {person.lastName || ''}</span>
            <span className="mt-1 block text-xs text-slate-500">
              {missingItems.length ? `缺失：${missingNames.join('、')}${missingItems.length > 4 ? '…' : ''}` : '缺失：无'}
              {revisionItems.length ? `｜需转换：${revisionItems.length} 项` : ''}
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
          <ModuleFieldGrid data={data} fields={cardFields} group={group} sections={sections} errors={errors} onChange={onChange} onFileChange={onFileChange} onlyProblems={onlyProblems} />
          <ModuleFieldGrid data={data} fields={cardAttachments} group={group} sections={sections} errors={errors} onChange={onChange} onFileChange={onFileChange} onlyProblems={onlyProblems} />
        </div>
      ) : null}
    </div>
  )
}

function checklistGroup(item) {
  if (item.group === '企业基础资料') return '企业基础资料'
  if (item.group.startsWith('股东')) return '股东信息'
  if (item.group.startsWith('董事/授权代表')) return '董事/授权代表信息'
  return item.group
}

function ChecklistDrawer({ items, onClose, onJump }) {
  const groups = ['企业基础资料', '股东信息', '董事/授权代表信息']
    .map((group) => [group, items.filter((item) => checklistGroup(item) === group)])
    .filter(([, groupItems]) => groupItems.length)

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-slate-950/35 backdrop-blur-sm">
      <aside className="h-full w-full max-w-[460px] overflow-auto bg-[#f8fafc] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-blue-500">Supplement Checklist</div>
            <h3 className="mt-1 text-xl font-bold text-slate-950">待补 / 需修正清单</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">点击后定位到正文对应字段，填写仍在模块内完成。</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 p-5">
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
      </aside>
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
  const companyFileFields = companyAttachmentFields.map((field) => ({ ...field, inputType: 'file' }))
  const enterpriseBaseFields = [...companyBaseFields, ...registrationAddressFields, ...companyFileFields]
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

  const changeFile = (path, file, itemId) => {
    if (!file) return
    if (!acceptedTypes.includes(file.type)) {
      setErrors((current) => ({ ...current, [path]: '仅支持 pdf / jpeg / png 文件。', [itemId]: '仅支持 pdf / jpeg / png 文件。' }))
      return
    }
    if (file.size > fileLimit) {
      setErrors((current) => ({ ...current, [path]: '单个文件大小不能超过 8M。', [itemId]: '单个文件大小不能超过 8M。' }))
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
      const target = document.getElementById(fieldDomId(item)) || document.getElementById(item.group.startsWith('股东') ? `shareholder-${Math.max(Number(item.group.match(/^股东(\d+)/)?.[1] || 1) - 1, 0)}` : '')
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

  return (
    <div className="grid gap-5">
      {checklistOpen ? <ChecklistDrawer items={actionItems} onClose={() => setChecklistOpen(false)} onJump={jumpToItem} /> : null}
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
        <ModuleFieldGrid data={data} fields={enterpriseBaseFields} group="企业基础资料" sections={sections} errors={errors} onChange={changeValue} onFileChange={changeFile} onlyProblems={onlyProblems.base} />
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

      <Section
        id="enterprise-directors"
        title="董事/授权代表"
        description="董事/授权代表资料按人员卡片展示，缺失附件在对应人员卡片内补充。"
        badge={`${data.directors.length} 名`}
        action={filterButton('directors')}
      >
        <div className="mt-4 grid gap-3">
          {data.directors.map((person, index) => (
            <PersonCard
              key={person.id}
              data={data}
              person={person}
              collectionKey="directors"
              type="董事/授权代表"
              index={index}
              sections={sections}
              errors={errors}
              focusedGroup={focusedGroup}
              onlyProblems={onlyProblems.directors}
              onChange={changeValue}
              onFileChange={changeFile}
            />
          ))}
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
