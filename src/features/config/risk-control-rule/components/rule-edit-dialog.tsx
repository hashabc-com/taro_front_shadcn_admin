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

// 表单验证Schema
const ruleFormSchema = z.object({
  ruleName: z.string().min(1, '请输入规则名称'),
  ruleDesc: z.string().optional(),
  sceneCode: z.string().min(1, '请选择规则场景'),
  conditionExpr: z.string().min(1, '请输入条件表达式'),
  actionCode: z.string().min(1, '请选择动作标识'),
  priority: z.number().min(1, '优先级必须大于0').max(10, '优先级不能超过10'),
  status: z.number(),
  actionParams: z.string().optional(),
})

type RuleFormValues = z.infer<typeof ruleFormSchema>

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
          throw new Error('动作参数必须是有效的JSON格式')
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
        toast.success(isAdd ? '创建成功' : '更新成功')
      }else{
        toast.error(res.message || '操作失败')
      }
      handleClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || '操作失败')
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
          <DialogTitle>{isAdd ? '新增规则' : '编辑规则'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='ruleName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>规则名称</FormLabel>
                  <FormControl>
                    <Input placeholder='请输入规则名称' {...field} />
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
                  <FormLabel>规则描述</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='请输入规则描述'
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
                  <FormLabel>规则场景</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='请选择规则场景' />
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
                  <FormLabel>条件表达式</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='例如: amount > 50000'
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
                  <FormLabel>动作标识</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='请选择动作标识' />
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
                  <FormLabel>优先级</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={1}
                      max={10}
                      placeholder='1-10，数值越小优先级越高'
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
                  <FormLabel>状态</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value.toString()}
                      className='flex space-x-4'
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='1' id='status-enabled' />
                        <Label htmlFor='status-enabled'>启用</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='0' id='status-disabled' />
                        <Label htmlFor='status-disabled'>禁用</Label>
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
                  <FormLabel>动作参数</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='JSON格式，例如: {"blockReason":"异地大额支付风险"}'
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
                取消
              </Button>
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? '提交中...' : '确定'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
