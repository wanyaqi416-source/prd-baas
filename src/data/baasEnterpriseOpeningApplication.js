const regularAttachmentAccept = '.pdf,.jpeg,.png,application/pdf,image/jpeg,image/png'
const regularAttachmentDescription = '支持 PDF / JPEG / PNG，单个文件大小限制 8MB。'
const regularAttachmentExtensions = ['pdf', 'jpeg', 'png']
const regularAttachmentLimit = 8 * 1024 * 1024

const countryCodeHint = '要求 2 位国家/地区代码，例如 CN、US、HK。'
const dateHint = '格式：YYYY-MM-DD。'

export const enterpriseIdentityFields = [
  { path: 'personType', label: '实体类型', required: true, section: '提交类型', source: 'fidere', readOnly: true },
]

export const businessInfoFields = [
  { path: 'businessInfo.businessNameEn', label: '企业英文名称', required: true, section: '基本信息', source: 'fidere', readOnly: true },
  { path: 'businessInfo.businessNumber', label: '企业编号', required: true, section: '基本信息', source: 'fidere', readOnly: true },
  { path: 'businessInfo.email', label: '企业邮箱', required: true, section: '基本信息', validation: 'email', placeholder: '请输入企业邮箱', supplement: true },
  { path: 'businessInfo.phonePrefix', label: '手机号码前缀', required: true, section: '基本信息', validation: 'phonePrefix', placeholder: '例如 +86', supplement: true },
  { path: 'businessInfo.phone', label: '手机号码', required: true, section: '基本信息', validation: 'phone', placeholder: '请输入手机号码', hint: '提交前会尝试格式化为 E.164 国际格式。', supplement: true },
  { path: 'businessInfo.website', label: '网站', required: false, section: '基本信息', placeholder: '请输入网站，可选', supplement: true },
  { path: 'businessInfo.registrationDate', label: '注册日期', required: true, section: '基本信息', validation: 'date', hint: dateHint, source: 'fidere', readOnly: true },
  { path: 'businessInfo.taxNumber', label: '税号', required: true, section: '基本信息', placeholder: '请输入税号', supplement: true },
  { path: 'businessInfo.industry', label: '行业代码(NAICS)', required: true, section: '基本信息', validation: 'industry', sanitize: 'digits', maxLength: 6, placeholder: '请输入 6 位 NAICS 代码', hint: '提交前会执行 padStart(6, "0").slice(0, 6)。', supplement: true },
]

export const businessAddressFields = [
  { path: 'businessInfo.registrationAddress.addressLine1', label: '注册地址主要地址', required: true, section: '注册地址', source: 'fidere', readOnly: true },
  { path: 'businessInfo.registrationAddress.addressLine2', label: '注册地址辅助地址', required: false, section: '注册地址', source: 'fidere', readOnly: true },
  { path: 'businessInfo.registrationAddress.city', label: '城市', required: true, section: '注册地址', source: 'fidere', readOnly: true },
  { path: 'businessInfo.registrationAddress.state', label: '州/省', required: true, section: '注册地址', source: 'fidere', readOnly: true },
  { path: 'businessInfo.registrationAddress.country', label: '国家', required: true, section: '注册地址', validation: 'countryCode', hint: countryCodeHint, source: 'fidere', readOnly: true },
  { path: 'businessInfo.registrationAddress.postalCode', label: '邮编', required: true, section: '注册地址', source: 'fidere', readOnly: true },
]

