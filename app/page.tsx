"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
   FileText, Palette, Layers, Sparkles, ArrowRight,
   Check, ChevronDown, Menu, X, Receipt,
   FileCheck, Shield, BarChart3, Briefcase,
   Mail, Star, Quote, Globe, Zap, Users,
} from "lucide-react";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";


/* ══════════════════════════════════════════════════════════════
   CONSTANTS & DATA
══════════════════════════════════════════════════════════════ */


const LOGOS = ["Acme Co.", "Velocity", "Bilt Inc.", "Surge", "Nexus", "Orbit"];

const FEATURES = [
   {
      icon: <Palette size={18} />,
      title: "One brand, every document",
      body: "Set up your brand once — logo, colors, fonts, footer — and it flows into every invoice, report, and letter you create.",
      color: "#0C4A6E",
      accent: "#38BDF8",
   },
   {
      icon: <Layers size={18} />,
      title: "80+ professional templates",
      body: "From SLAs to quotations, our template library covers every business document category with multiple style options.",
      color: "#3B0764",
      accent: "#C084FC",
   },
   {
      icon: <Zap size={18} />,
      title: "Built for speed",
      body: "A pre-configured editor means you go from blank to branded document in under two minutes. No design skills required.",
      color: "#14532D",
      accent: "#4ADE80",
   },
   {
      icon: <Users size={18} />,
      title: "Team-ready from day one",
      body: "Share brand kits across your team so every colleague produces on-brand documents automatically.",
      color: "#7C2D12",
      accent: "#FB923C",
   },
];

const TEMPLATE_CATEGORIES = [
   { icon: <Receipt size={14} />, label: "Invoices", count: 6, color: "#0C4A6E", accent: "#38BDF8" },
   { icon: <FileCheck size={14} />, label: "Quotations", count: 4, color: "#854F0B", accent: "#FCD34D" },
   { icon: <Shield size={14} />, label: "SLAs", count: 3, color: "#14532D", accent: "#4ADE80" },
   { icon: <BarChart3 size={14} />, label: "Reports", count: 5, color: "#3B0764", accent: "#C084FC" },
   { icon: <Briefcase size={14} />, label: "Proposals", count: 4, color: "#7C2D12", accent: "#FB923C" },
   { icon: <Mail size={14} />, label: "Letters", count: 5, color: "#0E7490", accent: "#22D3EE" },
];

const TESTIMONIALS = [
   {
      quote: "DocCraft cut our invoice turnaround from 20 minutes to 90 seconds. The brand kit is a game-changer for our team.",
      name: "Amina Kariuki",
      role: "Operations Lead, Velocity Africa",
      initials: "AK",
      color: "#0C4A6E",
   },
   {
      quote: "We tried four different tools before DocCraft. Nothing else let us apply our full brand identity this seamlessly.",
      name: "James Mwangi",
      role: "Founder, Bilt Consulting",
      initials: "JM",
      color: "#14532D",
   },
   {
      quote: "Our clients actually comment on how professional our documents look. That's never happened before.",
      name: "Chloe Nderitu",
      role: "Creative Director, Surge Studio",
      initials: "CN",
      color: "#7C2D12",
   },
];

const STEPS = [
   { num: "01", title: "Set up your brand", body: "Upload your logo, pick your colors and fonts. Done in 3 minutes." },
   { num: "02", title: "Choose a template", body: "Pick from 80+ professionally designed document templates." },
   { num: "03", title: "Your brand is applied automatically", body: "Open the editor and your letterhead, footer, and colors are already there." },
   { num: "04", title: "Export and share", body: "Download as PDF or share a live link — polished and professional every time." },
];

/* ══════════════════════════════════════════════════════════════
   MICRO-COMPONENTS
══════════════════════════════════════════════════════════════ */

/** Pill badge */
function Pill({ children, light }: { children: React.ReactNode; light?: boolean }) {
   return (
      <div style={{
         display: "inline-flex", alignItems: "center", gap: 6,
         padding: "5px 12px", borderRadius: 20,
         border: light ? "1px solid rgba(255,255,255,0.2)" : "1px solid #E2E8F0",
         background: light ? "rgba(255,255,255,0.08)" : "#F8FAFC",
         fontSize: 12.5, fontWeight: 500,
         color: light ? "rgba(255,255,255,0.8)" : "#475569",
         letterSpacing: "0.01em",
      }}>
         {children}
      </div>
   );
}

