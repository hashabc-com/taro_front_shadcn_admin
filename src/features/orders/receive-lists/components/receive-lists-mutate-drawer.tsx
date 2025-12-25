import { CheckCircle, Clock, XCircle, Wallet } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { type Order } from '../schema'

type MutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Order
}

export function MutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: MutateDrawerProps) {
  const { t } = useLanguage()

  if (!currentRow) return null

  const renderStatus = (value: string) => {
    if (value == '0') {
      return (
        <div className='flex items-center text-green-600'>
          <CheckCircle className='mr-1.5 h-4 w-4' />
          <span className='font-medium'>
            {t('orders.receiveOrders.paymentSuccess')}
          </span>
        </div>
      )
    } else if (value == '1') {
      return (
        <div className='flex items-center text-blue-600'>
          <Clock className='mr-1.5 h-4 w-4' />
          <span className='font-medium'>
            {t('orders.receiveOrders.pendingPayment')}
          </span>
        </div>
      )
    } else if (value == '2') {
      return (
        <div className='flex items-center text-red-600'>
          <XCircle className='mr-1.5 h-4 w-4' />
          <span className='font-medium'>
            {t('orders.receiveOrders.paymentFailed')}
          </span>
        </div>
      )
    } else if (value == '4') {
      return (
        <div className='flex items-center text-yellow-600'>
          <Wallet className='mr-1.5 h-4 w-4' />
          <span className='font-medium'>
            {t('orders.receiveOrders.partialPayment')}
          </span>
        </div>
      )
    }

    return <span>{value}</span>
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col sm:max-w-[540px]'>
        <SheetHeader className='text-start'>
          <SheetTitle>{t('orders.receiveOrders.orderDetails')}</SheetTitle>
          <SheetDescription>
            {t('orders.receiveOrders.viewReceiveOrderDetails')}
          </SheetDescription>
        </SheetHeader>

        <div className='flex-1 space-y-6 overflow-y-auto px-4'>
          <div className='grid gap-6'>
            {/* 商户信息 */}
            <div className='flex flex-col gap-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.receiveOrders.merchant')}
              </label>
              <div className='flex flex-col gap-1'>
                <div className='text-base font-medium'>
                  {currentRow.companyName}
                </div>
              </div>
            </div>

            {/* 创建时间 */}
            <div className='flex flex-col gap-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.receiveOrders.createTime')}
              </label>
              <div className='text-base'>{currentRow.localTime}</div>
            </div>

            {/* 商户订单号 */}
            <div className='flex flex-col gap-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.receiveOrders.merchantOrderNo')}
              </label>
              <div className='font-mono text-base'>
                {currentRow.referenceno}
              </div>
            </div>

            {/* 产品 */}
            <div className='flex flex-col gap-2'>
              <div className='text-muted-foreground mb-0 text-sm font-medium'>
                {t('orders.receiveOrders.product')}
              </div>
              <Badge variant='outline' className='w-fit'>
                {currentRow.pickupCenter}
              </Badge>
            </div>
            {/* 三方订单号 */}
            <div className='flex flex-col gap-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.receiveOrders.thirdPartyOrderNo')}
              </label>
              <div className='font-mono text-base'>
                {currentRow.tripartiteOrder}
              </div>
            </div>
            {/* 平台订单号 */}
            <div className='flex flex-col gap-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.receiveOrders.platformOrderNo')}
              </label>
              <div className='font-mono text-base'>{currentRow.transId}</div>
            </div>
            {/* 金额 */}
            <div className='flex flex-col gap-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.receiveOrders.orderAmount')}
              </label>
              <div className='flex flex-col gap-1'>
                <div className='text-base font-semibold'>
                  {currentRow.amount}
                </div>
              </div>
            </div>
            {/* 实际金额 */}
            <div className='flex flex-col gap-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.receiveOrders.realAmount')}
              </label>
              <div className='flex flex-col gap-1'>
                <div className='text-base font-semibold'>
                  {currentRow.realAmount}
                </div>
              </div>
            </div>

            {/* 手续费 */}
            <div className='flex flex-col gap-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.receiveOrders.serviceFee')}
              </label>
              <div className='flex flex-col gap-1'>
                <div className='text-base font-semibold'>
                  {currentRow.serviceAmount}
                </div>
              </div>
            </div>

            {/* 收款时间 */}
            <div className='flex flex-col gap-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.receiveOrders.collectionTime')}
              </label>
              <div className='text-base'>{currentRow.paymentDate}</div>
            </div>

            {/* 交易状态 */}
            <div className='flex flex-col gap-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.receiveOrders.status')}
              </label>
              <div className='flex items-center gap-2'>
                {renderStatus(currentRow.status)}
              </div>
            </div>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant='outline' className='w-full'>
              {t('common.close')}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
