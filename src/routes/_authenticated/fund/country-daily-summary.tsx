import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { CountryDailySummaryPage } from '@/features/fund/country-daily-summary'

const countryDailySummarySearchSchema = z.object({
  pageNum: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type ICountryDailySummarySearch = z.infer<typeof countryDailySummarySearchSchema>

export const Route = createFileRoute('/_authenticated/fund/country-daily-summary')({
  component: CountryDailySummaryPage,
  validateSearch: countryDailySummarySearchSchema,
})
