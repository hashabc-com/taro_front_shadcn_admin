import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Order } from '../schema'

type DialogType = 'create' | 'update' | 'delete' | 'import' | 'info'

type ContextType = {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentRow: Order | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Order | null>>
}

const ReceiveListsContext = React.createContext<ContextType | null>(null)

export function ReceiveListsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<Order | null>(null)

  return (
    <ReceiveListsContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </ReceiveListsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useReceiveLists = () => {
  const receiveListsContext = React.useContext(ReceiveListsContext)

  if (!receiveListsContext) {
    throw new Error(
      'useReceiveLists has to be used within <ReceiveListsContext.Provider>'
    )
  }

  return receiveListsContext
}
