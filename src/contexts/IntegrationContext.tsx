import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface IntegrationState {
  alexaConnected: boolean;
  alexaDevices: { id: number; linked_at: string }[];
  alexaLoading: boolean;
  refreshAlexa: () => Promise<void>;
  disconnectAlexa: () => Promise<void>;
  // Watch sync is not implemented yet — roadmap-only state.
  watchConnected: boolean;
  watchLastSync: string | null;
}

const IntegrationContext = createContext<IntegrationState | null>(null);

export const useIntegration = () => {
  const ctx = useContext(IntegrationContext);
  if (!ctx) throw new Error("useIntegration must be within IntegrationProvider");
  return ctx;
};

export const IntegrationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [alexaConnected, setAlexaConnected] = useState(false);
  const [alexaDevices, setAlexaDevices] = useState<{ id: number; linked_at: string }[]>([]);
  const [alexaLoading, setAlexaLoading] = useState(false);

  const refreshAlexa = useCallback(async () => {
    if (!user) {
      setAlexaConnected(false);
      setAlexaDevices([]);
      return;
    }
    setAlexaLoading(true);
    try {
      const status = await api.getAlexaLinkStatus();
      setAlexaConnected(!!status.linked);
      setAlexaDevices(status.devices ?? []);
    } catch (err) {
      console.error("Failed to load Alexa link status", err);
    } finally {
      setAlexaLoading(false);
    }
  }, [user]);

  const disconnectAlexa = useCallback(async () => {
    try {
      await api.unlinkAlexa();
    } finally {
      await refreshAlexa();
    }
  }, [refreshAlexa]);

  useEffect(() => {
    refreshAlexa();
  }, [refreshAlexa]);

  return (
    <IntegrationContext.Provider
      value={{
        alexaConnected,
        alexaDevices,
        alexaLoading,
        refreshAlexa,
        disconnectAlexa,
        watchConnected: false,
        watchLastSync: null,
      }}
    >
      {children}
    </IntegrationContext.Provider>
  );
};
