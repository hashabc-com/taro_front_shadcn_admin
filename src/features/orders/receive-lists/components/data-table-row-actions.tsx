import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { orderSchema } from '../schema'
import { useReceiveLists } from './receive-lists-provider'
import { Info } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = orderSchema.parse(row.original)
  const { t } = useLanguage()
  const { setOpen, setCurrentRow } = useReceiveLists()


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
            setCurrentRow(task)
            setOpen('info')
          }}
        >
          <Info className='mr-2 h-4 w-4' />
          {t('orders.paymentOrders.viewMore')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
