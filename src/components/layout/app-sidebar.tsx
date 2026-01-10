import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar'
// import { AppTitle } from './app-title'
import { getSidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { useLanguage } from '@/context/language-provider'
import { useAuthStore } from '@/stores'
import { useMemo } from 'react'
// import { TeamSwitcher } from './team-switcher'

function ErrorButton() {
  return (
    <button
      onClick={() => {
        throw new Error('这是您的第二个错误！');
      }}
    >
      测试按钮请勿点击
    </button>
  );
}

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { lang } = useLanguage()
  const { state } = useSidebar()
  const { permissions } = useAuthStore()
  
  // 当权限变化时重新生成菜单数据
  const sidebarData = useMemo(() => {
    return getSidebarData(lang)
  }, [lang, permissions])
  
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <h2 className="text-2xl font-bold">
          {state === 'collapsed' ? 'TP' : 'TaroPay'}
        </h2>
        <ErrorButton/>
        {/* <TeamSwitcher teams={sidebarData.teams} /> */}

        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
