import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { RoleEditDialog } from './components/role-edit-dialog'
import { RoleManageTable } from './components/role-manage-table'
import { useLanguage } from '@/context/language-provider'
import { useI18n } from '@/hooks/use-i18n'

export function RoleManagePage() {
  const { t } = useLanguage()
  const { t: ti18n } = useI18n()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <h2 className='text-2xl font-bold tracking-tight'>{t('system.roleManage.title')}</h2>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className='mr-2 h-4 w-4' />
            {ti18n('system.roleManage.addRole')}
          </Button>
        </div>
        <RoleManageTable />
      </Main>
      <RoleEditDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        role={null}
        isAdd={true}
      />
    </>
  )
}
