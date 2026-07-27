export const moduleTypeFilters = [
  { id: 'all', label: '全部' },
  { id: 'prd', label: '产品文档', moduleType: 'prd' },
  { id: 'prototype', label: '功能原型', moduleType: 'prototype' },
  { id: 'independent', label: '独立模块', phase: 'Independent Module' },
]

export const prdModules = [
  {
    id: 'baas-interlace',
    title: 'BaaS / Interlace 美国账户集成系统 PRD',
    subtitle: '美国账户开户、转入转出、余额模型与 Admin 手动执行',
    description:
      '覆盖美国账户开户、USD 500 开户费、Admin 手动 Interlace 开户、账户绑定、余额模型、Transfer In、Transfer Out、外部法币入账审核、Internal Funding、OTC、Manual BaaS Entry 和审计日志。',
    category: '账户与资金',
    status: 'MVP',
    phase: 'Phase 1 / Phase 2',
    route: '/admin/product-manual/baas-interlace',
    tags: ['BaaS', 'Interlace', '美国账户', '转入转出', 'Admin Manual', 'Phase 1 MVP'],
    source: 'Current Project',
    moduleType: 'prd',
    buttonLabel: '进入文档',
  },
  {
    id: 'prd-invest',
    title: 'prd-invest 投资模块 PRD',
    subtitle: '投资相关产品需求文档模块',
    description:
      '作为独立投资产品 PRD 模块接入当前 PRD Portal。内容来自 prd-invest 仓库，聚焦固定收益产品规则、收益率版本、持仓 Lot、提前退出、账务审计和 MVP 范围。',
    category: '投资与交易',
    status: 'Legacy / Draft',
    phase: 'Independent Module',
    route: '/admin/product-manual/prd-invest',
    tags: ['Investment', 'Portfolio', 'Trading', 'Product', 'Asset', 'PRD'],
    source: 'https://github.com/ediya204/prd-invest/tree/main',
    moduleType: 'prd',
    buttonLabel: '进入文档',
  },
  {
    id: 'baas-system-reform',
    title: 'BaaS系统改造',
    subtitle: '账户体系、资金冻结、后台审核与 BaaS 执行链路改造',
    description:
      '用于承载 BaaS / Interlace 系统改造规划，聚焦客户账户切换、可用余额与冻结金额、内部转账、手续费展示、后台审核、手动执行和审计记录。',
    category: '账户与资金',
    status: 'Draft',
    phase: 'System Reform',
    route: '/admin/product-manual/baas-system-reform',
    tags: ['BaaS', '系统改造', '账户体系', '资金冻结', '后台审核', '审计'],
    source: 'Current Project',
    moduleType: 'prd',
    buttonLabel: '进入文档',
  },
  {
    id: 'baas-prototype',
    title: 'BaaS 原型',
    subtitle: 'BaaS / Interlace 产品原型入口',
    description:
      'BaaS / Interlace 相关页面原型入口，用于查看开户、入金、出金、审核、后台管理等页面交互方案。',
    category: '原型',
    status: 'Prototype',
    phase: 'Prototype Draft',
    route: '/admin/product-manual/baas-prototype',
    tags: ['原型', 'BaaS', 'Interlace', '开户', '入金', '出金', '审核', '后台管理'],
    source: 'Current Project',
    moduleType: 'prototype',
    buttonLabel: '进入原型',
  },
  {
    id: 'securities-brokerage-admin',
    title: '券商账户原型',
    subtitle: '券商账户客户端与后台管理原型入口',
    description:
      '统一承载券商账户客户端与后台管理原型。客户端复用现有账户流程结构，后台管理用于处理券商开户申请、资料下载、状态更新与账户信息录入。',
    category: '原型',
    status: 'Prototype',
    phase: 'Prototype Draft',
    route: '/admin/product-manual/securities-account-prototype',
    tags: ['券商账户', '客户端', '后台管理', '开户申请', '账户信息'],
    source: 'Current Project',
    moduleType: 'prototype',
    buttonLabel: '进入原型',
  },
  {
    id: 'account-management-prototype',
    title: '用户新加坡账户配置',
    subtitle: '新加坡账户客户端开户流程与后台审核双入口原型',
    description:
      '将 BaaS 原型的客户端开户流程搬到用户新加坡账户配置下，并保留当前新加坡账户后台审核页面作为运营处理入口。',
    category: '原型',
    status: 'Prototype',
    phase: 'Prototype Draft',
    route: '/admin/product-manual/account-management-prototype',
    tags: ['新加坡账户', '开户流程', '后台审核', '客户端', '后台管理'],
    source: 'Current Project',
    moduleType: 'prototype',
    buttonLabel: '进入原型',
  },
  {
    id: 'batch-add-account-prototype',
    title: '批量加账户',
    subtitle: '客户端开户流程与后台审核双入口原型',
    description:
      '复用用户新加坡账户配置中的完整客户端开户流程和后台审核页面，作为独立的批量加账户原型入口。',
    category: '原型',
    status: 'Prototype',
    phase: 'Prototype Draft',
    route: '/admin/product-manual/batch-add-account-prototype',
    tags: ['批量加账户', '新加坡账户', '开户流程', '后台审核', '客户端', '后台管理'],
    source: 'Current Project',
    moduleType: 'prototype',
    buttonLabel: '进入原型',
  },
  {
    id: 'otc-bank-account-prototype',
    title: '不同的银行账户体系下做OTC与转账给其他用户原型',
    subtitle: '多银行账户资产兑换与信托用户互转原型',
    description:
      '基于 FIDERE 仪表板展示不同银行账户体系下的 OTC 兑换，并在账户页提供信托用户之间的转账操作。',
    category: '原型',
    status: 'Prototype',
    phase: 'Prototype Draft',
    route: '/admin/product-manual/otc-bank-account-prototype',
    tags: ['OTC', '银行账户', '资产兑换', '用户互转', '客户端'],
    source: 'Current Project',
    moduleType: 'prototype',
    buttonLabel: '进入原型',
  },
]

