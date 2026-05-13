"use client";

import React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

export function PublicFooter() {
   return (
      <footer style={{
         background: "#0B1120", borderTop: "1px solid rgba(255,255,255,0.06)",
         padding: "60px 24px 40px",
      }}>
         <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 80, marginBottom: 48, flexWrap: "wrap" }}>
               {/* Brand */}
               <div style={{ flex: "0 0 220px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
                     <div style={{
                        width: 28, height: 28, borderRadius: 7,
                        background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                     }}>
                        <FileText size={14} color="#fff" />
                     </div>
                     <span style={{
                        fontSize: 16, fontWeight: 700, color: "#fff",
                        fontFamily: "'Fraunces', Georgia, serif",
                     }}>DocCraft</span>
                  </div>
                  <p style={{
                     fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.8,
                     fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}>
                     Brand-first document creation for modern teams.
                  </p>
               </div>

               {/* Link columns */}
               <div style={{ flex: "1 0 120px" }}>
                  <div style={{
                     fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                     color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
                     marginBottom: 16, fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}>Product</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                     <Link href="/templates" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Templates</Link>
                     <Link href="/dashboard/brand" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Brand Kit</Link>
                     <Link href="/pricing" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Pricing</Link>
                     <Link href="/changelog" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Changelog</Link>
                  </div>
               </div>

               <div style={{ flex: "1 0 120px" }}>
                  <div style={{
                     fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                     color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
                     marginBottom: 16, fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}>Resources</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                     <Link href="/docs" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Documentation</Link>
                     <Link href="/blog" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Blog</Link>
                     <Link href="/customers" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Customer Stories</Link>
                     <Link href="/status" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Status</Link>
                  </div>
               </div>

               <div style={{ flex: "1 0 120px" }}>
                  <div style={{
                     fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                     color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
                     marginBottom: 16, fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}>Company</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                     <Link href="/about" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>About</Link>
                     <Link href="/careers" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Careers</Link>
                     <Link href="/contact" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Contact</Link>
                     <Link href="/privacy" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Privacy</Link>
                  </div>
               </div>
            </div>

            <div style={{
               borderTop: "1px solid rgba(255,255,255,0.06)",
               paddingTop: 24,
               display: "flex", justifyContent: "space-between", alignItems: "center",
               flexWrap: "wrap", gap: 12,
            }}>
               <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                  © 2025 DocCraft. All rights reserved.
               </span>
               <div style={{ display: "flex", gap: 20 }}>
                  <Link href="/privacy" style={{ fontSize: 12.5, color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>Privacy Policy</Link>
                  <Link href="/terms" style={{ fontSize: 12.5, color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>Terms of Service</Link>
               </div>
            </div>
         </div>
      </footer>
   );
}
