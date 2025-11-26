import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ExchangeRatesState {
  rates: Record<string, number> // 汇率数据
  baseCurrency: string // 基准货币
  lastFetchTime: number // 最后获取时间
  setRates: (rates: Record<string, number>, baseCurrency: string) => void
  clearRates: () => void
}

export const useExchangeRatesStore = create<ExchangeRatesState>()(
  persist(
    (set) => ({
      rates: {},
      baseCurrency: '',
      lastFetchTime: 0,
      setRates: (rates, baseCurrency) =>
        set({
          rates,
          baseCurrency,
          lastFetchTime: Date.now(),
        }),
      clearRates: () =>
        set({
          rates: {},
          baseCurrency: '',
          lastFetchTime: 0,
        }),
    }),
    {
      name: 'exchange-rates-storage',
    }
  )
)
