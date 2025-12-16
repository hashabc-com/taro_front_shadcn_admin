import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { MerchantDailySummaryPage } from '@/features/fund/merchant-daily-summary'
import { createBaseSearchSchema } from '@/lib/table-schemas'

const merchantDailySummarySearchSchema = createBaseSearchSchema({
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type IMerchantDailySummarySearch = z.infer<typeof merchantDailySummarySearchSchema>

export const Route = createFileRoute('/_authenticated/fund/merchant-daily-summary')({
  component: MerchantDailySummaryPage,
  validateSearch: merchantDailySummarySearchSchema,
})
