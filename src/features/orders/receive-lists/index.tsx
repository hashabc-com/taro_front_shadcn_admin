import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getOrderList } from '@/api/order'
import { useLanguage } from '@/context/language-provider'
import { useConvertAmount } from '@/hooks/use-convert-amount'
import { Main } from '@/components/layout/main'
import { type OrderStats } from '@/features/orders/components/order-stats-cards'
import { ReceiveListsDialogs } from './components/receive-lists-dialogs'
import { ReceiveListsProvider } from './components/receive-lists-provider'
import { ReceiveListsTable } from './components/receive-lists-table'
import { type Order } from './schema'

const route = getRouteApi('/_authenticated/orders/receive-lists')

export function ReceiveLists() {
  const { t } = useLanguage()
  const search = route.useSearch()
  const convertAmount = useConvertAmount()

  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()

  const { data, isLoading } = useQuery({
    queryKey: [
      'orders',
      'receive-lists',
      search,
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: () => getOrderList(search),
    enabled: !!selectedCountry,
    placeholderData: (prev) => prev ?? undefined,
  })
  const orders =
    data?.result?.listRecord?.map((item: Order) => ({
      ...item,
      amount: convertAmount(item.amount, false),
      realAmount: convertAmount(item.realAmount || 0, false),
      serviceAmount: convertAmount(item.serviceAmount, false),
    })) || []
  const totalRecord = data?.result?.totalRecord || 0

  // 统计数据: 优先使用 API 返回数据，否则使用模拟数据
  const stats: OrderStats = useMemo(() => {
    const result = data?.result
    if (result?.allOrder != null) {
      return {
        totalOrders: result.allOrder ?? 0,
        successOrders: result.successOrder ?? 0,
        successRate: result.successRate ?? '0',
      }
    }
    // 模拟数据
    return {
      totalOrders: 5348,
      successOrders: 2883,
      successRate: '54',
    }
  }, [data?.result])

  return (
    <ReceiveListsProvider>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('orders.receiveOrders.title')}
            </h2>
          </div>
        </div>
        <ReceiveListsTable
          data={orders}
          totalRecord={totalRecord}
          isLoading={isLoading}
          stats={stats}
        />
      </Main>
      <ReceiveListsDialogs />
    </ReceiveListsProvider>
  )
}
