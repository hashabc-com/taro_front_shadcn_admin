import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { accountSchema } from '../schema'
import { useAccount } from './account-provider'
import { updateDisabledStatus } from '@/api/account'
import { useI18n } from '@/hooks/use-i18n'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const account = accountSchema.parse(row.original)
  const { setOpen, setCurrentRow } = useAccount()
  const queryClient = useQueryClient()
  const { t } = useI18n()

  const statusMutation = useMutation({
    mutationFn: (disableStatus: number) =>
      updateDisabledStatus({
        id: account.id!,
        disableStatus,
      }),
    onSuccess: (res) => {
      if(res.code == 200){
        queryClient.invalidateQueries({ queryKey: ['system','account-manage'] })
        toast.success(t('common.statusUpdateSuccess'))
      }else{
        toast.error(res.message || t('common.statusUpdateFailed'))
      }
    },
    onError: () => {
      toast.error(t('common.statusUpdateFailed'))
    },
  })

  const handleStatusChange = (checked: boolean) => {
    const newStatus = checked ? 0 : 1
    statusMutation.mutate(newStatus)
  }

  return (
    <div className='flex items-center gap-2'>
      
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='data-[state=open]:bg-muted flex h-8 w-8 p-0'>
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(account)
              setOpen('update')
            }}
          >
            {t('common.edit')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(account)
              setOpen('password')
            }}
          >
            {t('system.accountManage.changePassword')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            {t('common.status')}
            <Switch
                checked={account.disabledStatus === 0}
                onCheckedChange={handleStatusChange}
                disabled={statusMutation.isPending}
            />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(account)
              setOpen('delete')
            }}
            className='text-red-600'
          >
            {t('common.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
