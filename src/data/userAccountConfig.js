export const singaporeAccountStatusOptions = ['未开通', '待处理', '审核中', '已开户', '已拒绝']

export const userAccountStatusOptions = ['未开通', '已开通', '已关闭']

export const jurisdictionAccountStatusOptions = ['未开通', '审核中', '已开通', '已拒绝', '已暂停']

export const createJurisdictionAccountRecord = (accountTypeCode, overrides = {}) => ({
  id: `JURISDICTION-ACCOUNT-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  accountTypeCode,
  status: '未开通',
  beneficiaryName: '',
  accountNumber: '',
  openingSource: '',
  appliedAt: '',
  approvedAt: '',
  pausedAt: '',
  feeStatus: '未扣费',
  rejectReason: '',
  updatedAt: '',
  updatedBy: '',
  remark: '',
  ...overrides,
})

export const createUserAccountRecord = (accountTypeCode, overrides = {}) => ({
  id: `USER-ACCOUNT-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  accountTypeCode,
  status: '已开通',
  accountNo: '',
  openedAt: '',
  closedAt: '',
  receivingAccountOverride: {},
  remark: '',
  ...overrides,
})

export const createSingaporeAccountRecord = (overrides = {}) => ({
  status: '未开通',
  beneficiaryName: '',
  accountNumber: '',
  openingSource: '',
  appliedAt: '',
  approvedAt: '',
  updatedAt: '',
  updatedBy: '',
  remark: '',
  ...overrides,
})

