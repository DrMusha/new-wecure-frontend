import { Suspense } from "react";
import { AuthNewPasswordClient } from "@/components/auth-new-password-client";

export default function NewPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-mesh-radial" />}>
      <AuthNewPasswordClient />
    </Suspense>
  );
}
