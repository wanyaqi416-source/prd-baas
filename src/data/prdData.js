export const navItems = [
  ['overview', '产品总览'],
  ['principles', '核心原则'],
  ['architecture', '系统架构'],
  ['mvp-scope', 'MVP 范围'],
  ['business-flows', '核心业务流程'],
  ['us-account-opening', '美国账户开户'],
  ['balance-model', '余额模型'],
  ['transfer-in', '转入'],
  ['transfer-out', '转出'],
  ['incoming-review', '入账审核'],
  ['beneficiary', '收款人'],
  ['visibility', '可见范围'],
  ['interactive-demos', '交互式演示'],
  ['data-models', '数据模型'],
  ['state-machines', '状态机'],
  ['api-webhooks', 'API / Webhook'],
  ['audit-logs', '审计日志'],
  ['exceptions', '异常处理'],
  ['out-of-scope', '一期不做事项'],
  ['developer-notes', '开发注意事项'],
]

export const guardrails = [
  ['后台只有 Admin', 'MVP 不需要复杂权限设计，不拆分多角色后台。'],
  ['MVP 不自动开户', 'Interlace 开户由 Admin 在外部 BaaS 后台手动完成。'],
  ['只做 PRD 手册', '本项目不接真实 API、不写数据库、不引入后端逻辑。'],
  ['客户不可见真实余额', 'Client Portal 不展示 Interlace actual balance。'],
  ['客户只看 Fidere 可用余额', '客户看到的是 client_available_balance 和业务状态。'],
  ['成本只后台可见', 'Interlace fee、OTC cost、Fidere margin 均为 Admin only。'],
  ['USDT 地址不可见', 'BaaS USDT 地址只能作为 INTERNAL_EXECUTION_ONLY。'],
  ['Internal Funding 不是充值', 'Internal USDT Funding 不进入客户可见余额。'],
  ['账户信息需复核', 'Interlace 返回的银行账户信息必须 Admin 确认后才展示。'],
]

export const phaseComparison = [
  ['账户开户 / Account Opening', '客户申请、500 USD 开户费、Admin 手动 Interlace 开户、绑定 accountId。', '自动调用 Interlace 开户接口。'],
  ['余额展示 / Balance Display', '客户只看 Fidere client_available_balance。', '自动同步余额和差异解释。'],
  ['收款人 / Beneficiary', '客户维护 Fidere Beneficiary，Admin 手动录入 BaaS Payee。', '自动创建或同步 BaaS Payee。'],
  ['转账 / Transfer', 'Admin 手动在 BaaS 执行 payout。', '自动 payout 和 webhook 状态更新。'],
  ['外部入账 / Incoming Deposit', '检测后显示“审核中”，Admin 审核后入账。', '自动匹配和审核辅助。'],
  ['费用 / Fee', '基础开户费和转出手续费。', '配置化 Fee Engine。'],
  ['对账 / Reconciliation', '人工差异解释。', '自动对账和异常中心。'],
  ['自动化 / Automation', '半自动 MVP。', '逐步自动化，但客户仍不看底层成本。'],
]

export const userStories = [
  {
    title: '客户申请美国账户',
    body: '客户在 Fidere 系统申请美国账户并确认 500 USD 开户费。系统记录扣费状态和开户申请，Admin 手动在 Interlace 开户并绑定 accountId，复核账户信息后客户状态变为 Completed。',
  },
  {
    title: 'Admin 手动开户与绑定',
    body: 'Admin 在 Interlace / BaaS 外部后台手动开户，拿到账户信息后回到 Fidere 系统绑定 Interlace accountId，并记录 adminRemark 与 audit log。',
  },
  {
    title: '客户查看美国账户状态',
    body: '客户只能看到开户状态、已确认展示的银行账户信息和 Fidere 计算后的余额，不看到 Interlace actual balance、成本、USDT 地址或 raw response。',
  },
  {
    title: '技术团队实现边界',
    body: '系统只负责申请、扣费状态、绑定 Interlace accountId、展示账户信息和状态管理；MVP 不自动开户、不自动 payout、不做复杂 RBAC。',
  },
]

