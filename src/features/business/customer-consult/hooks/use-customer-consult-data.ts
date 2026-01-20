import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { getCustomerConsultList } from '@/api/business'
import { type ICustomerConsult } from '../schema'
import { useCountryStore } from '@/stores/country-store'
import { useMerchantStore } from '@/stores'

const route = getRouteApi('/_authenticated/business/customer-consult')

export function useCustomerConsultData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()

  const { data, isLoading } = useQuery({
    queryKey: ['customer-consult-list', search, selectedCountry?.code, selectedMerchant?.appid],
    queryFn: () => getCustomerConsultList(search),
    placeholderData: (prev) => prev ?? undefined,
  })

  const customerList: ICustomerConsult[] = data?.result ?? []
  const totalRecord = customerList.length

  return {
    data: customerList,
    isLoading,
    totalRecord,
  }
}
