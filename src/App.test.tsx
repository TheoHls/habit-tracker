import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { STORAGE_KEY } from './hooks/useHabits'

describe('App', () => {
  beforeEach(() => localStorage.clear())

  it('shows the empty state', () => {
    render(<App />)
    expect(screen.getByText(/Aucune habitude/)).toBeInTheDocument()
  })

  it('adds a habit, checks today and persists it', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('Nouvelle habitude'), 'Lire')
    await user.click(screen.getByRole('button', { name: 'Ajouter' }))

    expect(screen.getByRole('heading', { name: 'Lire' })).toBeInTheDocument()
    expect(screen.getByText("Aujourd'hui : 0/1")).toBeInTheDocument()

    const dayButtons = screen.getAllByRole('button', { name: /^Lire, / })
    expect(dayButtons).toHaveLength(7)
    await user.click(dayButtons[dayButtons.length - 1])

    expect(screen.getByText("Aujourd'hui : 1/1")).toBeInTheDocument()
    expect(screen.getByText('🔥 1 j')).toBeInTheDocument()

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(saved).toHaveLength(1)
    expect(saved[0].done).toHaveLength(1)
  })

  it('ignores blank names', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Nouvelle habitude'), '   ')
    expect(screen.getByRole('button', { name: 'Ajouter' })).toBeDisabled()
  })
})
