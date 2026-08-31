import { Suspense } from "react";
import { AuthNewVerificationClient } from "@/components/auth-new-verification-client";

export default function NewVerificationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-mesh-radial" />}>
      <AuthNewVerificationClient />
    </Suspense>
  );
}
