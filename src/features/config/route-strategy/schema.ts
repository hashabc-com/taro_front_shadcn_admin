import { z } from 'zod'

// 路由策略配置数据结构
export const routeStrategySchema = z.object({
  id: z.number(),
  appid: z.string(),
  routeName: z.string().optional(),
  country: z.string(),
  paymentType: z.string(), // "1": 代付, "2": 代收
  productCode: z.string(), // 支付方式：QRIS、DANA等
  routeStrategy: z.string(), // "1": 权重路由, "2": 成本优先
  enableFallback: z.string().optional(),
  maxRetry: z.number().optional(),
  status: z.string(), // "0": 启用, "1": 禁用
  priority: z.number().optional(),
  createTime: z.string().optional(),
  updateTime: z.string().optional(),
  paymentRouteChannelWeightList: z.array(z.object({
    paymentPlatform: z.string(),
    weight: z.number().optional(),
  })).optional(), // 渠道权重列表
})

export type RouteStrategy = z.infer<typeof routeStrategySchema>

// 支付渠道权重配置
export const channelWeightSchema = z.object({
  paymentPlatform: z.string(), // 支付平台：pandapayID、aipayID等
  weight: z.number().optional(), // 权重：0-100
})

export type ChannelWeight = z.infer<typeof channelWeightSchema>

// 支付渠道选项（用于下拉选择）
export const paymentChannelOptionSchema = z.object({
  id: z.number(),
  subChannelCode: z.string(),
  subChannelName: z.string(),
  channelCode: z.string(), // 渠道编码：pandapayID、aipayID等
  subChannelStatus: z.number(),
  type: z.number(),
  country: z.string(),
  createTime: z.string().optional(),
  updateTime: z.string().optional(),
})

export type PaymentChannelOption = z.infer<typeof paymentChannelOptionSchema>

// API 响应数据结构
export const routeStrategyListResponseSchema = z.object({
  pageNum: z.number().optional(),
  pageSize: z.number().optional(),
  totalRecord: z.number().optional(),
  listRecord: z.array(routeStrategySchema).optional(),
})

export type RouteStrategyListResponse = z.infer<typeof routeStrategyListResponseSchema>
