import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const WA = 'https://wa.me/5511958843199?text=' + encodeURIComponent('Olá! Vim pelo site da Havoc Fit e quero agendar minha aula experimental.')
const ADDRESS = 'R. Delfino Facchina, 600 - Americanópolis, São Paulo - SP, 04409-080'
const MAPS = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ADDRESS)
const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`
const IMG = {
  hero: u('1534438327276-14e5300c3a48', 2000),
  studio: u('1571019614242-c5c5dceb1a9e'),
  gallery: [
    [u('1517836357463-d25dfeac3438', 900), 'Levantamento com barra'],
    [u('1583454110551-21f2fa2afe61', 900), 'Treino de força com halteres'],
    [u('1541534741688-6078c6bfb5c5', 900), 'Aluna treinando com kettlebell'],
    [u('1581009146145-b5ef050c2e1e', 900), 'Treino de braço com peso livre'],
  ],
}

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const useGsap = (fn, deps = []) => {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => { if (!reduced()) fn(ref.current) }, ref)
    return () => ctx.revert()
  }, deps)
  return ref
}

/* ================= ILUSTRAÇÕES SVG (tema academia) ================= */
function Plate({ className = '', label = '20' }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="96" fill="#1d1c14" stroke="#D95D37" strokeWidth="4" />
      <circle cx="100" cy="100" r="78" fill="none" stroke="#3a372d" strokeWidth="2" />
      <circle cx="100" cy="100" r="62" fill="none" stroke="#3a372d" strokeWidth="10" strokeDasharray="4 10" />
      {[0, 120, 240].map(a => (
        <ellipse key={a} cx="100" cy="42" rx="14" ry="8" fill="#15140c" transform={`rotate(${a} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="18" fill="#15140c" stroke="#D95D37" strokeWidth="3" />
      <text x="100" y="152" textAnchor="middle" fontFamily="Anton" fontSize="20" fill="#D95D37">{label} KG</text>
      <text x="100" y="62" textAnchor="middle" fontFamily="Anton" fontSize="13" letterSpacing="3" fill="#a79f93">HAVOC</text>
    </svg>
  )
}

function Dumbbell({ className = '' }) {
  return (
    <svg viewBox="0 0 240 90" className={className} aria-hidden="true">
      <rect x="60" y="38" width="120" height="14" rx="4" fill="#a79f93" />
      <rect x="18" y="12" width="22" height="66" rx="6" fill="#D95D37" />
      <rect x="40" y="20" width="18" height="50" rx="5" fill="#262525" stroke="#D95D37" strokeWidth="2" />
      <rect x="200" y="12" width="22" height="66" rx="6" fill="#D95D37" />
      <rect x="182" y="20" width="18" height="50" rx="5" fill="#262525" stroke="#D95D37" strokeWidth="2" />
      {[80, 95, 110, 125, 140, 155].map(x => <line key={x} x1={x} y1="38" x2={x} y2="52" stroke="#15140c" strokeWidth="2" />)}
    </svg>
  )
}

function Kettlebell({ className = '' }) {
  return (
    <svg viewBox="0 0 160 190" className={className} aria-hidden="true">
      <path d="M50 70 C40 20, 120 20, 110 70" fill="none" stroke="#FDF8EA" strokeWidth="14" strokeLinecap="round" />
      <circle cx="80" cy="120" r="62" fill="#D95D37" />
      <ellipse cx="60" cy="100" rx="14" ry="22" fill="#E87C5A" opacity=".7" />
      <text x="80" y="136" textAnchor="middle" fontFamily="Anton" fontSize="34" fill="#15140c">16</text>
    </svg>
  )
}

const EKG = 'M0 40 H170 L190 40 L205 10 L222 70 L238 20 L250 40 H330 L345 40 L358 5 L375 75 L390 40 H600'

function Heartbeat({ className = '' }) {
  return (
    <svg viewBox="0 0 600 80" className={className} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id="ekg-glow" x="-10%" y="-50%" width="120%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* traçado base apagado, como a grade do monitor */}
      <path d={EKG} fill="none" stroke="#D95D37" strokeOpacity=".15" strokeWidth="2" strokeLinejoin="round" />
      {/* rastro longo que se apaga */}
      <path d={EKG} pathLength="1" className="ekg-trail" fill="none" stroke="#D95D37" strokeOpacity=".45" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {/* cabeça luminosa do sinal */}
      <path d={EKG} pathLength="1" className="ekg-head" fill="none" stroke="#FFB59F" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" filter="url(#ekg-glow)" />
    </svg>
  )
}

/* ================= UTILITÁRIOS ================= */
function Split({ text, className = '' }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, wi) => (
        <span key={wi} className="inline-block overflow-hidden pb-[.08em] align-bottom" aria-hidden="true">
          {[...w].map((c, ci) => <span key={ci} className="char inline-block">{c}</span>)}
          {wi < text.split(' ').length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}

function Btn({ href, children, variant = 'primary', className = '' }) {
  const ref = useRef(null)
  const move = e => {
    if (reduced()) return
    const r = ref.current.getBoundingClientRect()
    gsap.to(ref.current, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: 'power3.out' })
  }
  const leave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  return (
    <a ref={ref} href={href} onMouseMove={move} onMouseLeave={leave}
      target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={`btn btn-${variant} ${className}`}>
      <span className="slide" aria-hidden="true" />
      {children}
    </a>
  )
}

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)

function Eyebrow({ children }) {
  return <p className="rv mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.22em] text-flame"><span className="h-px w-8 bg-flame" />{children}</p>
}

