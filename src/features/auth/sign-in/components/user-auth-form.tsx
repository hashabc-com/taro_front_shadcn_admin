import { useState, useEffect, useRef, useCallback } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores'
import { Loader2, LogIn, RefreshCw } from 'lucide-react'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'
import { getAccountPermissions } from '@/api/account'
// import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import {
  login,
  getVerifyCode,
  getKey,
  bindKey,
  type ILoginForm,
  type IUserInfo,
} from '@/api/login'
import { cn } from '@/lib/utils'
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  username: z.string().min(1, '请输入您的用户名'),
  password: z.string().min(1, '请输入您的密码'),
  // .min(6, 'Password must be at least 6 characters long'),
  validatecode: z.string().min(1, '请输入验证码'),
})

const googleFormSchema = z.object({
  googleCode: z
    .string()
    .min(6, '验证码必须是6位数字')
    .max(6, '验证码必须是6位数字')
    .regex(/^\d{6}$/, '验证码必须是6位数字'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false)
  const [verifyCode, setVerifyCode] = useState<{
    base64ImgStr: string
    key: string
  }>({
    base64ImgStr: '',
    key: '',
  })
  const [showGoogleAuthModal, setShowGoogleAuthModal] = useState(false)
  const [googleAuthMode, setGoogleAuthMode] = useState<'bind' | 'verify'>(
    'bind'
  )
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null)
  const [loginParams, setLoginParams] = useState<ILoginForm | null>(null)
  const googleInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { login: authLogin, setPermissions } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      validatecode: '',
    },
  })

  const googleForm = useForm<z.infer<typeof googleFormSchema>>({
    resolver: zodResolver(googleFormSchema),
    defaultValues: {
      googleCode: '',
    },
  })

  // 获取验证码
  const fetchVerifyCode = useCallback(async (): Promise<void> => {
    try {
      const res = await getVerifyCode()
      form.resetField('validatecode')
      if (res.result) {
        setVerifyCode(res.result)
      }
    } catch {
      toast.error('获取验证码失败')
    }
  }, [form])

  // 首次加载获取验证码
  useEffect(() => {
    fetchVerifyCode()
  }, [fetchVerifyCode])

  // 处理谷歌验证码绑定
  const handleBindGoogleAuth = async (userName: string): Promise<void> => {
    try {
      const getKeyParams: Partial<IUserInfo> = {
        userName: userName,
        account: '',
        createTime: '',
        disabledStatus: 0,
        email: '',
        gauthKey: '',
        id: 0,
        lastLoginTime: '',
        mobile: '',
        password: '',
        roleIds: '',
        salt: '',
        updateTime: '',
        userType: 0,
      }

      const keyRes = await getKey(getKeyParams)
      if (keyRes.code === '200') {
        setUserInfo(keyRes.result)
        setGoogleAuthMode('bind')
        setShowGoogleAuthModal(true)
        setTimeout(() => {
          googleInputRef.current?.focus()
        }, 100)
      } else {
        toast.error(keyRes.message || 'Failed to get secret key')
      }
    } catch (error) {
       
      console.error('Failed to get secret key:', error)
      toast.error('Failed to get secret key')
    }
  }

  // 绑定谷歌验证码
  const handleBindKey = async (googleCode: string): Promise<void> => {
    if (!userInfo) return

    try {
      const bindParams: Partial<IUserInfo> = {
        gauthKey: userInfo.gauthKey,
        userName: userInfo.userName,
        account: '',
        createTime: '',
        disabledStatus: 0,
        email: '',
        id: 0,
        lastLoginTime: '',
        mobile: '',
        password: '',
        userType: 0,
      }

      const bindRes = await bindKey(bindParams)
      if (bindRes.code === '200') {
        setShowGoogleAuthModal(false)
        await handleFinalLogin(googleCode)
      } else {
        toast.error(bindRes.message || 'Binding failed')
      }
    } catch (error) {
       
      console.error('Binding failed:', error)
      toast.error('Binding failed')
    }
  }

  // 最终登录（带谷歌验证码）
  const handleFinalLogin = async (googleCode: string): Promise<void> => {
    if (!loginParams) return

    try {
      const finalParams: ILoginForm = {
        ...loginParams,
        type: 'confirm',
        gauthkey: googleCode,
      }

      const res = await login(finalParams)
      if (res.code === '200' && res.result) {
        toast.success('登录成功')
        authLogin(res.result.TOKEN, res.result.userInfo)

        // 获取用户权限
        try {
          const permissionsRes = await getAccountPermissions()
          if (permissionsRes.result) {
            setPermissions(permissionsRes.result)
          }
        } catch (error) {
          console.error('Failed to fetch permissions:', error)
          // 权限获取失败不影响登录，使用默认权限（只有系统设置）
          setPermissions({
            menu: [{ name: '外观设置', url: '/settings/appearance' }],
            user: { roleId: 0, account: res.result.userInfo.name },
          })
        }

        setShowGoogleAuthModal(false)

        // 直接跳转到目标路径（已经不包含查询参数）
        const targetPath = redirectTo || '/'
        navigate({ to: targetPath, replace: true })
      } else {
        setShowGoogleAuthModal(false)
        fetchVerifyCode()
      }
    } catch (error) {
      setShowGoogleAuthModal(false)
      fetchVerifyCode()
       
      console.error('Login failed:', error)
      toast.error('Login failed')
    }
  }

  // 处理谷歌验证码提交
  const onGoogleAuthModalOk = async (): Promise<void> => {
    try {
      const values = await googleForm.trigger()
      if (!values) return

      const data = googleForm.getValues()
      setGoogleAuthLoading(true)

      if (googleAuthMode === 'bind') {
        await handleBindKey(data.googleCode)
      } else {
        await handleFinalLogin(data.googleCode)
      }
    } catch (error) {
       
      console.error('Form validation failed:', error)
    } finally {
      googleForm.reset()
      setGoogleAuthLoading(false)
    }
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const params: ILoginForm = {
        username: data.username,
        password: data.password,
        validatekey: verifyCode.key,
        validatecode: data.validatecode,
        type: 'login',
      }

      const res = await login(params)

      if (res.code === '202') {
        // 未绑定谷歌验证码，需要绑定
        setLoginParams(params)
        await handleBindGoogleAuth(res.message)
      } else if (res.code === '203') {
        // 已绑定谷歌验证码，需要输入验证码
        setLoginParams(params)
        setGoogleAuthMode('verify')
        setShowGoogleAuthModal(true)
        setTimeout(() => {
          googleInputRef.current?.focus()
        }, 100)
      } else {
        fetchVerifyCode()
      }
    } catch (error) {
       
      console.error('Login failed:', error)
      toast.error('Login failed')
      fetchVerifyCode()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('grid gap-3', className)}
          {...props}
        >
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>用户名</FormLabel>
                <FormControl>
                  <Input placeholder='请输入您的用户名' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='relative'>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <PasswordInput placeholder='********' {...field} />
                </FormControl>
                <FormMessage />
                {/* <Link
                  to='/forgot-password'
                  className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
                >
                  忘记密码？
                </Link> */}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='validatecode'
            render={({ field }) => (
              <FormItem>
                <FormLabel>验证码</FormLabel>
                <div className='flex items-center gap-2'>
                  <FormControl>
                    <Input
                      placeholder='请输入验证码'
                      {...field}
                      className='flex-1'
                    />
                  </FormControl>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={fetchVerifyCode}
                    className='h-10 w-28 shrink-0 p-1'
                    title='Click to refresh'
                  >
                    {verifyCode.base64ImgStr ? (
                      <img
                        src={`data:image/png;base64,${verifyCode.base64ImgStr}`}
                        alt='Verification code'
                        className='h-full w-full'
                      />
                    ) : (
                      <div className='flex flex-col items-center gap-1'>
                        <RefreshCw className='h-4 w-4' />
                        <span className='text-xs'>刷新</span>
                      </div>
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className='mt-2' disabled={isLoading}>
            {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
            登录
          </Button>

          {/* <div className='relative my-2'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background text-muted-foreground px-2'>
                Or continue with
              </span>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <Button variant='outline' type='button' disabled={isLoading}>
              <IconGithub className='h-4 w-4' /> GitHub
            </Button>
            <Button variant='outline' type='button' disabled={isLoading}>
              <IconFacebook className='h-4 w-4' /> Facebook
            </Button>
          </div> */}
        </form>
      </Form>

      {/* Google Authentication Modal */}
      <Dialog
        open={showGoogleAuthModal}
        onOpenChange={(open) => {
          setShowGoogleAuthModal(open)
          if (!open) {
            // 关闭时清空表单
            googleForm.reset()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {googleAuthMode === 'bind'
                ? '绑定Google身份验证器'
                : '输入Google验证码'}
            </DialogTitle>
            <DialogDescription>
              {googleAuthMode === 'bind'
                ? '请使用Google身份验证器扫描二维码并输入6位验证码'
                : '请输入Google身份验证器中的6位验证码'}
            </DialogDescription>
          </DialogHeader>
          {googleAuthMode === 'bind' && userInfo?.roleIds && (
            <div className='flex justify-center py-4'>
              <div className='rounded-lg border p-4'>
                <QRCode
                  value={window.atob(userInfo.roleIds)}
                  size={250}
                  style={{ backgroundColor: '#ffffff', padding: '16px' }}
                  fgColor='#8b1538'
                />
              </div>
            </div>
          )}

          <Form {...googleForm}>
            <form className='space-y-4'>
              <FormField
                control={googleForm.control}
                name='googleCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google 验证码</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        ref={googleInputRef}
                        placeholder='请输入6位验证码'
                        maxLength={6}
                        className='text-center text-lg tracking-widest'
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            onGoogleAuthModalOk()
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setShowGoogleAuthModal(false)
                googleForm.reset()
              }}
              disabled={googleAuthLoading}
            >
              取消
            </Button>
            <Button onClick={onGoogleAuthModalOk} disabled={googleAuthLoading}>
              {googleAuthLoading ? (
                <Loader2 className='animate-spin' />
              ) : (
                '确认'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
