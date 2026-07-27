export const accountTypeStatusOptions = ['启用', '禁用']

export const accountTypeCurrencyOptions = [
  { code: 'USD', name: '美元' },
  { code: 'HKD', name: '港币' },
  { code: 'CNY', name: '人民币' },
  { code: 'EUR', name: '欧元' },
  { code: 'SGD', name: '新加坡元' },
  { code: 'AED', name: '阿联酋迪拉姆' },
  { code: 'JPY', name: '日元' },
]

export const bankFieldLabels = [
  ['beneficiaryName', '银行账户名称'],
  ['bankName', '银行名称'],
  ['accountNumber', '银行账号'],
  ['bankAddress', '银行地址'],
  ['receivingBank', '收款银行'],
  ['swiftBic', 'SWIFT Code'],
]

export const receivingAccountFieldLabels = [
  ['beneficiaryName', '收款账户名称'],
  ['bankName', '银行名称'],
  ['accountNumber', '银行账号'],
  ['bankAddress', '银行地址'],
  ['receivingBank', '收款银行'],
  ['swiftCode', 'SWIFT Code'],
]

export const intermediaryBankFieldLabels = [
  ['intermediaryBankName', '中转银行'],
  ['intermediaryBankRegion', '中转银行地区 / 分行'],
  ['intermediarySwiftCode', 'SWIFT Code'],
  ['remark', '备注'],
]

