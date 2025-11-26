import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useCurrencyConversionStore } from '@/stores/currency-conversion-store'
import { SUPPORTED_CURRENCIES, type SupportedCurrency, useCurrency } from '@/lib/currency'

const currencyNames: Record<SupportedCurrency, string> = {
  CNY: '人民币',
  EUR: '欧元',
  GBP: '英镑',
  HKD: '港币',
  USD: '美元',
}

export function CurrencySelector() {
  const [open, setOpen] = useState(false)
  const defaultCurrency = useCurrency()
  const displayCurrency = useCurrencyConversionStore((state) => state.displayCurrency)
  const setDisplayCurrency = useCurrencyConversionStore((state) => state.setDisplayCurrency)

  const currentCurrency = displayCurrency || defaultCurrency

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[140px] justify-between text-xs h-9'
        >
          <span className='truncate'>
            {currentCurrency}
          </span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='搜索货币...' className='h-9' />
          <CommandList>
            <CommandEmpty>未找到货币</CommandEmpty>
            <CommandGroup>
              {/* 默认货币选项 */}
              <CommandItem
                value={defaultCurrency}
                onSelect={() => {
                  setDisplayCurrency(null)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    !displayCurrency ? 'opacity-100' : 'opacity-0'
                  )}
                />
                <div className='flex flex-col'>
                  <span className='font-medium'>{defaultCurrency}</span>
                  <span className='text-xs text-muted-foreground'>默认货币</span>
                </div>
              </CommandItem>

              {/* 其他货币选项 */}
              {SUPPORTED_CURRENCIES.filter(c => c !== defaultCurrency).map((currency) => (
                <CommandItem
                  key={currency}
                  value={currency}
                  onSelect={(value) => {
                    setDisplayCurrency(value.toUpperCase() as SupportedCurrency)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      displayCurrency === currency ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className='flex flex-col'>
                    <span className='font-medium'>{currency}</span>
                    <span className='text-xs text-muted-foreground'>
                      {currencyNames[currency]}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
