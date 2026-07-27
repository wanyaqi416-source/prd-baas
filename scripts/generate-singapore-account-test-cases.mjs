import fs from 'node:fs'
import path from 'node:path'

const outputDir = path.resolve('docs/test-cases/singapore-account-opening')
fs.mkdirSync(outputDir, { recursive: true })

const cases = []
let sequence = 1

function add({
  side,
  module,
  feature,
  control = '-',
  title,
  type = '功能',
  priority = 'P1',
  precondition,
  data = '-',
  steps,
  expected,
  transition = '-',
  note = '-',
}) {
  cases.push({
    用例ID: `SG-${String(sequence++).padStart(3, '0')}`,
    端: side,
    一级模块: module,
    二级功能: feature,
    关联按钮或控件: control,
    用例标题: title,
    用例类型: type,
    优先级: priority,
    前置条件: precondition,
    测试数据: data,
    操作步骤: steps.map((step, index) => `${index + 1}. ${step}`).join('\n'),
    预期结果: expected.map((item, index) => `${index + 1}. ${item}`).join('\n'),
    状态变化: transition,
    备注: note,
  })
}

// 客户端：入口、状态及申请。
add({ side: '客户端', module: '账户', feature: '其他法域账户入口', control: '查看其他法域账户', title: '进入其他法域账户页面', precondition: '用户已登录客户端；新加坡账户功能已启用。', steps: ['进入账户首页。', '点击“查看其他法域账户”。'], expected: ['进入“其他法域账户”页面。', '页面同时展示美国账户和新加坡账户，二者状态互不影响。', '新加坡账户卡片展示开户费 USD 1,000。'] })
add({ side: '客户端', module: '账户', feature: '其他法域账户入口', control: '返回账户', title: '从其他法域账户页面返回账户首页', precondition: '用户位于其他法域账户页面。', steps: ['点击“返回账户”。'], expected: ['返回账户首页。', '原账户状态不被修改。'] })
add({ side: '客户端', module: '账户', feature: '新加坡账户可用性', control: '新加坡账户卡片', title: '后台未启用新加坡账户时不可申请', type: '权限/配置', precondition: '系统新加坡账户功能关闭或账户类型被禁用。', steps: ['进入其他法域账户页面。', '查看新加坡账户卡片。'], expected: ['卡片显示“待开放”或等价禁用状态。', '不展示“立即申请”按钮。', '用户无法通过页面发起新加坡账户申请。'], note: '账户类型禁用只应限制新申请，不应隐藏已开户用户资产。' })

const clientStatuses = [
  ['未申请', '立即申请', '尚未提交开户申请，可随时发起申请。'],
  ['审核中', '-', '申请已提交，当前正在审核中。'],
  ['已开户', '-', '账户已开通，可在资产分布中查看。'],
  ['已拒绝', '重新申请', '申请未通过，可根据审核意见重新提交。'],
]
for (const [status, action, description] of clientStatuses) {
  add({ side: '客户端', module: '账户', feature: '状态展示', control: action, title: `新加坡账户“${status}”状态展示正确`, precondition: `用户的新加坡账户状态为“${status}”。`, steps: ['进入其他法域账户页面。', '查看新加坡账户卡片的状态、说明和操作按钮。'], expected: [`状态标签显示“${status}”。`, `说明显示“${description}”`, action === '-' ? '不展示发起或重复申请按钮。' : `展示“${action}”按钮。`], priority: status === '未申请' || status === '已开户' ? 'P0' : 'P1' })
}

add({ side: '客户端', module: '新加坡账户开户', feature: '余额校验', control: '余额充足/立即申请', title: '余额充足时可进入开户确认页', precondition: '新加坡账户状态为未申请；信托账户可用 USD 余额不少于 1,000。', data: 'USD 可用余额=1,000.00 或更高', steps: ['选择余额充足场景。', '点击新加坡账户“立即申请”。'], expected: ['进入“新加坡账户开户确认”页。', '新加坡账户状态进入审核中仅应发生在申请提交成功后；进入确认页本身不应产生扣费记录。'] })
add({ side: '客户端', module: '新加坡账户开户', feature: '余额校验', control: '余额不足/立即申请', title: '余额不足时阻止开户申请', type: '异常', priority: 'P0', precondition: '新加坡账户状态为未申请；信托账户可用 USD 余额少于 1,000。', data: 'USD 可用余额=999.99', steps: ['选择余额不足场景。', '点击新加坡账户“立即申请”。'], expected: ['弹出“余额不足”提示。', '提示开户费为 USD 1,000，并引导充值或换入 USD。', '不扣费、不生成申请，账户仍为未申请。'], transition: '未申请 → 未申请' })
add({ side: '客户端', module: '新加坡账户开户', feature: '余额不足弹窗', control: '关闭/X', title: '关闭余额不足弹窗', precondition: '余额不足弹窗已打开。', steps: ['分别点击弹窗右上角关闭图标和“关闭”按钮。'], expected: ['弹窗关闭并返回其他法域账户页面。', '不产生任何状态或资金变化。'] })
add({ side: '客户端', module: '新加坡账户开户', feature: '开户确认页', control: '页面信息', title: '开户确认页信息展示正确', precondition: '已进入新加坡账户开户确认页。', steps: ['核对页面标题、说明、开户费用及流程说明。'], expected: ['显示“无需资料”，不要求上传资料或填写补充信息。', '申请账户为新加坡账户。', '扣费账户为信托账户，币种 USD，金额 USD 1,000.00。', '提交后状态显示后台审核中。'] })
add({ side: '客户端', module: '新加坡账户开户', feature: '开户确认页', control: '取消/返回开户流程/FIDERE', title: '取消开户并返回', precondition: '已进入新加坡账户开户确认页，尚未确认扣费。', steps: ['依次验证底部“取消”、顶部“返回开户流程”和品牌返回入口。'], expected: ['均可离开确认页并返回上一层。', '不扣费、不生成申请。', '新加坡账户仍为未申请。'], transition: '未申请 → 未申请' })
add({ side: '客户端', module: '新加坡账户开户', feature: '扣费确认', control: '确认开户并扣费', title: '打开扣费确认弹窗', precondition: '已进入新加坡账户开户确认页。', steps: ['点击“确认开户并扣费”。'], expected: ['打开“确认开通并扣费”弹窗。', '弹窗再次展示扣费账户、币种和金额。', '未点击确认扣费前不产生交易。'] })
add({ side: '客户端', module: '新加坡账户开户', feature: '扣费确认弹窗', control: '取消/X', title: '取消扣费确认', precondition: '扣费确认弹窗已打开。', steps: ['分别点击“取消”和右上角关闭图标。'], expected: ['弹窗关闭，停留在开户确认页。', '不扣费、不生成申请。'] })
add({ side: '客户端', module: '新加坡账户开户', feature: '开户费扣款', control: '确认扣费', title: '开户费扣款成功并生成申请', priority: 'P0', precondition: '扣费确认弹窗已打开；余额充足；用户不存在有效的新加坡账户申请或已开户账户。', data: '扣费 USD 1,000.00；手续费 USD 0.00', steps: ['点击“确认扣费”。', '等待系统返回处理结果。'], expected: ['仅扣除一次 USD 1,000.00。', '生成唯一开户费交易编号和唯一新加坡账户申请编号。', '显示扣费成功弹窗。', '后台开户审核新增该用户的申请记录。', '用户状态进入审核中/管理端进入待处理。'], transition: '未申请 → 审核中（客户端）；未开通 → 待处理（管理端）' })
add({ side: '客户端', module: '新加坡账户开户', feature: '开户费扣款', control: '确认扣费', title: '重复点击确认扣费不重复扣款', type: '幂等/异常', priority: 'P0', precondition: '扣费确认弹窗已打开；模拟网络延迟。', steps: ['快速连续点击“确认扣费”多次。', '查询资金流水和开户申请。'], expected: ['按钮在首次提交后应禁用或请求具备幂等控制。', '只生成一笔 USD 1,000.00 扣费记录。', '只生成一条有效开户申请。'] })
add({ side: '客户端', module: '新加坡账户开户', feature: '开户费扣款', control: '确认扣费', title: '扣费接口失败时不生成开户申请', type: '异常', priority: 'P0', precondition: '模拟扣费接口超时、失败或余额并发不足。', steps: ['点击“确认扣费”。', '等待失败响应。', '刷新账户页并查询后台审核列表。'], expected: ['明确提示扣费失败，可安全重试。', '不生成有效开户申请。', '账户保持未申请。', '资金余额不减少；若已预扣则自动冲正。'], transition: '未申请 → 未申请' })

for (const [button, expected] of [
  ['返回账户页面', ['返回账户页面。', '新加坡账户显示审核中。']],
  ['查看开户费交易记录（原型展示）', ['进入开户费交易详情。', '交易金额显示 -USD 1,000.00，状态已完成。']],
  ['关闭', ['关闭结果弹窗。', '申请和扣费结果保持成功。']],
]) {
  add({ side: '客户端', module: '新加坡账户开户', feature: '扣费成功弹窗', control: button, title: `扣费成功后点击“${button}”`, precondition: '开户费扣款成功弹窗已显示。', steps: [`点击“${button}”。`], expected })
}

add({ side: '客户端', module: '新加坡账户开户', feature: '开户费交易详情', control: '已完成标签', title: '查看开户费扣款交易详情', precondition: '存在成功的开户费扣款记录。', steps: ['打开开户费交易详情。', '选择“已完成”标签。'], expected: ['展示交易类型、扣费账户、交易编号、交易时间、客户信息和说明。', '金额为 -USD 1,000.00，手续费为 0.00。', '交易编号可唯一追溯至开户申请。'] })
add({ side: '客户端', module: '新加坡账户开户', feature: '开户退款详情', control: '已拒绝标签', title: '申请被拒绝后查看开户退款记录', priority: 'P0', precondition: '开户申请已被管理端拒绝；退款已成功。', steps: ['进入开户费交易详情。', '选择“已拒绝”标签。'], expected: ['展示开户退款详情。', '退款金额为 +USD 1,000.00。', '展示原扣费交易编号、退款原因和退款时间。', '退款入账账户与原扣费账户一致。'] })
add({ side: '客户端', module: '新加坡账户开户', feature: '防重复申请', control: '新加坡账户卡片', title: '审核中不允许重复申请', type: '状态/幂等', priority: 'P0', precondition: '用户已有待处理或审核中的新加坡账户申请。', steps: ['进入其他法域账户页面。', '查看新加坡账户操作区。', '尝试通过刷新、返回、重复 URL 等方式再次申请。'], expected: ['只显示审核中状态，不展示立即申请。', '服务端拒绝重复申请请求。', '不重复扣费。'] })
add({ side: '客户端', module: '新加坡账户开户', feature: '开户结果', control: '新加坡账户资产卡片', title: '后台确认开户后客户端展示新加坡账户', priority: 'P0', precondition: '管理端已确认开户且用户实际账户信息已配置。', steps: ['重新登录或刷新客户端。', '进入账户与法币资产页面。'], expected: ['新加坡账户状态显示已开户。', '资产分布中出现新加坡账户。', '展示固定支持币种 USD/CNY/SGD/AED/JPY。', '未配置的其他币种不展示。'], transition: '审核中 → 已开户' })
add({ side: '客户端', module: '新加坡账户开户', feature: '拒绝结果', control: '重新申请', title: '已拒绝后发起重新申请', priority: 'P0', precondition: '申请状态为已拒绝；退款已完成。', steps: ['进入其他法域账户页面。', '点击“重新申请”。', '核对拒绝原因后点击弹窗“重新申请”。'], expected: ['展示上次拒绝原因。', '生成新的申请记录并保留历史申请。', '重新执行余额校验和扣费确认。', '不得覆盖原申请编号和原审核记录。'], transition: '已拒绝 → 新申请审核中' })
add({ side: '客户端', module: '新加坡账户开户', feature: '重新申请弹窗', control: '取消/X', title: '取消重新申请', precondition: '已拒绝账户的重新申请弹窗已打开。', steps: ['分别点击“取消”和右上角关闭图标。'], expected: ['弹窗关闭。', '状态仍为已拒绝。', '不扣费、不生成新申请。'] })

