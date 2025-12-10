import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { IRiskControlType } from '../schema'

const businessTypeMap: Record<string, string> = {
  PAY_PAYIN: '代收',
  PAY_PAYOUT: '代付',
}

const businessTypeColorMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PAY_PAYIN: 'default',
  PAY_PAYOUT: 'secondary',
}

const actionCodeMap: Record<string, string> = {
  REJECT: '拒绝',
  ALARM: '告警',
  BLOCK: '阻止',
}

const actionCodeColorMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  REJECT: 'destructive',
  ALARM: 'secondary',
  BLOCK: 'outline',
}

export const getColumns = (
  onViewDetail: (text: string) => void
): ColumnDef<IRiskControlType>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    enableHiding:false
  },
  {
    accessorKey: 'ruleName',
    header: '规则名称',
    enableHiding:false
  },
  {
    accessorKey: 'ruleId',
    header: '规则ID',
    enableHiding:false
  },
  {
    accessorKey: 'customerName',
    header: '商户名称',
  },
  {
    accessorKey: 'businessType',
    header: '业务类型',
    cell: ({ row }) => {
      const type = row.getValue('businessType') as string
      return (
        // <div className='flex'>
          <Badge variant={businessTypeColorMap[type] || 'default'}>
            {businessTypeMap[type] || type}
          </Badge>
        // </div>
      )
    },
    size: 100,
  },
  {
    accessorKey: 'businessId',
    header: '订单号'
  },
  {
    accessorKey: 'actionCode',
    header: '处理动作',
    cell: ({ row }) => {
      const action = row.getValue('actionCode') as string
      return (
        // <div className='flex justify-center'>
          <Badge variant={actionCodeColorMap[action] || 'default'}>
            {actionCodeMap[action] || action}
          </Badge>
        // </div>
      )
    },
    size: 100,
  },
  {
    accessorKey: 'reason',
    header: '拦截原因'
  },
  {
    accessorKey: 'requestParams',
    header: '请求参数',
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
            查看详情
          </Button>
      )
    },
    size: 120,
  },
  {
    accessorKey: 'responseParams',
    header: '响应参数',
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
            查看详情
          </Button>
      )
    }
  },
  {
    accessorKey: 'createTime',
    header: '创建时间',
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
    header: '触发时间',
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
