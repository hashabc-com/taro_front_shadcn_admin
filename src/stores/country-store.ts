import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Country {
  id: string
  country: ISupportedCurrencyType
  code: string
  currency: string
  create_time: string
}

// 支持的货币列表
export const SUPPORTED_CURRENCIES = ['CNY', 'EUR', 'GBP', 'HKD', 'USD'] as const
export type ISupportedCurrencyType = (typeof SUPPORTED_CURRENCIES)[number]

interface CountryState {
  selectedCountry: Country | null
  displayCurrency?: ISupportedCurrencyType | null
  rates: Record<string, number>
  setRates: (rates: Record<string, number>) => void
  setSelectedCountry: (country: Country | null) => void
  setDisplayCurrency: (currency: ISupportedCurrencyType) => void
  clearSelectedCountry: () => void
}

export const useCountryStore = create<CountryState>()(
  persist(
    (set) => ({
      selectedCountry: null,
      displayCurrency: null,
      rates: {},
      setDisplayCurrency: (currency: ISupportedCurrencyType) => {
        set({ displayCurrency: currency })
      },
      setRates: (rates: Record<string, number>) => {
        set({ rates })
      },
      setSelectedCountry: (country) => {
        set({
          selectedCountry: country,
          displayCurrency: country?.currency as ISupportedCurrencyType,
        })
      },
      clearSelectedCountry: () => set({ selectedCountry: null }),
    }),
    {
      name: 'country-storage', // localStorage key
    }
  )
)