// 客户端：新加坡账户法币转入。
add({ side: '客户端', module: '法币转入', feature: '账户选择', control: '选择账户', title: '已开户用户的转入账户列表展示新加坡账户', priority: 'P0', precondition: '用户已开通新加坡账户并进入银行电汇入金页面。', steps: ['展开“选择账户”下拉框。'], expected: ['账户列表包含香港账户、美国账户和新加坡账户。', '新加坡账户只出现一次。', '账户名称与资产页面一致。'] })
add({ side: '客户端', module: '法币转入', feature: '账户权限', control: '选择账户', title: '未开户用户的转入账户列表不展示新加坡账户', type: '权限/状态', priority: 'P0', precondition: '用户的新加坡账户为未开通、待处理、审核中或已拒绝。', steps: ['进入银行电汇入金页面。', '展开“选择账户”下拉框。', '尝试通过参数或接口指定新加坡账户。'], expected: ['下拉框不展示新加坡账户。', '服务端拒绝向未开户的新加坡账户创建入金申请。', '不生成入金记录。'] })
add({ side: '客户端', module: '法币转入', feature: '币种范围', control: '选择币种', title: '新加坡账户仅展示固定支持币种', priority: 'P0', precondition: '用户已开户；转入账户选择新加坡账户。', steps: ['展开“选择币种”及表单内“入金币种”下拉框。'], expected: ['两个币种下拉均只展示 USD/CNY/SGD/AED/JPY。', '不展示 HKD、EUR 或系统未启用币种。', '两个币种控件选择结果保持同步。'] })
add({ side: '客户端', module: '法币转入', feature: '账户切换', control: '选择账户', title: '切换到新加坡账户后币种重置且不残留原账户数据', type: '状态/数据', precondition: '当前选择香港账户及HKD。', steps: ['将账户切换为新加坡账户。'], expected: ['币种自动切换为新加坡账户首个可用币种USD。', '收款银行信息同步刷新为新加坡账户配置。', '不继续展示香港账户的HKD或银行资料。'] })
add({ side: '客户端', module: '法币转入', feature: '用户实际账户优先级', control: '收款银行信息', title: '新加坡账户转入展示用户实际收款人和账户号码', type: '配置联动', priority: 'P0', precondition: '用户实际收款人=WAN YARA WAN、账户号码=0950；系统模板为FIDERE TRUST LIMITED、0454。', steps: ['选择新加坡账户及任一支持币种。', '查看收款银行信息。'], expected: ['收款人名称展示 WAN YARA WAN。', '账户号码展示 0950。', '银行名称、银行地址、收款银行和SWIFT读取系统新加坡账户配置。', '不得将系统模板收款人和模板账号覆盖用户实际信息。'] })

for (const currency of ['USD', 'CNY', 'SGD', 'AED', 'JPY']) {
  add({ side: '客户端', module: '法币转入', feature: '币种收款信息', control: '选择币种', title: `新加坡账户选择${currency}展示对应收款信息`, priority: currency === 'USD' || currency === 'SGD' ? 'P0' : 'P1', precondition: `用户已开户；系统已启用新加坡账户${currency}并配置收款信息。`, data: `账户=新加坡账户；币种=${currency}`, steps: ['选择新加坡账户。', `选择${currency}。`, '核对收款信息和入金表单币种。'], expected: [`页面明确标识新加坡账户/${currency}。`, '基础银行信息读取 Green Link Digital Bank 配置。', `表单金额、手续费和交易记录使用${currency}，不错误显示其他币种。`, '切换币种后不残留上一个币种的中转行或交易记录。'] })
  add({ side: '客户端', module: '法币转入', feature: '提交入金', control: '提交入金申请', title: `新加坡账户提交${currency}入金申请成功`, priority: currency === 'USD' || currency === 'SGD' ? 'P0' : 'P1', precondition: `用户已开户；${currency}收款银行配置有效；已选择白名单汇款银行。`, data: `账户=新加坡账户；币种=${currency}；金额=100`, steps: ['填写入金金额、用途、资金来源及备注。', '点击“提交入金申请”。', '打开生成的交易详情。'], expected: ['生成唯一入金交易编号。', '账户类型保存为新加坡账户。', `币种和金额保存为${currency} 100.00。`, '状态为 UNDER_REVIEW/待处理。', 'pending_incoming_balance增加100，client_available_balance在审核通过前不变。', '管理端入账认领或流水查询可检索该记录。'] })
}

add({ side: '客户端', module: '法币转入', feature: '金额校验', control: '提交入金申请', title: '新加坡账户入金金额为空、为0或负数时不可提交', type: '校验', priority: 'P0', precondition: '已选择新加坡账户及有效币种。', data: '金额=空、0、-1', steps: ['依次输入无效金额。', '点击“提交入金申请”。'], expected: ['页面提示请输入有效入金金额。', '不生成交易编号。', '余额和入金记录不变化。'] })
add({ side: '客户端', module: '法币转入', feature: '银行配置异常', control: '提交入金申请', title: '所选币种未配置收款银行时阻止入金', type: '异常/配置', priority: 'P0', precondition: '新加坡账户某支持币种的收款银行配置缺失或已禁用。', steps: ['选择异常币种。', '填写完整表单并提交。'], expected: ['明确提示当前账户币种未配置可用收款银行。', '不生成入金记录。', '不回退读取其他账户或其他币种的银行信息。'] })
add({ side: '客户端', module: '法币转入', feature: '交易详情', control: '返回入金表单/返回账户', title: '新加坡账户入金详情及返回按钮正确', precondition: '已生成一笔新加坡账户SGD入金申请并进入详情。', steps: ['核对详情字段。', '点击“返回入金表单”。', '再次进入详情并点击“返回账户”。'], expected: ['详情展示新加坡账户、SGD金额、手续费、交易编号、收款银行和汇款银行。', '返回入金表单后保留合理的账户/币种上下文。', '返回账户后进入账户页面且记录仍存在。'] })

// 客户端：新加坡账户法币转出。
add({ side: '客户端', module: '法币转出', feature: '账户选择', control: '选择账户', title: '已开户用户的转出账户列表展示新加坡账户', priority: 'P0', precondition: '用户已开通新加坡账户并进入法币转出页面。', steps: ['展开“选择账户”下拉框。'], expected: ['账户列表包含新加坡账户。', '新加坡账户只出现一次。', '选择后展示该用户的新加坡账户余额和账户信息。'] })
add({ side: '客户端', module: '法币转出', feature: '账户权限', control: '选择账户', title: '未开户用户的转出账户列表不展示新加坡账户', type: '权限/状态', priority: 'P0', precondition: '用户的新加坡账户不是已开户状态。', steps: ['进入法币转出页面。', '展开账户下拉。', '尝试构造新加坡账户转出请求。'], expected: ['页面不展示新加坡账户。', '服务端拒绝未开户账户转出。', '不冻结或扣减任何余额。'] })
add({ side: '客户端', module: '法币转出', feature: '币种范围', control: '选择币种', title: '新加坡账户转出仅展示固定支持币种', priority: 'P0', precondition: '用户已开户；选择新加坡账户。', steps: ['展开币种下拉。'], expected: ['仅展示 USD/CNY/SGD/AED/JPY。', '不展示 HKD、EUR 或后台已关闭币种。', '每个币种展示对应可用余额。'] })
add({ side: '客户端', module: '法币转出', feature: '账户切换', control: '选择账户', title: '切换到新加坡账户后刷新币种、余额和收款银行', type: '状态/数据', precondition: '当前选择香港账户及HKD。', steps: ['切换为新加坡账户。'], expected: ['币种重置为USD。', '余额切换为新加坡账户USD余额。', '银行地址列表只展示适用于新加坡账户USD的记录。', '不残留香港账户银行地址。'] })

for (const currency of ['USD', 'CNY', 'SGD', 'AED', 'JPY']) {
  add({ side: '客户端', module: '法币转出', feature: '币种与银行地址', control: '选择币种', title: `新加坡账户选择${currency}转出时数据正确`, priority: currency === 'USD' || currency === 'SGD' ? 'P0' : 'P1', precondition: `用户新加坡账户${currency}余额充足；存在适用的收款银行地址。`, data: `账户=新加坡账户；币种=${currency}`, steps: ['选择新加坡账户。', `选择${currency}。`, '核对余额和银行地址列表。'], expected: [`展示新加坡账户${currency}可用余额。`, `只展示支持新加坡账户及${currency}的银行地址。`, `金额输入、服务费和实际到账均以${currency}展示。`] })
  add({ side: '客户端', module: '法币转出', feature: '提交转出', control: '提交/确认转出', title: `新加坡账户提交${currency}转出申请成功`, priority: currency === 'USD' || currency === 'SGD' ? 'P0' : 'P1', precondition: `用户新加坡账户${currency}余额充足；已选择有效银行地址。`, data: `账户=新加坡账户；币种=${currency}；金额=100`, steps: ['输入金额、用途和备注。', '提交并确认转出。', '查看转出详情及管理端记录。'], expected: ['生成唯一法币转出申请编号。', `账户类型为新加坡账户，转账币种为${currency}。`, '提交后按业务规则冻结/扣减转出账户可用余额。', '管理端出金审批或流水查询出现对应记录。', '审核通过后状态及实际到账金额正确，拒绝时释放冻结金额。'] })
}

