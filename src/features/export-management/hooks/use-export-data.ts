import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getExportList } from '@/api/export'

const route = getRouteApi('/_authenticated/export-management')

export function useExportData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'exportList',
      search,
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: () => getExportList(search),
    enabled: !!selectedCountry,
    placeholderData: (prev) => prev ?? undefined,
  })

  return {
    exports: data?.result?.list ?? [],
    totalRecord: data?.result?.total ?? 0,
    isLoading,
    refetch,
  }
}
