import { useState, useMemo, useEffect } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  Phone, 
  Mail, 
  Building2, 
  User, 
  MessageSquare, 
  Plus,
  Calendar,
  CheckCircle2
} from 'lucide-react'
import { getFollowRecordList, addFollowRecord } from '@/api/business'
import { useLanguage } from '@/context/language-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
  type ICustomerConsult,
  type IFollowRecord,
  type FollowUpFormData,
} from '../schema'

interface FollowUpSheetProps {
  customer: ICustomerConsult | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FollowUpSheet({
  customer,
  open,
  onOpenChange,
}: FollowUpSheetProps) {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [showAddForm, setShowAddForm] = useState(false)

  // 动态创建 schema 以支持国际化错误消息
  const followUpFormSchema = useMemo(
    () =>
      z.object({
        followType: z.string().min(1, {
          message: t('business.customerConsult.pleaseSelectFollowType'),
        }),
        followContent: z.string().min(1, {
          message: t('business.customerConsult.pleaseEnterFollowContent'),
        }),
        followResult: z.string().min(1, {
          message: t('business.customerConsult.pleaseSelectFollowResult'),
        }),
        remark: z.string().optional(),
      }),
    [t]
  )

  const form = useForm<FollowUpFormData>({
    resolver: zodResolver(followUpFormSchema),
    defaultValues: {
      followType: '',
      followContent: '',
      followResult: '',
      remark: '',
    },
  })

  // 获取跟进记录列表
  const { data: followRecords, isLoading } = useQuery({
    queryKey: ['follow-records', customer?.id],
    queryFn: () => getFollowRecordList(customer!.id),
    enabled: !!customer?.id,
    select: (res) => res.result ?? [],
  })

  const mutation = useMutation({
    mutationFn: (data: FollowUpFormData) =>
      addFollowRecord({
        customerId: customer!.id,
        ...data,
      }),
    onSuccess: (res) => {
      if (res.code == 200) {
        toast.success(t('common.createSuccess'))
        queryClient.invalidateQueries({
          queryKey: ['follow-records', customer?.id],
        })
        queryClient.invalidateQueries({ queryKey: ['customer-consult-list'] })
        setShowAddForm(false)
        form.reset()
      }
    },
    onError: () => {
      toast.error(t('common.createFailed'))
    },
  })

  // 监听 Sheet 关闭，重置表单
  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowAddForm(false)
      form.reset()
    }
  }, [open, form])

  const onSubmit = (data: FollowUpFormData) => {
    mutation.mutate(data)
  }

  // 获取跟进类型图标
  const getFollowTypeIcon = (type: string) => {
    switch (type) {
      case 'PHONE':
        return <Phone className='h-3.5 w-3.5' />
      case 'EMAIL':
        return <Mail className='h-3.5 w-3.5' />
      case 'VISIT':
        return <Building2 className='h-3.5 w-3.5' />
      case 'WECHAT':
        return <MessageSquare className='h-3.5 w-3.5' />
      default:
        return <MessageSquare className='h-3.5 w-3.5' />
    }
  }

  // 获取跟进结果颜色
  const getFollowResultVariant = (result: string) => {
    switch (result) {
      case 'SUCCESS':
        return 'default'
      case 'INTERESTED':
        return 'secondary'
      case 'CONSIDERING':
        return 'outline'
      case 'REFUSED':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  if (!customer) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col sm:max-w-2xl'>
        <SheetHeader className='space-y-3'>
          <SheetTitle className='text-xl'>
            {t('business.customerConsult.followUpRecords')}
          </SheetTitle>
          
          {/* Customer Info Card */}
          <Card className='border-primary/20 bg-primary/5'>
            <CardContent className='grid gap-3 p-4'>
              <div className='grid grid-cols-2 gap-3'>
                <div className='flex items-center gap-2'>
                  <User className='text-muted-foreground h-4 w-4 shrink-0' />
                  <div className='min-w-0 flex-1'>
                    <p className='text-muted-foreground text-xs'>
                      {t('business.customerConsult.contactPerson')}
                    </p>
                    <p className='truncate font-medium' title={customer.contactPerson ?? undefined}>
                      {customer.contactPerson || '-'}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Phone className='text-muted-foreground h-4 w-4 shrink-0' />
                  <div className='min-w-0 flex-1'>
                    <p className='text-muted-foreground text-xs'>
                      {t('business.customerConsult.phone')}
                    </p>
                    <p className='truncate font-medium'>
                      {customer.phone
                        ? `+${customer.countryCode} ${customer.phone}`
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className='grid grid-cols-2 gap-3'>
                <div className='flex items-center gap-2'>
                  <Building2 className='text-muted-foreground h-4 w-4 shrink-0' />
                  <div className='min-w-0 flex-1'>
                    <p className='text-muted-foreground text-xs'>
                      {t('business.customerConsult.company')}
                    </p>
                    <p className='truncate font-medium' title={customer.company ?? undefined}>
                      {customer.company || '-'}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Mail className='text-muted-foreground h-4 w-4 shrink-0' />
                  <div className='min-w-0 flex-1'>
                    <p className='text-muted-foreground text-xs'>
                      {t('business.customerConsult.email')}
                    </p>
                    <p className='truncate font-medium' title={customer.email ?? undefined}>
                      {customer.email || '-'}
                    </p>
                  </div>
                </div>
              </div>

              {customer.consultContent && (
                <div className='flex gap-2 pt-1'>
                  <MessageSquare className='text-muted-foreground mt-0.5 h-4 w-4 shrink-0' />
                  <div className='min-w-0 flex-1'>
                    <p className='text-muted-foreground text-xs'>
                      {t('business.customerConsult.consultContent')}
                    </p>
                    <p className='line-clamp-2 text-sm' title={customer.consultContent ?? undefined}>
                      {customer.consultContent}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </SheetHeader>

        <div className='flex flex-1 flex-col gap-4 overflow-hidden px-6 pt-4'>
          {/* Add Button */}
          <Button 
            onClick={() => setShowAddForm(true)} 
            className='w-full'
            size='lg'
          >
            <Plus className='mr-2 h-4 w-4' />
            {t('business.customerConsult.addFollowUp')}
          </Button>

          {/* Add Follow Dialog */}
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogContent className='sm:max-w-[600px]'>
              <DialogHeader>
                <DialogTitle>{t('business.customerConsult.addFollowUp')}</DialogTitle>
              </DialogHeader>
              <div className='max-h-[70vh] overflow-y-auto'>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4'
                  >
                    <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='followType'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('business.customerConsult.followType')} *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger clearable={false}>
                                <SelectValue
                                  placeholder={t(
                                    'business.customerConsult.pleaseSelectFollowType'
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='PHONE'>
                                {t(
                                  'business.customerConsult.followTypeValues.PHONE'
                                )}
                              </SelectItem>
                              <SelectItem value='VISIT'>
                                {t(
                                  'business.customerConsult.followTypeValues.VISIT'
                                )}
                              </SelectItem>
                              <SelectItem value='EMAIL'>
                                {t(
                                  'business.customerConsult.followTypeValues.EMAIL'
                                )}
                              </SelectItem>
                              <SelectItem value='WECHAT'>
                                {t(
                                  'business.customerConsult.followTypeValues.WECHAT'
                                )}
                              </SelectItem>
                              <SelectItem value='OTHER'>
                                {t(
                                  'business.customerConsult.followTypeValues.OTHER'
                                )}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='followResult'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('business.customerConsult.followResult')} *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger clearable={false}>
                                <SelectValue
                                  placeholder={t(
                                    'business.customerConsult.pleaseSelectFollowResult'
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='INTERESTED'>
                                {t(
                                  'business.customerConsult.followResultValues.INTERESTED'
                                )}
                              </SelectItem>
                              <SelectItem value='CONSIDERING'>
                                {t(
                                  'business.customerConsult.followResultValues.CONSIDERING'
                                )}
                              </SelectItem>
                              <SelectItem value='REFUSED'>
                                {t(
                                  'business.customerConsult.followResultValues.REFUSED'
                                )}
                              </SelectItem>
                              <SelectItem value='SUCCESS'>
                                {t(
                                  'business.customerConsult.followResultValues.SUCCESS'
                                )}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='followContent'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('business.customerConsult.followContent')} *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t(
                              'business.customerConsult.pleaseEnterFollowContent'
                            )}
                            className='min-h-[100px]'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='remark'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.remark')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('common.pleaseEnterRemark')}
                            className='min-h-[60px]'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='flex justify-end gap-2 pt-4'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        setShowAddForm(false)
                        form.reset()
                      }}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button type='submit' disabled={mutation.isPending}>
                      {mutation.isPending
                        ? t('common.submitting')
                        : t('common.submit')}
                    </Button>
                  </div>
                </form>
              </Form>
              </div>
            </DialogContent>
          </Dialog>

          {/* Follow Records List */}
          <div className='flex min-h-0 flex-1 flex-col'>
            <div className='mb-3 flex items-center justify-between'>
            <h3 className='font-semibold'>
              {t('business.customerConsult.historyRecords')}
            </h3>
            {followRecords && followRecords.length > 0 && (
              <span className='text-muted-foreground text-sm'>
                {followRecords.length} {t('common.records')}
              </span>
            )}
          </div>
          <ScrollArea className='h-0 flex-1 pr-4 pb-5'>
            {isLoading ? (
              <div className='space-y-3'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className='h-32 w-full' />
                ))}
              </div>
            ) : followRecords && followRecords.length > 0 ? (
              <div className='space-y-3'>
                  {followRecords.map((record: IFollowRecord) => (
                    <Card key={record.id} className='hover:border-primary/50 transition-colors'>
                      <CardContent>
                        {/* Header */}
                        <div className='mb-3 flex items-start justify-between gap-3'>
                          <div className='flex flex-wrap gap-2'>
                            <Badge variant='outline' className='gap-1'>
                              {getFollowTypeIcon(record.followType)}
                              {t(
                                `business.customerConsult.followTypeValues.${record.followType}`
                              )}
                            </Badge>
                            <Badge variant={getFollowResultVariant(record.followResult)} className='gap-1'>
                              {record.followResult === 'SUCCESS' && (
                                <CheckCircle2 className='h-3 w-3' />
                              )}
                              {t(
                                `business.customerConsult.followResultValues.${record.followResult}`
                              )}
                            </Badge>
                          </div>
                          <div className='text-muted-foreground flex items-center gap-1.5 text-xs whitespace-nowrap'>
                            <Calendar className='h-3 w-3' />
                            {record.followAt
                              ? format(
                                  new Date(record.followAt),
                                  'yyyy-MM-dd HH:mm'
                                )
                              : '-'}
                          </div>
                        </div>

                        {/* Content */}
                        <div className='space-y-2'>
                          <div>
                            <p className='text-muted-foreground mb-1 text-xs'>
                              {t('business.customerConsult.followContent')}
                            </p>
                            <p className='whitespace-pre-wrap text-sm leading-relaxed'>
                              {record.followContent}
                            </p>
                          </div>

                          {record.remark && (
                            <div className='bg-muted/50 rounded p-2'>
                              <p className='text-muted-foreground mb-1 text-xs'>
                                {t('common.remark')}
                              </p>
                              <p className='text-muted-foreground whitespace-pre-wrap text-sm'>
                                {record.remark}
                              </p>
                            </div>
                          )}

                          {record.followBy && (
                            <div className='text-muted-foreground flex items-center gap-1.5 pt-1 text-xs'>
                              <User className='h-3 w-3' />
                              <span>{t('business.customerConsult.followBy')}:</span>
                              <span className='font-medium'>{record.followBy}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            ) : (
              <div className='text-muted-foreground flex h-32 items-center justify-center text-sm'>
                <div className='text-center'>
                  <MessageSquare className='text-muted-foreground/50 mx-auto mb-2 h-8 w-8' />
                  <p>{t('common.noData')}</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </SheetContent>
    </Sheet>
  )
}
