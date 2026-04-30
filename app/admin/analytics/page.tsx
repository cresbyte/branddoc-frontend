import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, FileText } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New registrations over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/30 rounded-xl m-6 mt-0">
             <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <BarChart3 className="h-12 w-12" />
                <span className="font-medium">User Growth Chart Placeholder</span>
             </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Document Activity</CardTitle>
            <CardDescription>Total documents processed per week</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/30 rounded-xl m-6 mt-0">
             <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-12 w-12" />
                <span className="font-medium">Activity Trends Chart Placeholder</span>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Session</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">12m 45s</div>
                <p className="text-xs text-green-600 font-medium">+2.3% from last week</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">84.2%</div>
                <p className="text-xs text-green-600 font-medium">+1.5% from last week</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">2.1%</div>
                <p className="text-xs text-red-600 font-medium">-0.4% from last week</p>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
