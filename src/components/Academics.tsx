import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import type data from '../portfolioData.json'
import { ScrollStem, ChapterMark, Eyebrow, fadeUp, Reveal, sectionShell, StaggerGroup } from './primitives'

export function Academics({ academics }: { academics: typeof data.academics }) {
  return (
    <section id="academics" className="relative border-y border-plum/10 bg-mist py-24 md:py-32">
      <div className="dots pointer-events-none absolute right-0 top-0 h-48 w-64 opacity-40" />
      <div className={sectionShell('grid gap-12 lg:grid-cols-12')}>
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <ChapterMark>{academics.eyebrow}</ChapterMark>
            <h2 className="mt-5 font-display text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">{academics.title}</h2>
            <p className="mt-4 font-serif text-xl italic text-plum">{academics.subtitle}</p>
          </div>
        </Reveal>

        <StaggerGroup className="relative lg:col-span-8" gap={0.15}>
          <ScrollStem className="bottom-0 left-5 top-12" />
          <ol className="space-y-10">
            {academics.entries.map((e, i) => {
              const achievements = e.achievements as string[]
              return (
                <motion.li key={e.id} variants={fadeUp} className="relative pl-16">
                  <span
                    className={`absolute left-0 top-0 grid size-10 place-items-center rounded-full border font-display text-xs font-semibold ${
                      e.current ? 'border-plum bg-pink text-plum' : 'border-plum/20 bg-cream text-muted'
                    }`}
                  >
                    {e.current && <span className="absolute inset-0 animate-ping rounded-full bg-pink/60 motion-reduce:animate-none" />}
                    <span className="relative">{String(i + 1).padStart(2, '0')}</span>
                  </span>
                  <article className="rounded-2xl border border-plum/10 bg-cream p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-sm font-medium text-muted">{e.year}</span>
                      {e.current && (
                        <span className="rounded-full bg-sage/45 px-2.5 py-0.5 font-display text-[11px] font-medium uppercase tracking-[0.16em] text-ink">
                          {academics.currentLabel}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-plum md:text-3xl">{e.degree}</h3>
                    <p className="mt-2 flex items-center gap-2 text-ink/80">
                      <GraduationCap size={16} className="text-plum" aria-hidden="true" /> {e.institution}
                    </p>
                    {e.description && <p className="mt-5 max-w-2xl leading-relaxed text-ink/75">{e.description}</p>}
                    {e.subjects.length > 0 && (
                      <div className="mt-6 border-t border-dashed border-plum/15 pt-5">
                        <Eyebrow>{academics.subjectsLabel}</Eyebrow>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {e.subjects.map((s) => (
                            <li key={s} className="rounded-full border border-plum/15 px-3 py-1 text-sm text-ink">
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {achievements.length > 0 && (
                      <div className="mt-5">
                        <Eyebrow>{academics.achievementsLabel}</Eyebrow>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-ink/80">
                          {achievements.map((a) => (
                            <li key={a}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                </motion.li>
              )
            })}
          </ol>
        </StaggerGroup>
      </div>
    </section>
  )
}
