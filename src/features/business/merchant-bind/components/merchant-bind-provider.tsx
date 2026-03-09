import { createFeatureProvider } from '@/lib/create-feature-provider'
import { type IBusinessType } from '../schema'

type DialogType = 'bind' | 'rate'

export const {
  Provider: MerchantBindProvider,
  useContext: useMerchantBindProvider,
} = createFeatureProvider<IBusinessType, DialogType>('MerchantBind')
