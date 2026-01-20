import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type IAccountType } from '../schema'

type DialogType = 'create' | 'update' | 'delete' | 'password'

type ContextType = {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentRow: IAccountType | null
  setCurrentRow: React.Dispatch<React.SetStateAction<IAccountType | null>>
}

const AccountContext = React.createContext<ContextType | null>(null)

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<IAccountType | null>(null)

  return (
    <AccountContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </AccountContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAccount = () => {
  const accountContext = React.useContext(AccountContext)
  if (!accountContext) {
    throw new Error(
      'useAccount has to be used within <AccountContext.Provider>'
    )
  }

  return accountContext
}
