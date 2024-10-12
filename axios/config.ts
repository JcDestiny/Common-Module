import { UrlConfigs } from "./@type";
const VERSION = "1.0.0";

const globalConfig: UrlConfigs = {
  HOST: "",
  PROTOCOL: "",
  GATEWAY_PATH: "/api/gateway",
  ACCOUNT_PATH: "/api/account",
  OPS_PATH: "/api/ops",
  STATISTICS_PATH: "/api/statistic",
  DS_CENTER_PATH: "/api/ds_center",
  ACM_PATH: "/api/acm",
};

const kv = {
  development: {
    HOST: "",
    PROTOCOL: "",
    SOCKET_URL: "/api/webSocket",
  },
  dev: {
    HOST: "",
    PROTOCOL: "",
    SOCKET_URL: "/api/webSocket",
  },
  demo: {
    HOST: "",
    PROTOCOL: "",
    SOCKET_URL: "/api/webSocket",
    bucket: "demo-mine-1256867526",
    eleBucket: "qa-billing-1256867526",
  },
};
const env = localStorage.getItem("env") || "development";

const config: UrlConfigs = {
  ...globalConfig,
  ...(localStorage.getItem("env") && { ...kv[env as keyof typeof kv] }),
};
export default config;

export const version = VERSION;
