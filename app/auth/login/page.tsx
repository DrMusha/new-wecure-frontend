import { Suspense } from "react";
import { AuthLoginClient } from "@/components/auth-login-client";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-mesh-radial" />}>
      <AuthLoginClient />
    </Suspense>
  );
}
