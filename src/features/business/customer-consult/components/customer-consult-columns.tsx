import { type ColumnDef } from '@tanstack/react-table'
import { type ICustomerConsult } from '../schema'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

export const getCustomerConsultColumns = (
  t: (key: string) => string,
  onFollowUp: (customer: ICustomerConsult) => void
): ColumnDef<ICustomerConsult>[] => [
  {
    accessorKey: 'contactPerson',
    header: t('business.customerConsult.contactPerson'),
    meta: { className: 'min-w-[100px]' },
  },
  {
    accessorKey: 'phone',
    header: t('business.customerConsult.phone'),
    cell: ({ row }) => {
      const countryCode = row.original.countryCode
      const phone = row.original.phone
      if (!phone) return '-'
      return `+${countryCode} ${phone}`
    },
    meta: { className: 'min-w-[140px]' },
  },
  {
    accessorKey: 'email',
    header: t('business.customerConsult.email'),
    cell: ({ row }) => row.original.email || '-',
    meta: { className: 'min-w-[200px]' },
  },
  {
    accessorKey: 'company',
    header: t('business.customerConsult.company'),
    cell: ({ row }) => row.original.company || '-',
    meta: { className: 'min-w-[150px]' },
  },
  {
    accessorKey: 'source',
    header: t('business.customerConsult.source'),
    cell: ({ row }) => row.original.source || '-',
    meta: { className: 'min-w-[100px]' },
  },
  {
    accessorKey: 'status',
    header: t('business.customerConsult.status'),
    cell: ({ row }) => {
      const status = row.original.status
      const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        NEW: 'default',
        FOLLOWING: 'secondary',
        DEAL: 'outline',
        LOST: 'destructive',
      }
      return (
        <Badge variant={variants[status] || 'default'}>
          {t(`business.customerConsult.statusValues.${status}`)}
        </Badge>
      )
    },
    meta: { className: 'min-w-[100px]' },
  },
  {
    accessorKey: 'level',
    header: t('business.customerConsult.level'),
    cell: ({ row }) => {
      const level = row.original.level
      if (!level) return '-'
      return (
        <Badge variant='outline'>
          {t(`business.customerConsult.levelValues.${level}`)}
        </Badge>
      )
    },
    meta: { className: 'min-w-[100px]' },
  },
  {
    accessorKey: 'consultContent',
    header: t('business.customerConsult.consultContent'),
    cell: ({ row }) => {
      const content = row.original.consultContent
      if (!content) return '-'
      return (
        <div className='max-w-[200px] truncate' title={content}>
          {content}
        </div>
      )
    },
    meta: { className: 'min-w-[200px]' },
  },
  {
    accessorKey: 'followResult',
    header: t('business.customerConsult.followResult'),
    cell: ({ row }) => {
      const result = row.original.followResult
      if (!result) return '-'
      return t(`business.customerConsult.followResultValues.${result}`)
    },
    meta: { className: 'min-w-[120px]' },
  },
  {
    accessorKey: 'nextFollowTime',
    header: t('business.customerConsult.nextFollowTime'),
    cell: ({ row }) => {
      const time = row.original.nextFollowTime
      if (!time) return '-'
      try {
        return format(new Date(time), 'yyyy-MM-dd HH:mm')
      } catch {
        return time
      }
    },
    meta: { className: 'min-w-[150px]' },
  },
  {
    accessorKey: 'followBy',
    header: t('business.customerConsult.followBy'),
    cell: ({ row }) => row.original.followBy || '-',
    meta: { className: 'min-w-[100px]' },
  },
  {
    accessorKey: 'createdAt',
    header: t('business.customerConsult.createdAt'),
    cell: ({ row }) => {
      const time = row.original.createdAt
      if (!time) return '-'
      try {
        return format(new Date(time), 'yyyy-MM-dd HH:mm')
      } catch {
        return time
      }
    },
    meta: { className: 'min-w-[150px]' },
  },
  {
    id: 'actions',
    header: t('common.action'),
    cell: ({ row }) => (
      <Button
        variant='ghost'
        size='sm'
        onClick={() => onFollowUp(row.original)}
      >
        {t('business.customerConsult.followUp')}
      </Button>
    ),
    meta: { className: 'min-w-[100px]' },
  },
]
