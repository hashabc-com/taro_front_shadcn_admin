import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { useCountryStore, useMerchantStore } from '@/stores'
import { Search, X } from 'lucide-react'
import { getProductDict } from '@/api/common'
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
import { DataTableViewOptions } from '@/components/data-table/view-options'
import { DateRangePicker } from '@/components/date-range-picker'
import { getStatuses } from '../schema'

const route = getRouteApi('/_authenticated/orders/receive-lists')

type ReceiveListsSearchProps<TData> = {
  table: Table<TData>
}

export function ReceiveListsSearch<TData>({
  table,
}: ReceiveListsSearchProps<TData>) {
  const { t } = useLanguage()
  const navigate = route.useNavigate()
  const search = route.useSearch()

  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()

  const { fields, setField, handleSearch, handleReset, hasFilters } =
    useSearchForm({
      search,
      navigate,
      fieldKeys: [
        'referenceno',
        'transId',
        'mobile',
        'status',
        'pickupCenter',
        'startTime',
        'endTime',
        'userName',
      ] as const,
    })

  const { data } = useQuery({
    queryKey: ['product-dict', selectedCountry?.code, selectedMerchant?.appid],
    queryFn: () => getProductDict(),
    enabled: !!selectedCountry,
  })

  const payinChannel = data?.result?.payinChannel || []

  const statuses = getStatuses(t)

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {/* 日期时间范围 (秒级) */}
      <div>
        <DateRangePicker
          startTime={fields.startTime}
          endTime={fields.endTime}
          onStartTimeChange={(v) => setField('startTime', v)}
          onEndTimeChange={(v) => setField('endTime', v)}
        />
      </div>
      {/* 商户订单号 */}
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          id='referenceno'
          placeholder={t('orders.receiveOrders.merchantOrderNo')}
          value={fields.referenceno}
          onChange={(e) => setField('referenceno', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          id='transId'
          placeholder={t('orders.receiveOrders.platformOrderNo')}
          value={fields.transId}
          onChange={(e) => setField('transId', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          id='mobile'
          placeholder={t('orders.receiveOrders.mobile')}
          value={fields.mobile}
          onChange={(e) => setField('mobile', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          id='userName'
          placeholder={t('signIn.username')}
          value={fields.userName}
          onChange={(e) => setField('userName', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      {/* 交易状态 */}
      <Select
        value={fields.status}
        onValueChange={(v) => setField('status', v)}
      >
        <SelectTrigger id='status' clearable>
          <SelectValue placeholder={t('orders.receiveOrders.status')} />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              <div className='flex items-center gap-2'>
                {item.icon && <item.icon className='size-4' />}
                {item.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* 产品 */}
      <div className='max-w-[120px]'>
        <Select
          value={fields.pickupCenter}
          onValueChange={(v) => setField('pickupCenter', v)}
        >
          <SelectTrigger id='pickupCenter' clearable>
            <SelectValue placeholder={t('common.product')} />
          </SelectTrigger>
          <SelectContent>
            {payinChannel.map((item) => (
              <SelectItem key={item} value={item}>
                <div className='flex items-center gap-2'>{item}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