export const businessAttachmentFields = [
  { path: 'businessInfo.attachmentLicense', label: '许可证文件', required: true, section: '企业文件', inputType: 'file', source: 'fidere', accept: regularAttachmentAccept, acceptDescription: regularAttachmentDescription, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
  { path: 'businessInfo.attachmentAddress', label: '地址证明文件', required: true, section: '企业文件', inputType: 'file', source: 'fidere', accept: regularAttachmentAccept, acceptDescription: regularAttachmentDescription, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
  { path: 'businessInfo.attachmentCorporateRecords', label: '企业记录文件', required: true, section: '企业文件', inputType: 'file', source: 'fidere', accept: regularAttachmentAccept, acceptDescription: regularAttachmentDescription, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
  { path: 'businessInfo.attachmentCorporateResolution', label: '企业决议文件', required: true, section: '企业文件', inputType: 'file', source: 'fidere', accept: regularAttachmentAccept, acceptDescription: regularAttachmentDescription, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
  { path: 'businessInfo.attachmentFinancialStatements', label: '财务报表文件', required: true, section: '企业文件', inputType: 'file', supplement: true, accept: regularAttachmentAccept, acceptDescription: regularAttachmentDescription, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
  { path: 'businessInfo.attachmentRegistrationNumber', label: '注册号文件', required: true, section: '企业文件', inputType: 'file', source: 'fidere', accept: regularAttachmentAccept, acceptDescription: regularAttachmentDescription, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
  { path: 'businessInfo.attachmentSourceOfFunds', label: '资金来源证明文件', required: true, section: '企业文件', inputType: 'file', supplement: true, accept: regularAttachmentAccept, acceptDescription: regularAttachmentDescription, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
  { path: 'businessInfo.attachmentTaxIdNumber', label: '税号文件', required: true, section: '企业文件', inputType: 'file', supplement: true, accept: regularAttachmentAccept, acceptDescription: regularAttachmentDescription, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
  { path: 'businessInfo.attachmentFiscalCertificate', label: '财政证明文件', required: false, section: '企业文件', inputType: 'file', source: 'fidere', accept: regularAttachmentAccept, acceptDescription: `${regularAttachmentDescription}可选，有值才提交。`, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
  { path: 'businessInfo.attachmentFatca', label: 'FATCA 文件', required: false, section: '企业文件', inputType: 'file', source: 'fidere', accept: regularAttachmentAccept, acceptDescription: `${regularAttachmentDescription}可选，有值才提交。`, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
]

export const personInfoFields = [
  { path: 'personInfo.firstName', label: '名', required: true, section: '基本信息', source: 'fidere', readOnly: true },
  { path: 'personInfo.lastName', label: '姓', required: true, section: '基本信息', source: 'fidere', readOnly: true },
  { path: 'personInfo.birthday', label: '出生日期', required: true, section: '基本信息', validation: 'date', hint: dateHint, source: 'fidere', readOnly: true },
  { path: 'personInfo.gender', label: '性别', required: true, section: '基本信息', inputType: 'select', options: ['MALE', 'FEMALE'], source: 'fidere', readOnly: true },
  { path: 'personInfo.region', label: '地区代码', required: true, section: '基本信息', validation: 'countryCode', hint: countryCodeHint, source: 'fidere', readOnly: true },
  { path: 'personInfo.identityType', label: '证件类型', required: true, section: '身份信息', inputType: 'select', options: ['CN-RIC', 'PASSPORT'], source: 'fidere', readOnly: true },
  { path: 'personInfo.idNo', label: '证件号码', required: true, section: '身份信息', source: 'fidere', readOnly: true },
]

export const personAddressFields = [
  { path: 'personInfo.address.addressLine1', label: '主要地址', required: true, section: '地址信息', source: 'fidere', readOnly: true },
  { path: 'personInfo.address.addressLine2', label: '辅助地址', required: false, section: '地址信息', source: 'fidere', readOnly: true },
  { path: 'personInfo.address.city', label: '城市', required: true, section: '地址信息', source: 'fidere', readOnly: true },
  { path: 'personInfo.address.state', label: '州/省', required: true, section: '地址信息', source: 'fidere', readOnly: true },
  { path: 'personInfo.address.country', label: '国家', required: true, section: '地址信息', validation: 'countryCode', hint: countryCodeHint, source: 'fidere', readOnly: true },
  { path: 'personInfo.address.postalCode', label: '邮编', required: true, section: '地址信息', source: 'fidere', readOnly: true },
]

export const personAttachmentFields = [
  { path: 'personInfo.attachmentAddress', label: '地址证明文件', required: true, section: '文件信息', inputType: 'file', supplement: true, accept: regularAttachmentAccept, acceptDescription: regularAttachmentDescription, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
  { path: 'personInfo.attachmentIdentity', label: '身份证明文件', required: true, section: '文件信息', inputType: 'file', source: 'fidere', accept: regularAttachmentAccept, acceptDescription: regularAttachmentDescription, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
  { path: 'personInfo.attachmentFatca', label: 'FATCA 文件', required: false, section: '文件信息', inputType: 'file', supplement: true, accept: regularAttachmentAccept, acceptDescription: `${regularAttachmentDescription}可选，有值才提交。`, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
  { path: 'personInfo.attachmentSourceOfFunds', label: '资金来源证明文件', required: false, section: '文件信息', inputType: 'file', supplement: true, accept: regularAttachmentAccept, acceptDescription: `${regularAttachmentDescription}可选，有值才提交。`, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
]

export const shareholderRatioField = { path: 'ratio', label: '持股比例', required: true, section: '股东比例', validation: 'ratio', placeholder: '例如 0.5', hint: '0 到 1 的字符串格式，例如 0.5 表示 50%。', supplement: true }

export const shareholderPersonFields = [
  { path: 'personInfo.firstName', label: '名', required: true, section: '基本信息', source: 'fidere', readOnly: true },
  { path: 'personInfo.lastName', label: '姓', required: true, section: '基本信息', source: 'fidere', readOnly: true },
  { path: 'personInfo.birthday', label: '出生日期', required: true, section: '基本信息', validation: 'date', hint: dateHint, source: 'fidere', readOnly: true },
  { path: 'personInfo.nationality', label: '国籍', required: false, section: '基本信息', validation: 'countryCode', hint: `${countryCodeHint}可选。`, supplement: true },
  { path: 'personInfo.gender', label: '性别', required: true, section: '基本信息', inputType: 'select', options: ['MALE', 'FEMALE'], source: 'fidere', readOnly: true },
  { path: 'personInfo.region', label: '地区代码', required: true, section: '基本信息', validation: 'countryCode', hint: countryCodeHint, source: 'fidere', readOnly: true },
  { path: 'personInfo.identityType', label: '证件类型', required: true, section: '身份信息', inputType: 'select', options: ['CN-RIC', 'PASSPORT'], source: 'fidere', readOnly: true },
  { path: 'personInfo.idNo', label: '证件号码', required: true, section: '身份信息', source: 'fidere', readOnly: true },
]

export const shareholderAddressFields = [
  { path: 'personInfo.address.addressLine1', label: '主要地址', required: true, section: '地址信息', source: 'fidere', readOnly: true },
  { path: 'personInfo.address.addressLine2', label: '辅助地址', required: false, section: '地址信息', source: 'fidere', readOnly: true },
  { path: 'personInfo.address.city', label: '城市', required: true, section: '地址信息', source: 'fidere', readOnly: true },
  { path: 'personInfo.address.state', label: '州/省', required: true, section: '地址信息', source: 'fidere', readOnly: true },
  { path: 'personInfo.address.country', label: '国家', required: true, section: '地址信息', validation: 'countryCode', hint: countryCodeHint, source: 'fidere', readOnly: true },
  { path: 'personInfo.address.postalCode', label: '邮编', required: true, section: '地址信息', source: 'fidere', readOnly: true },
]

export const shareholderAttachmentFields = [
  { path: 'personInfo.attachmentAddress', label: '地址证明文件', required: true, section: '文件信息', inputType: 'file', source: 'fidere', accept: regularAttachmentAccept, acceptDescription: regularAttachmentDescription, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
  { path: 'personInfo.attachmentIdentity', label: '身份证明文件', required: true, section: '文件信息', inputType: 'file', source: 'fidere', accept: regularAttachmentAccept, acceptDescription: regularAttachmentDescription, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
  { path: 'personInfo.attachmentFatca', label: 'FATCA 文件', required: false, section: '文件信息', inputType: 'file', supplement: true, accept: regularAttachmentAccept, acceptDescription: `${regularAttachmentDescription}可选，有值才提交。`, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
  { path: 'personInfo.attachmentSourceOfFunds', label: '资金来源证明文件', required: false, section: '文件信息', inputType: 'file', supplement: true, accept: regularAttachmentAccept, acceptDescription: `${regularAttachmentDescription}可选，有值才提交。`, allowedExtensions: regularAttachmentExtensions, fileLimit: regularAttachmentLimit },
]

const sampleUploadedImageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAx0lEQVR4Xu3XMQqAMAxE0fz/n7l0EEvBGlLZkgdOUOMtYmBm9kC/7z0A/E8EwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAL3u2wH45B9JVAeObK+9uAAAAABJRU5ErkJggg=='

function createMockUploadedFile(fileId, name) {
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
  businessInfo: {
    businessNameEn: 'FIDERE GLOBAL HOLDINGS LIMITED',
    businessNumber: 'BUS20240001',
    email: '',
    phonePrefix: '+86',
    phone: '',
    website: '',
    registrationDate: '2020-01-01',
    taxNumber: '',
    industry: '',
    registrationAddress: {
      addressLine1: 'Unit 1808, 18/F, Central Plaza',
      addressLine2: '',
      city: 'Hong Kong',
      state: 'Hong Kong',
      country: 'HK',
      postalCode: '999077',
    },
    attachmentLicense: createMockUploadedFile('kyb_license_001', 'Certificate of Incorporation.png'),
    attachmentAddress: createMockUploadedFile('kyb_address_001', 'Office Lease Address Proof.png'),
    attachmentCorporateRecords: createMockUploadedFile('kyb_articles_001', 'Articles of Association.png'),
    attachmentCorporateResolution: createMockUploadedFile('kyb_resolution_001', 'Board Resolution.png'),
    attachmentFinancialStatements: null,
    attachmentRegistrationNumber: createMockUploadedFile('kyb_br_001', 'Business Registration Certificate.png'),
    attachmentSourceOfFunds: null,
    attachmentTaxIdNumber: null,
    attachmentFiscalCertificate: createMockUploadedFile('mock_enterprise_fiscal_001', 'Fiscal Certificate.png'),
    attachmentFatca: createMockUploadedFile('mock_enterprise_fatca_001', 'W8Ben Form.png'),
  },
  personInfo: {
    firstName: 'Michael',
    lastName: 'Chan',
    birthday: '1979-11-03',
    gender: 'MALE',
    region: 'HK',
    identityType: 'PASSPORT',
    idNo: 'K7654321',
    address: {
      addressLine1: '22 Des Voeux Road Central',
      addressLine2: '',
      city: 'Hong Kong',
      state: 'Hong Kong',
      country: 'HK',
      postalCode: '999077',
    },
    attachmentAddress: null,
    attachmentIdentity: createMockUploadedFile('rep_id_001', 'Representative Passport.png'),
    attachmentFatca: null,
    attachmentSourceOfFunds: null,
  },
  shareholders: [
    {
      id: 'sh_001',
      ratio: '',
      personInfo: {
        firstName: 'Wanyara',
        lastName: 'Wan',
        birthday: '1988-04-16',
        nationality: '',
        gender: 'FEMALE',
        region: 'CN',
        identityType: 'CN-RIC',
        idNo: '110101198804160028',
        address: {
          addressLine1: '88 Queens Road Central',
          addressLine2: 'Suite 1208',
          city: 'Hong Kong',
          state: 'Hong Kong',
          country: 'HK',
          postalCode: '999077',
        },
        attachmentAddress: createMockUploadedFile('sh_addr_001', 'Shareholder Address Proof.png'),
        attachmentIdentity: createMockUploadedFile('sh_id_001', 'Shareholder ID.png'),
        attachmentFatca: null,
        attachmentSourceOfFunds: null,
      },
    },
  ],
}

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

function optionValues(field) {
  return (field.options || []).map((option) => (typeof option === 'string' ? option : option.value))
}

function textValue(value) {
  return String(value || '').trim()
}

function validateFieldValue(field, value) {
  const text = textValue(value)

  if (!text) return ''

  const allowedValues = optionValues(field)
  if (allowedValues.length && !allowedValues.includes(text)) {
    return '请选择有效选项。'
  }

  if (field.validation === 'date') {
    return /^\d{4}-\d{2}-\d{2}$/.test(text) ? '' : '日期格式必须为 YYYY-MM-DD。'
  }

  if (field.validation === 'email') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) ? '' : '请输入有效邮箱格式。'
  }

  if (field.validation === 'countryCode') {
    return /^[A-Z]{2}$/.test(text.toUpperCase()) ? '' : '国家/地区字段必须为 2 位代码。'
  }

  if (field.validation === 'phonePrefix') {
    return /^\+\d{1,4}$/.test(text) ? '' : '手机号码前缀必须以 + 开头，例如 +86。'
  }

  if (field.validation === 'phone') {
    return /^\+?[\d\s-]{5,20}$/.test(text) ? '' : '请输入有效手机号码。'
  }

  if (field.validation === 'industry') {
    return /^\d{1,6}$/.test(text) ? '' : '行业代码必须为 1 到 6 位数字。'
  }

  if (field.validation === 'ratio') {
    const number = Number(text)
    return number > 0 && number <= 1 ? '' : '持股比例必须大于 0 且不超过 1。'
  }

  return ''
}

function classifyField(sections, data, field, group) {
  const value = getByPath(data, field.path)
  const text = textValue(value)
  const item = {
    ...field,
    id: `${group}:${field.path}`,
    group,
    value,
  }

  if (!text && field.required !== false) {
    sections.missing.push({ ...item, error: '该字段为企业开户必填项。' })
    return
  }

  if (!text) return

  const error = validateFieldValue(field, value)
  if (error) {
    sections.revision.push({ ...item, error })
    return
  }

  sections.acquired.push(item)
}

function classifyAttachment(sections, data, field, group) {
  const value = getByPath(data, field.path)
  const item = {
    ...field,
    id: `${group}:${field.path}`,
    group,
    value,
  }

  if (value?.fileId) {
    sections.acquired.push(item)
    return
  }

  if (field.required === false) return

  sections.missing.push({ ...item, error: `请上传${field.label}。`, inputType: 'file' })
}

function classifyFields(sections, data, fields, group) {
  fields.forEach((field) => {
    if (field.inputType === 'file') {
      classifyAttachment(sections, data, field, group)
      return
    }
    classifyField(sections, data, field, group)
  })
}

function shareholderGroup(shareholder, index) {
  const person = shareholder.personInfo || {}
  return `股东${index + 1}：${person.firstName || ''} ${person.lastName || ''}`.trim()
}

function shareholderFieldPath(index, field) {
  return `shareholders.${index}.${field.path}`
}

function shareholderFieldsForIndex(index) {
  return [
    { ...shareholderRatioField, path: shareholderFieldPath(index, shareholderRatioField) },
    ...shareholderPersonFields.map((field) => ({ ...field, path: shareholderFieldPath(index, field) })),
    ...shareholderAddressFields.map((field) => ({ ...field, path: shareholderFieldPath(index, field) })),
    ...shareholderAttachmentFields.map((field) => ({ ...field, path: shareholderFieldPath(index, field) })),
  ]
}

export function getEnterpriseSections(data) {
  const sections = { acquired: [], missing: [], revision: [] }

  classifyFields(sections, data, enterpriseIdentityFields, '企业信息')
  classifyFields(sections, data, businessInfoFields, '企业信息')
  classifyFields(sections, data, businessAddressFields, '企业信息')
  classifyFields(sections, data, businessAttachmentFields, '企业信息')
  classifyFields(sections, data, personInfoFields, '法人代表信息')
  classifyFields(sections, data, personAddressFields, '法人代表信息')
  classifyFields(sections, data, personAttachmentFields, '法人代表信息')

  ;(data.shareholders || []).forEach((shareholder, index) => {
    classifyFields(sections, data, shareholderFieldsForIndex(index), shareholderGroup(shareholder, index))
  })

  const ratioTotal = (data.shareholders || []).reduce((sum, shareholder) => {
    const ratio = Number(shareholder.ratio)
    return Number.isFinite(ratio) ? sum + ratio : sum
  }, 0)

  if (ratioTotal > 1) {
    sections.revision.push({
      id: '股东信息:shareholdersRatioTotal',
      group: '股东信息',
      path: 'shareholdersRatioTotal',
      label: '股东持股比例总和',
      value: String(ratioTotal),
      error: '所有股东 ratio 总和不能超过 1。',
    })
  }

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

  if (!data.shareholders?.length) {
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
    ratio: '',
    personInfo: {
      firstName: '',
      lastName: '',
      birthday: '',
      nationality: '',
      gender: 'MALE',
      region: '',
      identityType: 'PASSPORT',
      idNo: '',
      address: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      },
      attachmentAddress: null,
      attachmentIdentity: null,
      attachmentFatca: null,
      attachmentSourceOfFunds: null,
    },
  }
}

function filePayload(file) {
  return file?.fileId ? { fileId: file.fileId } : undefined
}

function compactObject(source) {
  return Object.fromEntries(
    Object.entries(source)
      .map(([key, value]) => {
        if (value && typeof value === 'object' && !Array.isArray(value) && !value.fileId) {
          return [key, compactObject(value)]
        }
        return [key, value]
      })
      .filter(([, value]) => {
        if (value === undefined || value === null || value === '') return false
        if (value && typeof value === 'object' && !Array.isArray(value) && !value.fileId && !Object.keys(value).length) return false
        return true
      }),
  )
}

function formatE164Phone(phonePrefix, phone) {
  const rawPhone = textValue(phone)
  const phoneDigits = rawPhone.replace(/\D/g, '')
  if (rawPhone.startsWith('+')) return `+${phoneDigits}`
  const prefixDigits = textValue(phonePrefix).replace(/\D/g, '')
  return `+${prefixDigits}${phoneDigits}`
}

function formatIndustryCode(industry) {
  return textValue(industry).replace(/\D/g, '').padStart(6, '0').slice(0, 6)
}

function buildPersonInfoPayload(personInfo) {
  return compactObject({
    firstName: personInfo.firstName,
    lastName: personInfo.lastName,
    birthday: personInfo.birthday,
    nationality: personInfo.nationality,
    gender: personInfo.gender,
    identityType: personInfo.identityType,
    region: personInfo.region,
    idNo: personInfo.idNo,
    address: {
      addressLine1: personInfo.address?.addressLine1,
      addressLine2: personInfo.address?.addressLine2,
      city: personInfo.address?.city,
      state: personInfo.address?.state,
      country: personInfo.address?.country,
      postalCode: personInfo.address?.postalCode,
    },
    attachmentAddress: filePayload(personInfo.attachmentAddress),
    attachmentIdentity: filePayload(personInfo.attachmentIdentity),
    attachmentFatca: filePayload(personInfo.attachmentFatca),
    attachmentSourceOfFunds: filePayload(personInfo.attachmentSourceOfFunds),
  })
}

export function buildEnterpriseLegalEntityPayload(data) {
  const businessInfo = data.businessInfo || {}

  return {
    personType: 'COMPANY',
    businessInfo: compactObject({
      businessNameEn: businessInfo.businessNameEn,
      businessNumber: businessInfo.businessNumber,
      email: businessInfo.email,
      phone: formatE164Phone(businessInfo.phonePrefix, businessInfo.phone),
      phonePrefix: businessInfo.phonePrefix,
      website: businessInfo.website,
      registrationDate: businessInfo.registrationDate,
      taxNumber: businessInfo.taxNumber,
      industry: formatIndustryCode(businessInfo.industry),
      registrationAddress: {
        addressLine1: businessInfo.registrationAddress?.addressLine1,
        addressLine2: businessInfo.registrationAddress?.addressLine2,
        city: businessInfo.registrationAddress?.city,
        state: businessInfo.registrationAddress?.state,
        country: businessInfo.registrationAddress?.country,
        postalCode: businessInfo.registrationAddress?.postalCode,
      },
      attachmentLicense: filePayload(businessInfo.attachmentLicense),
      attachmentAddress: filePayload(businessInfo.attachmentAddress),
      attachmentCorporateRecords: filePayload(businessInfo.attachmentCorporateRecords),
      attachmentCorporateResolution: filePayload(businessInfo.attachmentCorporateResolution),
      attachmentFinancialStatements: filePayload(businessInfo.attachmentFinancialStatements),
      attachmentRegistrationNumber: filePayload(businessInfo.attachmentRegistrationNumber),
      attachmentSourceOfFunds: filePayload(businessInfo.attachmentSourceOfFunds),
      attachmentTaxIdNumber: filePayload(businessInfo.attachmentTaxIdNumber),
      attachmentFiscalCertificate: filePayload(businessInfo.attachmentFiscalCertificate),
      attachmentFatca: filePayload(businessInfo.attachmentFatca),
    }),
    personInfo: buildPersonInfoPayload(data.personInfo || {}),
    shareholders: (data.shareholders || []).map((shareholder) => ({
      ratio: shareholder.ratio,
      personInfo: buildPersonInfoPayload(shareholder.personInfo || {}),
    })),
  }
}
