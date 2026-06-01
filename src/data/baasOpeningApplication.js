export const personalProfileFields = [
  { key: 'firstName', sourceKey: 'firstName', label: '名', systemLabel: '名', baasKey: 'firstName' },
  { key: 'lastName', sourceKey: 'lastName', label: '姓', systemLabel: '姓', baasKey: 'lastName' },
  { key: 'birthday', sourceKey: 'dateOfBirth', label: '出生日期', systemLabel: '出生日期', baasKey: 'birthday' },
  { key: 'gender', sourceKey: 'gender', label: '性别', systemLabel: '性别', baasKey: 'gender', conversion: '男/女 → KYC M/F → BaaS MALE/FEMALE' },
  { key: 'nationality', sourceKey: 'nationality', label: '国籍', systemLabel: '国籍', baasKey: 'nationality', conversion: '三位国家码 → ISO alpha-2 两位国家码' },
  { key: 'phoneCountryCode', sourceKey: 'phoneCountryCode', label: '电话国家代码', systemLabel: '电话国家代码', baasKey: 'phoneCountryCode', hint: '模拟从 Sumsub / 手机号国家代码读取。' },
  { key: 'phoneNumber', sourceKey: 'phoneNumber', label: '手机号', systemLabel: '手机号', baasKey: 'phone' },
  { key: 'number', sourceKey: 'number', label: '证件号码', systemLabel: '证件号码', baasKey: 'number', hint: '模拟从 Sumsub 护照资料读取。' },
  { key: 'issueDate', sourceKey: 'issueDate', label: '证件签发日期', systemLabel: '证件签发日期', baasKey: 'issueDate', hint: '模拟从 Sumsub 护照资料读取。' },
  { key: 'expiryDate', sourceKey: 'expiryDate', label: '证件到期日', systemLabel: '证件到期日', baasKey: 'expiryDate', hint: '模拟从 Sumsub 护照资料读取。' },
  { key: 'region', sourceKey: 'region', label: '地区', systemLabel: '地区', baasKey: 'region', hint: '模拟 Sumsub / 护照国家读取，当前 mock 为 HK。' },
  { key: 'addressLine1', sourceKey: 'addressLine1', label: '居住地街道地址', systemLabel: '居住地街道地址', baasKey: 'address.addressLine1' },
  { key: 'city', sourceKey: 'city', label: '居住地城市', systemLabel: '居住地城市', baasKey: 'address.city' },
  {
    key: 'state',
    sourceKey: 'state',
    label: '居住地州/地区',
    systemLabel: '居住地州/地区',
    baasKey: 'address.state',
    hint: '对于美国和加拿大：必须使用两位字母代码提供细分区域（例如，WA 代表华盛顿州）。对于没有州/省的其他国家，请重复国家名称。允许使用的字符：英文字母、数字和常用符号',
  },
  { key: 'country', sourceKey: 'country', label: '居住地所在国家', systemLabel: '居住地所在国家', baasKey: 'address.country', conversion: '三位国家码 → ISO alpha-2 两位国家码' },
  { key: 'postalCode', sourceKey: 'postalCode', label: '居住地邮编', systemLabel: '居住地邮编', baasKey: 'address.postalCode' },
]

export const personalSupplementFields = [
  { key: 'identityType', label: '证件类型', baasKey: 'identityType', inputType: 'select', options: ['PASSPORT'], hint: '页面只允许选择 PASSPORT。' },
]

export const attachmentFields = [
  { key: 'attachmentIdentity', label: '护照文件', baasKey: 'attachmentIdentity.fileId', required: true, hint: '仅允许上传护照文件。' },
  { key: 'selfie', label: '自拍照', baasKey: 'selfie.fileId', required: true },
  { key: 'attachmentAddress', label: '地址证明', baasKey: 'attachmentAddress.fileId', required: true },
  { key: 'attachmentSourceOfFunds', label: '资金来源证明', baasKey: 'attachmentSourceOfFunds.fileId', required: true },
]

const sampleUploadedImageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAx0lEQVR4Xu3XMQqAMAxE0fz/n7l0EEvBGlLZkgdOUOMtYmBm9kC/7z0A/E8EwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAL3u2wH45B9JVAeObK+9uAAAAABJRU5ErkJggg=='

export function createMockUploadedImage(fileId, name) {
  return {
    fileId,
    name,
    size: 245760,
    type: 'image/png',
    status: '已上传',
    downloadUrl: sampleUploadedImageUrl,
  }
}

export const mockBaasOpeningProfile = {
  firstName: 'Wanyara',
  lastName: 'Wan',
  dateOfBirth: '1990-03-18',
  birthday: '1990-03-18',
  gender: '女',
  nationality: 'HKG',
  phoneCountryCode: '852',
  phoneNumber: '91234567',
  number: 'K1234567',
  issueDate: '2020-06-01',
  expiryDate: '2030-06-01',
  region: 'HK',
  addressLine1: '88 Queens Road Central',
  city: 'Hong Kong',
  state: 'Hong Kong',
  country: 'HKG',
  postalCode: '999077',
  sumsubKycDocumentType: 'HK-HKID',
  sumsubPassport: null,
}

export function createEmptyBaasApplication() {
  return {
    identityType: '',
    attachmentIdentity: createMockUploadedImage('mock_personal_passport_001', 'Passport.png'),
    selfie: createMockUploadedImage('mock_personal_selfie_001', 'Selfie.png'),
    attachmentAddress: createMockUploadedImage('mock_personal_address_001', 'Address Proof.png'),
    attachmentSourceOfFunds: createMockUploadedImage('mock_personal_sof_001', 'Source of Funds.png'),
  }
}

