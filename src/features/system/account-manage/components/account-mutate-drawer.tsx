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
import { useI18n } from '@/hooks/use-i18n'

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
  const { t: ti18n } = useI18n()
  
  // 动态创建验证 schema
  const accountFormSchema = z.object({
    userName: z.string().min(1, ti18n('system.accountManage.validation.nameRequired')),
    account: z.string().min(1, ti18n('system.accountManage.validation.accountRequired')),
    password: z.string().optional(),
    mobile: z.string().optional(),
    roleIds: z.number().or(z.string()),
    userType: z.number().min(1, ti18n('system.accountManage.validation.typeRequired')),
    disabledStatus: z.number(),
  })
  
  type AccountFormValues = z.infer<typeof accountFormSchema>
  
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(
      isAdd
        ? accountFormSchema.extend({ password: z.string().min(1, ti18n('system.accountManage.validation.passwordRequired')) })
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
        toast.error(res.message || ti18n('common.operationFailed'))
      }
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || ti18n('common.operationFailed'))
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
            {isAdd ? ti18n('system.accountManage.createDescription') : ti18n('system.accountManage.editDescription')}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1 space-y-10 px-4'>
            <FormField
              control={form.control}
              name='userName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ti18n('system.accountManage.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={ti18n('system.accountManage.placeholder.name')} {...field} />
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
                  <FormLabel>{ti18n('common.account')}</FormLabel>
                  <FormControl>
                    <Input placeholder={ti18n('system.accountManage.placeholder.account')} {...field} />
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
                    <FormLabel>{ti18n('common.password')}</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder={ti18n('system.accountManage.placeholder.password')} {...field} />
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
                  <FormLabel>{ti18n('common.phone')}</FormLabel>
                  <FormControl>
                    <Input placeholder={ti18n('system.accountManage.placeholder.phone')} {...field} />
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
                  <FormLabel>{ti18n('common.type')}</FormLabel>
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
                            {ti18n(type.key)}
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
                  <FormLabel>{ti18n('common.role')}</FormLabel>
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
                    <FormLabel className='text-base'>{ti18n('system.accountManage.accountStatus')}</FormLabel>
                    <div className='text-muted-foreground text-sm'>
                      {field.value === 0 ? ti18n('common.enabled') : ti18n('common.disabled')}
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
                {mutation.isPending ? ti18n('common.submitting') : ti18n('common.confirm')}
              </Button>
              <SheetClose asChild>
                <Button type='button' variant='outline'>
                  {ti18n('common.cancel')}
                </Button>
              </SheetClose>
              
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
