import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { SettlementPage } from '@/features/fund/settlement-lists'

const settlementListsSearchSchema = z.object({
  pageNum: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
  status: z.string().optional(),
  type: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})
export type ISettlementListSearch = z.infer<typeof settlementListsSearchSchema>

export const Route = createFileRoute('/_authenticated/fund/settlement-lists')({
  component: SettlementPage,
  validateSearch: settlementListsSearchSchema,
})
