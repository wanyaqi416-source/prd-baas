export const companyBaseFields = [
  { path: 'personType', label: 'personType', required: true, readOnly: true, hint: '固定为 COMPANY' },
  { path: 'businessNameEn', label: '企业英文名称 businessNameEn', required: true, hint: '对应我们系统的主体名称字段' },
  { path: 'registrationDate', label: '注册日期 registrationDate', required: true, hint: 'BaaS 需要格式：yyyy-MM-dd' },
  { path: 'email', label: '电子邮件 email', required: true, hint: 'BaaS 需要格式：name@example.com' },
  { path: 'phonePrefix', label: '电话前缀 phonePrefix', required: true, hint: '例如 +852、+1' },
  { path: 'phone', label: '手机号码 phone', required: true },
  { path: 'taxId', label: '税号 taxId', required: true },
  { path: 'industry', label: '行业代码 industry', required: true, hint: 'BaaS 需要 6 位 NAICS 行业代码' },
  { path: 'businessNumber', label: '商务电话 businessNumber', required: true, hint: '需要用户补充填写' },
]

export const registrationAddressFields = [
  { path: 'registrationAddress.addressLine1', label: '银行地址第一行 addressLine1', required: true, hint: '必需。主要地址栏（街道地址/邮政信箱/公司名称）。仅限英文字母，允许使用数字和常用符号。' },
  { path: 'registrationAddress.addressLine2', label: '地址线2 addressLine2', required: false, hint: '辅助地址行（公寓/套房/单元/楼栋）。仅限英文字母，允许使用数字和常用符号。' },
  { path: 'registrationAddress.city', label: '城市 city', required: true, hint: '必需。城市。仅限英文字母和空格。' },
  { path: 'registrationAddress.state', label: '州/省 state', required: true, hint: '必需。州/省/地区；所有国家/地区均需填写。美国和加拿大必须使用两位字母代码；无州/省国家可重复国家名称。' },
  { path: 'registrationAddress.country', label: '国家 country', required: true, hint: '必需。两位字母国家代码，符合 ISO 3166-1 alpha-2 标准。' },
  { path: 'registrationAddress.postalCode', label: '邮政编码 postalCode', required: true, hint: '必需。地址的邮政编码。' },
]

export const companyAttachmentFields = [
  { path: 'attachments.attachmentLicense', label: '公司营业执照 attachmentLicense', hint: 'pdf / jpeg / png，限 8M。对应我们系统的公司注册证书和商业登记证字段。' },
  { path: 'attachments.attachmentAddress', label: '地址证明 attachmentAddress', hint: 'pdf / jpeg / png，限 8M。' },
  { path: 'attachments.attachmentCorporateRecords', label: '公司章程或组织大纲 attachmentCorporateRecords', hint: 'pdf / jpeg / png，限 8M。对应我们系统的公司章程字段。' },
  { path: 'attachments.attachmentCorporateResolution', label: '公司/企业决议 attachmentCorporateResolution', hint: 'pdf / jpeg / png，限 8M。对应我们的董事会决议。' },
  { path: 'attachments.attachmentFiscalCertificate', label: '公司财务登记证明 attachmentFiscalCertificate', hint: 'pdf / jpeg / png，限 8M。' },
  { path: 'attachments.attachmentFatca', label: 'FATCA – W8Ben 或 W9 表格 attachmentFatca', hint: 'pdf / jpeg / png，限 8M。' },
  { path: 'attachments.attachmentFinancialStatement', label: '财务报表 attachmentFinancialStatement', hint: 'pdf / jpeg / png，限 8M。' },
  { path: 'attachments.attachmentRegistrationNumber', label: '政府颁发的公司注册号证明文件 attachmentRegistrationNumber', hint: 'pdf / jpeg / png，限 8M。' },
  { path: 'attachments.attachmentSourceOfFunds', label: '资金来源证明 attachmentSourceOfFunds', hint: 'pdf / jpeg / png，限 8M。' },
  { path: 'attachments.attachmentTaxIdentificationNumber', label: '税务识别号或同等文件 attachmentTaxIdentificationNumber', hint: 'pdf / jpeg / png，限 8M。' },
]

