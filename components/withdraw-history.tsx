"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, DollarSign, XCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// تعريف نوع طلب السحب
interface WithdrawalRequest {
  id: number
  userId: number
  userEmail: string
  amount: number
  coins: number
  method: string
  details: string
  status: string
  requestDate: string
  processedDate?: string
}

export function WithdrawHistory({ userId }: { userId: number }) {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([])
  const [filter, setFilter] = useState("all")

  // جلب سجل السحب للمستخدم
  useEffect(() => {
    try {
      const userWithdrawals = localStorage.getItem(`withdrawalHistory_${userId}`)
      if (userWithdrawals) {
        setWithdrawals(JSON.parse(userWithdrawals))
      }
    } catch (err) {
      console.error("Error loading withdrawal history:", err)
    }
  }, [userId])

  // تصفية طلبات السحب حسب الحالة
  const filteredWithdrawals = filter === "all" ? withdrawals : withdrawals.filter((w) => w.status === filter)

  // الحصول على أيقونة الحالة
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-amber-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  // الحصول على أيقونة وسيلة السحب
  const getMethodIcon = (method: string) => {
    switch (method) {
      case "paypal":
        return (
          <div className="w-4 h-4 relative">
            <Image src="/images/paypal.png" alt="PayPal" width={16} height={16} className="object-contain" />
          </div>
        )
      case "crypto":
        return (
          <div className="w-4 h-4 relative">
            <Image src="/images/bitcoin.png" alt="Crypto" width={16} height={16} className="object-contain" />
          </div>
        )
      case "giftcard":
        return (
          <div className="w-4 h-4 relative">
            <Image src="/images/gift-card.png" alt="Gift Card" width={16} height={16} className="object-contain" />
          </div>
        )
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />
    }
  }

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // تنسيق اسم وسيلة السحب
  const formatMethod = (method: string) => {
    switch (method) {
      case "paypal":
        return "PayPal"
      case "crypto":
        return "العملات الرقمية"
      case "giftcard":
        return "بطاقة هدية"
      default:
        return method
    }
  }

  // تنسيق حالة الطلب
  const formatStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد المراجعة"
      case "completed":
        return "مكتمل"
      case "rejected":
        return "مرفوض"
      default:
        return status
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>سجل عمليات السحب</CardTitle>
            <CardDescription>سجل طلبات السحب السابقة</CardDescription>
          </div>
          <div className="space-y-1 min-w-32">
            <Label htmlFor="status-filter" className="text-xs">
              تصفية حسب الحالة
            </Label>
            <Select defaultValue="all" onValueChange={setFilter}>
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="جميع الطلبات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطلبات</SelectItem>
                <SelectItem value="pending">قيد المراجعة</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredWithdrawals.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">لا يوجد سجل لعمليات السحب</p>
        ) : (
          <div className="space-y-4">
            {filteredWithdrawals
              .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
              .map((withdrawal) => (
                <div key={withdrawal.id} className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-md">{getMethodIcon(withdrawal.method)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">${withdrawal.amount}</p>
                        <span className="text-xs text-muted-foreground">
                          ({withdrawal.coins.toLocaleString()} عملة)
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatMethod(withdrawal.method)}: {withdrawal.details}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(withdrawal.requestDate)}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(withdrawal.status)}
                      <span
                        className={`text-xs ${
                          withdrawal.status === "completed"
                            ? "text-green-600"
                            : withdrawal.status === "rejected"
                              ? "text-red-600"
                              : "text-amber-600"
                        }`}
                      >
                        {formatStatus(withdrawal.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

