import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getRuleConfigList } from '@/api/ruleConfig'

const route = getRouteApi('/_authenticated/config/risk-control-rule')

export function useRuleConfigData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'ruleConfigs',
      search,
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: async () => {
      const response = await getRuleConfigList(search)
      return response.result
    },
    enabled: !!selectedCountry,
    placeholderData: (prev) => prev ?? undefined,
  })
  return {
    data: data?.listRecord ?? [],
    isLoading,
    totalRecord: data?.totalRecord ?? 0,
    refetch,
  }
}