add({ side: '客户端', module: '法币转出', feature: '金额校验', control: '提交/确认转出', title: '新加坡账户转出金额为空、为0或负数时不可提交', type: '校验', priority: 'P0', precondition: '已选择新加坡账户、有效币种和银行地址。', data: '金额=空、0、-1', steps: ['依次输入无效金额并提交。'], expected: ['提示请输入大于0的转账金额。', '不生成转出记录。', '账户余额不变化。'] })
add({ side: '客户端', module: '法币转出', feature: '余额校验', control: '提交/确认转出', title: '新加坡账户转出金额超过可用余额时不可提交', type: '异常', priority: 'P0', precondition: '新加坡账户SGD可用余额为1,000。', data: '转出金额=1,001；服务费=2', steps: ['选择SGD并输入1,001。', '提交转出。'], expected: ['提示余额不足，且校验包含服务费占用。', '不生成有效转出申请。', '不冻结、不扣减余额。'] })
add({ side: '客户端', module: '法币转出', feature: '服务费', control: '金额输入框', title: '新加坡账户转出服务费和实际到账金额联动', type: '金额计算', priority: 'P0', precondition: '新加坡账户出金服务费配置有效。', data: '币种=SGD；转出金额=100；服务费=2', steps: ['选择SGD。', '输入转出金额100。', '查看预估服务费和实际到账。'], expected: ['服务费显示2.00 SGD。', '实际到账显示98.00 SGD。', '切换币种后币种单位同步变化，不固定显示USD。'] })
add({ side: '客户端', module: '法币转出', feature: '幂等控制', control: '提交/确认转出', title: '重复确认新加坡账户转出不重复扣款', type: '幂等/异常', priority: 'P0', precondition: '转出确认页面已打开；模拟网络延迟。', steps: ['连续点击确认转出。', '查询申请、流水及余额。'], expected: ['只生成一条有效转出申请。', '只冻结或扣减一次资金。', '重复请求返回同一结果或明确提示处理中。'] })
add({ side: '客户端', module: '法币转出', feature: '交易详情', control: '返回表单/返回账户', title: '新加坡账户转出详情及返回按钮正确', precondition: '存在新加坡账户JPY转出记录。', steps: ['打开记录详情并核对字段。', '点击“返回表单”。', '再次进入详情并点击“返回账户”。'], expected: ['详情展示新加坡账户、JPY金额、服务费、实际到账、交易编号和收款银行。', 'JPY按系统精度展示。', '两个返回按钮均进入正确页面且不重复提交交易。'] })

// 管理端：开户审核列表。
add({ side: '管理端', module: '开户审核', feature: '列表初始化', control: '开户审核菜单', title: '开户审核列表加载正确', priority: 'P0', precondition: '运营账号已登录且拥有开户审核查看权限。', steps: ['进入“KYC审核-开户审核”。'], expected: ['展示统计卡、搜索区和申请列表。', '列表字段包含客户信息、申请账户、提交日期、状态、操作。', '可见待处理、审核中、已开户、已拒绝演示数据。'] })
add({ side: '管理端', module: '开户审核', feature: '搜索', control: '搜索框', title: '按客户名称搜索申请', precondition: '列表存在多个客户申请。', data: 'WANYARA WAN', steps: ['在搜索框输入完整或部分客户名称。'], expected: ['仅展示名称匹配的申请。', '搜索忽略前后空格，并支持大小写不敏感匹配。'], note: '当前原型搜索框未绑定筛选逻辑，执行时预计暴露缺口。' })
add({ side: '管理端', module: '开户审核', feature: '搜索', control: '搜索框', title: '按用户ID搜索申请', precondition: '列表存在 UID-10001。', data: 'UID-10001', steps: ['输入用户ID并执行搜索。'], expected: ['准确返回对应用户申请。', '不展示其他用户记录。'], note: '当前原型搜索框未绑定筛选逻辑。' })
add({ side: '管理端', module: '开户审核', feature: '搜索', control: '搜索框', title: '无匹配结果显示空状态', type: '边界', precondition: '列表可正常加载。', data: 'NOT-EXIST-USER', steps: ['输入不存在的关键字。'], expected: ['列表显示“暂无符合条件的开户审核记录”。', '页面不报错，筛选条件仍可修改。'] })

for (const account of ['全部账户', '美国账户', '新加坡账户']) {
  add({ side: '管理端', module: '开户审核', feature: '账户类型筛选', control: '账户类型下拉', title: `筛选“${account}”`, precondition: '列表同时存在美国账户和新加坡账户申请数据。', steps: ['展开账户类型下拉。', `选择“${account}”。`], expected: [account === '全部账户' ? '展示所有账户类型记录。' : `仅展示${account}申请。`, '列表数量与筛选结果一致。'] })
}

for (const status of ['全部状态', '待处理', '审核中', '已开户', '已拒绝']) {
  add({ side: '管理端', module: '开户审核', feature: '状态筛选', control: '状态下拉', title: `筛选“${status}”`, precondition: '列表存在各状态申请数据。', steps: ['展开状态下拉。', `选择“${status}”。`], expected: [status === '全部状态' ? '展示所有状态记录。' : `仅展示状态为“${status}”的记录。`, '列表操作按钮随记录状态正确变化。'] })
}
add({ side: '管理端', module: '开户审核', feature: '组合筛选', control: '账户类型下拉+状态下拉+搜索框', title: '组合筛选准确', precondition: '列表存在多账户、多状态、多客户数据。', data: '账户=新加坡账户；状态=审核中；关键字=WANYARA', steps: ['依次设置账户类型、状态和关键字。'], expected: ['筛选条件按 AND 关系生效。', '仅展示同时满足全部条件的数据。'] })

for (const status of ['待处理', '审核中', '已开户', '已拒绝']) {
  add({ side: '管理端', module: '开户审核', feature: '查看详情', control: '查看详情', title: `${status}记录点击查看详情`, precondition: `列表存在“${status}”申请。`, steps: ['点击该记录“查看详情”。'], expected: ['进入对应客户的新加坡账户开户审核详情页。', '详情页数据与列表记录一致。', '页面以查看模式打开，审核控件只读或按状态受限。'] })
}
for (const status of ['待处理', '审核中']) {
  add({ side: '管理端', module: '开户审核', feature: '开始处理', control: '开始处理', title: `${status}记录点击开始处理`, priority: 'P0', precondition: `列表存在“${status}”申请；运营有处理权限。`, steps: ['点击“开始处理”。'], expected: ['进入对应详情的处理模式。', '审核结论控件可操作。', status === '待处理' ? '记录进入审核中或被当前运营锁定，避免多人重复处理。' : '保持审核中并加载最新数据。'], transition: status === '待处理' ? '待处理 → 审核中' : '审核中 → 审核中' })
}
for (const status of ['已开户', '已拒绝']) {
  add({ side: '管理端', module: '开户审核', feature: '终态按钮控制', control: '开始处理', title: `${status}记录不展示开始处理按钮`, type: '权限/状态', priority: 'P0', precondition: `列表存在“${status}”申请。`, steps: ['查看该记录操作列。'], expected: ['展示“查看详情”。', '不展示“开始处理”。', '通过直接请求也不得再次审核终态申请。'] })
}

// 管理端：审核详情及审核按钮。
add({ side: '管理端', module: '开户审核详情', feature: '页面数据', control: '详情页', title: '申请详情与列表及客户数据一致', priority: 'P0', precondition: '从任意申请进入详情。', steps: ['核对用户ID、客户名称、邮箱、申请账户和申请时间。', '核对当前开户状态。'], expected: ['详情数据均属于所选申请，不串客户。', '账户类型固定为新加坡账户。', '支持币种来自系统配置 USD/CNY/SGD/AED/JPY。'] })
add({ side: '管理端', module: '开户审核详情', feature: '返回', control: '返回开户审核', title: '返回开户审核列表', precondition: '位于审核详情页。', steps: ['点击“返回开户审核”。'], expected: ['返回开户审核列表。', '原筛选条件应保留。', '未保存的审核输入应提示确认或不被提交。'] })
add({ side: '管理端', module: '开户审核详情', feature: '客户资料', control: '查看客户完整资料', title: '跳转查看客户完整资料', precondition: '位于审核详情页；运营有用户资料查看权限。', steps: ['点击“查看客户完整资料”。'], expected: ['进入当前客户的完整资料页或打开资料抽屉。', '打开的客户ID与申请一致。', '返回后仍回到原审核申请。'], note: '当前原型按钮未绑定动作，执行时预计暴露缺口。' })
add({ side: '管理端', module: '开户审核详情', feature: '申请信息', control: '支持币种', title: '审核页只展示系统支持币种且不可编辑', type: '配置边界', precondition: '新加坡账户类型支持 USD/CNY/SGD/AED/JPY。', steps: ['查看“新加坡账户申请信息”。', '尝试修改支持币种。'], expected: ['仅以只读方式展示系统配置币种。', '审核页不提供新增、删除或编辑币种入口。', '不展示币种中转银行明细。'] })
add({ side: '管理端', module: '开户审核详情', feature: '配置账户跳转', control: '配置账户', title: '配置账户跳转到用户管理', priority: 'P0', precondition: '申请账户配置状态需处理；运营有用户管理权限。', steps: ['点击“配置账户”。'], expected: ['跳转到用户管理页面。', '定位到当前用户或可通过用户ID找到该用户。', '审核页不直接修改收款人和账户号码。'] })
add({ side: '管理端', module: '开户审核详情', feature: '配置账户按钮控制', control: '配置账户', title: '已拒绝申请不展示配置账户按钮', type: '状态/权限', priority: 'P0', precondition: '申请状态为已拒绝。', steps: ['从列表进入已拒绝申请详情。', '查看“新加坡账户申请信息”模块。'], expected: ['不展示“配置账户”按钮。', '用户管理中该用户保持已拒绝，不允许录入账户号码形成已开户账户。'], note: '当前原型将配置状态写死为待处理，执行时预计暴露缺口。' })
add({ side: '管理端', module: '开户审核详情', feature: '配置账户按钮控制', control: '配置账户', title: '已开户申请不重复展示配置账户按钮', type: '状态/权限', priority: 'P1', precondition: '申请状态为已开户。', steps: ['从列表进入已开户申请详情。', '查看“新加坡账户申请信息”模块。'], expected: ['审核页不提供再次开户或修改账户信息的入口。', '如需维护账户，统一从用户管理点击“编辑新加坡账户”。'], note: '当前原型将配置状态写死为待处理，执行时预计暴露缺口。' })
add({ side: '管理端', module: '开户审核详情', feature: '审核结论', control: '审核结果下拉', title: '选择确认开户时拒绝原因禁用', precondition: '处于待处理/审核中的处理模式。', steps: ['在审核结果选择“确认开户”。'], expected: ['拒绝原因输入框禁用。', '主按钮显示“确认开户”。', '开户费扣款成功时按钮可用。'] })
add({ side: '管理端', module: '开户审核详情', feature: '审核结论', control: '审核结果下拉', title: '选择拒绝申请时拒绝原因启用', precondition: '处于待处理/审核中的处理模式。', steps: ['在审核结果选择“拒绝申请”。'], expected: ['拒绝原因输入框启用。', '主按钮文案变为“确认拒绝”。', '拒绝原因为空时不得提交。'] })
add({ side: '管理端', module: '开户审核详情', feature: '拒绝校验', control: '确认拒绝', title: '拒绝原因为空时禁止拒绝', type: '校验', priority: 'P0', precondition: '审核结果已选拒绝申请。', data: '拒绝原因为空或仅空格', steps: ['清空拒绝原因。', '尝试点击“确认拒绝”。'], expected: ['按钮禁用或提示必须填写拒绝原因。', '申请状态不变。', '不生成退款、不写入拒绝日志。'] })
add({ side: '管理端', module: '开户审核详情', feature: '拒绝申请', control: '确认拒绝', title: '填写拒绝原因并拒绝申请', priority: 'P0', precondition: '申请为待处理或审核中；开户费扣款成功。', data: '拒绝原因=客户资料不符合新加坡账户开户要求', steps: ['选择“拒绝申请”。', '填写拒绝原因。', '点击“确认拒绝”。'], expected: ['申请状态变为已拒绝。', '拒绝原因以红色只读文本展示。', '不再展示“确认拒绝”按钮。', '记录操作人、时间、申请编号和拒绝原因。', '触发开户费原路退款。'], transition: '待处理/审核中 → 已拒绝' })
add({ side: '管理端', module: '开户审核详情', feature: '拒绝终态', control: '审核操作卡片', title: '已拒绝详情为只读且不展示确认拒绝', type: '状态/权限', priority: 'P0', precondition: '申请已拒绝。', steps: ['从列表点击“查看详情”。', '查看审核操作卡片。'], expected: ['审核结果显示已拒绝。', '拒绝原因以红色字体只读展示。', '不展示审核结果下拉、可编辑拒绝原因和确认拒绝按钮。', '不展示开始处理入口。'] })
add({ side: '管理端', module: '开户审核详情', feature: '确认开户', control: '确认开户', title: '点击确认开户打开二次确认弹窗', priority: 'P0', precondition: '申请为待处理或审核中；扣费状态成功；审核结果为确认开户。', steps: ['点击“确认开户”。'], expected: ['弹出确认开户二次确认弹窗。', '展示正确客户名称和申请账户。', '此时尚未将申请置为已开户。'] })
add({ side: '管理端', module: '开户审核详情', feature: '确认开户弹窗', control: '取消/X', title: '取消确认开户', precondition: '确认开户弹窗已打开。', steps: ['分别点击“取消”和右上角关闭图标。'], expected: ['关闭弹窗并返回处理页。', '申请仍为原状态。', '不创建账户、不写确认开户日志。'] })
add({ side: '管理端', module: '开户审核详情', feature: '确认开户弹窗', control: '确认开户', title: '二次确认后完成开户审核', priority: 'P0', precondition: '确认开户弹窗已打开；申请仍可处理。', steps: ['点击弹窗“确认开户”。'], expected: ['申请状态变为已开户。', '详情页切换为只读。', '记录操作日志。', '列表不再展示开始处理按钮。', '用户管理中该用户状态与业务规则同步。'], transition: '待处理/审核中 → 已开户' })
add({ side: '管理端', module: '开户审核详情', feature: '开户费异常', control: '确认开户', title: '扣费失败时禁止确认开户', type: '异常', priority: 'P0', precondition: '申请存在但开户费扣款状态为失败或已冲正。', steps: ['选择确认开户。', '点击“确认开户”。'], expected: ['按钮禁用或提示“开户费扣款失败，不能确认开户”。', '申请不进入已开户。', '不创建用户账户实例。'] })
add({ side: '管理端', module: '开户审核详情', feature: '并发审核', control: '确认开户/确认拒绝', title: '两名运营并发处理同一申请', type: '并发', priority: 'P0', precondition: '运营A、运营B同时打开同一审核中申请。', steps: ['运营A确认开户。', '运营B随后确认拒绝。'], expected: ['仅第一个合法提交成功。', '第二个提交提示状态已变化并刷新最新结果。', '最终状态唯一，不同时出现开户与退款。'] })
add({ side: '管理端', module: '开户审核详情', feature: '权限', control: '审核操作', title: '无审核权限账号只能查看', type: '权限', priority: 'P0', precondition: '账号有查看权限但无处理权限。', steps: ['进入审核详情。'], expected: ['可查看申请信息。', '不展示或禁用确认开户、确认拒绝、配置账户等修改按钮。', '直接调用接口返回无权限且不改变数据。'] })

