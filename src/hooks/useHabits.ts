import { useCallback, useEffect, useRef, useState } from 'react'
import { createHabit, toggleDay, type Habit } from '../lib/habits'
import { deleteHabit, fetchHabits, insertHabits, updateDone } from '../lib/remote'
import { supabase } from '../lib/supabase'

export const STORAGE_KEY = 'habit-tracker:v1'

function loadLocal(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Habit[]) : []
  } catch {
    return []
  }
}

function saveLocal(habits: Habit[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
  } catch {
    // storage unavailable (private mode, quota): keep working in memory
  }
}

/**
 * Habits state. Always mirrored to localStorage; when `userId` is set,
 * also synced with Supabase (the server is the source of truth).
 */
export function useHabits(userId: string | null = null) {
  const [habits, setHabits] = useState<Habit[]>(loadLocal)
  const [error, setError] = useState<string | null>(null)
  const habitsRef = useRef(habits)
  const remote = supabase && userId ? supabase : null

  const commit = useCallback((next: Habit[]) => {
    habitsRef.current = next
    setHabits(next)
    saveLocal(next)
  }, [])

  const run = useCallback((task: Promise<unknown>) => {
    task.then(
      () => setError(null),
      () => setError('Synchro impossible. Vérifie ta connexion.'),
    )
  }, [])

  // Pull from the server on login and whenever the app comes back to the foreground.
  useEffect(() => {
    if (!remote) return
    let cancelled = false

    const pull = async (migrateLocal: boolean) => {
      try {
        let server = await fetchHabits(remote)
        if (migrateLocal) {
          const ids = new Set(server.map((h) => h.id))
          const localOnly = habitsRef.current.filter((h) => !ids.has(h.id))
          if (localOnly.length > 0) {
            await insertHabits(remote, localOnly)
            server = [...server, ...localOnly]
          }
        }
        if (!cancelled) {
          commit(server)
          setError(null)
        }
      } catch {
        if (!cancelled) setError('Synchro impossible. Vérifie ta connexion.')
      }
    }

    pull(true)
    const onVisible = () => document.visibilityState === 'visible' && pull(false)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [remote, commit])

  const add = useCallback(
    (name: string) => {
      if (!name.trim()) return
      const habit = createHabit(name)
      commit([...habitsRef.current, habit])
      if (remote) run(insertHabits(remote, [habit]))
    },
    [commit, remote, run],
  )

  const remove = useCallback(
    (id: string) => {
      commit(habitsRef.current.filter((h) => h.id !== id))
      if (remote) run(deleteHabit(remote, id))
    },
    [commit, remote, run],
  )

  const toggle = useCallback(
    (id: string, dateKey: string) => {
      let changed: Habit | undefined
      const next = habitsRef.current.map((h) => {
        if (h.id !== id) return h
        changed = toggleDay(h, dateKey)
        return changed
      })
      commit(next)
      if (remote && changed) run(updateDone(remote, changed))
    },
    [commit, remote, run],
  )

  return { habits, add, remove, toggle, error }
}
