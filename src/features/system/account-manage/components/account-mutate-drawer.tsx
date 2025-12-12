import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { type IAccountType, userTypes } from '../schema'
import { createAccount, updateAccount, getAccountById } from '@/api/account'
import { getAllRoles } from '@/api/role'
import { useLanguage } from '@/context/language-provider'

// 表单验证Schema
const accountFormSchema = z.object({
  userName: z.string().min(1, '请输入姓名'),
  account: z.string().min(1, '请输入账号'),
  password: z.string().optional(),
  mobile: z.string().optional(),
  roleIds: z.number().min(1, '请选择角色'),
  userType: z.number().min(1, '请选择类型'),
  disabledStatus: z.number(),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

type AccountMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: IAccountType | null
  isAdd: boolean
}

export function AccountMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  isAdd,
}: AccountMutateDrawerProps) {
  const queryClient = useQueryClient()
  const {t} = useLanguage()
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(
      isAdd
        ? accountFormSchema.extend({ password: z.string().min(1, '请输入密码') })
        : accountFormSchema
    ),
    defaultValues: {
      userName: '',
      account: '',
      password: '',
      mobile: '',
      roleIds: 2,
      userType: 4,
      disabledStatus: 0,
    },
  })

  // 获取角色列表
  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles,
  })

  const roleList = rolesData?.result?.map((item: { role: string; id: number }) => ({
    label: item.role,
    value: item.id,
  })) || []

  // 初始化表单数据
  useEffect(() => {
    if (open && currentRow && !isAdd) {
      const fetchData = async () => {
        const {result = {}} = await getAccountById({ id: currentRow.id! })
        if (result) {
          form.reset({
            userName: result.userName || '',
            account: result.account || '',
            mobile: result.mobile || '',
            roleIds: result.roleIds || 2,
            userType: result.userType || 4,
            disabledStatus: result.disabledStatus || 0,
          })
        }
      }
      fetchData()
    } else if (open && isAdd) {
      form.reset({
        userName: '',
        account: '',
        password: '',
        mobile: '',
        roleIds: 2,
        userType: 4,
        disabledStatus: 0,
      })
    }
  }, [open, currentRow, isAdd, form])

  const mutation = useMutation({
    mutationFn: (data: AccountFormValues) => {
      if (isAdd) {
        return createAccount(data as never)
      } else {
        return updateAccount({ ...data, id: currentRow!.id! } as never)
      }
    },
    onSuccess: (res) => {
      if(res.code == 200){
        queryClient.invalidateQueries({ queryKey: ['system','account-manage'] })
        toast.success(isAdd ? t('common.addSuccess') : t('common.updateSuccess'))
        handleClose()
      }else{
        toast.error(res.message || '操作失败')
      }
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || '操作失败')
    },
  })

  const onSubmit = (data: AccountFormValues) => {
    mutation.mutate(data)
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className='flex flex-col sm:max-w-[540px] overflow-y-auto'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isAdd ? t('system.accountManage.addAdministrator') : t('system.accountManage.editAdministrator')}</SheetTitle>
          <SheetDescription>
            {isAdd ? '创建新的管理员账户' : '修改管理员账户信息'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1 space-y-10 px-4'>
            <FormField
              control={form.control}
              name='userName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input placeholder='请输入姓名' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='account'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>账号</FormLabel>
                  <FormControl>
                    <Input placeholder='请输入账号' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isAdd && (
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='请输入密码' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name='mobile'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>手机号</FormLabel>
                  <FormControl>
                    <Input placeholder='请输入手机号' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='userType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>类型</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                      className='flex gap-4'
                    >
                      {Object.values(userTypes).map((type) => (
                        <div key={type.value} className='flex items-center space-x-2'>
                          <RadioGroupItem value={type.value.toString()} id={`type-${type.value}`} />
                          <label htmlFor={`type-${type.value}`} className='cursor-pointer'>
                            {type.label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='roleIds'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>角色</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                      className='flex gap-4'
                    >
                      {roleList.map((role: { label: string; value: number }) => (
                        <div key={role.value} className='flex items-center space-x-2'>
                          <RadioGroupItem value={role.value.toString()} id={`role-${role.value}`} />
                          <label htmlFor={`role-${role.value}`} className='cursor-pointer'>
                            {role.label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='disabledStatus'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>账号状态</FormLabel>
                    <div className='text-muted-foreground text-sm'>
                      {field.value === 0 ? '启用' : '禁用'}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === 0}
                      onCheckedChange={(checked) => field.onChange(checked ? 0 : 1)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <SheetFooter className='pt-4'>
            <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? '提交中...' : '确定'}
              </Button>
              <SheetClose asChild>
                <Button type='button' variant='outline'>
                  取消
                </Button>
              </SheetClose>
              
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
