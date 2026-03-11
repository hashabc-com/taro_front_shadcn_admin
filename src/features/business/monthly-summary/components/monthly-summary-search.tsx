import { format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { zhCN } from 'date-fns/locale'
import { CalendarIcon, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSearchForm } from '@/hooks/use-search-form'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { DataTableViewOptions } from '@/components/data-table'

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
  const { fields, setField, setFields, handleSearch, handleReset, hasFilters } = useSearchForm({
    search,
    navigate,
    fieldKeys: ['businessName', 'startMonth', 'endMonth'] as const,
  })

  const monthFrom = fields.startMonth ? new Date(fields.startMonth + '-01') : undefined
  const monthTo = fields.endMonth ? new Date(fields.endMonth + '-01') : undefined

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {/* 商务名称 */}
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          placeholder={t('business.merchantBind.businessUserName')}
          value={fields.businessName}
          onChange={(e) => setField('businessName', e.target.value)}
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
                !fields.startMonth && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {fields.startMonth ? (
                fields.endMonth ? (
                  <>{fields.startMonth} - {fields.endMonth}</>
                ) : (
                  fields.startMonth
                )
              ) : (
                <span>{t('common.selectMonthRange')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='range'
              defaultMonth={monthFrom}
              selected={{ from: monthFrom, to: monthTo }}
              onSelect={(range) => {
                setFields({
                  startMonth: range?.from ? format(range.from, 'yyyy-MM') : '',
                  endMonth: range?.to ? format(range.to, 'yyyy-MM') : '',
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
