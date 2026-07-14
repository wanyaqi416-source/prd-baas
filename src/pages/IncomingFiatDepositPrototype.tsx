import 'antd/dist/reset.css'

import {
  ArrowLeftOutlined,
  BankOutlined,
  CopyOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  SunOutlined,
  TranslationOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  List,
  message,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd'
import { useMemo, useState } from 'react'

type Currency = 'USD' | 'HKD' | 'CNY' | 'SGD' | 'AED' | 'JPY'
type AccountType = 'hk' | 'us' | 'sg'
type DepositStatus = 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'

type BankAccount = {
  bank_name: string
  swift_code: string
  routing_number: string
  bank_address: string
  account_name: string
  account_number: string
  country: string
  city: string
}

type IncomingRecord = {
  id: string
  account_type: AccountType
  amount: number
  currency: Currency
  fee_amount: number
  receiving_bank: string
  remitting_bank: string
  remitting_account_number: string
  created_at: string
  status: DepositStatus
}

const accountLabels: Record<AccountType, string> = {
  hk: '香港账户',
  us: '美国账户',
  sg: '新加坡账户',
}

const accountCurrencyOptions: Record<AccountType, Currency[]> = {
  hk: ['USD', 'HKD', 'CNY', 'SGD'],
  us: ['USD'],
  sg: ['USD', 'CNY', 'SGD', 'AED', 'JPY'],
}

const currencyLabels: Record<Currency, string> = {
  USD: 'USD 美元',
  HKD: 'HKD 港币',
  CNY: 'CNY 人民币',
  SGD: 'SGD 新加坡元',
  AED: 'AED 阿联酋迪拉姆',
  JPY: 'JPY 日元',
}

const receivingBankAccounts: Record<AccountType, Partial<Record<Currency, BankAccount>>> = {
  hk: {
    USD: {
      bank_name: 'Fidere Hong Kong Receiving Bank',
      swift_code: 'FIDRHKHHUSD',
      routing_number: 'HK-USD-001',
      bank_address: '88 Queens Road Central, Hong Kong',
      account_name: 'Fidere Trust Limited - HK USD',
      account_number: 'HK-VA-USD-00012345',
      country: 'Hong Kong',
      city: 'Hong Kong',
    },
    HKD: {
      bank_name: 'Fidere Hong Kong Receiving Bank',
      swift_code: 'FIDRHKHHHKD',
      routing_number: 'HK-HKD-001',
      bank_address: '88 Queens Road Central, Hong Kong',
      account_name: 'Fidere Trust Limited - HK HKD',
      account_number: 'HK-VA-HKD-00012345',
      country: 'Hong Kong',
      city: 'Hong Kong',
    },
    CNY: {
      bank_name: 'Bank of China (Hong Kong)',
      swift_code: 'BKCHHKHH',
      routing_number: '012',
      bank_address: '1 Garden Road, Central, Hong Kong',
      account_name: 'FIDERE TRUST LIMITED - HK CNY',
      account_number: '012-888-88888866',
      country: 'Hong Kong',
      city: 'Hong Kong',
    },
    SGD: {
      bank_name: 'DBS Bank (Hong Kong)',
      swift_code: 'DHBKHKHH',
      routing_number: 'HK-SGD-001',
      bank_address: '11/F, The Center, 99 Queen Road Central, Hong Kong',
      account_name: 'FIDERE TRUST LIMITED - HK SGD',
      account_number: '001-234567-SGD',
      country: 'Hong Kong',
      city: 'Hong Kong',
    },
  },
  us: {
    USD: {
      bank_name: 'Fidere US Receiving Bank',
      swift_code: 'FIDRUS33USD',
      routing_number: '026009593',
      bank_address: '110 North Carpenter Street, Chicago, IL',
      account_name: 'Fidere Trust Limited - US USD',
      account_number: 'US-VA-USD-00067890',
      country: 'United States',
      city: 'Chicago',
    },
  },
  sg: {
    USD: {
      bank_name: 'Green Link Digital Bank Pte. Ltd.',
      swift_code: 'GLDTSGSG',
      routing_number: 'Green Link Digital Bank',
      bank_address: '20 PASIR PANJANG ROAD #07-25-28 MAPLETREE BUSINESS CITY SINGAPORE 117439',
      account_name: 'FIDERE TRUST LIMITED',
      account_number: '11020160454',
      country: 'Singapore',
      city: 'Singapore',
    },
    CNY: {
      bank_name: 'Green Link Digital Bank Pte. Ltd.',
      swift_code: 'GLDTSGSG',
      routing_number: 'Green Link Digital Bank',
      bank_address: '20 PASIR PANJANG ROAD #07-25-28 MAPLETREE BUSINESS CITY SINGAPORE 117439',
      account_name: 'FIDERE TRUST LIMITED',
      account_number: '11020160454',
      country: 'Singapore',
      city: 'Singapore',
    },
    SGD: {
      bank_name: 'Green Link Digital Bank Pte. Ltd.',
      swift_code: 'GLDTSGSG',
      routing_number: 'Green Link Digital Bank',
      bank_address: '20 PASIR PANJANG ROAD #07-25-28 MAPLETREE BUSINESS CITY SINGAPORE 117439',
      account_name: 'FIDERE TRUST LIMITED',
      account_number: '11020160454',
      country: 'Singapore',
      city: 'Singapore',
    },
    AED: {
      bank_name: 'Green Link Digital Bank Pte. Ltd.',
      swift_code: 'GLDTSGSG',
      routing_number: 'Green Link Digital Bank',
      bank_address: '20 PASIR PANJANG ROAD #07-25-28 MAPLETREE BUSINESS CITY SINGAPORE 117439',
      account_name: 'FIDERE TRUST LIMITED',
      account_number: '11020160454',
      country: 'Singapore',
      city: 'Singapore',
    },
    JPY: {
      bank_name: 'Green Link Digital Bank Pte. Ltd.',
      swift_code: 'GLDTSGSG',
      routing_number: 'Green Link Digital Bank',
      bank_address: '20 PASIR PANJANG ROAD #07-25-28 MAPLETREE BUSINESS CITY SINGAPORE 117439',
      account_name: 'FIDERE TRUST LIMITED',
      account_number: '11020160454',
      country: 'Singapore',
      city: 'Singapore',
    },
  },
}

const whitelistBanks: Record<string, BankAccount & { id: string; label: string }> = {
  hsbc: {
    id: 'hsbc',
    label: 'HSBC Hong Kong - 个人白名单',
    bank_name: 'HSBC Hong Kong',
    swift_code: 'HSBCHKHHHKH',
    routing_number: '004',
    bank_address: '1 Queens Road Central, Hong Kong',
    account_name: 'WANYARA OP WAN',
    account_number: '808-123456-838',
    country: 'Hong Kong',
    city: 'Hong Kong',
  },
  chase: {
    id: 'chase',
    label: 'Chase Bank - 个人白名单',
    bank_name: 'JPMorgan Chase Bank, N.A.',
    swift_code: 'CHASUS33',
    routing_number: '021000021',
    bank_address: '383 Madison Avenue, New York, NY',
    account_name: 'WANYARA OP WAN',
    account_number: '7788990011',
    country: 'United States',
    city: 'New York',
  },
}

const initialRecords: Record<AccountType, Partial<Record<Currency, IncomingRecord[]>>> = {
  hk: {
    USD: [
      { id: 'TXN-20260518-8bba6e13', account_type: 'hk', amount: 12, currency: 'USD', fee_amount: 0, receiving_bank: 'Fidere Hong Kong Receiving Bank', remitting_bank: 'HSBC Hong Kong', remitting_account_number: '808-123456-838', created_at: '2026-05-18 14:26', status: 'REJECTED' },
      { id: 'TXN-20260518-c91f7712', account_type: 'hk', amount: 111, currency: 'USD', fee_amount: 0, receiving_bank: 'Fidere Hong Kong Receiving Bank', remitting_bank: 'HSBC Hong Kong', remitting_account_number: '808-123456-838', created_at: '2026-05-18 10:42', status: 'UNDER_REVIEW' },
    ],
    HKD: [
      { id: 'TXN-20260517-210af998', account_type: 'hk', amount: 10000, currency: 'HKD', fee_amount: 0, receiving_bank: 'Fidere Hong Kong Receiving Bank', remitting_bank: 'HSBC Hong Kong', remitting_account_number: '808-123456-838', created_at: '2026-05-17 16:20', status: 'UNDER_REVIEW' },
      { id: 'TXN-20260511-6f7c120a', account_type: 'hk', amount: 5600, currency: 'HKD', fee_amount: 0, receiving_bank: 'Fidere Hong Kong Receiving Bank', remitting_bank: 'HSBC Hong Kong', remitting_account_number: '808-123456-838', created_at: '2026-05-11 11:05', status: 'APPROVED' },
    ],
    CNY: [],
    SGD: [],
  },
  us: {
    USD: [
      { id: 'TXN-20260515-b65e881c', account_type: 'us', amount: 123, currency: 'USD', fee_amount: 0, receiving_bank: 'Fidere US Receiving Bank', remitting_bank: 'JPMorgan Chase Bank, N.A.', remitting_account_number: '7788990011', created_at: '2026-05-15 16:53', status: 'REJECTED' },
      { id: 'TXN-20260427-e2f005c4', account_type: 'us', amount: 20, currency: 'USD', fee_amount: 0, receiving_bank: 'Fidere US Receiving Bank', remitting_bank: 'JPMorgan Chase Bank, N.A.', remitting_account_number: '7788990011', created_at: '2026-04-27 15:15', status: 'APPROVED' },
    ],
  },
  sg: {
    USD: [],
    CNY: [],
    SGD: [],
    AED: [],
    JPY: [],
  },
}

const statusColor: Record<DepositStatus, string> = {
  UNDER_REVIEW: 'orange',
  APPROVED: 'green',
  REJECTED: 'red',
}

const statusLabel: Record<DepositStatus, string> = {
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
}

function formatAmount(amount: number, currency: Currency) {
  return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatChineseDate(text: string) {
  const datePart = text.split(' ')[0]
  const [year, month, day] = datePart.split('-')
  return year && month && day ? `${year}年${Number(month)}月${Number(day)}日` : text
}

function nowText() {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

function CopyValue({ value }: { value: string }) {
  const copy = async () => {
    await navigator.clipboard?.writeText(value)
    message.success('已复制')
  }

  return (
    <button type="button" onClick={copy} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-blue-50 hover:text-blue-600">
      <CopyOutlined />
    </button>
  )
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr_28px] items-center gap-3 border-b border-slate-100 py-4 last:border-b-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold leading-6 text-slate-950">{value}</span>
      <CopyValue value={value} />
    </div>
  )
}

function TopNav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5">
        <div className="flex items-center gap-8">
          <div className="text-xl font-bold tracking-tight text-slate-800">FIDERE</div>
          <nav className="hidden items-center gap-2 text-sm text-slate-500 md:flex">
            {['仪表板', '账户', '投资', '交易', '信托服务'].map((item) => (
              <button
                key={item}
                type="button"
                className={item === '账户' ? 'inline-flex h-9 items-center rounded-xl bg-blue-600 px-4 font-semibold text-white shadow-sm' : 'inline-flex h-9 items-center rounded-xl px-3 font-medium hover:bg-slate-100'}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
        <Space size="middle" className="text-slate-500">
          <TranslationOutlined />
          <SunOutlined />
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
            <UserOutlined />
          </span>
        </Space>
      </div>
    </header>
  )
}

export function IncomingFiatDepositPrototype({ onBack, includeSingaporeAccount = false }: { onBack: () => void; includeSingaporeAccount?: boolean }) {
  const [view, setView] = useState<'form' | 'detail'>('form')
  const [selectedRecord, setSelectedRecord] = useState<IncomingRecord | null>(null)
  const [accountType, setAccountType] = useState<AccountType>('hk')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [selectedRemittingBankId, setSelectedRemittingBankId] = useState('hsbc')
  const [records, setRecords] = useState<Record<AccountType, Partial<Record<Currency, IncomingRecord[]>>>>(initialRecords)
  const [form] = Form.useForm()
  const accountOptions = includeSingaporeAccount
    ? (['hk', 'us', 'sg'] as AccountType[])
    : (['hk', 'us'] as AccountType[])
  const currencyOptions = accountCurrencyOptions[accountType]
  const activeReceivingBank = receivingBankAccounts[accountType][currency] || receivingBankAccounts[accountType][currencyOptions[0]]!
  const activeRemittingBank = whitelistBanks[selectedRemittingBankId]
  const activeRecords = records[accountType][currency] || []

  const changeAccountType = (nextType: AccountType) => {
    setAccountType(nextType)
    const nextCurrency = accountCurrencyOptions[nextType][0]
    setCurrency(nextCurrency)
    form.setFieldsValue({ currency: nextCurrency })
  }

  const changeCurrency = (nextCurrency: Currency) => {
    setCurrency(nextCurrency)
    form.setFieldsValue({ currency: nextCurrency })
  }

  const balanceHint = useMemo(() => {
    const pending = activeRecords
      .filter((record) => record.status === 'UNDER_REVIEW')
      .reduce((total, record) => total + record.amount, 0)
    return {
      pending,
      approved: activeRecords.filter((record) => record.status === 'APPROVED').reduce((total, record) => total + record.amount, 0),
    }
  }, [activeRecords])

  const submitDeposit = (values: { amount: number; currency: Currency; purpose: string; source_of_funds: string; reference_note?: string }) => {
    const submitCurrency = accountCurrencyOptions[accountType].includes(values.currency) ? values.currency : currency
    const receivingBank = receivingBankAccounts[accountType][submitCurrency]
    if (!receivingBank) {
      message.error('当前账户币种未配置收款银行')
      return
    }
    const nextRecord: IncomingRecord = {
      id: `TXN-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${Date.now().toString(16).slice(-8)}`,
      account_type: accountType,
      amount: values.amount,
      currency: submitCurrency,
      fee_amount: 0,
      receiving_bank: receivingBank.bank_name,
      remitting_bank: activeRemittingBank.bank_name,
      remitting_account_number: activeRemittingBank.account_number,
      created_at: nowText(),
      status: 'UNDER_REVIEW',
    }

    setRecords((current) => ({
      ...current,
      [accountType]: {
        ...current[accountType],
        [submitCurrency]: [nextRecord, ...(current[accountType][submitCurrency] || [])],
      },
    }))
    form.resetFields()
    form.setFieldsValue({ currency: submitCurrency })
    setCurrency(submitCurrency)
    setSelectedRecord(nextRecord)
    setView('detail')
    message.success('入金申请已提交，状态为 UNDER_REVIEW')
  }

  const openDetail = (record: IncomingRecord) => {
    setSelectedRecord(record)
    setAccountType(record.account_type)
    setCurrency(record.currency)
    form.setFieldsValue({ currency: record.currency })
    setView('detail')
  }

  if (view === 'detail' && selectedRecord) {
    const detailReceivingBank = receivingBankAccounts[selectedRecord.account_type][selectedRecord.currency]!
    const amountPrefix = selectedRecord.status === 'REJECTED' ? '' : '+ '
    return (
      <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
        <TopNav />
        <main className="mx-auto max-w-[460px] bg-[#f7faff] shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <BankOutlined />
              </span>
              <div>
                <h1 className="text-base font-bold text-slate-950">法币转入 详情</h1>
                <div className="text-xs font-bold uppercase tracking-wide text-slate-400">TRANSACTION DETAIL</div>
              </div>
            </div>
            <button type="button" onClick={onBack} className="text-2xl leading-none text-slate-400 hover:text-slate-700">×</button>
          </div>

          <div className="space-y-5 px-6 py-6">
            <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-orange-500">
                <span className="text-lg">◷</span>
              </div>
              <div className="mt-4 text-sm text-slate-500">{selectedRecord.status === 'UNDER_REVIEW' ? '待处理' : statusLabel[selectedRecord.status]}</div>
              <div className="mt-2 text-3xl font-bold text-emerald-600">
                {amountPrefix}{selectedRecord.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="ml-2 text-base font-semibold text-slate-600">{selectedRecord.currency}</span>
              </div>
              <div className="mt-3 text-sm text-slate-500">手续费: {selectedRecord.fee_amount.toFixed(2)} {selectedRecord.currency}</div>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-bold text-slate-700">详情</h2>
              <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                {[
                  ['交易编号', selectedRecord.id],
                  ['账户类型', accountLabels[selectedRecord.account_type]],
                  ['创建日期', formatChineseDate(selectedRecord.created_at)],
                  ['审核时间', selectedRecord.status === 'UNDER_REVIEW' ? '-' : formatChineseDate(selectedRecord.created_at)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 py-2 text-sm">
                    <span className="text-slate-500">{label}</span>
                    <span className="inline-flex items-center gap-2 text-right font-bold text-slate-950">
                      {value}
                      {label === '交易编号' ? <CopyValue value={value} /> : null}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-bold text-slate-700">收款银行详情</h2>
              <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-600 shadow-sm">
                <p>请注意，您必须在电汇的备注或说明字段中填写指令交易编号，以便资金到达您的现金账户。</p>
                <p>请立即发送您的资金。</p>
                <div className="mt-4 grid gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <span>交易编号</span>
                    <span className="inline-flex items-center gap-2 font-bold text-slate-950">{selectedRecord.id}<CopyValue value={selectedRecord.id} /></span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>收款银行</span>
                    <span className="text-right font-bold text-slate-950">{detailReceivingBank.bank_name}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>收款账户</span>
                    <span className="text-right font-bold text-slate-950">{detailReceivingBank.account_number}</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-bold text-slate-700">来自银行账户</h2>
              <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
                <div className="mb-3 text-sm font-bold text-slate-700">附加文件</div>
                <button type="button" className="inline-flex h-9 items-center gap-2 rounded-full bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700">
                  <FileTextOutlined />
                  上传文件
                </button>
                <div className="mt-3 text-sm text-slate-500">jpg/png 文件，文件大小不能超过 5M</div>
                <div className="my-4 h-px bg-slate-200" />
                <div className="text-sm font-bold text-slate-700">银行费用说明</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">请注意：您的银行可能会对此交易收取费用，我们无法确定或影响此费用。</p>
                <div className="mt-3 text-sm text-slate-500">打款银行：{selectedRecord.remitting_bank} · {selectedRecord.remitting_account_number}</div>
              </div>
            </section>

            <div className="flex gap-3 pb-6">
              <Button type="default" onClick={() => setView('form')} block>返回入金表单</Button>
              <Button type="primary" onClick={onBack} block>返回账户</Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <TopNav />
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-3 px-5">
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack}>返回</Button>
          <div>
            <Typography.Title level={5} style={{ margin: 0 }}>银行电汇入金</Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>通过外部银行转账将法币转入所选账户，收款银行按账户与币种展示</Typography.Text>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1280px] px-5 py-5">
        <Card className="mb-5 rounded-2xl border-slate-200 shadow-sm" bodyStyle={{ padding: 16 }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="grid flex-1 gap-3 md:grid-cols-[220px_220px_1fr]">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">选择账户</span>
                <Select
                  size="large"
                  value={accountType}
                  onChange={(value) => changeAccountType(value as AccountType)}
                  options={accountOptions.map((item) => ({ value: item, label: accountLabels[item] }))}
                  style={{ width: '100%' }}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">选择币种</span>
                <Select
                  size="large"
                  value={currency}
                  onChange={(value) => changeCurrency(value as Currency)}
                  options={currencyOptions.map((item) => ({ value: item, label: currencyLabels[item] }))}
                  style={{ width: '100%' }}
                />
              </label>
            </div>
            <div className="rounded-lg bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800">
              <SafetyCertificateOutlined /> 重要提示：请在转账时备注您的账户 ID，以便快速处理入金。
            </div>
          </div>
        </Card>

        <Row gutter={[20, 20]} align="top">
          <Col xs={24} lg={16}>
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <Card title={<Space><BankOutlined />收款银行信息 · {accountLabels[accountType]}</Space>} className="rounded-2xl border-slate-200 shadow-sm">
                <Row gutter={28}>
                  <Col xs={24} md={12}>
                    <FieldRow label="收款账户" value={`${accountLabels[accountType]} ${currency}`} />
                    <FieldRow label="收款人名称" value={activeReceivingBank.account_name} />
                    <FieldRow label="银行名称" value={activeReceivingBank.bank_name} />
                    <FieldRow label="银行地址" value={activeReceivingBank.bank_address} />
                  </Col>
                  <Col xs={24} md={12}>
                    <FieldRow label="网络" value="SWIFT" />
                    <FieldRow label="账户号码" value={activeReceivingBank.account_number} />
                    <FieldRow label="BIC / SWIFT" value={activeReceivingBank.swift_code} />
                    <FieldRow label="渠道提供方" value={`${accountLabels[accountType]} VA`} />
                  </Col>
                </Row>
              </Card>

              <Card title={<Space><FileTextOutlined />入金申请表单</Space>} className="rounded-2xl border-blue-300 shadow-[0_8px_24px_rgba(37,99,235,0.16)]">
                <Form form={form} layout="vertical" onFinish={submitDeposit} initialValues={{ currency }}>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item name="currency" label="入金币种 *" rules={[{ required: true, message: '请选择入金币种' }]}>
                        <Select
                          size="large"
                          value={currency}
                          onChange={(value) => changeCurrency(value as Currency)}
                          options={currencyOptions.map((item) => ({ value: item, label: currencyLabels[item] }))}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="amount" label="入金金额 *" rules={[{ required: true, message: '请输入入金金额' }]}>
                        <InputNumber min={1} precision={2} prefix={currency} style={{ width: '100%' }} placeholder="0.00" size="large" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="purpose" label="打款用途 *" rules={[{ required: true, message: '请选择用途' }]}>
                        <Select size="large" placeholder="请选择" options={[
                          { value: 'Investment', label: 'Investment' },
                          { value: 'Deposit', label: 'Deposit' },
                          { value: 'Settlement', label: 'Settlement' },
                        ]} />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item name="source_of_funds" label="资金来源 *" rules={[{ required: true, message: '请选择资金来源' }]}>
                        <Select size="large" placeholder="请选择" options={[
                          { value: 'Salary', label: 'Salary' },
                          { value: 'Business Income', label: 'Business Income' },
                          { value: 'Savings', label: 'Savings' },
                        ]} />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item name="reference_note" label="转账附言">
                        <Input size="large" placeholder="请填写您计划用于银行转账的附言或备注" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Typography.Paragraph type="secondary">
                    银行电汇通常需要 1-3 个工作日处理。当前入金至{accountLabels[accountType]}，UNDER_REVIEW 时 pending_incoming_balance 增加，client_available_balance 不变。
                  </Typography.Paragraph>
                  <div className="flex justify-end">
                    <Button type="primary" htmlType="submit" size="large" style={{ minWidth: 180 }}>
                      提交
                    </Button>
                  </div>
                </Form>
              </Card>
            </Space>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="最近提交记录" className="sticky top-5 rounded-2xl border-slate-200 shadow-sm">
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-orange-50 p-3">
                  <div className="text-xs text-orange-600">pending_incoming_balance</div>
                  <div className="mt-1 font-bold text-slate-950">{formatAmount(balanceHint.pending, currency)}</div>
                </div>
                <div className="rounded-xl bg-green-50 p-3">
                  <div className="text-xs text-green-600">approved deposits</div>
                  <div className="mt-1 font-bold text-slate-950">{formatAmount(balanceHint.approved, currency)}</div>
                </div>
              </div>
              <List
                dataSource={activeRecords}
                rowKey="id"
                renderItem={(record) => (
                  <List.Item className="!items-start">
                    <List.Item.Meta
                      title={(
                        <button type="button" onClick={() => openDetail(record)} className="text-left font-bold text-slate-950 hover:text-blue-600">
                          {formatAmount(record.amount, record.currency)}
                        </button>
                      )}
                      description={(
                        <div className="grid grid-cols-[1fr_auto] gap-x-3 text-sm">
                          <span className="text-slate-500">账户类型：</span>
                          <span className="text-right text-slate-700">{accountLabels[record.account_type]}</span>
                          <span className="text-slate-500">收款银行：</span>
                          <span className="text-right text-slate-700">{record.receiving_bank}</span>
                          <span className="text-slate-500">打款银行：</span>
                          <span className="text-right text-slate-700">{record.remitting_bank}</span>
                          <span className="text-slate-500">提交时间：</span>
                          <span className="text-right text-slate-700">{record.created_at}</span>
                        </div>
                      )}
                    />
                    <Tag color={statusColor[record.status]}>{statusLabel[record.status]}</Tag>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </main>

      <footer className="mx-auto flex max-w-[1280px] justify-between px-5 py-10 text-sm text-slate-500">
        <span>© 2026 Fidere Trust Limited. 保留所有权利。</span>
        <Space>
          <span>联系我们</span>
          <span>使用条款</span>
          <span>隐私政策</span>
          <span>风险披露</span>
        </Space>
      </footer>
    </div>
  )
}
