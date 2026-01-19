import { Main } from '@/components/layout/main'
import { CustomerConsultTable } from './components/customer-consult-table'
import { useLanguage } from '@/context/language-provider'

export function CustomerConsultPage() {
  const { t } = useLanguage()

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            {t('business.customerConsult.title')}
          </h2>
      </div>
      <CustomerConsultTable />
    </Main>
  )
}
