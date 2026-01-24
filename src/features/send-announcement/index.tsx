import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { getMerchantListBySend, sendAnnouncement } from '@/api/common'
import { useCountries } from '@/hooks/use-Countries'
import type { Country } from '@/stores/country-store'
import type { Merchant } from '@/stores/merchant-store'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Main } from '@/components/layout/main'

export default function SendAnnouncement() {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formSchema = z.object({
    country: z.string().min(1, t('common.validation.required')),
    appidList: z.array(z.string()).optional(),
    content: z.string().min(1, t('common.validation.required')),
    gauthKey: z.string().length(6, t('common.validation.googleCodeFormat')),
  })

  type FormValues = z.infer<typeof formSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: '',
      appidList: [],
      content: '',
      gauthKey: '',
    },
  })

  const { data: countriesData } = useCountries()

  const countries = (countriesData?.result || []) as Country[]

  const selectedCountryId = form.watch('country')
  const selectedCountry = countries.find(
    (c) => c.code.toString() === selectedCountryId
  )

  const { data: merchantsData } = useQuery({
    queryKey: ['merchants', selectedCountry?.code],
    queryFn: () => getMerchantListBySend(selectedCountry?.code || ''),
    enabled: !!selectedCountry?.code,
  })

  const merchants = (merchantsData?.result || []) as Merchant[]

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    const res = await sendAnnouncement(values)
    if (res?.code == 200) {
      toast.success(t('sendAnnouncement.success'))
      form.reset()
    } else {
      toast.error(res?.result || t('sendAnnouncement.failed'))
    }
    setIsSubmitting(false)
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <h2 className='text-2xl font-bold tracking-tight'>
          {t('sendAnnouncement.title')}
        </h2>
      </div>
      <Card>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='max-w-2xl space-y-6'
            >
              <FormField
                control={form.control}
                name='country'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sendAnnouncement.country')}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          form.setValue('appidList', [])
                        }}
                        className='grid grid-cols-1 gap-3 md:grid-cols-3'
                      >
                        {countries.map((country) => (
                          <label
                            key={country.code}
                            htmlFor={`country-${country.code}`}
                            className='hover:bg-muted hover:border-muted-foreground flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors'
                          >
                            <RadioGroupItem
                              value={country.code.toString()}
                              id={`country-${country.code}`}
                            />
                            <span className='flex items-center gap-2 text-sm leading-none font-medium'>
                              <img
                                src={`/images/${country.code}.svg`}
                                alt={country.code}
                                className='h-4 w-4'
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                              {country.code}
                            </span>
                          </label>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='appidList'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sendAnnouncement.merchant')}</FormLabel>
                    <FormControl>
                      <div className='rounded-md border p-3'>
                        <ScrollArea className='h-[220px]'>
                          <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
                            {!selectedCountryId && (
                              <div className='text-muted-foreground text-sm'>
                                {t('common.pleaseSelectCountryFirst')}
                              </div>
                            )}
                            {selectedCountryId &&
                              merchants.map((merchant) => {
                                const checked = (field.value || []).includes(
                                  merchant.appid
                                )
                                return (
                                  <label
                                    key={merchant.appid}
                                    className='hover:bg-muted flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors'
                                  >
                                    <Checkbox
                                      checked={checked}
                                      onCheckedChange={(isChecked) => {
                                        const current = field.value || []
                                        if (isChecked) {
                                          field.onChange([
                                            ...current,
                                            merchant.appid,
                                          ])
                                        } else {
                                          field.onChange(
                                            current.filter(
                                              (id) => id !== merchant.appid
                                            )
                                          )
                                        }
                                      }}
                                    />
                                    <span className='text-sm'>
                                      {merchant.companyName}
                                    </span>
                                  </label>
                                )
                              })}
                          </div>
                        </ScrollArea>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sendAnnouncement.content')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          'sendAnnouncement.placeholder.enterContent'
                        )}
                        className='min-h-[120px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='gauthKey'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sendAnnouncement.googleCode')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'sendAnnouncement.placeholder.enterGoogleCode'
                        )}
                        maxLength={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                <Send className='mr-2 h-4 w-4' />
                {t('sendAnnouncement.send')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Main>
  )
}
