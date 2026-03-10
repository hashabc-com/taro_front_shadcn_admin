import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { ReceiveLists } from '@/features/orders/receive-lists'

const receiveListsSearchSchema = createBaseSearchSchema({
  referenceno: z.string().optional(),
  tripartiteOrder: z.string().optional(),
  pickupCenter: z.string().optional(),
  transId: z.string().optional(),
  mobile: z.string().optional(),
  status: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  refresh: z.union([z.string(), z.number()]).optional().nullable(),
})

export const Route = createFileRoute('/_authenticated/orders/receive-lists')({
  component: ReceiveLists,
  validateSearch: receiveListsSearchSchema,
})
