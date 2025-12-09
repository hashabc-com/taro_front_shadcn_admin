import { useQuery } from '@tanstack/react-query'
import { getAccountAmount } from '@/api/fund'
import { useMerchantStore } from '@/stores/merchant-store'

export const useAccountAmount = () => {
  const { selectedMerchant } = useMerchantStore()

  return useQuery({
    queryKey: ['accountAmount', selectedMerchant?.appid],
    queryFn: async () => {
      const response = await getAccountAmount()
      return response.result || {}
    },
    enabled: !!selectedMerchant,
  })
}
