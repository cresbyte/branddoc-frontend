import React from 'react';
import { BrandData } from '../../../lib/types';

interface SignatureProps {
  brandData: BrandData;
}

/**
 * Pure function that generates valid, table-based HTML for the Lex Legal signature.
 * Safe for email clients. Single column structure.
 */
export function generateSignatureHTML(brandData: BrandData): string {
  const {
    companyName,
    tagline,
    yourName,
    jobTitle,
    email,
    phone,
    website,
    address,
    primaryColor,
    secondaryColor,
    logoUrl
  } = brandData;

  const fontStack = 'Georgia, "Times New Roman", serif';
  const logoSrc = logoUrl || 'https://via.placeholder.com/64?text=Logo';

  return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${fontStack}; line-height: 1.6; max-width: 400px;">
  <tr>
    <td style="border-top: 4px solid ${secondaryColor}; padding-top: 16px; padding-bottom: 24px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td align="center" style="padding-bottom: 16px;">
            <img src="${logoSrc}" alt="${companyName} Logo" width="60" style="display: block; max-height: 60px;" />
          </td>
        </tr>
        <tr>
          <td align="center" style="font-size: 16px; font-weight: bold; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px;">
            ${companyName}
          </td>
        </tr>
        ${tagline ? `
        <tr>
          <td align="center" style="font-size: 11px; color: #6B7280; font-style: italic; padding-top: 4px;">
            ${tagline}
          </td>
        </tr>` : ''}
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding-bottom: 24px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td align="center" style="font-size: 18px; font-weight: bold; color: #111827;">
            ${yourName}
          </td>
        </tr>
        <tr>
          <td align="center" style="font-size: 14px; color: ${secondaryColor}; font-style: italic;">
            ${jobTitle}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="border-top: 1px solid #E5E7EB; padding-top: 16px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size: 12px; color: #4B5563;">
        ${phone ? `
        <tr>
          <td align="center" style="padding-bottom: 4px;">
            <strong>T:</strong> <a href="tel:${phone.replace(/\s+/g, '')}" style="color: #4B5563; text-decoration: none;">${phone}</a>
          </td>
        </tr>` : ''}
        ${email ? `
        <tr>
          <td align="center" style="padding-bottom: 4px;">
            <strong>E:</strong> <a href="mailto:${email}" style="color: #4B5563; text-decoration: none;">${email}</a>
          </td>
        </tr>` : ''}
        ${website ? `
        <tr>
          <td align="center" style="padding-bottom: 4px;">
            <strong>W:</strong> <a href="${website.startsWith('http') ? website : `https://${website}`}" style="color: ${secondaryColor}; text-decoration: none;">${website}</a>
          </td>
        </tr>` : ''}
        ${address ? `
        <tr>
          <td align="center" style="padding-top: 8px; font-size: 10px; color: #9CA3AF;">
            ${address}
          </td>
        </tr>` : ''}
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding-top: 24px;">
      <p style="font-size: 10px; color: #9CA3AF; margin: 0; text-align: justify; line-height: 1.4;">
        CONFIDENTIALITY NOTICE: This message is strictly confidential and intended solely for the use of the individual or entity to which it is addressed. If you have received this communication in error, please notify us immediately and delete the original message.
      </p>
    </td>
  </tr>
</table>
  `.trim();
}

/**
 * Lex Legal Signature Template
 */
export default function LexLegalSignature({ brandData }: SignatureProps) {
  const html = generateSignatureHTML(brandData);

  return (
    <div 
      className="bg-white p-6 rounded flex justify-center"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
