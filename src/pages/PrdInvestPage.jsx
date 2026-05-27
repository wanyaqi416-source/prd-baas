import { ProductManualLayout } from '../components/portal/ProductManualLayout'
import { PrdBackLink } from '../components/portal/PrdBackLink'
import { CoreRuleConclusions } from '../components/prd-invest-original/core-rule-conclusions'
import { DataModelERD } from '../components/prd-invest-original/data-model-erd'
import { DevelopmentAcceptanceChecklist } from '../components/prd-invest-original/development-acceptance-checklist'
import { FixedIncomeFlow } from '../components/prd-invest-original/fixed-income-flow'
import { IPOFlow } from '../components/prd-invest-original/ipo-flow'
import { IPOProfitConfirmation } from '../components/prd-invest-original/ipo-profit-confirmation'
import { MaturityDateRules } from '../components/prd-invest-original/maturity-date-rules'
import { ModuleArchitecture } from '../components/prd-invest-original/module-architecture'
import { MVPScope } from '../components/prd-invest-original/mvp-scope'
import { PositionLotStructure } from '../components/prd-invest-original/position-lot-structure'
import { ProductOverview } from '../components/prd-invest-original/product-overview'
import { PRDHeader } from '../components/prd-invest-original/prd-header'
import { RolePermissionMatrix } from '../components/prd-invest-original/role-permission-matrix'
import { TableOfContents } from '../components/prd-invest-original/table-of-contents'
import { YieldRateVersioning } from '../components/prd-invest-original/yield-rate-versioning'

export function PrdInvestPage({ onBack }) {
  return (
    <ProductManualLayout>
      <TableOfContents />
      <main className="ml-0 lg:ml-64 print:ml-0">
        <div className="mx-auto max-w-5xl space-y-12 px-6 py-8">
          <PrdBackLink onClick={onBack} />
          <PRDHeader />
          <CoreRuleConclusions />
          <ProductOverview />
          <ModuleArchitecture />
          <FixedIncomeFlow />
          <YieldRateVersioning />
          <PositionLotStructure />
          <MaturityDateRules />
          <DataModelERD />
          <RolePermissionMatrix />
          <MVPScope />
          <DevelopmentAcceptanceChecklist />
          <IPOFlow />
          <IPOProfitConfirmation />
          <footer className="border-t border-border pb-16 pt-8">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>理财产品 PRD v1.0</span>
              <span>内部使用</span>
              <span>更新日期：2026-05-08</span>
            </div>
          </footer>
        </div>
      </main>
    </ProductManualLayout>
  )
}
