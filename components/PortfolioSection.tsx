'use client'
import { useState } from 'react'

interface Project {
  id: string
  title: string
  category: string
  thumbnailUrl?: string
  videoUrl?: string
  description?: string
}

const CATEGORIES = ['Tout', 'Événementiel', 'Corporate', 'Reels', 'Photo']

const FALLBACK: Project[] = [
  { id: '1', title: 'Aftermovie Red Bull', category: 'Événementiel' },
  { id: '2', title: 'Film Corporate Disney+', category: 'Corporate' },
  { id: '3', title: 'Reels Galeries Lafayette', category: 'Reels' },
  { id: '4', title: 'Shooting Stade Toulousain', category: 'Photo' },
  { id: '5', title: 'Campaign NBA France', category: 'Corporate' },
  { id: '6', title: 'Content Pack NFL', category: 'Reels' },
]

export default function PortfolioSection({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState('Tout')
  const [modal, setModal] = useState<Project | null>(null)
  const list = projects.length > 0 ? projects : FALLBACK
  const filtered = active === 'Tout' ? list : list.filter(p => p.category === active)

  return (
    <>
      <section className="projects" id="realisations">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
            <div>
              <span className="section-tag">Nos réalisations</span>
              <h2 className="section-title-dark reveal">Des projets qui <em className="accent">parlent d&apos;eux-mêmes.</em></h2>
            </div>
            <div className="filters">
              {CATEGORIES.map(cat => (
                <button key={cat} className={`filter-btn${active === cat ? ' active' : ''}`} onClick={() => setActive(cat)}>{cat}</button>
              ))}
            </div>
          </div>
          <div className="projects-grid">
            {filtered.map(p => (
              <div key={p.id} className="project-card" onClick={() => setModal(p)}>
                {p.thumbnailUrl
                  ? <img src={p.thumbnailUrl} alt={p.title} className="project-thumb" />
                  : <div className="thumb-placeholder">🎬</div>
                }
                <div className="project-overlay">
                  <span className="project-title">{p.title}</span>
                </div>
                <span className="project-cat">{p.category}</span>
                {p.videoUrl && (
                  <div className="project-play">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO MODAL */}
      {modal && (
        <div onClick={() => setModal(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.93)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 900, position: 'relative' }}>
            <button onClick={() => setModal(null)} style={{
              position: 'absolute', top: -40, right: 0, background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}>✕ Fermer</button>
            {modal.videoUrl ? (
              <video src={modal.videoUrl} controls autoPlay style={{ width: '100%', borderRadius: 10, maxHeight: '78vh', background: '#000' }} />
            ) : modal.thumbnailUrl ? (
              <img src={modal.thumbnailUrl} alt={modal.title} style={{ width: '100%', borderRadius: 10, maxHeight: '78vh', objectFit: 'contain' }} />
            ) : (
              <div style={{ background: '#111', borderRadius: 10, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontSize: '2rem' }}>🎬</div>
            )}
            <div style={{ marginTop: 16 }}>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>{modal.title}</p>
              <p style={{ color: '#666', fontSize: '0.82rem', marginTop: 4 }}>{modal.category}</p>
              {modal.description && <p style={{ color: '#999', fontSize: '0.85rem', marginTop: 8, lineHeight: 1.5 }}>{modal.description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
