import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { updatePass } from '@/api/merchant'
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
import { type IMerchantInfoType } from '../schema'
import { useLanguage } from '@/context/language-provider'

const createChangePasswordSchema = (t: (key: string) => string) => z
  .object({
    pwd: z.string().min(6, t('merchant.info.validation.passwordMinLength')),
    rePwd: z.string().min(6, t('merchant.info.validation.passwordMinLength')),
  })
  .refine((data) => data.pwd === data.rePwd, {
    message: t('merchant.info.validation.passwordMismatch'),
    path: ['rePwd'],
  })

type ChangePasswordFormValues = z.infer<ReturnType<typeof createChangePasswordSchema>>

type ChangePasswordDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  merchant: IMerchantInfoType | null
  onSuccess: () => void
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  merchant,
  onSuccess,
}: ChangePasswordDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useLanguage()

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(createChangePasswordSchema(t)),
    defaultValues: {
      pwd: '',
      rePwd: '',
    },
  })

  const onSubmit = async (values: ChangePasswordFormValues) => {
    if (!merchant) return
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('id', merchant.id.toString())
    formData.append('pwd', values.pwd) 
    formData.append('rePwd', values.rePwd)
    const res = await updatePass(formData)

    if (res.code == 200) {
      toast.success(t('merchant.info.success.passwordChanged'))
      onOpenChange(false)
      form.reset()
      onSuccess()
    } else {
      toast.error(res.message || t('merchant.info.error.passwordChangeFailed'))
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          form.reset()
        }
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{t('merchant.info.changePassword')}</DialogTitle>
          <DialogDescription>
            {t('merchant.info.changePasswordFor')}{' '}
            <span className='font-semibold'>{merchant?.companyName}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='pwd'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password.newPassword')}</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder={t('password.newPassword')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='rePwd'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password.confirmPassword')}</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder={t('password.confirmPassword')}
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
                {t('merchant.info.confirmChange')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
