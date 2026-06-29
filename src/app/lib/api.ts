// API client for OpenSMS. Sends Firebase bearer tokens when signed in, with
// x-api-key as a local-development fallback.

import { getValidFirebaseIdToken } from "./firebaseAuth";

export interface Message {
  id: string;
  request_id: string;
  environment?: "live" | "sandbox";
  direction: "outbound" | "inbound";
  message_type?: "general" | "otp" | "transactional" | "marketing";
  from: string;
  to: string;
  owner?: string;
  content: string;
  template_id?: string;
  template_name_snapshot?: string;
  network: string;
  provider: string;
  provider_msg_id: string;
  status: string;
  failure_reason: string;
  attempts: Array<{
    provider: string;
    provider_msg_id: string;
    status: string;
    error?: string;
    at: string;
  }> | null;
  created_at: string;
  updated_at: string;
}

export interface Balance {
  provider: string;
  balance: number;
  currency: string;
}

export interface Gateway {
  id: string;
  name: string;
  phone_number: string;
  environment?: "live" | "sandbox";
  mode?: "send_only" | "two_way";
  status: "online" | "offline";
  battery_percent: number;
  network: string;
  is_charging: boolean;
  last_seen_at?: string;
  created_at: string;
  updated_at: string;
}

export interface GatewayRegistration {
  gateway: Gateway;
  token: string;
  pairing_uri?: string;
  pairing_qr_data_uri?: string;
}

export interface OTPChallenge {
  id: string;
  environment?: "live" | "sandbox";
  to: string;
  purpose: string;
  brand: string;
  message_id: string;
  status: string;
  attempts: number;
  max_attempts: number;
  expires_at: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OTPSendResult {
  otp: OTPChallenge;
  message: Message | null;
  expires_at: string;
}

export interface OTPVerifyResult {
  otp_id: string;
  status: string;
  verified_at?: string;
}

export interface ManagedApiKey {
  id: string;
  name: string;
  prefix: string;
  last_used_at?: string;
  revoked_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateApiKeyResult {
  api_key: ManagedApiKey;
  plaintext_key: string;
}

export interface MarketingResult {
  campaign_id: string;
  accepted: number;
  failed: number;
  messages: Message[];
  errors?: string[];
}

export interface TransactionalTemplate {
  id: string;
  environment?: "live" | "sandbox";
  name: string;
  slug: string;
  content: string;
  variables: string[];
  status: "draft" | "active" | "archived";
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) || "";
const STORAGE_KEY = "phsms:apiKey";

export function getApiBaseUrl(): string {
  return API_BASE_URL || window.location.origin;
}

export function getApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function setApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } catch {
    // ignore
  }
}

