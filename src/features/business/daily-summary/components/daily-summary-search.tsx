import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { Search, X } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { useSearchForm } from '@/hooks/use-search-form'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/date-range-picker'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/data-table'

type IDailySummarySearchProps<TData> = {
  table: Table<TData>
}
const route = getRouteApi('/_authenticated/business/daily-summary')

export function DailySummarySearch<TData>({
  table,
}: IDailySummarySearchProps<TData>) {
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const { t } = useLanguage()

  const { fields, setField, handleSearch, handleReset, hasFilters } =
    useSearchForm({
      search,
      navigate,
      fieldKeys: ['businessName', 'startTime', 'endTime'] as const,
    })

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div>
        <DateRangePicker
        mode='date'
        startTime={fields.startTime}
        endTime={fields.endTime}
        onStartTimeChange={(v) => setField('startTime', v)}
        onEndTimeChange={(v) => setField('endTime', v)}
      />

      </div>
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          placeholder={t('business.merchantBind.businessUserName')}
          value={fields.businessName}
          onChange={(e) => setField('businessName', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className='w-[200px]'
        />
      </div>

      
      <div className='mt-0.5 flex gap-2'>
        <Button onClick={handleSearch} size='sm'>
          <Search className='mr-2 h-4 w-4' />
          {t('common.search')}
        </Button>
        {hasFilters && (
          <Button onClick={handleReset} variant='outline' size='sm'>
            <X className='mr-2 h-4 w-4' />
            {t('common.reset')}
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
