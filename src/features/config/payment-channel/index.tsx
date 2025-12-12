import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { PaymentChannelProvider } from './components/payment-channel-provider'
import { PaymentChannelTable } from './components/payment-channel-table'
import { PaymentChannelDialogs } from './components/payment-channel-dialogs'
import { getPayChannelList } from '@/api/config'
import { type PaymentChannel } from './schema'
import { useLanguage } from '@/context/language-provider'

const route = getRouteApi('/_authenticated/config/payment-channel')

export function PaymentChannelConfig() {
  const { t } = useLanguage()
  const search = route.useSearch()

  const { data, isLoading } = useQuery({
    queryKey: ['payment-channels', search],
    queryFn: () => getPayChannelList(search),
  })

  const channels = (data?.result?.listRecord as PaymentChannel[]) || []
  const totalRecord = data?.result?.totalRecord || 0

  return (
    <PaymentChannelProvider>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{t('config.paymentChannel.title')}</h2>
          </div>
        </div>
        <PaymentChannelTable data={channels} totalRecord={totalRecord} isLoading={isLoading} />
      </Main>
      <PaymentChannelDialogs />
    </PaymentChannelProvider>
  )
}
