import { useLanguage } from '@/context/language-provider'
import { Main } from '@/components/layout/main'
import { ExportTable } from './components/export-table'

export function ExportManagement() {
  const { t } = useLanguage()

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <h2 className='text-2xl font-bold tracking-tight'>
          {t('system.exportManagement.title')}
        </h2>
      </div>
      <ExportTable />
    </Main>
  )
}
