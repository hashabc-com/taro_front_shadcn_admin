import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
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

export default function AccountSettlement() {
  const { selectedCountry } = useCountryStore()
  const { data: accountData, refetch: refetchAmount } = useAccountAmount()
  const { data: rateData, refetch: refetchRate } = useExchangeRate()

  // 更新汇率表单
  const [rateForm, setRateForm] = useState({
    ...rateData,
    gauthCode: '',
  })

  const [isUpdatingRate, setIsUpdatingRate] = useState(false)
  const [rateDialogOpen, setRateDialogOpen] = useState(false)

  // 同步汇率数据
//   useEffect(() => {
//     console.log('rateData changed:', rateData)
//     if (rateData) {
//       setRateForm(prev => ({
//         ...prev,
//         name: rateData.name || '',
//       }))
//     }
//   }, [rateData])

  // 更新汇率
  const handleUpdateRate = async () => {
    if (!rateForm.name) {
      toast.error('请输入费率')
      return
    }
    if (!rateForm.gauthCode) {
      toast.error('请输入谷歌验证码')
      return
    }

    setIsUpdatingRate(true)
    const res = await updateExchangeRate({
        name: rateForm.name,
        gauthCode: rateForm.gauthCode,
    })
    if(res.code == 200){
      toast.success('更新费率成功')
      setRateForm((prev: object) => ({ ...prev, gauthCode: '' }))
      setRateDialogOpen(false)
      refetchRate()
    }else{
    toast.error(res?.message || '更新费率失败')
    }
    setIsUpdatingRate(false)
  }
  
  return (
    <div className="space-y-4">
      {/* 标题和费率信息 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-2xl font-bold">账户结算</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>当前费率: {rateData?.name || '0'}</span>
            <span className="text-muted-foreground/50">|</span>
            <span>费率更新时间: {rateData?.provinceCode || '-'}</span>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => setRateDialogOpen(true)}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          更新费率
        </Button>
      </div>

      {/* 顶部三个卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              可用余额 {selectedCountry?.currency ? `(${selectedCountry.currency})` : ''}
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
              未结算资金 {selectedCountry?.currency ? `(${selectedCountry.currency})` : ''}
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
              冻结资金 {selectedCountry?.currency ? `(${selectedCountry.currency})` : ''}
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
            <DialogTitle>更新费率</DialogTitle>
            <DialogDescription>
              请输入新的费率和谷歌验证码
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rate">费率 <span className="text-red-500">*</span></Label>
              <Input
                id="rate"
                placeholder="请输入费率"
                value={rateForm.name}
                onChange={(e) => setRateForm((prev: object) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gauthCode">谷歌验证码 <span className="text-red-500">*</span></Label>
              <Input
                id="gauthCode"
                placeholder="请输入谷歌验证码"
                value={rateForm.gauthCode}
                onChange={(e) => setRateForm((prev: object) => ({ ...prev, gauthCode: e.target.value }))}
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
              取消
            </Button>
            <Button 
              onClick={handleUpdateRate}
              disabled={isUpdatingRate}
            >
              {isUpdatingRate ? '更新中...' : '确认'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}