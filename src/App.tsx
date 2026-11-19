import { useMemo, useState } from 'react'
import { HabitForm } from './components/HabitForm'
import { HabitRow } from './components/HabitRow'
import { useHabits } from './hooks/useHabits'
import { lastDays, toDateKey } from './lib/habits'

const DAYS_SHOWN = 7

export default function App() {
  const { habits, add, remove, toggle } = useHabits()
  const [today] = useState(() => new Date())
  const days = useMemo(() => lastDays(today, DAYS_SHOWN), [today])
  const todayKey = toDateKey(today)
  const doneToday = habits.filter((h) => h.done.includes(todayKey)).length

  return (
    <main className="app">
      <header>
        <h1>Habitudes</h1>
        {habits.length > 0 && (
          <p className="progress">
            Aujourd'hui : {doneToday}/{habits.length}
          </p>
        )}
      </header>

      <HabitForm onAdd={add} />

      {habits.length === 0 ? (
        <p className="empty">Aucune habitude pour l'instant. Ajoute ta première ci-dessus.</p>
      ) : (
        <ul className="habits">
          {habits.map((h) => (
            <HabitRow
              key={h.id}
              habit={h}
              days={days}
              today={today}
              onToggle={toggle}
              onRemove={remove}
            />
          ))}
        </ul>
      )}
    </main>
  )
}
