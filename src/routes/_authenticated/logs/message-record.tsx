import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { MessageRecordPage } from '@/features/logs/message-record'

const messageRecordSearchSchema = z.object({
  pageNum: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
  messageId: z.string().optional(),
  correlationId: z.string().optional(),
  queueName: z.string().optional(),
  consumerService: z.string().optional(),
})
export type IMessageRecordSearch = z.infer<typeof messageRecordSearchSchema>

export const Route = createFileRoute('/_authenticated/logs/message-record')({
  component: MessageRecordPage,
  validateSearch: messageRecordSearchSchema,
})