export const personFields = [
  { path: 'firstName', label: '名 firstName', required: true },
  { path: 'lastName', label: '姓 lastName', required: true },
  { path: 'birthday', label: '生日 birthday', required: true, hint: 'BaaS 需要格式：yyyy-MM-dd' },
  { path: 'gender', label: '性别 gender', required: true, hint: 'MALE / FEMALE' },
  { path: 'address.addressLine1', label: '地址第一行 addressLine1', required: true, hint: '仅允许英文字母、数字和常用符号' },
  { path: 'address.addressLine2', label: '地址第二行 addressLine2', required: false },
  { path: 'address.city', label: '城市 city', required: true, hint: '仅允许英文字母和空格' },
  { path: 'address.state', label: '州/省/地区 state', required: true },
  { path: 'address.country', label: '国家 country', required: true, hint: '两位 ISO 国家码' },
  { path: 'address.postalCode', label: '邮政编码 postalCode', required: true },
  { path: 'identityType', label: '证件类型 identityType', required: true, hint: 'CN-RIC / PASSPORT' },
  { path: 'region', label: '地区 region', required: true },
  { path: 'number', label: '身份证件号码 number', required: true },
]

export const shareholderExtraFields = [
  { path: 'ratio', label: '持股比例 ratio', required: true, hint: '0-100，必填' },
]

export const personAttachmentFields = [
  { path: 'attachments.attachmentAddress', label: '地址证明 attachmentAddress' },
  { path: 'attachments.attachmentIdentity', label: '身份证明文件 attachmentIdentity' },
  { path: 'attachments.attachmentFatca', label: 'FATCA 表格 attachmentFatca', hint: 'W8Ben 或 W9' },
  { path: 'attachments.attachmentSourceOfFunds', label: '资金来源证明 attachmentSourceOfFunds' },
]

const sampleUploadedImageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAx0lEQVR4Xu3XMQqAMAxE0fz/n7l0EEvBGlLZkgdOUOMtYmBm9kC/7z0A/E8EwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAL3u2wH45B9JVAeObK+9uAAAAABJRU5ErkJggg=='

function createMockUploadedImage(fileId, name) {
  return {
    fileId,
    name,
    size: 245760,
    type: 'image/png',
    status: '已上传',
    downloadUrl: sampleUploadedImageUrl,
  }
}

