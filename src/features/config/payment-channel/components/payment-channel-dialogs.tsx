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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { usePaymentChannel } from './payment-channel-provider'
import {
  getMerchantList,
  getPaymentChannels,
  type IPaymentChannel,
} from '@/api/common'
import { useMerchantStore, type Merchant } from '@/stores/merchant-store'
import {
  addPayChannel,
  updateChannelInfo,
  configChannel,
  getPaymentShopList,
  updatePaymentShopStatus,
} from '@/api/config'
import { type PaymentShop } from '../schema'
import { Power, PowerOff } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useCountryStore } from '@/stores'
import { useLanguage } from '@/context/language-provider'
import { getTranslation } from '@/lib/i18n'

// 添加/编辑表单 Schema - 使用工厂函数支持国际化
const createChannelFormSchema = (t: (key: string) => string) => z.object({
  merchantId: z.string().min(1, t('config.paymentChannel.validation.selectMerchant')),
  type: z.number(),
  channels: z.array(z.string()).min(1, t('config.paymentChannel.validation.selectAtLeastOneChannel')),
})

type ChannelFormValues = z.infer<ReturnType<typeof createChannelFormSchema>>

type ConfigFormValues = z.infer<ReturnType<typeof createConfigFormSchema>>

// 一键配置表单 Schema - 使用工厂函数支持国际化
const createConfigFormSchema = (t: (key: string) => string) => z.object({
  type: z.number(),
  paymentPlatform: z.string().min(1, t('config.paymentChannel.validation.selectPaymentChannel')),
  withdrawalsShop: z.string().min(1, t('config.paymentChannel.validation.selectSubChannel')),
})

// type ConfigFormValues = z.infer<ReturnType<typeof createConfigFormSchema>>

