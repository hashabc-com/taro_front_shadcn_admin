import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DataTableRowActions } from './data-table-row-actions'
import { type RuleConfig, sceneCodeMap, actionCodeMap } from '../schema'

export function getColumns(
  onEdit: (rule: RuleConfig) => void,
  onDelete: (rule: RuleConfig) => void
): ColumnDef<RuleConfig>[] {
  return [
    {
      accessorKey: 'id',
      header: 'ID',
      enableHiding: false,
      cell: ({ row }) => <div className='w-[50px]'>{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'ruleName',
      header: '规则名称',
      enableHiding: false,
      cell: ({ row }) => (
        <div className='max-w-[150px] truncate'>{row.getValue('ruleName')}</div>
      ),
    },
    {
      accessorKey: 'ruleDesc',
      header: '规则描述',
      enableHiding: false,
      cell: ({ row }) => (
        <div className='max-w-[150px] truncate'>
          {row.getValue('ruleDesc') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'sceneCode',
      header: '规则场景',
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
      header: '条件表达式',
      cell: ({ row }) => (
        <div className='max-w-[200px] truncate'>
          {row.getValue('conditionExpr')}
        </div>
      ),
    },
    {
      accessorKey: 'actionCode',
      header: '动作标识',
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
      header: '优先级',
      meta:{
        className: 'text-center',
      }
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => {
        const status = row.getValue('status') as number
        return (
          <div className='w-[80px]'>
            {status === 1 ? (
              <Badge variant='default' className='bg-green-600'>
                启用
              </Badge>
            ) : (
              <Badge variant='destructive'>禁用</Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'createTime',
      header: '创建时间',
      cell: ({ row }) => (
        <div className='max-w-[150px] truncate'>
          {row.getValue('createTime') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'updateTime',
      header: '更新时间',
      cell: ({ row }) => (
        <div className='max-w-[150px] truncate'>
          {row.getValue('updateTime') || '-'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ]
}
