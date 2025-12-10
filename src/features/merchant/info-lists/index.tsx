import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { MerchantInfoTable } from './components/info-lists-table'
import { EditMerchantDialog } from './components/edit-merchant-dialog'
import { useMerchantInfoData } from './hooks/use-info-lists-data'

export function MerchantInfoPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const { refetch } = useMerchantInfoData()

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>商户信息</h2>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />
          添加商户
        </Button>
      </div>
      <MerchantInfoTable />
      <EditMerchantDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        merchant={null}
        isAdd={true}
        onSuccess={refetch}
      />
    </Main>
  )
}

