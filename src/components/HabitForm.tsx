import { useState, type FormEvent } from 'react'

interface Props {
  onAdd: (name: string) => void
}

export function HabitForm({ onAdd }: Props) {
  const [name, setName] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name)
    setName('')
  }

  return (
    <form className="habit-form" onSubmit={submit}>
      <input
        aria-label="Nouvelle habitude"
        placeholder="Nouvelle habitude (ex : Lire 10 min)"
        value={name}
        maxLength={60}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" disabled={!name.trim()}>
        Ajouter
      </button>
    </form>
  )
}
