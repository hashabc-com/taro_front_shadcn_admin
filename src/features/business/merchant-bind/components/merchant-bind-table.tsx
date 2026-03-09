import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { FeatureDataTable } from '@/components/data-table'
import { useMerchantBindData } from '../hooks/use-merchant-bind-data'
import { BindMerchantDialog } from './bind-merchant-dialog'
import { getColumns } from './merchant-bind-columns'
import { MerchantBindSearch } from './merchant-bind-search'
import { RateConfigDialog } from './rate-config-dialog'

const route = getRouteApi('/_authenticated/business/merchant-bind')

export function MerchantBindTable() {
  const { lang } = useLanguage()
  const { data, isLoading, totalRecord, refetch } = useMerchantBindData()
  const columns = useMemo(() => getColumns({ language: lang }), [lang])

  const handleSuccess = () => {
    refetch()
  }

  return (
    <FeatureDataTable
      columns={columns}
      data={data}
      totalRecord={totalRecord}
      isLoading={isLoading}
      search={route.useSearch()}
      navigate={route.useNavigate()}
      renderToolbar={() => <MerchantBindSearch />}
    >
      <BindMerchantDialog onSuccess={handleSuccess} />
      <RateConfigDialog onSuccess={handleSuccess} />
    </FeatureDataTable>
  )
}
