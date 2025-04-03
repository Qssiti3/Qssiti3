"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Coins, LogOut, Settings, User, Wallet, Share2, MessageSquare, Bell } from "lucide-react"

interface UserNavigationProps {
  user: any
  onLogout: () => void
}

export function UserNavigation({ user, onLogout }: UserNavigationProps) {
  const [open, setOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)

  // التحقق من وجود رسائل غير مقروءة
  useEffect(() => {
    try {
      const allMessages = localStorage.getItem("messageHistory")
      if (allMessages) {
        const parsedMessages = JSON.parse(allMessages)

        // تصفية الرسائل الخاصة بالمستخدم الحالي أو الرسائل العامة
        const userMessages = parsedMessages.filter(
          (msg: any) =>
            msg.recipient === user.email ||
            msg.recipient === "all_users" ||
            msg.recipient === "active_users" ||
            msg.recipient === "new_users",
        )

        // عدد الرسائل غير المقروءة
        const unread = userMessages.filter((msg: any) => !msg.read).length
        setUnreadMessages(unread)
      }
    } catch (err) {
      console.error("Error checking unread messages:", err)
    }
  }, [user])

  if (!user) return null

  const userInitials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex items-center gap-2">
        <Coins className="h-4 w-4 text-emerald-500" />
        <span className="font-medium">{user.coins?.toLocaleString() || 0}</span>
      </div>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {unreadMessages}
              </span>
            )}
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-emerald-100 text-emerald-800">{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{`${user.firstName} ${user.lastName}`}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              <p className="text-xs leading-none text-muted-foreground mt-1">المعرف: {user.id || "غير متوفر"}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer w-full">
                <User className="mr-2 h-4 w-4" />
                <span>الملف الشخصي</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/withdraw" className="cursor-pointer w-full">
                <Wallet className="mr-2 h-4 w-4" />
                <span>سحب الأرباح</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/referrals" className="cursor-pointer w-full">
                <Share2 className="mr-2 h-4 w-4" />
                <span>الإحالات</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/messages" className="cursor-pointer w-full relative">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>الرسائل</span>
                {unreadMessages > 0 && (
                  <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadMessages}
                  </span>
                )}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/chat" className="cursor-pointer w-full">
                <Bell className="mr-2 h-4 w-4" />
                <span>الدردشة</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile?tab=settings" className="cursor-pointer w-full">
                <Settings className="mr-2 h-4 w-4" />
                <span>الإعدادات</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>تسجيل الخروج</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