// 管理端：用户管理和用户实际账户信息。
add({ side: '管理端', module: '用户管理', feature: '列表字段', control: '用户管理菜单', title: '用户列表分列展示新加坡账户状态和信息', priority: 'P0', precondition: '运营账号有用户管理权限。', steps: ['进入“KYC审核-用户管理”。'], expected: ['列表包含“新加坡账户状态”和“新加坡账户信息”两列。', '状态列只展示状态。', '信息列在已开户时展示账户号码和收款人，其他状态显示未配置或空态。'] })
add({ side: '管理端', module: '用户管理', feature: '搜索', control: '搜索框', title: '按用户名、ID或客户编号搜索用户', precondition: '用户列表存在多个用户。', data: 'UID-10001', steps: ['输入关键字搜索。'], expected: ['只展示匹配用户。', '新加坡账户状态和信息与原记录一致。'], note: '当前原型搜索框未绑定筛选逻辑。' })
add({ side: '管理端', module: '用户管理', feature: '账户状态筛选', control: '账户状态下拉', title: '按账户状态筛选用户', precondition: '列表存在不同账户状态用户。', steps: ['展开账户状态下拉。', '选择一个状态。'], expected: ['列表仅展示符合条件用户。', '清空筛选后恢复全部。'], note: '当前原型下拉为展示控件，需联调确认真实筛选项。' })
for (const button of ['查看', '编辑']) {
  add({ side: '管理端', module: '用户管理', feature: '用户基础操作', control: button, title: `点击用户“${button}”按钮`, precondition: '用户列表存在目标用户；运营有对应权限。', steps: [`点击目标用户的“${button}”。`], expected: [button === '查看' ? '进入该用户详情并展示正确客户资料。' : '打开该用户编辑页面/弹窗。', '不能串到其他用户。'], note: '当前原型按钮未绑定动作，执行时预计暴露缺口。' })
}

const userStatusActions = [
  ['未开通', '开通新加坡账户', '打开后台手动开通弹窗，不进入客户端申请审核流程。'],
  ['待处理', '查看申请', '跳转到该用户的新加坡账户申请详情。'],
  ['审核中', '查看申请', '跳转到审核中的申请详情，不允许重复开通。'],
  ['已开户', '编辑新加坡账户', '打开编辑账户弹窗。'],
  ['已拒绝', '查看申请', '打开已拒绝申请只读详情。'],
]
for (const [status, button, result] of userStatusActions) {
  add({ side: '管理端', module: '用户管理', feature: '状态对应操作', control: button, title: `${status}状态展示“${button}”`, priority: 'P0', precondition: `用户新加坡账户状态为“${status}”。`, steps: ['查看用户操作列。', `点击“${button}”。`], expected: [`操作按钮文案为“${button}”。`, result, status === '未开通' ? '不展示查看申请或编辑新加坡账户。' : '不展示开通新加坡账户按钮。'] })
}
add({ side: '管理端', module: '用户管理', feature: '防账户冲突', control: '开通新加坡账户', title: '待处理或审核中不允许后台手动开通', type: '状态/幂等', priority: 'P0', precondition: '用户已有待处理或审核中的客户端申请。', steps: ['在用户列表查看操作。', '尝试构造后台手动开通请求。'], expected: ['页面只展示查看申请。', '服务端拒绝手动开通请求。', '用户仍只有一条有效申请/账户。'] })
add({ side: '管理端', module: '用户管理', feature: '手动开通弹窗', control: '开通新加坡账户', title: '未开通用户打开手动开通弹窗', priority: 'P0', precondition: '用户状态为未开通。', steps: ['点击“开通新加坡账户”。'], expected: ['弹窗标题为“开通新加坡账户”。', '开户来源显示“后台手动开通”。', '收款人和账户号码可编辑。', '银行名称、收款银行、SWIFT、支持币种和银行地址为灰色只读文本框。'] })
add({ side: '管理端', module: '用户管理', feature: '手动开通默认值', control: '开通新加坡账户', title: '手动开通默认值读取系统模板', precondition: '系统新加坡账户模板已配置。', steps: ['打开未开通用户的开通弹窗。'], expected: ['默认收款人为 FIDERE TRUST LIMITED。', '默认账户号码取系统配置末四位 0454。', '银行名称为 Green Link Digital Bank Pte. Ltd.。', '收款银行为 Green Link Digital Bank。', 'SWIFT 为 GLDTSGSG。', '支持币种为 USD/CNY/SGD/AED/JPY。', '银行地址包含 SINGAPORE 117439。'] })
for (const field of ['收款人', '账户号码']) {
  add({ side: '管理端', module: '用户管理', feature: '必填校验', control: '确认开通/保存', title: `${field}为空时不能保存`, type: '校验', priority: 'P0', precondition: '开通或编辑新加坡账户弹窗已打开。', data: `${field}=空字符串或仅空格`, steps: [`清空“${field}”。`, '点击确认开通或保存。'], expected: ['显示“请填写收款人和账户号码”错误提示。', '弹窗不关闭。', '账户状态和原数据不改变。'] })
}
add({ side: '管理端', module: '用户管理', feature: '手动开通', control: '确认开通', title: '后台手动开通新加坡账户成功', priority: 'P0', precondition: '用户状态为未开通；弹窗字段合法。', data: '收款人=OFFLINE CUSTOMER；账户号码=0950', steps: ['填写收款人和账户号码。', '点击“确认开通”。'], expected: ['用户状态变为已开户。', '信息列展示账户号码 0950 和收款人 OFFLINE CUSTOMER。', '开户来源保存为后台手动开通。', '记录操作人和更新时间。', '不生成客户端申请审核记录，不扣开户费。'], transition: '未开通 → 已开户（后台手动开通）' })
add({ side: '管理端', module: '用户管理', feature: '手动开通', control: '确认开通', title: '重复提交手动开通请求不创建多个账户', type: '幂等', priority: 'P0', precondition: '用户未开通；模拟网络延迟。', steps: ['连续点击“确认开通”。', '查询用户账户实例。'], expected: ['只创建一个新加坡账户实例。', '用户状态唯一为已开户。', '只记录一次成功开通操作。'] })
add({ side: '管理端', module: '用户管理', feature: '弹窗关闭', control: '取消/X', title: '取消开通或编辑账户', precondition: '开通或编辑弹窗已打开并修改了字段。', steps: ['分别点击“取消”和右上角关闭图标。'], expected: ['弹窗关闭。', '未保存修改不生效。', '再次打开显示原数据。'] })
add({ side: '管理端', module: '用户管理', feature: '编辑账户弹窗', control: '编辑新加坡账户', title: '客户申请来源的已开户账户打开编辑弹窗', precondition: '用户已通过客户端申请完成开户。', steps: ['点击“编辑新加坡账户”。'], expected: ['弹窗标题为“编辑新加坡账户”。', '开户来源显示“客户申请”。', '收款人和账户号码回显用户实际配置。', '系统银行信息只读。'] })
add({ side: '管理端', module: '用户管理', feature: '编辑账户弹窗', control: '编辑新加坡账户', title: '后台手动开通来源的账户正确标识', precondition: '用户由后台手动开通且已开户。', steps: ['点击“编辑新加坡账户”。'], expected: ['开户来源显示“后台手动开通”。', '编辑保存后来源不被改为客户申请。'] })
add({ side: '管理端', module: '用户管理', feature: '编辑账户', control: '保存', title: '编辑收款人和账户号码成功', priority: 'P0', precondition: '用户状态为已开户。', data: '收款人=WAN YARA WAN；账户号码=0950', steps: ['修改收款人和账户号码。', '点击“保存”。'], expected: ['保存成功并关闭弹窗。', '列表信息列展示最新值。', '状态仍为已开户。', '更新人和更新时间刷新。', '系统银行模板不被修改。'] })
add({ side: '管理端', module: '用户管理', feature: '只读字段', control: '银行信息灰色文本框', title: '用户维度不可修改系统银行信息', type: '权限/配置边界', priority: 'P0', precondition: '开通或编辑弹窗已打开。', steps: ['尝试编辑银行名称、收款银行、SWIFT、支持币种和银行地址。', '构造请求提交这些字段。'], expected: ['页面字段只读且不可输入。', '服务端忽略或拒绝用户维度的系统字段修改。', '系统账户类型配置不受影响。'] })
add({ side: '管理端', module: '用户管理', feature: '系统模板联动', control: '只读银行信息', title: '系统模板变更后用户弹窗读取最新银行信息', type: '配置联动', precondition: '账户类型配置已更新新加坡账户银行地址或SWIFT；用户已开户。', steps: ['重新打开用户的编辑新加坡账户弹窗。'], expected: ['收款人和账户号码仍取用户实际配置。', '银行名称、地址、收款银行、SWIFT和币种读取最新系统配置。', '历史交易记录保留原快照，不被追溯修改。'] })
add({ side: '管理端', module: '用户管理', feature: '演示数据', control: '开通新加坡账户', title: '开通最后一条未开通演示数据后仍保留未开通样例', type: '原型演示', priority: 'P2', precondition: '列表仅剩一条未开通演示用户。', steps: ['对该用户执行确认开通。'], expected: ['原用户变为已开户。', '系统补充一条新的未开通 Demo 用户，页面仍可演示未开通状态。'] })
add({ side: '管理端', module: '用户管理', feature: '权限', control: '开通/编辑新加坡账户', title: '无账户维护权限不能开通或编辑', type: '权限', priority: 'P0', precondition: '账号仅有用户查看权限。', steps: ['进入用户管理。', '尝试打开或调用开通/编辑接口。'], expected: ['不展示开通和编辑账户按钮，或按钮禁用。', '接口返回无权限。', '用户账户数据不变。'] })

