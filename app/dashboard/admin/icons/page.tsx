"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, Search, Filter, MoreVertical, Edit2, 
  Trash2, Shapes, ChevronRight, Check, X,
  Globe, Phone, Mail, LayoutGrid, List
} from "lucide-react";
import { 
  adminGetIcons, 
  adminCreateIcon, 
  adminUpdateIcon, 
  adminDeleteIcon,
  adminCreateIconVariant,
  adminUpdateIconVariant,
  adminDeleteIconVariant
} from "@/services/templates";
import { useDashboard } from "../../components/DashboardContext";
import { toast } from "react-hot-toast";
import type { IconWithVariants, IconVariantDetail } from "@/lib/svgUtils";

const CATEGORIES = [
  { label: 'All Categories', value: '' },
  { label: 'Contact', value: 'contact' },
  { label: 'Social Media', value: 'social' },
  { label: 'Document', value: 'document' },
  { label: 'Miscellaneous', value: 'misc' },
];

export default function IconsAdminPage() {
  const { setHeaderTitle, setSearch } = useDashboard();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  
  const [editingIcon, setEditingIcon] = useState<IconWithVariants | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newIcon, setNewIcon] = useState({ name: "", slug: "", category: "contact", sort_order: 0 });

  useEffect(() => {
    setHeaderTitle("Manage Icons");
    setSearch({
      placeholder: "Search icons...",
      value: searchTerm,
      onChange: (v: string) => setSearchTerm(v),
    });
  }, [setHeaderTitle, setSearch, searchTerm]);

  const { data: iconsData, isLoading } = useQuery({
    queryKey: ["admin-icons", activeCategory, searchTerm],
    queryFn: () => adminGetIcons({ 
      category: activeCategory,
      search: searchTerm
    }),
  });

  const icons: IconWithVariants[] = iconsData?.results ?? iconsData ?? [];

  const createMutation = useMutation({
    mutationFn: adminCreateIcon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-icons"] });
      setIsCreateModalOpen(false);
      setNewIcon({ name: "", slug: "", category: "contact", sort_order: 0 });
      toast.success("Icon created successfully");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminUpdateIcon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-icons"] });
      setEditingIcon(null);
      toast.success("Icon updated successfully");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteIcon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-icons"] });
      toast.success("Icon deactivated");
    },
  });

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Icon Library</h1>
          <p className="text-sm text-gray-500">Manage vector icons and variants available for templates.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add New Icon
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.value 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 border-l border-gray-100 pl-4">
          <button 
            onClick={() => setIsGridView(true)}
            className={`p-2 rounded-lg transition-colors ${isGridView ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-50"}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setIsGridView(false)}
            className={`p-2 rounded-lg transition-colors ${!isGridView ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-50"}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Icons List/Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : icons.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-dashed border-gray-200">
          <Shapes size={48} className="text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">No icons found matching your criteria</p>
        </div>
      ) : isGridView ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {icons.map((icon) => (
            <IconCard 
              key={icon.id} 
              icon={icon} 
              onEdit={() => setEditingIcon(icon)}
              onDelete={() => {
                if (confirm(`Deactivate "${icon.name}"?`)) {
                  deleteMutation.mutate(icon.id);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Icon</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name / Slug</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Variants</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {icons.map((icon) => (
                <IconRow 
                  key={icon.id} 
                  icon={icon} 
                  onEdit={() => setEditingIcon(icon)}
                  onDelete={() => {
                    if (confirm(`Deactivate "${icon.name}"?`)) {
                      deleteMutation.mutate(icon.id);
                    }
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals placeholders - in a real app these would be full components */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Create New Icon</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                  <input 
                    type="text" 
                    value={newIcon.name}
                    onChange={e => setNewIcon({...newIcon, name: e.target.value})}
                    placeholder="e.g. Phone"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Slug</label>
                  <input 
                    type="text" 
                    value={newIcon.slug}
                    onChange={e => setNewIcon({...newIcon, slug: e.target.value})}
                    placeholder="e.g. phone"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                  <select 
                    value={newIcon.category}
                    onChange={e => setNewIcon({...newIcon, category: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none bg-white"
                  >
                    {CATEGORIES.slice(1).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => createMutation.mutate(newIcon)}
                    disabled={!newIcon.name || !newIcon.slug || createMutation.isPending}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Icon"}
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* Edit Modal (simulated simple version) */}
      {editingIcon && (
        <EditIconModal 
          icon={editingIcon} 
          onClose={() => setEditingIcon(null)} 
          onUpdate={(data) => updateMutation.mutate({ id: editingIcon.id, data })}
        />
      )}
    </div>
  );
}

function IconCard({ icon, onEdit, onDelete }: { icon: IconWithVariants; onEdit: () => void; onDelete: () => void }) {
  const defaultVariant = icon.variants.find(v => v.is_default) || icon.variants[0];
  
  return (
    <div className="group relative bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
          {defaultVariant ? (
            <div 
              className="w-10 h-10 text-gray-400 group-hover:text-blue-600 transition-colors"
              dangerouslySetInnerHTML={{ __html: defaultVariant.svg_markup }}
            />
          ) : (
            <Shapes size={32} className="text-gray-200" />
          )}
        </div>
        <div className="text-center">
          <h4 className="font-bold text-gray-900 text-sm">{icon.name}</h4>
          <p className="text-[10px] font-mono text-gray-400 mt-1">{icon.slug}</p>
        </div>
        <div className="flex items-center gap-1.5">
           <span className="text-[9px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full uppercase">
             {icon.category}
           </span>
           <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
             {icon.variants.length} Var
           </span>
        </div>
      </div>

      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1.5 bg-white text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-gray-100 transition-colors">
          <Edit2 size={14} />
        </button>
        <button onClick={onDelete} className="p-1.5 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg border border-gray-100 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function IconRow({ icon, onEdit, onDelete }: { icon: IconWithVariants; onEdit: () => void; onDelete: () => void }) {
  const defaultVariant = icon.variants.find(v => v.is_default) || icon.variants[0];
  
  return (
    <tr className="group hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
          {defaultVariant && (
            <div className="w-6 h-6 text-gray-400" dangerouslySetInnerHTML={{ __html: defaultVariant.svg_markup }} />
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-bold text-gray-900">{icon.name}</div>
        <div className="text-xs text-gray-400 font-mono italic">{icon.slug}</div>
      </td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
          {icon.category}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-1">
          {icon.variants.map(v => (
             <div 
               key={v.id} 
               title={v.variant}
               className={`w-6 h-6 rounded bg-white border border-gray-100 p-1 flex items-center justify-center ${v.is_default ? 'ring-1 ring-blue-500' : ''}`}
             >
                <div className="w-full h-full text-gray-400" dangerouslySetInnerHTML={{ __html: v.svg_markup }} />
             </div>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button onClick={onEdit} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function EditIconModal({ icon, onClose, onUpdate }: { icon: IconWithVariants; onClose: () => void; onUpdate: (data: any) => void }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ ...icon });
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [newVariant, setNewVariant] = useState({ variant: "outline", svg_markup: "", is_default: false });

  const addVarMutation = useMutation({
    mutationFn: adminCreateIconVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-icons"] });
      setIsAddingVariant(false);
      setNewVariant({ variant: "outline", svg_markup: "", is_default: false });
      toast.success("Variant added");
    }
  });

  const deleteVarMutation = useMutation({
    mutationFn: adminDeleteIconVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-icons"] });
      toast.success("Variant deleted");
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Edit Icon: {icon.name}</h3>
            <p className="text-sm text-gray-500">ID: {icon.id}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Display Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Slug</label>
              <input 
                type="text" 
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 font-mono text-sm"
                readOnly
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Shapes size={16} /> Variants Library
              </h4>
              <button 
                onClick={() => setIsAddingVariant(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus size={14} /> ADD VARIANT
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {icon.variants.map(variant => (
                 <div key={variant.id} className="p-4 rounded-xl border border-gray-200 flex flex-col gap-3 group relative">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-gray-900 uppercase">{variant.variant}</span>
                       {variant.is_default && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">DEFAULT</span>}
                    </div>
                    <div className="h-20 bg-gray-50 rounded-lg flex items-center justify-center">
                       <div className="w-12 h-12 text-gray-400" dangerouslySetInnerHTML={{ __html: variant.svg_markup }} />
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          if (confirm('Delete this variant?')) deleteVarMutation.mutate(variant.id);
                        }}
                        className="p-1.5 bg-white text-red-500 hover:bg-red-50 rounded-lg border border-gray-100 transition-colors"
                      >
                         <Trash2 size={12} />
                      </button>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {isAddingVariant && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-4">
               <h5 className="text-xs font-bold text-blue-900 uppercase">New Variant</h5>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-blue-700">VARIANT TYPE</label>
                    <select 
                      value={newVariant.variant}
                      onChange={e => setNewVariant({...newVariant, variant: e.target.value})}
                      className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-sm"
                    >
                      <option value="outline">Outline</option>
                      <option value="solid">Solid</option>
                      <option value="rounded">Rounded</option>
                      <option value="sharp">Sharp</option>
                      <option value="two-tone">Two-Tone</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-1.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                       <input 
                         type="checkbox" 
                         checked={newVariant.is_default}
                         onChange={e => setNewVariant({...newVariant, is_default: e.target.checked})}
                         className="rounded text-blue-600"
                        />
                       <span className="text-xs font-bold text-blue-700">Set as default</span>
                    </label>
                  </div>
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-bold text-blue-700">SVG MARKUP (Must have viewBox="0 0 24 24" and use currentColor)</label>
                  <textarea 
                    value={newVariant.svg_markup}
                    onChange={e => setNewVariant({...newVariant, svg_markup: e.target.value})}
                    placeholder='<svg ...>...</svg>'
                    className="w-full h-24 px-3 py-2 rounded-lg border border-blue-200 font-mono text-[10px] resize-none"
                  />
               </div>
               <div className="flex gap-2">
                  <button onClick={() => setIsAddingVariant(false)} className="px-3 py-1.5 text-xs font-bold text-blue-600">Cancel</button>
                  <button 
                    onClick={() => addVarMutation.mutate({ ...newVariant, icon: icon.id })}
                    disabled={!newVariant.svg_markup || addVarMutation.isPending}
                    className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
                  >
                    Add Variant
                  </button>
               </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-4 bg-gray-50/50">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-gray-200 bg-white text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={() => onUpdate({ name: formData.name, category: formData.category })}
            className="flex-1 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Save General Info
          </button>
        </div>
      </div>
    </div>
  );
}
