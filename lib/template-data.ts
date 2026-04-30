export const sampleBrand = {
  companyName: "Acme Studio",
  tagline: "Quality you can trust",
  email: "hello@acme.com",
  phone: "+1 234 567 8900",
  website: "https://acme.com",
  address: "123 Creative Lane, New York, USA",
  primaryColor: "#1a1a1a",
  secondaryColor: "#4f46e5",
  font: "Poppins",
  industry: "Freelancer / Creative",
  initials: "AS",
}

export type LetterheadTemplate = {
  id: string
  name: string
  description: string
  style: string
  compatibleWith: string[]
  price: number
  category: "letterhead"
}

export type SpreadsheetTemplate = {
  id: string
  name: string
  description: string
  style: string
  compatibleWith: string[]
  price: number
  category: "spreadsheet"
}

export type KitTemplate = {
  id: string
  name: string
  description: string
  includes: string[]
  compatibleWith: string[]
  price: number
  badge: string
  category: "kit"
}

export type AnyTemplate = LetterheadTemplate | SpreadsheetTemplate | KitTemplate

export const letterheadTemplates: LetterheadTemplate[] = [
  {
    id: "lh-001",
    name: "Executive",
    description: "Full-width dark header bar with logo left, contact right",
    style: "bold",
    compatibleWith: ["Word", "Google Docs"],
    price: 4.99,
    category: "letterhead",
  },
  {
    id: "lh-002",
    name: "Minimal Line",
    description: "Company name large left, thin colored rule below",
    style: "minimal",
    compatibleWith: ["Word", "Google Docs"],
    price: 4.99,
    category: "letterhead",
  },
  {
    id: "lh-003",
    name: "Centered Classic",
    description: "Logo centered, contact info centered below, formal",
    style: "classic",
    compatibleWith: ["Word", "Google Docs"],
    price: 4.99,
    category: "letterhead",
  },
  {
    id: "lh-004",
    name: "Split Modern",
    description: "Logo top left, colored sidebar accent on left edge",
    style: "modern",
    compatibleWith: ["Word", "Google Docs"],
    price: 4.99,
    category: "letterhead",
  },
  {
    id: "lh-005",
    name: "Compact Top",
    description: "Single line header, all contact info inline",
    style: "compact",
    compatibleWith: ["Word", "Google Docs"],
    price: 4.99,
    category: "letterhead",
  },
  {
    id: "lh-006",
    name: "Editorial",
    description: "Large company name as watermark-style background element",
    style: "editorial",
    compatibleWith: ["Word", "Google Docs"],
    price: 4.99,
    category: "letterhead",
  },
]

export const spreadsheetTemplates: SpreadsheetTemplate[] = [
  {
    id: "ss-001",
    name: "Invoice Sheet",
    description: "Pre-built invoice table with SUM formulas, branded header",
    style: "invoice",
    compatibleWith: ["Excel", "Google Sheets"],
    price: 4.99,
    category: "spreadsheet",
  },
  {
    id: "ss-002",
    name: "Receipt Sheet",
    description: "Clean receipt layout with totals, branded header",
    style: "receipt",
    compatibleWith: ["Excel", "Google Sheets"],
    price: 4.99,
    category: "spreadsheet",
  },
  {
    id: "ss-003",
    name: "Quotation Sheet",
    description: "Quotation/estimate table with line items and totals",
    style: "quote",
    compatibleWith: ["Excel", "Google Sheets"],
    price: 4.99,
    category: "spreadsheet",
  },
  {
    id: "ss-004",
    name: "Expense Report",
    description: "Expense tracking table with categories and totals",
    style: "expense",
    compatibleWith: ["Excel", "Google Sheets"],
    price: 4.99,
    category: "spreadsheet",
  },
]

export const kitTemplates: KitTemplate[] = [
  {
    id: "kit-001",
    name: "Starter Business Kit",
    description: "Letterhead + Invoice template + Receipt template",
    includes: ["Letterhead (Executive)", "Invoice Sheet", "Receipt Sheet"],
    compatibleWith: ["Word", "Excel", "Google Docs", "Google Sheets"],
    price: 9.99,
    badge: "Best value",
    category: "kit",
  },
  {
    id: "kit-002",
    name: "Freelancer Kit",
    description: "Letterhead + Quotation template + Invoice template",
    includes: ["Letterhead (Minimal Line)", "Quotation Sheet", "Invoice Sheet"],
    compatibleWith: ["Word", "Excel", "Google Docs", "Google Sheets"],
    price: 9.99,
    badge: "Popular",
    category: "kit",
  },
  {
    id: "kit-003",
    name: "Full Brand Kit",
    description: "All 6 letterhead designs + all 4 spreadsheet templates",
    includes: ["6 Letterhead designs", "4 Spreadsheet templates", "Email signature"],
    compatibleWith: ["Word", "Excel", "Google Docs", "Google Sheets"],
    price: 19.99,
    badge: "Complete",
    category: "kit",
  },
]
