import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type RouteStrategy } from '../schema'

type DialogType = 'create' | 'edit'

type ContextType = {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentRow: RouteStrategy | null
  setCurrentRow: React.Dispatch<React.SetStateAction<RouteStrategy | null>>
}

const RouteStrategyContext = React.createContext<ContextType | null>(null)

export function RouteStrategyProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<RouteStrategy | null>(null)

  return (
    <RouteStrategyContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </RouteStrategyContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRouteStrategy = () => {
  const routeStrategyContext = React.useContext(RouteStrategyContext)

  if (!routeStrategyContext) {
    throw new Error(
      'useRouteStrategy has to be used within <RouteStrategyContext.Provider>'
    )
  }

  return routeStrategyContext
}
