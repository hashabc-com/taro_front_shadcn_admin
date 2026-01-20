import { useQuery } from '@tanstack/react-query'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getExchangeRate } from '@/api/fund'

export const useExchangeRate = () => {
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  return useQuery({
    queryKey: ['exchangeRate', selectedCountry?.code, selectedMerchant?.appid],
    queryFn: async () => {
      const response = await getExchangeRate()
      return response.result || {}
    },
  })
}
