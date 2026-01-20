import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { MerchantDailySummaryPage } from '@/features/fund/merchant-daily-summary'

const merchantDailySummarySearchSchema = createBaseSearchSchema({
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type IMerchantDailySummarySearch = z.infer<
  typeof merchantDailySummarySearchSchema
>

export const Route = createFileRoute(
  '/_authenticated/fund/merchant-daily-summary'
)({
  component: MerchantDailySummaryPage,
  validateSearch: merchantDailySummarySearchSchema,
})
