import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { updateExchangeRate } from '@/api/fund'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const formSchema = z.object({
  rate: z
    .string()
    .min(1, '请输入汇率')
    .regex(/^\d+(\.\d+)?$/, '请输入有效的数字'),
  gauthCode: z.string().min(1, '请输入谷歌验证码'),
})

type FormData = z.infer<typeof formSchema>

interface UpdateRateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function UpdateRateDialog({
  open,
  onOpenChange,
  onSuccess,
}: UpdateRateDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    const res = await updateExchangeRate({
      name: data.rate,
      gauthCode: data.gauthCode,
    })
    if (res.code == 200) {
      toast.success('更新汇率成功')
      onOpenChange(false)
      reset()
      onSuccess?.()
    } else {
      toast.error(res.message || '更新汇率失败')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>更新汇率</DialogTitle>
          <DialogDescription>请输入新的汇率和谷歌验证码</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='rate'>
                汇率 <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='rate'
                {...register('rate')}
                placeholder='请输入汇率'
                onKeyDown={(e) => {
                  if (
                    !/[\d.]/.test(e.key) &&
                    ![
                      'Backspace',
                      'Delete',
                      'ArrowLeft',
                      'ArrowRight',
                      'Tab',
                    ].includes(e.key)
                  ) {
                    e.preventDefault()
                  }
                }}
              />
              {errors.rate && (
                <p className='text-sm text-red-500'>{errors.rate.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='gauthCode'>
                谷歌验证码 <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='gauthCode'
                {...register('gauthCode')}
                placeholder='请输入谷歌验证码'
                maxLength={6}
              />
              {errors.gauthCode && (
                <p className='text-sm text-red-500'>
                  {errors.gauthCode.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? '提交中...' : '确认'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
