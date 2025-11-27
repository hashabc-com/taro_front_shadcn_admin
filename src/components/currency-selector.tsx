import { SUPPORTED_CURRENCIES, useCountryStore } from '@/stores/country-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function CurrencySelector() {

  const { displayCurrency, selectedCountry, setDisplayCurrency } =
    useCountryStore()
  const defaultCurrency = selectedCountry?.currency

  return (
    <Select value={displayCurrency ?? ''} onValueChange={setDisplayCurrency}>
      <SelectTrigger className='h-9 w-full sm:w-[140px]'>
        <SelectValue placeholder='选择货币' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={defaultCurrency as string}>
          {defaultCurrency}
        </SelectItem>
        {SUPPORTED_CURRENCIES.map((currency) => (
          <SelectItem key={currency} value={currency}>
            {currency}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
