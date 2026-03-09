/**
 * DashboardLayout
 * ---------------
 * Premium layout shell with a warm off-white background,
 * clean white header with an indigo/violet logo mark,
 * and a bold gradient greeting.
 */
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F7F6F3] text-slate-800 antialiased">
      {/* ── Top nav bar ─────────────────────────────────────────── */}
      <header className="w-full bg-white border-b border-[#EAE8E4] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-[60px] flex items-center justify-between">
          {/* Brand mark */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[10px] bg-gradient-to-br from-indigo-500 to-indigo-600 shrink-0" />
            <span className="text-sm font-bold tracking-tight text-slate-900 select-none">
              Lumina
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium tracking-wide select-none">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Page heading */}
        <div className="mb-10">
          <h1 className="text-[2rem] font-bold tracking-tight text-slate-900 leading-snug">
            Good{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {getGreeting()}
            </span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Build momentum, one day at a time.
          </p>
        </div>

        {/* Two-column grid — stacks on small screens */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
          {children}
        </div>
      </main>
    </div>
  );
}

/** Returns "morning.", "afternoon.", or "evening." based on local time. */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning.";
  if (hour < 18) return "afternoon.";
  return "evening.";
}
