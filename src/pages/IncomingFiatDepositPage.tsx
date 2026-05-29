import 'antd/dist/reset.css'

import { useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  Layout,
  List,
  Row,
  Select,
  Space,
  Tabs,
  Tag,
  Typography,
} from 'antd'
import type { TabsProps } from 'antd'

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

type DepositRecord = {
  id: string
  amount: number
  currency: Currency
  receiving_bank: string
  created_at: string
  status: DepositStatus
}

type DepositFormValues = {
  amount: number
  purpose: 'Investment' | 'Deposit' | 'Settlement'
  source_of_funds: 'Salary' | 'Business Income' | 'Savings'
  reference_note?: string
}

const bankAccounts: Record<Currency, BankAccount> = {
  USD: {
    bank_name: 'Singapore Gulf Bank',
    swift_code: 'SGDBBHB2XXX',
    routing_number: '1231231',
    bank_address: '110 North Carpenter Street',
    account_name: 'Fidere Trust Limited',
    account_number: 'BH98SGBD79848300000176',
    country: 'Bahrain',
    city: 'Chicago',
  },
  HKD: {
    bank_name: 'Singapore Gulf Bank',
    swift_code: 'SGDBBHB2HKD',
    routing_number: '8899001',
    bank_address: '110 North Carpenter Street',
    account_name: 'Fidere Trust Limited - HKD',
    account_number: 'BH98SGBD79848300000999',
    country: 'Bahrain',
    city: 'Chicago',
  },
}

const initialRecords: DepositRecord[] = [
  {
    id: 'dep-1005',
    amount: 12,
    currency: 'USD',
    receiving_bank: 'Singapore Gulf Bank',
    created_at: '2028-05-18 14:26',
    status: 'APPROVED',
  },
  {
    id: 'dep-1004',
    amount: 111,
    currency: 'USD',
    receiving_bank: 'Singapore Gulf Bank',
    created_at: '2028-05-18 10:42',
    status: 'UNDER_REVIEW',
  },
  {
    id: 'dep-1003',
    amount: 123,
    currency: 'USD',
    receiving_bank: 'Singapore Gulf Bank',
    created_at: '2028-05-15 16:53',
    status: 'APPROVED',
  },
  {
    id: 'dep-2002',
    amount: 8800,
    currency: 'HKD',
    receiving_bank: 'Singapore Gulf Bank',
    created_at: '2028-05-13 09:20',
    status: 'UNDER_REVIEW',
  },
  {
    id: 'dep-2001',
    amount: 3200,
    currency: 'HKD',
    receiving_bank: 'Singapore Gulf Bank',
    created_at: '2028-05-08 11:18',
    status: 'REJECTED',
  },
]

const statusConfig: Record<DepositStatus, { color: string; label: string; note: string }> = {
  UNDER_REVIEW: {
    color: 'orange',
    label: 'UNDER_REVIEW',
    note: '用户可见；pending_incoming_balance 增加，client_available_balance 不变。',
  },
  APPROVED: {
    color: 'green',
    label: 'APPROVED',
    note: 'pending_incoming_balance 减少，client_available_balance 增加。',
  },
  REJECTED: {
    color: 'red',
    label: 'REJECTED',
    note: '不入账。',
  },
}

const { Header, Content } = Layout
const { Text, Title } = Typography

function CopyValue({ value }: { value: string }) {
  return (
    <Text copyable={{ text: value }} strong>
      {value}
    </Text>
  )
}

