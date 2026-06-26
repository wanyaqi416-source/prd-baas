import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  FileText,
  MonitorSmartphone,
  ShieldCheck,
  UploadCloud,
  X,
} from 'lucide-react'

import licaiImage from '../../client/licai.png'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { ProductManualLayout } from '../components/portal/ProductManualLayout'
import { PrdBackLink } from '../components/portal/PrdBackLink'
import {
  getEnabledAccountCurrencyCodes,
  initialAccountCurrencyConfigs,
  mapBrokerNameToAccountCurrencyType,
} from '../data/accountCurrencyConfig'
import { BaasOpeningPrototype, ClientTopNav } from './BaasOpeningPrototype'

const securitiesAccountBaseRoute = '/admin/product-manual/securities-account-prototype'

function createInvestmentMenu(onNavigate) {
  return [
    {
      label: '理财产品',
      onClick: () => onNavigate(`${securitiesAccountBaseRoute}/client/licai`),
    },
    {
      label: '券商服务',
      onClick: () => onNavigate(`${securitiesAccountBaseRoute}/client/quanshang`),
    },
  ]
}

const brokerageServiceBrokers = {
  ibkr: {
    id: 'ibkr',
    name: 'IBKR 盈透证券',
    shortName: 'IBKR',
    logo: 'IB',
    fee: '100 USD',
    estimatedTime: '3-7 个工作日',
    marketCoverage: ['美股', '港股', '全球市场'],
    highlights: ['全球市场', '专业交易工具', '多币种账户'],
    description: '适合需要覆盖全球市场、专业交易功能和多币种证券账户的客户。',
    materials: [
      {
        id: 'address_proof',
        name: '地址证明',
        helper: '近 3 个月内显示申请人姓名和居住地址的银行账单、水电账单或政府文件。',
        fileName: 'address-proof.pdf',
      },
    ],
  },
  webull: {
    id: 'webull',
    name: 'Webull 微牛证券',
    shortName: 'Webull',
    logo: 'WB',
    fee: '100 USD',
    estimatedTime: '2-5 个工作日',
    marketCoverage: ['美股', '港股'],
    highlights: ['流程便捷', '移动端体验', '美港股交易'],
    description: '适合优先开通美港股交易、希望流程轻量且处理速度较快的客户。',
    materials: [
      {
        id: 'basic_profile',
        name: '账户基础资料',
        helper: '客户基础开户信息文件，支持后台或客户重新上传。',
        fileName: 'webull-basic-profile.pdf',
      },
      {
        id: 'authorization_letter',
        name: '授权书',
        helper: '第三方签署文件，由签署流程生成后同步到申请中。',
        fileName: 'webull-authorization-letter.pdf',
      },
      {
        id: 'risk_disclosure',
        name: '风险披露文件',
        helper: '第三方签署文件，用于确认客户已阅读并接受相关风险披露。',
        fileName: 'webull-risk-disclosure.pdf',
      },
    ],
  },
}

const brokerageServiceSteps = [
  { id: 'select', title: '选择券商' },
  { id: 'fee', title: '确认费用' },
  { id: 'upload', title: '上传资料' },
  { id: 'submit', title: '提交审核' },
]

