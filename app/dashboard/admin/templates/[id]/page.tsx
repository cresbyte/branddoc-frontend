"use client"

import React, { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Save, Loader2 } from "lucide-react"
import {
  adminGetTemplate,
  adminUpdateTemplate,
} from "@/services/templates"
import ConfirmDialog from "@/components/ui/ConfirmDialog"
import dynamic from "next/dynamic"
import { useDashboard } from "../../../components/DashboardContext"

const TemplateCanvas = dynamic(
  () => import("@/components/admin/TemplateCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    ),
  }
)

type Tab = "details" | "elements" | "assets"

const CATEGORIES = ["letterhead", "invoice", "certificate", "proposal", "other"]
const STATUSES = ["draft", "published", "archived"]
const ELEMENT_TYPES = ["text", "image", "svg", "shape", "line"]

export default function AdminTemplateEditorPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const qc = useQueryClient()
  const [detailsForm, setDetailsForm] = useState<Record<string, any>>({})
  const { setHeaderTitle } = useDashboard()

  useEffect(() => {
    setHeaderTitle("Edit Template")
  }, [setHeaderTitle])

  const { data: tpl } = useQuery<any>({
    queryKey: ["admin-template", id],
    queryFn: () => adminGetTemplate(id),
  })

  useEffect(() => {
    if (tpl) {
      setDetailsForm({
        title: tpl.title,
        description: tpl.description,
        category: tpl.category,
        status: tpl.status,
        thumbnail_url: tpl.thumbnail_url,
        canvas_width: tpl.canvas_width,
        canvas_height: tpl.canvas_height,
      })
      setHeaderTitle(`Edit: ${tpl.title}`)
    }
  }, [tpl, setHeaderTitle])

  const updateDetailsMutation = useMutation({
    mutationFn: () => adminUpdateTemplate(id, detailsForm),
    onSuccess: () => {
      toast.success("Template saved.")
      qc.invalidateQueries({ queryKey: ["admin-template", id] })
    },
    onError: () => toast.error("Failed to save."),
  })

  const setD = (field: string, val: any) =>
    setDetailsForm((p: any) => ({ ...p, [field]: val }))

  return (
    <div className="h-full w-full">
      {!tpl ? (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="animate-spin text-slate-500" />
        </div>
      ) : (
        <div className="animate-in duration-500 fade-in">
          <TemplateCanvas
            templateId={id}
            canvasWidth={tpl.canvas_width ?? 794}
            canvasHeight={tpl.canvas_height ?? 1123}
            templateData={detailsForm}
            onTemplateUpdate={setD}
            onSaveTemplate={() => updateDetailsMutation.mutate()}
            isSavingTemplate={updateDetailsMutation.isPending}
          />
        </div>
      )}

    </div>
  )
}
