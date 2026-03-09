import { useCallback, useMemo } from 'react'
import { format, parse } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

/**
 * mode:
 * - 'date'       仅年月日，输出 "yyyy-MM-dd"
 * - 'datetime'   年月日+时分，输出 "yyyy-MM-dd HH:mm"
 * - 'datetime-s' 年月日+时分秒，输出 "yyyy-MM-dd HH:mm:ss"（默认）
 */
type PickerMode = 'date' | 'datetime' | 'datetime-s'

type DateRangePickerProps = {
  startTime: string
  endTime: string
  onStartTimeChange: (value: string) => void
  onEndTimeChange: (value: string) => void
  placeholder?: string
  /** 选择精度，默认 'datetime-s' */
  mode?: PickerMode
}

type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

const MODE_CONFIG = {
  'date': {
    parseFormat: 'yyyy-MM-dd',
    timeFormat: '',
    defaultTime: '',
    step: undefined,
  },
  'datetime': {
    parseFormat: 'yyyy-MM-dd HH:mm',
    timeFormat: 'HH:mm',
    defaultTime: '00:00',
    step: 60,
  },
  'datetime-s': {
    parseFormat: 'yyyy-MM-dd HH:mm:ss',
    timeFormat: 'HH:mm:ss',
    defaultTime: '00:00:00',
    step: 1,
  },
} as const

/**
 * 基于 Calendar 的日期（时间）范围选择器。
 *
 * - mode='date'       → 仅选日期，输出 "yyyy-MM-dd"
 * - mode='datetime'   → 日期+时分，输出 "yyyy-MM-dd HH:mm"
 * - mode='datetime-s' → 日期+时分秒，输出 "yyyy-MM-dd HH:mm:ss"（默认）
 */
export function DateRangePicker({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  placeholder,
  mode = 'datetime-s',
}: DateRangePickerProps) {
  const { t, lang } = useLanguage()
  const locale = lang === 'zh' ? zhCN : enUS
  const cfg = MODE_CONFIG[mode]
  const showTime = mode !== 'date'

  // 从字符串解析出 Date（日期部分）和 时间字符串
  const parseDateTime = useCallback(
    (str: string) => {
      if (!str) return { date: undefined, time: cfg.defaultTime }
      try {
        // 尝试按当前 mode 格式解析
        const d = parse(str, cfg.parseFormat, new Date())
        if (!isNaN(d.getTime())) {
          return {
            date: d,
            time: cfg.timeFormat ? format(d, cfg.timeFormat) : '',
          }
        }
        // 回退：尝试按含秒格式解析（兼容已有数据）
        const d2 = parse(str, 'yyyy-MM-dd HH:mm:ss', new Date())
        if (!isNaN(d2.getTime())) {
          return {
            date: d2,
            time: cfg.timeFormat ? format(d2, cfg.timeFormat) : '',
          }
        }
        // 回退：仅日期
        const d3 = parse(str, 'yyyy-MM-dd', new Date())
        if (!isNaN(d3.getTime())) {
          return { date: d3, time: cfg.defaultTime }
        }
        return { date: undefined, time: cfg.defaultTime }
      } catch {
        return { date: undefined, time: cfg.defaultTime }
      }
    },
    [cfg]
  )

  // 从 props 派生日期和时间
  const startParsed = parseDateTime(startTime)
  const endParsed = parseDateTime(endTime)

  const dateRange: DateRange = {
    from: startParsed.date,
    to: endParsed.date,
  }
  const fromTime = startParsed.time
  const toTime = endParsed.time

  // 组合日期 + 时间 -> 输出字符串
  const combineDateTime = useCallback(
    (date: Date | undefined, time: string) => {
      if (!date) return ''
      const datePart = format(date, 'yyyy-MM-dd')
      return time ? `${datePart} ${time}` : datePart
    },
    []
  )

  const handleDateSelect = (range: DateRange | undefined) => {
    const newFrom = range?.from
    const newTo = range?.to
    onStartTimeChange(
      newFrom ? combineDateTime(newFrom, fromTime) : ''
    )
    onEndTimeChange(newTo ? combineDateTime(newTo, toTime) : '')
  }

  const handleFromTimeChange = (val: string) => {
    if (dateRange.from) {
      onStartTimeChange(combineDateTime(dateRange.from, val))
    }
  }

  const handleToTimeChange = (val: string) => {
    if (dateRange.to) {
      onEndTimeChange(combineDateTime(dateRange.to, val))
    }
  }

  // 显示文本
  const text = useMemo(() => {
    const fmt = (d: Date, time: string) => {
      const datePart = format(d, 'yyyy-MM-dd', { locale })
      return time ? `${datePart} ${time}` : datePart
    }
    if (dateRange.from && dateRange.to) {
      return `${fmt(dateRange.from, fromTime)}  ~  ${fmt(dateRange.to, toTime)}`
    }
    if (dateRange.from) {
      return fmt(dateRange.from, fromTime)
    }
    return null
  }, [dateRange.from, dateRange.to, fromTime, toTime, locale])

  const defaultPlaceholder = showTime
    ? t('common.selectDateTimeRange')
    : t('common.selectDateRange')

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='w-full justify-start text-left font-normal'
        >
          <CalendarIcon className='text-muted-foreground mr-2 h-4 w-4' />
          {text ? (
            <span className='truncate text-sm'>{text}</span>
          ) : (
            <span className='text-muted-foreground'>
              {placeholder || defaultPlaceholder}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='range'
          defaultMonth={dateRange.from}
          selected={{ from: dateRange.from, to: dateRange.to }}
          onSelect={(range) =>
            handleDateSelect(
              range ? { from: range.from, to: range.to } : undefined
            )
          }
          numberOfMonths={2}
          locale={locale}
        />
        {showTime && (
          <div className='border-t px-4 py-3'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <Label className='text-muted-foreground shrink-0 text-xs'>
                  {t('common.startTime')}
                </Label>
                <Input
                  type='time'
                  step={cfg.step}
                  value={fromTime}
                  onChange={(e) => handleFromTimeChange(e.target.value)}
                  className='h-8 w-[130px] text-sm'
                />
              </div>
              <div className='flex items-center gap-2'>
                <Label className='text-muted-foreground shrink-0 text-xs'>
                  {t('common.endTime')}
                </Label>
                <Input
                  type='time'
                  step={cfg.step}
                  value={toTime}
                  onChange={(e) => handleToTimeChange(e.target.value)}
                  className='h-8 w-[130px] text-sm'
                />
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export type { PickerMode }