/** Section label */
function Label({ children, light }: { children: React.ReactNode; light?: boolean }) {
   return (
      <div style={{
         fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
         textTransform: "uppercase",
         color: light ? "rgba(255,255,255,0.5)" : "#94A3B8",
         marginBottom: 12,
      }}>
         {children}
      </div>
   );
}

/** Document thumbnail mockup */
function DocMockup({
   title, type, primaryColor, accentColor, lines, size = "md",
}: {
   title: string; type: string;
   primaryColor: string; accentColor: string;
   lines: number[]; size?: "sm" | "md" | "lg";
}) {
   const w = size === "lg" ? 260 : size === "md" ? 200 : 140;
   const fontSize = size === "lg" ? 1 : size === "md" ? 0.8 : 0.65;

   return (
      <div style={{
         width: w,
         background: "#fff",
         borderRadius: 8,
         overflow: "hidden",
         boxShadow: "0 8px 40px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.06)",
         border: "1px solid rgba(0,0,0,0.06)",
         flexShrink: 0,
      }}>
         {/* Header */}
         <div style={{
            background: primaryColor, padding: `${10 * fontSize * 1.6}px ${14 * fontSize * 1.6}px`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
         }}>
            <div>
               <div style={{
                  fontSize: 10 * fontSize * 1.8, fontWeight: 700, color: "#fff",
                  fontFamily: "'Fraunces', Georgia, serif",
               }}>{title}</div>
               <div style={{ fontSize: 7 * fontSize * 1.8, color: accentColor, marginTop: 1 }}>{type}</div>
            </div>
            <div style={{
               width: 22 * fontSize * 1.5, height: 22 * fontSize * 1.5,
               borderRadius: 5, background: accentColor,
               display: "flex", alignItems: "center", justifyContent: "center",
            }}>
               <FileText size={11 * fontSize * 1.5} color={primaryColor} />
            </div>
         </div>
         <div style={{ height: 2, background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})` }} />
         <div style={{ padding: `${10 * fontSize * 1.6}px ${12 * fontSize * 1.6}px`, display: "flex", flexDirection: "column", gap: 4 * fontSize * 1.4 }}>
            {lines.map((w, i) => (
               <div key={i} style={{
                  height: i === 0 ? 5 * fontSize * 1.5 : 3 * fontSize * 1.5,
                  width: `${w}%`,
                  background: i === 0 ? primaryColor : (i % 3 === 0 ? "#E2E8F0" : "#F1F5F9"),
                  borderRadius: 2, opacity: i === 0 ? 0.7 : 1,
               }} />
            ))}
            <div style={{
               marginTop: 4 * fontSize * 1.2,
               height: 6 * fontSize * 1.5, width: "38%",
               background: primaryColor, borderRadius: 2, opacity: 0.85,
            }} />
         </div>
      </div>
   );
}

/* ══════════════════════════════════════════════════════════════
   SECTIONS
══════════════════════════════════════════════════════════════ */



/** HERO */
function Hero() {
   return (
      <section style={{
         minHeight: "100vh",
         background: "#F8FAFC",
         display: "flex", flexDirection: "column",
         alignItems: "center",
         paddingTop: 140,
         paddingBottom: 80,
         position: "relative",
         overflow: "hidden",
      }}>
         {/* Background blobs */}
         <div style={{
            position: "absolute", top: -80, left: "50%",
            transform: "translateX(-50%)",
            width: 900, height: 600,
            background: "radial-gradient(ellipse at 50% 40%, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.07) 40%, transparent 70%)",
            pointerEvents: "none",
         }} />
         <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `radial-gradient(circle, #CBD5E1 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
            opacity: 0.35,
            pointerEvents: "none",
         }} />

         <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
               <Pill>
                  <Sparkles size={11} color="#F59E0B" />
                  Brand-first document creation
               </Pill>
            </div>

            {/* Headline */}
            <h1 style={{
               fontSize: "clamp(40px, 6vw, 68px)",
               fontWeight: 800, lineHeight: 1.08,
               letterSpacing: "-0.04em", color: "#0F172A",
               fontFamily: "'Fraunces', Georgia, serif",
               marginBottom: 22,
            }}>
               Documents that look<br />
               <span style={{
                  background: "linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
               }}>
                  like your brand.
               </span>
            </h1>

            {/* Sub */}
            <p style={{
               fontSize: 18, color: "#64748B", lineHeight: 1.75,
               maxWidth: 560, margin: "0 auto 36px",
               fontFamily: "'DM Sans', system-ui, sans-serif",
            }}>
               Build a brand kit once. Then create invoices, proposals, SLAs and
               more with your logo, colors, and fonts applied automatically.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
               <Link href="/auth" style={{ textDecoration: "none" }}>
                  <button style={{
                     display: "flex", alignItems: "center", gap: 8,
                     padding: "14px 28px", background: "#0F172A",
                     border: "none", borderRadius: 12, cursor: "pointer",
                     fontSize: 15, fontWeight: 600, color: "#fff", fontFamily: "'DM Sans', system-ui, sans-serif",
                     boxShadow: "0 4px 20px rgba(15,23,42,0.25)",
                     transition: "all 0.15s",
                  }}
                     onMouseEnter={(e) => { (e.currentTarget.style.background = "#1D4ED8"); (e.currentTarget.style.transform = "translateY(-1px)"); }}
                     onMouseLeave={(e) => { (e.currentTarget.style.background = "#0F172A"); (e.currentTarget.style.transform = "none"); }}
                  >
                     Start for free <ArrowRight size={16} />
                  </button>
               </Link>
               <Link href="/templates" style={{ textDecoration: "none" }}>
                  <button style={{
                     display: "flex", alignItems: "center", gap: 8,
                     padding: "14px 28px", background: "#fff",
                     border: "1.5px solid #E2E8F0", borderRadius: 12, cursor: "pointer",
                     fontSize: 15, fontWeight: 500, color: "#0F172A", fontFamily: "'DM Sans', system-ui, sans-serif",
                     transition: "all 0.15s",
                  }}
                     onMouseEnter={(e) => { (e.currentTarget.style.borderColor = "#CBD5E1"); (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"); }}
                     onMouseLeave={(e) => { (e.currentTarget.style.borderColor = "#E2E8F0"); (e.currentTarget.style.boxShadow = "none"); }}
                  >
                     See templates
                  </button>
               </Link>
            </div>

            {/* Trust line */}
            <div style={{
               display: "flex", alignItems: "center", justifyContent: "center",
               gap: 6, marginTop: 28, fontSize: 13, color: "#94A3B8",
               fontFamily: "'DM Sans', system-ui, sans-serif",
            }}>
               {["No credit card required", "Free forever plan", "2,400+ professionals"].map((t, i) => (
                  <React.Fragment key={t}>
                     {i > 0 && <span style={{ opacity: 0.4 }}>·</span>}
                     <span>{t}</span>
                  </React.Fragment>
               ))}
            </div>
         </div>

         {/* Floating document cards */}
         <div style={{
            position: "relative", zIndex: 1,
            width: "100%", maxWidth: 1000, margin: "64px auto 0",
            padding: "0 24px",
            display: "flex", justifyContent: "center", gap: 24, alignItems: "flex-start",
            flexWrap: "nowrap",
         }}>
            <div style={{ transform: "rotate(-4deg) translateY(20px)", animation: "floatA 6s ease-in-out infinite" }}>
               <DocMockup title="Invoice #1241" type="Invoice · Acme Corp" primaryColor="#0C4A6E" accentColor="#38BDF8" lines={[85, 70, 90, 55, 75, 60]} size="md" />
            </div>
            <div style={{ transform: "translateY(0px)", animation: "floatB 7s ease-in-out infinite", zIndex: 2 }}>
               <DocMockup title="Q3 Report 2024" type="Report · Acme Corp" primaryColor="#3B0764" accentColor="#C084FC" lines={[90, 72, 85, 60, 80, 55]} size="lg" />
            </div>
            <div style={{ transform: "rotate(4deg) translateY(20px)", animation: "floatC 5.5s ease-in-out infinite" }}>
               <DocMockup title="Service Quote" type="Quotation · Acme Corp" primaryColor="#14532D" accentColor="#4ADE80" lines={[80, 65, 88, 50, 70, 60]} size="md" />
            </div>
         </div>
      </section>
   );
}

/** LOGO BAR */
function LogoBar() {
   return (
      <section style={{
         borderTop: "0.5px solid #E2E8F0", borderBottom: "0.5px solid #E2E8F0",
         background: "#fff", padding: "24px 24px",
      }}>
         <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <p style={{
               textAlign: "center", fontSize: 12, color: "#94A3B8",
               fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
               marginBottom: 20, fontFamily: "'DM Sans', system-ui, sans-serif",
            }}>
               Trusted by teams at
            </p>
            <div style={{
               display: "flex", justifyContent: "center",
               alignItems: "center", gap: 40, flexWrap: "wrap",
            }}>
               {LOGOS.map((name) => (
                  <div key={name} style={{
                     fontSize: 15, fontWeight: 700, color: "#CBD5E1",
                     letterSpacing: "-0.02em",
                     fontFamily: "'Fraunces', Georgia, serif",
                     transition: "color 0.2s", cursor: "default",
                  }}
                     onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3B8")}
                     onMouseLeave={(e) => (e.currentTarget.style.color = "#CBD5E1")}
                  >{name}</div>
               ))}
            </div>
         </div>
      </section>
   );
}

/** BRAND SECTION (light) */
function BrandSection() {
   return (
      <section style={{ background: "#fff", padding: "100px 24px" }}>
         <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", gap: 80 }}>
            {/* Left copy */}
            <div style={{ flex: 1, minWidth: 0 }}>
               <Label>Your brand kit</Label>
               <h2 style={{
                  fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700,
                  color: "#0F172A", letterSpacing: "-0.03em", lineHeight: 1.15,
                  fontFamily: "'Fraunces', Georgia, serif", marginBottom: 18,
               }}>
                  Set it once.<br />Use it everywhere.
               </h2>
               <p style={{
                  fontSize: 16, color: "#64748B", lineHeight: 1.8,
                  maxWidth: 440, marginBottom: 32,
                  fontFamily: "'DM Sans', system-ui, sans-serif",
               }}>
                  Upload your logo, choose your brand colors and typography. From that
                  moment on, every document you create inherits your identity — no copy-pasting,
                  no reformatting.
               </p>
               <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {["Logo + letterhead applied automatically", "Brand colors in every template", "Custom fonts across all documents", "Footer with your contact details"].map((f) => (
                     <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                           width: 20, height: 20, borderRadius: 6,
                           background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                           <Check size={11} color="#1D4ED8" strokeWidth={2.5} />
                        </div>
                        <span style={{ fontSize: 14, color: "#374151", fontFamily: "'DM Sans', system-ui, sans-serif" }}>{f}</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Right mockup */}
            <div style={{
               flex: 1, minWidth: 0, display: "flex", justifyContent: "center",
               position: "relative",
            }}>
               {/* Background glow */}
               <div style={{
                  position: "absolute", inset: -40,
                  background: "radial-gradient(ellipse at center, rgba(29,78,216,0.08) 0%, transparent 70%)",
                  pointerEvents: "none",
               }} />
               {/* Brand kit card */}
               <div style={{
                  background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16,
                  padding: 24, width: 360,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                  position: "relative", zIndex: 1,
               }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 16 }}>Brand Kit — Acme Corp</div>
                  {/* Logo mark */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, padding: "14px", background: "#0C4A6E", borderRadius: 10 }}>
                     <div style={{ width: 40, height: 40, borderRadius: 8, background: "#38BDF8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#0C4A6E" }}>AC</div>
                     <div>
                        <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "'Fraunces', Georgia, serif" }}>Acme Corp</div>
                        <div style={{ color: "#38BDF8", fontSize: 11 }}>Building tomorrow's solutions</div>
                     </div>
                  </div>
                  {/* Color palette */}
                  <div style={{ marginBottom: 16 }}>
                     <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 8, fontWeight: 500 }}>Colors</div>
                     <div style={{ display: "flex", gap: 8 }}>
                        {["#0C4A6E", "#0369A1", "#38BDF8", "#F1F5F9"].map((c) => (
                           <div key={c} style={{ flex: 1, height: 32, borderRadius: 6, background: c, border: "1px solid rgba(0,0,0,0.06)" }} />
                        ))}
                     </div>
                  </div>
                  {/* Fonts */}
                  <div style={{ display: "flex", gap: 10 }}>
                     <div style={{ flex: 1, padding: "10px", background: "#F8FAFC", borderRadius: 8, border: "0.5px solid #E2E8F0" }}>
                        <div style={{ fontSize: 9, color: "#94A3B8", marginBottom: 3, fontWeight: 500 }}>HEADING</div>
                        <div style={{ fontSize: 13, fontFamily: "'Fraunces', Georgia, serif", color: "#0F172A", fontWeight: 600 }}>Fraunces</div>
                     </div>
                     <div style={{ flex: 1, padding: "10px", background: "#F8FAFC", borderRadius: 8, border: "0.5px solid #E2E8F0" }}>
                        <div style={{ fontSize: 9, color: "#94A3B8", marginBottom: 3, fontWeight: 500 }}>BODY</div>
                        <div style={{ fontSize: 13, fontFamily: "'DM Sans', system-ui", color: "#0F172A", fontWeight: 500 }}>DM Sans</div>
                     </div>
                  </div>
                  {/* Applied badge */}
                  <div style={{
                     marginTop: 14, padding: "8px 12px",
                     background: "#ECFDF5", border: "0.5px solid #BBF7D0",
                     borderRadius: 8, fontSize: 12, color: "#065F46",
                     display: "flex", alignItems: "center", gap: 6,
                  }}>
                     <Check size={12} strokeWidth={2.5} />
                     Applied to 18 documents
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}

