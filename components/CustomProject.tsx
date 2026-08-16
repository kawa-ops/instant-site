'use client'
import { useEffect, useState } from 'react'

// Custom-project entry point: one big premium CTA + a 2-step qualification
// form. Every submission creates a lead in the admin CRM with the source
// "Website — Custom Project" (existing lead pipeline + notifications).

const ADMIN_URL = 'https://admin.instantmov.fr'

const PROJECT_TYPES = [
  { value: 'evenement', label: 'Événement / Festival' },
  { value: 'marque', label: 'Marque / Activation' },
  { value: 'corporate', label: 'Corporate / Entreprise' },
  { value: 'lancement', label: 'Lancement de produit' },
  { value: 'clip', label: 'Clip / Vidéo unique' },
  { value: 'studio', label: 'Studio / Photo' },
  { value: 'autre', label: 'Autre / Je ne sais pas encore' },
]
const EVENT_TYPES = ['evenement', 'lancement']

const BUDGETS = ['< 1 000 €', '1 000 – 3 000 €', '3 000 – 8 000 €', '8 000 – 20 000 €', '> 20 000 €', 'À définir ensemble']

const EMPTY = {
  firstName: '', lastName: '', email: '', phone: '', company: '', website: '',
  type: '', description: '', location: '', eventDate: '', duration: '',
  deliverables: '', deadline: '', budget: '', extra: '',
}

