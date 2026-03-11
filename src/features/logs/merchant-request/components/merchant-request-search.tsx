import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { RefreshCcw } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { useSearchForm } from '@/hooks/use-search-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

  const { fields, setField, handleSearch, handleReset, hasFilters } =
    useSearchForm({
      search,
      navigate,
      fieldKeys: ['transactionId', 'transactionType', 'status'] as const,
    })

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='max-w-[280px] min-w-[180px]'>
        <Input
          placeholder={t('logs.merchantRequest.transactionId')}
          value={fields.transactionId}
          onChange={(e) => setField('transactionId', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <Select
        value={fields.transactionType}
        onValueChange={(v) => setField('transactionType', v)}
      >
        <SelectTrigger className='h-9 w-[160px]'>
          <SelectValue
            placeholder={t('logs.merchantRequest.transactionType')}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='P'>
            {t('logs.merchantRequest.payment')}
          </SelectItem>
          <SelectItem value='L'>
            {t('logs.merchantRequest.lending')}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={fields.status}
        onValueChange={(v) => setField('status', v)}
      >
        <SelectTrigger className='h-9 w-[160px]'>
          <SelectValue placeholder={t('logs.merchantRequest.status')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='0'>
            {t('logs.merchantRequest.statusSuccess')}
          </SelectItem>
          <SelectItem value='1'>
            {t('logs.merchantRequest.statusProcessing')}
          </SelectItem>
          <SelectItem value='2'>
            {t('logs.merchantRequest.statusFailed')}
          </SelectItem>
          {/* <SelectItem value='3'>
            {t('logs.merchantRequest.statusExpired')}
          </SelectItem> */}
        </SelectContent>
      </Select>

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
