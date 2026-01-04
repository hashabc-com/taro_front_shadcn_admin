import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type PaymentChannel } from '../schema'

type DialogType = 'create' | 'edit' | 'rate'

type ContextType = {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentRow: PaymentChannel | null
  setCurrentRow: React.Dispatch<React.SetStateAction<PaymentChannel | null>>
}

const PaymentChannelContext = React.createContext<ContextType | null>(null)

export function PaymentChannelProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<PaymentChannel | null>(null)

  return (
    <PaymentChannelContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </PaymentChannelContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePaymentChannel = () => {
  const paymentChannelContext = React.useContext(PaymentChannelContext)

  if (!paymentChannelContext) {
    throw new Error('usePaymentChannel has to be used within <PaymentChannelContext.Provider>')
  }

  return paymentChannelContext
}
