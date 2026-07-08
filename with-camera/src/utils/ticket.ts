import type { ScanResult, TicketPayload } from "../types";

function getTextField(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export function parseTicketPayload(rawPayload: string): ScanResult {
  try {
    const parsed = JSON.parse(rawPayload) as TicketPayload;
    const source = getTextField(parsed.source);
    const destination = getTextField(parsed.destination);
    const isValid = parsed.validity === true || parsed.validity === "true";

    return {
      isValid,
      source,
      destination,
      rawPayload,
    };
  } catch {
    return {
      isValid: false,
      rawPayload,
    };
  }
}
