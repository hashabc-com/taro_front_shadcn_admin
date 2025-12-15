import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCountryStore } from '@/stores'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { addCustomer, updateCustomer} from '@/api/merchant'
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
import { type IMerchantInfoType } from '../schema'
import { useLanguage } from '@/context/language-provider'

const editMerchantSchema = z.object({
  account: z.string().min(1, '请输入账号'),
  password: z.string().optional(),
  companyName: z.string().min(1, '请输入商户名称'),
  freezeType: z.number(),
  accountFreezeDay: z.number().min(0, '不能为负数').nullable(),
  provice: z.string(),
  zipcode: z.string().nullable().optional(),
  gauthKey: z.string().min(1, '请输入谷歌验证码'),
})

type EditMerchantFormValues = z.infer<typeof editMerchantSchema>

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

  const form = useForm<EditMerchantFormValues>({
    resolver: zodResolver(editMerchantSchema),
    defaultValues: {
      account: '',
      password: '',
      companyName: '',
      freezeType: 0,
      accountFreezeDay: null,
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
        freezeType: merchant.freezeType || 0,
        accountFreezeDay: merchant.accountFreezeDay || null,
        provice: merchant.provice || '0',
        zipcode: merchant.zipcode ? String(merchant.zipcode) : null,
        gauthKey: '',
      })
    } else if (open && isAdd) {
      form.reset({
        account: '',
        password: '',
        companyName: '',
        freezeType: 0,
        accountFreezeDay: null,
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
          <DialogTitle>{isAdd ? t('common.add') + t('merchant.merchant') : t('common.edit') + t('merchant.merchant')}</DialogTitle>
          <DialogDescription>
            {isAdd ? t('merchant.info.createDescription') : t('merchant.info.editDescription')}
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
                    {t('merchant.info.account')}<span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t('merchant.info.validation.accountRequired')} {...field} />
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
                      {t('merchant.info.password')}<span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder={t('merchant.info.validation.passwordRequired')}
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
                    {t('merchant.info.merchantName')}<span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t('merchant.info.validation.merchantNameRequired')} {...field} />
                  </FormControl>
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
                      {t('merchant.info.freezeType')}<span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={String(field.value)}
                        className='flex gap-4'
                      >
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='0' id='type-t' />
                          <Label htmlFor='type-t'>{t('merchant.info.transactionDay')}(T)</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='1' id='type-d' />
                          <Label htmlFor='type-d'>{t('merchant.info.naturalDay')}(D)</Label>
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
                      {t('merchant.info.settlementDays')}<span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder={t('merchant.info.validation.daysRequired')}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(value ? Number(value) : null)
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
                    {t('common.googleAuthCode')}<span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t('common.enterGoogleAuthCode')} {...field} />
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