/* ================= PRELOADER — carregando a barra ================= */
function Preloader({ onDone }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (reduced()) { onDone(); return }
    const ctx = gsap.context(() => {
      const o = { v: 0 }
      const tl = gsap.timeline({ onComplete: onDone })
      tl.from('.pl-bar', { scaleX: 0, duration: 0.5, ease: 'power3.out' })
        .from('.pl-plate', { x: i => (i < 2 ? -260 : 260), opacity: 0, duration: 0.45, ease: 'back.out(1.6)', stagger: 0.12 }, '-=.1')
        .to(o, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => setN(Math.round(o.v)) }, 0.2)
        .to('.pl-lift', { y: -40, duration: 0.35, ease: 'power2.out' })
        .to('.pl-lift', { y: 0, duration: 0.25, ease: 'power2.in' })
        .to(ref.current, { yPercent: -100, duration: 0.9, ease: 'power3.inOut' }, '+=.1')
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <div ref={ref} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink">
      <div className="pl-lift relative flex h-24 w-72 items-center justify-center">
        <div className="pl-bar absolute h-2.5 w-full rounded-full bg-dust" />
        <div className="pl-plate absolute left-6 h-20 w-4 rounded bg-flame" />
        <div className="pl-plate absolute left-11 h-14 w-3 rounded bg-cream" />
        <div className="pl-plate absolute right-11 h-14 w-3 rounded bg-cream" />
        <div className="pl-plate absolute right-6 h-20 w-4 rounded bg-flame" />
      </div>
      <p className="mt-8 font-display text-6xl tabular-nums text-cream">{n}<span className="text-flame">KG</span></p>
      <p className="mt-2 text-[11px] font-bold uppercase tracking-[.3em] text-dust">Carregando a barra</p>
    </div>
  )
}

/* ================= PROGRESSO DE ROLAGEM — barra de carga ================= */
function ScrollBar() {
  const ref = useGsap(el => {
    gsap.to(el.querySelector('.fill'), { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })
  })
  return (
    <div ref={ref} className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent" aria-hidden="true">
      <div className="fill h-full origin-left scale-x-0 bg-gradient-to-r from-flame to-ember" />
    </div>
  )
}

/* ================= CURSOR (desktop) ================= */
function Cursor() {
  const ref = useRef(null)
  useEffect(() => {
    if (reduced() || !window.matchMedia('(pointer: fine)').matches) return
    const el = ref.current
    el.style.display = 'block'
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' })
    const move = e => { xTo(e.clientX); yTo(e.clientY) }
    const over = e => gsap.to(el, { scale: e.target.closest('a,button') ? 2.4 : 1, duration: 0.3 })
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over) }
  }, [])
  return <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-[90] -ml-3 -mt-3 hidden h-6 w-6 rounded-full border-2 border-flame mix-blend-difference" aria-hidden="true" />
}

/* ================= NAVBAR PÍLULA ================= */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menu = useRef(null)
  const links = [['#studio', 'O Studio'], ['#galeria', 'Galeria'], ['#planos', 'Planos'], ['#avaliacoes', 'Avaliações'], ['#contato', 'Como chegar']]

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open && !reduced()) {
      gsap.fromTo(menu.current, { clipPath: 'circle(0% at 90% 5%)' }, { clipPath: 'circle(150% at 90% 5%)', duration: 0.7, ease: 'power3.inOut' })
      gsap.from(menu.current.querySelectorAll('.m-link'), { y: 60, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08, delay: 0.25 })
    }
  }, [open])

  return (
    <>
      <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 md:top-5">
        <nav className={`flex w-full max-w-5xl items-center justify-between rounded-full border py-2 pl-5 pr-2 transition-all duration-500 ${scrolled ? 'border-line bg-ink/75 shadow-[0_10px_40px_rgba(0,0,0,.4)] backdrop-blur-xl' : 'border-cream/10 bg-ink/30 backdrop-blur-md'}`}>
          <a href="#top" className="group flex items-center gap-2 font-display text-xl tracking-wider text-cream" aria-label="Havoc Fit — início">
            <Dumbbell className="h-4 w-9 transition-transform duration-500 group-hover:rotate-[-20deg]" />
            HAVOC<span className="-ml-1.5 text-flame">FIT</span>
          </a>
          <ul className="hidden items-center gap-1 text-sm font-semibold text-sand/80 lg:flex">
            {links.map(([h, l]) => <li key={h}><a href={h} className="rounded-full px-4 py-2 transition-colors hover:bg-cream/10 hover:text-cream">{l}</a></li>)}
          </ul>
          <div className="flex items-center gap-2">
            <Btn href={WA} className="!rounded-full !px-4 !py-2.5 !text-[11px]">Aula grátis</Btn>
            <button onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              className="relative z-[70] flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 lg:hidden">
              <span className={`absolute h-0.5 w-4 bg-cream transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-1'}`} />
              <span className={`absolute h-0.5 w-4 bg-cream transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-1'}`} />
            </button>
          </div>
        </nav>
      </header>
      {open && (
        <div ref={menu} className="fixed inset-0 z-40 flex flex-col justify-between bg-flame px-6 pb-10 pt-28 lg:hidden">
          <ul className="space-y-2">
            {links.map(([h, l], i) => (
              <li key={h} className="overflow-hidden">
                <a href={h} onClick={() => setOpen(false)} className="m-link flex items-baseline gap-4 font-display text-5xl uppercase text-ink">
                  <span className="font-mono text-sm text-cream">0{i + 1}</span>{l}
                </a>
              </li>
            ))}
          </ul>
          <a href={WA} target="_blank" rel="noreferrer" className="m-link btn w-full bg-ink text-cream">Chamar no WhatsApp <Arrow /></a>
        </div>
      )}
    </>
  )
}

