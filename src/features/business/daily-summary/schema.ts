import { z } from 'zod'

export const dailySummarySchema = z.object({
  businessName: z.string(),
  localTime: z.string(),
  inBills: z.number(),
  inAmount: z.number(),
  inAmountService: z.number(),
  outBills: z.number(),
  outAmount: z.number(),
  outAmountService: z.number(),
})

export type IDailySummaryType = z.infer<typeof dailySummarySchema>
