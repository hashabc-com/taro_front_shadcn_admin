import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { CollectionSuccessRate } from '@/features/orders/collection-success-rate'

const collectionSuccessRateSearchSchema = createBaseSearchSchema({
  channel: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  pickupCenter: z.string().optional(),
})

export type ICollectionRateSearch = z.infer<
  typeof collectionSuccessRateSearchSchema
>

export const Route = createFileRoute(
  '/_authenticated/orders/collection-success-rate'
)({
  component: CollectionSuccessRate,
  validateSearch: collectionSuccessRateSearchSchema,
})
