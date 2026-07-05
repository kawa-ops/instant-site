'use client'
import { useState } from 'react'

const ADMIN_URL = 'https://admin.instantmov.fr'

type Project = { name: string; price: number }
type Extra = { name: string; price: number }

const projectOptions = [
  { type: 'monthly', price: 2500, icon: '📦', name: 'Pack 10 vidéos clés en main (mensuel)', desc: 'Stratégie · Script · Production · Montage. Tout inclus chaque mois.', priceLabel: '2 500 € HT / mois' },
  { type: 'event', price: 600, icon: '🎉', name: 'Pack événementiel', desc: 'Live content, stories, photos, recap vidéo, aftermovie, activation réseaux.', priceLabel: '600 € HT' },
  { type: 'corporate', price: 800, icon: '🎬', name: 'Production vidéo corporate', desc: 'Film de marque, teaser, corporate. Brainstorming · Script · Tournage · Montage.', priceLabel: 'à partir de 800 € HT' },
  { type: 'studio', price: 200, icon: '📸', name: 'Shooting studio 2h', desc: "Jusqu'à 3 tenues · 30 photos sélectionnées · Retouches · Livraison sous 48h.", priceLabel: '200 € HT' },
]

const extraOptions = [
  { key: 'cm', price: 500, icon: '💬', name: 'Community Management', desc: 'Gestion de vos réseaux. Tarif variable selon le volume et la charge de travail.', priceLabel: 'à partir de 500 € / mois' },
  { key: 'ads', price: 600, icon: '📈', name: 'Gestion Meta Ads', desc: "Campagnes publicitaires Meta. 10% du budget au-delà de 10 000€.", priceLabel: '600 € / mois' },
  { key: 'photo', price: 300, icon: '📷', name: 'Pack photo mensuel', desc: 'Shooting photo complémentaire intégré à votre production mensuelle.', priceLabel: '300 € HT' },
  { key: 'aftermovie', price: 500, icon: '🎞️', name: 'Aftermovie seul', desc: "Montage d'un aftermovie à partir de rushes fournis ou tournés.", priceLabel: '500 € HT' },
  { key: 'microtrottoir', price: 800, icon: '🎤', name: 'Pack micro-trottoirs', desc: '10 micro-trottoirs filmés et montés, prêts à publier.', priceLabel: '800 € HT' },
  { key: 'strategy', price: 300, icon: '🧭', name: 'Stratégie de contenu', desc: 'Audit, positionnement, plan éditorial. Tarif sur devis selon les besoins.', priceLabel: 'à partir de 300 € / mois' },
]

function fmt(n: number) {
  if (n === 0) return '0 €'
  return n.toLocaleString('fr-FR') + ' € HT'
}

