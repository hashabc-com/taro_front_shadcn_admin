import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useCountryStore, type Country } from '@/stores/country-store'
import { useMerchantStore, type Merchant } from '@/stores/merchant-store'
import { getCountryList, getMerchantList } from '@/api/common'

export function CountryMerchantSelector() {
  const { selectedCountry, setSelectedCountry } = useCountryStore()
  const { selectedMerchant, setSelectedMerchant } = useMerchantStore()

  // 获取国家列表
  const { data: countriesData } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountryList,
  })

  const countries = useMemo<Country[]>(
    () => (countriesData?.result || countriesData?.data || []) as Country[],
    [countriesData]
  )

  // 获取商户列表（依赖选中的国家）
  const { data: merchantsData } = useQuery({
    queryKey: ['merchants', selectedCountry?.code],
    queryFn: getMerchantList,
    enabled: !!selectedCountry?.code,
  })

  const merchants = useMemo<Merchant[]>(
    () => (merchantsData?.result || []) as Merchant[],
    [merchantsData]
  )

  // 第一次进来默认选中第一个国家
  useEffect(() => {
    if (!selectedCountry && countries.length > 0) {
      setSelectedCountry(countries[0])
    }
  }, [countries, selectedCountry, setSelectedCountry])

  // 当国家变化时，清空商户选择
  const handleCountryChange = (countryId: string) => {
    const country = countries.find((c) => c.id.toString() === countryId)
    if (country) {
      setSelectedCountry(country)
      setSelectedMerchant(null) // 清空商户选择
    }
  }

  const handleMerchantChange = (merchantId: string) => {
    const merchant = merchants.find((m) => m.appid?.toString() === merchantId)
    if (merchant) {
      setSelectedMerchant(merchant)
    }
  }

  return (
    <div className='flex items-center gap-2'>
      {/* 国家选择 */}
      <Select
        value={selectedCountry?.id.toString()}
        onValueChange={handleCountryChange}
      >
        <SelectTrigger className='w-[140px] h-9'>
          <SelectValue placeholder='选择国家' />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.id} value={country.id.toString()}>
              {country.country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 商户选择 */}
      <div className='flex items-center gap-1'>
        <Select
          value={selectedMerchant?.appid?.toString() || ''}
          onValueChange={handleMerchantChange}
          disabled={!selectedCountry}
        >
          <SelectTrigger className='w-[140px] h-9'>
            <SelectValue placeholder='选择商户' />
          </SelectTrigger>
          <SelectContent>
            {merchants.map((merchant) => (
              <SelectItem key={merchant.appid} value={merchant.appid?.toString() || ''}>
                {merchant.companyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedMerchant && (
          <Button
            variant='ghost'
            size='sm'
            className='h-9 w-9 p-0'
            onClick={() => setSelectedMerchant(null)}
          >
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
