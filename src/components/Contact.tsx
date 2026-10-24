import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type data from '../portfolioData.json'
import { ChannelIcon, resolveChannels, type Channel } from './channels'
import { BloomBadge, ChapterMark, ease, Reveal, ScrollStem, sectionShell } from './primitives'

type C = typeof data.contact
type Point = [number, number]
type Stem = { d: string; start: Point; end: Point; mid: Point; angle: number }
type Geometry = { w: number; h: number; stems: (Stem | null)[] }
type ElRef<T> = { current: T }

const tones: Record<string, { chip: string; fill: string }> = {
  plum: { chip: 'bg-plum text-cream', fill: 'bg-rose' },
  lavender: { chip: 'bg-lavender text-plum', fill: 'bg-mist' },
  pink: { chip: 'bg-pink text-plum', fill: 'bg-peach' },
  sage: { chip: 'bg-sage text-plum', fill: 'bg-mint' },
}

// Desktop bouquet: two channels either side of the portrait hub.
const placement = ['lg:col-start-1 lg:row-start-1', 'lg:col-start-1 lg:row-start-2', 'lg:col-start-3 lg:row-start-1', 'lg:col-start-3 lg:row-start-2']

const fmt = (p: Point) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`

/** Measures the hub and cards so each stem runs from the portrait's edge to its card (desktop only). */
function useStemGeometry(root: ElRef<HTMLDivElement | null>, hub: ElRef<HTMLDivElement | null>, cards: ElRef<(HTMLDivElement | null)[]>) {
  const [geo, setGeo] = useState<Geometry | null>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const mq = window.matchMedia('(min-width: 1024px)')
    const measure = () => {
      const h = hub.current
      if (!mq.matches || !h) return setGeo(null)
      const box = el.getBoundingClientRect()
      const hb = h.getBoundingClientRect()
      const cx = hb.left + hb.width / 2 - box.left
      const cy = hb.top + hb.height / 2 - box.top
      const r = hb.width / 2 + 6
      const stems = cards.current.map((card) => {
        if (!card) return null
        const cb = card.getBoundingClientRect()
        const onLeft = cb.left + cb.width / 2 - box.left < cx
        const end: Point = [(onLeft ? cb.right : cb.left) - box.left, cb.top + cb.height / 2 - box.top]
        const a = Math.atan2(end[1] - cy, end[0] - cx)
        const start: Point = [cx + r * Math.cos(a), cy + r * Math.sin(a)]
        const mx = (start[0] + end[0]) / 2
        const c1: Point = [mx, start[1]]
        const c2: Point = [mx, end[1]]
        // Point and tangent of the cubic at t = 0.5, where a leaf sprouts
        const mid: Point = [(start[0] + 3 * c1[0] + 3 * c2[0] + end[0]) / 8, (start[1] + 3 * c1[1] + 3 * c2[1] + end[1]) / 8]
        const tx = 0.75 * (c1[0] - start[0]) + 1.5 * (c2[0] - c1[0]) + 0.75 * (end[0] - c2[0])
        const ty = 0.75 * (c1[1] - start[1]) + 1.5 * (c2[1] - c1[1]) + 0.75 * (end[1] - c2[1])
        return { d: `M${fmt(start)} C${fmt(c1)} ${fmt(c2)} ${fmt(end)}`, start, end, mid, angle: (Math.atan2(ty, tx) * 180) / Math.PI }
      })
      setGeo({ w: box.width, h: box.height, stems })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    if (hub.current) ro.observe(hub.current)
    cards.current.forEach((c) => c && ro.observe(c))
    mq.addEventListener('change', measure)
    document.fonts?.ready.then(measure)
    return () => {
      ro.disconnect()
      mq.removeEventListener('change', measure)
    }
  }, [root, hub, cards])

  return geo
}

const PETALS = [0, 72, 144, 216, 288]

function PinBloom({ at, on, live, delay }: { at: Point; on: boolean; live: boolean; delay: number }) {
  return (
    <g transform={`translate(${fmt(at)})`}>
      <motion.g initial={{ scale: 0, rotate: -120 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ delay, type: 'spring', stiffness: 220, damping: 13 }}>
        <g className="transition-transform duration-500 ease-out" style={{ transform: on ? 'scale(1.4) rotate(72deg)' : 'none' }}>
          {PETALS.map((a) => (
            <ellipse key={a} cx="0" cy="-7" rx="4.2" ry="7" transform={`rotate(${a})`} style={{ fill: live ? 'var(--color-pink)' : 'var(--color-rose)' }} />
          ))}
          <circle r="3" style={{ fill: live ? 'var(--color-plum)' : 'var(--color-muted)' }} />
        </g>
      </motion.g>
    </g>
  )
}

function Leaf({ at, angle, delay }: { at: Point; angle: number; delay: number }) {
  return (
    <g transform={`translate(${fmt(at)}) rotate(${angle.toFixed(1)})`}>
      <motion.path
        d="M0 0 C5 -8 17 -8 22 0 C17 8 5 8 0 0Z"
        style={{ fill: 'var(--color-sage)' }}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5, ease }}
      />
    </g>
  )
}

function StemLayer({ geo, active, channels }: { geo: Geometry; active: number | null; channels: Channel[] }) {
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${geo.w} ${geo.h}`} className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible">
      <defs>
        {geo.stems.map(
          (s, i) =>
            s && (
              <linearGradient key={i} id={`contact-stem-${i}`} gradientUnits="userSpaceOnUse" x1={s.start[0]} y1={s.start[1]} x2={s.end[0]} y2={s.end[1]}>
                <stop offset="0" style={{ stopColor: 'var(--color-sage)' }} />
                <stop offset="0.55" style={{ stopColor: 'var(--color-pink)' }} />
                <stop offset="1" style={{ stopColor: 'var(--color-plum)' }} />
              </linearGradient>
            ),
        )}
      </defs>
      {geo.stems.map((s, i) => {
        if (!s) return null
        const live = !!channels[i]?.href
        const on = active === i
        const delay = 0.3 + i * 0.18
        return (
          <g key={i} className="transition-opacity duration-500" style={{ opacity: active === null || on ? 1 : 0.3 }}>
            {live ? (
              <motion.path
                d={s.d}
                fill="none"
                stroke={`url(#contact-stem-${i})`}
                strokeLinecap="round"
                className="transition-[stroke-width] duration-500"
                style={{ strokeWidth: on ? 3.5 : 2.25 }}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, delay, ease }}
              />
            ) : (
              <motion.path
                d={s.d}
                fill="none"
                stroke="var(--color-plum)"
                strokeOpacity={0.3}
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray="1 8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay }}
              />
            )}
            {live && on && (
              <path d={s.d} fill="none" stroke="var(--color-cream)" strokeWidth={1.6} strokeLinecap="round" strokeDasharray="0.5 14" className="motion-safe:animate-[sap_0.9s_linear_infinite]" />
            )}
            <circle cx={s.start[0]} cy={s.start[1]} r={3.5} style={{ fill: 'var(--color-sage)' }} />
            <Leaf at={s.mid} angle={s.angle + (i % 2 ? 38 : -38)} delay={delay + 0.7} />
            <PinBloom at={s.end} on={on} live={live} delay={delay + 1.1} />
          </g>
        )
      })}
    </svg>
  )
}

