import { Building2, CheckCircle2, Download, FileUp, UserRound } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import {
  attachmentFields,
  createEmptyBaasApplication,
  createMockFile,
  getBaasApplicationSections,
  mockBaasOpeningProfile,
  validateBaasApplication,
  validatePersonalField,
} from '../data/baasOpeningApplication'
import { BaasEnterpriseOpeningApplication } from './BaasEnterpriseOpeningApplication'

const fileLimit = 8 * 1024 * 1024
const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png']

function FieldValue({ field, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">{field.label}</span>
        {field.note ? <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">{field.note}</span> : null}
      </div>
      <div className="mt-1 min-h-6 text-sm font-bold text-slate-950">{value || '—'}</div>
      {field.hint ? <div className="mt-1 text-xs leading-5 text-slate-400">{field.hint}</div> : null}
    </div>
  )
}

function TextInput({ field, value, error, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-500">{field.label}</span>
      <input
        value={value || ''}
        onChange={(event) => onChange(field.key, event.target.value)}
        placeholder={field.hint || '请输入'}
        className={error ? 'mt-2 h-11 w-full rounded-lg border border-red-300 bg-red-50 px-3 text-sm font-semibold text-slate-950 outline-none focus:border-red-400' : 'mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-400'}
      />
      {error ? <span className="mt-1 block text-xs leading-5 text-red-600">{error}</span> : null}
    </label>
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

function FileUploadInput({ field, file, error, onFileChange }) {
  return (
    <div className={error ? 'rounded-xl border border-red-200 bg-red-50 p-4' : 'rounded-xl border border-slate-200 bg-white p-4'}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-slate-950">{field.label}</div>
          <div className="mt-1 text-xs leading-5 text-slate-500">
            {field.hint ? `${field.hint}；` : ''}支持 pdf / jpeg / png，单个文件大小限制 8M。
          </div>
          {file ? (
            <div className="mt-2 text-xs font-semibold text-blue-700">{file.name} · {file.status || '已上传'} · {Math.max(file.size / 1024, 1).toFixed(0)} KB</div>
          ) : null}
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
                const nextFile = event.target.files?.[0]
                onFileChange(field.key, nextFile)
                event.target.value = ''
              }}
            />
          </label>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ title, badge, tone = 'secondary', children }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h4 className="text-base font-bold text-slate-950">{title}</h4>
        {children ? <p className="mt-1 text-sm leading-6 text-slate-500">{children}</p> : null}
      </div>
      <Badge variant={tone}>{badge}</Badge>
    </div>
  )
}

