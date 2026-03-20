import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { addConsumeRecord } from '@/api/message-record'

type AddMessageDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMessageDialog({ open, onOpenChange }: AddMessageDialogProps) {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [jsonMessage, setJsonMessage] = useState('')

  const mutation = useMutation({
    mutationFn: addConsumeRecord,
    onSuccess: (res) => {
      if (res.code == 200) {
        toast.success(t('logs.messageRecord.addSuccess'))
        queryClient.invalidateQueries({ queryKey: ['messageRecord'] })
        handleClose()
      }else{
        toast.error(res.message || t('logs.messageRecord.addFailed'))
      }
    },
  })

  const handleClose = () => {
    setJsonMessage('')
    onOpenChange(false)
  }

  const handleSubmit = () => {
    if (!jsonMessage.trim()) return
    mutation.mutate({ jsonMessage: jsonMessage.trim() })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{t('logs.messageRecord.addMessage')}</DialogTitle>
        </DialogHeader>
        <div className='space-y-2 overflow-hidden'>
          <Textarea
            className='min-h-[240px] w-full break-all font-mono text-sm'
            style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}
            placeholder={t('logs.messageRecord.messageBodyPlaceholder')}
            value={jsonMessage}
            onChange={(e) => setJsonMessage(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button
            type='button'
            onClick={handleSubmit}
            disabled={!jsonMessage.trim() || mutation.isPending}
          >
            {t('common.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
