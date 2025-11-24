import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    // { location }
    // 检查是否已登录
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('_token') : null
    
    if (!token) {
      // 未登录，重定向到登录页，并保存当前路径用于登录后跳转
      throw redirect({
        to: '/sign-in',
        // search: {
        //   redirect: location.href,
        // },
      })
    }
  },
  component: AuthenticatedLayout,
})