export function BaasOpeningApplicationModal({ onClose, onProceedToFee }) {
  const [accountType, setAccountType] = useState('personal')
  const [profileValues, setProfileValues] = useState(mockBaasOpeningProfile)
  const [supplementValues, setSupplementValues] = useState(createEmptyBaasApplication)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [enterpriseStats, setEnterpriseStats] = useState({ acquired: 0, missing: 0, revision: 0 })
  const [enterpriseActions, setEnterpriseActions] = useState(null)

  const sections = useMemo(() => getBaasApplicationSections(profileValues), [profileValues])

  const pendingAttachmentCount = attachmentFields.filter((field) => !supplementValues[field.key]?.fileId).length
  const pendingCount = sections.missing.length + pendingAttachmentCount
  const activeStats = accountType === 'enterprise'
    ? enterpriseStats
    : { acquired: sections.acquired.length, missing: pendingCount, revision: 0 }

  const changeProfileValue = (key, value) => {
    setProfileValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: validatePersonalField(key, value, { ...profileValues, [key]: value }) }))
  }

  const changeFile = (key, file) => {
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

  const saveDraft = () => {
    if (accountType === 'enterprise') {
      enterpriseActions?.saveDraft?.()
      return
    }
    setNotice('草稿已保存。本阶段为前端原型模拟，不会写入数据库。')
  }

  const submitApplication = () => {
    if (accountType === 'enterprise') {
      enterpriseActions?.submit?.()
      return
    }

    const nextErrors = validateBaasApplication(profileValues, supplementValues)
    setErrors(nextErrors)
    setNotice('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmitted(true)
  }

  const footer = (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4">
      {accountType === 'enterprise' ? (
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-600">
          <span>还有 {activeStats.missing} 项待补充 / {activeStats.revision} 项需修正</span>
          <Button type="button" onClick={() => enterpriseActions?.nextItem?.()} variant="outline" size="sm" className="rounded-lg">
            下一项
          </Button>
          <Button type="button" onClick={() => enterpriseActions?.openChecklist?.()} variant="outline" size="sm" className="rounded-lg">
            查看清单
          </Button>
        </div>
      ) : <div />}
      <div className="flex flex-wrap justify-end gap-3">
        <Button type="button" onClick={onClose} variant="outline" className="rounded-lg">
          取消
        </Button>
        <Button type="button" onClick={saveDraft} variant="outline" className="rounded-lg">
          保存草稿
        </Button>
        <Button type="button" onClick={submitApplication} className="rounded-lg bg-blue-600 hover:bg-blue-700">
          提交开户申请
        </Button>
      </div>
    </div>
  )

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
        <div className="w-full max-w-[480px] rounded-3xl bg-white p-6 shadow-2xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="mt-5 text-2xl font-bold text-slate-950">开户申请已提交</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{accountType === 'enterprise' ? '企业开户资料校验通过。本阶段为前端模拟提交，下一步进入开户费扣费确认。' : '个人开户资料校验通过。本阶段为前端模拟提交，下一步进入开户费扣费确认。'}</p>
          <div className="mt-6 flex gap-3">
            <Button type="button" onClick={onProceedToFee} className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700">
              继续扣费流程
            </Button>
            <Button type="button" onClick={onClose} variant="outline" className="rounded-lg">
              关闭
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-[1120px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-blue-500">BaaS Create Legal Entity</div>
              <h3 className="mt-1 text-2xl font-bold text-slate-950">BaaS 开户申请</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">先复用系统已有 KYC / Sumsub 资料，只补充 BaaS 必需但缺失的附件。带出的资料格式需要符合 BaaS Create Legal Entity API 要求。</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
              ×
            </button>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="text-xs font-semibold text-emerald-700">已获取资料</div>
              <div className="mt-1 text-2xl font-bold text-emerald-900">{activeStats.acquired} 项</div>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-amber-700">待补充资料</div>
                  <div className="mt-1 text-2xl font-bold text-amber-900">{activeStats.missing} 项</div>
                </div>
                {accountType === 'enterprise' ? (
                  <Button type="button" onClick={() => enterpriseActions?.openChecklist?.()} size="sm" className="rounded-lg bg-amber-600 hover:bg-amber-700">
                    查看清单
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <div className="text-xs font-semibold text-red-700">需修正资料</div>
              <div className="mt-1 text-2xl font-bold text-red-900">{activeStats.revision} 项</div>
            </div>
          </div>
        </div>

        <div className="overflow-auto bg-[#f8fafc] px-6 py-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader title="开户类型选择" badge={accountType === 'personal' ? '个人开户' : '企业开户'}>
              默认进入个人开户；切换企业开户后可查看企业 KYB 资料带出、补充和修正流程。
            </SectionHeader>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setAccountType('personal')
                  setNotice('')
                }}
                className={accountType === 'personal' ? 'flex items-center gap-3 rounded-2xl border border-blue-300 bg-blue-50 p-4 text-left' : 'flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-blue-200'}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <UserRound className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-bold text-slate-950">个人开户</span>
                  <span className="mt-1 block text-sm text-slate-500">复用个人 KYC 资料并补充 BaaS 必填信息。</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAccountType('enterprise')
                  setNotice('')
                }}
                className={accountType === 'enterprise' ? 'flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-left' : 'flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-amber-200'}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm">
                  <Building2 className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-bold text-slate-950">企业开户</span>
                  <span className="mt-1 block text-sm text-slate-500">复用企业 KYB 资料，补充缺失文件、股东和授权代表信息。</span>
                </span>
              </button>
            </div>
          </section>

          {notice ? (
            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-800">{notice}</div>
          ) : null}

          {accountType === 'enterprise' ? (
            <div className="mt-5">
              <BaasEnterpriseOpeningApplication
                onRegisterActions={setEnterpriseActions}
                onStatsChange={setEnterpriseStats}
                onSubmitSuccess={() => setSubmitted(true)}
              />
            </div>
          ) : (
            <div className="mt-5 grid gap-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <SectionHeader title="已获取资料" badge={`${sections.acquired.length} 项`} tone="success">
                  系统已有资料默认只读展示；带出数据需要符合 BaaS API 格式要求，关键格式已备注在字段旁。
                </SectionHeader>
                <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {sections.acquired.map((field) => (
                    <FieldValue key={field.key} field={field} value={profileValues[field.key]} />
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
                <SectionHeader title="待补充资料" badge={`${pendingCount} 项`} tone="warning">
                  当前个人资料、证件类型、证件号码和地区已带出；这里只补充 BaaS 需要的附件。附件为前端 mock 上传，不调用真实文件服务。
                </SectionHeader>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {sections.missing.map((field) => (
                    <TextInput key={field.key} field={field} value={profileValues[field.key]} error={errors[field.key]} onChange={changeProfileValue} />
                  ))}
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                  {attachmentFields.map((field) => (
                    <FileUploadInput key={field.key} field={field} file={supplementValues[field.key]} error={errors[field.key]} onFileChange={changeFile} />
                  ))}
                </div>
              </section>

              {Object.keys(errors).some((key) => errors[key]) ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-700">
                  请先补充缺失字段，并确认带出资料符合 BaaS 格式要求，再提交开户申请。
                </div>
              ) : null}
            </div>
          )}
        </div>
        {footer}
      </div>
    </div>
  )
}
