import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { statuses,type ISettlementListType } from '../schema'
import { getTranslation, type Language } from '@/lib/i18n'

export const getTasksColumns = (
  language: Language = 'zh'
): ColumnDef<ISettlementListType>[] => {
  const t = (key: string) => getTranslation(language, key)
  return [
  {
    accessorKey: 'companyName',
    header: t('fund.settlement.merchant'),
    enableHiding: false
  },
  {
    accessorKey: 'type',
    header: t('fund.settlement.type'),
    enableSorting: false,
    cell: ({ row }) => (
      <Badge variant='outline'>{row.getValue('type')}</Badge>
    ),
  },
  {
    accessorKey: 'createTime',
    header: t('fund.settlement.operationDate'),
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='font-medium'>{row.getValue('createTime')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'rechargeAmount',
    header: t('fund.settlement.amount')
  },
  {
    accessorKey: 'withdrawalType',
    header: t('fund.settlement.withdrawalCurrency')
  },
  {
    accessorKey: 'exchangeRate',
    header: t('fund.settlement.exchangeRate')
  },
  {
    accessorKey: 'finalAmount',
    header: t('fund.settlement.actualAmount')
  },
  {
    accessorKey: 'remark',
    header: t('fund.settlement.remark')
  },
{
    accessorKey: 'processStatus',
    header: t('fund.settlement.auditStatus'),
    cell: ({ row }) => {
            const statusesItem = statuses[row.getValue('processStatus') as keyof typeof statuses];
            if(!statusesItem) return null;
            return (
    
              <div className={`flex items-center text-${statusesItem.color}-600`}>
                  <statusesItem.icon className='mr-1.5 h-4 w-4' />
                  <span className='font-medium'>
                    {t(statusesItem.label)}
                  </span>
                </div>
            )
          },
  },
]
}
