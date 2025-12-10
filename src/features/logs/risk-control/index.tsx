import { Main } from '@/components/layout/main'
import { RiskControlTable } from './components/risk-control-table'

export function RiskControlPage() {
  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>风控规则记录</h2>
        </div>
      </div>
      <RiskControlTable />
    </Main>
  )
}
