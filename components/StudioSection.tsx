'use client'
import { useState } from 'react'

interface Category { title: string; desc: string }

export default function StudioSection({
  title, subtitle, description, categories, images
}: {
  title?: string
  subtitle?: string
  description?: string
  categories?: Category[]
  images?: string[]
}) {
  const [open, setOpen] = useState(0)

  const cats = categories && categories.length > 0 ? categories : [
    { title: 'Shooting entreprise', desc: 'Photos corporate, portraits équipe, headshots professionnels.' },
    { title: 'Photo produit', desc: 'Packshot, lifestyle produit, e-commerce.' },
    { title: 'Campagne marque', desc: 'Shooting campagne, visuels pub, contenu social media.' },
    { title: 'Portrait créatif', desc: 'Personal branding, presse, book artistique.' },
  ]

  const imgs = images || []

  return (
    <section className="studio" id="studio">
      <div className="container">
        <div style={{ marginBottom: 0 }}>
          <span className="section-tag">instant. studio</span>
          <h2 className="section-title-dark reveal">{title || 'instant. studio'}</h2>
          {subtitle && <p style={{ color: '#6b6b6b', fontSize: '0.88rem', marginTop: 4 }}>{subtitle}</p>}
          {description && <p style={{ color: '#6b6b6b', fontSize: '0.88rem', marginTop: 8, maxWidth: 420 }}>{description}</p>}
        </div>
        <div className="studio-inner">
          <div>
            <div className="studio-cats">
              {cats.map((cat, i) => (
                <div key={i} className="studio-cat-item">
                  <button className={`studio-cat-toggle${open === i ? ' active' : ''}`} onClick={() => setOpen(open === i ? -1 : i)}>
                    <span className="cat-label">{cat.title}</span>
                    <span className="cat-icon">+</span>
                  </button>
                  <div className={`studio-cat-body${open === i ? ' open' : ''}`}>
                    <div className="studio-cat-body-inner">
                      <p>{cat.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="studio-meta">
              <a href="https://www.instagram.com/instant.mov" target="_blank" rel="noopener" className="studio-insta">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
                Voir nos créations @instant.mov
              </a>
            </div>
          </div>
          <div className="studio-gallery">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="studio-cell">
                {imgs[i] ? (
                  <img src={imgs[i]} alt={`Studio ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="cell-placeholder" style={{ background: ['#e8e4dd','#e0dcd5','#dbd7d0','#d5d1ca'][i] }}>
                    {['Shooting studio','Portrait','Produit','Événementiel'][i]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
