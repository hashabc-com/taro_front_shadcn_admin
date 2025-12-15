import { type ColumnDef } from '@tanstack/react-table'
import { getTranslation, type Language } from '@/lib/i18n'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { IRiskControlType } from '../schema'

const businessTypeMap: Record<string, { zh: string; en: string }> = {
  PAY_PAYIN: { zh: '代收', en: 'Collection' },
  PAY_PAYOUT: { zh: '代付', en: 'Payout' },
}

const businessTypeColorMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PAY_PAYIN: 'default',
  PAY_PAYOUT: 'secondary',
}

const actionCodeMap: Record<string, { zh: string; en: string }> = {
  REJECT: { zh: '拒绝', en: 'Reject' },
  ALARM: { zh: '告警', en: 'Alarm' },
  BLOCK: { zh: '阻止', en: 'Block' },
}

const actionCodeColorMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  REJECT: 'destructive',
  ALARM: 'secondary',
  BLOCK: 'outline',
}

export const getColumns = (
  onViewDetail: (text: string) => void,
  language: Language = 'zh'
): ColumnDef<IRiskControlType>[] => {
  const t = (key: string) => getTranslation(language, key)
  return [
    {
      accessorKey: 'id',
      header: 'ID',
      enableHiding:false
    },
    {
      accessorKey: 'ruleName',
      header: t('logs.riskControl.ruleName'),
      enableHiding:false
    },
    {
      accessorKey: 'ruleId',
      header: t('logs.riskControl.ruleId'),
      enableHiding:false
    },
    {
      accessorKey: 'customerName',
      header: t('logs.riskControl.merchantName'),
    },
    {
      accessorKey: 'businessType',
      header: t('logs.riskControl.businessType'),
      cell: ({ row }) => {
        const type = row.getValue('businessType') as string
        const typeText = businessTypeMap[type]?.[language] || type
        return (
          <Badge variant={businessTypeColorMap[type] || 'default'}>
            {typeText}
          </Badge>
        )
      },
      size: 100,
    },
    {
      accessorKey: 'businessId',
      header: t('logs.riskControl.orderNo')
    },
    {
      accessorKey: 'actionCode',
      header: t('logs.riskControl.action'),
      cell: ({ row }) => {
        const action = row.getValue('actionCode') as string
        const actionText = actionCodeMap[action]?.[language] || action
        return (
          <Badge variant={actionCodeColorMap[action] || 'default'}>
            {actionText}
          </Badge>
        )
      },
      size: 100,
    },
    {
      accessorKey: 'reason',
      header: t('logs.riskControl.interceptReason')
    },
    {
      accessorKey: 'requestParams',
      header: t('logs.riskControl.requestParams'),
      cell: ({ row }) => {
        const text = row.getValue('requestParams') as string
        if (!text) return <div className='text-center'>-</div>
        return (
            <Button
              variant='link'
              size='sm'
              className='px-0'
              onClick={() => onViewDetail(text)}
            >
            {t('common.viewDetails')}
          </Button>
      )
    },
    size: 120,
  },
  {
    accessorKey: 'responseParams',
    header: t('logs.riskControl.responseParams'),
    cell: ({ row }) => {
      const text = row.getValue('responseParams') as string
      if (!text) return
      return (
          <Button
            variant='link'
            size='sm'
            className='px-0'
            onClick={() => onViewDetail(text)}
          >
            {t('common.viewDetails')}
          </Button>
      )
    }
  },
  {
    accessorKey: 'createTime',
    header: t('logs.riskControl.createTime'),
    cell: ({ row }) => {
      const time = row.getValue('createTime') as string
      return (
        <div>
          {time ? time.replace('T', ' ').substring(0, 19) : '-'}
        </div>
      )
    }
  },
  {
    accessorKey: 'localTime',
    header: t('logs.riskControl.triggerTime'),
    cell: ({ row }) => {
      const time = row.getValue('localTime') as string
      return (
        <div>
          {time ? time.replace('T', ' ').substring(0, 19) : '-'}
        </div>
      )
    }
  },
]
}