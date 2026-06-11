import React from "react";
import { Coffee, RotateCcw, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import CountdownRing from "./components/CountdownRing";
import { useSipsClub } from "./hooks/useSipsClub";

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

const App: React.FC = () => {
  const { status, loadingState, error, claim, reset, refresh } = useSipsClub();

  const isAvailable = status?.isAvailable ?? true;
  const remainingMs = status?.remainingMs ?? 0;
  const progressPct = status?.progressPercent ?? 100;
  const isBusy      = loadingState === "loading" && !status;

  return (
    <div
      className="min-h-screen bg-amber-50"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes pulse-ring  { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes pop-in      { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes slide-up    { from { transform: translateY(14px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes spin        { to { transform: rotate(360deg); } }
        .ring-pulse { animation: pulse-ring 2s ease-in-out infinite; }
        .pop-in     { animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .slide-up   { animation: slide-up 0.35s ease-out both; }
        .spin       { animation: spin 1s linear infinite; }
        .claim-btn  { transition: all 0.15s ease; }
        .claim-btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(21,128,61,0.25); }
        .claim-btn:active:not(:disabled){ transform: scale(0.97); }
        .icon-btn   { transition: all 0.15s ease; }
        .icon-btn:hover { background: #f3f4f6; }
      `}</style>

      <header className="bg-green-900 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
            <Coffee size={16} color="#14532d" />
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-amber-50 text-lg tracking-wide">
            Sips Club
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-300 text-xs font-medium">1 drink every 2 hrs</span>
          <button onClick={refresh} className="icon-btn p-1.5 rounded-lg text-green-400 hover:text-green-200" title="Refresh">
            <RefreshCw size={13} className={loadingState === "loading" ? "spin" : undefined} />
          </button>
        </div>
      </header>

      <main className="max-w-sm mx-auto px-4 py-8">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
            <button onClick={refresh} className="ml-auto text-xs underline underline-offset-2 font-medium">Retry</button>
          </div>
        )}

        {isBusy ? (
          <div className="bg-white rounded-3xl p-7 shadow-md text-center animate-pulse">
            <div className="w-[200px] h-[200px] rounded-full bg-gray-100 mx-auto mb-5" />
            <div className="h-4 bg-gray-100 rounded-full w-48 mx-auto mb-3" />
            <div className="h-4 bg-gray-100 rounded-full w-32 mx-auto mb-5" />
            <div className="h-11 bg-gray-100 rounded-xl w-48 mx-auto" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-7 shadow-md text-center slide-up">
            <div className="flex justify-center mb-5">
              <CountdownRing remainingMs={remainingMs} progressPercent={progressPct} isAvailable={isAvailable} />
            </div>

            {isAvailable ? (
              <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-800 text-sm font-semibold rounded-full px-4 py-1.5 mb-5">
                <Sparkles size={13} />
                Your drink is available now!
              </div>
            ) : (
              <p className="text-stone-400 text-sm mb-5 leading-snug">
                {status?.nextAvailable ? (
                  <>Next available at <strong className="text-stone-600">{fmtTime(status.nextAvailable)}</strong></>
                ) : "Tap below after you grab your drink"}
              </p>
            )}

            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1.5 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.round(progressPct)}%`, background: isAvailable ? "#16a34a" : "#15803d", transition: "width 0.6s ease" }}
              />
            </div>
            <div className="flex justify-between text-xs text-stone-300 mb-5">
              <span>0 min</span>
              <span className="text-stone-400 font-medium">{Math.round(progressPct)}% elapsed</span>
              <span>120 min</span>
            </div>

            <div className="flex gap-2 justify-center items-center">
              <button
                onClick={claim}
                disabled={!isAvailable || loadingState === "loading"}
                className="claim-btn flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm"
                style={{
                  background: isAvailable ? "#15803d" : "#e5e7eb",
                  color:      isAvailable ? "#fff"    : "#9ca3af",
                  border: "none",
                  cursor: isAvailable ? "pointer" : "not-allowed",
                }}
              >
                <Coffee size={15} />
                {isAvailable ? "I Just Got My Drink!" : "Cooling Down…"}
              </button>
              {status?.lastClaim && (
                <button onClick={reset} className="icon-btn p-3 rounded-xl border border-gray-200 text-stone-400" title="Reset timer">
                  <RotateCcw size={15} />
                </button>
              )}
            </div>

            {status?.lastClaim && (
              <p className="text-xs text-stone-300 mt-3">Claimed at {fmtTime(status.lastClaim)}</p>
            )}
          </div>
        )}

        <p className="text-center text-xs text-stone-300 mt-6 leading-relaxed">
          Panera Unlimited Sip Club · $14.99/mo or $119.99/yr<br />
          Free refills while dining in · Resets every 2 hours
        </p>
      </main>
    </div>
  );
};

export default App;
