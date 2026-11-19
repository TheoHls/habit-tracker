import type { SupabaseClient } from '@supabase/supabase-js'
import type { Habit } from './habits'

interface HabitRow {
  id: string
  name: string
  created_at: string
  done: string[]
}

const toHabit = (r: HabitRow): Habit => ({
  id: r.id,
  name: r.name,
  createdAt: r.created_at,
  done: r.done ?? [],
})

const toRow = (h: Habit): HabitRow => ({
  id: h.id,
  name: h.name,
  created_at: h.createdAt,
  done: h.done,
})

export async function fetchHabits(db: SupabaseClient): Promise<Habit[]> {
  const { data, error } = await db
    .from('habits')
    .select('id, name, created_at, done')
    .order('inserted_at')
  if (error) throw error
  return (data as HabitRow[]).map(toHabit)
}

export async function insertHabits(db: SupabaseClient, habits: Habit[]): Promise<void> {
  if (habits.length === 0) return
  const { error } = await db.from('habits').insert(habits.map(toRow))
  if (error) throw error
}

export async function updateDone(db: SupabaseClient, habit: Habit): Promise<void> {
  const { error } = await db.from('habits').update({ done: habit.done }).eq('id', habit.id)
  if (error) throw error
}

export async function deleteHabit(db: SupabaseClient, id: string): Promise<void> {
  const { error } = await db.from('habits').delete().eq('id', id)
  if (error) throw error
}
