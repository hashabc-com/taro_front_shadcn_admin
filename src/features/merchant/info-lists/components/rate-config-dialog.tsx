import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  getChannelTypeList,
  getMerchantRate,
  updateMerchantRate,
} from '@/api/merchant'
import { type IMerchantInfoType } from '../schema'

type RateItem = {
  id: string
  payCode: string
  label: string
  rate: string | number
  feeAmount: string | number
}

type RateConfigDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  merchant: IMerchantInfoType | null
  onSuccess: () => void
}

export function RateConfigDialog({
  open,
  onOpenChange,
  merchant,
  onSuccess,
}: RateConfigDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [collectionRates, setCollectionRates] = useState<RateItem[]>([])
  const [payoutRates, setPayoutRates] = useState<RateItem[]>([])
  const { t } = useLanguage()
  const currency = 'USD'

  useEffect(() => {
    if (open && merchant) {
      loadRateData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, merchant])

  const loadRateData = async () => {
    if (!merchant) return

    setIsLoading(true)
    try {
      // 获取渠道列表
      const channelRes = await getChannelTypeList(merchant.country)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const channelData = (channelRes as any)?.result || channelRes
      const payinChannel = channelData?.payinChannel || []
      const payoutChannel = channelData?.payoutChannel || []

      // 初始化代收渠道
      const collectionItems: RateItem[] = payinChannel.map(
        (channel: string) => ({
          id: '',
          payCode: channel,
          label: channel,
          rate: '',
          feeAmount: '',
        })
      )

      // 初始化代付渠道
      const payoutItems: RateItem[] = payoutChannel.map((channel: string) => ({
        id: '',
        payCode: channel,
        label: channel,
        rate: '',
        feeAmount: '',
      }))

      // 获取现有费率数据
      const rateRes = await getMerchantRate({ merchantId: merchant.appid })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rateData = (rateRes as any)?.result || rateRes
      
      if (Array.isArray(rateData)) {
        rateData.forEach((rateItem) => {
          const { payCode, rate, feeAmount, type, id } = rateItem

          if (type == 1) {
            // 代付
            const item = payoutItems.find((item) => item.payCode === payCode)
            if (item) {
              item.rate = rate || 0
              item.feeAmount = feeAmount || 0
              item.id = id || ''
            }
          } else if (type == 2) {
            // 代收
            const item = collectionItems.find(
              (item) => item.payCode === payCode
            )
            if (item) {
              item.rate = rate || 0
              item.feeAmount = feeAmount || 0
              item.id = id || ''
            }
          }
        })
      }

      setCollectionRates(collectionItems)
      setPayoutRates(payoutItems)
    } catch (error) {
      console.error('获取费率数据失败:', error)
      toast.warning(t('merchant.info.error.loadRateFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!merchant) return

    // 验证数据：可以不填，但如果填了费率就必须填单笔固定
    const allItems = [...collectionRates, ...payoutRates]
    const hasInvalidData = allItems.some((item) => {
      const hasRate = item.rate !== null && item.rate !== undefined && item.rate !== '' && String(item.rate).trim() !== ''
      const hasFeeAmount = item.feeAmount !== null && item.feeAmount !== undefined && item.feeAmount !== '' && String(item.feeAmount).trim() !== ''
      
      // 如果填了费率但没填单笔固定，或者填了单笔固定但没填费率，则无效
      if (hasRate && !hasFeeAmount) {
        return true // 只填费率不填单笔固定
      }
      if (!hasRate && hasFeeAmount) {
        return true // 只填单笔固定不填费率
      }
      
      return false
    })

    if (hasInvalidData) {
      toast.warning(t('merchant.info.validation.rateFeeRequired'))
      return
    }

    setIsSubmitting(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const submitData: Array<Record<string, any>> = []

      // 添加代收费率（只提交有数据的项）
      collectionRates.forEach((item) => {
        const hasRate = item.rate !== null && item.rate !== undefined && item.rate !== '' && String(item.rate).trim() !== ''
        const hasFeeAmount = item.feeAmount !== null && item.feeAmount !== undefined && item.feeAmount !== '' && String(item.feeAmount).trim() !== ''
        
        if (hasRate && hasFeeAmount) {
          submitData.push({
            id: item.id || '',
            appid: merchant.appid,
            payCode: item.payCode,
            rate: Number(item.rate),
            feeAmount: Number(item.feeAmount),
            type: '2', // 代收
            country: merchant.country,
          })
        }
      })

      // 添加代付费率（只提交有数据的项）
      payoutRates.forEach((item) => {
        const hasRate = item.rate !== null && item.rate !== undefined && item.rate !== '' && String(item.rate).trim() !== ''
        const hasFeeAmount = item.feeAmount !== null && item.feeAmount !== undefined && item.feeAmount !== '' && String(item.feeAmount).trim() !== ''
        
        if (hasRate && hasFeeAmount) {
          submitData.push({
            id: item.id || '',
            appid: merchant.appid,
            payCode: item.payCode,
            rate: Number(item.rate),
            feeAmount: Number(item.feeAmount),
            type: '1', // 代付
            country: merchant.country,
          })
        }
      })

      const res = await updateMerchantRate(submitData)
      if (res) {
        toast.success(t('merchant.info.success.rateUpdateSuccess'))
        onOpenChange(false)
        onSuccess()
      }
    } catch (_error) {
      toast.error(t('merchant.info.error.rateUpdateFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateRate = (
    type: 'collection' | 'payout',
    index: number,
    field: 'rate' | 'feeAmount',
    value: string
  ) => {
    const items = type === 'collection' ? collectionRates : payoutRates
    const setItems = type === 'collection' ? setCollectionRates : setPayoutRates
    
    const newItems = [...items]
    const numValue = value === '' ? '' : Number(value)
    
    if (numValue !== '' && numValue < 0) {
      newItems[index][field] = 0
    } else {
      newItems[index][field] = numValue
    }
    
    setItems(newItems)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t('merchant.info.rateConfig')}</DialogTitle>
          <DialogDescription>
            {t('merchant.merchant')}：<span className='font-semibold'>{merchant?.companyName}</span>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : (
          <div className='space-y-6'>
            {/* 代收渠道配置 */}
            <div>
              <div className='mb-4 flex items-center justify-between border-b pb-2'>
                <h3 className='text-base font-semibold'>{t('merchant.info.collectionChannel')}</h3>
                <div className='flex gap-2 text-sm font-semibold'>
                  <span className='w-[150px] flex items-center'>{t('merchant.info.rate')}</span>
                  <span className='w-[150px]'>{t('merchant.info.singleFixedAmount')}({currency})</span>
                </div>
              </div>
              <div className='space-y-3'>
                {collectionRates.map((item, index) => (
                  <div key={item.payCode} className='flex items-center gap-2'>
                    <Label className='w-[180px] text-sm'>{item.label}:</Label>
                    <Input
                      type='number'
                      step='0.001'
                      min='0'
                      placeholder={t('merchant.info.rate')}
                      value={item.rate}
                      onChange={(e) =>
                        updateRate('collection', index, 'rate', e.target.value)
                      }
                      className='w-[150px]'
                    />
                    <Input
                      type='number'
                      step='0.01'
                      min='0'
                      placeholder={t('merchant.info.singleFee')}
                      value={item.feeAmount}
                      onChange={(e) =>
                        updateRate(
                          'collection',
                          index,
                          'feeAmount',
                          e.target.value
                        )
                      }
                      className='w-[150px]'
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 代付渠道配置 */}
            <div>
              <div className='mb-4 flex items-center justify-between border-b pb-2'>
                <h3 className='text-base font-semibold'>{t('merchant.info.payoutChannel')}</h3>
                <div className='flex gap-2 text-sm font-semibold'>
                  <span className='w-[150px] flex items-center'>{t('merchant.info.rate')}</span>
                  <span className='w-[150px]'>{t('merchant.info.singleFixedAmount')}({currency})</span>
                </div>
              </div>
              <div className='space-y-3'>
                {payoutRates.map((item, index) => (
                  <div key={item.payCode} className='flex items-center gap-2'>
                    <Label className='w-[180px] text-sm'>{item.label}:</Label>
                    <Input
                      type='number'
                      step='0.001'
                      min='0'
                      placeholder={t('merchant.info.rate')}
                      value={item.rate}
                      onChange={(e) =>
                        updateRate('payout', index, 'rate', e.target.value)
                      }
                      className='w-[150px]'
                    />
                    <Input
                      type='number'
                      step='0.01'
                      min='0'
                      placeholder={t('merchant.info.singleFee')}
                      value={item.feeAmount}
                      onChange={(e) =>
                        updateRate('payout', index, 'feeAmount', e.target.value)
                      }
                      className='w-[150px]'
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting || isLoading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
