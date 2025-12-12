import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores'

interface PermissionGuardProps {
  children: React.ReactNode
  requiredUrl: string
  redirectTo?: string
}

/**
 * 权限守卫组件
 * 用于保护需要特定权限才能访问的页面
 */
export function PermissionGuard({
  children,
  requiredUrl,
  redirectTo = '/',
}: PermissionGuardProps) {
  const navigate = useNavigate()
  const { hasPermission } = useAuthStore()

  useEffect(() => {
    const checkAccess = async () => {
      // 检查是否有访问权限
      if (!hasPermission(requiredUrl)) {
        console.warn(`无权限访问: ${requiredUrl}`)
        // 重定向到首页或指定页面
        navigate({ to: redirectTo })
      }
    }

    checkAccess()
  }, [requiredUrl, hasPermission, navigate, redirectTo])

  // 如果没有权限，不渲染子组件
  if (!hasPermission(requiredUrl)) {
    return null
  }

  return <>{children}</>
}
