const currencyFlagSources = {
  CNY: '/currency-icons/china-flag-round-circle-icon.png',
  SGD: '/currency-icons/singapore-flag-round-circle-icon.png',
  USD: '/currency-icons/usa-flag-round-circle-icon.png',
}

const fallbackLabels = {
  BHD: 'BH',
  EUR: 'EU',
  HKD: 'HK',
}

const fallbackToneClass = {
  BHD: 'bg-red-700 text-white',
  CNY: 'bg-red-600 text-white',
  EUR: 'bg-blue-600 text-white',
  HKD: 'bg-red-500 text-white',
  SGD: 'bg-red-600 text-white',
  USD: 'bg-blue-700 text-white',
}

const sizeClass = {
  sm: 'h-[18px] w-[18px] text-[8px]',
  md: 'h-5 w-5 text-[9px]',
}

export function getCurrencyCode(currency) {
  return String(currency || '').trim().split(/\s+/)[0].toUpperCase()
}

export function CurrencyIcon({ currency, size = 'md', bordered = true, className = '' }) {
  const code = getCurrencyCode(currency)
  const src = currencyFlagSources[code]
  const borderClass = bordered ? 'border border-slate-200' : ''
  const classes = [
    'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white align-middle',
    sizeClass[size] || sizeClass.md,
    borderClass,
    className,
  ].filter(Boolean).join(' ')

  return (
    <span className={classes} aria-hidden="true">
      {src ? (
        <img src={src} alt="" className="block h-full w-full scale-[1.24] object-cover" />
      ) : (
        <span className={`flex h-full w-full items-center justify-center rounded-full font-bold leading-none ${fallbackToneClass[code] || 'bg-slate-500 text-white'}`}>
          {fallbackLabels[code] || code.slice(0, 2)}
        </span>
      )}
    </span>
  )
}
