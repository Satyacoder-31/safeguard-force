export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(number: string, message: string): string {
  return `https://wa.me/${number.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function formatTimeAgo(iso: string | null | undefined): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

/** Human-friendly message for unknown errors — never leaks DB internals. */
export function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("UNAUTHENTICATED")) return "Please sign in again.";
  if (msg.includes("FORBIDDEN")) return "You do not have permission for this action.";
  if (msg.toLowerCase().includes("duplicate")) return "A record with these details already exists.";
  if (msg.toLowerCase().includes("fetch") || msg.toLowerCase().includes("network"))
    return "Could not reach the server. Check your connection and try again.";
  return "Something went wrong. Please try again.";
}
