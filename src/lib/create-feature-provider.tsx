import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'

type FeatureContextType<TRow, TDialog extends string> = {
  open: TDialog | null
  setOpen: (str: TDialog | null) => void
  currentRow: TRow | null
  setCurrentRow: React.Dispatch<React.SetStateAction<TRow | null>>
}

/**
 * Factory function to create a feature provider and its corresponding hook.
 *
 * Eliminates the need to write repetitive Provider+Context+Hook boilerplate
 * for each feature module.
 *
 * @example
 * ```tsx
 * import { createFeatureProvider } from '@/lib/create-feature-provider'
 * import { type Order } from '../schema'
 *
 * type DialogType = 'create' | 'edit' | 'delete'
 *
 * export const {
 *   Provider: OrderProvider,
 *   useContext: useOrder,
 * } = createFeatureProvider<Order, DialogType>('Order')
 * ```
 */
export function createFeatureProvider<
  TRow,
  TDialog extends string = string,
>(displayName: string) {
  const Context = React.createContext<FeatureContextType<
    TRow,
    TDialog
  > | null>(null)

  function Provider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<TDialog>(null)
    const [currentRow, setCurrentRow] = useState<TRow | null>(null)

    return (
      <Context.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
        {children}
      </Context.Provider>
    )
  }

  Provider.displayName = `${displayName}Provider`

  function useFeatureContext() {
    const context = React.useContext(Context)
    if (!context) {
      throw new Error(
        `use${displayName} must be used within <${displayName}Provider>`
      )
    }
    return context
  }

  return { Provider, useContext: useFeatureContext }
}
