import { useState } from 'react'
import { format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { zhCN } from 'date-fns/locale'
import { CalendarIcon, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { DataTableViewOptions } from '@/components/data-table'
import { type Table } from '@tanstack/react-table'
import { useLanguage } from '@/context/language-provider'

type MonthRange = {
  from: Date | undefined
  to: Date | undefined
}

type IMonthlySummarySearchProps<TData> = {
  table: Table<TData>
}

const route = getRouteApi('/_authenticated/business/monthly-summary')

export function MonthlySummarySearch<TData>({
  table,
}: IMonthlySummarySearchProps<TData>) {
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const { t } = useLanguage()
  const [businessName, setBusinessName] = useState(search.businessName || '')
  const [monthRange, setMonthRange] = useState<MonthRange>({
    from: search.startMonth
      ? new Date(search.startMonth + '-01')
      : undefined,
    to: search.endMonth ? new Date(search.endMonth + '-01') : undefined,
  })

  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        businessName: businessName || undefined,
        startMonth: monthRange.from
          ? format(monthRange.from, 'yyyy-MM')
          : undefined,
        endMonth: monthRange.to
          ? format(monthRange.to, 'yyyy-MM')
          : undefined,
        pageNum: 1,
        refresh: Date.now(),
      }),
    })
  }

  const handleReset = () => {
    setBusinessName('')
    setMonthRange({ from: undefined, to: undefined })
    navigate({
      search: (prev) => ({
        pageNum: 1,
        pageSize: prev.pageSize,
      }),
    })
  }

  const hasFilters = businessName || monthRange.from || monthRange.to

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {/* 商务名称 */}
      <div className='max-w-[200px] flex-1 min-w-[120px]'>
        <Input
          placeholder={t('business.merchantBind.businessUserName')}
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      {/* 月份范围选择 */}
      <div className='max-w-[280px]'>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className={cn(
                'w-full justify-start text-left font-normal',
                !monthRange.from && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {monthRange.from ? (
                monthRange.to ? (
                  <>
                    {format(monthRange.from, 'yyyy-MM', { locale: zhCN })} -{' '}
                    {format(monthRange.to, 'yyyy-MM', { locale: zhCN })}
                  </>
                ) : (
                  format(monthRange.from, 'yyyy-MM', { locale: zhCN })
                )
              ) : (
                <span>{t('common.selectMonthRange')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='range'
              defaultMonth={monthRange.from}
              selected={{ from: monthRange.from, to: monthRange.to }}
              onSelect={(range) => {
                setMonthRange({
                  from: range?.from,
                  to: range?.to,
                })
              }}
              numberOfMonths={2}
              locale={zhCN}
              fromYear={new Date().getFullYear() - 5}
              toYear={new Date().getFullYear()}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* 操作按钮 */}
      <div className='flex gap-2 mt-0.5'>
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
