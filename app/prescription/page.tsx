"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { FileUp, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { getAuthToken } from "@/lib/session";
import { useRouter } from "next/navigation";

export default function PrescriptionPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Choose a clear image file (JPG, PNG, or WEBP)."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("Choose an image smaller than 10 MB."); return; }
    setName(file.name);
    setPreview(URL.createObjectURL(file));
  }

  function continueFlow() {
    if (!preview) { setError("Choose a prescription image before continuing."); return; }
    if (!getAuthToken()) { router.push("/auth/login?next=/prescription"); return; }
    setError("Secure prescription storage is being connected. Please continue with your bag and add any instructions there.");
  }

  return <div className="min-h-screen bg-mesh-radial text-ink-950"><SiteHeader /><main id="content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">Prescription service</p><h1 className="mt-3 text-4xl font-bold tracking-tight">Upload your prescription.</h1><p className="mt-4 text-sm leading-7 text-ink-900/65">Choose a clear image of your prescription. You’ll be asked to sign in before completing your order.</p><section className="mt-8 rounded-[2rem] border border-sand-200 bg-white p-6 shadow-sm"><label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-brand-200 bg-brand-50/40 p-6 text-center hover:bg-brand-50"><input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={selectFile} /><FileUp className="h-8 w-8 text-brand-600" /><span className="mt-3 font-semibold text-ink-950">Choose prescription image</span><span className="mt-1 text-sm text-ink-900/60">JPG, PNG, or WEBP up to 10 MB</span></label>{preview ? <div className="mt-5 flex items-center gap-4 rounded-2xl bg-sand-50 p-3"><Image src={preview} alt="Prescription preview" width={80} height={80} className="h-20 w-20 rounded-xl object-cover" /><p className="min-w-0 truncate text-sm font-medium text-ink-950">{name}</p></div> : null}{error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}<div className="mt-6 flex flex-wrap items-center gap-3"><Button type="button" onClick={continueFlow}>Continue securely</Button><span className="inline-flex items-center gap-1.5 text-sm text-ink-900/60"><ShieldCheck className="h-4 w-4 text-brand-600" />Your prescription will be reviewed by the pharmacy.</span></div></section></main><SiteFooter /></div>;
}
