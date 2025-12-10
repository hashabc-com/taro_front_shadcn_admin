import { Main } from '@/components/layout/main'
import { MonthlySummaryTable } from './components/monthly-summary-table'

export function MonthlySummaryPage() {
  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>商务月汇总</h2>
        </div>
      </div>
      <MonthlySummaryTable />
    </Main>
  )
}
