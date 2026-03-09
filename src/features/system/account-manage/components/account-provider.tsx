import { createFeatureProvider } from '@/lib/create-feature-provider'
import { type IAccountType } from '../schema'

type DialogType = 'create' | 'update' | 'delete' | 'password'

export const {
  Provider: AccountProvider,
  useContext: useAccount,
} = createFeatureProvider<IAccountType, DialogType>('Account')