/* ================= HERO ================= */
function Hero({ ready }) {
  const ref = useRef(null)
  const [bpm, setBpm] = useState(72)
  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      if (reduced()) return
      const tl = gsap.timeline()
      tl.from('.h-img', { scale: 1.3, duration: 2, ease: 'power3.out' })
        .from('.char', { yPercent: 110, rotate: 8, duration: 0.9, ease: 'power3.out', stagger: 0.03 }, 0.1)
        .from('.h-in', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 }, 0.5)
        .from('.h-plate', { x: 300, rotate: 360, opacity: 0, duration: 1.4, ease: 'power3.out' }, 0.3)
      gsap.to('.h-plate', { rotate: '+=360', duration: 20, repeat: -1, ease: 'none' })
      gsap.to('.h-img', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('.h-content', { yPercent: -20, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'center center', end: 'bottom top', scrub: true } })
      gsap.to('.h-plate-wrap', { y: 200, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
    }, ref)
    const id = setInterval(() => setBpm(b => Math.min(168, Math.max(118, b + Math.round(Math.random() * 14 - 5)))), 900)
    return () => { ctx.revert(); clearInterval(id) }
  }, [ready])

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <img src={IMG.hero} alt="Aluno treinando com pesos livres no studio Havoc Fit" className="h-img absolute inset-0 h-full w-full object-cover" width="2000" height="1333" fetchPriority="high" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 to-transparent" />

      <div className="h-plate-wrap pointer-events-none absolute -right-24 top-24 w-64 opacity-90 md:-right-16 md:top-28 md:w-[26rem]">
        <Plate className="h-plate w-full drop-shadow-[0_20px_60px_rgba(217,93,55,.35)]" />
      </div>

      <div className="h-content relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-10 md:px-12 md:pb-16">
        <div className="h-in mb-5 flex w-fit items-center gap-3 rounded-full border border-cream/15 bg-ink/50 px-4 py-2 backdrop-blur">
          <svg viewBox="0 0 24 24" className="beat h-4 w-4 fill-flame" aria-hidden="true"><path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z" /></svg>
          <span className="font-mono text-xs tabular-nums text-cream">{bpm} BPM</span>
          <span className="text-[10px] font-bold uppercase tracking-[.18em] text-dust">Americanópolis • SP</span>
        </div>
        <h1 className="font-display uppercase leading-[.9] text-cream">
          <Split text="Treino de" className="block text-[3.6rem] sm:text-7xl md:text-[7.5rem]" />
          <Split text="verdade." className="block text-[4.6rem] text-flame sm:text-8xl md:text-[10rem]" />
        </h1>
        <Heartbeat className="h-in mt-3 h-10 w-full max-w-md md:h-12" />
        <p className="h-in mt-4 max-w-md text-[15px] leading-relaxed text-sand/85 md:text-lg">
          Um studio de musculação com professores por perto, zero fila nos aparelhos e foco total na sua evolução.
        </p>
        <div className="h-in mt-7 flex flex-col gap-3 sm:flex-row">
          <Btn href={WA} className="w-full sm:w-auto">Agendar aula experimental <Arrow /></Btn>
          <Btn href="#studio" variant="ghost" className="w-full sm:w-auto">Conhecer o studio</Btn>
        </div>
        <div className="h-in mt-8 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.2em] text-dust">
          <span className="scroll-dot relative h-8 w-5 rounded-full border-2 border-dust/60"><span className="absolute left-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 rounded-full bg-flame" /></span>
          Role para aquecer
        </div>
      </div>
    </section>
  )
}

/* ================= MARQUEE com velocidade ================= */
function Marquee() {
  const ref = useGsap(el => {
    const rows = el.querySelectorAll('.mq')
    const tweens = [...rows].map((r, i) => gsap.fromTo(r, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 26, repeat: -1, ease: 'none' }))
    ScrollTrigger.create({
      onUpdate: s => {
        const v = gsap.utils.clamp(-4, 4, s.getVelocity() / 300)
        tweens.forEach(t => gsap.to(t, { timeScale: 1 + Math.abs(v), duration: 0.2, overwrite: true }))
        gsap.to(rows, { skewX: -v * 2, duration: 0.3 })
      },
    })
  })
  const a = ['Força', 'Postura', 'Constância', 'Pesos livres', 'Sem fila', 'Hipertrofia', 'Foco']
  const b = ['Agachamento', 'Supino', 'Terra', 'Remada', 'Desenvolvimento', 'Puxada', 'Stiff']
  const Row = ({ w, cls }) => (
    <div className={`mq flex w-max whitespace-nowrap ${cls}`}>
      {[...w, ...w, ...w, ...w].map((x, i) => <span key={i} className="flex items-center gap-8 pr-8">{x}<span className="text-ink">●</span></span>)}
    </div>
  )
  return (
    <div ref={ref} className="relative z-10 -my-6 overflow-hidden py-8" aria-hidden="true">
      <div className="-rotate-2 bg-flame py-3 font-display text-2xl uppercase tracking-wider text-white md:text-4xl"><Row w={a} /></div>
      <div className="rotate-1 border-y border-line bg-ink-low py-3 font-display text-xl uppercase tracking-wider text-dust md:text-3xl"><Row w={b} /></div>
    </div>
  )
}

