import { createFileRoute } from '@tanstack/react-router'
import AccountSettlementPage from '@/features/fund/account-settlement'

export const Route = createFileRoute('/_authenticated/fund/account-settlement')(
  {
    component: AccountSettlementPage,
  }
)

// function RouteComponent() {
// 	return <AccountSettlement />
// }
