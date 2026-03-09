import { createFeatureProvider } from '@/lib/create-feature-provider'
import { type IPaymentListsType } from '../schema'

type DialogType = 'create' | 'update' | 'delete' | 'import' | 'info'

export const {
  Provider: PaymentListsProvider,
  useContext: usePaymentLists,
} = createFeatureProvider<IPaymentListsType, DialogType>('PaymentLists')
