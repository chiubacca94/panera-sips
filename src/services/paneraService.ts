import type { SipsStatus, ClaimResponse, ResetResponse } from "../types/sips";

const COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 hours
const STORAGE_KEY = "panera_sips_last_claim";

function buildStatus(): SipsStatus {
  const stored = localStorage.getItem(STORAGE_KEY);
  const lastClaim = stored ? new Date(stored) : null;
  const now = new Date();
  const elapsed = lastClaim ? now.getTime() - lastClaim.getTime() : COOLDOWN_MS;
  const remaining = Math.max(0, COOLDOWN_MS - elapsed);

  return {
    isAvailable: remaining === 0,
    lastClaim: lastClaim?.toISOString() ?? null,
    nextAvailable: lastClaim
      ? new Date(lastClaim.getTime() + COOLDOWN_MS).toISOString()
      : null,
    remainingMs: Math.round(remaining),
    progressPercent: Math.round(Math.min(100, (elapsed / COOLDOWN_MS) * 100)),
  };
}

export const paneraService = {
  getStatusSync(): SipsStatus {
    return buildStatus();
  },

  claimDrink(): Promise<ClaimResponse> {
    const status = buildStatus();
    if (!status.isAvailable) {
      return Promise.reject(
        new Error(
          `Drink not yet available. Try again in ${Math.ceil(status.remainingMs / 60_000)} minute(s).`
        )
      );
    }
    const claimedAt = new Date();
    localStorage.setItem(STORAGE_KEY, claimedAt.toISOString());
    return Promise.resolve({
      success: true,
      claimedAt: claimedAt.toISOString(),
      nextAvailable: new Date(claimedAt.getTime() + COOLDOWN_MS).toISOString(),
    });
  },

  reset(): Promise<ResetResponse> {
    localStorage.removeItem(STORAGE_KEY);
    return Promise.resolve({ success: true });
  },
};
