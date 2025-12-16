import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { RiskControlPage } from '@/features/logs/risk-control'
import { createBaseSearchSchema } from '@/lib/table-schemas'

const riskControlSearchSchema = createBaseSearchSchema({
  ruleName: z.string().optional(),
  businessType: z
    .enum(['PAY_PAYIN', 'PAY_PAYOUT'])
    .optional()
    .catch(undefined),
})

export type IRiskControlSearch = z.infer<typeof riskControlSearchSchema>

export const Route = createFileRoute('/_authenticated/logs/risk-control')({
  component: RiskControlPage,
  validateSearch: riskControlSearchSchema,
})
