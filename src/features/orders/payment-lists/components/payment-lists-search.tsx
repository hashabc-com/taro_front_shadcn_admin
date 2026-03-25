import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { useCountryStore, useMerchantStore } from '@/stores'
import { Search, X } from 'lucide-react'
import { getProductDict } from '@/api/common'
import { getTranslation } from '@/lib/i18n'
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
import { statuses } from '../schema'

const route = getRouteApi('/_authenticated/orders/payment-lists')

type ReceiveListsSearchProps<TData> = {
  table: Table<TData>
}

export function ReceiveListsSearch<TData>({
  table,
}: ReceiveListsSearchProps<TData>) {
  const { lang } = useLanguage()
  const t = (key: string) => getTranslation(lang, key)
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()

  const { fields, setField, handleSearch, handleReset, hasFilters } =
    useSearchForm({
      search,
      navigate,
      fieldKeys: [
        'refNo',
        'transId',
        'status',
        'startTime',
        'endTime',
        'mobile',
        'userName',
        'accountNumber',
        'pickupCenter',
      ] as const,
    })

  useEffect(() => {
    setField('pickupCenter', '')
    if (search.pickupCenter) {
      navigate({
        search: (prev) => ({
          ...prev,
          pickupCenter: undefined,
          pageNum: 1,
          refresh: Date.now(),
        }),
      })
    }
  }, [navigate, search.pickupCenter, selectedCountry, setField])

  const { data } = useQuery({
    queryKey: ['product-dict', selectedCountry?.code, selectedMerchant?.appid],
    queryFn: () => getProductDict(),
    enabled: !!selectedCountry,
  })

  const payinChannel = data?.result?.payoutChannel || []

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
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          id='transId'
          placeholder={t('orders.paymentOrders.merchantOrderNo')}
          value={fields.transId}
          onChange={(e) => setField('transId', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          id='refNo'
          placeholder={t('orders.paymentOrders.platformOrderNo')}
          value={fields.refNo}
          onChange={(e) => setField('refNo', e.target.value)}
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
      {/* <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          id='userName'
          placeholder={t('signIn.username')}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div> */}
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          id='userName'
          placeholder={t('signIn.username')}
          value={fields.userName}
          onChange={(e) => setField('userName', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          id='accountNumber'
          placeholder={t('orders.paymentOrders.receivingAccount')}
          value={fields.accountNumber}
          onChange={(e) => setField('accountNumber', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      {/* 交易状态 */}
      <div>
        <Select
          value={fields.status}
          onValueChange={(v) => setField('status', v)}
        >
          <SelectTrigger id='status' clearable>
            <SelectValue placeholder={t('orders.paymentOrders.status')} />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(statuses).map((key) => {
              const item = statuses[key as unknown as keyof typeof statuses]
              return (
                <SelectItem key={key} value={key}>
                  <div className='flex items-center gap-2'>
                    {item.icon && <item.icon className='size-4' />}
                    {t(item.i18n)}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
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