function formatApplicationTime() {
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

function formatBrokerageTransferAccountLabel(brokerName) {
  if (brokerName === 'IBKR 盈透证券') return 'IBKR 盈透证券账户'
  if (brokerName === 'Webull 微牛证券') return 'Webull 微牛证券账户'
  return brokerName ? `${brokerName}账户` : '券商账户'
}

function getBrokerageAccountCurrencies(accountCurrencyConfigs, brokerName, fallback = ['USD', 'HKD']) {
  const configuredCurrencies = getEnabledAccountCurrencyCodes(accountCurrencyConfigs, mapBrokerNameToAccountCurrencyType(brokerName))
  return configuredCurrencies.length ? configuredCurrencies : fallback
}

function deriveBrokerageAccounts(applications = [], accountCurrencyConfigs = initialAccountCurrencyConfigs) {
  const openedAccounts = applications
    .filter((application) => application.openingStatus === '已开户' && application.accountInfo)
    .map((application) => ({
      id: application.id,
      brokerId: application.brokerId,
      brokerName: application.brokerName,
      label: formatBrokerageTransferAccountLabel(application.brokerName),
      accountName: application.accountInfo.accountName,
      accountNumber: application.accountInfo.accountNumber,
      currencies: getBrokerageAccountCurrencies(accountCurrencyConfigs, application.brokerName),
      balance: {
        USD: 'USD 58,320.00',
        HKD: 'HKD 126,800.00',
      },
    }))

  if (!openedAccounts.length) return []

  const demoAccounts = [
    {
      id: 'demo-ibkr-brokerage',
      brokerId: 'ibkr',
      brokerName: 'IBKR 盈透证券',
      label: 'IBKR 盈透证券账户',
      accountName: 'FIDERE Trust Account',
      accountNumber: 'IBKR-2026-001',
      currencies: getBrokerageAccountCurrencies(accountCurrencyConfigs, 'IBKR 盈透证券'),
      balance: {
        USD: 'USD 42,680.00',
        HKD: 'HKD 88,600.00',
      },
    },
    {
      id: 'demo-webull-brokerage',
      brokerId: 'webull',
      brokerName: 'Webull 微牛证券',
      label: 'Webull 微牛证券账户',
      accountName: 'FIDERE Trust Account',
      accountNumber: 'WB-98347291',
      currencies: getBrokerageAccountCurrencies(accountCurrencyConfigs, 'Webull 微牛证券'),
      balance: {
        USD: 'USD 58,320.00',
        HKD: 'HKD 126,800.00',
      },
    },
  ]

  return demoAccounts.map((demoAccount) => {
    const openedAccount = openedAccounts.find((account) => account.brokerId === demoAccount.brokerId)
    return openedAccount ? { ...demoAccount, ...openedAccount, label: demoAccount.label } : demoAccount
  })
}

const brokerageStepIndex = {
  select: 1,
  fee: 2,
  upload: 3,
  submit: 4,
  success: 4,
  progress: 4,
}

function BrokerageStepIndicator({ currentStep }) {
  const currentIndex = brokerageServiceSteps.findIndex((step) => step.id === currentStep)

  return (
    <div className="flex min-w-[620px] items-center">
      {brokerageServiceSteps.map((step, index) => {
        const done = index < currentIndex || currentStep === 'success' || currentStep === 'progress'
        const active = index === currentIndex && currentStep !== 'success' && currentStep !== 'progress'
        return (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex items-center gap-2">
              <span className={done ? 'flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white' : active ? 'flex h-8 w-8 items-center justify-center rounded-full bg-[#2F6BFF] text-sm font-bold text-white' : 'flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-500'}>
                {done ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <span className={active ? 'text-sm font-bold text-[#2F6BFF]' : done ? 'text-sm font-bold text-emerald-700' : 'text-sm font-semibold text-slate-500'}>
                {step.title}
              </span>
            </div>
            {index < brokerageServiceSteps.length - 1 ? <div className={done ? 'mx-4 h-px flex-1 bg-emerald-300' : 'mx-4 h-px flex-1 bg-slate-200'} /> : null}
          </div>
        )
      })}
    </div>
  )
}

function BrokeragePageHeader({ currentStep }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">券商开户流程系统</h1>
          <p className="mt-1 text-sm text-slate-500">Step {brokerageStepIndex[currentStep] || 1} / 4</p>
        </div>
        <Button type="button" variant="outline" className="rounded-lg" onClick={() => window.history.back()}>
          返回客户端
        </Button>
      </div>
      <div className="overflow-x-auto">
        <BrokerageStepIndicator currentStep={currentStep} />
      </div>
    </section>
  )
}

function BrokerageSummaryCard({
  broker,
  currentStep,
  uploadedCount = 0,
  totalMaterials = broker.materials.length,
  application,
  showUploadProgress = false,
  onNext,
  nextDisabled = false,
  nextLabel = '下一步',
  title = '开户摘要',
}) {
  const rows = [
    ['已选择券商', broker.name],
    ['开户费用', '$100'],
    ['预计处理时间', '3-7 工作日'],
    ['账户类型', 'Individual Account'],
    ['当前步骤', `STEP ${brokerageStepIndex[currentStep] || 1}/4`],
  ]

  return (
    <aside className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-bold text-slate-950">{title}</h2>
        </div>
        <div className="space-y-4 p-5 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0">
              <span className="text-slate-500">{label}</span>
              <span className="text-right font-bold text-slate-950">{value}</span>
            </div>
          ))}
          {showUploadProgress ? (
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-700">
                <span>资料进度</span>
                <span>{uploadedCount}/{totalMaterials}</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white">
                <div className="h-2 rounded-full bg-[#2F6BFF]" style={{ width: `${Math.round((uploadedCount / totalMaterials) * 100)}%` }} />
              </div>
              {onNext ? (
                <Button
                  type="button"
                  disabled={nextDisabled}
                  onClick={onNext}
                  className="mt-4 w-full rounded-lg bg-[#2F6BFF] hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {nextLabel}
                </Button>
              ) : null}
            </div>
          ) : null}
          {application ? (
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
              <div className="text-xs font-semibold text-emerald-700">申请编号</div>
              <div className="mt-2 text-sm font-bold text-slate-950">{application.id}</div>
            </div>
          ) : null}
        </div>
      </section>
      <section className="rounded-lg border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
          <ShieldCheck className="h-4 w-4" />
          FIDERE Trust
        </div>
        <p className="mt-2 text-sm leading-6 text-blue-800">
          FIDERE Trust 将协助您完成开户资料整理、费用确认和后台人工审核，券商最终开户结果以后台处理为准。
        </p>
      </section>
    </aside>
  )
}

