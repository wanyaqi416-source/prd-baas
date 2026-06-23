export const brokerageFileRule = 'PDF/JPG/PNG·单个文件不超过10MB'

export const brokerageBrokers = [
  {
    id: 'webull',
    name: 'Webull 微牛证券',
    shortName: 'Webull',
    requiredMaterials: [
      { id: 'basic_profile', name: '账户基础资料', required: true },
      { id: 'authorization_letter', name: '授权书', required: true },
      { id: 'risk_disclosure', name: '风险披露文件', required: true },
    ],
  },
  {
    id: 'ibkr',
    name: 'IBKR 盈透证券',
    shortName: 'IBKR',
    requiredMaterials: [
      { id: 'address_proof', name: '地址证明', required: true },
    ],
  },
]

export const brokerageSignatureStatuses = ['未签署', '已签署']
export const brokerageUploadStatuses = ['未上传', '已上传', '部分上传']
export const brokerageOpeningStatuses = ['资料审核中', '开户处理中', '已开户', '需补充资料', '已拒绝']
export const brokerageAccountStatuses = ['已开户', '已冻结', '已关闭']

export const brokerageOpeningStatusTones = {
  资料审核中: 'blue',
  开户处理中: 'orange',
  已开户: 'green',
  需补充资料: 'violet',
  已拒绝: 'red',
}

export const clientBrokerageStatusMap = {
  已开户: 'approved',
  已拒绝: 'rejected',
  资料审核中: 'reviewing',
  开户处理中: 'reviewing',
  需补充资料: 'reviewing',
}

export const brokerageAccountFallback = {
  brokerName: 'Webull',
  accountName: 'XXX Trust Account',
  accountNumber: 'WB-98347291',
  currency: 'USD',
  openedAt: '2026-06-18',
  accountStatus: '已开户',
  remark: '账户已成功开通，可联系客户经理了解后续服务。',
}

