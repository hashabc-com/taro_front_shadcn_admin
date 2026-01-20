import { useQuery } from '@tanstack/react-query'
import { useCountryStore } from '@/stores'
import { getAccountAmount } from '@/api/fund'
import { useMerchantStore } from '@/stores/merchant-store'

export const useAccountAmount = () => {
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()

  return useQuery({
    queryKey: ['accountAmount', selectedCountry?.code, selectedMerchant?.appid],
    queryFn: async () => {
      const response = await getAccountAmount()
      return response.result || {}
    },
    // enabled: !!selectedMerchant,
  })
}
