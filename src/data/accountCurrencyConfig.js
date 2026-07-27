export const accountCurrencyAccountTypes = ['香港账户', '美国账户', '新加坡账户', '巴林账户', 'IBKR 盈透证券', 'Webull 微牛证券']

export const enabledCurrencyOptions = [
  { code: 'USD', name: '美元' },
  { code: 'HKD', name: '港币' },
  { code: 'CNY', name: '人民币' },
  { code: 'SGD', name: '新加坡元' },
  { code: 'EUR', name: '欧元' },
  { code: 'AED', name: '阿联酋迪拉姆' },
  { code: 'JPY', name: '日元' },
  { code: 'BHD', name: '巴林第纳尔' },
]

export const initialAccountCurrencyConfigs = [
  { id: 'ACC-CUR-HK-USD', accountType: '香港账户', currencyCode: 'USD', currencyName: '美元', isDefault: true, displayOrder: 1, status: '启用', updatedAt: '2026-06-22 10:20', updatedBy: '运营管理员', remark: '香港账户默认美元。' },
  { id: 'ACC-CUR-HK-HKD', accountType: '香港账户', currencyCode: 'HKD', currencyName: '港币', isDefault: false, displayOrder: 2, status: '启用', updatedAt: '2026-06-22 10:20', updatedBy: '运营管理员', remark: '香港账户支持港币。' },
  { id: 'ACC-CUR-HK-CNY', accountType: '香港账户', currencyCode: 'CNY', currencyName: '人民币', isDefault: false, displayOrder: 3, status: '启用', updatedAt: '2026-06-22 10:20', updatedBy: '运营管理员', remark: '香港账户支持人民币。' },
  { id: 'ACC-CUR-HK-SGD', accountType: '香港账户', currencyCode: 'SGD', currencyName: '新加坡元', isDefault: false, displayOrder: 4, status: '启用', updatedAt: '2026-06-22 10:20', updatedBy: '运营管理员', remark: '香港账户支持新加坡元。' },
  { id: 'ACC-CUR-US-USD', accountType: '美国账户', currencyCode: 'USD', currencyName: '美元', isDefault: true, displayOrder: 1, status: '启用', updatedAt: '2026-06-22 10:20', updatedBy: '运营管理员', remark: '美国账户当前仅启用美元。' },
  { id: 'ACC-CUR-SG-USD', accountType: '新加坡账户', currencyCode: 'USD', currencyName: '美元', isDefault: true, displayOrder: 1, status: '启用', updatedAt: '2026-07-14 14:20', updatedBy: '运营管理员', remark: '新加坡账户默认美元。' },
  { id: 'ACC-CUR-SG-CNY', accountType: '新加坡账户', currencyCode: 'CNY', currencyName: '人民币', isDefault: false, displayOrder: 2, status: '启用', updatedAt: '2026-07-14 14:20', updatedBy: '运营管理员', remark: '新加坡账户支持人民币。' },
  { id: 'ACC-CUR-SG-SGD', accountType: '新加坡账户', currencyCode: 'SGD', currencyName: '新加坡元', isDefault: false, displayOrder: 3, status: '启用', updatedAt: '2026-07-14 14:20', updatedBy: '运营管理员', remark: '新加坡账户支持新加坡元。' },
  { id: 'ACC-CUR-SG-AED', accountType: '新加坡账户', currencyCode: 'AED', currencyName: '阿联酋迪拉姆', isDefault: false, displayOrder: 4, status: '启用', updatedAt: '2026-07-14 14:20', updatedBy: '运营管理员', remark: '新加坡账户支持阿联酋迪拉姆。' },
  { id: 'ACC-CUR-SG-JPY', accountType: '新加坡账户', currencyCode: 'JPY', currencyName: '日元', isDefault: false, displayOrder: 5, status: '启用', updatedAt: '2026-07-14 14:20', updatedBy: '运营管理员', remark: '新加坡账户支持日元。' },
  { id: 'ACC-CUR-BH-USD', accountType: '巴林账户', currencyCode: 'USD', currencyName: '美元', isDefault: true, displayOrder: 1, status: '启用', updatedAt: '2026-07-27 15:48', updatedBy: '运营管理员', remark: '巴林账户默认美元。' },
  { id: 'ACC-CUR-BH-BHD', accountType: '巴林账户', currencyCode: 'BHD', currencyName: '巴林第纳尔', isDefault: false, displayOrder: 2, status: '启用', updatedAt: '2026-07-27 15:48', updatedBy: '运营管理员', remark: '巴林账户支持巴林第纳尔。' },
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
