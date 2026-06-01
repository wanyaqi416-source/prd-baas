const companyTypeOptions = [
  'Limited Liability Company, L.L.C.（责任有限公司）',
  'Limited Liability Partnership, L.L.P（有限合伙公司）',
  'Corporation（股份有限公司）',
]

const mainBusinessOptions = [
  { value: '出海服务', label: '出海服务', description: '例如经营广告投放、跨境物流、电商营销、众筹等相关服务' },
  { value: 'web3或数字货币相关', label: 'web3或数字货币相关', description: 'web3或数字货币相关' },
  { value: '金融投资', label: '金融投资', description: '金融投资' },
  { value: '电商', label: '电商', description: '例如在电商平台（Amazon、eBay、AliExpress等）、独立站或众筹平台售卖商品' },
  { value: 'B2B业务', label: 'B2B业务', description: '例如经营Alibaba或其他B2B贸易等业务' },
  { value: '其他', label: '其他', description: '例如经营旅游、游戏等行业业务' },
]

const industryCategoryGroups = [
  {
    label: '货物贸易',
    options: [
      '服装和配饰',
      '行李箱',
      '电子产品',
      '健康和家居产品',
      '家庭厨房用品',
      '运动和户外用品',
      '家庭工具',
      '玩具和游戏设备',
      '宠物用品',
      '计算机',
      '工艺品',
      '汽车用品',
      '婴儿用品',
      '美容和护理产品',
      '工业和科学产品',
      '媒体和影像设备',
    ],
  },
  {
    label: '服务贸易',
    options: [
      '广告相关服务',
      '软件和技术服务',
      '物流运输',
      '运输服务',
      '媒体和互联网视频服务',
      '软件销售（不包括游戏）',
      '在线教育',
      '文件存储服务',
      '数据登记和管理服务',
      '网络游戏',
      '会计、人力资源和法律服务',
      '通讯产品',
      '旅行和票务服务',
      '酒店和住宿服务',
      '摄影摄像服务',
      '艺术设计，建筑和媒体服务',
      '工程和科学技术服务',
      '翻译和语言相关服务',
    ],
  },
]

const businessCountryOptions = [
  '中国内地',
  '中国香港',
  '中国澳门',
  '中国台湾',
  '美国',
  '加拿大',
  '英国',
  '欧盟',
  '新加坡',
  '日本',
  '韩国',
  '澳大利亚',
  '新西兰',
  '阿联酋',
  '马来西亚',
  '泰国',
  '越南',
  '印度尼西亚',
  '菲律宾',
  '印度',
  '墨西哥',
  '巴西',
]

const volumeOptions = ['5万美金以下', '5万~50万美金', '50万~100万美金', '100万美金以上']

