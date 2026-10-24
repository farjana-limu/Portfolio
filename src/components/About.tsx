import { motion } from 'framer-motion'
import { Download, Quote } from 'lucide-react'
import type data from '../portfolioData.json'
import { BloomBadge, ChapterMark, Bloom, Eyebrow, fadeUp, Reveal, sectionShell, StaggerGroup } from './primitives'

type Props = { about: typeof data.about; personal: typeof data.personal; downloadLabel: string }

function ChipCard({ label, items, className }: { label: string; items: string[]; className: string }) {
  if (!items.length) return null
  return (
    <motion.div variants={fadeUp} className={`rounded-2xl p-5 ${className}`}>
      <Eyebrow className="!text-ink/70">{label}</Eyebrow>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((it) => (
          <li key={it} className="rounded-full bg-cream/80 px-3 py-1 text-sm text-ink">
            {it}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export function About({ about, personal, downloadLabel }: Props) {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className={sectionShell('grid gap-14 lg:grid-cols-12')}>
        <Reveal className="lg:col-span-6">
          <ChapterMark>{about.eyebrow}</ChapterMark>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink md:text-6xl">
            {about.titleLines[0]}
            <span className="mt-1 block font-serif font-normal italic text-plum">{about.titleLines[1]}</span>
          </h2>
          <div className="mt-8 max-w-xl space-y-5 text-lg leading-relaxed text-ink/80">
            {about.bio.map((p, i) => (
              <p
                key={i}
                className={i === 0 ? 'first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.85] first-letter:text-plum' : ''}
              >
                {p}
              </p>
            ))}
          </div>
          <div className="mt-10">
            {about.cvLink ? (
              <motion.a
                href={about.cvLink}
                download
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full bg-plum px-6 py-3.5 text-sm font-medium text-cream"
              >
                <Download size={16} /> {downloadLabel}
              </motion.a>
            ) : (
              <span aria-disabled="true" className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-plum/30 px-6 py-3.5 text-sm text-muted">
                <Download size={16} /> {about.cvUnavailableLabel}
              </span>
            )}
          </div>
        </Reveal>

        <StaggerGroup className="relative grid gap-4 sm:grid-cols-2 lg:col-span-6 lg:pt-10" gap={0.1}>
          <motion.div variants={fadeUp} className="relative overflow-hidden rounded-2xl bg-rose p-6 sm:row-span-2">
            <Bloom className="absolute -right-6 -top-6 size-28 opacity-70" petal="var(--color-pink)" core="var(--color-cream)" />
            <Eyebrow className="!text-ink/70">{about.profileCardLabel}</Eyebrow>
            <BloomBadge src={personal.profileAvatar} text={personal.profileBadgeText} className="mt-6 size-40" />
            <p className="mt-6 font-display text-2xl font-semibold leading-tight text-plum">{personal.name}</p>
            <p className="mt-2 text-sm text-ink/75">{personal.role}</p>
            <p className="mt-6 border-t border-plum/15 pt-4 text-sm text-ink/75">{personal.university}</p>
          </motion.div>

          {about.quote && (
            <motion.figure variants={fadeUp} className="rounded-2xl bg-plum p-6 text-cream">
              <Quote size={20} className="text-pink" aria-hidden="true" />
              <blockquote className="mt-3 font-serif text-2xl italic leading-snug">{about.quote}</blockquote>
            </motion.figure>
          )}
          <ChipCard label={about.interestsLabel} items={about.interests} className="bg-sage/40" />
          <ChipCard label={about.valuesLabel} items={about.values} className="bg-lavender/70 sm:col-span-2" />
          <ChipCard label={about.goalsLabel} items={about.goals as string[]} className="border border-plum/10 bg-cream sm:col-span-2" />
        </StaggerGroup>
      </div>
    </section>
  )
}
