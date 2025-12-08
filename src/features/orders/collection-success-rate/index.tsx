import { Main } from '@/components/layout/main'
import { ReceiveSummaryTable } from './components/collection-success-rate-table'

export function CollectionSuccessRate() {
  

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            代收成功率
          </h2>
        </div>
      </div>
      <ReceiveSummaryTable />
    </Main>
  )
}
