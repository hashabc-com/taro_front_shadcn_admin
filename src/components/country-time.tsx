import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { useCountryStore } from '@/stores/country-store'
import { useLanguage } from '@/context/language-provider'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

/**
 * Country code → IANA timezone mapping
 */
const COUNTRY_TIMEZONE: Record<string, string> = {
  ID: 'Asia/Jakarta', // 印尼 UTC+7
  BR: 'America/Sao_Paulo', // 巴西 UTC-3
  VN: 'Asia/Ho_Chi_Minh', // 越南 UTC+7
  MX: 'America/Mexico_City', // 墨西哥 UTC-6
  BD: 'Asia/Dhaka', // 孟加拉 UTC+6
  PH: 'Asia/Manila', // 菲律宾 UTC+8
  NG: 'Africa/Lagos', // 尼日利亚 UTC+1
  PK: 'Asia/Karachi', // 巴基斯坦 UTC+5
}

function formatTime(date: Date, timezone: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

function formatDate(date: Date, timezone: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    timeZone: timezone,
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).format(date)
}

export function CountryTime() {
  const { selectedCountry } = useCountryStore()
  const { t, lang } = useLanguage()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!selectedCountry) return null

  const timezone = COUNTRY_TIMEZONE[selectedCountry.code]
  if (!timezone) return null

  const countryName = t(`common.countrys.${selectedCountry.code}`)
  const countryTime = formatTime(now, timezone, lang)
  const countryDate = formatDate(now, timezone, lang)
  const beijingTime = formatTime(now, 'Asia/Shanghai', lang)
  const beijingDate = formatDate(now, 'Asia/Shanghai', lang)

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='text-muted-foreground hover:text-foreground flex shrink-0 cursor-default items-center gap-1.5 text-xs transition-colors max-md:hidden'>
            <Clock className='h-3.5 w-3.5' />
            <span className='font-medium tabular-nums'>
              {countryTime}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side='bottom' className='text-xs'>
          <div className='space-y-1'>
            <div className='flex items-center justify-between gap-4'>
              <span className='tabular-nums font-medium'>
                {countryName}
              </span>
              <span className='tabular-nums font-medium'>
                {countryDate} {countryTime}
              </span>
            </div>
            <div className='flex items-center justify-between gap-4'>
              <span className='tabular-nums font-medium'>
                {t('common.countryTime.beijing')}
              </span>
              <span className='tabular-nums font-medium'>
                {beijingDate} {beijingTime}
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