export default function Configurator() {
  const [step, setStep] = useState(1)
  const [projects, setProjects] = useState<Record<string, Project>>({})
  const [extras, setExtras] = useState<Record<string, Extra>>({})
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', social: '', sector: '', budget: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const total = Object.values(projects).reduce((s, p) => s + p.price, 0) + Object.values(extras).reduce((s, e) => s + e.price, 0)
  const allItems = [...Object.values(projects), ...Object.values(extras)]

  function toggleProject(opt: typeof projectOptions[0]) {
    setProjects(prev => {
      const next = { ...prev }
      if (next[opt.type]) delete next[opt.type]
      else next[opt.type] = { name: opt.name, price: opt.price }
      return next
    })
  }

  function toggleExtra(opt: typeof extraOptions[0]) {
    setExtras(prev => {
      const next = { ...prev }
      if (next[opt.key]) delete next[opt.key]
      else next[opt.key] = { name: opt.name, price: opt.price }
      return next
    })
  }

  function goStep(n: number) {
    setStep(n)
    document.getElementById('configurateur')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function submit() {
    setSubmitting(true)
    const projectsList = Object.values(projects).map(p => p.name).join(', ')
    const extrasList = Object.values(extras).map(e => e.name).join(', ')
    const message = [form.description, projectsList ? `\nProjets : ${projectsList}` : '', extrasList ? `Options : ${extrasList}` : '', form.social ? `Réseaux : ${form.social}` : '', total ? `Estimation : ${fmt(total)}` : ''].filter(Boolean).join('\n')
    try {
      const res = await fetch(`${ADMIN_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${form.firstName} ${form.lastName}`.trim(), email: form.email, phone: form.phone, company: form.company, budget: form.budget, message, source: 'configurateur' }),
      })
      if (!res.ok) throw new Error('error')
      setSuccess(true)
    } catch {
      alert('Erreur lors de l\'envoi. Réessayez dans quelques instants.')
    }
    setSubmitting(false)
  }

  return (
    <section className="configurator" id="configurateur">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <span className="label" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 10 }}>Configurateur</span>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(1.6rem,3vw,2.4rem)', letterSpacing: '-0.025em', fontWeight: 700 }} className="reveal">Construisez votre<br /><em className="accent">projet sur mesure.</em></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 8 }}>Sélectionnez vos besoins et obtenez une estimation instantanée.</p>
          <div className="step-dots">
            {[1,2,3,4].map(i => <div key={i} className={`step-dot${step === i ? ' active' : ''}`} />)}
          </div>
        </div>
        <div className="config-inner">
          <div>
            {/* STEP 1 */}
            <div className={`config-step${step === 1 ? ' active' : ''}`}>
              <div className="step-label">Étape 1 / 4 — Quels sont vos projets ? (sélection multiple)</div>
              <div className="config-cards">
                {projectOptions.map(opt => (
                  <div key={opt.type} className={`config-card${projects[opt.type] ? ' selected' : ''}`} onClick={() => toggleProject(opt)}>
                    <div className="card-check" />
                    <div className="card-icon">{opt.icon}</div>
                    <div className="card-name">{opt.name}</div>
                    <div className="card-desc">{opt.desc}</div>
                    <div className="card-price">{opt.priceLabel}</div>
                  </div>
                ))}
              </div>
              <div className="step-nav">
                <button className="btn btn-primary" onClick={() => goStep(2)} disabled={Object.keys(projects).length === 0} style={{ flex: 1, justifyContent: 'center', opacity: Object.keys(projects).length === 0 ? 0.4 : 1 }}>Suivant →</button>
              </div>
            </div>

            {/* STEP 2 */}
            <div className={`config-step${step === 2 ? ' active' : ''}`}>
              <div className="step-label">Étape 2 / 4 — Options complémentaires</div>
              <div className="config-extras">
                {extraOptions.map(opt => (
                  <div key={opt.key} className={`config-card${extras[opt.key] ? ' selected' : ''}`} onClick={() => toggleExtra(opt)}>
                    <div className="card-check" />
                    <div className="card-icon">{opt.icon}</div>
                    <div className="card-name">{opt.name}</div>
                    <div className="card-desc">{opt.desc}</div>
                    <div className="card-price">{opt.priceLabel}</div>
                  </div>
                ))}
              </div>
              <div className="step-nav">
                <button className="step-back" onClick={() => goStep(1)}>← Retour</button>
                <button className="btn btn-primary" onClick={() => goStep(3)}>Suivant →</button>
              </div>
            </div>

            {/* STEP 3 */}
            <div className={`config-step${step === 3 ? ' active' : ''}`}>
              <div className="step-label">Étape 3 / 4 — Vos coordonnées</div>
              <div className="config-form">
                <div className="form-row">
                  <div className="form-field"><label>Prénom *</label><input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Axel" /></div>
                  <div className="form-field"><label>Nom *</label><input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Maillard" /></div>
                </div>
                <div className="form-row">
                  <div className="form-field"><label>Email *</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="axel@entreprise.fr" /></div>
                  <div className="form-field"><label>Téléphone *</label><input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="06 00 00 00 00" /></div>
                </div>
                <div className="form-row">
                  <div className="form-field"><label>Entreprise <span style={{ opacity: 0.5 }}>(optionnel)</span></label><input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Votre entreprise" /></div>
                  <div className="form-field"><label>Instagram / Réseaux <span style={{ opacity: 0.5 }}>(optionnel)</span></label><input value={form.social} onChange={e => setForm(f => ({ ...f, social: e.target.value }))} placeholder="@votre.compte" /></div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Secteur d&apos;activité</label>
                    <select value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}>
                      <option value="">Sélectionnez...</option>
                      {['Restaurant / Hôtellerie', 'Retail / Mode', 'Corporate / Entreprise', 'Startup / Tech', 'Événementiel', 'Santé / Bien-être', 'Sport / Loisirs', 'Autre'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Budget estimé</label>
                    <select value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}>
                      <option value="">Sélectionnez...</option>
                      {['Moins de 1 000 €', '1 000 – 2 500 €', '2 500 – 5 000 €', '5 000 – 10 000 €', 'Plus de 10 000 €'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-field">
                  <label>Description de votre projet</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Décrivez votre projet, vos objectifs, votre calendrier..." />
                </div>
              </div>
              <div className="step-nav">
                <button className="step-back" onClick={() => goStep(2)}>← Retour</button>
                <button className="btn btn-primary" onClick={() => goStep(4)}>Voir le récapitulatif →</button>
              </div>
            </div>

            {/* STEP 4 */}
            <div className={`config-step${step === 4 ? ' active' : ''}`}>
              <div className="step-label">Étape 4 / 4 — Récapitulatif</div>
              {success ? (
                <div style={{ textAlign: 'center', padding: 28 }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🎉</div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: 6, fontWeight: 700 }}>Demande envoyée !</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>On revient vers vous sous 24h. À très vite !</p>
                </div>
              ) : (
                <>
                  <div className="config-recap">
                    <div className="recap-label">Projets sélectionnés</div>
                    {Object.values(projects).map((p, i) => <div key={i} className="recap-item"><span>{p.name}</span><span>{fmt(p.price)}</span></div>)}
                    {Object.keys(extras).length > 0 && (
                      <>
                        <div className="recap-label" style={{ marginTop: 16 }}>Options</div>
                        {Object.values(extras).map((e, i) => <div key={i} className="recap-item"><span>{e.name}</span><span>{fmt(e.price)}</span></div>)}
                      </>
                    )}
                    <div className="recap-total">
                      <div className="recap-total-label">Estimation totale HT</div>
                      <div className="recap-total-value">{fmt(total)}</div>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 8 }}>* Estimation indicative. Tarif définitif établi après échange avec notre équipe.</p>
                  </div>
                  <div className="step-nav">
                    <button className="step-back" onClick={() => goStep(3)}>← Modifier</button>
                    <button className="btn btn-primary" onClick={submit} disabled={submitting} style={{ flex: 1, justifyContent: 'center' }}>
                      {submitting ? 'Envoi en cours…' : 'Envoyer ma demande →'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CART */}
          <div className="config-cart">
            <div className="cart-title">
              <span>Votre projet</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Étape {step}/4</span>
            </div>
            <div className="cart-items">
              {allItems.length === 0 ? (
                <div className="cart-empty">Aucune sélection.</div>
              ) : allItems.map((item, i) => (
                <div key={i} className="cart-item">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">{item.price > 0 ? fmt(item.price) : 'Sur devis'}</span>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <span className="cart-total-label">Estimation HT</span>
              <span className="cart-total-value">{fmt(total)}</span>
            </div>
            <div className="cart-note">Hors taxes — estimation indicative</div>
          </div>
        </div>
      </div>
    </section>
  )
}