export const createBankRecord = (overrides = {}) => ({
  id: `BANK-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  beneficiaryName: '',
  bankName: '',
  bankAddress: '',
  accountNumber: '',
  receivingBank: '',
  iban: '',
  swiftBic: '',
  routingNumber: '',
  bankCode: '',
  branchCode: '',
  sortCode: '',
  cnaps: '',
  isDefault: true,
  enabled: true,
  remark: '',
  ...overrides,
})

export const createReceivingAccount = (overrides = {}) => ({
  beneficiaryName: '',
  bankName: '',
  accountNumber: '',
  bankAddress: '',
  receivingBank: '',
  swiftCode: '',
  ...overrides,
})

export const createIntermediaryBank = (overrides = {}) => ({
  intermediaryBankName: '',
  intermediaryBankRegion: '',
  intermediarySwiftCode: '',
  remark: '',
  ...overrides,
})

const bank = (id, fields) => createBankRecord({ id, ...fields })
const receivingAccount = (fields) => createReceivingAccount(fields)
const intermediaryBank = (fields) => createIntermediaryBank(fields)

const hkReceivingAccount = receivingAccount({
  beneficiaryName: 'FIDERE TRUST LIMITED',
  bankName: 'Bank of China (Hong Kong)',
  accountNumber: '012-888-88888888',
  bankAddress: '1 Garden Road, Central, Hong Kong',
  receivingBank: 'Bank of China (Hong Kong)',
  swiftCode: 'BKCHHKHH',
})

const usReceivingAccount = receivingAccount({
  beneficiaryName: 'FIDERE TRUST LIMITED',
  bankName: 'JPMorgan Chase Bank, N.A.',
  accountNumber: '9988776655',
  bankAddress: '270 Park Avenue, New York, NY 10017, USA',
  receivingBank: 'JPMorgan Chase Bank, N.A.',
  swiftCode: 'CHASUS33',
})

const sgReceivingAccount = receivingAccount({
  beneficiaryName: 'FIDERE TRUST LIMITED',
  bankName: 'Green Link Digital Bank Pte. Ltd.',
  accountNumber: '11020160454',
  bankAddress: '20 PASIR PANJANG ROAD #07-25-28 MAPLETREE BUSINESS CITY SINGAPORE 117439',
  receivingBank: 'Green Link Digital Bank',
  swiftCode: 'GLDTSGSG',
})

const brokerageTransferFeeDefaults = {
  HK_ACCOUNT: { USD: 50, HKD: 80, CNY: 0, EUR: 0, SGD: 20 },
  US_ACCOUNT: { USD: 0 },
  SG_ACCOUNT: { USD: 40, CNY: 0, SGD: 20, AED: 0, JPY: 0 },
}

export const initialAccountTypeConfigs = [
  {
    id: 'acct-hk',
    name: '香港账户',
    englishName: 'Hong Kong Account',
    code: 'HK_ACCOUNT',
    status: '启用',
    requiresDocuments: false,
    isDefault: true,
    allowDeposit: true,
    allowWithdraw: true,
    allowInternalTransfer: true,
    displayOrder: 1,
    updatedAt: '2026-07-10 10:20',
    updatedBy: '运营管理员',
    receivingAccount: hkReceivingAccount,
    currencies: [
      {
        code: 'USD',
        name: '美元',
        enabled: true,
        allowDeposit: true,
        allowWithdraw: true,
        allowInternalTransfer: true,
        displayOrder: 1,
        showInDeposit: true,
        intermediaryBank: intermediaryBank({
          intermediaryBankName: 'HSBC Hong Kong',
          intermediaryBankRegion: 'HONG KONG',
          intermediarySwiftCode: 'HSBCHKHHHKH',
        }),
        banks: [
          bank('HK-USD-001', {
            beneficiaryName: hkReceivingAccount.beneficiaryName,
            bankName: 'HSBC Hong Kong',
            bankAddress: '1 Queen Road Central, Hong Kong',
            accountNumber: '400-123456-USD',
            swiftBic: 'HSBCHKHHHKH',
            routingNumber: '',
            bankCode: '004',
            branchCode: '761',
            remark: '香港账户 USD 收款银行。',
          }),
        ],
      },
      {
        code: 'HKD',
        name: '港币',
        enabled: true,
        allowDeposit: true,
        allowWithdraw: true,
        allowInternalTransfer: true,
        displayOrder: 2,
        showInDeposit: true,
        intermediaryBank: intermediaryBank({
          intermediaryBankName: 'Bank of China (Hong Kong)',
          intermediaryBankRegion: 'HONG KONG',
          intermediarySwiftCode: 'BKCHHKHH',
        }),
        banks: [
          bank('HK-HKD-001', {
            beneficiaryName: hkReceivingAccount.beneficiaryName,
            bankName: 'Bank of China (Hong Kong)',
            bankAddress: hkReceivingAccount.bankAddress,
            accountNumber: hkReceivingAccount.accountNumber,
            swiftBic: hkReceivingAccount.swiftCode,
            bankCode: '012',
            branchCode: '888',
            remark: '香港账户 HKD 默认收款银行。',
          }),
        ],
      },
      {
        code: 'CNY',
        name: '人民币',
        enabled: true,
        allowDeposit: true,
        allowWithdraw: true,
        allowInternalTransfer: true,
        displayOrder: 3,
        showInDeposit: true,
        intermediaryBank: createIntermediaryBank(),
        banks: [
          bank('HK-CNY-001', {
            beneficiaryName: hkReceivingAccount.beneficiaryName,
            bankName: 'Bank of China (Hong Kong)',
            bankAddress: hkReceivingAccount.bankAddress,
            accountNumber: '012-888-88888866',
            swiftBic: 'BKCHHKHH',
            bankCode: '012',
            branchCode: '888',
          }),
        ],
      },
      {
        code: 'EUR',
        name: '欧元',
        enabled: true,
        allowDeposit: true,
        allowWithdraw: true,
        allowInternalTransfer: true,
        displayOrder: 4,
        showInDeposit: true,
        intermediaryBank: createIntermediaryBank(),
        banks: [
          bank('HK-EUR-001', {
            beneficiaryName: hkReceivingAccount.beneficiaryName,
            bankName: 'HSBC Hong Kong',
            bankAddress: '1 Queen Road Central, Hong Kong',
            accountNumber: '400-123456-EUR',
            iban: 'HK00HSBC400123456EUR',
            swiftBic: 'HSBCHKHHHKH',
          }),
        ],
      },
      {
        code: 'SGD',
        name: '新加坡元',
        enabled: true,
        allowDeposit: true,
        allowWithdraw: true,
        allowInternalTransfer: true,
        displayOrder: 5,
        showInDeposit: true,
        intermediaryBank: createIntermediaryBank(),
        banks: [
          bank('HK-SGD-001', {
            beneficiaryName: hkReceivingAccount.beneficiaryName,
            bankName: 'DBS Bank (Hong Kong)',
            bankAddress: '11/F, The Center, 99 Queen Road Central, Hong Kong',
            accountNumber: '001-234567-SGD',
            swiftBic: 'DHBKHKHH',
          }),
        ],
      },
    ],
  },
  {
    id: 'acct-us',
    name: '美国账户',
    englishName: 'United States Account',
    code: 'US_ACCOUNT',
    status: '启用',
    requiresDocuments: true,
    isDefault: false,
    allowDeposit: true,
    allowWithdraw: true,
    allowInternalTransfer: true,
    displayOrder: 2,
    updatedAt: '2026-07-10 10:20',
    updatedBy: '运营管理员',
    receivingAccount: usReceivingAccount,
    currencies: [
      {
        code: 'USD',
        name: '美元',
        enabled: true,
        allowDeposit: true,
        allowWithdraw: true,
        allowInternalTransfer: true,
        displayOrder: 1,
        showInDeposit: true,
        intermediaryBank: intermediaryBank({
          intermediaryBankName: 'JPMorgan Chase Bank, N.A.',
          intermediaryBankRegion: 'NEW YORK',
          intermediarySwiftCode: 'CHASUS33',
          remark: '美国账户当前仅支持 USD。',
        }),
        banks: [
          bank('US-USD-001', {
            beneficiaryName: usReceivingAccount.beneficiaryName,
            bankName: usReceivingAccount.bankName,
            bankAddress: usReceivingAccount.bankAddress,
            accountNumber: usReceivingAccount.accountNumber,
            swiftBic: usReceivingAccount.swiftCode,
            routingNumber: '021000021',
            remark: '美国账户 USD 收款银行。',
          }),
        ],
      },
    ],
  },
  {
    id: 'acct-sg',
    name: '新加坡账户',
    englishName: 'Singapore Account',
    code: 'SG_ACCOUNT',
    status: '启用',
    requiresDocuments: false,
    isDefault: true,
    allowDeposit: true,
    allowWithdraw: true,
    allowInternalTransfer: true,
    displayOrder: 3,
    updatedAt: '2026-07-10 10:20',
    updatedBy: '运营管理员',
    receivingAccount: sgReceivingAccount,
    currencies: [
      {
        code: 'USD',
        name: '美元',
        enabled: true,
        allowDeposit: true,
        allowWithdraw: true,
        allowInternalTransfer: true,
        displayOrder: 1,
        showInDeposit: true,
        intermediaryBank: intermediaryBank({
          intermediaryBankName: 'JPMORGAN CHASE BANK, N.A.',
          intermediaryBankRegion: 'NEW YORK',
          intermediarySwiftCode: 'CHASUS33',
        }),
        banks: [
          bank('SG-USD-001', {
            beneficiaryName: sgReceivingAccount.beneficiaryName,
            bankName: sgReceivingAccount.bankName,
            bankAddress: sgReceivingAccount.bankAddress,
            accountNumber: sgReceivingAccount.accountNumber,
            receivingBank: sgReceivingAccount.receivingBank,
            swiftBic: sgReceivingAccount.swiftCode,
            routingNumber: '',
            remark: '新加坡账户 USD 收款银行，前端可补充展示中转行规则。',
          }),
        ],
      },
      {
        code: 'CNY',
        name: '人民币',
        enabled: true,
        allowDeposit: true,
        allowWithdraw: true,
        allowInternalTransfer: true,
        displayOrder: 2,
        showInDeposit: true,
        intermediaryBank: intermediaryBank({
          intermediaryBankName: 'BANK OF CHINA LIMITED',
          intermediaryBankRegion: 'SINGAPORE',
          intermediarySwiftCode: 'BKCHSGSG',
          remark: '原图写 CHN (Offshore)，建议对外使用 CNH (Offshore)。',
        }),
        banks: [
          bank('SG-CNY-001', {
            beneficiaryName: sgReceivingAccount.beneficiaryName,
            bankName: sgReceivingAccount.bankName,
            bankAddress: sgReceivingAccount.bankAddress,
            accountNumber: sgReceivingAccount.accountNumber,
            receivingBank: sgReceivingAccount.receivingBank,
            swiftBic: sgReceivingAccount.swiftCode,
            remark: '新加坡账户 CNY 收款银行。',
          }),
        ],
      },
      {
        code: 'SGD',
        name: '新加坡元',
        enabled: true,
        allowDeposit: true,
        allowWithdraw: true,
        allowInternalTransfer: true,
        displayOrder: 3,
        showInDeposit: true,
        intermediaryBank: intermediaryBank({
          intermediaryBankName: 'N/A',
          intermediaryBankRegion: 'N/A',
          intermediarySwiftCode: 'N/A',
          remark: '新加坡本地转入可不填中转银行',
        }),
        banks: [
          bank('SG-SGD-001', {
            beneficiaryName: sgReceivingAccount.beneficiaryName,
            bankName: sgReceivingAccount.bankName,
            bankAddress: sgReceivingAccount.bankAddress,
            accountNumber: sgReceivingAccount.accountNumber,
            receivingBank: sgReceivingAccount.receivingBank,
            swiftBic: sgReceivingAccount.swiftCode,
            remark: '新加坡账户 SGD 收款银行。',
          }),
        ],
      },
      {
        code: 'AED',
        name: '阿联酋迪拉姆',
        enabled: true,
        allowDeposit: true,
        allowWithdraw: true,
        allowInternalTransfer: true,
        displayOrder: 4,
        showInDeposit: true,
        intermediaryBank: intermediaryBank({
          intermediaryBankName: 'JPMORGAN CHASE BANK, N.A.',
          intermediaryBankRegion: 'SINGAPORE',
          intermediarySwiftCode: 'CHASSGSG',
        }),
        banks: [
          bank('SG-AED-001', {
            beneficiaryName: sgReceivingAccount.beneficiaryName,
            bankName: sgReceivingAccount.bankName,
            bankAddress: sgReceivingAccount.bankAddress,
            accountNumber: sgReceivingAccount.accountNumber,
            receivingBank: sgReceivingAccount.receivingBank,
            swiftBic: sgReceivingAccount.swiftCode,
            remark: '新加坡账户 AED 收款银行。',
          }),
        ],
      },
      {
        code: 'JPY',
        name: '日元',
        enabled: true,
        allowDeposit: true,
        allowWithdraw: true,
        allowInternalTransfer: true,
        displayOrder: 5,
        showInDeposit: true,
        intermediaryBank: intermediaryBank({
          intermediaryBankName: 'JPMORGAN CHASE BANK, N.A.',
          intermediaryBankRegion: 'SINGAPORE',
          intermediarySwiftCode: 'CHASSGSG',
        }),
        banks: [
          bank('SG-JPY-001', {
            beneficiaryName: sgReceivingAccount.beneficiaryName,
            bankName: sgReceivingAccount.bankName,
            bankAddress: sgReceivingAccount.bankAddress,
            accountNumber: sgReceivingAccount.accountNumber,
            receivingBank: sgReceivingAccount.receivingBank,
            swiftBic: sgReceivingAccount.swiftCode,
            remark: '新加坡账户 JPY 收款银行。',
          }),
        ],
      },
    ],
  },
].map((account) => ({
  ...account,
  currencies: account.currencies.map((currency) => ({
    ...currency,
    brokerageTransferFee: brokerageTransferFeeDefaults[account.code]?.[currency.code] ?? 0,
  })),
}))
