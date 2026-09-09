"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { enquirySchema, flattenZodErrors, type EnquiryInput } from "@/lib/validation";
import { logActivity } from "@/lib/cms/logs";
import type { Enquiry } from "@/types/database";

export type SubmitEnquiryResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** Simple in-memory rate limit: max 3 submissions per IP per 10 minutes. */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const rateBuckets = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateBuckets.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (hits.length >= RATE_LIMIT_MAX) return true;
  hits.push(now);
  rateBuckets.set(ip, hits);
  return false;
}

export async function submitEnquiry(
  input: EnquiryInput,
  ip: string,
): Promise<SubmitEnquiryResult> {
  // Honeypot: bots fill hidden fields — pretend success without saving.
  if (input.website) {
    return { ok: true, id: "ignored" };
  }

  if (isRateLimited(ip)) {
    return { ok: false, error: "Too many submissions. Please try again later or call us directly." };
  }

  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please correct the highlighted fields.", fieldErrors: flattenZodErrors(parsed.error) };
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("enquiries")
      .insert({
        full_name: parsed.data.full_name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        company_name: parsed.data.company_name || null,
        location: parsed.data.location || null,
        property_type: parsed.data.property_type || null,
        service_required: parsed.data.service_required,
        message: parsed.data.message || null,
        status: "New" as const,
        priority: "Medium" as const,
      } as unknown as Partial<Enquiry>)
      .select("id")
      .single();

    if (error) {
      console.error("[enquiry] insert failed:", error.message);
      return { ok: false, error: "We could not receive your enquiry right now. Please try again or call us directly." };
    }

    return { ok: true, id: data.id };
  } catch (err) {
    console.error("[enquiry] unexpected failure:", err);
    return { ok: false, error: "Something went wrong. Please try again or call us directly." };
  }
}

/** Admin-side status update (requires admin session; verified by caller). */
export async function updateEnquiryAdmin(params: {
  adminUserId: string;
  id: string;
  status?: string;
  priority?: string;
  notes?: string;
  assigned_to?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  const patch: Record<string, string> = {};
  if (params.status !== undefined) patch.status = params.status;
  if (params.priority !== undefined) patch.priority = params.priority;
  if (params.notes !== undefined) patch.notes = params.notes;
  if (params.assigned_to !== undefined) patch.assigned_to = params.assigned_to;

  const { error } = await admin.from("enquiries").update(patch as unknown as Partial<Enquiry>).eq("id", params.id);
  if (error) return { ok: false, error: error.message };

  await logActivity({
    adminUserId: params.adminUserId,
    action: `Updated enquiry ${params.id}`,
    entityType: "enquiry",
    entityId: params.id,
    metadata: patch,
  });
  return { ok: true };
}
