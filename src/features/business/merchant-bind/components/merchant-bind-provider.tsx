import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type IBusinessType } from '../schema'

type DialogType = 'bind' | 'rate'

type ContextType = {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentRow: IBusinessType | null
  setCurrentRow: React.Dispatch<React.SetStateAction<IBusinessType | null>>
}

const MerchantBindContext = React.createContext<ContextType | null>(null)

export function MerchantBindProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<IBusinessType | null>(null)

  return (
    <MerchantBindContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </MerchantBindContext.Provider>
  )
}

export const useMerchantBindProvider = () => {
  const context = React.useContext(MerchantBindContext)
  if (!context) {
    throw new Error(
      'useMerchantBindProvider has to be used within <MerchantBindContext.Provider>'
    )
  }

  return context
}
