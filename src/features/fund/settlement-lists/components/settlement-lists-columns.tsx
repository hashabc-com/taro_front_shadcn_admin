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
    header: '商户',
    enableHiding: false
  },
  {
    accessorKey: 'type',
    header: '类型',
    enableSorting: false,
    cell: ({ row }) => (
      <Badge variant='outline'>{row.getValue('type')}</Badge>
    ),
  },
  {
    accessorKey: 'createTime',
    header: '操作日期',
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='font-medium'>{row.getValue('createTime')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'rechargeAmount',
    header: '金额'
  },
  {
    accessorKey: 'withdrawalType',
    header: '提现币种'
  },
  {
    accessorKey: 'exchangeRate',
    header: '汇率'
  },
  {
    accessorKey: 'finalAmount',
    header: '实际金额'
  },
  {
    accessorKey: 'remark',
    header: '备注'
  },
{
    accessorKey: 'processStatus',
    header: '审核状态',
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
