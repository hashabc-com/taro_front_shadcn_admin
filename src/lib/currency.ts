import { useCountryStore } from '@/stores/country-store'
import { useExchangeRatesStore } from '@/stores/exchange-rates-store'

// 支持的货币列表
export const SUPPORTED_CURRENCIES = ['CNY', 'EUR', 'GBP', 'HKD', 'USD'] as const
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number]

// 需要进行货币转换的字段名（支持嵌套，如 'data.amount'）
export const CURRENCY_FIELDS = [
  'amount',
  'money',
  'availableAmount',
  'availableAmountTwo',
  'frozenAmountTwo',
  'rechargeAmountTwo',
  'rechargeAmount',
  'withdrawalAmount',
  'collectAmount',
  'payoutAmount',
  'collectServiceAmount',
  'payoutServiceAmount',
] as const

/**
 * 获取汇率数据并存储到 store
 * @param baseCurrency 基准货币，默认使用当前国家货币
 */
export async function fetchAndStoreExchangeRates(baseCurrency?: string): Promise<void> {
  const base = baseCurrency || useCountryStore.getState().selectedCountry?.currency || 'IDR'
  const store = useExchangeRatesStore.getState()
  
  // 检查是否需要重新获取（1小时内的缓存有效）
  const now = Date.now()
  const CACHE_DURATION = 3600000 // 1小时
  
  if (
    store.baseCurrency === base &&
    store.lastFetchTime > 0 &&
    now - store.lastFetchTime < CACHE_DURATION
  ) {
    // 缓存有效，不需要重新获取
    return
  }

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${base}`)
    const data = await response.json()
    
    if (data.result === 'success' && data.rates) {
      store.setRates(data.rates, base)
      console.log(`汇率已更新 [基准: ${base}]`)
    }
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)
    
    // 如果是首次获取失败，使用默认汇率
    if (!store.baseCurrency) {
      store.setRates(
        {
          USD: 1,
          CNY: 7.09,
          EUR: 0.87,
          GBP: 0.76,
          HKD: 7.78,
          IDR: 16626.67,
        },
        'IDR'
      )
    }
  }
}

/**
 * 货币转换
 * @param amount 金额
 * @param fromCurrency 源货币
 * @param toCurrency 目标货币
 * @returns 转换后的金额
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount
  }

  // 确保汇率已加载
  await fetchAndStoreExchangeRates(fromCurrency)
  
  const store = useExchangeRatesStore.getState()
  
  // 如果 store 中的基准货币与源货币不匹配，重新获取
  if (store.baseCurrency !== fromCurrency) {
    await fetchAndStoreExchangeRates(fromCurrency)
  }
  
  // 从源货币到目标货币的汇率
  const toRate = store.rates[toCurrency] || 1

  // 直接转换
  const convertedAmount = amount * toRate

  return convertedAmount
}

/**
 * 获取当前选择国家的货币符号
 */
export function useCurrency() {
  const selectedCountry = useCountryStore((state) => state.selectedCountry)
  return selectedCountry?.currency || 'IDR'
}

/**
 * 格式化金额，添加货币符号
 * @param amount 金额
 * @param currency 货币符号（可选，默认使用当前国家货币）
 * @returns 格式化后的金额字符串
 */
export function formatCurrency(amount: string | number, currency?: string): string {
  const selectedCountry = useCountryStore.getState().selectedCountry
  const currencySymbol = currency || selectedCountry?.currency || 'IDR'
  
  // 如果金额是字符串，直接使用；如果是数字，转为字符串
  const amountStr = typeof amount === 'number' ? amount.toFixed(2) : amount
  
  return `${currencySymbol} ${amountStr}`
}

/**
 * 获取当前货币符号（非 Hook 版本）
 */
export function getCurrencySymbol(): string {
  const selectedCountry = useCountryStore.getState().selectedCountry
  return selectedCountry?.currency || 'IDR'
}
