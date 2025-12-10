import { z } from 'zod'


export const messageRecordSchema = z.object({
  id: z.number(),
  messageId: z.string(),
  messageType: z.string(),
  correlationId: z.string(),
  queueName: z.string(),
  exchangeName: z.string().optional(),
  routingKey: z.string().optional(),
  messageBody: z.string(),
  consumerService: z.string().optional(),
  consumerIp: z.string().optional(),
  errorMsg: z.string().optional(),
  consumeTime: z.string(),
  createTime: z.string(),
  updateTime: z.string(),
})

export type IMessageRecordType = z.infer<typeof messageRecordSchema>