import { getTranslation } from '@/lib/i18n'
import { useLanguage } from '@/context/language-provider'
import { Main } from '@/components/layout/main'
import { PaymentListsDialogs } from './components/payment-lists-dialogs'
import { PaymentListsProvider } from './components/payment-lists-provider'
import { PaymentListsTable } from './components/payment-lists-table'

export function PaymentLists() {
  const { lang } = useLanguage()
  const t = (key: string) => getTranslation(lang, key)

  return (
    <PaymentListsProvider>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('orders.paymentOrders.title')}
            </h2>
          </div>
        </div>
        <PaymentListsTable />
      </Main>
      <PaymentListsDialogs />
    </PaymentListsProvider>
  )
}
