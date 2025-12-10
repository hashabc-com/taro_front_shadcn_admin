import { type ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import type { IMessageRecordType } from '../schema'

export const getColumns = (
  onViewDetail: (record: IMessageRecordType) => void
): ColumnDef<IMessageRecordType>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    enableHiding: false
  },
  {
    accessorKey: 'messageId',
    header: '消息ID',
    enableHiding: false
  },
  {
    accessorKey: 'messageType',
    header: '消息类型',
    enableHiding: false
  },
  {
    accessorKey: 'correlationId',
    header: '业务关联ID'
  },
  {
    accessorKey: 'queueName',
    header: '队列名称'
  },
  {
    accessorKey: 'exchangeName',
    header: '交换机名称'
  },
  {
    accessorKey: 'routingKey',
    header: '路由键'
  },
  {
    accessorKey: 'consumerService',
    header: '消费服务'
  },
//   {
//     accessorKey: 'consumerIp',
//     header: '消费服务器IP'
//   },
//   {
//     accessorKey: 'consumeTime',
//     header: '消费时间'
//   },
//   {
//     accessorKey: 'createTime',
//     header: '创建时间'
//   },
//   {
//     accessorKey: 'updateTime',
//     header: '更新时间'
//   },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => (
      <div className='flex justify-center items-center gap-1 cursor-pointer'  onClick={() => onViewDetail(row.original)}>
        <Eye className='h-4 w-4' />
          详情
      </div>
    ),
    size: 80,
  },
]
