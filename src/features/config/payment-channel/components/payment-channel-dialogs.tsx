import { useEffect, useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { addPaymentChannel, updatePaymentChannel } from '@/api/config'
import { type Country } from '@/stores/country-store'
import { getTranslation } from '@/lib/i18n'
import { useLanguage } from '@/context/language-provider'
import { useCountries } from '@/hooks/use-countries'
import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { usePaymentChannel } from './payment-channel-provider'
import { RateConfigDialog } from './rate-config-dialog'

// 添加/编辑表单 Schema - 使用工厂函数支持国际化
const createChannelFormSchema = (t: (key: string) => string) =>
  z.object({
    channelCode: z
      .string()
      .min(1, t('config.paymentChannel.validation.channelCodeRequired')),
    channelName: z
      .string()
      .min(1, t('config.paymentChannel.validation.channelNameRequired')),
    channelDesc: z.string().optional(),
    singleMinAmount: z.number().or(z.string()).optional(),
    singleMaxAmount: z.number().or(z.string()).optional(),
    dailyMaxAmount: z.number().or(z.string()).optional(),
    channelStatus: z.number(),
    transProcessTime: z.string().optional(),
    runTimeRange: z.string().optional(),
    country: z.string().optional(),
    remark: z.string().optional(),
  })

type ChannelFormValues = z.infer<ReturnType<typeof createChannelFormSchema>>

// 添加/编辑对话框
export function ChannelMutateDialog() {
  const { lang, t } = useLanguage()
  const { open, setOpen, currentRow, setCurrentRow } = usePaymentChannel()
  const queryClient = useQueryClient()
  const isEdit = open === 'edit'

  const { data: countriesData } = useCountries()
  const countries = useMemo<Country[]>(
    () => (countriesData?.result || countriesData?.data || []) as Country[],
    [countriesData]
  )

  const channelFormSchema = createChannelFormSchema((key: string) =>
    getTranslation(lang, key)
  )

  const form = useForm<ChannelFormValues>({
    resolver: zodResolver(channelFormSchema),
    defaultValues: {
      channelCode: '',
      channelName: '',
      channelDesc: '',
      singleMinAmount: undefined,
      singleMaxAmount: undefined,
      dailyMaxAmount: undefined,
      channelStatus: 1,
      transProcessTime: '',
      runTimeRange: '',
      country: '',
      remark: '',
    },
  })

  // 初始化表单数据(编辑模式)
  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset({
        channelCode: currentRow.channelCode,
        channelName: currentRow.channelName,
        channelDesc: currentRow.channelDesc || '',
        singleMinAmount: currentRow.singleMinAmount || undefined,
        singleMaxAmount: currentRow.singleMaxAmount || undefined,
        dailyMaxAmount: currentRow.dailyMaxAmount || undefined,
        channelStatus: currentRow.channelStatus,
        transProcessTime: currentRow.transProcessTime || '',
        runTimeRange: currentRow.runTimeRange || '',
        country: currentRow.country || '',
        remark: currentRow.remark || '',
      })
    } else if (open === 'create') {
      form.reset({
        channelCode: '',
        channelName: '',
        channelDesc: '',
        singleMinAmount: undefined,
        singleMaxAmount: undefined,
        dailyMaxAmount: undefined,
        channelStatus: 1,
        transProcessTime: '',
        runTimeRange: '',
        country: '',
        remark: '',
      })
    }
  }, [isEdit, currentRow, open, form])

  const mutation = useMutation({
    mutationFn: (data: ChannelFormValues & { id?: number }) => {
      if (isEdit && currentRow) {
        return updatePaymentChannel({ ...data, id: currentRow.id } as never)
      }
      return addPaymentChannel(data as never)
    },
    onSuccess: (res) => {
      if (res.code == 200) {
        queryClient.invalidateQueries({ queryKey: ['payment-channels'] })
        toast.success(
          isEdit ? t('common.updateSuccess') : t('common.addSuccess')
        )
        handleClose()
      } else {
        toast.error(res.message || t('common.operationFailed'))
      }
    },
    onError: (error: unknown) => {
      toast.error((error as Error).message || t('common.operationFailed'))
    },
  })

  const onSubmit = (data: ChannelFormValues) => {
    mutation.mutate(data as never)
  }

  const handleClose = () => {
    setOpen(null)
    setCurrentRow(null)
    form.reset()
  }
  return (
    <Dialog
      open={open === 'create' || open === 'edit'}
      onOpenChange={handleClose}
    >
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('config.paymentChannel.editChannel')
              : t('config.paymentChannel.addChannel')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-4 space-y-4'
          >
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='channelCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('config.paymentChannel.channelCode')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'config.paymentChannel.channelCodePlaceholder'
                        )}
                        {...field}
                        disabled={isEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='channelName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('config.paymentChannel.channelName')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'config.paymentChannel.channelNamePlaceholder'
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='channelDesc'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('config.paymentChannel.channelDesc')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        'config.paymentChannel.channelDescPlaceholder'
                      )}
                      {...field}
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-3 gap-4'>
              <FormField
                control={form.control}
                name='singleMinAmount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('config.paymentChannel.singleMinAmount')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='0.00'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='singleMaxAmount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('config.paymentChannel.singleMaxAmount')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='0.00'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='dailyMaxAmount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('config.paymentChannel.dailyMaxAmount')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='0.00'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='transProcessTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('config.paymentChannel.transProcessTime')}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='1-3秒、T+1到账' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='runTimeRange'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('config.paymentChannel.runTimeRange')}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='00:00-24:00' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='country'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.country')}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          className='h-9 w-full sm:w-[160px]'
                          clearable={false}
                          disabled={open == 'edit'}
                        >
                          <SelectValue placeholder='选择国家'>
                            {field.value && (
                              <div className='flex items-center gap-2'>
                                <img
                                  src={`/images/${field.value}.svg`}
                                  alt={field.value}
                                  className='h-4 w-4'
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                                <span>
                                  {t(`common.countrys.${field.value}`)}
                                </span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              <div className='flex items-center gap-2'>
                                <img
                                  src={`/images/${country.code}.svg`}
                                  alt={country.code}
                                  className='h-4 w-4'
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                                <span>
                                  {t(`common.countrys.${country.code}`)}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='channelStatus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.status')}</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger
                          clearable={false}
                          className='sm:w-[140px]'
                          disabled={open == 'edit'}
                        >
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='1'>
                          {t('config.paymentChannel.statusNormal')}
                        </SelectItem>
                        <SelectItem value='2'>
                          {t('config.paymentChannel.statusMaintenance')}
                        </SelectItem>
                        <SelectItem value='3'>
                          {t('config.paymentChannel.statusPaused')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='remark'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.remark')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('config.paymentChannel.remarkPlaceholder')}
                      {...field}
                      rows={2}
                    />
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
                {mutation.isPending
                  ? t('common.submitting')
                  : t('common.confirm')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// 统一对话框管理
export function PaymentChannelDialogs() {
  return (
    <>
      <RateConfigDialog />
      <ChannelMutateDialog />
    </>
  )
}
