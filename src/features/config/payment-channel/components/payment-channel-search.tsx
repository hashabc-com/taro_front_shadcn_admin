import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Plus, Settings,RefreshCcw } from 'lucide-react'
import { usePaymentChannel } from './payment-channel-provider'
import { getRouteApi } from '@tanstack/react-router'
import { type PaymentChannel } from '../schema'

const route = getRouteApi('/_authenticated/config/payment-channel')

type PaymentChannelSearchProps = {
  table: Table<PaymentChannel>
}

export function PaymentChannelSearch(_props: PaymentChannelSearchProps) {
  const { setOpen } = usePaymentChannel()
  const navigate = route.useNavigate()


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
          刷新
        </Button>
      </div>

      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setOpen('create')}
        >
          <Plus className='mr-2 h-4 w-4' />
          添加商户配置
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setOpen('config')}
        >
          <Settings className='mr-2 h-4 w-4' />
          一键配置
        </Button>
      </div>
    </div>
  )
}