// 管理端：法币资产管理中的新加坡账户手动入金、手动出金。
add({ side: '管理端', module: '法币资产管理', feature: '快捷操作', control: '手动入金', title: '点击手动入金打开操作抽屉', priority: 'P0', precondition: '运营已登录且拥有手动入金权限。', steps: ['进入“法币资产管理-总览”。', '点击“手动入金”。'], expected: ['打开标题为“手动入金”的抽屉。', '展示风险提示、客户、账户、币种、打款渠道、入金金额、备注和上传凭证控件。', '底部展示取消和确认入金按钮。'] })
add({ side: '管理端', module: '法币资产管理', feature: '快捷操作', control: '手动出金', title: '点击手动出金打开操作抽屉', priority: 'P0', precondition: '运营已登录且拥有手动出金权限。', steps: ['进入“法币资产管理-总览”。', '点击“手动出金”。'], expected: ['打开标题为“手动出金”的抽屉。', '展示风险提示、客户、账户、币种、打款渠道、银行账号、出金金额、备注和上传凭证控件。', '底部展示取消和确认出金按钮。'] })

for (const operation of ['手动入金', '手动出金']) {
  const confirmButton = operation === '手动入金' ? '确认入金' : '确认出金'
  add({ side: '管理端', module: operation, feature: '账户选择', control: '选择账户', title: `${operation}账户列表包含新加坡账户`, priority: 'P0', precondition: `${operation}抽屉已打开。`, steps: ['选择一名已开通新加坡账户的客户。', '展开“选择账户”下拉框。'], expected: ['账户列表展示新加坡账户。', '同一客户的新加坡账户只出现一次。', '不得选择其他客户的账户实例。'] })
  add({ side: '管理端', module: operation, feature: '账户状态校验', control: '选择账户', title: `${operation}不能选择未开户的新加坡账户`, type: '权限/状态', priority: 'P0', precondition: '所选客户的新加坡账户状态为未开通、待处理、审核中或已拒绝。', steps: ['选择该客户。', '查看账户下拉并尝试构造新加坡账户请求。'], expected: ['页面不提供该客户的新加坡账户，或明确标记不可选。', '服务端校验账户状态并拒绝请求。', '不生成资金流水。'] })
  add({ side: '管理端', module: operation, feature: '币种范围', control: '币种', title: `${operation}选择新加坡账户后展示固定支持币种`, priority: 'P0', precondition: '所选客户已开户；账户选择新加坡账户。', steps: ['展开币种下拉。'], expected: ['仅展示 USD/CNY/SGD/AED/JPY。', '不展示 HKD、EUR 或后台已关闭币种。', '切换账户时币种自动重置为新账户首个可用币种。'] })
  add({ side: '管理端', module: operation, feature: '客户账户关联', control: '选择客户/选择账户', title: `${operation}切换客户后清空原新加坡账户信息`, type: '状态/数据', precondition: '已选择客户A的新加坡账户。', steps: ['将客户切换为客户B。'], expected: ['清空或重新选择账户。', '不保留客户A的新加坡账户号码、余额或银行账号。', '提交时账户所有者必须与客户B一致。'] })
  add({ side: '管理端', module: operation, feature: '必填校验', control: confirmButton, title: `${operation}必填字段缺失时不可提交`, type: '校验', priority: 'P0', precondition: `${operation}抽屉已打开。`, data: '客户/账户/币种/金额/备注分别留空', steps: ['逐项留空一个必填字段。', `点击“${confirmButton}”。`], expected: ['在对应字段展示明确必填提示。', '抽屉不关闭。', '不生成流水，不改变账户余额。'] })
  add({ side: '管理端', module: operation, feature: '金额校验', control: confirmButton, title: `${operation}金额为0、负数或非法字符时不可提交`, type: '校验', priority: 'P0', precondition: `已完整填写${operation}其他字段。`, data: '金额=0、-1、abc、超精度金额', steps: ['依次输入非法金额。', `点击“${confirmButton}”。`], expected: ['提示请输入正确金额。', '按币种精度限制小数位，JPY按系统精度处理。', '不生成资金流水。'] })
  add({ side: '管理端', module: operation, feature: '上传凭证', control: '上传凭证（可选）', title: `${operation}上传和移除凭证`, precondition: `${operation}抽屉已打开。`, data: '合法JPG/PNG；超限文件；不支持格式文件', steps: ['上传合法凭证。', '移除后重新上传。', '尝试上传超限或不支持格式文件。'], expected: ['合法文件显示文件名并可移除。', '不上传凭证仍可在其他必填项合法时提交。', '非法文件被阻止并显示格式或大小提示。'] })
  add({ side: '管理端', module: operation, feature: '关闭抽屉', control: '取消/X', title: `取消${operation}不保存`, precondition: `${operation}抽屉已打开且已填写部分字段。`, steps: ['分别验证“取消”和右上角关闭图标。'], expected: ['抽屉关闭。', '不生成资金流水。', '新加坡账户余额不变化。', '再次打开时不错误保留上次未提交数据。'] })
}

for (const currency of ['USD', 'CNY', 'SGD', 'AED', 'JPY']) {
  add({ side: '管理端', module: '手动入金', feature: '确认入金', control: '确认入金', title: `新加坡账户${currency}手动入金成功`, priority: currency === 'USD' || currency === 'SGD' ? 'P0' : 'P1', precondition: `客户已开通新加坡账户；${currency}币种启用；运营有手动入金权限。`, data: `账户=新加坡账户；币种=${currency}；金额=100；渠道=电汇`, steps: ['选择客户及其新加坡账户。', `选择${currency}并输入金额100。`, '填写备注，点击“确认入金”。', '查看客户资产和流水查询。'], expected: ['只增加该客户新加坡账户对应币种的可用余额100。', `流水账户类型为新加坡账户，方向为入金，金额为${currency} 100。`, '记录操作人、时间、渠道、备注和凭证。', '其他账户及其他币种余额不变。'] })
  add({ side: '管理端', module: '手动出金', feature: '确认出金', control: '确认出金', title: `新加坡账户${currency}手动出金成功`, priority: currency === 'USD' || currency === 'SGD' ? 'P0' : 'P1', precondition: `客户新加坡账户${currency}可用余额不少于100；运营有手动出金权限。`, data: `账户=新加坡账户；币种=${currency}；金额=100；银行账号=0950`, steps: ['选择客户及其新加坡账户。', `选择${currency}、银行账号并输入金额100。`, '填写备注，点击“确认出金”。', '查看客户资产和流水查询。'], expected: ['只扣减该客户新加坡账户对应币种的可用余额100。', `流水账户类型为新加坡账户，方向为出金，金额为${currency} 100。`, '收款银行账号与所选客户账户一致。', '记录操作人、时间、渠道、备注和凭证。', '其他账户及其他币种余额不变。'] })
}

add({ side: '管理端', module: '手动入金', feature: '币种单位', control: '币种/入金金额', title: '切换新加坡账户币种后入金金额单位同步变化', type: '展示/数据', precondition: '手动入金抽屉已选择新加坡账户。', steps: ['依次选择USD、CNY、SGD、AED、JPY。'], expected: ['金额输入框前后缀同步展示当前币种。', '不得固定显示USD。', '已输入金额的处理规则明确，切换币种时应清空或要求重新确认。'] })
add({ side: '管理端', module: '手动出金', feature: '币种单位', control: '币种/出金金额', title: '切换新加坡账户币种后出金金额单位同步变化', type: '展示/数据', precondition: '手动出金抽屉已选择新加坡账户。', steps: ['依次选择USD、CNY、SGD、AED、JPY。'], expected: ['金额输入框和余额提示同步展示当前币种。', '不得固定显示USD。', '银行账号列表按账户与币种刷新。'] })
add({ side: '管理端', module: '手动出金', feature: '银行账号', control: '银行账号', title: '新加坡账户手动出金只能选择当前客户银行账号', type: '数据隔离', priority: 'P0', precondition: '客户A和客户B均有银行账号；当前选择客户A的新加坡账户。', steps: ['展开银行账号下拉。', '尝试提交客户B银行账号ID。'], expected: ['下拉仅展示客户A可用银行账号。', '服务端拒绝不属于客户A的银行账号。', '不生成出金流水。'] })
add({ side: '管理端', module: '手动出金', feature: '余额校验', control: '确认出金', title: '新加坡账户手动出金余额不足时不可提交', type: '异常', priority: 'P0', precondition: '客户新加坡账户AED可用余额为100。', data: '出金金额=101', steps: ['选择AED并输入101。', '点击“确认出金”。'], expected: ['提示可用余额不足。', '不扣减余额，不产生负余额。', '不生成成功流水。'] })
add({ side: '管理端', module: '手动入金', feature: '幂等控制', control: '确认入金', title: '重复点击确认入金不重复增加余额', type: '幂等/异常', priority: 'P0', precondition: '新加坡账户手动入金字段合法；模拟网络延迟。', steps: ['连续点击“确认入金”。', '查询余额和流水。'], expected: ['只生成一条手动入金流水。', '余额只增加一次。', '重复请求返回同一操作结果或明确提示处理中。'] })
add({ side: '管理端', module: '手动出金', feature: '幂等控制', control: '确认出金', title: '重复点击确认出金不重复扣减余额', type: '幂等/异常', priority: 'P0', precondition: '新加坡账户手动出金字段合法；模拟网络延迟。', steps: ['连续点击“确认出金”。', '查询余额和流水。'], expected: ['只生成一条手动出金流水。', '余额只扣减一次。', '重复请求返回同一操作结果或明确提示处理中。'] })
add({ side: '管理端', module: '手动入金/出金', feature: '权限', control: '手动入金/手动出金', title: '无资金操作权限不能手动入金或出金', type: '权限', priority: 'P0', precondition: '运营账号只有法币资产查看权限。', steps: ['进入法币资产管理。', '检查快捷按钮并尝试直接调用接口。'], expected: ['不展示或禁用手动入金、手动出金按钮。', '接口返回无权限。', '客户余额和流水不变化。'] })

