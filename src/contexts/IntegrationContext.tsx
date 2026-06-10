import React, { createContext, useContext, useState, ReactNode } from "react";

interface IntegrationState {
  alexaConnected: boolean;
  watchConnected: boolean;
  alexaLastSync: string | null;
  watchLastSync: string | null;
  connectAlexa: () => void;
  disconnectAlexa: () => void;
  connectWatch: () => void;
  disconnectWatch: () => void;
}

const IntegrationContext = createContext<IntegrationState | null>(null);

export const useIntegration = () => {
  const ctx = useContext(IntegrationContext);
  if (!ctx) throw new Error("useIntegration must be within IntegrationProvider");
  return ctx;
};

export const IntegrationProvider = ({ children }: { children: ReactNode }) => {
  const [alexaConnected, setAlexaConnected] = useState(() => localStorage.getItem("alexa_connected") === "true");
  const [watchConnected, setWatchConnected] = useState(() => localStorage.getItem("watch_connected") === "true");
  const [alexaLastSync, setAlexaLastSync] = useState<string | null>(() => localStorage.getItem("alexa_last_sync"));
  const [watchLastSync, setWatchLastSync] = useState<string | null>(() => localStorage.getItem("watch_last_sync"));

  return (
    <IntegrationContext.Provider
      value={{
        alexaConnected,
        watchConnected,
        alexaLastSync,
        watchLastSync,
        connectAlexa: () => {
          const now = new Date().toLocaleString("en-AU", { timeZone: "Australia/Melbourne" });
          setAlexaConnected(true);
          setAlexaLastSync(now);
          localStorage.setItem("alexa_connected", "true");
          localStorage.setItem("alexa_last_sync", now);
        },
        disconnectAlexa: () => {
          setAlexaConnected(false);
          setAlexaLastSync(null);
          localStorage.removeItem("alexa_connected");
          localStorage.removeItem("alexa_last_sync");
        },
        connectWatch: () => {
          const now = new Date().toLocaleString("en-AU", { timeZone: "Australia/Melbourne" });
          setWatchConnected(true);
          setWatchLastSync(now);
          localStorage.setItem("watch_connected", "true");
          localStorage.setItem("watch_last_sync", now);
        },
        disconnectWatch: () => {
          setWatchConnected(false);
          setWatchLastSync(null);
          localStorage.removeItem("watch_connected");
          localStorage.removeItem("watch_last_sync");
        },
      }}
    >
      {children}
    </IntegrationContext.Provider>
  );
};
