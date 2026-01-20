import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updatePassword, deleteAccount } from '@/api/account'
import { useI18n } from '@/hooks/use-i18n'
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

export function AccountDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useAccount()
  const queryClient = useQueryClient()
  const { t } = useI18n()

  // 密码表单验证
  const passwordFormSchema = z
    .object({
      pwd: z
        .string()
        .min(1, t('system.accountManage.validation.newPasswordRequired')),
      rePwd: z
        .string()
        .min(1, t('system.accountManage.validation.confirmPasswordRequired')),
    })
    .refine((data) => data.pwd === data.rePwd, {
      message: t('system.accountManage.passwordMismatch'),
      path: ['rePwd'],
    })

  type PasswordFormValues = z.infer<typeof passwordFormSchema>

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
        toast.success(t('system.accountManage.passwordUpdateSuccess'))
        queryClient.invalidateQueries({
          queryKey: ['system', 'account-manage'],
        })
      } else {
        toast.error(
          res.message || t('system.accountManage.passwordUpdateFailed')
        )
      }
      handlePasswordClose()
    },
    onError: (error: { message?: string }) => {
      toast.error(
        error.message || t('system.accountManage.passwordUpdateFailed')
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteAccount({ id: currentRow!.id! }),
    onSuccess: (res) => {
      if (res.code == 200) {
        queryClient.invalidateQueries({
          queryKey: ['system', 'account-manage'],
        })
        toast.success(t('common.deleteSuccess'))
      } else {
        toast.error(res.message || t('common.deleteFailed'))
      }
      setOpen(null)
      setTimeout(() => {
        setCurrentRow(null)
      }, 500)
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || t('common.deleteFailed'))
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
            <DialogTitle>
              {t('system.accountManage.changePassword')}
            </DialogTitle>
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
                    <FormLabel>
                      {t('system.accountManage.newPassword')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder={t(
                          'system.accountManage.placeholder.newPassword'
                        )}
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
                    <FormLabel>{t('common.confirmPassword')}</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder={t(
                          'system.accountManage.placeholder.confirmPassword'
                        )}
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
                  {t('common.cancel')}
                </Button>
                <Button type='submit' disabled={passwordMutation.isPending}>
                  {passwordMutation.isPending
                    ? t('common.submitting')
                    : t('common.confirm')}
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
            <AlertDialogTitle>{t('common.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('common.deleteConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className='bg-red-600 hover:bg-red-700'
            >
              {deleteMutation.isPending
                ? t('common.deleting')
                : t('common.delete')}
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
