import { SUPPORTED_CURRENCIES, useCountryStore } from '@/stores/country-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// 货币对应的国家代码映射
const currencyToCountryCode: Record<string, string> = {
  IDR: 'ID',
  VND: 'VN',
  PHP: 'PH',
  BRL: 'BR',
  MXN: 'MX',
  BDT: 'BD',
  CNY: 'CN',
  USD: 'US',
  EUR: 'EU',
  GBP: 'GB',
  HKD: 'HK',
}

export function CurrencySelector() {
  const { displayCurrency, selectedCountry, setDisplayCurrency } =
    useCountryStore()
  const defaultCurrency = selectedCountry?.currency

  return (
    <Select value={displayCurrency ?? ''} onValueChange={setDisplayCurrency}>
      <SelectTrigger className='h-9 w-full sm:w-[140px]' clearable={false}>
        <SelectValue placeholder='选择货币'>
          {displayCurrency && (
            <div className='flex items-center gap-2'>
              <img
                src={`/images/${currencyToCountryCode[displayCurrency] || selectedCountry?.code}.svg`}
                alt={displayCurrency}
                className='h-4 w-4'
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <span>{displayCurrency}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={defaultCurrency as string}>
          <div className='flex items-center gap-2'>
            <img
              src={`/images/${selectedCountry?.code}.svg`}
              alt={defaultCurrency}
              className='h-4 w-4'
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <span>{defaultCurrency}</span>
          </div>
        </SelectItem>
        {SUPPORTED_CURRENCIES.map((currency) => {
          const countryCode = currencyToCountryCode[currency]
          return (
            <SelectItem key={currency} value={currency}>
              <div className='flex items-center gap-2'>
                <img
                  src={`/images/${countryCode}.svg`}
                  alt={currency}
                  className='h-4 w-4'
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <span>{currency}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
