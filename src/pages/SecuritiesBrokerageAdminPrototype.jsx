import {
  BriefcaseBusiness,
  ChevronDown,
  CircleDot,
  Coins,
  Droplet,
  FileCheck2,
  FileText,
  Gauge,
  Languages,
  LineChart,
  ListChecks,
  Percent,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sun,
  UsersRound,
  UserRound,
  WalletCards,
} from 'lucide-react'
import { useState } from 'react'

import { BrokerageApplicationManagementPage, BrokerageManagementPage, FiatAssetManagementPage } from './BaasAdminReviewPrototype'
import { AccountTypeConfigPage } from './AccountTypeConfigPage'
import { UserManagementPage } from './JurisdictionUserManagementPage'
import { SingaporeAccountOpeningReviewPage } from './SingaporeAccountOpeningReviewPage'
import { initialAccountTypeConfigs } from '../data/accountTypeConfig'
import { initialAccountCurrencyConfigs } from '../data/accountCurrencyConfig'
import { initialBrokerageConfigs } from '../data/brokerageConfig'
import { initialBrokerageApplications } from '../data/securitiesBrokerageApplications'
import { initialUserAccountConfigs } from '../data/userAccountConfig'

function BrokerageAdminHeader({ onBack }) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-[64px] items-center justify-between border-b border-[#dedfe8] bg-white px-[18px]">
      <button type="button" onClick={onBack} className="flex items-center gap-[10px] text-left">
        <span className="flex h-[27px] w-[27px] items-center justify-center rounded-full border border-[#496982] text-[#496982]">
          <Droplet className="h-[18px] w-[18px]" strokeWidth={1.9} />
        </span>
        <span className="text-[20px] font-bold leading-none text-[#22223a]">FIDERE TRUST</span>
        <CircleDot className="ml-[12px] h-[18px] w-[18px] text-[#69667c]" strokeWidth={2.2} />
      </button>

      <div className="flex items-center gap-[18px] pr-[12px] text-[#5f5c70]">
        <Languages className="h-[18px] w-[18px]" strokeWidth={2} />
        <Sun className="h-[18px] w-[18px]" strokeWidth={2} />
        <div className="relative flex h-[39px] w-[39px] items-center justify-center rounded-full bg-[#ececf3] text-[#252236]">
          <UserRound className="h-[22px] w-[22px]" fill="#252236" strokeWidth={0} />
          <span className="absolute bottom-[3px] right-[1px] h-[8px] w-[8px] rounded-full bg-[#58cf16] ring-[2px] ring-white" />
        </div>
      </div>
    </header>
  )
}

function BrokerageSidebarQuestion({ active = false }) {
  return (
    <span className={`flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${active ? 'bg-white text-[#8b4fff]' : 'bg-[#e7d6ff] text-[#8b4fff]'}`}>
      ?
    </span>
  )
}