// 管理端：账户类型配置和收款银行配置。
add({ side: '管理端', module: '账户类型配置', feature: '列表初始化', control: '账户类型配置菜单', title: '账户类型列表展示正确', priority: 'P0', precondition: '运营有账户类型配置查看权限。', steps: ['进入“运营-账户类型配置”。'], expected: ['列表展示香港、美国、新加坡账户。', '字段包含中英文名称、代码、支持币种、状态、排序和操作。', '列表不展示是否默认账户、是否支持入金、是否支持出金、是否支持资金互转四列。', '新加坡账户支持 USD/CNY/SGD/AED/JPY。'] })
for (const [feature, data] of [['关键字筛选', 'SG_ACCOUNT'], ['币种筛选', 'JPY'], ['状态筛选', '启用']]) {
  add({ side: '管理端', module: '账户类型配置', feature, control: feature.includes('关键字') ? '搜索框' : '下拉框', title: `${feature}结果准确`, precondition: '账户类型列表存在多条配置。', data, steps: ['设置筛选条件。'], expected: ['仅展示匹配的账户类型。', '筛选不修改任何配置数据。'] })
}
add({ side: '管理端', module: '账户类型配置', feature: '筛选', control: '重置', title: '重置全部筛选条件', precondition: '已设置关键字、币种和状态筛选。', steps: ['点击“重置”。'], expected: ['所有筛选条件清空。', '恢复展示全部账户类型。'] })
add({ side: '管理端', module: '账户类型配置', feature: '新增', control: '新增账户类型', title: '打开新增账户类型弹窗', precondition: '运营有编辑权限。', steps: ['点击“新增账户类型”。'], expected: ['打开新增弹窗。', '展示基础信息和“支持币种及互转手续费”模块。', '每个法币单独一行展示支持开关和固定手续费输入框。', '不展示原币种标签及多选下拉。', '不展示是否默认账户、支持入金、支持出金、支持资金互转四个开关。'] })
add({ side: '管理端', module: '账户类型配置', feature: '新增校验', control: '保存配置', title: '必填字段为空不能保存', type: '校验', precondition: '新增账户类型弹窗已打开。', data: '名称、英文名称或代码为空', steps: ['留空任一必填字段。', '点击“保存配置”。'], expected: ['显示必填错误。', '弹窗不关闭。', '列表不新增记录。'] })
add({ side: '管理端', module: '账户类型配置', feature: '新增校验', control: '保存配置', title: '账户类型代码重复不能保存', type: '校验', priority: 'P0', precondition: '已存在 SG_ACCOUNT。', data: '代码=sg_account', steps: ['填写重复代码。', '点击“保存配置”。'], expected: ['代码统一转为大写比较。', '提示账户类型代码不允许重复。', '不新增重复记录。'] })
add({ side: '管理端', module: '账户类型配置', feature: '币种配置列表', control: '币种支持开关', title: '币种列表只展示后台启用法币', type: '配置边界', priority: 'P0', precondition: '币种管理中部分法币启用、部分禁用。', steps: ['打开新增或编辑账户类型弹窗。', '查看币种配置列表。'], expected: ['仅展示后台已启用法币。', '每行显示币种代码、名称、支持开关、手续费输入框和同币种单位。', '不展示数字货币或后台已禁用法币。'], note: '当前原型使用固定法币列表，需联调后台币种启用状态。' })
add({ side: '管理端', module: '账户类型配置', feature: '币种支持开关', control: '开启/关闭', title: '开启币种后启用手续费输入', priority: 'P0', precondition: '编辑账户类型弹窗已打开；目标币种当前关闭。', steps: ['点击目标币种支持开关。'], expected: ['开关变为开启。', '该币种手续费输入框可编辑。', '保存后该币种出现在账户类型支持币种列表。'] })
add({ side: '管理端', module: '账户类型配置', feature: '币种支持开关', control: '开启/关闭', title: '关闭币种后禁用手续费输入并保留原值', priority: 'P0', precondition: '目标币种已开启且手续费已有值。', data: 'USD手续费=50.00', steps: ['关闭USD。', '保存账户类型。', '再次打开编辑弹窗并重新开启USD。'], expected: ['关闭后手续费输入框禁用。', '列表不再将USD展示为支持币种。', '原手续费50.00被保留。', '重新开启后输入框恢复50.00。'] })
add({ side: '管理端', module: '账户类型配置', feature: '券商互转手续费', control: '手续费输入框', title: '配置固定手续费并保存', priority: 'P0', precondition: '目标币种已开启。', data: 'USD=50.00', steps: ['输入手续费50.00。', '点击“保存配置”。', '重新打开编辑弹窗。'], expected: ['保存成功。', 'USD手续费回显50.00。', '手续费币种固定为USD，无额外币种选择器。'] })
add({ side: '管理端', module: '账户类型配置', feature: '券商互转手续费', control: '手续费输入框', title: '手续费为0表示免手续费', priority: 'P0', precondition: '目标币种已开启。', data: 'CNY=0.00', steps: ['输入0.00并保存。'], expected: ['保存成功。', '该账户CNY转入券商账户时手续费为0。', '其他币种手续费不受影响。'] })
add({ side: '管理端', module: '账户类型配置', feature: '券商互转手续费', control: '保存配置', title: '负数或空手续费不能保存开启币种', type: '校验', priority: 'P0', precondition: '目标币种已开启。', data: '手续费为空或-1', steps: ['输入无效手续费。', '点击“保存配置”。'], expected: ['提示填写有效手续费且金额不能小于0。', '弹窗不关闭。', '原配置不被修改。'] })
add({ side: '管理端', module: '账户类型配置', feature: '券商互转手续费', control: '编辑账户类型', title: '不同账户类型分别维护同币种手续费', priority: 'P0', precondition: '香港、新加坡、美国账户均支持USD。', data: '香港USD=50；新加坡USD=40；美国USD=0', steps: ['分别编辑三个账户类型的USD手续费并保存。', '重新打开三个账户类型。'], expected: ['每个账户类型回显自己的USD手续费。', '修改一个账户不覆盖另外两个账户。'] })
add({ side: '管理端', module: '账户类型配置', feature: '券商互转手续费', control: '手续费配置', title: 'IBKR和Webull共用账户币种手续费', type: '业务规则', priority: 'P0', precondition: '某账户类型USD手续费已配置。', steps: ['查看该账户向IBKR和Webull转入的手续费规则。'], expected: ['两家券商读取同一账户类型+币种的手续费。', '账户类型弹窗不提供券商选择或券商专属费率。'] })
add({ side: '管理端', module: '账户类型配置', feature: '券商互转手续费', control: '手续费配置', title: '手续费只作用于法币账户转入券商账户', type: '业务规则', priority: 'P0', precondition: '账户类型已配置非零券商转入手续费。', steps: ['分别发起法币账户到券商、券商到账户、法币账户之间的互转。'], expected: ['仅法币账户转入IBKR/Webull方向收取该固定手续费。', '券商转出及其他账户之间互转不读取此配置。'] })
add({ side: '管理端', module: '账户类型配置', feature: '保存新增', control: '保存配置', title: '新增账户类型成功', precondition: '新增弹窗字段合法且代码唯一。', steps: ['填写全部字段并选择币种。', '点击“保存配置”。'], expected: ['新增成功并关闭弹窗。', '列表按展示排序显示新账户类型。', '记录更新人和更新时间。'] })
add({ side: '管理端', module: '账户类型配置', feature: '关闭弹窗', control: '取消/X', title: '取消新增或编辑账户类型', precondition: '账户类型弹窗已打开并修改字段。', steps: ['分别点击“取消”和右上角关闭图标。'], expected: ['弹窗关闭。', '未保存修改不生效。'] })

for (const button of ['详情', '银行配置', '编辑']) {
  add({ side: '管理端', module: '账户类型配置', feature: '列表操作', control: button, title: `点击新加坡账户“${button}”`, priority: 'P0', precondition: '新加坡账户类型存在。', steps: [`点击操作列“${button}”。`], expected: [button === '详情' ? '进入新加坡账户详情页。' : button === '银行配置' ? '直接进入“新加坡账户-收款银行配置”页。' : '打开编辑账户类型弹窗并正确回显。', '目标账户类型不得错误。'] })
}
for (const [current, button, next] of [['启用', '禁用', '禁用'], ['禁用', '启用', '启用']]) {
  add({ side: '管理端', module: '账户类型配置', feature: '启禁用', control: button, title: `${current}账户类型点击“${button}”`, priority: 'P0', precondition: `账户类型当前为${current}。`, steps: [`点击“${button}”。`], expected: [`账户类型状态变为${next}。`, next === '禁用' ? '未开户用户不再看到新申请入口。' : '符合条件的未开户用户恢复申请入口。', '已开户用户账户和历史资产不消失。'], transition: `${current} → ${next}` })
}
add({ side: '管理端', module: '账户类型详情', feature: '基础信息', control: '详情/列表行', title: '详情页展示账户能力和币种', precondition: '进入新加坡账户详情。', steps: ['核对基础信息和支持币种。'], expected: ['基础信息中展示默认账户、入金、出金、资金互转能力。', '支持币种仅展示币种，不提供编辑币种配置或禁用币种按钮。'] })
add({ side: '管理端', module: '账户类型详情', feature: '返回', control: '返回账户类型列表', title: '从详情返回列表', precondition: '位于账户类型详情页。', steps: ['点击“返回账户类型列表”。'], expected: ['返回列表页。', '配置数据保持不变。'] })
add({ side: '管理端', module: '账户类型详情', feature: '编辑基础信息', control: '编辑基础信息', title: '从详情打开编辑弹窗', precondition: '位于新加坡账户详情页。', steps: ['点击“编辑基础信息”。'], expected: ['打开编辑账户类型弹窗。', '所有字段与详情一致。'] })

for (const currency of ['USD', 'CNY', 'SGD', 'AED', 'JPY']) {
  add({ side: '管理端', module: '账户类型详情', feature: '币种折叠', control: `${currency}下拉`, title: `展开和收起${currency}收款银行信息`, precondition: '位于新加坡账户详情页。', steps: [`点击${currency}币种行展开。`, `再次点击${currency}币种行收起。`], expected: ['展开时展示该币种收款银行信息和中转银行信息。', '再次点击后内容收起。', '不修改任何配置。'], priority: 'P2' })
}

