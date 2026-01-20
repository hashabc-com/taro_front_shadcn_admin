import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { Plus, RefreshCcw } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { type RouteStrategy } from '../schema'
import { useRouteStrategy } from './route-strategy-provider'

const route = getRouteApi('/_authenticated/config/route-strategy')

type RouteStrategySearchProps = {
  table: Table<RouteStrategy>
}

export function RouteStrategySearch(_props: RouteStrategySearchProps) {
  const { setOpen } = useRouteStrategy()
  const navigate = route.useNavigate()
  const { t } = useLanguage()

  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        pageNum: 1,
        refresh: Date.now(),
      }),
    })
  }

  return (
    <div className='flex items-center justify-between gap-2'>
      <div className='mt-0.5 flex gap-2'>
        <Button onClick={handleSearch} size='sm'>
          <RefreshCcw className='mr-2 h-4 w-4' />
          {t('common.refresh')}
        </Button>
      </div>

      <div className='flex items-center gap-2'>
        <Button variant='outline' size='sm' onClick={() => setOpen('create')}>
          <Plus className='mr-2 h-4 w-4' />
          {t('config.routeStrategy.addRouteConfig')}
        </Button>
      </div>
    </div>
  )
}
