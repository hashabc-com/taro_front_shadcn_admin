import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { ReceiveSummary } from '@/features/orders/receive-summary-lists'

const receiveSummarySearchSchema = createBaseSearchSchema({
  channel: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type IOrderSummarySearch = z.infer<typeof receiveSummarySearchSchema>

export const Route = createFileRoute(
  '/_authenticated/orders/receive-summary-lists'
)({
  component: ReceiveSummary,
  validateSearch: receiveSummarySearchSchema,
})
