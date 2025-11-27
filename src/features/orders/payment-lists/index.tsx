import { Main } from '@/components/layout/main'
import { PaymentListsTable } from './components/payment-lists-table'
import { PaymentListsProvider } from './components/payment-lists-provider'
import { PaymentListsDialogs } from './components/payment-lists-dialogs'

export function PaymentLists() {
  

  return (
    <PaymentListsProvider>
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            付款订单明细
          </h2>
        </div>
      </div>
      <PaymentListsTable />
    </Main>
    <PaymentListsDialogs />
    </PaymentListsProvider>
  )
}
