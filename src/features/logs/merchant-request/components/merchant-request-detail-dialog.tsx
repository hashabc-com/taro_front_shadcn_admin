import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useLanguage } from '@/context/language-provider'
import type { IMerchantRequest } from '../schema'

type MerchantRequestDetailDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: IMerchantRequest | null
}

// Move InfoRow outside of the component
const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className='grid grid-cols-[140px_1fr] gap-2 text-sm border-b pb-2'>
    <div className='font-medium'>{label}:</div>
    <div className='break-all'>{value}</div>
  </div>
)

export function MerchantRequestDetailDialog({
  open,
  onOpenChange,
  record,
}: MerchantRequestDetailDialogProps) {
  const { t } = useLanguage()

  if (!record) return null

  const formatJson = (jsonStr: string | undefined) => {
    if (!jsonStr) return '-'
    try {
      return JSON.stringify(JSON.parse(jsonStr), null, 2)
    } catch {
      return jsonStr
    }
  }

  const getTransactionTypeLabel = (type: string | undefined) => {
    if (!type) return '-'
    switch (type) {
      case 'P':
        return t('logs.merchantRequest.payment')
      case 'L':
        return t('logs.merchantRequest.lending')
      default:
        return type
    }
  }

  const getStatusLabel = (status: number | undefined) => {
    if (status === undefined) return '-'
    switch (status) {
      case 0:
        return t('logs.merchantRequest.statusSuccess')
      case 1:
        return t('logs.merchantRequest.statusProcessing')
      case 2:
        return t('logs.merchantRequest.statusFailed')
      case 3:
        return t('logs.merchantRequest.statusExpired')
      default:
        return String(status)
    }
  }

  const getCallbackStatusLabel = (status: string | undefined) => {
    if (!status) return '-'
    switch (status) {
      case '1':
        return t('logs.merchantRequest.callbackSuccess')
      case '0':
        return t('logs.merchantRequest.callbackFailed')
      default:
        return t('logs.merchantRequest.callbackPending')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[900px] max-h-[85vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t('logs.merchantRequest.logDetail')}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='font-semibold text-base border-b-2 pb-2'>{t('logs.merchantRequest.basicInfo')}</div>
          <InfoRow label={t('logs.merchantRequest.transactionType')} value={getTransactionTypeLabel(record.transactionType)} />
          <InfoRow label={t('logs.merchantRequest.appid')} value={record.appid || '-'} />
          <InfoRow label={t('logs.merchantRequest.referenceno')} value={record.transactionType === 'P' ? record.referenceno : record.transactionReferenceNo || '-'} />
          <InfoRow label={t('logs.merchantRequest.transId')} value={record.transactionType === 'P' ? record.transId : record.transactionid || '-'} />
          <InfoRow label={t('logs.merchantRequest.parameTwo')} value={record.parameTwo || '-'} />
          <InfoRow label={t('logs.merchantRequest.country')} value={record.country || '-'} />
          <InfoRow label={t('logs.merchantRequest.status')} value={getStatusLabel(record.status)} />
          <InfoRow label={t('logs.merchantRequest.callBackStatus')} value={getCallbackStatusLabel(record.callBackStatus)} />

          <div className='font-semibold text-base border-b-2 pb-2 pt-4'>{t('logs.merchantRequest.userInfo')}</div>
          <InfoRow label={t('logs.merchantRequest.userName')} value={record.userName || '-'} />
          <InfoRow label={t('logs.merchantRequest.mobile')} value={record.mobile || '-'} />
          <InfoRow label={t('logs.merchantRequest.address')} value={record.address || '-'} />

          <div className='font-semibold text-base border-b-2 pb-2 pt-4'>{t('logs.merchantRequest.amountInfo')}</div>
          <InfoRow 
            label={t('logs.merchantRequest.amount')} 
            value={record.amount} 
          />
          <InfoRow 
            label={t('logs.merchantRequest.serviceAmount')} 
            value={record.serviceAmount} 
          />

          <div className='font-semibold text-base border-b-2 pb-2 pt-4'>{t('logs.merchantRequest.paymentInfo')}</div>
          <InfoRow label={t('logs.merchantRequest.paymentCompany')} value={record.paymentCompany || '-'} />
          <InfoRow label={t('logs.merchantRequest.pickupCenter')} value={record.pickupCenter || '-'} />
          <InfoRow label={t('logs.merchantRequest.url')} value={record.url || '-'} />
          <InfoRow label={t('logs.merchantRequest.notificationUrl')} value={record.notificationUrl || '-'} />

          <div className='font-semibold text-base border-b-2 pb-2 pt-4'>{t('logs.merchantRequest.timeInfo')}</div>
          <InfoRow label={t('logs.merchantRequest.createTime')} value={record.createTime || '-'} />
          <InfoRow label={t('logs.merchantRequest.updateTime')} value={record.updateTime || '-'} />
          <InfoRow label={t('logs.merchantRequest.localTime')} value={record.localTime || '-'} />

          <div className='font-semibold text-base border-b-2 pb-2 pt-4'>{t('logs.merchantRequest.requestResponseParams')}</div>
          <div className='space-y-2'>
            <div className='font-medium text-sm'>{t('logs.merchantRequest.requestParam')}:</div>
            <pre className='bg-muted p-3 rounded-md overflow-auto max-h-[250px] text-xs'>
              {formatJson(record.requestParam)}
            </pre>
          </div>

          <div className='space-y-2'>
            <div className='font-medium text-sm'>{t('logs.merchantRequest.responseParam')}:</div>
            <pre className='bg-muted p-3 rounded-md overflow-auto max-h-[250px] text-xs'>
              {formatJson(record.responseParam)}
            </pre>
          </div>

          {record.request && (
            <div className='space-y-2'>
              <div className='font-medium text-sm'>{t('logs.merchantRequest.request')}:</div>
              <pre className='bg-muted p-3 rounded-md overflow-auto max-h-[250px] text-xs'>
                {formatJson(record.request)}
              </pre>
            </div>
          )}

          {record.response && (
            <div className='space-y-2'>
              <div className='font-medium text-sm'>{t('logs.merchantRequest.response')}:</div>
              <pre className='bg-muted p-3 rounded-md overflow-auto max-h-[250px] text-xs'>
                {formatJson(record.response)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
