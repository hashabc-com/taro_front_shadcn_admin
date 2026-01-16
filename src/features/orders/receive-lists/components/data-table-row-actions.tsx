import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { CheckCircle, Info, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { payOutNotify } from '@/api/common'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { orderSchema, type Order } from '../schema'
import { useReceiveLists } from './receive-lists-provider'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = orderSchema.parse(row.original)
  const { t } = useLanguage()
  const { setOpen, setCurrentRow } = useReceiveLists()
  const handleNotify = async (record: Order, status: number) => {
    try {
      const res = await payOutNotify({
        transId: record.transId || '',
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

  return (
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
      <DropdownMenuContent align='end' className='w-auto'>
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
          <Info className='ml-auto h-4 w-4' />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
