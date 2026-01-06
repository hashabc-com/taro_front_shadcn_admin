import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { RouteStrategyProvider } from './components/route-strategy-provider'
import { RouteStrategyTable } from './components/route-strategy-table'
import { RouteStrategyDialogs } from './components/route-strategy-dialogs'
import { getRouteStrategyList } from '@/api/config'
import { type RouteStrategy } from './schema'
import { useLanguage } from '@/context/language-provider'
import { useCountryStore, useMerchantStore } from '@/stores'

const route = getRouteApi('/_authenticated/config/route-strategy')

export function RouteStrategyConfig() {
  const { t } = useLanguage()
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const { data, isLoading } = useQuery({
    queryKey: ['route-strategies', search, selectedCountry?.code, selectedMerchant?.appid],
    queryFn: () => getRouteStrategyList(search),
    enabled: !!selectedCountry,
    placeholderData:(prev) => prev ?? undefined
  })

  const strategies = (data?.result?.listRecord as RouteStrategy[]) || []
  const totalRecord = data?.result?.totalRecord || 0

  return (
    <RouteStrategyProvider>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{t('sidebar.routeStrategy')}</h2>
          </div>
        </div>
        <RouteStrategyTable data={strategies} totalRecord={totalRecord} isLoading={isLoading} />
      </Main>
      <RouteStrategyDialogs />
    </RouteStrategyProvider>
  )
}
