'use client'
import { useState } from 'react'

interface Step { title: string; desc: string }

const NUMS = ['01','02','03','04','05']

export default function ProcessSection({ title, steps }: { title?: string; steps?: Step[] }) {
  const [active, setActive] = useState(0)

  const list = steps && steps.length > 0 ? steps : [
    { title: 'Brief', desc: "Un appel de 30 min pour comprendre vos objectifs." },
    { title: 'Conception', desc: "Scripts, storyboards, proposition créative." },
    { title: 'Pré-production', desc: "Planning, logistique, préparation complète." },
    { title: 'Production', desc: "Tournage pro avec équipe dédiée." },
    { title: 'Post-production', desc: "Montage, étalonnage, livraison sous 48h." },
  ]

  const progress = ((active + 1) / list.length) * 100

  return (
    <section className="process" id="process">
      <div className="container">
        <span className="section-tag">Comment ça marche</span>
        <h2 className="section-title-dark reveal">{title || 'Notre process.'}</h2>
        <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontWeight: 400, fontSize: '1rem', color: '#6b6b6b', marginTop: 6, marginBottom: 0 }}>En {list.length} étapes</p>
        <div className="process-layout">
          <div>
            <div className="process-progress-bar-wrap">
              <div className="process-progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <div className="process-steps-list">
              {list.map((s, i) => (
                <div key={i} className={`process-step${active === i ? ' active' : ''}`} onClick={() => setActive(i)}>
                  <div className="step-num">{NUMS[i]}</div>
                  <div>
                    <div className="step-title">{s.title}</div>
                    <div className="step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="process-visual">
            {list.map((s, i) => (
              <div key={i} className={`process-visual-content${active === i ? ' active' : ''}`}>
                <div>
                  <div className="process-visual-label">{s.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
