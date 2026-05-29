export const companyBaseFields = [
  { path: 'registrationPlace', label: '企业注册地', required: true, section: '企业主体信息', readOnly: true },
  { path: 'businessNameEn', label: '企业英文名称', required: true, section: '企业主体信息', readOnly: true },
  { path: 'isListedCompany', label: '是否为上市公司', required: true, section: '企业主体信息', inputType: 'segmented', options: ['是', '否'], supplement: true },
  { path: 'stockExchangeName', label: '交易所名称', required: true, section: '企业主体信息', dependsOn: { path: 'isListedCompany', value: '是' }, placeholder: '请输入交易所名称' },
  { path: 'stockCode', label: '股票代码', required: true, section: '企业主体信息', dependsOn: { path: 'isListedCompany', value: '是' }, placeholder: '请输入股票代码' },
  { path: 'authorizedCapital', label: '法定股本数', required: true, section: '企业主体信息', dependsOn: { path: 'isListedCompany', value: '是' }, sanitize: 'digits', placeholder: '请输入法定股本数' },
  { path: 'issuedCapital', label: '已发行股本数', required: true, section: '企业主体信息', dependsOn: { path: 'isListedCompany', value: '是' }, sanitize: 'digits', placeholder: '请输入已发行股本数' },
  { path: 'capitalCurrency', label: '股本币种', required: true, section: '企业主体信息', dependsOn: { path: 'isListedCompany', value: '是' }, sanitize: 'currency', placeholder: '请输入股本币种英文，如USD' },
  {
    path: 'companyType',
    label: '企业类型',
    required: true,
    section: '企业主体信息',
    inputType: 'select',
    placeholder: '请选择企业类型',
    supplement: true,
    tooltip: '请确保与公司文件中登记的企业类型一致',
    options: ['私人股份有限公司', '公众股份有限公司', '有股本的公众无限公司', '有股本的私人无限公司'],
  },
  { path: 'businessRegistrationNumber', label: '商业登记号码', required: true, section: '企业主体信息', placeholder: '请输入商业登记号码', supplement: true },
  { path: 'companyRegistrationNumber', label: '公司注册编号', required: true, section: '企业主体信息', placeholder: '请输入公司注册编号', supplement: true },
  {
    path: 'employeeCount',
    label: '雇员人数',
    required: true,
    section: '经营规模与场所',
    inputType: 'select',
    placeholder: '请选择雇员人数',
    supplement: true,
    options: ['员工人数超过200人', '员工人数50人~200人', '员工人数少于50人'],
  },
  {
    path: 'premisesType',
    label: '经营场所类型',
    required: true,
    section: '经营规模与场所',
    inputType: 'select',
    placeholder: '请选择经营场所类型',
    supplement: true,
    options: ['自有办公场所', '较大租用办公场所(大于500平方)', '较小租用办公场所(小于500平方)', '无固定办公场所'],
  },
]

export const registrationAddressFields = [
  { path: 'registrationAddress.state', label: '州/State/Province/Region', required: true, section: '注册地址', readOnly: true },
  { path: 'registrationAddress.city', label: '市/city', required: true, section: '注册地址', readOnly: true },
  { path: 'registrationAddress.addressLine1', label: '具体地址(如区、街道、建筑、门牌号)/Address Line', required: true, section: '注册地址', readOnly: true },
  { path: 'registrationAddress.postalCode', label: '邮政编码/Postal Code', required: true, section: '注册地址', readOnly: true },
  { path: 'operatingAddress.country', label: '国家/地区', required: true, section: '实际经营地址', placeholder: '请输入国家/地区', supplement: true },
  { path: 'operatingAddress.state', label: '州/State/Province/Region', required: true, section: '实际经营地址', placeholder: '请输入州/省/地区', supplement: true },
  { path: 'operatingAddress.city', label: '市/city', required: true, section: '实际经营地址', placeholder: '请输入市', supplement: true },
  { path: 'operatingAddress.addressLine1', label: '具体地址(如区、街道、建筑、门牌号)/Address Line', required: true, section: '实际经营地址', placeholder: '实际经营地址请具体至门牌号', supplement: true },
  { path: 'operatingAddress.postalCode', label: '邮政编码/Postal Code', required: true, section: '实际经营地址', placeholder: '请输入邮政编码', supplement: true },
]

export const companyAttachmentFields = [
  { path: 'attachments.attachmentLicense', label: '公司营业执照', hint: 'pdf / jpeg / png，限 8M。对应我们系统的公司注册证书和商业登记证字段。' },
  { path: 'attachments.attachmentAddress', label: '地址证明', hint: 'pdf / jpeg / png，限 8M。' },
  { path: 'attachments.attachmentCorporateRecords', label: '公司章程或组织大纲', hint: 'pdf / jpeg / png，限 8M。对应我们系统的公司章程字段。' },
  { path: 'attachments.attachmentCorporateResolution', label: '公司/企业决议', hint: 'pdf / jpeg / png，限 8M。对应我们的董事会决议。' },
  { path: 'attachments.attachmentFiscalCertificate', label: '公司财务登记证明', hint: 'pdf / jpeg / png，限 8M。' },
  { path: 'attachments.attachmentFatca', label: 'FATCA – W8Ben 或 W9 表格', hint: 'pdf / jpeg / png，限 8M。' },
  { path: 'attachments.attachmentFinancialStatement', label: '财务报表', hint: 'pdf / jpeg / png，限 8M。' },
  { path: 'attachments.attachmentRegistrationNumber', label: '政府颁发的公司注册号证明文件', hint: 'pdf / jpeg / png，限 8M。' },
  { path: 'attachments.attachmentSourceOfFunds', label: '资金来源证明', hint: 'pdf / jpeg / png，限 8M。' },
  { path: 'attachments.attachmentTaxIdentificationNumber', label: '税务识别号或同等文件', hint: 'pdf / jpeg / png，限 8M。' },
]

