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
  gallery: [
    [u('1574680096145-d05b474e2155', 1200), 'Aluna fazendo agachamento com barra'],
    [u('1611672585731-fa10603fb9e0', 900), 'Rosca com halter'],
    [u('1605296867304-46d5465a13f1', 900), 'Preparação para o levantamento terra'],
    [u('1532029837206-abbe2b7620e3', 1200), 'Treino de costas com barra'],
  ],
  // faixa de miniaturas: todas diferentes da grade
  strip: [
    '1534367507873-d2d7e24c797f', '1549060279-7e168fcee0c2', '1517838277536-f5f99be501cd',
    '1544033527-b192daee1f5b', '1550345332-09e3ac987658', '1597452485669-2c7bb5fef90d',
    '1526506118085-60ce8714f8c5', '1576678927484-cc907957088c', '1558611848-73f7eb4001a1',
    '1590487988256-9ed24133863e',
  ].map(id => u(id, 500)),
}

// Animações sempre ativas (pedido do cliente), mesmo com "reduzir movimento" ligado no sistema
const reduced = () => false
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

// Gera um traçado de ECG (onda P, complexo QRS, onda T) com variações por semente
function ekgPath({ w = 600, h = 80, beats = 2, seed = 1, amp = 1 }) {
  let s = seed * 9301 + 49297
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  const mid = h / 2, gap = w / beats
  const k = h / 80 // escala dos detalhes para traçados pequenos
  let d = `M0 ${mid}`
  for (let i = 0; i < beats; i++) {
    const x = i * gap + gap * (0.25 + r() * 0.3)
    const a = (0.55 + r() * 0.45) * amp * (h * 0.45)
    const pw = (8 + r() * 10) * k, ph = (3 + r() * 5) * k
    const tw = (14 + r() * 16) * k, th = (5 + r() * 9) * k
    const q = (3 + r() * 5) * k, sDip = a * (0.35 + r() * 0.5)
    // onda P
    d += ` L${x - pw * 2.2} ${mid} Q${x - pw * 1.6} ${mid - ph * 2} ${x - pw} ${mid}`
    // complexo QRS
    d += ` L${x - 3 * k} ${mid} L${x} ${mid + q} L${x + 5 * k} ${mid - a} L${x + 11 * k} ${mid + sDip} L${x + 16 * k} ${mid}`
    // onda T
    d += ` L${x + 24 * k} ${mid} Q${x + 24 * k + tw / 2} ${mid - th * 2} ${x + 24 * k + tw} ${mid}`
  }
  return d + ` L${w} ${mid}`
}

// BPM que oscila sozinho em torno de um valor base
function useLiveBpm(base, spread = 6, every = 1100) {
  const [bpm, setBpm] = useState(base)
  useEffect(() => {
    const id = setInterval(() => setBpm(Math.round(base + (Math.random() * 2 - 1) * spread)), every + Math.random() * 600)
    return () => clearInterval(id)
  }, [base, spread, every])
  return bpm
}

const EKG = ekgPath({ w: 600, h: 80, beats: 2, seed: 7, amp: 1.1 })

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

