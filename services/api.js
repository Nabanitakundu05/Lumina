/**
 * ============================================================
 *  Lumina — API Service Layer
 *  All functions are wired to the real REST API.
 *  BASE_URL must match your Express server.
 * ============================================================
 */

import axios from "axios";

// ------------------------------------------------------------------
// BASE URL
// TODO (Backend Dev): Change this to your production URL when deploying.
//   e.g. "https://api.lumina.app/api"
// ------------------------------------------------------------------
const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // TODO (Backend Dev): If you add JWT auth, attach the token here:
  // withCredentials: true,
});

// ------------------------------------------------------------------
// OPTIONAL: Request interceptor — attach auth token if present
// TODO (Backend Dev): Uncomment and adapt when you add authentication.
// ------------------------------------------------------------------
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("lumina_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// ==================================================================
//  HABITS
// ==================================================================

/**
 * Fetch all habits for the current user / session.
 *
 * TODO (Backend Dev): Implement GET /api/habits
 *   Expected response shape:
 *   [
 *     { id: string, name: string, completedDates: string[] },
 *     ...
 *   ]
 */
export async function fetchHabits() {
  // --- DUMMY DATA (remove once real endpoint is live) ---
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          { id: "1", name: "Morning run", completedDates: [] },
          { id: "2", name: "Read 20 pages", completedDates: [] },
          { id: "3", name: "Meditate", completedDates: [] },
        ]),
      400
    )
  );

  // --- REAL IMPLEMENTATION ---
  // const { data } = await api.get("/habits");
  // return data;
}

/**
 * Add a new habit.
 *
 * @param {string} name — The habit label.
 *
 * TODO (Backend Dev): Implement POST /api/habits
 *   Request body: { name: string }
 *   Expected response shape: { id: string, name: string, completedDates: [] }
 */
export async function addHabit(name) {
  // --- DUMMY DATA ---
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          id: Date.now().toString(),
          name,
          completedDates: [],
        }),
      200
    )
  );

  // --- REAL IMPLEMENTATION ---
  // const { data } = await api.post("/habits", { name });
  // return data;
}

/**
 * Toggle (complete / un-complete) a habit for a specific date.
 *
 * @param {string} habitId
 * @param {string} date — ISO date string, e.g. "2026-03-09"
 *
 * TODO (Backend Dev): Implement PATCH /api/habits/:id/toggle
 *   Request body: { date: string }
 *   Expected response shape: updated habit object
 */
export async function toggleHabit(habitId, date) {
  // --- DUMMY DATA ---
  return new Promise((resolve) =>
    setTimeout(() => resolve({ id: habitId, toggledDate: date }), 150)
  );

  // --- REAL IMPLEMENTATION ---
  // const { data } = await api.patch(`/habits/${habitId}/toggle`, { date });
  // return data;
}

/**
 * Delete a habit by id.
 *
 * @param {string} habitId
 *
 * TODO (Backend Dev): Implement DELETE /api/habits/:id
 *   Expected response: 204 No Content
 */
export async function deleteHabit(habitId) {
  // --- DUMMY DATA ---
  return new Promise((resolve) => setTimeout(() => resolve(), 150));

  // --- REAL IMPLEMENTATION ---
  // await api.delete(`/habits/${habitId}`);
}

// ==================================================================
//  MOOD
// ==================================================================

/**
 * Log a mood entry for today.
 *
 * @param {number} moodScore — Integer 1–5 (1 = terrible, 5 = excellent)
 * @param {string} date      — ISO date string, e.g. "2026-03-09"
 *
 * TODO (Backend Dev): Implement POST /api/mood
 *   Request body: { score: number, date: string }
 *   Expected response shape: { id: string, score: number, date: string }
 */
export async function logMood(moodScore, date) {
  // --- DUMMY DATA ---
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          id: Date.now().toString(),
          score: moodScore,
          date,
        }),
      200
    )
  );

  // --- REAL IMPLEMENTATION ---
  // const { data } = await api.post("/mood", { score: moodScore, date });
  // return data;
}

/**
 * Fetch mood + habit completion data for the last N days (for the chart).
 *
 * @param {number} days — Number of days to look back (default: 7)
 *
 * TODO (Backend Dev): Implement GET /api/trends?days=7
 *   Expected response shape:
 *   [
 *     { date: "Mon", mood: 4, habitsCompleted: 2 },
 *     ...
 *   ]
 */
export async function fetchTrends(days = 7) {
  // --- DUMMY DATA ---
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          { date: "Mon", mood: 3, habitsCompleted: 1 },
          { date: "Tue", mood: 4, habitsCompleted: 2 },
          { date: "Wed", mood: 2, habitsCompleted: 0 },
          { date: "Thu", mood: 5, habitsCompleted: 3 },
          { date: "Fri", mood: 4, habitsCompleted: 2 },
          { date: "Sat", mood: 3, habitsCompleted: 1 },
          { date: "Sun", mood: 5, habitsCompleted: 3 },
        ]),
      400
    )
  );

  // --- REAL IMPLEMENTATION ---
  // const { data } = await api.get(`/trends?days=${days}`);
  // return data;
}
