import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { unbindGoogle, addIP } from '@/api/merchant'
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
import { Textarea } from '@/components/ui/textarea'
import { type IMerchantInfoType } from '../schema'
import { useLanguage } from '@/context/language-provider'

const createUnbindKeySchema = (t: (key: string) => string) => z.object({
  googleCode: z.string().min(1, t('merchant.info.validation.googleCodeRequired')),
})

const createAddIpSchema = (t: (key: string) => string) => z.object({
  ip: z.string().min(1, t('merchant.info.validation.ipRequired')),
  googleCode: z.string().min(1, t('merchant.info.validation.googleCodeRequired')),
})

type UnbindKeyFormValues = z.infer<ReturnType<typeof createUnbindKeySchema>>
type AddIpFormValues = z.infer<ReturnType<typeof createAddIpSchema>>

type UnbindKeyDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  merchant: IMerchantInfoType | null
  onSuccess: () => void
}

export function UnbindKeyDialog({
  open,
  onOpenChange,
  merchant,
  onSuccess,
}: UnbindKeyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useLanguage()

  const form = useForm<UnbindKeyFormValues>({
    resolver: zodResolver(createUnbindKeySchema(t)),
    defaultValues: {
      googleCode: '',
    },
  })

  const onSubmit = async (values: UnbindKeyFormValues) => {
    if (!merchant) return
    console.log('merchant', merchant)
    console.log('merchant', merchant.appid)
    // return;
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('merchantId', merchant.appid)
    formData.append('googleCode', values.googleCode)
    formData.append('secretKey', '')
    const res = await unbindGoogle(formData)

    if (res.code == 200) {
      toast.success(t('merchant.info.success.unbindSuccess'))
      onOpenChange(false)
      form.reset()
      onSuccess()
    } else {
      toast.error(res.message || t('merchant.info.error.unbindFailed'))
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
          <DialogTitle>{t('merchant.info.unbindSecretKey')}</DialogTitle>
          <DialogDescription>
            {t('merchant.info.unbindSecretKeyFor')}{' '}
            <span className='font-semibold'>{merchant?.companyName}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='googleCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password.googleAuthCode')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('password.enterGoogleAuthCode')} {...field} />
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
                {t('merchant.info.confirmUnbind')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

type AddIpDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  merchant: IMerchantInfoType | null
  onSuccess: () => void
}

export function AddIpDialog({
  open,
  onOpenChange,
  merchant,
  onSuccess,
}: AddIpDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useLanguage()
  const form = useForm<AddIpFormValues>({
    resolver: zodResolver(createAddIpSchema(t)),
    defaultValues: {
      ip: '',
      googleCode: '',
    },
  })

  const onSubmit = async (values: AddIpFormValues) => {
    if (!merchant) return

    setIsSubmitting(true)

    const res = await addIP({
      merchantId: merchant.companyName,
      ip: values.ip,
      googleCode: values.googleCode,
    })

    if (res.code == 200) {
      toast.success(t('common.addSuccess'))
      onOpenChange(false)
      form.reset()
      onSuccess()
    } else {
      toast.error(res.message || t('common.addFailed'))
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
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{t('merchant.info.addIP')}</DialogTitle>
          <DialogDescription>
            {t('merchant.info.addIPFor')}{' '}
            <span className='font-semibold'>{merchant?.companyName}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='ip'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('merchant.info.ipAddress')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('merchant.info.placeholder.ipAddress')}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='googleCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password.googleAuthCode')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('password.enterGoogleAuthCode')} {...field} />
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
                {t('merchant.info.confirmAdd')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
