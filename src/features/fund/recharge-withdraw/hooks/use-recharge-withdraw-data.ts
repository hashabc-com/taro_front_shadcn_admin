import { useEffect, useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getImg } from '@/api/common'
import { getRechargeWithdrawList } from '@/api/fund'
import { useConvertAmount } from '@/hooks/use-convert-amount'
import { type IRechargeWithdrawType } from '../schema'

const route = getRouteApi('/_authenticated/fund/recharge-withdraw')

export function useRechargeWithdrawData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const convertAmount = useConvertAmount()
  const [dataWithImages, setDataWithImages] = useState<IRechargeWithdrawType[]>(
    []
  )

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'fund',
      'recharge-withdraw',
      search,
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: () => getRechargeWithdrawList(search),
    enabled: !!selectedCountry,
    placeholderData: (prev) => prev ?? undefined,
  })

  const dataList = useMemo(
    () =>
      data?.result?.listRecord?.map((item: IRechargeWithdrawType) => ({
        ...item,
        rechargeAmount: convertAmount(item.rechargeAmount, false),
        finalAmount: convertAmount(item.finalAmount, false),
      })) || [],
    [data?.result?.listRecord, convertAmount]
  )

  const totalRecord = data?.result?.totalRecord || 0

  // Load images for items with mediaId
  useEffect(() => {
    let isMounted = true

    const loadImages = async () => {
      if (!dataList || dataList.length === 0) {
        if (isMounted) {
          setDataWithImages([])
        }
        return
      }

      const updatedData = await Promise.all(
        dataList.map(async (item: IRechargeWithdrawType) => {
          if (!item.mediaId) return item

          try {
            const urlObj = new URL(item.mediaId)
            const mediaId = urlObj.searchParams.get('mediaId')
            if (mediaId) {
              const imageUrl = await getImg({ mediaId, type: true })
              return { ...item, local_url: imageUrl }
            }
          } catch (error) {
            console.error('Failed to load image:', error)
          }
          return item
        })
      )

      if (isMounted) {
        setDataWithImages(updatedData)
      }
    }

    loadImages()

    return () => {
      isMounted = false
    }
  }, [dataList])
  return {
    data: dataWithImages.length > 0 ? dataWithImages : dataList,
    totalRecord,
    isLoading,
    refetch,
  }
}
