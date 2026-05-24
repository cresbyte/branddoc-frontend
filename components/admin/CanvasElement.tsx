import React, { useRef, useEffect } from 'react';
import { Group, Rect, Text, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import { KonvaElement } from '@/hooks/useTemplateCanvas';
import ContactBlockElement from './ContactBlockElement';

interface CanvasElementProps {
  element: KonvaElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (changes: Partial<KonvaElement>) => void;
  onDragMove?: (e: any) => void;
  onDragEnd?: (e: any) => void;
  onDoubleClick?: () => void;
}

export default React.memo(function CanvasElement({
  element,
  isSelected,
  onSelect,
  onChange,
  onDragMove,
  onDragEnd,
  onDoubleClick,
}: CanvasElementProps) {
  // Delegate contact_block entirely to its own component
  if (element.element_type === 'contact_block') {
    return (
      <ContactBlockElement
        element={element}
        isSelected={isSelected}
        onSelect={onSelect}
        onChange={onChange}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
      />
    );
  }

  const shapeRef = useRef<any>(null);
  const transformRef = useRef<any>(null);
  const [img] = useImage(element.asset_url || '', 'anonymous');

  useEffect(() => {
    if (isSelected && transformRef.current && shapeRef.current) {
      transformRef.current.nodes([shapeRef.current]);
      transformRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e: any) => {
    onChange({ x: e.target.x(), y: e.target.y() });
  };

  const handleTransformEnd = () => {
    if (!shapeRef.current) return;
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    onChange({
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      rotation: node.rotation(),
    });
  };

  const commonProps = {
    ref: shapeRef,
    x: element.x,
    y: element.y,
    rotation: element.rotation,
    draggable: !element.is_locked,
    onDragMove,
    onDragEnd: (e: any) => {
      handleDragEnd(e);
      onDragEnd?.(e);
    },
    onTransformEnd: handleTransformEnd,
    onClick: onSelect,
    onTap: onSelect,
    opacity: element.opacity,
  };

  const renderShape = () => {
    switch (element.element_type) {
      case 'text':
        return (
          <Text
            {...commonProps}
            text={element.content || element.placeholder_hint || 'New Text'}
            fontSize={element.font_size}
            fontFamily={element.font_family}
            fontStyle={`${element.font_style} ${element.font_weight === 'bold' ? 'bold' : ''}`.trim() || 'normal'}
            fill={element.color}
            width={element.width}
            height={element.height}
            align={element.text_align}
            lineHeight={element.line_height}
            letterSpacing={element.letter_spacing}
            onDblClick={onDoubleClick}
            onDblTap={onDoubleClick}
          />
        );
      case 'shape':
        return (
          <Rect
            {...commonProps}
            width={element.width}
            height={element.height}
            fill={element.background_color}
            cornerRadius={element.border_radius}
          />
        );
      case 'line':
        return (
          <Rect
            {...commonProps}
            width={element.width}
            height={Math.max(element.height, 2)}
            fill={element.background_color}
          />
        );
      case 'image':
      case 'svg':
        if (img) {
          return (
            <KonvaImage
              {...commonProps}
              image={img}
              width={element.width}
              height={element.height}
            />
          );
        }
        return (
          <Rect
            {...commonProps}
            width={element.width}
            height={element.height}
            fill="#f3f4f6"
            stroke="#d1d5db"
            strokeWidth={1}
            dash={[5, 5]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderShape()}
      {isSelected && !element.is_locked && (
        <Transformer
          ref={transformRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
});
