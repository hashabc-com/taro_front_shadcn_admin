import { createFeatureProvider } from '@/lib/create-feature-provider'
import { type IMessageRecordType } from '../schema'

type DialogType = 'detail' | 'add'

export const {
  Provider: MessageRecordProvider,
  useContext: useMessageRecord,
} = createFeatureProvider<IMessageRecordType, DialogType>('MessageRecord')
