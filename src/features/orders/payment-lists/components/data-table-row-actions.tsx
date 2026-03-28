import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'
import { type Row } from '@tanstack/react-table'
import { CheckCircle, RefreshCw, XCircle, Ban } from 'lucide-react'
import { toast } from 'sonner'
import { payInNotify, updatePayOutStatus, payOutReject } from '@/api/common'
import { useLanguage } from '@/context/language-provider'
import { useGoogleAuthDialog } from '@/hooks/use-google-auth-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { paymentListsSchema, type IPaymentListsType } from '../schema'
import { usePaymentLists } from './payment-lists-provider'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = paymentListsSchema.parse(row.original)
  const { t } = useLanguage()
  const { setOpen, setCurrentRow } = usePaymentLists()
  const queryClient = useQueryClient()

  const { dialog: googleAuthDialog, withGoogleAuth } = useGoogleAuthDialog()

  const handleNotify = async (record: IPaymentListsType, status: number) => {
    try {
      const res = await payInNotify({
        transId: record.transactionid || '',
        status: status,
      })
      console.log('notify res', res)
      if (res.code == 200) {
        toast.success(`通知发送成功`)
      } else {
        toast.error(res.message || `通知发送失败`)
      }
    } catch {
      toast.error(`通知发送失败`)
    }
  }

  const updateStatusHandle = (record: IPaymentListsType) => {
    withGoogleAuth(async (gauthKey) => {
      const data = new FormData()
      data.append('transactionid', record.transactionid || '')
      data.append('gauthKey', gauthKey)

      const res = await updatePayOutStatus(data)
      if (res.code == 200) {
        toast.success(t('common.statusUpdateSuccess'))
        queryClient.invalidateQueries({ queryKey: ['orders', 'payment-lists'] })
        queryClient.invalidateQueries({ queryKey: ['orders', 'payment-stat'] })
      } else {
        toast.error(res.message || t('common.statusUpdateFailed'))
      }
    })
  }

  const handleReject = (record: IPaymentListsType) => {
    withGoogleAuth(async (gauthKey) => {
      const data = new FormData()
      data.append('transactionid', record.transactionid || '')
      data.append('gauthKey', gauthKey)

      const res = await payOutReject(data)
      if (res.code == 200) {
        toast.success(t('common.operationSuccess') || '驳回成功')
        queryClient.invalidateQueries({ queryKey: ['orders', 'payment-lists'] })
        queryClient.invalidateQueries({ queryKey: ['orders', 'payment-stat'] })
      } else {
        toast.error(res.message || t('common.operationFailed') || '驳回失败')
      }
    })
  }

  return (
    <>
      {googleAuthDialog}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {task.status == '1' && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  updateStatusHandle(task)
                }}
              >
                {t('orders.paymentOrders.updateStatus')}
                <RefreshCw className='ml-auto h-4 w-4' />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleReject(task)
                }}
              >
                {t('orders.paymentOrders.reject')}
                <Ban className='ml-auto h-4 w-4 text-red-500' />
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem
            onClick={() => {
              handleNotify(task, 0)
            }}
          >
            {t('orders.paymentOrders.successNotification')}
            <CheckCircle className='ml-auto h-4 w-4 text-green-500' />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              handleNotify(task, 2)
            }}
          >
            {t('orders.paymentOrders.failureNotification')}
            <XCircle className='ml-auto h-4 w-4 text-red-500' />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(task)
              setOpen('info')
            }}
          >
            {t('orders.paymentOrders.viewMore')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
