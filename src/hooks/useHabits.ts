import { useCallback, useEffect, useState } from 'react'
import { createHabit, toggleDay, type Habit } from '../lib/habits'

export const STORAGE_KEY = 'habit-tracker:v1'

function load(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Habit[]) : []
  } catch {
    return []
  }
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
    } catch {
      // storage unavailable (private mode, quota): keep working in memory
    }
  }, [habits])

  const add = useCallback((name: string) => {
    if (!name.trim()) return
    setHabits((hs) => [...hs, createHabit(name)])
  }, [])

  const remove = useCallback((id: string) => {
    setHabits((hs) => hs.filter((h) => h.id !== id))
  }, [])

  const toggle = useCallback((id: string, dateKey: string) => {
    setHabits((hs) => hs.map((h) => (h.id === id ? toggleDay(h, dateKey) : h)))
  }, [])

  return { habits, add, remove, toggle }
}