// 添加/编辑对话框
export function ChannelMutateDialog() {
  const { lang, t } = useLanguage()
  const { open, setOpen, currentRow, setCurrentRow } = usePaymentChannel()
  const queryClient = useQueryClient()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const isEdit = open === 'edit'
  
  const channelFormSchema = createChannelFormSchema((key: string) => getTranslation(lang, key))

  const form = useForm<ChannelFormValues>({
    resolver: zodResolver(channelFormSchema),
    defaultValues: {
      merchantId: '',
      type: 1,
      channels: [],
    },
  })

  const type = form.watch('type')

  // 获取商户列表
  const { data: merchantData } = useQuery({
    queryKey: ['merchants',selectedCountry?.code, selectedMerchant?.appid],
    queryFn: getMerchantList,
    enabled: !!selectedCountry
  })

  // 获取渠道列表
  const { data: channelData } = useQuery({
    queryKey: ['channels', type,selectedCountry?.code, selectedMerchant?.appid],
    queryFn: () => getPaymentChannels(type === 1 ? 'withdraw_channel' : 'pay_channel'),
    enabled: !!selectedCountry
  })

  const merchants = (merchantData?.result || []) as Merchant[]
  const channels = (channelData?.result as IPaymentChannel[]) || []

  // 初始化表单数据(编辑模式)
  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset({
        merchantId: currentRow.merchantId,
        type: currentRow.type,
        channels: currentRow.channel.split(','),
      })
    } else if (open === 'create') {
      form.reset({
        merchantId: '',
        type: 1,
        channels: [],
      })
    }
  }, [isEdit, currentRow, open, form])

  const mutation = useMutation({
    mutationFn: (data: ChannelFormValues & { id?: number; notChannel: string }) => {
      if (isEdit && currentRow) {
        return updateChannelInfo({ ...data, id: currentRow.id } as never)
      }
      return addPayChannel(data as never)
    },
    onSuccess: (res) => {
      if(res.code == 200){
        queryClient.invalidateQueries({ queryKey: ['payment-channels'] })
        toast.success(isEdit ? t('common.updateSuccess') : t('common.addSuccess'))
      }else{
        toast.error(res.message || '操作失败')
      }
      handleClose()
    },
    onError: (error: unknown) => {
      toast.error((error as Error).message || '操作失败')
    },
  })

  const onSubmit = (data: ChannelFormValues) => {
    const allChannels = channels.map((ch) => ch.itemValue)
    const notChannel = allChannels.filter((ch) => !data.channels.includes(ch)).join(',')

    mutation.mutate({
      ...data,
      channel: data.channels.join(','),
      notChannel,
    } as never)
  }

  const handleClose = () => {
    setOpen(null)
    setCurrentRow(null)
    form.reset()
  }
  return (
    <Dialog open={open === 'create' || open === 'edit'} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{isEdit ? t('config.paymentChannel.editMerchantConfig') : t('config.paymentChannel.addMerchantConfig')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 mt-6'>
            <FormField
              control={form.control}
              name='merchantId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('config.paymentChannel.merchantName')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isEdit}
                  >
                    <FormControl>
                      <SelectTrigger>
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
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('config.paymentChannel.type')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(Number(value))
                        form.setValue('channels', [])
                      }}
                      value={String(field.value)}
                      className='flex gap-4'
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='1' id='type-1' />
                        <label htmlFor='type-1' className='cursor-pointer'>
                          {t('config.paymentChannel.payout')}
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='2' id='type-2' />
                        <label htmlFor='type-2' className='cursor-pointer'>
                          {t('config.paymentChannel.collection')}
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
                  <FormLabel>{t('config.paymentChannel.supportedChannels')}</FormLabel>
                  <div className='flex flex-wrap gap-4'>
                    {channels.map((channel) => (
                      <FormField
                        key={channel.itemValue}
                        control={form.control}
                        name='channels'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(channel.itemValue)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, channel.itemValue])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== channel.itemValue
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className='cursor-pointer font-normal'>
                              {channel.itemValue}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose}>
                取消
              </Button>
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? '提交中...' : '确定'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// 一键配置对话框
export function GlobalConfigDialog() {
  const { t } = useLanguage()
  const { open, setOpen } = usePaymentChannel()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const queryClient = useQueryClient()
  
  const configFormSchema = createConfigFormSchema(t)

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      type: 1,
      paymentPlatform: '',
      withdrawalsShop: '',
    },
  })

  const type = form.watch('type')
  const paymentPlatform = form.watch('paymentPlatform')

  // 获取渠道列表
  const { data: channelData } = useQuery({
    queryKey: ['channels', type,selectedCountry?.code, selectedMerchant?.appid],
    queryFn: () => getPaymentChannels(type === 1 ? 'withdraw_channel' : 'pay_channel'),
    enabled: !!selectedCountry
  })

  const channels = (channelData?.result as IPaymentChannel[]) || []
  const subChannels =
    channels.find((ch) => ch.itemValue === paymentPlatform)?.children || []

  useEffect(() => {
    if (open === 'config') {
      form.reset({
        type: 1,
        paymentPlatform: '',
        withdrawalsShop: '',
      })
    }
  }, [open, form])

  const mutation = useMutation({
    mutationFn: configChannel,
    onSuccess: (res) => {
      if(res.code == 200){
        queryClient.invalidateQueries({ queryKey: ['payment-channels'] })
        toast.success(t('config.paymentChannel.configSuccess'))
      }else{
        toast.error(res.message || t('common.operationFailed'))
      }
      handleClose()
    },
    onError: (error: unknown) => {
      toast.error((error as Error).message || t('common.operationFailed'))
    },
  })

  const onSubmit = (data: ConfigFormValues) => {
    mutation.mutate(data as never)
  }

  const handleClose = () => {
    setOpen(null)
    form.reset()
  }

  return (
    <Dialog open={open === 'config'} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle>{t('config.paymentChannel.oneClickConfig')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 mt-6'>
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('config.paymentChannel.type')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(Number(value))
                        form.setValue('paymentPlatform', '')
                        form.setValue('withdrawalsShop', '')
                      }}
                      value={String(field.value)}
                      className='flex gap-4'
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='1' id='config-type-1' />
                        <label htmlFor='config-type-1' className='cursor-pointer'>
                          {t('config.paymentChannel.payout')}
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='2' id='config-type-2' />
                        <label htmlFor='config-type-2' className='cursor-pointer'>
                          {t('config.paymentChannel.collection')}
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
              name='paymentPlatform'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('config.paymentChannel.paymentChannel')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.setValue('withdrawalsShop', '')
                      }}
                      value={field.value}
                      className='flex flex-wrap gap-4'
                    >
                      {channels.map((channel) => (
                        <div key={channel.itemValue} className='flex items-center space-x-2'>
                          <RadioGroupItem
                            value={channel.itemValue}
                            id={`platform-${channel.itemValue}`}
                          />
                          <label
                            htmlFor={`platform-${channel.itemValue}`}
                            className='cursor-pointer'
                          >
                            {channel.itemValue}
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
              name='withdrawalsShop'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('config.paymentChannel.subChannel')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className='flex gap-4'
                      disabled={!paymentPlatform}
                    >
                      {subChannels.map((subChannel) => (
                        <div key={subChannel.itemValue} className='flex items-center space-x-2'>
                          <RadioGroupItem
                            value={subChannel.itemValue}
                            id={`sub-${subChannel.itemValue}`}
                          />
                          <label
                            htmlFor={`sub-${subChannel.itemValue}`}
                            className='cursor-pointer'
                          >
                            {subChannel.itemValue}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
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

// 渠道详情抽屉(替代原来的跳转页面)
export function ChannelDetailDrawer() {
  const { t } = useLanguage()
  const { open, setOpen, detailMerchantId, detailType } = usePaymentChannel()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['payment-shops', detailMerchantId, detailType],
    queryFn: () =>{
        const formData = new FormData();
        formData.append('merchantId', detailMerchantId!);
        formData.append('type', String(detailType!));
        formData.append('pageSize', '50');
        formData.append('pageNum', '1');
        return getPaymentShopList(formData)
    },
    enabled: open === 'detail' && !!detailMerchantId && !!detailType,
  })

  const shops = (data?.result?.listRecord as PaymentShop[]) || []

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>{
        const formData = new FormData();
        formData.append('id', String(id));
        formData.append('status', String(status));
        return  updatePaymentShopStatus(formData)
    },
    onSuccess: (res) => {
      if(res.code == 200){
        queryClient.invalidateQueries({ queryKey: ['payment-shops'] })
        toast.success(t('common.statusUpdateSuccess'))
      }else{
        toast.error(res.message || t('common.statusUpdateFailed'))
      }
    },
    onError: (error: unknown) => {
      toast.error((error as Error).message || '操作失败')
    },
  })

  const handleStatusToggle = (shop: PaymentShop) => {
    const newStatus = shop.status ? 0 : 1
    statusMutation.mutate({ id: shop.id, status: newStatus })
  }

  const handleClose = () => {
    setOpen(null)
  }

  return (
    <Sheet open={open === 'detail'} onOpenChange={handleClose}>
      <SheetContent className='flex flex-col sm:max-w-[700px]'>
        <SheetHeader className='text-start'>
          <SheetTitle>{t('config.paymentChannel.channelDetail')}</SheetTitle>
          <SheetDescription>{t('config.paymentChannel.channelDetailDesc')}</SheetDescription>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto'>
          {isLoading ? (
            <div className='space-y-3'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-16 w-full' />
              ))}
            </div>
          ) : (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('config.paymentChannel.providerName')}</TableHead>
                    <TableHead>{t('config.paymentChannel.withdrawalShop')}</TableHead>
                    <TableHead>{t('common.createTime')}</TableHead>
                    <TableHead className='w-[100px]'>{t('common.status')}</TableHead>
                    <TableHead className='w-[100px]'>{t('common.action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shops.length ? (
                    shops.map((shop) => (
                      <TableRow key={shop.id}>
                        <TableCell>{shop.paymentPlatform}</TableCell>
                        <TableCell>{shop.withdrawalsShop}</TableCell>
                        <TableCell>{shop.createTime}</TableCell>
                        <TableCell>
                          <Badge variant={shop.status ? 'destructive':'default'}>
                            {shop.status ? t('common.disabled') : t('common.enabled') }
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleStatusToggle(shop)}
                            disabled={statusMutation.isPending}
                          >
                            {shop.status ? (
                                <Power className='h-4 w-4' />
                            ) : (
                              <PowerOff className='h-4 w-4' />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className='h-24 text-center'>
                        {t('common.noData')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant='outline' className='w-full'>
              {t('common.close')}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// 统一对话框管理
export function PaymentChannelDialogs() {
  return (
    <>
      <ChannelMutateDialog />
      <GlobalConfigDialog />
      <ChannelDetailDrawer />
    </>
  )
}
