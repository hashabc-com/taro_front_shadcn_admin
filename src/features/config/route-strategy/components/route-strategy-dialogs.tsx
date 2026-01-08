import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useRouteStrategy } from './route-strategy-provider'
import { getMerchantList } from '@/api/common'
import { useMerchantStore, type Merchant } from '@/stores/merchant-store'
import {
  addRouteStrategy,
  getPaymentMethods,
  getPaymentChannelsByMethod,
  getRouteStrategyWeightDetail,
} from '@/api/config'
import { type PaymentChannelOption } from '../schema'
import { useCountryStore } from '@/stores'
import { useLanguage } from '@/context/language-provider'
import { getTranslation } from '@/lib/i18n'

// 添加路由策略表单 Schema
const createRouteStrategyFormSchema = (t: (key: string) => string) => z.object({
  appid: z.string().optional(),
  paymentType: z.string(),
  productCode: z.string().min(1, t('config.routeStrategy.validation.selectPaymentMethod')),
  routeStrategy: z.string(),
  channels: z.array(z.object({
    paymentPlatform: z.string(),
    weight: z.number().min(0).max(100).optional(),
    id: z.number().optional(),
  })).min(1, t('config.routeStrategy.validation.selectAtLeastOneChannel')),
})

type RouteStrategyFormValues = z.infer<ReturnType<typeof createRouteStrategyFormSchema>>

