export const brokerageConfigStatusOptions = ['启用', '禁用']
export const brokerageMarketCoverageOptions = ['美股', '港股', 'A股', '新加坡市场', '日本市场', '全球市场']
export const brokerageDisplayTagOptions = ['全球市场', '热门', '推荐', '美港股', '低佣金', '流程便捷', '专业交易工具']

export const brokerageMaterialTemplates = [
  { id: 'address_proof', name: '地址证明', handlingMethod: '用户上传', formats: 'PDF/JPG/PNG', sizeLimit: '10MB', allowMultiple: false, uploadDescription: '请上传近 3 个月内地址证明文件。', description: '近 3 个月内显示申请人姓名和居住地址的银行账单、水电账单或政府文件。' },
  { id: 'basic_profile', name: '账户基础资料', handlingMethod: '用户上传', formats: 'PDF/JPG/PNG', sizeLimit: '10MB', allowMultiple: false, uploadDescription: '请上传客户基础开户信息文件。', description: '客户基础开户信息文件。' },
  { id: 'w8_ben', name: 'W8-ben表格', handlingMethod: '第三方签署', signingPlatform: 'Documenso', signingTemplateName: 'W8-ben表格模板', signingDescription: '通过 Documenso 完成 W8-ben 表格签署。', showAfterSigned: true, description: '第三方签署文件，由签署流程生成后同步到申请中。' },
  { id: 'crs_controlling_person', name: 'CRS-Controlling person表格', handlingMethod: '第三方签署', signingPlatform: 'Documenso', signingTemplateName: 'CRS-Controlling person表格模板', signingDescription: '通过 Documenso 完成 CRS-Controlling person 表格签署。', showAfterSigned: true, description: '第三方签署文件，用于确认客户税务居民身份相关信息。' },
]

export const initialBrokerageConfigs = [
  {
    id: 'BRK-CFG-IBKR',
    name: 'IBKR 盈透证券',
    englishName: 'Interactive Brokers',
    code: 'IBKR',
    logo: 'IB',
    description: '适合需要覆盖全球市场、专业交易功能和多币种证券账户的客户。',
    websiteUrl: 'https://www.interactivebrokers.com',
    displayTags: ['全球市场', '推荐'],
    displayOrder: 1,
    status: '启用',
    adminFee: '100',
    feeCurrency: 'USD',
    accountTypes: ['现金账户'],
    settlementCurrencies: ['USD', 'HKD', 'CNY'],
    estimatedTime: '3-7 个工作日',
    marketCoverage: ['美股', '港股', '全球市场'],
    materials: [
      {
        id: 'address_proof',
        name: '地址证明',
        handlingMethod: '用户上传',
        required: true,
        formats: 'PDF/JPG/PNG',
        sizeLimit: '10MB',
        allowMultiple: false,
        uploadDescription: '请上传近 3 个月内地址证明文件。',
        description: '近 3 个月内显示申请人姓名和居住地址的银行账单、水电账单或政府文件。',
        enabled: true,
      },
    ],
    updatedAt: '2026-06-22 10:20',
    updatedBy: '运营管理员',
  },
  {
    id: 'BRK-CFG-WEBULL',
    name: 'Webull 微牛证券',
    englishName: 'Webull Securities',
    code: 'WEBULL',
    logo: 'WB',
    description: '适合优先开通美港股交易、希望流程轻量且处理速度较快的客户。',
    websiteUrl: 'https://www.webull.com',
    displayTags: ['美港股', '流程便捷'],
    displayOrder: 2,
    status: '启用',
    adminFee: '100',
    feeCurrency: 'USD',
    accountTypes: ['现金账户'],
    settlementCurrencies: ['USD', 'HKD', 'CNY'],
    estimatedTime: '3-7 个工作日',
    marketCoverage: ['美股', '港股'],
    materials: [
      {
        id: 'basic_profile',
        name: '账户基础资料',
        handlingMethod: '用户上传',
        required: true,
        formats: 'PDF/JPG/PNG',
        sizeLimit: '10MB',
        allowMultiple: false,
        uploadDescription: '请上传客户基础开户信息文件。',
        description: '客户基础开户信息文件。',
        enabled: true,
      },
      {
        id: 'w8_ben',
        name: 'W8-ben表格',
        handlingMethod: '第三方签署',
        required: true,
        signingPlatform: 'Documenso',
        signingTemplateName: 'W8-ben表格模板',
        signingDescription: '通过 Documenso 完成 W8-ben 表格签署。',
        showAfterSigned: true,
        description: '第三方签署文件，由签署流程生成后同步到申请中。',
        enabled: true,
      },
      {
        id: 'crs_controlling_person',
        name: 'CRS-Controlling person表格',
        handlingMethod: '第三方签署',
        required: true,
        signingPlatform: 'Documenso',
        signingTemplateName: 'CRS-Controlling person表格模板',
        signingDescription: '通过 Documenso 完成 CRS-Controlling person 表格签署。',
        showAfterSigned: true,
        description: '第三方签署文件，用于确认客户已阅读并接受相关风险披露。',
        enabled: true,
      },
    ],
    updatedAt: '2026-06-22 10:20',
    updatedBy: '运营管理员',
  },
]

export function getBrokerConfigClientId(config = {}) {
  const code = String(config.code || '').toUpperCase()
  if (code === 'WEBULL') return 'webull'
  if (code === 'IBKR') return 'ibkr'
  return code.toLowerCase()
}
