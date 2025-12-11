import { z } from 'zod'

// 支付渠道配置数据结构
export const paymentChannelSchema = z.object({
  id: z.number(),
  merchantId: z.string(),
  customerName: z.string(),
  country: z.string().nullable(),
  type: z.number(), // 1: 代付, 2: 代收
  channel: z.string(),
  status: z.number(), // 0: 禁用, 1: 启用
  createTime: z.string().optional(),
  updateTime: z.string().optional(),
})

export type PaymentChannel = z.infer<typeof paymentChannelSchema>

// 子渠道(存款记录)数据结构
export const paymentShopSchema = z.object({
  id: z.number(),
  paymentPlatform: z.string(),
  withdrawalsShop: z.string(),
  status: z.number(), // 0: 禁用, 1: 启用
  createTime: z.string(),
  updateTime: z.string().optional(),
})

export type PaymentShop = z.infer<typeof paymentShopSchema>

// 渠道选项数据结构
export const channelOptionSchema = z.object({
  itemName: z.string(),
  itemValue: z.string(),
  children: z.array(z.object({
    itemName: z.string(),
    itemValue: z.string(),
  })).optional(),
})

export type ChannelOption = z.infer<typeof channelOptionSchema>

// API 响应数据结构
export const paymentChannelListResponseSchema = z.object({
  pageNum: z.number().optional(),
  pageSize: z.number().optional(),
  totalRecord: z.number().optional(),
  listRecord: z.array(paymentChannelSchema).optional(),
})

export type PaymentChannelListResponse = z.infer<typeof paymentChannelListResponseSchema>

export const paymentShopListResponseSchema = z.object({
  pageNum: z.number().optional(),
  pageSize: z.number().optional(),
  totalRecord: z.number().optional(),
  listRecord: z.array(paymentShopSchema).optional(),
})

export type PaymentShopListResponse = z.infer<typeof paymentShopListResponseSchema>
