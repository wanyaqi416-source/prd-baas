import {
  ArrowLeft,
  AlertTriangle,
  Banknote,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  DollarSign,
  Edit3,
  Eye,
  FileText,
  Landmark,
  LineChart,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const products = [
  {
    id: 'gldb-usd-1m',
    name: 'GLDB USD 1-Month Fixed Deposit',
    code: 'GLDB-USD-FD-1M',
    type: '定期 · 法币',
    risk: '低',
    expectedYield: '3.5000%',
    actualYield: '3.5000%',
    scale: 'US$100,000,000',
    investors: 0,
    status: '上架',
    productNo: '23',
    period: '30',
    minAmount: 'US$10,000',
    dueDate: '-',
    description:
      '美元一个月固定期限理财产品，适用于希望在明确期限内管理闲置美元资金的客户。后台用于管理产品信息、认购客户、订单记录及后续净值维护。',
  },
  {
    id: 'hkd-fixed',
    name: '港币',
    code: '港币',
    type: '定期 · 法币',
    risk: '低',
    expectedYield: '5.5000%',
    actualYield: '5.5000%',
    scale: 'HK$10,000',
    investors: 1,
    status: '下架',
    productNo: '21',
    period: '30',
    minAmount: 'HK$100',
    dueDate: '-',
    description: '港币定期理财产品，用于管理港币认购、到期赎回及客户订单追踪。',
  },
  {
    id: 'usdt-trc20',
    name: 'USDT_TRC20',
    code: 'USDT_TRC20',
    type: '定期 · 数字货币',
    risk: '中',
    expectedYield: '10.0000%',
    actualYield: '10.0000%',
    scale: '10,000 USDT_TRC20',
    investors: 1,
    status: '下架',
    productNo: '20',
    period: '30',
    minAmount: '100 USDT_TRC20',
    dueDate: '-',
    description: 'USDT_TRC20 定期理财产品，用于演示数字货币产品的认购审核和资金流向留痕。',
  },
  {
    id: 'eth',
    name: 'ETH',
    code: 'ETH',
    type: '定期 · 数字货币',
    risk: '低',
    expectedYield: '20.0000%',
    actualYield: '20.0000%',
    scale: 'ETH 10,000',
    investors: 1,
    status: '下架',
    productNo: '19',
    period: '30',
    minAmount: 'ETH 1',
    dueDate: '-',
    description: 'ETH 固定期限理财产品，重点展示赎回审核、审批记录和统一状态。',
  },
  {
    id: 'mature-usdt-erc20',
    name: '测试到期USDT_ERC20',
    code: 'TEST-MATURE-USDT',
    type: '定期 · 数字货币',
    risk: '低',
    expectedYield: '5.0000%',
    actualYield: '5.0000%',
    scale: '1000',
    investors: 2,
    status: '暂停',
    productNo: '18',
    period: '30',
    minAmount: '10 USDT_ERC20',
    dueDate: '2026-05-13',
    description: '用于测试订单到期、赎回按钮展示和赎回审批的固定期限产品。',
  },
]

const customerRows = [
  { customerNo: '6', tradeNo: 'INV-20260511-a269910c', name: 'perumily2@rulersonline.com', amount: '9.99 USD', date: '2026-05-11 16:38', status: '已到期' },
  { customerNo: '4', tradeNo: 'INV-20260513-9d8c76d1', name: 'okyqui42@rulersonline.com', amount: '50 USDT_ERC20', date: '2026-05-13 14:37', status: '持有中' },
  { customerNo: '3', tradeNo: 'INV-20260512-b204e9a7', name: 'franciska33@rulersonline.com', amount: '1000 USDT_ERC20', date: '2026-05-12 11:21', status: '已赎回' },
]

const productOrders = [
  { orderNo: 'INV-20260511-a269910c', customer: 'perumily2@rulersonline.com', type: '申购', amount: '9.99 USD', time: '2026-05-11 16:38', status: '已取消' },
  { orderNo: 'INV-20260513-9d8c76d1', customer: 'okyqui42@rulersonline.com', type: '申购', amount: '50 USDT_ERC20', time: '2026-05-13 14:37', status: '已结束' },
  { orderNo: 'INV-20260512-b204e9a7', customer: 'franciska33@rulersonline.com', type: '申购', amount: '1000 USDT_ERC20', time: '2026-05-12 11:21', status: '持有中' },
]

const initialSubscriptionOrders = [
  {
    id: 'INV-20260812-db21aa6c',
    customer: 'WAN WAN',
    email: 'wanwan@fidere.example',
    product: '美元',
    amount: '38 USD',
    fee: '0.38 USD',
    actualDebit: '38.38 USD',
    holdingId: 'HLD-USD-008',
    paymentAccountType: '美国账户',
    paymentAccountNo: '••••5678',
    paymentAccountId: 'acct-us-5678',
    paymentAccount: '美国账户 · ••••5678',
    paymentCurrency: 'USD',
    defaultSettlementAccount: '香港账户 · ••••1234',
    settlementCurrency: 'USD',
    termsVersion: 'V2.1',
    riskVersion: 'V3.0',
    confirmedAt: '2026-08-12 15:17:52',
    refundStatus: '-',
    appliedAt: '2026-08-12 15:18',
    approvedAt: '-',
    statusGroup: 'pending',
    status: '待审核',
    risk: '低',
    type: '首次认购',
    rejectReason: '',
  },
  {
    id: 'INV-20260511-a269910c',
    customer: 'perumily2@rulersonline.com',
    email: 'perumily2@rulersonline.com',
    product: 'GLDB USD 1-Month Fixed Deposit',
    amount: '9.99 USD',
    fee: '0.00 USD',
    actualDebit: '9.99 USD',
    holdingId: 'HLD-USD-003',
    paymentAccountType: '新加坡账户',
    paymentAccountNo: '••••0950',
    paymentAccountId: 'acct-sg-0950',
    paymentAccount: '新加坡账户 · ••••0950',
    paymentCurrency: 'USD',
    defaultSettlementAccount: '香港账户 · ••••1234',
    settlementCurrency: 'USD',
    termsVersion: 'V2.1',
    riskVersion: 'V3.0',
    confirmedAt: '2026-05-11 16:37:42',
    refundStatus: '-',
    appliedAt: '2026-05-11 16:38',
    approvedAt: '-',
    statusGroup: 'pending',
    status: '待审核',
    risk: '低',
    type: '首次认购',
    rejectReason: '',
  },
  {
    id: 'INV-20260512-a4d00606',
    customer: 'okyqui42@rulersonline.com',
    email: 'okyqui42@rulersonline.com',
    product: 'USDT_TRC20',
    amount: '500 USDT_TRC20',
    fee: '0.05 USDT_TRC20',
    actualDebit: '500.05 USDT_TRC20',
    holdingId: 'HLD-USDT-002',
    paymentAccountType: '新加坡账户',
    paymentAccountNo: '••••0950',
    paymentAccountId: 'acct-sg-0950',
    paymentAccount: '新加坡账户 · ••••0950',
    paymentCurrency: 'USDT_TRC20',
    defaultSettlementAccount: '香港账户 · ••••1234',
    settlementCurrency: 'USDT_TRC20',
    termsVersion: 'V2.1',
    riskVersion: 'V3.0',
    confirmedAt: '2026-05-12 10:26:51',
    refundStatus: '已退款',
    refundAmount: '500.05 USDT_TRC20',
    refundTime: '2026-05-12 10:40:00',
    refundFailedReason: '',
    appliedAt: '2026-05-12 10:27',
    approvedAt: '2026-05-12 10:31',
    statusGroup: 'rejected',
    status: '已拒绝',
    risk: '中',
    type: '首次认购',
    rejectReason: '测试是否显示拒绝原因',
  },
  {
    id: 'INV-20260513-9d8c76d1',
    customer: 'okyqui42@rulersonline.com',
    email: 'okyqui42@rulersonline.com',
    product: 'ETH',
    amount: '50 ETH',
    fee: '0.1 ETH',
    actualDebit: '50.1 ETH',
    holdingId: 'HLD-ETH-001',
    paymentAccountType: '香港账户',
    paymentAccountNo: '••••1234',
    paymentAccountId: 'acct-hk-1234',
    paymentAccount: '香港账户 · ••••1234',
    paymentCurrency: 'ETH',
    defaultSettlementAccount: '美国账户 · ••••5678',
    settlementCurrency: 'ETH',
    termsVersion: 'V2.1',
    riskVersion: 'V3.0',
    confirmedAt: '2026-05-13 14:36:50',
    refundStatus: '-',
    appliedAt: '2026-05-13 14:37',
    approvedAt: '2026-05-13 14:40',
    statusGroup: 'approved',
    status: '持有中',
    risk: '低',
    type: '追加认购',
    rejectReason: '',
  },
  {
    id: 'INV-20260510-8c5f27be',
    customer: 'franciska33@rulersonline.com',
    email: 'franciska33@rulersonline.com',
    product: '港币',
    amount: '100 HKD',
    fee: '0.00 HKD',
    actualDebit: '100 HKD',
    holdingId: 'HLD-HKD-001',
    paymentAccountType: '香港账户',
    paymentAccountNo: '••••1234',
    paymentAccountId: 'acct-hk-1234',
    paymentAccount: '香港账户 · ••••1234',
    paymentCurrency: 'HKD',
    defaultSettlementAccount: '香港账户 · ••••1234',
    settlementCurrency: 'HKD',
    termsVersion: 'V2.0',
    riskVersion: 'V2.8',
    confirmedAt: '2026-05-10 09:17:31',
    refundStatus: '-',
    appliedAt: '2026-05-10 09:18',
    approvedAt: '2026-05-10 10:02',
    statusGroup: 'approved',
    status: '已赎回',
    risk: '低',
    type: '首次认购',
    rejectReason: '',
  },
  {
    id: 'INV-20260510-331a28cc',
    customer: 'perumily2@rulersonline.com',
    email: 'perumily2@rulersonline.com',
    product: '测试到期USDT_ERC20',
    amount: '1000 USDT_ERC20',
    fee: '1 USDT_ERC20',
    actualDebit: '1001 USDT_ERC20',
    holdingId: 'HLD-USDT-001',
    paymentAccountType: '香港账户',
    paymentAccountNo: '••••1234',
    paymentAccountId: 'acct-hk-1234',
    paymentAccount: '香港账户 · ••••1234',
    paymentCurrency: 'USDT_ERC20',
    defaultSettlementAccount: '新加坡账户 · ••••0950',
    settlementCurrency: 'USDT_ERC20',
    termsVersion: 'V2.1',
    riskVersion: 'V3.0',
    confirmedAt: '2026-05-10 11:19:54',
    refundStatus: '-',
    appliedAt: '2026-05-10 11:20',
    approvedAt: '2026-05-10 12:42',
    statusGroup: 'approved',
    status: '已到期',
    risk: '低',
    type: '追加认购',
    rejectReason: '',
  },
  {
    id: 'INV-20260512-244dfc18',
    customer: 'franciska33@rulersonline.com',
    email: 'franciska33@rulersonline.com',
    product: 'USDT_TRC20',
    amount: '200 USDT_TRC20',
    fee: '0.02 USDT_TRC20',
    actualDebit: '200.02 USDT_TRC20',
    holdingId: 'HLD-USDT-003',
    paymentAccountType: '美国账户',
    paymentAccountNo: '••••5678',
    paymentAccountId: 'acct-us-5678',
    paymentAccount: '美国账户 · ••••5678',
    paymentCurrency: 'USDT_TRC20',
    defaultSettlementAccount: '香港账户 · ••••1234',
    settlementCurrency: 'USDT_TRC20',
    termsVersion: 'V2.1',
    riskVersion: 'V3.0',
    confirmedAt: '2026-05-12 11:57:45',
    refundStatus: '待退款',
    refundAmount: '200.02 USDT_TRC20',
    refundTime: '-',
    refundFailedReason: '',
    appliedAt: '2026-05-12 11:58',
    approvedAt: '2026-05-12 12:09',
    statusGroup: 'rejected',
    status: '已拒绝',
    risk: '中',
    type: '追加认购',
    rejectReason: '客户风险等级与产品不匹配',
  },
]

const initialRedemptionOrders = [
  {
    id: '27',
    customer: 'okyqui42@rulersonline.com',
    email: 'okyqui42@rulersonline.com',
    product: 'ETH',
    principal: 'ETH 50.000000',
    income: 'ETH 0.027397',
    redeemAmount: 'ETH 50.027397',
    fee: 'ETH 0.1',
    actualAmount: 'ETH 49.927397',
    holdingAmount: 'ETH 50.027397',
    designatedAccountType: '香港账户',
    designatedAccountNo: '••••1234',
    designatedAccount: '香港账户 · ••••1234',
    designatedCurrency: 'ETH',
    actualSettlementAccount: '香港账户 · ••••1234',
    actualSettlementCurrency: 'ETH',
    settlementAmount: 'ETH 49.927397',
    settlementTime: '2026-05-13 14:45:10',
    settlementStatus: '已结算',
    exceptionReason: '',
    appliedAt: '2026-05-13 14:41',
    approvedAt: '2026-05-13 14:42',
    approver: '超级管理员',
    remark: '-',
    statusGroup: 'approved',
    status: '已通过',
  },
  {
    id: '26',
    customer: 'perumily2@rulersonline.com',
    email: 'perumily2@rulersonline.com',
    product: '测试到期USDT_ERC20',
    principal: '1000 USDT_ERC20',
    income: '0 USDT_ERC20',
    redeemAmount: '1000 USDT_ERC20',
    fee: '1 USDT_ERC20',
    actualAmount: '999 USDT_ERC20',
    holdingAmount: '1000 USDT_ERC20',
    designatedAccountType: '香港账户',
    designatedAccountNo: '••••1234',
    designatedAccount: '香港账户 · ••••1234',
    designatedCurrency: 'USDT_ERC20',
    actualSettlementAccount: '-',
    actualSettlementCurrency: 'USDT_ERC20',
    settlementAmount: '999 USDT_ERC20',
    settlementTime: '-',
    settlementStatus: '待人工处理',
    exceptionReason: '原指定到账账户已禁用',
    appliedAt: '2026-05-13 14:08',
    approvedAt: '2026-05-13 14:16',
    approver: '超级管理员',
    remark: '原指定账户异常，待人工处理',
    statusGroup: 'manual',
    status: '待人工处理',
  },
  {
    id: '25',
    customer: 'franciska33@rulersonline.com',
    email: 'franciska33@rulersonline.com',
    product: '港币',
    principal: '199.00 HKD',
    income: '0.92 HKD',
    redeemAmount: '199.92 HKD',
    fee: '0.19 HKD',
    actualAmount: '199.73 HKD',
    holdingAmount: '200.00 HKD',
    designatedAccountType: '香港账户',
    designatedAccountNo: '••••1234',
    designatedAccount: '香港账户 · ••••1234',
    designatedCurrency: 'HKD',
    actualSettlementAccount: '-',
    actualSettlementCurrency: 'HKD',
    settlementAmount: '199.73 HKD',
    settlementTime: '-',
    settlementStatus: '未结算',
    exceptionReason: '',
    appliedAt: '2026-05-12 18:38',
    approvedAt: '-',
    approver: '-',
    remark: '-',
    statusGroup: 'pending',
    status: '待审核',
  },
  {
    id: '24',
    customer: 'okyqui42@rulersonline.com',
    email: 'okyqui42@rulersonline.com',
    product: 'USDT_TRC20',
    principal: '500 USDT_TRC20',
    income: '0 USDT_TRC20',
    redeemAmount: '500 USDT_TRC20',
    fee: '0.05 USDT_TRC20',
    actualAmount: '499.95 USDT_TRC20',
    holdingAmount: '500 USDT_TRC20',
    designatedAccountType: '香港账户',
    designatedAccountNo: '••••1234',
    designatedAccount: '香港账户 · ••••1234',
    designatedCurrency: 'USDT_TRC20',
    actualSettlementAccount: '-',
    actualSettlementCurrency: 'USDT_TRC20',
    settlementAmount: '499.95 USDT_TRC20',
    settlementTime: '-',
    settlementStatus: '未结算',
    exceptionReason: '资料不完整，未执行结算',
    appliedAt: '2026-05-12 10:42',
    approvedAt: '2026-05-12 10:48',
    approver: '超级管理员',
    remark: '资料不完整',
    statusGroup: 'rejected',
    status: '已拒绝',
    rejectReason: '资料不完整',
  },
  {
    id: '23',
    customer: 'perumily2@rulersonline.com',
    email: 'perumily2@rulersonline.com',
    product: 'GLDB USD 1-Month Fixed Deposit',
    principal: '10,000.00 USD',
    income: '320.00 USD',
    redeemAmount: '10,320.00 USD',
    fee: '20.00 USD',
    actualAmount: '10,300.00 USD',
    holdingAmount: '10,320.00 USD',
    designatedAccountType: '新加坡账户',
    designatedAccountNo: '••••0950',
    designatedAccount: '新加坡账户 · ••••0950',
    designatedCurrency: 'USD',
    actualSettlementAccount: '新加坡账户 · ••••0950',
    actualSettlementCurrency: 'USD',
    settlementAmount: '10,300.00 USD',
    settlementTime: '2026-05-11 17:24:21',
    settlementStatus: '已结算',
    exceptionReason: '',
    appliedAt: '2026-05-11 17:12',
    approvedAt: '2026-05-11 17:20',
    approver: '超级管理员',
    remark: '-',
    statusGroup: 'approved',
    status: '已通过',
  },
  {
    id: '22',
    customer: 'franciska33@rulersonline.com',
    email: 'franciska33@rulersonline.com',
    product: '美元',
    principal: '120.00 USD',
    income: '0.00 USD',
    redeemAmount: '120.00 USD',
    fee: '0.00 USD',
    actualAmount: '120.00 USD',
    holdingAmount: '120.00 USD',
    designatedAccountType: '美国账户',
    designatedAccountNo: '••••5678',
    designatedAccount: '美国账户 · ••••5678',
    designatedCurrency: 'USD',
    actualSettlementAccount: '-',
    actualSettlementCurrency: 'USD',
    settlementAmount: '120.00 USD',
    settlementTime: '-',
    settlementStatus: '未结算',
    exceptionReason: '赎回申请已拒绝',
    appliedAt: '2026-05-09 09:21',
    approvedAt: '2026-05-09 09:37',
    approver: '超级管理员',
    remark: '客户主动取消后重新提交',
    statusGroup: 'rejected',
    status: '已拒绝',
    rejectReason: '客户主动取消后重新提交',
  },
]

const metricsByTab = {
  products: [
    { label: '产品总数', value: '23', icon: Landmark },
    { label: '管理规模', value: '2703', icon: LineChart },
    { label: '活跃客户', value: '4', icon: UsersRound },
    { label: '待处理订单', value: '15', icon: ShoppingCart },
  ],
  subscriptions: [
    { label: '待审批', value: '15', trend: '-1', icon: Clock3 },
    { label: '今日认购', value: '0', trend: '-100.0%', icon: Banknote },
    { label: '本月认购', value: '39', trend: '+100.0%', icon: BarChart3 },
    { label: '认购客户', value: '9', icon: UsersRound },
  ],
  redemptions: [
    { label: '待审批', value: '1', icon: Clock3 },
    { label: '今日赎回', value: '0', trend: '0%', icon: WalletCards },
    { label: '待人工处理', value: '1', icon: AlertTriangle },
    { label: '已通过', value: '18', icon: CheckCircle2 },
  ],
}

const mainTabs = [
  { id: 'products', label: '产品列表' },
  { id: 'subscriptions', label: '认购管理' },
  { id: 'redemptions', label: '赎回管理' },
]

const reviewTabs = [
  { id: 'pending', label: '待审核' },
  { id: 'approved', label: '已通过' },
  { id: 'rejected', label: '已拒绝' },
]

const redemptionTabs = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待审核' },
  { id: 'approved', label: '已通过' },
  { id: 'rejected', label: '已拒绝' },
  { id: 'manual', label: '待人工处理' },
]

