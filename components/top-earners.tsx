import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Trophy } from "lucide-react"

export function TopEarners() {
  const topUsers = [
    { id: 1, name: "Ahmed", coins: 250000, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "Sara", coins: 220000, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "Mohammed", coins: 180000, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 4, name: "Fatima", coins: 150000, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 5, name: "Omar", coins: 120000, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 6, name: "Layla", coins: 100000, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 7, name: "Youssef", coins: 90000, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 8, name: "Nour", coins: 85000, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 9, name: "Karim", coins: 80000, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 10, name: "Amina", coins: 75000, avatar: "/placeholder.svg?height=40&width=40" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topUsers.map((user, index) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                  {index < 3 ? (
                    <span className="font-bold text-sm">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</span>
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center text-emerald-500 font-semibold">
                <Coins className="w-4 h-4 mr-1" />
                {user.coins.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