type CardProps = {
  channel: Channel
  index: number
  mirror: boolean
  labels: Pick<C, 'pendingLabel' | 'copyLabel' | 'copiedLabel'>
  className: string
  cardRef: (el: HTMLDivElement | null) => void
  onActive: (on: boolean) => void
}

function ChannelCard({ channel, index, mirror, labels, className, cardRef, onActive }: CardProps) {
  const tone = tones[channel.tone] ?? tones.plum
  const live = !!channel.href
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2200)
    return () => clearTimeout(t)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(channel.display)
      setCopied(true)
    } catch {
      // Clipboard can be blocked (e.g. insecure contexts); the mailto link still works.
    }
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.12 }}
      onMouseEnter={() => onActive(true)}
      onMouseLeave={() => onActive(false)}
      onFocus={() => onActive(true)}
      onBlur={() => onActive(false)}
      className={`group relative isolate flex items-center gap-4 rounded-[1.75rem] border p-4 transition-[border-color,box-shadow] duration-500 sm:p-5 ${
        mirror ? 'lg:flex-row-reverse lg:text-right' : ''
      } ${
        live
          ? 'border-plum/10 bg-cream/85 shadow-[0_24px_48px_-36px_rgba(84,43,69,0.55)] backdrop-blur hover:border-plum/25 hover:shadow-[0_30px_60px_-30px_rgba(84,43,69,0.55)] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-plum'
          : 'border-dashed border-plum/20 bg-cream/50'
      } ${className}`}
    >
      {/* Bud on the mobile stem */}
      <span aria-hidden="true" className="absolute -left-7 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage ring-4 ring-sage/30 lg:hidden" />
      {live && (
        <span aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
          <span
            className={`absolute left-11 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full transition-transform duration-700 ease-out group-hover:scale-[12] group-has-[a:focus-visible]:scale-[12] ${
              mirror ? 'lg:left-auto lg:right-11 lg:translate-x-1/2' : ''
            } ${tone.fill}`}
          />
        </span>
      )}

      <span aria-hidden="true" className={`grid size-14 shrink-0 place-items-center rounded-2xl transition-transform duration-500 group-hover:-rotate-6 ${live ? tone.chip : 'bg-plum/5 text-plum/45'}`}>
        <ChannelIcon id={channel.id} size={22} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-display text-[11px] font-medium uppercase tracking-[0.22em] text-muted">{channel.label}</span>
        {live ? (
          <a
            href={channel.href}
            {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="mt-1 block font-serif text-lg leading-snug text-plum [overflow-wrap:anywhere] after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none sm:text-xl"
          >
            <span className="sr-only">{` — ${channel.action}`}</span>
          </a>
        ) : (
          <span className="mt-1 block font-serif text-lg italic text-plum/50 sm:text-xl">{labels.pendingLabel}</span>
        )}
      </span>

      {live && channel.id === 'email' && (
        <span className="relative z-10 shrink-0">
          <button
            type="button"
            onClick={copy}
            aria-label={labels.copyLabel}
            title={labels.copyLabel}
            className="grid size-10 place-items-center rounded-full border border-plum/15 bg-cream/80 text-plum transition hover:border-plum hover:bg-plum hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <AnimatePresence>
            {copied && (
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-plum px-3 py-1 text-xs font-medium text-cream"
              >
                {labels.copiedLabel}
              </motion.span>
            )}
          </AnimatePresence>
          <span role="status" className="sr-only">
            {copied ? labels.copiedLabel : ''}
          </span>
        </span>
      )}

      {live && (
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-plum/15 text-plum transition duration-500 group-hover:rotate-45 group-hover:border-plum group-hover:bg-plum group-hover:text-cream"
        >
          <ArrowUpRight size={18} />
        </span>
      )}
    </motion.div>
  )
}

