import http from '@/lib/http'

// 获取风控规则配置列表
export const getRuleConfigList = (params: {
  pageNum: number
  pageSize: number
  ruleName?: string | null
  sceneCode?: string | null
  status?: string | null
}) => http.get('/admin/ruleConfig/list', params)

// 根据ID获取规则配置详情
export const getRuleConfigById = (id: number) =>
  http.get('/admin/ruleConfig/getById', { id })

// 创建规则配置
export const createRuleConfig = (data: {
  ruleName: string
  ruleDesc?: string
  sceneCode: string
  conditionExpr: string
  actionCode: string
  priority: number
  status: number
  actionParams?: string
}) => http.post('/admin/ruleConfig/create', data)

// 更新规则配置
export const updateRuleConfig = (data: {
  id: number
  ruleName: string
  ruleDesc?: string
  sceneCode: string
  conditionExpr: string
  actionCode: string
  priority: number
  status: number
  actionParams?: string
}) => http.post('/admin/ruleConfig/update', data)

// 删除规则配置
export const deleteRuleConfig = (data: { id: number }) =>
  http.post('/admin/ruleConfig/delete', data)
