'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { newEventId, fbTrack, fbTrackCustom, getFbCookies, getUtms, budgetToValue } from '@/lib/tracking'

// Custom-project qualification form (2 steps, conditional fields).
// Single source of truth for every "J'ai un projet, parlons-en" entry
// point — submissions create a lead in the admin CRM with the source
// "Website — Custom Project" (existing pipeline + notifications).

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

export default function CustomProjectForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ ...EMPTY })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')

  // ViewContent: the lead form is the ad landing page
  useEffect(() => {
    fbTrack('ViewContent', { content_name: 'Formulaire projet', content_category: 'Lead form' })
  }, [])

  const s = (k: keyof typeof EMPTY) => (v: string) => setForm(f => ({ ...f, [k]: v }))
  const isEvent = EVENT_TYPES.includes(form.type)
  // Company is required — it's what separates a 600 € request from a 25 000 € one
  const step1Ok = form.firstName.trim() && form.email.trim() && /.+@.+\..+/.test(form.email) && form.company.trim()
  // Budget is required too ("À définir ensemble" counts as an answer)
  const step2Ok = form.type && form.description.trim() && form.budget

  function goStep2() {
    if (!form.company.trim()) {
      setFieldError('Merci d’indiquer votre entreprise ou organisation — c’est ce qui nous permet de préparer votre réponse.')
      return
    }
    if (!step1Ok) {
      setFieldError('Merci de remplir votre prénom, un email valide et votre entreprise.')
      return
    }
    setFieldError('')
    // Lead_Start: optimisation event while full-Lead volume ramps up
    fbTrackCustom('Lead_Start', { content_name: 'Formulaire projet - etape 1' })
    setStep(2)
  }

  async function submit() {
    if (sending) return
    if (!form.budget) {
      setFieldError('Merci d’indiquer une fourchette de budget — « À définir ensemble » convient très bien si vous ne savez pas encore.')
      return
    }
    if (!step2Ok) {
      setFieldError('Merci de choisir un type de projet et de le décrire en quelques mots.')
      return
    }
    setFieldError('')
    setSending(true)
    setError('')
    const typeLabel = PROJECT_TYPES.find(t => t.value === form.type)?.label || form.type
    const utms = getUtms()
    const utmLine = Object.entries(utms).map(([k, v]) => `${k}=${v}`).join(' · ')
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
      utmLine ? `UTM : ${utmLine}` : '',
    ].filter(Boolean).join('\n')

    // One event id shared with the server-side CAPI event (deduplication)
    const eventId = newEventId()
    const { fbp, fbc } = getFbCookies()

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
          meta: {
            event_id: eventId,
            event_source_url: window.location.href,
            fbp, fbc,
            utms,
          },
        }),
      })
      if (!res.ok) throw new Error('error')
      // Lead fires ONLY on confirmed success — never on click.
      // A click-fired Lead would count network errors and drop-offs, and
      // the ad algorithm would learn on noise.
      fbTrack('Lead', {
        content_name: 'Formulaire projet',
        content_category: typeLabel,
        value: budgetToValue(form.budget),
        currency: 'EUR',
      }, eventId)
      setDone(true)
      router.push('/merci')
    } catch {
      setError('Erreur lors de l’envoi — réessayez dans quelques instants ou écrivez-nous à hello@instantmov.fr.')
    }
    setSending(false)
  }

  if (done) {
    return (
      <div className="cp-done">
        <div className="cp-done-icon">✓</div>
        <h3>Bien reçu.</h3>
        <p>Votre projet est entre de bonnes mains — on revient vers vous sous 24h ouvrées pour en discuter.</p>
        <a className="btn btn-primary" href="/">← Retour au site</a>
      </div>
    )
  }

  return (
    <div className="cp-form">
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
          <div className="form-field"><label>Entreprise / Organisation *</label><input value={form.company} onChange={e => s('company')(e.target.value)} placeholder="Votre structure" autoComplete="organization" required aria-required="true" /></div>
          <div className="form-field"><label>Site / Instagram</label><input value={form.website} onChange={e => s('website')(e.target.value)} placeholder="Optionnel" /></div>
          {fieldError && <p className="cp-error cp-full" role="alert">{fieldError}</p>}
          <div className="cp-nav">
            <button className="btn btn-primary" onClick={goStep2}>Continuer →</button>
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
            <label>Budget estimé *</label>
            <select value={form.budget} onChange={e => s('budget')(e.target.value)} required aria-required="true">
              <option value="">Sélectionnez…</option>
              {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-field cp-full"><label>Informations complémentaires</label><textarea value={form.extra} onChange={e => s('extra')(e.target.value)} placeholder="Optionnel" rows={2} /></div>
          {fieldError && <p className="cp-error cp-full" role="alert">{fieldError}</p>}
          {error && <p className="cp-error cp-full" role="alert">{error}</p>}
          <div className="cp-nav cp-full">
            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Retour</button>
            <button className="btn btn-primary" disabled={sending} onClick={submit}>
              {sending ? 'Envoi…' : 'Envoyer mon projet →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