const commonAddressPattern = /^[A-Za-z0-9\s.,#'/-]+$/
const cityPattern = /^[A-Za-z\s]+$/
const countryMap = {
  AFG: 'AF',
  AGO: 'AO',
  CHN: 'CN',
  HKG: 'HK',
  USA: 'US',
}

export function normalizeGender(value) {
  const normalized = String(value || '').trim().toUpperCase()
  if (['男', 'MALE', 'M'].includes(normalized)) return 'MALE'
  if (['女', 'FEMALE', 'F'].includes(normalized)) return 'FEMALE'
  return ''
}

export function normalizeKycGender(value) {
  const normalized = normalizeGender(value)
  if (normalized === 'MALE') return 'M'
  if (normalized === 'FEMALE') return 'F'
  return ''
}

export function normalizeCountryCode(value) {
  const text = String(value || '').trim().toUpperCase()
  if (/^[A-Z]{2}$/.test(text)) return text
  return countryMap[text] || ''
}

function getSystemValue(profileValues, field) {
  return profileValues[field.sourceKey] ?? profileValues[field.key]
}

function getBaasValue(profileValues, field) {
  const value = getSystemValue(profileValues, field)
  if (field.key === 'gender') return normalizeGender(value)
  if (field.key === 'nationality' || field.key === 'country') return normalizeCountryCode(value)
  return value
}

export function validatePersonalField(key, value) {
  const text = String(value || '').trim()
  if (!text) return '该字段为 BaaS 开户必填项。'

  if (key === 'phoneCountryCode' && !/^\d{1,3}$/.test(text)) {
    return '电话国家代码仅包含数字，不包含“+”号，长度≤3。例如：86。'
  }

  if (key === 'identityType' && text !== 'PASSPORT') {
    return '证件类型只能选择 PASSPORT。'
  }

  if (['issueDate', 'expiryDate', 'birthday'].includes(key) && !/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return '日期格式必须为 yyyy-MM-dd。'
  }

  if (key === 'region' && !/^[A-Z]{2}$/.test(text)) {
    return 'region 必须是两位地区/国家代码。'
  }

  if (key === 'country' && !normalizeCountryCode(text)) {
    return '国家码需可转换为 ISO alpha-2 两位国家码。'
  }

  if (key === 'gender' && !normalizeGender(text)) {
    return '性别需可转换为 MALE / FEMALE。'
  }

  if ((key === 'addressLine1') && !commonAddressPattern.test(text)) {
    return `${key} 仅允许英文字母、数字和常用符号。`
  }

  if (key === 'city' && !cityPattern.test(text)) {
    return 'city 仅允许英文字母和空格。'
  }

  return ''
}

function makeComparisonItem(field, profileValues) {
  const sourceValue = getSystemValue(profileValues, field)
  const baasValue = getBaasValue(profileValues, field)
  return {
    ...field,
    id: `profile:${field.key}`,
    sourceValue,
    value: baasValue,
    displayValue: sourceValue,
    convertedValue: baasValue,
  }
}

export function getBaasApplicationSections(profileValues, supplementValues = createEmptyBaasApplication()) {
  const sections = { acquired: [], missing: [], revision: [] }

  personalProfileFields.forEach((field) => {
    const item = makeComparisonItem(field, profileValues)
    const sourceText = String(item.sourceValue || '').trim()
    if (!sourceText) {
      sections.missing.push({ ...item, error: '当前系统未提供该字段，提交前必须补充。' })
      return
    }

    const error = validatePersonalField(field.key, item.value || item.sourceValue)
    if (error) {
      sections.revision.push({ ...item, error })
      return
    }

    sections.acquired.push(item)
  })

  personalSupplementFields.forEach((field) => {
    const value = supplementValues[field.key]
    const item = {
      ...field,
      id: `supplement:${field.key}`,
      sourceValue: '',
      value,
      displayValue: value,
      note: profileValues.sumsubKycDocumentType && field.key === 'identityType'
        ? `Sumsub 当前证件类型为 ${profileValues.sumsubKycDocumentType}，不是 PASSPORT，需补充护照资料。`
        : field.hint,
    }
    const error = validatePersonalField(field.key, value)
    if (error) {
      sections.missing.push({ ...item, error })
      return
    }
    sections.acquired.push(item)
  })

  attachmentFields.forEach((field) => {
    const value = supplementValues[field.key]
    const item = {
      ...field,
      id: `attachment:${field.key}`,
      sourceValue: '',
      value,
      displayValue: value?.name,
      inputType: 'file',
    }
    if (!value?.fileId) {
      sections.missing.push({ ...item, error: '请上传该附件。' })
      return
    }
    sections.missing.push(item)
  })

  return sections
}

export function validateBaasApplication(profileValues, supplementValues) {
  const sections = getBaasApplicationSections(profileValues, supplementValues)
  const errors = {}

  sections.missing.filter((item) => item.error).forEach((item) => {
    errors[item.key] = item.error
  })

  sections.revision
    .filter((item) => !item.conversionStatus)
    .forEach((item) => {
      errors[item.key] = item.error
    })

  return errors
}

export function createMockFile(file) {
  if (!file) return null
  return {
    fileId: `mock_file_${Date.now()}`,
    name: file.name,
    size: file.size,
    type: file.type,
    status: '已上传',
    downloadUrl: typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function' ? URL.createObjectURL(file) : sampleUploadedImageUrl,
  }
}