const productDetailTabs = [
  { id: 'overview', label: '产品概览' },
  { id: 'customers', label: '认购客户' },
  { id: 'orders', label: '订单记录' },
  { id: 'nav', label: '净值管理' },
]

const manualSettlementAccounts = [
  { id: 'acct-sg-0950', label: '新加坡账户 · ••••0950', type: '新加坡账户', currency: 'USDT_ERC20', status: '激活' },
  { id: 'acct-us-5678', label: '美国账户 · ••••5678', type: '美国账户', currency: 'USDT_ERC20', status: '激活' },
]

const businessRulesByTab = {
  products: [
    '产品配置不新增支持香港/新加坡/美国/巴林账户等写死字段。',
    '付款账户统一读取账户类型配置中的“支持理财付款”能力。',
    '账户需激活、支持理财付款、支持投资币种，才可作为付款账户。',
    '新增账户类型只配置账户能力，不改理财产品代码。',
    '认购接口需做幂等、重复订单、重复扣款、产品额度并发校验。',
  ],
  subscriptions: [
    '付款账户是认购订单级字段，每笔认购独立记录真实资金来源。',
    '追加认购可重新选择付款账户，同一持仓可有多笔不同来源订单。',
    '手续费外扣，本金和手续费从本次付款账户扣除。',
    '认购失败、取消、拒绝后，资金必须原路退回本笔付款账户。',
  ],
  redemptions: [
    '赎回管理使用单层状态 Tab：全部、待审核、已通过、已拒绝、待人工处理。',
    '客户提交赎回后进入待审核；审核拒绝后进入已拒绝，不执行结算。',
    '审核通过后系统直接执行结算，正常完成后进入已通过。',
    '审核通过后如账户禁用、关闭、币种不可用或无法入账，进入待人工处理。',
    '待人工处理由运营手动选择客户其他激活且支持结算币种的账户重新处理，成功后状态变为已通过。',
    '短暂技术处理态仅作为系统内部状态，不作为运营筛选 Tab 展示。',
  ],
  detail: [
    '抽屉仅展示业务数据，不放右侧业务规则，避免撑宽详情弹层。',
    '认购详情保留原付款账户、拒绝原因和简洁退款状态，不展示独立退款模块。',
    '赎回详情合并结算账户信息，正常结算不重复展示实际结算账户。',
  ],
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function statusTone(status) {
  if (['上架', '在线', '持有中', '已通过'].includes(status)) return 'bg-[#55c900] text-white'
  if (['下架', '待审核', '暂停', '待退款'].includes(status)) return 'bg-[#ffad00] text-white'
  if (['已拒绝', '已取消', '退款失败'].includes(status)) return 'bg-[#ffe7e7] text-[#f04438]'
  if (['已到期', '已结束', '已赎回', '已结算', '已退款', '成功'].includes(status)) return 'bg-[#eef2ff] text-[#4f46e5]'
  if (status === '待人工处理') return 'bg-[#fff4df] text-[#b45309]'
  return 'bg-[#eef2f7] text-[#596174]'
}

function riskTone(risk) {
  if (risk === '低') return 'bg-[#58c70b] text-white'
  if (risk === '中') return 'bg-[#ffad00] text-white'
  return 'bg-[#f04438] text-white'
}

function MetricCard({ label, value, trend, icon: Icon }) {
  const trendColor = trend?.startsWith('+') ? 'text-[#13a352]' : trend?.startsWith('-') ? 'text-[#ef4444]' : 'text-[#8b91a4]'

  return (
    <article className="flex min-h-[104px] items-start justify-between rounded-[6px] bg-white px-[20px] py-[18px] shadow-[0_7px_16px_rgba(24,31,56,0.12)]">
      <div>
        <p className="text-[15px] leading-6 text-[#22233d]">{label}</p>
        <div className="mt-[10px] flex items-end gap-2">
          <p className="text-[28px] font-semibold leading-none text-[#292844]">{value}</p>
          {trend ? <span className={cn('pb-[3px] text-[12px] font-semibold', trendColor)}>{trend}</span> : null}
        </div>
      </div>
      <span className="flex h-[44px] w-[44px] items-center justify-center rounded-[6px] bg-[#dff3ff] text-[#13a8ff]">
        <Icon className="h-[25px] w-[25px]" strokeWidth={2} />
      </span>
    </article>
  )
}

function MainTabs({ activeTab, onChange }) {
  return (
    <div className="mt-[25px] flex border-b border-[#dedfe8]">
      {mainTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative h-[43px] px-[23px] text-[15px] transition',
            activeTab === tab.id ? 'font-semibold text-[#8b4fff]' : 'text-[#2f314f] hover:text-[#8b4fff]',
          )}
        >
          {tab.label}
          {activeTab === tab.id ? <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#8b4fff]" /> : null}
        </button>
      ))}
    </div>
  )
}

