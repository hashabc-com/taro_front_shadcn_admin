import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { MerchantDailySummaryPage } from '@/features/fund/merchant-daily-summary'

const merchantDailySummarySearchSchema = z.object({
  pageNum: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type IMerchantDailySummarySearch = z.infer<typeof merchantDailySummarySearchSchema>

export const Route = createFileRoute('/_authenticated/fund/merchant-daily-summary')({
  component: MerchantDailySummaryPage,
  validateSearch: merchantDailySummarySearchSchema,
})
