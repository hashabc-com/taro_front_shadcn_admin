import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useLanguage } from '@/context/language-provider'
import { updateCustomerFollowUp } from '@/api/business'
import {
  type ICustomerConsult,
  type FollowUpFormData,
  followUpFormSchema,
} from '../schema'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
// import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

interface FollowUpDialogProps {
  customer: ICustomerConsult | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FollowUpDialog({
  customer,
  open,
  onOpenChange,
}: FollowUpDialogProps) {
  const { t } = useLanguage()
  const queryClient = useQueryClient()

  const form = useForm<FollowUpFormData>({
    resolver: zodResolver(followUpFormSchema),
    defaultValues: {
      followType: '',
      followContent: '',
      followResult: '',
      // nextFollowTime: null,
      // attachmentUrls: '',
      // followBy: '',
    },
  })

  useEffect(() => {
    if (customer) {
      form.reset({
        followType: customer.followType || '',
        followContent: customer.followContent || '',
        followResult: customer.followResult || '',
        // nextFollowTime: customer.nextFollowTime || null,
        // attachmentUrls: customer.attachmentUrls || '',
        // followBy: customer.followBy || '',
      })
    }
  }, [customer, form])

  const mutation = useMutation({
    mutationFn: (data: FollowUpFormData) =>
      updateCustomerFollowUp({
        id: customer!.id,
        ...data,
      }),
    onSuccess: (res) => {
      if (res.code == 200) {
        toast.success(t('common.updateSuccess'))
        queryClient.invalidateQueries({ queryKey: ['customer-consult-list'] })
        onOpenChange(false)
        form.reset()
      }
    },
    onError: () => {
      toast.error(t('common.updateFailed'))
    },
  })

  const onSubmit = (data: FollowUpFormData) => {
    mutation.mutate(data)
  }

  if (!customer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t('business.customerConsult.followUp')}</DialogTitle>
          <DialogDescription>
            {t('business.customerConsult.followUpDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          {/* Customer Info Display */}
          <div className='grid grid-cols-2 gap-4 rounded-lg bg-muted p-4'>
            <div>
              <p className='text-sm text-muted-foreground'>
                {t('business.customerConsult.contactPerson')}
              </p>
              <p className='font-medium'>{customer.contactPerson || '-'}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>
                {t('business.customerConsult.phone')}
              </p>
              <p className='font-medium'>
                {customer.phone ? `+${customer.countryCode} ${customer.phone}` : '-'}
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>
                {t('business.customerConsult.company')}
              </p>
              <p className='font-medium'>{customer.company || '-'}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>
                {t('business.customerConsult.consultContent')}
              </p>
              <p className='font-medium line-clamp-2' title={customer.consultContent || ''}>
                {customer.consultContent || '-'}
              </p>
            </div>
          </div>

          {/* Follow Up Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='followType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('business.customerConsult.followType')} *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger clearable={false}>
                            <SelectValue
                              placeholder={t('business.customerConsult.pleaseSelectFollowType')}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='PHONE'>
                            {t('business.customerConsult.followTypeValues.PHONE')}
                          </SelectItem>
                          <SelectItem value='VISIT'>
                            {t('business.customerConsult.followTypeValues.VISIT')}
                          </SelectItem>
                          <SelectItem value='EMAIL'>
                            {t('business.customerConsult.followTypeValues.EMAIL')}
                          </SelectItem>
                          <SelectItem value='WECHAT'>
                            {t('business.customerConsult.followTypeValues.WECHAT')}
                          </SelectItem>
                          <SelectItem value='OTHER'>
                            {t('business.customerConsult.followTypeValues.OTHER')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='followResult'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('business.customerConsult.followResult')} *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger clearable={false}>
                            <SelectValue
                              placeholder={t('business.customerConsult.pleaseSelectFollowResult')}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='INTERESTED'>
                            {t('business.customerConsult.followResultValues.INTERESTED')}
                          </SelectItem>
                          <SelectItem value='CONSIDERING'>
                            {t('business.customerConsult.followResultValues.CONSIDERING')}
                          </SelectItem>
                          <SelectItem value='REFUSED'>
                            {t('business.customerConsult.followResultValues.REFUSED')}
                          </SelectItem>
                          <SelectItem value='SUCCESS'>
                            {t('business.customerConsult.followResultValues.SUCCESS')}
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
                name='followContent'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('business.customerConsult.followContent')} *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('business.customerConsult.pleaseEnterFollowContent')}
                        className='min-h-[100px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='followBy'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('business.customerConsult.followBy')} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('business.customerConsult.pleaseEnterFollowBy')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='nextFollowTime'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('business.customerConsult.nextFollowTime')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='datetime-local'
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}

              {/* <FormField
                control={form.control}
                name='attachmentUrls'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('business.customerConsult.attachmentUrls')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('business.customerConsult.attachmentUrlsPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => onOpenChange(false)}
                >
                  {t('common.cancel')}
                </Button>
                <Button type='submit' disabled={mutation.isPending}>
                  {mutation.isPending ? t('common.submitting') : t('common.submit')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
