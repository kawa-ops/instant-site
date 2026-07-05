'use client'
import { useState } from 'react'

interface FaqItem { q: string; a: string }

const DEFAULT_FAQS: FaqItem[] = [
  { q: "C'est quoi instant. ?", a: "Agence de production vidéo & photo basée à Toulouse, fondée par Axel et Lucas." },
  { q: 'Quels sont vos délais ?', a: '48h pour les formats courts. Photos livrées en live sur événement.' },
  { q: 'Vous intervenez hors Toulouse ?', a: 'Oui, partout en France. Frais de déplacement intégrés au devis.' },
  { q: 'Comment fonctionne le pack mensuel ?', a: '2 000 €/mois pour 10 vidéos clés en main : stratégie, script, production et montage inclus.' },
  { q: "C'est quoi instant. studio ?", a: 'Notre studio dédié à Toulouse : photo produit, portrait, campagnes, corporate.' },
  { q: 'Comment démarrer un projet ?', a: 'Configurez via notre outil → réponse sous 24h → appel 30 min → proposition.' },
]

export default function FaqSection({ title, items }: { title?: string; items?: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = items && items.filter(i => i.q).length > 0 ? items.filter(i => i.q) : DEFAULT_FAQS

  return (
    <section className="faq" id="faq">
      <div className="container">
        <span className="section-tag">Questions fréquentes</span>
        <h2 className="section-title-dark reveal" style={{ marginBottom: 0 }}>{title || 'Questions fréquentes.'}</h2>
        <div className="faq-grid">
          {faqs.map((f, i) => (
            <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
              <button className="faq-toggle" onClick={() => setOpen(open === i ? null : i)}>
                <span className="faq-question">{f.q}</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-body" style={{ maxHeight: open === i ? 300 : 0 }}>
                <p>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
