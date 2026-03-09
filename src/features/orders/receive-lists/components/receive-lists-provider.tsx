import { createFeatureProvider } from '@/lib/create-feature-provider'
import { type Order } from '../schema'

type DialogType = 'create' | 'update' | 'delete' | 'import' | 'info'

export const {
  Provider: ReceiveListsProvider,
  useContext: useReceiveLists,
} = createFeatureProvider<Order, DialogType>('ReceiveLists')
