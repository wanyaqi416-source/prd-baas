import { Fragment, useMemo, useState } from 'react'
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock3,
  Copy,
  Download,
  Droplet,
  Eye,
  FileCheck2,
  FileText,
  Gauge,
  KeyRound,
  Languages,
  LineChart,
  ListChecks,
  PauseCircle,
  Percent,
  Pencil,
  Play,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sun,
  UploadCloud,
  UserCheck,
  UserRound,
  UsersRound,
  WalletCards,
  X,
  XCircle,
} from 'lucide-react'

import {
  accountCurrencyAccountTypes,
  enabledCurrencyOptions,
  getCurrencyName,
  initialAccountCurrencyConfigs,
} from '../data/accountCurrencyConfig'
import { initialAccountTypeConfigs } from '../data/accountTypeConfig'
import {
  brokerageConfigStatusOptions,
  brokerageDisplayTagOptions,
  brokerageMarketCoverageOptions,
  brokerageMaterialTemplates,
  initialBrokerageConfigs,
} from '../data/brokerageConfig'
import {
  brokerageBrokers,
  brokerageFileRule,
  brokerageOpeningStatuses,
  brokerageOpeningStatusTones,
  initialBrokerageApplications,
} from '../data/securitiesBrokerageApplications'
import { createSingaporeAccountRecord } from '../data/userAccountConfig'
import { CurrencyIcon } from '../components/baas/CurrencyIcon'

const pendingApplications = [
  {
    initials: 'WW',
    name: 'WANYARA WAN',
    id: '154',
    email: 'xr3kes66@123mails.org',
    submittedAt: '2026-05-29 17:38:14',
    status: '审核中',
  },
  {
    initials: 'L',
    name: 'LA LA LA',
    id: '152',
    email: 'tuntonxx@swagpapa.com',
    submittedAt: '2026-05-26 19:43:20',
    status: '待提交',
  },
  {
    initials: 'S',
    name: 'SAD SDA ASD',
    id: '150',
    email: 'axedclon@rulersonline.com',
    submittedAt: '2026-05-22 18:30:29',
    status: '审核通过',
  },
]

const reviewProfile = {
  firstName: 'Wanyara',
  lastName: 'Wan',
  fullName: 'Wanyara Wan',
  birthday: '1990-03-18',
  gender: '女',
  nationality: 'HKG',
  phoneCode: '852',
  phone: '91234567',
  documentNumber: 'K1234567',
  documentIssueDate: '2020-06-01',
  documentExpiryDate: '2030-06-01',
  region: 'HK',
  address: '88 Queens Road Central',
  city: 'Hong Kong',
  state: 'Hong Kong',
  country: 'HKG',
  postalCode: '999077',
  documentType: 'PASSPORT',
  email: 'xr3kes66@123mails.org',
  submittedAt: '2026-05-29 17:38:14',
  userId: '154',
}

const reviewFieldGroups = [
  {
    title: '基本信息',
    fields: [
      { label: '名', value: reviewProfile.firstName },
      { label: '姓', value: reviewProfile.lastName },
      { label: '出生日期', value: reviewProfile.birthday },
      { label: '性别', value: reviewProfile.gender },
      { label: '国籍', value: reviewProfile.nationality },
      { label: '手机号', value: reviewProfile.phone },
      {
        label: '电话国家代码',
        value: reviewProfile.phoneCode,
        note: '模拟从 Sumsub / 手机号国家代码读取。',
      },
      {
        label: '地区',
        value: reviewProfile.region,
        note: '模拟 Sumsub / 护照国家读取，当前 mock 为 HK。',
      },
    ],
  },
  {
    title: '证件与地址信息',
    fields: [
      {
        label: '证件号码',
        value: reviewProfile.documentNumber,
        note: '模拟从 Sumsub 护照资料读取。',
      },
      {
        label: '证件签发日期',
        value: reviewProfile.documentIssueDate,
        note: '模拟从 Sumsub 护照资料读取。',
      },
      {
        label: '证件到期日',
        value: reviewProfile.documentExpiryDate,
        note: '模拟从 Sumsub 护照资料读取。',
      },
      { label: '证件类型', value: reviewProfile.documentType },
      { label: '居住地街道地址', value: reviewProfile.address },
      { label: '居住地城市', value: reviewProfile.city },
      { label: '居住地州/地区', value: reviewProfile.state },
      { label: '居住地所在国家', value: reviewProfile.country },
      { label: '居住地邮编', value: reviewProfile.postalCode },
    ],
  },
]

const attachmentRows = [
  { name: '护照文件', fileName: 'passport-wanyara-wan.pdf', status: '已上传' },
  { name: '身份证明文件', fileName: 'identity-proof-wanyara-wan.pdf', status: '已上传' },
  { name: '自拍照', fileName: 'selfie-wanyara-wan.jpg', status: '已上传' },
  { name: '地址证明', fileName: 'address-proof-hk.pdf', status: '已上传' },
  { name: '资金来源证明', fileName: 'source-of-funds.pdf', status: '已上传' },
  { name: 'FATCA 第三方文档签署', fileName: 'fatca-signature.pdf', status: '已签署', signatureStatus: 'signed' },
  { name: 'FATCA 第三方文档签署', fileName: 'fatca-pending-demo.pdf', status: '未签署', signatureStatus: 'pending' },
]

const userRows = [
  { initials: 'jwy', name: 'jin wu ye', id: '130', email: 'orvafrew@123mails.org', type: '个人', approvedAt: '2026-05-21 15:19:02', lastActiveAt: '2026-05-28 10:26:51' },
  { initials: 'wt', name: 'wanyara test', id: '120', email: 'tougzguy75@pdf-cutter.com', type: '个人', approvedAt: '2026-05-20 16:47:23', lastActiveAt: '2026-05-21 17:51:35' },
  { initials: 'y', name: 'yarafivewewe', id: '110', email: 'nr5bob@mediaeast.uk', type: '企业', approvedAt: '2026-05-19 14:12:22', lastActiveAt: '2026-05-29 15:18:34' },
  { initials: '2', name: '2342', id: '98', email: 'ac1yanch@gongjua.com', type: '企业', approvedAt: '2026-05-13 17:13:39', lastActiveAt: '2026-05-19 17:04:53' },
]

const fiatAccountCurrencyCodes = {
  香港账户: ['USD', 'HKD', 'CNY', 'EUR', 'SGD'],
  新加坡账户: ['USD', 'CNY', 'SGD', 'AED', 'JPY'],
  巴林账户: ['USD', 'BHD'],
  美国账户: ['USD'],
  'IBKR 盈透证券账户': ['USD', 'HKD', 'CNY'],
  'Webull 微牛证券账户': ['USD', 'HKD', 'CNY'],
}

const fiatCurrencySelectLabels = {
  AED: 'AED - 阿联酋迪拉姆',
  BHD: 'BHD - 巴林第纳尔',
  CNY: 'CNY - 人民币',
  EUR: 'EUR - 欧元',
  HKD: 'HKD - 港币',
  JPY: 'JPY - 日元',
  SGD: 'SGD - 新加坡元',
  USD: 'USD - 美元',
}

const createEmptyFiatBalances = (currencies) => currencies.map((currency) => ({
  currency,
  available: '0',
  frozen: '0',
  inTransit: '0',
  total: '0',
  recentIn: '0',
  recentOut: '0',
}))

const fiatAccountCurrencyOptions = Object.fromEntries(
  Object.entries(fiatAccountCurrencyCodes).map(([accountType, currencies]) => [
    accountType,
    currencies.map((currency) => fiatCurrencySelectLabels[currency] || currency),
  ]),
)

const emptyFiatAccountBalancesByType = Object.fromEntries(
  Object.entries(fiatAccountCurrencyCodes).map(([accountType, currencies]) => [
    accountType,
    createEmptyFiatBalances(currencies),
  ]),
)

const transferRows = [
  {
    requestId: 'TXN-20260727-001',
    transferType: '转账给其他用户',
    fromUser: { name: 'YAQI WAN', id: '188', email: 'wanyaqi416@gmail.com' },
    toUser: { name: 'YUE QI', id: '4', email: 'voigtus1@123mails.org' },
    fromAccount: '新加坡账户',
    toAccount: '新加坡账户',
    currency: 'USD',
    amount: 'USD 200.00',
    transferAmount: 'USD 200.00',
    fee: 'USD 0.00',
    estimatedArrival: 'USD 200.00',
    actualArrivalAmount: 'USD 200.00',
    status: '已完成',
    submittedAt: '2026-07-27 14:30',
    completedAt: '2026-07-27 14:32',
    note: '用户间转账',
  },
  {
    requestId: 'TXN-20260727-002',
    transferType: '转账给其他用户',
    fromUser: { name: 'WANYARA WAN', id: '154', email: 'xr3kes66@123mails.org' },
    toUser: { name: 'ALEX CHEN', id: '203', email: 'alex.chen@example.com' },
    fromAccount: '香港账户',
    toAccount: '香港账户',
    currency: 'CNY',
    amount: 'CNY 880.00',
    transferAmount: 'CNY 880.00',
    fee: 'CNY 0.00',
    estimatedArrival: 'CNY 880.00',
    actualArrivalAmount: '',
    status: '处理中',
    submittedAt: '2026-07-27 13:16',
    completedAt: '',
    note: '项目费用结算',
  },
  {
    requestId: 'TXN-20260727-003',
    transferType: '转账给其他用户',
    fromUser: { name: 'QIXUE', id: '4', email: 'voigtus1@123mails.org' },
    toUser: { name: 'LUZHOU LU', id: '86', email: 'luzhou.lu@example.com' },
    fromAccount: '新加坡账户',
    toAccount: '新加坡账户',
    currency: 'SGD',
    amount: 'SGD 120.00',
    transferAmount: 'SGD 120.00',
    fee: 'SGD 0.00',
    estimatedArrival: 'SGD 120.00',
    actualArrivalAmount: '',
    status: '失败',
    submittedAt: '2026-07-27 11:45',
    completedAt: '2026-07-27 11:46',
    note: '日常往来',
    failureReason: '收款用户账户状态异常，系统未执行入账。',
  },
  {
    requestId: 'TXN-20260727-004',
    transferType: '转账给其他用户',
    fromUser: { name: 'jin wu ye', id: '130', email: 'orvafrew@123mails.org' },
    toUser: { name: 'YUE QI', id: '4', email: 'voigtus1@123mails.org' },
    fromAccount: '香港账户',
    toAccount: '香港账户',
    currency: 'JPY',
    amount: 'JPY 5,000',
    transferAmount: 'JPY 5,000',
    fee: 'JPY 0',
    estimatedArrival: 'JPY 5,000',
    actualArrivalAmount: '',
    status: '已撤销',
    submittedAt: '2026-07-27 10:08',
    completedAt: '2026-07-27 10:12',
    note: '用户主动撤销',
  },
  {
    requestId: 'TXN-20260726-005',
    transferType: '转账给其他用户',
    fromUser: { name: 'YAQI WAN', id: '188', email: 'wanyaqi416@gmail.com' },
    toUser: { name: 'SAD SDA ASD', id: '150', email: 'axedclon@rulersonline.com' },
    fromAccount: '新加坡账户',
    toAccount: '新加坡账户',
    currency: 'AED',
    amount: 'AED 300.00',
    transferAmount: 'AED 300.00',
    fee: 'AED 0.00',
    estimatedArrival: 'AED 300.00',
    actualArrivalAmount: '',
    status: '待审核',
    submittedAt: '2026-07-26 18:20',
    completedAt: '',
    note: '用户间转账申请',
  },
  {
    requestId: 'TXN-20260726-006',
    transferType: '转账给其他用户',
    fromUser: { name: 'LUZHOU LU', id: '86', email: 'luzhou.lu@example.com' },
    toUser: { name: 'WANYARA WAN', id: '154', email: 'xr3kes66@123mails.org' },
    fromAccount: '美国账户',
    toAccount: '美国账户',
    currency: 'USD',
    amount: 'USD 75.00',
    transferAmount: 'USD 75.00',
    fee: 'USD 0.00',
    estimatedArrival: 'USD 75.00',
    actualArrivalAmount: '',
    status: '已拒绝',
    submittedAt: '2026-07-26 16:05',
    completedAt: '2026-07-26 16:20',
    note: '用户间转账申请',
    rejectReason: '收款用户邮箱与提交信息不一致。',
  },
  {
    requestId: 'IT-1780221843260',
    transferType: '本人账户互转',
    customer: { name: 'yejin', id: '130', email: 'orvafrew@123mails.org' },
    fromAccount: '香港账户',
    toAccount: '美国账户',
    currency: 'USD',
    amount: 'USD 1.00',
    transferAmount: 'USD 1.00',
    fee: 'USD 15.00',
    estimatedArrival: 'USD 0.00',
    actualArrivalAmount: 'USD 1.00',
    status: '待审核',
    submittedAt: '2026-05-31 18:04',
    completedAt: '',
  },
  {
    requestId: 'IT-1780221843261',
    transferType: '本人账户互转',
    customer: { name: 'QIXUE', id: '4', email: 'voigtus1@123mails.org' },
    fromAccount: '美国账户',
    toAccount: '香港账户',
    currency: 'USD',
    amount: 'USD 8.00',
    transferAmount: 'USD 8.00',
    fee: 'USD 15.00',
    estimatedArrival: 'USD 0.00',
    actualArrivalAmount: 'USD 8.00',
    status: '已完成',
    submittedAt: '2026-05-31 18:16',
    completedAt: '2026-05-31 19:08',
  },
  {
    requestId: 'IT-1780221843262',
    transferType: '本人账户互转',
    customer: { name: 'LUZHOU LU', id: '86', email: 'luzhou.lu@example.com' },
    fromAccount: '香港账户',
    toAccount: '美国账户',
    currency: 'USD',
    amount: 'USD 3.00',
    transferAmount: 'USD 3.00',
    fee: 'USD 15.00',
    estimatedArrival: 'USD 0.00',
    actualArrivalAmount: 'USD 3.00',
    status: '已拒绝',
    submittedAt: '2026-05-31 18:29',
    completedAt: '2026-05-31 19:20',
    rejectReason: '客户资料与收款账户信息不一致，需补充说明后重新提交。',
  },
  {
    requestId: 'IT-1780221843263',
    transferType: '信托转券商',
    customer: { name: 'jin wu ye', id: '130', email: 'orvafrew@123mails.org' },
    fromAccount: '香港账户',
    toAccount: 'Webull 微牛证券账户',
    currency: 'USD',
    amount: 'USD 500.00',
    transferAmount: 'USD 500.00',
    fee: 'USD 0.00',
    estimatedArrival: 'USD 500.00',
    actualArrivalAmount: '',
    status: '待审核',
    submittedAt: '2026-06-22 10:18',
    completedAt: '',
  },
  {
    requestId: 'IT-1780221843264',
    transferType: '券商转信托',
    customer: { name: 'WANYARA WAN', id: '154', email: 'xr3kes66@123mails.org' },
    fromAccount: 'IBKR 盈透证券账户',
    toAccount: '香港账户',
    currency: 'USD',
    amount: 'USD 320.00',
    transferAmount: 'USD 320.00',
    fee: 'USD 0.00',
    estimatedArrival: 'USD 320.00',
    actualArrivalAmount: 'USD 320.00',
    status: '已完成',
    submittedAt: '2026-06-22 11:36',
    completedAt: '2026-06-22 12:10',
  },
  {
    requestId: 'IT-1780221843265',
    transferType: '本人账户互转',
    customer: { name: 'jin wu ye', id: '130', email: 'orvafrew@123mails.org' },
    fromAccount: '香港账户',
    toAccount: '新加坡账户',
    currency: 'USD',
    amount: 'USD 25.60',
    transferAmount: 'USD 25.60',
    fee: 'USD 15.00',
    estimatedArrival: 'USD 10.60',
    actualArrivalAmount: '',
    status: '待审核',
    submittedAt: '2026-06-23 09:42',
    completedAt: '',
  },
  {
    requestId: 'IT-1780221843266',
    transferType: '本人账户互转',
    customer: { name: 'QIXUE', id: '4', email: 'voigtus1@123mails.org' },
    fromAccount: '新加坡账户',
    toAccount: '香港账户',
    currency: 'SGD',
    amount: 'SGD 120.00',
    transferAmount: 'SGD 120.00',
    fee: 'SGD 0.00',
    estimatedArrival: 'SGD 120.00',
    actualArrivalAmount: 'SGD 120.00',
    status: '已完成',
    submittedAt: '2026-06-23 10:08',
    completedAt: '2026-06-23 10:26',
  },
  {
    requestId: 'IT-20260727-BH-001',
    transferType: '本人账户互转',
    customer: { name: 'jin wu ye', id: '130', email: 'orvafrew@123mails.org' },
    fromAccount: '巴林账户',
    toAccount: '香港账户',
    currency: 'USD',
    amount: 'USD 180.00',
    transferAmount: 'USD 180.00',
    fee: 'USD 0.00',
    estimatedArrival: 'USD 180.00',
    actualArrivalAmount: '',
    status: '待审核',
    submittedAt: '2026-07-27 16:10',
    completedAt: '',
    note: '巴林账户资金调拨',
  },
]

const manualAccountOptions = ['香港账户', '新加坡账户', '巴林账户', '美国账户', 'IBKR 盈透证券账户', 'Webull 微牛证券账户']

const accountFilterOptions = ['香港账户', '新加坡账户', '巴林账户', '美国账户', 'IBKR 盈透证券账户', 'Webull 微牛证券账户']

const incomingClaimRows = [
  {
    id: 'IC-20260522-001',
    submittedAt: '2026-05-22 18:54:17',
    accountType: '香港账户',
    currencyAmount: 'USD 10',
    payer: 'JW',
    channel: '电汇',
    referenceNo: '-',
    voucher: '-',
    matchedCustomer: 'yejin',
    matchStatus: '已匹配',
    status: '处理完成',
  },
  {
    id: 'IC-20260522-002',
    submittedAt: '2026-05-22 18:53:41',
    accountType: '美国账户',
    currencyAmount: 'USD 12',
    claimableAmount: 'USD 12',
    payer: 'JW',
    channel: '电汇',
    referenceNo: '-',
    voucher: '-',
    matchedCustomer: 'yejin',
    matchStatus: '已匹配',
    status: '待审核',
  },
  {
    id: 'IC-20260520-001',
    submittedAt: '2026-05-20 14:05:44',
    accountType: '香港账户',
    currencyAmount: 'HKD 100',
    payer: 'LL',
    channel: '电汇',
    referenceNo: '-',
    voucher: '-',
    matchedCustomer: 'luluzhuo',
    matchStatus: '已匹配',
    status: '处理完成',
  },
  {
    id: 'IC-20260622-001',
    submittedAt: '2026-06-22 10:22:11',
    accountType: 'Webull 微牛证券账户',
    currencyAmount: 'USD 500',
    claimableAmount: 'USD 500',
    payer: 'FIDERE TRUST USD',
    channel: '内部转账',
    referenceNo: 'WB-IN-500',
    voucher: '-',
    matchedCustomer: 'jin wu ye',
    matchStatus: '已匹配',
    status: '待审核',
  },
  {
    id: 'IC-20260622-002',
    submittedAt: '2026-06-22 11:08:35',
    accountType: 'IBKR 盈透证券账户',
    currencyAmount: 'USD 320',
    claimableAmount: 'USD 320',
    payer: 'FIDERE TRUST USD',
    channel: '内部转账',
    referenceNo: 'IBKR-IN-320',
    voucher: '-',
    matchedCustomer: 'WANYARA WAN',
    matchStatus: '已匹配',
    status: '处理完成',
  },
  {
    id: 'IC-20260623-001',
    submittedAt: '2026-06-23 09:18:20',
    accountType: '新加坡账户',
    currencyAmount: 'SGD 120',
    claimableAmount: 'SGD 120',
    payer: 'WAN YARA WAN',
    channel: '电汇',
    referenceNo: 'SG-IN-120',
    voucher: '-',
    matchedCustomer: 'jin wu ye',
    matchStatus: '已匹配',
    status: '待审核',
  },
  {
    id: 'IC-20260727-BH-001',
    submittedAt: '2026-07-27 15:36:12',
    accountType: '巴林账户',
    currencyAmount: 'BHD 125.000',
    claimableAmount: 'BHD 125.000',
    payer: 'BAHRAIN ACCOUNT HOLDER',
    channel: '电汇',
    referenceNo: 'BH-IN-125',
    voucher: '-',
    matchedCustomer: 'jin wu ye',
    matchStatus: '已匹配',
    status: '待审核',
  },
]

const fiatLedgerRows = [
  { id: 'LEDGER-20260525-001', time: '2026-05-25 16:01:10', customer: 'yejin', customerId: '130', accountType: '香港账户', currencyAmount: 'HKD 10', type: '出金', channel: '其他', referenceNo: '-', status: '待处理' },
  { id: 'LEDGER-20260525-002', time: '2026-05-25 14:49:52', customer: 'QIXUE', customerId: '4', accountType: '美国账户', currencyAmount: 'USD 11', type: '出金', channel: '其他', referenceNo: '-', status: '待处理' },
  { id: 'LEDGER-20260525-003', time: '2026-05-25 14:23:43', customer: 'QIXUE', customerId: '4', accountType: '美国账户', currencyAmount: 'USD 11', type: '出金', channel: '其他', referenceNo: '-', status: '待处理' },
  { id: 'LEDGER-20260525-004', time: '2026-05-25 10:49:22', customer: 'yejin', customerId: '130', accountType: '香港账户', currencyAmount: 'USD 1', type: '出金', channel: '其他', referenceNo: '-', status: '待处理' },
  { id: 'LEDGER-20260523-001', time: '2026-05-23 09:18:20', customer: 'wanyara', customerId: '120', accountType: '香港账户', currencyAmount: 'HKD 100', type: '入金', channel: '电汇', referenceNo: 'REF-HK-100', status: '处理完成' },
  { id: 'LEDGER-20260520-001', time: '2026-05-20 11:05:44', customer: '2342', customerId: '98', accountType: '美国账户', currencyAmount: 'USD 20', type: '入金', channel: 'ACH', referenceNo: 'REF-US-020', status: '处理完成' },
  { id: 'LEDGER-20260623-001', time: '2026-06-23 09:18:20', customer: 'jin wu ye', customerId: '130', accountType: '新加坡账户', currencyAmount: 'SGD 120', type: '入金', channel: '电汇', referenceNo: 'SG-IN-120', status: '待处理' },
  { id: 'LEDGER-20260623-002', time: '2026-06-23 10:08:11', customer: 'QIXUE', customerId: '4', accountType: '新加坡账户', currencyAmount: 'AED 300', type: '出金', channel: '电汇', referenceNo: 'SG-WD-AED-300', status: '处理完成' },
  { id: 'LEDGER-20260727-BH-001', time: '2026-07-27 15:36:12', customer: 'jin wu ye', customerId: '130', accountType: '巴林账户', currencyAmount: 'BHD 125.000', type: '入金', channel: '电汇', referenceNo: 'BH-IN-125', status: '待处理' },
]

const fiatAssetAccountCardTypes = ['香港账户', '新加坡账户', '巴林账户', '美国账户', 'IBKR 盈透证券账户', 'Webull 微牛证券账户']

const customerAssetRows = [
  {
    id: '130',
    initials: 'j',
    name: 'jin wu ye',
    email: 'orvafrew@123mails.org',
    type: '个人',
    accountTypes: ['香港账户', '新加坡账户', '巴林账户', '美国账户', 'IBKR 盈透证券账户', 'Webull 微牛证券账户'],
    totalUsd: '257.32',
    yesterdayChange: '0',
    lastActivity: '2026-05-25 07:36',
    accountBalances: {
      香港账户: [
        { currency: 'HKD', available: '1.58', frozen: '12', inTransit: '0', total: '13.58', recentIn: '0', recentOut: '0' },
        { currency: 'USD', available: '11', frozen: '1.2', inTransit: '0', total: '12.2', recentIn: '0', recentOut: '0' },
      ],
      美国账户: [
        { currency: 'USD', available: '95.72', frozen: '0', inTransit: '0', total: '95.72', recentIn: '20', recentOut: '11' },
      ],
      新加坡账户: [
        { currency: 'USD', available: '25.60', frozen: '0', inTransit: '0', total: '25.60', recentIn: '25.60', recentOut: '0' },
        { currency: 'CNY', available: '500.00', frozen: '0', inTransit: '0', total: '500.00', recentIn: '500', recentOut: '0' },
        { currency: 'SGD', available: '120.00', frozen: '0', inTransit: '0', total: '120.00', recentIn: '120', recentOut: '0' },
        { currency: 'AED', available: '0', frozen: '0', inTransit: '0', total: '0', recentIn: '0', recentOut: '0' },
        { currency: 'JPY', available: '0', frozen: '0', inTransit: '0', total: '0', recentIn: '0', recentOut: '0' },
      ],
      巴林账户: [
        { currency: 'USD', available: '180.00', frozen: '0', inTransit: '0', total: '180.00', recentIn: '180.00', recentOut: '0' },
        { currency: 'BHD', available: '125.000', frozen: '0', inTransit: '0', total: '125.000', recentIn: '125.000', recentOut: '0' },
      ],
      'IBKR 盈透证券账户': [
        { currency: 'USD', available: '320.00', frozen: '0', inTransit: '0', total: '320.00', recentIn: '320', recentOut: '0' },
        { currency: 'HKD', available: '0', frozen: '0', inTransit: '0', total: '0', recentIn: '0', recentOut: '0' },
      ],
      'Webull 微牛证券账户': [
        { currency: 'USD', available: '500.00', frozen: '0', inTransit: '0', total: '500.00', recentIn: '500', recentOut: '0' },
        { currency: 'HKD', available: '80.00', frozen: '0', inTransit: '0', total: '80.00', recentIn: '80', recentOut: '0' },
      ],
    },
    recentFlows: [
      { time: '2026-07-27 15:36:12', accountType: '巴林账户', currencyAmount: 'BHD 125.000', direction: '入金', channel: '电汇', status: '待处理' },
      { time: '2026-06-23 09:18:20', accountType: '新加坡账户', currencyAmount: 'SGD 120', direction: '入金', channel: '电汇', status: '待处理' },
      { time: '2026-05-25 08:01:10', accountType: '香港账户', currencyAmount: 'HKD 10', direction: '出金', channel: '其他', status: '待处理' },
      { time: '2026-05-25 03:29:03', accountType: '美国账户', currencyAmount: 'USD 1', direction: '出金', channel: '未知', status: '处理完成' },
    ],
  },
  {
    id: '4',
    initials: 'Q',
    name: 'QIXUE',
    email: 'voigtus1@123mails.org',
    type: '个人',
    accountTypes: ['新加坡账户', '美国账户', 'IBKR 盈透证券账户'],
    totalUsd: '125.65',
    yesterdayChange: '0',
    lastActivity: '2026-05-25 14:49',
    accountBalances: {
      香港账户: [
        { currency: 'HKD', available: '0', frozen: '0', inTransit: '0', total: '0', recentIn: '0', recentOut: '0' },
        { currency: 'USD', available: '0', frozen: '0', inTransit: '0', total: '0', recentIn: '0', recentOut: '0' },
      ],
      美国账户: [
        { currency: 'USD', available: '44', frozen: '0', inTransit: '0', total: '44', recentIn: '0', recentOut: '22' },
      ],
      新加坡账户: [
        { currency: 'USD', available: '0', frozen: '0', inTransit: '0', total: '0', recentIn: '0', recentOut: '0' },
        { currency: 'CNY', available: '0', frozen: '0', inTransit: '0', total: '0', recentIn: '0', recentOut: '0' },
        { currency: 'SGD', available: '120.00', frozen: '0', inTransit: '0', total: '120.00', recentIn: '0', recentOut: '120' },
        { currency: 'AED', available: '300.00', frozen: '0', inTransit: '0', total: '300.00', recentIn: '0', recentOut: '300' },
        { currency: 'JPY', available: '0', frozen: '0', inTransit: '0', total: '0', recentIn: '0', recentOut: '0' },
      ],
      'IBKR 盈透证券账户': [
        { currency: 'USD', available: '120.00', frozen: '0', inTransit: '0', total: '120.00', recentIn: '120', recentOut: '0' },
        { currency: 'HKD', available: '0', frozen: '0', inTransit: '0', total: '0', recentIn: '0', recentOut: '0' },
      ],
    },
    recentFlows: [
      { time: '2026-06-23 10:08:11', accountType: '新加坡账户', currencyAmount: 'AED 300', direction: '出金', channel: '电汇', status: '处理完成' },
      { time: '2026-05-25 14:49:52', accountType: '美国账户', currencyAmount: 'USD 11', direction: '出金', channel: '其他', status: '待处理' },
      { time: '2026-05-25 14:23:43', accountType: '美国账户', currencyAmount: 'USD 11', direction: '出金', channel: '其他', status: '待处理' },
    ],
  },
  {
    id: '120',
    initials: 'w',
    name: 'wanyara test',
    email: 'wanyara@example.com',
    type: '个人',
    accountTypes: ['香港账户', 'Webull 微牛证券账户'],
    totalUsd: '12.00',
    yesterdayChange: '0',
    lastActivity: '2026-05-23 09:18',
    accountBalances: {
      香港账户: [
        { currency: 'HKD', available: '100', frozen: '0', inTransit: '0', total: '100', recentIn: '100', recentOut: '0' },
        { currency: 'USD', available: '12', frozen: '0', inTransit: '0', total: '12', recentIn: '0', recentOut: '0' },
      ],
      美国账户: [
        { currency: 'USD', available: '0', frozen: '0', inTransit: '0', total: '0', recentIn: '0', recentOut: '0' },
      ],
      新加坡账户: createEmptyFiatBalances(fiatAccountCurrencyCodes.新加坡账户),
      'Webull 微牛证券账户': [
        { currency: 'USD', available: '260.00', frozen: '0', inTransit: '0', total: '260.00', recentIn: '260', recentOut: '0' },
        { currency: 'HKD', available: '120.00', frozen: '0', inTransit: '0', total: '120.00', recentIn: '120', recentOut: '0' },
      ],
    },
    recentFlows: [
      { time: '2026-05-23 09:18:20', accountType: '香港账户', currencyAmount: 'HKD 100', direction: '入金', channel: '电汇', status: '处理完成' },
      { time: '2026-05-22 14:16:09', accountType: '香港账户', currencyAmount: 'USD 4', direction: '出金', channel: '其他', status: '处理完成' },
      { time: '2026-05-21 13:55:10', accountType: '香港账户', currencyAmount: 'HKD 8', direction: '出金', channel: 'FPS', status: '处理完成' },
    ],
  },
]

