/**
 * App.jsx
 * -------
 * Root application component. Orchestrates all state and API calls,
 * then composes the UI from the four core components.
 *
 * State owned here (lifted up for cross-component sharing):
 *   habits       — list of all habit objects
 *   trendsData   — 7-day mood+habits array for the chart
 *   selectedMood — currently selected mood score (1-5)
 *   loading      — per-section loading flags
 *   toast        — floating notification state
 */
import { useState, useEffect, useCallback } from "react";
import { CheckCircle2 } from "lucide-react";
import DashboardLayout from "./components/DashboardLayout";
import MoodIconLogger from "./components/MoodIconLogger";
import HabitList from "./components/HabitList";
import TrendsChart from "./components/TrendsChart";
import {
  fetchHabits,
  addHabit,
  toggleHabit,
  deleteHabit,
  logMood,
  fetchTrends,
} from "./services/api";

/** Returns today's date as "YYYY-MM-DD" in local time. */
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/** Toast content keyed by mood score. */
const MOOD_LABELS = {
  5: "Excellent — mood logged",
  4: "Good — mood logged",
  3: "Okay — mood logged",
  2: "Low — mood logged",
  1: "Rough — mood logged",
};

export default function App() {
  const today = todayISO();

  // ── State ──────────────────────────────────────────────────────
  const [habits, setHabits] = useState([]);
  const [trendsData, setTrendsData] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [habitsLoading, setHabitsLoading] = useState(true);
  const [trendsLoading, setTrendsLoading] = useState(true);
  // toast: { message, visible, leaving }
  const [toast, setToast] = useState({ message: "", visible: false, leaving: false });

  // ── Initial data load ──────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchHabits();
        setHabits(data);
      } catch (err) {
        console.error("[Lumina] fetchHabits error:", err);
      } finally {
        setHabitsLoading(false);
      }
    })();

    (async () => {
      try {
        const data = await fetchTrends(7);
        setTrendsData(data);
      } catch (err) {
        console.error("[Lumina] fetchTrends error:", err);
      } finally {
        setTrendsLoading(false);
      }
    })();
  }, []);

  // ── Toast helper ────────────────────────────────────────────────
  function showToast(message) {
    setToast({ message, visible: true, leaving: false });
    setTimeout(() => {
      setToast((t) => ({ ...t, leaving: true }));
      setTimeout(() => setToast({ message: "", visible: false, leaving: false }), 280);
    }, 2400);
  }

  // ── Handlers ───────────────────────────────────────────────────

  // Returns the new habit so HabitList can trigger the slide-in animation
  const handleAddHabit = useCallback(async (name) => {
    try {
      const newHabit = await addHabit(name);
      setHabits((prev) => [...prev, newHabit]);
      return newHabit;
    } catch (err) {
      console.error("[Lumina] addHabit error:", err);
    }
  }, []);

  const handleToggleHabit = useCallback(async (habitId, date) => {
    // Optimistic UI update — flip immediately, then sync with server
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const already = h.completedDates.includes(date);
        return {
          ...h,
          completedDates: already
            ? h.completedDates.filter((d) => d !== date)
            : [...h.completedDates, date],
        };
      })
    );

    try {
      await toggleHabit(habitId, date);
    } catch (err) {
      console.error("[Lumina] toggleHabit error — reverting:", err);
      // TODO: revert optimistic update on real API failure
    }
  }, []);

  const handleDeleteHabit = useCallback(async (habitId) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    try {
      await deleteHabit(habitId);
    } catch (err) {
      console.error("[Lumina] deleteHabit error:", err);
    }
  }, []);

  const handleMoodSelect = useCallback(
    async (score) => {
      setSelectedMood(score);
      try {
        await logMood(score, today);
        showToast(MOOD_LABELS[score] ?? "Mood logged");
      } catch (err) {
        console.error("[Lumina] logMood error:", err);
      }
    },
    [today]
  );

  // ── Render ─────────────────────────────────────────────────────
  return (
    <>
      <DashboardLayout>
        {/* ── Left column (main content) ───────────────────── */}
        <div className="flex flex-col gap-8">
          {/* Mood logger card */}
          <div className="bg-white rounded-2xl p-7 border border-[#EAE8E4] shadow-[0_2px_8px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <MoodIconLogger
              selectedMood={selectedMood}
              onMoodSelect={handleMoodSelect}
            />
          </div>

          {/* Habit list card */}
          <div className="bg-white rounded-2xl p-7 border border-[#EAE8E4] shadow-[0_2px_8px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <HabitList
              habits={habits}
              loading={habitsLoading}
              today={today}
              onAdd={handleAddHabit}
              onToggle={handleToggleHabit}
              onDelete={handleDeleteHabit}
            />
          </div>
        </div>

        {/* ── Right column (trends) ────────────────────────── */}
        <div className="bg-white rounded-2xl p-7 border border-[#EAE8E4] shadow-[0_2px_8px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.04)] lg:sticky lg:top-19 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <TrendsChart data={trendsData} loading={trendsLoading} />
        </div>
      </DashboardLayout>

      {/* ── Floating toast notification ───────────────────────── */}
      {toast.visible && (
        <div
          className={[
            "fixed bottom-8 left-1/2 -translate-x-1/2 z-50",
            "flex items-center gap-2.5 px-5 py-3",
            "bg-white border border-[#EAE8E4] text-slate-700 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)]",
            "text-sm font-medium tracking-wide pointer-events-none select-none",
            toast.leaving ? "animate-toast-out" : "animate-toast-in",
          ].join(" ")}
        >
          <CheckCircle2 size={14} className="text-indigo-500 shrink-0" />
          {toast.message}
        </div>
      )}
    </>
  );
}
