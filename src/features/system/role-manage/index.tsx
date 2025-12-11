import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { RoleEditDialog } from './components/role-edit-dialog'
import { RoleManageTable } from './components/role-manage-table'

export function RoleManagePage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <h2 className='text-2xl font-bold tracking-tight'>角色管理</h2>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className='mr-2 h-4 w-4' />
            添加角色
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
