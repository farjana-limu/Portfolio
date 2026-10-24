import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDownRight, MessageCircleHeart } from 'lucide-react'
import { useEffect, useState } from 'react'
import type data from '../portfolioData.json'
import { Bloom, ease, Eyebrow } from './primitives'

type Props = { personal: typeof data.personal; buttons: typeof data.ui.buttons; issueLabel: string }

export function Hero({ personal, buttons, issueLabel }: Props) {
  const reduce = useReducedMotion()
  const roles = personal.typingRoles
  const [roleIdx, setRoleIdx] = useState(0)

  useEffect(() => {
    if (reduce || roles.length < 2) return
    const t = setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 2800)
    return () => clearInterval(t)
  }, [reduce, roles.length])

  const float = (duration: number, y = 12) =>
    reduce ? {} : { animate: { y: [0, -y, 0] }, transition: { duration, repeat: Infinity, ease: 'easeInOut' as const } }

  const lines = personal.heroHeadlineLines
  const exploring = personal.currentlyExploring

  return (
    <section id="home" className="relative overflow-hidden pb-20 pt-28 md:pt-32 lg:min-h-[100svh]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_85%_25%,var(--color-rose),transparent),radial-gradient(40%_40%_at_0%_85%,var(--color-mint),transparent),radial-gradient(35%_30%_at_45%_0%,var(--color-mist),transparent)]" />
      <div className="grid-lines pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-plum/15 bg-cream px-3 py-1.5"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-sage motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-[#6f8466]" />
            </span>
            <Eyebrow className="!text-plum">{personal.heroLabel}</Eyebrow>
          </motion.div>

          <h1 className="mt-8 font-display text-[clamp(3.2rem,10vw,8.5rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-ink">
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-2">
                <motion.span
                  className={`block ${i === lines.length - 1 ? 'font-serif font-normal italic tracking-[-0.02em] text-plum' : ''}`}
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.1 + i * 0.12, duration: 0.75, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6, ease }}>
            <p className="mt-6 max-w-xl font-display text-2xl font-medium leading-snug text-plum md:text-3xl">{personal.heroTagline}</p>
            <p className="mt-4 flex h-6 items-center gap-2 text-sm text-muted">
              <span className="h-px w-8 bg-plum/30" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[roleIdx]}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="font-display uppercase tracking-[0.18em]"
                >
                  {roles[roleIdx]}
                </motion.span>
              </AnimatePresence>
            </p>
            <p className="mt-6 max-w-lg leading-relaxed text-ink/80">{personal.heroIntro}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 rounded-full bg-plum px-6 py-3.5 text-sm font-medium text-cream shadow-[0_10px_30px_-12px_rgba(84,43,69,0.6)]"
              >
                {buttons.exploreWork}
                <ArrowDownRight size={16} className="transition-transform group-hover:-rotate-45" />
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full border border-plum/25 bg-cream px-6 py-3.5 text-sm font-medium text-plum hover:bg-rose"
              >
                <MessageCircleHeart size={16} />
                {buttons.connect}
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Cover composition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease }}
          className="relative mx-auto h-[440px] w-full max-w-[460px] sm:h-[540px] lg:col-span-5"
        >
          <motion.div {...float(8, 10)} aria-hidden="true" className="absolute right-0 top-4 size-56 rounded-[46%_54%_60%_40%] bg-pink sm:size-72" />
          <motion.div {...float(10, 14)} aria-hidden="true" className="absolute bottom-10 left-0 size-40 rounded-full bg-lavender sm:size-52" />
          <div aria-hidden="true" className="dots absolute left-10 top-0 h-32 w-40 opacity-70" />
          <motion.div {...float(7, 8)} aria-hidden="true" className="absolute bottom-0 right-6 h-28 w-48 rounded-t-full bg-sage" />

          <Portrait personal={personal} />

          <Vine />
          <motion.div {...float(9, 10)} className="absolute bottom-[28%] right-[6%]">
            <Bloom className="size-9" petal="var(--color-plum)" core="var(--color-pink)" />
          </motion.div>

          {exploring.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16, rotate: -4 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ delay: 0.7, duration: 0.6, ease }}
              className="absolute bottom-16 left-2 w-52 rounded-2xl border border-plum/10 bg-cream/95 p-4 shadow-[0_20px_40px_-20px_rgba(40,37,43,0.35)] backdrop-blur sm:left-6"
            >
              <Eyebrow>{personal.currentlyExploringLabel}</Eyebrow>
              <ul className="mt-2 space-y-1">
                {exploring.map((item) => (
                  <li key={item} className="flex items-center gap-2 font-display text-sm font-medium text-plum">
                    <span className="size-1.5 rounded-full bg-pink" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          <p className="absolute -bottom-2 right-0 max-w-[14rem] text-right text-[11px] italic leading-snug text-muted">
            {issueLabel} — {personal.heroCaption}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/** Arch "cover" portrait. Regular photos get a palette wash; transparent cutouts pop above the arch. */
function Portrait({ personal }: { personal: Props['personal'] }) {
  const [failed, setFailed] = useState(false)
  const src = failed ? '' : personal.profileImage
  const cutout = personal.profileImageIsCutout
  return (
    <div className="group/portrait absolute bottom-10 left-1/2 h-[68%] w-[60%] -translate-x-1/2">
      <div className="absolute inset-0 rounded-t-full border border-plum/15 bg-cream p-3 shadow-[0_30px_60px_-30px_rgba(84,43,69,0.45)]">
        <div className="relative h-full overflow-hidden rounded-t-full bg-[linear-gradient(180deg,var(--color-pink)_0%,var(--color-rose)_55%,var(--color-mint)_100%)]">
          {(!src || cutout) && (
            <>
              <div className="dots absolute inset-0 opacity-30" aria-hidden="true" />
              <div className="absolute inset-x-5 bottom-0 h-[55%] rounded-t-full bg-lavender/70" aria-hidden="true" />
              <div className="absolute inset-x-12 bottom-0 h-[28%] rounded-t-full bg-sage/70" aria-hidden="true" />
            </>
          )}
          {src && !cutout && (
            <>
              <img
                src={src}
                alt={personal.profileImageAlt}
                onError={() => setFailed(true)}
                className="absolute inset-0 h-full w-full object-cover object-[50%_18%] transition-transform duration-[1400ms] ease-out group-hover/portrait:scale-105"
              />
              {/* Palette wash: tints the grey wall into Campus Bloom pinks and lavenders */}
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(165deg,var(--color-pink)_0%,transparent_50%,var(--color-lavender)_100%)] opacity-80 mix-blend-soft-light" />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-rose)_0%,transparent_38%)] opacity-60 mix-blend-multiply" />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(transparent,rgba(84,43,69,0.35))]" />
            </>
          )}
          {!src && (
            <div className="relative grid h-full place-items-center" aria-hidden="true">
              <div className="text-center">
                <span className="font-serif text-7xl italic text-plum">{personal.initials}</span>
                <p className="mt-2 font-display text-[10px] uppercase tracking-[0.2em] text-plum/70">{personal.profilePlaceholderLabel}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {src && cutout && (
        <img
          src={src}
          alt={personal.profileImageAlt}
          onError={() => setFailed(true)}
          className="absolute bottom-3 left-1/2 h-[118%] w-[112%] max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_18px_24px_rgba(84,43,69,0.3)]"
        />
      )}
    </div>
  )
}

const PETALS = [0, 72, 144, 216, 288]

function SvgBloom({ x, y, size = 1, delay, petal = 'var(--color-pink)', core = 'var(--color-plum)' }: { x: number; y: number; size?: number; delay: number; petal?: string; core?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <motion.g initial={{ scale: 0, rotate: -140 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay, type: 'spring', stiffness: 200, damping: 13 }}>
        {PETALS.map((a) => (
          <ellipse key={a} cx="0" cy="-11" rx="6.5" ry="11" transform={`rotate(${a})`} style={{ fill: petal }} />
        ))}
        <circle r="4.5" style={{ fill: core }} />
      </motion.g>
    </g>
  )
}

function Leaf({ x, y, angle, delay }: { x: number; y: number; angle: number; delay: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <motion.path
        d="M0 0 C 6 -9, 20 -9, 26 0 C 20 9, 6 9, 0 0 Z"
        style={{ fill: 'var(--color-sage)' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay, duration: 0.5, ease }}
      />
    </g>
  )
}

/** A stem that draws itself around the cover arch — the same motif as the page scrollbar. */
function Vine() {
  return (
    <svg viewBox="0 0 460 540" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="hero-vine" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--color-sage)' }} />
          <stop offset="0.55" style={{ stopColor: 'var(--color-pink)' }} />
          <stop offset="1" style={{ stopColor: 'var(--color-plum)' }} />
        </linearGradient>
      </defs>
      <motion.path
        d="M 420 532 C 398 455, 412 385, 392 318 S 362 170, 294 130 S 198 98, 166 70"
        fill="none"
        stroke="url(#hero-vine)"
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, ease, delay: 0.5 }}
      />
      <Leaf x={404} y={430} angle={-150} delay={0.9} />
      <Leaf x={398} y={300} angle={-20} delay={1.1} />
      <Leaf x={340} y={160} angle={-160} delay={1.4} />
      <Leaf x={232} y={104} angle={-60} delay={1.7} />
      <circle cx="392" cy="318" r="5" style={{ fill: 'var(--color-pink)' }} />
      <SvgBloom x={294} y={130} size={0.7} delay={1.6} petal="var(--color-lavender)" />
      <SvgBloom x={166} y={70} size={1.25} delay={2.1} />
    </svg>
  )
}
