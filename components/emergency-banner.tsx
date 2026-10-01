import { MessageCircle, Phone } from "lucide-react";

const phone = "+260771230217";

export function EmergencyBanner() {
  return <aside className="bg-rose-700 px-4 py-2.5 text-white">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center text-sm sm:flex-row sm:text-left">
      <p className="font-semibold">Need medicines right now? <span className="font-normal">Open 24 hours.</span></p>
      <div className="flex items-center gap-3 text-xs font-semibold">
        <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 hover:text-rose-100"><Phone className="h-3.5 w-3.5" /> Call {phone}</a>
        <a href={`https://wa.me/${phone.slice(1)}`} className="inline-flex items-center gap-1.5 hover:text-rose-100"><MessageCircle className="h-3.5 w-3.5" /> WhatsApp</a>
      </div>
    </div>
  </aside>;
}