function SubTabs({ activeTab, onChange, tabs = reviewTabs }) {
  return (
    <div className="flex gap-[8px]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'h-[34px] rounded-[6px] px-[17px] text-[14px] font-semibold transition',
            activeTab === tab.id ? 'bg-[#8b4fff] text-white shadow-[0_4px_12px_rgba(139,79,255,0.25)]' : 'bg-[#f0f1f7] text-[#666b80] hover:bg-[#e7e0ff]',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function SearchInput({ placeholder = '搜索产品名称、ID...' }) {
  return (
    <label className="relative block w-full max-w-[450px]">
      <Search className="pointer-events-none absolute left-[14px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#37364f]" strokeWidth={1.9} />
      <input
        type="text"
        placeholder={placeholder}
        className="h-[56px] w-full rounded-[6px] border border-[#d6d8e3] bg-white pl-[38px] pr-[16px] text-[14px] text-[#25263e] outline-none transition placeholder:text-[#a2a6b8] focus:border-[#8b4fff] focus:ring-2 focus:ring-[#8b4fff]/10"
      />
    </label>
  )
}

function StatusBadge({ status }) {
  return (
    <span className={cn('inline-flex h-[24px] min-w-[50px] items-center justify-center rounded-full px-[11px] text-[13px] font-semibold', statusTone(status))}>
      {status}
    </span>
  )
}

function RiskBadge({ risk }) {
  return <span className={cn('inline-flex h-[24px] w-[38px] items-center justify-center rounded-full text-[13px] font-semibold', riskTone(risk))}>{risk}</span>
}

function IconButton({ label, children, onClick }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full text-[#8b4fff] transition hover:bg-[#efe8ff]">
      {children}
    </button>
  )
}

function AdminHeader({ onBack }) {
  return (
    <div className="mb-[20px] flex items-center justify-between">
      <button type="button" onClick={onBack} className="flex items-center gap-[8px] rounded-[6px] px-[4px] py-[6px] text-[14px] font-semibold text-[#5c6175] transition hover:text-[#8b4fff]">
        <ArrowLeft className="h-[17px] w-[17px]" />
        返回理财多账户入口
      </button>
      <div className="text-right">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8b4fff]">FIDERE TRUST</p>
        <p className="mt-[3px] text-[13px] text-[#7a7f91]">理财产品管理端原型</p>
      </div>
    </div>
  )
}

function AdminCard({ children }) {
  return <section className="rounded-[6px] bg-white px-[16px] py-[22px] shadow-[0_7px_18px_rgba(24,31,56,0.08)]">{children}</section>
}

function BusinessRulesPanel({ title = '业务规则', rules }) {
  return (
    <aside className="sticky top-[24px] rounded-[6px] border border-[#e5ddff] bg-[#fbf9ff] p-[16px] shadow-[0_7px_18px_rgba(24,31,56,0.06)]">
      <div className="flex items-center gap-[8px] text-[#7c3aed]">
        <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={2} />
        <h2 className="text-[16px] font-semibold">{title}</h2>
      </div>
      <p className="mt-[8px] text-[12px] leading-5 text-[#8a7ca7]">注释区，不属于正式后台 UI。</p>
      <ul className="mt-[12px] space-y-[9px]">
        {rules.map((rule) => (
          <li key={rule} className="rounded-[6px] bg-white px-[10px] py-[9px] text-[13px] leading-5 text-[#4f5268] shadow-sm">
            {rule}
          </li>
        ))}
      </ul>
    </aside>
  )
}

function ProductListView({ onOpenProduct, tabs }) {
  return (
    <>
      <div className="flex items-start justify-between gap-4 px-[4px]">
        <div>
          <h1 className="text-[19px] font-medium text-[#22233d]">理财产品</h1>
          <p className="mt-[6px] text-[15px] text-[#72778c]">管理理财产品和客户订单</p>
        </div>
        <button type="button" className="mt-[-2px] inline-flex h-[38px] items-center gap-[8px] rounded-[6px] bg-[#8b4fff] px-[17px] text-[14px] font-semibold text-white shadow-[0_5px_12px_rgba(139,79,255,0.35)] hover:bg-[#7b3ffc]">
          <Plus className="h-[16px] w-[16px]" />
          添加产品
        </button>
      </div>

      {tabs}

      <div className="mt-[16px]">
        <SearchInput />
      </div>

      <div className="mt-[16px] overflow-hidden rounded-[4px]">
        <table className="w-full border-collapse text-left text-[14px]">
          <thead>
            <tr className="h-[56px] bg-[#f4f5fb] text-[#20213b]">
              <th className="w-[27%] px-[19px] font-medium">产品信息</th>
              <th className="w-[18%] px-[19px] font-medium">类型/风险等级</th>
              <th className="w-[18%] px-[19px] text-center font-medium">预期/实际收益</th>
              <th className="w-[18%] px-[19px] text-center font-medium">管理规模</th>
              <th className="w-[9%] px-[19px] text-center font-medium">认购人数</th>
              <th className="w-[7%] px-[19px] text-center font-medium">状态</th>
              <th className="w-[8%] px-[19px] text-center font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 4).map((product) => (
              <tr key={product.id} className="h-[72px] border-b border-[#e5e7ef] text-[#272842]">
                <td className="px-[19px]">
                  <p className="font-semibold">{product.name}</p>
                  <p className="mt-[6px] text-[#535970]">{product.code}</p>
                </td>
                <td className="px-[19px]">
                  <p>{product.type}</p>
                  <RiskBadge risk={product.risk} />
                </td>
                <td className="px-[19px] text-center font-mono text-[13px]">
                  <p className="font-semibold text-[#37c600]">{product.expectedYield}</p>
                  <p className="mt-[6px] text-[#35384f]">实际：{product.actualYield}</p>
                </td>
                <td className="px-[19px] text-center font-mono text-[13px]">{product.scale}</td>
                <td className="px-[19px] text-center">
                  <span className="inline-flex h-[25px] min-w-[36px] items-center justify-center rounded-full border border-[#e1e4eb] bg-white text-[13px]">{product.investors}</span>
                </td>
                <td className="px-[19px] text-center">
                  <StatusBadge status={product.status} />
                </td>
                <td className="px-[19px] text-center">
                  <div className="flex justify-center gap-[6px]">
                    <IconButton label="查看产品详情" onClick={() => onOpenProduct(product)}>
                      <Eye className="h-[18px] w-[18px]" strokeWidth={2.3} />
                    </IconButton>
                    <IconButton label="编辑产品">
                      <Edit3 className="h-[18px] w-[18px]" strokeWidth={2.3} />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </>
  )
}

function ProductInfoRow({ label, value, badge }) {
  return (
    <div className="grid min-h-[48px] grid-cols-[150px_1fr] items-center rounded-[6px] bg-[#f6f7fb] px-[16px]">
      <span className="text-[14px] text-[#73788c]">{label}</span>
      <span className="text-[14px] font-semibold text-[#24253f]">{badge || value}</span>
    </div>
  )
}

function ProductDetailView({ product, activeTab, onChangeTab, onBack }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="mb-[18px] inline-flex items-center gap-[8px] text-[14px] font-semibold text-[#61667a] hover:text-[#8b4fff]">
        <ArrowLeft className="h-[17px] w-[17px]" />
        返回产品列表
      </button>

      <div className="rounded-[6px] bg-white p-[22px] shadow-[0_7px_18px_rgba(24,31,56,0.08)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-[9px]">
              <h1 className="text-[25px] font-semibold leading-none text-[#24243d]">{product.name}</h1>
              <StatusBadge status={product.status === '上架' ? '在线' : product.status} />
              <RiskBadge risk={product.risk} />
            </div>
            <p className="mt-[11px] text-[14px] text-[#72778c]">产品编号：{product.productNo}</p>
          </div>
        </div>

        <div className="mt-[22px] grid grid-cols-4 gap-[18px]">
          <SmallStat label="管理规模" value={product.id === 'mature-usdt-erc20' ? '1000' : '10000万'} icon={LineChart} />
          <SmallStat label="认购人数" value={`${product.investors}人`} icon={UsersRound} />
          <SmallStat label="实际收益" value={product.actualYield} icon={BarChart3} />
          <SmallStat label="运行天数" value="0天" icon={CalendarDays} />
        </div>

        <div className="mt-[25px] flex border-b border-[#e2e4ec]">
          {productDetailTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={cn(
                'relative h-[42px] px-[21px] text-[15px] transition',
                activeTab === tab.id ? 'font-semibold text-[#8b4fff]' : 'text-[#30324f] hover:text-[#8b4fff]',
              )}
            >
              {tab.label}
              {activeTab === tab.id ? <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#8b4fff]" /> : null}
            </button>
          ))}
        </div>

        {activeTab === 'overview' ? <ProductOverview product={product} /> : null}
        {activeTab === 'customers' ? <ProductCustomers /> : null}
        {activeTab === 'orders' ? <ProductOrders /> : null}
        {activeTab === 'nav' ? <ProductNavManagement /> : null}
      </div>
    </div>
  )
}

