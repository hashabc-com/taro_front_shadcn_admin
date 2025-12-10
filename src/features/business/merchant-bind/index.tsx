import { Main } from '@/components/layout/main'
import { MerchantBindTable } from './components/merchant-bind-table'

export function MerchantBindPage() {
  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>商户绑定列表</h2>
        </div>
      <MerchantBindTable />
    </Main>
  )
}
