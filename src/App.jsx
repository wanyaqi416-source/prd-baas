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
import { BaasAdminReviewPrototype } from './pages/BaasAdminReviewPrototype'
import { BaasOpeningApplicationPage } from './pages/BaasOpeningApplicationPage'
import { BaasOpeningPrototype } from './pages/BaasOpeningPrototype'
import { BaasAdminWorkbenchPrototype } from './pages/BaasAdminWorkbenchPrototype'
import { AccountManagementPrototypeHome } from './pages/AccountManagementPrototypeHome'
import { BaasPrototypeHome } from './pages/BaasPrototypeHome'
import { BaasSystemReformPage } from './pages/BaasSystemReformPage'
import { ProductManualHome } from './pages/ProductManualHome'
import { PrdInvestPage } from './pages/PrdInvestPage'
import { OtcBankAccountPrototype } from './pages/OtcBankAccountPrototype'
import { RecommendedArticlesClientPrototype } from './pages/RecommendedArticlesClientPrototype'
import {
  SecuritiesBrokerageServicePrototype,
  SecuritiesAccountClientPrototype,
  SecuritiesAccountClientStaticPage,
  SecuritiesAccountPrototypeHome,
} from './pages/SecuritiesAccountPrototype'
import { SecuritiesBrokerageAdminPrototype } from './pages/SecuritiesBrokerageAdminPrototype'
import { initialAccountCurrencyConfigs } from './data/accountCurrencyConfig'
import { initialAccountTypeConfigs } from './data/accountTypeConfig'
import { initialBrokerageConfigs } from './data/brokerageConfig'
import { initialBrokerageApplications } from './data/securitiesBrokerageApplications'
import { initialUserAccountConfigs } from './data/userAccountConfig'
import { initialRecommendedArticles } from './data/recommendedArticles'

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
  const [baasOpeningInitialStatus, setBaasOpeningInitialStatus] = useState('not_opened')
  const [accountManagementApplicationVariant, setAccountManagementApplicationVariant] = useState('us')
  const [accountManagementJurisdictionStatuses, setAccountManagementJurisdictionStatuses] = useState({
    us: 'not_opened',
    singapore: 'not_opened',
  })
  const [batchAddAccountApplicationVariant, setBatchAddAccountApplicationVariant] = useState('us')
  const [batchAddAccountJurisdictionStatuses, setBatchAddAccountJurisdictionStatuses] = useState({
    us: 'not_opened',
    singapore: 'not_opened',
  })
  const [otcJurisdictionStatuses, setOtcJurisdictionStatuses] = useState({
    us: 'opened',
    singapore: 'opened',
    bahrain: 'not_opened',
  })
  const [brokerageApplications, setBrokerageApplications] = useState(initialBrokerageApplications)
  const [brokerageConfigs, setBrokerageConfigs] = useState(initialBrokerageConfigs)
  const [accountCurrencyConfigs, setAccountCurrencyConfigs] = useState(initialAccountCurrencyConfigs)
  const [accountTypeConfigs, setAccountTypeConfigs] = useState(initialAccountTypeConfigs)
  const [userAccountConfigs, setUserAccountConfigs] = useState(initialUserAccountConfigs)
  const [recommendedArticles, setRecommendedArticles] = useState(initialRecommendedArticles)

  const updateBrokerageApplication = (applicationId, patch) => {
    setBrokerageApplications((current) => current.map((application) => (
      application.id === applicationId ? { ...application, ...patch } : application
    )))
  }

  if (path === '/admin/product-manual/prd-invest') {
    return <PrdInvestPage onBack={() => navigate('/')} />
  }

  if (path === '/admin/product-manual/baas-prototype') {
    return <BaasPrototypeHome onBack={() => navigate('/')} onNavigate={navigate} />
  }

  if (path === '/admin/product-manual/securities-account-prototype' || path === '/admin/product-manual/securities-brokerage-admin') {
    return (
      <SecuritiesAccountPrototypeHome
        onBack={() => navigate('/')}
        onNavigate={navigate}
      />
    )
  }

  if (path === '/admin/product-manual/securities-account-prototype/client') {
    return (
      <SecuritiesAccountClientPrototype
        onBack={() => navigate('/admin/product-manual/securities-account-prototype')}
        onNavigate={navigate}
        onPrototypeHome={() => navigate('/admin/product-manual/securities-account-prototype')}
        brokerageApplications={brokerageApplications}
        accountCurrencyConfigs={accountCurrencyConfigs}
      />
    )
  }

  if (path === '/admin/product-manual/securities-account-prototype/client/licai') {
    return (
      <SecuritiesAccountClientStaticPage
        onBack={() => navigate('/admin/product-manual/securities-account-prototype/client')}
        onNavigate={navigate}
      />
    )
  }

  if (path === '/admin/product-manual/securities-account-prototype/client/quanshang') {
    return (
      <SecuritiesBrokerageServicePrototype
        onBack={() => navigate('/admin/product-manual/securities-account-prototype/client')}
        onNavigate={navigate}
        brokerageConfigs={brokerageConfigs}
        brokerageApplications={brokerageApplications}
      />
    )
  }

  if (path === '/admin/product-manual/securities-account-prototype/admin') {
    return (
      <SecuritiesBrokerageAdminPrototype
        onBack={() => navigate('/admin/product-manual/securities-account-prototype')}
        brokerageApplications={brokerageApplications}
        onUpdateBrokerageApplication={updateBrokerageApplication}
        accountCurrencyConfigs={accountCurrencyConfigs}
        onChangeAccountCurrencyConfigs={setAccountCurrencyConfigs}
        brokerageConfigs={brokerageConfigs}
        onChangeBrokerageConfigs={setBrokerageConfigs}
      />
    )
  }

  if (path === '/admin/product-manual/account-management-prototype') {
    return (
      <AccountManagementPrototypeHome
        onBack={() => navigate('/')}
        onNavigate={navigate}
      />
    )
  }

  if (path === '/admin/product-manual/account-management-prototype/opening') {
    return (
      <BaasOpeningPrototype
        onBack={() => navigate('/admin/product-manual/account-management-prototype')}
        onOpenApplication={(variant = 'us') => {
          setAccountManagementApplicationVariant(variant)
          navigate('/admin/product-manual/account-management-prototype/account-opening/create')
        }}
        onPrototypeHome={() => navigate('/admin/product-manual/account-management-prototype')}
        initialStatus={accountManagementJurisdictionStatuses.us}
        initialJurisdictionStatuses={accountManagementJurisdictionStatuses}
        onJurisdictionStatusesChange={setAccountManagementJurisdictionStatuses}
        prototypeLabel="用户新加坡账户配置"
        accountCurrencyConfigs={accountCurrencyConfigs}
        enableSingaporeOpening
        demoStatusAccounts={['us', 'singapore']}
      />
    )
  }

  if (path === '/admin/product-manual/account-management-prototype/account-opening/create') {
    return (
      <BaasOpeningApplicationPage
        onBack={() => navigate('/admin/product-manual/account-management-prototype/opening')}
        onProceedToOpeningStatus={() => {
          setAccountManagementJurisdictionStatuses((current) => ({
            ...current,
            [accountManagementApplicationVariant === 'singapore' ? 'singapore' : 'us']: 'reviewing',
          }))
          navigate('/admin/product-manual/account-management-prototype/opening')
        }}
        openingAccountVariant={accountManagementApplicationVariant}
      />
    )
  }

  if (path === '/admin/product-manual/account-management-prototype/admin-review') {
    return (
      <SecuritiesBrokerageAdminPrototype
        onBack={() => navigate('/admin/product-manual/account-management-prototype')}
        brokerageApplications={brokerageApplications}
        onUpdateBrokerageApplication={updateBrokerageApplication}
        accountCurrencyConfigs={accountCurrencyConfigs}
        onChangeAccountCurrencyConfigs={setAccountCurrencyConfigs}
        brokerageConfigs={brokerageConfigs}
        onChangeBrokerageConfigs={setBrokerageConfigs}
        accountTypeConfigs={accountTypeConfigs}
        onChangeAccountTypeConfigs={setAccountTypeConfigs}
        userAccountConfigs={userAccountConfigs}
        onChangeUserAccountConfigs={setUserAccountConfigs}
        showAccountTypeConfig
        defaultActivePage="account-opening-review"
      />
    )
  }

  if (path === '/admin/product-manual/batch-add-account-prototype') {
    return (
      <AccountManagementPrototypeHome
        onBack={() => navigate('/')}
        onNavigate={navigate}
        title="批量加账户"
        description="完整复用用户新加坡账户配置中的客户端开户流程和后台审核页面，并作为独立入口展示。"
        baseRoute="/admin/product-manual/batch-add-account-prototype"
        featureBadge="批量加账户"
      />
    )
  }

  if (path === '/admin/product-manual/batch-add-account-prototype/opening') {
    return (
      <BaasOpeningPrototype
        onBack={() => navigate('/admin/product-manual/batch-add-account-prototype')}
        onOpenApplication={(variant = 'us') => {
          setBatchAddAccountApplicationVariant(variant)
          navigate('/admin/product-manual/batch-add-account-prototype/account-opening/create')
        }}
        onPrototypeHome={() => navigate('/admin/product-manual/batch-add-account-prototype')}
        initialStatus={batchAddAccountJurisdictionStatuses.us}
        initialJurisdictionStatuses={batchAddAccountJurisdictionStatuses}
        onJurisdictionStatusesChange={setBatchAddAccountJurisdictionStatuses}
        prototypeLabel="批量加账户"
        accountCurrencyConfigs={accountCurrencyConfigs}
        enableSingaporeOpening
        demoStatusAccounts={['us', 'singapore']}
      />
    )
  }

  if (path === '/admin/product-manual/batch-add-account-prototype/account-opening/create') {
    return (
      <BaasOpeningApplicationPage
        onBack={() => navigate('/admin/product-manual/batch-add-account-prototype/opening')}
        onProceedToOpeningStatus={() => {
          setBatchAddAccountJurisdictionStatuses((current) => ({
            ...current,
            [batchAddAccountApplicationVariant === 'singapore' ? 'singapore' : 'us']: 'reviewing',
          }))
          navigate('/admin/product-manual/batch-add-account-prototype/opening')
        }}
        openingAccountVariant={batchAddAccountApplicationVariant}
      />
    )
  }

  if (path === '/admin/product-manual/batch-add-account-prototype/admin-review') {
    return (
      <SecuritiesBrokerageAdminPrototype
        onBack={() => navigate('/admin/product-manual/batch-add-account-prototype')}
        brokerageApplications={brokerageApplications}
        onUpdateBrokerageApplication={updateBrokerageApplication}
        accountCurrencyConfigs={accountCurrencyConfigs}
        onChangeAccountCurrencyConfigs={setAccountCurrencyConfigs}
        brokerageConfigs={brokerageConfigs}
        onChangeBrokerageConfigs={setBrokerageConfigs}
        accountTypeConfigs={accountTypeConfigs}
        onChangeAccountTypeConfigs={setAccountTypeConfigs}
        userAccountConfigs={userAccountConfigs}
        onChangeUserAccountConfigs={setUserAccountConfigs}
        showAccountTypeConfig
        defaultActivePage="account-opening-review"
      />
    )
  }

  if (path === '/admin/product-manual/user-transfer-prototype') {
    return (
      <BaasOpeningPrototype
        onBack={() => navigate('/')}
        onPrototypeHome={() => navigate('/')}
        initialStatus="opened"
        prototypeLabel="转账给其他用户原型"
        showGuidanceMarks={false}
        enableUserTransfer
        forceUserTransferMark
        accountCurrencyConfigs={accountCurrencyConfigs}
      />
    )
  }

  if (path === '/admin/product-manual/otc-bank-account-prototype') {
    return (
      <AccountManagementPrototypeHome
        onBack={() => navigate('/')}
        onNavigate={navigate}
        title="不同的银行账户体系下做OTC与转账给其他用户原型"
        description="分别进入客户端资产兑换与用户转账原型，以及配套的管理端后台审核页面。"
        baseRoute="/admin/product-manual/otc-bank-account-prototype"
        featureBadge="OTC 与用户转账"
        clientEntry={{
          title: '客户端',
          description: '进入仪表板、账户和交易页面，体验多账户 OTC 兑换、转账给其他用户及交易记录联动。',
          buttonLabel: '进入客户端',
          route: '/admin/product-manual/otc-bank-account-prototype/client',
        }}
        adminEntry={{
          title: '管理端',
          description: '完整复用批量加账户中的后台审核功能，查看开户审核、用户管理及账户类型配置。',
          buttonLabel: '进入管理端',
          route: '/admin/product-manual/otc-bank-account-prototype/admin-review',
        }}
      />
    )
  }

  if (path === '/admin/product-manual/otc-bank-account-prototype/client') {
    return (
      <OtcBankAccountPrototype
        onBack={() => navigate('/admin/product-manual/otc-bank-account-prototype')}
        accountTypeConfigs={accountTypeConfigs}
        initialJurisdictionStatuses={otcJurisdictionStatuses}
        onJurisdictionStatusesChange={setOtcJurisdictionStatuses}
      />
    )
  }

  if (path === '/admin/product-manual/otc-bank-account-prototype/admin-review') {
    return (
      <SecuritiesBrokerageAdminPrototype
        onBack={() => navigate('/admin/product-manual/otc-bank-account-prototype')}
        brokerageApplications={brokerageApplications}
        onUpdateBrokerageApplication={updateBrokerageApplication}
        accountCurrencyConfigs={accountCurrencyConfigs}
        onChangeAccountCurrencyConfigs={setAccountCurrencyConfigs}
        brokerageConfigs={brokerageConfigs}
        onChangeBrokerageConfigs={setBrokerageConfigs}
        accountTypeConfigs={accountTypeConfigs}
        onChangeAccountTypeConfigs={setAccountTypeConfigs}
        userAccountConfigs={userAccountConfigs}
        onChangeUserAccountConfigs={setUserAccountConfigs}
        showAccountTypeConfig
        defaultActivePage="fiat-assets"
        defaultFiatTab="资金互转"
        jurisdictionStatuses={otcJurisdictionStatuses}
        onJurisdictionStatusesChange={setOtcJurisdictionStatuses}
      />
    )
  }

  if (path === '/admin/product-manual/account-ledger-prototype') {
    return (
      <SecuritiesBrokerageAdminPrototype
        onBack={() => navigate('/')}
        brokerageApplications={brokerageApplications}
        onUpdateBrokerageApplication={updateBrokerageApplication}
        accountCurrencyConfigs={accountCurrencyConfigs}
        onChangeAccountCurrencyConfigs={setAccountCurrencyConfigs}
        brokerageConfigs={brokerageConfigs}
        onChangeBrokerageConfigs={setBrokerageConfigs}
        accountTypeConfigs={accountTypeConfigs}
        onChangeAccountTypeConfigs={setAccountTypeConfigs}
        userAccountConfigs={userAccountConfigs}
        onChangeUserAccountConfigs={setUserAccountConfigs}
        showAccountTypeConfig
        guideMarkedPage="account-ledger"
        defaultActivePage="account-ledger"
        jurisdictionStatuses={otcJurisdictionStatuses}
        onJurisdictionStatusesChange={setOtcJurisdictionStatuses}
      />
    )
  }

  if (path === '/admin/product-manual/recommended-articles-prototype/client') {
    return (
      <RecommendedArticlesClientPrototype
        articles={recommendedArticles}
        onBack={() => navigate('/')}
        onNavigate={navigate}
      />
    )
  }

  if (path === '/admin/product-manual/recommended-articles-prototype/client/funds') {
    return (
      <RecommendedArticlesClientPrototype
        articles={recommendedArticles}
        page="funds"
        onBack={() => navigate('/')}
        onNavigate={navigate}
      />
    )
  }

  if (path.startsWith('/admin/product-manual/recommended-articles-prototype/client/articles/')) {
    const articleId = decodeURIComponent(path.split('/').filter(Boolean).at(-1) || '')
    return (
      <RecommendedArticlesClientPrototype
        articles={recommendedArticles}
        page="article"
        articleId={articleId}
        onBack={() => navigate('/')}
        onNavigate={navigate}
      />
    )
  }

  if (path === '/admin/product-manual/recommended-articles-prototype') {
    return (
      <BaasAdminReviewPrototype
        onBack={() => navigate('/')}
        defaultActivePage="recommended-articles"
        recommendedArticles={recommendedArticles}
        onChangeRecommendedArticles={setRecommendedArticles}
        onOpenRecommendedClient={() => navigate('/admin/product-manual/recommended-articles-prototype/client')}
      />
    )
  }

  if (path === '/admin/product-manual/baas-system-reform') {
    return (
      <BaasSystemReformPage
        onBack={() => navigate('/')}
        onOpenWorkbench={() => navigate('/admin/product-manual/baas-system-reform/workbench')}
      />
    )
  }

  if (path === '/admin/product-manual/baas-system-reform/workbench') {
    return <BaasAdminWorkbenchPrototype onBack={() => navigate('/admin/product-manual/baas-system-reform')} />
  }

  if (path === '/admin/product-manual/baas-prototype/opening') {
    return (
      <BaasOpeningPrototype
        onBack={() => navigate('/')}
        onOpenApplication={() => navigate('/admin/product-manual/baas-prototype/account-opening/create')}
        onPrototypeHome={() => navigate('/admin/product-manual/baas-prototype')}
        initialStatus={baasOpeningInitialStatus}
        accountCurrencyConfigs={accountCurrencyConfigs}
      />
    )
  }

  if (path === '/admin/product-manual/baas-prototype/admin-review') {
    return <BaasAdminReviewPrototype onBack={() => navigate('/admin/product-manual/baas-prototype')} />
  }

  if (path === '/admin/product-manual/baas-prototype/account-opening/create') {
    return (
      <BaasOpeningApplicationPage
        onBack={() => navigate('/admin/product-manual/baas-prototype/opening')}
        onProceedToOpeningStatus={() => {
          setBaasOpeningInitialStatus('reviewing')
          navigate('/admin/product-manual/baas-prototype/opening')
        }}
      />
    )
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
