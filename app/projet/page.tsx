import type { Metadata } from 'next'
import CustomProjectForm from '@/components/CustomProjectForm'

export const metadata: Metadata = {
  title: 'Votre projet — Instant.',
  description: "Parlez-nous de votre projet vidéo ou photo — l'équipe Instant. vous répond sous 24h.",
}

// Dedicated custom-project page — the single destination of every
// "J'ai un projet, parlons-en" CTA across the site.
export default function ProjetPage() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <nav className="nav">
        <div className="container">
          <a href="/" className="nav-logo">
            <img src="/logo-instant.png" className="nav-logo-mark" alt="Instant." />
            <span className="nav-wordmark">Instant.</span>
          </a>
          <div className="nav-right">
            <span className="nav-badge">Toulouse · France</span>
            <a href="/" className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '9px 18px' }}>← Retour au site</a>
          </div>
        </div>
      </nav>

      <section className="projet-page">
        <div className="container">
          <div className="projet-head">
            <span className="label" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 12 }}>Projet sur mesure</span>
            <h1 className="heading-lg">Parlez-nous de <em className="accent">votre projet.</em></h1>
            <p className="projet-sub">Instant. s&apos;occupe du reste — réponse sous 24 heures.</p>
          </div>
          <div className="projet-form-wrap">
            <CustomProjectForm />
          </div>
        </div>
      </section>
    </main>
  )
}
