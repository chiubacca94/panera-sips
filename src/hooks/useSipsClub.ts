import { useState, useEffect, useCallback } from "react";
import { paneraService } from "../services/paneraService";
import { googleService } from "../services/googleService";
import type { SipsStatus, LoadingState } from "../types/sips";

const TICK_MS = 1_000;

interface UseSipsClubReturn {
  status: SipsStatus | null;
  loadingState: LoadingState;
  error: string | null;
  claim: () => Promise<void>;
  reset: () => Promise<void>;
  refresh: () => void;
}

export function useSipsClub(): UseSipsClubReturn {
  const [status, setStatus]             = useState<SipsStatus>(() => paneraService.getStatusSync());
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setStatus(paneraService.getStatusSync()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  const claim = useCallback(async () => {
    setLoadingState("loading");
    try {
      await paneraService.claimDrink();
      setStatus(paneraService.getStatusSync());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim drink");
    } finally {
      setLoadingState("idle");
    }
  }, []);

  const reset = useCallback(async () => {
    setLoadingState("loading");
    try {
      await paneraService.reset();
      setStatus(paneraService.getStatusSync());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset");
    } finally {
      setLoadingState("idle");
    }
  }, []);

  return {
    status,
    loadingState,
    error,
    claim,
    reset,
    refresh: () => setStatus(paneraService.getStatusSync()),
  };
}
