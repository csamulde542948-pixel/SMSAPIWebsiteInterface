import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  api,
  clearApiKey,
  getApiKey,
  setApiKey,
  type Balance,
  type Gateway,
  type GatewayRegistration,
  type ManagedApiKey,
  type Message,
  type OTPChallenge,
  type TransactionalTemplate,
} from "../lib/api";
import { defaultEnvironmentFromHost } from "../lib/environment";
import type { FirebaseSession } from "../lib/firebaseAuth";
import type { DashboardDataActions, DashboardDataState, DashboardMetrics, Environment, GatewayMode } from "./types";
import { buildVolume } from "./utils";

export function useDashboardState(session: FirebaseSession | null): {
  state: DashboardDataState;
  actions: DashboardDataActions;
  metrics: DashboardMetrics;
} {
  const [hasApiKey, setHasApiKey] = useState(Boolean(session || getApiKey()));
  const [apiInput, setApiInput] = useState("");
  const [apiKeyName, setApiKeyName] = useState("Default key");
  const [accountApiKeys, setAccountApiKeys] = useState<ManagedApiKey[]>([]);
  const [createdApiKey, setCreatedApiKey] = useState("");
  const [apiKeyStatus, setApiKeyStatus] = useState("");
  const [balances, setBalances] = useState<Balance[]>([]);
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otps, setOtps] = useState<OTPChallenge[]>([]);
  const [templates, setTemplates] = useState<TransactionalTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [gatewayName, setGatewayName] = useState("");
  const [gatewayPhone, setGatewayPhone] = useState("");
  const [gatewayMode, setGatewayMode] = useState<GatewayMode>("send_only");
  const [gatewayPairing, setGatewayPairing] = useState<GatewayRegistration | null>(null);
  const [gatewayError, setGatewayError] = useState("");
  const [environment, setEnvironmentState] = useState<Environment>(() => defaultEnvironmentFromHost());
  const hasAccountSession = Boolean(session);

  const loadData = useCallback(async () => {
    if (!session && !getApiKey()) {
      setHasApiKey(false);
      return;
    }
    setHasApiKey(true);
    setLoading(true);
    try {
      const [balanceResponse, messageResponse, gatewayResponse, otpResponse, templateResponse, apiKeyResponse] = await Promise.all([
        api.balances().catch(() => null),
        api.listMessages(150, environment).catch(() => null),
        api.listGateways(environment).catch(() => null),
        api.listOtps(100, environment).catch(() => null),
        api.listTransactionalTemplates(100, environment).catch(() => null),
        hasAccountSession ? api.listApiKeys().catch(() => null) : Promise.resolve(null),
      ]);
      if (balanceResponse?.data) setBalances(balanceResponse.data);
      if (messageResponse?.data) setMessages(messageResponse.data);
      if (gatewayResponse?.data) setGateways(gatewayResponse.data);
      if (otpResponse?.data) setOtps(otpResponse.data);
      if (templateResponse?.data) setTemplates(templateResponse.data);
      if (apiKeyResponse?.data) setAccountApiKeys(apiKeyResponse.data);
    } finally {
      setLoading(false);
    }
  }, [environment, hasAccountSession, session]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    setGatewayPairing(null);
    setGatewayError("");
    setSearch("");
  }, [environment]);

  const inbound = useMemo(
    () => messages.filter((message) => message.direction === "inbound"),
    [messages],
  );

  const volume = useMemo(() => buildVolume(messages), [messages]);
  const deliveredCount = messages.filter((message) => ["delivered", "received"].includes(message.status)).length;
  const routeCount = messages.filter((message) => ["pending", "sent", "delivered", "received"].includes(message.status)).length;
  const deliveryRate = messages.length ? Math.round((deliveredCount / messages.length) * 100) : 0;
  const failedCount = messages.filter((message) => ["failed", "expired"].includes(message.status)).length;
  const onlineGateways = gateways.filter((gateway) => gateway.status === "online").length;

  const filteredMessages = useMemo(() => {
    if (!search.trim()) return messages;
    const q = search.toLowerCase();
    return messages.filter((message) =>
      message.to.toLowerCase().includes(q) ||
      message.from?.toLowerCase().includes(q) ||
      message.content.toLowerCase().includes(q) ||
      message.network.toLowerCase().includes(q) ||
      message.status.toLowerCase().includes(q),
    );
  }, [messages, search]);

  const filteredInbound = useMemo(() => {
    if (!search.trim()) return inbound;
    const q = search.toLowerCase();
    return inbound.filter((message) =>
      message.from?.toLowerCase().includes(q) ||
      message.content.toLowerCase().includes(q) ||
      message.network.toLowerCase().includes(q) ||
      message.status.toLowerCase().includes(q),
    );
  }, [inbound, search]);

  const saveBrowserKey = useCallback(() => {
    if (!apiInput.trim()) return;
    setApiKey(apiInput.trim());
    setApiInput("");
    setHasApiKey(true);
    setApiKeyStatus("Saved in this browser for local testing.");
    toast.success("API key saved", { description: "Stored locally in this browser for testing." });
    void loadData();
  }, [apiInput, loadData]);

  const clearBrowserKey = useCallback(() => {
    clearApiKey();
    if (!session) {
      setHasApiKey(false);
      setBalances([]);
      setGateways([]);
      setMessages([]);
      setTemplates([]);
      setAccountApiKeys([]);
    } else {
      setHasApiKey(true);
    }
    setApiKeyStatus("Saved browser key cleared.");
    toast.success("Browser key cleared");
  }, [session]);

  const upsertMessages = useCallback((items: Message[]) => {
    if (!items.length) return;
    setMessages((previous) =>
      [...items, ...previous.filter((message) => !items.some((item) => item.id === message.id))]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    );
  }, []);

  const registerGateway = useCallback(async () => {
    if (!gatewayPhone.trim()) return;
    setGatewayError("");
    setGatewayPairing(null);
    try {
      const response = await api.registerGateway({
        name: gatewayName || undefined,
        phone_number: gatewayPhone,
        environment,
        mode: gatewayMode,
      });
      if (response.status === "error") {
        setGatewayError(response.message);
        toast.error("Gateway registration failed", { description: response.message });
        return;
      }
      setGateways((previous) => [response.data.gateway, ...previous]);
      setGatewayPairing(response.data);
      setGatewayName("");
      setGatewayPhone("");
      toast.success("Gateway registered", { description: "Scan the QR code or paste the token in the Android app." });
    } catch (event: any) {
      const message = event?.message || "Unable to register gateway.";
      setGatewayError(message);
      toast.error("Gateway registration failed", { description: message });
    }
  }, [environment, gatewayMode, gatewayName, gatewayPhone]);

  const copyWebhook = useCallback(() => {
    navigator.clipboard.writeText(`${window.location.origin}/webhooks/httpsms`).catch(() => {});
    setCopied(true);
    toast.success("Webhook URL copied");
    window.setTimeout(() => setCopied(false), 1400);
  }, []);

  const createManagedApiKey = useCallback(async () => {
    setApiKeyStatus("");
    setCreatedApiKey("");
    if (!session) {
      const message = "Sign in with Google first to create account API keys.";
      setApiKeyStatus(message);
      toast.error("Sign in required", { description: message });
      return;
    }
    try {
      const response = await api.createApiKey({ name: apiKeyName || undefined });
      if (response.status === "error") {
        setApiKeyStatus(response.message);
        toast.error("Unable to create API key", { description: response.message });
        return;
      }
      setAccountApiKeys((previous) => [response.data.api_key, ...previous]);
      setCreatedApiKey(response.data.plaintext_key);
      setApiKeyStatus("New API key created. Copy it now; the full value is only shown once.");
      toast.success("API key created", { description: "Copy it now — the full value is only shown once." });
    } catch (event: any) {
      const message = event?.message || "Unable to create API key.";
      setApiKeyStatus(message);
      toast.error("Unable to create API key", { description: message });
    }
  }, [apiKeyName, session]);

  const revokeManagedApiKey = useCallback(async (id: string) => {
    setApiKeyStatus("");
    try {
      const response = await api.revokeApiKey(id);
      if (response.status === "error") {
        setApiKeyStatus(response.message);
        toast.error("Unable to revoke API key", { description: response.message });
        return;
      }
      setAccountApiKeys((previous) => previous.map((apiKey) => (apiKey.id === id ? response.data : apiKey)));
      setApiKeyStatus("API key revoked.");
      toast.success("API key revoked");
    } catch (event: any) {
      const message = event?.message || "Unable to revoke API key.";
      setApiKeyStatus(message);
      toast.error("Unable to revoke API key", { description: message });
    }
  }, []);

  const state: DashboardDataState = {
    hasApiKey,
    hasAccountSession,
    apiInput,
    apiKeyName,
    accountApiKeys,
    createdApiKey,
    apiKeyStatus,
    balances,
    gateways,
    messages,
    otps,
    templates,
    loading,
    copied,
    search,
    gatewayName,
    gatewayPhone,
    gatewayMode,
    gatewayPairing,
    gatewayError,
    environment,
  };

  const actions: DashboardDataActions = {
    setApiInput,
    setApiKeyName,
    setSearch,
    setGatewayName,
    setGatewayPhone,
    setGatewayMode,
    setEnvironment: setEnvironmentState,
    setCopied,
    setGatewayError,
    setGatewayPairing,
    saveBrowserKey,
    clearBrowserKey,
    loadData,
    upsertMessages,
    registerGateway,
    copyWebhook,
    createManagedApiKey,
    revokeManagedApiKey,
  };

  const metrics: DashboardMetrics = {
    inbound,
    volume,
    deliveredCount,
    routeCount,
    deliveryRate,
    failedCount,
    onlineGateways,
    filteredMessages,
    filteredInbound,
  };

  return { state, actions, metrics };
}
