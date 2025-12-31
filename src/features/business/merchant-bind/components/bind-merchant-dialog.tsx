import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getMerchantsByBusinessId, updateBusinessBind } from '@/api/business'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { type IMerchantItem } from '../schema'
import { useMerchantBindProvider } from './merchant-bind-provider'

type BindMerchantDialogProps = {
  onSuccess: () => void
}

export function BindMerchantDialog({
  onSuccess,
}: BindMerchantDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [merchants, setMerchants] = useState<IMerchantItem[]>([])
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([])
  const { open,setOpen,currentRow: business } = useMerchantBindProvider()


  useEffect(() => {
    if (open == 'bind' && business) {
      loadMerchants()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, business])

  const loadMerchants = async () => {
    if (!business) return

    setIsLoading(true)
    try {
      const res = await getMerchantsByBusinessId({ supervisorsId: business.id })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (res as any)?.result || res
      const merchantList = Array.isArray(data) ? data : []

      setMerchants(merchantList)

      // 设置已绑定的商户为选中状态
      const selected = merchantList
        .filter((item) => item.status === 1)
        .map((item) => item.customerappId)
      setSelectedMerchants(selected)
    } catch (error) {
      console.error('获取商户列表失败:', error)
      toast.error('获取商户列表失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!business) return

    setIsSubmitting(true)
    const customerList = selectedMerchants.map((appId) => {
      const merchant = merchants.find((m) => m.customerappId === appId)
      return {
        customerappId: appId,
        country: merchant?.country || null,
      }
    })

    const res = await updateBusinessBind({
      supervisorsName: business.userName,
      supervisorsId: business.id,
      customerList,
    })
    if (res.code == 200) {
      toast.success('绑定成功')
      setOpen(null)
      onSuccess()
    } else {
      toast.error(res?.message || '绑定失败')
    }
    setIsSubmitting(false)
  }

  const handleToggle = (appId: string) => {
    setSelectedMerchants((prev) =>
      prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId]
    )
  }

  return (
    <Dialog open={!!open} onOpenChange={(isOpen) => !isOpen && setOpen(null)}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>绑定商户</DialogTitle>
          <DialogDescription>
            商务：<span className='font-semibold'>{business?.userName}</span>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : (
          <div className='flex max-h-[400px] flex-wrap gap-6 overflow-y-auto py-4'>
            {merchants.length === 0 ? (
              <div className='text-muted-foreground text-center'>
                暂无可绑定的商户
              </div>
            ) : (
              merchants.map((merchant) => (
                <div
                  key={merchant.customerappId}
                  className='flex items-center space-x-2'
                >
                  <Checkbox
                    id={merchant.customerappId}
                    checked={selectedMerchants.includes(merchant.customerappId)}
                    onCheckedChange={() => handleToggle(merchant.customerappId)}
                  />
                  <Label
                    htmlFor={merchant.customerappId}
                    className='flex-1 cursor-pointer text-sm font-normal'
                  >
                    {merchant.customerName}
                  </Label>
                </div>
              ))
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => setOpen(null)}
            disabled={isSubmitting || isLoading}
          >
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
            {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
