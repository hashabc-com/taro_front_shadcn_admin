import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { Plus, Search, X } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { type PaymentChannel } from '../schema'
import { usePaymentChannel } from './payment-channel-provider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMemo, useState } from 'react'
// import { queryClient } from '@/main'
import { type Country } from '@/stores/country-store'
// import {type ResponseData } from '@/lib/http'
import { Input } from '@/components/ui/input'
// import { useQueryClient } from '@tanstack/react-query'
import { useCountries } from '@/hooks/use-Countries'

const route = getRouteApi('/_authenticated/config/payment-channel')

type PaymentChannelSearchProps = {
  table: Table<PaymentChannel>
}

export function PaymentChannelSearch(_props: PaymentChannelSearchProps) {
  const { setOpen } = usePaymentChannel()
  const navigate = route.useNavigate()
  const { t } = useLanguage()
  const [country, setCountry] = useState<string | undefined>(undefined)
  const [channelCode, setChannelCode] = useState<string>('')
  
  const { data: countriesData } = useCountries()

  const countries = useMemo<Country[]>(
      () => (countriesData?.result || countriesData?.data || []) as Country[],
      [countriesData]
  )


  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        pageNum: 1,
        country,
        channelCode,
        refresh: Date.now(),
      }),
    })
  }

  const handleReset = () => {
    setCountry('')
    setChannelCode('')
    navigate({
      search: (prev) => ({
        pageNum: 1,
        pageSize: prev.pageSize,
      }),
    })
  }

  const hasFilters = country || channelCode
  console.log('country=====>222',country)
  return (
    <div className='flex items-center gap-2'>
      <Select
        value={country}
        onValueChange={setCountry}
      >
        <SelectTrigger className='h-9 w-full sm:w-[140px]' clearable={false}>
          <SelectValue placeholder='选择国家'>
            {country && (
              <div className='flex items-center gap-2'>
                <img
                  src={`/images/${country}.svg`}
                  alt={country}
                  className='h-4 w-4'
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <span>{t(`common.countrys.${country}`)}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code.toString()}>
              <div className='flex items-center gap-2'>
                <img
                  src={`/images/${country.code}.svg`}
                  alt={country.code}
                  className='h-4 w-4'
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <span>{t(`common.countrys.${country.code}`)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className='flex flex-col gap-2'>
        <Input
          placeholder={t('config.paymentChannel.channelCode')}
          value={channelCode}
          onChange={(e) => setChannelCode(e.target.value)}
          className='w-[160px]'
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <div className='mt-0.5 flex gap-2'>
        <Button onClick={handleSearch} size='sm'>
          <Search className='mr-2 h-4 w-4' />
          {t('common.search')}
        </Button>
        {!!hasFilters && (
          <Button onClick={handleReset} variant='outline' size='sm'>
            <X className='mr-2 h-4 w-4' />
            {t('common.reset')}
          </Button>
        )}
      </div>

      <div className='flex items-center gap-2 ml-auto'>
        <Button variant='outline' size='sm' onClick={() => setOpen('create')}>
          <Plus className='mr-2 h-4 w-4' />
          {t('config.paymentChannel.addChannel')}
        </Button>
      </div>
    </div>
  )
}
