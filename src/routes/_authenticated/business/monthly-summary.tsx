import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { MonthlySummaryPage } from '@/features/business/monthly-summary'

const searchSchema = z.object({
  pageNum: z.number().default(1),
  pageSize: z.number().default(10),
  businessName: z.string().optional(),
  startMonth: z.string().optional(),
  endMonth: z.string().optional(),
})

export type IMonthlySummarySearch = z.infer<typeof searchSchema>

export const Route = createFileRoute(
  '/_authenticated/business/monthly-summary'
)({
  component: MonthlySummaryPage,
  validateSearch: searchSchema,
})
