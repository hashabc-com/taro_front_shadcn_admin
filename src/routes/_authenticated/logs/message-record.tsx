import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { MessageRecordPage } from '@/features/logs/message-record'
import { createBaseSearchSchema } from '@/lib/table-schemas'

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