add({ side: '管理端', module: '收款银行配置', feature: '快捷入口', control: '银行配置', title: '从列表直达银行配置页', priority: 'P0', precondition: '位于账户类型列表。', steps: ['点击新加坡账户“银行配置”。'], expected: ['页面标题为“新加坡账户 - 收款银行配置”。', '顶部展示账户类型和支持币种。', '无需先进入账户详情。'] })
add({ side: '管理端', module: '收款银行配置', feature: '返回', control: '返回账户类型列表', title: '从银行配置页返回列表', precondition: '位于银行配置页。', steps: ['点击“返回账户类型列表”。'], expected: ['返回账户类型列表。', '未编辑时数据不变。'] })
for (const currency of ['USD', 'CNY', 'SGD', 'AED', 'JPY']) {
  add({ side: '管理端', module: '收款银行配置', feature: '币种折叠', control: `${currency}下拉`, title: `银行配置页展开${currency}`, precondition: '位于新加坡账户收款银行配置页。', steps: [`点击${currency}币种行。`], expected: [`展示${currency}对应的收款银行和中转银行。`, '不展示“禁用银行”按钮。', '该币种仍只有一套收款银行配置。'], priority: 'P1' })
}
add({ side: '管理端', module: '收款银行配置', feature: '编辑弹窗', control: '编辑收款银行', title: '打开指定币种编辑收款银行弹窗', priority: 'P0', precondition: '位于新加坡账户银行配置页。', steps: ['点击 USD 行的“编辑收款银行”。'], expected: ['弹窗标题为“编辑收款银行”。', '副标题标识新加坡账户/USD。', '收款银行信息和中转银行信息正确回显。', '收款银行字段为可输入文本框。', '不展示是否默认、是否启用两个开关。'] })
add({ side: '管理端', module: '收款银行配置', feature: '字段维护', control: '保存收款银行', title: '编辑收款银行基础信息成功', priority: 'P0', precondition: '已打开某币种编辑弹窗。', data: '银行账户名称、银行名称、银行账号、银行地址、收款银行、SWIFT Code', steps: ['逐项修改收款银行信息。', '点击“保存收款银行”。'], expected: ['保存成功并关闭弹窗。', '对应币种展开区显示最新值。', '其他币种不被修改。', '记录操作人、时间及变更前后值。'] })
add({ side: '管理端', module: '收款银行配置', feature: '中转银行维护', control: '保存收款银行', title: '编辑币种中转银行成功', priority: 'P0', precondition: '已打开某币种编辑弹窗。', data: '中转银行、地区/分行、SWIFT Code、备注', steps: ['修改中转银行字段。', '点击“保存收款银行”。'], expected: ['只更新当前币种中转银行。', '其他币种中转银行不变。', '客户端后续展示读取最新系统配置。'] })
add({ side: '管理端', module: '收款银行配置', feature: '字段完整性', control: '保存收款银行', title: '新加坡账户银行字段与资料标准一致', type: '数据校验', priority: 'P0', precondition: '打开新加坡账户任一币种编辑弹窗。', data: 'Green Link Digital Bank资料', steps: ['核对页面字段名称和默认值。'], expected: ['字段包括银行账户名称、银行名称、银行账号、银行地址、收款银行、SWIFT Code。', '收款银行默认值为 Green Link Digital Bank。', '不出现资料标准之外的是否默认、是否启用按钮。'] })
add({ side: '管理端', module: '收款银行配置', feature: '币种数据', control: '币种折叠', title: 'USD中转银行信息正确', type: '数据校验', precondition: '新加坡账户银行配置已初始化。', steps: ['展开USD。'], expected: ['中转银行为 JPMORGAN CHASE BANK, N.A.。', '地区为 NEW YORK。', 'SWIFT 为 CHASUS33。'] })
add({ side: '管理端', module: '收款银行配置', feature: '币种数据', control: '币种折叠', title: 'CNY中转银行信息正确', type: '数据校验', precondition: '新加坡账户银行配置已初始化。', steps: ['展开CNY。'], expected: ['中转银行为 BANK OF CHINA LIMITED。', '地区为 SINGAPORE。', 'SWIFT 为 BKCHSGSG。', '备注说明离岸人民币代码建议。'] })
add({ side: '管理端', module: '收款银行配置', feature: '币种数据', control: '币种折叠', title: 'SGD中转银行信息正确', type: '数据校验', precondition: '新加坡账户银行配置已初始化。', steps: ['展开SGD。'], expected: ['中转银行、地区、SWIFT 可显示 N/A。', '备注说明新加坡本地转入可不填中转银行。'] })
for (const currency of ['AED', 'JPY']) {
  add({ side: '管理端', module: '收款银行配置', feature: '币种数据', control: '币种折叠', title: `${currency}中转银行信息正确`, type: '数据校验', precondition: '新加坡账户银行配置已初始化。', steps: [`展开${currency}。`], expected: ['中转银行为 JPMORGAN CHASE BANK, N.A.。', '地区为 SINGAPORE。', 'SWIFT 为 CHASSGSG。'] })
}
add({ side: '管理端', module: '收款银行配置', feature: '弹窗关闭', control: '取消/X', title: '取消编辑收款银行', precondition: '编辑收款银行弹窗已打开并修改字段。', steps: ['分别点击“取消”和右上角关闭图标。'], expected: ['弹窗关闭。', '修改不保存。', '重新打开仍显示原值。'] })
add({ side: '管理端', module: '收款银行配置', feature: '并发编辑', control: '保存收款银行', title: '两名运营并发编辑同一币种银行', type: '并发', priority: 'P1', precondition: '运营A和B同时打开新加坡账户USD编辑弹窗。', steps: ['运营A保存修改。', '运营B基于旧数据保存另一修改。'], expected: ['系统检测版本冲突或明确采用最后写入策略。', '不得静默覆盖且无审计记录。', '最终值完整，不产生字段部分丢失。'] })
add({ side: '管理端', module: '收款银行配置', feature: '权限', control: '编辑收款银行', title: '无配置权限账号只能查看银行信息', type: '权限', priority: 'P0', precondition: '账号仅有账户类型查看权限。', steps: ['进入银行配置页。'], expected: ['可展开查看信息。', '不展示或禁用“编辑收款银行”。', '接口拒绝保存请求。'] })

// 跨端状态、数据一致性、审计与安全。
const crossCases = [
  ['客户端提交后跨端状态一致', '客户端扣费并提交成功。', ['刷新客户端和管理端。'], ['客户端显示审核中。', '开户审核列表新增待处理/审核中记录。', '用户管理展示待处理或审核中且按钮为查看申请。']],
  ['管理端确认开户后跨端状态一致', '申请已确认开户，用户实际账户信息已配置。', ['刷新客户端、审核列表和用户管理。'], ['客户端显示已开户并展示账户。', '审核列表显示已开户且无开始处理。', '用户管理显示已开户、账户号码和收款人。']],
  ['管理端拒绝后跨端状态一致', '申请已拒绝。', ['刷新客户端、审核列表和用户管理。'], ['客户端显示已拒绝并可重新申请。', '审核详情显示红色只读拒绝原因。', '用户管理显示已拒绝且操作为查看申请。']],
  ['账户类型禁用不隐藏已开户账户', '用户已开户；随后禁用新加坡账户类型。', ['刷新客户端和用户管理。'], ['已开户账户、余额和历史记录仍可见。', '未开户用户无法新申请。', '后续操作按业务开关限制并给出明确提示。']],
  ['用户实际配置优先于系统默认收款人和账号', '系统模板收款人/账号与用户实际配置不同。', ['查看用户管理和客户端最终收款信息。'], ['收款人和账户号码取用户实际配置。', '银行名称、地址、收款银行、SWIFT和币种取系统配置。']],
  ['历史记录保存配置快照', '修改系统银行配置前已有入金或开户记录。', ['修改系统配置。', '查看历史记录和新业务页面。'], ['历史记录保留发生时的银行信息快照。', '新业务读取新配置。']],
  ['客户端新加坡账户转入跨端一致', '客户端已提交一笔新加坡账户SGD转入申请。', ['查看客户端交易详情、管理端入账认领和流水查询。', '管理端完成入账。', '刷新客户端余额。'], ['三处交易编号、客户、账户类型、币种和金额一致。', '入账前仅增加在途余额，入账后增加可用余额。', '同一笔入金不得重复认领。']],
  ['客户端新加坡账户转出跨端一致', '客户端已提交一笔新加坡账户AED转出申请。', ['查看客户端记录和管理端出金审批。', '管理端审核通过。', '刷新客户端余额及交易状态。'], ['两端申请编号、账户、币种、金额、服务费和实际到账一致。', '提交时冻结资金，审核通过后完成扣减。', '不得重复审核或重复扣款。']],
  ['管理端手动入金后客户端数据一致', '运营已对客户新加坡账户JPY执行手动入金。', ['查看管理端流水和客户资产。', '刷新客户端新加坡账户余额及交易记录。'], ['管理端和客户端展示同一条入金记录。', 'JPY余额仅增加一次且金额一致。', '记录来源标识为后台手动入金。']],
  ['管理端手动出金后客户端数据一致', '运营已对客户新加坡账户CNY执行手动出金。', ['查看管理端流水和客户资产。', '刷新客户端新加坡账户余额及交易记录。'], ['管理端和客户端展示同一条出金记录。', 'CNY余额仅扣减一次且金额一致。', '记录来源标识为后台手动出金。']],
  ['敏感操作写入审计日志', '运营执行开户、拒绝、手动开通、编辑账户或编辑银行。', ['完成操作。', '查询审计日志。'], ['记录操作人、角色、时间、用户ID、申请ID、动作、结果和字段变更前后值。', '日志不可由普通运营删除或修改。']],
  ['页面刷新和重复登录数据持久化', '已完成任一状态或配置修改。', ['刷新页面。', '退出并重新登录。'], ['数据从服务端恢复，不回退到演示初始值。', '状态与其他端一致。']],
  ['输入内容防XSS', '运营可编辑收款人、账户号码、银行字段或备注。', ['输入<script>alert(1)</script>及HTML标签并保存。', '重新打开相关页面。'], ['内容被安全转义显示。', '不执行脚本，不破坏页面。']],
  ['超长和特殊字符处理', '打开可编辑字段。', ['输入超长文本、换行、中文、英文、符号。', '保存。'], ['按字段规则限制长度并提示。', '合法国际银行字符可保存。', '列表和弹窗不溢出。']],
]
for (const [title, precondition, steps, expected] of crossCases) {
  add({ side: '跨端', module: '状态与数据一致性', feature: '端到端', control: '-', title, type: title.includes('XSS') ? '安全' : '集成', priority: title.includes('一致') || title.includes('优先') ? 'P0' : 'P1', precondition, steps, expected })
}

