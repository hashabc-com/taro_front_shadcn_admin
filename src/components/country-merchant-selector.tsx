import { useCallback, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getCountryList, getMerchantList } from '@/api/common'
import { useCountryStore, type Country } from '@/stores/country-store'
import { useMerchantStore, type Merchant } from '@/stores/merchant-store'
import { useLanguage } from '@/context/language-provider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { CurrencySelector } from './currency-selector'

export function CountryMerchantSelector() {
  const { selectedCountry, setSelectedCountry, setRates } = useCountryStore()
  const { selectedMerchant, setSelectedMerchant } = useMerchantStore()
  const { t } = useLanguage()
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

  // 当国家变化时，清空商户选择
  const handleCountryChange = useCallback(
    async (countryId: string) => {
      const country = countries.find((c) => c.id.toString() == countryId)
      if (country) {
        try {
          const response = await fetch(
            `https://open.er-api.com/v6/latest/${country?.currency}`
          )
          const data = await response.json()

          if (data.result === 'success' && data.rates) {
            setRates(data.rates)
            console.log(`汇率已更新 [基准: ${country?.currency}]`)
          }
        } catch {
          toast.error('获取汇率失败')
        }
        setSelectedCountry(country)
        setSelectedMerchant(null) // 清空商户选择
      }
    },
    [countries, setRates, setSelectedCountry, setSelectedMerchant]
  )

  // 第一次进来默认选中第一个国家
  useEffect(() => {
    if (!selectedCountry && countries.length > 0) {
      setSelectedCountry(countries[0])
      handleCountryChange(countries[0].id)
    }
  }, [countries, handleCountryChange, selectedCountry, setSelectedCountry])

  const handleMerchantChange = (merchantId: string) => {
    const merchant =
      merchants.find((m) => m.appid?.toString() === merchantId) || null
    setSelectedMerchant(merchant)
  }

  return (
    <div className='flex items-center gap-2'>
      {/* 国家选择 */}
      <Select
        value={selectedCountry?.id.toString()}
        onValueChange={handleCountryChange}
      >
        <SelectTrigger className='h-9 w-full sm:w-[140px]' clearable={false}>
          <SelectValue placeholder='选择国家'>
            {selectedCountry && (
              <div className='flex items-center gap-2'>
                <img
                  src={`/images/${selectedCountry.code}.svg`}
                  alt={selectedCountry.code}
                  className='h-4 w-4'
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <span>{t(`common.countrys.${selectedCountry.code}`)}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.id} value={country.id.toString()}>
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
      <CurrencySelector />
      <Separator orientation='vertical' className='h-6 max-md:hidden' />
      {/* 商户选择 */}
      <div className='flex items-center gap-1'>
        <Select
          value={selectedMerchant?.appid?.toString() || ''}
          onValueChange={handleMerchantChange}
          disabled={!selectedCountry}
        >
          <SelectTrigger className='h-9 w-full sm:w-[140px]'>
            <SelectValue placeholder={t('common.merchant')} />
          </SelectTrigger>
          <SelectContent>
            {merchants.map((merchant) => (
              <SelectItem
                key={merchant.appid}
                value={merchant.appid?.toString() || ''}
              >
                {merchant.companyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* {selectedMerchant && (
          <Button
            variant='ghost'
            size='sm'
            className='h-9 w-9 p-0'
            onClick={() => setSelectedMerchant(null)}
          >
            <X className='h-4 w-4' />
          </Button>
        )} */}
      </div>
    </div>
  )
}
