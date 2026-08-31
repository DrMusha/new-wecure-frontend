import Link from "next/link";

type AuthLinksProps = {
  mode: "login" | "register" | "reset" | "password" | "verify";
};

export function AuthLinks({ mode }: AuthLinksProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-3 text-sm text-ink-900/60">
      {mode !== "login" ? <Link className="hover:text-brand-600" href="/auth/login">Login</Link> : null}
      {mode !== "register" ? <Link className="hover:text-brand-600" href="/auth/register">Register</Link> : null}
      {mode !== "reset" ? <Link className="hover:text-brand-600" href="/auth/reset">Reset password</Link> : null}
      {mode !== "verify" ? <Link className="hover:text-brand-600" href="/auth/new-verification">Verify email</Link> : null}
    </div>
  );
}
