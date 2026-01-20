import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { RefreshCcw } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/data-table'

const route = getRouteApi('/_authenticated/logs/merchant-request')

type MerchantRequestSearchProps<T> = {
  table: Table<T>
}

export function MerchantRequestSearch<TData>({
  table,
}: MerchantRequestSearchProps<TData>) {
  const navigate = route.useNavigate()
  const { t } = useLanguage()
  const search = route.useSearch()

  const [transactionId, setTransactionId] = useState(search.transactionId || '')

  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        transactionId: transactionId || undefined,
        pageNum: 1,
        refresh: Date.now(),
      }),
    })
  }

  const handleReset = () => {
    setTransactionId('')
    navigate({
      search: (prev) => ({
        pageNum: 1,
        pageSize: prev.pageSize,
      }),
    })
  }

  const hasFilters = transactionId

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='max-w-[280px] min-w-[180px]'>
        <Input
          placeholder={t('logs.merchantRequest.transactionId')}
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className='mt-0.5 flex gap-2'>
        <Button onClick={handleSearch} size='sm'>
          <RefreshCcw className='mr-2 h-4 w-4' />
          {t('common.search')}
        </Button>
        {hasFilters && (
          <Button onClick={handleReset} variant='outline' size='sm'>
            {t('common.reset')}
          </Button>
        )}
      </div>

      <div className='ml-auto'>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
