import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { paymentChannelSchema } from '../schema'
import { usePaymentChannel } from './payment-channel-provider'
import { Edit, Settings, Power, PowerOff } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateChannelStatus } from '@/api/config'
import { toast } from 'sonner'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const channel = paymentChannelSchema.parse(row.original)
  const { setOpen, setCurrentRow, setDetailMerchantId, setDetailType } = usePaymentChannel()
  const queryClient = useQueryClient()

  const statusMutation = useMutation({
    mutationFn: (status: number) => {
        const formData = new FormData();
        formData.append('id', String(channel.id));
        formData.append('status', String(status));
        return  updateChannelStatus(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-channels'] })
      toast.success('状态更新成功')
    },
    onError: (error: unknown) => {
      toast.error((error as Error).message || '操作失败')
    },
  })

  const handleStatusToggle = () => {
    const newStatus = channel.status === 1 ? 0 : 1
    statusMutation.mutate(newStatus)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='data-[state=open]:bg-muted flex h-8 w-8 p-0'>
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[140px]'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(channel)
            setOpen('edit')
          }}
        >
          <Edit className='mr-2 h-4 w-4' />
          编辑
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleStatusToggle}
          disabled={statusMutation.isPending}
        >
          {channel.status === 1 ? (
            <>
              <PowerOff className='mr-2 h-4 w-4' />
              禁用
            </>
          ) : (
            <>
              <Power className='mr-2 h-4 w-4' />
              启用
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setDetailMerchantId(channel.merchantId)
            setDetailType(channel.type)
            setOpen('detail')
          }}
        >
          <Settings className='mr-2 h-4 w-4' />
          设置
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
