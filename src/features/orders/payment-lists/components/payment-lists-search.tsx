import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { Search, X } from 'lucide-react'
import { getTranslation } from '@/lib/i18n'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/date-range-picker'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTableViewOptions } from '@/components/data-table/view-options'
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

  const [refNo, setRefNo] = useState(search.refNo || '')
  const [transId, setTransId] = useState(search.transId || '')
  const [status, setStatus] = useState(search.status || '')
  const [startTime, setStartTime] = useState(search.startTime || '')
  const [endTime, setEndTime] = useState(search.endTime || '')
  const [mobile, setMobile] = useState(search.mobile || '')
  const [userName, setUserName] = useState(search.userName || '')
  const [accountNumber, setAccountNumber] = useState(search.accountNumber || '')
  const hasFilters = refNo || status || transId || startTime || endTime || mobile || userName || accountNumber
  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        pageNum: 1,
        refNo: refNo || undefined,
        transId: transId || undefined,
        status: status || undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        mobile: mobile || undefined,
        userName: userName || undefined,
        accountNumber:  accountNumber || undefined,
        refresh: Date.now(),
      }),
    })
  }

  const handleReset = () => {
    setStartTime('')
    setEndTime('')
    setRefNo('')
    setTransId('')
    setStatus('')
    setMobile('')
    setUserName('')
    setAccountNumber('')
    navigate({
      search: (prev) => ({
        pageNum: 1,
        pageSize: prev.pageSize,
      }),
    })
  }

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {/* 日期时间范围 (秒级) */}
      <div>
        <DateRangePicker
        startTime={startTime}
        endTime={endTime}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
      />
      </div>
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          id='transId'
          placeholder={t('orders.paymentOrders.merchantOrderNo')}
          value={transId}
          onChange={(e) => setTransId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          id='refNo'
          placeholder={t('orders.paymentOrders.platformOrderNo')}
          value={refNo}
          onChange={(e) => setRefNo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          id='mobile'
          placeholder={t('orders.receiveOrders.mobile')}
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
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
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          id='accountNumber'
          placeholder={t('orders.paymentOrders.receivingAccount')}
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      {/* 交易状态 */}
      <div>
        <Select value={status} onValueChange={setStatus}>
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
