import { useAuthStore } from '@/stores'
import {
  LayoutDashboard,
  HelpCircle,
  Settings,
  Users,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  ClipboardList,
  Calculator,
} from 'lucide-react'
import { type SidebarData } from '../types'
import { getTranslation, type Language } from '@/lib/i18n'

export const getSidebarData = (language: Language): SidebarData => {
  const t = (key: string) => getTranslation(language, key)

  return {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name:
        (useAuthStore.getState().userInfo?.name as string) || 'Default Team',
      logo: Command,
      plan: '',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: '仪表盘',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: '订单管理',
          icon: ClipboardList,
          items: [
            {
              title: '收款订单明细',
              url: '/orders/receive-lists',
            },
            {
              title: '收款汇总',
              url: '/orders/receive-summary-lists',
            },
            {
              title: '付款订单明细',
              url: '/orders/payment-lists',
            },
            {
              title: '付款汇总',
              url: '/orders/payment-summary-lists',
            },
            {
              title: '代收成功率',
              url: '/orders/collection-success-rate',
            },
          ],
        },
        {
          title: '资金管理',
          icon: Calculator,
          items: [
            {
              title: '结算记录',
              url: '/fund/settlement-lists',
            },
            {
              title: '申请审批',
              url: '/fund/recharge-withdraw',
            },
          ],
        },
        {
          title: '商户管理',
          icon: Users,
          items: [
            {
              title: '商户信息',
              url: '/merchant/info-lists',
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: t('sidebar.systemSettings'),
          icon: Settings,
          items: [
            {
              title: t('common.appearance'),
              url: '/settings/appearance',
            },
          ],
        },
        {
          title: t('sidebar.apiDocs'),
          url: 'https://docs.taropay.com/',
          icon: HelpCircle,
        },
      ],
    },
  ],
}


}