export const baasPrototypeEntries = [
  {
    title: '开户流程',
    description: '客户开通美国账户、确认 USD 500 开户费、扣费成功后进入 Admin 手动开户与 accountId 绑定流程。',
    route: '/admin/product-manual/baas-prototype/opening',
    buttonLabel: '进入开户原型',
  },
  {
    title: '后台审核',
    description: '开户审核、法币资产管理、提现服务费配置等 Admin 原型入口。',
    route: '/admin/product-manual/baas-prototype/admin-review',
    buttonLabel: '进入后台审核原型',
  },
]

export const prdInvestLegacySections = [
  {
    title: '文档概览',
    body: 'prd-invest 是“理财产品 PRD - 业务规则与 MVP 逻辑说明”。第一版重点帮助开发、测试、产品和管理员统一理解固定收益产品规则，包括收益计算、追加认购、特殊提前退出、到期、管理员结算和操作记录要求。',
    tags: ['固定收益', 'MVP', '内部使用'],
  },
  {
    title: '核心规则结论',
    body: '第一版只做单利，不做复利；默认 T+1 起息，认购日不计息；按自然日计算，不处理节假日和工作日顺延；收益率变更必须保留历史版本；每次追加认购都生成独立子订单 / Lot；固定收益产品默认不支持用户自主提前赎回；特殊提前退出只能由用户提交申请，管理员人工确认本金、收益和费用。',
    tags: ['单利', 'T+1 起息', '自然日', '独立 Lot'],
  },
  {
    title: '固定收益产品逻辑',
    body: '平台从外部机构采购固定收益产品，外部产品给平台一个年化收益率，平台配置给客户展示和结算的客户收益率，差额为平台利差收益。用户端只展示客户收益率，外部采购收益率属于后台敏感信息。客户收益计算永远使用客户收益率，不使用外部采购收益率。',
    tags: ['客户收益率', '外部采购收益率', '平台利差'],
  },
  {
    title: '模块职责',
    body: '固定收益产品模块包括产品创建与配置、收益率版本管理、认购订单处理、持仓与 Lot 管理、收益计算、特殊提前退出和到期结算。系统分为用户端、管理员端和系统记录三层：用户端负责产品列表、详情、认购、持仓和结算查看；管理员端负责产品管理、订单处理、收益率调整、提前退出处理和到期结算；系统记录负责资金流水、操作记录、结算结果、调整痕迹和对账追溯。',
    tags: ['用户端', '管理员端', '系统记录'],
  },
  {
    title: '固定收益业务流程',
    body: '用户查看产品，输入认购金额，确认风险提示，系统创建认购订单并完成后台确认，随后进行资金冻结或扣款。产品默认 T+1 起息，系统按规则累计收益，到期后生成结算记录并完成本息到账。',
    tags: ['认购', '资金冻结', '起息', '到期结算'],
  },
  {
    title: '收益率版本机制',
    body: '收益率按生效日期版本化管理，不能直接覆盖旧值。如果客户持仓期间收益率变化，收益必须按版本区间分段计算。历史版本需要保留，方便审计、对账和客户解释；已经结算过的收益率不能随意修改。',
    tags: ['版本化', '分段计息', '审计追溯'],
  },
  {
    title: '追加认购与提前退出规则',
    body: '追加认购不合并到原订单，每一次追加都生成独立子订单 / Lot。每笔资金有自己的起息日、到期日和收益计算区间。固定收益默认不开放用户自主提前赎回；特殊提前退出时，用户只能提交申请，管理员人工确认退还本金、应付收益、扣减费用和最终结算金额。',
    tags: ['追加认购', '独立 Lot', '提前退出', '人工确认'],
  },
  {
    title: '到期日规则',
    body: '起息日 = 认购日 + 1 天；到期日 = 起息日 + 产品期限；结算日 = 到期日。第一版按自然日处理，不处理工作日顺延，也不接入节假日市场日历。工作日历和节假日顺延放到第二阶段。',
    tags: ['T+1', '自然日', '到期结算'],
  },
  {
    title: '账务与审计原则',
    body: '每一笔资金变化都必须有对应资金流水，能够解释金额从哪里来、到哪里去、由什么业务动作触发。管理员关键操作必须有可追溯操作记录。已结算记录不能直接覆盖修改，调整应形成新的调整记录。',
    tags: ['资金流水', '操作记录', '可审计'],
  },
  {
    title: '角色权限说明',
    body: '第一版 MVP 只区分用户和管理员，不做复杂角色分层。用户只能查看自己的订单、持仓、退款、收益和结算结果，不能看到外部采购收益率、平台利差或其他用户数据。管理员统一处理固定收益产品、订单、收益率、提前退出和结算。',
    tags: ['用户', '管理员', 'MVP 权限'],
  },
  {
    title: 'MVP 与第二阶段',
    body: 'MVP 必须包含用户端产品列表、产品详情、固定收益认购、订单和持仓查看、管理员产品管理、收益率版本调整、提前退出申请处理、结算执行、资金流水和操作记录。第二阶段再考虑多角色权限、双人审批、财务复核、合规审核、批量结算、客户分层收益率、复利、工作日历、自动 FIFO 赎回和 IPO 产品。',
    tags: ['MVP', 'Phase 2', 'IPO 后续'],
  },
  {
    title: '开发验收关注点',
    body: '用户只能看到自己的订单、持仓和结算结果；用户不能看到外部采购收益率或其他用户数据；管理员关键操作必须有操作记录；所有资金变化必须有资金流水；固定收益第一版要优先保证金额可解释、可复测、可对账。',
    tags: ['验收', '测试', '对账'],
  },
]
