import { useState } from 'react'
import { format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { zhCN } from 'date-fns/locale'
import { CalendarIcon, Search, X } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { type Table } from '@tanstack/react-table'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { DataTableViewOptions } from '@/components/data-table'

type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

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
  const [businessName, setBusinessName] = useState(search.businessName || '')
  const [dateRange, setDateRange] = useState<DateRange>({
    from: search.startTime ? new Date(search.startTime) : undefined,
    to: search.endTime ? new Date(search.endTime) : undefined,
  })

  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        businessName: businessName || undefined,
        startTime: dateRange.from
          ? format(dateRange.from, 'yyyy-MM-dd')
          : undefined,
        endTime: dateRange.to
          ? format(dateRange.to, 'yyyy-MM-dd')
          : undefined,
        pageNum: 1,
        refresh: Date.now(),
      }),
    })
  }

  const handleReset = () => {
    setBusinessName('')
    setDateRange({ from: undefined, to: undefined })
    navigate({
      search: (prev) => ({
        pageNum: 1,
        pageSize: prev.pageSize,
      }),
    })
  }

  const hasFilters = businessName || dateRange.from || dateRange.to

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          placeholder={t('business.merchantBind.businessUserName')}
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className='w-[200px]'
        />
      </div>

      <div className='max-w-[230px]'>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-full justify-start text-left font-normal'
            >
              <CalendarIcon className='text-muted-foreground mr-2 h-4 w-4' />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'yyyy-MM-dd', { locale: zhCN })} -{' '}
                    {format(dateRange.to, 'yyyy-MM-dd', { locale: zhCN })}
                  </>
                ) : (
                  format(dateRange.from, 'yyyy-MM-dd', { locale: zhCN })
                )
              ) : (
                <span className='text-muted-foreground'>
                  {t('common.selectDateRange')}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='range'
              defaultMonth={dateRange.from}
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => {
                setDateRange({
                  from: range?.from,
                  to: range?.to,
                })
              }}
              numberOfMonths={2}
              locale={zhCN}
            />
          </PopoverContent>
        </Popover>
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
