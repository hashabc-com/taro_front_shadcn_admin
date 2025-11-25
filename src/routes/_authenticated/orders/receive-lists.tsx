import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ReceiveLists } from '@/features/orders/receive-lists'

const receiveListsSearchSchema = z.object({
  pageNum: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
  referenceno: z.string().optional(),
  tripartiteOrder: z.string().optional(),
  transId: z.string().optional(),
  status: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/orders/receive-lists')({
  component: ReceiveLists,
  validateSearch: receiveListsSearchSchema,
})
