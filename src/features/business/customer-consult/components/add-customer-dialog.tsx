import { useMemo, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { addCustomerConsult } from '@/api/business'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
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
import { type AddCustomerFormData } from '../schema'

interface AddCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCustomerDialog({
  open,
  onOpenChange,
}: AddCustomerDialogProps) {
  const { t } = useLanguage()
  const queryClient = useQueryClient()

  // 动态创建 schema 以支持国际化错误消息
  const addCustomerFormSchema = useMemo(
    () =>
      z.object({
        contactPerson: z.string().min(1, {
          message: t('business.customerConsult.pleaseEnterContactPerson'),
        }),
        countryCode: z.string().min(1),
        phone: z
          .string()
          .min(1, { message: t('business.customerConsult.pleaseEnterPhone') }),
        email: z
          .string()
          .min(1, { message: t('business.customerConsult.pleaseEnterEmail') })
          .email({
            message: t('business.customerConsult.pleaseEnterValidEmail'),
          }),
        company: z.string().optional(),
        source: z.string().optional(),
        country: z.string().min(1, {
          message: t('business.customerConsult.pleaseSelectCountry'),
        }),
        consultContent: z.string().optional(),
        remark: z.string().optional(),
      }),
    [t]
  )

  const form = useForm<AddCustomerFormData>({
    resolver: zodResolver(addCustomerFormSchema),
    defaultValues: {
      contactPerson: '',
      countryCode: '86',
      phone: '',
      email: '',
      company: '',
      source: '',
      country: '',
      consultContent: '',
      remark: '',
    },
  })

  const mutation = useMutation({
    mutationFn: addCustomerConsult,
    onSuccess: (res) => {
      if (res.code == 200) {
        toast.success(t('common.createSuccess'))
        queryClient.invalidateQueries({ queryKey: ['customer-consult-list'] })
        onOpenChange(false)
        form.reset()
      }
    },
    onError: () => {
      toast.error(t('common.createFailed'))
    },
  })

  // 监听对话框关闭，重置表单
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  const onSubmit = (data: AddCustomerFormData) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t('business.customerConsult.addCustomer')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='contactPerson'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('business.customerConsult.contactPerson')} *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'business.customerConsult.pleaseEnterContactPerson'
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
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('business.customerConsult.phone')} *
                    </FormLabel>
                    <div className='flex gap-2'>
                      <FormField
                        control={form.control}
                        name='countryCode'
                        render={({ field: codeField }) => (
                          <Select
                            onValueChange={codeField.onChange}
                            value={codeField.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className='w-[100px]'
                                clearable={false}
                              >
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='86'>+86</SelectItem>
                              <SelectItem value='1'>+1</SelectItem>
                              <SelectItem value='44'>+44</SelectItem>
                              <SelectItem value='81'>+81</SelectItem>
                              <SelectItem value='82'>+82</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <FormControl>
                        <Input
                          placeholder={t(
                            'business.customerConsult.pleaseEnterPhone'
                          )}
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('business.customerConsult.email')} *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder={t(
                          'business.customerConsult.pleaseEnterEmail'
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
                name='company'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('business.customerConsult.company')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'business.customerConsult.pleaseEnterCompany'
                        )}
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
                name='country'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('business.customerConsult.country')} *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger clearable={false}>
                          <SelectValue
                            placeholder={t(
                              'business.customerConsult.pleaseSelectCountry'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='CN'>中国</SelectItem>
                        <SelectItem value='US'>美国</SelectItem>
                        <SelectItem value='ID'>印度尼西亚</SelectItem>
                        <SelectItem value='IN'>印度</SelectItem>
                        <SelectItem value='BR'>巴西</SelectItem>
                        <SelectItem value='TH'>泰国</SelectItem>
                        <SelectItem value='VN'>越南</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='source'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('business.customerConsult.source')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'business.customerConsult.pleaseEnterSource'
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
              name='consultContent'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('business.customerConsult.consultContent')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        'business.customerConsult.pleaseEnterConsultContent'
                      )}
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='remark'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.remark')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('common.pleaseEnterRemark')}
                      className='min-h-[80px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending
                  ? t('common.submitting')
                  : t('common.submit')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
