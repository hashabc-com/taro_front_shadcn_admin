import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const languages = {
  zh: { label: '中文', flag: '🇨🇳' },
  en: { label: 'English', flag: '🇺🇸' },
}

export function LanguageSwitch() {
  const { lang, setLang } = useLanguage()
  const currentLang = languages[lang]

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='h-9 gap-2'>
          {/* <span className='text-lg'>{currentLang.flag}</span> */}
          <span className='sm:inline'>{currentLang.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setLang('zh')} className='gap-2'>
          <span className='text-lg'>{languages.zh.flag}</span>
          <span>{languages.zh.label}</span>
          <Check
            size={14}
            className={cn('ms-auto', lang !== 'zh' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLang('en')} className='gap-2'>
          <span className='text-lg'>{languages.en.flag}</span>
          <span>{languages.en.label}</span>
          <Check
            size={14}
            className={cn('ms-auto', lang !== 'en' && 'hidden')}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
