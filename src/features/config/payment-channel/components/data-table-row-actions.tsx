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
import { DollarSign, Edit, Power, PowerOff } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePaymentChannelStatus } from '@/api/config'
import { toast } from 'sonner'
import { useLanguage } from '@/context/language-provider'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const channel = paymentChannelSchema.parse(row.original)
  const { setOpen, setCurrentRow } = usePaymentChannel()
  const queryClient = useQueryClient()
  const { t } = useLanguage()
  
  const statusMutation = useMutation({
    mutationFn: (status: number) => {
      return updatePaymentChannelStatus({
        id: channel.id,
        channelStatus: status
      })
    },
    onSuccess: (res) => {
      if(res.code == 200){
        queryClient.invalidateQueries({ queryKey: ['payment-channels'] })
        toast.success(t('common.statusUpdateSuccess'))
      }else{
        toast.error(res.message || t('common.statusUpdateFailed'))
      }
    },
    onError: (error: unknown) => {
      toast.error((error as Error).message || t('common.operationFailed'))
    },
  })

  const handleStatusToggle = () => {
    const statusMap = {
      1: 3, // 正常 -> 暂停
      2: 1, // 维护 -> 正常
      3: 1, // 暂停 -> 正常
    }
    const newStatus = statusMap[channel.channelStatus as keyof typeof statusMap] || 1
    statusMutation.mutate(newStatus)
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='data-[state=open]:bg-muted flex h-8 w-8 p-0'>
            <DotsHorizontalIcon className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[140px]'>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(channel)
              setOpen('edit')
            }}
          >
            {t('common.edit')}
            <Edit className='ml-auto h-4 w-4' />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleStatusToggle}
            disabled={statusMutation.isPending}
          >
            {channel.channelStatus === 1 ? (
              <>
              {t('config.paymentChannel.pauseChannel')}
                <PowerOff className='ml-auto h-4 w-4' /> 
              </>
            ) : (
              <>
                {t('config.paymentChannel.enableChannel')}
                <Power className='ml-auto h-4 w-4' />
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
          onClick={() => {
            setCurrentRow(channel)
            setOpen('rate')
          }}
        >
          {t('config.paymentChannel.rateConfig')}
        <DollarSign className='ml-auto h-4 w-4' />
        </DropdownMenuItem>
          {/* <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className='text-destructive'
          >
            <Trash className='mr-2 h-4 w-4' />
            {t('common.delete')}
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除渠道"{channel.channelName}"吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t('common.confirm')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </>
  )
}
