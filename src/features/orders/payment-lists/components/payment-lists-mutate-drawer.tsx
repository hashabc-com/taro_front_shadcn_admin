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
import { type IPaymentListsType,statuses } from '../schema'
import { useLanguage } from '@/context/language-provider'

type MutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: IPaymentListsType
}

export function MutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: MutateDrawerProps) {
  const { t } = useLanguage()
  if (!currentRow) return null

  const renderStatus = (value: string) => {
    const statusesItem = statuses[value as unknown as keyof typeof statuses];
    return (
      <div className={`flex items-center text-${statusesItem.color}-600`}>
        <statusesItem.icon className='mr-1.5 h-4 w-4' />
        <span className='font-medium'>{t(statusesItem.i18n)}</span>
      </div>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col sm:max-w-[540px]'>
        <SheetHeader className='text-start'>
          <SheetTitle>{t('orders.paymentOrders.orderDetails')}</SheetTitle>
          <SheetDescription>{t('orders.paymentOrders.viewPaymentOrderDetails')}</SheetDescription>
        </SheetHeader>

        <div className='flex-1 space-y-6 overflow-y-auto px-4'>
          <div className='grid gap-6'>
            {/* 商户信息 */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.paymentOrders.merchant')}
              </label>
              <div className='flex flex-col gap-1'>
                {currentRow.companyName}
              </div>
            </div>
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.paymentOrders.merchantOrderNo')}
              </label>
              <div className='flex flex-col gap-1'>
                {currentRow.transactionReferenceNo}
              </div>
            </div>
            {/* 平台订单号 */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.paymentOrders.platformOrderNo')}
              </label>
              <div className='flex flex-col gap-1'>
                {currentRow.transactionid}
              </div>
            </div>
            {/* 三方平台 */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.paymentOrders.paymentCompany')}
              </label>
              <div className='flex flex-col gap-1'>
                {currentRow.paymentCompany}
              </div>
            </div>
            {/* 产品 */}
            <div className='space-y-2'>
              <label className='text-muted-foreground block text-sm font-medium'>
                 {t('orders.paymentOrders.product')}
              </label>
              <Badge variant='outline' className='w-fit'>
                {currentRow.pickupCenter}
              </Badge>
            </div>
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.paymentOrders.receivingAccount')}
              </label>
              <div className='flex flex-col gap-1'>
                {currentRow.accountNumber}
              </div>
            </div>
            
            {/* 金额 */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.paymentOrders.amount')}
              </label>
              <div className='flex flex-col gap-1'>
                {currentRow.amount}
              </div>
            </div>

            {/* 手续费 */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.paymentOrders.serviceFee')}
              </label>
              <div className='flex flex-col gap-1'>
                {currentRow.serviceAmount}
              </div>
            </div>
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.paymentOrders.createTime')}
              </label>
              <div className='flex flex-col gap-1'>{currentRow.createTime}</div>
            </div>
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.paymentOrders.paymentTime')}
              </label>
              <div className='flex flex-col gap-1'>{currentRow.updateTime}</div>
            </div>
            <div className='space-y-2'>
              <label className='text-muted-foreground text-sm font-medium'>
                {t('orders.paymentOrders.transactionSummary')}
              </label>
              <div className='flex flex-col gap-1'>{currentRow.address}</div>
            </div>
            {/* 交易状态 */}
            <div className='flex flex-col gap-2'>
              <label className='text-muted-foreground text-sm font-medium'>{t('orders.receiveOrders.status')}</label>
              <div className='flex items-center gap-2'>
                {renderStatus(currentRow.status || '')}
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
