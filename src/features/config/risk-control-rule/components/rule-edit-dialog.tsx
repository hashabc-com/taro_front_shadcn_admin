import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { type RuleConfig, sceneCodeMap, actionCodeMap } from '../schema'
import { createRuleConfig, updateRuleConfig } from '@/api/ruleConfig'
import { useLanguage } from '@/context/language-provider'

// 表单验证Schema - 使用工厂函数支持国际化
const createRuleFormSchema = (t: (key: string) => string) => z.object({
  ruleName: z.string().min(1, t('config.riskControlRule.validation.ruleNameRequired')),
  ruleDesc: z.string().optional(),
  sceneCode: z.string().min(1, t('config.riskControlRule.validation.sceneCodeRequired')),
  conditionExpr: z.string().min(1, t('config.riskControlRule.validation.conditionExprRequired')),
  actionCode: z.string().min(1, t('config.riskControlRule.validation.actionCodeRequired')),
  priority: z.number().min(1, t('config.riskControlRule.validation.priorityMin')).max(10, t('config.riskControlRule.validation.priorityMax')),
  status: z.number(),
  actionParams: z.string().optional(),
})

type RuleFormValues = z.infer<ReturnType<typeof createRuleFormSchema>>

type RuleEditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule: RuleConfig | null
  isAdd: boolean
}

export function RuleEditDialog({
  open,
  onOpenChange,
  rule,
  isAdd,
}: RuleEditDialogProps) {
  const queryClient = useQueryClient()
  const { t } = useLanguage()
  
  const ruleFormSchema = createRuleFormSchema(t)

  const form = useForm<RuleFormValues>({
    resolver: zodResolver(ruleFormSchema),
    defaultValues: {
      ruleName: '',
      ruleDesc: '',
      sceneCode: '',
      conditionExpr: '',
      actionCode: '',
      priority: 5,
      status: 1,
      actionParams: '',
    },
  })

  // 初始化表单数据
  useEffect(() => {
    if (open && rule && !isAdd) {
      form.reset({
        ruleName: rule.ruleName,
        ruleDesc: rule.ruleDesc || '',
        sceneCode: rule.sceneCode,
        conditionExpr: rule.conditionExpr,
        actionCode: rule.actionCode,
        priority: rule.priority,
        status: rule.status,
        actionParams: rule.actionParams || '',
      })
    } else if (open && isAdd) {
      form.reset({
        ruleName: '',
        ruleDesc: '',
        sceneCode: '',
        conditionExpr: '',
        actionCode: '',
        priority: 5,
        status: 1,
        actionParams: '',
      })
    }
  }, [open, rule, isAdd, form])

  const mutation = useMutation({
    mutationFn: (data: RuleFormValues) => {
      // 验证 actionParams 是否为有效的 JSON
      if (data.actionParams && data.actionParams.trim()) {
        try {
          JSON.parse(data.actionParams)
        } catch (_e) {
          throw new Error(t('config.riskControlRule.actionParamsInvalidJson'))
        }
      }

      const payload = {
        ...data,
        ...(isAdd ? {} : { id: rule!.id }),
      }

      return isAdd
        ? createRuleConfig(payload as never)
        : updateRuleConfig(payload as never)
    },
    onSuccess: (res) => {
      if(res.code == 200){
        queryClient.invalidateQueries({ queryKey: ['ruleConfigs'] })
        toast.success(isAdd ? t('common.addSuccess') : t('common.updateSuccess'))
      }else{
        toast.error(res.message || t('common.operationFailed'))
      }
      handleClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || t('common.operationFailed'))
    },
  })

  const onSubmit = (data: RuleFormValues) => {
    mutation.mutate(data)
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>{isAdd ? t('config.riskControlRule.addRule') : t('config.riskControlRule.editRule')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='ruleName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('config.riskControlRule.ruleName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('common.enterRuleName')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='ruleDesc'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('config.riskControlRule.ruleDescription')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('common.enterRuleDescription')}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='sceneCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('config.riskControlRule.ruleScene')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common.selectRuleScene')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(sceneCodeMap).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='conditionExpr'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('config.riskControlRule.conditionExpression')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('config.riskControlRule.conditionExprExample')}
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='actionCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('config.riskControlRule.actionCode')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common.selectActionCode')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(actionCodeMap).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='priority'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('config.riskControlRule.priority')}</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={1}
                      max={10}
                      placeholder={t('config.riskControlRule.priorityPlaceholder')}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>{t('common.status')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value.toString()}
                      className='flex space-x-4'
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='1' id='status-enabled' />
                        <Label htmlFor='status-enabled'>{t('common.enabled')}</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='0' id='status-disabled' />
                        <Label htmlFor='status-disabled'>{t('common.disabled')}</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='actionParams'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('config.riskControlRule.actionParams')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('config.riskControlRule.actionParamsPlaceholder')}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose}>
                {t('common.cancel')}
              </Button>
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? t('common.submitting') : t('common.confirm')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
