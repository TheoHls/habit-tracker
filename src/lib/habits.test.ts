import { describe, expect, it } from 'vitest'
import {
  createHabit,
  currentStreak,
  lastDays,
  longestStreak,
  toDateKey,
  toggleDay,
  type Habit,
} from './habits'

const today = new Date(2026, 10, 19) // 19 Nov 2026

const habitWith = (done: string[]): Habit => ({
  id: '1',
  name: 'Test',
  createdAt: '2026-11-01',
  done,
})

describe('toDateKey', () => {
  it('formats with zero padding', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('lastDays', () => {
  it('returns N days ending today, oldest first', () => {
    const days = lastDays(today, 3).map(toDateKey)
    expect(days).toEqual(['2026-11-17', '2026-11-18', '2026-11-19'])
  })
})

describe('createHabit', () => {
  it('trims the name and starts empty', () => {
    const h = createHabit('  Lire  ', today)
    expect(h.name).toBe('Lire')
    expect(h.done).toEqual([])
    expect(h.createdAt).toBe('2026-11-19')
  })
})

describe('toggleDay', () => {
  it('adds then removes a day', () => {
    const h1 = toggleDay(habitWith([]), '2026-11-19')
    expect(h1.done).toEqual(['2026-11-19'])
    const h2 = toggleDay(h1, '2026-11-19')
    expect(h2.done).toEqual([])
  })

  it('does not mutate the original', () => {
    const h = habitWith([])
    toggleDay(h, '2026-11-19')
    expect(h.done).toEqual([])
  })
})

describe('currentStreak', () => {
  it('counts consecutive days ending today', () => {
    expect(currentStreak(habitWith(['2026-11-17', '2026-11-18', '2026-11-19']), today)).toBe(3)
  })

  it('keeps the streak alive if today is not done yet', () => {
    expect(currentStreak(habitWith(['2026-11-17', '2026-11-18']), today)).toBe(2)
  })

  it('is 0 when yesterday and today are missing', () => {
    expect(currentStreak(habitWith(['2026-11-16']), today)).toBe(0)
  })

  it('works across month boundaries', () => {
    const dec1 = new Date(2026, 11, 1)
    expect(currentStreak(habitWith(['2026-11-30', '2026-12-01']), dec1)).toBe(2)
  })
})

describe('longestStreak', () => {
  it('finds the longest run', () => {
    const h = habitWith(['2026-11-01', '2026-11-02', '2026-11-05', '2026-11-06', '2026-11-07'])
    expect(longestStreak(h)).toBe(3)
  })

  it('is 0 for no completions', () => {
    expect(longestStreak(habitWith([]))).toBe(0)
  })
})
