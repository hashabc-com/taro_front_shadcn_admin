import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { Search, X } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/date-range-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTableViewOptions } from '@/components/data-table/view-options'
import { useSearchForm } from '@/hooks/use-search-form'
import { statuses, types } from '../schema'

const route = getRouteApi('/_authenticated/fund/settlement-lists')

type SettlementListsSearchProps<TData> = {
  table: Table<TData>
}

export function SettlementListsSearch<TData>({
  table,
}: SettlementListsSearchProps<TData>) {
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const { t } = useLanguage()

  const { fields, setField, handleSearch, handleReset, hasFilters } =
    useSearchForm({
      search,
      navigate,
      fieldKeys: ['status', 'type', 'startTime', 'endTime'] as const,
    })

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {/* 日期范围 */}
      <DateRangePicker
        mode='date'
        startTime={fields.startTime}
        endTime={fields.endTime}
        onStartTimeChange={(v) => setField('startTime', v)}
        onEndTimeChange={(v) => setField('endTime', v)}
      />

      <div className='max-w-[120px]'>
        <Select value={fields.type} onValueChange={(v) => setField('type', v)}>
          <SelectTrigger id='type' clearable>
            <SelectValue placeholder={t('fund.fundsDetail.type')} />
          </SelectTrigger>
          <SelectContent>
            {types.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Select value={fields.status} onValueChange={(v) => setField('status', v)}>
        <SelectTrigger id='status' clearable>
          <SelectValue placeholder={t('orders.receiveOrders.status')} />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(statuses).map((key) => {
            const item = statuses[key as unknown as keyof typeof statuses]
            return (
              <SelectItem key={key} value={key}>
                <div className='flex items-center gap-2'>
                  {item.icon && <item.icon className='size-4' />}
                  {t(item.label)}
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

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
