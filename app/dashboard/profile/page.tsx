"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Building,
  Mail,
  MapPin,
  Phone,
  Palette,
  Upload,
  Save,
  Type,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function BrandProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Profile</h1>
          <p className="text-muted-foreground">
            Manage your business information and brand assets.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                This information will appear on your documents and client
                portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="biz-name">Business Name</Label>
                  <Input id="biz-name" defaultValue="Acme Corporation" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="biz-email">Contact Email</Label>
                  <Input id="biz-email" defaultValue="contact@acme.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="biz-phone">Phone Number</Label>
                  <Input id="biz-phone" defaultValue="+1 (555) 000-0000" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="biz-address">Business Address</Label>
                <textarea
                  id="biz-address"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  defaultValue="123 Street, City, Country"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance & Typography</CardTitle>
              <CardDescription>
                Customize the look and feel of your client-facing pages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2 text-base">
                    <Palette className="h-4 w-4" /> Brand Primary Color
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Your primary brand color for UI elements.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg border bg-blue-600 shadow-sm" />
                  <Input className="w-32" defaultValue="#2563eb" />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-base">
                  <Type className="h-4 w-4" /> Brand Typography
                </Label>
                <Select defaultValue="Inter">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Corporate / Professional</SelectLabel>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                      <SelectItem value="Source Sans Pro">
                        Source Sans Pro
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Elegant / Luxury</SelectLabel>
                      <SelectItem value="Playfair Display">
                        Playfair Display
                      </SelectItem>
                      <SelectItem value="Cormorant Garamond">
                        Cormorant Garamond
                      </SelectItem>
                      <SelectItem value="DM Serif Display">
                        DM Serif Display
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Modern / Tech</SelectLabel>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Nunito">Nunito</SelectItem>
                      <SelectItem value="Raleway">Raleway</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Friendly / Creative</SelectLabel>
                      <SelectItem value="Quicksand">Quicksand</SelectItem>
                      <SelectItem value="Josefin Sans">Josefin Sans</SelectItem>
                      <SelectItem value="Outfit">Outfit</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Classic / Traditional</SelectLabel>
                      <SelectItem value="Merriweather">Merriweather</SelectItem>
                      <SelectItem value="EB Garamond">EB Garamond</SelectItem>
                      <SelectItem value="Libre Baskerville">
                        Libre Baskerville
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Brand Logo</CardTitle>
              <CardDescription>Global business identifier.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed bg-muted">
                <div className="flex flex-col items-center p-6 text-center text-muted-foreground">
                  <Upload className="mb-2 h-10 w-10 opacity-50" />
                  <span className="text-sm">Click to replace logo</span>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Recommended: Square SVG or PNG with transparent background.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
