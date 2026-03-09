import { createFeatureProvider } from '@/lib/create-feature-provider'
import { type PaymentChannel } from '../schema'

type DialogType = 'create' | 'edit' | 'rate' | 'subChannel'

export const {
  Provider: PaymentChannelProvider,
  useContext: usePaymentChannel,
} = createFeatureProvider<PaymentChannel, DialogType>('PaymentChannel')
