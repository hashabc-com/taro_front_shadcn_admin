import { useLanguage } from '@/context/language-provider'
import { Main } from '@/components/layout/main'
import { MerchantBindProvider } from './components/merchant-bind-provider'
import { MerchantBindTable } from './components/merchant-bind-table'

export function MerchantBindPage() {
  const { t } = useLanguage()

  return (
    <MerchantBindProvider>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            {t('business.merchantBind.title')}
          </h2>
        </div>
        <MerchantBindTable />
      </Main>
    </MerchantBindProvider>
  )
}
