import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { type IMerchantInfoType } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'
import { useCountryStore } from '@/stores'
import { getTranslation, type Language } from '@/lib/i18n'

type ColumnsOptions = {
  onEdit: (merchant: IMerchantInfoType) => void
  onChangePassword: (merchant: IMerchantInfoType) => void
  onToggleStatus: (merchant: IMerchantInfoType) => void
  onUnbindKey: (merchant: IMerchantInfoType) => void
  onBindIp: (merchant: IMerchantInfoType) => void
  onBindTgGroup: (merchant: IMerchantInfoType) => void
  onRateConfig: (merchant: IMerchantInfoType) => void
  onAutoLogin: (merchant: IMerchantInfoType) => void
}

export const getColumns = (
  options: ColumnsOptions,
  language: Language = 'zh'
): ColumnDef<IMerchantInfoType>[] => {
  const t = (key: string) => getTranslation(language, key)
  
  return [
  {
    accessorKey: 'account',
    header: t('merchant.info.account'),
  },
  {
    accessorKey: 'companyName',
    header: t('merchant.info.merchantName'),
  },
  {
    accessorKey: 'country',
    header: t('merchant.info.country'),
    cell: () => {
      const { selectedCountry } = useCountryStore.getState()
      return selectedCountry?.country
    },
  },
  {
    accessorKey: 'appid',
    header: t('merchant.info.merchantId'),
    meta: { className: 'w-[200px]' },
  },
  {
    accessorKey: 'secretKey',
    header: t('merchant.info.systemPublicKey'),
    meta: { className: 'w-[400px]' },
    cell: ({ row }) => {
      const secretKey = row.original.secretKey
      const handleCopy = async () => {
        if (secretKey) {
          try {
            await navigator.clipboard.writeText(secretKey)
            toast.success(t('merchant.info.secretKeyCopied'))
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
                toast.success(t('merchant.info.secretKeyCopied'))
              } else {
                toast.error(t('merchant.info.copyFailed'))
              }
            } catch (error) {
              console.error('复制失败:', error)
              toast.error(t('merchant.info.copyFailed'))
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
            {t('common.copy')}
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: t('merchant.info.status'),
    // meta: { className: 'w-[0px]' },
    cell: ({ row }) => {
      return row.original.status === 0 ? t('common.enabled') : t('common.disabled')
    },
  },
  {
    accessorKey: 'createTime',
    header: t('merchant.info.createTime'),
    meta: { className: 'w-[250px]' },
    cell: ({ row }) => {
      const date = row.original.createTime
      return date ? format(new Date(date), 'yyyy-MM-dd HH:mm:ss') : '-'
    },
  },
  {
    id: 'actions',
    header: t('merchant.info.action'),
    cell: ({ row }) => {
      return <DataTableRowActions row={row} {...options} />
    },
  },
]
}


