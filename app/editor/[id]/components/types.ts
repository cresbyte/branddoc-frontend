export type BlockType =
  | "heading"
  | "subheading"
  | "paragraph"
  | "bullet-list"
  | "numbered-list"
  | "blockquote"
  | "divider"
  | "spacer"
  | "two-columns"
  | "three-columns"
  | "table"
  | "image-placeholder"
  | "button"
  | "signature"
  | "brand-color-bar"
  | "company-stamp";

export interface Block {
  id: string;
  type: BlockType;
  content: any;
  style: any;
}

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
  initials: "AS",
};
