import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { RiskControlRulePage } from '@/features/config/risk-control-rule'
import { createBaseSearchSchema } from '@/lib/table-schemas'

const riskControlRuleSearchSchema = createBaseSearchSchema({
  ruleName: z.string().optional(),
  sceneCode: z.string().optional(),
  status: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/config/risk-control-rule')({
  component: RiskControlRulePage,
  validateSearch: riskControlRuleSearchSchema,
})
