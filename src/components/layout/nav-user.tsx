import { Link } from '@tanstack/react-router'
import { ChevronsUpDown, HelpCircle, LogOut, Palette } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { SignOutDialog } from '@/components/sign-out-dialog'

type NavUserProps = {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function NavUser({ user }: NavUserProps) {
  const { t } = useLanguage()
  const { isMobile } = useSidebar()
  const [open, setOpen] = useDialogState()

  const userInfo = JSON.parse(localStorage.getItem('_userInfo') || '{}')

  //   adventurer - 冒险者风格
  // avataaars-neutral - 中性卡通风格
  // bottts - 机器人风格
  // fun-emoji - 趣味表情风格
  // lorelei - 简约女性风格
  // micah - 手绘风格
  // miniavs - 迷你头像风格
  // pixel-art - 像素风格
  // 生成随机头像URL - 使用thumbs风格
  const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(userInfo.name || user.name)}`

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage
                    src={avatarUrl}
                    alt={userInfo.name || user.name}
                  />
                  <AvatarFallback className='rounded-lg'>
                    {userInfo.name}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-start text-sm leading-tight'>
                  <span className='truncate font-semibold'>
                    {userInfo.name}
                  </span>
                </div>
                <ChevronsUpDown className='ms-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='min-w-56 rounded-lg'
              side={isMobile ? 'bottom' : 'right'}
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-start text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage
                      src={avatarUrl}
                      alt={userInfo.name || user.name}
                    />
                    <AvatarFallback className='rounded-lg'>
                      {userInfo.name?.slice(0, 2).toUpperCase() || 'SN'}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-start text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {userInfo.name}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <a
                    href='https://docs.taropay.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <HelpCircle />
                    {t('sidebar.apiDocs')}
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/settings/appearance'>
                    <Palette />
                    {t('settings.appearance.title')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant='destructive'
                onClick={() => setOpen(true)}
              >
                <LogOut />
                {t('common.signOut')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