export const openingFlowNodes = [
  {
    id: 'apply',
    position: { x: 0, y: 0 },
    data: {
      label: '客户选择开设美国账户',
      detail: {
        description: '客户在 Client Portal 点击开设美国账户。',
        systems: ['Client Portal'],
        inputs: ['userId', 'trustClientId'],
        outputs: ['application draft'],
        statusChange: 'Draft',
        exceptions: ['客户未完成 KYC 或信托账户不可用时不允许继续。'],
        devNotes: ['仅创建页面内状态或未来 application draft，不调用 Interlace。'],
      },
    },
  },
  {
    id: 'fee',
    position: { x: 280, y: 0 },
    data: {
      label: '系统生成 500 USD 开户费',
      detail: {
        description: '系统展示固定开户费 500 USD。',
        systems: ['Fidere Trust Core'],
        inputs: ['applicationId', 'openingFeeAmount'],
        outputs: ['payment intent placeholder', 'opening fee display'],
        statusChange: 'Pending Payment',
        exceptions: ['信托账户余额不足时显示待充值或联系 Admin。'],
        devNotes: ['演示数据：未来接入台账时生成 US_ACCOUNT_OPENING_FEE。'],
      },
    },
  },
  {
    id: 'pay',
    position: { x: 560, y: 0 },
    data: {
      label: '客户确认并扣款',
      detail: {
        description: '客户确认 500 USD 开户费，系统记录 paymentStatus。',
        systems: ['Client Portal', 'Fidere Ledger'],
        inputs: ['openingFeeAmount', 'trustClientId'],
        outputs: ['paymentStatus=Payment Success'],
        statusChange: 'Payment Success',
        exceptions: ['扣款失败时进入 Pending Payment 或 Failed。'],
        devNotes: ['MVP 仅记录扣费状态，真实扣款逻辑未来接入 ledger service。'],
      },
    },
  },
  {
    id: 'request',
    position: { x: 840, y: 0 },
    data: {
      label: '后台生成开户请求',
      detail: {
        description: '系统把成功扣费的申请推送到 Admin Console。',
        systems: ['Admin Console'],
        inputs: ['applicationId', 'paymentStatus'],
        outputs: ['openingStatus=Awaiting Manual Opening'],
        statusChange: 'Awaiting Manual Opening',
        exceptions: ['缺少客户资料时进入异常队列。'],
        devNotes: ['写 audit_logs: opening_request_created。'],
      },
    },
  },
  {
    id: 'admin',
    position: { x: 0, y: 180 },
    data: {
      label: 'Admin 查看请求',
      detail: {
        description: 'Admin 查看申请、扣费状态、客户资料和备注。',
        systems: ['Admin Console'],
        inputs: ['applicationId', 'trustClientId'],
        outputs: ['admin review decision'],
        statusChange: 'Awaiting Manual Opening',
        exceptions: ['资料不完整可 Rejected。'],
        devNotes: ['后台只有一个 Admin 角色，不做复杂 RBAC。'],
      },
    },
  },
  {
    id: 'interlace',
    position: { x: 280, y: 180 },
    data: {
      label: 'Admin 在 Interlace BaaS 手动开户',
      detail: {
        description: 'Admin 离开 Fidere 系统，在 Interlace / BaaS 后台手动开户。',
        systems: ['Interlace / BaaS', 'Admin Console'],
        inputs: ['client identity info', 'trust account info'],
        outputs: ['Interlace account record'],
        statusChange: 'Account Created In Interlace',
        exceptions: ['Interlace 拒绝开户、资料校验失败、人工处理超时。'],
        devNotes: ['MVP 不自动开户，不调用真实 Interlace API。'],
      },
    },
  },
  {
    id: 'return',
    position: { x: 560, y: 180 },
    data: {
      label: 'Interlace 返回账户信息',
      detail: {
        description: 'Interlace 返回 account holder、bank name、routing number、account number 等。',
        systems: ['Interlace / BaaS'],
        inputs: ['interlaceAccountId'],
        outputs: ['bank account information'],
        statusChange: 'Binding Required',
        exceptions: ['返回字段缺失时不可展示给客户。'],
        devNotes: ['字段可读取，但是否落库需按字段映射表区分。'],
      },
    },
  },
  {
    id: 'bind',
    position: { x: 840, y: 180 },
    data: {
      label: 'Admin 绑定 Interlace accountId',
      detail: {
        description: 'Admin 在 Fidere 系统录入并绑定 Interlace accountId。',
        systems: ['Admin Console', 'Fidere Trust Core'],
        inputs: ['interlaceAccountId', 'adminRemark'],
        outputs: ['us_accounts binding'],
        statusChange: 'Binding Required → Completed candidate',
        exceptions: ['accountId 重复、格式错误或客户不匹配。'],
        devNotes: ['写 audit_logs: interlace_account_bound。'],
      },
    },
  },
  {
    id: 'show',
    position: { x: 1120, y: 180 },
    data: {
      label: '系统展示美国账户信息给客户',
      detail: {
        description: 'Admin 确认后，客户可看到银行账户信息和开户状态。',
        systems: ['Client Portal', 'Fidere Trust Core'],
        inputs: ['confirmed account fields'],
        outputs: ['client visible account profile'],
        statusChange: 'Completed',
        exceptions: ['未确认字段不得客户可见。'],
        devNotes: ['Client API 不返回 raw_response、Interlace actual balance 或成本字段。'],
      },
    },
  },
  {
    id: 'done',
    position: { x: 1400, y: 180 },
    data: {
      label: '流程完成',
      detail: {
        description: '美国账户开户流程完成。',
        systems: ['Client Portal', 'Admin Console'],
        inputs: ['accountStatus'],
        outputs: ['Completed status'],
        statusChange: 'Completed',
        exceptions: ['失败或拒绝时进入 Failed / Rejected。'],
        devNotes: ['所有关键 Admin 操作必须写 audit_logs。'],
      },
    },
  },
]

