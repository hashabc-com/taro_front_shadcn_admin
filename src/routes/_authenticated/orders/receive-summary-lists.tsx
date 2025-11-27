import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ReceiveSummary } from '@/features/orders/receive-summary-lists'

const receiveSummarySearchSchema = z.object({
  pageNum: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
  channel: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})
export type IOrderSummarySearch = z.infer<typeof receiveSummarySearchSchema>

export const Route = createFileRoute('/_authenticated/orders/receive-summary-lists')({
  component: ReceiveSummary,
  validateSearch: receiveSummarySearchSchema,
})
