"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, Clock, MessageSquare, Search, Trash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Message {
  id: number
  recipient: string
  subject: string
  content: string
  status: string
  timestamp: string
  read: boolean
}

export function UserMessages({ userId }: { userId: string | number }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [noMessages, setNoMessages] = useState(false)

  // جلب الرسائل الخاصة بالمستخدم
  useEffect(() => {
    try {
      // جلب الرسائل من localStorage
      const allMessages = localStorage.getItem("messageHistory")
      if (allMessages) {
        const parsedMessages = JSON.parse(allMessages)

        // تصفية الرسائل الخاصة بالمستخدم الحالي أو الرسائل العامة
        const userEmail = getUserEmail()
        const userMessages = parsedMessages.filter(
          (msg: Message) =>
            msg.recipient === userEmail ||
            msg.recipient === "all_users" ||
            msg.recipient === "active_users" ||
            msg.recipient === "new_users" ||
            (msg.recipient.includes && msg.recipient.includes(userEmail)),
        )

        setMessages(userMessages)
        setNoMessages(userMessages.length === 0)
      } else {
        setNoMessages(true)
      }
    } catch (err) {
      console.error("Error loading messages:", err)
      setNoMessages(true)
    }
  }, [userId])

  // الحصول على بريد المستخدم الحالي
  const getUserEmail = () => {
    try {
      const userData = localStorage.getItem("currentUser")
      if (userData) {
        const user = JSON.parse(userData)
        return user.email
      }
    } catch (err) {
      console.error("Error getting user email:", err)
    }
    return ""
  }

  // تصفية الرسائل حسب البحث والتبويب النشط
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "unread") return matchesSearch && !msg.read
    if (activeTab === "read") return matchesSearch && msg.read

    return matchesSearch
  })

  // تحديث حالة قراءة الرسالة
  const markAsRead = (messageId: number) => {
    try {
      const updatedMessages = messages.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))

      setMessages(updatedMessages)

      // تحديث localStorage
      const allMessages = localStorage.getItem("messageHistory")
      if (allMessages) {
        const parsedMessages = JSON.parse(allMessages)
        const updatedAllMessages = parsedMessages.map((msg: Message) =>
          msg.id === messageId ? { ...msg, read: true } : msg,
        )
        localStorage.setItem("messageHistory", JSON.stringify(updatedAllMessages))
      }

      // تحديث الرسالة المحددة إذا كانت هي نفسها
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage({ ...selectedMessage, read: true })
      }
    } catch (err) {
      console.error("Error marking message as read:", err)
    }
  }

  // حذف رسالة
  const deleteMessage = (messageId: number) => {
    try {
      // حذف الرسالة من قائمة الرسائل المحلية
      const updatedMessages = messages.filter((msg) => msg.id !== messageId)
      setMessages(updatedMessages)

      // إذا كانت الرسالة المحذوفة هي المحددة حالياً
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage(null)
      }

      // تحديث localStorage لإزالة الرسالة المحذوفة
      const allMessages = localStorage.getItem("messageHistory")
      if (allMessages) {
        const parsedMessages = JSON.parse(allMessages)
        const updatedAllMessages = parsedMessages.filter((msg: Message) => msg.id !== messageId)
        localStorage.setItem("messageHistory", JSON.stringify(updatedAllMessages))
      }
    } catch (err) {
      console.error("Error deleting message:", err)
    }
  }

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (err) {
      return dateString
    }
  }

  // عدد الرسائل غير المقروءة
  const unreadCount = messages.filter((msg) => !msg.read).length

  // ترجمة نوع الرسالة
  const translateRecipientType = (recipient: string) => {
    if (recipient === "all_users") return "جميع المستخدمين"
    if (recipient === "active_users") return "المستخدمين النشطين"
    if (recipient === "new_users") return "المستخدمين الجدد"
    return recipient
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">الرسائل</h2>
          <p className="text-muted-foreground">
            {noMessages
              ? "لا توجد أي رسائل في صندوق الوارد"
              : unreadCount > 0
                ? `لديك ${unreadCount} رسائل غير مقروءة`
                : "ليس لديك رسائل غير مقروءة"}
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="بحث في الرسائل..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {noMessages ? (
        <Alert>
          <Bell className="h-4 w-4 mr-2" />
          <AlertDescription>لا توجد رسائل في صندوق الوارد. ستظهر هنا الرسائل الإدارية المرسلة إليك.</AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              جميع الرسائل
              <span className="mr-1 text-xs">({messages.length})</span>
            </TabsTrigger>
            <TabsTrigger value="unread">
              غير مقروءة
              <span className="mr-1 text-xs">({messages.filter((msg) => !msg.read).length})</span>
            </TabsTrigger>
            <TabsTrigger value="read">
              مقروءة
              <span className="mr-1 text-xs">({messages.filter((msg) => msg.read).length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-md overflow-hidden">
                <div className="p-3 bg-muted font-medium">قائمة الرسائل</div>
                <div className="divide-y max-h-[400px] overflow-y-auto">
                  {filteredMessages.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      لا توجد رسائل {searchTerm ? "مطابقة لبحثك" : ""}
                    </div>
                  ) : (
                    filteredMessages
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                            selectedMessage?.id === message.id ? "bg-muted/50" : ""
                          } ${!message.read ? "border-r-4 border-r-emerald-500" : ""}`}
                          onClick={() => {
                            setSelectedMessage(message)
                            if (!message.read) markAsRead(message.id)
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="font-medium flex items-center">
                                {!message.read && (
                                  <Badge
                                    variant="outline"
                                    className="mr-2 bg-emerald-50 text-emerald-700 border-emerald-200"
                                  >
                                    جديد
                                  </Badge>
                                )}
                                {message.subject}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-1">{message.content}</p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <div className="p-3 bg-muted font-medium">محتوى الرسالة</div>
                {selectedMessage ? (
                  <div className="p-4 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold">{selectedMessage.subject}</h3>
                      <div className="flex flex-wrap justify-between text-xs text-muted-foreground gap-2">
                        <div className="space-y-1">
                          <div>التاريخ: {formatDate(selectedMessage.timestamp)}</div>
                          <div>المرسل إلى: {translateRecipientType(selectedMessage.recipient)}</div>
                        </div>
                        <span className="flex items-center">
                          {selectedMessage.read ? (
                            <CheckCircle className="h-3 w-3 mr-1 text-emerald-500" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1 text-amber-500" />
                          )}
                          {selectedMessage.read ? "مقروءة" : "غير مقروءة"}
                        </span>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      {!selectedMessage.read && (
                        <Button variant="outline" size="sm" onClick={() => markAsRead(selectedMessage.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          تحديد كمقروءة
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => deleteMessage(selectedMessage.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        حذف
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground h-[300px]">
                    <MessageSquare className="h-12 w-12 mb-4 text-muted" />
                    <p>اختر رسالة لعرض محتواها</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

