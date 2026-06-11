import React from "react";
import { CheckCircle } from "lucide-react";

// ─── Constants ─────────────────────────────────────────────────────────────

const R   = 88;
const SW  = 10;
const C   = 2 * Math.PI * R;
const DIM = (R + SW + 2) * 2; // 200

// ─── Helpers ───────────────────────────────────────────────────────────────

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function getTimeParts(ms: number): { h: string; m: string; s: string } {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return {
    h: pad(Math.floor(total / 3600)),
    m: pad(Math.floor((total % 3600) / 60)),
    s: pad(total % 60),
  };
}

// ─── Props ─────────────────────────────────────────────────────────────────

interface CountdownRingProps {
  remainingMs: number;
  progressPercent: number; // 0–100
  isAvailable: boolean;
}

// ─── Component ─────────────────────────────────────────────────────────────

const CountdownRing: React.FC<CountdownRingProps> = ({
  remainingMs,
  progressPercent,
  isAvailable,
}) => {
  const dashOffset = C * (1 - progressPercent / 100);
  const { h, m, s } = getTimeParts(remainingMs);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: DIM, height: DIM }}
      role="timer"
      aria-label={
        isAvailable
          ? "Drink available"
          : `${h} hours ${m} minutes ${s} seconds remaining`
      }
    >
      <svg
        width={DIM}
        height={DIM}
        viewBox={`0 0 ${DIM} ${DIM}`}
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={DIM / 2} cy={DIM / 2} r={R}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={SW}
        />
        {/* Progress arc */}
        <circle
          cx={DIM / 2} cy={DIM / 2} r={R}
          fill="none"
          stroke={isAvailable ? "#16a34a" : "#15803d"}
          strokeWidth={SW}
          strokeDasharray={C}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${DIM / 2} ${DIM / 2})`}
          style={{
            transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease",
          }}
          className={isAvailable ? "ring-pulse" : undefined}
        />
      </svg>

      {/* Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isAvailable ? (
          <div key="ready" className="pop-in flex flex-col items-center gap-1">
            <CheckCircle size={30} color="#16a34a" />
            <span className="text-green-700 font-semibold text-sm">Ready!</span>
          </div>
        ) : (
          <div key="countdown" className="text-center">
            <div
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-stone-900 text-4xl leading-none tracking-tight"
            >
              {h}:{m}
            </div>
            <div
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-stone-400 text-2xl leading-none mt-1"
            >
              :{s}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownRing;
