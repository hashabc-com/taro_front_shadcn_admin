import { Main } from '@/components/layout/main'
import { MerchantDailySummaryTable } from './components/merchant-daily-summary-table'

export function MerchantDailySummaryPage() {
  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            商户每日汇总
          </h2>
        </div>
      </div>
      <MerchantDailySummaryTable />
    </Main>
  )
}
