import React from 'react';
import { BrandData } from '../../../lib/types';

interface SignatureProps {
  brandData: BrandData;
}

/**
 * Generates email-safe HTML for Vivid Creative signature.
 * Bold, modern two-column layout with accent color blocks.
 */
export function generateSignatureHTML(brandData: BrandData): string {
  const {
    companyName, tagline, yourName, jobTitle,
    email, phone, website,
    primaryColor, secondaryColor, logoUrl,
  } = brandData;

  const fontStack = "'Inter', 'Segoe UI', Arial, sans-serif";
  const logoSrc = logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=${primaryColor.replace('#', '')}&color=fff&size=48&bold=true&font-size=0.4`;

  return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${fontStack}; line-height: 1.4; max-width: 500px;">
  <tr>
    <td style="padding-bottom: 12px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td valign="top" style="padding-right: 16px;">
            <div style="background-color: ${primaryColor}; border-radius: 8px; padding: 4px;">
              <img src="${logoSrc}" alt="${companyName}" width="44" height="44" style="display: block; border-radius: 6px;" />
            </div>
          </td>
          <td valign="middle">
            <p style="margin: 0; font-size: 18px; font-weight: 800; color: #111827; letter-spacing: -0.3px;">${yourName}</p>
            <p style="margin: 2px 0 0; font-size: 12px; font-weight: 600; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px;">${jobTitle}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td>
      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
        <tr>
          <td style="width: 4px; background-color: ${primaryColor}; border-radius: 2px;"></td>
          <td style="padding: 10px 0 10px 12px;">
            <table cellpadding="0" cellspacing="0" border="0" style="font-size: 12px; color: #4B5563;">
              ${phone ? `<tr><td style="padding-bottom: 2px;"><a href="tel:${phone.replace(/\s+/g, '')}" style="color: #4B5563; text-decoration: none;">${phone}</a></td></tr>` : ''}
              ${email ? `<tr><td style="padding-bottom: 2px;"><a href="mailto:${email}" style="color: #4B5563; text-decoration: none;">${email}</a></td></tr>` : ''}
              ${website ? `<tr><td><a href="${website.startsWith('http') ? website : `https://${website}`}" style="color: ${primaryColor}; text-decoration: none; font-weight: 700;">${website}</a></td></tr>` : ''}
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding-top: 12px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background: ${secondaryColor}; padding: 6px 12px; border-radius: 4px;">
            <span style="font-size: 11px; font-weight: 700; color: white; letter-spacing: 0.5px;">${companyName}</span>
            ${tagline ? `<span style="font-size: 9px; color: rgba(255,255,255,0.7); margin-left: 8px;">— ${tagline}</span>` : ''}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding-top: 14px;">
      <p style="font-size: 9px; color: #9CA3AF; margin: 0; font-style: italic; line-height: 1.4;">
        This email is confidential. If received in error, please delete and notify the sender.
      </p>
    </td>
  </tr>
</table>`.trim();
}

/**
 * Vivid Creative Signature — React preview component.
 */
export default function VividCreativeSignature({ brandData }: SignatureProps) {
  const html = generateSignatureHTML(brandData);
  return (
    <div className="bg-white p-6 rounded" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