// 添加/编辑对话框
export function RouteStrategyMutateDialog() {
  const { lang, t } = useLanguage()
  const { open, setOpen, currentRow, setCurrentRow } = useRouteStrategy()
  const queryClient = useQueryClient()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const isEdit = open === 'edit'
  const isOpen = open === 'create' || open === 'edit'
  
  const routeStrategyFormSchema = createRouteStrategyFormSchema((key: string) => getTranslation(lang, key))

  const form = useForm<RouteStrategyFormValues>({
    resolver: zodResolver(routeStrategyFormSchema),
    defaultValues: {
      appid: '',
      paymentType: '2',
      productCode: '',
      routeStrategy: '1',
      channels: [],
    },
  })

  const paymentType = form.watch('paymentType')
  const productCode = form.watch('productCode')
  const routeStrategy = form.watch('routeStrategy')
  const channels = form.watch('channels')

  // 1. 获取商户列表
  const { data: merchantData } = useQuery({
    queryKey: ['merchants', selectedCountry?.code, selectedMerchant?.appid],
    queryFn: getMerchantList,
    enabled: !!selectedCountry && isOpen
  })
  const merchants = (merchantData?.result || []) as Merchant[]

  // 2. 获取支付方式列表（根据类型）
  const { data: paymentMethodsData } = useQuery({
    queryKey: ['payment-methods', selectedCountry?.code, paymentType],
    queryFn: () => getPaymentMethods({ 
      country: selectedCountry!.code, 
      type: paymentType 
    }),
    enabled: !!selectedCountry && !!paymentType && isOpen,
  })
  const paymentMethods = (paymentMethodsData?.result || []) as string[]

  // 3. 获取支付渠道列表（仅新增模式）
  const { data: channelsData } = useQuery({
    queryKey: ['payment-channels-by-method', selectedCountry?.code, paymentType, productCode],
    queryFn: () => getPaymentChannelsByMethod({ 
      country: selectedCountry!.code, 
      type: paymentType,
      subchannelcode: productCode 
    }),
    enabled: !!selectedCountry && !!paymentType && !!productCode && isOpen && !isEdit,
  })

  // 4. 获取权重轮询渠道列表（编辑模式下两种策略都使用）
  const { data: weightDetailData } = useQuery({
    queryKey: ['route-strategy-weight-detail', selectedCountry?.code, currentRow?.appid, productCode, paymentType],
    queryFn: () => getRouteStrategyWeightDetail({ 
      country: selectedCountry!.code, 
      appid: currentRow?.appid || '',
      productCode: productCode, 
      paymentType: paymentType
    }),
    enabled: isEdit && !!selectedCountry && !!productCode && isOpen,
  })

  // 获取当前显示的渠道列表
  const availableChannels: Array<{ id: number; channelCode: string }> = isEdit
    ? (weightDetailData?.result?.paymentRouteChannelWeightList || []).map((item: { paymentPlatform: string; weight: number; id?: number; channelCode?: string }) => ({
        id: item.id || 0,
        channelCode: item.paymentPlatform,
      }))
    : (channelsData?.result || []) as PaymentChannelOption[]

  // 初始化表单（只在对话框打开时执行一次）
  useEffect(() => {
    if (!isOpen) return

    if (open === 'create') {
      form.reset({
        appid: '',
        paymentType: '2',
        productCode: '',
        routeStrategy: '1',
        channels: [],
      })
    } else if (open === 'edit' && currentRow) {
      // 编辑模式：回显数据
      const channelList = currentRow.paymentRouteChannelWeightList?.map(item => ({
        paymentPlatform: item.paymentPlatform,
        weight: item.weight,
        id: item.id,
      })) || []
      
      form.reset({
        appid: currentRow.appid || '',
        paymentType: currentRow.paymentType,
        productCode: currentRow.productCode,
        routeStrategy: currentRow.routeStrategy,
        channels: channelList as RouteStrategyFormValues['channels'],
      })
    }
  }, [open, currentRow, isOpen, form])

  // 当类型或支付方式变化时，清空已选渠道（仅新增模式）
  useEffect(() => {
    if (open === 'create') {
      form.setValue('channels', [])
    }
  }, [paymentType, productCode, open, form])

  // 当路由策略变化时，清空已选渠道（编辑模式）- 使两种策略的选择状态独立
  // useEffect(() => {
  //   if (isEdit && productCode) {
  //     form.setValue('channels', [])
  //   }
  // }, [routeStrategy, isEdit, form, productCode])

  // 当权重详情数据返回时，更新表单的渠道选择和权重
  useEffect(() => {
    if (isEdit && weightDetailData?.result?.paymentRouteChannelWeightList) {
      const channelList = weightDetailData.result.paymentRouteChannelWeightList.map((item: { paymentPlatform: string; weight: number,id?: number }) => ({
        paymentPlatform: item.paymentPlatform,
        weight: item.weight,
        id: item.id,
      }))
      form.setValue('channels', channelList)
    }
  }, [weightDetailData, isEdit, form])

  const mutation = useMutation({
    mutationFn: (data: RouteStrategyFormValues) => {
      const payload = {
        id: currentRow?.id,
        appid: data.appid || undefined,
        paymentType: data.paymentType,
        productCode: data.productCode,
        routeStrategy: data.routeStrategy,
        country: selectedCountry!.code,
        paymentRouteChannelWeightList: data.channels,
      }
      return addRouteStrategy(payload)
    },
    onSuccess: (res) => {
      if (res.code == 200) {
        queryClient.invalidateQueries({ queryKey: ['route-strategies'] })
        toast.success(t( open === 'create' ? 'common.addSuccess' : 'common.updateSuccess'))
        handleClose()
      } else {
        toast.error(res.message || t('common.operationFailed'))
      }
    },
    onError: (error: unknown) => {
      toast.error((error as Error).message || t('common.operationFailed'))
    },
  })

  const onSubmit = (data: RouteStrategyFormValues) => {
    mutation.mutate(data)
  }

  const handleClose = () => {
    setOpen(null)
    setCurrentRow(null)
    form.reset()
  }

  // 切换渠道选中状态
  const handleChannelToggle = (channelCode: string, checked: boolean, channelId?: number) => {
    const currentChannels = channels || []
    if (checked) {
      const newChannel: { paymentPlatform: string; weight?: number; id?: number } = {
        paymentPlatform: channelCode, 
        weight: routeStrategy === '1' ? 0 : undefined,
      }
      // 只在编辑模式且有id时才添加id字段
      if (isEdit && channelId !== undefined) {
        newChannel.id = channelId
      }
      form.setValue('channels', [...currentChannels, newChannel])
    } else {
      form.setValue('channels', currentChannels.filter(ch => ch.paymentPlatform !== channelCode))
    }
  }

  // 更新渠道权重
  const handleWeightChange = (channelCode: string, weight: string) => {
    const currentChannels = channels || []
    const updatedChannels = currentChannels.map(ch => 
      ch.paymentPlatform === channelCode 
        ? { ...ch, weight: Number(weight) || 0 } 
        : ch
    )
    form.setValue('channels', updatedChannels)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('config.routeStrategy.editRouteConfig') : t('config.routeStrategy.addRouteConfig')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 mt-4'>
            <FormField
              control={form.control}
              name='appid'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('config.routeStrategy.merchantName')}
                    <span className='ml-2 text-xs font-normal text-orange-600 dark:text-orange-400'>
                      {t('config.routeStrategy.merchantOptionalTip')}
                    </span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isEdit}
                  >
                    <FormControl>
                      <SelectTrigger clearable={false}>
                        <SelectValue placeholder={t('common.selectMerchant')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {merchants.map((merchant) => (
                        <SelectItem key={merchant.appid} value={merchant.appid}>
                          {merchant.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='paymentType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('config.routeStrategy.type')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.setValue('productCode', '')
                        form.setValue('channels', [])
                      }}
                      value={field.value}
                      className='flex gap-4'
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='1' id='type-1' />
                        <label htmlFor='type-1' className='cursor-pointer text-sm'>
                          {t('config.routeStrategy.payout')}
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='2' id='type-2' />
                        <label htmlFor='type-2' className='cursor-pointer text-sm'>
                          {t('config.routeStrategy.collection')}
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='productCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('config.routeStrategy.paymentMethod')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className='flex flex-wrap gap-4'
                    >
                      {paymentMethods.map((method) => (
                        <div key={method} className='flex items-center space-x-2'>
                          <RadioGroupItem value={method} id={`method-${method}`} />
                          <label htmlFor={`method-${method}`} className='cursor-pointer text-sm'>
                            {method}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='routeStrategy'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('config.routeStrategy.routeStrategy')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className='flex gap-4'
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='1' id='strategy-1' />
                        <label htmlFor='strategy-1' className='cursor-pointer text-sm'>
                          {t('config.routeStrategy.weightRoundRobin')}
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='2' id='strategy-2' />
                        <label htmlFor='strategy-2' className='cursor-pointer text-sm'>
                          {t('config.routeStrategy.costPriority')}
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='channels'
              render={() => (
                <FormItem>
                  <FormLabel>{t('config.routeStrategy.paymentChannels')}</FormLabel>
                  <div className='space-y-3 border rounded-md p-4'>
                    {availableChannels.length > 0 ? (
                      availableChannels.map((channel) => {
                        const isChecked = channels?.some(ch => ch.paymentPlatform === channel.channelCode)
                        const channelWeight = channels?.find(ch => ch.paymentPlatform === channel.channelCode)?.weight || 0
                        
                        return (
                          <div key={channel.id} className='flex items-center gap-4'>
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => 
                                handleChannelToggle(channel.channelCode, !!checked, isEdit ? channel.id : undefined)
                              }
                              id={`channel-${channel.id}`}
                            />
                            <label 
                              htmlFor={`channel-${channel.id}`} 
                              className='flex-1 cursor-pointer font-medium'
                            >
                              {channel.channelCode}
                            </label>
                            {routeStrategy === '1' && isChecked && (
                              <div className='flex items-center gap-2'>
                                <span className='text-sm text-muted-foreground'>
                                  {t('config.routeStrategy.weight')}:
                                </span>
                                <Input
                                  type='number'
                                  min='0'
                                  max='100'
                                  value={channelWeight}
                                  onChange={(e) => handleWeightChange(channel.channelCode, e.target.value)}
                                  className='w-20'
                                  placeholder='0-100'
                                />
                              </div>
                            )}
                          </div>
                        )
                      })
                    ) : (
                      <div className='text-sm text-muted-foreground text-center py-4'>
                        {productCode ? t('common.noData') : t('config.routeStrategy.selectPaymentMethodFirst')}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose}>
                {t('common.cancel')}
              </Button>
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? t('common.submitting') : t('common.confirm')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// 统一对话框管理
export function RouteStrategyDialogs() {
  return (
    <>
      <RouteStrategyMutateDialog />
    </>
  )
}