function BrokerageBrokerCard({ broker, selected, onSelect }) {
  const tagText = broker.id === 'ibkr' ? ['全球市场', '官网'] : ['流程便捷', '官网']
  const actionLabel = selected ? '已选择' : `选择 ${broker.shortName}`

  return (
    <div className={selected ? 'rounded-lg border border-[#2F6BFF] bg-white p-5 shadow-sm' : 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm'}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className={selected ? 'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#2F6BFF] text-sm font-bold text-white' : 'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700'}>
            {broker.logo}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-950">{broker.name}</h3>
              {tagText.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
              <div>
                <div className="text-xs text-slate-500">开户费</div>
                <div className="mt-1 font-bold text-slate-950">100 USD</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">市场覆盖</div>
                <div className="mt-1 font-bold text-slate-950">{broker.marketCoverage.join(' / ')}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">所需资料</div>
                <div className="mt-1 font-bold text-slate-950">{broker.materials.map((item) => item.name).join(' / ')}</div>
              </div>
            </div>
          </div>
        </div>
        <Button
          type="button"
          onClick={onSelect}
          variant={selected ? 'default' : 'outline'}
          className={selected ? 'rounded-lg bg-[#2F6BFF] hover:bg-blue-700' : 'rounded-lg'}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  )
}

function BrokerageMaterialCard({ material, uploadedFile, onUpload, onDelete }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2F6BFF]">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-950">{material.name}（必填）</h3>
              <Badge variant={uploadedFile ? 'success' : 'warning'}>{uploadedFile ? '已上传' : '未上传'}</Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500">PDF/JPG/PNG · 单个文件不超过 10MB</p>
          </div>
        </div>
        <Button type="button" onClick={onUpload} variant="outline" className="rounded-lg">
          <UploadCloud className="h-4 w-4" />
          上传按钮
        </Button>
      </div>
      {uploadedFile ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm">
          <span className="font-bold text-emerald-900">{uploadedFile.name}</span>
          <Button type="button" onClick={onDelete} variant="outline" size="sm" className="rounded-lg text-red-600 hover:text-red-700">
            <X className="h-4 w-4" />
            删除
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function BrokerageFooterActions({ step, allUploaded, feeConfirmed, submitConfirmed, onBack, onPrevious, onNext, onSubmit }) {
  if (step === 'select') {
    return (
      <div className="mt-5 flex justify-end">
        <Button type="button" onClick={onNext} className="rounded-lg bg-[#2F6BFF] px-6 hover:bg-blue-700">
          下一步：确认费用
        </Button>
      </div>
    )
  }
  if (step === 'fee') {
    return (
      <div className="mt-5 flex justify-between gap-3">
        <Button type="button" onClick={onPrevious} variant="outline" className="rounded-lg">上一步</Button>
        <Button type="button" disabled={!feeConfirmed} onClick={onNext} className="rounded-lg bg-[#2F6BFF] px-6 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
          确认并继续上传资料
        </Button>
      </div>
    )
  }
  if (step === 'upload') {
    return (
      <div className="mt-5 flex justify-between gap-3">
        <Button type="button" onClick={onPrevious} variant="outline" className="rounded-lg">上一步</Button>
        <Button type="button" disabled={!allUploaded} onClick={onNext} className="rounded-lg bg-[#2F6BFF] px-6 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
          下一步：提交审核
        </Button>
      </div>
    )
  }
  if (step === 'submit') {
    return (
      <div className="mt-5 flex justify-between gap-3">
        <Button type="button" onClick={onPrevious} variant="outline" className="rounded-lg">返回上一步</Button>
        <Button type="button" disabled={!submitConfirmed} onClick={onSubmit} className="rounded-lg bg-[#2F6BFF] px-6 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
          提交审核
        </Button>
      </div>
    )
  }
  return (
    <div className="mt-5 flex justify-end">
      <Button type="button" onClick={onBack} variant="outline" className="rounded-lg">返回账户页</Button>
    </div>
  )
}

export function SecuritiesBrokerageServicePrototype({ onBack, onNavigate }) {
  const [selectedBrokerId, setSelectedBrokerId] = useState('ibkr')
  const [step, setStep] = useState('select')
  const [feeConfirmed, setFeeConfirmed] = useState(false)
  const [submitConfirmed, setSubmitConfirmed] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState({})
  const [application, setApplication] = useState(null)
  const broker = brokerageServiceBrokers[selectedBrokerId]
  const uploadedCount = broker.materials.filter((material) => uploadedFiles[material.id]).length
  const allUploaded = uploadedCount === broker.materials.length

  const resetForBroker = (brokerId) => {
    setSelectedBrokerId(brokerId)
    setUploadedFiles({})
    setFeeConfirmed(false)
    setSubmitConfirmed(false)
    setApplication(null)
  }

  const uploadMaterial = (material) => {
    setUploadedFiles((current) => ({
      ...current,
      [material.id]: {
        name: material.fileName,
        uploadedAt: formatApplicationTime(),
      },
    }))
  }

  const deleteMaterial = (materialId) => {
    setUploadedFiles((current) => {
      const next = { ...current }
      delete next[materialId]
      return next
    })
  }

  const submitApplication = () => {
    setApplication({
      id: `BRK-${new Date().getFullYear()}-0001`,
      submittedAt: formatApplicationTime(),
      status: 'Pending Review',
    })
    setStep('success')
  }

  const renderLeftContent = () => {
    if (step === 'select') {
      return (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">选择券商</h2>
          <div className="mt-5 space-y-4">
            {Object.values(brokerageServiceBrokers).map((item) => (
              <BrokerageBrokerCard
                key={item.id}
                broker={item}
                selected={item.id === selectedBrokerId}
                onSelect={() => resetForBroker(item.id)}
              />
            ))}
          </div>
        </section>
      )
    }

    if (step === 'fee') {
      return (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">确认开户费用</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">已选择券商</div>
              <div className="mt-2 font-bold text-slate-950">{broker.name}</div>
            </div>
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <div className="text-xs text-blue-700">开户费用</div>
              <div className="mt-2 text-2xl font-bold text-slate-950">100 USD</div>
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
            一次性费用，不包含后续费用。提交申请后，后台会依据券商开户进度继续人工处理。
          </div>
          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={feeConfirmed}
              onChange={(event) => setFeeConfirmed(event.target.checked)}
              className="mt-1 h-4 w-4 accent-[#2F6BFF]"
            />
            <span className="text-sm leading-6 text-slate-700">我已阅读并确认费用说明</span>
          </label>
        </section>
      )
    }

    if (step === 'upload') {
      return (
        <section className="space-y-4">
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-800">
            所有文件用于券商开户审核
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-950">上传资料</h2>
                <p className="mt-1 text-sm text-slate-500">{broker.name} 资料任务列表</p>
              </div>
              <Badge variant={allUploaded ? 'success' : 'warning'}>{uploadedCount}/{broker.materials.length}</Badge>
            </div>
            <div className="mt-5 h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-[#2F6BFF]" style={{ width: `${Math.round((uploadedCount / broker.materials.length) * 100)}%` }} />
            </div>
            <div className="mt-5 space-y-4">
              {broker.materials.map((material) => (
                <BrokerageMaterialCard
                  key={material.id}
                  material={material}
                  uploadedFile={uploadedFiles[material.id]}
                  onUpload={() => uploadMaterial(material)}
                  onDelete={() => deleteMaterial(material.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )
    }

    if (step === 'submit') {
      return (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">提交开户申请</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ['券商名称', broker.name],
              ['账户类型', 'Individual Account'],
              ['开户费用', '100 USD'],
              ['预计处理时间', '3-7 工作日'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">{label}</div>
                <div className="mt-2 font-bold text-slate-950">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="text-sm font-bold text-slate-950">已上传文件列表</div>
            <div className="mt-3 space-y-3">
              {broker.materials.map((material) => (
                <div key={material.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
                  <span className="font-semibold text-slate-900">{material.name}</span>
                  <span className="text-slate-500">{uploadedFiles[material.id]?.name || '-'}</span>
                </div>
              ))}
            </div>
          </div>
          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={submitConfirmed}
              onChange={(event) => setSubmitConfirmed(event.target.checked)}
              className="mt-1 h-4 w-4 accent-[#2F6BFF]"
            />
            <span className="text-sm leading-6 text-slate-700">我确认资料真实完整</span>
          </label>
        </section>
      )
    }

    if (step === 'success') {
      return (
        <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-3xl font-bold text-slate-950">开户申请已提交</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">3-7个工作日审核</p>
          <div className="mx-auto mt-6 grid max-w-2xl gap-4 text-left md:grid-cols-2">
            {[
              ['申请编号', application.id],
              ['券商名称', broker.name],
              ['当前状态', application.status],
              ['提交时间', application.submittedAt],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">{label}</div>
                <div className="mt-2 font-bold text-slate-950">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={onBack} variant="outline" className="rounded-lg">返回账户页</Button>
            <Button type="button" onClick={() => setStep('progress')} className="rounded-lg bg-[#2F6BFF] px-6 hover:bg-blue-700">查看申请进度</Button>
          </div>
        </section>
      )
    }

    const timeline = [
      { title: '申请已提交', description: '客户已提交券商开户申请和资料。', status: 'done' },
      { title: '初步审核', description: '后台人员审核资料完整性。', status: 'active' },
      { title: '券商审核', description: '资料通过后进入券商开户处理。', status: 'todo' },
      { title: '开户完成', description: '后台录入券商账户信息后客户可见。', status: 'todo' },
    ]

    return (
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <Badge variant="warning">Pending Review</Badge>
        <h2 className="mt-3 text-2xl font-bold text-slate-950">申请进度</h2>
        <p className="mt-2 text-sm text-slate-500">申请编号：{application.id}</p>
        <div className="mt-8 space-y-0">
          {timeline.map((item, index) => (
            <div key={item.title} className="grid grid-cols-[28px_1fr] gap-4">
              <div className="flex flex-col items-center">
                <span className={item.status === 'done' ? 'h-4 w-4 rounded-full bg-emerald-500' : item.status === 'active' ? 'h-4 w-4 rounded-full bg-[#2F6BFF] ring-4 ring-blue-100' : 'h-4 w-4 rounded-full bg-slate-300'} />
                {index < timeline.length - 1 ? <span className="h-20 w-px bg-slate-200" /> : null}
              </div>
              <div className="mb-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-950">{item.title}</h3>
                  <Badge variant={item.status === 'done' ? 'success' : item.status === 'active' ? 'warning' : 'secondary'}>
                    {item.status === 'done' ? '已完成' : item.status === 'active' ? '进行中' : '待处理'}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  const goPrevious = () => {
    if (step === 'fee') setStep('select')
    if (step === 'upload') setStep('fee')
    if (step === 'submit') setStep('upload')
  }

  const goNext = () => {
    if (step === 'select') setStep('fee')
    if (step === 'fee') setStep('upload')
    if (step === 'upload') setStep('submit')
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <ClientTopNav onBack={onBack} activeNavLabel="投资" investmentMenu={createInvestmentMenu(onNavigate)} />
      <main className="mx-auto max-w-[1180px] px-5 py-6">
        <BrokeragePageHeader currentStep={step} />
        <div className="mt-5 grid gap-5 lg:grid-cols-[0.68fr_0.32fr]">
          <div>{renderLeftContent()}</div>
          <BrokerageSummaryCard
            broker={broker}
            currentStep={step}
            uploadedCount={uploadedCount}
            totalMaterials={broker.materials.length}
            application={application}
            title={step === 'success' || step === 'progress' ? 'Application Summary' : '开户摘要'}
            showUploadProgress={step === 'upload'}
            onNext={step === 'upload' ? () => setStep('submit') : undefined}
            nextDisabled={!allUploaded}
            nextLabel="下一步：提交审核"
          />
        </div>
        {step === 'success' || step === 'progress' ? null : (
          <BrokerageFooterActions
            step={step}
            allUploaded={allUploaded}
            feeConfirmed={feeConfirmed}
            submitConfirmed={submitConfirmed}
            onBack={onBack}
            onPrevious={goPrevious}
            onNext={goNext}
            onSubmit={submitApplication}
          />
        )}
      </main>
    </div>
  )
}

export function SecuritiesAccountPrototypeHome({ onBack, onNavigate }) {
  const entries = [
    {
      title: '客户端',
      description: '复用现有客户端开户流程页面结构，查看账户、资金操作与投资入口。',
      route: `${securitiesAccountBaseRoute}/client`,
      icon: MonitorSmartphone,
      buttonLabel: '进入客户端',
    },
    {
      title: '后台管理',
      description: '进入已完成的券商开户申请管理、法币资产管理和后台处理页面。',
      route: `${securitiesAccountBaseRoute}/admin`,
      icon: BriefcaseBusiness,
      buttonLabel: '进入后台管理',
    },
  ]

  return (
    <ProductManualLayout>
      <main className="mx-auto min-h-screen max-w-[1160px] px-6 py-10 md:px-10 md:py-14">
        <div className="space-y-8">
          <PrdBackLink onClick={onBack} />
          <section className="space-y-3 border-b pb-8">
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">券商账户原型</h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              选择客户端或后台管理入口，查看券商账户相关页面结构、路由和处理流程。
            </p>
          </section>
          <section className="grid gap-6 md:grid-cols-2">
            {entries.map((entry) => {
              const Icon = entry.icon

              return (
                <Card key={entry.title} className="border bg-card transition-colors hover:border-primary/40">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl leading-tight">{entry.title}</CardTitle>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.description}</p>
                      </div>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button type="button" onClick={() => onNavigate(entry.route)} className="w-fit">
                      {entry.buttonLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </section>
        </div>
      </main>
    </ProductManualLayout>
  )
}

export function SecuritiesAccountClientPrototype({
  onBack,
  onNavigate,
  onPrototypeHome,
  brokerageApplications = [],
  accountCurrencyConfigs = initialAccountCurrencyConfigs,
}) {
  const brokerageAccounts = useMemo(
    () => deriveBrokerageAccounts(brokerageApplications, accountCurrencyConfigs),
    [brokerageApplications, accountCurrencyConfigs]
  )

  return (
    <BaasOpeningPrototype
      onBack={onBack}
      onPrototypeHome={onPrototypeHome}
      prototypeLabel="券商账户原型"
      showGuidanceMarks={false}
      forceInternalTransferMark
      investmentMenu={createInvestmentMenu(onNavigate)}
      brokerageAccounts={brokerageAccounts}
      accountCurrencyConfigs={accountCurrencyConfigs}
      initialStatus="opened"
    />
  )
}

export function SecuritiesAccountClientStaticPage({ onBack, onNavigate }) {
  const config = {
    title: '理财产品',
    image: licaiImage,
    alt: '理财产品页面',
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <ClientTopNav
        onBack={onBack}
        activeNavLabel="投资"
        investmentMenu={createInvestmentMenu(onNavigate)}
      />
      <main className="mx-auto max-w-[1380px] px-6 py-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">{config.title}</h1>
            <p className="mt-1 text-sm text-slate-500">当前页面内容来自现有客户端页面素材。</p>
          </div>
          <Button type="button" variant="outline" onClick={onBack} className="rounded-lg">
            返回客户端
          </Button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <img src={config.image} alt={config.alt} className="block w-full" />
        </div>
      </main>
    </div>
  )
}
