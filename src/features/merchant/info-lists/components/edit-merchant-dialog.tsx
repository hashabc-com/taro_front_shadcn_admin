import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCountryStore } from '@/stores'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { addCustomer, getQueueGroup, updateCustomer } from '@/api/merchant'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type IMerchantInfoType } from '../schema'
import { useQuery } from '@tanstack/react-query'

type EditMerchantDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  merchant: IMerchantInfoType | null
  isAdd: boolean
  onSuccess: () => void
}

export function EditMerchantDialog({
  open,
  onOpenChange,
  merchant,
  isAdd,
  onSuccess,
}: EditMerchantDialogProps) {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { selectedCountry } = useCountryStore()

  const { data } = useQuery({
    queryKey: ['queueGroup'],
    queryFn: () => getQueueGroup()
  })

  const editMerchantSchema = useMemo(() => z.object({
    account: z.string().min(1, t('merchant.info.validation.accountRequired')),
    password: z.string().optional(),
    companyName: z.string().min(1, t('merchant.info.validation.merchantNameRequired')),
    callbackQueue: z.string().min(1, t('merchant.info.validation.callbackQueueRequired')),
    freezeType: z.number(),
    accountFreezeDay: z.preprocess((val) => {
      if (val === '' || val === null || val === undefined) return 0
      return Number(val)
    }, z.number().min(0, t('merchant.info.validation.daysMinZero'))),
    provice: z.string(),
    zipcode: z.string().nullable().optional(),
    gauthKey: z.string().min(1, t('common.googleAuthCodeRequired')),
  }), [t])

  type EditMerchantFormValues = z.infer<typeof editMerchantSchema>

  const form = useForm({
    resolver: zodResolver(editMerchantSchema),
    defaultValues: {
      account: '',
      password: '',
      companyName: '',
      callbackQueue: '',
      freezeType: 0,
      accountFreezeDay: 0,
      provice: '0',
      zipcode: null,
      gauthKey: '',
    },
  })

  useEffect(() => {
    if (open && merchant && !isAdd) {
      form.reset({
        account: merchant.account || '',
        companyName: merchant.companyName || '',
        callbackQueue: merchant.callbackQueue || '',
        freezeType: merchant.freezeType || 0,
        accountFreezeDay: merchant.accountFreezeDay ?? 0,
        provice: merchant.provice || '0',
        zipcode: merchant.zipcode ? String(merchant.zipcode) : null,
        gauthKey: '',
      })
    } else if (open && isAdd) {
      form.reset({
        account: '',
        password: '',
        companyName: '',
        callbackQueue: '',
        freezeType: 0,
        accountFreezeDay: 0,
        provice: '0',
        zipcode: null,
        gauthKey: '',
      })
    }
  }, [open, merchant, isAdd, form])

  const onSubmit = async (values: EditMerchantFormValues) => {
    if (isAdd && !selectedCountry) {
      toast.warning('请先选择国家')
      return
    }

    setIsSubmitting(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {
      account: values.account,
      companyName: values.companyName,
      callbackQueue: values.callbackQueue,
      freezeType: values.freezeType,
      accountFreezeDay: values.accountFreezeDay,
      provice: values.provice,
      zipcode: values.zipcode ? Number(values.zipcode) : null,
      gauthKey: values.gauthKey,
    }

    if (isAdd) {
      params.password = values.password
      params.country = selectedCountry
    } else {
      params.id = merchant!.id
      params.country = merchant!.country
    }

    const api = isAdd ? addCustomer : updateCustomer
    const res = await api(params)

    if (res.code == 200) {
      toast.success(isAdd ? t('common.addSuccess') : t('common.updateSuccess'))
      onOpenChange(false)
      onSuccess()
    } else {
      toast.error(res.message || '操作失败')
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            {isAdd
              ? t('common.add') + t('merchant.merchant')
              : t('common.edit') + t('merchant.merchant')}
          </DialogTitle>
          <DialogDescription>
            {isAdd
              ? t('merchant.info.createDescription')
              : t('merchant.info.editDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='account'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('merchant.info.account')}
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        'merchant.info.validation.accountRequired'
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isAdd && (
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('merchant.info.password')}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder={t(
                          'merchant.info.validation.passwordRequired'
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name='companyName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('merchant.info.merchantName')}
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        'merchant.info.validation.merchantNameRequired'
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='callbackQueue'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('merchant.info.callbackQueue')}
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger clearable={false} className='w-[180px]'>
                        <SelectValue placeholder={t('merchant.info.validation.callbackQueueRequired')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data?.result?.map((queue: string) => (
                        <SelectItem key={queue} value={queue}>
                          {queue}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='freezeType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('merchant.info.freezeType')}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={String(field.value)}
                        className='flex gap-4'
                      >
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='0' id='type-t' />
                          <Label htmlFor='type-t'>
                            {t('merchant.info.transactionDay')}(T)
                          </Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='1' id='type-d' />
                          <Label htmlFor='type-d'>
                            {t('merchant.info.naturalDay')}(D)
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='accountFreezeDay'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('merchant.info.settlementDays')}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder={t('merchant.info.validation.daysRequired')}
                        {...field}
                        value={field.value != null ? String(field.value) : ''}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(value ? Number(value) : 0)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='gauthKey'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('common.googleAuthCode')}
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('common.enterGoogleAuthCode')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                {t('common.cancel')}
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                {isAdd ? t('common.add') : t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
