import 'antd/dist/reset.css'

import {
  ArrowLeftOutlined,
  BankOutlined,
  CopyOutlined,
  FileTextOutlined,
  GlobalOutlined,
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
  Tabs,
  Tag,
  Typography,
} from 'antd'
import { useMemo, useState } from 'react'

type Currency = 'USD' | 'HKD'
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
  amount: number
  currency: Currency
  receiving_bank: string
  created_at: string
  status: DepositStatus
}

const bankAccount: BankAccount = {
  bank_name: 'Singapore Gulf Bank',
  swift_code: 'SGDBBHB2XXX',
  routing_number: '1231231',
  bank_address: '110 North Carpenter Street',
  account_name: 'Fidere Trust Limited',
  account_number: 'BH98SGBD79848300000176',
  country: 'Bahrain',
  city: 'Chicago',
}

const bankAccountsByCurrency: Record<Currency, BankAccount> = {
  USD: bankAccount,
  HKD: {
    ...bankAccount,
    routing_number: 'HKD-778899',
    account_number: 'HK98SGBD79848300000999',
    city: 'Hong Kong',
  },
}

const initialRecords: Record<Currency, IncomingRecord[]> = {
  USD: [
    { id: 'dep-usd-001', amount: 12, currency: 'USD', receiving_bank: 'Singapore Gulf Bank', created_at: '2026-05-18 14:26', status: 'REJECTED' },
    { id: 'dep-usd-002', amount: 111, currency: 'USD', receiving_bank: 'Singapore Gulf Bank', created_at: '2026-05-18 10:42', status: 'UNDER_REVIEW' },
    { id: 'dep-usd-003', amount: 123, currency: 'USD', receiving_bank: 'Singapore Gulf Bank', created_at: '2026-05-15 16:53', status: 'REJECTED' },
    { id: 'dep-usd-004', amount: 1, currency: 'USD', receiving_bank: 'Singapore Gulf Bank', created_at: '2026-04-29 14:12', status: 'REJECTED' },
    { id: 'dep-usd-005', amount: 20, currency: 'USD', receiving_bank: 'Singapore Gulf Bank', created_at: '2026-04-27 15:15', status: 'APPROVED' },
  ],
  HKD: [
    { id: 'dep-hkd-001', amount: 10000, currency: 'HKD', receiving_bank: 'Singapore Gulf Bank', created_at: '2026-05-17 16:20', status: 'UNDER_REVIEW' },
    { id: 'dep-hkd-002', amount: 5600, currency: 'HKD', receiving_bank: 'Singapore Gulf Bank', created_at: '2026-05-11 11:05', status: 'APPROVED' },
  ],
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

export function IncomingFiatDepositPrototype({ onBack }: { onBack: () => void }) {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [records, setRecords] = useState<Record<Currency, IncomingRecord[]>>(initialRecords)
  const [form] = Form.useForm()
  const activeBank = bankAccountsByCurrency[currency]

  const balanceHint = useMemo(() => {
    const pending = records[currency]
      .filter((record) => record.status === 'UNDER_REVIEW')
      .reduce((total, record) => total + record.amount, 0)
    return {
      pending,
      approved: records[currency].filter((record) => record.status === 'APPROVED').reduce((total, record) => total + record.amount, 0),
    }
  }, [currency, records])

  const submitDeposit = (values: { amount: number; purpose: string; source_of_funds: string; reference_note?: string }) => {
    const nextRecord: IncomingRecord = {
      id: `dep-${currency.toLowerCase()}-${Date.now()}`,
      amount: values.amount,
      currency,
      receiving_bank: activeBank.bank_name,
      created_at: nowText(),
      status: 'UNDER_REVIEW',
    }

    setRecords((current) => ({
      ...current,
      [currency]: [nextRecord, ...current[currency]],
    }))
    form.resetFields()
    message.success('入金申请已提交，状态为 UNDER_REVIEW')
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <TopNav />
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-3 px-5">
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack}>返回</Button>
          <div>
            <Typography.Title level={5} style={{ margin: 0 }}>银行电汇入金</Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>通过银行转账将资金存入您的账户</Typography.Text>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1280px] px-5 py-5">
        <Card className="mb-5 rounded-2xl border-slate-200 shadow-sm" bodyStyle={{ padding: 16 }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Space size="middle">
              <span className="text-sm font-semibold text-slate-700">选择货币</span>
              <Tabs
                activeKey={currency}
                onChange={(key) => setCurrency(key as Currency)}
                items={[
                  { key: 'USD', label: 'US USD' },
                  { key: 'HKD', label: 'HK HKD' },
                ]}
              />
            </Space>
            <div className="rounded-lg bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800">
              <SafetyCertificateOutlined /> 重要提示：请在转账时备注您的账户 ID，以便快速处理入金。
            </div>
          </div>
        </Card>

        <Row gutter={[20, 20]} align="top">
          <Col xs={24} lg={16}>
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <Card
                title={<Space><BankOutlined />选择打款银行</Space>}
                extra={<Select style={{ width: 260 }} placeholder="选择银行" options={[{ value: activeBank.bank_name, label: activeBank.bank_name }]} />}
                className="rounded-2xl border-blue-300 shadow-[0_8px_24px_rgba(37,99,235,0.16)]"
              >
                <Row gutter={28}>
                  <Col xs={24} md={12}>
                    <Typography.Title level={5}>银行信息</Typography.Title>
                    <FieldRow label="银行名称" value={activeBank.bank_name} />
                    <FieldRow label="SWIFT代码" value={activeBank.swift_code} />
                    <FieldRow label="路由号码" value={activeBank.routing_number} />
                    <FieldRow label="银行地址" value={activeBank.bank_address} />
                  </Col>
                  <Col xs={24} md={12}>
                    <Typography.Title level={5}>账户信息</Typography.Title>
                    <FieldRow label="账户名称" value={activeBank.account_name} />
                    <FieldRow label="账户号码" value={activeBank.account_number} />
                    <FieldRow label="国家/地区" value={activeBank.country} />
                    <FieldRow label="城市" value={activeBank.city} />
                  </Col>
                </Row>
              </Card>

              <Card title={<Space><BankOutlined />收款银行信息</Space>} className="rounded-2xl border-slate-200 shadow-sm">
                <Row gutter={28}>
                  <Col xs={24} md={12}>
                    <FieldRow label="收款详情" value="Receiving AccountActive RECEIVING DETAILS SINGAPORE GULF BANK B.S.C. CLOSED" />
                    <FieldRow label="收款人名称" value={activeBank.account_name} />
                    <FieldRow label="银行名称" value="SINGAPORE GULF BANK B.S.C." />
                    <FieldRow label="银行地址" value="FLAT 2901, BUILDING 1B, ISA AL-KABEER AVENUE365, BLOCK 316, MANAMA, BAHRAIN, SG" />
                  </Col>
                  <Col xs={24} md={12}>
                    <FieldRow label="网络" value="SWIFT" />
                    <FieldRow label="账户号码" value={activeBank.account_number} />
                    <FieldRow label="BIC / SWIFT" value={activeBank.swift_code} />
                    <FieldRow label="渠道提供方" value="SGB" />
                  </Col>
                </Row>
              </Card>

              <Card title={<Space><FileTextOutlined />入金申请表单</Space>} className="rounded-2xl border-blue-300 shadow-[0_8px_24px_rgba(37,99,235,0.16)]">
                <Form form={form} layout="vertical" onFinish={submitDeposit}>
                  <Row gutter={16}>
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
                    银行电汇通常需要 1-3 个工作日处理。UNDER_REVIEW 时 pending_incoming_balance 增加，client_available_balance 不变。
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
                dataSource={records[currency]}
                rowKey="id"
                renderItem={(record) => (
                  <List.Item className="!items-start">
                    <List.Item.Meta
                      title={<Typography.Text strong>{formatAmount(record.amount, record.currency)}</Typography.Text>}
                      description={(
                        <div className="grid grid-cols-[1fr_auto] gap-x-3 text-sm">
                          <span className="text-slate-500">收款银行：</span>
                          <span className="text-right text-slate-700">{record.receiving_bank}</span>
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