function SidebarItem({ icon: Icon, label, active = false, marked = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[43px] w-full items-center gap-[14px] rounded-r-[23px] pl-[23px] pr-4 text-[14px] transition ${
        active ? 'bg-[#9b63f5] font-semibold text-white' : 'text-[#24243d] hover:bg-white/70'
      }`}
    >
      <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
      <span className="truncate">{label}</span>
      {marked ? <BrokerageSidebarQuestion active={active} /> : null}
    </button>
  )
}

function SidebarGroup({ icon: Icon, label }) {
  return (
    <div className="mt-[7px] flex h-[42px] w-full items-center justify-between rounded-r-[23px] bg-[#e2e3eb] pl-[19px] pr-[18px] text-[14px] font-semibold text-[#24243d]">
      <span className="flex items-center gap-[13px]">
        <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
        {label}
      </span>
      <ChevronDown className="h-[17px] w-[17px]" strokeWidth={1.8} />
    </div>
  )
}

function BrokerageAdminSidebar({ activePage, onSelect, showAccountTypeConfig = false }) {
  return (
    <aside className="fixed bottom-0 left-0 top-[64px] z-20 w-[220px] overflow-y-auto bg-[#f4f5fb] pr-[4px]">
      <nav className="pb-8 pt-[2px]">
        <SidebarGroup icon={ShieldCheck} label="KYC审核" />
        <div className="mt-[10px] space-y-[4px]">
          <SidebarItem icon={BriefcaseBusiness} label="案件工作台" />
          <SidebarItem icon={WalletCards} label="券商开户管理" active={activePage === 'brokerage-applications'} onClick={() => onSelect('brokerage-applications')} />
          {showAccountTypeConfig ? <SidebarItem icon={ListChecks} label="开户审核" marked active={activePage === 'account-opening-review'} onClick={() => onSelect('account-opening-review')} /> : <SidebarItem icon={ListChecks} label="开户审核" />}
          <SidebarItem icon={UsersRound} label="用户管理" marked active={activePage === 'user-management'} onClick={() => onSelect('user-management')} />
          <SidebarItem icon={Gauge} label="处理中审核" />
          <SidebarItem icon={WalletCards} label="法币账户审核" />
          <SidebarItem icon={FileCheck2} label="数字资产地址审核" />
          <SidebarItem icon={FileText} label="信托管理" />
          <SidebarItem icon={Gauge} label="审核日志" />
        </div>

        <SidebarGroup icon={ListChecks} label="运营" />
        <div className="mt-[9px] space-y-[4px]">
          <SidebarItem icon={Gauge} label="概览" />
          <SidebarItem icon={UserRound} label="客户" />
          <SidebarItem icon={UserRound} label="资产中心" />
          <SidebarItem icon={ShoppingCart} label="法币资产管理" marked active={activePage === 'fiat-assets'} onClick={() => onSelect('fiat-assets')} />
          <SidebarItem icon={Coins} label="券商管理" active={activePage === 'brokerage-management'} onClick={() => onSelect('brokerage-management')} />
          {showAccountTypeConfig ? <SidebarItem icon={WalletCards} label="账户类型配置" marked active={activePage === 'account-type-config'} onClick={() => onSelect('account-type-config')} /> : null}
          <SidebarItem icon={CircleDot} label="数字资产管理" />
          <SidebarItem icon={LineChart} label="理财产品" />
          <SidebarItem icon={CircleDot} label="交易管理" />
          <SidebarItem icon={Percent} label="提现服务费配置" />
        </div>
      </nav>
    </aside>
  )
}

export function SecuritiesBrokerageAdminPrototype({
  onBack,
  brokerageApplications = initialBrokerageApplications,
  onUpdateBrokerageApplication,
  accountCurrencyConfigs = initialAccountCurrencyConfigs,
  onChangeAccountCurrencyConfigs,
  brokerageConfigs = initialBrokerageConfigs,
  onChangeBrokerageConfigs,
  accountTypeConfigs = initialAccountTypeConfigs,
  onChangeAccountTypeConfigs,
  userAccountConfigs = initialUserAccountConfigs,
  onChangeUserAccountConfigs,
  showAccountTypeConfig = false,
  defaultActivePage = 'brokerage-applications',
  defaultFiatTab = '总览',
  jurisdictionStatuses,
  onJurisdictionStatusesChange,
}) {
  const [activePage, setActivePage] = useState(defaultActivePage)
  const [selectedUserDetail, setSelectedUserDetail] = useState(null)
  const [localAccountCurrencyConfigs, setLocalAccountCurrencyConfigs] = useState(initialAccountCurrencyConfigs)
  const [localBrokerageConfigs, setLocalBrokerageConfigs] = useState(initialBrokerageConfigs)
  const [localAccountTypeConfigs, setLocalAccountTypeConfigs] = useState(initialAccountTypeConfigs)
  const [localUserAccountConfigs, setLocalUserAccountConfigs] = useState(initialUserAccountConfigs)
  const effectiveAccountCurrencyConfigs = onChangeAccountCurrencyConfigs ? accountCurrencyConfigs : localAccountCurrencyConfigs
  const effectiveBrokerageConfigs = onChangeBrokerageConfigs ? brokerageConfigs : localBrokerageConfigs
  const effectiveAccountTypeConfigs = onChangeAccountTypeConfigs ? accountTypeConfigs : localAccountTypeConfigs
  const effectiveUserAccountConfigs = onChangeUserAccountConfigs ? userAccountConfigs : localUserAccountConfigs
  const updateBrokerageConfigs = onChangeBrokerageConfigs || setLocalBrokerageConfigs
  const updateAccountTypeConfigs = onChangeAccountTypeConfigs || setLocalAccountTypeConfigs
  const updateUserAccountConfigs = onChangeUserAccountConfigs || setLocalUserAccountConfigs
  const selectPage = (page) => {
    setActivePage(page)
    setSelectedUserDetail(null)
  }

  return (
    <div className="min-h-screen bg-[#f4f5fb] font-sans text-[#24243d]">
      <BrokerageAdminHeader onBack={onBack} />
      <BrokerageAdminSidebar activePage={activePage} onSelect={selectPage} showAccountTypeConfig={showAccountTypeConfig} />
      {activePage === 'brokerage-applications' ? (
        <BrokerageApplicationManagementPage
          applications={brokerageApplications}
          onUpdateApplication={onUpdateBrokerageApplication}
          accountCurrencyConfigs={effectiveAccountCurrencyConfigs}
          onOpenUserDetail={(customer) => {
            setSelectedUserDetail(customer)
            setActivePage('user-management')
          }}
        />
      ) : null}
      {activePage === 'account-opening-review' ? (
        <SingaporeAccountOpeningReviewPage
          accountTypes={effectiveAccountTypeConfigs}
          onOpenUserAccountConfig={() => setActivePage('user-management')}
          jurisdictionStatuses={jurisdictionStatuses}
          onJurisdictionStatusesChange={onJurisdictionStatusesChange}
        />
      ) : null}
      {activePage === 'user-management' ? (
        <UserManagementPage
          focusedCustomer={selectedUserDetail}
          users={effectiveUserAccountConfigs}
          onChangeUsers={updateUserAccountConfigs}
          accountTypes={effectiveAccountTypeConfigs}
          onOpenAccountApplication={() => setActivePage('account-opening-review')}
        />
      ) : null}
      {activePage === 'fiat-assets' ? <FiatAssetManagementPage initialTab={defaultFiatTab} /> : null}
      {activePage === 'brokerage-management' ? (
        <BrokerageManagementPage
          brokers={effectiveBrokerageConfigs}
          onChangeBrokers={updateBrokerageConfigs}
        />
      ) : null}
      {activePage === 'account-type-config' ? (
        <AccountTypeConfigPage
          configs={effectiveAccountTypeConfigs}
          onChangeConfigs={updateAccountTypeConfigs}
        />
      ) : null}
      <button
        type="button"
        className="fixed right-0 top-[180px] z-40 flex h-[36px] w-[36px] items-center justify-center rounded-l-full bg-[#8b4fff] text-white shadow-lg"
        aria-label="后台设置"
      >
        <Settings className="h-[18px] w-[18px]" strokeWidth={2} />
      </button>
    </div>
  )
}