/* ================= CONTADORES ================= */
function Stats() {
  const data = [
    { v: 4.7, d: 1, s: '★', l: 'Nota no Google' },
    { v: 84, d: 0, s: '+', l: 'Avaliações reais' },
    { v: 50, d: 0, s: 'min', l: 'Treino ágil' },
    { v: 0, d: 0, s: '', l: 'Fila nos aparelhos' },
  ]
  const ref = useGsap(el => {
    el.querySelectorAll('.num').forEach(n => {
      const o = { v: 0 }, t = +n.dataset.v, d = +n.dataset.d
      gsap.to(o, { v: t, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 80%' }, onUpdate: () => { n.textContent = o.v.toFixed(d) } })
    })
    gsap.from('.st', { y: 50, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%' } })
    gsap.from('.st-bar', { scaleX: 0, duration: 1.4, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%' } })
  })
  return (
    <section ref={ref} className="mx-auto grid max-w-7xl grid-cols-2 gap-x-5 gap-y-10 px-5 pb-10 pt-24 md:grid-cols-4 md:px-12 md:pt-32">
      {data.map(x => (
        <div key={x.l} className="st">
          <p className="font-display text-6xl text-cream md:text-7xl"><span className="num tabular-nums" data-v={x.v} data-d={x.d}>{x.v}</span><span className="text-flame">{x.s}</span></p>
          <div className="st-bar mt-3 h-1 origin-left bg-gradient-to-r from-flame to-transparent" />
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[.18em] text-dust">{x.l}</p>
        </div>
      ))}
    </section>
  )
}

/* ================= FEATURE CARDS ================= */
function Shuffler() {
  const [items, setItems] = useState([
    { t: 'Postura corrigida', d: 'O professor ajusta cada execução' },
    { t: 'Carga ajustada', d: 'Progressão no seu ritmo, sem lesão' },
    { t: 'Incentivo real', d: 'Chamado pelo nome em cada série' },
  ])
  useEffect(() => {
    if (reduced()) return
    const id = setInterval(() => setItems(a => { const b = [...a]; b.unshift(b.pop()); return b }), 3000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="relative h-44">
      {items.map((it, i) => (
        <div key={it.t} className="absolute inset-x-0 rounded-card border border-line bg-ink-high p-4"
          style={{ top: i * 22, zIndex: 3 - i, opacity: 1 - i * 0.3, transform: `scale(${1 - i * 0.05})`, transition: 'all .7s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <div className="flex items-center justify-between">
            <span className="font-display text-lg uppercase tracking-wide text-cream">{it.t}</span>
            <span className="rounded-full bg-flame/15 px-2.5 py-0.5 font-mono text-[10px] text-ember">✓ OK</span>
          </div>
          <p className="mt-1 text-sm text-dust">{it.d}</p>
        </div>
      ))}
    </div>
  )
}

function Typewriter() {
  const msgs = ['Avaliação física: concluída.', 'Supino: carga +2,5 kg.', 'Agachamento: 4x10 validado.', 'Ajuste quinzenal: novo treino.']
  const [text, setText] = useState('')
  const [reps, setReps] = useState(0)
  useEffect(() => {
    if (reduced()) { setText(msgs[0]); return }
    let m = 0, c = 0, del = false, t
    const tick = () => {
      const full = msgs[m]
      c += del ? -1 : 1
      setText(full.slice(0, c))
      let wait = del ? 25 : 55
      if (!del && c === full.length) { del = true; wait = 1700; setReps(r => r + 1) }
      else if (del && c === 0) { del = false; m = (m + 1) % msgs.length; wait = 300 }
      t = setTimeout(tick, wait)
    }
    t = setTimeout(tick, 600)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="h-44 rounded-card border border-line bg-ink p-4 font-mono text-sm">
      <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[.2em] text-dust">
        <span className="flex items-center gap-2"><span className="pulse h-2 w-2 rounded-full bg-flame" /> Diário de treino</span>
        <span className="text-ember">log #{String(reps).padStart(3, '0')}</span>
      </div>
      <div className="mb-3 flex h-8 items-end gap-1">
        {[30, 45, 40, 60, 55, 75, 70, 90].map((h, i) => <span key={i} className="grow-bar w-full rounded-sm bg-flame/70" style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }} />)}
      </div>
      <p className="min-h-[2.5rem] text-cream">&gt; {text}<span className="caret ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-flame" /></p>
    </div>
  )
}

function Scheduler() {
  const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
  const [active, setActive] = useState(null)
  const ref = useGsap(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 })
    tl.set('.cur', { x: 230, y: 150, opacity: 0 })
      .call(() => setActive(null))
      .to('.cur', { opacity: 1, duration: 0.3 })
      .to('.cur', { x: 104, y: 36, duration: 0.9, ease: 'power2.inOut' })
      .to('.cur', { scale: 0.8, duration: 0.1 }).call(() => setActive(3))
      .to('.cur', { scale: 1, duration: 0.15 })
      .to('.cur', { x: 200, y: 112, duration: 0.8, ease: 'power2.inOut', delay: 0.3 })
      .to('.save', { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1 })
      .to('.cur', { opacity: 0, duration: 0.4, delay: 0.4 })
  })
  return (
    <div ref={ref} className="relative h-44 overflow-hidden rounded-card border border-line bg-ink-high p-4">
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d, i) => (
          <div key={i} className={`flex aspect-square items-center justify-center rounded-md text-xs font-bold transition-all duration-300 ${active === i ? 'scale-95 bg-flame text-white' : 'bg-ink text-dust'}`}>{d}</div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-[10px] text-dust">Aparelho livre</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink"><div className="fill-loop h-full w-full origin-left rounded-full bg-flame" /></div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-[11px] text-dust">06:00 • 50 min</span>
        <span className="save rounded-md bg-cream px-3 py-1.5 text-[11px] font-bold uppercase text-charcoal">Agendar</span>
      </div>
      <svg className="cur pointer-events-none absolute left-0 top-0" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 2l16 9-7 2-3 7z" fill="#FDF8EA" stroke="#15140c" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const move = e => {
    if (reduced() || !window.matchMedia('(pointer: fine)').matches) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(ref.current, { rotateY: x * 10, rotateX: -y * 10, transformPerspective: 900, duration: 0.4, ease: 'power2.out' })
    ref.current.style.setProperty('--mx', `${(x + 0.5) * 100}%`)
    ref.current.style.setProperty('--my', `${(y + 0.5) * 100}%`)
  }
  const leave = () => gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
  return <article ref={ref} onMouseMove={move} onMouseLeave={leave} className={`spot ${className}`}>{children}</article>
}

function Features() {
  const ref = useGsap(el => {
    gsap.from('.f-card', { y: 90, opacity: 0, rotate: 3, duration: 1, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: el.querySelector('.f-grid'), start: 'top 80%' } })
    gsap.from('.f-title .char', { yPercent: 110, duration: 0.8, ease: 'power3.out', stagger: 0.015, scrollTrigger: { trigger: el, start: 'top 75%' } })
    gsap.to('.f-db', { rotate: 360, ease: 'none', scrollTrigger: { trigger: el, scrub: 1 } })
  })
  const cards = [
    { k: '01', t: 'Professores que te conhecem pelo nome', d: 'Espaço menor de propósito: correção de postura, ajuste de carga e incentivo em cada repetição.', ui: <Shuffler /> },
    { k: '02', t: 'Evolução medida de perto', d: 'Avaliação física, treino individualizado e ajustes quinzenais. Você vê o progresso acontecer.', ui: <Typewriter /> },
    { k: '03', t: 'Zero fila, treino em 50 min', d: 'Pesos livres, puxadores, remadas e funcional com disponibilidade imediata.', ui: <Scheduler /> },
  ]
  return (
    <section id="studio" ref={ref} className="relative mx-auto max-w-7xl px-5 py-20 md:px-12 md:py-32">
      <Dumbbell className="f-db pointer-events-none absolute -right-10 top-10 hidden w-56 opacity-20 md:block" />
      <div className="mb-12 md:mb-16 md:max-w-3xl">
        <Eyebrow>Por que a Havoc Fit</Eyebrow>
        <h2 className="f-title font-display text-[2.6rem] uppercase leading-[1] tracking-wide text-cream md:text-7xl">
          <Split text="Formato studio." className="block" />
          <Split text="Resultado real." className="block text-flame" />
        </h2>
        <p className="rv mt-5 text-sand/75 md:text-lg">Nas redes você é só mais um número com uma ficha impressa. Aqui tem apoio humano e próximo, todo dia.</p>
      </div>
      <div className="f-grid grid gap-5 md:grid-cols-3">
        {cards.map(c => (
          <TiltCard key={c.k} className="f-card flex flex-col rounded-focal border border-line bg-ink-low p-5 transition-shadow duration-500 hover:shadow-[6px_6px_0_#D95D37] md:p-6">
            {c.ui}
            <span className="mt-7 font-mono text-xs text-flame">{c.k} /</span>
            <h3 className="mt-2 font-display text-2xl uppercase leading-tight tracking-wide text-cream">{c.t}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-dust">{c.d}</p>
          </TiltCard>
        ))}
      </div>
    </section>
  )
}

/* ================= BARRA SENDO CARREGADA (scrub, sem pin) ================= */
function LoadTheBar() {
  const ref = useGsap(el => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 40%', scrub: 1 } })
    tl.from('.lb-l', { x: -400, opacity: 0, stagger: 0.15, ease: 'power2.out' }, 0)
      .from('.lb-r', { x: 400, opacity: 0, stagger: 0.15, ease: 'power2.out' }, 0)
      .to('.lb-kg', { innerText: 140, snap: { innerText: 5 }, ease: 'none' }, 0)
      .to('.lb-rig', { y: -30, ease: 'power2.inOut' }, '>')
  })
  const plates = [['h-36 md:h-52', 'bg-flame'], ['h-28 md:h-40', 'bg-cream'], ['h-20 md:h-28', 'bg-ember']]
  return (
    <section ref={ref} className="relative overflow-hidden border-y border-line bg-ink-low py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 text-center md:px-12">
        <Eyebrow><span className="mx-auto">Sobrecarga progressiva</span></Eyebrow>
        <h2 className="rv font-display text-4xl uppercase tracking-wide text-cream md:text-6xl">Cada semana, <span className="text-flame">mais forte.</span></h2>
        <div className="lb-rig relative mx-auto mt-14 flex h-56 max-w-3xl items-center justify-center md:h-64">
          <div className="absolute h-3 w-full rounded-full bg-gradient-to-r from-dust/40 via-dust to-dust/40" />
          <div className="absolute left-[4%] flex items-center gap-1 md:left-[8%]">
            {[...plates].reverse().map(([h, c], i) => <div key={i} className={`lb-l w-4 rounded md:w-6 ${h} ${c}`} />)}
          </div>
          <div className="absolute right-[4%] flex items-center gap-1 md:right-[8%]">
            {plates.map(([h, c], i) => <div key={i} className={`lb-r w-4 rounded md:w-6 ${h} ${c}`} />)}
          </div>
          <div className="relative rounded-full border border-line bg-ink px-6 py-3">
            <span className="lb-kg font-display text-5xl tabular-nums text-cream md:text-6xl">20</span><span className="font-display text-2xl text-flame"> KG</span>
          </div>
        </div>
        <p className="rv mx-auto mt-8 max-w-md text-dust">Ajustes quinzenais de carga e exercícios, com o professor acompanhando cada progressão.</p>
      </div>
    </section>
  )
}

/* ================= MANIFESTO ================= */
function Manifesto() {
  const ref = useGsap(el => {
    gsap.to('.m-img', { yPercent: -15, ease: 'none', scrollTrigger: { trigger: el, scrub: true } })
    const words = el.querySelectorAll('.m-word')
    gsap.fromTo(words, { opacity: 0.15 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 70%', end: 'center 40%', scrub: true } })
    gsap.to('.m-kb', { rotate: 18, transformOrigin: '50% 0%', duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' })
  })
  const quote = 'O espaço menor e intimista é a nossa maior vantagem. Atenção de verdade, treino de verdade, resultado de verdade.'
  return (
    <section ref={ref} className="relative overflow-hidden bg-charcoal py-24 md:py-40">
      <img src={IMG.studio} alt="" aria-hidden="true" loading="lazy" className="m-img absolute inset-0 h-[130%] w-full object-cover opacity-20" width="1400" height="933" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/70 to-charcoal" />
      <Kettlebell className="m-kb absolute -top-4 right-6 w-20 md:right-20 md:w-32" />
      <div className="relative mx-auto max-w-5xl px-5 md:px-12">
        <Eyebrow>Compromisso Havoc Fit</Eyebrow>
        <blockquote className="font-display text-[2rem] uppercase leading-[1.1] tracking-wide text-cream md:text-6xl">
          {quote.split(' ').map((w, i) => <span key={i} className={`m-word ${/verdade|vantagem/.test(w) ? 'text-flame' : ''}`}>{w} </span>)}
        </blockquote>
        <p className="rv mt-8 text-sm font-semibold text-dust">— Equipe Havoc Fit Studio, Americanópolis</p>
      </div>
    </section>
  )
}

/* ================= GALERIA (rolagem horizontal por scrub, sem pin) ================= */
function Gallery() {
  const ref = useGsap(el => {
    gsap.fromTo('.g-track', { xPercent: 5 }, { xPercent: -35, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 } })
    gsap.utils.toArray('.g-item').forEach(g => {
      gsap.fromTo(g, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 75%' } })
      gsap.fromTo(g.querySelector('img'), { scale: 1.4 }, { scale: 1, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 75%' } })
    })
  })
  const tags = ['Força', 'Halteres', 'Funcional', 'Hipertrofia']
  return (
    <section id="galeria" ref={ref} className="overflow-hidden py-20 md:py-32">
      <div className="mx-auto mb-10 max-w-7xl px-5 md:px-12">
        <Eyebrow>Dentro do studio</Eyebrow>
        <h2 className="rv font-display text-4xl uppercase tracking-wide text-cream md:text-6xl">Sinta a <span className="text-flame">energia.</span></h2>
      </div>
      <div className="g-track flex w-max gap-4 pl-5 md:gap-6 md:pl-12">
        {IMG.gallery.map(([src, alt], i) => (
          <figure key={src} className={`g-item group relative overflow-hidden rounded-focal ${i % 2 ? 'mt-12 h-72 w-60 md:h-[26rem] md:w-80' : 'h-80 w-64 md:h-[30rem] md:w-96'}`}>
            <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0" width="900" height="1200" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-flame px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">{tags[i]}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/* ================= COMO COMEÇAR ================= */
function Steps() {
  const ref = useGsap(el => {
    gsap.fromTo('.s-line', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: el.querySelector('ol'), start: 'top 70%', end: 'bottom 60%', scrub: true } })
    gsap.utils.toArray('.s-item').forEach(it => {
      gsap.from(it, { x: 40, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: it, start: 'top 82%' } })
      gsap.from(it.querySelector('.s-dot'), { scale: 0, duration: 0.6, ease: 'back.out(3)', scrollTrigger: { trigger: it, start: 'top 75%' } })
    })
  })
  const steps = [
    ['Chame no WhatsApp', 'Conte seu objetivo: emagrecer, ganhar massa ou cuidar da postura.', 'Aquecimento'],
    ['Aula experimental grátis', 'Conheça a sala de pesos, os professores e a energia do studio.', 'Série 1'],
    ['Avaliação física', 'Medições completas e um treino individualizado montado para você.', 'Série 2'],
    ['Evolua com suporte', 'Ajustes de carga e exercícios, com professor por perto no salão.', 'Série 3'],
  ]
  return (
    <section ref={ref} className="mx-auto max-w-7xl px-5 py-20 md:px-12 md:py-32">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:sticky md:top-32 md:col-span-5 md:self-start">
          <Eyebrow>Como começar</Eyebrow>
          <h2 className="rv font-display text-4xl uppercase leading-[1] tracking-wide text-cream md:text-6xl">Sua primeira <span className="text-flame">série</span> começa aqui</h2>
          <Btn href={WA} className="rv mt-8 hidden md:inline-flex">Quero começar <Arrow /></Btn>
        </div>
        <ol className="relative md:col-span-7">
          <span className="s-line absolute bottom-4 left-[11px] top-4 w-0.5 origin-top bg-flame" aria-hidden="true" />
          {steps.map(([t, d, tag], i) => (
            <li key={t} className="s-item relative pb-12 pl-12 last:pb-0">
              <span className="s-dot absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-flame bg-ink"><span className="h-2 w-2 rounded-full bg-flame" /></span>
              <span className="font-mono text-[11px] uppercase tracking-[.2em] text-dust">0{i + 1} • {tag}</span>
              <h3 className="mt-1 font-display text-3xl uppercase tracking-wide text-cream">{t}</h3>
              <p className="mt-2 text-dust">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ================= PLANOS ================= */
function Plans() {
  const ref = useGsap(el => {
    gsap.from('.p-card', { y: 100, opacity: 0, rotateX: -25, transformPerspective: 1000, duration: 1.1, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: el.querySelector('.p-grid'), start: 'top 80%' } })
    gsap.from('.p-check', { scale: 0, duration: 0.4, ease: 'back.out(3)', stagger: 0.04, scrollTrigger: { trigger: el.querySelector('.p-grid'), start: 'top 60%' } })
  })
  const plans = [
    { tag: 'Sem fidelidade', name: 'Mensal Studio', pre: 'A partir de', price: '119', per: '/mês', desc: 'Para experimentar a dinâmica do studio sem compromisso longo.', items: ['Musculação e pesos livres', 'Orientação contínua no salão', 'Sem taxa de cancelamento', 'Avaliação física periódica'], cta: 'Contratar mensal' },
    { tag: 'Melhor custo-benefício', name: 'Trimestral Studio', pre: 'Apenas', price: '89', per: '/mês equiv.', desc: 'O tempo certo para consolidar hábitos, secar e ganhar massa.', items: ['Parcelado sem travar limite', 'Treino individualizado', 'Avaliação física completa', 'Ajustes quinzenais de carga', 'Suporte via WhatsApp'], cta: 'Garantir esta condição', hot: true },
    { tag: 'Vagas limitadas', name: 'Personal Studio', price: null, desc: 'Acompanhamento exclusivo 1 a 1 para metas desafiadoras.', items: ['Pacotes mensais e bissemanais', 'Professor 100% da sessão', 'Hipertrofia, emagrecimento ou reabilitação', 'Agendamento prioritário'], cta: 'Consultar disponibilidade' },
  ]
  return (
    <section id="planos" ref={ref} className="relative overflow-hidden bg-ink-low py-20 md:py-32">
      <Plate className="spin-slow pointer-events-none absolute -left-32 top-10 w-80 opacity-10" label="25" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-12">
        <div className="mb-14 md:text-center">
          <Eyebrow><span className="md:mx-auto">Transparência e valor real</span></Eyebrow>
          <h2 className="rv font-display text-4xl uppercase tracking-wide text-cream md:text-7xl">Escolha sua <span className="text-flame">carga.</span></h2>
          <p className="rv mt-4 text-dust md:mx-auto md:max-w-xl">Sem taxas ocultas, sem pegadinhas.</p>
        </div>
        <div className="p-grid grid items-stretch gap-6 md:grid-cols-3">
          {plans.map(p => (
            <TiltCard key={p.name} className={`p-card relative flex flex-col rounded-focal p-7 md:p-8 ${p.hot ? 'order-first bg-flame text-white shadow-[6px_6px_0_#FDF8EA] md:order-none md:-translate-y-4' : 'border border-line bg-ink text-sand'}`}>
              {p.hot && <span className="shine absolute -top-3 left-7 overflow-hidden rounded-full bg-cream px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-charcoal">★ Mais recomendado</span>}
              <span className={`text-[11px] font-bold uppercase tracking-[.15em] ${p.hot ? 'text-white/80' : 'text-ember'}`}>{p.tag}</span>
              <h3 className="mt-2 font-display text-3xl uppercase tracking-wide">{p.name}</h3>
              <p className={`mt-2 text-sm ${p.hot ? 'text-white/85' : 'text-dust'}`}>{p.desc}</p>
              <div className="mt-6 flex items-end gap-1">
                {p.price ? (<>
                  <span className="text-sm opacity-80">{p.pre} R$</span>
                  <span className="font-display text-6xl leading-none">{p.price}</span>
                  <span className="mb-1 text-sm opacity-80">{p.per}</span>
                </>) : <span className="font-display text-4xl uppercase">Sob consulta</span>}
              </div>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {p.items.map(i => <li key={i} className="flex gap-2.5"><span className={`p-check inline-block ${p.hot ? 'text-charcoal' : 'text-flame'}`}>✓</span>{i}</li>)}
              </ul>
              <a href={WA} target="_blank" rel="noreferrer" className={`btn mt-8 w-full ${p.hot ? 'bg-charcoal text-white' : 'btn-ghost'}`}>
                <span className="slide" aria-hidden="true" style={p.hot ? { background: '#15140c' } : undefined} />{p.cta}
              </a>
            </TiltCard>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-dust">*Valores e promoções sujeitos a alteração. Pagamento via PIX, cartões e boleto.</p>
      </div>
    </section>
  )
}

/* ================= AVALIAÇÕES ================= */
function Reviews() {
  const ref = useGsap(el => {
    gsap.from('.r-card', { y: 80, opacity: 0, rotate: i => (i - 1) * 4, duration: 1, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: el.querySelector('.r-grid'), start: 'top 80%' } })
    gsap.from('.star', { scale: 0, rotate: -180, duration: 0.6, ease: 'back.out(2.5)', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 75%' } })
  })
  const reviews = [
    { n: 'Amanda', q: 'Ambiente top, equipamentos de qualidade e atendimento excelente! Me sinto motivada a treinar todos os dias 💪🔥' },
    { n: 'Camila Aparecida', q: 'Um ótimo ambiente pra se treinar, professores super simpáticos e atenciosos! A gente não fica perdida no treino.' },
    { n: 'Emerson', q: 'Academia compacta com atmosfera agradável e sem confusão de grandes redes. Professor sempre de olho na postura.' },
  ]
  return (
    <section id="avaliacoes" ref={ref} className="mx-auto max-w-7xl px-5 py-20 md:px-12 md:py-32">
      <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <Eyebrow>Avaliações reais no Google</Eyebrow>
          <h2 className="rv font-display text-4xl uppercase tracking-wide text-cream md:text-6xl">Quem treina aqui, <span className="text-flame">recomenda</span></h2>
        </div>
        <div className="flex w-fit items-center gap-4 rounded-card border border-line bg-ink-low px-6 py-4 shadow-[4px_4px_0_#D95D37]">
          <span className="font-display text-5xl text-cream">4.7</span>
          <div>
            <div className="flex gap-0.5 text-lg text-flame" aria-label="4.7 de 5 estrelas">{[0, 1, 2, 3, 4].map(i => <span key={i} className="star inline-block">★</span>)}</div>
            <p className="text-xs text-dust">+84 opiniões no Google</p>
          </div>
        </div>
      </div>
      <div className="r-grid grid gap-5 md:grid-cols-3">
        {reviews.map(r => (
          <figure key={r.n} className="r-card flex flex-col rounded-focal border border-line bg-ink-low p-7 transition-transform duration-500 hover:-translate-y-2">
            <span className="font-display text-7xl leading-none text-flame" aria-hidden="true">“</span>
            <blockquote className="flex-1 text-[15px] leading-relaxed text-sand">{r.q}</blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-flame font-bold text-white">{r.n.split(' ').map(w => w[0]).join('')}</span>
              <span><span className="block font-bold text-cream">{r.n}</span><span className="text-xs text-dust">Aluno(a) • Google Review</span></span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/* ================= CONTATO ================= */
function Contact() {
  const ref = useGsap(el => {
    gsap.from('.c-info', { x: -40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 70%' } })
    gsap.from('.c-map', { clipPath: 'inset(0 0 0 100% round 24px)', duration: 1.4, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 70%' } })
  })
  const info = [
    ['Endereço', ADDRESS],
    ['Horário', 'Segunda a sexta a partir das 06:00. Sábados e feriados: consulte horários especiais.'],
    ['WhatsApp', '(11) 95884-3199'],
  ]
  return (
    <section id="contato" ref={ref} className="bg-ink-low py-20 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-12 md:px-12">
        <div className="md:col-span-5">
          <Eyebrow>Localização</Eyebrow>
          <h2 className="rv font-display text-4xl uppercase leading-[1] tracking-wide text-cream md:text-6xl">Fácil de chegar, <span className="text-flame">impossível de largar</span></h2>
          <dl className="mt-10 space-y-6">
            {info.map(([k, v]) => (
              <div key={k} className="c-info border-l-2 border-flame pl-5">
                <dt className="text-[11px] font-bold uppercase tracking-[.18em] text-dust">{k}</dt>
                <dd className="mt-1 text-cream">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Btn href={WA}>Falar no WhatsApp <Arrow /></Btn>
            <Btn href={MAPS} variant="ghost">Abrir no Maps</Btn>
          </div>
        </div>
        <div className="c-map min-h-[340px] overflow-hidden rounded-focal border border-line md:col-span-7">
          <iframe title="Mapa da Havoc Fit" src={'https://www.google.com/maps?q=' + encodeURIComponent(ADDRESS) + '&output=embed'}
            className="h-full min-h-[340px] w-full grayscale-[.6] invert-[.9] hue-rotate-180" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </section>
  )
}

/* ================= CTA FINAL + FOOTER ================= */
function Footer() {
  const ref = useGsap(el => {
    gsap.from('.ft .char', { yPercent: 110, duration: 0.9, ease: 'power3.out', stagger: 0.02, scrollTrigger: { trigger: el, start: 'top 75%' } })
    gsap.to('.ft-db', { y: -30, rotate: -12, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    gsap.from('.ft-big', { yPercent: 60, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: true } })
  })
  return (
    <footer ref={ref} className="relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-24 text-center md:px-12 md:pt-36">
        <Dumbbell className="ft-db mx-auto mb-8 w-28 md:w-40" />
        <h2 className="ft mx-auto max-w-4xl font-display text-5xl uppercase leading-[.95] tracking-wide text-cream md:text-8xl">
          <Split text="Primeiro treino" className="block" />
          <Split text="por nossa conta." className="block text-flame" />
        </h2>
        <p className="rv mx-auto mt-6 max-w-md text-dust">Venha conhecer a sala de pesos e sentir a energia de um studio pensado para a sua evolução.</p>
        <Btn href={WA} className="mt-10 w-full sm:w-auto">Agendar aula experimental <Arrow /></Btn>
      </div>
      <p className="ft-big pointer-events-none select-none text-center font-display text-[26vw] leading-[.8] text-cream/[.04]" aria-hidden="true">HAVOC</p>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 text-sm text-dust md:flex-row md:items-center md:justify-between md:px-12">
          <span className="font-display text-2xl tracking-wider text-cream">HAVOC<span className="text-flame">FIT</span></span>
          <ul className="flex flex-wrap gap-6">
            {[['#studio', 'Studio'], ['#planos', 'Planos'], ['#avaliacoes', 'Avaliações'], ['#contato', 'Localização']].map(([h, l]) => <li key={h}><a className="lift inline-block" href={h}>{l}</a></li>)}
          </ul>
          <p className="text-xs">© {new Date().getFullYear()} Havoc Fit Studio • São Paulo</p>
        </div>
      </div>
    </footer>
  )
}

/* ================= WHATSAPP FLUTUANTE (mobile) ================= */
function FloatWA() {
  return (
    <a href={WA} target="_blank" rel="noreferrer" aria-label="Chamar no WhatsApp"
      className="float-wa fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-flame text-white shadow-[0_10px_30px_rgba(217,93,55,.5)] md:hidden">
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4.1-4.9-4.3-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z" /></svg>
    </a>
  )
}

/* ================= APP ================= */
export default function App() {
  const [ready, setReady] = useState(false)
  const root = useRef(null)
  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      if (reduced()) return
      gsap.utils.toArray('.rv').forEach(el => gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }))
      ScrollTrigger.refresh()
    }, root)
    return () => ctx.revert()
  }, [ready])
  return (
    <div ref={root} className="grain">
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <ScrollBar />
      <Cursor />
      <a href="#studio" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded focus:bg-flame focus:px-4 focus:py-2 focus:text-white">Pular para o conteúdo</a>
      <Navbar />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Stats />
        <Features />
        <LoadTheBar />
        <Manifesto />
        <Gallery />
        <Steps />
        <Plans />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <FloatWA />
    </div>
  )
}
