import { useQuery } from '@tanstack/react-query'
import { getExchangeRate } from '@/api/fund'
import { useCountryStore, useMerchantStore } from '@/stores'

export const useExchangeRate = () => {
  const { selectedCountry } = useCountryStore()
    const { selectedMerchant } = useMerchantStore()
  return useQuery({
    queryKey: ['exchangeRate',selectedCountry?.code, selectedMerchant?.appid],
    queryFn: async () => {
      const response = await getExchangeRate()
      return response.result || {}
    },
  })
}
