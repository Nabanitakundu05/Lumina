/**
 * MoodIconLogger
 * --------------
 * Five mood cards — always coloured by default (tinted bg + icon),
 * vivid filled when selected (bold bg + white icon).
 * Labels are always visible for instant clarity.
 *
 * Props:
 *   selectedMood  {number|null} — current selected mood score (1-5)
 *   onMoodSelect  {(score: number) => void} — called on icon click
 */
import { Sun, CloudSun, Cloud, CloudRain, CloudLightning } from "lucide-react";

const MOODS = [
  {
    score: 5,
    label: "Excellent",
    Icon: Sun,
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconColor: "text-amber-500",
    activeBg: "bg-amber-400",
    activeBorder: "border-amber-500",
    shadow: "0 6px 24px rgba(251,191,36,0.45), 0 0 0 3px rgba(251,191,36,0.12)",
  },
  {
    score: 4,
    label: "Good",
    Icon: CloudSun,
    bg: "bg-sky-50",
    border: "border-sky-200",
    iconColor: "text-sky-500",
    activeBg: "bg-sky-400",
    activeBorder: "border-sky-500",
    shadow: "0 6px 24px rgba(56,189,248,0.45), 0 0 0 3px rgba(56,189,248,0.12)",
  },
  {
    score: 3,
    label: "Okay",
    Icon: Cloud,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    iconColor: "text-emerald-500",
    activeBg: "bg-emerald-400",
    activeBorder: "border-emerald-500",
    shadow: "0 6px 24px rgba(52,211,153,0.45), 0 0 0 3px rgba(52,211,153,0.12)",
  },
  {
    score: 2,
    label: "Low",
    Icon: CloudRain,
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconColor: "text-blue-500",
    activeBg: "bg-blue-500",
    activeBorder: "border-blue-600",
    shadow: "0 6px 24px rgba(59,130,246,0.45), 0 0 0 3px rgba(59,130,246,0.12)",
  },
  {
    score: 1,
    label: "Rough",
    Icon: CloudLightning,
    bg: "bg-rose-50",
    border: "border-rose-200",
    iconColor: "text-rose-500",
    activeBg: "bg-rose-500",
    activeBorder: "border-rose-600",
    shadow: "0 6px 24px rgba(244,63,94,0.45), 0 0 0 3px rgba(244,63,94,0.12)",
  },
];

export default function MoodIconLogger({ selectedMood, onMoodSelect }) {
  return (
    <section aria-label="Mood logger">
      <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-5 font-semibold select-none">
        How are you feeling today?
      </p>

      <div className="flex items-stretch gap-2.5" role="radiogroup">
        {MOODS.map(({ score, label, Icon, bg, border, iconColor, activeBg, activeBorder, shadow }) => {
          const isSelected = selectedMood === score;

          return (
            <button
              key={score}
              role="radio"
              aria-checked={isSelected}
              aria-label={label}
              onClick={() => onMoodSelect(score)}
              style={isSelected ? { boxShadow: shadow } : {}}
              className={[
                "relative flex flex-col items-center justify-center gap-2 flex-1 py-4 px-2 rounded-2xl cursor-pointer",
                "border-2 transition-all duration-250 ease-out select-none",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2",
                "active:scale-95",
                isSelected
                  ? `${activeBg} ${activeBorder} text-white scale-[1.06]`
                  : `${bg} ${border} ${iconColor} hover:scale-[1.04] hover:brightness-[0.97]`,
              ].join(" ")}
            >
              <Icon
                size={26}
                strokeWidth={isSelected ? 2 : 1.75}
                className={`transition-all duration-250 ${isSelected ? "animate-bounce-in" : ""}`}
              />
              <span
                className={[
                  "text-[10px] font-semibold tracking-wide whitespace-nowrap transition-all duration-250",
                  isSelected ? "text-white/90" : "opacity-70",
                ].join(" ")}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