export function clearApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; query?: Record<string, unknown> } = {},
): Promise<ApiResponse<T>> {
  const key = getApiKey();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const firebaseToken = await getValidFirebaseIdToken();
  if (firebaseToken) headers.Authorization = `Bearer ${firebaseToken}`;
  else if (key) headers["x-api-key"] = key;

  const url = new URL(path, getApiBaseUrl());
  if (options.query) {
    for (const [k, v] of Object.entries(options.query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJSON = contentType.includes("application/json");
  const payload = isJSON
    ? await res.json().catch(() => null)
    : null;

  if (payload && typeof payload === "object" && "status" in payload && "message" in payload) {
    return payload as ApiResponse<T>;
  }

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }

  throw new Error("API returned an unexpected response.");
}

export const api = {
  sendMessage: (payload: { from?: string; to: string; content: string; request_id?: string; environment?: "live" | "sandbox" }) =>
    request<Message>("/v1/messages/send", { method: "POST", body: payload }),

  sendOtp: (payload: { to: string; brand?: string; purpose?: string; ttl_seconds?: number; request_id?: string; environment?: "live" | "sandbox" }) =>
    request<OTPSendResult>("/v1/otp/send", { method: "POST", body: payload }),

  verifyOtp: (payload: { otp_id: string; code: string; environment?: "live" | "sandbox" }) =>
    request<OTPVerifyResult>("/v1/otp/verify", { method: "POST", body: payload }),

  listOtps: (limit = 100, environment?: "live" | "sandbox") =>
    request<OTPChallenge[]>("/v1/otp", { query: { limit, environment } }),

  sendTransactional: (payload: { to: string; template_id?: string; content?: string; variables?: Record<string, string>; request_id?: string; environment?: "live" | "sandbox" }) =>
    request<Message>("/v1/transactional/send", { method: "POST", body: payload }),

  listTransactionalTemplates: (limit = 100, environment?: "live" | "sandbox") =>
    request<TransactionalTemplate[]>("/v1/transactional/templates", { query: { limit, environment } }),

  getTransactionalTemplate: (id: string, environment?: "live" | "sandbox") =>
    request<TransactionalTemplate>(`/v1/transactional/templates/${id}`, { query: { environment } }),

  createTransactionalTemplate: (payload: { name: string; content: string; environment?: "live" | "sandbox" }) =>
    request<TransactionalTemplate>("/v1/transactional/templates", { method: "POST", body: payload }),

  updateTransactionalTemplate: (id: string, payload: { name: string; content: string; environment?: "live" | "sandbox" }) =>
    request<TransactionalTemplate>(`/v1/transactional/templates/${id}`, { method: "PATCH", body: payload }),

  activateTransactionalTemplate: (id: string, environment?: "live" | "sandbox") =>
    request<TransactionalTemplate>(`/v1/transactional/templates/${id}/activate`, { method: "POST", body: { environment } }),

  archiveTransactionalTemplate: (id: string, environment?: "live" | "sandbox") =>
    request<TransactionalTemplate>(`/v1/transactional/templates/${id}/archive`, { method: "POST", body: { environment } }),

  sendMarketing: (payload: { recipients: string[]; content: string; campaign_name?: string; consent_confirmed: boolean; request_id_prefix?: string; environment?: "live" | "sandbox" }) =>
    request<MarketingResult>("/v1/marketing/send", { method: "POST", body: payload }),

  getMessage: (id: string, refresh = false) =>
    request<Message>(`/v1/messages/${id}`, { query: { refresh } }),

  listMessages: (limit = 100, environment?: "live" | "sandbox") =>
    request<Message[]>("/v1/messages", { query: { limit, environment } }),

  listInbound: (limit = 100, environment?: "live" | "sandbox") =>
    request<Message[]>("/v1/messages/inbound", { query: { limit, environment } }),

  balances: () => request<Balance[]>("/v1/balance"),

  listApiKeys: () => request<ManagedApiKey[]>("/v1/account/api-keys"),

  createApiKey: (payload: { name?: string }) =>
    request<CreateApiKeyResult>("/v1/account/api-keys", { method: "POST", body: payload }),

  revokeApiKey: (id: string) =>
    request<ManagedApiKey>(`/v1/account/api-keys/${id}`, { method: "DELETE" }),

  listGateways: (environment?: "live" | "sandbox") => request<Gateway[]>("/v1/gateways", { query: { environment } }),

  registerGateway: (payload: { name?: string; phone_number: string; environment?: "live" | "sandbox"; mode?: "send_only" | "two_way" }) =>
    request<GatewayRegistration>("/v1/gateways/register", { method: "POST", body: payload }),
};

// ── PH phone helpers ────────────────────────────────────────────────────────
const PH_PREFIX_MAP: Record<string, string> = {
  "905": "Globe", "906": "Globe", "915": "Globe", "916": "Globe", "917": "Globe",
  "926": "Globe", "927": "Globe", "935": "Globe", "936": "Globe", "937": "Globe",
  "949": "TM", "953": "TM", "963": "TM", "933": "TM",
  "907": "Smart", "908": "Smart", "918": "Smart", "919": "Smart", "920": "Smart",
  "921": "Smart", "928": "Smart", "929": "Smart", "930": "Smart", "939": "Smart",
  "910": "TNT", "911": "TNT", "912": "TNT", "913": "TNT", "914": "TNT",
  "948": "TNT", "970": "TNT", "971": "TNT",
  "922": "Sun", "923": "Sun", "924": "Sun", "925": "Sun", "932": "Sun",
  "991": "DITO", "992": "DITO", "993": "DITO",
};

export function detectNetwork(input: string): string {
  const digits = input.replace(/[\s\-().]/g, "");
  let core = digits;
  if (core.startsWith("+63")) core = core.slice(3);
  else if (core.startsWith("63")) core = core.slice(2);
  else if (core.startsWith("0")) core = core.slice(1);
  if (core.length >= 3) return PH_PREFIX_MAP[core.slice(0, 3)] || "Unknown";
  return "";
}

export function networkColor(network: string): string {
  switch (network) {
    case "Globe": case "TM": return "#3b82f6";
    case "Smart": case "TNT": case "Sun": return "#f97316";
    case "DITO": return "#ef4444";
    default: return "#94a3b8";
  }
}
