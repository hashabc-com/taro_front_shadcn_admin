import { Main } from '@/components/layout/main'
import { MessageRecordTable } from './components/message-record-table'

export function MessageRecordPage() {
  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>消息记录表</h2>
        </div>
      </div>
      <MessageRecordTable />
    </Main>
  )
}