export const personFields = [
  { path: 'firstName', label: '名', required: true },
  { path: 'lastName', label: '姓', required: true },
  { path: 'birthday', label: '生日', required: true, hint: 'BaaS 需要格式：yyyy-MM-dd' },
  { path: 'gender', label: '性别', required: true, hint: 'MALE / FEMALE' },
  { path: 'address.addressLine1', label: '地址第一行', required: true, hint: '仅允许英文字母、数字和常用符号' },
  { path: 'address.addressLine2', label: '地址第二行', required: false },
  { path: 'address.city', label: '城市', required: true, hint: '仅允许英文字母和空格' },
  { path: 'address.state', label: '州/省/地区', required: true },
  { path: 'address.country', label: '国家', required: true, hint: '两位 ISO 国家码' },
  { path: 'address.postalCode', label: '邮政编码', required: true },
  { path: 'identityType', label: '证件类型', required: true, hint: 'CN-RIC / PASSPORT' },
  { path: 'region', label: '地区', required: true },
  { path: 'number', label: '身份证件号码', required: true },
]

export const shareholderExtraFields = [
  { path: 'ratio', label: '持股比例', required: true, hint: '0-100，必填' },
]

export const personAttachmentFields = [
  { path: 'attachments.attachmentAddress', label: '地址证明' },
  { path: 'attachments.attachmentIdentity', label: '身份证明文件' },
  { path: 'attachments.attachmentFatca', label: 'FATCA 表格', hint: 'W8Ben 或 W9' },
  { path: 'attachments.attachmentSourceOfFunds', label: '资金来源证明' },
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
  currentApplicant: {
    userId: 'user_demo_001',
    personId: 'dir_001',
    role: 'director',
    matchStatus: 'matched',
  },
  registrationPlace: 'Hong Kong',
  businessNameEn: 'FIDERE GLOBAL HOLDINGS LIMITED',
  isListedCompany: '否',
  stockExchangeName: '',
  stockCode: '',
  authorizedCapital: '',
  issuedCapital: '',
  capitalCurrency: '',
  companyType: '私人股份有限公司',
  businessRegistrationNumber: '',
  companyRegistrationNumber: '',
  employeeCount: '',
  premisesType: '',
  registrationAddress: {
    addressLine1: 'Unit 1808, 18/F, Central Plaza',
    city: 'Hong Kong',
    state: 'Hong Kong',
    postalCode: '999077',
  },
  operatingAddress: {
    country: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
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
      userId: 'user_demo_001',
      roles: ['director'],
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
    {
      id: 'auth_001',
      userId: 'user_demo_002',
      roles: ['authorizedRepresentative'],
      firstName: 'Sophia',
      lastName: 'Lee',
      birthday: '1983-06-22',
      gender: 'FEMALE',
      address: {
        addressLine1: '9 Queen\'s Road Central',
        addressLine2: '15/F',
        city: 'Hong Kong',
        state: 'Hong Kong',
        country: 'HK',
        postalCode: '',
      },
      identityType: 'PASSPORT',
      region: 'HK',
      number: '',
      attachments: {
        attachmentAddress: null,
        attachmentIdentity: createMockUploadedImage('auth_id_001', 'Authorized Representative Passport.png'),
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
  if (path === 'birthday') {
    return /^\d{4}-\d{2}-\d{2}$/.test(text) ? '' : '日期格式必须为 yyyy-MM-dd。'
  }
  if (path.endsWith('country')) {
    return ''
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
    return ''
  }
  if (path === 'ratio') {
    const number = Number(text)
    return number > 0 && number <= 100 ? '' : 'ratio 必须大于 0 且不超过 100。'
  }
  return ''
}

function isFieldActive(source, field) {
  if (!field.dependsOn) return true
  return getByPath(source, field.dependsOn.path) === field.dependsOn.value
}

function classifyField(sections, source, field, group, owner = source) {
  if (!isFieldActive(source, field)) {
    return
  }
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

  if (field.sanitize === 'digits' && !/^\d+$/.test(text)) {
    sections.revision.push({ ...item, error: '仅允许输入数字。' })
    return
  }

  if (field.sanitize === 'currency' && !/^[A-Z]{1,3}$/.test(text)) {
    sections.revision.push({ ...item, error: '只支持大写英文字母，最多 3 位。' })
    return
  }

  if (field.options?.length && !field.options.includes(text)) {
    sections.revision.push({ ...item, error: '请选择有效选项。' })
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

function isCurrentApplicantPerson(data, person) {
  return data.currentApplicant?.matchStatus === 'matched' && data.currentApplicant.personId === person.id
}

export function getEnterpriseSections(data) {
  const sections = { acquired: [], missing: [], revision: [] }
  companyBaseFields.forEach((field) => classifyField(sections, data, field, '企业基础资料', data))
  registrationAddressFields.forEach((field) => {
    const owner = field.path.startsWith('operatingAddress.') ? data.operatingAddress : data.registrationAddress
    classifyField(sections, data, field, '企业基础资料', owner)
  })
  companyAttachmentFields.forEach((field) => classifyAttachment(sections, data, field, '企业基础资料'))
  data.shareholders.forEach((person, index) => classifyPerson(sections, data, 'shareholders', '股东', index, true))
  data.directors.forEach((person, index) => {
    if (isCurrentApplicantPerson(data, person)) {
      classifyPerson(sections, data, 'directors', '董事/授权代表', index, false)
    }
  })
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
