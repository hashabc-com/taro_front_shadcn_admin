import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { CountryDailySummaryPage } from '@/features/fund/country-daily-summary'

const countryDailySummarySearchSchema = createBaseSearchSchema({
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type ICountryDailySummarySearch = z.infer<
  typeof countryDailySummarySearchSchema
>

export const Route = createFileRoute(
  '/_authenticated/fund/country-daily-summary'
)({
  component: CountryDailySummaryPage,
  validateSearch: countryDailySummarySearchSchema,
})
