import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useMerchantStore } from '@/stores'
import { getCustomerConsultList } from '@/api/business'
import { useCountryStore } from '@/stores/country-store'
import { type ICustomerConsult } from '../schema'

const route = getRouteApi('/_authenticated/business/customer-consult')

export function useCustomerConsultData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()

  const { data, isLoading } = useQuery({
    queryKey: [
      'customer-consult-list',
      search,
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: () => getCustomerConsultList(search),
    placeholderData: (prev) => prev ?? undefined,
  })

  const customerList: ICustomerConsult[] = data?.result?.listRecord ?? []
  const totalRecord = customerList.length
  return {
    data: customerList,
    isLoading,
    totalRecord,
  }
}