function SmallStat({ label, value, icon: Icon }) {
  return (
    <article className="flex min-h-[96px] items-center gap-[14px] rounded-[6px] bg-[#f6f7fb] px-[18px]">
      <span className="flex h-[42px] w-[42px] items-center justify-center rounded-[6px] bg-[#e7f5ff] text-[#13a8ff]">
        <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
      </span>
      <div>
        <p className="text-[23px] font-semibold leading-none text-[#22233d]">{value}</p>
        <p className="mt-[9px] text-[14px] text-[#73788c]">{label}</p>
      </div>
    </article>
  )
}

function ProductOverview({ product }) {
  return (
    <div className="mt-[24px] grid grid-cols-[1.05fr_0.95fr] gap-[24px]">
      <section>
        <h2 className="mb-[15px] text-[17px] font-semibold text-[#22233d]">基本信息</h2>
        <div className="space-y-[10px]">
          <ProductInfoRow label="产品类型" value={product.type.split(' · ')[0]} />
          <ProductInfoRow label="风险等级" badge={<RiskBadge risk={product.risk} />} />
          <ProductInfoRow label="预期收益率" value={product.expectedYield} />
          <ProductInfoRow label="实际收益率" value={product.actualYield} />
          <ProductInfoRow label="起购金额" value={product.minAmount} />
          <ProductInfoRow label="产品期限" value={product.period} />
          <ProductInfoRow label="到期日期" value={product.dueDate} />
        </div>
      </section>
      <section>
        <h2 className="mb-[15px] text-[17px] font-semibold text-[#22233d]">产品描述</h2>
        <div className="min-h-[220px] rounded-[6px] bg-[#f6f7fb] p-[18px] text-[14px] leading-7 text-[#596174]">
          {product.description}
        </div>
      </section>
    </div>
  )
}

