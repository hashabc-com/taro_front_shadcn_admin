import { useQuery } from '@tanstack/react-query'
import { getExchangeRate } from '@/api/fund'

export const useExchangeRate = () => {
  return useQuery({
    queryKey: ['exchangeRate'],
    queryFn: async () => {
      const response = await getExchangeRate()
      return response.result || {}
    },
  })
}
