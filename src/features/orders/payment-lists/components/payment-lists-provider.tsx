import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type IPaymentListsType } from '../schema'

type DialogType = 'create' | 'update' | 'delete' | 'import' | 'info'

type ContextType = {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentRow: IPaymentListsType | null
  setCurrentRow: React.Dispatch<React.SetStateAction<IPaymentListsType | null>>
}

const PaymentListsContext = React.createContext<ContextType | null>(null)

export function PaymentListsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<IPaymentListsType | null>(null)

  return (
    <PaymentListsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </PaymentListsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePaymentLists = () => {
  const paymentListsContext = React.useContext(PaymentListsContext)
  if (!paymentListsContext) {
    throw new Error('usePaymentLists has to be used within <PaymentListsContext.Provider>')
  }

  return paymentListsContext
}