function ProductCustomers() {
  return (
    <div className="mt-[24px]">
      <h2 className="mb-[15px] text-[17px] font-semibold text-[#22233d]">认购客户列表</h2>
      <div className="overflow-hidden rounded-[4px] border border-[#e5e7ef]">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-[#f4f5fb] text-[#22233d]">
            <tr className="h-[52px]">
              <th className="px-[17px] font-medium">客户编号</th>
              <th className="px-[17px] font-medium">交易编号</th>
              <th className="px-[17px] font-medium">客户姓名</th>
              <th className="px-[17px] font-medium">认购金额</th>
              <th className="px-[17px] font-medium">认购日期</th>
              <th className="px-[17px] text-center font-medium">状态</th>
            </tr>
          </thead>
          <tbody>
            {customerRows.map((row) => (
              <tr key={row.tradeNo} className="h-[62px] border-t border-[#e5e7ef]">
                <td className="px-[17px]">{row.customerNo}</td>
                <td className="px-[17px] font-mono text-[13px]">{row.tradeNo}</td>
                <td className="px-[17px]">{row.name}</td>
                <td className="px-[17px] font-semibold">{row.amount}</td>
                <td className="px-[17px]">{row.date}</td>
                <td className="px-[17px] text-center"><StatusBadge status={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-[18px] flex justify-end gap-[8px] text-[13px] text-[#7a7f91]">
        <button type="button" className="rounded-[5px] border border-[#dfe1eb] px-[10px] py-[6px]">上一页</button>
        <button type="button" className="rounded-[5px] bg-[#8b4fff] px-[10px] py-[6px] text-white">1</button>
        <button type="button" className="rounded-[5px] border border-[#dfe1eb] px-[10px] py-[6px]">下一页</button>
      </div>
    </div>
  )
}

function ProductOrders() {
  return (
    <div className="mt-[24px]">
      <h2 className="mb-[15px] text-[17px] font-semibold text-[#22233d]">订单记录</h2>
      <div className="overflow-hidden rounded-[4px] border border-[#e5e7ef]">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-[#f4f5fb] text-[#22233d]">
            <tr className="h-[52px]">
              <th className="px-[17px] font-medium">订单号</th>
              <th className="px-[17px] font-medium">客户</th>
              <th className="px-[17px] text-center font-medium">类型</th>
              <th className="px-[17px] font-medium">金额</th>
              <th className="px-[17px] font-medium">时间</th>
              <th className="px-[17px] text-center font-medium">状态</th>
            </tr>
          </thead>
          <tbody>
            {productOrders.map((row) => (
              <tr key={row.orderNo} className="h-[62px] border-t border-[#e5e7ef]">
                <td className="px-[17px] font-mono text-[13px]">{row.orderNo}</td>
                <td className="px-[17px]">{row.customer}</td>
                <td className="px-[17px] text-center"><span className="rounded-full bg-[#edf4ff] px-[11px] py-[4px] text-[13px] font-semibold text-[#2f6fec]">{row.type}</span></td>
                <td className="px-[17px] font-semibold">{row.amount}</td>
                <td className="px-[17px]">{row.time}</td>
                <td className="px-[17px] text-center"><StatusBadge status={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ProductNavManagement() {
  return (
    <div className="mt-[24px] grid grid-cols-[1fr_320px] gap-[22px]">
      <div className="overflow-hidden rounded-[4px] border border-[#e5e7ef]">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-[#f4f5fb] text-[#22233d]">
            <tr className="h-[52px]">
              <th className="px-[17px] font-medium">日期</th>
              <th className="px-[17px] font-medium">单位净值</th>
              <th className="px-[17px] font-medium">累计净值</th>
              <th className="px-[17px] font-medium">更新时间</th>
            </tr>
          </thead>
          <tbody>
            {['2026-05-13', '2026-05-12', '2026-05-11'].map((date, index) => (
              <tr key={date} className="h-[60px] border-t border-[#e5e7ef]">
                <td className="px-[17px]">{date}</td>
                <td className="px-[17px] font-mono">{(1 + index * 0.0023).toFixed(4)}</td>
                <td className="px-[17px] font-mono">{(1.013 + index * 0.0031).toFixed(4)}</td>
                <td className="px-[17px]">2026-05-13 18:00</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <aside className="rounded-[6px] bg-[#f6f7fb] p-[18px]">
        <h3 className="text-[16px] font-semibold text-[#22233d]">净值维护</h3>
        <p className="mt-[9px] text-[14px] leading-6 text-[#687083]">记录每日收益和净值变动，用于客户端每日收益明细与管理端运营复核。</p>
        <button type="button" className="mt-[18px] h-[38px] rounded-[6px] bg-[#8b4fff] px-[16px] text-[14px] font-semibold text-white">新增净值</button>
      </aside>
    </div>
  )
}

function ReviewManagementView({ kind, activeStatus, onChangeStatus, orders, onOpen, tabs }) {
  const isSubscription = kind === 'subscriptions'
  const rows = orders.filter((order) => (
    isSubscription
      ? order.statusGroup === activeStatus
      : activeStatus === 'all' || order.statusGroup === activeStatus
  ))
  const statusTabs = isSubscription ? reviewTabs : redemptionTabs

  return (
    <>
      <div className="flex items-start justify-between gap-4 px-[4px]">
        <div>
          <h1 className="text-[19px] font-medium text-[#22233d]">{isSubscription ? '认购管理' : '赎回管理'}</h1>
          <p className="mt-[6px] text-[15px] text-[#72778c]">{isSubscription ? '审核客户理财认购申请' : '审核客户理财赎回申请'}</p>
        </div>
      </div>

      {tabs}

      <div className="mt-[20px] flex items-center justify-between gap-4">
        <SubTabs activeTab={activeStatus} onChange={onChangeStatus} tabs={statusTabs} />
        <SearchInput placeholder={isSubscription ? '搜索订单号、客户、产品...' : '搜索赎回编号、客户、产品...'} />
      </div>

      <div className="mt-[16px] overflow-x-auto rounded-[4px]">
        {isSubscription ? (
          <SubscriptionTable rows={rows} onOpen={onOpen} />
        ) : (
          <RedemptionTable rows={rows} onOpen={onOpen} />
        )}
      </div>
    </>
  )
}

function getCurrentSettlementAccount(order) {
  return order.actualSettlementAccount && order.actualSettlementAccount !== '-' ? order.actualSettlementAccount : order.designatedAccount
}

function getAccountDisplay(accountType, accountNo, accountLabel) {
  if (accountType) return accountType
  if (!accountLabel || accountLabel === '-') return accountLabel || '-'
  return accountLabel.split('·')[0].trim()
}

function SubscriptionTable({ rows, onOpen }) {
  return (
    <table className="w-full min-w-[1240px] border-collapse text-left text-[14px]">
      <thead>
        <tr className="h-[56px] bg-[#f4f5fb] text-[#20213b]">
          <th className="px-[18px] font-medium">订单号</th>
          <th className="px-[18px] font-medium">客户信息</th>
          <th className="px-[18px] font-medium">产品</th>
          <th className="px-[18px] font-medium">认购类型</th>
          <th className="px-[18px] font-medium">付款账户</th>
          <th className="px-[18px] font-medium">认购金额</th>
          <th className="px-[18px] font-medium">申请时间</th>
          <th className="px-[18px] font-medium">审批时间</th>
          <th className="px-[18px] text-center font-medium">操作</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((order) => (
          <tr key={order.id} className="h-[70px] border-b border-[#e5e7ef] text-[#272842]">
            <td className="px-[18px] font-mono text-[13px]">{order.id}</td>
            <td className="px-[18px]">
              <p className="font-semibold">{order.customer}</p>
              <p className="mt-[4px] text-[12px] text-[#74798c]">{order.email}</p>
            </td>
            <td className="px-[18px] font-semibold">{order.product}</td>
            <td className="px-[18px]"><span className="rounded-full bg-[#edf4ff] px-[10px] py-[4px] text-[13px] font-semibold text-[#2f6fec]">{order.type}</span></td>
            <td className="min-w-[160px] px-[18px]">
              <p className="font-semibold">{getAccountDisplay(order.paymentAccountType, order.paymentAccountNo, order.paymentAccount)}</p>
            </td>
            <td className="px-[18px] font-semibold">{order.amount}</td>
            <td className="px-[18px]">{order.appliedAt}</td>
            <td className="px-[18px]">{order.approvedAt}</td>
            <td className="px-[18px] text-center">
              <IconButton label="查看认购详情" onClick={() => onOpen(order)}>
                <Eye className="h-[18px] w-[18px]" strokeWidth={2.3} />
              </IconButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function RedemptionTable({ rows, onOpen }) {
  return (
    <table className="w-full min-w-[1380px] border-collapse text-left text-[14px]">
      <thead>
        <tr className="h-[56px] bg-[#f4f5fb] text-[#20213b]">
          <th className="px-[16px] font-medium">赎回编号</th>
          <th className="px-[16px] font-medium">客户信息</th>
          <th className="px-[16px] font-medium">产品</th>
          <th className="px-[16px] font-medium">当前结算账户</th>
          <th className="px-[16px] font-medium">赎回金额</th>
          <th className="px-[16px] font-medium">持有金额</th>
          <th className="px-[16px] font-medium">申请时间</th>
          <th className="px-[16px] font-medium">审批时间</th>
          <th className="px-[16px] font-medium">审批人</th>
          <th className="px-[16px] font-medium">审批备注</th>
          <th className="px-[16px] text-center font-medium">状态</th>
          <th className="px-[16px] text-center font-medium">操作</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((order) => (
          <tr key={order.id} className="h-[70px] border-b border-[#e5e7ef] text-[#272842]">
            <td className="px-[16px] font-mono text-[13px]">{order.id}</td>
            <td className="px-[16px]">
              <p className="font-semibold">{order.customer}</p>
              <p className="mt-[4px] text-[12px] text-[#74798c]">{order.email}</p>
            </td>
            <td className="px-[16px] font-semibold">{order.product}</td>
            <td className="min-w-[170px] px-[16px]">
              <p className="font-semibold">{getAccountDisplay('', '', getCurrentSettlementAccount(order))}</p>
            </td>
            <td className="px-[16px] font-semibold text-[#ef4444]">{order.redeemAmount}</td>
            <td className="px-[16px]">{order.holdingAmount}</td>
            <td className="px-[16px]">{order.appliedAt}</td>
            <td className="px-[16px]">{order.approvedAt}</td>
            <td className="px-[16px]">{order.approver}</td>
            <td className="px-[16px]">{order.remark}</td>
            <td className="px-[16px] text-center"><StatusBadge status={order.status} /></td>
            <td className="px-[16px] text-center">
              <IconButton label="查看赎回详情" onClick={() => onOpen(order)}>
                <Eye className="h-[18px] w-[18px]" strokeWidth={2.3} />
              </IconButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function DetailField({ label, value, copyable = false, tone }) {
  return (
    <div className={cn('rounded-[8px] bg-[#f6f7fb] p-[14px]', tone === 'danger' && 'bg-[#fff2f2]', tone === 'blue' && 'bg-[#f1f7ff]')}>
      <p className={cn('text-[13px] text-[#818799]', tone === 'danger' && 'text-[#ef4444]', tone === 'blue' && 'text-[#3578e5]')}>{label}</p>
      <div className="mt-[7px] flex items-center justify-between gap-[10px]">
        <p className="break-all text-[14px] font-semibold text-[#262840]">{value}</p>
        {copyable ? <Copy className="h-[15px] w-[15px] shrink-0 text-[#9aa0b4]" strokeWidth={2} /> : null}
      </div>
    </div>
  )
}

function DetailSection({ title, icon: Icon, children }) {
  return (
    <section className="mt-[20px]">
      <div className="mb-[12px] flex items-center gap-[8px]">
        {Icon ? <Icon className="h-[17px] w-[17px] text-[#8b4fff]" strokeWidth={2} /> : null}
        <h3 className="text-[17px] font-semibold text-[#25263f]">{title}</h3>
      </div>
      <div className="space-y-[10px]">{children}</div>
    </section>
  )
}

function DrawerShell({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#111827]/35">
      <aside className="ml-auto flex h-full w-[430px] flex-col bg-white shadow-[-12px_0_26px_rgba(15,23,42,0.16)]">
        <header className="flex h-[64px] items-center justify-between border-b border-[#e6e8f0] px-[22px]">
          <h2 className="text-[20px] font-semibold text-[#24243d]">{title}</h2>
          <button type="button" aria-label="关闭详情抽屉" onClick={onClose} className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-[#6b7280] hover:bg-[#f1f2f7]">
            <X className="h-[20px] w-[20px]" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-[22px] py-[20px]">{children}</div>
        {footer ? <footer className="flex justify-end gap-[10px] border-t border-[#e6e8f0] px-[22px] py-[16px]">{footer}</footer> : null}
      </aside>
    </div>
  )
}

function OrderHero({ order, kind }) {
  const isRedemption = kind === 'redemption'

  return (
    <div className="rounded-[10px] border border-[#eef0f5] bg-white p-[16px] shadow-[0_6px_18px_rgba(24,31,56,0.08)]">
      <div className="flex items-start gap-[12px]">
        <span className={cn('flex h-[44px] w-[44px] items-center justify-center rounded-[10px]', isRedemption ? 'bg-[#ffe8e8] text-[#ef4444]' : 'bg-[#e7f8ef] text-[#14a85f]')}>
          <DollarSign className="h-[24px] w-[24px]" strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-[10px]">
            <div>
              <p className="truncate text-[16px] font-semibold text-[#25263f]">{order.product}</p>
              <p className="mt-[6px] text-[13px] text-[#818799]">{order.appliedAt}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </div>
      </div>
    </div>
  )
}

function RejectReasonField({ value, onChange, placeholder = '请输入拒绝原因' }) {
  return (
    <label className="mt-[16px] block">
      <span className="text-[14px] font-semibold text-[#24243d]">拒绝原因</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-[8px] min-h-[86px] w-full resize-none rounded-[6px] border border-[#d6d8e3] px-[12px] py-[10px] text-[14px] outline-none focus:border-[#8b4fff] focus:ring-2 focus:ring-[#8b4fff]/10"
        placeholder={placeholder}
      />
    </label>
  )
}

function SubscriptionDrawer({ order, onClose, onDecision }) {
  const [rejectReason, setRejectReason] = useState(order?.rejectReason || '')

  useEffect(() => {
    setRejectReason(order?.rejectReason || '')
  }, [order?.id, order?.rejectReason])

  if (!order) return null
  const isPending = order.statusGroup === 'pending'
  const hasRefund = order.refundStatus && order.refundStatus !== '-'

  return (
    <DrawerShell
      title="认购详情"
      onClose={onClose}
      footer={
        isPending ? (
          <>
            <button type="button" onClick={() => onDecision(order.id, 'rejected', rejectReason)} className="h-[38px] rounded-[6px] border border-[#ffb4b4] px-[18px] text-[14px] font-semibold text-[#ef4444] hover:bg-[#fff1f1]">拒绝</button>
            <button type="button" onClick={() => onDecision(order.id, 'approved')} className="h-[38px] rounded-[6px] bg-[#8b4fff] px-[18px] text-[14px] font-semibold text-white hover:bg-[#7b3ffc]">通过</button>
          </>
        ) : null
      }
    >
      <OrderHero order={order} kind="subscription" />
      <div className="mt-[18px] rounded-[10px] bg-[#ecfff4] px-[18px] py-[20px] text-center">
        <p className="text-[28px] font-semibold leading-none text-[#15a65a]">{order.amount}</p>
        <p className="mt-[8px] text-[13px] text-[#599b75]">投资金额</p>
      </div>
      <DetailField label="手续费" value={order.fee} />
      <DetailField label="实际扣款" value={order.actualDebit} tone="blue" />

      <DetailSection title="订单详情" icon={FileText}>
        <DetailField label="订单号" value={order.id} copyable />
        <DetailField label="客户" value={order.email} />
        <DetailField label="认购类型" value={order.type} />
        <DetailField label="付款账户" value={`${getAccountDisplay(order.paymentAccountType, order.paymentAccountNo, order.paymentAccount)} / ${order.paymentCurrency}`} />
        <DetailField label="申请时间" value={order.appliedAt} />
        <DetailField label="审批时间" value={order.approvedAt} />
        <DetailField label="风险等级" value={order.risk} />
        {hasRefund ? <DetailField label="退款状态" value={order.refundStatus} /> : null}
        {order.rejectReason ? <DetailField label="拒绝原因" value={order.rejectReason} tone="danger" /> : null}
      </DetailSection>

      {isPending ? (
        <RejectReasonField value={rejectReason} onChange={setRejectReason} placeholder="如需拒绝该认购申请，请填写拒绝原因。" />
      ) : null}
    </DrawerShell>
  )
}

function RedemptionDrawer({ order, onClose, onDecision, onManualSettlement }) {
  const [rejectReason, setRejectReason] = useState(order?.rejectReason || order?.remark || '')

  useEffect(() => {
    setRejectReason(order?.rejectReason || order?.remark || '')
  }, [order?.id, order?.rejectReason, order?.remark])

  if (!order) return null
  const isPending = order.statusGroup === 'pending'
  const needsManualSettlement = order.statusGroup === 'manual' || order.status === '待人工处理'

  return (
    <DrawerShell
      title="赎回详情"
      onClose={onClose}
      footer={
        isPending ? (
          <>
            <button type="button" onClick={() => onDecision(order.id, 'rejected', rejectReason)} className="h-[38px] rounded-[6px] border border-[#ffb4b4] px-[18px] text-[14px] font-semibold text-[#ef4444] hover:bg-[#fff1f1]">拒绝</button>
            <button type="button" onClick={() => onDecision(order.id, 'approved')} className="h-[38px] rounded-[6px] bg-[#8b4fff] px-[18px] text-[14px] font-semibold text-white hover:bg-[#7b3ffc]">通过</button>
          </>
        ) : null
      }
    >
      <OrderHero order={order} kind="redemption" />
      <div className="mt-[18px] rounded-[10px] bg-[#fff1f1] px-[18px] py-[20px] text-center">
        <p className="text-[28px] font-semibold leading-none text-[#ef4444]">{order.redeemAmount}</p>
        <p className="mt-[8px] text-[13px] text-[#a76363]">赎回金额</p>
      </div>

      <DetailSection title="订单信息" icon={FileText}>
        <DetailField label="订单号" value={order.id} copyable />
        <DetailField label="客户" value={order.email} />
        <DetailField label="申请时间" value={order.appliedAt} />
        <DetailField label="审批时间" value={order.approvedAt} />
        <DetailField label="审批人" value={order.approver} />
        <DetailField label="审批备注" value={order.remark} />
        {order.rejectReason ? <DetailField label="拒绝原因" value={order.rejectReason} tone="danger" /> : null}
      </DetailSection>

      {isPending ? (
        <RejectReasonField value={rejectReason} onChange={setRejectReason} placeholder="如需拒绝该赎回申请，请填写拒绝原因。" />
      ) : null}

      <DetailSection title="赎回资金" icon={Banknote}>
        <DetailField label="本金" value={order.principal} />
        <DetailField label="收益" value={order.income} />
        <DetailField label="手续费" value={order.fee} />
        <DetailField label="实际到账" value={order.actualAmount} tone="blue" />
      </DetailSection>

      <DetailSection title="结算信息" icon={WalletCards}>
        <DetailField label="客户指定账户" value={getAccountDisplay(order.designatedAccountType, order.designatedAccountNo, order.designatedAccount)} />
        <DetailField label="实际到账金额" value={order.actualAmount} tone="blue" />
        <DetailField label="结算时间" value={order.settlementTime} />
        {order.exceptionReason ? <DetailField label="异常原因" value={order.exceptionReason} tone="danger" /> : null}
      </DetailSection>

      {order.manualSettlementRecord ? (
        <DetailSection title="人工修改记录" icon={Edit3}>
          <DetailField label="原客户指定账户" value={getAccountDisplay(order.designatedAccountType, order.designatedAccountNo, order.manualSettlementRecord.originalAccount)} />
          <DetailField label="实际结算账户" value={getAccountDisplay('', '', order.manualSettlementRecord.actualAccount)} />
          <DetailField label="变更原因" value={order.manualSettlementRecord.reason} />
          <DetailField label="操作人" value={order.manualSettlementRecord.operator} />
          <DetailField label="操作时间" value={order.manualSettlementRecord.operatedAt} />
        </DetailSection>
      ) : null}

      {needsManualSettlement ? (
        <button
          type="button"
          onClick={() => onManualSettlement(order)}
          className="mt-[18px] flex h-[42px] w-full items-center justify-center gap-[8px] rounded-[6px] bg-[#8b4fff] text-[14px] font-semibold text-white shadow-[0_5px_12px_rgba(139,79,255,0.35)] hover:bg-[#7b3ffc]"
        >
          <WalletCards className="h-[17px] w-[17px]" />
          选择新的结算账户
        </button>
      ) : null}
    </DrawerShell>
  )
}

function ManualSettlementModal({ order, selectedAccountId, note, onSelectAccount, onChangeNote, onClose, onConfirm }) {
  if (!order) return null
  const selectedAccount = manualSettlementAccounts.find((account) => account.id === selectedAccountId)

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#111827]/45 px-4">
      <section className="w-full max-w-[620px] rounded-[8px] bg-white shadow-[0_22px_60px_rgba(15,23,42,0.25)]">
        <header className="flex items-center justify-between border-b border-[#e6e8f0] px-[22px] py-[18px]">
          <div>
            <h2 className="text-[20px] font-semibold text-[#24243d]">选择新的结算账户</h2>
            <p className="mt-[5px] text-[13px] text-[#7a7f91]">原指定账户异常时，由运营人工选择客户其他有效账户。</p>
          </div>
          <button type="button" aria-label="关闭人工结算弹窗" onClick={onClose} className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-[#6b7280] hover:bg-[#f1f2f7]">
            <X className="h-[20px] w-[20px]" />
          </button>
        </header>

        <div className="space-y-[16px] px-[22px] py-[18px]">
          <div className="grid grid-cols-2 gap-[12px]">
            <DetailField label="赎回订单" value={order.id} />
            <DetailField label="结算金额" value={order.settlementAmount} />
            <DetailField label="客户原指定到账账户" value={getAccountDisplay(order.designatedAccountType, order.designatedAccountNo, order.designatedAccount)} tone="danger" />
            <DetailField label="异常原因" value={order.exceptionReason || '账户不可用'} tone="danger" />
          </div>

          <div>
            <h3 className="mb-[10px] text-[15px] font-semibold text-[#24243d]">请选择新的结算账户</h3>
            <div className="space-y-[9px]">
              {manualSettlementAccounts.map((account) => (
                <label
                  key={account.id}
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded-[6px] border px-[14px] py-[12px] transition',
                    selectedAccountId === account.id ? 'border-[#8b4fff] bg-[#fbf9ff]' : 'border-[#e2e4ec] bg-white hover:border-[#c9bbff]',
                  )}
                >
                  <span className="flex items-center gap-[10px]">
                    <input
                      type="radio"
                      name="manualSettlementAccount"
                      checked={selectedAccountId === account.id}
                      onChange={() => onSelectAccount(account.id)}
                      className="h-[16px] w-[16px] accent-[#8b4fff]"
                    />
                    <span>
                      <span className="block text-[14px] font-semibold text-[#24243d]">{getAccountDisplay(account.type, '', account.label)}</span>
                      <span className="mt-[3px] block text-[12px] text-[#777d90]">{account.currency}</span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-[14px] font-semibold text-[#24243d]">处理原因 / 操作备注</span>
            <textarea
              value={note}
              onChange={(event) => onChangeNote(event.target.value)}
              className="mt-[8px] min-h-[92px] w-full resize-none rounded-[6px] border border-[#d6d8e3] px-[12px] py-[10px] text-[14px] outline-none focus:border-[#8b4fff] focus:ring-2 focus:ring-[#8b4fff]/10"
              placeholder="客户原指定香港账户已禁用，经人工处理改为客户有效的新加坡账户结算。"
            />
          </label>

          <div className="rounded-[6px] bg-[#fff8ed] px-[12px] py-[10px] text-[13px] leading-5 text-[#9a5b00]">
            人工结算不会覆盖客户原指定账户；后台需同时保留原账户、新账户、操作人、操作时间、异常原因和处理备注。
          </div>
        </div>

        <footer className="flex justify-end gap-[10px] border-t border-[#e6e8f0] px-[22px] py-[16px]">
          <button type="button" onClick={onClose} className="h-[38px] rounded-[6px] border border-[#d6d8e3] px-[18px] text-[14px] font-semibold text-[#555b70] hover:bg-[#f6f7fb]">取消</button>
          <button
            type="button"
            onClick={() => selectedAccount && note.trim() ? onConfirm(selectedAccount) : null}
            disabled={!selectedAccount || !note.trim()}
            className="h-[38px] rounded-[6px] bg-[#8b4fff] px-[18px] text-[14px] font-semibold text-white shadow-[0_5px_12px_rgba(139,79,255,0.28)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            确认修改并结算
          </button>
        </footer>
      </section>
    </div>
  )
}

export function WealthProductAdminPrototype({ onBack }) {
  const [activeMainTab, setActiveMainTab] = useState('products')
  const [subscriptionStatus, setSubscriptionStatus] = useState('pending')
  const [redemptionStatus, setRedemptionStatus] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productDetailTab, setProductDetailTab] = useState('overview')
  const [subscriptionOrders, setSubscriptionOrders] = useState(initialSubscriptionOrders)
  const [redemptionOrders, setRedemptionOrders] = useState(initialRedemptionOrders)
  const [drawer, setDrawer] = useState(null)
  const [manualSettlementOrder, setManualSettlementOrder] = useState(null)
  const [manualSettlementAccountId, setManualSettlementAccountId] = useState('acct-sg-0950')
  const [manualSettlementNote, setManualSettlementNote] = useState('客户原指定香港账户已禁用，经人工处理改为客户有效的新加坡账户结算。')
  const metrics = metricsByTab[activeMainTab] || metricsByTab.products

  const activeProduct = useMemo(() => selectedProduct || products[0], [selectedProduct])

  const openMainTab = (tab) => {
    setActiveMainTab(tab)
    setSelectedProduct(null)
    setProductDetailTab('overview')
    setDrawer(null)
    setManualSettlementOrder(null)
  }

  const updateSubscriptionDecision = (id, decision, reason = '') => {
    const status = decision === 'approved' ? '持有中' : '已拒绝'
    const statusGroup = decision === 'approved' ? 'approved' : 'rejected'
    const normalizedReason = reason.trim() || '运营审核未通过'
    setSubscriptionOrders((orders) => orders.map((order) => (
      order.id === id
        ? {
            ...order,
            status,
            statusGroup,
            approvedAt: '2026-08-13 16:20',
            refundStatus: decision === 'rejected' ? '待退款' : order.refundStatus,
            refundAmount: decision === 'rejected' ? order.actualDebit : order.refundAmount,
            refundTime: decision === 'rejected' ? '-' : order.refundTime,
            rejectReason: decision === 'rejected' ? normalizedReason : order.rejectReason,
          }
        : order
    )))
    setSubscriptionStatus(statusGroup)
    setDrawer(null)
  }

  const updateRedemptionDecision = (id, decision, reason = '') => {
    const status = decision === 'approved' ? '已通过' : '已拒绝'
    const statusGroup = decision === 'approved' ? 'approved' : 'rejected'
    const normalizedReason = reason.trim() || '结算账户校验未通过'
    setRedemptionOrders((orders) => orders.map((order) => (
      order.id === id
        ? {
            ...order,
            status,
            statusGroup,
            approvedAt: '2026-08-13 16:20',
            approver: '超级管理员',
            remark: decision === 'rejected' ? normalizedReason : '-',
            settlementStatus: decision === 'approved' ? '已结算' : '未结算',
            exceptionReason: decision === 'rejected' ? '赎回审批拒绝，未进入结算' : order.exceptionReason,
            rejectReason: decision === 'rejected' ? normalizedReason : order.rejectReason,
          }
        : order
    )))
    setRedemptionStatus(statusGroup)
    setDrawer(null)
  }

  const openManualSettlement = (order) => {
    setManualSettlementOrder(order)
    setManualSettlementAccountId('acct-sg-0950')
    setManualSettlementNote('客户原指定香港账户已禁用，经人工处理改为客户有效的新加坡账户结算。')
  }

  const confirmManualSettlement = (account) => {
    if (!manualSettlementOrder) return
    const operatedAt = '2026-08-13 16:28:00'
    const operator = '超级管理员'
    const manualSettlementRecord = {
      originalAccount: manualSettlementOrder.designatedAccount,
      actualAccount: account.label,
      operator,
      operatedAt,
      exceptionReason: manualSettlementOrder.exceptionReason || '账户不可用',
      reason: manualSettlementNote,
    }
    setRedemptionOrders((orders) => orders.map((order) => (
      order.id === manualSettlementOrder.id
        ? {
            ...order,
            actualSettlementAccount: account.label,
            actualSettlementCurrency: account.currency,
            settlementStatus: '已结算',
            settlementTime: operatedAt,
            status: '已通过',
            statusGroup: 'approved',
            approver: order.approver === '-' ? operator : order.approver,
            approvedAt: order.approvedAt === '-' ? '2026-08-13 16:20' : order.approvedAt,
            remark: manualSettlementNote,
            exceptionReason: `${order.exceptionReason}；人工结算已处理`,
            manualSettlementRecord: {
              ...manualSettlementRecord,
              originalAccount: order.designatedAccount,
              exceptionReason: order.exceptionReason || '账户不可用',
            },
          }
        : order
    )))
    setDrawer((current) => (
      current?.type === 'redemption' && current.order.id === manualSettlementOrder.id
        ? {
            type: 'redemption',
            order: {
              ...manualSettlementOrder,
              actualSettlementAccount: account.label,
              actualSettlementCurrency: account.currency,
              settlementStatus: '已结算',
              settlementTime: operatedAt,
              status: '已通过',
              statusGroup: 'approved',
              approver: manualSettlementOrder.approver === '-' ? operator : manualSettlementOrder.approver,
              approvedAt: manualSettlementOrder.approvedAt === '-' ? '2026-08-13 16:20' : manualSettlementOrder.approvedAt,
              remark: manualSettlementNote,
              exceptionReason: `${manualSettlementOrder.exceptionReason}；人工结算已处理`,
              manualSettlementRecord,
            },
          }
        : current
    ))
    setManualSettlementOrder(null)
  }

  const rulesForActiveTab = selectedProduct ? businessRulesByTab.products : businessRulesByTab[activeMainTab] || businessRulesByTab.products

  return (
    <main className="min-h-screen bg-[#f4f5fb] px-[45px] py-[23px] font-sans text-[#24243d]">
      <AdminHeader onBack={onBack} />

      <section className="grid grid-cols-4 gap-[24px]">
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </section>

      {selectedProduct ? (
        <div className="mt-[24px] grid grid-cols-[minmax(0,1fr)_300px] gap-[20px]">
          <ProductDetailView
            product={activeProduct}
            activeTab={productDetailTab}
            onChangeTab={setProductDetailTab}
            onBack={() => {
              setSelectedProduct(null)
              setProductDetailTab('overview')
            }}
          />
          <BusinessRulesPanel rules={rulesForActiveTab} />
        </div>
      ) : (
        <div className="mt-[24px] grid grid-cols-[minmax(0,1fr)_300px] gap-[20px]">
          <AdminCard>
            {activeMainTab === 'products' ? <ProductListView tabs={<MainTabs activeTab={activeMainTab} onChange={openMainTab} />} onOpenProduct={(product) => setSelectedProduct(product)} /> : null}
            {activeMainTab === 'subscriptions' ? (
              <ReviewManagementView
                kind="subscriptions"
                activeStatus={subscriptionStatus}
                onChangeStatus={setSubscriptionStatus}
                orders={subscriptionOrders}
                onOpen={(order) => setDrawer({ type: 'subscription', order })}
                tabs={<MainTabs activeTab={activeMainTab} onChange={openMainTab} />}
              />
            ) : null}
            {activeMainTab === 'redemptions' ? (
              <ReviewManagementView
                kind="redemptions"
                activeStatus={redemptionStatus}
                onChangeStatus={setRedemptionStatus}
                orders={redemptionOrders}
                onOpen={(order) => setDrawer({ type: 'redemption', order })}
                tabs={<MainTabs activeTab={activeMainTab} onChange={openMainTab} />}
              />
            ) : null}
          </AdminCard>
          <BusinessRulesPanel rules={rulesForActiveTab} />
        </div>
      )}

      {drawer?.type === 'subscription' ? (
        <SubscriptionDrawer order={drawer.order} onClose={() => setDrawer(null)} onDecision={updateSubscriptionDecision} />
      ) : null}
      {drawer?.type === 'redemption' ? (
        <RedemptionDrawer order={drawer.order} onClose={() => setDrawer(null)} onDecision={updateRedemptionDecision} onManualSettlement={openManualSettlement} />
      ) : null}
      <ManualSettlementModal
        order={manualSettlementOrder}
        selectedAccountId={manualSettlementAccountId}
        note={manualSettlementNote}
        onSelectAccount={setManualSettlementAccountId}
        onChangeNote={setManualSettlementNote}
        onClose={() => setManualSettlementOrder(null)}
        onConfirm={confirmManualSettlement}
      />
    </main>
  )
}
