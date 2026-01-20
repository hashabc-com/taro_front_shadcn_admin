import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { MonthlySummaryPage } from '@/features/business/monthly-summary'

const searchSchema = createBaseSearchSchema({
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
