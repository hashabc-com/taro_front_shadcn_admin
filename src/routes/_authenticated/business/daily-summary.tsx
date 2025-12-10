import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { DailySummaryPage } from '@/features/business/daily-summary'

const searchSchema = z.object({
  pageNum: z.number().default(1),
  pageSize: z.number().default(10),
  businessName: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type IDailySummarySearch = z.infer<typeof searchSchema>

export const Route = createFileRoute('/_authenticated/business/daily-summary')({
  component: DailySummaryPage,
  validateSearch: searchSchema,
})
