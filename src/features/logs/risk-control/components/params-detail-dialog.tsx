import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ParamsDetailDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: string
}

export function ParamsDetailDialog({
  open,
  onOpenChange,
  content,
}: ParamsDetailDialogProps) {
  const formatJson = (jsonStr: string) => {
    if (!jsonStr) return '-'
    try {
      const obj = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr
      return JSON.stringify(obj, null, 2)
    } catch {
      return jsonStr
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[80vh] max-w-[800px]'>
        <DialogHeader>
          <DialogTitle>请求参数详情</DialogTitle>
        </DialogHeader>
        <pre className='bg-muted max-h-[600px] overflow-auto rounded-md p-4 text-xs leading-6'>
          {formatJson(content)}
        </pre>
      </DialogContent>
    </Dialog>
  )
}