export default function CustomProject({ variant, label }: { variant: 'hero' | 'config'; label?: string }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ ...EMPTY })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [utm, setUtm] = useState('')

  // Preserve UTM parameters for lead attribution
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const pairs: string[] = []
      params.forEach((v, k) => { if (k.startsWith('utm_') || k === 'ref') pairs.push(`${k}=${v}`) })
      if (pairs.length > 0) setUtm(pairs.join(' · '))
    } catch {}
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const s = (k: keyof typeof EMPTY) => (v: string) => setForm(f => ({ ...f, [k]: v }))
  const isEvent = EVENT_TYPES.includes(form.type)
  const step1Ok = form.firstName.trim() && form.email.trim() && /.+@.+\..+/.test(form.email)
  const step2Ok = form.type && form.description.trim()

  async function submit() {
    if (!step2Ok || sending) return
    setSending(true)
    setError('')
    const typeLabel = PROJECT_TYPES.find(t => t.value === form.type)?.label || form.type
    const message = [
      '🎯 PROJET SUR MESURE',
      `Type : ${typeLabel}`,
      form.description ? `Description : ${form.description}` : '',
      form.location ? `Lieu : ${form.location}` : '',
      form.eventDate ? `Date du projet/événement : ${form.eventDate}` : '',
      form.duration ? `Durée estimée : ${form.duration}` : '',
      form.deliverables ? `Livrables attendus : ${form.deliverables}` : '',
      form.deadline ? `Deadline souhaitée : ${form.deadline}` : '',
      form.extra ? `Infos complémentaires : ${form.extra}` : '',
      form.website ? `Site / Instagram : ${form.website}` : '',
      utm ? `UTM : ${utm}` : '',
    ].filter(Boolean).join('\n')

    try {
      const res = await fetch(`${ADMIN_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email.trim(),
          phone: form.phone || null,
          company: form.company || null,
          budget: form.budget || null,
          message,
          source: 'Website — Custom Project',
        }),
      })
      if (!res.ok) throw new Error('error')
      setDone(true)
    } catch {
      setError('Erreur lors de l’envoi — réessayez dans quelques instants ou écrivez-nous à hello@instantmov.fr.')
    }
    setSending(false)
  }

  function close() {
    setOpen(false)
    if (done) { setForm({ ...EMPTY }); setStep(1); setDone(false) }
  }

  return (
    <>
      {variant === 'hero' ? (
        <button className="btn-mega" onClick={() => setOpen(true)}>
          {label || 'J’ai un projet, parlons-en'}
          <span className="btn-mega-arrow">→</span>
        </button>
      ) : (
        <button className="btn btn-primary btn-config-cta" onClick={() => setOpen(true)}>
          {label || 'Parlons de votre projet'} →
        </button>
      )}

      {open && (
        <div className="cp-overlay" onClick={close}>
          <div className="cp-modal" onClick={e => e.stopPropagation()}>
            <button className="cp-close" onClick={close} aria-label="Fermer">✕</button>

            {done ? (
              <div className="cp-done">
                <div className="cp-done-icon">✓</div>
                <h3>Bien reçu.</h3>
                <p>Votre projet est entre de bonnes mains — on revient vers vous sous 24h ouvrées pour en discuter.</p>
                <button className="btn btn-primary" onClick={close}>Fermer</button>
              </div>
            ) : (
              <>
                <span className="label cp-label">Projet sur mesure</span>
                <h3 className="cp-title">Parlez-nous de <em className="accent">votre projet.</em></h3>
                <p className="cp-sub">2 minutes suffisent — on s’occupe du reste. Réponse sous 24h ouvrées.</p>

                <div className="cp-steps">
                  <span className={step === 1 ? 'on' : ''}>1 · Contact</span>
                  <span className={step === 2 ? 'on' : ''}>2 · Votre projet</span>
                </div>

                {step === 1 && (
                  <div className="cp-grid">
                    <div className="form-field"><label>Prénom *</label><input value={form.firstName} onChange={e => s('firstName')(e.target.value)} placeholder="Prénom" autoComplete="given-name" /></div>
                    <div className="form-field"><label>Nom</label><input value={form.lastName} onChange={e => s('lastName')(e.target.value)} placeholder="Nom" autoComplete="family-name" /></div>
                    <div className="form-field"><label>Email *</label><input type="email" inputMode="email" value={form.email} onChange={e => s('email')(e.target.value)} placeholder="vous@entreprise.com" autoComplete="email" /></div>
                    <div className="form-field"><label>Téléphone</label><input type="tel" inputMode="tel" value={form.phone} onChange={e => s('phone')(e.target.value)} placeholder="06 12 34 56 78" autoComplete="tel" /></div>
                    <div className="form-field"><label>Entreprise / Organisation</label><input value={form.company} onChange={e => s('company')(e.target.value)} placeholder="Optionnel" autoComplete="organization" /></div>
                    <div className="form-field"><label>Site / Instagram</label><input value={form.website} onChange={e => s('website')(e.target.value)} placeholder="Optionnel" /></div>
                    <div className="cp-nav">
                      <button className="btn btn-primary" disabled={!step1Ok} onClick={() => step1Ok && setStep(2)}>Continuer →</button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="cp-grid">
                    <div className="form-field cp-full">
                      <label>Type de projet *</label>
                      <select value={form.type} onChange={e => s('type')(e.target.value)}>
                        <option value="">Sélectionnez…</option>
                        {PROJECT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div className="form-field cp-full">
                      <label>Décrivez votre projet — que souhaitez-vous produire ? *</label>
                      <textarea value={form.description} onChange={e => s('description')(e.target.value)} placeholder="Contexte, objectif, ce que vous imaginez… tout nous intéresse." rows={4} />
                    </div>
                    <div className="form-field"><label>Lieu</label><input value={form.location} onChange={e => s('location')(e.target.value)} placeholder="Toulouse, Paris, national…" /></div>
                    {isEvent && (
                      <div className="form-field"><label>Date du projet / événement</label><input type="date" value={form.eventDate} onChange={e => s('eventDate')(e.target.value)} /></div>
                    )}
                    {isEvent && (
                      <div className="form-field"><label>Durée estimée</label><input value={form.duration} onChange={e => s('duration')(e.target.value)} placeholder="1 soirée, 3 jours…" /></div>
                    )}
                    <div className="form-field"><label>Livrables attendus</label><input value={form.deliverables} onChange={e => s('deliverables')(e.target.value)} placeholder="Aftermovie, reels, photos…" /></div>
                    <div className="form-field"><label>Deadline souhaitée</label><input value={form.deadline} onChange={e => s('deadline')(e.target.value)} placeholder="Fin septembre, flexible…" /></div>
                    <div className="form-field">
                      <label>Budget estimé</label>
                      <select value={form.budget} onChange={e => s('budget')(e.target.value)}>
                        <option value="">Sélectionnez…</option>
                        {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="form-field cp-full"><label>Informations complémentaires</label><textarea value={form.extra} onChange={e => s('extra')(e.target.value)} placeholder="Optionnel" rows={2} /></div>
                    {error && <p className="cp-error cp-full">{error}</p>}
                    <div className="cp-nav cp-full">
                      <button className="btn btn-ghost" onClick={() => setStep(1)}>← Retour</button>
                      <button className="btn btn-primary" disabled={!step2Ok || sending} onClick={submit}>
                        {sending ? 'Envoi…' : 'Envoyer mon projet →'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
