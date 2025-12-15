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

const changePasswordSchema = z
  .object({
    pwd: z.string().min(6, '密码至少6个字符'),
    rePwd: z.string().min(6, '密码至少6个字符'),
  })
  .refine((data) => data.pwd === data.rePwd, {
    message: '两次输入的密码不一致',
    path: ['rePwd'],
  })

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

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
    resolver: zodResolver(changePasswordSchema),
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
          <DialogTitle>修改密码</DialogTitle>
          <DialogDescription>
            为商户{' '}
            <span className='font-semibold'>{merchant?.companyName}</span>{' '}
            修改密码
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='pwd'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>新密码</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='请输入新密码'
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
                  <FormLabel>确认密码</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='请再次输入新密码'
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
                取消
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                确认修改
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
