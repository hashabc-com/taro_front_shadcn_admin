import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Link,DollarSign } from 'lucide-react'
import { type Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { businessSchema } from '../schema'
import { useMerchantBindProvider } from './merchant-bind-provider'
import { useLanguage } from '@/context/language-provider'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = businessSchema.parse(row.original)
  const { t } = useLanguage()
  const { setOpen, setCurrentRow } = useMerchantBindProvider()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(task)
            setOpen('bind')
          }}
        >
          {t('business.merchantBind.bindMerchant')}
          <Link className='ml-auto h-4 w-4' />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(task)
            setOpen('rate')
          }}
        >
          {t('config.paymentChannel.rateConfig')}
        <DollarSign className='ml-auto h-4 w-4' />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
