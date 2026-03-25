import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { useCountryStore, useMerchantStore } from '@/stores'
import { Download, Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { getChannelByCountry } from '@/api/common'
import { prepareExportPayment } from '@/api/order'
import { useLanguage } from '@/context/language-provider'
import { useSearchForm } from '@/hooks/use-search-form'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTableViewOptions } from '@/components/data-table/view-options'
import { DateRangePicker } from '@/components/date-range-picker'

const route = getRouteApi('/_authenticated/orders/payment-summary-lists')

type PaymentListsSearchProps<TData> = {
  table: Table<TData>
}

export function PaymentSummarySearch<TData>({
  table,
}: PaymentListsSearchProps<TData>) {
  const navigate = route.useNavigate()
  const search = route.useSearch()

  const { t } = useLanguage()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()

  const { fields, setField, handleSearch, handleReset, hasFilters } =
    useSearchForm({
      search,
      navigate,
      fieldKeys: ['channel', 'startTime', 'endTime'] as const,
    })

  const { data: paymentChannels } = useQuery({
    queryKey: [
      'common',
      'payment-channels',
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: getChannelByCountry,
    select: (data) => data.result,
  })

  const handleExport = async () => {
    const res = await prepareExportPayment({
      startTime: fields.startTime,
      endTime: fields.endTime,
    })
    if (res.code === '200') {
      toast.success(t('common.exportTaskCreated'))
    } else {
      toast.error(res.message || t('common.exportFailed'))
    }
  }

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

      {/* 支付渠道 */}
      <div className='max-w-[200px]'>
        <Select
          value={fields.channel}
          onValueChange={(v) => setField('channel', v)}
        >
          <SelectTrigger id='channel' clearable>
            <SelectValue
              placeholder={t('orders.paymentSummary.paymentChannel')}
            />
          </SelectTrigger>
          <SelectContent>
            {paymentChannels?.map((item: string) => (
              <SelectItem key={item} value={item}>
                {item}
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
        <Button onClick={handleExport} variant='outline' size='sm'>
          <Download className='mr-2 h-4 w-4' />
          {t('common.export')}
        </Button>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
