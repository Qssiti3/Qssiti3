import { NextResponse } from "next/server"

// في تطبيق حقيقي، يجب تخزين بيانات المستخدمين بشكل آمن في قاعدة بيانات
// وتشفير كلمات المرور باستخدام bcrypt أو أي تقنية تشفير أخرى
const ADMIN_USER = {
  email: "qssitiabdo@gmail.com",
  password: "Qssiti",
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // التحقق من بيانات المستخدم
    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
      // إنشاء جلسة بسيطة (في تطبيق حقيقي، استخدم JWT أو NextAuth)
      return NextResponse.json({
        success: true,
        user: {
          email: ADMIN_USER.email,
          role: "admin",
          fullAccess: true,
        },
      })
    }

    // إذا فشلت عملية تسجيل الدخول
    return NextResponse.json({ success: false, message: "بيانات الدخول غير صحيحة" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