export const openingFlowEdges = [
  ['apply', 'fee'],
  ['fee', 'pay'],
  ['pay', 'request'],
  ['request', 'admin'],
  ['admin', 'interlace'],
  ['interlace', 'return'],
  ['return', 'bind'],
  ['bind', 'show'],
  ['show', 'done'],
].map(([source, target]) => ({
  id: `${source}-${target}`,
  source,
  target,
  animated: true,
}))

export const openingStatuses = [
  'Draft',
  'Pending Payment',
  'Payment Success',
  'Awaiting Manual Opening',
  'Account Created In Interlace',
  'Binding Required',
  'Completed',
  'Failed',
  'Rejected',
]

export const openingDemoSteps = [
  {
    status: 'Draft',
    client: ['可点击申请美国账户', '未扣 500 USD', '账户信息不可见'],
    admin: ['无待处理申请'],
    technical: ['applicationId 尚未生成', '无 ledger entry'],
  },
  {
    status: 'Pending Payment',
    client: ['显示 500 USD 开户费', '等待客户确认'],
    admin: ['仍不可处理开户'],
    technical: ['openingFeeAmount=500', 'paymentStatus=pending'],
  },
  {
    status: 'Payment Success',
    client: ['开户费已扣', '申请已提交'],
    admin: ['可看到扣费成功的申请'],
    technical: ['create US_ACCOUNT_OPENING_FEE', 'write audit_log'],
  },
  {
    status: 'Awaiting Manual Opening',
    client: ['状态：开户处理中'],
    admin: ['需要登录 Interlace 手动开户'],
    technical: ['openingStatus=Awaiting Manual Opening'],
  },
  {
    status: 'Account Created In Interlace',
    client: ['状态仍为处理中', '账户信息不可见'],
    admin: ['Interlace 已生成账户，等待绑定'],
    technical: ['Interlace account exists outside Fidere'],
  },
  {
    status: 'Binding Required',
    client: ['状态：账户待复核'],
    admin: ['录入 interlaceAccountId', '复核银行账户信息'],
    technical: ['interlaceAccountId=itl_demo_001', 'adminRemark required'],
  },
  {
    status: 'Completed',
    client: ['状态：Completed', '可见银行账户信息', '不可见 Interlace actual balance'],
    admin: ['开户完成，可进入对账视图'],
    technical: ['accountStatus=active', 'write audit_log: completed'],
  },
]

export const openingFeeConfig = {
  feeType: 'US_ACCOUNT_OPENING_FEE',
  defaultAmount: 500,
  currency: 'USD',
  configurable: true,
  description: '美国账户开户一次性服务费用。默认金额为 USD 500，后续可由后台根据账户类型、客户类型或服务方案调整。',
  clientNotice: '客户提交美国账户开户申请前，应清晰看到开户费用、币种、费用性质和确认动作。文案应保持金融机构风格，避免使用电商化表达。',
}

export const openingFeeStatuses = [
  ['PENDING_PAYMENT', '待支付', '客户尚未确认或费用尚未入账。'],
  ['PAID', '已支付', '开户费用已确认，可进入后台手动开户流程。'],
  ['WAIVED', '豁免', 'Admin 根据业务规则手动豁免费用。'],
  ['FAILED', '失败', '扣费或确认失败，需要重新处理。'],
  ['REFUNDING', '退款中', '费用正在退款处理中。'],
  ['REFUNDED', '已退款', '开户费用已退回。'],
]

export const openingFeeRecordFields = [
  ['fee_type', '费用类型', 'US_ACCOUNT_OPENING_FEE'],
  ['amount', '金额', '500'],
  ['currency', '币种', 'USD'],
  ['account_type', '账户类型', 'US_ACCOUNT'],
  ['client_id', '客户 ID', 'client_id'],
  ['application_id', '申请 ID', 'application_id'],
  ['payment_status', '支付状态', 'PENDING_PAYMENT / PAID / WAIVED / FAILED / REFUNDING / REFUNDED'],
  ['created_at', '创建时间', 'ISO datetime'],
]

export const openingFeeAdminActions = [
  '查看开户费用记录',
  '核对费用金额、币种、账户类型和客户申请',
  '手动标记为已支付',
  '手动标记为豁免',
  '查看失败、退款中、已退款状态',
  '所有费用状态变更必须写入 audit_logs',
]

