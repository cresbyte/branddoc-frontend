import React from 'react';
import { BrandData } from '../../../lib/types';

interface SignatureProps {
  brandData: BrandData;
}

/**
 * Pure function that generates valid, table-based HTML for the signature.
 * Safe for email clients.
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
    primaryColor,
    secondaryColor,
    logoUrl
  } = brandData;

  const fontStack = 'Inter, Arial, sans-serif';
  const logoSrc = logoUrl || 'https://via.placeholder.com/48?text=Logo';

  return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${fontStack}; line-height: 1.4;">
  <tr>
    <td valign="top" style="padding-right: 20px; border-right: 2px solid ${primaryColor};">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="padding-bottom: 12px;">
            <img src="${logoSrc}" alt="${companyName} Logo" width="48" style="display: block; max-height: 48px; border-radius: 4px;" />
          </td>
        </tr>
        <tr>
          <td align="center" style="font-size: 14px; font-weight: bold; color: #111827; margin: 0;">
            ${companyName}
          </td>
        </tr>
        ${tagline ? `
        <tr>
          <td align="center" style="font-size: 10px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; padding-top: 4px;">
            ${tagline}
          </td>
        </tr>` : ''}
      </table>
    </td>
    <td valign="top" style="padding-left: 20px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size: 18px; font-weight: bold; color: #111827; padding-bottom: 2px;">
            ${yourName}
          </td>
        </tr>
        <tr>
          <td style="font-size: 14px; font-weight: 500; color: ${primaryColor}; padding-bottom: 12px;">
            ${jobTitle}
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 12px;">
            <table cellpadding="0" cellspacing="0" border="0" style="font-size: 12px; color: #4B5563;">
              <tr>
                ${phone ? `<td style="padding-right: 12px;"><a href="tel:${phone.replace(/\s+/g, '')}" style="color: #4B5563; text-decoration: none;">${phone}</a></td>` : ''}
                ${phone && email ? `<td style="padding-right: 12px; color: #D1D5DB;">|</td>` : ''}
                ${email ? `<td style="padding-right: 12px;"><a href="mailto:${email}" style="color: #4B5563; text-decoration: none;">${email}</a></td>` : ''}
                ${(phone || email) && website ? `<td style="padding-right: 12px; color: #D1D5DB;">|</td>` : ''}
                ${website ? `<td><a href="${website.startsWith('http') ? website : `https://${website}`}" style="color: #4B5563; text-decoration: none;">${website}</a></td>` : ''}
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right: 8px;">
                  <a href="#">
                    <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="16" style="display: block;" />
                  </a>
                </td>
                <td style="padding-right: 8px;">
                  <a href="#">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733590.png" alt="Twitter" width="16" style="display: block;" />
                  </a>
                </td>
                <td>
                  <a href="${website.startsWith('http') ? website : `https://${website}`}">
                    <img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" alt="Website" width="16" style="display: block;" />
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding-top: 24px;">
      <p style="font-size: 9px; color: #9CA3AF; margin: 0; font-style: italic; max-width: 500px;">
        This email and any attachments are confidential and may also be privileged. If you are not the intended recipient, please delete all copies and notify the sender immediately.
      </p>
    </td>
  </tr>
</table>
  `.trim();
}

/**
 * Apex Corporate Signature Template
 * Renders the HTML signature string directly safely for previewing inside the browser.
 */
export default function ApexCorporateSignature({ brandData }: SignatureProps) {
  // Rather than duplicating layout code, we use the pure generator function 
  // to power the preview. This ensures the preview matches exactly what is generated.
  const html = generateSignatureHTML(brandData);

  return (
    <div 
      className="bg-white p-6 rounded"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
