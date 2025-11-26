import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SupportedCurrency } from '@/lib/currency'

interface CurrencyConversionState {
  displayCurrency: SupportedCurrency | null // 当前显示的货币
  setDisplayCurrency: (currency: SupportedCurrency | null) => void
  clearDisplayCurrency: () => void
}

export const useCurrencyConversionStore = create<CurrencyConversionState>()(
  persist(
    (set) => ({
      displayCurrency: null, // null 表示使用国家默认货币
      setDisplayCurrency: (currency) => set({ displayCurrency: currency }),
      clearDisplayCurrency: () => set({ displayCurrency: null }),
    }),
    {
      name: 'currency-conversion-storage',
    }
  )
)
