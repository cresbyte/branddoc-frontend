'use client'

import {
    getDefaultVariant,
    svgToDataUrl,
    type IconVariantDetail,
    type IconWithVariants,
} from '@/lib/svgUtils'
import { getIcons } from '@/services/templates'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import React, { useCallback, useMemo, useState } from 'react'
import { HexColorPicker } from 'react-colorful'





interface IconLibraryPanelProps {
    isOpen: boolean
    onClose(): void
    onAddContactBlock(
        variantDetail: IconVariantDetail & { icon_name: string },
        iconColor: string
    ): void
    inlineMode?: boolean
}

// ── Single icon card ────────────────────────────────────
interface IconCardProps {
    icon: IconWithVariants
    onAdd(
        variantDetail: IconVariantDetail & { icon_name: string },
        color: string
    ): void
}

function IconCard({ icon, onAdd }: IconCardProps) {
    const defaultVariant = getDefaultVariant(icon.variants)
    const [selectedVariantId, setSelectedVariantId] = useState(
        defaultVariant?.id ?? ''
    )
    const [iconColor, setIconColor] = useState('#000000')
    const [showColorPicker, setShowColorPicker] = useState(false)

    const selectedVariant = icon.variants.find(
        v => v.id === selectedVariantId
    ) ?? defaultVariant

    const previewUrl = useMemo(() => {
        if (!selectedVariant?.svg_markup) return ''
        return svgToDataUrl(selectedVariant.svg_markup, iconColor)
    }, [selectedVariant, iconColor])

    const handleAdd = useCallback(() => {
        if (!selectedVariant) return
        onAdd(
            { ...selectedVariant, icon_name: icon.name },
            iconColor
        )
    }, [selectedVariant, iconColor, icon.name, onAdd])

    const handleDragStart = (e: React.DragEvent) => {
        if (!selectedVariant) return
        e.dataTransfer.setData('application/contact-block',
            JSON.stringify({
                variantDetail: {
                    ...selectedVariant,
                    icon_name: icon.name
                },
                iconColor,
            })
        )
        e.dataTransfer.effectAllowed = 'copy'
    }

    return (
        <div
            className="rounded-xl border border-gray-200 bg-white
                       p-3 hover:border-blue-300 hover:shadow-sm
                       transition-all cursor-grab active:cursor-grabbing
                       select-none"
            draggable
            onDragStart={handleDragStart}
        >
            {/* Icon name */}
            <p className="text-xs font-semibold text-gray-800
                          mb-2 truncate">
                {icon.name}
            </p>

            {/* Variant tabs */}
            {icon.variants.length > 1 && (
                <div className="flex gap-1 mb-2 flex-wrap">
                    {icon.variants.map(v => (
                        <button
                            key={v.id}
                            onClick={() => setSelectedVariantId(v.id)}
                            className={`px-2 py-0.5 rounded-full
                                       text-[9px] font-medium
                                       transition-colors capitalize ${
                                selectedVariantId === v.id
                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                        >
                            {v.variant}
                        </button>
                    ))}
                </div>
            )}

            {/* Preview: icon alone + contact block preview */}
            <div className="flex items-center gap-2 mb-3">
                {/* Large icon preview */}
                <div className="w-9 h-9 flex items-center
                               justify-center bg-gray-50
                               rounded-lg border border-gray-100
                               flex-shrink-0">
                    {previewUrl
                        ? <img
                            src={previewUrl}
                            className="w-5 h-5"
                            alt={icon.name}
                            draggable={false}
                          />
                        : <div className="w-5 h-5 bg-gray-200
                                         rounded" />
                    }
                </div>

                {/* Contact block preview */}
                <div className="flex items-center gap-1.5
                               flex-1 min-w-0 bg-gray-50
                               rounded-lg px-2 py-1.5
                               border border-gray-100">
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            className="w-3 h-3 flex-shrink-0"
                            draggable={false}
                            alt=""
                        />
                    )}
                    <span className="text-[9px] text-gray-400
                                    truncate">
                        Your {icon.name}
                    </span>
                </div>
            </div>

            {/* Color picker */}
            <div className="relative mb-3">
                <button
                    onClick={() => setShowColorPicker(p => !p)}
                    className="flex items-center gap-2 w-full
                               text-xs text-gray-600
                               hover:text-gray-900 transition-colors"
                >
                    <span
                        className="w-4 h-4 rounded-full
                                   border border-gray-300
                                   flex-shrink-0 shadow-inner"
                        style={{ backgroundColor: iconColor }}
                    />
                    <span className="font-mono text-[10px]
                                    text-gray-500">
                        {iconColor}
                    </span>
                    {showColorPicker
                        ? <ChevronUp size={10} className="ml-auto text-gray-400" />
                        : <ChevronDown size={10} className="ml-auto text-gray-400" />
                    }
                </button>

                {showColorPicker && (
                    <>
                        {/* Backdrop to close picker */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowColorPicker(false)}
                        />
                        <div className="absolute left-0 top-6
                                       z-50 shadow-xl rounded-xl
                                       overflow-hidden border
                                       border-gray-200">
                            <HexColorPicker
                                color={iconColor}
                                onChange={setIconColor}
                            />
                            <div className="bg-white px-3 py-2
                                           border-t border-gray-100">
                                <input
                                    type="text"
                                    value={iconColor}
                                    onChange={e => {
                                        if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value))
                                            setIconColor(e.target.value)
                                    }}
                                    className="w-full text-xs
                                               font-mono border
                                               border-gray-200
                                               rounded-lg px-2 py-1
                                               focus:outline-none
                                               focus:ring-1
                                               focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Add to canvas button */}
            <button
                onClick={handleAdd}
                className="w-full rounded-lg bg-blue-50 py-1.5
                           text-xs font-semibold text-blue-700
                           hover:bg-blue-100 active:bg-blue-200
                           transition-colors"
            >
                + Add to Canvas
            </button>
        </div>
    )
}

// ── Category section ────────────────────────────────────
function CategorySection({
    category,
    icons,
    onAdd
}: {
    category: string
    icons: IconWithVariants[]
    onAdd: IconCardProps['onAdd']
}) {
    const [collapsed, setCollapsed] = useState(false)

    const label = (({
        contact: 'Contact',
        social: 'Social Media',
        document: 'Document',
        misc: 'Miscellaneous',
    }) as any)[category] ?? category

    return (
        <div className="mb-4">
            <button
                onClick={() => setCollapsed(p => !p)}
                className="flex items-center justify-between
                           w-full px-4 py-2 text-xs font-bold
                           uppercase tracking-wider text-gray-500
                           hover:text-gray-700 transition-colors"
            >
                <span>{label}</span>
                <span className="flex items-center gap-1">
                    <span className="text-gray-300 font-normal
                                    normal-case tracking-normal">
                        {icons.length}
                    </span>
                    {collapsed
                        ? <ChevronDown size={12} />
                        : <ChevronUp size={12} />
                    }
                </span>
            </button>

            {!collapsed && (
                <div className="px-3 grid grid-cols-2 gap-2">
                    {icons.map(icon => (
                        <IconCard
                            key={icon.id}
                            icon={icon}
                            onAdd={onAdd}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

// ── Main panel ──────────────────────────────────────────
export default function IconLibraryPanel({
    isOpen,
    onClose,
    onAddContactBlock,
    inlineMode = false,
}: IconLibraryPanelProps) {
    const [search, setSearch] = useState('')

    const { data: iconsData, isLoading } = useQuery({
        queryKey: ['icons'],
        queryFn: () => getIcons(),
        staleTime: 10 * 60 * 1000, // 10 min
        enabled: isOpen,
    })

    const icons: IconWithVariants[] =
        (iconsData as any)?.results ?? iconsData ?? []

    // Filter by search
    const filteredIcons = useMemo(() => {
        if (!search.trim()) return icons
        const q = search.toLowerCase()
        return icons.filter(i => i.name.toLowerCase().includes(q))
    }, [icons, search])

    // Group by category
    const grouped = useMemo(() => {
        const order = ['contact', 'social', 'document', 'misc']
        const map: Record<string, IconWithVariants[]> = {}
        filteredIcons.forEach(icon => {
            if (!map[icon.category]) map[icon.category] = []
            map[icon.category].push(icon)
        })
        // Sort by defined order, then alphabetically for unknown
        return Object.entries(map).sort(([a], [b]) => {
            const ai = order.indexOf(a)
            const bi = order.indexOf(b)
            if (ai === -1 && bi === -1) return a.localeCompare(b)
            if (ai === -1) return 1
            if (bi === -1) return -1
            return ai - bi
        })
    }, [filteredIcons])

    if (!isOpen) return null

    const containerClasses = inlineMode
        ? "flex flex-col h-full w-full bg-transparent overflow-hidden"
        : "absolute left-0 top-0 h-full w-72 bg-white border-r border-gray-200 shadow-2xl z-40 flex flex-col animate-in slide-in-from-left-2 duration-200"

    return (
        <>
            {!inlineMode && (
                <div
                    className="fixed inset-0 z-30 bg-black/10"
                    onClick={onClose}
                />
            )}

            <div
                className={containerClasses}
                onDragOver={e => e.stopPropagation()}
            >
                {!inlineMode && (
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0">
                        <h3 className="text-sm font-bold text-gray-900">Icon Library</h3>
                        <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors">
                            <X size={16} className="text-gray-500" />
                        </button>
                    </div>
                )}

                <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search icons..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col gap-2 px-3 py-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : grouped.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <p className="text-sm font-medium text-gray-500">No icons found</p>
                            <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                        </div>
                    ) : (
                        grouped.map(([category, catIcons]) => (
                            <CategorySection key={category} category={category} icons={catIcons} onAdd={onAddContactBlock} />
                        ))
                    )}
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            `}</style>
        </>
    )
}
