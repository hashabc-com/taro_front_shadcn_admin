import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { MessageRecordPage } from '@/features/logs/message-record'

const messageRecordSearchSchema = createBaseSearchSchema({
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
