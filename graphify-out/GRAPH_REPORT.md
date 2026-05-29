# Graph Report - fidere_trust_prd  (2026-05-29)

## Corpus Check
- 82 files · ~65,724 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 729 nodes · 1317 edges · 48 communities (43 shown, 5 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 76 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `162ab75b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]

## God Nodes (most connected - your core abstractions)
1. `Badge()` - 38 edges
2. `Card()` - 36 edges
3. `cn()` - 34 edges
4. `Fidere Trust BaaS / Interlace 美国账户集成系统 PRD` - 22 edges
5. `CardHeader()` - 21 edges
6. `CardTitle()` - 21 edges
7. `CardContent()` - 20 edges
8. `Button()` - 13 edges
9. `SectionHeader()` - 13 edges
10. `十三、数据库表设计建议` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Transfer Balance Impact Model` --semantically_similar_to--> `Client Available Balance Rule`  [INFERRED] [semantically similar]
  src/data/prdData.js → docs/baas-interlace-us-account-prd.md
- `Incoming Fiat Deposit Submission` --semantically_similar_to--> `External Fiat Incoming Review Flow`  [INFERRED] [semantically similar]
  src/pages/IncomingFiatDepositPage.tsx → docs/baas-interlace-us-account-prd.md
- `Incoming Fiat Deposit Prototype` --semantically_similar_to--> `External Fiat Incoming Review Flow`  [INFERRED] [semantically similar]
  src/pages/IncomingFiatDepositPrototype.tsx → docs/baas-interlace-us-account-prd.md
- `US Account Opening Flow Model` --semantically_similar_to--> `Phase 1 Manual Execution`  [INFERRED] [semantically similar]
  src/data/prdData.js → docs/baas-interlace-us-account-prd.md
- `Vite Root Mount` --conceptually_related_to--> `PRD Portal Module Catalog`  [INFERRED]
  index.html → src/data/prdModules.js

## Hyperedges (group relationships)
- **Tailwind CSS Variable Design System** — tailwind_design_token_theme, ui_button_variant_system, ui_badge_tone_system, ui_card_composition_primitives, ui_input_form_control_pattern [INFERRED 0.84]
- **Client-side PRD Navigation Flow** — app_client_side_path_router, portal_prd_module_card, portal_prd_back_link, app_baas_interlace_prd_manual_flow, app_baas_prototype_navigation_flow [INFERRED 0.82]
- **PRD Manual Layout System** — layout_prd_manual_chrome, layout_header_product_positioning, layout_sidebar_section_tracking, layout_sidebar_prd_information_architecture, portal_product_manual_hero [INFERRED 0.82]
- **Fixed Income MVP Rule Cluster** — core_rule_conclusions_fixed_income_mvp, fixed_income_flow_simple_interest_365, yield_rate_versioning_versioned_rates, position_lot_structure_independent_lot, maturity_date_rules_natural_day_schedule, position_lot_structure_special_early_exit [EXTRACTED 1.00]
- **Manual Settlement Traceability Pattern** — position_lot_structure_manual_settlement, role_permission_matrix_admin_boundary, data_model_erd_ledger_principle, data_model_erd_audit_log_principle [EXTRACTED 1.00]
- **Phase 2 Deferred Complexity** — mvp_scope_second_phase_scope, position_lot_structure_phase2_auto_redemption, ipo_flow_phase2_ipo_flow, ipo_profit_confirmation_admin_confirmation [EXTRACTED 1.00]
- **BaaS PRD Visibility Boundary** — prdData_client_admin_visibility_boundary, prdData_fidere_client_available_balance, prdData_interlace_actual_balance, ClientAdminVisibility_field_filter_contract, TransferInOutSimulator_hidden_fields_panel [EXTRACTED 0.96]
- **Transfer Manual Contract** — prdData_transfer_in_a_external_fiat, prdData_transfer_in_b_trust_to_us_account, prdData_transfer_out_a_us_account_balance, prdData_transfer_out_b_trust_prefunding, prdData_transfer_api_contract, prdData_transfer_audit_logs, TransferTechnicalSection_transfer_contract_tables [EXTRACTED 0.94]
- **BaaS Application Validation Model** — baasOpeningApplication_personal_baas_application, baasOpeningApplication_personal_validation_rules, baasOpeningApplication_required_attachments, baasEnterpriseOpeningApplication_enterprise_baas_application, baasEnterpriseOpeningApplication_enterprise_validation_rules, baasEnterpriseOpeningApplication_kyb_required_attachments, baasEnterpriseOpeningApplication_shareholder_director_sections [INFERRED 0.86]
- **US Account Opening Application and Fee Flow** — prdData_opening_flow_model, prdData_opening_fee_model, BaasOpeningApplicationPage_opening_application_workflow, BaasOpeningApplicationPage_fee_confirmation_workflow, BaasOpeningPrototype_us_account_client_state_machine, baasInterlacePrd_phase1_manual_execution [INFERRED 0.86]
- **External Fiat Deposit Review and Balance Flow** — IncomingFiatDepositPage_incoming_deposit_submission, IncomingFiatDepositPrototype_incoming_deposit_prototype, IncomingFiatDepositPrototype_pending_balance_hint, baasInterlacePrd_external_fiat_review_flow, baasInterlacePrd_client_available_balance_rule [INFERRED 0.88]
- **Enterprise KYB Application Supplement Pattern** — BaasOpeningApplicationPage_opening_application_workflow, BaasOpeningApplicationModal_modal_application_workflow, BaasEnterpriseOpeningApplication_enterprise_kyb_supplement_flow, BaasEnterpriseOpeningApplication_problem_checklist_drawer [INFERRED 0.83]
- **Transfer Out Workflow** — zhuanchu_currency_selector_tabs, zhuanchu_paying_bank_panel, zhuanchu_beneficiary_bank_panel, zhuanchu_transfer_application_form, zhuanchu_submit_action [INFERRED 0.84]
- **Bank Information Layout** — zhuanchu_paying_bank_panel, zhuanchu_beneficiary_bank_panel, zhuanchu_copyable_bank_fields [EXTRACTED 1.00]
- **Asset Overview Workflow** — home_total_assets_card, home_asset_trend_chart, home_quick_asset_actions, home_recent_transactions_panel [INFERRED 0.82]
- **Investment Management Area** — home_investment_portfolio_card, home_asset_allocation_card, home_promoted_wealth_plan [INFERRED 0.80]
- **Dashboard Information Architecture** — home_top_navigation, home_total_assets_card, home_recent_transactions_panel, home_investment_portfolio_card, home_user_utility_controls [EXTRACTED 1.00]
- **Digital Asset Management Flow** — account_balance_summary, account_quick_links_panel, account_deposit_action, account_withdraw_action, account_exchange_action, account_asset_distribution_table [INFERRED 0.84]
- **Crypto Portfolio Overview** — account_balance_summary, account_total_asset_value, account_currency_rows, account_web3_wallet_panel [INFERRED 0.80]
- **Deposit Workflow Surface** — fbzc_currency_selector, fbzc_receiving_bank_information_card, fbzc_deposit_application_form, fbzc_recent_submission_records [INFERRED 0.82]
- **Bank Transfer Reference Details** — fbzc_payer_bank_information, fbzc_payer_account_information, fbzc_receiving_bank_information_card, fbzc_copyable_bank_fields [EXTRACTED 1.00]
- **Fiat Transfer Detail Sections** — detail_completed_status_summary, detail_payer_account_card, detail_instruction_details_card, detail_receiving_bank_account_card [EXTRACTED 1.00]
- **Transaction Audit Identifiers** — detail_transaction_identifier, detail_created_and_reviewed_dates, detail_copy_identifier_controls [INFERRED 0.84]
- **Deposit Claim Review Workflow** — shenhe_deposit_claim_filter_panel, shenhe_deposit_claim_search_controls, shenhe_batch_claim_action, shenhe_deposit_claim_records_table, shenhe_match_status_badges, shenhe_processing_status_badges [INFERRED 0.86]

## Communities (48 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (38): mockApplication, transferModules, cn(), money(), ApiWebhookSection(), BalanceModelSection(), FlowNodeDetailPanel(), GuardrailAlert() (+30 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (22): BaasPrototypeHome(), ClientAdminVisibility(), FlowDiagram(), AccountOpeningModuleSection(), ApiWebhooksSection(), ArchitectureOverviewSection(), AuditLogsSection(), BalanceModelManualSection() (+14 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (18): attachmentFields, createEmptyBaasApplication(), createMockFile(), createMockUploadedImage(), getBaasApplicationSections(), mockBaasOpeningProfile, personalProfileFields, validateBaasApplication() (+10 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (29): PrdInvestPage(), CoreRuleConclusions(), fixedIncomeRules, auditActions, DataModelERD(), ledgerActions, checklist, DevelopmentAcceptanceChecklist() (+21 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (43): Admin Manual Opening Demo, No Real API Boundary, Client/Admin Field Filter Contract, Developer Notes Development Boundary, Application Account Field Mapping, Opening React Flow Diagram, Flow Node Detail Contract, API Webhooks Manual Section (+35 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (27): classifyAttachment(), classifyField(), companyAttachmentFields, companyBaseFields, createMockEnterpriseFile(), getByPath(), getEnterpriseSections(), mockEnterpriseApplication (+19 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (34): Client Available Balance Boundary, PRD Local Comment Board, Fixed Income MVP Rule Set, Audit Log Principle, Ledger Traceability Principle, Development Acceptance Focus, Client Visibility Risk Boundary, Backend Authoritative Calculation (+26 more)

### Community 7 - "Community 7"
Cohesion: 0.05
Nodes (19): BaasOpeningPrototype(), bankAccountRows, demoStatuses, feeModes, formatCurrencyAmount(), internalTransferDirections, InternalTransferPage(), transferFeeConfig (+11 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (21): developerNotes, exceptionItems, fieldMappings, guardrails, openingDemoSteps, openingFeeAdminActions, openingFeeConfig, openingFeeRecordFields (+13 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (27): BaaS Interlace PRD Manual Flow, BaaS Prototype Navigation Flow, Client-side Path Router, Legacy BaaS Interlace Redirect, ReactFlow Context Requirement, Header Product Positioning, PRD Manual Chrome, Sidebar PRD Information Architecture (+19 more)

### Community 10 - "Community 10"
Cohesion: 0.11
Nodes (24): Enterprise KYB Supplement Flow, Enterprise Problem Checklist Drawer, Modal Opening Application Workflow, Opening Fee Confirmation Workflow, BaaS Opening Application Workflow, US Account Visibility Gate, Incoming Deposit Prototype Navigation, US Account Client Prototype State Machine (+16 more)

### Community 11 - "Community 11"
Cohesion: 0.08
Nodes (23): dependencies, @ant-design/icons, antd, clsx, lucide-react, react, react-dom, reactflow (+15 more)

### Community 12 - "Community 12"
Cohesion: 0.15
Nodes (15): Blurred Dashboard Backdrop, Completed Status Summary, Copy Identifier Controls, Created and Reviewed Dates 2026-05-18, Fiat Transfer Detail, Instruction Details Card, WANYARA OP WAN Account, Payer Account Card (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.21
Nodes (13): Copyable Bank Fields, Currency Selector, Deposit Application Form, FIDERE Account Deposit Page, Payer Account Information, Payer Bank Information, Payer Bank Selection Card, Receiving Bank Information Card (+5 more)

### Community 14 - "Community 14"
Cohesion: 0.17
Nodes (13): Admin Utility Toolbar, Batch Claim Action, Deposit Claim Filter Panel, Deposit Claim Records Table, Deposit Claim Search Controls, Deposit Claim Tab, Fiat Asset Management Page, Fiat Asset Tab Bar (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.15
Nodes (8): BankAccount, bankAccounts, Currency, DepositFormValues, DepositRecord, DepositStatus, initialRecords, statusConfig

### Community 16 - "Community 16"
Cohesion: 0.21
Nodes (12): Account Digital Assets Page, Asset Distribution Table, Asset Type Toggle, Digital Asset Balance Summary, Currency Balance Rows, Deposit Action, Exchange Action, Quick Links Panel (+4 more)

### Community 17 - "Community 17"
Cohesion: 0.23
Nodes (12): Asset Allocation Card, Asset Trend Chart, Card Based Finance Layout, FIDERE Dashboard, Investment Portfolio Card, Promoted Wealth Plan, Quick Asset Actions, Recent Transactions Panel (+4 more)

### Community 18 - "Community 18"
Cohesion: 0.27
Nodes (11): Account Top Navigation, Bank Wire Transfer Out Page, Beneficiary Bank Panel, Copyable Bank Fields, Currency Selector Tabs, Fee Reminder Banner, Form Validation Support Text, Paying Bank Panel (+3 more)

### Community 19 - "Community 19"
Cohesion: 0.27
Nodes (7): baasPrototypeEntries, moduleTypeFilters, prdInvestLegacySections, prdModules, ProductManualHome(), PrdModuleCard(), ProductManualLayout()

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (8): BaaS Prototype Entry Hub, Legacy Investment PRD Composition, Product Manual Module Search and Filter, Vite Root Mount, BaaS / Interlace PRD Module, BaaS Prototype Entries, PRD Invest Legacy Sections, PRD Portal Module Catalog

### Community 26 - "Community 26"
Cohesion: 0.08
Nodes (23): 3.1 美国账户首页, 3.2 开户申请, 4.1 转入转出工作台, 4.2 收款人管理, 5.1 Admin 待办总览, 5.2 Manual BaaS Entry, 5.3 外部法币入账审核, BAAS 相关需求原型图 (+15 more)

### Community 27 - "Community 27"
Cohesion: 0.14
Nodes (13): code:mermaid (flowchart TD), Fidere Trust BaaS / Interlace 美国账户集成系统 PRD, 一、产品总览, 二、核心业务原则, 十一、客户端页面规划, 十九、一期不做清单, 十二、Admin 后台页面规划, 十五、客户端与后台可见范围 (+5 more)

### Community 28 - "Community 28"
Cohesion: 0.15
Nodes (13): `account_balances`, `audit_logs`, `baas_manual_entries`, `beneficiaries`, `beneficiary_bank_accounts`, `client_ledger_entries`, `incoming_fiat_deposits`, `internal_funding_events` (+5 more)

### Community 29 - "Community 29"
Cohesion: 0.18
Nodes (10): DemoLot, designReasons, exitFlow, firstVersionRules, formatMoney(), initialDemoLots, phase2Rules, PositionLotStructure() (+2 more)

### Community 30 - "Community 30"
Cohesion: 0.31
Nodes (5): navItems, HeaderBar(), PrdLayout(), SidebarNav(), ScrollArea()

### Community 31 - "Community 31"
Cohesion: 0.20
Nodes (10): Task 1：PRD 网页手册页面, Task 2：数据模型评审与迁移设计, Task 3：美国账户申请与开户费流程, Task 4：客户可见余额模型, Task 5：收款人与转出订单, Task 6：外部法币入账审核, Task 7：Internal Funding / OTC 后台记录, Task 8：费用、利润与对账 (+2 more)

### Community 33 - "Community 33"
Cohesion: 0.29
Nodes (7): Admin 后台展示建议, code:text (client_available_balance =), 七、余额模型, 余额类型, 可用余额公式, 客户前端展示建议, 差异原则

### Community 34 - "Community 34"
Cohesion: 0.33
Nodes (6): User Story 1：客户申请美国账户, User Story 2：客户从美国账户已有余额转出, User Story 3：客户从信托账户资金调拨到美国账户后转出, User Story 4：外部法币转入美国账户, User Story 5：客户管理收款人, 五、用户故事

### Community 35 - "Community 35"
Cohesion: 0.33
Nodes (5): BaaS Account Internal Transfer Implementation Plan, Task 1: Add Transfer State And Quick Link Entry Points, Task 2: Build The Transfer Form Page, Task 3: Add Confirmation And Record List, Task 4: Verify

### Community 36 - "Community 36"
Cohesion: 0.40
Nodes (5): code:mermaid (flowchart TD), 六、美国账户开户流程, 后台开户状态, 客户可见开户状态, 流程步骤

### Community 37 - "Community 37"
Cohesion: 0.40
Nodes (5): code:mermaid (flowchart TD), code:mermaid (flowchart TD), Source A：US_ACCOUNT_ACTUAL_BALANCE, Source B：TRUST_ACCOUNT_TO_US_ACCOUNT, 八、转出流程

### Community 38 - "Community 38"
Cohesion: 0.40
Nodes (5): Internal Funding 状态, 入账状态, 十四、状态机, 美国账户申请状态, 转出状态

### Community 39 - "Community 39"
Cohesion: 0.40
Nodes (5): Webhook, Webhook 规则, 十七、API / Webhook 设计, 后台 API, 客户端 API

### Community 40 - "Community 40"
Cohesion: 0.50
Nodes (4): Admin 功能, 十、收款人 / Beneficiary 模块, 客户功能, 数据边界

### Community 41 - "Community 41"
Cohesion: 0.50
Nodes (4): code:mermaid (flowchart TD), 九、外部法币入账流程, 入账状态, 外部入账与内部 funding 的边界

### Community 42 - "Community 42"
Cohesion: 0.50
Nodes (4): code:text (total_client_deduction = payout_amount + fidere_fee_amount), 十六、费用逻辑, 开户, 转出

### Community 43 - "Community 43"
Cohesion: 0.50
Nodes (4): P0 必做, P1 可做, 一期目标, 三、Phase 1 MVP 范围

### Community 44 - "Community 44"
Cohesion: 0.50
Nodes (4): 二期仍然保持, 二期可做, 二期目标, 四、Phase 2 MVP 范围

## Knowledge Gaps
- **217 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+212 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Badge()` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 5`, `Community 7`, `Community 19`, `Community 29`, `Community 30`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 0` to `Community 2`, `Community 3`, `Community 30`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `Fidere Trust BaaS / Interlace 美国账户集成系统 PRD` connect `Community 27` to `Community 33`, `Community 34`, `Community 36`, `Community 37`, `Community 38`, `Community 39`, `Community 40`, `Community 41`, `Community 42`, `Community 43`, `Community 44`, `Community 28`, `Community 31`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _217 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0855464759959142 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11576354679802955 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06565656565656566 - nodes in this community are weakly interconnected._