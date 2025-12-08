import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { CollectionSuccessRate } from '@/features/orders/collection-success-rate'

const collectionSuccessRateSearchSchema = z.object({
  pageNum: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
  channel: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  pickupCenter: z.string().optional(),
})
export type ICollectionRateSearch = z.infer<typeof collectionSuccessRateSearchSchema>

export const Route = createFileRoute('/_authenticated/orders/collection-success-rate')({
  component: CollectionSuccessRate,
  validateSearch: collectionSuccessRateSearchSchema,
})