export const mockEnterpriseApplication = {
  personType: 'COMPANY',
  businessNameEn: 'FIDERE GLOBAL HOLDINGS LIMITED',
  registrationDate: '2021-08-12',
  email: 'ops@fidere-demo.com',
  phonePrefix: '+852',
  phone: '29881234',
  taxId: '',
  industry: '',
  businessNumber: '',
  registrationAddress: {
    addressLine1: 'Unit 1808, 18/F, Central Plaza',
    addressLine2: '18 Harbour Road',
    city: 'Hong Kong',
    state: 'Hong Kong',
    country: 'HKG',
    postalCode: '999077',
  },
  attachments: {
    attachmentLicense: createMockUploadedImage('kyb_license_001', 'Certificate of Incorporation.png'),
    attachmentAddress: createMockUploadedImage('kyb_address_001', 'Office Lease Address Proof.png'),
    attachmentCorporateRecords: createMockUploadedImage('kyb_articles_001', 'Articles of Association.png'),
    attachmentCorporateResolution: createMockUploadedImage('kyb_resolution_001', 'Board Resolution.png'),
    attachmentFiscalCertificate: createMockUploadedImage('mock_enterprise_fiscal_001', 'Fiscal Certificate.png'),
    attachmentFatca: createMockUploadedImage('mock_enterprise_fatca_001', 'W8Ben Form.png'),
    attachmentFinancialStatement: createMockUploadedImage('mock_enterprise_financial_001', 'Financial Statement.png'),
    attachmentRegistrationNumber: createMockUploadedImage('kyb_br_001', 'Business Registration Certificate.png'),
    attachmentSourceOfFunds: createMockUploadedImage('mock_enterprise_sof_001', 'Source of Funds.png'),
    attachmentTaxIdentificationNumber: createMockUploadedImage('mock_enterprise_tax_001', 'Tax Identification.png'),
  },
  shareholders: [
    {
      id: 'sh_001',
      firstName: 'Wanyara',
      lastName: 'Wan',
      birthday: '1988-04-16',
      gender: 'FEMALE',
      ratio: '',
      address: {
        addressLine1: '88 Queens Road Central',
        addressLine2: 'Suite 1208',
        city: 'Hong Kong',
        state: 'Hong Kong',
        country: 'HK',
        postalCode: '999077',
      },
      identityType: '身份证',
      region: 'CN',
      number: '110101198804160028',
      attachments: {
        attachmentAddress: createMockUploadedImage('sh_addr_001', 'Shareholder Address Proof.png'),
        attachmentIdentity: createMockUploadedImage('sh_id_001', 'Shareholder ID.png'),
        attachmentFatca: null,
        attachmentSourceOfFunds: null,
      },
    },
  ],
  directors: [
    {
      id: 'dir_001',
      role: '董事 / 授权代表',
      firstName: 'Michael',
      lastName: 'Chan',
      birthday: '1979-11-03',
      gender: 'MALE',
      address: {
        addressLine1: '22 Des Voeux Road Central',
        addressLine2: '',
        city: 'Hong Kong',
        state: 'Hong Kong',
        country: 'HKG',
        postalCode: '999077',
      },
      identityType: 'PASSPORT',
      region: 'HK',
      number: 'K7654321',
      attachments: {
        attachmentAddress: null,
        attachmentIdentity: createMockUploadedImage('dir_id_001', 'Director Passport.png'),
        attachmentFatca: null,
        attachmentSourceOfFunds: null,
      },
    },
  ],
}

const addressPattern = /^[A-Za-z0-9\s.,#'/-]+$/
const cityPattern = /^[A-Za-z\s]+$/

export function getByPath(target, path) {
  return path.split('.').reduce((value, key) => value?.[key], target)
}

export function setByPath(target, path, value) {
  const keys = path.split('.')
  const clone = Array.isArray(target) ? [...target] : { ...target }
  let cursor = clone
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value
      return
    }
    cursor[key] = Array.isArray(cursor[key]) ? [...cursor[key]] : { ...cursor[key] }
    cursor = cursor[key]
  })
  return clone
}

function validateCommon(path, value, owner) {
  const text = String(value || '').trim()
  if (path.includes('registrationDate') || path === 'birthday') {
    return /^\d{4}-\d{2}-\d{2}$/.test(text) ? '' : '日期格式必须为 yyyy-MM-dd。'
  }
  if (path === 'email') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) ? '' : 'email 格式不正确。'
  }
  if (path === 'phonePrefix') {
    return /^\+\d{1,4}$/.test(text) ? '' : '电话前缀需要类似 +852。'
  }
  if (path === 'industry') {
    return /^\d{6}$/.test(text) ? '' : 'industry 必须是 6 位 NAICS 行业代码。'
  }
  if (path.endsWith('country')) {
    return /^[A-Z]{2}$/.test(text) ? '' : '国家目前不是两位码，需转换为 ISO 3166-1 alpha-2。'
  }
  if (path.endsWith('state')) {
    const country = String(owner?.country || getByPath(owner, path.replace(/state$/, 'country')) || '').trim().toUpperCase()
    if (!text) return '州/省必填。'
    if (['US', 'CA'].includes(country) && !/^[A-Z]{2}$/.test(text.toUpperCase())) {
      return '国家为 US 或 CA 时，州/省必须是两位代码。'
    }
    return ''
  }
  if (path.endsWith('city')) {
    return cityPattern.test(text) ? '' : 'city 仅允许英文字母和空格。'
  }
  if (path.endsWith('addressLine1') || path.endsWith('addressLine2')) {
    return addressPattern.test(text) ? '' : '地址仅允许英文字母、数字和常用符号。'
  }
  if (path === 'gender') {
    return ['MALE', 'FEMALE'].includes(text) ? '' : 'gender 必须是 MALE / FEMALE。'
  }
  if (path === 'identityType') {
    return ['CN-RIC', 'PASSPORT'].includes(text) ? '' : '证件类型无法映射为 BaaS 枚举，请重新选择 CN-RIC 或 PASSPORT。'
  }
  if (path === 'ratio') {
    const number = Number(text)
    return number > 0 && number <= 100 ? '' : 'ratio 必须大于 0 且不超过 100。'
  }
  return ''
}

