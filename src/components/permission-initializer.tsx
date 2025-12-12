import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores'
import { getAccountPermissions } from '@/api/account'
import { Loader2 } from 'lucide-react'

interface PermissionInitializerProps {
  children: React.ReactNode
}

/**
 * 权限初始化组件
 * 在用户登录后自动获取并设置权限信息
 */
export function PermissionInitializer({ children }: PermissionInitializerProps) {
  const { permissions, setPermissions, isAuthenticated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initPermissions = async () => {
      // 如果已经有权限信息或未登录，则不需要初始化
      if (permissions || !isAuthenticated) {
        return
      }

      setIsLoading(true)
      try {
        const res = await getAccountPermissions()
        if (res.result) {
          setPermissions(res.result)
        } else {
          // 如果获取失败，设置默认权限（只有系统设置）
          setPermissions({ 
            menu: [{ name: '外观设置', url: '/settings/appearance' }], 
            user: { roleId: 0, account: 'default' } 
          })
        }
      } catch (error) {
        console.error('Failed to fetch permissions:', error)
        // 设置默认权限
        setPermissions({ 
          menu: [{ name: '外观设置', url: '/settings/appearance' }], 
          user: { roleId: 0, account: 'default' } 
        })
      } finally {
        setIsLoading(false)
      }
    }

    initPermissions()
  }, [permissions, isAuthenticated, setPermissions])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">加载权限信息...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
