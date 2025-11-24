// import { showSubmittedData } from '@/lib/show-submitted-data'
// import { ConfirmDialog } from '@/components/confirm-dialog'
// import { TasksImportDialog } from './tasks-import-dialog'
import { MutateDrawer } from './receive-lists-mutate-drawer'
import { useReceiveLists } from './receive-lists-provider'

export function ReceiveListsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useReceiveLists()
  return (
    <>
      {currentRow && (
        <>
          <MutateDrawer
            key={`receive-lists-update-${currentRow.id}`}
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
