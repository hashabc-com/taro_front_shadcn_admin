import { z } from 'zod'

// 风控规则配置数据结构
export const ruleConfigSchema = z.object({
  id: z.number(),
  ruleName: z.string(),
  ruleDesc: z.string().optional(),
  sceneCode: z.string(),
  conditionExpr: z.string(),
  actionCode: z.string(),
  priority: z.number(),
  status: z.number(), // 0: 禁用, 1: 启用
  actionParams: z.string().optional(),
  createTime: z.string().optional(),
  updateTime: z.string().optional(),
})

export type RuleConfig = z.infer<typeof ruleConfigSchema>

// API 响应数据结构
export const ruleConfigResponseSchema = z.object({
  pageNum: z.number().optional(),
  pageSize: z.number().optional(),
  totalRecord: z.number().optional(),
  listRecord: z.array(ruleConfigSchema).optional(),
})

export type RuleConfigResponse = z.infer<typeof ruleConfigResponseSchema>

// 场景代码映射
export const sceneCodeMap: Record<string, string> = {
  PAY_PAYOUT: '代付',
  PAY_PAYIN: '代收',
}

// 动作标识映射
export const actionCodeMap: Record<string, string> = {
  ALARM: '告警',
  BLOCK: '拦截',
  AUDIT: '审核',
  REJECT: '拒绝',
}
