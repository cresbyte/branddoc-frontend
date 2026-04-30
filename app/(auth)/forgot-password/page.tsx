"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <div className="w-full">
      <Link href="/login" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to login
      </Link>
      
      <div className="mb-10 text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Reset password</h1>
        <p className="text-gray-500 font-medium">Enter your email address and we'll send you a link to reset your password.</p>
      </div>
      
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-slate-900 font-semibold mb-1">Email address</Label>
          <Input id="email" type="email" placeholder="name@company.com" className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" />
        </div>
        
        <Button className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[15px] shadow-sm">
          Send reset link
        </Button>
      </div>
      
      <div className="mt-8 text-center text-[15px] text-gray-500 font-medium">
        Remember your password?{" "}
        <Link href="/login" className="text-indigo-600 font-bold hover:underline">
          Log in
        </Link>
      </div>
    </div>
  )
}