export const initialUserAccountConfigs = [
  {
    id: 'user-a',
    userName: '用户A',
    userId: 'UID-10001',
    email: 'user-a@example.com',
    customerType: '个人',
    registeredAt: '2026-06-18 10:24',
    userStatus: '正常',
    updatedAt: '2026-07-14 11:20',
    createdAt: '2026-06-18 10:25',
    accounts: [
      createUserAccountRecord('HK_ACCOUNT', {
        id: 'ua-a-hk',
        accountNo: 'HK-10001',
        openedAt: '2026-06-18 10:25',
      }),
      createUserAccountRecord('SG_ACCOUNT', {
        id: 'ua-a-sg',
        accountNo: 'SG-10001',
        openedAt: '2026-07-14 11:20',
        receivingAccountOverride: {
          beneficiaryName: '客户名称（运营手动输入）',
          accountNumber: '11020160950',
        },
      }),
    ],
    singaporeAccount: createSingaporeAccountRecord({
      status: '已开户',
      beneficiaryName: '客户名称（运营手动输入）',
      accountNumber: '0950',
      openingSource: '客户申请',
      appliedAt: '2026-07-12 10:30',
      approvedAt: '2026-07-14 11:20',
      updatedAt: '2026-07-14 11:20',
      updatedBy: '运营管理员',
    }),
    jurisdictionAccounts: [
      createJurisdictionAccountRecord('BH_ACCOUNT', {
        id: 'ja-a-bh',
        status: '已开通',
        beneficiaryName: 'WANYARA WAN',
        accountNumber: 'BH-0950',
        openingSource: '客户申请',
        appliedAt: '2026-07-20 10:18',
        approvedAt: '2026-07-22 14:36',
        feeStatus: '扣费成功',
        updatedAt: '2026-07-22 14:36',
        updatedBy: '运营管理员',
      }),
    ],
  },
  {
    id: 'user-b',
    userName: '用户B',
    userId: 'UID-10002',
    email: 'user-b@example.com',
    customerType: '个人',
    registeredAt: '2026-05-30 16:42',
    userStatus: '正常',
    createdAt: '2026-05-30 16:43',
    updatedAt: '2026-07-13 15:10',
    accounts: [
      createUserAccountRecord('HK_ACCOUNT', {
        id: 'ua-b-hk',
        accountNo: 'HK-10002',
        openedAt: '2026-05-30 16:43',
      }),
      createUserAccountRecord('US_ACCOUNT', {
        id: 'ua-b-us',
        accountNo: 'US-10002',
        openedAt: '2026-06-02 14:18',
      }),
    ],
    singaporeAccount: createSingaporeAccountRecord({
      status: '审核中',
      appliedAt: '2026-07-13 15:10',
      updatedAt: '2026-07-13 15:10',
      updatedBy: '系统',
    }),
    jurisdictionAccounts: [
      createJurisdictionAccountRecord('BH_ACCOUNT', {
        id: 'ja-b-bh',
        status: '审核中',
        openingSource: '客户申请',
        appliedAt: '2026-07-27 15:48',
        feeStatus: '扣费成功',
        updatedAt: '2026-07-27 15:48',
        updatedBy: '系统',
      }),
    ],
  },
  {
    id: 'user-c',
    userName: '用户C',
    userId: 'UID-10003',
    email: 'user-c@example.com',
    customerType: '个人',
    registeredAt: '2026-07-01 09:12',
    userStatus: '冻结',
    createdAt: '2026-07-01 09:13',
    updatedAt: '2026-07-12 15:06',
    accounts: [
      createUserAccountRecord('HK_ACCOUNT', {
        id: 'ua-c-hk',
        accountNo: 'HK-10003',
        openedAt: '2026-07-01 09:13',
      }),
      createUserAccountRecord('WEBULL_BROKERAGE', {
        id: 'ua-c-webull',
        accountNo: 'WB-450018',
        openedAt: '2026-07-08 12:11',
        status: '已关闭',
        closedAt: '2026-07-12 15:06',
        remark: '保留历史数据，客户端隐藏操作入口。',
      }),
    ],
    singaporeAccount: createSingaporeAccountRecord({
      status: '已拒绝',
      updatedAt: '2026-07-12 15:06',
      updatedBy: '系统',
      remark: '客户资料不符合新加坡账户开户要求。',
    }),
    jurisdictionAccounts: [
      createJurisdictionAccountRecord('BH_ACCOUNT', {
        id: 'ja-c-bh',
        status: '已开通',
        beneficiaryName: 'LUNA CHEN',
        accountNumber: 'BH-10003',
        openingSource: '后台手动开通',
        approvedAt: '2026-07-08 11:26',
        feeStatus: '无需扣费',
        updatedAt: '2026-07-12 15:06',
        updatedBy: '运营管理员',
      }),
    ],
  },
  {
    id: 'user-d',
    userName: '用户D',
    userId: 'UID-10004',
    email: 'user-d@example.com',
    customerType: '企业',
    registeredAt: '2026-07-10 13:26',
    userStatus: '正常',
    createdAt: '2026-07-10 13:27',
    updatedAt: '2026-07-14 09:40',
    accounts: [
      createUserAccountRecord('HK_ACCOUNT', {
        id: 'ua-d-hk',
        accountNo: 'HK-10004',
        openedAt: '2026-07-10 13:27',
      }),
    ],
    singaporeAccount: createSingaporeAccountRecord({
      status: '待处理',
      appliedAt: '2026-07-13 10:18',
      updatedAt: '2026-07-14 09:40',
      updatedBy: '系统',
    }),
    jurisdictionAccounts: [
      createJurisdictionAccountRecord('BH_ACCOUNT', {
        id: 'ja-d-bh',
        status: '已拒绝',
        openingSource: '客户申请',
        appliedAt: '2026-07-13 09:42',
        feeStatus: '已退回',
        rejectReason: '开户信息与现有客户资料不一致，请核对后重新申请。',
        updatedAt: '2026-07-14 09:40',
        updatedBy: '运营管理员',
      }),
    ],
  },
  {
    id: 'user-e',
    userName: '用户E',
    userId: 'UID-10005',
    email: 'user-e@example.com',
    customerType: '个人',
    registeredAt: '2026-07-11 10:08',
    userStatus: '正常',
    createdAt: '2026-07-11 10:09',
    updatedAt: '2026-07-11 10:09',
    accounts: [
      createUserAccountRecord('HK_ACCOUNT', {
        id: 'ua-e-hk',
        accountNo: 'HK-10005',
        openedAt: '2026-07-11 10:09',
      }),
    ],
    singaporeAccount: createSingaporeAccountRecord({
      status: '未开通',
      updatedAt: '2026-07-11 10:09',
      updatedBy: '系统',
    }),
    jurisdictionAccounts: [
      createJurisdictionAccountRecord('BH_ACCOUNT', {
        id: 'ja-e-bh',
        status: '未开通',
        updatedAt: '2026-07-11 10:09',
        updatedBy: '系统',
      }),
    ],
  },
]
