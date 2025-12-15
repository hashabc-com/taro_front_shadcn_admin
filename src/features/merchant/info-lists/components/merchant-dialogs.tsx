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

const unbindKeySchema = z.object({
  googleCode: z.string().min(1, '请输入谷歌验证码'),
})

const addIpSchema = z.object({
  ip: z.string().min(1, '请输入IP地址'),
  googleCode: z.string().min(1, '请输入谷歌验证码'),
})

type UnbindKeyFormValues = z.infer<typeof unbindKeySchema>
type AddIpFormValues = z.infer<typeof addIpSchema>

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

  const form = useForm<UnbindKeyFormValues>({
    resolver: zodResolver(unbindKeySchema),
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
      toast.success('解绑成功')
      onOpenChange(false)
      form.reset()
      onSuccess()
    } else {
      toast.error(res.message || '解绑失败')
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
          <DialogTitle>解绑秘钥</DialogTitle>
          <DialogDescription>
            为商户{' '}
            <span className='font-semibold'>{merchant?.companyName}</span>{' '}
            解绑秘钥
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='googleCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>谷歌验证码</FormLabel>
                  <FormControl>
                    <Input placeholder='请输入谷歌验证码' {...field} />
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
                确认解绑
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

  const form = useForm<AddIpFormValues>({
    resolver: zodResolver(addIpSchema),
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
          <DialogTitle>添加IP</DialogTitle>
          <DialogDescription>
            为商户{' '}
            <span className='font-semibold'>{merchant?.companyName}</span>{' '}
            添加后台IP白名单
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='ip'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP地址</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="多个IP用逗号(',')进行分隔"
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
                  <FormLabel>谷歌验证码</FormLabel>
                  <FormControl>
                    <Input placeholder='请输入谷歌验证码' {...field} />
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
                确认添加
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