const withdrawalApprovalRows = [
  {
    id: 'WO-20260525-001',
    appliedAt: '2026-05-25 16:01:10',
    customer: { name: 'yejin', id: '130', email: 'orvafrew@123mails.org' },
    accountType: '香港账户',
    currencyAmount: 'HKD 10',
    transferAmount: 'HKD 10',
    fee: 'HKD 2',
    actualArrivalAmount: 'HKD 8',
    recipient: 'JW',
    purpose: '未知',
    status: '待处理',
    channel: '电汇',
    bank: '测试银行',
  },
  {
    id: 'WO-20260525-002',
    appliedAt: '2026-05-25 14:49:52',
    customer: { name: 'QIXUE', id: '4', email: 'voigtus1@123mails.org' },
    accountType: '美国账户',
    currencyAmount: 'USD 11',
    transferAmount: 'USD 11',
    fee: 'USD 2.2',
    actualArrivalAmount: 'USD 8.8',
    recipient: 'YQ',
    purpose: '未知',
    status: '待处理',
    channel: '电汇',
    bank: 'WO Bank',
  },
  {
    id: 'WO-20260524-001',
    appliedAt: '2026-05-24 10:49:22',
    customer: { name: 'wanyara', id: '120', email: 'wanyara@example.com' },
    accountType: '香港账户',
    currencyAmount: 'USD 4',
    transferAmount: 'USD 4',
    fee: 'USD 0.8',
    actualArrivalAmount: 'USD 3.2',
    recipient: 'JW',
    purpose: '未知',
    status: '处理完成',
    channel: '电汇',
    bank: 'Fidere Partner Bank',
  },
  {
    id: 'WO-20260523-001',
    appliedAt: '2026-05-23 10:12:18',
    customer: { name: '2342', id: '98', email: 'ac1yanch@gongjua.com' },
    accountType: '美国账户',
    currencyAmount: 'USD 100',
    transferAmount: 'USD 100',
    fee: 'USD 3',
    actualArrivalAmount: 'USD 97',
    recipient: '忘记时间',
    purpose: '未知',
    status: '已拒绝',
    channel: '电汇',
    bank: 'WO Bank',
    rejectReason: '客户收款银行账户信息不完整。',
  },
  {
    id: 'WO-20260622-001',
    appliedAt: '2026-06-22 10:41:02',
    customer: { name: 'jin wu ye', id: '130', email: 'orvafrew@123mails.org' },
    accountType: 'Webull 微牛证券账户',
    currencyAmount: 'USD 240',
    transferAmount: 'USD 240',
    fee: 'USD 0',
    actualArrivalAmount: 'USD 240',
    recipient: 'Fidere Trust USD Account',
    purpose: '券商账户资金转回信托法币账户',
    status: '待处理',
    channel: '内部转账',
    bank: 'Fidere Trust',
  },
  {
    id: 'WO-20260622-002',
    appliedAt: '2026-06-22 11:27:45',
    customer: { name: 'WANYARA WAN', id: '154', email: 'xr3kes66@123mails.org' },
    accountType: 'IBKR 盈透证券账户',
    currencyAmount: 'USD 180',
    transferAmount: 'USD 180',
    fee: 'USD 0',
    actualArrivalAmount: 'USD 180',
    recipient: 'Fidere Trust USD Account',
    purpose: '券商账户资金转回信托法币账户',
    status: '处理完成',
    channel: '内部转账',
    bank: 'Fidere Trust',
  },
  {
    id: 'WO-20260623-001',
    appliedAt: '2026-06-23 10:08:11',
    customer: { name: 'QIXUE', id: '4', email: 'voigtus1@123mails.org' },
    accountType: '新加坡账户',
    currencyAmount: 'AED 300',
    transferAmount: 'AED 300',
    fee: 'AED 0',
    actualArrivalAmount: 'AED 300',
    recipient: 'QIXUE GLDB Account',
    purpose: '新加坡账户出金',
    status: '处理完成',
    channel: '电汇',
    bank: 'Green Link Digital Bank',
  },
  {
    id: 'WO-20260727-BH-001',
    appliedAt: '2026-07-27 16:02:45',
    customer: { name: 'jin wu ye', id: '130', email: 'orvafrew@123mails.org' },
    accountType: '巴林账户',
    currencyAmount: 'BHD 40.000',
    transferAmount: 'BHD 40.000',
    fee: 'BHD 0.500',
    actualArrivalAmount: 'BHD 39.500',
    recipient: 'BAHRAIN BENEFICIARY',
    purpose: '巴林账户出金',
    status: '待处理',
    channel: '电汇',
    bank: 'Bahrain Partner Bank',
  },
]

const customers = [
  { id: '65', email: 'vigze5606@justdefinition.com' },
  { id: '34', email: 'perumily2@mediaholy.com' },
  { id: '6', email: 'wanyaqi416@gmail.com' },
  { id: '4', email: 'voigtus1@123mails.org' },
]

const initialFeeConfigs = [
  { id: '65', email: 'vigze5606@justdefinition.com', mode: 'platform', value: '使用平台默认', usePlatformDefault: true },
  { id: '34', email: 'perumily2@mediaholy.com', mode: 'percent', value: '0.20%', usePlatformDefault: false },
  { id: '6', email: 'wanyaqi416@gmail.com', mode: 'fixed', value: 'USD 15.00', usePlatformDefault: false },
  { id: '4', email: 'voigtus1@123mails.org', mode: 'combo', value: 'USD 10.00 + 0.20%', usePlatformDefault: false },
]

const fiatTabs = ['总览', '客户资产', '流水查询', '入账认领', '出金审批', '资金互转', '对账中心']
const markedFiatTabs = new Set(['总览', '客户资产', '流水查询', '入账认领', '出金审批', '资金互转'])