export function Contact({ contact, email, avatar }: { contact: C; email: string; avatar?: string }) {
  const channels = resolveChannels(contact.channels, email)
  const [active, setActive] = useState<number | null>(null)
  const gardenRef = useRef<HTMLDivElement>(null)
  const hubRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const geo = useStemGeometry(gardenRef, hubRef, cardRefs)
  const current = active === null ? null : channels[active]

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-plum/10 bg-linen bg-[radial-gradient(50%_45%_at_0%_100%,var(--color-mint),transparent),radial-gradient(45%_40%_at_100%_0%,var(--color-mist),transparent)] py-24 md:py-32"
    >
      <div className={sectionShell()}>
        <Reveal className="mx-auto max-w-2xl text-center">
          <ChapterMark center>{contact.eyebrow}</ChapterMark>
          <h2 className="mt-6 font-serif text-5xl leading-[1.02] text-plum md:text-7xl">{contact.heading}</h2>
          <p className="mt-3 font-display text-2xl font-medium text-ink">{contact.subheading}</p>
          <p className="mx-auto mt-5 max-w-lg leading-relaxed text-ink/75">{contact.description}</p>
        </Reveal>

        <div
          ref={gardenRef}
          className="relative mt-14 grid items-center gap-10 md:mt-20 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:grid-rows-2 lg:gap-x-24 lg:gap-y-8 xl:gap-x-32"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-serif text-[9rem] italic leading-none text-plum/[0.045] md:text-[14rem] lg:text-[20rem]"
          >
            {contact.watermark}
          </span>

          {geo && <StemLayer geo={geo} active={active} channels={channels} />}

          {/* Hub: the portrait every stem grows from */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative z-10 flex flex-col items-center text-center lg:col-start-2 lg:row-span-2 lg:row-start-1"
          >
            <div ref={hubRef} className="size-48 sm:size-56 xl:size-60">
              <BloomBadge src={avatar} text={contact.badgeText} className="size-full" />
            </div>
            <div aria-hidden="true" className="mt-4 h-16">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={current?.id ?? 'idle'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                  <p className="font-display text-[11px] font-medium uppercase tracking-[0.24em] text-muted">{current ? current.label : contact.hubLabel}</p>
                  <p className="mt-1 font-serif text-2xl italic text-plum">{current ? (current.href ? current.action : contact.pendingLabel) : contact.hubPrompt}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Below lg the cards hang off a scroll-filled stem; at lg this wrapper dissolves into the bouquet grid */}
          <div className="relative mx-auto grid w-full max-w-xl gap-4 pl-10 lg:contents">
            <ScrollStem className="bottom-8 left-3 top-8 lg:hidden" />
            {channels.map((c, i) => (
              <ChannelCard
                key={c.id}
                channel={c}
                index={i}
                mirror={i < 2}
                labels={contact}
                className={placement[i] ?? ''}
                cardRef={(el) => {
                  cardRefs.current[i] = el
                }}
                onActive={(on) => setActive((prev) => (on ? i : prev === i ? null : prev))}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
