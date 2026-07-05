'use client'
import { useState } from 'react'

interface Founder { name: string; role: string; bio: string; photo: string }

export default function FoundersSection({ founder1, founder2 }: { founder1?: Founder; founder2?: Founder }) {
  const [active, setActive] = useState<0 | 1 | null>(null)

  const f1 = founder1 || { name: 'Axel "Kawa" Maillard', role: 'Co-fondateur — Commercial & Marketing', bio: '', photo: '' }
  const f2 = founder2 || { name: 'Lucas Desa', role: 'Co-fondateur — Production & Direction', bio: '', photo: '' }
  const founders = [f1, f2]
  const activeFounder = active !== null ? founders[active] : null

  return (
    <div style={{ marginTop: 24 }}>
      <div className="founders-cards">
        {founders.map((f, i) => (
          <div key={i} className={`founder-card${active === i ? ' active' : ''}`} onClick={() => setActive(active === i ? null : i as 0 | 1)}>
            {f.photo ? (
              <img src={f.photo} alt={f.name} className="founder-card-avatar" style={{ objectFit: 'cover' }} />
            ) : (
              <div className="founder-card-avatar" />
            )}
            <div className="founder-card-name">{f.name}</div>
            <div className="founder-card-role">{i === 0 ? 'Commerce & Marketing' : 'Production Manager'}</div>
          </div>
        ))}
      </div>
      <div className={`founders-panel${active !== null ? ' open' : ''}`}>
        {activeFounder && (
          <div className="founders-panel-inner">
            {activeFounder.photo ? (
              <img src={activeFounder.photo} alt={activeFounder.name} className="founders-panel-photo" style={{ objectFit: 'cover' }} />
            ) : (
              <div className="founders-panel-photo" />
            )}
            <div className="founders-panel-text">
              <div className="panel-name">{activeFounder.name}</div>
              <div className="panel-role">{activeFounder.role}</div>
              <p className="panel-bio">{activeFounder.bio}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
