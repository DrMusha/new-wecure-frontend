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
    <div className="space-y-6">
      {error ? <AuthMessage tone="error">{error}</AuthMessage> : null}
      {message ? <AuthMessage tone="success">{message}</AuthMessage> : null}

      <section className="rounded-[2rem] border border-ink-900/10 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-ink-950">
          {card ? "Update medical card" : "Create medical card"}
        </h2>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Full name" />
            <Input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" type="email" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input value={form.phoneNumber} onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))} placeholder="Phone number" />
            <Input value={form.birthDate} onChange={(e) => setForm((prev) => ({ ...prev, birthDate: e.target.value }))} type="date" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input value={form.emergencyContactName} onChange={(e) => setForm((prev) => ({ ...prev, emergencyContactName: e.target.value }))} placeholder="Emergency contact name" />
            <Input value={form.emergencyContact} onChange={(e) => setForm((prev) => ({ ...prev, emergencyContact: e.target.value }))} placeholder="Emergency contact" />
          </div>
          <Input value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} placeholder="Address" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input value={form.gender} onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))} placeholder="Gender" />
            <Input value={form.occupation} onChange={(e) => setForm((prev) => ({ ...prev, occupation: e.target.value }))} placeholder="Occupation" />
          </div>
          <Textarea value={form.currentMedication} onChange={(e) => setForm((prev) => ({ ...prev, currentMedication: e.target.value }))} placeholder="Current medication" />
          <Textarea value={form.allergies} onChange={(e) => setForm((prev) => ({ ...prev, allergies: e.target.value }))} placeholder="Allergies" />
          <Textarea value={form.familyMedicalHistory} onChange={(e) => setForm((prev) => ({ ...prev, familyMedicalHistory: e.target.value }))} placeholder="Family medical history" />
          <Textarea value={form.pastMedicalHistory} onChange={(e) => setForm((prev) => ({ ...prev, pastMedicalHistory: e.target.value }))} placeholder="Past medical history" />
          <Textarea value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Notes" />
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex items-center gap-2 text-sm text-ink-900">
              <input checked={form.hasDiabetes} onChange={(e) => setForm((prev) => ({ ...prev, hasDiabetes: e.target.checked }))} type="checkbox" />
              Diabetes
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-900">
              <input checked={form.hasHypertension} onChange={(e) => setForm((prev) => ({ ...prev, hasHypertension: e.target.checked }))} type="checkbox" />
              Hypertension
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-900">
              <input checked={form.disclosureConsent} onChange={(e) => setForm((prev) => ({ ...prev, disclosureConsent: e.target.checked }))} type="checkbox" />
              Disclosure consent
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-900">
              <input checked={form.privacyConsent} onChange={(e) => setForm((prev) => ({ ...prev, privacyConsent: e.target.checked }))} type="checkbox" />
              Privacy consent
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-900">
              <input checked={form.treatmentConsent} onChange={(e) => setForm((prev) => ({ ...prev, treatmentConsent: e.target.checked }))} type="checkbox" />
              Treatment consent
            </label>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : card ? "Update profile" : "Create profile"}
          </Button>
        </form>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-ink-900/10 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-ink-950">Sugar log</h3>
          <div className="mt-4 grid gap-3">
            <Input value={sugar.glucoseLevel} onChange={(e) => setSugar((prev) => ({ ...prev, glucoseLevel: e.target.value }))} placeholder="Glucose level" type="number" step="0.1" />
            <Input value={sugar.timeOfDay} onChange={(e) => setSugar((prev) => ({ ...prev, timeOfDay: e.target.value }))} placeholder="Time of day" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input value={sugar.date} onChange={(e) => setSugar((prev) => ({ ...prev, date: e.target.value }))} type="date" />
              <Input value={sugar.time} onChange={(e) => setSugar((prev) => ({ ...prev, time: e.target.value }))} type="time" />
            </div>
            <Textarea value={sugar.notes} onChange={(e) => setSugar((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Notes" />
            <Button type="button" variant="secondary" onClick={submitSugar} disabled={saving}>
              Save sugar log
            </Button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-ink-900/10 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-ink-950">Blood pressure log</h3>
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
            <Button type="button" variant="secondary" onClick={submitBp} disabled={saving}>
              Save blood pressure
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
