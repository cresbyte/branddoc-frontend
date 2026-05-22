/**
 * Converts an SVG markup string to a base64 data URL.
 * Replaces 'currentColor' with the provided color.
 * Used to render SVG icons in Konva Image nodes.
 */
export function svgToDataUrl(
    svgMarkup: string, 
    color: string = '#000000'
): string {
    if (!svgMarkup) return ''
    const colored = svgMarkup.replace(/currentColor/g, color)
    // btoa requires ASCII — encode special chars
    const encoded = unescape(encodeURIComponent(colored))
    return `data:image/svg+xml;base64,${btoa(encoded)}`
}

/**
 * Returns the default variant from a variants array,
 * or the first variant if none is marked default.
 */
export function getDefaultVariant(
    variants: IconVariantDetail[]
): IconVariantDetail | null {
    if (!variants || variants.length === 0) return null
    return variants.find(v => v.is_default) ?? variants[0]
}

// Types used across icon components
export interface IconVariantDetail {
    id: string
    variant: string
    svg_markup: string
    is_default: boolean
    icon_name?: string
}

export interface IconWithVariants {
    id: string
    name: string
    slug: string
    category: string
    variants: IconVariantDetail[]
}
