import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { FeatureDataTable } from '@/components/data-table'
import { useAccountData } from '../hooks/use-account-data'
import { getAccountColumns } from './account-columns'
import { AccountSearch } from './account-search'

const route = getRouteApi('/_authenticated/system/account-manage')

export function AccountTable() {
  const { accounts: data, isLoading, totalRecord } = useAccountData()
  const { lang } = useLanguage()
  const columns = useMemo(() => getAccountColumns(lang), [lang])

  return (
    <FeatureDataTable
      columns={columns}
      data={data}
      totalRecord={totalRecord}
      isLoading={isLoading}
      search={route.useSearch()}
      navigate={route.useNavigate()}
      renderToolbar={() => <AccountSearch />}
    />
  )
}