// Mini batimento: substitui os tracinhos decorativos
let miniSeed = 0
function MiniPulse({ className = 'w-10' }) {
  const [v] = useState(() => {
    const seed = ++miniSeed * 13
    return { d: ekgPath({ w: 40, h: 16, beats: 1 + (seed % 2), seed, amp: 0.9 }), dur: 1 + ((seed * 7) % 9) / 10, delay: -((seed * 3) % 10) / 10 }
  })
  const MINI = v.d
  return (
    <svg viewBox="0 0 40 16" className={`h-4 shrink-0 overflow-visible ${className}`} aria-hidden="true">
      <path d={MINI} fill="none" stroke="#D95D37" strokeOpacity=".25" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={MINI} pathLength="1" className="mini-ekg" style={{ animationDuration: `${v.dur}s`, animationDelay: `${v.delay}s` }} fill="none" stroke="#FFB59F" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function Eyebrow({ children, className = '' }) {
  return <p className={`rv mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.22em] text-flame ${className}`}><MiniPulse />{children}</p>
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
  const links = [['#studio', 'O Studio'], ['#quiz', 'Quiz'], ['#planos', 'Planos'], ['#avaliacoes', 'Avaliações'], ['#contato', 'Como chegar']]

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
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-24 bg-gradient-to-b from-ink via-ink/80 to-transparent md:h-28" aria-hidden="true" />
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
      gsap.to('.h-img', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('.h-content', { opacity: 0, y: 60, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: '45% top', scrub: true } })
    }, ref)
    const id = setInterval(() => setBpm(b => Math.min(168, Math.max(118, b + Math.round(Math.random() * 14 - 5)))), 900)
    return () => { ctx.revert(); clearInterval(id) }
  }, [ready])

  return (
    <section id="top" ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <img src={IMG.hero} alt="Aluno treinando com pesos livres no studio Havoc Fit" className="h-img absolute inset-0 h-full w-full object-cover" width="2000" height="1333" fetchPriority="high" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 to-transparent" />


      <div className="h-content relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-10 pt-32 md:px-12 md:pb-16 md:pt-40">
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

/* ================= BPM: componentes reutilizáveis ================= */
function Heart({ className = '', speed = 1.1 }) {
  return (
    <svg viewBox="0 0 24 24" className={`beat fill-flame ${className}`} style={{ animationDuration: `${speed}s` }} aria-hidden="true">
      <path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z" />
    </svg>
  )
}

// Linha de ECG em largura total, usada como divisor entre seções
function EkgDivider({ label = 'Frequência', bpm: base = 128, speed = 2.2, seed = 1, beats = 3 }) {
  const d = ekgPath({ w: 1200, h: 60, beats, seed })
  const bpm = useLiveBpm(base, 5)
  return (
    <div className="relative mx-auto flex max-w-7xl items-center gap-4 px-5 md:px-12" aria-hidden="true">
      <div className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-ink-low px-3 py-1.5">
        <Heart className="h-3.5 w-3.5" speed={60 / bpm} />
        <span className="font-mono text-[11px] tabular-nums text-cream">{bpm}</span>
        <span className="hidden font-mono text-[10px] uppercase tracking-widest text-dust sm:inline">{label}</span>
      </div>
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="h-10 w-full">
        <path d={d} fill="none" stroke="#D95D37" strokeOpacity=".15" strokeWidth="2" />
        <path d={d} pathLength="1" className="ekg-trail" style={{ animationDuration: `${speed}s` }} fill="none" stroke="#D95D37" strokeOpacity=".45" strokeWidth="2.5" strokeLinecap="round" />
        <path d={d} pathLength="1" className="ekg-head" style={{ animationDuration: `${speed}s` }} fill="none" stroke="#FFB59F" strokeWidth="3" strokeLinecap="round" filter="url(#ekg-glow)" />
      </svg>
    </div>
  )
}

/* ================= FEATURE WIDGETS (micro-UIs de academia) ================= */

// 01 — Análise de execução: circuito de exercícios em loop, ângulo da articulação e contador de reps
// Pontos: a=tornozelo k=joelho h=quadril s=ombro e=cotovelo w=mão (viewBox 120x150, chão em y=138)
const STAND_LEGS = { a: [60, 136], k: [61, 105], h: [60, 74] }
const EXERCISES = [
  {
    name: 'Agachamento', joint: 'Joelho', angle: ['h', 'k', 'a'], gear: 'bar', guide: 104, ok: '✓ Profundidade ok',
    from: { ...STAND_LEGS, h: [58, 74], k: [62, 104], s: [62, 38], e: [46, 46], w: [62, 38] },
    to: { a: [60, 136], k: [84, 106], h: [48, 104], s: [66, 70], e: [50, 78], w: [66, 70] },
  },
  {
    name: 'Supino', joint: 'Cotovelo', angle: ['s', 'e', 'w'], gear: 'bar', bench: true, guide: 84, ok: '✓ Barra no peito',
    from: { a: [100, 136], k: [98, 101], h: [78, 99], s: [40, 98], e: [40, 76], w: [40, 52] },
    to: { a: [100, 136], k: [98, 101], h: [78, 99], s: [40, 98], e: [54, 108], w: [42, 84] },
  },
  {
    name: 'Terra', joint: 'Quadril', angle: ['s', 'h', 'k'], gear: 'bar', ok: '✓ Quadril travado',
    from: { a: [60, 136], k: [70, 112], h: [40, 92], s: [72, 68], e: [70, 90], w: [68, 110] },
    to: { a: [60, 136], k: [62, 106], h: [58, 76], s: [62, 40], e: [62, 58], w: [62, 76] },
  },
  {
    name: 'Rosca direta', joint: 'Cotovelo', angle: ['s', 'e', 'w'], gear: 'db', ok: '✓ Contração máxima',
    from: { ...STAND_LEGS, s: [60, 40], e: [62, 66], w: [62, 92] },
    to: { ...STAND_LEGS, s: [60, 40], e: [62, 66], w: [50, 43] },
  },
  {
    name: 'Desenvolvimento', joint: 'Cotovelo', angle: ['s', 'e', 'w'], gear: 'bar', ok: '✓ Braço estendido',
    from: { ...STAND_LEGS, s: [60, 40], e: [72, 52], w: [62, 32] },
    to: { ...STAND_LEGS, s: [60, 40], e: [62, 22], w: [62, 4] },
  },
]
const REPS = 3

function PostureCheck() {
  const ref = useRef(null)
  const [ex, setEx] = useState(0)
  const [reps, setReps] = useState(0)
  const [ok, setOk] = useState(false)
  const cur = EXERCISES[ex]

  useEffect(() => {
    const el = ref.current
    const q = s => el.querySelector(s)
    const ctx = gsap.context(() => {
      const E = EXERCISES[ex]
      const flat = pose => Object.fromEntries(Object.entries(pose).flatMap(([k, [x, y]]) => [[k + 'x', x], [k + 'y', y]]))
      const p = flat(E.from)
      const P = k => [p[k + 'x'], p[k + 'y']]
      const ang = (A, B, C) => {
        const a1 = Math.atan2(A[1] - B[1], A[0] - B[0]), a2 = Math.atan2(C[1] - B[1], C[0] - B[0])
        const d = Math.abs((a1 - a2) * 180 / Math.PI); return Math.round(d > 180 ? 360 - d : d)
      }
      const line = (sel, A, B) => q(sel).setAttribute('d', `M${A[0]} ${A[1]} L${B[0]} ${B[1]}`)
      const draw = () => {
        const a = P('a'), k = P('k'), h = P('h'), s = P('s'), e = P('e'), w = P('w')
        line('.shin', a, k); line('.thigh', k, h); line('.torso', h, s); line('.upper', s, e); line('.fore', e, w)
        const dx = s[0] - h[0], dy = s[1] - h[1], len = Math.hypot(dx, dy) || 1
        q('.head').setAttribute('cx', s[0] + dx / len * 13); q('.head').setAttribute('cy', s[1] + dy / len * 13)
        q('.gear').setAttribute('transform', `translate(${w[0]} ${w[1]})`)
        const j = P(E.angle[1])
        q('.joint').setAttribute('cx', j[0]); q('.joint').setAttribute('cy', j[1])
        q('.deg').textContent = ang(P(E.angle[0]), j, P(E.angle[2])) + '°'
      }
      draw()
      setReps(0); setOk(false)
      const tl = gsap.timeline({ onUpdate: draw, onComplete: () => setEx(i => (i + 1) % EXERCISES.length) })
      tl.fromTo('.fig', { opacity: 0, scale: 0.9, transformOrigin: '50% 100%' }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' })
      for (let r = 0; r < REPS; r++) {
        tl.to(p, { ...flat(E.to), duration: 1, ease: 'power2.inOut' })
          .call(() => setOk(true))
          .to(p, { ...flat(E.from), duration: 0.85, ease: 'power2.out', delay: 0.25 })
          .call(() => { setOk(false); setReps(r + 1) })
      }
      tl.to('.fig', { opacity: 0, scale: 0.9, duration: 0.35, ease: 'power2.in', delay: 0.4 })
    }, ref)
    return () => ctx.revert()
  }, [ex])

  return (
    <div ref={ref} className="relative flex h-48 overflow-hidden rounded-card border border-line bg-ink p-3">
      <svg viewBox="0 0 120 150" className="h-full w-auto shrink-0 overflow-visible">
        <line x1="20" y1="138" x2="100" y2="138" stroke="#3a372d" strokeWidth="3" strokeLinecap="round" />
        <g className="fig">
          {cur.guide && <line x1="6" y1={cur.guide} x2="114" y2={cur.guide} stroke="#D95D37" strokeDasharray="3 4" strokeOpacity=".5" />}
          {cur.bench && (
            <g fill="#3a372d"><rect x="18" y="103" width="78" height="6" rx="2" /><rect x="26" y="109" width="4" height="29" /><rect x="84" y="109" width="4" height="29" /></g>
          )}
          <g stroke="#FDF8EA" strokeWidth="5" strokeLinecap="round" fill="none">
            <path className="shin" /><path className="thigh" /><path className="torso" />
          </g>
          <circle className="head" r="8" fill="#FDF8EA" />
          <g className="gear">
            {cur.gear === 'bar' ? (
              <>
                <line x1="-38" y1="0" x2="38" y2="0" stroke="#a79f93" strokeWidth="3" strokeLinecap="round" />
                <rect x="-40" y="-10" width="6" height="20" rx="1.5" fill="#D95D37" /><rect x="34" y="-10" width="6" height="20" rx="1.5" fill="#D95D37" />
              </>
            ) : (
              <>
                <line x1="-9" y1="0" x2="9" y2="0" stroke="#a79f93" strokeWidth="3" strokeLinecap="round" />
                <rect x="-12" y="-6" width="5" height="12" rx="1.5" fill="#D95D37" /><rect x="7" y="-6" width="5" height="12" rx="1.5" fill="#D95D37" />
              </>
            )}
          </g>
          <g stroke="#FDF8EA" strokeWidth="4.5" strokeLinecap="round" fill="none">
            <path className="upper" /><path className="fore" />
          </g>
          <circle className="joint" r="4" fill="#D95D37" />
        </g>
      </svg>
      <div className="flex min-w-0 flex-1 flex-col justify-between pl-2 font-mono text-[11px]">
        <div>
          <p key={cur.name} className="ex-name truncate uppercase tracking-widest text-dust">{cur.name}</p>
          <p className="mt-2 text-dust">{cur.joint}</p>
          <p className="deg font-display text-3xl text-cream">180°</p>
        </div>
        <div>
          <p className="text-dust">Reps</p>
          <p className="font-display text-3xl tabular-nums text-flame">{String(reps).padStart(2, '0')}<span className="text-base text-dust">/{String(REPS).padStart(2, '0')}</span></p>
        </div>
        <span className={`w-fit max-w-full truncate rounded-full px-2 py-1 text-[10px] font-bold uppercase transition-[background-color,color] duration-300 ${ok ? 'bg-flame text-white' : 'bg-ink-high text-dust'}`}>
          {ok ? cur.ok : 'Executando…'}
        </span>
      </div>
      {/* indicador do circuito */}
      <div className="absolute bottom-3 left-3 flex gap-1" aria-hidden="true">
        {EXERCISES.map((_, i) => <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i === ex ? 'w-4 bg-flame' : 'w-1.5 bg-ink-high'}`} />)}
      </div>
    </div>
  )
}


// 02 — Gráfico de evolução de carga, desenhando em loop
function LoadChart() {
  const weeks = [40, 45, 47.5, 50, 55, 57.5, 60, 65]
  const X = i => 14 + i * 38, Y = v => 110 - (v - 35) * 3
  const d = weeks.map((v, i) => `${i ? 'L' : 'M'}${X(i)} ${Y(v)}`).join(' ')
  const [kg, setKg] = useState(40)
  const ref = useGsap(el => {
    const o = { t: 0 }
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tl.set('.lc-line', { strokeDashoffset: 1 }).set('.lc-area', { opacity: 0 }).set('.lc-dot', { scale: 0, transformOrigin: 'center' })
      .to('.lc-line', { strokeDashoffset: 0, duration: 2.2, ease: 'power1.inOut' })
      .to(o, { t: weeks.length - 1, duration: 2.2, ease: 'power1.inOut', onUpdate: () => setKg(weeks[Math.round(o.t)]) }, '<')
      .to('.lc-dot', { scale: 1, duration: 0.25, stagger: 0.27, ease: 'back.out(3)' }, '<')
      .to('.lc-area', { opacity: 1, duration: 0.6 }, '-=.3')
      .to('.lc-badge', { scale: 1.12, duration: 0.18, yoyo: true, repeat: 3 })
  })
  return (
    <div ref={ref} className="h-48 rounded-card border border-line bg-ink p-3">
      <div className="flex items-start justify-between font-mono text-[11px]">
        <div><p className="uppercase tracking-widest text-dust">Supino • 8 semanas</p><p className="font-display text-3xl text-cream">{kg}<span className="text-base text-dust"> kg</span></p></div>
        <span className="lc-badge rounded-full bg-flame px-2 py-1 text-[10px] font-bold text-white">+62%</span>
      </div>
      <svg viewBox="0 0 290 118" className="mt-1 h-[6.5rem] w-full">
        {[30, 60, 90].map(y => <line key={y} x1="0" x2="290" y1={y} y2={y} stroke="#3a372d" strokeDasharray="2 5" />)}
        <path className="lc-area" d={`${d} L${X(7)} 118 L${X(0)} 118Z`} fill="url(#lc-g)" />
        <defs><linearGradient id="lc-g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#D95D37" stopOpacity=".35" /><stop offset="1" stopColor="#D95D37" stopOpacity="0" /></linearGradient></defs>
        <path className="lc-line" d={d} pathLength="1" strokeDasharray="1" fill="none" stroke="#D95D37" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {weeks.map((v, i) => <circle key={i} className="lc-dot" cx={X(i)} cy={Y(v)} r="3.5" fill="#FDF8EA" />)}
      </svg>
    </div>
  )
}

// 03 — Painel de aparelhos livres + cronômetro de sessão
function EquipBoard() {
  const gear = ['Supino', 'Leg press', 'Puxador', 'Halteres']
  const [busy, setBusy] = useState(-1)
  const [sec, setSec] = useState(50 * 60)
  useEffect(() => {
    let i = 0
    const a = setInterval(() => { setBusy(i % gear.length); setTimeout(() => setBusy(-1), 1100); i++ }, 1800)
    const b = setInterval(() => setSec(s => (s <= 0 ? 50 * 60 : s - 7)), 100)
    return () => { clearInterval(a); clearInterval(b) }
  }, [])
  const pct = sec / 3000
  return (
    <div className="flex h-48 gap-3 rounded-card border border-line bg-ink p-3">
      <ul className="flex flex-1 flex-col justify-between font-mono text-[11px]">
        {gear.map((g, i) => (
          <li key={g} className={`flex items-center justify-between rounded-md px-2 py-1.5 transition-colors duration-300 ${busy === i ? 'bg-ink-high' : ''}`}>
            <span className="text-sand">{g}</span>
            <span className={`flex items-center gap-1.5 font-bold ${busy === i ? 'text-dust' : 'text-flame'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${busy === i ? 'bg-dust' : 'pulse bg-flame'}`} />{busy === i ? 'LIBERANDO' : 'LIVRE'}
            </span>
          </li>
        ))}
      </ul>
      <div className="relative flex w-24 shrink-0 flex-col items-center justify-center">
        <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#3a372d" strokeWidth="7" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#D95D37" strokeWidth="7" strokeLinecap="round" strokeDasharray={264} strokeDashoffset={264 * (1 - pct)} />
        </svg>
        <span className="absolute top-[2.1rem] font-display text-xl tabular-nums text-cream">{String(Math.floor(sec / 60)).padStart(2, '0')}:{String(sec % 60).padStart(2, '0')}</span>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-dust">Sessão</span>
      </div>
    </div>
  )
}

function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const move = e => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(ref.current, { rotateY: x * 8, rotateX: -y * 8, transformPerspective: 900, duration: 0.4, ease: 'power2.out' })
    ref.current.style.setProperty('--mx', `${(x + 0.5) * 100}%`)
    ref.current.style.setProperty('--my', `${(y + 0.5) * 100}%`)
  }
  const leave = () => gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
  return <article ref={ref} onMouseMove={move} onMouseLeave={leave} className={`spot ${className}`}>{children}</article>
}

function Features() {
  const ref = useGsap(el => {
    gsap.from('.f-card', { y: 90, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: el.querySelector('.f-grid'), start: 'top 85%' } })
    gsap.from('.f-title .char', { yPercent: 110, duration: 0.8, ease: 'power3.out', stagger: 0.015, scrollTrigger: { trigger: el, start: 'top 75%' } })
    gsap.to('.f-db', { rotate: 360, ease: 'none', scrollTrigger: { trigger: el, scrub: 1 } })
  })
  const cards = [
    { k: '01', tag: 'Postura', t: 'Professor de olho em cada rep', d: 'Espaço menor de propósito: correção de postura, profundidade e ajuste de carga para você treinar sem lesão.', ui: <PostureCheck /> },
    { k: '02', tag: 'Evolução', t: 'Sua carga subindo, semana a semana', d: 'Avaliação física, treino individualizado e ajustes quinzenais. Você vê o progresso nos números.', ui: <LoadChart /> },
    { k: '03', tag: 'Tempo', t: 'Zero fila, treino em 50 min', d: 'Pesos livres, puxadores, remadas e funcional com disponibilidade imediata. Chegou, treinou.', ui: <EquipBoard /> },
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
      <div className="f-grid grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cards.map(c => (
          <TiltCard key={c.k} className="f-card flex flex-col rounded-focal border border-line bg-ink-low p-4 transition-shadow duration-500 hover:shadow-[6px_6px_0_#D95D37] md:p-5">
            {c.ui}
            <div className="mt-6 flex items-center gap-2 font-mono text-xs text-flame">{c.k} <MiniPulse className="w-8" /> <span className="uppercase tracking-widest text-dust">{c.tag}</span></div>
            <h3 className="mt-2 font-display text-2xl uppercase leading-tight tracking-wide text-cream">{c.t}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-dust">{c.d}</p>
          </TiltCard>
        ))}
      </div>
    </section>
  )
}

/* ================= BARRA SENDO CARREGADA + BPM subindo (scrub, sem pin) ================= */
function LoadTheBar() {
  const [bpm, setBpm] = useState(72)
  const zone = bpm < 100 ? ['Repouso', 'text-dust'] : bpm < 130 ? ['Aquecimento', 'text-sand'] : bpm < 155 ? ['Queima', 'text-ember'] : ['Máximo', 'text-flame']
  const ref = useGsap(el => {
    const o = { b: 72 }
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 40%', scrub: 1 } })
    tl.from('.lb-l', { x: -400, opacity: 0, stagger: 0.15, ease: 'power2.out' }, 0)
      .from('.lb-r', { x: 400, opacity: 0, stagger: 0.15, ease: 'power2.out' }, 0)
      .to('.lb-kg', { innerText: 140, snap: { innerText: 5 }, ease: 'none' }, 0)
      .to(o, { b: 172, ease: 'none', onUpdate: () => setBpm(Math.round(o.b)) }, 0)
      .to('.lb-rig', { y: -30, ease: 'power2.inOut' }, '>')
  })
  return (
    <section ref={ref} className="relative overflow-hidden border-y border-line bg-ink-low py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 text-center md:px-12">
        <Eyebrow className="justify-center">Sobrecarga progressiva</Eyebrow>
        <h2 className="rv font-display text-4xl uppercase tracking-wide text-cream md:text-6xl">Cada semana, <span className="text-flame">mais forte.</span></h2>
        <div className="lb-rig relative mx-auto mt-14 flex h-56 max-w-3xl items-center justify-center md:h-64">
          <div className="absolute h-3 w-full rounded-full bg-gradient-to-r from-dust/40 via-dust to-dust/40" />
          <div className="absolute left-[2%] flex items-center gap-1 md:left-[8%]">
            {[['h-20 md:h-28', 'bg-ember'], ['h-28 md:h-40', 'bg-cream'], ['h-36 md:h-52', 'bg-flame']].map(([h, c], i) => <div key={i} className={`lb-l w-3.5 rounded md:w-6 ${h} ${c}`} />)}
          </div>
          <div className="absolute right-[2%] flex items-center gap-1 md:right-[8%]">
            {[['h-36 md:h-52', 'bg-flame'], ['h-28 md:h-40', 'bg-cream'], ['h-20 md:h-28', 'bg-ember']].map(([h, c], i) => <div key={i} className={`lb-r w-3.5 rounded md:w-6 ${h} ${c}`} />)}
          </div>
          <div className="relative rounded-full border border-line bg-ink px-5 py-2.5 md:px-6 md:py-3">
            <span className="lb-kg font-display text-4xl tabular-nums text-cream md:text-6xl">20</span><span className="font-display text-xl text-flame md:text-2xl"> KG</span>
          </div>
        </div>
        {/* monitor cardíaco que acompanha a carga */}
        <div className="mx-auto mt-6 flex max-w-sm items-center justify-between gap-4 rounded-card border border-line bg-ink px-4 py-3">
          <div className="flex items-center gap-3">
            <Heart className="h-7 w-7" speed={Math.max(0.35, 72 / bpm)} />
            <div className="text-left">
              <p className="font-display text-3xl leading-none tabular-nums text-cream">{bpm}<span className="ml-1 font-mono text-xs text-dust">BPM</span></p>
              <p className={`font-mono text-[10px] uppercase tracking-widest ${zone[1]}`}>Zona: {zone[0]}</p>
            </div>
          </div>
          <div className="flex h-8 w-24 items-end gap-0.5">
            {[0, 1, 2, 3, 4].map(i => <span key={i} className={`w-full rounded-sm transition-colors duration-300 ${bpm >= 72 + i * 22 ? 'bg-flame' : 'bg-ink-high'}`} style={{ height: `${30 + i * 17}%` }} />)}
          </div>
        </div>
        <p className="rv mx-auto mt-8 max-w-md text-dust">Ajustes quinzenais de carga e exercícios, com o professor acompanhando cada progressão.</p>
      </div>
    </section>
  )
}

/* ================= QUIZ — descubra seu estilo de treino ================= */
const QUIZ = [
  { q: 'Qual é o seu objetivo principal?', o: [['Ganhar massa muscular', 'hip'], ['Emagrecer e definir', 'burn'], ['Ficar muito mais forte', 'forca'], ['Saúde, postura e disposição', 'base']] },
  { q: 'O que te dá mais prazer num treino?', o: [['Bater recorde de carga', 'forca'], ['Sentir o músculo queimar (pump)', 'hip'], ['Suar e o coração disparar', 'burn'], ['Terminar leve, sem dor', 'base']] },
  { q: 'Como está sua experiência?', o: [['Nunca treinei', 'base'], ['Já treinei, mas parei', 'burn'], ['Treino há alguns meses', 'hip'], ['Treino sério há anos', 'forca']] },
  { q: 'Quanto tempo você tem por dia?', o: [['30 minutos, no máximo', 'burn'], ['Uns 50 minutos', 'hip'], ['1 hora ou mais', 'forca'], ['Depende do dia', 'base']] },
]
const STYLES = {
  forca: { name: 'Força Bruta', emoji: '🏋️', bpm: '120–150', lvl: 4, desc: 'Você nasceu para levantar pesado. Treinos com pesos livres, poucas reps e muita técnica, com o professor garantindo a execução.', tags: ['Agachamento', 'Terra', 'Supino', 'Desenvolvimento'], plan: 'Trimestral Studio' },
  hip: { name: 'Construtor de Músculo', emoji: '💪', bpm: '110–140', lvl: 3, desc: 'Seu jogo é volume e pump. Séries bem controladas, ajuste de carga quinzenal e foco na conexão mente-músculo.', tags: ['Halteres', 'Puxador', 'Leg press', 'Remada'], plan: 'Trimestral Studio' },
  burn: { name: 'Motor de Queima', emoji: '🔥', bpm: '140–170', lvl: 5, desc: 'Você gosta de intensidade. Circuitos de musculação com funcional, descanso curto e o coração lá em cima.', tags: ['Circuito', 'Funcional', 'Kettlebell', 'Bi-set'], plan: 'Mensal Studio' },
  base: { name: 'Base Sólida', emoji: '🧱', bpm: '100–130', lvl: 2, desc: 'Construir do jeito certo: postura, mobilidade e fortalecimento, com acompanhamento de perto para evoluir sem dor.', tags: ['Mobilidade', 'Core', 'Postura', 'Máquinas guiadas'], plan: 'Personal Studio' },
}

function Quiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const box = useRef(null)
  const done = step >= QUIZ.length
  const bpm = 72 + step * 22
  const result = done ? STYLES[Object.entries(answers.reduce((a, k) => ({ ...a, [k]: (a[k] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1])[0][0]] : null

  const sectionRef = useGsap(el => {
    gsap.from('.qz-card', { y: 80, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 75%' } })
  })
  useEffect(() => {
    if (!box.current) return
    const ctx = gsap.context(() => {
      gsap.from('.qz-in', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.07 })
      if (done) {
        gsap.from('.qz-meter span', { scaleY: 0, transformOrigin: 'bottom', duration: 0.5, ease: 'back.out(2)', stagger: 0.1, delay: 0.3 })
        gsap.fromTo('.qz-burst', { scale: 0, opacity: 1 }, { scale: 3, opacity: 0, duration: 1, ease: 'power2.out' })
      }
    }, box)
    return () => ctx.revert()
  }, [step])

  const pick = k => {
    gsap.to('.qz-heart', { scale: 1.6, duration: 0.12, yoyo: true, repeat: 1 })
    setAnswers(a => [...a, k]); setStep(s => s + 1)
  }
  const reset = () => { setAnswers([]); setStep(0) }
  const waResult = result && 'https://wa.me/5511958843199?text=' + encodeURIComponent(`Olá! Fiz o quiz no site da Havoc Fit e meu estilo é "${result.name}". Quero agendar minha aula experimental!`)

  return (
    <section id="quiz" ref={sectionRef} className="relative overflow-hidden py-20 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <Eyebrow>Quiz de 30 segundos</Eyebrow>
          <h2 className="rv font-display text-4xl uppercase leading-[1] tracking-wide text-cream md:text-6xl">Descubra seu <span className="text-flame">estilo de treino</span></h2>
          <p className="rv mt-5 text-dust md:text-lg">Responda 4 perguntas e veja o treino que combina com você. A cada resposta, o coração acelera.</p>
        </div>

        <div className="qz-card relative lg:col-span-7">
          <div ref={box} className="relative overflow-hidden rounded-focal border border-line bg-ink-low p-5 shadow-[6px_6px_0_#D95D37] md:p-8">
            {/* cabeçalho: monitor cardíaco + progresso */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Heart className="qz-heart h-5 w-5" speed={Math.max(0.35, 72 / bpm)} />
                <span className="font-mono text-sm tabular-nums text-cream">{done ? 170 : bpm} BPM</span>
              </div>
              <div className="flex flex-1 gap-1.5">
                {QUIZ.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < step ? 'bg-flame' : i === step ? 'bg-flame/40' : 'bg-ink-high'}`} />)}
              </div>
              <span className="font-mono text-xs text-dust">{Math.min(step + 1, 4)}/4</span>
            </div>

            {!done ? (
              <div key={step}>
                <p className="qz-in font-mono text-xs uppercase tracking-widest text-flame">Pergunta 0{step + 1}</p>
                <h3 className="qz-in mt-2 font-display text-2xl uppercase leading-tight tracking-wide text-cream md:text-4xl">{QUIZ[step].q}</h3>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {QUIZ[step].o.map(([label, k], i) => (
                    <div key={label} className="qz-in">
                    <button onClick={() => pick(k)}
                      className="group flex w-full items-center gap-3 rounded-card border border-line bg-ink px-4 py-4 text-left text-[15px] font-semibold text-sand transition-[transform,border-color,background-color,color] duration-300 hover:-translate-y-0.5 hover:border-flame hover:bg-flame/10 hover:text-cream active:scale-[.98]">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line font-mono text-xs text-dust transition-colors group-hover:border-flame group-hover:bg-flame group-hover:text-white">{'ABCD'[i]}</span>
                      {label}
                    </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div key="res" className="relative">
                <span className="qz-burst pointer-events-none absolute left-8 top-8 h-20 w-20 rounded-full border-4 border-flame" aria-hidden="true" />
                <p className="qz-in font-mono text-xs uppercase tracking-widest text-flame">Seu estilo é</p>
                <h3 className="qz-in mt-2 font-display text-4xl uppercase leading-none tracking-wide text-cream md:text-6xl">{result.emoji} {result.name}</h3>
                <p className="qz-in mt-4 text-dust">{result.desc}</p>
                <div className="qz-in mt-5 flex flex-wrap gap-2">
                  {result.tags.map(t => <span key={t} className="rounded-full bg-flame/15 px-3 py-1 text-xs font-bold text-ember">{t}</span>)}
                </div>
                <div className="qz-in mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-card border border-line bg-ink p-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-dust">Intensidade</p>
                    <div className="qz-meter mt-2 flex h-8 items-end gap-1">
                      {[1, 2, 3, 4, 5].map(i => <span key={i} className={`w-full rounded-sm ${i <= result.lvl ? 'bg-flame' : 'bg-ink-high'}`} style={{ height: `${20 + i * 16}%` }} />)}
                    </div>
                  </div>
                  <div className="rounded-card border border-line bg-ink p-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-dust">Zona de BPM</p>
                    <p className="mt-1 font-display text-2xl text-cream">{result.bpm}</p>
                  </div>
                </div>
                <p className="qz-in mt-5 text-sm text-sand">Plano sugerido: <strong className="text-flame">{result.plan}</strong></p>
                <div className="qz-in mt-6 flex flex-col gap-3 sm:flex-row">
                  <Btn href={waResult} className="w-full sm:w-auto">Treinar assim <Arrow /></Btn>
                  <button onClick={reset} className="btn btn-ghost w-full sm:w-auto"><span className="slide" aria-hidden="true" />Refazer quiz</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ================= GALERIA — "Sinta a energia" (bento + faixa por scrub) ================= */
function StudioStatus() {
  const now = new Date()
  const d = now.getDay(), h = now.getHours()
  const weekday = d >= 1 && d <= 5
  const status = weekday && h >= 6 ? ['Aberto hoje', true] : weekday ? ['Abre às 06:00', false] : ['Fim de semana: consulte', false]
  return (
    <div className="flex items-center gap-2 rounded-full border border-line bg-ink-low px-3 py-1.5">
      <span className={`h-2 w-2 rounded-full ${status[1] ? 'pulse bg-flame' : 'bg-dust'}`} />
      <span className="font-mono text-[11px] uppercase tracking-widest text-cream">{status[0]}</span>
    </div>
  )
}

function QueueTile() {
  const [n, setN] = useState(5)
  useEffect(() => {
    const id = setInterval(() => setN(v => (v <= 0 ? 5 : v - 1)), 700)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex h-full flex-col justify-between">
      <p className="font-mono text-[10px] uppercase tracking-widest text-dust">Fila no supino</p>
      <div className="my-3 flex h-10 items-end gap-1.5">
        {[0, 1, 2, 3, 4].map(i => (
          <svg key={i} viewBox="0 0 20 32" className={`h-9 w-6 transition-all duration-500 ${i < n ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'}`} aria-hidden="true">
            <circle cx="10" cy="7" r="5" fill="#a79f93" /><path d="M2 32 C2 18, 18 18, 18 32Z" fill="#a79f93" />
          </svg>
        ))}
        {n === 0 && <span className="font-display text-xl uppercase text-flame">Livre!</span>}
      </div>
      <div>
        <p className="font-display text-5xl leading-none text-cream"><span className="tabular-nums">{n}</span></p>
        <p className="mt-1 text-sm text-dust">Aqui a fila zera. Chegou, treinou.</p>
      </div>
    </div>
  )
}

function EqualizerTile() {
  const bpm = useLiveBpm(126, 8, 900)
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-dust">Ritmo do treino</p>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-cream"><Heart className="h-3 w-3" speed={60 / bpm} /><span className="tabular-nums">{bpm}</span></span>
      </div>
      <div className="my-4 flex h-16 items-end gap-1">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="eq-bar w-full rounded-sm bg-gradient-to-t from-flame to-ember"
            style={{ animationDelay: `${(i * 0.13) % 0.9}s`, animationDuration: `${0.6 + (i % 5) * 0.12}s` }} />
        ))}
      </div>
      <p className="font-display text-2xl uppercase leading-tight tracking-wide text-cream">Som alto,<br /><span className="text-flame">foco lá em cima.</span></p>
    </div>
  )
}

function PhotoTile({ src, alt, tag, className = '', live = false }) {
  return (
    <figure className={`g-item group relative overflow-hidden rounded-focal ${className}`}>
      <img src={src} alt={alt} loading="lazy" className="g-img h-full w-full object-cover grayscale-[.5] transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
      {live && (
        <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-ink/70 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-cream backdrop-blur">
          <span className="pulse h-2 w-2 rounded-full bg-flame" /> Sala de pesos
        </span>
      )}
      <figcaption className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
        <span className="rounded-full bg-flame px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">{tag}</span>
        <span className="translate-y-2 font-mono text-[10px] uppercase tracking-widest text-cream opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">{alt}</span>
      </figcaption>
    </figure>
  )
}

function Gallery() {
  const ref = useGsap(el => {
    gsap.utils.toArray('.g-item, .g-tile').forEach((g, i) => {
      gsap.fromTo(g, { clipPath: 'inset(100% 0 0 0 round 24px)', y: 40 }, { clipPath: 'inset(0% 0 0 0 round 24px)', y: 0, duration: 1.1, ease: 'power3.inOut', scrollTrigger: { trigger: g, start: 'top 88%' }, delay: (i % 3) * 0.08 })
    })
    gsap.utils.toArray('.g-img').forEach(img => {
      gsap.fromTo(img, { scale: 1.25, yPercent: -6 }, { scale: 1.05, yPercent: 6, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } })
    })
    gsap.fromTo('.g-strip', { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.g-strip', start: 'top bottom', end: 'bottom top', scrub: 1 } })
    gsap.fromTo('.g-strip-2', { xPercent: -30 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.g-strip-2', start: 'top bottom', end: 'bottom top', scrub: 1 } })
    gsap.from('.g-word', { yPercent: 100, duration: 0.8, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 75%' } })
  })
  const [g1, g2, g3, g4] = IMG.gallery
  const strip = ['Pesos livres', 'Puxadores', 'Remadas', 'Funcional', 'Halteres', 'Máquinas', 'Barra livre']
  return (
    <section id="galeria" ref={ref} className="overflow-hidden py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>Dentro do studio</Eyebrow>
            <h2 className="font-display text-5xl uppercase leading-[.95] tracking-wide text-cream md:text-8xl">
              <span className="block overflow-hidden"><span className="g-word inline-block">Sinta a</span></span>
              <span className="block overflow-hidden"><span className="g-word inline-block text-flame">energia.</span></span>
            </h2>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <StudioStatus />
            <p className="max-w-xs text-sm text-dust md:text-right">Seg a sex a partir das 06:00 • R. Delfino Facchina, 600 • Americanópolis</p>
          </div>
        </div>

        {/* Bento: 1 coluna no mobile, 2 no tablet, 4 no desktop */}
        <div className="grid auto-rows-[15rem] grid-cols-2 gap-3 md:auto-rows-[17rem] md:gap-4 lg:grid-cols-4">
          <PhotoTile src={g1[0]} alt={g1[1]} tag="Força" live className="col-span-2 row-span-2" />
          <div className="g-tile col-span-2 rounded-focal border border-line bg-ink-low p-5 md:col-span-1 lg:col-span-1"><QueueTile /></div>
          <PhotoTile src={g2[0]} alt={g2[1]} tag="Halteres" className="col-span-1" />
          <PhotoTile src={g3[0]} alt={g3[1]} tag="Terra" className="col-span-1" />
          <div className="g-tile col-span-1 flex flex-col justify-between rounded-focal bg-flame p-5 text-white shadow-[5px_5px_0_#FDF8EA]">
            <span className="font-display text-6xl leading-none" aria-hidden="true">“</span>
            <blockquote className="text-[15px] font-semibold leading-snug md:text-base">Me sinto motivada a treinar todos os dias 💪🔥</blockquote>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/80">Amanda • Google</p>
          </div>
          <div className="g-tile col-span-2 rounded-focal border border-line bg-ink-low p-5 lg:col-span-2"><EqualizerTile /></div>
          <PhotoTile src={g4[0]} alt={g4[1]} tag="Costas" className="col-span-2 lg:col-span-2" />
        </div>
      </div>

      {/* Faixas que deslizam em direções opostas com a rolagem */}
      <div className="mt-14 space-y-3" aria-hidden="true">
        <div className="g-strip flex w-max gap-3">
          {[...strip, ...strip].map((w, i) => (
            <span key={i} className={`whitespace-nowrap rounded-full border px-6 py-3 font-display text-2xl uppercase tracking-wide md:text-4xl ${i % 3 === 0 ? 'border-flame bg-flame text-white' : 'border-line text-cream'}`}>{w}</span>
          ))}
        </div>
        <div className="g-strip-2 flex w-max gap-3">
          {IMG.strip.map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy" className="h-24 w-36 rounded-card object-cover grayscale md:h-36 md:w-56" />
          ))}
        </div>
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
          <Eyebrow className="md:justify-center">Transparência e valor real</Eyebrow>
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
          <figure key={r.n} className="r-card flex flex-col rounded-focal border border-line bg-ink-low p-7 transition-[box-shadow,border-color] duration-500 hover:border-flame hover:shadow-[6px_6px_0_#D95D37]">
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

/* ================= CTA PRINCIPAL — aula experimental (meio da página) ================= */
function FreeClass() {
  const ref = useGsap(el => {
    gsap.from('.fc .char', { yPercent: 110, duration: 0.9, ease: 'power3.out', stagger: 0.02, scrollTrigger: { trigger: el, start: 'top 75%' } })
    gsap.to('.fc-db', { y: -24, rotate: -12, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    gsap.from('.fc-perk', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 60%' } })
    gsap.fromTo('.fc-ring', { scale: 0.6, opacity: 0.6 }, { scale: 1.6, opacity: 0, duration: 2.2, repeat: -1, ease: 'power2.out', stagger: 0.7 })
  })
  const perks = [['Grátis', 'Aula experimental sem custo'], ['Sem compromisso', 'Conheça antes de decidir'], ['Resposta rápida', 'Agende direto no WhatsApp']]
  return (
    <section ref={ref} className="relative overflow-hidden border-y border-line bg-ink-low">
      <span className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-display text-[30vw] leading-none text-cream/[.03]" aria-hidden="true">GRÁTIS</span>
      <div className="relative mx-auto max-w-7xl px-5 py-20 text-center md:px-12 md:py-32">
        <Dumbbell className="fc-db mx-auto mb-8 w-24 md:w-36" />
        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-line bg-ink px-4 py-1.5 text-xs">
          <span className="text-flame">★★★★★</span><span className="font-bold text-cream">4.7</span><span className="text-dust">• +84 avaliações no Google</span>
        </div>
        <h2 className="fc mx-auto max-w-4xl font-display text-5xl uppercase leading-[.95] tracking-wide text-cream md:text-8xl">
          <Split text="Primeiro treino" className="block" />
          <Split text="por nossa conta." className="block text-flame" />
        </h2>
        <p className="rv mx-auto mt-6 max-w-md text-dust">Venha conhecer a sala de pesos, conversar com os professores e sentir a energia de um studio pensado para a sua evolução.</p>
        <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
          {perks.map(([t, d]) => (
            <li key={t} className="fc-perk rounded-card border border-line bg-ink px-4 py-4 text-left sm:text-center">
              <p className="font-display text-xl uppercase tracking-wide text-cream"><span className="text-flame">✓</span> {t}</p>
              <p className="mt-1 text-sm text-dust">{d}</p>
            </li>
          ))}
        </ul>
        <div className="relative mx-auto mt-10 w-full sm:w-fit">
          <span className="fc-ring pointer-events-none absolute inset-0 rounded-sm border-2 border-flame" aria-hidden="true" />
          <span className="fc-ring pointer-events-none absolute inset-0 rounded-sm border-2 border-flame" aria-hidden="true" />
          <Btn href={WA} className="relative w-full !px-8 !py-5 !text-sm sm:w-auto">Agendar minha aula grátis <Arrow /></Btn>
        </div>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-dust">Seg a sex a partir das 06:00 • (11) 95884-3199</p>
      </div>
    </section>
  )
}

/* ================= FOOTER (com convite compacto) ================= */
function Footer() {
  const ref = useGsap(el => {
    gsap.from('.ft-big', { yPercent: 60, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: true } })
  })
  return (
    <footer ref={ref} className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 pt-16 md:px-12">
        <div className="rv flex flex-col items-start justify-between gap-6 rounded-focal bg-flame p-6 text-white shadow-[6px_6px_0_#FDF8EA] md:flex-row md:items-center md:p-8">
          <div>
            <p className="font-display text-3xl uppercase leading-tight tracking-wide md:text-4xl">Ainda pensando? Vem treinar com a gente.</p>
            <p className="mt-1 text-sm text-white/85">Aula experimental gratuita, sem compromisso.</p>
          </div>
          <a href={WA} target="_blank" rel="noreferrer" className="btn w-full shrink-0 bg-ink text-cream md:w-auto"><span className="slide" aria-hidden="true" style={{ background: '#262525' }} />Chamar no WhatsApp <Arrow /></a>
        </div>
      </div>
      <p className="ft-big pointer-events-none mt-10 select-none text-center font-display text-[26vw] leading-[.8] text-cream/[.04]" aria-hidden="true">HAVOC</p>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 pb-24 text-sm text-dust md:flex-row md:items-center md:justify-between md:px-12 md:pb-10">
          <span className="font-display text-2xl tracking-wider text-cream">HAVOC<span className="text-flame">FIT</span></span>
          <ul className="flex flex-wrap gap-6">
            {[['#studio', 'Studio'], ['#quiz', 'Quiz'], ['#planos', 'Planos'], ['#avaliacoes', 'Avaliações'], ['#contato', 'Localização']].map(([h, l]) => <li key={h}><a className="lift inline-block" href={h}>{l}</a></li>)}
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
      className="float-wa fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-flame text-white shadow-[0_10px_30px_rgba(217,93,55,.5)] transition-transform hover:scale-110 md:bottom-8 md:right-8 md:h-16 md:w-16">
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
        <EkgDivider label="Aquecendo" bpm={94} speed={2.8} seed={3} beats={3} />
        <Features />
        <Gallery />
        <Quiz />
        <LoadTheBar />
        <FreeClass />
        <Steps />
        <Plans />
        <Reviews />
        <div className="bg-ink-low pt-8 md:pt-12"><EkgDivider label="Pronto pra começar" bpm={157} speed={1.3} seed={11} beats={5} /></div>
        <Contact />
      </main>
      <Footer />
      <FloatWA />
    </div>
  )
}
