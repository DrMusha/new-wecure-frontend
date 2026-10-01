"use client";

import { useEffect, useState } from "react";
import { AuthMessage } from "@/components/auth-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createMedicalCard,
  getMedicalCard,
  logBloodPressure,
  logSugarLevel,
  type MedicalCard,
} from "@/lib/backend";
import { getAuthToken } from "@/lib/session";
import { SectionMessage } from "@/components/section-message";
import { Activity, HeartPulse, ShieldCheck, UserRound } from "lucide-react";

const emptyForm = {
  phoneNumber: "",
  emergencyContact: "",
  emergencyContactName: "",
  address: "",
  currentMedication: "",
  hasDiabetes: false,
  hasHypertension: false,
  notes: "",
  birthDate: "",
  gender: "",
  occupation: "",
  allergies: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  disclosureConsent: false,
  privacyConsent: false,
  treatmentConsent: false,
  name: "",
  email: "",
};

type FormState = typeof emptyForm;

export function MedicalCardClient() {
  const [token, setToken] = useState<string | null>(null);
  const [card, setCard] = useState<MedicalCard | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [sugar, setSugar] = useState({ glucoseLevel: "", timeOfDay: "", date: "", time: "", notes: "" });
  const [bp, setBp] = useState({ systolic: "", diastolic: "", pulse: "", date: "", time: "" });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setToken(getAuthToken());
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getMedicalCard(token)
      .then((item) => {
        setCard(item);
        setForm({
          phoneNumber: item.contactInfo?.phoneNumber || "",
          emergencyContact: item.contactInfo?.emergencyContact || "",
          emergencyContactName: item.contactInfo?.emergencyContactName || "",
          address: item.contactInfo?.address || "",
          currentMedication: item.currentMedication || "",
          hasDiabetes: Boolean(item.hasDiabetes),
          hasHypertension: Boolean(item.hasHypertension),
          notes: item.notes || "",
          birthDate: item.birthDate ? String(item.birthDate).slice(0, 10) : "",
          gender: item.gender || "",
          occupation: item.occupation || "",
          allergies: item.allergies || "",
          familyMedicalHistory: item.familyMedicalHistory || "",
          pastMedicalHistory: item.pastMedicalHistory || "",
          disclosureConsent: Boolean(item.disclosureConsent),
          privacyConsent: Boolean(item.privacyConsent),
          treatmentConsent: Boolean(item.treatmentConsent),
          name: item.name || "",
          email: item.email || "",
        });
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const payload = {
        ...form,
        birthDate: form.birthDate ? new Date(form.birthDate).toISOString() : "",
      };
      const saved = await createMedicalCard(token, payload);
      setCard(saved);
      setMessage("Medical card saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save medical card.");
    } finally {
      setSaving(false);
    }
  }

  async function submitSugar() {
    if (!token) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await logSugarLevel(token, {
        glucoseLevel: Number(sugar.glucoseLevel),
        timeOfDay: sugar.timeOfDay,
        date: sugar.date,
        time: sugar.time,
        notes: sugar.notes,
      });
      setMessage("Sugar log saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save sugar log.");
    } finally {
      setSaving(false);
    }
  }

  async function submitBp() {
    if (!token) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await logBloodPressure(token, {
        systolic: Number(bp.systolic),
        diastolic: Number(bp.diastolic),
        pulse: Number(bp.pulse),
        date: bp.date,
        time: bp.time,
      });
      setMessage("Blood pressure log saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save blood pressure log.");
    } finally {
      setSaving(false);
    }
  }

  if (!token) {
    return (
      <SectionMessage
        title="Sign in to use the medical card"
        description="Please sign in to access your medical card information."
      />
    );
  }

  if (loading) {
    return <SectionMessage title="Loading medical card" description="Please wait while we fetch your current medical profile." />;
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {error ? <AuthMessage tone="error">{error}</AuthMessage> : null}
      {message ? <AuthMessage tone="success">{message}</AuthMessage> : null}

      <section className="overflow-hidden rounded-[2rem] border border-sand-200 bg-white shadow-[0_24px_70px_-48px_rgba(15,23,42,0.55)] sm:rounded-[2.5rem]">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(191,219,254,0.9),transparent_34%),linear-gradient(135deg,#eff6ff_0%,#ffffff_72%)] px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-100 bg-white text-brand-700 shadow-sm"><HeartPulse className="h-5 w-5" aria-hidden="true" /></div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">{card ? "Keep your card up to date" : "Set up your medical card"}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-ink-900/65">Add only details you are comfortable sharing. This profile helps keep your pharmacy care more personal.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-brand-100 bg-white/85 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Private profile</div>
          </div>
        </div>

        <form className="p-5 sm:p-8" onSubmit={handleSubmit}>
          <FormSection icon={UserRound} eyebrow="About you" title="Personal and contact details" description="These details help identify your card and reach you if needed.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name"><Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Your full name" autoComplete="name" /></Field>
              <Field label="Email address"><Input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="you@example.com" type="email" autoComplete="email" /></Field>
              <Field label="Mobile number"><Input value={form.phoneNumber} onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))} placeholder="0977 000 000" inputMode="tel" autoComplete="tel" /></Field>
              <Field label="Date of birth"><Input value={form.birthDate} onChange={(e) => setForm((prev) => ({ ...prev, birthDate: e.target.value }))} type="date" /></Field>
              <Field label="Emergency contact name"><Input value={form.emergencyContactName} onChange={(e) => setForm((prev) => ({ ...prev, emergencyContactName: e.target.value }))} placeholder="Name of contact" /></Field>
              <Field label="Emergency contact number"><Input value={form.emergencyContact} onChange={(e) => setForm((prev) => ({ ...prev, emergencyContact: e.target.value }))} placeholder="0977 000 000" inputMode="tel" /></Field>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Home address"><Input value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} placeholder="Street, area, or landmark" autoComplete="street-address" /></Field><Field label="Occupation (optional)"><Input value={form.occupation} onChange={(e) => setForm((prev) => ({ ...prev, occupation: e.target.value }))} placeholder="Your occupation" /></Field></div>
          </FormSection>

          <FormSection icon={HeartPulse} eyebrow="Health context" title="Details your pharmacist should know" description="Include current treatments, allergies, and relevant history. You can leave any field blank.">
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Current medication"><Textarea value={form.currentMedication} onChange={(e) => setForm((prev) => ({ ...prev, currentMedication: e.target.value }))} placeholder="List medication and dosage, if known" /></Field><Field label="Allergies"><Textarea value={form.allergies} onChange={(e) => setForm((prev) => ({ ...prev, allergies: e.target.value }))} placeholder="Medicines, foods, or other allergies" /></Field><Field label="Family medical history"><Textarea value={form.familyMedicalHistory} onChange={(e) => setForm((prev) => ({ ...prev, familyMedicalHistory: e.target.value }))} placeholder="Relevant family health history" /></Field><Field label="Past medical history"><Textarea value={form.pastMedicalHistory} onChange={(e) => setForm((prev) => ({ ...prev, pastMedicalHistory: e.target.value }))} placeholder="Past conditions, procedures, or admissions" /></Field></div>
            <div className="mt-4"><Field label="Additional notes"><Textarea value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Anything else you would like your pharmacy team to know" /></Field></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2"><CheckOption checked={form.hasDiabetes} onChange={(checked) => setForm((prev) => ({ ...prev, hasDiabetes: checked }))} label="I have diabetes" /><CheckOption checked={form.hasHypertension} onChange={(checked) => setForm((prev) => ({ ...prev, hasHypertension: checked }))} label="I have hypertension" /></div>
          </FormSection>

          <FormSection icon={ShieldCheck} eyebrow="Your choices" title="Consent and privacy" description="Choose how WeCure may use your health profile to support your care.">
            <div className="grid gap-3"><CheckOption checked={form.disclosureConsent} onChange={(checked) => setForm((prev) => ({ ...prev, disclosureConsent: checked }))} label="I consent to sharing relevant details with my pharmacy care team." /><CheckOption checked={form.privacyConsent} onChange={(checked) => setForm((prev) => ({ ...prev, privacyConsent: checked }))} label="I understand this information is handled as a private health profile." /><CheckOption checked={form.treatmentConsent} onChange={(checked) => setForm((prev) => ({ ...prev, treatmentConsent: checked }))} label="I consent to using these details to support treatment and pharmacy care." /></div>
          </FormSection>

          <div className="mt-6 flex flex-col gap-3 border-t border-sand-200 pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-xl text-xs leading-5 text-ink-900/55">Your medical card supports pharmacy care and is not a substitute for emergency medical advice.</p><Button type="submit" disabled={saving} className="h-12 rounded-full px-6">{saving ? "Saving your card..." : card ? "Save changes" : "Create medical card"}</Button></div>
        </form>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-sand-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Activity className="h-5 w-5" aria-hidden="true" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Health log</p><h3 className="mt-1 text-xl font-semibold text-ink-950">Blood sugar</h3></div></div>
          <div className="mt-4 grid gap-3">
            <Field label="Glucose level"><Input value={sugar.glucoseLevel} onChange={(e) => setSugar((prev) => ({ ...prev, glucoseLevel: e.target.value }))} placeholder="e.g. 5.6" type="number" step="0.1" /></Field>
            <Field label="Time of day"><Input value={sugar.timeOfDay} onChange={(e) => setSugar((prev) => ({ ...prev, timeOfDay: e.target.value }))} placeholder="e.g. Before breakfast" /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input value={sugar.date} onChange={(e) => setSugar((prev) => ({ ...prev, date: e.target.value }))} type="date" />
              <Input value={sugar.time} onChange={(e) => setSugar((prev) => ({ ...prev, time: e.target.value }))} type="time" />
            </div>
            <Textarea value={sugar.notes} onChange={(e) => setSugar((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Optional notes" />
            <Button type="button" variant="secondary" onClick={submitSugar} disabled={saving} className="h-11 rounded-full">
              Save sugar log
            </Button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-sand-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-700"><HeartPulse className="h-5 w-5" aria-hidden="true" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">Health log</p><h3 className="mt-1 text-xl font-semibold text-ink-950">Blood pressure</h3></div></div>
          <div className="mt-4 grid gap-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <Input value={bp.systolic} onChange={(e) => setBp((prev) => ({ ...prev, systolic: e.target.value }))} placeholder="Systolic" type="number" />
              <Input value={bp.diastolic} onChange={(e) => setBp((prev) => ({ ...prev, diastolic: e.target.value }))} placeholder="Diastolic" type="number" />
              <Input value={bp.pulse} onChange={(e) => setBp((prev) => ({ ...prev, pulse: e.target.value }))} placeholder="Pulse" type="number" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input value={bp.date} onChange={(e) => setBp((prev) => ({ ...prev, date: e.target.value }))} type="date" />
              <Input value={bp.time} onChange={(e) => setBp((prev) => ({ ...prev, time: e.target.value }))} type="time" />
            </div>
            <Button type="button" variant="secondary" onClick={submitBp} disabled={saving} className="h-11 rounded-full">
              Save blood pressure
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FormSection({ icon: Icon, eyebrow, title, description, children }: { icon: typeof HeartPulse; eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <section className="border-b border-sand-200 py-6 first:pt-0 last:border-b-0 last:pb-0"><div className="flex gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sand-50 text-brand-700"><Icon className="h-4 w-4" aria-hidden="true" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">{eyebrow}</p><h3 className="mt-1 text-lg font-semibold text-ink-950">{title}</h3><p className="mt-1 text-sm leading-6 text-ink-900/60">{description}</p></div></div><div className="mt-5">{children}</div></section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-sm font-semibold text-ink-900"><span>{label}</span>{children}</label>;
}

function CheckOption({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-sand-200 bg-sand-50/70 p-4 text-sm leading-6 text-ink-900 transition hover:border-brand-200 hover:bg-brand-50/40"><input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" /><span>{label}</span></label>;
}
