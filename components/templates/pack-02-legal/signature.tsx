import React from 'react';
import { BrandData } from '../../../lib/types';

interface SignatureProps {
  brandData: BrandData;
}

/**
 * Generates email-safe HTML for Lex Legal signature.
 * Formal single-column layout with stacked contact details.
 */
export function generateSignatureHTML(brandData: BrandData): string {
  const {
    companyName, tagline, yourName, jobTitle,
    email, phone, website, address,
    primaryColor, secondaryColor, logoUrl,
  } = brandData;

  const fontStack = "Georgia, 'Times New Roman', serif";
  const logoSrc = logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=${primaryColor.replace('#', '')}&color=fff&size=56&bold=true&font-size=0.35`;

  return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${fontStack}; line-height: 1.5; max-width: 380px;">
  <tr>
    <td style="border-top: 4px solid ${secondaryColor}; padding-top: 16px; padding-bottom: 12px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td valign="middle" align="center" style="padding-bottom: 12px;">
            <img src="${logoSrc}" alt="${companyName}" width="56" height="56" style="display: block;" />
          </td>
        </tr>
        <tr>
          <td align="center" style="font-size: 15px; font-weight: bold; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 2px;">
            ${companyName}
          </td>
        </tr>
        ${tagline ? `
        <tr>
          <td align="center" style="font-size: 10px; color: #6B7280; font-style: italic; padding-top: 4px; letter-spacing: 0.5px;">
            ${tagline}
          </td>
        </tr>` : ''}
      </table>
    </td>
  </tr>
  <tr>
    <td style="border-top: 1px solid #E5E7EB; padding: 14px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td align="center" style="font-size: 17px; font-weight: bold; color: #111827;">
            ${yourName}
          </td>
        </tr>
        <tr>
          <td align="center" style="font-size: 13px; color: ${secondaryColor}; font-style: italic; padding-top: 2px;">
            ${jobTitle}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="border-top: 1px solid #E5E7EB; padding-top: 12px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size: 11px; color: #4B5563;">
        ${phone ? `<tr><td align="center" style="padding-bottom: 3px;"><strong style="color: ${primaryColor};">T</strong>&nbsp;&nbsp;<a href="tel:${phone.replace(/\s+/g, '')}" style="color: #4B5563; text-decoration: none;">${phone}</a></td></tr>` : ''}
        ${email ? `<tr><td align="center" style="padding-bottom: 3px;"><strong style="color: ${primaryColor};">E</strong>&nbsp;&nbsp;<a href="mailto:${email}" style="color: #4B5563; text-decoration: none;">${email}</a></td></tr>` : ''}
        ${website ? `<tr><td align="center" style="padding-bottom: 3px;"><strong style="color: ${primaryColor};">W</strong>&nbsp;&nbsp;<a href="${website.startsWith('http') ? website : `https://${website}`}" style="color: ${secondaryColor}; text-decoration: none;">${website}</a></td></tr>` : ''}
        ${address ? `<tr><td align="center" style="padding-top: 6px; font-size: 10px; color: #9CA3AF;">${address}</td></tr>` : ''}
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding-top: 16px; border-top: 1px solid #E5E7EB; margin-top: 12px;">
      <p style="font-size: 9px; color: #9CA3AF; margin: 0; text-align: center; line-height: 1.4; font-style: italic;">
        CONFIDENTIALITY NOTICE: This message is strictly confidential. If received in error, please notify us immediately and delete the original message.
      </p>
    </td>
  </tr>
</table>`.trim();
}

/**
 * Lex Legal Signature — React preview component.
 */
export default function LexLegalSignature({ brandData }: SignatureProps) {
  const html = generateSignatureHTML(brandData);
  return (
    <div className="bg-white p-6 rounded flex justify-center" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
