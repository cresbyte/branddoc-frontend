"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const NAV_LINKS = ["Product", "Templates", "Pricing", "Customers", "Blog"];

export function PublicNavbar() {
   const [scrolled, setScrolled] = useState(false);

   useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
   }, []);

   return (
      <nav style={{
         position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
         transition: "all 0.2s",
         background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
         backdropFilter: scrolled ? "blur(12px)" : "none",
         borderBottom: scrolled ? "0.5px solid #E2E8F0" : "none",
      }}>
         <div style={{
            maxWidth: 1120, margin: "0 auto",
            padding: "0 24px", height: 64,
            display: "flex", alignItems: "center", gap: 40,
         }}>
            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0, textDecoration: "none" }}>
               <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
               }}>
                  <FileText size={14} color="#fff" />
               </div>
               <span style={{
                  fontSize: 16, fontWeight: 700, color: "#0F172A",
                  fontFamily: "'Fraunces', Georgia, serif", letterSpacing: "-0.02em",
               }}>DocCraft</span>
            </Link>

            {/* Nav links */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
               {NAV_LINKS.map((link) => (
                  <Link key={link} href={`/${link.toLowerCase()}`} style={{ textDecoration: "none" }}>
                    <button style={{
                       background: "none", border: "none", cursor: "pointer",
                       padding: "6px 12px", borderRadius: 7,
                       fontSize: 13.5, color: "#475569", fontFamily: "inherit",
                       transition: "color 0.1s",
                    }}
                       onMouseEnter={(e) => (e.currentTarget.style.color = "#0F172A")}
                       onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
                    >{link}</button>
                  </Link>
               ))}
            </div>

            {/* CTA */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
               {useAuth().user ? (
                 <Link href="/dashboard" style={{ textDecoration: "none" }}>
                    <button style={{
                       display: "flex", alignItems: "center", gap: 6,
                       padding: "8px 18px", background: "#0F172A",
                       border: "none", borderRadius: 9, cursor: "pointer",
                       fontSize: 13.5, fontWeight: 500, color: "#fff", fontFamily: "inherit",
                       transition: "background 0.15s",
                    }}
                       onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
                       onMouseLeave={(e) => (e.currentTarget.style.background = "#0F172A")}
                    >
                       Go to Dashboard <ArrowRight size={13} />
                    </button>
                 </Link>
               ) : (
                 <>
                   <Link href="/auth" style={{ textDecoration: "none" }}>
                      <button style={{
                         background: "none", border: "none", cursor: "pointer",
                         fontSize: 13.5, color: "#475569", fontFamily: "inherit", padding: "6px 12px",
                      }}>Log in</button>
                   </Link>
                   <Link href="/auth" style={{ textDecoration: "none" }}>
                      <button style={{
                         display: "flex", alignItems: "center", gap: 6,
                         padding: "8px 18px", background: "#0F172A",
                         border: "none", borderRadius: 9, cursor: "pointer",
                         fontSize: 13.5, fontWeight: 500, color: "#fff", fontFamily: "inherit",
                         transition: "background 0.15s",
                      }}
                         onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
                         onMouseLeave={(e) => (e.currentTarget.style.background = "#0F172A")}
                      >
                         Get started free <ArrowRight size={13} />
                      </button>
                   </Link>
                 </>
               )}
            </div>
         </div>
      </nav>
   );
}