/** TEMPLATES SECTION (light bg) */
function TemplatesSection() {
   return (
      <section style={{ background: "#F8FAFC", padding: "100px 24px" }}>
         <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
               <Label>80+ templates</Label>
               <h2 style={{
                  fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700,
                  color: "#0F172A", letterSpacing: "-0.03em",
                  fontFamily: "'Fraunces', Georgia, serif", marginBottom: 14,
               }}>
                  Every document your business needs.
               </h2>
               <p style={{
                  fontSize: 16, color: "#64748B", maxWidth: 500, margin: "0 auto",
                  fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.75,
               }}>
                  From financial documents to legal agreements — all pre-designed
                  and ready for your brand.
               </p>
            </div>

            {/* Category chips */}
            <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 48 }}>
               {TEMPLATE_CATEGORIES.map((cat) => (
                  <div key={cat.label} style={{
                     display: "flex", alignItems: "center", gap: 7,
                     padding: "8px 16px", borderRadius: 20,
                     background: "#fff", border: "1px solid #E2E8F0",
                     fontSize: 13, fontWeight: 500, color: "#374151",
                     cursor: "pointer", transition: "all 0.15s",
                     fontFamily: "'DM Sans', system-ui, sans-serif",
                     boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                     onMouseEnter={(e) => {
                        (e.currentTarget.style.borderColor) = cat.color;
                        (e.currentTarget.style.background) = `${cat.color}0d`;
                        (e.currentTarget.style.color) = cat.color;
                     }}
                     onMouseLeave={(e) => {
                        (e.currentTarget.style.borderColor) = "#E2E8F0";
                        (e.currentTarget.style.background) = "#fff";
                        (e.currentTarget.style.color) = "#374151";
                     }}
                  >
                     <span style={{ color: cat.color }}>{cat.icon}</span>
                     {cat.label}
                     <span style={{
                        fontSize: 11, background: "#F1F5F9", color: "#64748B",
                        borderRadius: 10, padding: "1px 7px", fontWeight: 500,
                     }}>{cat.count}</span>
                  </div>
               ))}
            </div>

            {/* Floating docs row */}
            <div style={{
               display: "flex", gap: 20, justifyContent: "center", alignItems: "center",
               overflow: "visible",
            }}>
               {[
                  { title: "Invoice #3302", type: "Invoice", p: "#0C4A6E", a: "#38BDF8", lines: [85, 70, 90, 55, 75] },
                  { title: "NDA Agreement", type: "Contract", p: "#881337", a: "#FB7185", lines: [80, 90, 65, 85, 55] },
                  { title: "Project Proposal", type: "Proposal", p: "#7C2D12", a: "#FB923C", lines: [88, 72, 95, 60, 78] },
                  { title: "Offer Letter", type: "HR", p: "#0F766E", a: "#2DD4BF", lines: [75, 88, 70, 92, 60] },
                  { title: "Status Report", type: "Report", p: "#3B0764", a: "#C084FC", lines: [90, 65, 80, 55, 85] },
               ].map((doc, i) => (
                  <div key={i} style={{
                     transform: i === 2 ? "scale(1.06)" : "scale(0.95)",
                     transition: "transform 0.2s",
                     zIndex: i === 2 ? 2 : 1,
                  }}
                     onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                     onMouseLeave={(e) => (e.currentTarget.style.transform = i === 2 ? "scale(1.06)" : "scale(0.95)")}
                  >
                     <DocMockup
                        title={doc.title} type={doc.type}
                        primaryColor={doc.p} accentColor={doc.a}
                        lines={doc.lines} size="sm"
                     />
                  </div>
               ))}
            </div>

            <div style={{ textAlign: "center", marginTop: 48 }}>
               <Link href="/templates" style={{ textDecoration: "none" }}>
                  <button style={{
                     display: "inline-flex", alignItems: "center", gap: 8,
                     padding: "12px 24px", border: "1.5px solid #E2E8F0",
                     borderRadius: 10, background: "#fff", cursor: "pointer",
                     fontSize: 14, fontWeight: 500, color: "#0F172A",
                     fontFamily: "'DM Sans', system-ui, sans-serif",
                     transition: "all 0.15s",
                  }}
                     onMouseEnter={(e) => { (e.currentTarget.style.borderColor = "#1D4ED8"); (e.currentTarget.style.color = "#1D4ED8"); }}
                     onMouseLeave={(e) => { (e.currentTarget.style.borderColor = "#E2E8F0"); (e.currentTarget.style.color = "#0F172A"); }}
                  >
                     Browse all templates <ArrowRight size={14} />
                  </button>
               </Link>
            </div>
         </div>
      </section>
   );
}

