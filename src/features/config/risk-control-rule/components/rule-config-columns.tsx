import { type ColumnDef } from '@tanstack/react-table'
import { getTranslation, type Language } from '@/lib/i18n'
import { Badge } from '@/components/ui/badge'
import { type RuleConfig, sceneCodeMap, actionCodeMap } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'

export function getColumns(
  onEdit: (rule: RuleConfig) => void,
  onDelete: (rule: RuleConfig) => void,
  language: Language = 'zh'
): ColumnDef<RuleConfig>[] {
  const t = (key: string) => getTranslation(language, key)
  return [
    {
      accessorKey: 'id',
      header: 'ID',
      enableHiding: false,
      cell: ({ row }) => <div className='w-[50px]'>{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'ruleName',
      header: t('config.riskControlRule.ruleName'),
      enableHiding: false,
      cell: ({ row }) => (
        <div className='max-w-[150px] truncate'>{row.getValue('ruleName')}</div>
      ),
    },
    {
      accessorKey: 'ruleDesc',
      header: t('config.riskControlRule.ruleDescription'),
      enableHiding: false,
      cell: ({ row }) => (
        <div className='max-w-[150px] truncate'>
          {row.getValue('ruleDesc') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'sceneCode',
      header: t('config.riskControlRule.ruleScene'),
      cell: ({ row }) => {
        const sceneCode = row.getValue('sceneCode') as string
        return (
          <div className='w-[120px]'>
            {sceneCodeMap[sceneCode] || sceneCode}
          </div>
        )
      },
    },
    {
      accessorKey: 'conditionExpr',
      header: t('config.riskControlRule.conditionExpression'),
      cell: ({ row }) => (
        <div className='max-w-[200px] truncate'>
          {row.getValue('conditionExpr')}
        </div>
      ),
    },
    {
      accessorKey: 'actionCode',
      header: t('config.riskControlRule.actionCode'),
      cell: ({ row }) => {
        const actionCode = row.getValue('actionCode') as string
        return (
          <div className='w-[100px]'>
            {actionCodeMap[actionCode] || actionCode}
          </div>
        )
      },
    },
    {
      accessorKey: 'priority',
      header: t('config.riskControlRule.priority'),
      meta: {
        className: 'text-center',
      },
    },
    {
      accessorKey: 'status',
      header: t('common.status'),
      cell: ({ row }) => {
        const status = row.getValue('status') as number
        return (
          <div className='w-[80px]'>
            {status === 1 ? (
              <Badge variant='default' className='bg-green-600'>
                {t('common.enabled')}
              </Badge>
            ) : (
              <Badge variant='destructive'>{t('common.disabled')}</Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'createTime',
      header: t('common.createTime'),
      cell: ({ row }) => (
        <div className='max-w-[150px] truncate'>
          {row.getValue('createTime') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'updateTime',
      header: t('common.updateTime'),
      cell: ({ row }) => (
        <div className='max-w-[150px] truncate'>
          {row.getValue('updateTime') || '-'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: t('common.action'),
      cell: ({ row }) => (
        <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ]
}
