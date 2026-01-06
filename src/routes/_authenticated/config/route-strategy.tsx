import { createFileRoute } from '@tanstack/react-router'
import { RouteStrategyConfig } from '@/features/config/route-strategy'
import { createBaseSearchSchema } from '@/lib/table-schemas'


const routeStrategySearchSchema = createBaseSearchSchema({})


export const Route = createFileRoute('/_authenticated/config/route-strategy')({
  component: RouteStrategyConfig,
  validateSearch: routeStrategySearchSchema,
})