function formatAmount(amount: number, currency: Currency) {
  return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function createRecord(values: DepositFormValues, currency: Currency, account: BankAccount): DepositRecord {
  return {
    id: `dep-${Date.now()}`,
    amount: values.amount,
    currency,
    receiving_bank: account.bank_name,
    created_at: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
    status: 'UNDER_REVIEW',
  }
}

export function IncomingFiatDepositPage({ onBack }: { onBack: () => void }) {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [records, setRecords] = useState<DepositRecord[]>(initialRecords)
  const [form] = Form.useForm<DepositFormValues>()

  const account = bankAccounts[currency]
  const currencyRecords = useMemo(
    () => records.filter((record) => record.currency === currency),
    [currency, records],
  )

  const tabItems: TabsProps['items'] = [
    { key: 'USD', label: 'US_USD' },
    { key: 'HKD', label: 'HK_HKD' },
  ]

  const handleSubmit = (values: DepositFormValues) => {
    const nextRecord = createRecord(values, currency, account)
    setRecords((current) => [nextRecord, ...current])
    form.resetFields()
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f4f7fb' }}>
      <Header
        style={{
          height: 56,
          padding: '0 32px',
          background: '#fff',
          borderBottom: '1px solid #e8edf5',
          display: 'flex',
          alignItems: 'center',
          gap: 28,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            border: 0,
            background: 'transparent',
            color: '#0f1b2d',
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          FIDERE
        </button>
        <Space size={8} wrap>
          {['仪表板', '账户', '投资', '交易', '信托服务'].map((item) => (
            <span
              key={item}
              style={{
                borderRadius: 12,
                padding: '7px 14px',
                background: item === '账户' ? '#2f6fed' : 'transparent',
                color: item === '账户' ? '#fff' : '#65758b',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {item}
            </span>
          ))}
        </Space>
      </Header>

      <Content style={{ padding: '0 24px 48px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ height: 58, display: 'flex', alignItems: 'center', gap: 14 }}>
            <Button type="text" onClick={onBack}>
              ← 返回 BaaS 原型
            </Button>
            <div>
              <Title level={4} style={{ margin: 0, color: '#102039' }}>
                银行电汇入金
              </Title>
              <Text type="secondary">通过银行转账将资金存入您的账户。</Text>
            </div>
          </div>

          <Card
            style={{ borderRadius: 12, marginBottom: 18 }}
            bodyStyle={{ padding: '12px 16px' }}
          >
            <Row align="middle" justify="space-between" gutter={[16, 12]}>
              <Col>
                <Space align="center">
                  <Text strong>选择货币</Text>
                  <Tabs
                    activeKey={currency}
                    items={tabItems}
                    onChange={(key) => setCurrency(key as Currency)}
                    size="small"
                    style={{ marginBottom: -14 }}
                  />
                </Space>
              </Col>
              <Col>
                <Alert
                  type="info"
                  showIcon
                  message="重要提示：请在转账附言中填写申请编号，以便快速处理入金。"
                  style={{ borderRadius: 999, padding: '4px 12px' }}
                />
              </Col>
            </Row>
          </Card>

          <Row gutter={[20, 20]} align="top">
            <Col xs={24} lg={16}>
              <Space direction="vertical" size={18} style={{ width: '100%' }}>
                <Card title="选择打款银行" style={{ borderRadius: 16 }}>
                  <Descriptions title="银行信息" column={{ xs: 1, sm: 2 }} size="small">
                    <Descriptions.Item label="bank_name">
                      <CopyValue value={account.bank_name} />
                    </Descriptions.Item>
                    <Descriptions.Item label="swift_code">
                      <CopyValue value={account.swift_code} />
                    </Descriptions.Item>
                    <Descriptions.Item label="routing_number">
                      <CopyValue value={account.routing_number} />
                    </Descriptions.Item>
                    <Descriptions.Item label="bank_address">
                      <CopyValue value={account.bank_address} />
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                <Card title="收款账户信息" style={{ borderRadius: 16 }}>
                  <Descriptions column={{ xs: 1, sm: 2 }} size="small">
                    <Descriptions.Item label="account_name">
                      <CopyValue value={account.account_name} />
                    </Descriptions.Item>
                    <Descriptions.Item label="account_number">
                      <CopyValue value={account.account_number} />
                    </Descriptions.Item>
                    <Descriptions.Item label="country">
                      <CopyValue value={account.country} />
                    </Descriptions.Item>
                    <Descriptions.Item label="city">
                      <CopyValue value={account.city} />
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                <Card title="入金申请表单" style={{ borderRadius: 16 }}>
                  <Form<DepositFormValues>
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    requiredMark={false}
                  >
                    <Row gutter={14}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="amount"
                          name="amount"
                          rules={[{ required: true, message: '请输入入金金额' }]}
                        >
                          <InputNumber
                            min={0.01}
                            precision={2}
                            addonBefore={currency}
                            placeholder="0.00"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="purpose"
                          name="purpose"
                          rules={[{ required: true, message: '请选择用途' }]}
                        >
                          <Select
                            placeholder="请选择"
                            options={['Investment', 'Deposit', 'Settlement'].map((value) => ({ value }))}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      label="source_of_funds"
                      name="source_of_funds"
                      rules={[{ required: true, message: '请选择资金来源' }]}
                    >
                      <Select
                        placeholder="请选择"
                        options={['Salary', 'Business Income', 'Savings'].map((value) => ({ value }))}
                      />
                    </Form.Item>
                    <Form.Item label="reference_note" name="reference_note">
                      <Input placeholder="请填写银行转账附言或补充说明" />
                    </Form.Item>
                    <Alert
                      type="warning"
                      showIcon
                      message="提交后记录进入 UNDER_REVIEW。审核通过后资金才会进入 client_available_balance。"
                      style={{ marginBottom: 16, borderRadius: 10 }}
                    />
                    <Button type="primary" htmlType="submit" block size="large">
                      Submit
                    </Button>
                  </Form>
                </Card>
              </Space>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="最近提交记录" style={{ borderRadius: 16 }}>
                <List
                  dataSource={currencyRecords}
                  locale={{ emptyText: '暂无提交记录' }}
                  renderItem={(record) => {
                    const config = statusConfig[record.status]
                    return (
                      <List.Item style={{ padding: '14px 0' }}>
                        <div style={{ width: '100%' }}>
                          <Row justify="space-between" align="top" gutter={8}>
                            <Col>
                              <Text strong>{formatAmount(record.amount, record.currency)}</Text>
                              <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  收款银行：{record.receiving_bank}
                                </Text>
                              </div>
                              <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  提交时间：{record.created_at}
                                </Text>
                              </div>
                            </Col>
                            <Col>
                              <Tag color={config.color}>{config.label}</Tag>
                            </Col>
                          </Row>
                          <Divider style={{ margin: '10px 0 0' }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {config.note}
                          </Text>
                        </div>
                      </List.Item>
                    )
                  }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  )
}
