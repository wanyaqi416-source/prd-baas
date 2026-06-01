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
type AccountType = 'hk' | 'us'
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
  account_type: AccountType
  amount: number
  currency: Currency
  receiving_bank: string
  remitting_bank: string
  created_at: string
  status: DepositStatus
}

type DepositFormValues = {
  amount: number
  currency: Currency
  purpose: 'Investment' | 'Deposit' | 'Settlement'
  source_of_funds: 'Salary' | 'Business Income' | 'Savings'
  reference_note?: string
}

const accountLabels: Record<AccountType, string> = {
  hk: '香港账户',
  us: '美国账户',
}

const receivingBankAccounts: Record<AccountType, Record<Currency, BankAccount>> = {
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
    HKD: {
      bank_name: 'Fidere US Receiving Bank',
      swift_code: 'FIDRUS33HKD',
      routing_number: '026009594',
      bank_address: '110 North Carpenter Street, Chicago, IL',
      account_name: 'Fidere Trust Limited - US HKD',
      account_number: 'US-VA-HKD-00067890',
      country: 'United States',
      city: 'Chicago',
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

const initialRecords: DepositRecord[] = [
  {
    id: 'dep-1005',
    account_type: 'hk',
    amount: 12,
    currency: 'USD',
    receiving_bank: 'Fidere Hong Kong Receiving Bank',
    remitting_bank: 'HSBC Hong Kong',
    created_at: '2028-05-18 14:26',
    status: 'APPROVED',
  },
  {
    id: 'dep-1004',
    account_type: 'hk',
    amount: 111,
    currency: 'USD',
    receiving_bank: 'Fidere Hong Kong Receiving Bank',
    remitting_bank: 'HSBC Hong Kong',
    created_at: '2028-05-18 10:42',
    status: 'UNDER_REVIEW',
  },
  {
    id: 'dep-1003',
    account_type: 'us',
    amount: 123,
    currency: 'USD',
    receiving_bank: 'Fidere US Receiving Bank',
    remitting_bank: 'JPMorgan Chase Bank, N.A.',
    created_at: '2028-05-15 16:53',
    status: 'APPROVED',
  },
  {
    id: 'dep-2002',
    account_type: 'hk',
    amount: 8800,
    currency: 'HKD',
    receiving_bank: 'Fidere Hong Kong Receiving Bank',
    remitting_bank: 'HSBC Hong Kong',
    created_at: '2028-05-13 09:20',
    status: 'UNDER_REVIEW',
  },
  {
    id: 'dep-2001',
    account_type: 'us',
    amount: 3200,
    currency: 'HKD',
    receiving_bank: 'Fidere US Receiving Bank',
    remitting_bank: 'JPMorgan Chase Bank, N.A.',
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

function createRecord(values: DepositFormValues, accountType: AccountType, receivingAccount: BankAccount, remittingBank: BankAccount): DepositRecord {
  return {
    id: `dep-${Date.now()}`,
    account_type: accountType,
    amount: values.amount,
    currency: values.currency,
    receiving_bank: receivingAccount.bank_name,
    remitting_bank: remittingBank.bank_name,
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
  const [accountType, setAccountType] = useState<AccountType>('hk')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [selectedRemittingBankId, setSelectedRemittingBankId] = useState('hsbc')
  const [records, setRecords] = useState<DepositRecord[]>(initialRecords)
  const [form] = Form.useForm<DepositFormValues>()

  const receivingAccount = receivingBankAccounts[accountType][currency]
  const remittingBank = whitelistBanks[selectedRemittingBankId]
  const scopedRecords = useMemo(
    () => records.filter((record) => record.account_type === accountType && record.currency === currency),
    [accountType, currency, records],
  )

  const accountTabItems: TabsProps['items'] = [
    { key: 'hk', label: '香港账户' },
    { key: 'us', label: '美国账户' },
  ]

  const handleSubmit = (values: DepositFormValues) => {
    const nextRecord = createRecord(values, accountType, receivingBankAccounts[accountType][values.currency], remittingBank)
    setRecords((current) => [nextRecord, ...current])
    form.resetFields()
    form.setFieldsValue({ currency: values.currency })
    setCurrency(values.currency)
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
              <Text type="secondary">通过银行转账将资金存入所选香港账户或美国账户。</Text>
            </div>
          </div>

          <Card
            style={{ borderRadius: 12, marginBottom: 18 }}
            bodyStyle={{ padding: '12px 16px' }}
          >
            <Row align="middle" justify="space-between" gutter={[16, 12]}>
              <Col>
                <Space align="center">
                  <Text strong>选择账户</Text>
                  <Tabs
                    activeKey={accountType}
                    items={accountTabItems}
                    onChange={(key) => setAccountType(key as AccountType)}
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
                  <Select
                    value={selectedRemittingBankId}
                    onChange={setSelectedRemittingBankId}
                    options={Object.values(whitelistBanks).map((bank) => ({ value: bank.id, label: bank.label }))}
                    style={{ width: 280, marginBottom: 16 }}
                  />
                  <Descriptions title="用户白名单银行信息" column={{ xs: 1, sm: 2 }} size="small">
                    <Descriptions.Item label="bank_name">
                      <CopyValue value={remittingBank.bank_name} />
                    </Descriptions.Item>
                    <Descriptions.Item label="swift_code">
                      <CopyValue value={remittingBank.swift_code} />
                    </Descriptions.Item>
                    <Descriptions.Item label="routing_number">
                      <CopyValue value={remittingBank.routing_number} />
                    </Descriptions.Item>
                    <Descriptions.Item label="bank_address">
                      <CopyValue value={remittingBank.bank_address} />
                    </Descriptions.Item>
                    <Descriptions.Item label="account_name">
                      <CopyValue value={remittingBank.account_name} />
                    </Descriptions.Item>
                    <Descriptions.Item label="account_number">
                      <CopyValue value={remittingBank.account_number} />
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                <Card title={`收款账户信息 · ${accountLabels[accountType]}`} style={{ borderRadius: 16 }}>
                  <Descriptions column={{ xs: 1, sm: 2 }} size="small">
                    <Descriptions.Item label="account_type">
                      <CopyValue value={`${accountLabels[accountType]} ${currency}`} />
                    </Descriptions.Item>
                    <Descriptions.Item label="bank_name">
                      <CopyValue value={receivingAccount.bank_name} />
                    </Descriptions.Item>
                    <Descriptions.Item label="account_name">
                      <CopyValue value={receivingAccount.account_name} />
                    </Descriptions.Item>
                    <Descriptions.Item label="account_number">
                      <CopyValue value={receivingAccount.account_number} />
                    </Descriptions.Item>
                    <Descriptions.Item label="swift_code">
                      <CopyValue value={receivingAccount.swift_code} />
                    </Descriptions.Item>
                    <Descriptions.Item label="country">
                      <CopyValue value={receivingAccount.country} />
                    </Descriptions.Item>
                    <Descriptions.Item label="city">
                      <CopyValue value={receivingAccount.city} />
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                <Card title="入金申请表单" style={{ borderRadius: 16 }}>
                  <Form<DepositFormValues>
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    requiredMark={false}
                    initialValues={{ currency }}
                  >
                    <Row gutter={14}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="currency"
                          name="currency"
                          rules={[{ required: true, message: '请选择入金币种' }]}
                        >
                          <Select
                            placeholder="请选择"
                            onChange={(value) => setCurrency(value)}
                            options={[
                              { value: 'USD', label: 'USD 美元' },
                              { value: 'HKD', label: 'HKD 港币' },
                            ]}
                          />
                        </Form.Item>
                      </Col>
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
                      message={`提交后记录进入 UNDER_REVIEW。当前入金至${accountLabels[accountType]}，审核通过后资金才会进入 client_available_balance。`}
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
                  dataSource={scopedRecords}
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
                                  打款银行：{record.remitting_bank}
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
