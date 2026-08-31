import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Best Online Pharmacy in Zambia | WeCure Pharmaceuticals",
  description:
    "Order medicines online from WeCure, Zambia's trusted pharmacy. Fast delivery, genuine products, and digital medical card for your healthcare needs.",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