export const companyBaseFields = [
  { path: 'registrationPlace', label: '企业注册地', required: true, section: '认证前确认', readOnly: true },
  { path: 'businessNameEn', label: '企业英文名称', required: true, section: '认证前确认', readOnly: true, hint: '请确保您的企业名称与企业文件上的注册名称一致，开始认证流程后无法修改' },
  { path: 'isListedCompany', label: '是否为上市公司', required: true, section: '认证前确认', inputType: 'segmented', options: ['是', '否'], supplement: true },
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
    inputType: 'radioCards',
    placeholder: '请选择企业类型',
    supplement: true,
    tooltip: '请确保与公司文件中登记的企业类型一致',
    options: companyTypeOptions,
  },
  { path: 'businessRegistrationNumber', label: '商业登记号码', required: true, section: '企业主体信息', placeholder: '请输入商业登记号码', supplement: true },
  { path: 'companyRegistrationNumber', label: '公司注册编号', required: true, section: '企业主体信息', placeholder: '请输入公司注册编号', supplement: true },
  { path: 'federalTaxId', label: '公司联邦税号', required: true, section: '业务信息', placeholder: '请输入EIN税号', hint: '请填写您EIN确认函上展示的EIN税号', supplement: true },
  {
    path: 'mainBusiness',
    label: '主营业务',
    required: true,
    section: '业务信息',
    inputType: 'descriptiveSelect',
    placeholder: '请选择主营业务类型',
    supplement: true,
    options: mainBusinessOptions,
  },
  {
    path: 'industryCategories',
    label: '行业类别',
    required: true,
    section: '业务信息',
    inputType: 'groupedMultiselect',
    placeholder: '请选择行业类别',
    supplement: true,
    groups: industryCategoryGroups,
  },
  {
    path: 'hasOfficialWebsite',
    label: '是否有官方网站',
    required: true,
    section: '业务信息',
    inputType: 'radioCards',
    options: ['有网站', '暂无网站'],
    supplement: true,
  },
  { path: 'officialWebsite', label: '官方网站', required: true, section: '业务信息', dependsOn: { path: 'hasOfficialWebsite', value: '有网站' }, placeholder: '请输入网站链接', supplement: true },
  { path: 'businessDescription', label: '业务描述', required: true, section: '业务信息', inputType: 'textarea', dependsOn: { path: 'hasOfficialWebsite', value: '暂无网站' }, placeholder: '请描述您的业务', supplement: true },
  {
    path: 'businessCountries',
    label: '业务往来国家',
    required: true,
    section: '业务信息',
    inputType: 'multiselect',
    placeholder: '请选择业务往来国家(最多可选5项)',
    supplement: true,
    options: businessCountryOptions,
    maxSelections: 5,
  },
  {
    path: 'cryptoWalletMonthlyVolume',
    label: '加密钱包预计月交易量',
    required: true,
    section: '业务信息',
    inputType: 'select',
    placeholder: '请选择加密钱包预计月交易量',
    supplement: true,
    options: volumeOptions,
  },
  {
    path: 'estimatedAnnualRevenue',
    label: '预计年营业额',
    required: true,
    section: '业务信息',
    inputType: 'select',
    placeholder: '请选择预计年营业额',
    supplement: true,
    options: volumeOptions,
  },
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

