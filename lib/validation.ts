import { z } from "zod";

/** Indian phone: 10 digits starting 6-9, optionally +91 / 0 prefixed. */
const phoneRegex = /^(\+?91[-\s]?|0)?[6-9]\d{9}$/;

export const enquirySchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(120, "Name is too long"),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid Indian phone number"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .max(160, "Email is too long")
    .optional()
    .or(z.literal("")),
  company_name: z.string().trim().max(160).optional().or(z.literal("")),
  location: z.string().trim().max(160).optional().or(z.literal("")),
  property_type: z.string().trim().max(80).optional().or(z.literal("")),
  service_required: z
    .string()
    .trim()
    .min(1, "Please select a service")
    .max(120, "Service selection is too long"),
  message: z.string().trim().max(3000, "Message is too long").optional().or(z.literal("")),
  /** Honeypot field — must remain empty. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export function flattenZodErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
