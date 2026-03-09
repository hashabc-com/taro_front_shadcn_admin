import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { FeatureDataTable } from '@/components/data-table'
import { useRoleManageData } from '../hooks/use-role-manage-data'
import { getRoleColumns } from './role-manage-columns'
import { RoleManageSearch } from './role-manage-search'

const route = getRouteApi('/_authenticated/system/role-manage')

export function RoleManageTable() {
  const { roles, totalRecord, isLoading } = useRoleManageData()
  const { lang } = useLanguage()
  const columns = useMemo(() => getRoleColumns(lang), [lang])

  return (
    <FeatureDataTable
      columns={columns}
      data={roles}
      totalRecord={totalRecord}
      isLoading={isLoading}
      search={route.useSearch()}
      navigate={route.useNavigate()}
      renderToolbar={() => <RoleManageSearch />}
    />
  )
}
