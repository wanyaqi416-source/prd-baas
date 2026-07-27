import {
  ArrowDownLeft,
  ArrowDownUp,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  Landmark,
  RefreshCw,
  Search,
  Send,
  X,
} from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'

import { CurrencyIcon } from '../components/baas/CurrencyIcon'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { BaasOpeningPrototype, ClientTopNav } from './BaasOpeningPrototype'

const assetPrices = {
  BTC: 65255.38,
  USDT: 1,
  USD: 1,
  HKD: 0.128,
  CNY: 0.139,
  EUR: 1.14,
  SGD: 0.77,
  JPY: 0.0067,
  AED: 0.2723,
}

const accountOptions = [
  {
    id: 'hk',
    name: '香港账户',
    accountNumber: 'HK-0950',
    status: '已开放',
    statusTone: 'success',
    assets: [
      { code: 'BTC', name: 'Bitcoin', network: 'Bitcoin', balance: 0.32 },
      { code: 'USDT', name: 'Tether', network: 'ERC20', balance: 10001.2499 },
      { code: 'USD', name: '美元', balance: 928 },
      { code: 'HKD', name: '港币', balance: 197 },
      { code: 'CNY', name: '人民币', balance: 1589.44 },
      { code: 'EUR', name: '欧元', balance: 100.71 },
      { code: 'SGD', name: '新加坡元', balance: 200.84 },
      { code: 'JPY', name: '日元', balance: 380 },
    ],
  },
  {
    id: 'sg',
    name: '新加坡账户',
    accountNumber: 'SG-0950',
    status: '模拟数据 · 暂未正式开放',
    statusTone: 'warning',
    assets: [
      { code: 'BTC', name: 'Bitcoin', network: 'Bitcoin', balance: 0.08 },
      { code: 'USDT', name: 'Tether', network: 'TRC20', balance: 3200 },
      { code: 'USD', name: '美元', balance: 600 },
      { code: 'CNY', name: '人民币', balance: 2489.44 },
      { code: 'SGD', name: '新加坡元', balance: 300.84 },
      { code: 'AED', name: '阿联酋迪拉姆', balance: 100 },
      { code: 'JPY', name: '日元', balance: 400 },
    ],
  },
  {
    id: 'us',
    name: '美国账户',
    accountNumber: 'US-6655',
    status: '模拟数据 · 暂未正式开放',
    statusTone: 'warning',
    assets: [
      { code: 'BTC', name: 'Bitcoin', network: 'Bitcoin', balance: 0.05 },
      { code: 'USDT', name: 'Tether', network: 'ERC20', balance: 1800 },
      { code: 'USD', name: '美元', balance: 1385.8 },
    ],
  },
]

const initialTransactions = [
  {
    id: 'TXN-20260722-5efed465',
    type: '法币转出',
    account: '新加坡账户',
    amount: -99,
    currency: 'SGD',
    status: '待处理',
    date: '2026-07-22',
    time: '17:56:33',
    summary: 'YW 测试银行 尾号 2321',
    customer: 'YAQI WAN',
    customerId: 'AC-202607-05161f0a',
    fee: '1.00 SGD',
    bankName: '测试银行',
    bankAccount: '2322321',
  },
  {
    id: 'TXN-20260722-b6c97d15',
    type: '法币转出',
    account: '新加坡账户',
    amount: -10,
    currency: 'JPY',
    status: '待处理',
    date: '2026-07-22',
    time: '16:17:53',
    summary: 'WAN YA TEST 尾号 0950',
    customer: 'WAN YA TEST',
    customerId: 'AC-202607-054235af',
    fee: '1.00 JPY',
    bankName: 'Green Link Digital Bank',
    bankAccount: '0950',
  },
  {
    id: 'TXN-20260722-03f40422',
    type: '法币转入',
    account: '新加坡账户',
    amount: 200,
    currency: 'JPY',
    status: '已完成',
    date: '2026-07-22',
    time: '16:17:21',
    summary: '-',
    customer: 'YAQI WAN',
    customerId: 'AC-202607-05161f0a',
    fee: '0.00 JPY',
    bankName: 'Green Link Digital Bank',
    bankAccount: '0950',
  },
  {
    id: 'TXN-20260722-4b8e8d89',
    type: '法币转入',
    account: '新加坡账户',
    amount: 200,
    currency: 'SGD',
    status: '已完成',
    date: '2026-07-22',
    time: '16:16:44',
    summary: '-',
    customer: 'YAQI WAN',
    customerId: 'AC-202607-05161f0a',
    fee: '0.00 SGD',
    bankName: 'Green Link Digital Bank',
    bankAccount: '0950',
  },
  {
    id: 'TXN-20260722-525f4654',
    type: '法币转入',
    account: '香港账户',
    amount: 111,
    currency: 'USD',
    status: '已完成',
    date: '2026-07-22',
    time: '14:10:34',
    summary: '-',
    customer: 'YAQI WAN',
    customerId: 'AC-202607-05161f0a',
    fee: '0.00 USD',
    bankName: 'Bank of China (Hong Kong)',
    bankAccount: '8888',
  },
]

