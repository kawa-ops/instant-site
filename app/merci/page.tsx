import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Merci — Instant.',
  description: 'Votre projet a bien été envoyé — réponse sous 24h ouvrées.',
  robots: { index: false },
}

// Thank-you page after a custom-project submission.
// NOTE: the Lead event fires in the form's success callback, NOT here —
// reloading /merci must never create a second lead or a second event.
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/kawa-instantmov/30min'

export default function MerciPage() {
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
          </div>
        </div>
      </nav>

      <section className="projet-page">
        <div className="container">
          <div className="merci-card">
            <div className="cp-done-icon">✓</div>
            <h1 className="heading-lg">C&apos;est <em className="accent">bien reçu.</em></h1>
            <p className="merci-sub">
              Votre projet est entre de bonnes mains — l&apos;équipe Instant. revient vers vous
              <strong style={{ color: 'var(--text)' }}> sous 24h ouvrées</strong>.
            </p>

            <div className="merci-actions">
              {CALENDLY_URL ? (
                <a className="btn btn-primary btn-config-cta" href={CALENDLY_URL} target="_blank" rel="noreferrer">
                  📅 Réserver un appel de 30 min →
                </a>
              ) : (
                <a className="btn btn-primary btn-config-cta" href="mailto:hello@instantmov.fr?subject=Mon%20projet%20—%20prise%20de%20rendez-vous">
                  📅 Caler un appel de 30 min →
                </a>
              )}
              <a className="btn btn-ghost" href="/#realisations">Voir nos réalisations pendant ce temps</a>
            </div>

            <p className="merci-note">
              Un détail à ajouter ? Répondez simplement à notre email, ou écrivez-nous à{' '}
              <a href="mailto:hello@instantmov.fr" style={{ color: 'var(--text)' }}>hello@instantmov.fr</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
