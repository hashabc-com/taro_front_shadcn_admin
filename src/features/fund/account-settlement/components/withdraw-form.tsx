import { useState } from 'react'
import { toast } from 'sonner'
import { addWithdraw } from '@/api/fund'
import { useCountryStore } from '@/stores/country-store'
import { useMerchantStore } from '@/stores/merchant-store'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface WithdrawFormProps {
  onSuccess?: () => void
}

export function WithdrawForm({ onSuccess }: WithdrawFormProps) {
  const { t } = useLanguage()
  const { selectedMerchant } = useMerchantStore()
  const { selectedCountry } = useCountryStore()

  const [form, setForm] = useState({
    finalAmount: '',
    remark: '',
    rechargeKey: '',
    gauthCode: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // 重置表单
  const resetForm = () => {
    setForm({
      finalAmount: '',
      remark: '',
      rechargeKey: '',
      gauthCode: '',
    })
  }

  // 确认提现
  const handleSubmit = async () => {
    if (!selectedMerchant?.appid) {
      toast.error(t('common.pleaseSelectMerchantFirst'))
      return
    }
    if (parseFloat(form.finalAmount) === 0) {
      toast.error(t('fund.accountSettlement.invalidAmount'))
      return
    }
    if (!form.rechargeKey) {
      toast.error(t('common.pleaseEnterPassword'))
      return
    }
    if (!form.gauthCode) {
      toast.error(t('common.googleAuthCode'))
      return
    }

    setIsSubmitting(true)

    const res = await addWithdraw({
      customerAppid: selectedMerchant.appid,
      rechargeAmount: parseFloat(form.finalAmount),
      exchangeRate: 1,
      currencyType: selectedCountry?.currency || '',
      country: selectedCountry?.code || '',
      ...form,
    })
    if (res.code == 200) {
      toast.success(t('fund.accountSettlement.withdrawSuccess'))
      resetForm()
      onSuccess?.()
    } else {
      toast.error(res.message || t('fund.accountSettlement.withdrawFailed'))
    }
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('fund.accountSettlement.withdraw')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label>{t('fund.accountSettlement.withdrawAmount')}</Label>
          <Input
            type='number'
            placeholder={t('fund.accountSettlement.enterWithdrawAmount')}
            value={form.finalAmount}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, finalAmount: e.target.value }))
            }
            min='0'
          />
        </div>

        <div className='space-y-2'>
          <Label>{t('fund.accountSettlement.remark')}</Label>
          <Textarea
            placeholder={t('common.enterRemark')}
            value={form.remark}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, remark: e.target.value }))
            }
            rows={3}
          />
        </div>

        <div className='space-y-2'>
          <Label>{t('fund.accountSettlement.withdrawPassword')}</Label>
          <Input
            type='password'
            placeholder={t('fund.rechargeWithdraw.pleaseEnterWithdrawPassword')}
            value={form.rechargeKey}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, rechargeKey: e.target.value }))
            }
          />
        </div>

        <div className='space-y-2'>
          <Label>{t('common.googleAuthCode')}</Label>
          <Input
            placeholder={t('common.enterGoogleAuthCode')}
            value={form.gauthCode}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, gauthCode: e.target.value }))
            }
            maxLength={6}
          />
        </div>

        <Button
          className='w-full'
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? t('fund.accountSettlement.withdrawing')
            : t('fund.accountSettlement.withdraw')}
        </Button>
      </CardContent>
    </Card>
  )
}
