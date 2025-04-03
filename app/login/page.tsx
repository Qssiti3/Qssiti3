"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coins } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // محاكاة عملية تسجيل الدخول
    setTimeout(() => {
      try {
        // الحصول على قائمة المستخدمين المسجلين
        const registeredUsers = localStorage.getItem("registeredUsers")

        if (registeredUsers) {
          const users = JSON.parse(registeredUsers)

          // البحث عن المستخدم بالبريد الإلكتروني وكلمة المرور
          const user = users.find((u: any) => u.email === email && u.password === password)

          if (user) {
            // التحقق من حالة الحظر
            if (user.status === "Banned") {
              setError("تم حظر حسابك. يرجى التواصل مع الدعم.")
              setIsLoading(false)
              return
            }

            // تسجيل الدخول بنجاح
            localStorage.setItem("currentUser", JSON.stringify(user))
            localStorage.setItem("userLoggedIn", "true")
            router.push("/")
          } else {
            // فشل تسجيل الدخول
            setError("البريد الإلكتروني أو كلمة المرور غير صحيحة")
          }
        } else {
          // لا يوجد مستخدمين مسجلين
          setError("لا يوجد حسابات مسجلة. يرجى إنشاء حساب جديد.")
        }
      } catch (err) {
        console.error("Error during login:", err)
        setError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.")
      } finally {
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Coins className="h-8 w-8 text-emerald-500" />
          </div>
          <CardTitle className="text-2xl font-bold">تسجيل الدخول إلى CoinRewards</CardTitle>
          <CardDescription>أدخل بيانات حسابك للوصول إلى منصة العروض</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                placeholder="example@mail.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة المرور</Label>
                <Link href="/forgot-password" className="text-sm text-emerald-500 hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
            <div className="text-center text-sm">
              ليس لديك حساب؟{" "}
              <Link href="/register" className="text-emerald-500 hover:underline">
                إنشاء حساب جديد
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

