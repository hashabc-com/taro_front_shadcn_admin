import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { SettlementPage } from '@/features/fund/settlement-lists'

const settlementListsSearchSchema = createBaseSearchSchema({
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