export const listedCompanyAttachmentFields = [
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

const interlaceNonListedAttachmentHint = '1.照片彩色、清晰、完整\n2.支持PDF、JPG、JPEG、PNG、ZIP、RAR格式\n3.多份文件请打包压缩上传，文件大小不超过20MB'
const interlaceRegisterAttachmentHint = '1.请上传董事名册等能体现董事信息的文件\n2.请确保文件清晰、完整\n3.支持PDF、JPG、JPEG、PNG、ZIP、RAR格式\n4.多份文件请打包压缩上传，文件大小不超过20MB'
const interlaceOwnerAttachmentHint = '1.请上传股东名册、股权架构图等能体现股东信息的文件\n2.请确保文件清晰、完整\n3.支持PDF、JPG、JPEG、PNG、ZIP、RAR格式\n4.多份文件请打包压缩上传，文件大小不超过20MB'

export const nonListedCompanyAttachmentFields = [
  {
    path: 'attachments.attachmentCertificateOfIncorporation',
    label: '公司注册书（Certificate of Incorporation）',
    hint: interlaceNonListedAttachmentHint,
    accept: '.pdf,.jpeg,.jpg,.png,.zip,.rar,application/pdf,image/jpeg,image/png,application/zip,application/x-zip-compressed,application/vnd.rar,application/x-rar-compressed',
    acceptDescription: '支持 PDF、JPG、JPEG、PNG、ZIP、RAR，单个文件大小限制 20MB。',
    allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png', 'zip', 'rar'],
    fileLimit: 20 * 1024 * 1024,
  },
  {
    path: 'attachments.attachmentOperatingAgreement',
    label: '公司章程（Operating Agreement / Articles of Association / Company By laws）',
    hint: interlaceNonListedAttachmentHint,
    accept: '.pdf,.jpeg,.jpg,.png,.zip,.rar,application/pdf,image/jpeg,image/png,application/zip,application/x-zip-compressed,application/vnd.rar,application/x-rar-compressed',
    acceptDescription: '支持 PDF、JPG、JPEG、PNG、ZIP、RAR，单个文件大小限制 20MB。',
    allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png', 'zip', 'rar'],
    fileLimit: 20 * 1024 * 1024,
  },
  {
    path: 'attachments.attachmentEinConfirmationLetter',
    label: '联邦雇主识别号码确认函（EIN Confirmation Letter）',
    hint: interlaceNonListedAttachmentHint,
    accept: '.pdf,.jpeg,.jpg,.png,.zip,.rar,application/pdf,image/jpeg,image/png,application/zip,application/x-zip-compressed,application/vnd.rar,application/x-rar-compressed',
    acceptDescription: '支持 PDF、JPG、JPEG、PNG、ZIP、RAR，单个文件大小限制 20MB。',
    allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png', 'zip', 'rar'],
    fileLimit: 20 * 1024 * 1024,
  },
  {
    path: 'attachments.attachmentDirectorRegister',
    label: '董事信息文件',
    hint: interlaceRegisterAttachmentHint,
    accept: '.pdf,.jpeg,.jpg,.png,.zip,.rar,application/pdf,image/jpeg,image/png,application/zip,application/x-zip-compressed,application/vnd.rar,application/x-rar-compressed',
    acceptDescription: '支持 PDF、JPG、JPEG、PNG、ZIP、RAR，单个文件大小限制 20MB。',
    allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png', 'zip', 'rar'],
    fileLimit: 20 * 1024 * 1024,
  },
  {
    path: 'attachments.attachmentShareholderRegister',
    label: '股东信息文件（需体现最终受益自然人）',
    hint: interlaceOwnerAttachmentHint,
    accept: '.pdf,.jpeg,.jpg,.png,.zip,.rar,application/pdf,image/jpeg,image/png,application/zip,application/x-zip-compressed,application/vnd.rar,application/x-rar-compressed',
    acceptDescription: '支持 PDF、JPG、JPEG、PNG、ZIP、RAR，单个文件大小限制 20MB。',
    allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png', 'zip', 'rar'],
    fileLimit: 20 * 1024 * 1024,
  },
]

export const companyAttachmentFields = listedCompanyAttachmentFields

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

export const enterpriseApplicantRoleOptions = [
  { value: 'director', label: '企业董事', description: '您本人为该企业的负责人，能够代表企业行使职权' },
  { value: 'authorizedRepresentative', label: '被授权人', description: '您本人被企业授权，能够代表企业处理事务' },
]

export const enterpriseApplicantRoleLabels = {
  director: '企业董事',
  authorizedRepresentative: '被授权人',
}

export const enterpriseDirectorInfoFields = [
  { path: 'region', label: '国家', readOnly: true },
  { path: 'identityType', label: '证件类型', readOnly: true, fixedValue: '护照' },
  { path: 'firstName', label: '英文名称', readOnly: true, uppercase: true },
  { path: 'lastName', label: '英文姓氏', readOnly: true, uppercase: true },
  { path: 'chineseFirstName', label: '中文名称', required: true, supplement: true, sanitize: 'chinese', placeholder: '请输入中文名称' },
  { path: 'chineseLastName', label: '中文姓氏', required: true, supplement: true, sanitize: 'chinese', placeholder: '请输入中文姓氏' },
  { path: 'number', label: '证件号码', readOnly: true },
  { path: 'birthday', label: '生日', readOnly: true },
  { path: 'phonePrefix', label: '电话前缀', readOnly: true },
  { path: 'phoneNumber', label: '手机号', readOnly: true },
  { path: 'isBeneficialOwner', label: '是否为受益所有人', readOnly: true },
  { path: 'beneficialOwnerRatio', label: '持股比例', readOnly: true, visibleWhen: { path: 'isBeneficialOwner', value: '是' }, tooltip: '若持股比例<25%，则非受益所有人' },
]

export const enterpriseDirectorAddressFields = [
  { path: 'address.country', label: '国家', readOnly: true },
  { path: 'address.state', label: '州/省', readOnly: true },
  { path: 'address.city', label: '城市', readOnly: true },
  { path: 'address.addressLine1', label: '居住地址', readOnly: true },
  { path: 'address.postalCode', label: '邮编', readOnly: true },
]

export const enterpriseDirectorAttachmentFields = [
  {
    path: 'attachments.attachmentIdentity',
    label: '护照上传',
    required: true,
    supplement: true,
    inputType: 'file',
    hint: '注意事项：\n1.请上传证件原件照片，不支持扫描件\n2.请确保证件信息清晰、完整，照片需包含证件四角，无反光\n3.支持JPG、JPEG、PNG格式\n4.文件大小不超过20MB',
    accept: '.jpeg,.jpg,.png,image/jpeg,image/png',
    acceptDescription: '支持 JPG、JPEG、PNG，单个文件大小限制 20MB。',
  },
  {
    path: 'attachments.attachmentPassportHolding',
    label: '董事手持护照照片',
    required: true,
    supplement: true,
    inputType: 'file',
    hint: '为确认开户为董事本人意愿，请上传董事手持【护照】照片。\n1.请保证脸部不被遮挡，证件上所有信息完整清晰\n2.支持JPG、JPEG、PNG格式\n3.文件大小不超过20M',
    accept: '.jpeg,.jpg,.png,image/jpeg,image/png',
    acceptDescription: '支持 JPG、JPEG、PNG，单个文件大小限制 20MB。',
  },
]

export const beneficialOwnerConfirmationFields = [
  {
    path: 'beneficialOwnerConfirmation.hasOtherBeneficialOwners',
    label: '贵公司是否还有其他受益所有人？',
    required: true,
    readOnly: true,
    options: ['是', '否'],
  },
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
  companyType: 'Limited Liability Company, L.L.C.（责任有限公司）',
  businessRegistrationNumber: '',
  companyRegistrationNumber: '',
  federalTaxId: '',
  mainBusiness: '',
  industryCategories: [],
  hasOfficialWebsite: '有网站',
  officialWebsite: '',
  businessDescription: '',
  businessCountries: [],
  cryptoWalletMonthlyVolume: '',
  estimatedAnnualRevenue: '',
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
  beneficialOwnerConfirmation: {
    hasOtherBeneficialOwners: '否',
    otherBeneficialOwners: [],
  },
  attachments: {
    attachmentCertificateOfIncorporation: null,
    attachmentOperatingAgreement: null,
    attachmentEinConfirmationLetter: null,
    attachmentDirectorRegister: null,
    attachmentShareholderRegister: null,
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
      chineseFirstName: '',
      chineseLastName: '',
      birthday: '1979-11-03',
      gender: 'MALE',
      phonePrefix: '+852',
      phoneNumber: '91234567',
      isBeneficialOwner: '是',
      beneficialOwnerRatio: '32%',
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
        attachmentIdentity: null,
        attachmentPassportHolding: null,
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
      chineseFirstName: '',
      chineseLastName: '',
      birthday: '1983-06-22',
      gender: 'FEMALE',
      phonePrefix: '+852',
      phoneNumber: '92345678',
      isBeneficialOwner: '否',
      beneficialOwnerRatio: '',
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
        attachmentIdentity: null,
        attachmentPassportHolding: null,
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
  if (path === 'chineseFirstName' || path === 'chineseLastName') {
    return /^[\u3400-\u9fff]+$/.test(text) ? '' : '只能输入中文。'
  }
  return ''
}

function optionValues(field) {
  if (field.groups?.length) {
    return field.groups.flatMap((group) => group.options || [])
  }
  return (field.options || []).map((option) => (typeof option === 'string' ? option : option.value))
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
  const isMultiValue = Array.isArray(value)
  const text = isMultiValue ? value.join(',').trim() : String(value || '').trim()
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

  if (isMultiValue && field.maxSelections && value.length > field.maxSelections) {
    sections.revision.push({ ...item, error: `最多可选择 ${field.maxSelections} 项。` })
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

  if (field.sanitize === 'chinese' && !/^[\u3400-\u9fff]+$/.test(text)) {
    sections.revision.push({ ...item, error: '只能输入中文。' })
    return
  }

  const allowedValues = optionValues(field)
  if (allowedValues.length) {
    const values = isMultiValue ? value : [text]
    if (values.some((current) => !allowedValues.includes(current))) {
      sections.revision.push({ ...item, error: '请选择有效选项。' })
      return
    }
  }

  if (field.inputType === 'groupedMultiselect' && (!isMultiValue || !value.length)) {
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

function isYes(value) {
  return value === true || String(value || '').trim().toUpperCase() === 'YES' || String(value || '').trim() === '是'
}

export function getCompanyAttachmentFields(data) {
  return isYes(data.isListedCompany) ? listedCompanyAttachmentFields : nonListedCompanyAttachmentFields
}

export function hasAtLeastOneBeneficialOwner(data) {
  const directorBeneficialOwners = (data.directors || []).filter((person) => isYes(person.isBeneficialOwner))
  const otherBeneficialOwners = data.beneficialOwnerConfirmation?.otherBeneficialOwners || []
  return directorBeneficialOwners.length > 0 || otherBeneficialOwners.length > 0
}

export function getEnterpriseApplicantSelection(data) {
  const role = data.currentApplicant?.role || 'director'
  const index = (data.directors || []).findIndex((person) => person.roles?.includes(role))
  return {
    role,
    index,
    person: index >= 0 ? data.directors[index] : null,
  }
}

function classifyEnterpriseDirector(sections, data) {
  const { index, person } = getEnterpriseApplicantSelection(data)
  if (!person || index < 0) return

  const group = '企业董事'
  const pathPrefix = `directors.${index}.`
  enterpriseDirectorInfoFields
    .filter((field) => !field.readOnly)
    .forEach((field) => {
      classifyField(sections, data, { ...field, path: `${pathPrefix}${field.path}` }, group, person)
    })
  enterpriseDirectorAttachmentFields.forEach((field) => {
    classifyAttachment(sections, data, { ...field, path: `${pathPrefix}${field.path}` }, group)
  })
}

function classifyBeneficialOwnerConfirmation(sections, data) {
  const group = '受益所有人确认'
  beneficialOwnerConfirmationFields.forEach((field) => {
    classifyField(sections, data, field, group, data.beneficialOwnerConfirmation)
  })

  const hasOtherBeneficialOwners = data.beneficialOwnerConfirmation?.hasOtherBeneficialOwners
  const otherBeneficialOwners = data.beneficialOwnerConfirmation?.otherBeneficialOwners || []
  if (hasOtherBeneficialOwners === '是' && !otherBeneficialOwners.length) {
    sections.missing.push({
      id: `${group}:beneficialOwnerConfirmation.otherBeneficialOwners`,
      group,
      path: 'beneficialOwnerConfirmation.otherBeneficialOwners',
      label: '其他受益所有人名单',
      value: otherBeneficialOwners,
      error: '需通过企业资料变更提交受益所有人信息，提交后进入人工审核。',
    })
  }

  if (!hasAtLeastOneBeneficialOwner(data)) {
    sections.missing.push({
      id: `${group}:beneficialOwnerMinimum`,
      group,
      path: 'beneficialOwnerMinimum',
      label: '受益所有人',
      value: '',
      error: '受益所有人需至少有一人，请检查填写。',
    })
  }
}

export function getEnterpriseSections(data) {
  const sections = { acquired: [], missing: [], revision: [] }
  companyBaseFields.forEach((field) => classifyField(sections, data, field, '企业基础资料', data))
  registrationAddressFields.forEach((field) => {
    const owner = field.path.startsWith('operatingAddress.') ? data.operatingAddress : data.registrationAddress
    classifyField(sections, data, field, '企业基础资料', owner)
  })
  getCompanyAttachmentFields(data).forEach((field) => classifyAttachment(sections, data, field, '企业基础资料'))
  classifyEnterpriseDirector(sections, data)
  classifyBeneficialOwnerConfirmation(sections, data)
  data.shareholders.forEach((person, index) => classifyPerson(sections, data, 'shareholders', '股东', index, true))
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
