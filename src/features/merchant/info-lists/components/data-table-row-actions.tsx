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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type IMerchantInfoType } from '../schema'
import { useLanguage } from '@/context/language-provider'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
  onEdit: (merchant: IMerchantInfoType) => void
  onChangePassword: (merchant: IMerchantInfoType) => void
  onToggleStatus: (merchant: IMerchantInfoType) => void
  onUnbindKey: (merchant: IMerchantInfoType) => void
  onBindIp: (merchant: IMerchantInfoType) => void
  onRateConfig: (merchant: IMerchantInfoType) => void
  onAutoLogin: (merchant: IMerchantInfoType) => void
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
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={() => onEdit(merchant)}>
          <Edit className='mr-2 h-4 w-4' />
          编辑
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChangePassword(merchant)}>
          <Key className='mr-2 h-4 w-4' />
          修改密码
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
          解绑秘钥
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onBindIp(merchant)}>
          <Globe className='mr-2 h-4 w-4' />
          后台IP
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRateConfig(merchant)}>
          <DollarSign className='mr-2 h-4 w-4' />
          费率配置
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onAutoLogin(merchant)}
          disabled={merchant.status === 1}
        >
          <LogIn className='mr-2 h-4 w-4' />
          登录后台
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
