/**
 * TrendsChart
 * -----------
 * A clean, minimal dual-line chart (Mood + Habits) over 7 days.
 * Uses recharts with stripped-back styling:
 *   • No grid lines, no axis borders, no tick marks.
 *   • Smooth monotone curves with soft semi-transparent area fills.
 *   • Custom tooltip card matching the app's design system.
 *
 * Props:
 *   data     {array}   — [{ date, mood, habitsCompleted }]
 *   loading  {boolean}
 */
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
  Legend,
} from "recharts";

/** Custom tooltip rendered inside the chart. */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white border border-[#EAE8E4] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-4 py-3 text-xs">
      <p className="text-slate-500 font-semibold mb-2 tracking-wide">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mb-1 last:mb-0">
          <span
            className="w-2 h-2 rounded-full inline-block shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-500 capitalize">{entry.name}:</span>
          <span className="text-slate-800 font-semibold tabular-nums">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Custom legend rendered below the chart. */
function CustomLegend() {
  const items = [
    { color: "#6366f1", label: "Mood" },
    { color: "#14b8a6", label: "Habits" },
  ];
  return (
    <div className="flex items-center justify-center gap-6 mt-4">
      {items.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span
            className="w-5 h-0.5 inline-block rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function TrendsChart({ data, loading }) {
  return (
    <section aria-label="Trends chart">
      <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-5 font-semibold select-none">
        7-Day Trends
      </p>

      {loading ? (
        /* Skeleton */
        <div className="h-48 rounded-2xl bg-[#F0EEE9] animate-pulse" />
      ) : (
        <div className="w-full">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={data}
              margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
            >
              {/* ── Gradient fills ──────────────────────────────── */}
              <defs>
                <linearGradient id="gradMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradHabits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* ── Axes: hide borders and ticks completely ──────── */}
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 400 }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                domain={[0, 5]}
                tickCount={3}
              />

              {/* ── No CartesianGrid — keeping it minimal ─────────── */}

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#EAE8E4", strokeWidth: 1 }}
              />

              {/* Mood area */}
              <Area
                type="monotone"
                dataKey="mood"
                name="Mood"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#gradMood)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#6366f1",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />

              {/* Habits area */}
              <Area
                type="monotone"
                dataKey="habitsCompleted"
                name="Habits"
                stroke="#14b8a6"
                strokeWidth={2}
                fill="url(#gradHabits)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#14b8a6",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>

          <CustomLegend />
        </div>
      )}
    </section>
  );
}
