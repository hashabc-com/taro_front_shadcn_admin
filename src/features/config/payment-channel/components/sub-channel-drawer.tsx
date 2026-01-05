import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Trash2, Plus } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { useLanguage } from '@/context/language-provider'
import { getSubChannelList, addSubChannel, deleteSubChannel } from '@/api/config'
import { paymentSubChannelFormSchema, type PaymentSubChannel, type PaymentSubChannelFormData } from '../schema'
import { usePaymentChannel } from './payment-channel-provider'

export function SubChannelDrawer() {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const { open, setOpen, currentRow } = usePaymentChannel()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<PaymentSubChannel | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const isOpen = open === 'subChannel'

  const form = useForm({
    resolver: zodResolver(paymentSubChannelFormSchema),
    defaultValues: {
      subChannelCode: '',
      subChannelName: '',
      subChannelStatus: 1,
      type: 2,
    },
  })

  // 获取子渠道列表
  const { data: subChannels, isLoading } = useQuery({
    queryKey: ['sub-channels', currentRow?.channelCode],
    queryFn: () => getSubChannelList({ channelCode: currentRow!.channelCode }),
    enabled: isOpen && !!currentRow?.channelCode,
    select: (res) => res.result as PaymentSubChannel[] || [],
  })

  // 添加子渠道
  const addMutation = useMutation({
    mutationFn: (data: PaymentSubChannelFormData) => {
      return addSubChannel({
        channelCode: currentRow!.channelCode,
        country: currentRow!.country || undefined,
        ...data,
      })
    },
    onSuccess: (res) => {
      if (res.code == 200) {
        toast.success(t('common.addSuccess'))
        queryClient.invalidateQueries({ queryKey: ['sub-channels', currentRow?.channelCode] })
        form.reset()
        setShowAddDialog(false)
      } else {
        toast.error(res.message || t('common.addFailed'))
      }
    },
    onError: (error: unknown) => {
      toast.error((error as Error).message || t('common.operationFailed'))
    },
  })

  // 删除子渠道
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSubChannel({ id }),
    onSuccess: (res) => {
      if (res.code == 200) {
        toast.success(t('common.deleteSuccess'))
        queryClient.invalidateQueries({ queryKey: ['sub-channels', currentRow?.channelCode] })
        setShowDeleteDialog(false)
        setDeleteTarget(null)
      } else {
        toast.error(res.message || t('common.deleteFailed'))
      }
    },
    onError: (error: unknown) => {
      toast.error((error as Error).message || t('common.operationFailed'))
    },
  })

  const handleSubmit = form.handleSubmit((data: PaymentSubChannelFormData) => {
    addMutation.mutate(data)
  })

  const handleDelete = (subChannel: PaymentSubChannel) => {
    setDeleteTarget(subChannel)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id)
    }
  }

  // 当 drawer 关闭时重置表单
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setShowAddDialog(false)
        form.reset()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen, form])

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return t('config.paymentChannel.statusNormal')
      case 2:
        return t('config.paymentChannel.statusMaintenance')
      case 3:
        return t('config.paymentChannel.statusPaused')
      default:
        return '-'
    }
  }

  const getTypeLabel = (type: number) => {
    return type === 1 ? t('config.paymentChannel.payout') : t('config.paymentChannel.collection')
  }
  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && setOpen(null)}>
        <SheetContent className='sm:max-w-2xl overflow-y-auto'>
          <SheetHeader>
            <SheetTitle>{t('config.paymentChannel.subChannelManagement')}</SheetTitle>
            <SheetDescription>
              {currentRow?.channelName} ({currentRow?.channelCode})
            </SheetDescription>
          </SheetHeader>

          <div className='mt-6 space-y-4'>
            {/* 添加按钮 */}
            <Button
              type='button'
              onClick={() => setShowAddDialog(true)}
              className='w-full'
              variant='outline'
            >
              <Plus className='mr-2 h-4 w-4' />
              {t('config.paymentChannel.addSubChannel')}
            </Button>

            {/* 子渠道列表 */}
            <div className='border rounded-lg'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('config.paymentChannel.subChannelCode')}</TableHead>
                    <TableHead>{t('config.paymentChannel.subChannelName')}</TableHead>
                    <TableHead>{t('config.paymentChannel.subChannelType')}</TableHead>
                    <TableHead>{t('config.paymentChannel.status')}</TableHead>
                    <TableHead className='text-right'>{t('common.action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className='text-center'>
                        {t('common.loading')}
                      </TableCell>
                    </TableRow>
                  ) : !subChannels || subChannels.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className='text-center text-muted-foreground'>
                        {t('config.paymentChannel.noSubChannels')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    subChannels.map((subChannel) => (
                      <TableRow key={subChannel.id}>
                        <TableCell className='font-mono text-sm'>
                          {subChannel.subChannelCode}
                        </TableCell>
                        <TableCell>{subChannel.subChannelName}</TableCell>
                        <TableCell>{getTypeLabel(subChannel.type)}</TableCell>
                        <TableCell>{getStatusLabel(subChannel.subChannelStatus)}</TableCell>
                        <TableCell className='text-right'>
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDelete(subChannel)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className='h-4 w-4 text-destructive' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* 新增子渠道对话框 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('config.paymentChannel.addSubChannel')}</DialogTitle>
            <DialogDescription>
              {currentRow?.channelName} ({currentRow?.channelCode})
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <FormField
                control={form.control}
                name='subChannelCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('config.paymentChannel.subChannelCode')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('config.paymentChannel.subChannelCodePlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='subChannelName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('config.paymentChannel.subChannelName')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('config.paymentChannel.subChannelNamePlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('config.paymentChannel.subChannelType')}</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger clearable={false} className='w-[140px]'>
                          <SelectValue placeholder={t('common.pleaseSelect')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='1'>{t('config.paymentChannel.payout')}</SelectItem>
                        <SelectItem value='2'>{t('config.paymentChannel.collection')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='subChannelStatus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('config.paymentChannel.status')}</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger clearable={false} className='w-[140px]'>
                          <SelectValue placeholder={t('common.pleaseSelect')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='1'>{t('config.paymentChannel.statusNormal')}</SelectItem>
                        <SelectItem value='2'>{t('config.paymentChannel.statusMaintenance')}</SelectItem>
                        <SelectItem value='3'>{t('config.paymentChannel.statusPaused')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setShowAddDialog(false)
                    form.reset()
                  }}
                >
                  {t('common.cancel')}
                </Button>
                <Button type='submit' disabled={addMutation.isPending}>
                  {t('common.confirm')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('config.paymentChannel.deleteSubChannelConfirmation').replace('{name}', deleteTarget?.subChannelName || '')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {t('common.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
