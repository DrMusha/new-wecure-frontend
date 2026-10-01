"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoyaltyPage() {
  const [submitted, setSubmitted] = useState(false);
  return <div className="min-h-screen bg-mesh-radial text-ink-950"><SiteHeader /><main id="content" className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">WeCure Loyalty</p><h1 className="mt-3 text-4xl font-bold tracking-tight">Join for member savings.</h1><p className="mt-4 text-sm leading-7 text-ink-900/65">Register your interest and we’ll prepare your loyalty membership for future eligible orders.</p><form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="mt-8 rounded-[2rem] border border-sand-200 bg-white p-6 shadow-sm"><div className="grid gap-4 sm:grid-cols-2"><Input placeholder="First name" required /><Input placeholder="Last name" required /></div><Input className="mt-4" type="email" placeholder="Email address" required />{submitted ? <p className="mt-4 text-sm font-medium text-emerald-700">Thanks. Your loyalty registration interest has been received.</p> : null}<Button className="mt-6" type="submit">Join loyalty program</Button></form></main><SiteFooter /></div>;
}
