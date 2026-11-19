import type { Session } from '@supabase/supabase-js'
import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

interface Props {
  session: Session | null
}

type Status = 'idle' | 'open' | 'sending' | 'sent' | 'error'

export function SyncBar({ session }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [email, setEmail] = useState('')

  if (!supabase) return null

  if (session) {
    return (
      <div className="sync">
        <span>☁︎ Synchronisé · {session.user.email}</span>
        <button className="link" onClick={() => supabase?.auth.signOut()}>
          Se déconnecter
        </button>
      </div>
    )
  }

  const send = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setStatus('sending')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin + window.location.pathname },
    })
    setStatus(error ? 'error' : 'sent')
  }

  if (status === 'sent') {
    return (
      <div className="sync">
        <span>📬 Lien envoyé à {email}. Ouvre-le sur cet appareil.</span>
      </div>
    )
  }

  if (status === 'idle') {
    return (
      <div className="sync">
        <span>Données sur cet appareil uniquement.</span>
        <button className="link" onClick={() => setStatus('open')}>
          Synchroniser mes appareils
        </button>
      </div>
    )
  }

  return (
    <form className="sync sync-form" onSubmit={send}>
      <input
        type="email"
        required
        aria-label="Email"
        placeholder="ton@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Envoi…' : 'Recevoir le lien'}
      </button>
      {status === 'error' && <p className="sync-error">Envoi impossible, réessaie.</p>}
    </form>
  )
}
