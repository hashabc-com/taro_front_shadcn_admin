import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { useCountryStore } from '@/stores/country-store'
import { useAccountAmount } from '../hooks/use-account-amount'
import { useExchangeRate } from '../hooks/use-exchange-rate'
import { updateExchangeRate } from '@/api/fund'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RechargeForm } from './recharge-form'
import { WithdrawForm } from './withdraw-form'
import { useLanguage } from '@/context/language-provider'

export default function AccountSettlement() {
  const { t } = useLanguage()
  const { selectedCountry } = useCountryStore()
  const { data: accountData, refetch: refetchAmount } = useAccountAmount()
  const { data: rateData, refetch: refetchRate } = useExchangeRate()

  // 更新汇率表单
  const [rateForm, setRateForm] = useState({
    name:'',
    gauthCode: '',
  })

  const [isUpdatingRate, setIsUpdatingRate] = useState(false)
  const [rateDialogOpen, setRateDialogOpen] = useState(false)

  // 同步汇率数据
  useEffect(() => {
    if (rateData) {
      setTimeout(() => {
        setRateForm(prev => ({
        ...prev,
        name: rateData.name || '',
      }))
      }, 10);
    }
  }, [rateData])

  // 更新汇率
  const handleUpdateRate = async () => {
    if (!rateForm.name) {
      toast.error(t('common.pleaseEnterRate'))
      return
    }
    if (!rateForm.gauthCode) {
      toast.error(t('common.enterGoogleAuthCode'))
      return
    }

    setIsUpdatingRate(true)
    const res = await updateExchangeRate({
        name: rateForm.name,
        gauthCode: rateForm.gauthCode,
        data: rateData?.provinceCode
    })
    if(res.code == 200){
      toast.success(t('fund.accountSettlement.rateUpdateSuccess'))
      setRateForm({ name: rateForm.name || rateData.name, gauthCode: '' })
      setRateDialogOpen(false)
      refetchRate()
    }else{
    toast.error(res?.message || t('fund.accountSettlement.rateUpdateFailed'))
    }
    setIsUpdatingRate(false)
  }
  
  return (
    <div className="space-y-4">
      {/* 标题和费率信息 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-2xl font-bold">{t('fund.accountSettlement.title')}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{t('fund.accountSettlement.currentRate')}: {rateData?.name || '0'}</span>
            <span className="text-muted-foreground/50">|</span>
            <span>{t('fund.accountSettlement.rateUpdateTime')}: {rateData?.provinceCode || '-'}</span>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => setRateDialogOpen(true)}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {t('fund.accountSettlement.updateRate')}
        </Button>
      </div>

      {/* 顶部三个卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('fund.accountSettlement.availableBalance')} {selectedCountry?.currency ? `(${selectedCountry.currency})` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accountData?.availableAmount || '0'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('fund.accountSettlement.unsettledFunds')} {selectedCountry?.currency ? `(${selectedCountry.currency})` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accountData?.frozenAmount || '0'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('fund.accountSettlement.rechargeAmount')} {selectedCountry?.currency ? `(${selectedCountry.currency})` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accountData?.rechargeAmount || '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 左右布局：充值和提现 */}
      <div className="grid gap-4 md:grid-cols-2">
        <RechargeForm onSuccess={refetchAmount} />
        <WithdrawForm onSuccess={refetchAmount} />
      </div>

      {/* 更新费率弹窗 */}
      <Dialog open={rateDialogOpen} onOpenChange={setRateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('fund.accountSettlement.updateRate')}</DialogTitle>
            <DialogDescription>
              {t('fund.accountSettlement.enterNewRateAndGoogleCode')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rate">{t('merchant.info.rate')} <span className="text-red-500">*</span></Label>
              <Input
                id="rate"
                placeholder={t('common.enterRate')}
                value={rateForm.name}
                onChange={(e) => setRateForm({name: e.target.value, gauthCode: rateForm.gauthCode})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gauthCode">{t('fund.rechargeWithdraw.googleAuthCode')} <span className="text-red-500">*</span></Label>
              <Input
                id="gauthCode"
                placeholder={t('common.enterGoogleAuthCode')}
                value={rateForm.gauthCode}
                onChange={(e) => setRateForm({name: rateForm.name, gauthCode: e.target.value})}
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRateDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleUpdateRate}
              disabled={isUpdatingRate}
            >
              {isUpdatingRate ? t('common.updating') : t('common.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}