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
  const [alexaConnected, setAlexaConnected] = useState(false);
  const [watchConnected, setWatchConnected] = useState(false);
  const [alexaLastSync, setAlexaLastSync] = useState<string | null>(null);
  const [watchLastSync, setWatchLastSync] = useState<string | null>(null);

  return (
    <IntegrationContext.Provider
      value={{
        alexaConnected,
        watchConnected,
        alexaLastSync,
        watchLastSync,
        connectAlexa: () => { setAlexaConnected(true); setAlexaLastSync("Just now"); },
        disconnectAlexa: () => { setAlexaConnected(false); setAlexaLastSync(null); },
        connectWatch: () => { setWatchConnected(true); setWatchLastSync("Just now"); },
        disconnectWatch: () => { setWatchConnected(false); setWatchLastSync(null); },
      }}
    >
      {children}
    </IntegrationContext.Provider>
  );
};
