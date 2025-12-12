import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updatePassword, deleteAccount } from '@/api/account'
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
import { Button } from '@/components/ui/button'
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
import { AccountMutateDrawer } from './account-mutate-drawer'
import { useAccount } from './account-provider'

// 密码表单验证
const passwordFormSchema = z
  .object({
    pwd: z.string().min(1, '请输入密码'),
    rePwd: z.string().min(1, '请再次输入密码'),
  })
  .refine((data) => data.pwd === data.rePwd, {
    message: '两次输入的密码不一致',
    path: ['rePwd'],
  })

type PasswordFormValues = z.infer<typeof passwordFormSchema>

export function AccountDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useAccount()
  const queryClient = useQueryClient()

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      pwd: '',
      rePwd: '',
    },
  })

  const passwordMutation = useMutation({
    mutationFn: (data: PasswordFormValues) =>
      updatePassword({
        id: currentRow!.id!,
        pwd: data.pwd,
        rePwd: data.rePwd,
      }),
    onSuccess: (res) => {
      if (res.code == 200) {
        toast.success('密码修改成功')
        queryClient.invalidateQueries({
          queryKey: ['system', 'account-manage'],
        })
      } else {
        toast.error(res.message || '密码修改失败')
      }
      handlePasswordClose()
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || '密码修改失败')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteAccount({ id: currentRow!.id! }),
    onSuccess: (res) => {
      if (res.code == 200) {
        queryClient.invalidateQueries({
          queryKey: ['system', 'account-manage'],
        })
        toast.success('删除成功')
      } else {
        toast.error(res.message || '删除失败')
      }
      setOpen(null)
      setTimeout(() => {
        setCurrentRow(null)
      }, 500)
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || '删除失败')
    },
  })

  const handlePasswordClose = () => {
    form.reset()
    setOpen(null)
    setTimeout(() => {
      setCurrentRow(null)
    }, 500)
  }

  const onPasswordSubmit = (data: PasswordFormValues) => {
    passwordMutation.mutate(data)
  }

  return (
    <>
      {/* {currentRow && (
        <> */}
      {/* 添加/编辑抽屉 */}
      <AccountMutateDrawer
        key={`account-mutate-${currentRow?.id}`}
        open={open === 'create' || open === 'update'}
        onOpenChange={() => {
          setOpen(null)
          setTimeout(() => {
            setCurrentRow(null)
          }, 500)
        }}
        currentRow={currentRow}
        isAdd={open === 'create'}
      />

      {/* 修改密码对话框 */}
      <Dialog open={open === 'password'} onOpenChange={handlePasswordClose}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>修改密码</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onPasswordSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='pwd'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>新密码</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='请输入新密码'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='rePwd'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>确认密码</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='请再次输入密码'
                        {...field}
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
                  onClick={handlePasswordClose}
                >
                  取消
                </Button>
                <Button type='submit' disabled={passwordMutation.isPending}>
                  {passwordMutation.isPending ? '提交中...' : '确定'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog
        open={open === 'delete'}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpen(null)
            setTimeout(() => {
              setCurrentRow(null)
            }, 500)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除账户{' '}
              <span className='font-semibold'>{currentRow?.account}</span>{' '}
              吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className='bg-red-600 hover:bg-red-700'
            >
              {deleteMutation.isPending ? '删除中...' : '确定删除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* </> */}
      {/* )} */}

      {/* 添加账户（无currentRow） */}
      {/* {open === 'create' && !currentRow && (
        <AccountMutateDrawer
          key='account-create'
          open={open === 'create'}
          onOpenChange={() => {
            setOpen(null)
          }}
          currentRow={null}
          isAdd={true}
        />
      )} */}
    </>
  )
}
