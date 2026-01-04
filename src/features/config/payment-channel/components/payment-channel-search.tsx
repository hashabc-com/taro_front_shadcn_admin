import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCcw } from 'lucide-react'
import { usePaymentChannel } from './payment-channel-provider'
import { getRouteApi } from '@tanstack/react-router'
import { type PaymentChannel } from '../schema'
import { useLanguage } from '@/context/language-provider'

const route = getRouteApi('/_authenticated/config/payment-channel')

type PaymentChannelSearchProps = {
  table: Table<PaymentChannel>
}

export function PaymentChannelSearch(_props: PaymentChannelSearchProps) {
  const { setOpen } = usePaymentChannel()
  const navigate = route.useNavigate()
  const { t } = useLanguage()

  const handleSearch = () => {
      navigate({
        search: (prev) => ({
          ...prev,
          pageNum: 1,
          refresh: Date.now()
        }),
      })
}

  return (
    <div className='flex items-center justify-between gap-2'>
      <div className='mt-0.5 flex gap-2'>
        <Button onClick={handleSearch} size='sm'>
          <RefreshCcw className='mr-2 h-4 w-4' />
          {t('common.refresh')}
        </Button>
      </div>

      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setOpen('create')}
        >
          <Plus className='mr-2 h-4 w-4' />
          {t('config.paymentChannel.addChannel')}
        </Button>
      </div>
    </div>
  )
}
