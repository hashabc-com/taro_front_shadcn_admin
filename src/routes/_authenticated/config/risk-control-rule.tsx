import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { RiskControlRulePage } from '@/features/config/risk-control-rule'

const riskControlRuleSearchSchema = z.object({
  pageNum: z.number().catch(1),
  pageSize: z.number().catch(10),
  ruleName: z.string().optional(),
  sceneCode: z.string().optional(),
  status: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/config/risk-control-rule')({
  component: RiskControlRulePage,
  validateSearch: riskControlRuleSearchSchema,
})
