import { Main } from '@/components/layout/main'
import AccountSettlement from './components/account-settlement'
import { useLanguage } from '@/context/language-provider'

export default function AccountSettlementPage() {
  const { t } = useLanguage()

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>{t('fund.accountSettlement.title')}</h2>
        </div>
      </div>
      <AccountSettlement />
    </Main>
  )
}
