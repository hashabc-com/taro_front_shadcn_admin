import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type ICustomerConsult } from '../schema'

export const getCustomerConsultColumns = (
  t: (key: string) => string,
  onFollowUp: (customer: ICustomerConsult) => void
): ColumnDef<ICustomerConsult>[] => [
  {
    accessorKey: 'contactPerson',
    header: t('business.customerConsult.contactPerson'),
    meta: { className: 'min-w-[100px]', enableTooltip: true },
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
    accessorKey: 'country',
    header: t('business.customerConsult.country'),
    cell: ({ row }) => row.original.country || '-',
    meta: { className: 'min-w-[80px] text-center' },
  },
  {
    accessorKey: 'email',
    header: t('business.customerConsult.email'),
    cell: ({ row }) => row.original.email || '-',
    meta: { className: 'min-w-[200px]', enableTooltip: true },
  },
  {
    accessorKey: 'company',
    header: t('business.customerConsult.company'),
    cell: ({ row }) => row.original.company || '-',
    meta: { className: 'max-w-[200px]', enableTooltip: true },
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
      const variants: Record<
        string,
        'default' | 'secondary' | 'destructive' | 'outline'
      > = {
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
    cell: ({ row }) => row.original.consultContent || '-',
    meta: { className: 'max-w-[200px]', enableTooltip: true },
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
        variant='link'
        size='sm'
        className='px-0'
        onClick={() => onFollowUp(row.original)}
      >
        {t('business.customerConsult.followUp')}
      </Button>
    ),
    meta: { className: 'min-w-[100px]' },
  },
]
