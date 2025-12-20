import { createFileRoute } from '@tanstack/react-router'
import SendAnnouncement from '@/features/send-announcement'

export const Route = createFileRoute('/_authenticated/send-announcement')({
  component: SendAnnouncement,
})
