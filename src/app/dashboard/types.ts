import type { Balance, Gateway, GatewayRegistration, ManagedApiKey, Message, OTPChallenge, TransactionalTemplate } from "../lib/api";
import type { FirebaseSession } from "../lib/firebaseAuth";

export type Environment = "live" | "sandbox";
export type GatewayMode = "send_only" | "two_way";

export type DashTab =
  | "playground"
  | "overview"
  | "otp"
  | "transactional"
  | "marketing"
  | "gateways"
  | "messages"
  | "inbound"
  | "settings";

export type EnvironmentPage = {
  id: Environment;
  title: string;
  label: string;
  detail: string;
};

export type DashboardDataState = {
  hasApiKey: boolean;
  hasAccountSession: boolean;
  apiInput: string;
  apiKeyName: string;
  accountApiKeys: ManagedApiKey[];
  createdApiKey: string;
  apiKeyStatus: string;
  balances: Balance[];
  gateways: Gateway[];
  messages: Message[];
  otps: OTPChallenge[];
  templates: TransactionalTemplate[];
  loading: boolean;
  copied: boolean;
  search: string;
  gatewayName: string;
  gatewayPhone: string;
  gatewayMode: GatewayMode;
  gatewayPairing: GatewayRegistration | null;
  gatewayError: string;
  environment: Environment;
};

export type DashboardDataActions = {
  setApiInput: (value: string) => void;
  setApiKeyName: (value: string) => void;
  setSearch: (value: string) => void;
  setGatewayName: (value: string) => void;
  setGatewayPhone: (value: string) => void;
  setGatewayMode: (value: GatewayMode) => void;
  setEnvironment: (environment: Environment) => void;
  setCopied: (value: boolean) => void;
  setGatewayError: (value: string) => void;
  setGatewayPairing: (value: GatewayRegistration | null) => void;
  saveBrowserKey: () => void;
  clearBrowserKey: () => void;
  loadData: () => Promise<void>;
  upsertMessages: (items: Message[]) => void;
  registerGateway: () => Promise<void>;
  copyWebhook: () => void;
  createManagedApiKey: () => Promise<void>;
  revokeManagedApiKey: (id: string) => Promise<void>;
};

export type DashboardMetrics = {
  inbound: Message[];
  volume: Array<{ day: string; otp: number; transactional: number; marketing: number; general: number }>;
  deliveredCount: number;
  routeCount: number;
  deliveryRate: number;
  failedCount: number;
  onlineGateways: number;
  filteredMessages: Message[];
  filteredInbound: Message[];
};

export type DashboardProps = {
  session: FirebaseSession | null;
  tab: DashTab;
  onTabChange: (tab: DashTab) => void;
  onBack: () => void;
  onSignOut: () => void;
};
