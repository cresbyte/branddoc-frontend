import React from 'react';
import { BrandData } from '../../../lib/types';

interface SignatureProps {
  brandData: BrandData;
}

/**
 * Generates email-safe HTML for Apex Corporate signature.
 * Table-based layout, all inline styles, no modern CSS.
 */
export function generateSignatureHTML(brandData: BrandData): string {
  const {
    companyName, tagline, yourName, jobTitle,
    email, phone, website, primaryColor, secondaryColor, logoUrl,
  } = brandData;

  const fontStack = "'Inter', 'Segoe UI', Arial, sans-serif";
  const logoSrc = logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=${primaryColor.replace('#', '')}&color=fff&size=48&bold=true&font-size=0.4`;

  return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${fontStack}; line-height: 1.4; max-width: 480px;">
  <tr>
    <td style="padding-bottom: 16px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td valign="middle" style="padding-right: 16px;">
            <img src="${logoSrc}" alt="${companyName}" width="48" height="48" style="display: block; border-radius: 6px;" />
          </td>
          <td valign="middle" style="border-left: 3px solid ${primaryColor}; padding-left: 16px;">
            <p style="margin: 0; font-size: 17px; font-weight: 700; color: #111827;">${yourName}</p>
            <p style="margin: 2px 0 0; font-size: 13px; font-weight: 500; color: ${primaryColor};">${jobTitle}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="border-top: 2px solid ${secondaryColor}; padding-top: 12px; padding-bottom: 12px;">
      <table cellpadding="0" cellspacing="0" border="0" style="font-size: 12px; color: #4B5563;">
        <tr>
          ${phone ? `<td style="padding-right: 10px;"><a href="tel:${phone.replace(/\s+/g, '')}" style="color: #4B5563; text-decoration: none;">☎ ${phone}</a></td><td style="padding-right: 10px; color: #D1D5DB;">|</td>` : ''}
          ${email ? `<td style="padding-right: 10px;"><a href="mailto:${email}" style="color: #4B5563; text-decoration: none;">✉ ${email}</a></td><td style="padding-right: 10px; color: #D1D5DB;">|</td>` : ''}
          ${website ? `<td><a href="${website.startsWith('http') ? website : `https://${website}`}" style="color: ${primaryColor}; text-decoration: none; font-weight: 600;">⌂ ${website}</a></td>` : ''}
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding-top: 4px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size: 13px; font-weight: 700; color: #111827;">${companyName}</td>
          ${tagline ? `<td style="padding-left: 10px; font-size: 10px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.5px;">— ${tagline}</td>` : ''}
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding-top: 16px;">
      <p style="font-size: 9px; color: #9CA3AF; margin: 0; font-style: italic; max-width: 460px; line-height: 1.4;">
        This email and any attachments are confidential and intended solely for the addressee. If received in error, please delete all copies and notify the sender immediately.
      </p>
    </td>
  </tr>
</table>`.trim();
}

/**
 * Apex Corporate Signature — React preview component.
 */
export default function ApexCorporateSignature({ brandData }: SignatureProps) {
  const html = generateSignatureHTML(brandData);
  return (
    <div className="bg-white p-6 rounded" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
