import { useState, useMemo } from 'react'
import { useAuthStore } from '@/stores'
import { toast } from 'sonner'
import { addRechargeRecord } from '@/api/fund'
import { useCountryStore } from '@/stores/country-store'
import { useMerchantStore } from '@/stores/merchant-store'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const CURRENCY_TYPES = [
  { title: '美金', value: 'USD' },
  { title: '人民币', value: 'CNY' },
  { title: '印尼盾', value: 'IDR' },
  { title: '越南盾', value: 'VHD' },
  { title: '塔卡', value: 'BDT' },
  { title: '墨西哥比索', value: 'MXN' },
  { title: '雷亚尔', value: 'BRL' },
  { title: '菲律宾比索', value: 'PHP' },
]

interface RechargeFormProps {
  onSuccess?: () => void
}

export function RechargeForm({ onSuccess }: RechargeFormProps) {
  const { t } = useLanguage()
  const { selectedMerchant } = useMerchantStore()
  const { selectedCountry } = useCountryStore()
  const { userInfo } = useAuthStore()
  const [form, setForm] = useState({
    currencyType: 'USD',
    exchangeRate: '',
    rechargeAmount: '',
    remark: '',
    rechargeKey: '',
    gauthCode: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // 计算实际存款金额
  const finalAmount = useMemo(() => {
    const amount = parseFloat(form.rechargeAmount) || 0
    const rate = parseFloat(form.exchangeRate) || 0
    return (amount * rate).toFixed(2)
  }, [form.rechargeAmount, form.exchangeRate])

  // 清空充值金额和汇率
  const handleClear = () => {
    setForm((prev) => ({
      ...prev,
      rechargeAmount: '',
      exchangeRate: '',
    }))
  }

  // 重置表单
  const resetForm = () => {
    setForm({
      currencyType: 'USD',
      exchangeRate: '',
      rechargeAmount: '',
      remark: '',
      rechargeKey: '',
      gauthCode: '',
    })
  }

  // 确认充值
  const handleSubmit = async () => {
    if (!selectedMerchant?.appid) {
      toast.error(t('common.pleaseSelectMerchantFirst'))
      return
    }
    if (parseFloat(finalAmount) === 0) {
      toast.error(t('fund.accountSettlement.invalidAmount'))
      return
    }
    if (!form.rechargeKey) {
      toast.error(t('common.pleaseEnterPassword'))
      return
    }
    if (!form.gauthCode) {
      toast.error(t('common.enterGoogleAuthCode'))
      return
    }

    setIsSubmitting(true)

    const res = await addRechargeRecord({
      currencyType: form.currencyType,
      customerAppid: selectedMerchant.appid,
      exchangeRate: parseFloat(form.exchangeRate),
      finalAmount: parseFloat(finalAmount),
      rechargeAmount: parseFloat(form.rechargeAmount),
      rechargeKey: form.rechargeKey,
      remark: form.remark,
      gauthCode: form.gauthCode,
      userid: userInfo?.id,
      country: selectedCountry?.code || '',
    })
    if (res.code == 200) {
      toast.success(t('fund.accountSettlement.rechargeSuccess'))
      resetForm()
      onSuccess?.()
    } else {
      toast.error(res.message || t('fund.accountSettlement.rechargeFailed'))
    }
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('fund.accountSettlement.recharge')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label>{t('fund.accountSettlement.rechargeAmount')}</Label>
          <div className='flex gap-2'>
            <Input
              type='number'
              placeholder={t('fund.accountSettlement.enterRechargeAmount')}
              value={form.rechargeAmount}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, rechargeAmount: e.target.value }))
              }
              min='0'
            />
            <Select
              value={form.currencyType}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, currencyType: value }))
              }
            >
              <SelectTrigger className='w-[140px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_TYPES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type='number'
              placeholder={t('fund.rechargeWithdraw.exchangeRate')}
              value={form.exchangeRate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, exchangeRate: e.target.value }))
              }
              min='0'
              className='w-[120px]'
            />
            <Button variant='outline' onClick={handleClear}>
              {t('common.clear')}
            </Button>
          </div>
        </div>

        <div className='space-y-2'>
          <Label>
            {t('fund.accountSettlement.actualDepositAmount')}（
            {selectedCountry?.currency}）
          </Label>
          <Input value={finalAmount} disabled className='bg-muted' />
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
          <Label>{t('fund.accountSettlement.rechargePassword')}</Label>
          <Input
            type='password'
            placeholder={t('common.enterRechargePassword')}
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
            ? t('fund.accountSettlement.recharging')
            : t('fund.accountSettlement.recharge')}
        </Button>
      </CardContent>
    </Card>
  )
}