export const initialBrokerageApplications = [
  {
    id: 'SA-20260618-001',
    customer: {
      name: 'WANYARA WAN',
      id: '154',
      email: 'xr3kes66@123mails.org',
      initials: 'WW',
      phone: '+86 13800001540',
      occupation: '投资顾问',
      position: '客户经理',
      type: '个人客户',
    },
    brokerId: 'webull',
    brokerName: 'Webull 微牛证券',
    brokerShortName: 'Webull',
    submittedAt: '2026-06-18 11:26',
    signatureStatus: '已签署',
    uploadStatus: '已上传',
    openingStatus: '已开户',
    materials: [
      { id: 'basic_profile', name: '账户基础资料', fileName: 'wanyara-basic-profile.pdf', type: '签署文件', status: '已签署' },
      { id: 'authorization_letter', name: '授权书', fileName: 'wanyara-authorization.pdf', type: '签署文件', status: '已签署' },
      { id: 'risk_disclosure', name: '风险披露文件', fileName: 'wanyara-risk-disclosure.pdf', type: '签署文件', status: '已签署' },
    ],
    statusLogs: [
      { id: 'log-001-1', time: '2026-06-18 11:26', operator: '客户', from: '-', to: '资料审核中', remark: '客户提交 Webull 开户申请。' },
      { id: 'log-001-2', time: '2026-06-18 14:10', operator: '后台人员', from: '资料审核中', to: '开户处理中', remark: '资料完整，开始人工开户。' },
      { id: 'log-001-3', time: '2026-06-18 16:40', operator: '后台人员', from: '开户处理中', to: '已开户', remark: '券商账户信息已录入，客户可见。' },
    ],
    accountInfo: {
      brokerName: 'Webull',
      accountName: 'XXX Trust Account',
      accountNumber: 'WB-98347291',
      currency: 'USD',
      openedAt: '2026-06-18',
      accountStatus: '已开户',
      remark: '账户已成功开通，可联系客户经理了解后续服务。',
    },
  },
  {
    id: 'SA-20260619-002',
    customer: {
      name: 'jin wu ye',
      id: '130',
      email: 'orvafrew@123mails.org',
      initials: 'jwy',
      phone: '+238 15573096107',
      occupation: '-',
      position: '-',
      type: '个人客户',
    },
    brokerId: 'ibkr',
    brokerName: 'IBKR 盈透证券',
    brokerShortName: 'IBKR',
    submittedAt: '2026-06-19 10:08',
    signatureStatus: '未签署',
    uploadStatus: '已上传',
    openingStatus: '开户处理中',
    materials: [
      { id: 'address_proof', name: '地址证明', fileName: 'jwy-address-proof.png', type: '上传资料', status: '已上传' },
    ],
    statusLogs: [
      { id: 'log-002-1', time: '2026-06-19 10:08', operator: '客户', from: '-', to: '资料审核中', remark: '客户提交 IBKR 开户申请。' },
      { id: 'log-002-2', time: '2026-06-19 15:18', operator: '后台人员', from: '资料审核中', to: '开户处理中', remark: '地址证明已确认，进入券商开户处理。' },
    ],
    accountInfo: null,
  },
  {
    id: 'SA-20260622-006',
    customer: {
      name: 'MING LI',
      id: '188',
      email: 'ming.li@example.com',
      initials: 'ML',
      phone: '+86 13800000188',
      occupation: '财务顾问',
      position: '-',
      type: '个人客户',
    },
    brokerId: 'ibkr',
    brokerName: 'IBKR 盈透证券',
    brokerShortName: 'IBKR',
    submittedAt: '2026-06-22 09:18',
    signatureStatus: '未签署',
    uploadStatus: '已上传',
    openingStatus: '资料审核中',
    materials: [
      { id: 'address_proof', name: '地址证明', fileName: 'ming-address-proof.pdf', type: '上传资料', status: '已上传' },
    ],
    statusLogs: [
      { id: 'log-006-1', time: '2026-06-22 09:18', operator: '客户', from: '-', to: '资料审核中', remark: '客户提交 IBKR 开户申请，等待后台审核资料。' },
    ],
    accountInfo: null,
  },
  {
    id: 'SA-20260620-003',
    customer: {
      name: 'YAYA SDFS CHEN',
      id: '180',
      email: 'ianraxx@swagpapa.com',
      initials: 'YSC',
      phone: '+86 13800001800',
      occupation: '自由职业',
      position: '-',
      type: '个人客户',
    },
    brokerId: 'webull',
    brokerName: 'Webull 微牛证券',
    brokerShortName: 'Webull',
    submittedAt: '2026-06-20 17:51',
    signatureStatus: '未签署',
    uploadStatus: '部分上传',
    openingStatus: '需补充资料',
    materials: [
      { id: 'basic_profile', name: '账户基础资料', fileName: 'yaya-basic-profile.pdf', type: '签署文件', status: '已签署' },
      { id: 'authorization_letter', name: '授权书', fileName: '-', type: '签署文件', status: '未签署' },
      { id: 'risk_disclosure', name: '风险披露文件', fileName: '-', type: '签署文件', status: '未签署' },
    ],
    statusLogs: [
      { id: 'log-003-1', time: '2026-06-20 17:51', operator: '客户', from: '-', to: '资料审核中', remark: '客户提交 Webull 开户申请。' },
      { id: 'log-003-2', time: '2026-06-21 09:40', operator: '后台人员', from: '资料审核中', to: '需补充资料', remark: '授权书缺失，风险披露文件未完成签署，请客户补充后再次提交。' },
    ],
    accountInfo: null,
  },
  {
    id: 'SA-20260621-004',
    customer: {
      name: 'APEXIS INC',
      id: 'CL-2003002',
      email: 'ops+apexis@fidere.example',
      initials: 'AI',
      phone: '+1 4150002003',
      occupation: '企业客户',
      position: '运营联系人',
      type: '企业客户',
    },
    brokerId: 'ibkr',
    brokerName: 'IBKR 盈透证券',
    brokerShortName: 'IBKR',
    submittedAt: '2026-06-21 09:32',
    signatureStatus: '未签署',
    uploadStatus: '未上传',
    openingStatus: '资料审核中',
    materials: [
      { id: 'address_proof', name: '地址证明', fileName: '-', type: '上传资料', status: '未上传' },
    ],
    statusLogs: [
      { id: 'log-004-1', time: '2026-06-21 09:32', operator: '客户', from: '-', to: '资料审核中', remark: '客户提交 IBKR 开户申请，等待后台审核资料。' },
    ],
    accountInfo: null,
  },
  {
    id: 'SA-20260621-005',
    customer: {
      name: 'LUZHOU LU',
      id: '86',
      email: 'luzhou.lu@example.com',
      initials: 'LL',
      phone: '+86 13800000086',
      occupation: '产品经理',
      position: '-',
      type: '个人客户',
    },
    brokerId: 'webull',
    brokerName: 'Webull 微牛证券',
    brokerShortName: 'Webull',
    submittedAt: '2026-06-21 15:43',
    signatureStatus: '已签署',
    uploadStatus: '已上传',
    openingStatus: '已拒绝',
    materials: [
      { id: 'basic_profile', name: '账户基础资料', fileName: 'luzhou-basic-profile.pdf', type: '签署文件', status: '已签署' },
      { id: 'authorization_letter', name: '授权书', fileName: 'luzhou-authorization.pdf', type: '签署文件', status: '已签署' },
      { id: 'risk_disclosure', name: '风险披露文件', fileName: 'luzhou-risk-disclosure.pdf', type: '签署文件', status: '已签署' },
    ],
    statusLogs: [
      { id: 'log-005-1', time: '2026-06-21 15:43', operator: '客户', from: '-', to: '资料审核中', remark: '客户提交 Webull 开户申请。' },
      { id: 'log-005-2', time: '2026-06-22 10:20', operator: '后台人员', from: '资料审核中', to: '已拒绝', remark: '券商侧拒绝开户，客户资料与账户用途说明不一致。' },
    ],
    accountInfo: null,
  },
  {
    id: 'SA-20260622-007',
    customer: {
      name: 'NORA CHAN',
      id: '191',
      email: 'nora.chan@example.com',
      initials: 'NC',
      phone: '+852 61230091',
      occupation: '运营经理',
      position: '-',
      type: '个人客户',
    },
    brokerId: 'webull',
    brokerName: 'Webull 微牛证券',
    brokerShortName: 'Webull',
    submittedAt: '2026-06-22 12:26',
    signatureStatus: '已签署',
    uploadStatus: '已上传',
    openingStatus: '资料审核中',
    materials: [
      { id: 'basic_profile', name: '账户基础资料', fileName: 'nora-basic-profile.pdf', type: '签署文件', status: '已签署' },
      { id: 'authorization_letter', name: '授权书', fileName: 'nora-authorization.pdf', type: '签署文件', status: '已签署' },
      { id: 'risk_disclosure', name: '风险披露文件', fileName: 'nora-risk-disclosure.pdf', type: '签署文件', status: '已签署' },
    ],
    statusLogs: [
      { id: 'log-007-1', time: '2026-06-22 12:26', operator: '客户', from: '-', to: '资料审核中', remark: '客户提交 Webull 开户申请，后台待审核资料。' },
    ],
    accountInfo: null,
  },
]

export function getBrokerageApplicationByBroker(applications, brokerId) {
  return applications.find((application) => application.brokerId === brokerId && application.accountInfo)
    || applications.find((application) => application.brokerId === brokerId)
    || applications[0]
}

export function mapBrokerageOpeningStatusToClientStatus(openingStatus) {
  return clientBrokerageStatusMap[openingStatus] || 'reviewing'
}
