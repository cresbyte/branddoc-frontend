import React from 'react';
import { BrandData } from '../../../lib/types';

interface SignatureProps {
  brandData: BrandData;
}

/**
 * Generates email-safe HTML for Horizon Real Estate signature.
 */
export function generateSignatureHTML(brandData: BrandData): string {
  const {
    companyName, tagline, yourName, jobTitle,
    email, phone, website, address,
    primaryColor, secondaryColor, logoUrl,
  } = brandData;

  const fontStack = "'Inter', 'Segoe UI', Arial, sans-serif";
  const logoSrc = logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=${primaryColor.replace('#', '')}&color=fff&size=48&rounded=true&bold=true&font-size=0.4`;

  return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${fontStack}; line-height: 1.5; max-width: 500px;">
  <tr>
    <td style="padding-bottom: 14px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td valign="middle" style="padding-right: 14px;">
            <img src="${logoSrc}" alt="${companyName}" width="48" height="48" style="display: block; border-radius: 50%;" />
          </td>
          <td valign="middle">
            <p style="margin: 0; font-size: 16px; font-weight: 700; color: #111827;">${yourName}</p>
            <p style="margin: 1px 0 0; font-size: 12px; color: ${primaryColor}; font-weight: 500;">${jobTitle}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="border-top: 3px solid ${primaryColor}; padding-top: 10px; padding-bottom: 10px;">
      <table cellpadding="0" cellspacing="0" border="0" style="font-size: 12px; color: #4B5563;">
        <tr>
          ${phone ? `<td style="padding-right: 8px;"><a href="tel:${phone.replace(/\s+/g, '')}" style="color: #4B5563; text-decoration: none;">${phone}</a></td><td style="padding-right: 8px; color: ${secondaryColor};">•</td>` : ''}
          ${email ? `<td style="padding-right: 8px;"><a href="mailto:${email}" style="color: #4B5563; text-decoration: none;">${email}</a></td><td style="padding-right: 8px; color: ${secondaryColor};">•</td>` : ''}
          ${website ? `<td><a href="${website.startsWith('http') ? website : `https://${website}`}" style="color: ${primaryColor}; text-decoration: none; font-weight: 600;">${website}</a></td>` : ''}
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="border-top: 1px solid #E5E7EB; padding-top: 10px;">
      <p style="margin: 0; font-size: 13px; font-weight: 700; color: ${primaryColor};">${companyName}</p>
      ${tagline ? `<p style="margin: 2px 0 0; font-size: 10px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.5px;">${tagline}</p>` : ''}
      ${address ? `<p style="margin: 6px 0 0; font-size: 10px; color: #9CA3AF;">${address}</p>` : ''}
    </td>
  </tr>
  <tr>
    <td style="padding-top: 14px;">
      <p style="font-size: 9px; color: #9CA3AF; margin: 0; font-style: italic; line-height: 1.4;">
        This email and any attachments are confidential. If received in error, please delete all copies and notify the sender.
      </p>
    </td>
  </tr>
</table>`.trim();
}

/**
 * Horizon Real Estate Signature — React preview component.
 */
export default function HorizonRealEstateSignature({ brandData }: SignatureProps) {
  const html = generateSignatureHTML(brandData);
  return (
    <div className="bg-white p-6 rounded" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