const stateRows = [
  ['未开通', '客户端点击立即申请并扣费成功', '待处理/审核中', '客户端申请', '生成扣费流水和申请；不得重复申请'],
  ['未开通', '运营点击开通新加坡账户并确认', '已开户', '后台手动开通', '不经过审核，不扣开户费'],
  ['待处理', '运营点击开始处理', '审核中', '客户申请', '记录处理人并防并发'],
  ['待处理/审核中', '运营确认开户', '已开户', '客户申请', '详情只读，列表不显示开始处理'],
  ['待处理/审核中', '运营确认拒绝', '已拒绝', '客户申请', '拒绝原因必填并退款'],
  ['已拒绝', '客户重新申请并扣费成功', '待处理/审核中', '客户申请', '新申请号，保留历史'],
  ['已开户', '运营编辑收款人/账户号码', '已开户', '来源保持不变', '只改用户实例，不改系统银行模板'],
  ['已开户', '账户类型被禁用', '已开户', '来源保持不变', '历史资产和记录仍展示'],
]

const buttonRows = [
  ['开户审核列表', '搜索框', '按客户名称/用户ID搜索', '各状态', '应可用', '当前原型未绑定'],
  ['开户审核列表', '账户类型下拉', '全部账户/美国账户/新加坡账户筛选', '各状态', '应可用', '已绑定'],
  ['开户审核列表', '状态下拉', '全部/待处理/审核中/已开户/已拒绝筛选', '各状态', '应可用', '已绑定'],
  ['开户审核列表', '查看详情', '进入只读详情', '全部状态', '展示', '已绑定'],
  ['开户审核列表', '开始处理', '进入处理模式', '待处理/审核中', '展示', '已绑定'],
  ['开户审核列表', '开始处理', '禁止重复处理终态', '已开户/已拒绝', '不展示', '已实现'],
  ['审核详情', '返回开户审核', '返回列表', '全部状态', '展示', '已绑定'],
  ['审核详情', '查看客户完整资料', '查看客户档案', '全部状态', '展示', '当前原型未绑定'],
  ['审核详情', '配置账户', '跳转用户管理维护实际账户', '待处理', '展示', '已绑定跳转'],
  ['审核详情', '确认开户', '打开二次确认', '待处理/审核中', '满足扣费条件后可用', '已绑定'],
  ['确认开户弹窗', '取消/X', '关闭弹窗', '待处理/审核中', '展示', '已绑定'],
  ['确认开户弹窗', '确认开户', '完成开户', '待处理/审核中', '展示', '已绑定'],
  ['审核详情', '确认拒绝', '拒绝申请', '待处理/审核中且原因非空', '展示', '已绑定'],
  ['审核详情', '确认拒绝', '终态不得再拒绝', '已拒绝', '不展示', '已实现'],
  ['用户管理', '查看', '查看用户详情', '全部状态', '展示', '当前原型未绑定'],
  ['用户管理', '编辑', '编辑用户基础资料', '全部状态', '展示', '当前原型未绑定'],
  ['用户管理', '开通新加坡账户', '后台手动开通', '未开通', '展示', '已绑定'],
  ['用户管理', '查看申请', '进入申请详情', '待处理/审核中/已拒绝', '展示', '已绑定'],
  ['用户管理', '编辑新加坡账户', '编辑收款人和账号', '已开户', '展示', '已绑定'],
  ['开通/编辑弹窗', '取消/X', '关闭且不保存', '未开通/已开户', '展示', '已绑定'],
  ['开通/编辑弹窗', '确认开通/保存', '保存用户实际账户信息', '未开通/已开户', '必填通过后可用', '已绑定'],
  ['法币资产总览', '手动入金', '打开手动入金抽屉', '有手动入金权限', '展示', '已绑定'],
  ['手动入金抽屉', '选择账户', '选择客户的新加坡账户', '客户已开户', '展示', '需校验账户归属及状态'],
  ['手动入金抽屉', '币种', '选择USD/CNY/SGD/AED/JPY', '新加坡账户', '展示', '币种来自账户类型配置'],
  ['手动入金抽屉', '上传凭证（可选）', '上传或移除凭证', '抽屉打开', '展示', '可选'],
  ['手动入金抽屉', '取消/X', '关闭且不入账', '抽屉打开', '展示', '需清空未提交数据'],
  ['手动入金抽屉', '确认入金', '直接增加账户余额并生成流水', '必填及权限校验通过', '展示', '需幂等'],
  ['法币资产总览', '手动出金', '打开手动出金抽屉', '有手动出金权限', '展示', '已绑定'],
  ['手动出金抽屉', '选择账户', '选择客户的新加坡账户', '客户已开户', '展示', '需校验账户归属及状态'],
  ['手动出金抽屉', '币种', '选择USD/CNY/SGD/AED/JPY', '新加坡账户', '展示', '币种来自账户类型配置'],
  ['手动出金抽屉', '银行账号', '选择当前客户收款银行账号', '客户和账户已选择', '展示', '需校验账号归属'],
  ['手动出金抽屉', '上传凭证（可选）', '上传或移除凭证', '抽屉打开', '展示', '可选'],
  ['手动出金抽屉', '取消/X', '关闭且不扣款', '抽屉打开', '展示', '需清空未提交数据'],
  ['手动出金抽屉', '确认出金', '直接扣减账户余额并生成流水', '必填、余额及权限校验通过', '展示', '需幂等'],
  ['账户类型列表', '新增账户类型', '新增配置', '有编辑权限', '展示', '已绑定'],
  ['账户类型列表', '重置', '清空筛选', '全部', '展示', '已绑定'],
  ['账户类型列表', '详情', '进入详情', '全部', '展示', '已绑定'],
  ['账户类型列表', '银行配置', '直达银行配置', '全部', '展示', '已绑定'],
  ['账户类型列表', '编辑', '编辑基础信息和币种', '全部', '展示', '已绑定'],
  ['账户类型列表', '禁用/启用', '切换账户类型状态', '启用/禁用', '展示', '已绑定'],
  ['账户类型弹窗', '币种支持开关', '开启或关闭账户支持币种', '新增/编辑', '逐币种展示', '关闭后保留手续费'],
  ['账户类型弹窗', '手续费输入框', '配置券商互转固定手续费', '币种开启', '启用', '手续费币种与互转币种一致'],
  ['账户类型弹窗', '取消/X', '关闭且不保存', '新增/编辑', '展示', '已绑定'],
  ['账户类型弹窗', '保存配置', '新增或更新账户类型', '新增/编辑', '校验通过后可用', '已绑定'],
  ['账户类型详情', '返回账户类型列表', '返回列表', '全部', '展示', '已绑定'],
  ['账户类型详情', '编辑基础信息', '打开编辑弹窗', '全部', '展示', '已绑定'],
  ['账户类型详情', '币种下拉', '展开/收起银行信息', '全部币种', '展示', '已绑定'],
  ['银行配置页', '返回账户类型列表', '返回列表', '全部', '展示', '已绑定'],
  ['银行配置页', '币种下拉', '展开/收起银行信息', '全部币种', '展示', '已绑定'],
  ['银行配置页', '编辑收款银行', '打开编辑弹窗', '全部币种', '展示', '已绑定'],
  ['编辑收款银行弹窗', '取消/X', '关闭且不保存', '全部币种', '展示', '已绑定'],
  ['编辑收款银行弹窗', '保存收款银行', '保存基础和中转银行', '全部币种', '展示', '已绑定'],
]

function csvEscape(value) {
  const stringValue = value == null ? '' : String(value)
  return `"${stringValue.replaceAll('"', '""')}"`
}

function writeCsv(filename, rows) {
  const headers = Object.keys(rows[0] || {})
  const content = [
    headers.map(csvEscape).join(','),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
  ].join('\r\n')
  const targetPath = path.join(outputDir, filename)
  try {
    fs.writeFileSync(targetPath, `\uFEFF${content}`, 'utf8')
    return filename
  } catch (error) {
    if (error?.code !== 'EBUSY') throw error
    const extension = path.extname(filename)
    const fallbackName = `${path.basename(filename, extension)}-更新版${extension}`
    fs.writeFileSync(path.join(outputDir, fallbackName), `\uFEFF${content}`, 'utf8')
    console.warn(`${filename} 正被占用，已生成 ${fallbackName}`)
    return fallbackName
  }
}

const detailedCasesFilename = writeCsv('01-详细测试用例.csv', cases)
writeCsv('02-状态转换矩阵.csv', stateRows.map(([当前状态, 触发动作, 目标状态, 开户来源, 核心校验]) => ({ 当前状态, 触发动作, 目标状态, 开户来源, 核心校验 })))
writeCsv('03-管理端按钮覆盖清单.csv', buttonRows.map(([页面, 按钮或控件, 功能, 适用状态, 展示或可用规则, 当前原型备注]) => ({ 页面, 按钮或控件, 功能, 适用状态, 展示或可用规则, 当前原型备注 })))

const counts = cases.reduce((result, item) => {
  result[item.端] = (result[item.端] || 0) + 1
  return result
}, {})

const readme = `# 新加坡账户开户测试包

生成日期：2026-07-20

## 文件说明

- \`${detailedCasesFilename}\`：${cases.length} 条可执行用例，包含客户端开户、法币转入/转出、开户审核、用户管理、管理端手动入金/出金、账户类型/银行配置和跨端一致性。
- \`02-状态转换矩阵.csv\`：客户端申请、后台手动开通、审核通过、拒绝和重新申请的状态流。
- \`03-管理端按钮覆盖清单.csv\`：管理端所有相关按钮/控件的逐项覆盖清单。

## 用例数量

${Object.entries(counts).map(([side, count]) => `- ${side}：${count} 条`).join('\n')}

## 核心业务口径

1. 新加坡账户固定支持 USD、CNY、SGD、AED、JPY，用户维度不可增删币种。
2. 客户端申请需扣除 USD 1,000 开户费；扣费成功后才生成有效审核申请。
3. 用户管理状态使用：未开通、待处理、审核中、已开户、已拒绝。
4. 仅未开通状态可由后台手动开通；待处理、审核中和已拒绝进入“查看申请”；已开户可编辑新加坡账户。
5. 后台手动开通不进入客户端申请审核流程，也不产生开户费扣款。
6. 用户维度只维护收款人和账户号码；银行名称、地址、收款银行、SWIFT、支持币种及中转行读取系统配置。
7. 同一用户同一时间只能存在一个有效新加坡账户或有效申请。
8. 已开户和已拒绝为审核终态，不展示“开始处理”；已拒绝原因以红色只读文本展示。
9. 账户类型按币种维护转入券商固定手续费；0 表示免手续费，关闭币种保留原手续费，IBKR 与 Webull 共用同一规则。
10. 已开户用户可在客户端选择新加坡账户进行法币转入、转出，币种固定为 USD/CNY/SGD/AED/JPY；未开户用户不可选择或绕过页面提交。
11. 管理端手动入金、手动出金支持新加坡账户及其固定币种，并必须校验客户账户归属、账户状态、余额、权限和请求幂等。

## 执行说明

- CSV 已写入 UTF-8 BOM，可直接用 Excel 打开。
- “当前原型备注”标出已发现但尚未绑定交互的按钮/搜索框；测试环境执行时应按预期判定并记录缺陷。
- P0 建议先执行：扣费幂等、重复开户防护、审核终态、退款、权限、跨端状态一致性。
`

fs.writeFileSync(path.join(outputDir, 'README.md'), readme, 'utf8')

console.log(`Generated ${cases.length} cases in ${outputDir}`)
