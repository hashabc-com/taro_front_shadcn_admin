import { createFeatureProvider } from '@/lib/create-feature-provider'
import { type RouteStrategy } from '../schema'

type DialogType = 'create' | 'edit'

export const {
  Provider: RouteStrategyProvider,
  useContext: useRouteStrategy,
} = createFeatureProvider<RouteStrategy, DialogType>('RouteStrategy')
