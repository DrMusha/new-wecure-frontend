import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_58%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_24%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid items-stretch gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          <div className="relative z-10 flex items-center">
            <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/45 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur-md sm:p-8 lg:p-10">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.9)_58%,rgba(255,255,255,0.62)_78%,rgba(255,255,255,0.06)_100%)]" />
              <div className="relative max-w-xl">
                <div className="inline-flex w-fit items-center rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-blue-600 shadow-sm">
                  Zambia's No. 1 online pharmacy
                </div>
                <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
                  At WeCure Pharmacy, We Want You{" "}
                  <span className="text-blue-500">Healed.</span>
                </h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-gray-500 sm:text-lg">
                  Zambia's No. 1 online pharmacy, WeCure Pharmacy, is ready to deliver
                  your Medications, Cosmetics, Baby Products and AgroVet Products
                  right to your doorstep.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-600"
                  >
                    Shop products
                  </Link>
                  <Link
                    href="/categories"
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
                  >
                    Browse categories
                  </Link>
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  {[
                    { title: "Medications", text: "Delivered with care" },
                    { title: "Cosmetics", text: "Beauty essentials" },
                    { title: "Baby + AgroVet", text: "Household needs" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm"
                    >
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="mt-1 text-sm text-gray-500">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative min-h-[28rem] sm:min-h-[32rem]">
            <div className="absolute right-0 top-0 h-full w-[92%]">
              <div className="absolute right-0 top-4 w-[84%] max-w-[30rem] overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-2xl shadow-blue-950/10">
                <Image
                  src="/assets/image2.jpg"
                  alt="WeCure pharmacy products"
                  width={800}
                  height={900}
                  priority
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_55%,rgba(255,255,255,0.12)_100%)]" />
              </div>

              <div className="absolute left-0 top-24 w-[74%] max-w-[26rem] overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-2xl shadow-blue-950/10">
                <Image
                  src="/assets/image1.jpg"
                  alt="WeCure pharmacy delivery and lifestyle products"
                  width={800}
                  height={900}
                  priority
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_55%,rgba(255,255,255,0.1)_100%)]" />
              </div>

              <div className="absolute bottom-6 left-6 rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 shadow-sm backdrop-blur">
                Medications
              </div>
              <div className="absolute bottom-20 right-10 rounded-full bg-blue-500 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
                Cosmetics
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
