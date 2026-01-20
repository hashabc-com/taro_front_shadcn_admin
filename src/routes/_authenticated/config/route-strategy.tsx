import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { RouteStrategyConfig } from '@/features/config/route-strategy'

const routeStrategySearchSchema = createBaseSearchSchema({})

export const Route = createFileRoute('/_authenticated/config/route-strategy')({
  component: RouteStrategyConfig,
  validateSearch: routeStrategySearchSchema,
})