/** FEATURES — dark section */
function FeaturesSection() {
   return (
      <section style={{
         background: "#0B1120", padding: "100px 24px",
         position: "relative", overflow: "hidden",
      }}>
         {/* Glow */}
         <div style={{
            position: "absolute", top: -100, left: "50%",
            transform: "translateX(-50%)",
            width: 800, height: 600,
            background: "radial-gradient(ellipse at 50% 30%, rgba(29,78,216,0.2) 0%, rgba(124,58,237,0.12) 40%, transparent 70%)",
            pointerEvents: "none",
         }} />

         <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
               <Label light>Why DocCraft</Label>
               <h2 style={{
                  fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700,
                  color: "#fff", letterSpacing: "-0.03em",
                  fontFamily: "'Fraunces', Georgia, serif", marginBottom: 14,
               }}>
                  Designed for how<br />businesses actually work.
               </h2>
               <p style={{
                  fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "0 auto",
                  fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.75,
               }}>
                  No learning curve. No design skills needed. Just your brand, applied professionally.
               </p>
            </div>

            <div style={{
               display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16,
            }}>
               {FEATURES.map((f, i) => (
                  <div key={i} style={{
                     background: "rgba(255,255,255,0.04)",
                     border: "1px solid rgba(255,255,255,0.07)",
                     borderRadius: 16, padding: "28px 30px",
                     transition: "background 0.15s, border-color 0.15s",
                     cursor: "default",
                  }}
                     onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                     }}
                     onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                     }}
                  >
                     <div style={{
                        width: 38, height: 38, borderRadius: 9,
                        background: f.color, display: "flex", alignItems: "center",
                        justifyContent: "center", color: f.accent,
                        marginBottom: 18, border: `1px solid ${f.accent}33`,
                     }}>
                        {f.icon}
                     </div>
                     <div style={{
                        fontSize: 17, fontWeight: 600, color: "#fff",
                        fontFamily: "'Fraunces', Georgia, serif",
                        letterSpacing: "-0.02em", marginBottom: 10,
                     }}>{f.title}</div>
                     <p style={{
                        fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8,
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                     }}>{f.body}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}

