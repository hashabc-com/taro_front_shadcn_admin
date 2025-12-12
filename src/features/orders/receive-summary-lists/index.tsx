import { Main } from '@/components/layout/main'
import { ReceiveSummaryTable } from './components/receive-summary-table'

import { useLanguage } from '@/context/language-provider'

export function ReceiveSummary() {
  const { t } = useLanguage()

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            {t('orders.receiveSummary.title')}
          </h2>
        </div>
      </div>
      <ReceiveSummaryTable />
    </Main>
  )
}
