import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ReceiveSummary } from '@/features/orders/receive-summary-lists'
import { createBaseSearchSchema } from '@/lib/table-schemas'

const receiveSummarySearchSchema = createBaseSearchSchema({
  channel: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type IOrderSummarySearch = z.infer<typeof receiveSummarySearchSchema>

export const Route = createFileRoute('/_authenticated/orders/receive-summary-lists')({
  component: ReceiveSummary,
  validateSearch: receiveSummarySearchSchema,
})
