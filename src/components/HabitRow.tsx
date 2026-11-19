import { currentStreak, longestStreak, toDateKey, type Habit } from '../lib/habits'

interface Props {
  habit: Habit
  days: Date[]
  today: Date
  onToggle: (id: string, dateKey: string) => void
  onRemove: (id: string) => void
}

const dayFmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric' })

export function HabitRow({ habit, days, today, onToggle, onRemove }: Props) {
  const streak = currentStreak(habit, today)
  const best = longestStreak(habit)

  return (
    <li className="habit">
      <div className="habit-head">
        <h2>{habit.name}</h2>
        <span className="streak" title={`Record : ${best} j`}>
          🔥 {streak} j
        </span>
        <button
          className="remove"
          aria-label={`Supprimer ${habit.name}`}
          onClick={() => {
            if (confirm(`Supprimer « ${habit.name} » ?`)) onRemove(habit.id)
          }}
        >
          ✕
        </button>
      </div>
      <div className="days">
        {days.map((day) => {
          const key = toDateKey(day)
          const done = habit.done.includes(key)
          const label = dayFmt.format(day)
          return (
            <button
              key={key}
              className={`day${done ? ' done' : ''}`}
              aria-pressed={done}
              aria-label={`${habit.name}, ${label}`}
              onClick={() => onToggle(habit.id, key)}
            >
              <span className="day-label">{label}</span>
              <span className="check">{done ? '✓' : ''}</span>
            </button>
          )
        })}
      </div>
    </li>
  )
}
