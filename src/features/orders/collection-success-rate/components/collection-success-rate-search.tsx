import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { useCountryStore, useMerchantStore } from '@/stores'
import { Search, X } from 'lucide-react'
import {
  getPaymentChannels,
  getProductDict,
  type IPaymentChannel,
} from '@/api/common'
import { useLanguage } from '@/context/language-provider'
import { useSearchForm } from '@/hooks/use-search-form'
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

const route = getRouteApi('/_authenticated/orders/collection-success-rate')

type CollectionSuccessRateSearchProps<TData> = {
  table: Table<TData>
}

export function CollectionSuccessRateSearch<TData>({
  table,
}: CollectionSuccessRateSearchProps<TData>) {
  const navigate = route.useNavigate()
  const search = route.useSearch()

  const { t } = useLanguage()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()

  const { fields, setField, handleSearch, handleReset, hasFilters } =
    useSearchForm({
      search,
      navigate,
      fieldKeys: ['channel', 'pickupCenter', 'startTime', 'endTime'] as const,
    })

  const { data: productDict } = useQuery({
    queryKey: ['product-dict', selectedCountry?.code, selectedMerchant?.appid],
    queryFn: () => getProductDict(),
    enabled: !!selectedCountry,
  })

  const { data: receiveChannels } = useQuery({
    queryKey: [
      'common',
      'receive-channels',
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: () => getPaymentChannels('pay_channel'),
  })

  const payinChannel = productDict?.result?.payinChannel || []

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

      {/* 产品 */}
      <div className='max-w-[200px]'>
        <Select value={fields.pickupCenter} onValueChange={(v) => setField('pickupCenter', v)}>
          <SelectTrigger id='pickupCenter' clearable>
            <SelectValue
              placeholder={t('orders.collectionRate.pickupCenter')}
            />
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

      {/* 交易状态 */}
      <div className='max-w-[200px]'>
        <Select value={fields.channel} onValueChange={(v) => setField('channel', v)}>
          <SelectTrigger id='channel' clearable>
            <SelectValue placeholder={t('orders.collectionRate.channel')} />
          </SelectTrigger>
          <SelectContent>
            {receiveChannels?.result.map((item: IPaymentChannel) => (
              <SelectItem key={item.itemValue} value={item.itemValue}>
                {item.itemName}
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
