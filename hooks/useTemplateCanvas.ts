import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  adminGetElements, 
  adminAddElement, 
  adminUpdateElement, 
  adminDeleteElement 
} from '@/services/templates';

export interface KonvaElement {
  id: string;
  element_type: 'text' | 'image' | 'svg' | 'shape' | 'line';
  x: number;        // pixels on canvas
  y: number;
  width: number;
  height: number;
  z_index: number;
  rotation: number;
  // text
  content: string;
  font_family: string;
  font_size: number;
  font_weight: string;
  font_style: string;
  text_align: string;
  color: string;
  line_height: number;
  letter_spacing: number;
  // image/svg
  asset_url: string;
  object_fit: string;
  // shape
  background_color: string;
  border_radius: number;
  opacity: number;
  // flags
  is_editable: boolean;
  is_locked: boolean;
  is_visible: boolean;
  placeholder_hint: string;
  // local only
  _isDirty?: boolean;
  _isNew?: boolean;
  _deleted?: boolean;
}

export function useTemplateCanvas(templateId: string, canvasWidth: number, canvasHeight: number) {
  const qc = useQueryClient();
  const [elements, setElements] = useState<KonvaElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial data
  const { data: remoteData, isLoading } = useQuery({
    queryKey: ['admin-elements', templateId],
    queryFn: () => adminGetElements(templateId),
  });

  // Convert percentages to pixels on load
  useEffect(() => {
    if (remoteData) {
      const results = remoteData.results ?? remoteData;
      const converted = results.map((el: any) => ({
        ...el,
        x: (el.x / 100) * canvasWidth,
        y: (el.y / 100) * canvasHeight,
        width: (el.width / 100) * canvasWidth,
        height: (el.height / 100) * canvasHeight,
        _isDirty: false,
        _isNew: false,
        _deleted: false,
      }));
      setElements(converted);
    }
  }, [remoteData, canvasWidth, canvasHeight]);

  const isDirty = useMemo(() => elements.some(el => el._isDirty || el._isNew || el._deleted), [elements]);

  // Unsaved changes warning
  useEffect(() => {
    if (isDirty) {
      window.onbeforeunload = () => 'You have unsaved changes.';
    } else {
      window.onbeforeunload = null;
    }
    return () => { window.onbeforeunload = null; };
  }, [isDirty]);

  const selectElement = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const updateElement = useCallback((id: string, changes: Partial<KonvaElement>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...changes, _isDirty: true } : el
    ));
  }, []);

  const addElement = useCallback((type: KonvaElement['element_type']) => {
    const id = crypto.randomUUID();
    let newElem: KonvaElement = {
      id,
      element_type: type,
      x: 50,
      y: 50,
      width: 150,
      height: 150,
      z_index: elements.length > 0 ? Math.max(...elements.map(e => e.z_index)) + 1 : 0,
      rotation: 0,
      content: '',
      font_family: 'Inter',
      font_size: 16,
      font_weight: 'normal',
      font_style: 'normal',
      text_align: 'left',
      color: '#000000',
      line_height: 1.2,
      letter_spacing: 0,
      asset_url: '',
      object_fit: 'contain',
      background_color: '#3b82f6',
      border_radius: 0,
      opacity: 1,
      is_editable: true,
      is_locked: false,
      is_visible: true,
      placeholder_hint: '',
      _isNew: true,
      _isDirty: true,
    };

    // Defaults based on type
    if (type === 'text') {
      newElem = { ...newElem, width: 200, height: 40, content: 'New Text' };
    } else if (type === 'shape') {
      newElem = { ...newElem, width: 150, height: 80, background_color: '#3b82f6', opacity: 0.8 };
    } else if (type === 'line') {
      newElem = { ...newElem, x: 20, y: 100, width: canvasWidth - 40, height: 4, background_color: '#000000' };
    } else if (type === 'image' || type === 'svg') {
      newElem = { ...newElem, width: 150, height: 150 };
    }

    setElements(prev => [...prev, newElem]);
    setSelectedId(id);
  }, [elements, canvasWidth]);

  const deleteElement = useCallback((id: string) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, _deleted: true } : el
    ));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const duplicateElement = useCallback((id: string) => {
    const source = elements.find(el => el.id === id);
    if (!source) return;

    const newId = crypto.randomUUID();
    const duplicated: KonvaElement = {
      ...source,
      id: newId,
      x: source.x + 20,
      y: source.y + 20,
      z_index: Math.max(...elements.map(e => e.z_index)) + 1,
      _isNew: true,
      _isDirty: true,
      _deleted: false,
    };

    setElements(prev => [...prev, duplicated]);
    setSelectedId(newId);
  }, [elements]);

  const moveElementLayer = useCallback((id: string, direction: 'up' | 'down') => {
    setElements(prev => {
      const sorted = [...prev].sort((a, b) => a.z_index - b.z_index);
      const idx = sorted.findIndex(el => el.id === id);
      if (idx === -1) return prev;

      if (direction === 'up' && idx < sorted.length - 1) {
        const current = sorted[idx];
        const above = sorted[idx + 1];
        const tempZ = current.z_index;
        current.z_index = above.z_index;
        above.z_index = tempZ;
        current._isDirty = true;
        above._isDirty = true;
      } else if (direction === 'down' && idx > 0) {
        const current = sorted[idx];
        const below = sorted[idx - 1];
        const tempZ = current.z_index;
        current.z_index = below.z_index;
        below.z_index = tempZ;
        current._isDirty = true;
        below._isDirty = true;
      }

      return [...prev]; // Return original array reference to trigger re-render if needed, but we mutated z_index. Safer to return new array.
    });
  }, []);

  const saveAll = useCallback(async () => {
    setIsSaving(true);
    try {
      const toDelete = elements.filter(el => el._deleted && !el._isNew);
      const toCreate = elements.filter(el => el._isNew && !el._deleted);
      const toUpdate = elements.filter(el => el._isDirty && !el._isNew && !el._deleted);

      const promises = [];

      // DELETE
      for (const el of toDelete) {
        promises.push(adminDeleteElement(el.id));
      }

      // CREATE
      for (const el of toCreate) {
        const { id, _isNew, _isDirty, _deleted, ...data } = el;
        const payload = {
          ...data,
          template: templateId,
          x: (el.x / canvasWidth) * 100,
          y: (el.y / canvasHeight) * 100,
          width: (el.width / canvasWidth) * 100,
          height: (el.height / canvasHeight) * 100,
        };
        promises.push(adminAddElement(payload));
      }

      // UPDATE
      for (const el of toUpdate) {
        const { id, _isNew, _isDirty, _deleted, ...data } = el;
        const payload = {
          ...data,
          x: (el.x / canvasWidth) * 100,
          y: (el.y / canvasHeight) * 100,
          width: (el.width / canvasWidth) * 100,
          height: (el.height / canvasHeight) * 100,
        };
        promises.push(adminUpdateElement(el.id, payload));
      }

      await Promise.all(promises);
      
      qc.invalidateQueries({ queryKey: ['admin-elements', templateId] });
      toast.success('Template saved');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save template');
    } finally {
      setIsSaving(false);
    }
  }, [elements, templateId, canvasWidth, canvasHeight, qc]);

  return {
    elements,
    selectedId,
    isSaving,
    isDirty,
    isLoading,
    selectElement,
    updateElement,
    addElement,
    deleteElement,
    duplicateElement,
    moveElementLayer,
    saveAll,
  };
}
