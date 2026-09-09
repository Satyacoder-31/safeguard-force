"use client";

import { useTransition } from "react";
import { useFormStatus } from "react-dom";

/**
 * A small form whose submit button calls an async (id) => Promise<Result>
 * action with the given record id — with confirm + pending state.
 */
export default function DeleteForm({
  action,
  id,
  label = "Delete",
  confirm = "Delete this item? This cannot be undone.",
  className = "text-red-600 hover:text-red-800 text-xs font-bold uppercase tracking-wider px-2 py-1",
}: {
  action: (id: string) => Promise<{ ok: boolean; error?: string }>;
  id: string;
  label?: string;
  confirm?: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  const { pending: formPending } = useFormStatus();

  return (
    <button
      type="button"
      disabled={pending || formPending}
      onClick={(e) => {
        e.stopPropagation();
        if (!window.confirm(confirm)) return;
        startTransition(async () => {
          await action(id);
        });
      }}
      className={`disabled:opacity-50 ${className}`}
    >
      {pending || formPending ? "…" : label}
    </button>
  );
}
