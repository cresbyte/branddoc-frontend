import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, FileText, Activity, ShieldAlert, Globe } from "lucide-react"

const systemStats = [
  {
    label: "Total Users",
    value: "12,492",
    icon: Users,
    description: "Across 450 organizations",
  },
  {
    label: "Storage Used",
    value: "1.2 TB",
    icon: FileText,
    description: "75% of total capacity",
  },
  {
    label: "System Health",
    value: "99.9%",
    icon: Activity,
    description: "Up for 34 days",
  },
  {
    label: "Active Requests",
    value: "45/sec",
    icon: Globe,
    description: "Normal traffic load",
  },
]

const recentUsers = [
  { name: "John Smith", org: "Acme Corp", role: "Client Admin", joined: "2 mins ago" },
  { name: "Sarah Wilson", org: "Global Tech", role: "Editor", joined: "15 mins ago" },
  { name: "Mike Johnson", org: "Startup Inc", role: "Client Admin", joined: "1 hour ago" },
  { name: "Emily Brown", org: "Agency Alpha", role: "Contributor", joined: "3 hours ago" },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
          <ShieldAlert className="h-4 w-4" />
          2 System Alerts
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent User Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.map((user) => (
                <TableRow key={user.name}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.org}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-right">{user.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
