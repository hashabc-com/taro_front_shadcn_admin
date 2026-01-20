import { useLanguage } from '@/context/language-provider'
import { Main } from '@/components/layout/main'
import { SettlementListTable } from './components/settlement-lists-table'

export function SettlementPage() {
  const { t } = useLanguage()

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            {t('fund.settlement.title')}
          </h2>
        </div>
      </div>
      <SettlementListTable />
    </Main>
  )
}
