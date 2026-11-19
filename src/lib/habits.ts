export interface Habit {
  id: string
  name: string
  createdAt: string
  /** Dates (YYYY-MM-DD) on which the habit was completed. */
  done: string[]
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

/** Returns the last `count` days, oldest first, ending with `today`. */
export function lastDays(today: Date, count: number): Date[] {
  return Array.from({ length: count }, (_, i) => addDays(today, i - count + 1))
}

export function createHabit(name: string, now: Date = new Date()): Habit {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    createdAt: toDateKey(now),
    done: [],
  }
}

export function toggleDay(habit: Habit, dateKey: string): Habit {
  const done = habit.done.includes(dateKey)
    ? habit.done.filter((d) => d !== dateKey)
    : [...habit.done, dateKey].sort()
  return { ...habit, done }
}

/**
 * Consecutive completed days ending today.
 * If today is not done yet, the streak still counts from yesterday,
 * so it doesn't "break" before the day is over.
 */
export function currentStreak(habit: Habit, today: Date = new Date()): number {
  const done = new Set(habit.done)
  let cursor = done.has(toDateKey(today)) ? today : addDays(today, -1)
  let streak = 0
  while (done.has(toDateKey(cursor))) {
    streak++
    cursor = addDays(cursor, -1)
  }
  return streak
}

export function longestStreak(habit: Habit): number {
  let best = 0
  let run = 0
  let prev: string | null = null
  for (const key of [...new Set(habit.done)].sort()) {
    const [y, m, d] = key.split('-').map(Number)
    const expected = prev ? toDateKey(addDays(new Date(y, m - 1, d), -1)) : null
    run = prev !== null && expected === prev ? run + 1 : 1
    best = Math.max(best, run)
    prev = key
  }
  return best
}
