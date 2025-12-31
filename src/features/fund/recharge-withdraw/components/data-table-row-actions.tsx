import { useState, useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { getRouteApi } from '@tanstack/react-router'
import { type Row } from '@tanstack/react-table'
import { useCountryStore } from '@/stores'
import { CheckCircle, XCircle, Download } from 'lucide-react'
import { toast } from 'sonner'
import { downloadImg } from '@/api/common'
import { approveWithdrawal, approveRecharge } from '@/api/fund'
import { useLanguage } from '@/context/language-provider'
import { useConvertAmount } from '@/hooks/use-convert-amount'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Textarea } from '@/components/ui/textarea'
import { rechargeWithdrawSchema } from '../schema'

const route = getRouteApi('/_authenticated/fund/recharge-withdraw')

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const data = rechargeWithdrawSchema.parse(row.original)
  const { t } = useLanguage()
  const navigate = route.useNavigate()
  const convertAmount = useConvertAmount()
  const { selectedCountry } = useCountryStore()
  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [calculatedAmount, setCalculatedAmount] = useState<string>('')

  const approveFormSchema = z.object({
    withdrawalPass: z
      .string()
      .min(1, t('fund.rechargeWithdraw.pleaseEnterWithdrawPassword')),
    gauthcode: z
      .string()
      .min(1, t('fund.rechargeWithdraw.pleaseEnterGoogleAuthCode')),
    remark: z.string().optional(),
    exchangeRate: z
      .string()
      .min(1, t('fund.rechargeWithdraw.pleaseEnterExchangeRate'))
      .regex(
        /^\d*\.?\d+$/,
        t('fund.rechargeWithdraw.exchangeRateMustBeValidNumber')
      ),
    costRate: z
      .string()
      .min(1, t('fund.rechargeWithdraw.pleaseEnterExchangeRate'))
      .regex(
        /^\d*\.?\d+$/,
        t('fund.rechargeWithdraw.exchangeRateMustBeValidNumber')
      ),
  })

  const rejectFormSchema = z.object({
    remark: z
      .string()
      .min(1, t('fund.rechargeWithdraw.pleaseEnterRejectReason')),
  })

  const approveForm = useForm<z.infer<typeof approveFormSchema>>({
    resolver: zodResolver(approveFormSchema),
    defaultValues: {
      withdrawalPass: '',
      gauthcode: '',
      remark: '',
      exchangeRate: String(data.exchangeRate || ''),
      costRate: String(data.costRate || ''),
    },
  })

  const rejectForm = useForm<z.infer<typeof rejectFormSchema>>({
    resolver: zodResolver(rejectFormSchema),
    defaultValues: {
      remark: '',
    },
  })

  // 监听汇率变化，计算实际金额
  useEffect(() => {
    const subscription = approveForm.watch((value, { name }) => {
      if (name === 'exchangeRate') {
        const rate = parseFloat(value.exchangeRate || '0')
        const amount = +data.rechargeAmount.replace(/,/g, '')
        if (!isNaN(rate) && !isNaN(amount)) {
          setCalculatedAmount( data.type == '充值' ? String(amount * rate) : String(amount / rate))
        } else {
          setCalculatedAmount('')
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [approveForm, data, data.rechargeAmount])

  // 初始化计算
  //   useEffect(() => {
  //     if (data.exchangeRate && data.rechargeAmount) {
  //       const rate = parseFloat(String(data.exchangeRate))
  //       const amount = parseFloat(String(data.rechargeAmount))
  //       if (!isNaN(rate) && !isNaN(amount)) {
  //         console.log('Calculating amount222222222:', amount, rate)
  //         setCalculatedAmount((amount * rate).toFixed(2))
  //       }
  //     }
  //   }, [data.exchangeRate, data.rechargeAmount])

  const handleDownload = async () => {
    if (!data.mediaId) return

    try {
      const urlObj = new URL(data.mediaId)
      const mediaId = urlObj.searchParams.get('mediaId')
      if (mediaId) {
        await downloadImg(
          { mediaId, type: true },
          `${data.companyName}-${data.type}-${data.createTime}`
        )
        toast.success(t('export.downloadSuccess'))
      }
    } catch (error) {
      console.error('Download failed:', error)
      toast.error(t('export.downloadFailed'))
    }
  }

  const handleApprove = async (values: z.infer<typeof approveFormSchema>) => {
    setLoading(true)
    try {
      const payload = {
        merchantId: data.merchantId,
        id: data.id,
        exchangeRate: values.exchangeRate,
        costRate: values.costRate,
        rechargeAmount: +data.rechargeAmount.replace(/,/g, ''),
        finalAmount: calculatedAmount,
        withdrawalType: data.withdrawalType || '',
        type: data.type,
        status: 1,
        country: data.country,
        withdrawalPass: values.withdrawalPass,
        gauthcode: values.gauthcode,
        remark: values.remark,
      }

      const res =
        data.type === '充值'
          ? await approveRecharge(payload)
          : await approveWithdrawal(payload)

      if (res.code == 200) {
        toast.success('审批成功')
        setApproveOpen(false)
        approveForm.reset()
        navigate({
          search: (prev) => ({
            ...prev,
            refresh: Date.now(),
          }),
        })
      } else {
        toast.error(res.message || '审批失败')
      }
    } catch (error) {
      console.error('Approve failed:', error)
      toast.error('审批失败')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (values: z.infer<typeof rejectFormSchema>) => {
    setLoading(true)
    try {
      const payload = {
        merchantId: data.merchantId,
        id: data.id,
        type: data.type,
        status: 0,
        remark: values.remark,
        withdrawalType: data.withdrawalType || '',
        rechargeAmount: +data.rechargeAmount.replace(/,/g, ''),
      }

      const res =
        data.type === '充值'
          ? await approveRecharge(payload)
          : await approveWithdrawal(payload)

      if (res.code == 200) {
        toast.success('已拒绝')
        setRejectOpen(false)
        rejectForm.reset()
        navigate({
          search: (prev) => ({
            ...prev,
            refresh: Date.now(),
          }),
        })
      } else {
        toast.error(res.message || '操作失败')
      }
    } catch (error) {
      console.error('Reject failed:', error)
      toast.error('操作失败')
    } finally {
      setLoading(false)
    }
  }

  const isReviewing = data.processStatus === 2
  if (!isReviewing) return null
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>打开菜单</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem onClick={() => setApproveOpen(true)}>
            <CheckCircle className='mr-2 h-4 w-4 text-green-600' />
            {t('common.confirm')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRejectOpen(true)}>
            <XCircle className='mr-2 h-4 w-4 text-red-600' />
            {t('common.reject')}
          </DropdownMenuItem>
          {data.mediaId && (
            <>
              {isReviewing && <DropdownMenuSeparator />}
              <DropdownMenuItem onClick={handleDownload}>
                <Download className='mr-2 h-4 w-4 text-blue-600' />
                {t('fund.rechargeWithdraw.downloadVoucher')}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Approve Dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {data.type == '充值'
                ? t('fund.rechargeWithdraw.recharge')
                : t('fund.rechargeWithdraw.withdrawal')}
            </DialogTitle>
            <DialogDescription>
              {t('fund.rechargeWithdraw.approveDescription')}
            </DialogDescription>
          </DialogHeader>
          <Form {...approveForm}>
            <form
              onSubmit={approveForm.handleSubmit(handleApprove)}
              className='space-y-4'
              autoComplete='off'
            >
              <div className='grid gap-2'>
                <FormLabel>
                  {data.type == '充值'
                    ? t('fund.rechargeWithdraw.topUpAmount')
                    : t('fund.rechargeWithdraw.withdrawalAmount')}
                </FormLabel>
                <InputGroup>
                  <InputGroupInput value={data.rechargeAmount} disabled />
                  <InputGroupAddon align='inline-end'>
                    {data.type == '充值'
                      ? data?.currencyType || ''
                      : data.withdrawalType}
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <FormField
                control={approveForm.control}
                name='exchangeRate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('fund.rechargeWithdraw.exchangeRate')}{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='text'
                        autoComplete='no-autofill-exchange-rate'
                        inputMode='decimal'
                        placeholder={t('common.enterExchangeRate')}
                        onKeyPress={(e) => {
                          const char = e.key
                          const value = e.currentTarget.value
                          // 只允许数字和一个小数点
                          if (!/[0-9.]/.test(char)) {
                            e.preventDefault()
                          }
                          // 只允许一个小数点
                          if (char === '.' && value.includes('.')) {
                            e.preventDefault()
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={approveForm.control}
                name='costRate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('fund.rechargeWithdraw.costExchangeRate')}{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='text'
                        autoComplete='no-autofill-exchange-rate'
                        inputMode='decimal'
                        placeholder={t('common.enterExchangeRate')}
                        onKeyPress={(e) => {
                          const char = e.key
                          const value = e.currentTarget.value
                          // 只允许数字和一个小数点
                          if (!/[0-9.]/.test(char)) {
                            e.preventDefault()
                          }
                          // 只允许一个小数点
                          if (char === '.' && value.includes('.')) {
                            e.preventDefault()
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid gap-2'>
                <FormLabel>{t('fund.rechargeWithdraw.actualAmount')}</FormLabel>
                <div className='relative'>
                  <Input
                    value={convertAmount(calculatedAmount, false)}
                    disabled
                  />
                  <span className='text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm'>
                    {data.type == '充值' ? selectedCountry?.currency : 'USTD'}
                  </span>
                </div>
              </div>
              <FormField
                control={approveForm.control}
                name='withdrawalPass'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('fund.accountSettlement.withdrawPassword')}{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='password'
                        autoComplete='new-password'
                        placeholder={t('common.enterWithdrawPassword')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={approveForm.control}
                name='gauthcode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('fund.rechargeWithdraw.googleAuthCode')}{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete='one-time-code'
                        placeholder={t('common.enterGoogleAuthCode')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={approveForm.control}
                name='remark'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('fund.rechargeWithdraw.remark')}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t('common.enterRemark')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setApproveOpen(false)
                    approveForm.reset()
                  }}
                >
                  {t('common.cancel')}
                </Button>
                <Button type='submit' disabled={loading}>
                  {loading
                    ? t('fund.rechargeWithdraw.pending')
                    : t('common.confirm')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>{t('common.reject')}</DialogTitle>
            <DialogDescription>
              {t('fund.rechargeWithdraw.pleaseEnterRejectReason')}
            </DialogDescription>
          </DialogHeader>
          <Form {...rejectForm}>
            <form
              onSubmit={rejectForm.handleSubmit(handleReject)}
              className='space-y-4'
            >
              <FormField
                control={rejectForm.control}
                name='remark'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('fund.rechargeWithdraw.rejectReason')}{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t(
                          'fund.rechargeWithdraw.pleaseEnterRejectReason'
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setRejectOpen(false)
                    rejectForm.reset()
                  }}
                >
                  {t('common.cancel')}
                </Button>
                <Button type='submit' variant='destructive' disabled={loading}>
                  {loading
                    ? t('fund.rechargeWithdraw.pending')
                    : t('common.confirm')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
