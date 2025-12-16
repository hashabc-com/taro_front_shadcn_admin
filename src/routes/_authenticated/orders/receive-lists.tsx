import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ReceiveLists } from '@/features/orders/receive-lists'
import { createBaseSearchSchema } from '@/lib/table-schemas'

const receiveListsSearchSchema = createBaseSearchSchema({
  referenceno: z.string().optional(),
  tripartiteOrder: z.string().optional(),
  pickupCenter: z.string().optional(),
  transId: z.string().optional(),
  status: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/orders/receive-lists')({
  component: ReceiveLists,
  validateSearch: receiveListsSearchSchema,
})
