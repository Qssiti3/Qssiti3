import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins } from "lucide-react"

interface OfferCardProps {
  title: string
  description: string
  coins: number
  provider: string
}

export function OfferCard({ title, description, coins, provider }: OfferCardProps) {
  return (
    <Card className="border hover:border-emerald-500 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <span className="text-xs px-2 py-1 bg-muted rounded-full">{provider}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center mt-4 text-emerald-500 font-semibold">
          <Coins className="w-5 h-5 mr-1" />
          {coins.toLocaleString()} coins
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Start Offer</Button>
      </CardFooter>
    </Card>
  )
}

