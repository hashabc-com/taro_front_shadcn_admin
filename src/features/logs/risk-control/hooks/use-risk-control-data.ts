import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getRiskControlRecordList } from '@/api/risk-control'

const route = getRouteApi('/_authenticated/logs/risk-control')

export function useRiskControlData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'riskControlRecord',
      search,
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: async () => getRiskControlRecordList(search),
    enabled: !!selectedCountry,
    placeholderData: (prev) => prev ?? undefined,
  })

  const datas = data?.result?.listRecord || []
  const totalRecord = data?.result?.totalRecord || 0

  return {
    data: datas,
    totalRecord,
    isLoading,
    refetch,
  }
}
