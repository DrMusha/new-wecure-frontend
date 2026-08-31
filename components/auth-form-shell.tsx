import { FormShell } from "@/components/form-shell";
import { AuthLinks } from "@/components/auth-links";
import { type ReactNode } from "react";

type AuthFormShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  mode: "login" | "register" | "reset" | "password" | "verify";
  topContent?: ReactNode;
};

export function AuthFormShell({ eyebrow, title, description, children, mode, topContent }: AuthFormShellProps) {
  return (
    <FormShell eyebrow={eyebrow} title={title} description={description} topContent={topContent}>
      {children}
      <AuthLinks mode={mode} />
    </FormShell>
  );
}
