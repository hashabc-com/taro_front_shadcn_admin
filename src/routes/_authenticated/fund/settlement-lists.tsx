import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { SettlementPage } from '@/features/fund/settlement-lists'
import { createBaseSearchSchema } from '@/lib/table-schemas'

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
