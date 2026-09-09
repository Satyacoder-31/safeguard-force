"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface PublicShellProps {
  header: ReactNode;
  footer: ReactNode;
  floatingActions: ReactNode;
  children: ReactNode;
}

/**
 * PublicShell conditionally renders the public website Header, Footer,
 * and Floating Actions only for non-admin routes.
 *
 * For any route under /admin (including /admin/login and all dashboard pages),
 * it strips out the public header, footer, and floating action buttons,
 * providing a completely isolated and optimized environment for administrators.
 */
export default function PublicShell({
  header,
  footer,
  floatingActions,
  children,
}: PublicShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white antialiased pb-[60px] lg:pb-0">
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      {floatingActions}
    </div>
  );
}
