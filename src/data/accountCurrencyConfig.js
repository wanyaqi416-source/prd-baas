export const accountCurrencyAccountTypes = ['香港账户', '美国账户', 'IBKR 盈透证券', 'Webull 微牛证券']

export const enabledCurrencyOptions = [
  { code: 'USD', name: '美元' },
  { code: 'HKD', name: '港币' },
  { code: 'CNY', name: '人民币' },
  { code: 'SGD', name: '新加坡元' },
  { code: 'EUR', name: '欧元' },
]

export const initialAccountCurrencyConfigs = [
  { id: 'ACC-CUR-HK-USD', accountType: '香港账户', currencyCode: 'USD', currencyName: '美元', isDefault: true, displayOrder: 1, status: '启用', updatedAt: '2026-06-22 10:20', updatedBy: '运营管理员', remark: '香港账户默认美元。' },
  { id: 'ACC-CUR-HK-HKD', accountType: '香港账户', currencyCode: 'HKD', currencyName: '港币', isDefault: false, displayOrder: 2, status: '启用', updatedAt: '2026-06-22 10:20', updatedBy: '运营管理员', remark: '香港账户支持港币。' },
  { id: 'ACC-CUR-HK-CNY', accountType: '香港账户', currencyCode: 'CNY', currencyName: '人民币', isDefault: false, displayOrder: 3, status: '启用', updatedAt: '2026-06-22 10:20', updatedBy: '运营管理员', remark: '香港账户支持人民币。' },
  { id: 'ACC-CUR-HK-SGD', accountType: '香港账户', currencyCode: 'SGD', currencyName: '新加坡元', isDefault: false, displayOrder: 4, status: '启用', updatedAt: '2026-06-22 10:20', updatedBy: '运营管理员', remark: '香港账户支持新加坡元。' },
  { id: 'ACC-CUR-US-USD', accountType: '美国账户', currencyCode: 'USD', currencyName: '美元', isDefault: true, displayOrder: 1, status: '启用', updatedAt: '2026-06-22 10:20', updatedBy: '运营管理员', remark: '美国账户当前仅启用美元。' },
  { id: 'ACC-CUR-IBKR-USD', accountType: 'IBKR 盈透证券', currencyCode: 'USD', currencyName: '美元', isDefault: true, displayOrder: 1, status: '启用', updatedAt: '2026-06-22 10:20', updatedBy: '运营管理员', remark: 'IBKR 结算币种。' },
  { id: 'ACC-CUR-IBKR-HKD', accountType: 'IBKR 盈透证券', currencyCode: 'HKD', currencyName: '港币', isDefault: false, displayOrder: 2, status: '启用', updatedAt: '2026-06-22 10:20', updatedBy: '运营管理员', remark: 'IBKR 结算币种。' },
  { id: 'ACC-CUR-WEBULL-USD', accountType: 'Webull 微牛证券', currencyCode: 'USD', currencyName: '美元', isDefault: true, displayOrder: 1, status: '启用', updatedAt: '2026-06-22 10:20', updatedBy: '运营管理员', remark: 'Webull 结算币种。' },
  { id: 'ACC-CUR-WEBULL-HKD', accountType: 'Webull 微牛证券', currencyCode: 'HKD', currencyName: '港币', isDefault: false, displayOrder: 2, status: '启用', updatedAt: '2026-06-22 10:20', updatedBy: '运营管理员', remark: 'Webull 结算币种。' },
]

export function getCurrencyName(currencyCode) {
  return enabledCurrencyOptions.find((currency) => currency.code === currencyCode)?.name || currencyCode
}

export function getEnabledAccountCurrencyCodes(configs, accountType) {
  return configs
    .filter((config) => config.accountType === accountType && config.status === '启用')
    .sort((left, right) => Number(left.displayOrder || 0) - Number(right.displayOrder || 0))
    .map((config) => config.currencyCode)
}

export function mapBrokerNameToAccountCurrencyType(brokerName = '') {
  if (brokerName.includes('IBKR')) return 'IBKR 盈透证券'
  if (brokerName.includes('Webull')) return 'Webull 微牛证券'
  return brokerName
}
