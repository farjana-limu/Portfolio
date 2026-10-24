import { motion, useScroll, useSpring, useTransform, type Variants } from 'framer-motion'
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'

export const ease = [0.22, 1, 0.36, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

export const stagger = (gap = 0.08): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap } },
})

const viewport = { once: true, margin: '-80px' } as const

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={viewport} variants={fadeUp}>
      {children}
    </motion.div>
  )
}

export function StaggerGroup({ children, className, gap }: { children: ReactNode; className?: string; gap?: number }) {
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={viewport} variants={stagger(gap)}>
      {children}
    </motion.div>
  )
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-display text-[11px] font-medium uppercase tracking-[0.24em] text-muted ${className}`}>{children}</p>
  )
}

/** Abstract five-petal bloom used as the Campus Bloom motif. */
export function Bloom({
  className,
  petal = 'var(--color-pink)',
  core = 'var(--color-plum)',
}: {
  className?: string
  petal?: string
  core?: string
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="50" cy="28" rx="13" ry="23" style={{ fill: petal }} transform={`rotate(${r} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="8" style={{ fill: core }} />
    </svg>
  )
}

export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  )
}

const artBackgrounds = ['bg-rose', 'bg-lavender/60', 'bg-sage/35', 'bg-pink/45']

/** CSS-generated editorial cover used whenever no real image is supplied. */
export function CoverArt({ seed = 0, className = '' }: { seed?: number; className?: string }) {
  const v = Math.abs(seed) % 4
  const move = 'transition-transform duration-700 ease-out'
  return (
    <div className={`relative overflow-hidden ${artBackgrounds[v]} ${className}`} aria-hidden="true">
      <div className="dots absolute inset-0 opacity-50" />
      {v === 0 && (
        <>
          <div className={`absolute -right-10 -top-12 size-52 rounded-full bg-pink ${move} group-hover:-translate-x-4 group-hover:translate-y-3`} />
          <div className={`absolute bottom-0 left-8 h-28 w-44 rounded-t-full bg-sage ${move} group-hover:-translate-y-2`} />
          <Bloom className={`absolute left-[45%] top-[28%] size-16 ${move} group-hover:rotate-45`} petal="var(--color-lavender)" />
        </>
      )}
      {v === 1 && (
        <>
          <div className={`absolute left-6 top-6 size-28 rounded-full border-2 border-plum/30 ${move} group-hover:scale-110`} />
          <div className={`absolute -bottom-10 right-6 size-44 rounded-[42%_58%_50%_50%] bg-pink/80 ${move} group-hover:rotate-12`} />
          <div className="absolute bottom-8 left-8 h-px w-1/2 bg-plum/30" />
        </>
      )}
      {v === 2 && (
        <>
          <div className={`absolute -left-8 top-1/4 size-36 rounded-full bg-lavender ${move} group-hover:translate-x-4`} />
          <div className={`absolute right-8 top-8 h-[70%] w-16 rounded-full bg-cream/80 ${move} group-hover:-translate-y-2`} />
          <Bloom className={`absolute bottom-6 right-1/3 size-14 ${move} group-hover:-rotate-45`} />
        </>
      )}
      {v === 3 && (
        <>
          <div className={`absolute inset-x-8 bottom-0 h-1/2 rounded-t-[999px] bg-sage/70 ${move} group-hover:-translate-y-2`} />
          <div className={`absolute right-10 top-8 size-20 rounded-full bg-plum/80 ${move} group-hover:scale-90`} />
          <div className="absolute left-8 top-8 size-16 rounded-full border border-dashed border-plum/40" />
        </>
      )}
    </div>
  )
}

/** Real image when available (lazy-loaded, with error fallback), otherwise CoverArt. */
export function Media({
  src,
  alt,
  seed,
  className = '',
  eager = false,
}: {
  src?: string
  alt?: string
  seed: number
  className?: string
  eager?: boolean
}) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return <CoverArt seed={seed} className={className} />
  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt ?? ''}
        loading={eager ? 'eager' : 'lazy'}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>
  )
}

/**
 * Tracks the last section (by comma-separated id list) whose top has crossed the upper-middle of
 * the viewport. `jumpTo` pins a clicked target so a smooth scroll doesn't flick through every
 * section in between; tracking resumes once scrolling settles.
 */
