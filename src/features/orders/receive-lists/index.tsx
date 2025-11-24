import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ReceiveListsProvider } from './components/receive-lists-provider'
import { ReceiveListsTable } from './components/receive-lists-table'
import { getOrderList } from '@/api/order'
import { ReceiveListsDialogs } from './components/receive-lists-dialogs'

const route = getRouteApi('/_authenticated/orders/receive-lists')

export function ReceiveLists() {
  const search = route.useSearch()
  const pageNum = search.page || 1
  const pageSize = search.pageSize || 10

  const { data, isLoading } = useQuery({
    queryKey: ['orders', 'receive-lists', pageNum, pageSize, search.referenceno,search.tripartiteOrder, search.status, search.startTime, search.endTime,search.transId],
    queryFn: () => getOrderList({ 
      pageNum, 
      pageSize, 
      country: 'ID',
      referenceno: search.referenceno,
      tripartiteOrder: search.tripartiteOrder,
      transId: search.transId,
      status: search.status,
      startTime: search.startTime,
      endTime: search.endTime,
    }),
  })
  const orders = data?.result?.listRecord || []
  const totalRecord = data?.result?.totalRecord || 0
  // console.log('orders', orders)
  return (
    <ReceiveListsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>收款订单明细</h2>
          </div>
        </div>
        <ReceiveListsTable data={orders} totalRecord={totalRecord} isLoading={isLoading} />
      </Main>
      <ReceiveListsDialogs />
    </ReceiveListsProvider>
  )
}
