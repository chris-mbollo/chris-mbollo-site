// Conservative RFC-5322-ish shape check. Good enough for a newsletter form.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(input) {
  if (typeof input !== "string") {
    throw new Error("invalid_email");
  }
  const trimmed = input.trim().toLowerCase();
  if (trimmed.length === 0 || trimmed.length > 254) {
    throw new Error("invalid_email");
  }
  if (/[\r\n]/.test(trimmed)) {
    throw new Error("invalid_email");
  }
  if (!EMAIL_RE.test(trimmed)) {
    throw new Error("invalid_email");
  }
  return trimmed;
}
