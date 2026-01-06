import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { routeStrategySchema } from '../schema'
import { useRouteStrategy } from './route-strategy-provider'
import { Edit, Power, PowerOff } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateRouteStrategyStatus } from '@/api/config'
import { toast } from 'sonner'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const strategy = routeStrategySchema.parse(row.original)
  const { setOpen, setCurrentRow } = useRouteStrategy()
  const { t } = useLanguage()
  const queryClient = useQueryClient()

  const statusMutation = useMutation({
    mutationFn: (status: string) => updateRouteStrategyStatus({ id: strategy.id, status }),
    onSuccess: (res) => {
      if (res.code == 200) {
        queryClient.invalidateQueries({ queryKey: ['route-strategies'] })
        toast.success(t('common.statusUpdateSuccess'))
      } else {
        toast.error(res.message || t('common.statusUpdateFailed'))
      }
    },
    onError: (error: unknown) => {
      toast.error((error as Error).message || t('common.operationFailed'))
    },
  })

  const handleStatusToggle = () => {
    const newStatus = strategy.status === '0' ? '1' : '0'
    statusMutation.mutate(newStatus)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='data-[state=open]:bg-muted flex h-8 w-8 p-0'>
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[140px]'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(strategy)
            setOpen('edit')
          }}
        >
          {t('common.edit')}
          <Edit className='ml-auto h-4 w-4' />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleStatusToggle} disabled={statusMutation.isPending}>
          {strategy.status === '0' ? (
            <>
              {t('common.disable')}
              <PowerOff className='ml-auto h-4 w-4' />
            </>
          ) : (
            <>
              {t('common.enable')}
              <Power className='ml-auto h-4 w-4' />
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
