import { Main } from '@/components/layout/main'
import { AccountTable } from './components/account-table'
import { AccountProvider } from './components/account-provider'
import { AccountDialogs } from './components/account-dialogs'
import { useLanguage } from '@/context/language-provider'

export function AccountManage() {
  const { t } = useLanguage()

  return (
    <AccountProvider>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <h2 className='text-2xl font-bold tracking-tight'>{t('system.accountManage.title')}</h2>
        </div>
        <AccountTable />
      </Main>
      <AccountDialogs />
    </AccountProvider>
  )
}
