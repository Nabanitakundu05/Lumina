/**
 * HabitRow
 * --------
 * A single habit item with:
 *   • A spring-bouncing circular checkbox (animates via animate-check-pop).
 *   • An animated left-accent bar + row tint when completed.
 *   • An overlay strikethrough that grows from 0→100% width on completion.
 *   • A delete button revealed on row hover.
 *
 * Props:
 *   habit       {object}  — { id, name, completedDates: string[] }
 *   today       {string}  — ISO date string "YYYY-MM-DD"
 *   onToggle    {(id: string, date: string) => void}
 *   onDelete    {(id: string) => void}
 *   isNew       {boolean} — if true, animate the row sliding in
 */
import { useState } from "react";
import { Check, Trash2 } from "lucide-react";

export default function HabitRow({ habit, today, onToggle, onDelete, isNew }) {
  const isCompleted = habit.completedDates.includes(today);
  // Tracks the exact moment of checking so we can fire the bounce animation
  const [justChecked, setJustChecked] = useState(false);

  function handleToggle() {
    if (!isCompleted) {
      setJustChecked(true);
      setTimeout(() => setJustChecked(false), 420);
    }
    onToggle(habit.id, today);
  }

  return (
    <div
      className={[
        "group relative flex items-center gap-4 py-3.5 px-3 rounded-xl",
        "transition-all duration-300 ease-out",
        isNew ? "animate-slide-row" : "",
        isCompleted
          ? "bg-indigo-50/40"
          : "hover:bg-slate-50",
      ].join(" ")}
    >
      {/* ── Left accent bar ─────────────────────────────────────── */}
      <div
        className={[
          "absolute left-0 top-2 bottom-2 w-[3px] rounded-full transition-all duration-400",
          isCompleted ? "bg-indigo-400" : "bg-transparent",
        ].join(" ")}
      />

      {/* ── Circular checkbox ───────────────────────────────────── */}
      <button
        aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
        onClick={handleToggle}
        className={[
          "shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center",
          "transition-all duration-300 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2",
          "hover:scale-110 active:scale-90 cursor-pointer",
          isCompleted
            ? "border-indigo-500 bg-indigo-500 shadow-md shadow-indigo-100"
            : "border-slate-200 hover:border-indigo-300 hover:shadow-sm hover:shadow-indigo-50",
        ].join(" ")}
      >
        <Check
          size={13}
          strokeWidth={3}
          className={[
            isCompleted ? "text-white" : "text-transparent",
            // Play spring-bounce animation when just checked; static when already done
            isCompleted && justChecked ? "animate-check-pop" : "",
          ].join(" ")}
        />
      </button>

      {/* ── Habit name with animated strikethrough overlay ──────── */}
      <span className="relative flex-1 text-sm font-light tracking-wide select-none">
        <span
          className={[
            "transition-all duration-400",
            isCompleted ? "text-slate-400" : "text-slate-700",
          ].join(" ")}
        >
          {habit.name}
        </span>
        {/* Strikethrough line grows from left to right */}
        <span
          className="absolute left-0 top-1/2 -translate-y-px h-px bg-slate-300 rounded-full transition-all duration-500 ease-out"
          style={{ width: isCompleted ? "100%" : "0%" }}
        />
      </span>

      {/* ── Delete button ───────────────────────────────────────── */}
      <button
        aria-label="Delete habit"
        onClick={() => onDelete(habit.id)}
        className={[
          "shrink-0 p-1.5 rounded-lg",
          "text-slate-200 hover:text-rose-400 hover:bg-rose-50",
          "opacity-0 group-hover:opacity-100",
          "transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer",
          "focus:outline-none focus-visible:opacity-100",
        ].join(" ")}
      >
        <Trash2 size={14} strokeWidth={1.75} />
      </button>
    </div>
  );
}
