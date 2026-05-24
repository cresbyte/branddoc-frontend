/**
 * svgColorUtils.ts
 * Utilities for detecting and replacing colors in SVG files,
 * mimicking Canva-style SVG color editing.
 */

const COLOR_ATTRS = ['fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color'];

/** Normalize any color value to lowercase hex6. Returns null if unparseable. */
function normalizeColor(raw: string): string | null {
  const s = raw.trim().toLowerCase();
  if (!s || s === 'none' || s === 'transparent' || s === 'currentcolor') return null;

  // Already #rrggbb or #rgb
  if (/^#([0-9a-f]{3}){1,2}$/.test(s)) {
    if (s.length === 4) {
      // expand #rgb → #rrggbb
      return '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
    }
    return s;
  }

  // rgb(r, g, b)
  const rgbMatch = s.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (rgbMatch) {
    return '#' + [rgbMatch[1], rgbMatch[2], rgbMatch[3]]
      .map(n => parseInt(n).toString(16).padStart(2, '0'))
      .join('');
  }

  // Named colors - browser-parseable
  return null;
}

/**
 * Extract all unique fill/stroke colors from raw SVG text.
 * Returns an array of normalized lowercase hex colors.
 */
export function extractSvgColors(svgText: string): string[] {
  const found = new Set<string>();

  // 1. Match XML attribute values: fill="#..." stroke="rgb(...)"
  const attrRegex = new RegExp(
    `(?:${COLOR_ATTRS.join('|')})\\s*=\\s*["']([^"']+)["']`,
    'gi'
  );
  let m: RegExpExecArray | null;
  while ((m = attrRegex.exec(svgText)) !== null) {
    const normalized = normalizeColor(m[1]);
    if (normalized) found.add(normalized);
  }

  // 2. Match inline style: style="fill:#...; stroke:rgb(...);"
  const styleRegex = /style\s*=\s*["']([^"']+)["']/gi;
  while ((m = styleRegex.exec(svgText)) !== null) {
    const styleBlock = m[1];
    COLOR_ATTRS.forEach(attr => {
      const propRegex = new RegExp(`${attr}\\s*:\\s*([^;}"']+)`, 'gi');
      let pm: RegExpExecArray | null;
      while ((pm = propRegex.exec(styleBlock)) !== null) {
        const normalized = normalizeColor(pm[1]);
        if (normalized) found.add(normalized);
      }
    });
  }

  // 3. Match embedded <style> blocks: .cls-1 { fill: #...; }
  const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  while ((m = styleTagRegex.exec(svgText)) !== null) {
    const cssBlock = m[1];
    COLOR_ATTRS.forEach(attr => {
      const propRegex = new RegExp(`${attr}\\s*:\\s*([^;}"']+)`, 'gi');
      let pm: RegExpExecArray | null;
      while ((pm = propRegex.exec(cssBlock)) !== null) {
        const normalized = normalizeColor(pm[1]);
        if (normalized) found.add(normalized);
      }
    });
  }

  return Array.from(found);
}

/**
 * Replace all occurrences of oldColor with newColor in SVG text.
 * Handles hex, rgb() and named color variants matched during extraction.
 */
export function recolorSvgText(svgText: string, oldColor: string, newColor: string): string {
  // We replace the normalized hex form (and short form if applicable)
  const old6 = oldColor.toLowerCase();
  // Also handle the 3-char shorthand
  const isExpandable =
    old6[1] === old6[2] && old6[3] === old6[4] && old6[5] === old6[6];
  const old3 = isExpandable
    ? '#' + old6[1] + old6[3] + old6[5]
    : null;

  let result = svgText;

  // Replace attribute values like fill="#color" or fill='#color'
  COLOR_ATTRS.forEach(attr => {
    // Double-quote
    result = result.replace(
      new RegExp(`(${attr}\\s*=\\s*["'])${escapeRegex(old6)}(["'])`, 'gi'),
      `$1${newColor}$2`
    );
    if (old3) {
      result = result.replace(
        new RegExp(`(${attr}\\s*=\\s*["'])${escapeRegex(old3)}(["'])`, 'gi'),
        `$1${newColor}$2`
      );
    }
    // Inside style attributes and <style> blocks
    result = result.replace(
      new RegExp(`(${attr}\\s*:\\s*)${escapeRegex(old6)}`, 'gi'),
      `$1${newColor}`
    );
    if (old3) {
      result = result.replace(
        new RegExp(`(${attr}\\s*:\\s*)${escapeRegex(old3)}`, 'gi'),
        `$1${newColor}`
      );
    }
  });

  return result;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Fetch an SVG from a URL (or data URI) and return its raw text. */
export async function fetchSvgText(url: string): Promise<string> {
  if (url.startsWith('data:')) {
    // data:image/svg+xml;base64,...  or  data:image/svg+xml;charset=utf-8,...
    const [header, ...rest] = url.split(',');
    const body = rest.join(',');
    if (header.includes('base64')) {
      return atob(body);
    }
    return decodeURIComponent(body);
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch SVG: ${res.status}`);
  return res.text();
}

/** Convert raw SVG text → a data URI that can be used as an <img src>. */
export function svgTextToDataUrl(svgText: string): string {
  // Use base64 to avoid charset issues
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgText)))}`;
}
