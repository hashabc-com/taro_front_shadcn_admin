import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'

type GoogleAuthDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (gauthKey: string) => void | Promise<void>
  title?: string
  isLoading?: boolean
}

export function GoogleAuthDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  isLoading = false,
}: GoogleAuthDialogProps) {
  const { t } = useLanguage()
  const [code, setCode] = useState('')

  // 弹窗关闭时清空验证码
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!open) setCode('')
  }, [open])

  const handleConfirm = async () => {
    if (code.length !== 6) return
    await onConfirm(code)
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) setCode('')
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>
            {title ?? t('common.googleAuthCode')}
          </DialogTitle>
        </DialogHeader>
        <div className='flex flex-col items-center gap-4 py-4'>
          <p className='text-muted-foreground text-sm'>
            {t('common.enterGoogleAuthCode')}
          </p>
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            disabled={isLoading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type='button'
            onClick={handleConfirm}
            disabled={code.length !== 6 || isLoading}
          >
            {isLoading ? t('common.submitting') : t('common.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
