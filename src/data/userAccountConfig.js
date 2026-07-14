export const singaporeAccountStatusOptions = ['未开通', '开通中', '已开户']

export const userAccountStatusOptions = ['未开通', '已开通', '已关闭']

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
      appliedAt: '2026-07-12 10:30',
      approvedAt: '2026-07-14 11:20',
      updatedAt: '2026-07-14 11:20',
      updatedBy: '运营管理员',
    }),
  },
  {
    id: 'user-b',
    userName: '用户B',
    userId: 'UID-10002',
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
      status: '开通中',
      appliedAt: '2026-07-13 15:10',
      updatedAt: '2026-07-13 15:10',
      updatedBy: '系统',
    }),
  },
  {
    id: 'user-c',
    userName: '用户C',
    userId: 'UID-10003',
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
      status: '未开通',
      updatedAt: '2026-07-12 15:06',
      updatedBy: '系统',
    }),
  },
]
