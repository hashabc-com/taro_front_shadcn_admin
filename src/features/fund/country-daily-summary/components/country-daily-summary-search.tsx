import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { Search, X } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/date-range-picker'
import { DataTableViewOptions } from '@/components/data-table/view-options'
import { useSearchForm } from '@/hooks/use-search-form'

const route = getRouteApi('/_authenticated/fund/country-daily-summary')

type CountryDailySummarySearchProps<TData> = {
  table: Table<TData>
}

export function CountryDailySummarySearch<TData>({
  table,
}: CountryDailySummarySearchProps<TData>) {
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const { t } = useLanguage()

  const { fields, setField, handleSearch, handleReset, hasFilters } =
    useSearchForm({
      search,
      navigate,
      fieldKeys: ['startTime', 'endTime'] as const,
    })

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {/* 日期范围 */}
      <div>
<DateRangePicker
        mode='date'
        startTime={fields.startTime}
        endTime={fields.endTime}
        onStartTimeChange={(v) => setField('startTime', v)}
        onEndTimeChange={(v) => setField('endTime', v)}
      />
      </div>
      

      {/* 操作按钮 */}
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
