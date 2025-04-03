"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Coins } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // التحقق من تطابق كلمات المرور
    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة")
      setIsLoading(false)
      return
    }

    // التحقق من صحة البريد الإلكتروني
    if (!formData.email.includes("@")) {
      setError("يرجى إدخال بريد إلكتروني صحيح")
      setIsLoading(false)
      return
    }

    // محاكاة عملية التسجيل
    setTimeout(() => {
      try {
        // الحصول على قائمة المستخدمين الحالية أو إنشاء قائمة جديدة
        const existingUsers = localStorage.getItem("registeredUsers")
        const users = existingUsers ? JSON.parse(existingUsers) : []

        // التحقق مما إذا كان البريد الإلكتروني مستخدمًا بالفعل
        const emailExists = users.some((user: any) => user.email === formData.email)
        if (emailExists) {
          setError("البريد الإلكتروني مستخدم بالفعل")
          setIsLoading(false)
          return
        }

        // إيجاد أعلى معرف موجود وإضافة 1 للمستخدم الجديد
        const maxId = users.reduce((max: number, user: any) => Math.max(max, user.id || 0), 0)
        const nextId = maxId + 1

        // إنشاء كائن المستخدم الجديد
        const newUser = {
          id: nextId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password, // في تطبيق حقيقي، يجب تشفير كلمة المرور
          coins: 0,
          status: "Active",
          registeredAt: new Date().toISOString(),
        }

        // إضافة المستخدم الجديد إلى القائمة
        users.push(newUser)

        // حفظ القائمة المحدثة في localStorage
        localStorage.setItem("registeredUsers", JSON.stringify(users))

        // تخزين معلومات المستخدم الحالي للجلسة
        localStorage.setItem("currentUser", JSON.stringify(newUser))
        localStorage.setItem("userLoggedIn", "true")

        setSuccess(true)

        // الانتقال إلى الصفحة الرئيسية بعد التسجيل بنجاح
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } catch (err) {
        console.error("Error during registration:", err)
        setError("حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.")
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
          <CardTitle className="text-2xl font-bold">إنشاء حساب جديد</CardTitle>
          <CardDescription>أدخل بياناتك لإنشاء حساب في CoinRewards</CardDescription>
        </CardHeader>
        {success ? (
          <CardContent className="space-y-4">
            <Alert className="bg-emerald-50 text-emerald-800 border-emerald-200">
              <AlertDescription>تم إنشاء حسابك بنجاح! سيتم توجيهك إلى الصفحة الرئيسية...</AlertDescription>
            </Alert>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">الاسم الأول</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="محمد"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">الاسم الأخير</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="أحمد"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="example@mail.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <label
                  htmlFor="terms"
                  className="mr-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  أوافق على{" "}
                  <Link href="/terms" className="text-emerald-500 hover:underline">
                    شروط الخدمة
                  </Link>{" "}
                  و{" "}
                  <Link href="/privacy" className="text-emerald-500 hover:underline">
                    سياسة الخصوصية
                  </Link>
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
                {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
              </Button>
              <div className="text-center text-sm">
                لديك حساب بالفعل؟{" "}
                <Link href="/login" className="text-emerald-500 hover:underline">
                  تسجيل الدخول
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}

