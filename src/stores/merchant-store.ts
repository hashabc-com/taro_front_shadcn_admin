import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Merchant {
  id: number | null
  customerName: string | null
  appid: string
  secretKey: string | null
  companyName: string
  account: string | null
  password: string | null
  status: string | null
  slat: string | null
  email: string | null
  address: string | null
  country: string | null
  provice: string | null
  city: string | null
  zipcode: string | null
  phoneNumber: string | null
  mobile: string | null
  createTime: string | null
  updateTime: string | null
  fistName: string | null
  lastName: string | null
  middleName: string | null
  payoutServiceRate: number | null
  payoutServiceFee: number | null
  collectionServiceFee: number | null
  collectionServiceRate: number | null
  codePrefix: string | null
  freezeType: string | null
  accountFreezeDay: number | null
  taxRate: number | null
  bankServiceFree: number | null
  gauthKey: string | null
  timeZone: string | null
  currency: string | null
}

interface MerchantState {
  selectedMerchant: Merchant | null
  setSelectedMerchant: (merchant: Merchant | null) => void
  clearSelectedMerchant: () => void
}

export const useMerchantStore = create<MerchantState>()(
  persist(
    (set) => ({
      selectedMerchant: null,
      setSelectedMerchant: (merchant) => set({ selectedMerchant: merchant }),
      clearSelectedMerchant: () => set({ selectedMerchant: null }),
    }),
    {
      name: 'merchant-storage', // localStorage key
    }
  )
)