export function useActiveSection(idsKey: string) {
  const [active, setActive] = useState(idsKey.split(',')[0])
  const locked = useRef(false)
  const idle = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const ids = idsKey.split(',')
    const pick = () => {
      const doc = document.documentElement
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) return ids[ids.length - 1]
      const line = window.innerHeight * 0.45
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      return current
    }
    let frame = 0
    const update = () => {
      frame = 0
      if (!locked.current) setActive(pick())
    }
    const onScroll = () => {
      if (locked.current) {
        clearTimeout(idle.current)
        idle.current = setTimeout(() => {
          locked.current = false
          update()
        }, 140)
        return
      }
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
      clearTimeout(idle.current)
    }
  }, [idsKey])

  const jumpTo = useCallback((id: string) => {
    setActive(id)
    locked.current = true
    clearTimeout(idle.current)
    // Release even if no scroll follows (already at the target).
    idle.current = setTimeout(() => {
      locked.current = false
    }, 1000)
  }, [])

  return [active, jumpTo] as const
}

export function sectionShell(extra = '') {
  return `relative mx-auto max-w-7xl px-5 md:px-8 ${extra}`
}

/** A stem that grows when scrolled into view and ends in a bloom. */
export function GrowStem({ reverse = false, className = 'w-16 sm:w-24' }: { reverse?: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={`relative flex h-[2px] shrink-0 items-center ${reverse ? '-scale-x-100' : ''} ${className}`}>
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease, delay: 0.15 }}
        className="absolute inset-0 origin-left rounded-full stem-x"
      />
      <motion.span
        initial={{ scale: 0, rotate: -120 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.95, type: 'spring', stiffness: 260, damping: 15 }}
        className="absolute -right-2.5"
      >
        <Bloom className="size-[18px]" />
      </motion.span>
    </span>
  )
}

/** Section label: a sage bud, the chapter text, and a growing stem. */
export function ChapterMark({ children, center = false, className = '' }: { children: ReactNode; center?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${center ? 'justify-center' : ''} ${className}`}>
      {center && <GrowStem reverse />}
      <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-sage ring-4 ring-sage/30" />
      <Eyebrow>{children}</Eyebrow>
      <GrowStem />
    </div>
  )
}

/** Stem that grows along a card's bottom edge on hover, finished with a bloom. */
export function HoverStem() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[3px]">
      <span className="absolute inset-0 origin-left scale-x-0 stem-x transition-transform duration-700 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
      <span className="absolute -top-3 right-4 rotate-[-120deg] scale-0 transition duration-500 group-hover:rotate-0 group-hover:scale-100 group-hover:delay-500 group-focus-visible:rotate-0 group-focus-visible:scale-100">
        <Bloom className="size-6 drop-shadow-sm" />
      </span>
    </span>
  )
}

/** Vertical stem that fills as its container scrolls through the viewport. */
export function ScrollStem({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 55%'] })
  const grow = useSpring(scrollYProgress, { stiffness: 220, damping: 32 })
  const top = useTransform(grow, (v) => `${v * 100}%`)
  const rotate = useTransform(grow, [0, 1], [0, 360])
  return (
    <div ref={ref} aria-hidden="true" className={`absolute w-[3px] -translate-x-1/2 rounded-full bg-plum/10 ${className}`}>
      <motion.div style={{ scaleY: grow }} className="absolute inset-0 origin-top rounded-full stem-y" />
      <motion.div style={{ top, rotate }} className="absolute left-1/2 -ml-3 -mt-3">
        <Bloom className="size-6 drop-shadow-[0_4px_8px_rgba(84,43,69,0.3)]" />
      </motion.div>
    </div>
  )
}

/** Circular photo with slowly rotating editorial text around it. */
export function BloomBadge({ src, text, className = 'size-36' }: { src?: string; text: string; className?: string }) {
  const id = useId().replace(/:/g, '')
  const [failed, setFailed] = useState(false)
  return (
    <div className={`relative shrink-0 ${className}`}>
      <motion.svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <path id={`badge-${id}`} d="M50,50 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" />
        </defs>
        <text className="fill-plum font-display text-[7px] font-medium uppercase">
          <textPath href={`#badge-${id}`} textLength="268" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-[17%] overflow-hidden rounded-full border-[3px] border-cream bg-[linear-gradient(180deg,var(--color-pink),var(--color-lavender))] shadow-[0_12px_30px_-12px_rgba(84,43,69,0.5)]">
        {src && !failed && <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />}
      </div>
      <Bloom className="absolute bottom-[8%] right-[6%] size-7 drop-shadow-sm" />
    </div>
  )
}
