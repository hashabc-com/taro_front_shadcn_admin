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

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const account = accountSchema.parse(row.original)
  const { setOpen, setCurrentRow } = useAccount()
  const queryClient = useQueryClient()

  const statusMutation = useMutation({
    mutationFn: (disableStatus: number) =>
      updateDisabledStatus({
        id: account.id!,
        disableStatus,
      }),
    onSuccess: (res) => {
      if(res.code == 200){
        queryClient.invalidateQueries({ queryKey: ['system','account-manage'] })
        toast.success('状态更新成功')
      }else{
        toast.error(res.message || '状态更新失败')
      }
    },
    onError: () => {
      toast.error('状态更新失败')
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
            编辑
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(account)
              setOpen('password')
            }}
          >
            修改密码
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            状态
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
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
