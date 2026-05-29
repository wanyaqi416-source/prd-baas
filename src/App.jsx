import { ReactFlowProvider } from 'reactflow'
import { useEffect, useState } from 'react'

import { PrdLayout } from './components/layout/PrdLayout'
import { PrdBackLink } from './components/portal/PrdBackLink'
import {
  AccountOpeningModuleSection,
  ApiWebhooksSection,
  ArchitectureOverviewSection,
  AuditLogsSection,
  BalanceModelManualSection,
  BeneficiarySection,
  BusinessFlowsSection,
  DataModelsSection,
  DeveloperNotesSection,
  ExceptionsSection,
  IncomingReviewSection,
  InteractiveDemosSection,
  MvpScopeSection,
  OutOfScopeSection,
  PrinciplesSection,
  StateMachinesSection,
  TransferInSection,
  TransferOutSection,
} from './components/prd/ManualSections'
import { ClientAdminVisibility } from './components/prd/ClientAdminVisibility'
import { BaasOpeningPrototype } from './pages/BaasOpeningPrototype'
import { BaasPrototypeHome } from './pages/BaasPrototypeHome'
import { IncomingFiatDepositPage } from './pages/IncomingFiatDepositPage'
import { ProductManualHome } from './pages/ProductManualHome'
import { PrdInvestPage } from './pages/PrdInvestPage'

function useCurrentPath() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (nextPath) => {
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return [path, navigate]
}

function BaasInterlacePage({ onBack }) {
  return (
    <PrdLayout>
      <div>
        <PrdBackLink onClick={onBack} />
      </div>
      <PrinciplesSection />
      <ArchitectureOverviewSection />
      <MvpScopeSection />
      <BusinessFlowsSection />
      <AccountOpeningModuleSection />
      <BalanceModelManualSection />
      <TransferInSection />
      <TransferOutSection />
      <IncomingReviewSection />
      <BeneficiarySection />
      <section id="visibility">
        <ClientAdminVisibility embedded />
      </section>
      <InteractiveDemosSection />
      <DataModelsSection />
      <StateMachinesSection />
      <ApiWebhooksSection />
      <AuditLogsSection />
      <ExceptionsSection />
      <OutOfScopeSection />
      <DeveloperNotesSection />
    </PrdLayout>
  )
}

function App() {
  const [path, navigate] = useCurrentPath()

  if (path === '/admin/product-manual/prd-invest') {
    return <PrdInvestPage onBack={() => navigate('/')} />
  }

  if (path === '/admin/product-manual/baas-prototype') {
    return <BaasPrototypeHome onBack={() => navigate('/')} onNavigate={navigate} />
  }

  if (path === '/admin/product-manual/baas-prototype/opening') {
    return <BaasOpeningPrototype onBack={() => navigate('/')} onPrototypeHome={() => navigate('/admin/product-manual/baas-prototype')} />
  }

  if (path === '/admin/product-manual/baas-prototype/incoming-fiat-deposit') {
    return <IncomingFiatDepositPage onBack={() => navigate('/admin/product-manual/baas-prototype')} />
  }

  if (path === '/admin/product-manual/baas-interlace-prd') {
    window.history.replaceState({}, '', '/admin/product-manual/baas-interlace')
    return (
      <ReactFlowProvider>
        <BaasInterlacePage onBack={() => navigate('/')} />
      </ReactFlowProvider>
    )
  }

  if (path === '/admin/product-manual/baas-interlace') {
    return (
      <ReactFlowProvider>
        <BaasInterlacePage onBack={() => navigate('/')} />
      </ReactFlowProvider>
    )
  }

  return (
    <ProductManualHome onNavigate={navigate} />
  )
}

export default App
