import { Main } from '@/components/layout/main'
import { MerchantBindTable } from './components/merchant-bind-table'
import { useLanguage } from '@/context/language-provider'

export function MerchantBindPage() {
  const { t } = useLanguage()
  
  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>{t('business.merchantBind.title')}</h2>
        </div>
      <MerchantBindTable />
    </Main>
  )
}
