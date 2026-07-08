export type Screen = "home" | "scan" | "result";

export type TicketPayload = {
  source?: unknown;
  destination?: unknown;
  validity?: unknown;
};

export type ScanResult = {
  isValid: boolean;
  source?: string;
  destination?: string;
  rawPayload: string;
};
