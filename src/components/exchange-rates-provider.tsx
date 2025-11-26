import { useEffect } from 'react'
import { useCountryStore } from '@/stores/country-store'
import { useCurrencyConversionStore } from '@/stores/currency-conversion-store'
import { fetchAndStoreExchangeRates } from '@/lib/currency'

/**
 * 汇率数据提供者组件
 * 负责在页面加载和国家切换时自动获取汇率数据
 */
export function ExchangeRatesProvider({ children }: { children: React.ReactNode }) {
  const selectedCountry = useCountryStore((state) => state.selectedCountry)
  const displayCurrency = useCurrencyConversionStore((state) => state.displayCurrency)

  useEffect(() => {
    // 页面加载时或国家切换时，获取当前国家货币的汇率
    const baseCurrency = selectedCountry?.currency || 'IDR'
    fetchAndStoreExchangeRates(baseCurrency)
  }, [selectedCountry?.currency])

  useEffect(() => {
    // 当切换显示货币时，触发数据重新获取（通过重新渲染组件来触发）
    // 这里我们不直接调用 API，而是依赖组件重新请求数据
    // 因为汇率已经在 store 中，拦截器会自动使用最新的汇率进行转换
    if (displayCurrency) {
      console.log(`显示货币已切换至: ${displayCurrency}`)
    }
  }, [displayCurrency])

  return <>{children}</>
}
