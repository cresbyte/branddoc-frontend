import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  FileText, 
  Search, 
  Plus, 
  Download, 
  Clock, 
  CheckCircle2, 
  FileEdit,
  MoreHorizontal
} from "lucide-react"

const documents = [
  { id: 1, name: "Consultancy Agreement - April.pdf", date: "Apr 28, 2024", type: "Legal", status: "Finalized", size: "1.2 MB" },
  { id: 2, name: "Project Requirements Specification.docx", date: "Apr 29, 2024", type: "Technical", status: "Draft", size: "850 KB" },
  { id: 3, name: "Mutual NDA - Startup Inc.pdf", date: "Apr 25, 2024", type: "Legal", status: "Finalized", size: "450 KB" },
  { id: 4, name: "Service Level Agreement v3.pdf", date: "Apr 22, 2024", type: "Service", status: "Pending", size: "2.1 MB" },
  { id: 5, name: "Annual Brand Guidelines.pdf", date: "Apr 15, 2024", type: "Branding", status: "Finalized", size: "8.4 MB" },
  { id: 6, name: "Website Content Draft.docx", date: "Apr 12, 2024", type: "Marketing", status: "In Progress", size: "120 KB" },
]

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
          <p className="text-muted-foreground">Manage, download, and continue your branded documents.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Docs</p>
                        <h3 className="text-2xl font-bold">24</h3>
                    </div>
                    <FileText className="h-8 w-8 text-primary/40" />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Finalized</p>
                        <h3 className="text-2xl font-bold text-green-600">18</h3>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-600/40" />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending</p>
                        <h3 className="text-2xl font-bold text-amber-500">4</h3>
                    </div>
                    <Clock className="h-8 w-8 text-amber-500/40" />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                        <h3 className="text-2xl font-bold text-blue-500">2</h3>
                    </div>
                    <FileEdit className="h-8 w-8 text-blue-500/40" />
                </div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 px-6">
          <div className="flex items-center justify-between">
            <CardTitle>Document Library</CardTitle>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search filenames or types..." className="pl-10 h-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-6">Document Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-medium pl-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${doc.status === "Finalized" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                            <FileText className="h-4 w-4" />
                        </div>
                        {doc.name}
                    </div>
                  </TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      doc.status === "Finalized" ? "bg-green-100 text-green-700 border border-green-200" :
                      doc.status === "Pending" ? "bg-yellow-100 text-yellow-700 border border-yellow-200" :
                      doc.status === "Draft" ? "bg-slate-100 text-slate-700 border border-slate-200" :
                      "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}>
                      {doc.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    {doc.status === "Finalized" ? (
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-primary">
                            <Download className="h-4 w-4" /> Download
                        </Button>
                    ) : (
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                             <FileEdit className="h-4 w-4" /> Edit
                        </Button>
                    )}
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
