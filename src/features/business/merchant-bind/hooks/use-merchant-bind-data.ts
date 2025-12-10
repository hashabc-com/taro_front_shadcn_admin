import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { getBusinessBindList } from '@/api/business'
import { useCountryStore,useMerchantStore } from '@/stores'

const route = getRouteApi('/_authenticated/business/merchant-bind')

export function useMerchantBindData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['business-bind-list', search, selectedCountry?.code, selectedMerchant?.appid],
    queryFn: async () => {
      const response = await getBusinessBindList(search)
      return response?.result || { listRecord: [], totalRecord: 0 }
    },
    enabled: !!selectedCountry,
  })

  return {
    data: data?.listRecord || [],
    totalRecord: data?.totalRecord || 0,
    isLoading,
    refetch,
  }
}