export const fieldMappings = [
  ['userId', '当前登录用户 ID', 'Persist', 'Client/Admin', '来自 Fidere 用户系统。'],
  ['trustClientId', '信托客户 ID', 'Persist', 'Admin', '绑定客户与信托账户。'],
  ['applicationId', '开户申请 ID', 'Persist', 'Client/Admin', '申请主键。'],
  ['openingFeeAmount', '开户费金额', 'Persist', 'Client/Admin', 'MVP 固定 500 USD。'],
  ['openingFeeCurrency', '开户费币种', 'Persist', 'Client/Admin', '默认 USD。'],
  ['openingFeeType', '开户费用类型', 'Persist', 'Client/Admin', '默认 US_ACCOUNT_OPENING_FEE。'],
  ['paymentStatus', '扣费状态', 'Persist', 'Client/Admin', 'pending / success / failed。'],
  ['openingStatus', '开户状态', 'Persist', 'Client/Admin', '见状态机。'],
  ['interlaceAccountId', 'Interlace 账户 ID', 'Persist', '仅后台可见', '客户不可见。'],
  ['accountHolderName', '账户名称', 'Persist after review', 'Client/Admin', '复核后可展示。'],
  ['bankName', '银行名称', 'Persist after review', 'Client/Admin', '复核后可展示。'],
  ['routingNumber', 'Routing Number', 'Persist after review', 'Client/Admin', '复核后可展示。'],
  ['accountNumber', '账户号码', 'Persist after review', 'Client/Admin', '敏感字段，展示可考虑脱敏。'],
  ['accountStatus', '账户状态', 'Persist', 'Client/Admin', 'active / pending / closed。'],
  ['adminRemark', '后台备注', 'Persist', '仅后台可见', '客户不可见。'],
  ['createdAt', '创建时间', 'Persist', 'Admin', '审计和列表排序。'],
  ['updatedAt', '更新时间', 'Persist', 'Admin', '状态变更追踪。'],
]

export const mockApplication = {
  label: '演示数据',
  userId: 'user_demo_001',
  trustClientId: 'trust_client_demo_001',
  applicationId: 'us_app_demo_20260520',
  openingFeeAmount: 500,
  interlaceAccountId: 'itl_acct_demo_001',
  accountHolderName: 'Fidere Trust Client Demo',
  bankName: 'Demo US Banking Partner',
  routingNumber: '021000000',
  accountNumber: '****4321',
  accountStatus: 'Completed',
  adminRemark: 'Demo only. No real Interlace API is connected.',
}

export const stateRows = [
  ['Draft', '客户尚未确认开户费', 'Client Portal', '可进入 Pending Payment'],
  ['Pending Payment', '等待 500 USD 开户费确认', 'Client Portal / Ledger', '成功后 Payment Success，失败可 Failed'],
  ['Payment Success', '开户费已扣款', 'System', '生成后台开户请求'],
  ['Awaiting Manual Opening', '等待 Admin 手动开户', 'Admin Console', 'Admin 在 Interlace 开户'],
  ['Account Created In Interlace', 'Interlace 已创建账户', 'Interlace / Admin', '等待绑定 accountId'],
  ['Binding Required', '需要绑定 Interlace accountId', 'Admin Console', '复核后 Completed'],
  ['Completed', '开户完成', 'Client/Admin', '客户可见账户信息'],
  ['Failed', '流程失败', 'System/Admin', '需记录失败原因'],
  ['Rejected', '申请拒绝', 'Admin', '客户可见拒绝状态'],
]

export const exceptionItems = [
  {
    title: 'Interlace 返回字段不完整',
    content: '不得展示给客户。Admin 需要补充或重新同步，状态停留在 Binding Required 或 Account Info Review。',
  },
  {
    title: '客户开户费扣款失败',
    content: '状态回到 Pending Payment 或 Failed，不生成 Awaiting Manual Opening。需要保留失败审计记录。',
  },
  {
    title: 'Interlace accountId 重复',
    content: '阻止绑定并提示 Admin 检查客户映射，避免把底层账户绑定到错误客户。',
  },
  {
    title: '客户请求查看底层余额或 USDT 地址',
    content: '产品和 API 都必须拒绝展示。客户只看 Fidere client_available_balance，不看 Interlace actual balance 或 BaaS USDT 地址。',
  },
]

export const developerNotes = [
  '所有数据均为演示数据，不代表真实接口数据。',
  '本项目不调用真实 Interlace API，不新增 webhook 处理逻辑。',
  'MVP 阶段不自动开户，Admin 手动在 Interlace / BaaS 完成。',
  '后台只有一个 Admin 角色，不做复杂 RBAC。',
  'Client API 未来接入时不得返回 Interlace actual balance、USDT address、OTC cost、Interlace fee、Fidere margin。',
  'Interlace 返回的银行账户信息可以读取并展示，但字段是否落库必须按字段映射表评审。',
]

export const transferGuardrails = [
  '客户只能在 Fidere Trust 系统内操作转入 / 转出。',
  '客户不能登录 Interlace / BaaS。',
  '客户不能看到 Interlace actual balance。',
  '客户看到的是 Fidere 计算后的 client_available_balance。',
  '信托资金转入美国账户只支持同币种转入，不涉及换汇、数字货币兑换或 OTC。',
  '客户不能看到 BaaS USDT 地址、Internal USDT Funding、OTC 成本、Interlace fee、Fidere margin。',
  'Internal USDT Funding 不是客户充值。',
  '外部法币入账必须 Admin 审核通过后，才进入客户可用余额。',
  '后台只有 Admin 一个角色，不做复杂 RBAC。',
  '所有关键 Admin 操作必须写入 audit_logs。',
]