const otcPrototypeNavLabels = ['仪表板', '账户', '交易']

const assetTrendRanges = {
  week: {
    label: '每周',
    labels: ['7/16', '7/17', '7/18', '7/19', '7/20', '7/21', '7/22'],
    values: [15901.28, 15901.28, 15896.42, 15780.31, 15386.74, 14792.18, 14334.32],
  },
  month: {
    label: '每月',
    labels: ['6/22', '6/27', '7/02', '7/07', '7/12', '7/17', '7/22'],
    values: [15120.8, 15482.42, 15890.15, 15745.62, 16008.91, 15520.48, 14334.32],
  },
  quarter: {
    label: '近三个月',
    labels: ['5/01', '5/15', '6/01', '6/15', '7/01', '7/10', '7/22'],
    values: [13980.15, 14560.44, 14980.72, 15720.86, 16240.18, 15380.61, 14334.32],
  },
}

function PrototypeBar({ onBack }) {
  return (
    <div className="border-b border-blue-100 bg-blue-50/95 px-5 py-3">
      <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="text-sm font-semibold text-blue-700 hover:text-blue-900">
          返回 不同的银行账户体系下做OTC与转账给其他用户原型
        </button>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">仅原型演示使用</span>
          <span className="hidden text-xs text-slate-500 sm:inline">本地模拟数据，不产生真实交易</span>
        </div>
      </div>
    </div>
  )
}

function formatAssetAmount(value, code) {
  if (!Number.isFinite(Number(value))) return '—'
  if (code === 'BTC') return Number(value).toFixed(8)
  if (code === 'JPY') return Number(value).toFixed(0)
  return Number(value).toFixed(2)
}

