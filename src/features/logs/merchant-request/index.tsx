import { Main } from '@/components/layout/main'
import { MerchantRequestTable } from './components/merchant-request-table'
import { useLanguage } from '@/context/language-provider'

export function MerchantRequestPage() {
  const { t } = useLanguage()

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>{t('logs.merchantRequest.title')}</h2>
        </div>
      </div>
      <MerchantRequestTable />
    </Main>
  )
}