export const transferModules = [
  {
    title: '转入 A：外部法币入账',
    type: 'Transfer In',
    summary: '外部付款人向客户美国账户汇入法币。Interlace 检测到账后，Fidere 创建 incoming_fiat_deposit；客户可看到 Under Review，但 Admin approve 前不能进入 client_available_balance。',
    flow: ['外部付款人汇入法币', 'Interlace 检测到入账', 'Fidere 生成 incoming_fiat_deposit 入账记录', '系统匹配美国账户与客户', '客户看到“审核中”', 'Admin 审核付款人、金额和用途', 'Admin 审核通过', '系统计入 client_available_balance', '客户看到“已审核 / 可用”'],
    clientVisible: ['入账金额', '币种', '付款人名称，如可取得', '入账时间', '状态：Under Review / Approved / Rejected', '审核通过后的可用余额变化'],
    clientHidden: ['Interlace raw response', 'Interlace internal transaction fee', 'Admin 审核备注中的内部敏感信息', 'Interlace actual balance', '内部对账差异'],
    adminVisible: ['Interlace transaction ID', 'payer_name', 'payer_bank', 'amount', 'currency', 'received_at', 'matched client', 'matched us_account', 'raw_response', 'review action', 'ledger posting result', 'audit logs'],
    status: ['DETECTED', 'MATCHED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'POSTED_TO_CLIENT_BALANCE'],
    balanceImpact: ['Under Review：pending_incoming_balance 增加，client_available_balance 不变。', 'Approved / Posted：pending_incoming_balance 减少，client_available_balance 增加。'],
  },
  {
    title: '转入 B：信托资金转入美国账户',
    type: 'Transfer In',
    summary: '客户从信托账户以同币种转入美国账户，用于后续汇款或账户显示。该流程不涉及换汇、数字货币兑换或 OTC，后台只进行同币种余额校验、资金冻结、审核确认和账务入账。',
    flow: ['客户选择从信托账户转入美国账户', '客户输入转入金额', '系统校验来源币种与美国账户币种一致', '系统生成 transfer-in 订单', '系统冻结信托账户同币种资金', '客户看到“处理中”', 'Admin 确认信托账户资金和同币种规则', 'Admin 审核并确认转入完成', '系统更新 client_available_balance 或 pending_transfer_in_balance', '客户看到“已完成 / 可用”'],
    clientVisible: ['转入金额', '币种', '来源：信托账户', '目标：美国账户', '状态：Processing / Completed / Failed', '完成后的美国账户可用余额变化'],
    clientHidden: ['后台审核备注', '内部账务校验记录', 'Interlace actual balance', 'Interlace fee', 'Fidere margin'],
    adminVisible: ['trust account balance', 'transfer-in order', 'transfer currency', 'target account currency', 'currency match result', 'frozen amount', 'review action', 'manual completion action', 'audit log'],
    status: ['TRANSFER_IN_SUBMITTED', 'CURRENCY_MATCH_CHECK_PENDING', 'TRUST_BALANCE_CHECK_PENDING', 'TRUST_BALANCE_FROZEN', 'ADMIN_CONFIRM_PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    balanceImpact: ['提交后：pending_transfer_in_balance 增加，trust account available balance 冻结或减少。', '完成后：pending_transfer_in_balance 减少，client_available_balance 增加。', '失败 / 取消：释放 frozen balance，pending_transfer_in_balance 减少。'],
  },
  {
    title: '转出 A：美国账户余额转出',
    type: 'Transfer Out',
    summary: '客户美国 BaaS / Interlace 账户已有实际余额。客户选择 Fidere beneficiary、输入金额并确认 Fidere fee；Admin 审核后手动在 Interlace / BaaS 录入 payout、上传回单并完成。',
    flow: ['客户选择美国账户', '客户选择 Fidere 收款人', '客户输入转出金额', '系统显示 Fidere 转账手续费', '客户确认转出', '系统冻结 client_available_balance', 'Admin 审核订单', 'Admin 在 Interlace 手动录入汇款', 'Admin 记录 BaaS / Interlace 参考编号', 'Admin 上传回单', 'Admin 完成订单', '客户看到“已完成”'],
    clientVisible: ['转出本金', 'Fidere transfer fee', 'total deduction', 'beneficiary', 'status', 'receipt'],
    clientHidden: ['Interlace fee', 'Interlace actual balance', 'BaaS Payee ID', 'BaaS Payout ID', 'raw_response', 'Fidere margin'],
    adminVisible: ['client_available_balance', 'interlace_actual_balance', 'fidere_fee', 'interlace_fee', 'margin', 'BaaS Payee ID', 'BaaS Payout ID', 'BaaS Reference ID', 'manual execution status', 'receipt', 'audit logs'],
    status: ['TRANSFER_SUBMITTED', 'BALANCE_CHECK_PENDING', 'BALANCE_FROZEN', 'ADMIN_REVIEW_PENDING', 'MANUAL_BAAS_ENTRY_PENDING', 'BAAS_PAYOUT_ENTERED', 'BAAS_PAYOUT_SUBMITTED', 'BAAS_REFERENCE_RECORDED', 'RECEIPT_UPLOADED', 'COMPLETED', 'RECONCILED', 'FAILED', 'CANCELLED'],
    balanceImpact: ['提交 / 冻结后：client_available_balance 减少或 frozen_balance 增加，processing_outgoing_balance 增加。', '完成后：processing_outgoing_balance 减少，ledger 记出款本金和 Fidere fee。', '失败 / 取消：释放 frozen_balance，processing_outgoing_balance 减少。'],
  },
  {
    title: '转出 B：信托资金调拨后转出',
    type: 'Transfer Out',
    summary: '客户信托账户有法币资金，但美国 BaaS 账户没有实际余额。订单显示 Processing；后台通过 internal USDT funding、OTC 和 BaaS 手动汇出完成。客户不看到 USDT、OTC、BaaS 地址、链上记录。',
    flow: ['客户发起转出', '系统生成处理中订单', 'Admin 确认信托账户资金', '系统冻结信托账户资金', 'Fidere 内部钱包转入 USDT 至 BaaS 地址', '系统记录内部 funding 事件', 'OTC 换汇完成', 'Admin 在 Interlace 手动录入汇款', 'Admin 记录参考编号并上传回单', 'Admin 完成订单', '客户看到“已完成”'],
    clientVisible: ['转账本金', 'Fidere transfer fee', 'total deduction', 'beneficiary', 'status', 'receipt'],
    clientHidden: ['USDT funding', 'tx hash', 'BaaS USDT address', 'OTC rate', 'OTC cost', 'OTC counterparty', 'Interlace fee', 'Fidere margin', 'raw_response'],
    adminVisible: ['trust account source funds', 'frozen amount', 'internal funding event', 'USDT amount', 'tx hash', 'OTC execution', 'OTC cost', 'Interlace payout data', 'BaaS reference', 'fee and margin', 'audit log'],
    status: ['TRANSFER_SUBMITTED', 'TRUST_BALANCE_CHECK_PENDING', 'TRUST_BALANCE_FROZEN', 'INTERNAL_FUNDING_PENDING', 'INTERNAL_FUNDING_SENT', 'INTERNAL_FUNDING_CONFIRMED', 'OTC_PENDING', 'OTC_COMPLETED', 'MANUAL_BAAS_ENTRY_PENDING', 'BAAS_PAYOUT_SUBMITTED', 'RECEIPT_UPLOADED', 'COMPLETED', 'FAILED', 'CANCELLED'],
    balanceImpact: ['提交后：trust account balance 冻结，processing_outgoing_balance 增加。', 'internal funding 阶段：只记录 internal_funding_events，不更新客户可见余额。', '完成后：processing_outgoing_balance 减少，ledger 记录客户出款和手续费。', '失败 / 取消：释放信托账户 frozen balance。'],
  },
]

export const transferScenarioKeys = [
  ['inA', '转入 A：外部法币入账'],
  ['inB', '转入 B：信托资金转入美国账户'],
  ['outA', '转出 A：美国账户余额转出'],
  ['outB', '转出 B：信托资金调拨后转出'],
]

export const transferSimulatorScenarios = {
  inA: {
    title: '转入 A：外部法币入账',
    subtitle: 'Transfer In A · External Fiat Incoming',
    amount: 20000,
    steps: ['DETECTED', 'MATCHED', 'UNDER_REVIEW', 'APPROVED', 'POSTED_TO_CLIENT_BALANCE'],
    client: [
      ['入账金额', 'USD 20,000.00', '客户可见'],
      ['币种', 'USD', '客户可见'],
      ['付款人名称', 'Example External Payer', '如可取得则客户可见'],
      ['状态', '审核中 → 已审核', '客户可见'],
    ],
    admin: [
      ['Interlace 交易 ID', 'itl_txn_demo_20000', '仅后台可见'],
      ['raw_response', '{ demo: true, provider: "interlace" }', '仅后台可见'],
      ['审核动作', '审核通过 / 拒绝', '必须审计留痕'],
    ],
    balance: {
      client_available_balance: 98500,
      pending_incoming_balance: 20000,
      pending_transfer_in_balance: 0,
      processing_outgoing_balance: 0,
      frozen_balance: 0,
      interlace_actual_balance: 118500,
    },
    hidden: ['Interlace actual balance', 'Interlace fee', 'raw_response', '内部对账差异'],
  },
  inB: {
    title: '转入 B：信托资金转入美国账户',
    subtitle: 'Transfer In B · Trust Account to US Account',
    amount: 50000,
    steps: ['TRANSFER_IN_SUBMITTED', 'CURRENCY_MATCH_CHECK_PENDING', 'TRUST_BALANCE_FROZEN', 'ADMIN_CONFIRM_PENDING', 'COMPLETED'],
    client: [
      ['转入金额', 'USD 50,000.00', '客户可见'],
      ['币种', 'USD', '客户可见'],
      ['来源', '信托账户', '客户可见'],
      ['目标', '美国账户', '客户可见'],
      ['状态', '处理中 → 已完成', '客户可见'],
    ],
    admin: [
      ['信托账户余额', 'USD 200,000.00', '仅后台可见'],
      ['同币种校验', 'USD → USD matched', '必须通过'],
      ['冻结金额', 'USD 50,000.00', '必须审计留痕'],
      ['手动完成动作', 'Required', '必须审计留痕'],
    ],
    balance: {
      client_available_balance: 98500,
      pending_incoming_balance: 0,
      pending_transfer_in_balance: 50000,
      processing_outgoing_balance: 0,
      frozen_balance: 50000,
      interlace_actual_balance: 1000,
    },
    hidden: ['后台审核备注', '内部账务校验记录', 'Fidere margin', 'Interlace actual balance'],
  },
  outA: {
    title: '转出 A：美国账户余额转出',
    subtitle: 'Transfer Out A · US Account Actual Balance',
    amount: 10000,
    steps: ['TRANSFER_SUBMITTED', 'BALANCE_FROZEN', 'ADMIN_REVIEW_PENDING', 'MANUAL_BAAS_ENTRY_PENDING', 'BAAS_REFERENCE_RECORDED', 'RECEIPT_UPLOADED', 'COMPLETED'],
    client: [
      ['转出金额', 'USD 10,000.00', '客户可见'],
      ['Fidere 手续费', 'USD 80.00', '客户可见'],
      ['总扣款', 'USD 10,080.00', '客户可见'],
      ['收款人', 'Example Beneficiary', '客户可见'],
    ],
    admin: [
      ['Interlace 实际余额', 'USD 120,000.00', '仅后台可见'],
      ['Interlace 手续费', 'USD 20.00', '严禁客户可见'],
      ['BaaS Payee ID', 'payee_demo_001', '仅后台可见'],
      ['BaaS 参考编号', 'ref_demo_001', '仅后台可见'],
    ],
    balance: {
      client_available_balance: 88420,
      pending_incoming_balance: 0,
      pending_transfer_in_balance: 0,
      processing_outgoing_balance: 10080,
      frozen_balance: 10080,
      interlace_actual_balance: 120000,
    },
    hidden: ['Interlace actual balance', 'Interlace fee', 'BaaS Payee ID', 'BaaS Payout ID', 'Fidere margin', 'raw_response'],
  },
  outB: {
    title: '转出 B：信托资金调拨后转出',
    subtitle: 'Transfer Out B · Trust Account Prefunding',
    amount: 30000,
    steps: ['TRANSFER_SUBMITTED', 'TRUST_BALANCE_FROZEN', 'INTERNAL_FUNDING_SENT', 'OTC_COMPLETED', 'MANUAL_BAAS_ENTRY_PENDING', 'RECEIPT_UPLOADED', 'COMPLETED'],
    client: [
      ['转出金额', 'USD 30,000.00', '客户可见'],
      ['Fidere 手续费', 'USD 180.00', '客户可见'],
      ['收款人', 'Example Beneficiary', '客户可见'],
      ['状态', '处理中 → 已完成', '客户可见'],
    ],
    admin: [
      ['信托来源资金', 'USD 30,180.00 frozen', '仅后台可见'],
      ['Internal Funding', 'USDT 30,000 demo', '严禁客户可见'],
      ['tx hash', '0x-demo-hidden', '严禁客户可见'],
      ['OTC 成本', 'USD 95.00 demo', '严禁客户可见'],
    ],
    balance: {
      client_available_balance: 98500,
      pending_incoming_balance: 0,
      pending_transfer_in_balance: 0,
      processing_outgoing_balance: 30180,
      frozen_balance: 30180,
      interlace_actual_balance: 0,
    },
    hidden: ['USDT funding', 'tx hash', 'BaaS USDT address', 'OTC rate', 'OTC cost', 'Interlace fee', 'Fidere margin', 'raw_response'],
  },
}

export const transferDataModels = [
  ['incoming_fiat_deposits', '记录外部法币入账', 'id、us_account_id、client_id、trust_id、provider、interlace_transaction_id、payer_name、payer_bank、currency、amount、received_at、status、matched_by、reviewed_by、reviewed_at、ledger_entry_id、raw_response、created_at', '部分可见', 'raw_response Admin only；approve 后才入 client_available_balance。'],
  ['transfer_in_orders', '建议新增：记录客户从信托账户转入美国账户的订单', 'id、client_id、trust_id、us_account_id、source_account_type、target_account_type、currency、amount、fidere_fee_amount、status、frozen_ledger_entry_id、completed_ledger_entry_id、created_at、completed_at', '部分可见', '用于 Trust Account → US Account 的客户可见订单。'],
  ['us_account_transfers', '记录美国账户转出订单', 'id、client_id、trust_id、us_account_id、beneficiary_id、beneficiary_bank_account_id、transfer_source_type、payout_currency、payout_amount、fidere_fee_amount、interlace_fee_amount、total_client_deduction、status、client_confirmed_at、reviewed_by、reviewed_at、completed_at、created_at', '部分可见', 'transfer_source_type: US_ACCOUNT_ACTUAL_BALANCE / TRUST_ACCOUNT_TO_US_ACCOUNT。'],
  ['internal_funding_events', '记录内部 USDT funding', 'transfer_id、wallet_address、asset、chain、amount、tx_hash、status、confirmed_by、confirmed_at', 'No', 'Client Visible = No；Client Deposit = No；Ledger Posting = Internal only，即仅内部台账。'],
  ['otc_executions', '记录 OTC 执行', 'funding_event_id、asset_amount、fiat_amount、otc_rate、otc_counterparty、cost_amount、margin_amount、executed_by', 'No', 'Client Visible = No，即客户不可见。'],
  ['client_ledger_entries', '客户信托台账', 'entry_type、currency、debit、credit、balance_after、is_client_visible', '部分可见', '新增 entry_type: EXTERNAL_FIAT_INCOMING_PENDING、EXTERNAL_FIAT_INCOMING_APPROVED、TRUST_TO_US_ACCOUNT_TRANSFER_IN、US_ACCOUNT_TRANSFER_OUT、US_ACCOUNT_TRANSFER_FEE、TRANSFER_FROZEN、TRANSFER_RELEASED、MANUAL_ADJUSTMENT。'],
]

export const transferApiRows = [
  ['POST', '/api/us-accounts/:id/transfer-in', '客户从信托账户发起转入美国账户', 'Client', 'Phase 1'],
  ['GET', '/api/us-accounts/:id/transfer-in-orders', '客户查看转入订单', 'Client', 'Phase 1'],
  ['POST', '/api/us-accounts/:id/transfers', '客户发起美国账户转出', 'Client', 'Phase 1'],
  ['GET', '/api/us-accounts/:id/transfers', '客户查看转出订单', 'Client', 'Phase 1'],
  ['GET', '/api/us-accounts/:id/incoming-deposits', '客户查看外部入账记录', 'Client', 'Phase 1'],
  ['GET', '/api/admin/transfer-in-orders', 'Admin 查看转入订单', 'Admin', 'Phase 1'],
  ['POST', '/api/admin/transfer-in-orders/:id/review', 'Admin 审核转入订单', 'Admin', 'Phase 1'],
  ['POST', '/api/admin/transfer-in-orders/:id/complete', 'Admin 完成转入订单', 'Admin', 'Phase 1'],
  ['POST', '/api/admin/transfer-in-orders/:id/cancel', 'Admin 取消转入订单', 'Admin', 'Phase 1'],
  ['GET', '/api/admin/us-account-transfers', 'Admin 查看转出订单', 'Admin', 'Phase 1'],
  ['POST', '/api/admin/us-account-transfers/:id/review', 'Admin 审核转出', 'Admin', 'Phase 1'],
  ['POST', '/api/admin/us-account-transfers/:id/manual-baas-entry', 'Admin 手动 BaaS 录入', 'Admin', 'Phase 1'],
  ['POST', '/api/admin/us-account-transfers/:id/record-internal-funding', '记录 internal funding', 'Admin', 'Phase 1'],
  ['POST', '/api/admin/us-account-transfers/:id/record-otc', '记录 OTC', 'Admin', 'Phase 1'],
  ['POST', '/api/admin/us-account-transfers/:id/upload-receipt', '上传回单', 'Admin', 'Phase 1'],
  ['POST', '/api/admin/us-account-transfers/:id/complete', '完成转出', 'Admin', 'Phase 1'],
  ['GET', '/api/admin/incoming-fiat-deposits', 'Admin 查看外部入账', 'Admin', 'Phase 1'],
  ['POST', '/api/admin/incoming-fiat-deposits/:id/match', '匹配客户', 'Admin', 'Phase 1'],
  ['POST', '/api/admin/incoming-fiat-deposits/:id/approve', '审核通过入账', 'Admin', 'Phase 1'],
  ['POST', '/api/admin/incoming-fiat-deposits/:id/reject', '拒绝入账', 'Admin', 'Phase 1'],
  ['POST', '/api/webhooks/interlace/incoming-deposit', 'Interlace 入账 webhook', 'Webhook', 'Phase 1'],
  ['POST', '/api/webhooks/interlace/payout-status', 'Payout 状态 webhook', 'Webhook', 'Phase 2'],
  ['POST', '/api/webhooks/interlace/balance-update', '余额更新 webhook', 'Webhook', 'Phase 2'],
]

export const transferAuditLogs = [
  'Client 发起 transfer-in',
  'System 冻结信托资金',
  'Admin 审核 transfer-in',
  'Admin 记录 internal funding',
  'Admin 记录 OTC',
  'Admin 完成 transfer-in',
  'Admin 取消 / 失败处理',
  'System 更新 client_available_balance',
  'Client 发起 transfer-out',
  'System 冻结余额',
  'Admin 审核 transfer-out',
  'Admin 手动录入 BaaS',
  'Admin 记录 BaaS Payee ID',
  'Admin 记录 BaaS Payout ID',
  'Admin 记录 BaaS Reference',
  'Admin 上传回单',
  'Admin 完成订单',
  'Webhook 检测入账',
  'System 匹配客户',
  'Admin approve / reject incoming deposit',
  'System posted to client balance',
]
