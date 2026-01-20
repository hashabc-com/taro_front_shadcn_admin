import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import {
  Edit,
  Key,
  Power,
  Globe,
  DollarSign,
  LogIn,
  Trash2,
  Users,
} from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type IMerchantInfoType } from '../schema'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
  onEdit: (merchant: IMerchantInfoType) => void
  onChangePassword: (merchant: IMerchantInfoType) => void
  onToggleStatus: (merchant: IMerchantInfoType) => void
  onUnbindKey: (merchant: IMerchantInfoType) => void
  onBindIp: (merchant: IMerchantInfoType) => void
  onRateConfig: (merchant: IMerchantInfoType) => void
  onAutoLogin: (merchant: IMerchantInfoType) => void
  onBindTgGroup?: (merchant: IMerchantInfoType) => void
}

export function DataTableRowActions<TData>({
  row,
  onEdit,
  onChangePassword,
  onToggleStatus,
  onUnbindKey,
  onBindIp,
  onRateConfig,
  onAutoLogin,
  onBindTgGroup,
}: DataTableRowActionsProps<TData>) {
  const merchant = row.original as IMerchantInfoType
  const { t } = useLanguage()
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>操作菜单</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-auto'>
        <DropdownMenuItem onClick={() => onEdit(merchant)}>
          <Edit className='mr-2 h-4 w-4' />
          {t('common.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChangePassword(merchant)}>
          <Key className='mr-2 h-4 w-4' />
          {t('merchant.info.changePassword')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onToggleStatus(merchant)}
          className={merchant.status === 0 ? 'text-destructive' : ''}
        >
          <Power className='mr-2 h-4 w-4' />
          {merchant.status === 0 ? t('common.disable') : t('common.enable')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onUnbindKey(merchant)}>
          <Trash2 className='mr-2 h-4 w-4' />
          {t('merchant.info.unbindSecretKey')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onBindIp(merchant)}>
          <Globe className='mr-2 h-4 w-4' />
          {t('merchant.info.bindIp')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onBindTgGroup?.(merchant)}
          disabled={!onBindTgGroup}
        >
          <Users className='mr-2 h-4 w-4' />
          {t('merchant.info.bindTgGroup')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRateConfig(merchant)}>
          <DollarSign className='mr-2 h-4 w-4' />
          {t('merchant.info.rateConfig')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onAutoLogin(merchant)}
          disabled={merchant.status === 1}
        >
          <LogIn className='mr-2 h-4 w-4' />
          {t('merchant.info.autoLogin')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
