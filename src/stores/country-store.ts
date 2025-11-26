import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useCurrencyConversionStore } from './index'

export interface Country {
  id: number
  country: string
  code: string
  currency: string
  create_time: string
}

interface CountryState {
  selectedCountry: Country | null
  setSelectedCountry: (country: Country | null) => void
  clearSelectedCountry: () => void
}

export const useCountryStore = create<CountryState>()(
  persist(
    (set) => ({
      selectedCountry: null,
      setSelectedCountry: (country) => {
        set({ selectedCountry: country })
        useCurrencyConversionStore.getState().clearDisplayCurrency()
      },
      clearSelectedCountry: () => set({ selectedCountry: null }),
    }),
    {
      name: 'country-storage', // localStorage key
    }
  )
)
