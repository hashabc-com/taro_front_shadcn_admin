import { z } from 'zod'

// 支付通道配置数据结构 - 对应 payment_channel 表
export const paymentChannelSchema = z.object({
  id: z.number(),
  channelCode: z.string(), // 支付渠道唯一标识符（业务层面）
  channelName: z.string(), // 支付渠道名称
  channelDesc: z.string().nullable(), // 支付渠道描述
  fundType: z.number(), // 收付类型：1=收款渠道，2=付款渠道，3=收付两用渠道
  singleMinAmount: z.number().nullable(), // 单笔最低限额
  singleMaxAmount: z.number().nullable(), // 单笔最高限额
  dailyMaxAmount: z.number().nullable(), // 单日累计最高限额
  channelStatus: z.number(), // 通道状态：1=正常，2=维护，3=暂停
  costRate: z.number().nullable(), // 渠道成本费率
  externalQuoteRate: z.number().nullable(), // 对外报价费率
  transProcessTime: z.string().nullable(), // 结算时间
  runTimeRange: z.string().nullable(), // 渠道运行时段
  country: z.string().nullable(), // 国家编码
  createTime: z.string().optional(), // 创建时间
  updateTime: z.string().optional(), // 更新时间
  remark: z.string().nullable(), // 备注信息
})

export type PaymentChannel = z.infer<typeof paymentChannelSchema>

// API 响应数据结构
export const paymentChannelListResponseSchema = z.object({
  pageNum: z.number().optional(),
  pageSize: z.number().optional(),
  totalRecord: z.number().optional(),
  listRecord: z.array(paymentChannelSchema).optional(),
})

export type PaymentChannelListResponse = z.infer<
  typeof paymentChannelListResponseSchema
>

// 子渠道配置数据结构 - 对应 payment_sub_channel 表
export const paymentSubChannelSchema = z.object({
  id: z.number(),
  subChannelCode: z.string(), // 子渠道业务编码
  subChannelName: z.string(), // 子渠道业务名称
  channelCode: z.string(), // 主渠道编码
  subChannelStatus: z.number(), // 子渠道状态：1=正常，2=维护，3=暂停
  type: z.number(), // 1=代付，2=代收
  country: z.string().nullable(), // 国家代码
  createTime: z.string().optional(), // 创建时间
  updateTime: z.string().optional(), // 更新时间
})

export type PaymentSubChannel = z.infer<typeof paymentSubChannelSchema>

// 子渠道表单数据结构
export const paymentSubChannelFormSchema = z.object({
  subChannelCode: z.string().min(1),
  subChannelName: z.string().min(1),
  subChannelStatus: z.coerce.number().min(1),
  type: z.coerce.number().min(1),
  country: z.string().optional(),
})

export type PaymentSubChannelFormData = z.infer<
  typeof paymentSubChannelFormSchema
>
