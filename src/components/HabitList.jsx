/**
 * HabitList
 * ---------
 * Renders the full habits panel:
 *   • Animated shimmer progress bar.
 *   • "All done" celebration banner (CheckCircle2 icon).
 *   • HabitRow items that slide in when newly added.
 *   • Seamless borderless input with animated underline.
 *
 * Props:
 *   habits    {array}    — [{ id, name, completedDates }]
 *   loading   {boolean}
 *   today     {string}   — "YYYY-MM-DD"
 *   onAdd     {(name: string) => void}
 *   onToggle  {(id: string, date: string) => void}
 *   onDelete  {(id: string) => void}
 */
import { useState } from "react";
import { Plus, CheckCircle2 } from "lucide-react";
import HabitRow from "./HabitRow";

export default function HabitList({
  habits,
  loading,
  today,
  onAdd,
  onToggle,
  onDelete,
}) {
  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);
  // Track the ID of the most recently added habit for the slide-in animation
  const [newestId, setNewestId] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setInputValue("");
    const result = await onAdd(trimmed);
    // onAdd returns the new habit from App.jsx — store its id to animate it
    if (result?.id) setNewestId(result.id);
  }

  const completedCount = habits.filter((h) =>
    h.completedDates.includes(today)
  ).length;
  const allDone = habits.length > 0 && completedCount === habits.length;
  const pct = habits.length > 0
    ? Math.round((completedCount / habits.length) * 100)
    : 0;

  return (
    <section aria-label="Habits">
      {/* ── Section header ──────────────────────────────────────── */}
      <div className="flex items-baseline justify-between mb-4">
        <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold select-none">
          Today's Habits
        </p>
        {habits.length > 0 && (
          <span
            className={[
              "text-xs font-semibold tabular-nums transition-all duration-300",
              allDone ? "text-indigo-500" : "text-slate-400 font-light",
            ].join(" ")}
          >
            {completedCount} / {habits.length}
          </span>
        )}
      </div>

      {/* ── Progress bar (shimmer when anything is completed) ───── */}
      {habits.length > 0 && (
        <div className="mb-5 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={[
              "h-full rounded-full transition-all duration-700 ease-in-out",
              completedCount > 0 ? "shimmer-bar" : "bg-slate-200",
            ].join(" ")}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* ── All-done celebration banner ─────────────────────────── */}
      {allDone && (
        <div className="mb-4 flex items-center gap-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 animate-fade-scale">
          <CheckCircle2 size={15} className="text-indigo-400 shrink-0" />
          <span className="text-xs text-indigo-600 font-medium tracking-wide">
            All done for today. Excellent work.
          </span>
        </div>
      )}

      {/* ── Habit rows ──────────────────────────────────────────── */}
      <div className="min-h-15 space-y-0.5">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-11 rounded-xl bg-[#F0EEE9] animate-pulse"
                style={{ opacity: 1 - i * 0.22 }}
              />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <p className="text-sm text-slate-400 font-normal py-4 select-none animate-slide-up">
            No habits yet. Add one below.
          </p>
        ) : (
          habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              today={today}
              onToggle={onToggle}
              onDelete={onDelete}
              isNew={habit.id === newestId}
            />
          ))
        )}
      </div>

      {/* ── Add habit input ─────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="mt-5 flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Add a new habit…"
            maxLength={80}
            className={[
              "w-full bg-transparent border-0 border-b-2 pb-1.5 pt-0.5",
              "text-sm font-normal text-slate-700 placeholder:text-slate-400",
              "outline-none transition-all duration-300",
              focused ? "border-indigo-400" : "border-slate-150",
            ].join(" ")}
          />
          {/* Animated glow underline grows from the left */}
          <span
            className="absolute bottom-0 left-0 h-0.5 bg-indigo-500 rounded-full transition-all duration-400 ease-out"
            style={{ width: focused && inputValue ? "100%" : "0%" }}
          />
        </div>

        <button
          type="submit"
          disabled={!inputValue.trim()}
          aria-label="Add habit"
          className={[
            "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            "transition-all duration-300 ease-out",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2",
            inputValue.trim()
              ? "bg-indigo-500 text-white hover:bg-indigo-600 hover:scale-110 active:scale-90 shadow-md shadow-indigo-200 cursor-pointer"
              : "bg-slate-100 text-slate-300 cursor-not-allowed",
          ].join(" ")}
        >
          <Plus size={15} strokeWidth={2.5} />
        </button>
      </form>
    </section>
  );
}
