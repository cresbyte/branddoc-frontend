import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Mail, Shield, Globe, Bell } from "lucide-react"

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-1">
                    <Button variant="ghost" className="w-full justify-start gap-2 bg-muted">
                        <Globe className="h-4 w-4" />
                        General
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                        <Mail className="h-4 w-4" />
                        Email / SMTP
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                        <Shield className="h-4 w-4" />
                        Security
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </Button>
                </div>

                <div className="md:col-span-3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Organization Settings</CardTitle>
                            <CardDescription>Manage your platform brand and identifier.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="org-name">Organization Name</Label>
                                <Input id="org-name" defaultValue="Branddoc Platform" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="base-url">Base URL</Label>
                                <Input id="base-url" defaultValue="https://Branddoc.com" />
                            </div>
                            <Button>Save Changes</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Email (SMTP) Configuration</CardTitle>
                            <CardDescription>Configure the server used to send system emails.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="smtp-host">SMTP Host</Label>
                                    <Input id="smtp-host" placeholder="smtp.mailtrap.io" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="smtp-port">Port</Label>
                                    <Input id="smtp-port" placeholder="587" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="smtp-user">Username</Label>
                                <Input id="smtp-user" placeholder="user_string" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="smtp-pass">Password</Label>
                                <Input id="smtp-pass" type="password" placeholder="••••••••" />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium">Test Connection</div>
                                <Button variant="outline" size="sm">Send Test Email</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
