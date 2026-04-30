import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Download, Filter } from "lucide-react"

const payments = [
  { id: "INV-001", client: "Acme Corp", amount: "$1,200.00", date: "Apr 28, 2024", status: "Paid" },
  { id: "INV-002", client: "Global Tech", amount: "$450.00", date: "Apr 25, 2024", status: "Paid" },
  { id: "INV-003", client: "Startup Inc", amount: "$2,100.00", date: "Apr 22, 2024", status: "Pending" },
  { id: "INV-004", client: "Agency Alpha", amount: "$800.00", date: "Apr 20, 2024", status: "Overdue" },
  { id: "INV-005", client: "Main Street Shop", amount: "$150.00", date: "Apr 18, 2024", status: "Paid" },
]

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Payments</h1>
        <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
            </Button>
            <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Ledger
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$8,400.00</div>
                <p className="text-xs text-muted-foreground">12 invoices pending</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Failed Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-red-600 font-medium">Requires attention</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>A list of recent payments and their status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium font-mono">{payment.id}</TableCell>
                  <TableCell>{payment.client}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      payment.status === "Paid" ? "bg-green-100 text-green-700" :
                      payment.status === "Overdue" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
