'use client'

import React, { useRef, useEffect, useMemo } from 'react'
import { Group, Image as KonvaImage, Text, Rect, Transformer } from 'react-konva'
import useImage from 'use-image'
import { svgToDataUrl } from '@/lib/svgUtils'
import type { KonvaElement } from '@/hooks/useTemplateCanvas'

interface ContactBlockElementProps {
    element: KonvaElement
    isSelected: boolean
    onSelect(): void
    onChange(changes: Partial<KonvaElement>): void
    onDragMove?(e: any): void
    onDragEnd?(e: any): void
}

export default function ContactBlockElement({
    element,
    isSelected,
    onSelect,
    onChange,
    onDragMove,
    onDragEnd,
}: ContactBlockElementProps) {
    const groupRef = useRef<any>(null)
    const trRef = useRef<any>(null)

    // Build SVG data URL with the chosen icon color
    const svgDataUrl = useMemo(() => {
        if (!element.icon_variant_detail?.svg_markup) return ''
        return svgToDataUrl(
            element.icon_variant_detail.svg_markup,
            element.icon_color || '#000000'
        )
    }, [element.icon_variant_detail, element.icon_color])

    const [iconImg] = useImage(svgDataUrl, 'anonymous')

    // Wire up Konva Transformer when selected
    useEffect(() => {
        if (!trRef.current || !groupRef.current) return
        if (isSelected) {
            trRef.current.nodes([groupRef.current])
            trRef.current.getLayer()?.batchDraw()
        } else {
            trRef.current.nodes([])
            trRef.current.getLayer()?.batchDraw()
        }
    }, [isSelected])

    const handleDragEnd = (e: any) => {
        onChange({ x: e.target.x(), y: e.target.y() })
    }

    const handleTransformEnd = () => {
        const node = groupRef.current
        if (!node) return
        onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(80, node.width() * node.scaleX()),
            height: node.height() * node.scaleY(),
            rotation: node.rotation(),
        })
        node.scaleX(1)
        node.scaleY(1)
    }

    const iconY = (element.height - element.icon_size) / 2
    const textX = element.icon_size + element.icon_text_gap
    const textWidth = Math.max(
        10, 
        element.width - element.icon_size - element.icon_text_gap
    )

    return (
        <>
            <Group
                ref={groupRef}
                x={element.x}
                y={element.y}
                width={element.width}
                height={element.height}
                rotation={element.rotation}
                opacity={element.opacity}
                draggable={!element.is_locked}
                onClick={onSelect}
                onTap={onSelect}
                onDragMove={onDragMove}
                onDragEnd={(e) => {
                    handleDragEnd(e);
                    onDragEnd?.(e);
                }}
                onTransformEnd={handleTransformEnd}
            >
                {/* Hit-area for dragging (invisible but captures events) */}
                <Rect
                    width={element.width}
                    height={element.height}
                    fill="transparent"
                    onMouseDown={onSelect}
                />

                {/* Icon image */}
                {iconImg && (
                    <KonvaImage
                        x={0}
                        y={iconY}
                        width={element.icon_size}
                        height={element.icon_size}
                        image={iconImg}
                        listening={false}
                    />
                )}

                {/* Fallback placeholder if icon not loaded */}
                {!iconImg && (
                    <Rect
                        x={0}
                        y={iconY}
                        width={element.icon_size}
                        height={element.icon_size}
                        fill={element.icon_color || '#cccccc'}
                        cornerRadius={2}
                        opacity={0.4}
                        listening={false}
                    />
                )}

                {/* Text label */}
                <Text
                    x={textX}
                    y={0}
                    width={textWidth}
                    height={element.height}
                    text={element.content || element.placeholder_hint || ''}
                    fontSize={element.font_size || 11}
                    fontFamily={element.font_family || 'Inter'}
                    fontStyle={
                        `${element.font_style || 'normal'} ` +
                        `${element.font_weight || 'normal'}`
                    }
                    fill={element.color || '#333333'}
                    verticalAlign="middle"
                    listening={false}
                />

                {/* Selection border overlay */}
                {isSelected && (
                    <Rect
                        x={-2}
                        y={-2}
                        width={element.width + 4}
                        height={element.height + 4}
                        stroke="#3b82f6"
                        strokeWidth={1.5}
                        dash={[4, 3]}
                        fill="transparent"
                        listening={false}
                    />
                )}
            </Group>

            {/* Transformer — horizontal resize only */}
            <Transformer
                ref={trRef}
                enabledAnchors={['middle-left', 'middle-right']}
                boundBoxFunc={(oldBox, newBox) => ({
                    ...newBox,
                    // Prevent making too narrow
                    width: Math.max(80, newBox.width),
                    // Lock height during resize
                    height: oldBox.height,
                })}
                rotateEnabled={true}
                borderStroke="#3b82f6"
                borderStrokeWidth={1}
                anchorStroke="#3b82f6"
                anchorFill="white"
                anchorSize={8}
            />
        </>
    )
}
