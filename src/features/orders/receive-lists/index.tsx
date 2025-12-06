import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { ReceiveListsProvider } from './components/receive-lists-provider'
import { ReceiveListsTable } from './components/receive-lists-table'
import { getOrderList } from '@/api/order'
import { ReceiveListsDialogs } from './components/receive-lists-dialogs'
import {type Order} from './schema'
import { useConvertAmount } from '@/hooks/use-convert-amount'
import { useLanguage } from '@/context/language-provider'

const route = getRouteApi('/_authenticated/orders/receive-lists')

export function ReceiveLists() {
  const { t } = useLanguage()
  const search = route.useSearch()
  
  const convertAmount = useConvertAmount()

  const { data, isLoading } = useQuery({
    queryKey: ['orders', 'receive-lists', search],
    queryFn: () => getOrderList(search),
    // enabled: !!selectedCountry,
    placeholderData:(prev) => prev ?? undefined
  })
  const orders = data?.result?.listRecord?.map((item: Order) => ({
    ...item,
    amount: convertAmount(item.amount,false),
    serviceAmount: convertAmount(item.serviceAmount,false),
  })) || []
  const totalRecord = data?.result?.totalRecord || 0
  


  // console.log('orders', orders)
  return (
    <ReceiveListsProvider>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{t('orders.receiveOrders.title')}</h2>
          </div>
        </div>
        <ReceiveListsTable data={orders} totalRecord={totalRecord} isLoading={isLoading} />
      </Main>
      <ReceiveListsDialogs />
    </ReceiveListsProvider>
  )
}
