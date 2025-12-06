import { Link } from '@tanstack/react-router'
import useDialogState from '@/hooks/use-dialog-state'
import { useLanguage } from '@/context/language-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  // DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { HelpCircle, LogOut, Palette } from 'lucide-react'

export function ProfileDropdown() {
  const { t } = useLanguage()
  const [signOutOpen, setSignOutOpen] = useDialogState()
  const userInfo = JSON.parse(localStorage.getItem('_userInfo') || '{}');
  const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(userInfo.name)}`
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarFallback>{userInfo.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='min-w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex items-center gap-1.5'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={avatarUrl} alt={userInfo.name} />
              </Avatar>
              <p className='text-sm leading-none font-medium'>{userInfo.name}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <a href="https://docs.taropay.com/" target="_blank" rel="noopener noreferrer">
                <HelpCircle />
                {t('sidebar.apiDocs')}
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings/appearance'>
                <Palette />
                {t('common.appearance')}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setSignOutOpen(true)}>
            <LogOut />
            {t('common.signOut')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!signOutOpen} onOpenChange={setSignOutOpen} />
    </>
  )
}
