import { getContent, c } from '@/lib/content'
import ProcessSection from '@/components/ProcessSection'
import FoundersSection from '@/components/FoundersSection'
import StudioSection from '@/components/StudioSection'
import FaqSection from '@/components/FaqSection'
import Configurator from '@/components/Configurator'
import PortfolioSection from '@/components/PortfolioSection'
import CustomProject from '@/components/CustomProject'

const ADMIN_URL = 'https://admin.instantmov.fr'

async function getProjects() {
  try {
    const res = await fetch(`${ADMIN_URL}/api/projects?published=true`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

async function getLogos() {
  try {
    const res = await fetch(`${ADMIN_URL}/api/logos`, { cache: 'no-store' })
    if (!res.ok) return []
    const all = await res.json()
    return all.filter((l: { active: boolean }) => l.active)
  } catch { return [] }
}

async function getTestimonials() {
  try {
    const res = await fetch(`${ADMIN_URL}/api/testimonials`, { cache: 'no-store' })
    if (!res.ok) return []
    const all = await res.json()
    return all.filter((t: { active: boolean }) => t.active)
  } catch { return [] }
}

async function getFaq() {
  try {
    const res = await fetch(`${ADMIN_URL}/api/faq`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

async function getProcessSteps() {
  try {
    const res = await fetch(`${ADMIN_URL}/api/process`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

async function getShowcase() {
  try {
    const res = await fetch(`${ADMIN_URL}/api/showcase`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

export default async function Home() {
  const [ct, projects, logos, testimonials, faqItems, processSteps, showcaseCards] = await Promise.all([
    getContent(), getProjects(), getLogos(), getTestimonials(), getFaq(), getProcessSteps(), getShowcase()
  ])

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div className="container">
          <a href="/" className="nav-logo">
            <img src="/logo-instant.png" className="nav-logo-mark" alt="Instant." />
            <span className="nav-wordmark">Instant.</span>
          </a>
          <ul className="nav-links">
            <li><a href="#realisations">Réalisations</a></li>
            <li><a href="#process">Process</a></li>
            <li><a href="#studio">Studio</a></li>
            <li><a href="#agence">L&apos;agence</a></li>
            <li><a href="#configurateur">Tarifs</a></li>
          </ul>
          <div className="nav-right">
            <span className="nav-badge">{c(ct, 'nav_badge', 'Toulouse · France')}</span>
            <a href="#configurateur" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '9px 18px' }}>
              {c(ct, 'nav_cta', 'Démarrer un projet')}
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <img src="/logo-instant.png" className="hero-watermark" alt="" />
        <div className="hero-body">
          <div className="container">
            <div className="hero-top reveal">
              <div className="hero-eyebrow">
                <span className="dot" />
                <span>{c(ct, 'hero_eyebrow', 'Agence production vidéo & photo — Toulouse')}</span>
              </div>
              <h1 className="heading-xl">
                {c(ct, 'hero_title_line1', 'Le contenu')}{' '}
                <em className="accent">{c(ct, 'hero_title_accent', 'vidéo & photo')}</em><br />
                {c(ct, 'hero_title_line2', 'qui fait vendre vos projets.')}
              </h1>
            </div>
            <div className="hero-bottom">
              <div className="hero-video-wrap reveal">
                {c(ct, 'hero_vsl_url') ? (
                  <video src={c(ct, 'hero_vsl_url')} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                ) : (
                  <div className="hero-video-placeholder">
                    <button className="play-btn">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="#f0ebe3"><polygon points="5,3 19,12 5,21"/></svg>
                    </button>
                    <span className="video-label">{c(ct, 'hero_vsl_label', 'Showreel 2025')}</span>
                  </div>
                )}
              </div>
              <div className="hero-right reveal">
                <p>{c(ct, 'hero_description', "Depuis 3 ans, on accompagne les marques ambitieuses avec du contenu qui capte l'attention et génère des résultats concrets.")}</p>
                <div className="hero-ctas" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <CustomProject variant="hero" label={c(ct, 'hero_cta_custom', 'J’ai un projet, parlons-en')} />
                  <a href="#realisations" className="hero-cta-secondary">{c(ct, 'hero_cta_secondary', 'Voir nos réalisations')}</a>
                </div>
                <div className="hero-config-note">
                  <strong>Un besoin précis ?</strong> {c(ct, 'hero_config_note', 'Le configurateur en ligne vous donne une estimation instantanée. Réponse sous 24h.')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOGOS */}
        {logos.length > 0 && (
          <div className="logos-section">
            <div className="logos-track-wrap">
              <div className="logos-track">
                {[...logos, ...logos].map((logo: { id: string; url: string; name: string; websiteUrl?: string }, i: number) => (
                  logo.websiteUrl
                    ? <a key={`${logo.id}-${i}`} href={logo.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center' }}><img src={logo.url} alt={logo.name} /></a>
                    : <img key={`${logo.id}-${i}`} src={logo.url} alt={logo.name} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* METRICS */}
        <div className="metrics">
          <div className="container">
            <div className="metrics-inline">
              {[
                { val: c(ct, 'metric_1_value', '+200'), lbl: c(ct, 'metric_1_label', 'vidéos / mois') },
                { val: c(ct, 'metric_2_value', '48h'), lbl: c(ct, 'metric_2_label', 'livraison formats courts') },
                { val: c(ct, 'metric_3_value', '3 ans'), lbl: c(ct, 'metric_3_label', "d'expérience production") },
                { val: c(ct, 'metric_4_value', '5/5'), lbl: c(ct, 'metric_4_label', 'satisfaction client') },
              ].map((m, i) => (
                <div key={i} className="metric-inline">
                  <div className="mi-value">{m.val}</div>
                  <div className="mi-label">{m.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <ShowcaseSection cards={showcaseCards} />

      {/* PORTFOLIO */}
      <PortfolioSection projects={projects} />

      {/* PROCESS */}
      <ProcessSection
        title={c(ct, 'process_title', 'Notre process.')}
        steps={processSteps.length > 0
          ? processSteps.map((s: { title: string; desc: string }) => ({ title: s.title, desc: s.desc }))
          : [
            { title: 'Brief', desc: 'On apprend à vous connaître : objectifs, cible, ton, budget. Tout part d\'ici.' },
            { title: 'Conception', desc: 'Script, storyboard, moodboard — on pose les bases créatives du projet.' },
            { title: 'Pré-production', desc: 'Casting, location, planning, matériel. On prépare chaque détail.' },
            { title: 'Production', desc: 'Tournage ou shooting. On capte ce qu\'il faut, dans les temps.' },
            { title: 'Post-production', desc: 'Montage, étalonnage, mixage. Livraison en 48h pour les formats courts.' },
          ]}
      />

      {/* AGENCE */}
      <section className="story" id="agence">
        <div className="container">
          <div className="story-inner">
            <div className="story-image reveal">
              {c(ct, 'agency_photo') ? (
                <img src={c(ct, 'agency_photo')} alt="instant. agence" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'var(--text-muted)' }}>
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.25 }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
                  <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35 }}>Photo Axel & Lucas</span>
                </div>
              )}
            </div>
            <div className="story-text">
              <span className="section-tag" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>L&apos;agence</span>
              <h2 className="reveal">{c(ct, 'agency_title', 'Deux amis. Une passion. Une agence.')}</h2>
              <p className="reveal">{c(ct, 'agency_desc1', '')}</p>
              <p className="reveal">{c(ct, 'agency_desc2', '')}</p>
              <FoundersSection
                founder1={{ name: c(ct, 'founder1_name', 'Axel "Kawa" Maillard'), role: c(ct, 'founder1_role', 'Co-fondateur'), bio: c(ct, 'founder1_bio', ''), photo: c(ct, 'founder1_photo', '') }}
                founder2={{ name: c(ct, 'founder2_name', 'Lucas Desa'), role: c(ct, 'founder2_role', 'Co-fondateur'), bio: c(ct, 'founder2_bio', ''), photo: c(ct, 'founder2_photo', '') }}
              />
              <a href="#configurateur" className="btn btn-primary reveal" style={{ marginTop: 8 }}>Démarrer un projet →</a>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsSection testimonials={testimonials} />

      {/* STUDIO */}
      <StudioSection
        title={c(ct, 'studio_title', 'instant. studio')}
        subtitle={c(ct, 'studio_subtitle', 'Notre espace de création à Toulouse.')}
        description={c(ct, 'studio_desc', '')}
        categories={[
          { title: c(ct, 'studio_cat1_title', 'Shooting entreprise'), desc: c(ct, 'studio_cat1_desc', '') },
          { title: c(ct, 'studio_cat2_title', 'Photo produit'), desc: c(ct, 'studio_cat2_desc', '') },
          { title: c(ct, 'studio_cat3_title', 'Campagne marque'), desc: c(ct, 'studio_cat3_desc', '') },
          { title: c(ct, 'studio_cat4_title', 'Portrait créatif'), desc: c(ct, 'studio_cat4_desc', '') },
        ]}
        images={[c(ct, 'studio_image_1', ''), c(ct, 'studio_image_2', ''), c(ct, 'studio_image_3', ''), c(ct, 'studio_image_4', '')]}
      />

      {/* PROJET SUR MESURE — entry point above the predefined offers */}
      <section className="custom-cta" id="projet-sur-mesure">
        <div className="container">
          <div className="custom-cta-inner reveal">
            <span className="label" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 10 }}>Projet sur mesure</span>
            <h3>Vous avez un projet <em className="accent">sur mesure ?</em></h3>
            <p className="custom-cta-proof">{c(ct, 'custom_cta_proof', 'Red Bull, le Stade Toulousain ou les Galeries Lafayette nous confient leurs contenus. Parlons du vôtre.')}</p>
            <CustomProject variant="config" label={c(ct, 'custom_cta_label', 'Parlons de votre projet')} />
            <a href="#configurateur" className="custom-cta-or">Ou configurez directement l&apos;une de nos offres ↓</a>
          </div>
        </div>
      </section>

      {/* CONFIGURATEUR */}
      <Configurator />

      {/* FAQ */}
      <FaqSection
        title={c(ct, 'faq_title', 'Questions fréquentes.')}
        items={faqItems.length > 0
          ? faqItems.map((f: { question: string; answer: string }) => ({ q: f.question, a: f.answer }))
          : [
            { q: "C'est quoi instant. ?", a: "Agence de production vidéo & photo à Toulouse. On est deux — Axel et Lucas — et on livre +200 vidéos par mois pour des marques locales et nationales." },
            { q: "Quels sont vos délais ?", a: "48h pour les formats courts (Reels, Shorts). Les photos de shooting sont livrées en live via un gallery link. Les films corporate : 5-10 jours ouvrés." },
            { q: "Vous intervenez hors Toulouse ?", a: "Oui, partout en France. Le déplacement est intégré au devis selon la distance." },
            { q: "Comment fonctionne le pack mensuel ?", a: "Dès 2 000 €/mois : 10 vidéos incluses, stratégie + script + tournage + montage. Options supplémentaires : CM, Meta Ads, Photo." },
            { q: "C'est quoi instant. studio ?", a: "Notre espace dédié à Toulouse pour les shootings photo & vidéo en studio : produit, portrait, campagne, corporate." },
            { q: "Comment démarrer ?", a: "Remplissez le configurateur ci-dessus → on vous répond sous 24h → appel 30 min pour caler les détails → proposition sur mesure." },
          ]}
      />

      {/* CTA FINAL */}
      <section className="cta-final">
        <div className="container">
          <div className="cta-block reveal">
            <img src="/logo-instant.png" className="cta-block-watermark" alt="" />
            <span className="label">{c(ct, 'cta_tag', 'On démarre quand vous voulez')}</span>
            <h2>
              <span style={{ fontFamily: 'var(--font-head)', fontStyle: 'normal', fontWeight: 700 }}>{c(ct, 'cta_title1', 'Votre prochain contenu')}</span><br />
              <em className="accent">{c(ct, 'cta_title2', 'commence ici.')}</em>
            </h2>
            <div className="cta-block-btns">
              <a href="#configurateur" className="btn btn-primary">{c(ct, 'cta_btn_primary', 'Configurer mon projet →')}</a>
              <a href={`mailto:${c(ct, 'footer_email', 'kawa@instantmov.fr')}`} className="btn btn-ghost">{c(ct, 'cta_btn_secondary', 'Nous écrire')}</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="/" className="nav-logo" style={{ marginBottom: 12, display: 'inline-flex' }}>
                <img src="/logo-instant.png" className="nav-logo-mark" alt="Instant." />
                <span className="nav-wordmark">Instant.</span>
              </a>
              <p>{c(ct, 'footer_description', 'Agence de production vidéo & photo à Toulouse.')}</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <a href="https://www.instagram.com/instant.mov" target="_blank" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem' }}>Instagram</a>
                <a href={`mailto:${c(ct, 'footer_email', 'kawa@instantmov.fr')}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem' }}>Email</a>
              </div>
            </div>
            <div>
              <div className="footer-title">Services</div>
              <ul className="footer-links">
                {['Reels & Short content','Événementiel','Vidéo corporate','Photographie','Pack mensuel'].map(s => <li key={s}><a href="#configurateur">{s}</a></li>)}
              </ul>
            </div>
            <div>
              <div className="footer-title">Studio</div>
              <ul className="footer-links">
                {['Shooting entreprise','Photo produit','Campagne marque','Portrait créatif'].map(s => <li key={s}><a href="#studio">{s}</a></li>)}
              </ul>
            </div>
            <div>
              <div className="footer-title">Contact</div>
              <ul className="footer-links">
                <li><a href={`mailto:${c(ct, 'footer_email', 'kawa@instantmov.fr')}`}>{c(ct, 'footer_email', 'kawa@instantmov.fr')}</a></li>
                <li><span style={{ color: 'rgba(240,235,227,0.45)', fontSize: '0.85rem' }}>{c(ct, 'footer_city', 'Toulouse, France')}</span></li>
                <li><a href="https://www.instagram.com/instant.mov" target="_blank">{c(ct, 'footer_instagram', '@instant.mov')}</a></li>
                <li><a href="#configurateur">Démarrer un projet</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>{c(ct, 'footer_copyright', '© 2025 Instant. — Tous droits réservés')}</p>
            <p>{c(ct, 'footer_city', 'Toulouse · France')}</p>
          </div>
        </div>
      </footer>

      <RevealScript />
    </>
  )
}

const SHOWCASE_DEFAULTS = [
  { row: 0, items: ['Teaser marque','Shoot commercial','Photo produit','Social media','Campagne marque','Aftermovie'] },
  { row: 1, items: ['Portrait créatif','Reels Instagram','Film corporatif','Micro-trottoir','Brand content','Live event'] },
]

interface ShowCard { id: string; title: string; imageUrl?: string; videoUrl?: string; row: number }

function ShowcaseSection({ cards }: { cards: ShowCard[] }) {
  const row0 = cards.filter(c => c.row === 0)
  const row1 = cards.filter(c => c.row === 1)

  function Strip({ items, dir, bgColor }: { items: ShowCard[] | string[]; dir: string; bgColor: string }) {
    const rendered = [...items, ...items]
    return (
      <div className="showcase-row">
        <div className={`showcase-strip ${dir}`}>
          {rendered.map((item, i) => {
            if (typeof item === 'string') return (
              <div key={i} className="showcase-card">
                <div className="sc-bg-placeholder" style={{ background: bgColor }}>{item}</div>
                <span className="sc-label">{item}</span>
              </div>
            )
            return (
              <div key={`${item.id}-${i}`} className="showcase-card">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                ) : item.videoUrl ? (
                  <video src={item.videoUrl} muted loop playsInline autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                ) : (
                  <div className="sc-bg-placeholder" style={{ background: bgColor }}>{item.title}</div>
                )}
                <span className="sc-label">{item.title}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <section className="showcase" id="showcase">
      <div className="container">
        <span className="label" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 10 }}>Notre travail</span>
        <h2 className="heading-lg reveal">La variété de nos <em className="accent">créations.</em></h2>
      </div>
      <div className="showcase-tracks">
        <Strip items={row0.length > 0 ? row0 : SHOWCASE_DEFAULTS[0].items} dir="fwd" bgColor="#1c1813" />
        <Strip items={row1.length > 0 ? row1 : SHOWCASE_DEFAULTS[1].items} dir="rev" bgColor="#1a1410" />
      </div>
    </section>
  )
}

const FALLBACK_TESTIMONIALS = [
  { id: '1', name: 'Marie L.', company: 'Red Bull France', text: "Résultat bluffant. L'équipe a su capturer l'énergie de notre événement parfaitement.", rating: 5 },
  { id: '2', name: 'Thomas B.', company: 'Startup Toulouse', text: "La livraison en 48h n'était pas une promesse marketing — ils ont vraiment tenu.", rating: 5 },
  { id: '3', name: 'Sophie M.', company: 'Restaurant Toulouse', text: "Le pack mensuel nous a permis d'alimenter nos réseaux de façon cohérente.", rating: 5 },
  { id: '4', name: 'Pierre D.', company: 'PME locale', text: "Notre film de marque est exactement ce qu'on voulait. Professionnel, moderne.", rating: 5 },
  { id: '5', name: 'Laura F.', company: 'Marque mode', text: "Le shooting studio était top — ambiance pro, équipe sympa, et les photos sont superbes.", rating: 5 },
  { id: '6', name: 'Julien R.', company: 'Corporate Toulouse', text: "Ils ont filmé notre soirée et le recap était prêt le lendemain matin.", rating: 5 },
  { id: '7', name: 'Antoine V.', company: 'Hôtel boutique', text: "Depuis qu'on travaille avec instant., nos Reels génèrent 3× plus d'engagement.", rating: 5 },
  { id: '8', name: 'Céline T.', company: 'Retail Toulouse', text: "Des professionnels qui savent ce qu'ils font. Tout est fluide du brief à la livraison.", rating: 5 },
]

interface TestiItem { id: string; name: string; company: string; role?: string; text: string; rating: number; photoUrl?: string }

function TestimonialsSection({ testimonials }: { testimonials: TestiItem[] }) {
  const list = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS
  const half = Math.ceil(list.length / 2)
  const row1 = list.slice(0, half)
  const row2 = list.slice(half)

  function Card({ item }: { item: TestiItem }) {
    return (
      <div className="testi-card">
        <div className="testi-stars">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</div>
        <p className="testi-text">&ldquo;{item.text}&rdquo;</p>
        <div className="testi-author">
          {item.photoUrl
            ? <img src={item.photoUrl} alt={item.name} className="testi-avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
            : <div className="testi-avatar" />}
          <div>
            <div className="testi-name">{item.name}</div>
            <div className="testi-company">{item.company}{item.role ? ` · ${item.role}` : ''}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <span className="label" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 10 }}>Ce qu&apos;ils en disent</span>
        <h2 className="heading-lg reveal">Ils nous ont fait <em className="accent">confiance.</em></h2>
      </div>
      <div className="testi-tracks">
        <div className="testi-row">
          <div className="testi-strip fwd">
            {[...row1, ...row1].map((item, i) => <Card key={`${item.id}-${i}`} item={item} />)}
          </div>
        </div>
        {row2.length > 0 && (
          <div className="testi-row">
            <div className="testi-strip rev">
              {[...row2, ...row2].map((item, i) => <Card key={`${item.id}-${i}`} item={item} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function RevealScript() {
  return (
    <script dangerouslySetInnerHTML={{ __html: `
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
      }, { threshold: 0.08, rootMargin: '-30px' });
      document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    `}} />
  )
}