function Header({ onBack }) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-[64px] items-center justify-between border-b border-[#dedfe8] bg-white px-[18px]">
      <button type="button" onClick={onBack} className="flex items-center gap-[10px] text-left">
        <span className="flex h-[27px] w-[27px] items-center justify-center rounded-full border border-[#496982] text-[#496982]">
          <Droplet className="h-[18px] w-[18px]" strokeWidth={1.9} />
        </span>
        <span className="text-[20px] font-bold leading-none text-[#22223a]">FIDERE TRUST</span>
        <CircleDot className="ml-[12px] h-[18px] w-[18px] text-[#69667c]" strokeWidth={2.2} />
      </button>

      <div className="flex items-center gap-[18px] pr-[12px] text-[#5f5c70]">
        <Languages className="h-[18px] w-[18px]" strokeWidth={2} />
        <Sun className="h-[18px] w-[18px]" strokeWidth={2} />
        <div className="relative flex h-[39px] w-[39px] items-center justify-center rounded-full bg-[#ececf3] text-[#252236]">
          <UserRound className="h-[22px] w-[22px]" fill="#252236" strokeWidth={0} />
          <span className="absolute bottom-[3px] right-[1px] h-[8px] w-[8px] rounded-full bg-[#58cf16] ring-[2px] ring-white" />
        </div>
      </div>
    </header>
  )
}
function SidebarItem({ icon: Icon, label, active = false, marked = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[43px] w-full items-center gap-[14px] rounded-r-[23px] pl-[23px] pr-4 text-[14px] transition ${
        active ? 'bg-[#9b63f5] font-semibold text-white' : 'text-[#24243d] hover:bg-white/70'
      }`}
    >
      <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
      <span className="flex min-w-0 items-center gap-[6px]">
        <span className="truncate">{label}</span>
        {marked ? (
          <span className={`flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${active ? 'bg-white text-[#8b4fff]' : 'bg-[#e7d6ff] text-[#8b4fff]'}`}>
            ?
          </span>
        ) : null}
      </span>
    </button>
  )
}

function QuestionMark({ active = false, inverse = false }) {
  const className = inverse
    ? 'bg-white text-[#8b4fff]'
    : active
      ? 'bg-[#8b4fff] text-white'
      : 'bg-[#e7d6ff] text-[#8b4fff]'

  return (
    <span className={`inline-flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${className}`}>
      ?
    </span>
  )
}

function SidebarGroup({ icon: Icon, label }) {
  return (
    <div className="mt-[7px] flex h-[42px] w-full items-center justify-between rounded-r-[23px] bg-[#e2e3eb] pl-[19px] pr-[18px] text-[14px] font-semibold text-[#24243d]">
      <span className="flex items-center gap-[13px]">
        <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
        {label}
      </span>
      <ChevronDown className="h-[17px] w-[17px]" strokeWidth={1.8} />
    </div>
  )
}

function Sidebar({ activePage, onSelect }) {
  return (
    <aside className="fixed bottom-0 left-0 top-[64px] z-20 w-[220px] overflow-y-auto bg-[#f4f5fb] pr-[4px]">
      <nav className="pb-8 pt-[2px]">
        <SidebarGroup icon={ShieldCheck} label="KYC审核" />
        <div className="mt-[10px] space-y-[4px]">
          <SidebarItem icon={BriefcaseBusiness} label="案件工作台" onClick={() => onSelect('opening-review')} />
          <SidebarItem icon={ListChecks} label="开户审核" marked active={activePage === 'opening-review'} onClick={() => onSelect('opening-review')} />
          <SidebarItem icon={UsersRound} label="用户管理" marked active={activePage === 'user-management'} onClick={() => onSelect('user-management')} />
          <SidebarItem icon={Gauge} label="处理中审核" />
          <SidebarItem icon={WalletCards} label="法币账户审核" />
          <SidebarItem icon={FileCheck2} label="数字资产地址审核" />
          <SidebarItem icon={FileText} label="信托管理" />
          <SidebarItem icon={Gauge} label="审核日志" />
        </div>

        <SidebarGroup icon={ListChecks} label="运营" />
        <div className="mt-[9px] space-y-[4px]">
          <SidebarItem icon={Gauge} label="概览" />
          <SidebarItem icon={UserRound} label="客户" />
          <SidebarItem icon={UserRound} label="资产中心" />
          <SidebarItem icon={ShoppingCart} label="法币资产管理" marked active={activePage === 'fiat-assets'} onClick={() => onSelect('fiat-assets')} />
          <SidebarItem icon={CircleDot} label="数字资产管理" />
          <SidebarItem icon={LineChart} label="理财产品" />
          <SidebarItem icon={CircleDot} label="交易管理" />
          <SidebarItem icon={Percent} label="提现服务费配置" marked active={activePage === 'fee-config'} onClick={() => onSelect('fee-config')} />
        </div>
      </nav>
    </aside>
  )
}

function AdminShell({ children, standalone = false }) {
  return (
    <main className={`min-h-screen bg-[#f4f5fb] pt-[64px] ${standalone ? '' : 'pl-[220px]'}`}>
      <div className={`mx-auto pb-10 pt-[16px] ${standalone ? 'w-[1392px]' : 'w-[1254px]'}`}>{children}</div>
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

function StatCard({ title, value, desc, tone, icon: Icon }) {
  const toneClass = {
    violet: 'bg-[#e7d6ff] text-[#8b4fff]',
    green: 'bg-[#d9f3ca] text-[#56cf2d]',
    red: 'bg-[#ffd9dd] text-[#ff565f]',
    amber: 'bg-[#fff0c9] text-[#f3a600]',
    blue: 'bg-[#d8efff] text-[#24a8f3]',
  }[tone]

  return (
    <section className="relative h-[116px] rounded-[5px] border border-[#e2e4ec] bg-white px-[18px] py-[18px] shadow-[0_8px_16px_rgba(28,29,42,0.12)]">
      <div className="text-[14px] font-semibold text-[#1f1f37]">{title}</div>
      <div className="mt-[9px] text-[24px] font-bold leading-none text-[#292842]">{value}</div>
      <div className="mt-[10px] text-[12px] text-[#55556e]">{desc}</div>
      <div className={`absolute right-[19px] top-[19px] flex h-[38px] w-[38px] items-center justify-center rounded-[5px] ${toneClass}`}>
        <Icon className="h-[24px] w-[24px]" strokeWidth={2} />
      </div>
    </section>
  )
}

function SearchBox({ placeholder, width = 'w-[397px]' }) {
  return (
    <label className={`flex h-[50px] ${width} items-center gap-[11px] rounded-[4px] border border-[#cfd1dc] bg-white px-[15px] text-[13px] text-[#9a9cab]`}>
      <Search className="h-[16px] w-[16px] text-[#20213a]" strokeWidth={1.8} />
      <input className="h-full flex-1 bg-transparent outline-none" placeholder={placeholder} />
    </label>
  )
}

function SelectBox({ label, width = 'w-[396px]' }) {
  return (
    <label className={`flex h-[50px] ${width} items-center justify-between rounded-[4px] border border-[#cfd1dc] bg-white px-[14px] text-[13px] text-[#4c4c68]`}>
      <span>{label}</span>
      <ChevronDown className="h-[16px] w-[16px] text-[#5b5c70]" strokeWidth={1.8} />
    </label>
  )
}

function AccountTypeFilter({ value = '', onChange, width = 'w-[360px]' }) {
  return (
    <label className={`flex h-[50px] ${width} items-center justify-between rounded-[4px] border border-[#cfd1dc] bg-white px-[14px] text-[13px] text-[#4c4c68]`}>
      <span className="whitespace-nowrap">账户类型</span>
      <select
        value={value ?? ''}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-full min-w-[210px] bg-transparent text-right font-semibold text-[#20213a] outline-none"
      >
        <option value="" disabled hidden>全部类型</option>
        {accountFilterOptions.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
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

function openingStatusTone(status) {
  if (status === '审核通过') return 'green'
  if (status === '审核中') return 'blue'
  return 'gray'
}

function transferStatusTone(status) {
  if (status === '已完成' || status === '已批准') return 'green'
  if (status === '已拒绝' || status === '失败') return 'red'
  if (status === '处理中') return 'blue'
  if (status === '已撤销') return 'gray'
  return 'orange'
}

function formatTransferAccountName(account) {
  return String(account || '').replace(/证券账户$/, '证券')
}

function ActionButton({ icon: Icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-[31px] items-center gap-[6px] whitespace-nowrap rounded-[4px] border border-[#8b4fff] px-[9px] text-[12px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]"
    >
      <Icon className="h-[14px] w-[14px]" strokeWidth={1.9} />
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

function StatusSwitch() {
  return (
    <span className="inline-flex h-[17px] w-[28px] items-center justify-end rounded-full bg-[#8c52f5] px-[2px] align-middle">
      <span className="h-[13px] w-[13px] rounded-full bg-white shadow-sm" />
    </span>
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

function AccountTypeTabs({ value, onChange }) {
  return (
    <Panel className="mb-[21px] px-[12px] py-[10px]">
      <div className="flex gap-[8px]">
        {[
          ['personal', '个人用户'],
          ['business', '企业用户'],
        ].map(([key, label]) => (
          <button
            type="button"
            key={key}
            onClick={() => onChange(key)}
            className={`h-[38px] rounded-[20px] px-[18px] text-[14px] font-semibold ${
              value === key ? 'bg-[#9b63f5] text-white' : 'text-[#24243d] hover:bg-[#f6f0ff]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </Panel>
  )
}

function PendingReviewTable({ onOpenDetail, onOpenProcess }) {
  return (
    <div className="mt-[15px] border-t border-[#e5e6ef] pt-[15px]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
            <th className="w-[470px] px-[18px]">客户信息</th>
            <th className="w-[260px] px-[18px]">提交日期</th>
            <th className="w-[160px] px-[18px]">状态</th>
            <th className="px-[18px]">操作</th>
          </tr>
        </thead>
        <tbody className="text-[13px] text-[#55556e]">
          {pendingApplications.map((row) => (
            <tr key={row.id} className="h-[86px] border-b border-[#e7e8ef] bg-white">
              <td className="px-[18px]">
                <div className="flex items-center gap-[14px]">
                  <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#eeeeef] text-[13px] font-medium text-[#4b4b62]">{row.initials}</div>
                  <div className="leading-[1.6]">
                    <div className="text-[14px] font-semibold text-[#2b2940]">{row.name}</div>
                    <div>ID: {row.id}</div>
                    <div>{row.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-[18px]">{row.submittedAt}</td>
              <td className="px-[18px]"><StatusBadge tone={openingStatusTone(row.status)}>{row.status}</StatusBadge></td>
              <td className="px-[18px]">
                <div className="flex items-center gap-[7px]">
                  <ActionButton icon={Eye} onClick={onOpenDetail}>查看详情</ActionButton>
                  <ActionButton icon={Play} onClick={onOpenProcess}>开始处理</ActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OpeningReviewPage({ onOpenDetail, onOpenProcess }) {
  const [accountType, setAccountType] = useState('personal')

  return (
    <AdminShell>
      <AccountTypeTabs value={accountType} onChange={setAccountType} />
      <div className="grid w-[936px] grid-cols-3 gap-[21px]">
        <StatCard title="待提交" value="12" desc="开户资料待提交" tone="amber" icon={Clock3} />
        <StatCard title="审核中" value="36" desc="正在处理" tone="blue" icon={LineChart} />
        <StatCard title="审核通过" value="20" desc="全部" tone="green" icon={CheckCircle2} />
      </div>

      <Panel className="mt-[21px] px-[15px] pb-[18px] pt-[21px]">
        <PageTitle title="开户审核" subtitle="开户申请状态仅包含待提交、审核中和审核通过" />
        <div className="mt-[21px]">
          <SearchBox placeholder="搜索客户名称、审核类型..." width="w-[440px]" />
        </div>
        <PendingReviewTable onOpenDetail={onOpenDetail} onOpenProcess={onOpenProcess} />
      </Panel>
    </AdminShell>
  )
}

function ReviewFieldCard({ label, value, note, editable = false }) {
  const [displayValue, setDisplayValue] = useState(value)
  const [draftValue, setDraftValue] = useState(value)
  const [isEditing, setIsEditing] = useState(false)
  const shownValue = editable ? displayValue : value

  const startEditing = () => {
    setDraftValue(displayValue)
    setIsEditing(true)
  }

  const confirmEditing = () => {
    setDisplayValue(draftValue)
    setIsEditing(false)
  }

  const cancelEditing = () => {
    setDraftValue(displayValue)
    setIsEditing(false)
  }

  return (
    <div className={`min-h-[82px] rounded-[5px] border p-[14px] transition ${
      editable && isEditing
        ? 'border-[#8b4fff] bg-white shadow-[0_0_0_1px_rgba(139,79,255,0.12)]'
        : 'border-[#e2e4ec] bg-[#fbfbfd]'
    }`}>
      <div className="flex items-center justify-between gap-[10px]">
        <span className="text-[12px] text-[#66677f]">{label}</span>
        {editable ? (
          <span className="flex items-center gap-[8px]">
            {isEditing ? (
              <>
                <button type="button" onClick={confirmEditing} className="text-[#4bd20c]" aria-label="确认修改">
                  <CheckCircle2 className="h-[15px] w-[15px]" strokeWidth={2.2} />
                </button>
                <button type="button" onClick={cancelEditing} className="text-[#ff4e59]" aria-label="取消修改">
                  <XCircle className="h-[15px] w-[15px]" strokeWidth={2.2} />
                </button>
              </>
            ) : (
              <button type="button" onClick={startEditing} className="text-[#8b4fff]" aria-label="编辑字段">
                <Pencil className="h-[14px] w-[14px]" strokeWidth={2} />
              </button>
            )}
          </span>
        ) : null}
      </div>
      {editable && isEditing ? (
        <input
          value={draftValue}
          onChange={(event) => setDraftValue(event.target.value)}
          className="mt-[8px] h-[34px] w-full rounded-[4px] border border-[#8b4fff] bg-white px-[10px] text-[13px] font-semibold text-[#24243d] outline-none"
        />
      ) : (
        <div className="mt-[8px] text-[13px] font-semibold text-[#24243d]">{shownValue}</div>
      )}
      {note ? <div className="mt-[8px] text-[12px] leading-[18px] text-[#8a8ca0]">{note}</div> : null}
    </div>
  )
}

function OpeningReviewDecisionCard() {
  return (
    <Panel className="p-[18px]">
      <div className="flex items-center gap-[8px] text-[14px] font-semibold text-[#20213a]">
        <FileCheck2 className="h-[17px] w-[17px] text-[#8b4fff]" />
        审核决定
      </div>
      <div className="mt-[14px] text-[12px] leading-[20px] text-[#55556e]">提交审核前可先修改右侧用户资料；确认后保存修改并提交审核结论。</div>
      <label className="mt-[10px] flex h-[46px] items-center justify-between rounded-[5px] border border-[#8b4fff] bg-white px-[12px] text-[13px] font-semibold text-[#20213a]">
        <span>通过审核</span>
        <ChevronDown className="h-[16px] w-[16px] text-[#55556e]" />
      </label>
      <button type="button" className="mt-[14px] flex h-[38px] w-full items-center justify-center gap-[8px] rounded-[5px] bg-[#bda2f9] text-[13px] font-semibold text-white hover:bg-[#9b63f5]">
        <FileCheck2 className="h-[15px] w-[15px]" />
        保存修改并提交审核
      </button>
    </Panel>
  )
}

function OpeningReviewDetailPage({ onBack, mode = 'detail' }) {
  const isProcess = mode === 'process'

  return (
    <AdminShell>
      <div className="grid grid-cols-[360px_1fr] gap-[18px]">
        <div className="space-y-[18px]">
          <Panel className="p-[18px]">
            <div className="flex flex-col items-center pb-[18px]">
              <div className="flex h-[96px] w-[96px] items-center justify-center rounded-[5px] bg-[#d9c5ff] text-[28px] font-bold text-[#8b4fff]">WW</div>
              <div className="mt-[14px] text-[16px] font-semibold text-[#20213a]">WANYARA WAN</div>
              <StatusBadge tone="gray">个人客户</StatusBadge>
            </div>
            <div className="space-y-[14px] border-t border-[#e5e6ef] pt-[16px] text-[13px] text-[#55556e]">
              <div className="flex gap-[12px]">
                <CalendarDays className="h-[18px] w-[18px] text-[#8b4fff]" />
                <div>
                  <div className="font-semibold text-[#20213a]">{reviewProfile.submittedAt}</div>
                  <div className="text-[12px]">提交时间</div>
                </div>
              </div>
              <div className="flex gap-[12px]">
                <UserRound className="h-[18px] w-[18px] text-[#8b4fff]" />
                <div>
                  <div className="font-semibold text-[#20213a]">{reviewProfile.userId}</div>
                  <div className="text-[12px]">用户ID</div>
                </div>
              </div>
            </div>
            <div className="mt-[18px] border-t border-[#e5e6ef] pt-[16px] text-[13px] leading-[28px] text-[#55556e]">
              <div className="font-semibold text-[#20213a]">详细信息</div>
              <div>手机号：+ {reviewProfile.phoneCode} {reviewProfile.phone}</div>
              <div>邮箱地址：{reviewProfile.email}</div>
              <div>职业：其他</div>
              <div>职位：-</div>
            </div>
          </Panel>
          {isProcess ? <OpeningReviewDecisionCard /> : null}
        </div>

        <div className="space-y-[18px]">
          <div className="flex items-center justify-between">
            <ActionButton icon={ChevronDown} onClick={onBack}>返回开户审核</ActionButton>
            <StatusBadge tone="blue">{isProcess ? '开始处理' : '查看详情'}</StatusBadge>
          </div>

          {reviewFieldGroups.map((group) => (
            <Panel key={group.title} className="p-[18px]">
              <div className="mb-[16px] flex items-center gap-[8px] text-[14px] font-semibold text-[#20213a]">
                <ShieldCheck className="h-[17px] w-[17px] text-[#8b4fff]" />
                {group.title}
              </div>
              <div className="grid grid-cols-3 gap-[10px]">
                {group.fields.map((field) => (
                  <ReviewFieldCard key={field.label} {...field} editable={isProcess} />
                ))}
              </div>
            </Panel>
          ))}

          <Panel className="p-[18px]">
            <div className="mb-[16px] flex items-center gap-[8px] text-[14px] font-semibold text-[#20213a]">
              <FileText className="h-[17px] w-[17px] text-[#8b4fff]" />
              文件与第三方签署
            </div>
            <div className="grid grid-cols-2 gap-[10px]">
              {attachmentRows.map((item, index) => (
                <div key={`${item.name}-${index}`} className="rounded-[5px] border border-[#e2e4ec] bg-white p-[14px]">
                  <div className="flex items-start justify-between gap-[12px]">
                    <div>
                      <div className="text-[13px] font-semibold text-[#20213a]">{item.name}</div>
                      <div className="mt-[5px] text-[12px] text-[#66677f]">{item.fileName}</div>
                    </div>
                    {item.signatureStatus ? <StatusBadge tone={item.signatureStatus === 'signed' ? 'green' : 'orange'}>{item.status}</StatusBadge> : <StatusBadge tone="gray">{item.status}</StatusBadge>}
                  </div>
                  <div className="mt-[13px] flex gap-[8px]">
                    <ActionButton icon={Download}>下载</ActionButton>
                    <ActionButton icon={Eye}>查看</ActionButton>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AdminShell>
  )
}

function getSingaporeAccountActionLabel(status) {
  if (status === '未开通') return '开通新加坡账户'
  if (status === '待处理') return '查看申请'
  if (status === '审核中') return '查看申请'
  if (status === '已开户') return '编辑新加坡账户'
  if (status === '已拒绝') return '查看申请'
  return '新加坡账户'
}

function singaporeAccountTone(status) {
  if (status === '已开户') return 'green'
  if (status === '审核中') return 'blue'
  if (status === '待处理') return 'orange'
  if (status === '已拒绝') return 'red'
  return 'gray'
}

function getManagementStamp() {
  const value = new Date()
  const pad = (item) => String(item).padStart(2, '0')

  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}`
}

function shortSingaporeAccountNumber(accountNumber = '') {
  if (!accountNumber) return ''
  return accountNumber.length > 4 ? accountNumber.slice(-4) : accountNumber
}

function findSingaporeTypeForUserManagement(accountTypes = initialAccountTypeConfigs) {
  return accountTypes.find((item) => item.code === 'SG_ACCOUNT')
    || initialAccountTypeConfigs.find((item) => item.code === 'SG_ACCOUNT')
    || {}
}

function getSingaporeAccountDefaults(accountTypes = initialAccountTypeConfigs) {
  const singaporeType = findSingaporeTypeForUserManagement(accountTypes)
  const receivingAccount = singaporeType.receivingAccount || {}

  return {
    beneficiaryName: receivingAccount.beneficiaryName || 'FIDERE TRUST LIMITED',
    accountNumber: shortSingaporeAccountNumber(receivingAccount.accountNumber) || '0454',
    bankName: receivingAccount.bankName || 'Green Link Digital Bank Pte. Ltd.',
    bankAddress: receivingAccount.bankAddress || '20 PASIR PANJANG ROAD #07-25-28 MAPLETREE BUSINESS CITY SINGAPORE 117439',
    receivingBank: receivingAccount.receivingBank || 'Green Link Digital Bank',
    swiftCode: receivingAccount.swiftCode || 'GLDTSGSG',
    currencies: singaporeType.currencies
      ?.filter((currency) => currency.enabled !== false)
      .map((currency) => currency.code)
      .join(' / ') || 'USD / CNY / SGD / AED / JPY',
  }
}

function getSingaporeOpeningSource(account) {
  if (account.status === '未开通') return '后台手动开通'
  return account.openingSource || (account.appliedAt ? '客户申请' : '后台手动开通')
}

function createUnopenedSingaporeDemoUser(index = 1) {
  const suffix = String(index).padStart(2, '0')

  return {
    id: `user-sg-unopened-demo-${suffix}`,
    userName: `未开通Demo${suffix}`,
    userId: `UID-DEMO-${suffix}`,
    email: `sg-demo-${suffix}@example.com`,
    customerType: '个人',
    registeredAt: '2026-07-14 10:00',
    userStatus: '正常',
    createdAt: '2026-07-14 10:01',
    updatedAt: '2026-07-14 10:01',
    singaporeAccount: createSingaporeAccountRecord({
      status: '未开通',
      updatedAt: '2026-07-14 10:01',
      updatedBy: '系统',
    }),
  }
}

function mapSingaporeUserRows(singaporeAccountUsers = []) {
  return singaporeAccountUsers.map((user) => ({
    initials: (user.userName || user.userId || 'U').slice(0, 2).toUpperCase(),
    name: user.userName,
    id: user.userId,
    sourceId: user.id,
    email: user.email || `${String(user.userId || user.id).toLowerCase()}@example.com`,
    type: user.customerType || '个人',
    approvedAt: user.createdAt || user.registeredAt || '-',
    lastActiveAt: user.updatedAt || '-',
    singaporeAccount: user.singaporeAccount || {},
  }))
}

function SingaporeAccountListModal({ user, accountTypes, onClose, onSave }) {
  const sgAccount = user.singaporeAccount || createSingaporeAccountRecord()
  const defaults = getSingaporeAccountDefaults(accountTypes)
  const mode = sgAccount.status === '未开通' ? 'open' : 'edit'
  const title = mode === 'open' ? '开通新加坡账户' : '编辑新加坡账户'
  const confirmText = mode === 'open' ? '确认开通' : '保存'
  const openingSource = getSingaporeOpeningSource(sgAccount)
  const [beneficiaryName, setBeneficiaryName] = useState(sgAccount.beneficiaryName || defaults.beneficiaryName)
  const [accountNumber, setAccountNumber] = useState(sgAccount.accountNumber || defaults.accountNumber)
  const [error, setError] = useState('')

  const submit = () => {
    if (!beneficiaryName.trim() || !accountNumber.trim()) {
      setError('请填写收款人和账户号码。')
      return
    }
    onSave({
      beneficiaryName: beneficiaryName.trim(),
      accountNumber: accountNumber.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#252236]/55 px-[24px] py-[28px]">
      <section className="w-[720px] overflow-hidden rounded-[8px] bg-white shadow-[0_18px_48px_rgba(28,29,42,0.28)]">
        <div className="flex h-[62px] items-center justify-between border-b border-[#e5e6ef] px-[22px]">
          <div>
            <h2 className="text-[16px] font-semibold text-[#20213a]">{title}</h2>
            <div className="mt-[3px] text-[11px] font-semibold uppercase text-[#8a8ca0]">{user.userName || '-'} / {user.userId || '-'}</div>
          </div>
          <button type="button" onClick={onClose} className="rounded-[4px] p-[7px] text-[#66677f] hover:bg-[#f6f7fb]">
            <X className="h-[16px] w-[16px]" />
          </button>
        </div>
        <div className="space-y-[16px] px-[22px] py-[18px]">
          {error ? <div className="rounded-[5px] bg-[#ffe8eb] px-[12px] py-[10px] text-[12px] font-semibold text-[#f04f5f]">{error}</div> : null}
          <div className="grid grid-cols-2 gap-[12px]">
            {[
              ['用户名称', user.userName],
              ['账户类型', '新加坡账户'],
              ['开户来源', openingSource],
              ['当前状态', sgAccount.status || '未开通'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[5px] border border-[#e2e4ec] bg-[#fbfbfd] px-[12px] py-[10px]">
                <div className="text-[12px] text-[#66677f]">{label}</div>
                <div className="mt-[7px] break-words text-[13px] font-semibold text-[#20213a]">{value || '-'}</div>
              </div>
            ))}
          </div>
          <div className="rounded-[5px] border border-[#e2e4ec] bg-[#fbfbfd] p-[12px]">
            <div className="mb-[12px] text-[13px] font-semibold text-[#20213a]">收款银行信息</div>
            <div className="grid grid-cols-2 gap-[12px]">
              <label className="block">
                <span className="mb-[-8px] ml-[10px] inline-block bg-[#fbfbfd] px-[4px] text-[12px] text-[#66677f]">收款人 *</span>
                <input value={beneficiaryName} onChange={(event) => setBeneficiaryName(event.target.value)} className="h-[50px] w-full rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] text-[14px] text-[#24243d] outline-none focus:border-[#8b4fff]" />
              </label>
              <label className="block">
                <span className="mb-[-8px] ml-[10px] inline-block bg-[#fbfbfd] px-[4px] text-[12px] text-[#66677f]">账户号码 *</span>
                <input value={accountNumber} onChange={(event) => setAccountNumber(event.target.value)} className="h-[50px] w-full rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] text-[14px] text-[#24243d] outline-none focus:border-[#8b4fff]" />
              </label>
              {[
                ['银行名称', defaults.bankName],
                ['收款银行', defaults.receivingBank],
                ['SWIFT Code', defaults.swiftCode],
                ['支持币种', defaults.currencies],
                ['银行地址', defaults.bankAddress],
              ].map(([label, value]) => (
                <label key={label} className={`${label === '银行地址' || label === '支持币种' ? 'col-span-2' : ''} block`}>
                  <span className="mb-[-8px] ml-[10px] inline-block bg-[#fbfbfd] px-[4px] text-[12px] text-[#66677f]">{label}</span>
                  {label === '银行地址' ? (
                    <textarea
                      readOnly
                      value={value || ''}
                      className="h-[72px] w-full resize-none rounded-[5px] border border-[#d8dae4] bg-[#eef0f4] px-[12px] py-[11px] text-[13px] font-semibold leading-[20px] text-[#66677f] outline-none"
                    />
                  ) : (
                    <input
                      readOnly
                      value={value || ''}
                      className="h-[50px] w-full rounded-[5px] border border-[#d8dae4] bg-[#eef0f4] px-[12px] text-[13px] font-semibold text-[#66677f] outline-none"
                    />
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[10px] border-t border-[#e5e6ef] bg-white p-[14px]">
          <button type="button" onClick={onClose} className="h-[40px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">取消</button>
          <button type="button" onClick={submit} className="h-[40px] rounded-[5px] bg-[#8b4fff] text-[13px] font-semibold text-white hover:bg-[#7f42f2]">{confirmText}</button>
        </div>
      </section>
    </div>
  )
}

function getManualAccountDefaults(accountType) {
  const receivingAccount = accountType?.receivingAccount || {}

  return {
    beneficiaryName: receivingAccount.beneficiaryName || '',
    accountNumber: receivingAccount.accountNumber || '',
    bankName: receivingAccount.bankName || '-',
    receivingBank: receivingAccount.receivingBank || '-',
    swiftCode: receivingAccount.swiftCode || '-',
    bankAddress: receivingAccount.bankAddress || '-',
    currencies: (accountType?.currencies || [])
      .filter((currency) => currency.enabled !== false)
      .map((currency) => currency.code)
      .join(' / ') || '-',
  }
}

function ManualAccountOpeningModal({ user, accountTypes = [], onClose, onSave }) {
  const singaporeStatus = user?.singaporeAccount?.status || '未开通'
  const openedTypeIds = new Set((user?.manualAccounts || []).map((account) => account.accountTypeId))
  const availableAccountTypes = accountTypes.filter((accountType) => accountType.status === '启用')
  const getUnavailableReason = (accountType) => {
    if (accountType.requiresDocuments) return '该账户类型需要用户提交开户资料，请通过客户端申请及开户审核流程开通。'
    if (openedTypeIds.has(accountType.id)) return '该用户已开通此账户类型，不能重复添加。'
    if (
      accountType.code === 'SG_ACCOUNT'
      && ['待处理', '审核中', '已开户'].includes(singaporeStatus)
    ) {
      return singaporeStatus === '已开户'
        ? '该用户的新加坡账户已开户，不能重复添加。'
        : '该用户的新加坡账户已有客户端申请，请前往开户审核流程处理。'
    }
    return ''
  }
  const firstSelectableType = availableAccountTypes.find((accountType) => !getUnavailableReason(accountType))
  const [accountTypeId, setAccountTypeId] = useState(firstSelectableType?.id || '')
  const selectedAccountType = availableAccountTypes.find((accountType) => accountType.id === accountTypeId) || null
  const selectedDefaults = getManualAccountDefaults(selectedAccountType)
  const [beneficiaryName, setBeneficiaryName] = useState(selectedDefaults.beneficiaryName)
  const [accountNumber, setAccountNumber] = useState(selectedDefaults.accountNumber)
  const [error, setError] = useState('')

  const selectAccountType = (nextId) => {
    const nextAccountType = availableAccountTypes.find((accountType) => accountType.id === nextId)
    const defaults = getManualAccountDefaults(nextAccountType)

    setAccountTypeId(nextId)
    setBeneficiaryName(defaults.beneficiaryName)
    setAccountNumber(defaults.accountNumber)
    setError('')
  }

  const submit = () => {
    const latestAccountType = accountTypes.find((accountType) => accountType.id === accountTypeId)
    if (!latestAccountType || latestAccountType.status !== '启用') {
      setError('该账户类型已禁用或不存在，请刷新后重新选择。')
      return
    }
    if (latestAccountType.requiresDocuments) {
      setError('账户类型配置已更新：该账户类型需要用户提交开户资料，无法后台手动开通。')
      return
    }
    const unavailableReason = getUnavailableReason(latestAccountType)
    if (unavailableReason) {
      setError(unavailableReason)
      return
    }
    if (!beneficiaryName.trim() || !accountNumber.trim()) {
      setError('请填写收款人和账户号码。')
      return
    }

    const result = onSave?.({
      accountTypeId: latestAccountType.id,
      accountTypeCode: latestAccountType.code,
      accountTypeName: latestAccountType.name,
      beneficiaryName: beneficiaryName.trim(),
      accountNumber: accountNumber.trim(),
    })
    if (result?.error) setError(result.error)
  }

  const restrictedTypes = availableAccountTypes.filter((accountType) => accountType.requiresDocuments)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#252236]/55 px-[24px] py-[28px]">
      <section className="flex max-h-[88vh] w-[760px] flex-col overflow-hidden rounded-[8px] bg-white shadow-[0_18px_48px_rgba(28,29,42,0.28)]">
        <div className="flex h-[62px] shrink-0 items-center justify-between border-b border-[#e5e6ef] px-[22px]">
          <div>
            <h2 className="text-[16px] font-semibold text-[#20213a]">手动开通账户</h2>
            <div className="mt-[3px] text-[11px] font-semibold uppercase text-[#8a8ca0]">{user?.userName || '-'} / {user?.userId || '-'}</div>
          </div>
          <button type="button" onClick={onClose} className="rounded-[4px] p-[7px] text-[#66677f] hover:bg-[#f6f7fb]">
            <X className="h-[16px] w-[16px]" />
          </button>
        </div>

        <div className="flex-1 space-y-[16px] overflow-y-auto px-[22px] py-[18px]">
          {error ? <div className="rounded-[5px] bg-[#ffe8eb] px-[12px] py-[10px] text-[12px] font-semibold text-[#f04f5f]">{error}</div> : null}

          <div className="rounded-[5px] bg-[#e7f5ff] px-[12px] py-[10px] text-[12px] font-semibold leading-[20px] text-[#237be8]">
            后台手动开通不会进入客户端申请和资料审核流程。账户类型是否可选，实时读取「是否需要上传资料」配置。
          </div>

          <div className="grid grid-cols-2 gap-[12px]">
            <BrokerageReadOnlyField label="用户名称" value={user?.userName || '-'} />
            <BrokerageReadOnlyField label="开户来源" value="后台手动开通" />
          </div>

          <label className="block">
            <span className="mb-[-8px] ml-[10px] inline-block bg-white px-[4px] text-[12px] text-[#66677f]">账户类型 *</span>
            <select
              value={accountTypeId}
              onChange={(event) => selectAccountType(event.target.value)}
              className="h-[50px] w-full rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] text-[14px] font-semibold text-[#24243d] outline-none focus:border-[#8b4fff]"
            >
              {!firstSelectableType ? <option value="">暂无可手动开通的账户类型</option> : null}
              {availableAccountTypes.map((accountType) => {
                const reason = getUnavailableReason(accountType)
                return (
                  <option key={accountType.id} value={accountType.id} disabled={Boolean(reason)}>
                    {accountType.name}{reason ? `（${accountType.requiresDocuments ? '需要上传资料' : '不可重复开通'}）` : ''}
                  </option>
                )
              })}
            </select>
          </label>

          {restrictedTypes.length ? (
            <div className="rounded-[5px] border border-[#f3d5a5] bg-[#fff8ed] px-[12px] py-[10px] text-[12px] leading-[20px] text-[#9a5d00]">
              <div className="font-semibold">以下账户类型不可手动开通：</div>
              {restrictedTypes.map((accountType) => (
                <div key={accountType.id} className="mt-[3px]">
                  {accountType.name}：该账户类型需要用户提交开户资料，请通过客户端申请及开户审核流程开通。
                </div>
              ))}
            </div>
          ) : null}

          {selectedAccountType ? (
            <div className="rounded-[5px] border border-[#e2e4ec] bg-[#fbfbfd] p-[12px]">
              <div className="mb-[12px] text-[13px] font-semibold text-[#20213a]">账户信息</div>
              <div className="grid grid-cols-2 gap-[12px]">
                <label className="block">
                  <span className="mb-[-8px] ml-[10px] inline-block bg-[#fbfbfd] px-[4px] text-[12px] text-[#66677f]">收款人 *</span>
                  <input value={beneficiaryName} onChange={(event) => setBeneficiaryName(event.target.value)} className="h-[50px] w-full rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] text-[14px] text-[#24243d] outline-none focus:border-[#8b4fff]" />
                </label>
                <label className="block">
                  <span className="mb-[-8px] ml-[10px] inline-block bg-[#fbfbfd] px-[4px] text-[12px] text-[#66677f]">账户号码 *</span>
                  <input value={accountNumber} onChange={(event) => setAccountNumber(event.target.value)} className="h-[50px] w-full rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] text-[14px] text-[#24243d] outline-none focus:border-[#8b4fff]" />
                </label>
                {[
                  ['银行名称', selectedDefaults.bankName],
                  ['收款银行', selectedDefaults.receivingBank],
                  ['SWIFT Code', selectedDefaults.swiftCode],
                  ['支持币种', selectedDefaults.currencies],
                  ['银行地址', selectedDefaults.bankAddress],
                ].map(([label, value]) => (
                  <label key={label} className={`${label === '银行地址' || label === '支持币种' ? 'col-span-2' : ''} block`}>
                    <span className="mb-[-8px] ml-[10px] inline-block bg-[#fbfbfd] px-[4px] text-[12px] text-[#66677f]">{label}</span>
                    {label === '银行地址' ? (
                      <textarea readOnly value={value} className="h-[72px] w-full resize-none rounded-[5px] border border-[#d8dae4] bg-[#eef0f4] px-[12px] py-[11px] text-[13px] font-semibold leading-[20px] text-[#66677f] outline-none" />
                    ) : (
                      <input readOnly value={value} className="h-[50px] w-full rounded-[5px] border border-[#d8dae4] bg-[#eef0f4] px-[12px] text-[13px] font-semibold text-[#66677f] outline-none" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-[5px] bg-[#f6f7fb] px-[12px] py-[10px] text-[12px] leading-[20px] text-[#66677f]">
            提交时系统会再次校验账户类型的最新资料要求；配置变化不会影响已开户账户和历史申请。
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-[10px] border-t border-[#e5e6ef] bg-white p-[14px]">
          <button type="button" onClick={onClose} className="h-[40px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">取消</button>
          <button
            type="button"
            onClick={submit}
            disabled={!selectedAccountType}
            className="h-[40px] rounded-[5px] bg-[#8b4fff] text-[13px] font-semibold text-white hover:bg-[#7f42f2] disabled:cursor-not-allowed disabled:bg-[#d8d9e3]"
          >
            确认开通
          </button>
        </div>
      </section>
    </div>
  )
}

function UserManagementTable({
  singaporeAccountUsers,
  onOpenSingaporeAccount,
  onOpenSingaporeApplication,
  onOpenManualAccount,
}) {
  const showSingaporeAccount = Array.isArray(singaporeAccountUsers)
  const rows = showSingaporeAccount ? mapSingaporeUserRows(singaporeAccountUsers) : userRows

  return (
    <div className="mt-[15px] border-t border-[#e5e6ef] pt-[15px]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
            <th className="w-[320px] px-[18px]">客户信息</th>
            <th className="w-[132px] px-[18px]">申请类型</th>
            <th className="w-[220px] px-[18px]">通过时间</th>
            <th className="w-[118px] px-[18px]">账户状态</th>
            {showSingaporeAccount ? <th className="w-[150px] px-[18px]">新加坡账户状态</th> : null}
            {showSingaporeAccount ? <th className="w-[230px] px-[18px]">新加坡账户信息</th> : null}
            <th className="w-[220px] px-[18px]">最后活动</th>
            <th className="px-[18px]">操作</th>
          </tr>
        </thead>
        <tbody className="text-[13px] text-[#55556e]">
          {rows.map((row) => {
            const sgAccount = row.singaporeAccount || {}
            const singaporeStatus = sgAccount.status || '未开通'
            const sgActionLabel = getSingaporeAccountActionLabel(singaporeStatus)
            const openSingapore = () => {
              if (singaporeStatus === '待处理' || singaporeStatus === '审核中' || singaporeStatus === '已拒绝') {
                onOpenSingaporeApplication?.(row)
                return
              }
              onOpenSingaporeAccount?.(row.sourceId)
            }

            return (
              <tr key={row.sourceId || row.id} className="h-[86px] border-b border-[#e7e8ef] bg-white">
                <td className="px-[18px]">
                  <div className="flex items-center gap-[14px]">
                    <div className="flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full bg-[#eeeeef] text-[13px] font-medium text-[#4b4b62]">{row.initials}</div>
                    <div className="leading-[1.6]">
                      <div className="text-[14px] font-semibold text-[#2b2940]">{row.name}</div>
                      <div>ID: {row.id}</div>
                      <div>{row.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-[18px]"><span className="inline-flex items-center gap-[7px] text-[#424258]"><FileText className="h-[15px] w-[15px] text-[#6b687d]" strokeWidth={1.8} />{row.type}</span></td>
                <td className="px-[18px]">{row.approvedAt}</td>
                <td className="px-[18px]"><StatusSwitch /></td>
                {showSingaporeAccount ? (
                  <td className="px-[18px]">
                    <StatusBadge tone={singaporeAccountTone(singaporeStatus)}>{singaporeStatus}</StatusBadge>
                  </td>
                ) : null}
                {showSingaporeAccount ? (
                  <td className="px-[18px]">
                    {singaporeStatus === '已开户' ? (
                      <div className="text-[12px] leading-[20px] text-[#66677f]">
                        <div>账户号码：<span className="font-semibold text-[#20213a]">{sgAccount.accountNumber || '-'}</span></div>
                        <div>收款人：<span className="font-semibold text-[#20213a]">{sgAccount.beneficiaryName || '-'}</span></div>
                      </div>
                    ) : (
                      <span className="text-[12px] text-[#8a8ca0]">-</span>
                    )}
                  </td>
                ) : null}
                <td className="px-[18px]">{row.lastActiveAt}</td>
                <td className="px-[18px]">
                  <div className="flex flex-wrap items-center gap-[7px]">
                    <ActionButton icon={Eye}>{showSingaporeAccount ? '查看' : '查看详情'}</ActionButton>
                    {showSingaporeAccount ? <ActionButton icon={Pencil}>编辑</ActionButton> : null}
                    {showSingaporeAccount ? <ActionButton icon={WalletCards} onClick={openSingapore}>{sgActionLabel}</ActionButton> : null}
                    {showSingaporeAccount ? <ActionButton icon={Plus} onClick={() => onOpenManualAccount?.(row.sourceId)}>手动开通账户</ActionButton> : null}
                    {!showSingaporeAccount ? <ActionButton icon={KeyRound}>修改密码</ActionButton> : null}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function UserManagementPage({
  focusedCustomer,
  singaporeAccountUsers,
  onChangeSingaporeAccountUsers,
  accountTypes = initialAccountTypeConfigs,
  onOpenSingaporeApplication,
}) {
  const [editingSingaporeUserId, setEditingSingaporeUserId] = useState('')
  const [manualOpeningUserId, setManualOpeningUserId] = useState('')
  const [manualOpeningMessage, setManualOpeningMessage] = useState('')
  const editingSingaporeUser = Array.isArray(singaporeAccountUsers)
    ? singaporeAccountUsers.find((user) => user.id === editingSingaporeUserId)
    : null
  const manualOpeningUser = Array.isArray(singaporeAccountUsers)
    ? singaporeAccountUsers.find((user) => user.id === manualOpeningUserId)
    : null

  const saveSingaporeAccount = (patch) => {
    if (!editingSingaporeUser || !onChangeSingaporeAccountUsers) return
    const stamp = getManagementStamp()

    const nextUsers = singaporeAccountUsers.map((user) => {
      if (user.id !== editingSingaporeUser.id) return user
      const currentAccount = user.singaporeAccount || createSingaporeAccountRecord()
      const openingSource = currentAccount.status === '未开通'
        ? '后台手动开通'
        : getSingaporeOpeningSource(currentAccount)

      return {
        ...user,
        updatedAt: stamp,
        singaporeAccount: {
          ...currentAccount,
          ...patch,
          status: '已开户',
          approvedAt: currentAccount.approvedAt || stamp,
          updatedAt: stamp,
          updatedBy: '运营管理员',
          openingSource,
        },
      }
    })

    if (!nextUsers.some((user) => (user.singaporeAccount?.status || '未开通') === '未开通')) {
      nextUsers.push(createUnopenedSingaporeDemoUser(nextUsers.length + 1))
    }

    onChangeSingaporeAccountUsers(nextUsers)
    setEditingSingaporeUserId('')
  }

  const saveManualAccount = (payload) => {
    if (!manualOpeningUser || !onChangeSingaporeAccountUsers) {
      return { error: '用户数据已更新，请关闭弹窗后重试。' }
    }

    const latestAccountType = accountTypes.find((accountType) => accountType.id === payload.accountTypeId)
    if (!latestAccountType || latestAccountType.status !== '启用') {
      return { error: '该账户类型已禁用或不存在，无法手动开通。' }
    }
    if (latestAccountType.requiresDocuments) {
      return { error: '该账户类型需要用户提交开户资料，接口已拒绝本次手动开户。' }
    }

    const stamp = getManagementStamp()
    const nextUsers = singaporeAccountUsers.map((user) => {
      if (user.id !== manualOpeningUser.id) return user

      const nextManualAccount = {
        ...payload,
        status: '已开户',
        openingSource: '后台手动开通',
        openedAt: stamp,
        updatedAt: stamp,
        updatedBy: '运营管理员',
      }
      const nextUser = {
        ...user,
        updatedAt: stamp,
        manualAccounts: [
          ...(user.manualAccounts || []).filter((account) => account.accountTypeId !== payload.accountTypeId),
          nextManualAccount,
        ],
      }

      if (payload.accountTypeCode === 'SG_ACCOUNT') {
        const currentAccount = user.singaporeAccount || createSingaporeAccountRecord()
        nextUser.singaporeAccount = {
          ...currentAccount,
          beneficiaryName: payload.beneficiaryName,
          accountNumber: payload.accountNumber,
          status: '已开户',
          openingSource: '后台手动开通',
          approvedAt: currentAccount.approvedAt || stamp,
          updatedAt: stamp,
          updatedBy: '运营管理员',
        }
      }

      return nextUser
    })

    if (!nextUsers.some((user) => (user.singaporeAccount?.status || '未开通') === '未开通')) {
      nextUsers.push(createUnopenedSingaporeDemoUser(nextUsers.length + 1))
    }

    onChangeSingaporeAccountUsers(nextUsers)
    setManualOpeningMessage(`已为 ${manualOpeningUser.userName} 手动开通${payload.accountTypeName}。`)
    setManualOpeningUserId('')
    return { ok: true }
  }

  if (focusedCustomer) {
    return (
      <AdminShell>
        <Panel className="px-[18px] py-[22px]">
          <PageTitle title="用户管理详情" subtitle="后台用户管理详情页，用于查看客户已归档资料" />
          <div className="mt-[18px] grid grid-cols-3 gap-[12px]">
            <BrokerageReadOnlyField label="客户名称" value={focusedCustomer.name} />
            <BrokerageReadOnlyField label="用户ID" value={focusedCustomer.id} />
            <BrokerageReadOnlyField label="邮箱地址" value={focusedCustomer.email} />
            <BrokerageReadOnlyField label="手机号" value={focusedCustomer.phone} />
            <BrokerageReadOnlyField label="客户类型" value={focusedCustomer.type} />
          </div>
        </Panel>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <div className="grid w-[936px] grid-cols-3 gap-[21px]">
        <StatCard title="通过总数" value="89" desc="已通过KYC审核" tone="violet" icon={UsersRound} />
        <StatCard title="活跃账户" value="37" desc="账户已启用" tone="green" icon={UserCheck} />
        <StatCard title="暂停账户" value="1" desc="账户已暂停" tone="red" icon={PauseCircle} />
      </div>
      <Panel className="mt-[21px] px-[15px] pb-[18px] pt-[21px]">
        <PageTitle title="用户管理" subtitle="已通过KYC审核的活跃用户账户" />
        {manualOpeningMessage ? (
          <div className="mt-[14px] flex items-center justify-between rounded-[5px] bg-[#e9f8ee] px-[12px] py-[10px] text-[12px] font-semibold text-[#20894f]">
            <span>{manualOpeningMessage}</span>
            <button type="button" onClick={() => setManualOpeningMessage('')} className="text-[#20894f] hover:underline">关闭</button>
          </div>
        ) : null}
        <div className="mt-[21px] flex items-center gap-[18px]">
          <SearchBox placeholder="搜索用户名、ID或客户编号..." />
          <SelectBox label="账户状态" />
        </div>
        <UserManagementTable
          singaporeAccountUsers={singaporeAccountUsers}
          onOpenSingaporeAccount={setEditingSingaporeUserId}
          onOpenSingaporeApplication={onOpenSingaporeApplication}
          onOpenManualAccount={setManualOpeningUserId}
        />
      </Panel>
      {editingSingaporeUser ? (
        <SingaporeAccountListModal
          user={editingSingaporeUser}
          accountTypes={accountTypes}
          onClose={() => setEditingSingaporeUserId('')}
          onSave={saveSingaporeAccount}
        />
      ) : null}
      {manualOpeningUser ? (
        <ManualAccountOpeningModal
          user={manualOpeningUser}
          accountTypes={accountTypes}
          onClose={() => setManualOpeningUserId('')}
          onSave={saveManualAccount}
        />
      ) : null}
    </AdminShell>
  )
}

function TransferAuditDrawer({ record, onClose }) {
  if (!record) return null

  const isPending = record.status === '待审核'
  const fromUser = record.fromUser || record.customer
  const toUser = record.toUser || record.customer
  const detailRows = [
    ['转账编号', record.requestId],
    ['记录类型', record.transferType || '本人账户互转'],
    ['转出账户', formatTransferAccountName(record.fromAccount)],
    ['转入账户', formatTransferAccountName(record.toAccount)],
    ['币种', record.currency],
    ['转账金额', record.transferAmount || record.amount],
    ['手续费', record.fee || `${record.currency} 0.00`],
    ['实际到账金额', record.actualArrivalAmount || '-'],
    ['转账备注', record.note || '-'],
    ['提交时间', record.submittedAt],
    ['完成时间', record.completedAt || '-'],
    ['失败或拒绝原因', record.failureReason || record.rejectReason || '-'],
  ]

  return (
    <div className="fixed inset-0 z-50 bg-[#252236]/55" onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose()
    }}>
      <aside className="fixed bottom-0 right-0 top-0 flex w-full max-w-[480px] flex-col bg-white shadow-[0_18px_48px_rgba(28,29,42,0.28)]">
        <div className="flex h-[58px] items-center justify-between border-b border-[#e5e6ef] px-[18px]">
          <div>
            <h2 className="text-[15px] font-semibold text-[#20213a]">{isPending ? '资金互转审核' : '资金互转详情'}</h2>
            <div className="mt-[3px] text-[11px] font-semibold uppercase text-[#8a8ca0]">{record.requestId}</div>
          </div>
          <button type="button" onClick={onClose} className="rounded-[4px] p-[7px] text-[#66677f] hover:bg-[#f6f7fb]">
            <X className="h-[16px] w-[16px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f7f8fb] px-[10px] py-[14px]">
          <div className="rounded-[5px] bg-[#fff1d6] px-[12px] py-[13px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[10px]">
                <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] bg-[#f4a600] text-[13px] font-bold text-white">!</span>
                <span className="text-[13px] text-[#55556e]">资金互转申请</span>
              </div>
              <div className="text-[13px] font-semibold text-[#20213a]">{record.transferAmount || record.amount}</div>
            </div>
          </div>

          <div className="mt-[10px] rounded-[5px] bg-white px-[12px] py-[12px] shadow-sm">
            <div className="mb-[12px] flex items-center justify-between">
              <span className="text-[12px] text-[#66677f]">当前状态</span>
              <StatusBadge tone={transferStatusTone(record.status)}>{record.status}</StatusBadge>
            </div>
            <div className="grid gap-[10px] border-t border-[#e5e6ef] py-[12px] sm:grid-cols-2">
              {[
                ['转出用户信息', fromUser],
                ['收款用户信息', toUser],
              ].map(([label, user]) => (
                <div key={label} className="rounded-[5px] border border-[#e5e6ef] bg-[#f8f9fc] p-[10px]">
                  <div className="text-[11px] font-semibold text-[#8a8ca0]">{label}</div>
                  <div className="mt-[6px] text-[13px] font-semibold text-[#20213a]">{user.name}</div>
                  <div className="mt-[3px] text-[12px] text-[#66677f]">ID: {user.id}</div>
                  <div className="mt-[3px] break-all text-[12px] text-[#66677f]">{user.email}</div>
                </div>
              ))}
            </div>
            {detailRows.map(([label, value]) => (
              <div key={label} className="border-t border-[#e5e6ef] py-[11px]">
                <div className="text-[12px] text-[#66677f]">{label}</div>
                <div className="mt-[5px] break-all text-[13px] font-semibold text-[#20213a]">{value}</div>
              </div>
            ))}
          </div>

          {isPending ? (
            <div className="mt-[10px] space-y-[8px]">
              <SelectBox label="审核结论 *" width="w-full" />
              <textarea className="h-[102px] w-full resize-none rounded-[4px] border border-[#ff4c57] bg-white px-[12px] py-[10px] text-[13px] outline-none" placeholder="审核备注 *" />
              <div className="text-[12px] text-[#ff4c57]">此字段为必填项</div>
            </div>
          ) : null}
        </div>

        {isPending ? (
          <div className="grid grid-cols-2 gap-[8px] border-t border-[#e5e6ef] bg-white p-[10px]">
            <button type="button" className="h-[36px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">拒绝</button>
            <button type="button" className="h-[36px] rounded-[5px] bg-[#bda2f9] text-[13px] font-semibold text-white hover:bg-[#9b63f5]">批准</button>
          </div>
        ) : (
          <div className="border-t border-[#e5e6ef] bg-white p-[10px]">
            <button type="button" onClick={onClose} className="h-[36px] w-full rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">关闭</button>
          </div>
        )}
      </aside>
    </div>
  )
}

function fiatStatusTone(status) {
  if (status === '处理完成' || status === '已匹配') return 'green'
  if (status === '已拒绝') return 'red'
  return 'orange'
}

function DrawerShell({ title, eyebrow, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#252236]/55">
      <aside className="fixed bottom-0 right-0 top-0 flex w-[456px] flex-col bg-white shadow-[0_18px_48px_rgba(28,29,42,0.28)]">
        <div className="flex h-[58px] items-center justify-between border-b border-[#e5e6ef] px-[18px]">
          <div>
            <h2 className="text-[15px] font-semibold text-[#20213a]">{title}</h2>
            {eyebrow ? <div className="mt-[3px] text-[11px] font-semibold uppercase text-[#8a8ca0]">{eyebrow}</div> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-[4px] p-[7px] text-[#66677f] hover:bg-[#f6f7fb]">
            <X className="h-[16px] w-[16px]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-white px-[12px] py-[14px]">{children}</div>
        {footer ? <div className="border-t border-[#e5e6ef] bg-white p-[10px]">{footer}</div> : null}
      </aside>
    </div>
  )
}

function DrawerSelectField({ label, value, onChange, options, placeholder }) {
  return (
    <label className="block">
      <span className="mb-[-8px] ml-[10px] inline-block bg-white px-[4px] text-[12px] text-[#66677f]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-[54px] w-full rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] text-[14px] text-[#24243d] outline-none"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function DrawerMultiSelectField({ label, value = [], onChange, options, allowEmpty = false }) {
  const [open, setOpen] = useState(false)
  const selectedValues = Array.isArray(value) ? value : []
  const displayValue = selectedValues.length ? selectedValues.join(' / ') : '请选择'

  const toggleOption = (option) => {
    const exists = selectedValues.includes(option)
    const nextValues = exists
      ? selectedValues.filter((item) => item !== option)
      : [...selectedValues, option]

    onChange?.(nextValues.length || allowEmpty ? nextValues : selectedValues)
  }

  return (
    <div className="relative">
      <span className="mb-[-8px] ml-[10px] inline-block bg-white px-[4px] text-[12px] text-[#66677f]">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-[54px] w-full items-center justify-between rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] text-left text-[14px] text-[#24243d] outline-none"
      >
        <span className={selectedValues.length ? 'font-semibold' : 'text-[#9a9cab]'}>{displayValue}</span>
        <ChevronDown className={`h-[16px] w-[16px] text-[#8a8ca0] transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-[58px] z-30 rounded-[5px] border border-[#cfd1dc] bg-white p-[6px] shadow-[0_12px_28px_rgba(31,35,66,0.14)]">
          {options.map((option) => {
            const checked = selectedValues.includes(option)

            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleOption(option)}
                className={`flex h-[38px] w-full items-center justify-between rounded-[4px] px-[10px] text-[13px] font-semibold transition ${
                  checked ? 'bg-[#f0e9ff] text-[#8b4fff]' : 'text-[#4c4c68] hover:bg-[#f6f7fb]'
                }`}
              >
                <span>{option}</span>
                <span className={`flex h-[16px] w-[16px] items-center justify-center rounded-[4px] border text-[11px] ${
                  checked ? 'border-[#8b4fff] bg-[#8b4fff] text-white' : 'border-[#cfd1dc] text-transparent'
                }`}>
                  ✓
                </span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function DrawerInputField({ label, placeholder = '', prefix = '', value, onChange, type = 'text', readOnly = false }) {
  const inputProps = value === undefined
    ? {}
    : {
      value,
      onChange: (event) => onChange?.(event.target.value),
    }

  return (
    <label className="block">
      <span className="mb-[-8px] ml-[10px] inline-block bg-white px-[4px] text-[12px] text-[#66677f]">{label}</span>
      <div className="flex h-[54px] items-center rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] text-[14px] text-[#24243d]">
        {prefix ? <span className="mr-[8px] font-semibold">{prefix}</span> : null}
        <input
          type={type}
          readOnly={readOnly}
          className={`h-full min-w-0 flex-1 bg-transparent outline-none ${readOnly ? 'cursor-default text-[#55556e]' : ''}`}
          placeholder={placeholder}
          {...inputProps}
        />
      </div>
    </label>
  )
}

function DrawerTextareaField({ label, placeholder, value, onChange }) {
  const textareaProps = value === undefined
    ? {}
    : {
      value,
      onChange: (event) => onChange?.(event.target.value),
    }

  return (
    <label className="block">
      <span className="mb-[-8px] ml-[10px] inline-block bg-white px-[4px] text-[12px] text-[#66677f]">{label}</span>
      <textarea className="h-[106px] w-full resize-none rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] py-[12px] text-[14px] outline-none" placeholder={placeholder} {...textareaProps} />
    </label>
  )
}

function formatAdminDateTime(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function downloadApplicationMaterials(application) {
  const materialLines = application.materials.map((material) => `${material.name} / ${material.status} / ${material.fileName}`)
  const content = [
    `申请编号：${application.id}`,
    `客户名称：${application.customer.name}`,
    `所选券商：${application.brokerName}`,
    `提交时间：${application.submittedAt}`,
    `文件签署状态：${application.signatureStatus}`,
    `文件上传状态：${application.uploadStatus}`,
    `当前开户状态：${application.openingStatus}`,
    '',
    '资料清单：',
    ...materialLines,
    '',
    '说明：当前为前端原型，占位文件用于模拟下载客户签署文件及上传资料。',
  ].join('\n')
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${application.id}-materials.txt`
  link.click()
  URL.revokeObjectURL(url)
}

function BrokerageFilterSelect({ label, value, onChange, options, width = 'w-[212px]' }) {
  return (
    <label className={`flex h-[50px] ${width} items-center justify-between rounded-[4px] border border-[#cfd1dc] bg-white px-[14px] text-[13px] text-[#4c4c68]`}>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-full min-w-[108px] bg-transparent text-right font-semibold text-[#20213a] outline-none">
        <option value="">全部</option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>{option.label || option}</option>
        ))}
      </select>
    </label>
  )
}

function BrokerageInfoRow({ label, value, strong = false }) {
  return (
    <div className="flex items-start justify-between gap-[12px] border-b border-[#edf0f6] py-[9px] last:border-b-0">
      <span className="text-[12px] text-[#66677f]">{label}</span>
      <span className={`max-w-[245px] break-words text-right text-[13px] ${strong ? 'font-semibold text-[#20213a]' : 'text-[#55556e]'}`}>{value || '-'}</span>
    </div>
  )
}

function BrokerageDrawerSection({ title, children }) {
  return (
    <section className="rounded-[5px] border border-[#e2e4ec] bg-[#fbfbfd] p-[13px]">
      <div className="mb-[8px] text-[13px] font-semibold text-[#20213a]">{title}</div>
      {children}
    </section>
  )
}

const brokerageSettlementCurrencyOptions = enabledCurrencyOptions.map((currency) => currency.code)

function normalizeBrokerageSettlementCurrencies(value, fallbackValue = '') {
  const sourceValues = Array.isArray(value)
    ? value
    : String(value || fallbackValue || '')
      .split(/[,\s/、]+/)
      .filter(Boolean)

  return brokerageSettlementCurrencyOptions.filter((option) => sourceValues.includes(option))
}

function formatBrokerageSettlementCurrencies(account) {
  const values = normalizeBrokerageSettlementCurrencies(account?.settlementCurrencies || account?.settlementCurrency, account?.currency)
  return values.length ? values.join(' / ') : '-'
}

function BrokerageAccountForm({ value, onChange, lockedBrokerName = '', accountCurrencyConfigs = initialAccountCurrencyConfigs }) {
  const displayBrokerName = lockedBrokerName || value.brokerName
  const updateField = (field, nextValue) => {
    onChange({ ...value, brokerName: displayBrokerName, accountType: '现金账户', [field]: nextValue })
  }

  return (
    <BrokerageDrawerSection title="券商账户信息（客户可见）">
      <div className="space-y-[13px]">
        {lockedBrokerName ? (
          <BrokerageReadOnlyField label="券商名称 *" value={displayBrokerName} />
        ) : (
          <DrawerInputField label="券商名称 *" value={displayBrokerName} onChange={(nextValue) => updateField('brokerName', nextValue)} />
        )}
        <DrawerInputField label="账户名称 *" value={value.accountName} onChange={(nextValue) => updateField('accountName', nextValue)} placeholder="XXX Trust Account" />
        <DrawerInputField label="券商账户号码 *" value={value.accountNumber} onChange={(nextValue) => updateField('accountNumber', nextValue)} placeholder="请输入券商账户号码" />
        <BrokerageReadOnlyField label="账户类型 *" value="现金账户" />
        <DrawerInputField label="开户日期 *" type="date" value={value.openedAt} onChange={(nextValue) => updateField('openedAt', nextValue)} />
      </div>
    </BrokerageDrawerSection>
  )
}

function BrokeragePageSection({ title, icon: Icon = FileText, children }) {
  return (
    <Panel className="p-[18px]">
      <div className="mb-[16px] flex items-center gap-[8px] text-[14px] font-semibold text-[#20213a]">
        <Icon className="h-[17px] w-[17px] text-[#8b4fff]" />
        {title}
      </div>
      {children}
    </Panel>
  )
}

function BrokerageReadOnlyField({ label, value }) {
  return (
    <div className="min-h-[82px] rounded-[5px] border border-[#e2e4ec] bg-[#fbfbfd] p-[14px]">
      <div className="text-[12px] text-[#66677f]">{label}</div>
      <div className="mt-[8px] break-words text-[13px] font-semibold text-[#24243d]">{value || '-'}</div>
    </div>
  )
}

function formatBrokerageDetailValue(value) {
  if (Array.isArray(value)) return value.length ? value.join(' / ') : '-'
  if (value === 0) return '0'
  return value || '-'
}

function copyBrokerageValue(value) {
  const text = formatBrokerageDetailValue(value)
  if (!text || text === '-') return
  navigator.clipboard?.writeText(text).catch(() => {})
}

const brokerageCountryRegionOptions = ['中国（CN）', '中国香港（HK）', '中国澳门（MO）', '中国台湾（TW）', '新加坡（SG）', '美国（US）', '日本（JP）']

function BrokerageDetailField({ label, value, copyable = false, wide = false, editable = false, onChange, options }) {
  const [editing, setEditing] = useState(false)
  const [fieldValue, setFieldValue] = useState(formatBrokerageDetailValue(value))
  const displayValue = formatBrokerageDetailValue(fieldValue)
  const startEditing = () => {
    setFieldValue(displayValue === '-' ? '' : displayValue)
    setEditing(true)
  }
  const cancelEditing = () => {
    setFieldValue(formatBrokerageDetailValue(value))
    setEditing(false)
  }
  const saveEditing = () => {
    const nextValue = fieldValue.trim() || '-'
    setFieldValue(nextValue)
    onChange?.(nextValue)
    setEditing(false)
  }

  return (
    <div className={`${wide ? 'md:col-span-2' : ''} min-h-[76px] rounded-[5px] border border-[#e2e4ec] bg-[#fbfbfd] p-[13px]`}>
      <div className="flex items-center justify-between gap-[8px]">
        <div className="text-[12px] text-[#66677f]">{label}</div>
        <div className="flex items-center gap-[8px]">
          {editing ? (
            <>
              <button type="button" onClick={saveEditing} className="text-[#42c600] hover:text-[#2fa600]" aria-label={`保存${label}`}>
                <CheckCircle2 className="h-[15px] w-[15px]" />
              </button>
              <button type="button" onClick={cancelEditing} className="text-[#f04f5f] hover:text-[#d73f4d]" aria-label={`取消${label}`}>
                <X className="h-[15px] w-[15px]" />
              </button>
            </>
          ) : (
            <>
              {copyable && displayValue !== '-' ? (
                <button
                  type="button"
                  onClick={() => copyBrokerageValue(displayValue)}
                  className="inline-flex h-[24px] items-center gap-[4px] rounded-[4px] border border-[#d9dcf0] bg-white px-[7px] text-[11px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]"
                >
                  <Copy className="h-[12px] w-[12px]" />
                  复制
                </button>
              ) : null}
              {editable ? (
                <button type="button" onClick={startEditing} className="text-[#8b4fff] hover:text-[#7f42f2]" aria-label={`修改${label}`}>
                  <Pencil className="h-[15px] w-[15px]" />
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>
      {editing ? (
        options?.length ? (
          <select
            value={fieldValue === '-' ? options[0] : fieldValue}
            onChange={(event) => setFieldValue(event.target.value)}
            className="mt-[8px] h-[40px] w-full rounded-[4px] border border-[#cfd1dc] bg-white px-[10px] text-[13px] font-semibold text-[#24243d] outline-none focus:border-[#8b4fff]"
          >
            {options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <textarea
            value={fieldValue === '-' ? '' : fieldValue}
            onChange={(event) => setFieldValue(event.target.value)}
            className="mt-[8px] h-[58px] w-full resize-none rounded-[4px] border border-[#cfd1dc] bg-white px-[10px] py-[8px] text-[13px] font-semibold leading-[20px] text-[#24243d] outline-none focus:border-[#8b4fff]"
            placeholder="-"
          />
        )
      ) : (
        <div className="mt-[8px] break-words text-[13px] font-semibold leading-[20px] text-[#24243d]">{displayValue}</div>
      )}
    </div>
  )
}

function BrokerageDetailGrid({ rows, editable = false, onFieldChange }) {
  return (
    <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
      {rows.map((row) => (
        <BrokerageDetailField
          key={row.label}
          label={row.label}
          value={row.value}
          copyable={row.copyable}
          wide={row.wide}
          editable={editable}
          options={row.options}
          onChange={(nextValue) => onFieldChange?.(row.key, nextValue)}
        />
      ))}
    </div>
  )
}

function splitBrokerageCustomerName(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return { firstName: '-', middleName: '-', lastName: '-' }
  if (parts.length === 1) return { firstName: parts[0], middleName: '-', lastName: parts[0] }
  return {
    firstName: parts.slice(0, -1).join(' '),
    middleName: parts.length > 2 ? parts.slice(1, -1).join(' ') : '-',
    lastName: parts[parts.length - 1],
  }
}

function createBrokeragePerson(application, role, index = 0) {
  const { firstName, middleName, lastName } = splitBrokerageCustomerName(application.customer.name)
  const phone = application.customer.phone || '-'
  const isBeneficiary = role === '受益人'
  const isSecondBeneficiary = isBeneficiary && index === 1
  const documentSuffix = isBeneficiary ? `beneficiary-${index + 1}` : 'settlor'

  return {
    lastNameEn: isSecondBeneficiary ? `${lastName || 'TRUST'} BENEFICIARY` : lastName,
    middleName: middleName === '-' ? 'N/A' : middleName,
    firstNameEn: isSecondBeneficiary ? 'FAMILY' : firstName,
    lastNameCn: isSecondBeneficiary ? '受' : application.customer.name?.slice(0, 1) || '-',
    firstNameCn: isSecondBeneficiary ? '益人' : application.customer.name?.slice(1) || '-',
    gender: isSecondBeneficiary ? '男' : '女',
    birthDate: isSecondBeneficiary ? '1988-10-09' : '1990-03-18',
    documentType: '护照',
    documentNumber: `P${application.customer.id || '0000'}${index + 1}`,
    nationality: application.customer.phone?.startsWith('+852') ? '中国香港（HK）' : '中国（CN）',
    phone,
    address: isSecondBeneficiary ? '上海市浦东新区世纪大道 88 号' : '香港中环金融街 8 号 Fidere Trust Office',
    email: application.customer.email || '-',
    beneficiaryRatio: '',
    documentPhoto: {
      name: `${application.id}-${documentSuffix}-id-photo.pdf`,
      status: '已上传',
      uploadedAt: application.submittedAt,
    },
  }
}

function getBrokerageOpeningProfile(application) {
  const settlor = createBrokeragePerson(application, '委托人')
  const fallbackBeneficiaries = [
    {
      ...createBrokeragePerson(application, '受益人', 0),
      firstNameEn: splitBrokerageCustomerName(application.customer.name).firstName,
    },
    {
      ...createBrokeragePerson(application, '受益人', 1),
      firstNameEn: 'Family Beneficiary',
      lastNameEn: splitBrokerageCustomerName(application.customer.name).lastName,
      lastNameCn: '受',
      firstNameCn: '益人',
      phone: application.customer.phone || '-',
    },
  ]

  return {
    beneficiaries: application.beneficiaries || fallbackBeneficiaries,
    settlor,
  }
}

function BrokeragePersonRows(person, { includeMailing = false } = {}) {
  const rows = [
    { key: 'lastNameEn', label: '姓（英）', value: person?.lastNameEn, copyable: true },
    { key: 'middleName', label: '中间名', value: person?.middleName, copyable: true },
    { key: 'firstNameEn', label: '名（英）', value: person?.firstNameEn, copyable: true },
    { key: 'lastNameCn', label: '姓（中）', value: person?.lastNameCn, copyable: true },
    { key: 'firstNameCn', label: '名（中）', value: person?.firstNameCn, copyable: true },
    { key: 'gender', label: '性别', value: person?.gender, copyable: true },
    { key: 'birthDate', label: '出生日期', value: person?.birthDate, copyable: true },
    { key: 'documentType', label: '证件类型', value: person?.documentType, copyable: true },
    { key: 'documentNumber', label: '证件号码', value: person?.documentNumber, copyable: true },
    { key: 'nationality', label: '国籍', value: person?.nationality, copyable: true, options: brokerageCountryRegionOptions },
    { key: 'phone', label: '电话号码', value: person?.phone, copyable: true },
  ]

  rows.push({ key: 'address', label: '住宅地址', value: person?.address, copyable: true, wide: true })
  if (includeMailing) rows.push({ key: 'email', label: '邮箱地址', value: person?.email, copyable: true, wide: true })

  return rows
}

function BrokerageIdentityFileRow({ file, editable = false }) {
  const [currentFile, setCurrentFile] = useState(file || {})
  return (
    <div className="mt-[10px] rounded-[5px] border border-[#e2e4ec] bg-white p-[12px]">
      <div className="flex items-start justify-between gap-[12px]">
        <div>
          <div className="text-[13px] font-semibold text-[#20213a]">证件照片</div>
          <div className="mt-[5px] text-[12px] text-[#66677f]">{currentFile?.name || '-'}</div>
          <div className="mt-[4px] text-[12px] text-[#8a8ca0]">上传时间：{currentFile?.uploadedAt || '-'}</div>
        </div>
        <StatusBadge tone={currentFile?.status === '已上传' ? 'green' : 'gray'}>{currentFile?.status || '未上传'}</StatusBadge>
      </div>
      <div className="mt-[10px] flex flex-wrap gap-[8px]">
        <ActionButton icon={Eye}>查看</ActionButton>
        <ActionButton icon={Download}>下载</ActionButton>
      </div>
    </div>
  )
}

function BrokeragePersonSection({ title, person, includeMailing = false, editable = false }) {
  const [draftPerson, setDraftPerson] = useState(person || {})

  return (
    <BrokeragePageSection title={title} icon={UserRound}>
      <BrokerageDetailGrid
        rows={BrokeragePersonRows(draftPerson, { includeMailing })}
        editable={editable}
        onFieldChange={(field, nextValue) => setDraftPerson((current) => ({ ...current, [field]: nextValue }))}
      />
      <BrokerageIdentityFileRow file={draftPerson?.documentPhoto} editable={editable} />
    </BrokeragePageSection>
  )
}

function BrokerageUserManagementLinkSection({ title, application, onOpenUserDetail }) {
  return (
    <BrokeragePageSection title={title} icon={UsersRound}>
      <div className="rounded-[6px] border border-[#e2e4ec] bg-[#fbfbfd] px-[18px] py-[18px]">
        <div className="text-[14px] font-semibold text-[#20213a]">资料已归档至用户管理详情</div>
        <div className="mt-[8px] text-[13px] leading-[22px] text-[#66677f]">
          当前页面不再展示{title}字段，运营可跳转到后台用户管理详情页查看客户完整资料。
        </div>
        <div className="mt-[14px] flex flex-wrap items-center gap-[10px]">
          <span className="rounded-[5px] bg-white px-[12px] py-[8px] text-[12px] font-semibold text-[#55556e]">
            {application.customer.name} / ID: {application.customer.id}
          </span>
          <PrimaryButton icon={Eye} onClick={() => onOpenUserDetail?.(application.customer)}>查看用户管理详情</PrimaryButton>
        </div>
      </div>
    </BrokeragePageSection>
  )
}

function getBrokerageReviewFiles(application) {
  const materialMap = new Map(application.materials.map((material) => [material.id, material]))
  const standardFiles = application.brokerId === 'webull'
    ? [
        { id: 'basic_profile', name: '账户基础资料', type: '上传资料' },
        { id: 'authorization_letter', name: 'W8-ben表格', type: '第三方签署文档' },
        { id: 'risk_disclosure', name: 'CRS-Controlling person表格', type: '第三方签署文档' },
      ]
    : [
        { id: 'address_proof', name: '地址证明', type: '上传资料' },
      ]

  const files = standardFiles.map((file) => {
    const material = materialMap.get(file.id)
    const uploaded = material?.status === '已上传' || material?.status === '已签署'

    return {
      ...file,
      fileName: material?.fileName && material.fileName !== '-' ? material.fileName : '-',
      status: uploaded ? '已上传' : '未上传',
      uploadedAt: material?.uploadedAt || (uploaded ? application.submittedAt : '-'),
    }
  })

  application.materials.forEach((material) => {
    if (!files.some((file) => file.id === material.id)) {
      files.push({
        ...material,
        fileName: material.fileName && material.fileName !== '-' ? material.fileName : '-',
        status: material.status === '已上传' || material.status === '已签署' ? '已上传' : '未上传',
        uploadedAt: material.status === '已上传' || material.status === '已签署' ? application.submittedAt : '-',
      })
    }
  })

  return files
}

function BrokerageProfileInfoRow({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-[12px]">
      <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[5px] bg-[#f0e9ff] text-[#8b4fff]">
        <Icon className="h-[17px] w-[17px]" />
      </div>
      <div>
        <div className="text-[13px] font-semibold text-[#20213a]">{value || '-'}</div>
        <div className="mt-[2px] text-[12px] text-[#66677f]">{label}</div>
      </div>
    </div>
  )
}

function BrokerageUserSummaryGrid({ application }) {
  return (
    <div className="grid grid-cols-3 gap-[10px]">
      <BrokerageReadOnlyField label="客户名称" value={application.customer.name} />
      <BrokerageReadOnlyField label="所选券商" value={application.brokerName} />
      <BrokerageReadOnlyField label="当前开户状态" value={application.openingStatus} />
      <BrokerageReadOnlyField label="提交时间" value={application.submittedAt} />
      <BrokerageReadOnlyField label="用户ID" value={application.customer.id} />
      <BrokerageReadOnlyField label="手机号" value={application.customer.phone} />
      <BrokerageReadOnlyField label="邮箱地址" value={application.customer.email} />
    </div>
  )
}

function getBrokerageVisibleAccount(application) {
  if (application.accountInfo) {
    return {
      ...application.accountInfo,
      brokerName: application.brokerName,
      accountType: application.accountInfo.accountType || '现金账户',
      settlementCurrencies: normalizeBrokerageSettlementCurrencies(application.accountInfo.settlementCurrencies || application.accountInfo.settlementCurrency, application.accountInfo.currency),
      settlementCurrency: formatBrokerageSettlementCurrencies(application.accountInfo),
    }
  }

  return {
    brokerName: application.brokerName,
    accountName: '-',
    accountNumber: '-',
    accountType: '-',
    settlementCurrency: '-',
    openedAt: '-',
    accountStatus: application.openingStatus,
  }
}

function BrokerageVisibleAccountInfoSection({ application }) {
  const visibleAccount = getBrokerageVisibleAccount(application)

  return (
    <BrokeragePageSection title="券商账户信息（客户可见）" icon={WalletCards}>
      <div className="grid grid-cols-3 gap-[10px]">
        <BrokerageReadOnlyField label="券商名称" value={visibleAccount.brokerName} />
        <BrokerageReadOnlyField label="账户名称" value={visibleAccount.accountName} />
        <BrokerageReadOnlyField label="券商账户号码" value={visibleAccount.accountNumber} />
        <BrokerageReadOnlyField label="账户类型" value={visibleAccount.accountType || '现金账户'} />
        <BrokerageReadOnlyField label="开户日期" value={visibleAccount.openedAt} />
      </div>
    </BrokeragePageSection>
  )
}

function BrokerageProfileCard({ application }) {
  const customerType = application.customer.type || (String(application.customer.id).startsWith('CL-') ? '企业客户' : '个人客户')

  return (
    <Panel className="p-[20px]">
      <div className="flex flex-col items-center pb-[18px] pt-[28px]">
        <div className="flex h-[120px] w-[120px] items-center justify-center rounded-[5px] bg-[#efedf0] text-[28px] font-bold text-[#3a3154]">{application.customer.initials}</div>
        <div className="mt-[20px] text-[18px] font-semibold text-[#20213a]">{application.customer.name}</div>
        <div className="mt-[10px] rounded-full border border-[#e2e4ec] bg-white px-[14px] py-[3px] text-[12px] text-[#20213a]">{customerType}</div>
      </div>
      <div className="mx-auto mt-[4px] w-[220px] space-y-[14px]">
        <BrokerageProfileInfoRow icon={CalendarDays} value={application.submittedAt} label="提交时间" />
        <BrokerageProfileInfoRow icon={UserRound} value={application.customer.id} label="用户ID" />
      </div>
      <div className="mt-[28px] border-t border-[#e5e6ef] pt-[18px] text-[13px] leading-[30px] text-[#55556e]">
        <div className="mb-[10px] text-[15px] font-semibold text-[#20213a]">详细信息</div>
        <div>手机号：{application.customer.phone || '-'}</div>
        <div>邮箱地址：{application.customer.email || '-'}</div>
        <div>职业：{application.customer.occupation || '-'}</div>
        <div>职位：{application.customer.position || '-'}</div>
      </div>
    </Panel>
  )
}

function getBrokerageReturnReason(application) {
  return [...(application.statusLogs || [])]
    .reverse()
    .find((log) => log.to === '已拒绝')?.remark || ''
}

function BrokerageReturnReasonCard({ application }) {
  if (application.openingStatus !== '已拒绝') return null

  return (
    <Panel className="p-[18px]">
      <div className="flex items-center gap-[8px] text-[14px] font-semibold text-[#20213a]">
        <FileText className="h-[17px] w-[17px] text-[#8b4fff]" />
        拒绝原因
      </div>
      <div className="mt-[12px] rounded-[5px] border border-[#ffd7dc] bg-[#fff7f8] px-[12px] py-[11px] text-[13px] leading-[22px] text-[#b52d3b]">
        {getBrokerageReturnReason(application) || '暂无拒绝原因'}
      </div>
    </Panel>
  )
}

function BrokerageMaterialsGrid({ application, mode = 'view' }) {
  const files = getBrokerageReviewFiles(application)

  return (
    <div className="grid grid-cols-2 gap-[10px]">
      {files.map((material) => {
        return (
          <div key={material.id} className="rounded-[5px] border border-[#e2e4ec] bg-white p-[14px]">
            <div className="flex items-start justify-between gap-[12px]">
              <div>
                <div className="text-[13px] font-semibold text-[#20213a]">{material.name}</div>
                <div className="mt-[5px] text-[12px] text-[#66677f]">{material.type} · {material.fileName || '未上传'}</div>
                <div className="mt-[4px] text-[12px] text-[#8a8ca0]">上传时间：{material.uploadedAt || '-'}</div>
              </div>
              <StatusBadge tone={material.status === '已上传' || material.status === '已签署' ? 'green' : 'gray'}>{material.status || '未上传'}</StatusBadge>
            </div>
            <div className="mt-[13px] flex flex-wrap gap-[8px]">
              <ActionButton icon={Eye}>查看</ActionButton>
              <ActionButton icon={Download} onClick={() => downloadApplicationMaterials(application)}>下载</ActionButton>
            </div>
            {mode === 'process' ? (
              <div className="mt-[9px] rounded-[4px] bg-[#f6f7fb] px-[10px] py-[8px] text-[12px] text-[#66677f]">
                {material.type === '签署文件' ? '第三方签署文件，仅支持查看或下载。' : '附件文件仅支持查看或下载。'}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function getBrokerageLogMeta(operator = '') {
  if (operator.includes('客户')) {
    return {
      label: '客户操作',
      node: 'bg-[#5387ff] ring-[#e5ecff]',
      tag: 'bg-[#eef4ff] text-[#3268d8]',
    }
  }
  if (operator.includes('后台')) {
    return {
      label: '后台操作',
      node: 'bg-[#ff9b4a] ring-[#fff0e3]',
      tag: 'bg-[#fff3e8] text-[#c96f18]',
    }
  }
  return {
    label: '系统记录',
    node: 'bg-[#9a9cab] ring-[#f0f1f5]',
    tag: 'bg-[#f1f2f6] text-[#66677f]',
  }
}

function BrokerageTimelineLogs({ logs }) {
  return (
    <div className="space-y-[18px]">
      {logs.map((log, index) => {
        const meta = getBrokerageLogMeta(log.operator)
        const isLast = index === logs.length - 1

        return (
          <div key={log.id} className="grid grid-cols-[28px_1fr] gap-[12px]">
            <div className="relative flex justify-center">
              {!isLast ? <div className="absolute left-1/2 top-[18px] h-[calc(100%+18px)] w-px -translate-x-1/2 bg-[#e3e5ee]" /> : null}
              <span className={`relative mt-[6px] h-[10px] w-[10px] rounded-full ring-[5px] ${meta.node}`} />
            </div>
            <div className="rounded-[6px] border border-[#e7e8ef] bg-white px-[14px] py-[12px] shadow-[0_6px_16px_rgba(31,35,66,0.06)]">
              <div className="flex items-start justify-between gap-[12px]">
                <div className="min-w-0">
                  <div className="break-words text-[13px] font-semibold text-[#20213a]">{log.from} → {log.to}</div>
                  <div className="mt-[7px] flex flex-wrap items-center gap-[8px]">
                    <span className={`rounded-full px-[9px] py-[3px] text-[12px] font-semibold ${meta.tag}`}>{meta.label}</span>
                    <span className="text-[12px] text-[#66677f]">操作人：{log.operator || '-'}</span>
                  </div>
                </div>
                <div className="shrink-0 text-right text-[12px] text-[#8a8ca0]">{log.time}</div>
              </div>
              <div className="mt-[10px] rounded-[4px] bg-[#fbfbfd] px-[10px] py-[8px] text-[12px] leading-[20px] text-[#55556e]">
                {log.remark || '暂无操作说明'}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function BrokerageReviewSummaryBanner({ application }) {
  return (
    <Panel className="border-l-[4px] border-l-[#8b4fff] p-[18px]">
      <div className="flex items-center justify-between gap-[14px]">
        <div>
          <div className="text-[16px] font-semibold text-[#20213a]">开户所需资料汇总</div>
          <div className="mt-[7px] text-[13px] leading-[22px] text-[#66677f]">
            运营可根据以下资料在 {application.brokerName || '券商'} 后台手动完成开户，页面仅做只读展示与文件操作。
          </div>
        </div>
        <StatusBadge tone={brokerageOpeningStatusTones[application.openingStatus]}>{application.openingStatus}</StatusBadge>
      </div>
    </Panel>
  )
}

function BrokerageBeneficiaryCard({ beneficiary, index, editable = false }) {
  const [draftBeneficiary, setDraftBeneficiary] = useState(beneficiary || {})

  return (
    <div className="rounded-[6px] border border-[#e2e4ec] bg-white p-[14px]">
      <div className="mb-[12px] flex items-center justify-between gap-[12px]">
        <div className="text-[13px] font-semibold text-[#20213a]">受益人 {index + 1}</div>
      </div>
      <BrokerageDetailGrid
        rows={BrokeragePersonRows(draftBeneficiary)}
        editable={editable}
        onFieldChange={(field, nextValue) => setDraftBeneficiary((current) => ({ ...current, [field]: nextValue }))}
      />
      <BrokerageIdentityFileRow file={draftBeneficiary?.documentPhoto} editable={editable} />
    </div>
  )
}

function BrokerageBeneficiariesSection({ beneficiaries, editable = false }) {
  return (
    <BrokeragePageSection title="受益人资料" icon={UsersRound}>
      <div className="space-y-[12px]">
        {beneficiaries.map((beneficiary, index) => (
          <BrokerageBeneficiaryCard
            key={`${beneficiary.documentNumber || beneficiary.firstNameEn || 'beneficiary'}-${index}`}
            beneficiary={beneficiary}
            index={index}
            editable={editable}
          />
        ))}
      </div>
    </BrokeragePageSection>
  )
}

function BrokerageRejectedReasonSection({ application }) {
  if (application.openingStatus !== '已拒绝') return null

  const reason = [...(application.statusLogs || [])]
    .reverse()
    .find((log) => log.to === '已拒绝')?.remark || '暂无拒绝原因'

  return (
    <BrokeragePageSection title="拒绝原因" icon={XCircle}>
      <div className="rounded-[5px] border border-[#ffd7dc] bg-[#fff7f8] px-[14px] py-[12px] text-[13px] leading-[22px] text-[#b52d3b]">
        {reason}
      </div>
    </BrokeragePageSection>
  )
}

const brokerageReviewTabs = [
  { key: 'overview', label: '申请概览' },
  { key: 'people', label: '委托人/受益人资料' },
  { key: 'documents', label: '文档资料' },
]

function BrokerageReviewTabBar({ activeTab, onChange, tabs = brokerageReviewTabs }) {
  return (
    <Panel className="px-[12px] py-[10px]">
      <div className="flex flex-wrap gap-[8px]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`h-[38px] rounded-full px-[15px] text-[13px] font-semibold transition ${
              activeTab === tab.key
                ? 'bg-[#8b4fff] text-white shadow-[0_8px_18px_rgba(139,79,255,0.2)]'
                : 'border border-[#e2e4ec] bg-white text-[#4c4c68] hover:border-[#c7b5ff] hover:text-[#8b4fff]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </Panel>
  )
}

function BrokerageOverviewTab({ application }) {
  const feeRows = []
  if (application.openingFee) feeRows.push({ label: '开户费用', value: application.openingFee })
  if (application.feeCurrency) feeRows.push({ label: '扣费币种', value: application.feeCurrency })
  if (application.feeStatus) feeRows.push({ label: '扣费状态', value: application.feeStatus })
  if (application.transactionNo) feeRows.push({ label: '交易流水号', value: application.transactionNo, copyable: true })

  return (
    <BrokeragePageSection title="申请概览" icon={ShieldCheck}>
      <BrokerageDetailGrid
        rows={[
          { label: '客户名称', value: application.customer.name, copyable: true },
          { label: '用户ID', value: application.customer.id, copyable: true },
          { label: '手机号', value: application.customer.phone, copyable: true },
          { label: '邮箱地址', value: application.customer.email, copyable: true },
          { label: '所选券商', value: application.brokerName, copyable: true },
          { label: '当前开户状态', value: application.openingStatus },
          { label: '提交时间', value: application.submittedAt, copyable: true },
          ...feeRows,
        ]}
      />
    </BrokeragePageSection>
  )
}

function BrokerageBeneficiariesTab({ beneficiaries, editable = false }) {
  if (!beneficiaries.length) {
    return (
      <BrokeragePageSection title="受益人资料" icon={UsersRound}>
        <div className="rounded-[5px] border border-[#e2e4ec] bg-[#fbfbfd] px-[14px] py-[16px] text-[13px] font-semibold text-[#66677f]">
          暂无受益人资料
        </div>
      </BrokeragePageSection>
    )
  }

  return <BrokerageBeneficiariesSection beneficiaries={beneficiaries} editable={editable} />
}

function buildBrokerageInitialAccountForm(application) {
  if (application.accountInfo) {
    return {
      ...application.accountInfo,
      brokerName: application.brokerName,
      accountType: '现金账户',
      settlementCurrencies: normalizeBrokerageSettlementCurrencies(application.accountInfo.settlementCurrencies || application.accountInfo.settlementCurrency, application.accountInfo.currency),
      settlementCurrency: formatBrokerageSettlementCurrencies(application.accountInfo),
      currency: application.accountInfo.currency || normalizeBrokerageSettlementCurrencies(application.accountInfo.settlementCurrencies || application.accountInfo.settlementCurrency)[0] || 'USD',
    }
  }

  return {
    brokerName: application.brokerName,
    accountName: '',
    accountNumber: '',
    accountType: '现金账户',
    settlementCurrencies: ['USD'],
    settlementCurrency: 'USD',
    currency: 'USD',
    openedAt: formatAdminDateTime().slice(0, 10),
    accountStatus: '已开户',
    remark: '',
  }
}

function BrokerageProcessTab({
  application,
  onSave,
  accountCurrencyConfigs = initialAccountCurrencyConfigs,
  controlledStatus,
  onStatusChange,
  controlledAccountForm,
  onAccountFormChange,
  showAccountFormInline = true,
}) {
  const [internalNextStatus, setInternalNextStatus] = useState(application.openingStatus)
  const [statusRemark, setStatusRemark] = useState('')
  const [statusError, setStatusError] = useState('')
  const [internalAccountForm, setInternalAccountForm] = useState(() => buildBrokerageInitialAccountForm(application))
  const nextStatus = controlledStatus ?? internalNextStatus
  const accountForm = controlledAccountForm ?? internalAccountForm
  const setNextStatus = onStatusChange ?? setInternalNextStatus
  const setAccountForm = onAccountFormChange ?? setInternalAccountForm
  const showAccountForm = nextStatus === '已开户'
  const showRejectedReason = nextStatus === '已拒绝'
  const remarkLabel = showRejectedReason ? '拒绝原因 *' : '处理备注'

  const saveChanges = () => {
    if (showRejectedReason && !statusRemark.trim()) {
      setStatusError('请填写拒绝原因')
      return
    }

    setStatusError('')
    const nextLog = {
      id: `log-${application.id}-${Date.now()}`,
      time: formatAdminDateTime(),
      operator: '后台人员',
      from: application.openingStatus,
      to: nextStatus,
      remark: statusRemark.trim() || (showAccountForm ? '开户完成，券商账户信息已同步给客户。' : '后台手动更新开户状态。'),
    }

    onSave?.(application.id, {
      openingStatus: nextStatus,
      accountInfo: showAccountForm ? { ...accountForm, brokerName: application.brokerName, accountType: '现金账户' } : application.accountInfo,
      statusLogs: [...application.statusLogs, nextLog],
    })
  }

  return (
    <BrokeragePageSection title="开户处理" icon={FileCheck2}>
      <div className="space-y-[13px]">
        <DrawerSelectField
          label="开户状态 *"
          value={nextStatus}
          onChange={(nextValue) => {
            setNextStatus(nextValue)
            setStatusError('')
          }}
          options={brokerageOpeningStatuses}
        />
        <DrawerTextareaField
          label={remarkLabel}
          value={statusRemark}
          onChange={(nextValue) => {
            setStatusRemark(nextValue)
          if (statusError) setStatusError('')
        }}
          placeholder={showRejectedReason ? '请填写拒绝原因' : '记录本次处理说明'}
        />
        {statusError ? <div className="text-[12px] text-[#f04f5f]">{statusError}</div> : null}
        {showAccountFormInline && showAccountForm ? (
          <BrokerageAccountForm
            value={accountForm}
            onChange={setAccountForm}
            lockedBrokerName={application.brokerName}
            accountCurrencyConfigs={accountCurrencyConfigs}
          />
        ) : null}
        <button type="button" onClick={saveChanges} className="flex h-[38px] w-full items-center justify-center gap-[8px] rounded-[5px] bg-[#bda2f9] text-[13px] font-semibold text-white hover:bg-[#9b63f5]">
          <FileCheck2 className="h-[15px] w-[15px]" />
          保存处理结果
        </button>
      </div>
    </BrokeragePageSection>
  )
}

function BrokerageDocumentsTab({ application }) {
  return (
    <BrokeragePageSection title="文档资料" icon={FileText}>
      <BrokerageMaterialsGrid application={application} mode="process" />
    </BrokeragePageSection>
  )
}

function BrokerageReviewRightSections({
  application,
  onSave,
  defaultTab = 'overview',
  accountCurrencyConfigs = initialAccountCurrencyConfigs,
  onOpenUserDetail,
  processStatus,
  processAccountForm,
  onProcessAccountFormChange,
}) {
  const showEditableAccountInfo = Boolean(onProcessAccountFormChange) && processStatus === '已开户'
  const showReadonlyAccountInfo = !onProcessAccountFormChange && application.openingStatus === '已开户'
  const showAccountInfoTab = showEditableAccountInfo || showReadonlyAccountInfo
  const tabs = showAccountInfoTab
    ? [...brokerageReviewTabs, { key: 'account-info', label: '券商账户信息（客户可见）' }]
    : brokerageReviewTabs
  const [activeTab, setActiveTab] = useState(defaultTab)
  const currentTab = tabs.some((tab) => tab.key === activeTab) ? activeTab : 'overview'

  return (
    <>
      <BrokerageReviewSummaryBanner application={application} />
      <BrokerageReviewTabBar activeTab={currentTab} onChange={setActiveTab} tabs={tabs} />

      {currentTab === 'overview' ? (
        <div className="space-y-[18px]">
          <BrokerageOverviewTab application={application} />
          <BrokerageRejectedReasonSection application={application} />
        </div>
      ) : null}
      {currentTab === 'people' ? <BrokerageUserManagementLinkSection title="委托人/受益人资料" application={application} onOpenUserDetail={onOpenUserDetail} /> : null}
      {currentTab === 'documents' ? <BrokerageDocumentsTab application={application} /> : null}
      {currentTab === 'account-info' && showEditableAccountInfo ? (
        <BrokerageAccountForm
          value={processAccountForm}
          onChange={onProcessAccountFormChange}
          lockedBrokerName={application.brokerName}
          accountCurrencyConfigs={accountCurrencyConfigs}
        />
      ) : null}
      {currentTab === 'account-info' && showReadonlyAccountInfo ? (
        <BrokerageVisibleAccountInfoSection application={application} />
      ) : null}
    </>
  )
}

function BrokerageApplicationDetailPage({
  application,
  onBack,
  onSave,
  accountCurrencyConfigs = initialAccountCurrencyConfigs,
  onOpenUserDetail,
}) {
  return (
    <AdminShell>
      <div className="grid grid-cols-[360px_1fr] gap-[18px]">
        <div className="space-y-[18px]">
          <BrokerageProfileCard application={application} />
          <BrokerageReturnReasonCard application={application} />
        </div>

        <div className="space-y-[18px]">
          <div className="flex items-center justify-between">
            <ActionButton icon={ChevronDown} onClick={onBack}>返回券商开户管理</ActionButton>
          </div>

          <BrokerageReviewRightSections
            application={application}
            onSave={onSave}
            defaultTab="overview"
            accountCurrencyConfigs={accountCurrencyConfigs}
            onOpenUserDetail={onOpenUserDetail}
          />
        </div>
      </div>
    </AdminShell>
  )
}

function BrokerageApplicationProcessPage({
  application,
  onBack,
  onSave,
  accountCurrencyConfigs = initialAccountCurrencyConfigs,
  onOpenUserDetail,
}) {
  const [nextStatus, setNextStatus] = useState(application.openingStatus)
  const [accountForm, setAccountForm] = useState(() => buildBrokerageInitialAccountForm(application))

  return (
    <AdminShell>
      <div className="grid grid-cols-[360px_1fr] gap-[18px]">
        <div className="space-y-[18px]">
          <BrokerageProfileCard application={application} />
          <BrokerageProcessTab
            application={application}
            onSave={onSave}
            accountCurrencyConfigs={accountCurrencyConfigs}
            controlledStatus={nextStatus}
            onStatusChange={setNextStatus}
            controlledAccountForm={accountForm}
            onAccountFormChange={setAccountForm}
            showAccountFormInline={false}
          />
        </div>

        <div className="space-y-[18px]">
          <div className="flex items-center justify-between">
            <ActionButton icon={ChevronDown} onClick={onBack}>返回券商开户管理</ActionButton>
          </div>

          <BrokerageReviewRightSections
            application={application}
            onSave={onSave}
            defaultTab="overview"
            accountCurrencyConfigs={accountCurrencyConfigs}
            onOpenUserDetail={onOpenUserDetail}
            processStatus={nextStatus}
            processAccountForm={accountForm}
            onProcessAccountFormChange={setAccountForm}
          />

        </div>
      </div>
    </AdminShell>
  )
}

function BrokerageApplicationDrawer({ application, onClose, onSave }) {
  const initialAccount = application.accountInfo
    ? {
        ...application.accountInfo,
        brokerName: application.brokerName,
        accountType: '现金账户',
        settlementCurrencies: normalizeBrokerageSettlementCurrencies(application.accountInfo.settlementCurrencies || application.accountInfo.settlementCurrency, application.accountInfo.currency),
        settlementCurrency: formatBrokerageSettlementCurrencies(application.accountInfo),
        currency: application.accountInfo.currency || normalizeBrokerageSettlementCurrencies(application.accountInfo.settlementCurrencies || application.accountInfo.settlementCurrency)[0] || 'USD',
      }
    : {
        brokerName: application.brokerName,
        accountName: '',
        accountNumber: '',
        accountType: '现金账户',
        settlementCurrencies: ['USD'],
        settlementCurrency: 'USD',
        currency: 'USD',
        openedAt: formatAdminDateTime().slice(0, 10),
        accountStatus: '已开户',
        remark: '',
      }
  const [nextStatus, setNextStatus] = useState(application.openingStatus)
  const [statusRemark, setStatusRemark] = useState('')
  const [returnReasonError, setReturnReasonError] = useState('')
  const [accountForm, setAccountForm] = useState(initialAccount)
  const brokerConfig = brokerageBrokers.find((broker) => broker.id === application.brokerId)
  const showAccountForm = nextStatus === '已开户'
  const showRejectedReason = nextStatus === '已拒绝'

  const saveChanges = () => {
    if (showRejectedReason && !statusRemark.trim()) {
      setReturnReasonError('请填写拒绝原因')
      return
    }

    setReturnReasonError('')
    const nextLog = {
      id: `log-${application.id}-${Date.now()}`,
      time: formatAdminDateTime(),
      operator: '后台人员',
      from: application.openingStatus,
      to: nextStatus,
      remark: statusRemark.trim() || (showAccountForm ? '开户完成，券商账户信息已同步给客户。' : '后台手动更新开户状态。'),
    }

    onSave(application.id, {
      openingStatus: nextStatus,
      accountInfo: showAccountForm ? { ...accountForm, brokerName: application.brokerName, accountType: '现金账户' } : application.accountInfo,
      statusLogs: [...application.statusLogs, nextLog],
    })
  }

  return (
    <DrawerShell
      title="开户申请详情"
      eyebrow={application.id}
      onClose={onClose}
      footer={(
        <div className="grid grid-cols-2 gap-[8px]">
          <button type="button" onClick={onClose} className="h-[38px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">关闭</button>
          <button type="button" onClick={saveChanges} className="h-[38px] rounded-[5px] bg-[#8b4fff] text-[13px] font-semibold text-white hover:bg-[#7f42f2]">保存更新</button>
        </div>
      )}
    >
      <div className="space-y-[14px]">
        <BrokerageDrawerSection title="申请摘要">
          <BrokerageInfoRow label="客户名称" value={application.customer.name} strong />
          <BrokerageInfoRow label="所选券商" value={application.brokerName} strong />
          <BrokerageInfoRow label="当前开户状态" value={application.openingStatus} strong />
          <div className="mt-[10px] flex flex-wrap gap-[8px]">
            <StatusBadge tone={application.signatureStatus === '已签署' ? 'green' : 'gray'}>{application.signatureStatus}</StatusBadge>
            <StatusBadge tone={application.uploadStatus === '已上传' ? 'green' : application.uploadStatus === '部分上传' ? 'orange' : 'gray'}>{application.uploadStatus}</StatusBadge>
            <StatusBadge tone={brokerageOpeningStatusTones[application.openingStatus]}>{application.openingStatus}</StatusBadge>
          </div>
        </BrokerageDrawerSection>

        <BrokerageDrawerSection title="券商资料要求">
          <div className="space-y-[8px]">
            {(brokerConfig?.requiredMaterials || []).map((material) => (
              <div key={material.id} className="rounded-[4px] border border-[#e5e6ef] bg-white px-[10px] py-[9px] text-[12px] leading-[20px] text-[#55556e]">
                <div className="font-semibold text-[#20213a]">{material.name}{material.required ? '必填' : ''}</div>
                <div>{brokerageFileRule}</div>
              </div>
            ))}
          </div>
        </BrokerageDrawerSection>

        <BrokerageDrawerSection title="客户资料">
          <div className="space-y-[9px]">
            {application.materials.map((material) => (
              <div key={material.id} className="rounded-[4px] border border-[#e5e6ef] bg-white px-[10px] py-[9px]">
                <div className="flex items-start justify-between gap-[8px]">
                  <div>
                    <div className="text-[13px] font-semibold text-[#20213a]">{material.name}</div>
                    <div className="mt-[4px] text-[12px] text-[#66677f]">{material.type} · {material.fileName}</div>
                  </div>
                  <StatusBadge tone={material.status === '已上传' || material.status === '已签署' ? 'green' : 'gray'}>{material.status}</StatusBadge>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => downloadApplicationMaterials(application)} className="flex h-[36px] w-full items-center justify-center gap-[8px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">
              <Download className="h-[15px] w-[15px]" />
              下载全部资料
            </button>
          </div>
        </BrokerageDrawerSection>

        <BrokerageDrawerSection title="更新开户状态">
          <div className="space-y-[13px]">
            <DrawerSelectField
              label="当前开户状态 *"
              value={nextStatus}
              onChange={(nextValue) => {
                setNextStatus(nextValue)
                if (nextValue !== '已拒绝') setReturnReasonError('')
              }}
              options={brokerageOpeningStatuses}
            />
            <DrawerTextareaField
              label={showRejectedReason ? '拒绝原因 *' : '状态备注'}
              value={statusRemark}
              onChange={(nextValue) => {
                setStatusRemark(nextValue)
                if (returnReasonError) setReturnReasonError('')
              }}
              placeholder={showRejectedReason ? '请填写拒绝原因' : '记录本次状态流转说明'}
            />
            {returnReasonError ? <div className="text-[12px] text-[#f04f5f]">{returnReasonError}</div> : null}
          </div>
        </BrokerageDrawerSection>

        {showAccountForm ? (
          <BrokerageAccountForm
            value={accountForm}
            onChange={setAccountForm}
            lockedBrokerName={application.brokerName}
            accountCurrencyConfigs={initialAccountCurrencyConfigs}
          />
        ) : null}

        <BrokerageDrawerSection title="状态流转日志">
          <BrokerageTimelineLogs logs={application.statusLogs} />
        </BrokerageDrawerSection>
      </div>
    </DrawerShell>
  )
}

const brokerageUserTypeTabs = [
  { key: 'personal', label: '个人用户' },
  { key: 'enterprise', label: '企业用户' },
]

function getBrokerageCustomerType(application) {
  if (application.customer.type === '企业客户' || String(application.customer.id).startsWith('CL-')) return 'enterprise'
  return 'personal'
}

function BrokerageUserTypeTabs({ activeUserType, onChange }) {
  return (
    <Panel className="px-[14px] py-[10px]">
      <div className="flex items-center gap-[6px]">
        {brokerageUserTypeTabs.map((tab) => {
          const active = activeUserType === tab.key

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`h-[44px] rounded-full px-[18px] text-[14px] font-semibold transition ${
                active
                  ? 'bg-[#8b4fff] text-white shadow-[0_8px_18px_rgba(139,79,255,0.22)]'
                  : 'border border-[#e2e4ec] bg-[#fbfbfd] text-[#4c4c68] hover:border-[#c7b5ff] hover:text-[#8b4fff]'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </Panel>
  )
}

export function BrokerageApplicationManagementPage({
  applications = initialBrokerageApplications,
  onUpdateApplication,
  standalone = false,
  onBack,
  accountCurrencyConfigs = initialAccountCurrencyConfigs,
  onOpenUserDetail,
}) {
  const [activeUserType, setActiveUserType] = useState('personal')
  const [filters, setFilters] = useState({
    keyword: '',
    brokerId: '',
    openingStatus: '',
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [page, setPage] = useState(1)
  const [selectedApplicationId, setSelectedApplicationId] = useState('')
  const [pageMode, setPageMode] = useState('list')
  const [lastRefreshedAt, setLastRefreshedAt] = useState('2026-06-22 15:33:08')
  const pageSize = 10

  const userTypeApplications = useMemo(() => applications.filter((application) => getBrokerageCustomerType(application) === activeUserType), [applications, activeUserType])

  const filteredApplications = useMemo(() => userTypeApplications.filter((application) => {
    const keyword = appliedFilters.keyword.trim().toLowerCase()
    const keywordMatched = !keyword
      || application.customer.name.toLowerCase().includes(keyword)
      || application.customer.email.toLowerCase().includes(keyword)
      || application.customer.id.toLowerCase().includes(keyword)
      || application.id.toLowerCase().includes(keyword)

    return keywordMatched
      && (!appliedFilters.brokerId || application.brokerId === appliedFilters.brokerId)
      && (!appliedFilters.openingStatus || application.openingStatus === appliedFilters.openingStatus)
  }), [userTypeApplications, appliedFilters])

  const pageCount = Math.max(1, Math.ceil(filteredApplications.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filteredApplications.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const selectedApplication = applications.find((application) => application.id === selectedApplicationId)
  const openedCount = userTypeApplications.filter((application) => application.openingStatus === '已开户').length
  const pendingActionCount = userTypeApplications.filter((application) => application.openingStatus === '审核中').length
  const attentionCount = userTypeApplications.filter((application) => application.openingStatus === '已拒绝').length

  const changeUserType = (nextType) => {
    setActiveUserType(nextType)
    setPage(1)
    setSelectedApplicationId('')
    setPageMode('list')
  }

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  const applyFilters = () => {
    setAppliedFilters(filters)
    setPage(1)
  }

  const resetFilters = () => {
    const nextFilters = { keyword: '', brokerId: '', openingStatus: '' }
    setFilters(nextFilters)
    setAppliedFilters(nextFilters)
    setPage(1)
  }

  const handleSaveApplication = (applicationId, patch) => {
    onUpdateApplication?.(applicationId, patch)
  }

  const openApplicationPage = (applicationId, mode) => {
    setSelectedApplicationId(applicationId)
    setPageMode(mode)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const backToList = () => {
    setSelectedApplicationId('')
    setPageMode('list')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (selectedApplication && pageMode === 'detail') {
    return (
      <BrokerageApplicationDetailPage
        application={selectedApplication}
        onBack={backToList}
        onSave={handleSaveApplication}
        accountCurrencyConfigs={accountCurrencyConfigs}
        onOpenUserDetail={onOpenUserDetail}
      />
    )
  }

  if (selectedApplication && pageMode === 'process') {
    return (
      <BrokerageApplicationProcessPage
        application={selectedApplication}
        onBack={backToList}
        onSave={handleSaveApplication}
        accountCurrencyConfigs={accountCurrencyConfigs}
        onOpenUserDetail={onOpenUserDetail}
      />
    )
  }

  return (
    <AdminShell standalone={standalone}>
      {standalone ? (
        <div className="mb-[14px]">
          <button type="button" onClick={onBack} className="rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] py-[8px] text-[13px] font-semibold text-[#4c4c68] hover:bg-[#f6f7fb]">
            返回产品模块
          </button>
        </div>
      ) : null}
      <div className={standalone ? 'mt-[21px]' : ''}>
        <BrokerageUserTypeTabs activeUserType={activeUserType} onChange={changeUserType} />
      </div>

      {activeUserType === 'enterprise' ? (
        <Panel className="mt-[21px] px-[28px] py-[40px]">
          <div className="mx-auto max-w-[520px] text-center">
            <div className="text-[18px] font-semibold text-[#20213a]">企业用户券商开户管理暂未开放</div>
            <div className="mt-[10px] text-[13px] leading-[22px] text-[#66677f]">当前仅展示个人用户数据视图，企业用户页面将在后续版本补充。</div>
          </div>
        </Panel>
      ) : (
        <>
      <div className="mt-[21px] grid w-[936px] grid-cols-3 gap-[21px]">
        <StatCard title="待处理" value={pendingActionCount} desc="审核中" tone="blue" icon={LineChart} />
        <StatCard title="需关注" value={attentionCount} desc="已拒绝" tone="red" icon={PauseCircle} />
        <StatCard title="已开户" value={openedCount} desc="客户可见账户信息" tone="green" icon={CheckCircle2} />
      </div>

      <Panel className="mt-[21px] px-[15px] py-[18px]">
        <div className="flex items-center justify-between">
          <div className="text-[16px] font-semibold text-[#20213a]">筛选条件</div>
          <div className="flex items-center gap-[10px]">
            <span className="rounded-[5px] bg-[#f6f7fb] px-[14px] py-[9px] text-[12px] text-[#66677f]">最后同步：{lastRefreshedAt}</span>
            <ActionButton icon={Clock3} onClick={() => setLastRefreshedAt(formatAdminDateTime())}>刷新</ActionButton>
          </div>
        </div>
        <div className="mt-[15px] grid grid-cols-[minmax(260px,1fr)_170px_210px_156px] gap-[10px]">
          <label className="flex h-[50px] items-center gap-[11px] rounded-[4px] border border-[#cfd1dc] bg-white px-[15px] text-[13px] text-[#9a9cab]">
            <Search className="h-[16px] w-[16px] text-[#20213a]" strokeWidth={1.8} />
            <input value={filters.keyword} onChange={(event) => updateFilter('keyword', event.target.value)} className="h-full flex-1 bg-transparent outline-none" placeholder="客户名称、ID、邮箱、申请编号..." />
          </label>
          <BrokerageFilterSelect label="券商" value={filters.brokerId} onChange={(value) => updateFilter('brokerId', value)} options={brokerageBrokers.map((broker) => ({ value: broker.id, label: broker.shortName }))} width="w-full" />
          <BrokerageFilterSelect label="开户状态" value={filters.openingStatus} onChange={(value) => updateFilter('openingStatus', value)} options={brokerageOpeningStatuses} width="w-full" />
          <div className="flex items-center justify-end gap-[8px]">
            <ActionButton icon={Clock3} onClick={resetFilters}>重置</ActionButton>
            <PrimaryButton icon={Search} onClick={applyFilters}>查询</PrimaryButton>
          </div>
        </div>
      </Panel>

      <Panel className="mt-[21px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full border-collapse text-left text-[13px] text-[#55556e]">
            <thead>
              <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
                {['客户名称', '所选券商', '提交时间', '当前开户状态', '操作'].map((item) => (
                  <th key={item} className="px-[18px]">{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((application) => (
                <tr key={application.id} className="h-[82px] border-b border-[#e7e8ef] bg-white">
                  <td className="px-[18px]">
                    <div className="flex items-center gap-[12px]">
                      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#eee9ff] text-[12px] font-semibold text-[#8b4fff]">{application.customer.initials}</span>
                      <div className="leading-[1.55]">
                        <div className="font-semibold text-[#20213a]">{application.customer.name}</div>
                        <div>ID: {application.customer.id}</div>
                        <div>{application.customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-[18px] font-semibold text-[#20213a]">{application.brokerName}</td>
                  <td className="px-[18px]">{application.submittedAt}</td>
                  <td className="px-[18px]"><StatusBadge tone={brokerageOpeningStatusTones[application.openingStatus]}>{application.openingStatus}</StatusBadge></td>
                  <td className="px-[18px]">
                    <div className="flex gap-[8px]">
                      <ActionButton icon={Eye} onClick={() => openApplicationPage(application.id, 'detail')}>查看详情</ActionButton>
                      {application.openingStatus !== '已开户' ? (
                        <ActionButton icon={Play} onClick={() => openApplicationPage(application.id, 'process')}>
                          {application.openingStatus === '已拒绝' ? '重新审核' : '开始处理'}
                        </ActionButton>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-[18px] py-[36px] text-center text-[13px] text-[#8a8ca0]">暂无符合条件的开户申请</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#e5e6ef] px-[18px] py-[14px] text-[13px] text-[#66677f]">
          <span>共 {filteredApplications.length} 条记录，第 {currentPage} / {pageCount} 页</span>
          <div className="flex gap-[8px]">
            <button type="button" disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="h-[32px] rounded-[4px] border border-[#cfd1dc] px-[12px] font-semibold text-[#4c4c68] disabled:cursor-not-allowed disabled:opacity-50">上一页</button>
            <button type="button" disabled={currentPage >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} className="h-[32px] rounded-[4px] border border-[#8b4fff] px-[12px] font-semibold text-[#8b4fff] disabled:cursor-not-allowed disabled:opacity-50">下一页</button>
          </div>
        </div>
      </Panel>
        </>
      )}

    </AdminShell>
  )
}

function AccountCurrencyFilterSelect({ label, value, onChange, children, width = 'w-[240px]' }) {
  return (
    <label className={`flex h-[50px] ${width} items-center justify-between rounded-[4px] border border-[#cfd1dc] bg-white px-[14px] text-[13px] text-[#4c4c68]`}>
      <span className="whitespace-nowrap">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-full min-w-[130px] bg-transparent text-right font-semibold text-[#20213a] outline-none"
      >
        {children}
      </select>
    </label>
  )
}

function buildAccountCurrencyRows(configs) {
  return accountCurrencyAccountTypes.map((accountType) => {
    const records = configs
      .filter((config) => config.accountType === accountType)
      .sort((left, right) => Number(left.displayOrder || 0) - Number(right.displayOrder || 0))
    const currencyCodes = records.map((record) => record.currencyCode)
    const defaultCurrency = records.find((record) => record.isDefault)?.currencyCode || currencyCodes[0] || '-'
    const latestRecord = records.reduce((latest, record) => {
      if (!latest) return record
      return String(record.updatedAt || '') > String(latest.updatedAt || '') ? record : latest
    }, null)

    return {
      accountType,
      currencyCodes,
      defaultCurrency,
      updatedAt: latestRecord?.updatedAt || '-',
      updatedBy: latestRecord?.updatedBy || '-',
      remark: latestRecord?.remark || '',
      records,
    }
  })
}

function AccountCurrencyTags({ currencies = [] }) {
  const visibleCurrencies = currencies.slice(0, 3)
  const hiddenCount = Math.max(0, currencies.length - visibleCurrencies.length)

  if (!currencies.length) {
    return <span className="text-[#8a8ca0]">未配置</span>
  }

  return (
    <div className="flex flex-wrap gap-[6px]" title={currencies.join(' / ')}>
      {visibleCurrencies.map((currency) => (
        <span key={currency} className="inline-flex h-[26px] items-center rounded-full bg-[#e7f5ff] px-[9px] text-[12px] font-semibold text-[#237be8]">
          {currency}
        </span>
      ))}
      {hiddenCount ? (
        <span className="inline-flex h-[26px] items-center rounded-full bg-[#f0e7ff] px-[9px] text-[12px] font-semibold text-[#8b4fff]">
          +{hiddenCount}
        </span>
      ) : null}
    </div>
  )
}

function AccountCurrencySearchableMultiSelect({ value = [], onChange, options = [] }) {
  const [open, setOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const selectedValues = Array.isArray(value) ? value : []
  const normalizedKeyword = keyword.trim().toLowerCase()
  const filteredOptions = options.filter((currency) => (
    !normalizedKeyword
    || currency.code.toLowerCase().includes(normalizedKeyword)
    || currency.name.toLowerCase().includes(normalizedKeyword)
  ))
  const selectedSummary = selectedValues.length > 3
    ? `${selectedValues.slice(0, 3).join('、')} +${selectedValues.length - 3}`
    : selectedValues.length
      ? selectedValues.join('、')
      : '请选择支持币种'

  const toggleValue = (currencyCode) => {
    const nextValues = selectedValues.includes(currencyCode)
      ? selectedValues.filter((item) => item !== currencyCode)
      : [...selectedValues, currencyCode]

    onChange?.(nextValues)
  }

  return (
    <div className="relative">
      <span className="mb-[-8px] ml-[10px] inline-block bg-white px-[4px] text-[12px] text-[#66677f]">支持币种 *</span>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-[54px] w-full items-center justify-between rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] text-left text-[14px] text-[#24243d] outline-none"
      >
        <span className={selectedValues.length ? 'font-semibold' : 'text-[#9a9cab]'}>
          {selectedSummary}
        </span>
        <span className="flex items-center gap-[8px] text-[12px] font-semibold text-[#8b4fff]">
          已选择 {selectedValues.length} 个
          <ChevronDown className={`h-[16px] w-[16px] text-[#8a8ca0] transition ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-[58px] z-30 rounded-[5px] border border-[#cfd1dc] bg-white p-[8px] shadow-[0_12px_28px_rgba(31,35,66,0.14)]">
          <label className="flex h-[38px] items-center gap-[8px] rounded-[4px] border border-[#dfe1ea] bg-[#fbfbfd] px-[10px] text-[12px] text-[#8a8ca0]">
            <Search className="h-[14px] w-[14px] text-[#8b4fff]" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索币种代码或名称，如 USD / 美元"
              className="h-full flex-1 bg-transparent text-[13px] text-[#24243d] outline-none"
            />
          </label>
          <div className="mt-[8px] max-h-[220px] overflow-y-auto">
            {filteredOptions.map((currency) => {
              const checked = selectedValues.includes(currency.code)

              return (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => toggleValue(currency.code)}
                  className={`flex h-[40px] w-full items-center justify-between rounded-[4px] px-[10px] text-left transition ${
                    checked ? 'bg-[#f0e9ff] text-[#8b4fff]' : 'text-[#4c4c68] hover:bg-[#f6f7fb]'
                  }`}
                >
                  <span>
                    <span className="text-[13px] font-semibold">{currency.code}</span>
                    <span className="ml-[8px] text-[12px] text-[#8a8ca0]">{currency.name}</span>
                  </span>
                  <span className={`flex h-[16px] w-[16px] items-center justify-center rounded-[4px] border text-[11px] ${
                    checked ? 'border-[#8b4fff] bg-[#8b4fff] text-white' : 'border-[#cfd1dc] text-transparent'
                  }`}>
                    ✓
                  </span>
                </button>
              )
            })}
            {filteredOptions.length === 0 ? (
              <div className="px-[10px] py-[18px] text-center text-[12px] text-[#8a8ca0]">没有匹配的已启用币种</div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function AccountCurrencyConfigDrawer({ row, onClose, onSave }) {
  const initialCurrencies = row.currencyCodes.length ? row.currencyCodes : [enabledCurrencyOptions[0]?.code || 'USD']
  const initialForm = {
    accountType: row.accountType,
    currencyCodes: initialCurrencies,
    defaultCurrency: initialCurrencies.includes(row.defaultCurrency) ? row.defaultCurrency : initialCurrencies[0],
    remark: row.remark || '',
  }
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [defaultCurrencyWarning, setDefaultCurrencyWarning] = useState('')

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (error) setError('')
    if (field === 'defaultCurrency') setDefaultCurrencyWarning('')
  }

  const updateCurrencies = (nextCurrencies) => {
    const uniqueCurrencies = [...new Set(nextCurrencies)]
    setForm((current) => {
      const defaultRemoved = Boolean(current.defaultCurrency) && !uniqueCurrencies.includes(current.defaultCurrency)

      if (defaultRemoved) {
        setDefaultCurrencyWarning('默认币种已被移除，请重新选择默认币种')
      }

      return {
        ...current,
        currencyCodes: uniqueCurrencies,
        defaultCurrency: defaultRemoved ? '' : current.defaultCurrency,
      }
    })
    if (error) setError('')
  }

  const removeCurrency = (currency) => {
    updateCurrencies(form.currencyCodes.filter((item) => item !== currency))
  }

  const submit = () => {
    if (!form.currencyCodes.length) {
      setError('请至少选择一个支持币种')
      return
    }

    if (!form.defaultCurrency || !form.currencyCodes.includes(form.defaultCurrency)) {
      setError('默认币种必须包含在支持币种内')
      return
    }

    onSave?.({
      accountType: form.accountType,
      currencyCodes: form.currencyCodes,
      defaultCurrency: form.defaultCurrency,
      remark: form.remark.trim(),
    })
    onClose?.()
  }

  const removedCurrencies = row.currencyCodes.filter((currency) => !form.currencyCodes.includes(currency))

  return (
    <DrawerShell
      title={`配置账户币种 - ${row.accountType}`}
      eyebrow="按账户类型维护支持币种"
      onClose={onClose}
      footer={(
        <div className="grid grid-cols-2 gap-[8px]">
          <button type="button" onClick={onClose} className="h-[38px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">取消</button>
          <button type="button" onClick={submit} className="h-[38px] rounded-[5px] bg-[#8b4fff] text-[13px] font-semibold text-white hover:bg-[#7f42f2]">保存配置</button>
        </div>
      )}
    >
      <div className="space-y-[14px]">
        <div className="rounded-[5px] bg-[#f6f7fb] px-[14px] py-[13px] text-[13px] leading-[22px] text-[#66677f]">
          页面仅维护账户类型支持哪些币种。比如美国账户后续要支持 HKD，只需要在这里勾选 HKD 并保存，系统会新增“美国账户 + HKD”配置。
        </div>
        <BrokerageReadOnlyField label="账户类型" value={form.accountType} />
        <AccountCurrencySearchableMultiSelect value={form.currencyCodes} onChange={updateCurrencies} options={enabledCurrencyOptions} />
        {form.currencyCodes.length ? (
          <DrawerSelectField label="默认币种 *" value={form.defaultCurrency} onChange={(value) => updateField('defaultCurrency', value)} options={form.currencyCodes} placeholder="请选择默认币种" />
        ) : (
          <BrokerageReadOnlyField label="默认币种 *" value="请先选择支持币种" />
        )}
        {defaultCurrencyWarning ? <div className="text-[12px] font-semibold text-[#f39800]">{defaultCurrencyWarning}</div> : null}
        <div className="rounded-[5px] border border-[#e2e4ec] bg-white p-[12px]">
          <div className="text-[12px] font-semibold text-[#66677f]">已选币种</div>
          <div className="mt-[10px] overflow-x-auto">
            <table className="w-full min-w-[330px] border-collapse text-left text-[12px] text-[#55556e]">
              <thead>
                <tr className="h-[34px] bg-[#f6f7fb] font-semibold text-[#22223d]">
                  {['币种代码', '币种名称', '是否默认币种', '操作'].map((item) => (
                    <th key={item} className="whitespace-nowrap px-[8px]">{item}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {form.currencyCodes.map((currency) => (
                  <tr key={currency} className="h-[44px] border-b border-[#e7e8ef] last:border-b-0">
                    <td className="px-[8px] font-mono font-semibold text-[#237be8]">{currency}</td>
                    <td className="px-[8px]">{getCurrencyName(currency)}</td>
                    <td className="px-[8px]">{form.defaultCurrency === currency ? <StatusBadge tone="green">是</StatusBadge> : '-'}</td>
                    <td className="px-[8px]">
                      <div className="flex flex-wrap gap-[5px]">
                        <button type="button" onClick={() => removeCurrency(currency)} className="h-[26px] rounded-[4px] border border-[#f04f5f] px-[7px] text-[12px] font-semibold text-[#f04f5f] hover:bg-[#ffe8eb]">移除</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {form.currencyCodes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-[8px] py-[20px] text-center text-[#8a8ca0]">请先在上方选择支持币种</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
        <DrawerTextareaField label="备注" value={form.remark} onChange={(value) => updateField('remark', value)} placeholder="选填，说明该账户类型支持该币种的配置背景" />
        {removedCurrencies.length ? (
          <div className="rounded-[5px] bg-[#fff1d6] px-[12px] py-[10px] text-[12px] font-semibold leading-[20px] text-[#9a6500]">
            风险提示：将移除 {removedCurrencies.join(' / ')}。若该账户下已有余额或历史交易记录，历史数据仍正常展示，但后续不允许新选择这些币种。
          </div>
        ) : null}
        {error ? <div className="rounded-[5px] bg-[#ffe8eb] px-[12px] py-[10px] text-[12px] font-semibold text-[#f04f5f]">{error}</div> : null}
      </div>
    </DrawerShell>
  )
}

export function AccountCurrencyConfigPage({
  configs = initialAccountCurrencyConfigs,
  onChangeConfigs,
}) {
  const [localConfigs, setLocalConfigs] = useState(initialAccountCurrencyConfigs)
  const sourceConfigs = onChangeConfigs ? configs : localConfigs
  const commitConfigs = (nextConfigs) => {
    if (onChangeConfigs) {
      onChangeConfigs(nextConfigs)
      return
    }
    setLocalConfigs(nextConfigs)
  }
  const [filters, setFilters] = useState({
    accountType: '',
    currencyCode: '',
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [selectedRow, setSelectedRow] = useState(null)

  const groupedRows = useMemo(() => buildAccountCurrencyRows(sourceConfigs), [sourceConfigs])
  const filteredRows = useMemo(() => groupedRows.filter((row) => (
    (!appliedFilters.accountType || row.accountType === appliedFilters.accountType)
    && (!appliedFilters.currencyCode || row.currencyCodes.includes(appliedFilters.currencyCode))
  )), [groupedRows, appliedFilters])

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  const resetFilters = () => {
    const nextFilters = { accountType: '', currencyCode: '' }
    setFilters(nextFilters)
    setAppliedFilters(nextFilters)
  }

  const saveAccountCurrencyGroup = (payload) => {
    const stamp = formatAdminDateTime()
    const existingByCurrency = new Map(sourceConfigs
      .filter((item) => item.accountType === payload.accountType)
      .map((item) => [item.currencyCode, item]))
    const untouchedConfigs = sourceConfigs.filter((item) => item.accountType !== payload.accountType)
    const nextAccountConfigs = payload.currencyCodes.map((currencyCode, index) => {
      const existingRecord = existingByCurrency.get(currencyCode)

      return {
        id: existingRecord?.id || `ACC-CUR-${payload.accountType}-${currencyCode}-${Date.now()}-${index}`,
        accountType: payload.accountType,
        currencyCode,
        currencyName: getCurrencyName(currencyCode),
        isDefault: currencyCode === payload.defaultCurrency,
        displayOrder: index + 1,
        status: '启用',
        updatedAt: stamp,
        updatedBy: '运营管理员',
        remark: payload.remark,
      }
    })

    commitConfigs([...untouchedConfigs, ...nextAccountConfigs])
  }

  return (
    <AdminShell>
      <Panel className="px-[18px] py-[22px]">
        <div className="flex items-center justify-between">
          <PageTitle
            title="账户币种配置"
            subtitle="按账户类型维护支持币种，客户端与管理端账户币种下拉均读取该配置。"
          />
          <span className="rounded-[5px] bg-[#f6f7fb] px-[14px] py-[9px] text-[12px] text-[#66677f]">配置来源：币种管理已启用币种</span>
        </div>
      </Panel>

      <Panel className="mt-[21px] px-[15px] py-[18px]">
        <div className="flex items-center justify-between">
          <div className="text-[16px] font-semibold text-[#20213a]">筛选条件</div>
          <span className="text-[12px] text-[#8a8ca0]">币种筛选会匹配支持该币种的账户类型</span>
        </div>
        <div className="mt-[15px] flex flex-wrap items-center gap-[10px]">
          <AccountCurrencyFilterSelect label="账户类型" value={filters.accountType} onChange={(value) => updateFilter('accountType', value)} width="w-[288px]">
            <option value="">全部</option>
            {accountCurrencyAccountTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </AccountCurrencyFilterSelect>
          <AccountCurrencyFilterSelect label="币种" value={filters.currencyCode} onChange={(value) => updateFilter('currencyCode', value)} width="w-[240px]">
            <option value="">全部</option>
            {enabledCurrencyOptions.map((currency) => <option key={currency.code} value={currency.code}>{currency.code} - {currency.name}</option>)}
          </AccountCurrencyFilterSelect>
          <div className="ml-auto flex items-center gap-[8px]">
            <ActionButton icon={Clock3} onClick={resetFilters}>重置</ActionButton>
            <PrimaryButton icon={Search} onClick={() => setAppliedFilters(filters)}>查询</PrimaryButton>
          </div>
        </div>
      </Panel>

      <Panel className="mt-[21px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full border-collapse text-left text-[13px] text-[#55556e]">
            <thead>
              <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
                {['账户类型', '支持币种', '默认币种', '更新时间', '更新人', '操作'].map((item) => (
                  <th key={item} className="whitespace-nowrap px-[18px]">{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.accountType} className="h-[72px] border-b border-[#e7e8ef] bg-white">
                  <td className="whitespace-nowrap px-[18px] font-semibold text-[#20213a]">{row.accountType}</td>
                  <td className="px-[18px]"><AccountCurrencyTags currencies={row.currencyCodes} /></td>
                  <td className="whitespace-nowrap px-[18px] font-mono text-[14px] font-semibold text-[#237be8]">{row.defaultCurrency}</td>
                  <td className="whitespace-nowrap px-[18px]">{row.updatedAt}</td>
                  <td className="whitespace-nowrap px-[18px]">{row.updatedBy}</td>
                  <td className="px-[18px]"><ActionButton icon={Pencil} onClick={() => setSelectedRow(row)}>配置币种</ActionButton></td>
                </tr>
              ))}
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-[18px] py-[36px] text-center text-[13px] text-[#8a8ca0]">暂无符合条件的账户币种配置</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#e5e6ef] px-[18px] py-[14px] text-[13px] text-[#66677f]">
          共 {filteredRows.length} 个账户类型。禁用配置只影响后续可选币种，不影响历史余额与历史账户信息。
        </div>
      </Panel>

      {selectedRow ? (
        <AccountCurrencyConfigDrawer
          row={selectedRow}
          onClose={() => setSelectedRow(null)}
          onSave={saveAccountCurrencyGroup}
        />
      ) : null}
    </AdminShell>
  )
}

function buildBrokerageManagementForm(broker) {
  return {
    id: broker?.id || '',
    name: broker?.name || '',
    englishName: broker?.englishName || '',
    code: broker?.code || '',
    logo: broker?.logo || '',
    description: broker?.description || '',
    websiteUrl: broker?.websiteUrl || '',
    marketCoverage: broker?.marketCoverage?.length ? broker.marketCoverage : ['美股', '港股'],
    displayTags: broker?.displayTags || [],
    displayOrder: broker?.displayOrder || 1,
    status: broker?.status || '启用',
    adminFee: broker?.adminFee || '100',
    feeCurrency: broker?.feeCurrency || 'USD',
    accountTypes: broker?.accountTypes?.length ? broker.accountTypes : ['现金账户'],
    settlementCurrencies: broker?.settlementCurrencies?.length ? broker.settlementCurrencies : ['USD', 'HKD', 'CNY'],
    estimatedTime: broker?.estimatedTime || '3-7 个工作日',
    materials: broker?.materials?.length ? broker.materials : [],
  }
}

function BrokerageLogoUploadField({ value, onChange }) {
  const displayValue = value || '未上传'

  return (
    <div className="rounded-[5px] border border-[#cfd1dc] bg-white px-[12px] py-[12px]">
      <div className="mb-[10px] text-[12px] text-[#66677f]">券商 Logo</div>
      <div className="flex flex-wrap items-center gap-[12px]">
        <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[5px] bg-[#f0e9ff] text-[14px] font-bold text-[#8b4fff]">
          {value ? String(value).slice(0, 2).toUpperCase() : 'LOGO'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold text-[#20213a]">{displayValue}</div>
          <div className="mt-[3px] text-[12px] text-[#8a8ca0]">支持 PNG / JPG，当前为前端原型上传占位。</div>
        </div>
        <label className="flex h-[34px] cursor-pointer items-center gap-[7px] rounded-[5px] border border-[#8b4fff] px-[10px] text-[12px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">
          <UploadCloud className="h-[14px] w-[14px]" />
          上传图片
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onChange?.(file.name)
              event.target.value = ''
            }}
          />
        </label>
      </div>
    </div>
  )
}

function BrokerageManagementModal({ broker, brokers = [], onClose, onSave }) {
  const [form, setForm] = useState(() => buildBrokerageManagementForm(broker))
  const [error, setError] = useState('')
  const isEdit = Boolean(broker?.id)

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (error) setError('')
  }

  const updateMaterial = (materialId, patch) => {
    setForm((current) => ({
      ...current,
      materials: current.materials.map((material) => (
        material.id === materialId ? { ...material, ...patch } : material
      )),
    }))
  }

  const toggleMaterial = (template) => {
    setForm((current) => {
      const exists = current.materials.some((material) => material.id === template.id)
      return {
        ...current,
        materials: exists
          ? current.materials.filter((material) => material.id !== template.id)
          : [
              ...current.materials,
              {
                id: template.id,
                name: template.name,
                handlingMethod: template.handlingMethod || '用户上传',
                required: true,
                enabled: true,
                formats: template.formats,
                sizeLimit: template.sizeLimit,
                allowMultiple: Boolean(template.allowMultiple),
                uploadDescription: template.uploadDescription || '',
                signingPlatform: template.signingPlatform || 'Documenso',
                signingTemplateName: template.signingTemplateName || '',
                signingDescription: template.signingDescription || '',
                showAfterSigned: template.showAfterSigned !== false,
                description: template.description,
              },
            ],
      }
    })
    if (error) setError('')
  }

  const submit = () => {
    const normalizedCode = form.code.trim().toUpperCase()
    const duplicate = brokers.some((item) => item.code.toUpperCase() === normalizedCode && item.id !== form.id)

    if (!form.name.trim() || !form.englishName.trim() || !normalizedCode) {
      setError('请填写券商名称、英文名称和券商代码')
      return
    }

    if (duplicate) {
      setError('券商代码不允许重复')
      return
    }

    if (!String(form.displayOrder).trim() || !form.adminFee.trim() || !form.feeCurrency || !form.estimatedTime.trim() || !form.marketCoverage.length) {
      setError('请完整填写开户配置')
      return
    }

    if (!form.materials.length) {
      setError('请至少配置一个所需上传资料')
      return
    }

    onSave?.({
      ...form,
      id: form.id || `BRK-CFG-${normalizedCode}-${Date.now()}`,
      code: normalizedCode,
      logo: form.logo.trim() || normalizedCode.slice(0, 2),
      websiteUrl: form.websiteUrl.trim(),
      marketCoverage: form.marketCoverage,
      displayTags: form.displayTags,
      accountTypes: ['现金账户'],
      settlementCurrencies: ['USD', 'HKD', 'CNY'],
      displayOrder: Number(form.displayOrder) || 1,
      adminFee: form.adminFee.trim(),
      materials: form.materials.map((material) => ({
        id: material.id,
        name: material.name?.trim() || '-',
        handlingMethod: material.handlingMethod || '用户上传',
        required: Boolean(material.required),
        enabled: material.enabled !== false,
        description: material.description?.trim() || '',
        ...(material.handlingMethod === '第三方签署'
          ? {
              signingPlatform: material.signingPlatform || 'Documenso',
              signingTemplateName: material.signingTemplateName?.trim() || '',
              signingDescription: material.signingDescription?.trim() || '',
              showAfterSigned: material.showAfterSigned !== false,
            }
          : {
              formats: material.formats?.trim() || 'PDF/JPG/PNG',
              sizeLimit: material.sizeLimit?.trim() || '10MB',
              allowMultiple: Boolean(material.allowMultiple),
              uploadDescription: material.uploadDescription?.trim() || '',
            }),
      })),
    })
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#252236]/55 px-[24px] py-[28px]">
      <section className="flex max-h-[88vh] w-full max-w-[980px] flex-col overflow-hidden rounded-[8px] bg-white shadow-[0_18px_48px_rgba(28,29,42,0.28)]">
        <div className="flex h-[62px] shrink-0 items-center justify-between border-b border-[#e5e6ef] px-[22px]">
          <div>
            <h2 className="text-[16px] font-semibold text-[#20213a]">{isEdit ? '编辑券商配置' : '新增券商配置'}</h2>
            <div className="mt-[3px] text-[11px] font-semibold uppercase text-[#8a8ca0]">平台支持券商基础配置</div>
          </div>
          <button type="button" onClick={onClose} className="rounded-[4px] p-[7px] text-[#66677f] hover:bg-[#f6f7fb]">
            <X className="h-[16px] w-[16px]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-white px-[22px] py-[18px]">
      <div className="space-y-[16px]">
        <BrokerageDrawerSection title="基础信息">
          <div className="grid grid-cols-2 gap-[13px]">
            <DrawerInputField label="券商名称 *" value={form.name} onChange={(value) => updateField('name', value)} placeholder="IBKR 盈透证券" />
            <DrawerInputField label="券商英文名称 *" value={form.englishName} onChange={(value) => updateField('englishName', value)} placeholder="Interactive Brokers" />
            <DrawerInputField label="券商代码 *" value={form.code} onChange={(value) => updateField('code', value.toUpperCase())} placeholder="IBKR / WEBULL" />
            <BrokerageLogoUploadField value={form.logo} onChange={(value) => updateField('logo', value)} />
            <DrawerInputField label="官网链接" value={form.websiteUrl} onChange={(value) => updateField('websiteUrl', value)} placeholder="https://www.example.com" />
            <DrawerMultiSelectField label="市场覆盖 *" value={form.marketCoverage} onChange={(value) => updateField('marketCoverage', value)} options={brokerageMarketCoverageOptions} />
            <DrawerMultiSelectField label="展示标签" value={form.displayTags} onChange={(value) => updateField('displayTags', value)} options={brokerageDisplayTagOptions} allowEmpty />
            <div className="col-span-2">
            <DrawerTextareaField label="券商简介" value={form.description} onChange={(value) => updateField('description', value)} placeholder="客户端券商卡片简介" />
            </div>
            <DrawerInputField label="展示顺序 *" type="number" value={form.displayOrder} onChange={(value) => updateField('displayOrder', value)} />
            <DrawerSelectField label="状态 *" value={form.status} onChange={(value) => updateField('status', value)} options={brokerageConfigStatusOptions} />
          </div>
        </BrokerageDrawerSection>

        <BrokerageDrawerSection title="开户配置">
          <div className="grid grid-cols-4 gap-[13px]">
            <DrawerInputField label="开户行政费 *" value={form.adminFee} onChange={(value) => updateField('adminFee', value)} placeholder="100" />
            <DrawerSelectField label="费用币种 *" value={form.feeCurrency} onChange={(value) => updateField('feeCurrency', value)} options={enabledCurrencyOptions.map((currency) => currency.code)} />
            <BrokerageReadOnlyField label="支持账户类型" value="现金账户" />
            <BrokerageReadOnlyField label="结算币种" value="USD / HKD / CNY" />
            <DrawerInputField label="预计处理时间 *" value={form.estimatedTime} onChange={(value) => updateField('estimatedTime', value)} placeholder="3-7 个工作日" />
          </div>
        </BrokerageDrawerSection>

        <BrokerageDrawerSection title="资料配置">
          <div className="space-y-[10px]">
            {brokerageMaterialTemplates.map((template) => {
              const selected = form.materials.find((material) => material.id === template.id)
              const handlingMethod = selected?.handlingMethod || template.handlingMethod || '用户上传'
              const displayMaterialName = selected?.name || template.name

              return (
                <div key={template.id} className={selected ? 'rounded-[5px] border border-[#c7b5ff] bg-[#fbf8ff] p-[12px]' : 'rounded-[5px] border border-[#e2e4ec] bg-white p-[12px]'}>
                  <label className="flex cursor-pointer items-center justify-between gap-[12px]">
                    <span>
                      <span className="text-[13px] font-semibold text-[#20213a]">{displayMaterialName}</span>
                      {selected ? (
                        <span className="ml-[8px] rounded-full bg-white px-[8px] py-[2px] text-[11px] font-semibold text-[#8b4fff]">{handlingMethod}</span>
                      ) : null}
                    </span>
                    <input type="checkbox" checked={Boolean(selected)} onChange={() => toggleMaterial(template)} className="h-[16px] w-[16px] accent-[#8b4fff]" />
                  </label>
                  {selected ? (
                    <div className="mt-[12px] grid grid-cols-2 gap-[8px]">
                      <DrawerInputField label="资料名称" value={selected.name} onChange={(value) => updateMaterial(template.id, { name: value })} />
                      <DrawerSelectField label="处理方式" value={handlingMethod} onChange={(value) => updateMaterial(template.id, { handlingMethod: value })} options={['用户上传', '第三方签署']} />
                      <DrawerSelectField label="是否必填" value={selected.required ? '是' : '否'} onChange={(value) => updateMaterial(template.id, { required: value === '是' })} options={['是', '否']} />
                      <DrawerSelectField label="状态 / 是否启用" value={selected.enabled === false ? '禁用' : '启用'} onChange={(value) => updateMaterial(template.id, { enabled: value === '启用' })} options={['启用', '禁用']} />
                      <div className="col-span-2">
                        <DrawerTextareaField label="说明文案" value={selected.description} onChange={(value) => updateMaterial(template.id, { description: value })} />
                      </div>
                      {handlingMethod === '用户上传' ? (
                        <>
                          <DrawerInputField label="支持格式" value={selected.formats || 'PDF/JPG/PNG'} onChange={(value) => updateMaterial(template.id, { formats: value })} />
                          <DrawerInputField label="大小限制" value={selected.sizeLimit || '10MB'} onChange={(value) => updateMaterial(template.id, { sizeLimit: value })} />
                          <DrawerSelectField label="是否允许多文件" value={selected.allowMultiple ? '是' : '否'} onChange={(value) => updateMaterial(template.id, { allowMultiple: value === '是' })} options={['否', '是']} />
                          <div className="col-span-2">
                            <DrawerTextareaField label="上传说明文案" value={selected.uploadDescription || ''} onChange={(value) => updateMaterial(template.id, { uploadDescription: value })} />
                          </div>
                        </>
                      ) : (
                        <>
                          <BrokerageReadOnlyField label="签署平台" value={selected.signingPlatform || 'Documenso'} />
                          <DrawerInputField label="签署模板名称 / 模板ID" value={selected.signingTemplateName || ''} onChange={(value) => updateMaterial(template.id, { signingTemplateName: value })} placeholder={`${selected.name}模板`} />
                          <div className="col-span-2">
                            <DrawerTextareaField label="签署说明文案" value={selected.signingDescription || ''} onChange={(value) => updateMaterial(template.id, { signingDescription: value })} />
                          </div>
                          <DrawerSelectField label="签署完成后作为申请资料展示" value={selected.showAfterSigned === false ? '否' : '是'} onChange={(value) => updateMaterial(template.id, { showAfterSigned: value === '是' })} options={['是', '否']} />
                        </>
                      )}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </BrokerageDrawerSection>
        {error ? <div className="rounded-[5px] bg-[#ffe8eb] px-[12px] py-[10px] text-[12px] font-semibold text-[#f04f5f]">{error}</div> : null}
      </div>
        </div>
        <div className="grid grid-cols-2 gap-[10px] border-t border-[#e5e6ef] bg-white p-[14px]">
          <button type="button" onClick={onClose} className="h-[40px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">取消</button>
          <button type="button" onClick={submit} className="h-[40px] rounded-[5px] bg-[#8b4fff] text-[13px] font-semibold text-white hover:bg-[#7f42f2]">保存配置</button>
        </div>
      </section>
    </div>
  )
}

export function BrokerageManagementPage({
  brokers = initialBrokerageConfigs,
  onChangeBrokers,
}) {
  const [localBrokers, setLocalBrokers] = useState(initialBrokerageConfigs)
  const sourceBrokers = onChangeBrokers ? brokers : localBrokers
  const commitBrokers = (nextBrokers) => {
    if (onChangeBrokers) {
      onChangeBrokers(nextBrokers)
      return
    }
    setLocalBrokers(nextBrokers)
  }
  const [filters, setFilters] = useState({ keyword: '', status: '' })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [editingBroker, setEditingBroker] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const sortedBrokers = useMemo(() => [...sourceBrokers].sort((left, right) => Number(left.displayOrder || 0) - Number(right.displayOrder || 0)), [sourceBrokers])
  const filteredBrokers = useMemo(() => sortedBrokers.filter((broker) => {
    const keyword = appliedFilters.keyword.trim().toLowerCase()
    const keywordMatched = !keyword
      || broker.name.toLowerCase().includes(keyword)
      || broker.englishName.toLowerCase().includes(keyword)
      || broker.code.toLowerCase().includes(keyword)

    return keywordMatched && (!appliedFilters.status || broker.status === appliedFilters.status)
  }), [sortedBrokers, appliedFilters])

  const openCreate = () => {
    setEditingBroker(null)
    setDrawerOpen(true)
  }

  const openEdit = (broker) => {
    setEditingBroker(broker)
    setDrawerOpen(true)
  }

  const saveBroker = (payload) => {
    const stamp = formatAdminDateTime()
    const nextBroker = {
      ...payload,
      updatedAt: stamp,
      updatedBy: '运营管理员',
    }
    const exists = sourceBrokers.some((broker) => broker.id === nextBroker.id)
    const nextBrokers = exists
      ? sourceBrokers.map((broker) => (broker.id === nextBroker.id ? nextBroker : broker))
      : [...sourceBrokers, nextBroker]

    commitBrokers(nextBrokers)
  }

  const toggleStatus = (broker) => {
    saveBroker({
      ...broker,
      status: broker.status === '启用' ? '禁用' : '启用',
    })
  }

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  const resetFilters = () => {
    const nextFilters = { keyword: '', status: '' }
    setFilters(nextFilters)
    setAppliedFilters(nextFilters)
  }

  return (
    <AdminShell>
      <Panel className="px-[18px] py-[22px]">
        <div className="flex items-center justify-between gap-[20px]">
          <PageTitle
            title="券商管理"
            subtitle="维护客户端可展示的券商、开户费用、预计处理时间、所需资料和启用状态。"
          />
          <PrimaryButton icon={Plus} onClick={openCreate}>新增配置</PrimaryButton>
        </div>
      </Panel>

      <Panel className="mt-[21px] px-[15px] py-[18px]">
        <div className="flex items-center justify-between">
          <div className="text-[16px] font-semibold text-[#20213a]">筛选条件</div>
          <span className="text-[12px] text-[#8a8ca0]">禁用券商不再展示在客户端申请入口</span>
        </div>
        <div className="mt-[15px] grid grid-cols-[minmax(260px,1fr)_180px_156px] gap-[10px]">
          <label className="flex h-[50px] items-center gap-[11px] rounded-[4px] border border-[#cfd1dc] bg-white px-[15px] text-[13px] text-[#9a9cab]">
            <Search className="h-[16px] w-[16px] text-[#20213a]" strokeWidth={1.8} />
            <input value={filters.keyword} onChange={(event) => updateFilter('keyword', event.target.value)} className="h-full flex-1 bg-transparent outline-none" placeholder="券商名称、英文名称、券商代码" />
          </label>
          <AccountCurrencyFilterSelect label="状态" value={filters.status} onChange={(value) => updateFilter('status', value)} width="w-full">
            <option value="">全部</option>
            {brokerageConfigStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
          </AccountCurrencyFilterSelect>
          <div className="flex items-center justify-end gap-[8px]">
            <ActionButton icon={Clock3} onClick={resetFilters}>重置</ActionButton>
            <PrimaryButton icon={Search} onClick={() => setAppliedFilters(filters)}>查询</PrimaryButton>
          </div>
        </div>
      </Panel>

      <Panel className="mt-[21px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1680px] w-full border-collapse text-left text-[13px] text-[#55556e]">
            <thead>
              <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
                {['券商名称', '券商英文名称', '券商代码', '市场覆盖', '展示标签', '官网链接', '开户行政费', '费用币种', '支持账户类型', '结算币种', '所需资料数量', '预计处理时间', '状态', '展示顺序', '更新时间', '更新人', '操作'].map((item) => (
                  <th key={item} className="whitespace-nowrap px-[14px]">{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBrokers.map((broker) => (
                <tr key={broker.id} className="h-[74px] border-b border-[#e7e8ef] bg-white">
                  <td className="whitespace-nowrap px-[14px] font-semibold text-[#20213a]">{broker.name}</td>
                  <td className="whitespace-nowrap px-[14px]">{broker.englishName}</td>
                  <td className="whitespace-nowrap px-[14px] font-mono font-semibold text-[#237be8]">{broker.code}</td>
                  <td className="whitespace-nowrap px-[14px]">{broker.marketCoverage?.join(' / ') || '-'}</td>
                  <td className="px-[14px]">
                    <div className="flex flex-wrap gap-[5px]">
                      {(broker.displayTags || []).length ? broker.displayTags.map((tag) => (
                        <span key={tag} className="rounded-full bg-[#f0e9ff] px-[8px] py-[3px] text-[11px] font-semibold text-[#8b4fff]">{tag}</span>
                      )) : '-'}
                    </div>
                  </td>
                  <td className="max-w-[190px] truncate px-[14px]" title={broker.websiteUrl || ''}>{broker.websiteUrl || '-'}</td>
                  <td className="whitespace-nowrap px-[14px] font-semibold text-[#20213a]">{broker.adminFee}</td>
                  <td className="whitespace-nowrap px-[14px]">{broker.feeCurrency}</td>
                  <td className="whitespace-nowrap px-[14px]">{(broker.accountTypes || ['现金账户']).join(' / ')}</td>
                  <td className="whitespace-nowrap px-[14px]">{(broker.settlementCurrencies || ['USD', 'HKD', 'CNY']).join(' / ')}</td>
                  <td className="whitespace-nowrap px-[14px]">{broker.materials?.length || 0}</td>
                  <td className="whitespace-nowrap px-[14px]">{broker.estimatedTime}</td>
                  <td className="whitespace-nowrap px-[14px]"><StatusBadge tone={broker.status === '启用' ? 'green' : 'gray'}>{broker.status}</StatusBadge></td>
                  <td className="whitespace-nowrap px-[14px]">{broker.displayOrder}</td>
                  <td className="whitespace-nowrap px-[14px]">{broker.updatedAt}</td>
                  <td className="whitespace-nowrap px-[14px]">{broker.updatedBy}</td>
                  <td className="px-[14px]">
                    <div className="flex flex-wrap gap-[8px]">
                      <ActionButton icon={Pencil} onClick={() => openEdit(broker)}>编辑</ActionButton>
                      <ActionButton icon={broker.status === '启用' ? XCircle : CheckCircle2} onClick={() => toggleStatus(broker)}>{broker.status === '启用' ? '禁用' : '启用'}</ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBrokers.length === 0 ? (
                <tr>
                  <td colSpan={17} className="px-[18px] py-[36px] text-center text-[13px] text-[#8a8ca0]">暂无符合条件的券商配置</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#e5e6ef] px-[18px] py-[14px] text-[13px] text-[#66677f]">
          共 {filteredBrokers.length} 个券商配置。禁用券商不影响历史申请记录和已开户账户展示。
        </div>
      </Panel>

      {drawerOpen ? (
        <BrokerageManagementModal
          broker={editingBroker}
          brokers={sourceBrokers}
          onClose={() => {
            setDrawerOpen(false)
            setEditingBroker(null)
          }}
          onSave={saveBroker}
        />
      ) : null}
    </AdminShell>
  )
}

function ManualFiatDrawer({ type, accountType, onAccountTypeChange, onClose }) {
  const isDeposit = type === 'deposit'
  const title = isDeposit ? '手动入金' : '手动出金'
  const toneClass = isDeposit ? 'bg-[#d8f0ff] text-[#1295d8]' : 'bg-[#fff1d6] text-[#f39800]'
  const confirmClass = isDeposit ? 'bg-[#46c800] hover:bg-[#3bb000]' : 'bg-[#ff4c57] hover:bg-[#e53d48]'
  const currencyOptions = fiatAccountCurrencyOptions[accountType] || fiatAccountCurrencyOptions.香港账户
  const [selectedCurrency, setSelectedCurrency] = useState(currencyOptions[0])
  const selectedCurrencyCode = String(selectedCurrency || '').split(/\s+/)[0] || 'USD'
  const message = isDeposit
    ? '手动入金将直接增加客户账户余额，请谨慎操作并确保信息准确。'
    : '手动出金将直接扣减客户账户余额，请谨慎操作并确保客户有足够余额。'
  const changeAccountType = (nextAccountType) => {
    onAccountTypeChange?.(nextAccountType)
    setSelectedCurrency((fiatAccountCurrencyOptions[nextAccountType] || fiatAccountCurrencyOptions.香港账户)[0])
  }

  return (
    <DrawerShell
      title={title}
      onClose={onClose}
      footer={(
        <div className="grid grid-cols-2 gap-[8px]">
          <button type="button" onClick={onClose} className="h-[38px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">取消</button>
          <button type="button" className={`h-[38px] rounded-[5px] text-[13px] font-semibold text-white ${confirmClass}`}>{isDeposit ? '确认入金' : '确认出金'}</button>
        </div>
      )}
    >
      <div className="space-y-[14px]">
        <div className={`rounded-[5px] px-[14px] py-[13px] text-[13px] font-semibold leading-[22px] ${toneClass}`}>
          {message}
        </div>
        <DrawerSelectField label="选择客户 *" value="" options={customers.map((customer) => `ID: ${customer.id} / ${customer.email}`)} placeholder="选择客户 *" />
        <DrawerSelectField label="选择账户 *" value={accountType} onChange={changeAccountType} options={manualAccountOptions} />
        <DrawerSelectField label="币种 *" value={selectedCurrency} onChange={setSelectedCurrency} options={currencyOptions} />
        <DrawerSelectField label="打款渠道" value="电汇" options={['电汇', 'FPS', 'ACH']} />
        {!isDeposit ? <DrawerSelectField label="银行账号 *" value="" options={['GLDB · Green Link Digital Bank · 0950', 'WO · 测试银行 · 232232', 'JW · Fidere Partner Bank · 026009593']} placeholder="银行账号 *" /> : null}
        <DrawerInputField label={isDeposit ? '入金金额 *' : '出金金额 *'} prefix={selectedCurrencyCode} placeholder="请输入正确的金额" />
        <DrawerTextareaField label="备注说明 *" placeholder="必填项，用于审计追踪" />
        <button type="button" className="flex h-[40px] w-full items-center justify-center gap-[8px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">
          <FileText className="h-[15px] w-[15px]" />
          上传凭证（可选）
        </button>
      </div>
    </DrawerShell>
  )
}

function FiatOverviewPanel({ onOpenManual, onChangeTab, hideQuestionMarks = false }) {
  const quickActions = [
    { label: '手动入金', tone: 'bg-[#46c800] hover:bg-[#3bb000]', marked: true, action: () => onOpenManual('deposit') },
    { label: '手动出金', tone: 'bg-[#ff4c57] hover:bg-[#e53d48]', marked: true, action: () => onOpenManual('withdraw') },
    { label: '入账认领', tone: 'bg-[#8b4fff] hover:bg-[#7f42f2]', action: () => onChangeTab('入账认领') },
    { label: '出金审批', tone: 'bg-[#f4a600] hover:bg-[#db9400]', action: () => onChangeTab('出金审批') },
    { label: '流水查询', tone: 'border border-[#24a8f3] bg-white text-[#24a8f3] hover:bg-[#eaf7ff]', action: () => onChangeTab('流水查询') },
  ]

  return (
    <div className="space-y-[21px]">
      <Panel className="px-[18px] py-[20px]">
        <div className="text-[16px] font-semibold text-[#20213a]">快捷操作</div>
        <div className="mt-[18px] flex flex-wrap gap-[12px]">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.action}
              className={`inline-flex h-[38px] items-center gap-[8px] rounded-[5px] px-[16px] text-[13px] font-semibold text-white shadow-sm ${action.tone}`}
            >
              <Plus className="h-[14px] w-[14px]" />
              {action.marked && !hideQuestionMarks ? <QuestionMark inverse /> : null}
              {action.label}
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-5 gap-[18px]">
        <StatCard title="AUM" value="1069225.64" desc="较昨日" tone="green" icon={CircleDot} />
        <StatCard title="今日净流入" value="0" desc="较昨日" tone="green" icon={LineChart} />
        <StatCard title="待认领" value="18" desc="较昨日" tone="amber" icon={Clock3} />
        <StatCard title="待审批" value="10" desc="较昨日" tone="blue" icon={FileCheck2} />
        <StatCard title="未匹配来账" value="0" desc="全部" tone="violet" icon={Gauge} />
      </div>

      <div className="grid grid-cols-[0.95fr_0.95fr_1fr] gap-[21px]">
        <Panel className="h-[278px] p-[18px]">
          <div className="text-[17px] font-semibold text-[#20213a]">资产分布</div>
          <div className="mt-[48px] flex items-center justify-center">
            <div className="relative h-[132px] w-[132px] rounded-full border-[28px] border-[#8d9198]">
              <div className="absolute right-[-54px] top-[48px] text-[13px] font-semibold text-[#8b4fff]">USD 10.2477%</div>
            </div>
          </div>
        </Panel>
        <Panel className="h-[278px] p-[18px]">
          <div className="text-[17px] font-semibold text-[#20213a]">AUM 趋势</div>
          <div className="mt-[8px] text-[13px] text-[#8a8ca0]">近7天</div>
          <div className="mt-[28px] h-[150px] border-b border-l border-dashed border-[#d8d9e3] bg-gradient-to-t from-[#d8c7ff] to-[#f5efff]" />
        </Panel>
        <Panel className="h-[278px] p-[18px]">
          <div className="text-[17px] font-semibold text-[#20213a]">资金流动</div>
          <div className="mt-[8px] text-[13px] text-[#8a8ca0]">入金 vs 出金</div>
          <div className="mt-[26px] grid h-[150px] grid-cols-6 items-end gap-[13px] border-b border-dashed border-[#d8d9e3]">
            {[42, 92, 28, 78, 38, 64].map((height, index) => (
              <div key={index} className="rounded-t-[4px] bg-[#8b4fff]" style={{ height }} />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function FiatFilterPanel({ variant = 'default', accountType = '', onAccountTypeChange, action }) {
  const isIncoming = variant === 'incoming'

  return (
    <Panel className="mt-[21px] px-[15px] py-[18px]">
      <div className="flex flex-wrap items-center gap-[12px]">
        <AccountTypeFilter value={accountType} onChange={onAccountTypeChange} />
        <SelectBox label="状态：全部" width="w-[296px]" />
        {isIncoming ? <SelectBox label="匹配状态：全部" width="w-[296px]" /> : null}
        <SelectBox label="开始日期" width="w-[296px]" />
        <SelectBox label="结束日期" width="w-[296px]" />
        {!isIncoming ? <SearchBox placeholder="客户、收款人..." width="w-[296px]" /> : null}
      </div>
      <div className="mt-[18px] flex flex-wrap gap-[10px]">
        {action}
        <PrimaryButton icon={Search}>查询</PrimaryButton>
        {!isIncoming ? <ActionButton icon={Clock3}>重置</ActionButton> : null}
      </div>
    </Panel>
  )
}

function IncomingClaimDrawer({ record, onClose }) {
  if (!record) return null
  const isPending = record.status === '待审核'

  return (
    <DrawerShell
      title="入账认领"
      onClose={onClose}
      footer={(
        <div className="grid grid-cols-2 gap-[8px]">
          <button type="button" onClick={onClose} className="h-[38px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">取消</button>
          <button type="button" className="h-[38px] rounded-[5px] bg-[#b0e68d] text-[13px] font-semibold text-white hover:bg-[#87d35d]">确认认领</button>
        </div>
      )}
    >
      <div className="space-y-[12px]">
        <div className="rounded-[5px] bg-[#d8f0ff] px-[14px] py-[13px]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#55556e]">原始来账金额</span>
            <span className="text-[13px] font-semibold text-[#20213a]">{record.currencyAmount}</span>
          </div>
          {isPending ? (
            <label className="mt-[12px] block">
              <span className="text-[12px] font-semibold text-[#2586d9]">可认领入账金额</span>
              <input
                defaultValue={record.claimableAmount || record.currencyAmount}
                className="mt-[7px] h-[38px] w-full rounded-[4px] border border-[#8ac9ff] bg-white px-[10px] text-[13px] font-semibold text-[#20213a] outline-none focus:border-[#2586d9]"
              />
            </label>
          ) : (
            <div className="mt-[9px] flex items-center justify-between border-t border-[#bde5ff] pt-[9px]">
              <span className="text-[13px] text-[#55556e]">实际入账金额</span>
              <span className="text-[13px] font-semibold text-[#20213a]">{record.claimableAmount || record.currencyAmount}</span>
            </div>
          )}
        </div>
        <div className="rounded-[5px] bg-white px-[12px] py-[12px] shadow-sm">
          {[
            ['账户类型', record.accountType],
            ['付款人', record.payer],
            ['渠道', record.channel],
            ['参考号', record.referenceNo],
            ['提交时间', record.submittedAt],
            ['匹配客户', record.matchedCustomer],
          ].map(([label, value]) => (
            <div key={label} className="border-b border-[#e5e6ef] py-[11px] last:border-b-0">
              <div className="text-[12px] text-[#66677f]">{label}</div>
              <div className="mt-[5px] text-[13px] font-semibold text-[#20213a]">{value}</div>
            </div>
          ))}
        </div>
        <div className="rounded-[5px] border border-[#cfd1dc] bg-white p-[12px]">
          <div className="flex items-center gap-[10px]">
            <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#4bd20c] text-[13px] font-semibold text-white">{record.matchedCustomer.slice(0, 1).toUpperCase()}</span>
            <span className="text-[13px] font-semibold text-[#20213a]">{record.matchedCustomer}</span>
          </div>
          <div className="mt-[8px] text-[12px] text-[#66677f]">该记录已匹配客户</div>
        </div>
        <DrawerTextareaField label="认领备注 *" placeholder="必填项，用于审计追踪" />
      </div>
    </DrawerShell>
  )
}

function IncomingClaimPanel({ onOpenRecord }) {
  const [accountType, setAccountType] = useState('')
  const filteredRows = accountType ? incomingClaimRows.filter((row) => row.accountType === accountType) : incomingClaimRows

  return (
    <>
      <FiatFilterPanel
        variant="incoming"
        accountType={accountType}
        onAccountTypeChange={setAccountType}
        action={<PrimaryButton icon={FileCheck2}>批量认领</PrimaryButton>}
      />
      <Panel className="mt-[21px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1380px] w-full border-collapse text-left text-[13px] text-[#55556e]">
            <thead>
              <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
                {['', '提交时间', '账户类型', '币种/金额', '付款人', '渠道', '参考号', '转账凭证', '匹配客户', '匹配状态', '状态', '操作'].map((item) => (
                  <th key={item} className={`${item === '账户类型' ? 'w-[190px]' : item === '匹配状态' || item === '状态' ? 'w-[112px]' : ''} whitespace-nowrap px-[18px]`}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className="h-[62px] border-b border-[#e7e8ef] bg-white">
                  <td className="px-[18px]"><input type="checkbox" className="h-[15px] w-[15px]" /></td>
                  <td className="px-[18px]">{row.submittedAt}</td>
                  <td className="w-[190px] whitespace-nowrap px-[18px] font-semibold text-[#20213a]">{row.accountType}</td>
                  <td className="px-[18px]">{row.currencyAmount}</td>
                  <td className="px-[18px]">{row.payer}</td>
                  <td className="px-[18px]">{row.channel}</td>
                  <td className="px-[18px]">{row.referenceNo}</td>
                  <td className="px-[18px]">{row.voucher}</td>
                  <td className="px-[18px]">{row.matchedCustomer}</td>
                  <td className="w-[112px] px-[18px]"><StatusBadge tone={fiatStatusTone(row.matchStatus)}>{row.matchStatus}</StatusBadge></td>
                  <td className="w-[112px] px-[18px]"><StatusBadge tone={fiatStatusTone(row.status)}>{row.status}</StatusBadge></td>
                  <td className="px-[18px]"><ActionButton icon={FileCheck2} onClick={() => onOpenRecord(row)}>查看详情</ActionButton></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}

function WithdrawalApprovalDrawer({ record, onClose }) {
  if (!record) return null

  return (
    <DrawerShell
      title="出金审批"
      onClose={onClose}
      footer={(
        <div className="grid grid-cols-2 gap-[8px]">
          <button type="button" className="h-[38px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">拒绝</button>
          <button type="button" className="h-[38px] rounded-[5px] bg-[#bda2f9] text-[13px] font-semibold text-white hover:bg-[#9b63f5]">批准</button>
        </div>
      )}
    >
      <div className="space-y-[12px]">
        <div className="rounded-[5px] bg-[#fff1d6] px-[14px] py-[13px]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#55556e]">转账金额</span>
            <span className="text-[13px] font-semibold text-[#20213a]">{record.transferAmount || record.currencyAmount}</span>
          </div>
          <div className="mt-[9px] flex items-center justify-between border-t border-[#ffd894] pt-[9px]">
            <span className="text-[13px] text-[#55556e]">实际到账金额</span>
            <span className="text-[13px] font-semibold text-[#20213a]">{record.actualArrivalAmount || record.currencyAmount}</span>
          </div>
        </div>
        <div className="rounded-[5px] bg-white px-[12px] py-[12px] shadow-sm">
          <div className="border-b border-[#e5e6ef] py-[11px]">
            <div className="text-[12px] text-[#66677f]">客户</div>
            <div className="mt-[5px] text-[13px] font-semibold text-[#20213a]">{record.customer.name}</div>
            <div className="mt-[3px] text-[12px] text-[#66677f]">{record.customer.email}</div>
          </div>
          {[
            ['账户类型', record.accountType],
            ['转账金额', record.transferAmount || record.currencyAmount],
            ['实际到账金额', record.actualArrivalAmount || record.currencyAmount],
            ['收款人', record.recipient],
            ['用途', record.purpose],
            ['申请时间', record.appliedAt],
            ['出金服务费', record.fee],
            ['状态', record.status],
            ...(record.rejectReason ? [['拒绝原因', record.rejectReason]] : []),
          ].map(([label, value]) => (
            <div key={label} className="border-b border-[#e5e6ef] py-[11px] last:border-b-0">
              <div className="text-[12px] text-[#66677f]">{label}</div>
              <div className="mt-[5px] text-[13px] font-semibold text-[#20213a]">{value}</div>
            </div>
          ))}
        </div>
        <DrawerSelectField label="打款渠道 *" value={record.channel} options={['电汇', 'FPS', 'ACH']} />
        <DrawerSelectField label="打款银行 *" value={record.bank} options={['Green Link Digital Bank', '测试银行', 'WO Bank', 'Fidere Partner Bank']} />
        <button type="button" className="flex h-[40px] w-full items-center justify-center gap-[8px] rounded-[5px] border border-[#8b4fff] text-[13px] font-semibold text-[#8b4fff] hover:bg-[#f6f0ff]">
          <FileText className="h-[15px] w-[15px]" />
          选择文件
        </button>
        <div className="text-[12px] text-[#66677f]">支持 JPG, PNG 格式，最大 10MB</div>
        <DrawerTextareaField label="审批备注 *" placeholder="此字段为必填项" />
      </div>
    </DrawerShell>
  )
}

function WithdrawalApprovalPanel({ onOpenRecord }) {
  const [accountType, setAccountType] = useState('')
  const filteredRows = accountType ? withdrawalApprovalRows.filter((row) => row.accountType === accountType) : withdrawalApprovalRows

  return (
    <>
      <FiatFilterPanel accountType={accountType} onAccountTypeChange={setAccountType} />
      <Panel className="mt-[21px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1380px] w-full border-collapse text-left text-[13px] text-[#55556e]">
            <thead>
              <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
                {['申请时间', '客户', '账户类型', '转账金额', '出金服务费', '实际到账金额', '收款人', '用途', '状态', '操作'].map((item) => (
                  <th key={item} className={`${item === '账户类型' ? 'w-[190px]' : ''} whitespace-nowrap px-[18px]`}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className="h-[78px] border-b border-[#e7e8ef] bg-white">
                  <td className="px-[18px]">{row.appliedAt}</td>
                  <td className="px-[18px]">
                    <div className="leading-[1.55]">
                      <div className="font-semibold text-[#20213a]">{row.customer.name}</div>
                      <div>ID: {row.customer.id}</div>
                      <div>{row.customer.email}</div>
                    </div>
                  </td>
                  <td className="w-[190px] whitespace-nowrap px-[18px] font-semibold text-[#20213a]">{row.accountType}</td>
                  <td className="px-[18px]">{row.transferAmount || row.currencyAmount}</td>
                  <td className="px-[18px]">{row.fee}</td>
                  <td className="px-[18px]">{row.actualArrivalAmount || row.currencyAmount}</td>
                  <td className="px-[18px]">{row.recipient}</td>
                  <td className="px-[18px]">{row.purpose}</td>
                  <td className="px-[18px]"><StatusBadge tone={fiatStatusTone(row.status)}>{row.status}</StatusBadge></td>
                  <td className="px-[18px]"><ActionButton icon={FileCheck2} onClick={() => onOpenRecord(row)}>查看详情</ActionButton></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}

function TransferPartyCell({ user }) {
  return (
    <div className="min-w-[190px] leading-[1.55]">
      <div className="font-semibold text-[#20213a]">{user.name}</div>
      <div>ID: {user.id}</div>
      <div className="max-w-[220px] break-all">{user.email}</div>
    </div>
  )
}

function transferTypeTone(type) {
  if (type === '转账给其他用户') return 'blue'
  if (type === '信托转券商') return 'violet'
  if (type === '券商转信托') return 'orange'
  return 'gray'
}

function FiatTransferPanel({ onOpenRecord }) {
  const [accountType, setAccountType] = useState('')
  const [recordType, setRecordType] = useState('全部')
  const [status, setStatus] = useState('全部')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 5

  const filteredRows = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()
    return transferRows.filter((row) => {
      const fromUser = row.fromUser || row.customer
      const toUser = row.toUser || row.customer
      const submittedDate = row.submittedAt.slice(0, 10)
      const searchableText = [
        row.requestId,
        fromUser.name,
        fromUser.id,
        fromUser.email,
        toUser.name,
        toUser.id,
        toUser.email,
      ].join(' ').toLowerCase()

      return (!accountType || row.fromAccount === accountType || row.toAccount === accountType)
        && (recordType === '全部' || row.transferType === recordType)
        && (status === '全部' || row.status === status)
        && (!startDate || submittedDate >= startDate)
        && (!endDate || submittedDate <= endDate)
        && (!normalizedKeyword || searchableText.includes(normalizedKeyword))
    })
  }, [accountType, endDate, keyword, recordType, startDate, status])

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const updateFilter = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  const resetFilters = () => {
    setAccountType('')
    setRecordType('全部')
    setStatus('全部')
    setStartDate('')
    setEndDate('')
    setKeyword('')
    setPage(1)
  }

  const selectClassName = 'h-full min-w-[150px] bg-transparent text-right font-semibold text-[#20213a] outline-none'
  const filterClassName = 'flex h-[50px] items-center justify-between rounded-[4px] border border-[#cfd1dc] bg-white px-[14px] text-[13px] text-[#4c4c68]'

  return (
    <>
      <Panel className="mt-[21px] px-[15px] py-[18px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          <label className={`${filterClassName} w-[276px]`}>
            <span>账户类型</span>
            <select value={accountType} onChange={(event) => updateFilter(setAccountType)(event.target.value)} className={selectClassName}>
              <option value="">全部账户</option>
              {accountFilterOptions.map((option) => <option key={option} value={option}>{formatTransferAccountName(option)}</option>)}
            </select>
          </label>

          <label className={`${filterClassName} w-[276px]`}>
            <span>记录类型</span>
            <select value={recordType} onChange={(event) => updateFilter(setRecordType)(event.target.value)} className={selectClassName}>
              {['全部', '本人账户互转', '转账给其他用户', '信托转券商', '券商转信托'].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className={`${filterClassName} w-[230px]`}>
            <span>状态</span>
            <select value={status} onChange={(event) => updateFilter(setStatus)(event.target.value)} className={selectClassName}>
              {['全部', '处理中', '已完成', '失败', '已撤销', '待审核', '已拒绝'].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className={`${filterClassName} w-[230px]`}>
            <span>开始日期</span>
            <input type="date" value={startDate} onChange={(event) => updateFilter(setStartDate)(event.target.value)} className="bg-transparent text-right font-semibold text-[#20213a] outline-none" />
          </label>

          <label className={`${filterClassName} w-[230px]`}>
            <span>结束日期</span>
            <input type="date" value={endDate} onChange={(event) => updateFilter(setEndDate)(event.target.value)} className="bg-transparent text-right font-semibold text-[#20213a] outline-none" />
          </label>

          <label className="flex h-[50px] min-w-[360px] flex-1 items-center gap-[11px] rounded-[4px] border border-[#cfd1dc] bg-white px-[15px] text-[13px] text-[#9a9cab]">
            <Search className="h-[16px] w-[16px] text-[#20213a]" strokeWidth={1.8} />
            <input
              value={keyword}
              onChange={(event) => updateFilter(setKeyword)(event.target.value)}
              className="h-full min-w-0 flex-1 bg-transparent outline-none"
              placeholder="搜索申请编号、转出用户、收款用户、邮箱"
            />
          </label>
        </div>

        <div className="mt-[18px] flex flex-wrap gap-[10px]">
          <PrimaryButton icon={Search} onClick={() => setPage(1)}>查询</PrimaryButton>
          <ActionButton icon={XCircle} onClick={resetFilters}>重置</ActionButton>
        </div>
      </Panel>

      <Panel className="mt-[21px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[2420px] w-full border-collapse text-left text-[13px] text-[#55556e]">
            <thead>
              <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
                <th className="sticky left-0 z-20 w-[190px] bg-[#f6f7fb] px-[18px]">转账编号</th>
                <th className="w-[150px] px-[18px]">记录类型</th>
                <th className="w-[240px] px-[18px]">转出方</th>
                <th className="w-[170px] whitespace-nowrap px-[18px]">转出账户</th>
                <th className="w-[240px] px-[18px]">转入方</th>
                <th className="w-[170px] whitespace-nowrap px-[18px]">转入账户</th>
                <th className="w-[90px] px-[18px]">币种</th>
                <th className="w-[150px] px-[18px]">转账金额</th>
                <th className="w-[140px] px-[18px]">手续费</th>
                <th className="w-[170px] px-[18px]">实际到账金额</th>
                <th className="w-[112px] px-[18px]">状态</th>
                <th className="w-[170px] px-[18px]">提交时间</th>
                <th className="sticky right-0 z-20 w-[120px] bg-[#f6f7fb] px-[18px]">操作</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length ? pageRows.map((row) => {
                const fromUser = row.fromUser || row.customer
                const toUser = row.toUser || row.customer
                return (
                  <tr key={row.requestId} onClick={() => onOpenRecord(row)} className="group min-h-[82px] cursor-pointer border-b border-[#e7e8ef] bg-white hover:bg-[#faf9ff]">
                    <td className="sticky left-0 z-10 bg-white px-[18px] py-[12px] font-semibold text-[#20213a] group-hover:bg-[#faf9ff]">{row.requestId}</td>
                    <td className="px-[18px] py-[12px]"><StatusBadge tone={transferTypeTone(row.transferType)}>{row.transferType}</StatusBadge></td>
                    <td className="px-[18px] py-[12px]"><TransferPartyCell user={fromUser} /></td>
                    <td className="whitespace-nowrap px-[18px] py-[12px]">{formatTransferAccountName(row.fromAccount)}</td>
                    <td className="px-[18px] py-[12px]"><TransferPartyCell user={toUser} /></td>
                    <td className="whitespace-nowrap px-[18px] py-[12px]">{formatTransferAccountName(row.toAccount)}</td>
                    <td className="px-[18px] py-[12px]">{row.currency}</td>
                    <td className="whitespace-nowrap px-[18px] py-[12px] font-semibold text-[#20213a]">{row.transferAmount || row.amount}</td>
                    <td className="whitespace-nowrap px-[18px] py-[12px]">{row.fee || `${row.currency} 0.00`}</td>
                    <td className="whitespace-nowrap px-[18px] py-[12px]">{row.actualArrivalAmount || '-'}</td>
                    <td className="px-[18px] py-[12px]"><StatusBadge tone={transferStatusTone(row.status)}>{row.status}</StatusBadge></td>
                    <td className="whitespace-nowrap px-[18px] py-[12px]">{row.submittedAt}</td>
                    <td className="sticky right-0 z-10 bg-white px-[18px] py-[12px] group-hover:bg-[#faf9ff]">
                      <ActionButton
                        icon={row.status === '待审核' ? FileCheck2 : Eye}
                        onClick={(event) => {
                          event.stopPropagation()
                          onOpenRecord(row)
                        }}
                      >
                        {row.status === '待审核' ? '审核' : '查看'}
                      </ActionButton>
                    </td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan={13} className="px-[18px] py-[64px] text-center">
                    <div className="text-[14px] font-semibold text-[#4c4c68]">暂无符合条件的资金互转记录</div>
                    <button type="button" onClick={resetFilters} className="mt-[10px] text-[13px] font-semibold text-[#8b4fff] hover:underline">重置筛选条件</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-[12px] border-t border-[#e5e6ef] bg-white px-[18px] py-[14px] text-[12px] text-[#66677f]">
          <span>共 {filteredRows.length} 条记录，第 {currentPage} / {pageCount} 页</span>
          <div className="flex gap-[8px]">
            <button type="button" disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="h-[32px] rounded-[4px] border border-[#cfd1dc] px-[12px] font-semibold text-[#4c4c68] disabled:cursor-not-allowed disabled:opacity-50">上一页</button>
            <button type="button" disabled={currentPage >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} className="h-[32px] rounded-[4px] border border-[#8b4fff] px-[12px] font-semibold text-[#8b4fff] disabled:cursor-not-allowed disabled:opacity-50">下一页</button>
          </div>
        </div>
      </Panel>
    </>
  )
}

function CurrencyPill({ currency }) {
  const toneClass = {
    AED: 'bg-[#f2f8ef] text-[#18864b]',
    BHD: 'bg-[#fff0f1] text-[#b3192d]',
    CNY: 'bg-[#fff1f1] text-[#d62d2d]',
    EUR: 'bg-[#eef4ff] text-[#3267d6]',
    HKD: 'bg-[#fff1d6] text-[#f39800]',
    JPY: 'bg-[#fff1f1] text-[#c43535]',
    SGD: 'bg-[#fff1f1] text-[#d62d2d]',
    USD: 'bg-[#e7f5ff] text-[#237be8]',
  }[String(currency || '').toUpperCase()] || 'bg-[#f0f2f7] text-[#55556e]'

  return (
    <span className={`inline-flex h-[26px] items-center gap-[6px] rounded-full px-[8px] py-[3px] text-[12px] font-semibold leading-none ${toneClass}`}>
      <CurrencyIcon currency={currency} size="sm" />
      <span>{currency}</span>
    </span>
  )
}

function DirectionBadge({ direction }) {
  return <StatusBadge tone={direction === '入金' ? 'green' : 'red'}>{direction}</StatusBadge>
}

function AssetAccountCard({ title, balances }) {
  return (
    <div className="rounded-[6px] border border-[#e5e6ef] bg-white p-[18px] shadow-[0_7px_16px_rgba(28,29,42,0.08)]">
      <div className="flex items-center gap-[9px] text-[15px] font-semibold text-[#20213a]">
        <WalletCards className="h-[17px] w-[17px] text-[#8b4fff]" strokeWidth={2} />
        {title}
      </div>
      <div className="mt-[14px] overflow-x-auto">
        <table className="min-w-[620px] w-full border-collapse text-left text-[13px] text-[#55556e]">
          <thead>
            <tr className="h-[44px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
              {['币种', '可用', '冻结', '在途', '总计', '近7日入金', '近7日出金'].map((item) => (
                <th key={item} className="px-[14px]">{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {balances.map((balance) => (
              <tr key={`${title}-${balance.currency}`} className="h-[48px] border-b border-[#e7e8ef] last:border-b-0">
                <td className="px-[14px]"><CurrencyPill currency={balance.currency} /></td>
                <td className="px-[14px] font-semibold text-[#11883a]">{balance.available}</td>
                <td className="px-[14px] font-semibold text-[#f39800]">{balance.frozen}</td>
                <td className="px-[14px] font-semibold text-[#237be8]">{balance.inTransit}</td>
                <td className="px-[14px] font-semibold text-[#55556e]">{balance.total}</td>
                <td className="px-[14px] font-semibold text-[#11883a]">{balance.recentIn}</td>
                <td className="px-[14px] font-semibold text-[#ff4f5b]">{balance.recentOut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RecentFlowsPanel({ customer }) {
  const flows = customer?.recentFlows?.slice(0, 3) || []

  return (
    <Panel className="mt-[21px] overflow-hidden">
      <div className="px-[18px] py-[16px]">
        <div className="text-[16px] font-semibold text-[#20213a]">最近3笔流水</div>
        <div className="mt-[4px] text-[12px] text-[#66677f]">客户ID: {customer?.id || '-'}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[1120px] w-full border-collapse text-left text-[13px] text-[#55556e]">
          <thead>
            <tr className="h-[50px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
              {['时间', '账户类型', '币种/金额', '方向', '渠道', '状态'].map((item) => (
                <th key={item} className={`${item === '账户类型' ? 'w-[190px]' : ''} whitespace-nowrap px-[18px]`}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flows.map((flow) => (
              <tr key={`${flow.time}-${flow.accountType}-${flow.currencyAmount}`} className="h-[52px] border-b border-[#e7e8ef] last:border-b-0">
                <td className="px-[18px]">{flow.time}</td>
                <td className="w-[190px] whitespace-nowrap px-[18px] font-semibold text-[#20213a]">{flow.accountType}</td>
                <td className="px-[18px]">{flow.currencyAmount}</td>
                <td className="px-[18px]"><DirectionBadge direction={flow.direction} /></td>
                <td className="px-[18px]">{flow.channel}</td>
                <td className="px-[18px]"><StatusBadge tone={fiatStatusTone(flow.status)}>{flow.status}</StatusBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

function FiatLedgerQueryPanel() {
  const [accountType, setAccountType] = useState('香港账户')
  const filteredRows = fiatLedgerRows.filter((row) => row.accountType === accountType)

  return (
    <>
      <FiatFilterPanel accountType={accountType} onAccountTypeChange={setAccountType} />
      <Panel className="mt-[21px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1320px] w-full border-collapse text-left text-[13px] text-[#55556e]">
            <thead>
              <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
                {['时间', '客户', '客户ID', '账户类型', '币种/金额', '类型', '渠道', '参考号', '状态'].map((item) => (
                  <th key={item} className={`${item === '账户类型' ? 'w-[190px]' : ''} whitespace-nowrap px-[18px]`}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className="h-[56px] border-b border-[#e7e8ef] bg-white">
                  <td className="px-[18px]">{row.time}</td>
                  <td className="px-[18px] font-semibold text-[#20213a]">{row.customer}</td>
                  <td className="px-[18px]">{row.customerId}</td>
                  <td className="w-[190px] whitespace-nowrap px-[18px] font-semibold text-[#20213a]">{row.accountType}</td>
                  <td className="px-[18px]">{row.currencyAmount}</td>
                  <td className="px-[18px]"><DirectionBadge direction={row.type} /></td>
                  <td className="px-[18px]">{row.channel}</td>
                  <td className="px-[18px]">{row.referenceNo}</td>
                  <td className="px-[18px]"><StatusBadge tone={fiatStatusTone(row.status)}>{row.status}</StatusBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}

function CustomerAssetsPanel() {
  const [expandedCustomerId, setExpandedCustomerId] = useState(customerAssetRows[0]?.id || '')
  const filteredRows = customerAssetRows
  const expandedCustomer = filteredRows.find((row) => row.id === expandedCustomerId) || filteredRows[0] || customerAssetRows[0]

  return (
    <>
      <Panel className="px-[15px] py-[18px]">
        <div className="text-[16px] font-semibold text-[#20213a]">筛选条件</div>
        <div className="mt-[15px] flex flex-wrap items-center gap-[12px]">
          <SelectBox label="全部币种" width="w-[296px]" />
          <SearchBox placeholder="客户ID、邮箱、姓名" width="w-[520px]" />
        </div>
        <div className="mt-[18px] flex gap-[10px] border-t border-[#e5e6ef] pt-[18px]">
          <ActionButton icon={Clock3}>重置</ActionButton>
          <PrimaryButton icon={Search}>查询</PrimaryButton>
        </div>
      </Panel>

      <Panel className="mt-[21px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1500px] w-full border-collapse text-left text-[13px] text-[#55556e]">
            <thead>
              <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
                {['', '客户信息', '账户类型', '总资产 (USD)', '较昨日', '币种数', '最后活动', '操作'].map((item) => (
                  <th key={item} className={`${item === '账户类型' ? 'w-[360px]' : ''} whitespace-nowrap px-[18px]`}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const isExpanded = expandedCustomer?.id === row.id
                const currencies = [...new Set(Object.values(row.accountBalances).flat().map((balance) => balance.currency))]

                return (
                  <Fragment key={row.id}>
                    <tr className={`h-[84px] border-b border-[#e7e8ef] ${isExpanded ? 'bg-[#e5f5ff]' : 'bg-white'}`}>
                      <td className="px-[18px]">
                        <button type="button" onClick={() => setExpandedCustomerId(row.id)} className="rounded-[4px] p-[5px] text-[#66677f] hover:bg-white">
                          <ChevronDown className={`h-[16px] w-[16px] transition ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </td>
                      <td className="px-[18px]">
                        <div className="flex items-center gap-[12px]">
                          <span className="flex h-[39px] w-[39px] shrink-0 items-center justify-center rounded-full bg-[#2586d9] text-[14px] font-semibold text-white">{row.initials}</span>
                          <div className="leading-[1.55]">
                            <div className="font-semibold text-[#20213a]">{row.name}</div>
                            <div>{row.id} · {row.type}</div>
                            <div>{row.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="w-[360px] whitespace-nowrap px-[18px] font-semibold text-[#20213a]">{row.accountTypes.join(' / ')}</td>
                      <td className="px-[18px] font-mono text-[14px] font-semibold text-[#006ee6]">{row.totalUsd}</td>
                      <td className="px-[18px] font-semibold text-[#55556e]">{row.yesterdayChange}</td>
                      <td className="px-[18px]">
                        <div className="flex gap-[8px]">
                          {currencies.map((currency) => (
                            <CurrencyPill key={`${row.id}-${currency}`} currency={currency} />
                          ))}
                          <span className="sr-only">{currencies.length}</span>
                        </div>
                      </td>
                      <td className="px-[18px]">{row.lastActivity}</td>
                      <td className="px-[18px]">
                        <div className="flex gap-[8px]">
                          <ActionButton icon={FileText}>流水</ActionButton>
                          <ActionButton icon={Plus}>调整</ActionButton>
                        </div>
                      </td>
                    </tr>
                    {isExpanded ? (
                      <tr className="border-b border-[#e7e8ef] bg-white">
                        <td colSpan={8} className="px-[18px] py-[18px]">
                          <div className="space-y-[16px]">
                            {fiatAssetAccountCardTypes.map((accountName) => (
                              <AssetAccountCard key={`${row.id}-${accountName}`} title={accountName} balances={row.accountBalances[accountName] || emptyFiatAccountBalancesByType[accountName] || []} />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <RecentFlowsPanel customer={expandedCustomer} />
    </>
  )
}

export function FiatAssetManagementPage({ hideQuestionMarks = false, initialTab = '总览' }) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [selectedTransfer, setSelectedTransfer] = useState(null)
  const [manualDrawerType, setManualDrawerType] = useState(null)
  const [manualAccountType, setManualAccountType] = useState('香港账户')
  const [selectedIncomingClaim, setSelectedIncomingClaim] = useState(null)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null)

  const openManualDrawer = (type) => {
    setManualAccountType('香港账户')
    setManualDrawerType(type)
  }

  return (
    <AdminShell>
      <Panel className="px-[18px] py-[22px]">
        <div className="flex items-center justify-between">
          <PageTitle title="法币资产管理" subtitle="管理法币资产、出入金审批与资金互转申请" />
          <span className="rounded-[5px] bg-[#f6f7fb] px-[14px] py-[9px] text-[12px] text-[#66677f]">最后同步: 2026-05-31 18:02:39</span>
        </div>
        <div className="mt-[24px] flex gap-[24px] border-b border-[#e5e6ef]">
          {fiatTabs.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-[6px] pb-[14px] text-[13px] font-semibold ${
                activeTab === tab ? 'border-[#8b4fff] text-[#8b4fff]' : 'border-transparent text-[#4c4c68]'
              }`}
            >
              <span className="inline-flex items-center gap-[6px]">
                {markedFiatTabs.has(tab) && !hideQuestionMarks ? <QuestionMark active={activeTab === tab} /> : null}
                {tab}
              </span>
            </button>
          ))}
        </div>
      </Panel>

      <div className="mt-[21px]">
        {activeTab === '总览' ? <FiatOverviewPanel onOpenManual={openManualDrawer} onChangeTab={setActiveTab} hideQuestionMarks={hideQuestionMarks} /> : null}
        {activeTab === '客户资产' ? <CustomerAssetsPanel /> : null}
        {activeTab === '流水查询' ? <FiatLedgerQueryPanel /> : null}
        {activeTab === '入账认领' ? <IncomingClaimPanel onOpenRecord={setSelectedIncomingClaim} /> : null}
        {activeTab === '出金审批' ? <WithdrawalApprovalPanel onOpenRecord={setSelectedWithdrawal} /> : null}
        {activeTab === '资金互转' ? <FiatTransferPanel onOpenRecord={setSelectedTransfer} /> : null}
        {!['总览', '客户资产', '流水查询', '入账认领', '出金审批', '资金互转'].includes(activeTab) ? (
          <Panel className="p-[36px] text-center text-[13px] text-[#66677f]">{activeTab} 数据占位，当前原型重点展示总览、入账认领、出金审批和资金互转。</Panel>
        ) : null}
      </div>

      {manualDrawerType ? (
        <ManualFiatDrawer
          type={manualDrawerType}
          accountType={manualAccountType}
          onAccountTypeChange={setManualAccountType}
          onClose={() => setManualDrawerType(null)}
        />
      ) : null}
      <IncomingClaimDrawer record={selectedIncomingClaim} onClose={() => setSelectedIncomingClaim(null)} />
      <WithdrawalApprovalDrawer record={selectedWithdrawal} onClose={() => setSelectedWithdrawal(null)} />
      <TransferAuditDrawer record={selectedTransfer} onClose={() => setSelectedTransfer(null)} />
    </AdminShell>
  )
}

function modeLabel(mode) {
  if (mode === 'percent') return '百分比'
  if (mode === 'fixed') return '固定金额'
  if (mode === 'combo') return '固定手续费 + 百分比'
  return '平台默认'
}

function FeeConfigModal({ draft, onChange, onClose, onSave, editingFee }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#252236]/45">
      <div className="w-[540px] rounded-[6px] bg-white p-[18px] shadow-[0_16px_40px_rgba(28,29,42,0.25)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[8px] text-[15px] font-semibold text-[#20213a]">
            <Plus className="h-[16px] w-[16px]" />
            {editingFee ? '编辑提现服务费配置' : '新增提现服务费配置'}
          </div>
          <button type="button" onClick={onClose} className="rounded-[4px] p-[7px] text-[#66677f] hover:bg-[#f6f7fb]">
            <X className="h-[16px] w-[16px]" />
          </button>
        </div>

        <div className="mt-[18px] space-y-[12px]">
          <select value={draft.customerId} onChange={(event) => onChange({ ...draft, customerId: event.target.value })} className="h-[48px] w-full rounded-[4px] border border-[#cfd1dc] bg-white px-[12px] text-[13px] outline-none">
            {customers.map((customer) => <option key={customer.id} value={customer.id}>ID: {customer.id} / {customer.email}</option>)}
          </select>
          <select value={draft.mode} onChange={(event) => onChange({ ...draft, mode: event.target.value })} className="h-[48px] w-full rounded-[4px] border border-[#cfd1dc] bg-white px-[12px] text-[13px] outline-none">
            <option value="platform">使用平台默认</option>
            <option value="percent">百分比</option>
            <option value="fixed">固定金额</option>
            <option value="combo">固定手续费 + 百分比</option>
          </select>
          {draft.mode !== 'platform' ? (
            <input
              value={draft.value}
              onChange={(event) => onChange({ ...draft, value: event.target.value })}
              className="h-[48px] w-full rounded-[4px] border border-[#cfd1dc] px-[12px] text-[13px] outline-none"
              placeholder={draft.mode === 'percent' ? '百分比值，例如 0.3' : draft.mode === 'combo' ? '固定金额 + 百分比，例如 10.00 + 0.20' : '固定金额，例如 15.00'}
            />
          ) : null}
          <div className="rounded-[5px] bg-[#e7f5ff] px-[14px] py-[12px] text-[13px] text-[#2586d9]">未单独设置的用户，将默认使用平台级提现服务费配置；可配置固定金额、百分比，或固定手续费 + 百分比组合。</div>
        </div>

        <div className="mt-[18px] flex justify-end gap-[10px]">
          <ActionButton icon={X} onClick={onClose}>取消</ActionButton>
          <PrimaryButton icon={FileCheck2} onClick={onSave}>保存</PrimaryButton>
        </div>
      </div>
    </div>
  )
}

function FeeConfigPage() {
  const [configs, setConfigs] = useState(initialFeeConfigs)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFee, setEditingFee] = useState(null)
  const [draft, setDraft] = useState({ customerId: '65', mode: 'fixed', value: '15.00' })

  const selectedCustomer = useMemo(() => customers.find((customer) => customer.id === draft.customerId) || customers[0], [draft.customerId])

  const openCreate = () => {
    setEditingFee(null)
    setDraft({ customerId: customers[0].id, mode: 'fixed', value: '15.00' })
    setModalOpen(true)
  }

  const openEdit = (config) => {
    setEditingFee(config)
    setDraft({ customerId: config.id, mode: config.mode, value: config.mode === 'platform' ? '' : config.value.replace('USD ', '').replace('%', '') })
    setModalOpen(true)
  }

  const saveConfig = () => {
    const normalizedDraftValue = String(draft.value || '').replace(/%+$/g, '')
    const value = draft.mode === 'platform'
      ? '使用平台默认'
      : draft.mode === 'percent'
        ? `${normalizedDraftValue}%`
        : draft.mode === 'combo'
          ? `USD ${normalizedDraftValue}%`
          : `USD ${draft.value}`
    const nextConfig = {
      id: selectedCustomer.id,
      email: selectedCustomer.email,
      mode: draft.mode,
      value,
      usePlatformDefault: draft.mode === 'platform',
    }

    setConfigs((current) => {
      if (current.some((item) => item.id === nextConfig.id)) {
        return current.map((item) => (item.id === nextConfig.id ? nextConfig : item))
      }
      return [nextConfig, ...current]
    })
    setModalOpen(false)
  }

  return (
    <AdminShell>
      <Panel className="px-[18px] py-[22px]">
        <PageTitle title="提现服务费配置" subtitle="设置平台级默认服务费，并为指定用户配置固定金额、百分比或组合收费。" />
      </Panel>

      <div className="mt-[21px] grid grid-cols-[360px_1fr] gap-[18px]">
        <Panel className="p-[18px]">
          <div className="mb-[16px] flex items-center gap-[8px] text-[14px] font-semibold text-[#20213a]">
            <Percent className="h-[17px] w-[17px] text-[#8b4fff]" />
            平台级服务费设置
          </div>
          <div className="grid grid-cols-3 gap-[10px]">
            <div className="rounded-[5px] border border-[#8b4fff] bg-[#f6f0ff] p-[14px]">
              <div className="text-[12px] text-[#66677f]">固定金额</div>
              <div className="mt-[8px] text-[22px] font-bold text-[#20213a]">USD 15.00</div>
              <div className="mt-[6px] text-[12px] text-[#8b4fff]">当前默认</div>
            </div>
            <div className="rounded-[5px] border border-[#e2e4ec] bg-white p-[14px]">
              <div className="text-[12px] text-[#66677f]">百分比</div>
              <div className="mt-[8px] text-[22px] font-bold text-[#20213a]">0.30%</div>
              <div className="mt-[6px] text-[12px] text-[#66677f]">备选配置</div>
            </div>
            <div className="rounded-[5px] border border-[#e2e4ec] bg-white p-[14px]">
              <div className="text-[12px] text-[#66677f]">固定 + 百分比</div>
              <div className="mt-[8px] text-[18px] font-bold text-[#20213a]">USD 10 + 0.20%</div>
              <div className="mt-[6px] text-[12px] text-[#66677f]">组合配置</div>
            </div>
          </div>
          <div className="mt-[14px] rounded-[5px] bg-[#f6f7fb] p-[14px] text-[13px] leading-[22px] text-[#66677f]">未设置用户将默认使用平台级固定金额 USD 15.00；服务费规则用于提现/法币转出场景。</div>
        </Panel>

        <Panel className="px-[15px] pb-[18px] pt-[21px]">
          <div className="flex items-center justify-between px-[4px]">
            <PageTitle title="用户级配置" subtitle="支持按用户覆盖平台默认服务费规则" />
            <PrimaryButton icon={Plus} onClick={openCreate}>新增</PrimaryButton>
          </div>
          <div className="mt-[21px] flex items-center gap-[12px]">
            <SearchBox placeholder="搜索用户ID" width="w-[300px]" />
            <SearchBox placeholder="搜索用户邮箱" width="w-[300px]" />
            <PrimaryButton icon={Search}>搜索</PrimaryButton>
          </div>
          <div className="mt-[15px] border-t border-[#e5e6ef] pt-[15px]">
            <table className="w-full border-collapse text-left text-[13px] text-[#55556e]">
              <thead>
                <tr className="h-[52px] bg-[#f6f7fb] text-[12px] font-semibold text-[#22223d]">
                  <th className="px-[18px]">用户 ID</th>
                  <th className="px-[18px]">邮箱</th>
                  <th className="px-[18px]">计费方式</th>
                  <th className="px-[18px]">服务费规则</th>
                  <th className="px-[18px]">是否使用平台默认</th>
                  <th className="px-[18px]">操作</th>
                </tr>
              </thead>
              <tbody>
                {configs.map((config) => (
                  <tr key={config.id} className="h-[74px] border-b border-[#e7e8ef] bg-white">
                    <td className="px-[18px] font-semibold text-[#20213a]">{config.id}</td>
                    <td className="px-[18px]">{config.email}</td>
                    <td className="px-[18px]">{modeLabel(config.mode)}</td>
                    <td className="px-[18px] text-[#8b4fff]">{config.value}</td>
                    <td className="px-[18px]"><StatusBadge tone={config.usePlatformDefault ? 'gray' : 'green'}>{config.usePlatformDefault ? '是' : '否'}</StatusBadge></td>
                    <td className="px-[18px]"><ActionButton icon={FileText} onClick={() => openEdit(config)}>编辑</ActionButton></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      {modalOpen ? <FeeConfigModal draft={draft} onChange={setDraft} onClose={() => setModalOpen(false)} onSave={saveConfig} editingFee={editingFee} /> : null}
    </AdminShell>
  )
}

export function BaasAdminReviewPrototype({ onBack }) {
  const [activePage, setActivePage] = useState('opening-review')
  const [reviewMode, setReviewMode] = useState('list')

  const selectPage = (page) => {
    setActivePage(page)
    setReviewMode('list')
  }

  return (
    <div className="min-h-screen bg-[#f4f5fb] font-sans text-[#24243d]">
      <Header onBack={onBack} />
      <Sidebar activePage={activePage} onSelect={selectPage} />
      {activePage === 'opening-review' && reviewMode === 'list' ? <OpeningReviewPage onOpenDetail={() => setReviewMode('detail')} onOpenProcess={() => setReviewMode('process')} /> : null}
      {activePage === 'opening-review' && reviewMode !== 'list' ? <OpeningReviewDetailPage mode={reviewMode} onBack={() => setReviewMode('list')} /> : null}
      {activePage === 'user-management' ? <UserManagementPage /> : null}
      {activePage === 'fiat-assets' ? <FiatAssetManagementPage /> : null}
      {activePage === 'fee-config' ? <FeeConfigPage /> : null}
      <button
        type="button"
        className="fixed right-0 top-[180px] z-40 flex h-[36px] w-[36px] items-center justify-center rounded-l-full bg-[#8b4fff] text-white shadow-lg"
        aria-label="后台设置"
      >
        <Settings className="h-[18px] w-[18px]" strokeWidth={2} />
      </button>
    </div>
  )
}
