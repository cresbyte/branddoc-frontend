"use client";

import { useEffect, useState } from "react";
import { getBrandKit, getBrandProfiles } from "@/lib/api";
import { BrandKitEditor } from "@/components/branding/BrandKitEditor";
import { Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BrandEditorPage() {
  const [kit, setKit] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchKit = async () => {
      try {
        setLoading(true);
        const [kitData, profilesData] = await Promise.all([
          getBrandKit(),
          getBrandProfiles()
        ]);
        setKit(kitData);
        console.log(kitData);

        // Handle paginated response which contains a 'results' array
        const profiles = profilesData?.results ? profilesData.results : profilesData;
        console.log(profiles[0]);
        setProfile(profiles[0]);
      } catch (err: any) {
        if (err.message?.includes("404") || err.status === 404) {
            setError("No brand kit selected. Please choose a template from the gallery first.");
        } else {
            setError(err.message || "Failed to load brand kit");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchKit();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen  text-white">
        <Loader2 className="animate-spin text-brand-primary mb-4" size={40} />
        <p className="text-slate-400 font-medium animate-pulse">Initializing Visual Identity Engine...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen  text-white p-10 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
            <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Configuration Required</h2>
        <p className="text-slate-400 max-w-md mb-8 leading-relaxed">{error}</p>
        <button
          onClick={() => router.push("/dashboard/brands")}
          className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/40"
        >
          Return to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <BrandKitEditor initialKit={kit} profile={profile} />
    </div>
  );
}
