import { useState } from 'react'
import { toast } from 'sonner'
import { addWithdraw } from '@/api/fund'
import { useCountryStore } from '@/stores/country-store'
import { useMerchantStore } from '@/stores/merchant-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface WithdrawFormProps {
  onSuccess?: () => void
}

export function WithdrawForm({ onSuccess }: WithdrawFormProps) {
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
      toast.error('请先选择商户')
      return
    }
    if (parseFloat(form.finalAmount) === 0) {
      toast.error('金额输入错误')
      return
    }
    if (!form.rechargeKey) {
      toast.error('请输入密码')
      return
    }
    if (!form.gauthCode) {
      toast.error('请输入谷歌验证码')
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
      toast.success('提现成功')
      resetForm()
      onSuccess?.()
    } else {
      toast.error(res.message || '提现失败')
    }
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>提现</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label>提现金额</Label>
          <Input
            type='number'
            placeholder='请输入提现金额'
            value={form.finalAmount}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, finalAmount: e.target.value }))
            }
            min='0'
          />
        </div>

        <div className='space-y-2'>
          <Label>备注</Label>
          <Textarea
            placeholder='请输入备注'
            value={form.remark}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, remark: e.target.value }))
            }
            rows={3}
          />
        </div>

        <div className='space-y-2'>
          <Label>提现密码</Label>
          <Input
            type='password'
            placeholder='请输入提现密码'
            value={form.rechargeKey}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, rechargeKey: e.target.value }))
            }
          />
        </div>

        <div className='space-y-2'>
          <Label>谷歌验证码</Label>
          <Input
            placeholder='请输入谷歌验证码'
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
          {isSubmitting ? '提现中...' : '提现'}
        </Button>
      </CardContent>
    </Card>
  )
}
