import { useMemo } from 'react'
import { useCountryStore } from '@/stores'

export function useConvertAmount() {
  const { rates, displayCurrency } = useCountryStore()
  const convertValue = useMemo(() => {
    return (value: number | string, showCurrency: boolean = true) => {
      if (!displayCurrency) {
        return value
      }

      const rate = rates[displayCurrency]
      if (!rate) return value

      const numValue = typeof value === 'string' ? parseFloat(value) : value
      if (isNaN(numValue)) return value

      return showCurrency
        ? `${displayCurrency} ${new Intl.NumberFormat().format(numValue * rate)}`
        : new Intl.NumberFormat().format(numValue * rate)
    }
  }, [displayCurrency, rates])

  return convertValue
}