/** HOW IT WORKS */
function HowItWorks() {
   return (
      <section style={{ background: "#fff", padding: "100px 24px" }}>
         <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
               <Label>How it works</Label>
               <h2 style={{
                  fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700,
                  color: "#0F172A", letterSpacing: "-0.03em",
                  fontFamily: "'Fraunces', Georgia, serif",
               }}>
                  From brand to document<br />in minutes.
               </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
               {STEPS.map((step, i) => (
                  <div key={i} style={{
                     padding: "28px 24px",
                     borderLeft: i > 0 ? "1px solid #F1F5F9" : "none",
                     position: "relative",
                  }}>
                     {/* Step number */}
                     <div style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                        color: "#CBD5E1", marginBottom: 16,
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                     }}>{step.num}</div>

                     {/* Connector dot */}
                     <div style={{
                        position: "absolute", top: 0, left: i > 0 ? -5 : 0,
                        width: 10, height: 10, borderRadius: "50%",
                        background: i === 0 ? "#1D4ED8" : "#E2E8F0",
                        border: i === 0 ? "2px solid #BFDBFE" : "none",
                        display: i > 0 ? "block" : "none",
                     }} />

                     <div style={{
                        fontSize: 16, fontWeight: 600, color: "#0F172A",
                        fontFamily: "'Fraunces', Georgia, serif",
                        letterSpacing: "-0.02em", marginBottom: 10,
                     }}>{step.title}</div>
                     <p style={{
                        fontSize: 13.5, color: "#64748B", lineHeight: 1.75,
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                     }}>{step.body}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}

/** TESTIMONIALS */
function Testimonials() {
   return (
      <section style={{ background: "#F8FAFC", padding: "100px 24px" }}>
         <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
               <Label>What people say</Label>
               <h2 style={{
                  fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700,
                  color: "#0F172A", letterSpacing: "-0.03em",
                  fontFamily: "'Fraunces', Georgia, serif",
               }}>
                  Loved by teams who care<br />about their brand.
               </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
               {TESTIMONIALS.map((t, i) => (
                  <div key={i} style={{
                     background: "#fff", border: "1px solid #E2E8F0",
                     borderRadius: 16, padding: "28px",
                     boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                     display: "flex", flexDirection: "column", gap: 20,
                     transition: "box-shadow 0.15s",
                  }}
                     onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)")}
                     onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)")}
                  >
                     {/* Stars */}
                     <div style={{ display: "flex", gap: 3 }}>
                        {[...Array(5)].map((_, j) => (
                           <Star key={j} size={13} fill="#F59E0B" color="#F59E0B" />
                        ))}
                     </div>
                     <p style={{
                        fontSize: 14.5, color: "#374151", lineHeight: 1.8, flex: 1,
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontStyle: "italic",
                     }}>
                        "{t.quote}"
                     </p>
                     <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                           width: 36, height: 36, borderRadius: "50%",
                           background: t.color, display: "flex", alignItems: "center",
                           justifyContent: "center", color: "#fff",
                           fontSize: 11, fontWeight: 700, flexShrink: 0,
                        }}>{t.initials}</div>
                        <div>
                           <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0F172A", fontFamily: "'DM Sans', system-ui, sans-serif" }}>{t.name}</div>
                           <div style={{ fontSize: 12, color: "#94A3B8", fontFamily: "'DM Sans', system-ui, sans-serif" }}>{t.role}</div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}

/** PRICING */
function Pricing() {
   const plans = [
      {
         name: "Free",
         price: "$0",
         per: "forever",
         color: "#64748B",
         features: ["1 brand kit", "10 documents/month", "20 templates", "PDF export"],
         cta: "Start free",
         highlight: false,
      },
      {
         name: "Pro",
         price: "$12",
         per: "per month",
         color: "#1D4ED8",
         features: ["3 brand kits", "Unlimited documents", "80+ templates", "PDF & Word export", "Custom fonts", "Priority support"],
         cta: "Start free trial",
         highlight: true,
      },
      {
         name: "Team",
         price: "$29",
         per: "per month",
         color: "#0F172A",
         features: ["Unlimited brand kits", "Unlimited documents", "All templates", "Team sharing", "Admin dashboard", "SSO / SAML"],
         cta: "Contact us",
         highlight: false,
      },
   ];

   return (
      <section style={{ background: "#0B1120", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
         <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
         }} />
         <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
               <Label light>Pricing</Label>
               <h2 style={{
                  fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700,
                  color: "#fff", letterSpacing: "-0.03em",
                  fontFamily: "'Fraunces', Georgia, serif",
               }}>
                  Simple, honest pricing.
               </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, alignItems: "start" }}>
               {plans.map((plan, i) => (
                  <div key={i} style={{
                     background: plan.highlight ? "#fff" : "rgba(255,255,255,0.04)",
                     border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.08)",
                     borderRadius: 16, padding: "28px 26px",
                     transform: plan.highlight ? "scale(1.04)" : "none",
                     boxShadow: plan.highlight ? "0 20px 60px rgba(0,0,0,0.3)" : "none",
                     position: "relative",
                  }}>
                     {plan.highlight && (
                        <div style={{
                           position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                           background: "#1D4ED8", color: "#fff",
                           fontSize: 11, fontWeight: 700, padding: "4px 14px",
                           borderRadius: 20, letterSpacing: "0.06em",
                           fontFamily: "'DM Sans', system-ui, sans-serif",
                        }}>MOST POPULAR</div>
                     )}

                     <div style={{ marginBottom: 20 }}>
                        <div style={{
                           fontSize: 13, fontWeight: 600, color: plan.highlight ? "#64748B" : "rgba(255,255,255,0.4)",
                           marginBottom: 8, fontFamily: "'DM Sans', system-ui, sans-serif",
                           letterSpacing: "0.04em", textTransform: "uppercase",
                        }}>{plan.name}</div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                           <span style={{
                              fontSize: 36, fontWeight: 700, color: plan.highlight ? "#0F172A" : "#fff",
                              fontFamily: "'Fraunces', Georgia, serif", letterSpacing: "-0.04em",
                           }}>{plan.price}</span>
                           <span style={{
                              fontSize: 13, color: plan.highlight ? "#94A3B8" : "rgba(255,255,255,0.3)",
                              fontFamily: "'DM Sans', system-ui, sans-serif",
                           }}>/ {plan.per}</span>
                        </div>
                     </div>

                     <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                        {plan.features.map((f) => (
                           <div key={f} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                              <Check size={13} color={plan.highlight ? "#1D4ED8" : "#4ADE80"} strokeWidth={2.5} />
                              <span style={{
                                 fontSize: 13.5, color: plan.highlight ? "#374151" : "rgba(255,255,255,0.65)",
                                 fontFamily: "'DM Sans', system-ui, sans-serif",
                              }}>{f}</span>
                           </div>
                        ))}
                     </div>

                     <Link href="/auth" style={{ textDecoration: "none" }}>
                        <button style={{
                           width: "100%", height: 42,
                           background: plan.highlight ? "#0F172A" : "rgba(255,255,255,0.08)",
                           border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.12)",
                           borderRadius: 10, cursor: "pointer",
                           fontSize: 14, fontWeight: 500,
                           color: "#fff", fontFamily: "'DM Sans', system-ui, sans-serif",
                           transition: "all 0.15s",
                        }}
                           onMouseEnter={(e) => {
                              if (plan.highlight) (e.currentTarget.style.background = "#1D4ED8");
                              else (e.currentTarget.style.background = "rgba(255,255,255,0.13)");
                           }}
                           onMouseLeave={(e) => {
                              if (plan.highlight) (e.currentTarget.style.background = "#0F172A");
                              else (e.currentTarget.style.background = "rgba(255,255,255,0.08)");
                           }}
                        >{plan.cta}</button>
                     </Link>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}

/** CTA BANNER */
function CTABanner() {
   return (
      <section style={{
         background: "#fff", padding: "100px 24px",
         textAlign: "center",
      }}>
         <div style={{ maxWidth: 600, margin: "0 auto" }}>
            {/* Decorative icon */}
            <div style={{
               width: 56, height: 56, borderRadius: 16,
               background: "linear-gradient(135deg, #1D4ED8, #7C3AED)",
               display: "flex", alignItems: "center", justifyContent: "center",
               margin: "0 auto 28px", boxShadow: "0 8px 30px rgba(29,78,216,0.25)",
            }}>
               <Sparkles size={24} color="#fff" />
            </div>

            <h2 style={{
               fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 800,
               color: "#0F172A", letterSpacing: "-0.04em", lineHeight: 1.1,
               fontFamily: "'Fraunces', Georgia, serif", marginBottom: 18,
            }}>
               Your brand deserves<br />better documents.
            </h2>
            <p style={{
               fontSize: 16, color: "#64748B", lineHeight: 1.8,
               marginBottom: 36, fontFamily: "'DM Sans', system-ui, sans-serif",
            }}>
               Join 2,400+ professionals creating polished, on-brand documents in minutes.
               Start free — no credit card needed.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
               <Link href="/auth" style={{ textDecoration: "none" }}>
                  <button style={{
                     display: "flex", alignItems: "center", gap: 8,
                     padding: "14px 32px", background: "#0F172A",
                     border: "none", borderRadius: 12, cursor: "pointer",
                     fontSize: 15, fontWeight: 600, color: "#fff",
                     fontFamily: "'DM Sans', system-ui, sans-serif",
                     boxShadow: "0 4px 20px rgba(15,23,42,0.2)",
                     transition: "all 0.15s",
                  }}
                     onMouseEnter={(e) => { (e.currentTarget.style.background = "#1D4ED8"); (e.currentTarget.style.transform = "translateY(-1px)"); }}
                     onMouseLeave={(e) => { (e.currentTarget.style.background = "#0F172A"); (e.currentTarget.style.transform = "none"); }}
                  >
                     Get started free <ArrowRight size={15} />
                  </button>
               </Link>
            </div>
         </div>
      </section>
   );
}




/* ══════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
   return (
      <>
         <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', system-ui, sans-serif; }
        @keyframes floatA {
          0%, 100% { transform: rotate(-4deg) translateY(20px); }
          50%       { transform: rotate(-4deg) translateY(6px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes floatC {
          0%, 100% { transform: rotate(4deg) translateY(20px); }
          50%       { transform: rotate(4deg) translateY(8px); }
        }
      `}</style>

         <PublicNavbar />
         <Hero />
         <LogoBar />
         <BrandSection />
         <TemplatesSection />
         <FeaturesSection />
         <HowItWorks />
         <Testimonials />
         <Pricing />
         <CTABanner />
         <PublicFooter />
      </>
   );
}
