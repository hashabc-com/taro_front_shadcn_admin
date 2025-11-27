// import { showSubmittedData } from '@/lib/show-submitted-data'
// import { ConfirmDialog } from '@/components/confirm-dialog'
// import { TasksImportDialog } from './tasks-import-dialog'
import { MutateDrawer } from './payment-lists-mutate-drawer'
import { usePaymentLists } from './payment-lists-provider'

export function PaymentListsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePaymentLists()
  return (
    <>
      {currentRow && (
        <>
          <MutateDrawer
            key={`payment-lists-info-${currentRow.id}`}
            open={open === 'info'}
            onOpenChange={() => {
              setOpen('info')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
