"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { 
  User, 
  Mail, 
  Lock, 
  CreditCard, 
  Clock, 
  AlertCircle, 
  Camera,
  Save,
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Dummy billing data
  const billingInfo = {
    plan: "Pro Plan",
    cycle: "Monthly",
    nextBilling: "June 15, 2026",
    pendingAmount: "$29.00",
    status: "Pending",
    method: "Visa ending in 4242"
  };

  const sectionStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 12,
    border: "0.5px solid #E5E7EB",
    padding: 24,
    marginBottom: 24,
  };

  const headerStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    gap: 10,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
    marginBottom: 8,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 40,
    padding: "0 12px",
    borderRadius: 8,
    border: "0.5px solid #E5E7EB",
    fontSize: 14,
    background: "#F9FAFB",
    outline: "none",
  };

  const btnStyle: React.CSSProperties = {
    height: 40,
    padding: "0 20px",
    borderRadius: 8,
    border: "none",
    background: "#0F172A",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Account Settings</h1>
        <p style={{ color: "#64748B", fontSize: 16 }}>Manage your personal information, security, and billing.</p>
      </div>

      {/* Personal Information */}
      <div style={sectionStyle}>
        <div style={headerStyle}>
          <User size={20} /> Personal Information
        </div>
        
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
          <div style={{ position: "relative" }}>
             <div style={{ 
               width: 100, height: 100, borderRadius: "50%", 
               background: user?.profile_picture ? `url(${user.profile_picture})` : "#1D4ED8",
               backgroundSize: "cover",
               display: "flex", alignItems: "center", justifyContent: "center",
               color: "#fff", fontSize: 32, fontWeight: 700
             }}>
               {!user?.profile_picture && user?.name?.charAt(0).toUpperCase()}
             </div>
             <button style={{
               position: "absolute", bottom: 0, right: 0,
               width: 32, height: 32, borderRadius: "50%",
               background: "#fff", border: "0.5px solid #E5E7EB",
               display: "flex", alignItems: "center", justifyContent: "center",
               cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
             }}>
               <Camera size={14} color="#64748B" />
             </button>
          </div>

          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} defaultValue={user?.name || ""} />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input style={inputStyle} defaultValue={user?.email || ""} disabled />
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div style={sectionStyle}>
        <div style={headerStyle}>
          <Lock size={20} /> Security
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>New Password</label>
            <input type="password" style={inputStyle} placeholder="••••••••" />
          </div>
          <div>
            <label style={labelStyle}>Confirm New Password</label>
            <input type="password" style={inputStyle} placeholder="••••••••" />
          </div>
        </div>
        
        <button style={btnStyle}>
          <Save size={16} /> Update Password
        </button>
      </div>

      {/* Billing & Subscription */}
      <div style={sectionStyle}>
        <div style={headerStyle}>
          <CreditCard size={20} /> Billing & Subscription
        </div>
        
        <div style={{ 
          background: "#F8FAFC", borderRadius: 10, padding: 20, 
          display: "flex", gap: 24, marginBottom: 24 
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>Current Plan</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>{billingInfo.plan}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>Billing Cycle</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#0F172A" }}>{billingInfo.cycle}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>Next Invoice</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#0F172A" }}>{billingInfo.nextBilling}</div>
          </div>
        </div>

        {billingInfo.status === "Pending" && (
          <div style={{ 
            background: "#FFF7ED", border: "1.5px solid #FFEDD5", borderRadius: 10,
            padding: "16px 20px", display: "flex", alignItems: "center", gap: 16,
            marginBottom: 24
          }}>
            <div style={{ 
              width: 40, height: 40, borderRadius: "50%", background: "#FFEDD5", 
              display: "flex", alignItems: "center", justifyContent: "center", color: "#C2410C" 
            }}>
              <AlertCircle size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#9A3412" }}>Payment Pending</div>
              <div style={{ fontSize: 13, color: "#C2410C" }}>You have a pending balance of {billingInfo.pendingAmount}.</div>
            </div>
            <button style={{
              height: 32, padding: "0 16px", borderRadius: 6, border: "none",
              background: "#C2410C", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>Pay Now</button>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "0.5px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 24, background: "#E2E8F0", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>VISA</div>
            <span style={{ fontSize: 14, color: "#475569" }}>{billingInfo.method}</span>
          </div>
          <button style={{ 
            background: "none", border: "none", color: "#2563EB", 
            fontSize: 14, fontWeight: 600, cursor: "pointer" 
          }}>
            Update Payment Method
          </button>
        </div>
      </div>
    </div>
  );
}
