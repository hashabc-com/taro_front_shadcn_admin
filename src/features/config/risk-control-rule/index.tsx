import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { RuleConfigTable } from './components/rule-config-table'
import { RuleEditDialog } from './components/rule-edit-dialog'
import { useLanguage } from '@/context/language-provider'

export function RiskControlRulePage() {
  const { t } = useLanguage()
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>{t('config.riskControlRule.title')}</h2>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />
          {t('config.riskControlRule.addRule')}
        </Button>
      </div>
      <RuleConfigTable />
      <RuleEditDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        rule={null}
        isAdd={true}
      />
    </Main>
  )
}
