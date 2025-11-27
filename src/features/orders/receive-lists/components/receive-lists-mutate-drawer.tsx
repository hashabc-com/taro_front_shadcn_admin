import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { type Order } from '../schema'
import { CheckCircle, Clock, XCircle } from 'lucide-react'

type MutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Order
}

export const statuses = [
  {
    label: '成功',
    value: '0' as const,
    icon: CheckCircle,
  },
  {
    label: '待处理',
    value: '1' as const,
    icon: Clock,
  },
  {
    label: '失败',
    value: '2' as const,
    icon: XCircle,
  },
]

export function MutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: MutateDrawerProps) {
  if (!currentRow) return null

  const status = statuses.find((s) => s.value === currentRow.status)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col sm:max-w-[540px]'>
        <SheetHeader className='text-start'>
          <SheetTitle>订单详情</SheetTitle>
          <SheetDescription>
            查看收款订单的详细信息
          </SheetDescription>
        </SheetHeader>

        <div className='flex-1 space-y-6 overflow-y-auto px-4'>
          <div className='grid gap-6'>
            {/* 商户信息 */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>商户</label>
              <div className='flex flex-col gap-1'>
                <div className='text-base font-medium'>{currentRow.companyName}</div>
              </div>
            </div>

            {/* 创建时间 */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>创建时间</label>
              <div className='text-base'>{currentRow.createTime}</div>
            </div>

            {/* 商户订单号 */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>商户订单号</label>
              <div className='font-mono text-base'>{currentRow.referenceno}</div>
            </div>

            {/* 产品 */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium block'>产品</label>
              <Badge variant='outline' className='w-fit'>{currentRow.pickupCenter}</Badge>
            </div>

            {/* 平台订单号 */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>平台订单号</label>
              <div className='font-mono text-base'>{currentRow.transId}</div>
            </div>

            {/* 三方订单号 */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>三方订单号</label>
              <div className='font-mono text-base'>{currentRow.tripartiteOrder}</div>
            </div>

            {/* 金额 */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>金额</label>
              <div className='flex flex-col gap-1'>
                <div className='text-base font-semibold'>{currentRow.amount}</div>
                {/* <div className='text-muted-foreground text-sm'>${currentRow.amountUSD.toFixed(2)} USD</div> */}
              </div>
            </div>

            {/* 手续费 */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>手续费</label>
              <div className='flex flex-col gap-1'>
                <div className='text-base font-semibold'>{currentRow.serviceAmount}</div>
                {/* <div className='text-muted-foreground text-sm'>${currentRow.serviceAmountUSD.toFixed(2)} USD</div> */}
              </div>
            </div>

            {/* 收款时间 */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>收款时间</label>
              <div className='text-base'>
                {currentRow.paymentDate || <span className='text-muted-foreground'>暂无</span>}
              </div>
            </div>

            {/* 交易状态 */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>交易状态</label>
              <div className='flex items-center gap-2'>
                {status?.icon && (
                  <status.icon className='text-muted-foreground size-4' />
                )}
                <span className='text-base font-medium'>{status?.label || currentRow.status}</span>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant='outline' className='w-full'>关闭</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
