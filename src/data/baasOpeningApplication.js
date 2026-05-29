export const personalProfileFields = [
  { key: 'firstName', label: '名 firstName', required: true },
  { key: 'lastName', label: '姓 lastName', required: true },
  { key: 'birthday', label: '出生日期 birthday', required: true, hint: 'BaaS 需要格式：yyyy-MM-dd' },
  { key: 'gender', label: '性别 gender', required: true, hint: 'BaaS 需要格式：MALE / FEMALE' },
  { key: 'addressLine1', label: '居住地街道地址 addressLine1', required: true, hint: 'BaaS 需要格式：英文字母、数字和常用符号' },
  { key: 'addressLine2', label: '居住地详细地址 addressLine2', required: false },
  { key: 'city', label: '城市 city', required: true },
  { key: 'country', label: '国家 country', required: true, hint: 'BaaS 需要格式：ISO 3166-1 alpha-2，例如 US、CN、HK' },
  { key: 'postalCode', label: '邮政编码 postalCode', required: true },
  { key: 'identityType', label: '证件类型 identityType', required: true, hint: 'BaaS 需要枚举：CN-RIC / PASSPORT', note: '读取自 Sumsub KYC' },
  { key: 'number', label: '证件号码 number', required: true, note: '读取自 Sumsub KYC' },
  { key: 'region', label: '地区 region', required: true },
]

export const attachmentFields = [
  { key: 'attachmentAddress', label: '地址证明 attachmentAddress.fileId', required: true },
  { key: 'attachmentIdentity', label: '身份证明文件 attachmentIdentity.fileId', required: true },
  { key: 'attachmentFatca', label: 'FATCA 表格 attachmentFatca.fileId', required: true, hint: 'W8Ben 或 W9' },
  { key: 'attachmentSourceOfFunds', label: '资金来源证明 attachmentSourceOfFunds.fileId', required: true },
]

export const mockBaasOpeningProfile = {
  firstName: 'Wanyara',
  lastName: 'Wan',
  birthday: '1990-03-18',
  gender: 'FEMALE',
  addressLine1: '88 Queens Road Central',
  addressLine2: 'Suite 1208',
  city: 'Hong Kong',
  country: 'HK',
  postalCode: '999077',
  identityType: 'PASSPORT',
  number: 'P1234567',
  region: 'HK',
}

const commonAddressPattern = /^[A-Za-z0-9\s.,#'/-]+$/
const cityPattern = /^[A-Za-z\s]+$/

export function createEmptyBaasApplication() {
  return {
    attachmentAddress: null,
    attachmentIdentity: null,
    attachmentFatca: null,
    attachmentSourceOfFunds: null,
  }
}

export function normalizeGender(value) {
  const normalized = String(value || '').trim().toUpperCase()
  if (['MALE', 'M'].includes(normalized)) return 'MALE'
  if (['FEMALE', 'F'].includes(normalized)) return 'FEMALE'
  return ''
}

export function validatePersonalField(key, value, values) {
  const text = String(value || '').trim()
  if (!text && key !== 'addressLine2') {
    return '该字段为 BaaS 开户必填项。'
  }

  if (!text) {
    return ''
  }

  if (key === 'birthday' && !/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return 'birthday 格式必须为 yyyy-MM-dd。'
  }

  if (key === 'country' && !/^[A-Z]{2}$/.test(text)) {
    return 'country 必须是 ISO 3166-1 alpha-2 两位国家码，例如 US、CN、HK。'
  }

  if (key === 'gender' && !['MALE', 'FEMALE'].includes(text.toUpperCase())) {
    return 'gender 需要映射为 MALE / FEMALE。'
  }

  if ((key === 'addressLine1' || key === 'addressLine2') && !commonAddressPattern.test(text)) {
    return `${key} 仅允许英文字母、数字和常用符号。`
  }

  if (key === 'city' && !cityPattern.test(text)) {
    return 'city 仅允许英文字母和空格。'
  }

  if (key === 'identityType' && !['CN-RIC', 'PASSPORT'].includes(text)) {
    return 'identityType 只能是 CN-RIC 或 PASSPORT。'
  }

  return ''
}

export function validateBaasApplication(profileValues, supplementValues) {
  const errors = {}

  personalProfileFields.forEach((field) => {
    const error = validatePersonalField(field.key, profileValues[field.key], profileValues)
    if (error) {
      errors[field.key] = error
    }
  })

  attachmentFields.forEach((field) => {
    if (!supplementValues[field.key]?.fileId) {
      errors[field.key] = '请上传该附件。'
    }
  })

  return errors
}

export function getBaasApplicationSections(profileValues) {
  return personalProfileFields.reduce((sections, field) => {
    const value = profileValues[field.key]
    const text = String(value || '').trim()

    if (!text) {
      sections.missing.push(field)
      return sections
    }

    sections.acquired.push(field)

    return sections
  }, { acquired: [], missing: [] })
}

export function createMockFile(file) {
  if (!file) return null
  return {
    fileId: `mock_file_${Date.now()}`,
    name: file.name,
    size: file.size,
    type: file.type,
  }
}