function classifyField(sections, source, field, group, owner = source) {
  const value = getByPath(source, field.path)
  const text = String(value || '').trim()
  const item = {
    ...field,
    id: `${group}:${field.path}`,
    group,
    value,
  }

  if (!text && field.required !== false) {
    sections.missing.push({ ...item, error: '该字段为 BaaS 开户必填项。' })
    return
  }

  if (!text) {
    return
  }

  const error = validateCommon(field.path.split('.').at(-1), value, owner) || validateCommon(field.path, value, owner)
  if (error) {
    sections.revision.push({ ...item, error })
    return
  }

  sections.acquired.push(item)
}

function classifyAttachment(sections, source, field, group) {
  const value = getByPath(source, field.path)
  const item = {
    ...field,
    id: `${group}:${field.path}`,
    group,
    value,
  }
  if (value?.fileId) {
    sections.acquired.push(item)
  } else {
    sections.missing.push({ ...item, error: `请上传${field.label}。`, inputType: 'file' })
  }
}

function classifyPerson(sections, data, collectionKey, personType, index, includeRatio) {
  const person = data[collectionKey][index]
  const label = `${personType}${index + 1}：${person.firstName || ''} ${person.lastName || ''}`.trim()
  const fields = includeRatio ? [...personFields, ...shareholderExtraFields] : personFields
  fields.forEach((field) => {
    const owner = field.path.startsWith('address.') ? person.address : person
    classifyField(sections, data, { ...field, path: `${collectionKey}.${index}.${field.path}` }, label, owner)
  })
  personAttachmentFields.forEach((field) => {
    classifyAttachment(sections, data, { ...field, path: `${collectionKey}.${index}.${field.path}` }, label)
  })
}

export function getEnterpriseSections(data) {
  const sections = { acquired: [], missing: [], revision: [] }
  companyBaseFields.forEach((field) => classifyField(sections, data, field, '企业基础资料', data))
  registrationAddressFields.forEach((field) => classifyField(sections, data, field, '企业基础资料', data.registrationAddress))
  companyAttachmentFields.forEach((field) => classifyAttachment(sections, data, field, '企业基础资料'))
  data.shareholders.forEach((person, index) => classifyPerson(sections, data, 'shareholders', '股东', index, true))
  data.directors.forEach((person, index) => classifyPerson(sections, data, 'directors', '董事/授权代表', index, false))
  return sections
}

export function validateEnterpriseApplication(data) {
  const sections = getEnterpriseSections(data)
  const errors = {}
  sections.missing.forEach((item) => {
    errors[item.id] = item.error
  })
  sections.revision.forEach((item) => {
    errors[item.id] = item.error
  })
  if (!data.shareholders.length) {
    errors.shareholders = '请至少添加一名股东。'
  }
  return errors
}

export function createMockEnterpriseFile(file) {
  if (!file) return null
  return {
    fileId: `mock_enterprise_file_${Date.now()}`,
    name: file.name,
    size: file.size,
    type: file.type,
    status: '已上传',
    downloadUrl: typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function' ? URL.createObjectURL(file) : sampleUploadedImageUrl,
  }
}

export function createBlankShareholder() {
  return {
    id: `sh_${Date.now()}`,
    firstName: '',
    lastName: '',
    birthday: '',
    gender: 'MALE',
    ratio: '',
    address: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
    identityType: 'PASSPORT',
    region: '',
    number: '',
    attachments: {
      attachmentAddress: null,
      attachmentIdentity: null,
      attachmentFatca: null,
      attachmentSourceOfFunds: null,
    },
  }
}
