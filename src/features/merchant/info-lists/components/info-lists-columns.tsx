import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { type IMerchantInfoType } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'
import { useCountryStore } from '@/stores'

type ColumnsOptions = {
  onEdit: (merchant: IMerchantInfoType) => void
  onChangePassword: (merchant: IMerchantInfoType) => void
  onToggleStatus: (merchant: IMerchantInfoType) => void
  onUnbindKey: (merchant: IMerchantInfoType) => void
  onBindIp: (merchant: IMerchantInfoType) => void
  onRateConfig: (merchant: IMerchantInfoType) => void
  onAutoLogin: (merchant: IMerchantInfoType) => void
}

export const getColumns = (
  options: ColumnsOptions
): ColumnDef<IMerchantInfoType>[] => [
  {
    accessorKey: 'account',
    header: '账号',
  },
  {
    accessorKey: 'companyName',
    header: '商户名称',
  },
  {
    accessorKey: 'country',
    header: '国家',
    cell: () => {
      const { selectedCountry } = useCountryStore.getState()
      return selectedCountry?.country
    },
  },
  {
    accessorKey: 'appid',
    header: '商户ID',
    meta: { className: 'w-[200px]' },
  },
  {
    accessorKey: 'secretKey',
    header: '系统公钥',
    meta: { className: 'w-[400px]' },
    cell: ({ row }) => {
      const secretKey = row.original.secretKey
      const handleCopy = async () => {
        if (secretKey) {
          try {
            await navigator.clipboard.writeText(secretKey)
            toast.success('密钥已复制到剪贴板')
          } catch {
            // 降级到传统方法
            try {
              const textArea = document.createElement('textarea')
              textArea.value = secretKey
              textArea.style.position = 'fixed'
              textArea.style.left = '-999999px'
              textArea.style.top = '-999999px'
              document.body.appendChild(textArea)
              textArea.focus()
              textArea.select()

              const successful = document.execCommand('copy')
              document.body.removeChild(textArea)

              if (successful) {
                toast.success('密钥已复制到剪贴板')
              } else {
                toast.error('复制失败，请手动复制')
              }
            } catch (error) {
              console.error('复制失败:', error)
              toast.error('复制失败，请手动复制')
            }
          }
        }
      }

      return (
        <div className='flex items-center gap-2'>
          <span
            className='max-w-[300px] cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap'
            title={secretKey}
            onClick={handleCopy}
          >
            {secretKey}
          </span>
          <Button
            variant='link'
            size='sm'
            className='h-auto min-w-0 p-0 px-1'
            onClick={handleCopy}
          >
            复制
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: '状态',
    // meta: { className: 'w-[0px]' },
    cell: ({ row }) => {
      return row.original.status === 0 ? '启用' : '禁用'
    },
  },
  {
    accessorKey: 'createTime',
    header: '创建时间',
    meta: { className: 'w-[250px]' },
    cell: ({ row }) => {
      const date = row.original.createTime
      return date ? format(new Date(date), 'yyyy-MM-dd HH:mm:ss') : '-'
    },
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => {
      return <DataTableRowActions row={row} {...options} />
    },
  },
]


