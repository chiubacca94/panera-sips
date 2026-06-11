// ─── API Response Types ────────────────────────────────────────────────────

export interface SipsStatus {
  isAvailable: boolean;
  lastClaim: string | null;    // ISO 8601 datetime string
  nextAvailable: string | null; // ISO 8601 datetime string
  remainingMs: number;
  progressPercent: number;      // 0–100
}

export interface ClaimResponse {
  success: boolean;
  claimedAt: string;           // ISO 8601 datetime string
  nextAvailable: string;       // ISO 8601 datetime string
}

export interface ResetResponse {
  success: boolean;
}

// ─── UI State ──────────────────────────────────────────────────────────────

export type LoadingState = "idle" | "loading" | "error";

export interface SipsClubState {
  status: SipsStatus | null;
  loadingState: LoadingState;
  error: string | null;
}
