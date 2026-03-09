import { useCallback, useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { FeatureDataTable } from '@/components/data-table'
import { useRuleConfigData } from '../hooks/use-rule-config-data'
import { type RuleConfig } from '../schema'
import { getColumns } from './rule-config-columns'
import { RuleConfigSearch } from './rule-config-search'
import { RuleEditDialog } from './rule-edit-dialog'

const route = getRouteApi('/_authenticated/config/risk-control-rule')

export function RuleConfigTable() {
  const { data, isLoading, totalRecord } = useRuleConfigData()
  const { lang } = useLanguage()
  const [currentRule, setCurrentRule] = useState<RuleConfig | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleEdit = useCallback((rule: RuleConfig) => {
    setCurrentRule(rule)
    setEditDialogOpen(true)
  }, [])

  const handleDelete = useCallback((rule: RuleConfig) => {
    console.log('Delete rule:', rule)
  }, [])

  const columns = useMemo(
    () => getColumns(handleEdit, handleDelete, lang),
    [handleEdit, handleDelete, lang]
  )

  return (
    <FeatureDataTable
      columns={columns}
      data={data}
      totalRecord={totalRecord}
      isLoading={isLoading}
      search={route.useSearch()}
      navigate={route.useNavigate() as never}
      renderToolbar={(table) => <RuleConfigSearch table={table} />}
    >
      <RuleEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        rule={currentRule}
        isAdd={false}
      />
    </FeatureDataTable>
  )
}