function AssetTrendChart() {
  const [range, setRange] = useState('week')
  const trend = assetTrendRanges[range]
  const chart = useMemo(() => {
    const width = 860
    const height = 230
    const left = 58
    const right = 842
    const top = 16
    const bottom = 194
    const rawMin = Math.min(...trend.values)
    const rawMax = Math.max(...trend.values)
    const min = Math.floor((rawMin - 300) / 1000) * 1000
    const max = Math.ceil((rawMax + 200) / 1000) * 1000
    const span = Math.max(max - min, 1)
    const points = trend.values.map((value, index) => ({
      x: left + (index / (trend.values.length - 1)) * (right - left),
      y: bottom - ((value - min) / span) * (bottom - top),
      value,
    }))
    const linePath = points.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ')
    const areaPath = `${linePath} L ${points.at(-1).x} ${bottom} L ${points[0].x} ${bottom} Z`
    const ticks = Array.from({ length: 5 }, (_, index) => max - (index * span) / 4)

    return { width, height, left, right, top, bottom, points, linePath, areaPath, ticks }
  }, [trend])

  return (
    <div className="mt-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">统计</h2>
          <p className="mt-1 text-xs text-slate-400">总资产折合美元的变化趋势</p>
        </div>
        <select
          value={range}
          onChange={(event) => setRange(event.target.value)}
          aria-label="资产统计周期"
          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
        >
          {Object.entries(assetTrendRanges).map(([value, option]) => (
            <option key={value} value={value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-3 overflow-hidden rounded-md border border-slate-100 bg-slate-50/60">
        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          role="img"
          aria-label={`${trend.label}总资产趋势图`}
          className="block aspect-[860/230] min-h-[190px] w-full"
        >
          {chart.ticks.map((tick, index) => {
            const y = chart.top + (index / (chart.ticks.length - 1)) * (chart.bottom - chart.top)
            return (
              <g key={tick}>
                <line x1={chart.left} x2={chart.right} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 5" />
                <text x={chart.left - 10} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="11">
                  {(tick / 1000).toFixed(1)}k
                </text>
              </g>
            )
          })}

          <path d={chart.areaPath} fill="#dbeafe" fillOpacity="0.72" />
          <path d={chart.linePath} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {chart.points.map((point, index) => (
            <g key={trend.labels[index]}>
              <circle cx={point.x} cy={point.y} r="3.5" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
              <text x={point.x} y={chart.bottom + 23} textAnchor="middle" fill="#94a3b8" fontSize="11">
                {trend.labels[index]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

function CurrencyPicker({ assets, selectedCode, excludedCode, onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const filteredAssets = assets.filter((asset) => (
    asset.code !== excludedCode
    && `${asset.code} ${asset.name} ${asset.network || ''}`.toLowerCase().includes(query.trim().toLowerCase())
  ))

  return (
    <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-[min(390px,calc(100vw-72px))] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <span className="text-sm font-semibold text-slate-900">选择资产</span>
        <button type="button" onClick={onClose} aria-label="关闭币种列表" className="rounded-md p-1 text-slate-400 hover:bg-slate-100">
          <X className="h-4 w-4" />
        </button>
      </div>
      <label className="mx-3 mb-2 flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 focus-within:border-blue-500">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索币种"
          autoFocus
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </label>
      <div className="max-h-[310px] overflow-y-auto">
        {filteredAssets.map((asset) => {
          const selected = selectedCode === asset.code
          return (
            <button
              key={`${asset.code}-${asset.network || ''}`}
              type="button"
              onClick={() => onSelect(asset.code)}
              className={`flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-left hover:bg-slate-50 ${selected ? 'bg-blue-50' : ''}`}
            >
              <CurrencyIcon currency={asset.code} className="h-8 w-8 text-[10px]" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-800">{asset.code}</span>
                <span className="block truncate text-xs text-slate-500">{asset.network || asset.name}</span>
              </span>
              <span className={`text-sm font-semibold ${selected ? 'text-blue-600' : 'text-slate-600'}`}>
                {formatAssetAmount(asset.balance, asset.code)}
              </span>
              {selected ? <CheckCircle2 className="h-4 w-4 text-blue-600" /> : null}
            </button>
          )
        })}
        {!filteredAssets.length ? <div className="px-4 py-8 text-center text-sm text-slate-500">没有匹配币种</div> : null}
      </div>
    </div>
  )
}

function AssetExchangeModal({ onClose }) {
  const [accountId, setAccountId] = useState('hk')
  const [sellCode, setSellCode] = useState('BTC')
  const [buyCode, setBuyCode] = useState('CNY')
  const [sellAmount, setSellAmount] = useState('')
  const [picker, setPicker] = useState('')
  const [quote, setQuote] = useState(null)

  const account = accountOptions.find((item) => item.id === accountId) || accountOptions[0]
  const sellAsset = account.assets.find((asset) => asset.code === sellCode)
  const buyAsset = account.assets.find((asset) => asset.code === buyCode)
  const numericAmount = Number(sellAmount)
  const amountError = sellAmount && (!Number.isFinite(numericAmount) || numericAmount <= 0)
    ? '卖出金额必须大于 0'
    : sellAsset && numericAmount > sellAsset.balance
      ? '卖出金额不能超过可用余额'
      : ''
  const canQuote = Boolean(sellAsset && buyAsset && sellCode !== buyCode && sellAmount && !amountError)

  const changeAccount = (nextAccountId) => {
    setAccountId(nextAccountId)
    setSellCode('')
    setBuyCode('')
    setSellAmount('')
    setQuote(null)
    setPicker('')
  }

  const changeCurrency = (type, currencyCode) => {
    if (type === 'sell') setSellCode(currencyCode)
    if (type === 'buy') setBuyCode(currencyCode)
    setPicker('')
    setQuote(null)
  }

  const swapCurrencies = () => {
    if (!sellCode || !buyCode) return
    setSellCode(buyCode)
    setBuyCode(sellCode)
    setSellAmount('')
    setQuote(null)
    setPicker('')
  }

  const getQuote = () => {
    if (!canQuote) return
    const marketRate = assetPrices[sellCode] / assetPrices[buyCode]
    const feeRate = 0.001
    const fee = numericAmount * feeRate
    const receiveAmount = numericAmount * (1 - feeRate) * marketRate

    setQuote({
      marketRate,
      receiveAmount,
      fee,
      expiresIn: '30 秒',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/55 p-4" onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose()
    }}>
      <section role="dialog" aria-modal="true" aria-labelledby="exchange-title" className="my-auto w-full max-w-[760px] overflow-visible rounded-xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="exchange-title" className="text-base font-semibold text-slate-900">资产兑换</h2>
            <p className="mt-1 text-xs text-slate-500">实时询价，到账金额以最终确认为准</p>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭兑换弹窗" className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-4 px-5 py-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">兑换账户</span>
            <div className="relative">
              <select
                value={accountId}
                onChange={(event) => changeAccount(event.target.value)}
                className="h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {accountOptions.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.accountNumber}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-4 h-4 w-4 text-slate-400" />
            </div>
          </label>

          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
            <span className="text-slate-500">当前账户能力</span>
            <Badge variant={account.statusTone}>{account.status}</Badge>
          </div>

          <div className="relative rounded-xl border border-slate-200">
            <div className="relative border-b border-slate-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">你卖出</span>
                <span className="text-xs text-slate-500">
                  可用余额：{sellAsset ? `${formatAssetAmount(sellAsset.balance, sellAsset.code)} ${sellAsset.code}` : '—'}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPicker(picker === 'sell' ? '' : 'sell')}
                  className="flex min-w-[190px] items-center gap-3 rounded-lg p-1 text-left hover:bg-slate-50"
                >
                  {sellAsset ? <CurrencyIcon currency={sellAsset.code} className="h-9 w-9 text-[11px]" /> : <span className="h-9 w-9 rounded-full bg-slate-100" />}
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">{sellAsset?.code || '选择币种'}</span>
                    <span className="block text-xs text-slate-500">{sellAsset?.network || sellAsset?.name || '请选择卖出资产'}</span>
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
                <input
                  value={sellAmount}
                  onChange={(event) => {
                    setSellAmount(event.target.value)
                    setQuote(null)
                  }}
                  inputMode="decimal"
                  placeholder="0.00"
                  className="min-w-0 flex-1 bg-transparent text-right text-xl font-semibold text-slate-900 outline-none placeholder:text-slate-300"
                />
              </div>
              {picker === 'sell' ? (
                <CurrencyPicker
                  assets={account.assets}
                  selectedCode={sellCode}
                  excludedCode={buyCode}
                  onSelect={(code) => changeCurrency('sell', code)}
                  onClose={() => setPicker('')}
                />
              ) : null}
            </div>

            <button
              type="button"
              onClick={swapCurrencies}
              disabled={!sellCode || !buyCode}
              aria-label="交换卖出和获得币种"
              className="absolute left-1/2 top-1/2 z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-md hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              <ArrowDownUp className="h-4 w-4" />
            </button>

            <div className="relative px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">你获得</span>
                <span className="text-xs text-slate-500">
                  可用余额：{buyAsset ? `${formatAssetAmount(buyAsset.balance, buyAsset.code)} ${buyAsset.code}` : '—'}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPicker(picker === 'buy' ? '' : 'buy')}
                  className="flex min-w-[190px] items-center gap-3 rounded-lg p-1 text-left hover:bg-slate-50"
                >
                  {buyAsset ? <CurrencyIcon currency={buyAsset.code} className="h-9 w-9 text-[11px]" /> : <span className="h-9 w-9 rounded-full bg-slate-100" />}
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">{buyAsset?.code || '选择币种'}</span>
                    <span className="block text-xs text-slate-500">{buyAsset?.network || buyAsset?.name || '请选择获得资产'}</span>
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
                <div className="min-w-0 flex-1 text-right text-xl font-semibold text-slate-900">
                  {quote ? formatAssetAmount(quote.receiveAmount, buyCode) : <span className="text-slate-300">0.00</span>}
                </div>
              </div>
              {picker === 'buy' ? (
                <CurrencyPicker
                  assets={account.assets}
                  selectedCode={buyCode}
                  excludedCode={sellCode}
                  onSelect={(code) => changeCurrency('buy', code)}
                  onClose={() => setPicker('')}
                />
              ) : null}
            </div>
          </div>

          {amountError ? <p className="text-xs font-semibold text-red-600">{amountError}</p> : null}

          <dl className="grid grid-cols-[110px_1fr] gap-y-3 text-sm">
            <dt className="text-slate-500">预计汇率</dt>
            <dd className="text-right font-semibold text-slate-700">
              {quote ? `1 ${sellCode} ≈ ${quote.marketRate.toFixed(6)} ${buyCode}` : '—'}
            </dd>
            <dt className="text-slate-500">预计到账</dt>
            <dd className="text-right font-semibold text-slate-700">
              {quote ? `${formatAssetAmount(quote.receiveAmount, buyCode)} ${buyCode}` : '—'}
            </dd>
            <dt className="text-slate-500">手续费</dt>
            <dd className="text-right font-semibold text-slate-700">
              {quote ? `${formatAssetAmount(quote.fee, sellCode)} ${sellCode}` : '—'}
            </dd>
            <dt className="text-slate-500">报价有效期</dt>
            <dd className="text-right font-semibold text-slate-700">{quote?.expiresIn || '—'}</dd>
          </dl>

          <Button type="button" onClick={getQuote} disabled={!canQuote} className="h-11 w-full rounded-lg">
            {quote ? '重新获取报价' : '获取报价'}
          </Button>
          <p className="text-center text-xs text-slate-500">报价仅供参考，最终成交金额以确认页为准。</p>
        </div>
      </section>
    </div>
  )
}

function DashboardPage({ onBack, onNavSelect, onOpenExchange, transactionRecords }) {
  const dashboardAssets = accountOptions.flatMap((account) => account.assets
    .filter((asset) => !['BTC', 'USDT'].includes(asset.code))
    .slice(0, 3)
    .map((asset) => ({ ...asset, account: account.name })))

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-950">
      <PrototypeBar onBack={onBack} />
      <ClientTopNav
        onBack={onBack}
        activeNavLabel="仪表板"
        onNavSelect={onNavSelect}
        clickableNavLabels={otcPrototypeNavLabels}
      />

      <main className="mx-auto max-w-[1380px] space-y-5 px-5 py-6">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_440px]">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-5 sm:flex-row">
              <div>
                <p className="text-sm text-slate-500">总资产</p>
                <div className="mt-2 text-4xl font-semibold tracking-normal text-slate-800">$14,334.32</div>
                <p className="mt-2 text-sm text-red-500">-$1,566.96 · -9.85%</p>
              </div>
              <div className="flex items-start gap-4">
                <button type="button" onClick={onOpenExchange} className="group flex flex-col items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100">
                    <RefreshCw className="h-5 w-5" />
                  </span>
                  兑换
                </button>
                <button type="button" className="group flex flex-col items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500 group-hover:bg-rose-100">
                    <Send className="h-5 w-5" />
                  </span>
                  发送
                </button>
                <button type="button" className="group flex flex-col items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100">
                    <ArrowDownLeft className="h-5 w-5" />
                  </span>
                  接收
                </button>
              </div>
            </div>

            <AssetTrendChart />
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">最近交易</h2>
                <p className="mt-1 text-xs text-slate-500">查看最近的资金变动</p>
              </div>
              <button type="button" onClick={() => onNavSelect('交易')} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                查看全部
              </button>
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              {transactionRecords.slice(0, 5).map((record) => (
                <button key={record.id} type="button" onClick={() => onNavSelect('交易')} className="flex w-full items-center gap-3 py-3 text-left hover:bg-slate-50">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${record.amount > 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>
                    {record.amount > 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">{record.type}</span>
                    <span className="block truncate text-xs text-slate-500">{record.account} · {record.time}</span>
                  </span>
                  <span className={`text-sm font-semibold ${record.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {record.amount > 0 ? '+' : ''}{record.amount} {record.currency}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">账户资产</h2>
              <p className="mt-1 text-xs text-slate-500">不同银行账户体系下的可用资产</p>
            </div>
            <Button type="button" onClick={onOpenExchange} size="sm" className="rounded-lg">
              <RefreshCw className="h-4 w-4" />
              兑换
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[820px] w-full border-collapse text-left">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
                <tr>
                  <th className="px-5 py-3">资产</th>
                  <th className="px-5 py-3">所属账户</th>
                  <th className="px-5 py-3">可用余额</th>
                  <th className="px-5 py-3">参考价格</th>
                  <th className="px-5 py-3">价值（USD）</th>
                  <th className="px-5 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {dashboardAssets.map((asset) => (
                  <tr key={`${asset.account}-${asset.code}`} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-3 font-semibold text-slate-800">
                        <CurrencyIcon currency={asset.code} className="h-7 w-7 text-[10px]" />
                        {asset.code}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{asset.account}</td>
                    <td className="px-5 py-4 font-medium text-slate-700">{formatAssetAmount(asset.balance, asset.code)}</td>
                    <td className="px-5 py-4 text-slate-600">${assetPrices[asset.code]?.toFixed(4)}</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">${(asset.balance * assetPrices[asset.code]).toFixed(2)}</td>
                    <td className="px-5 py-4 text-right">
                      <button type="button" onClick={onOpenExchange} className="font-semibold text-blue-600 hover:text-blue-800">兑换</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

function TransactionDetailDrawer({ record, onClose }) {
  if (!record) return null
  const pending = record.status === '待处理'
  const isUserTransfer = record.type === '转账给其他用户'

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/45" onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose()
    }}>
      <aside className="ml-auto flex h-full w-full max-w-[450px] flex-col bg-[#f7faff] shadow-2xl">
        <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-5">
          <div className="flex items-center gap-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${pending ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'}`}>
              {pending ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
            </span>
            <h2 className="text-sm font-semibold text-slate-900">{record.type} 详情</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭交易详情" className="rounded-md p-2 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 text-center shadow-sm">
            <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${pending ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'}`}>
              {pending ? <Clock3 className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
            </span>
            <div className="mt-3 text-sm text-slate-600">{record.status}</div>
            <div className={`mt-2 text-2xl font-semibold ${record.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {record.amount > 0 ? '+' : ''}{record.amount.toFixed(2)} <span className="text-sm text-slate-600">{record.currency}</span>
            </div>
            <div className="mt-2 text-sm text-slate-500">手续费：{record.fee}</div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-600">支取账户</h3>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                <Landmark className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-900">{record.customer}</div>
                <div className="mt-1 text-xs text-slate-500">{record.customerId}</div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-600">指示详情</h3>
            <dl className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
              {[
                ['创建日期', `${record.date} ${record.time}`],
                ['交易编号', record.id],
                ['审核时间', pending ? '-' : `${record.date} ${record.time}`],
                ['账户类型', record.account],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="flex items-center gap-2 text-right font-medium text-slate-900">
                    {value}
                    {label === '交易编号' ? <Copy className="h-3.5 w-3.5 text-slate-400" /> : null}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-600">
              {isUserTransfer ? '收款用户' : '收款银行账户'}
            </h3>
            <dl className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
              {(isUserTransfer
                ? [
                    ['用户名称', record.recipientName],
                    ['用户邮箱', record.recipientEmail],
                    ['处理方式', '平台用户转账'],
                  ]
                : [
                    ['账户持有人姓名', record.customer],
                    ['银行名称', record.bankName],
                    ['银行账号', record.bankAccount],
                  ]
              ).map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="font-medium text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </aside>
    </div>
  )
}

function TransactionsPage({ onBack, onNavSelect, transactionRecords }) {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('全部')
  const [statusFilter, setStatusFilter] = useState('全部')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const filteredTransactions = useMemo(() => transactionRecords.filter((record) => {
    const searchableText = [
      record.id,
      record.type,
      record.account,
      record.currency,
      record.summary,
      record.recipientName,
      record.recipientEmail,
    ].filter(Boolean).join(' ').toLowerCase()
    const matchesQuery = !query.trim() || searchableText.includes(query.trim().toLowerCase())
    const matchesType = typeFilter === '全部' || record.type === typeFilter
    const matchesStatus = statusFilter === '全部' || record.status === statusFilter
    return matchesQuery && matchesType && matchesStatus
  }), [query, statusFilter, transactionRecords, typeFilter])
  const groupedTransactions = useMemo(() => {
    const groups = new Map()
    filteredTransactions.forEach((record) => {
      const records = groups.get(record.date) || []
      records.push(record)
      groups.set(record.date, records)
    })
    return Array.from(groups.entries())
  }, [filteredTransactions])

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-950">
      <PrototypeBar onBack={onBack} />
      <ClientTopNav
        onBack={onBack}
        activeNavLabel="交易"
        onNavSelect={onNavSelect}
        clickableNavLabels={otcPrototypeNavLabels}
      />

      <main className="mx-auto max-w-[1340px] px-5 py-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">交易流水</h1>
            <p className="mt-1 text-sm text-slate-500">查看和管理您账户内的所有资产交易记录</p>
          </div>
          <label className="flex h-10 w-full items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 shadow-sm sm:w-[260px]">
            <Search className="h-4 w-4 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索交易编号或收款用户" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          </label>
        </div>

        <section className="mt-4 flex flex-wrap gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            类型：
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="bg-transparent font-normal outline-none">
              <option value="全部">所有类型</option>
              <option value="法币转入">法币转入</option>
              <option value="法币转出">法币转出</option>
              <option value="转账给其他用户">转账给其他用户</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            状态：
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="bg-transparent font-normal outline-none">
              <option value="全部">所有状态</option>
              <option value="待处理">待处理</option>
              <option value="已完成">已完成</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            时间：
            <select className="bg-transparent font-normal outline-none">
              <option>全部时间</option>
              <option>最近7天</option>
              <option>最近30天</option>
            </select>
          </label>
        </section>

        <section className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse text-left">
              <thead className="bg-slate-50 text-xs font-medium text-slate-500">
                <tr>
                  <th className="px-6 py-4">交易类型</th>
                  <th className="px-6 py-4">账户类型</th>
                  <th className="px-6 py-4">交易金额</th>
                  <th className="px-6 py-4">状态</th>
                  <th className="px-6 py-4">时间</th>
                  <th className="px-6 py-4">交易编号</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length ? (
                  <>
                    {groupedTransactions.map(([date, records]) => {
                      const [, month, day] = date.split('-')
                      return (
                        <Fragment key={date}>
                          <tr className="border-t border-slate-100 bg-slate-50/70">
                            <td colSpan={6} className="px-6 py-3 text-sm font-semibold text-slate-600">
                              {Number(month)}月{Number(day)}日
                            </td>
                          </tr>
                          {records.map((record) => (
                            <tr key={record.id} onClick={() => setSelectedRecord(record)} className="cursor-pointer border-t border-slate-100 text-sm hover:bg-blue-50/40">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${record.amount > 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>
                                    {record.amount > 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                  </span>
                                  <div>
                                    <div className="font-semibold text-slate-800">{record.type}</div>
                                    <div className="mt-1 max-w-[180px] truncate text-xs text-slate-500">{record.summary}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-slate-600">{record.account}</td>
                              <td className={`px-6 py-4 font-semibold ${record.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                                {record.amount > 0 ? '+' : ''}{record.amount.toFixed(2)} {record.currency}
                              </td>
                              <td className="px-6 py-4"><Badge variant={record.status === '已完成' ? 'success' : 'warning'}>{record.status}</Badge></td>
                              <td className="px-6 py-4 text-slate-600">
                                <div>{record.date}</div>
                                <div className="mt-1 text-xs text-slate-400">{record.time}</div>
                              </td>
                              <td className="px-6 py-4 font-mono text-xs text-slate-600">{record.id}</td>
                            </tr>
                          ))}
                        </Fragment>
                      )
                    })}
                  </>
                ) : (
                  <tr><td colSpan={6} className="px-6 py-14 text-center text-sm text-slate-500">没有找到匹配的交易记录</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <TransactionDetailDrawer record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </div>
  )
}

export function OtcBankAccountPrototype({ onBack }) {
  const [activePage, setActivePage] = useState('仪表板')
  const [exchangeOpen, setExchangeOpen] = useState(false)
  const [transactionRecords, setTransactionRecords] = useState(() => initialTransactions)

  const selectNav = (label) => {
    if (label === '仪表板' || label === '账户' || label === '交易') {
      setActivePage(label)
    }
  }

  const addUserTransferTransaction = (transfer) => {
    const [date, rawTime = '00:00'] = transfer.createdAt.split(' ')
    const time = rawTime.length === 5 ? `${rawTime}:00` : rawTime
    const nextTransaction = {
      id: transfer.id,
      type: '转账给其他用户',
      account: transfer.accountLabel,
      amount: -Math.abs(Number(transfer.amountValue)),
      currency: transfer.currency,
      status: '待处理',
      date,
      time,
      summary: `${transfer.recipientName} · ${transfer.recipientEmail}`,
      customer: 'YAQI WAN',
      customerId: 'AC-202607-05161f0a',
      fee: `0.00 ${transfer.currency}`,
      recipientName: transfer.recipientName,
      recipientEmail: transfer.recipientEmail,
    }

    setTransactionRecords((current) => (
      current.some((record) => record.id === nextTransaction.id)
        ? current
        : [nextTransaction, ...current]
    ))
  }

  if (activePage === '账户') {
    return (
      <BaasOpeningPrototype
        onBack={onBack}
        onPrototypeHome={onBack}
        initialStatus="opened"
        prototypeLabel="不同的银行账户体系下做OTC与转账给其他用户原型"
        showGuidanceMarks={false}
        enableUserTransfer
        forceUserTransferMark
        topNavActiveLabel="账户"
        onTopNavSelect={selectNav}
        topNavClickableLabels={otcPrototypeNavLabels}
        onUserTransferSubmitted={addUserTransferTransaction}
      />
    )
  }

  if (activePage === '交易') {
    return (
      <TransactionsPage
        onBack={onBack}
        onNavSelect={selectNav}
        transactionRecords={transactionRecords}
      />
    )
  }

  return (
    <>
      <DashboardPage
        onBack={onBack}
        onNavSelect={selectNav}
        onOpenExchange={() => setExchangeOpen(true)}
        transactionRecords={transactionRecords}
      />
      {exchangeOpen ? <AssetExchangeModal onClose={() => setExchangeOpen(false)} /> : null}
    </>
  )
}
