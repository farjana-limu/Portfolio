import { motion } from 'framer-motion'
import { Brain, Database, LayoutTemplate, Sparkles, Users, Wrench, type LucideIcon } from 'lucide-react'
import type data from '../portfolioData.json'
import { ChapterMark, Eyebrow, fadeUp, Reveal, sectionShell, StaggerGroup } from './primitives'

const icons: Record<string, LucideIcon> = { layout: LayoutTemplate, database: Database, wrench: Wrench, brain: Brain, users: Users }
const pillTones = ['bg-pink/60', 'bg-lavender', 'bg-sage/50', 'bg-rose']
const cardTones = ['border border-plum/10 bg-cream', 'bg-rose', 'bg-mist']

export function Skills({ skills }: { skills: typeof data.skills }) {
  return (
    <section className="relative bg-mint py-24 md:py-32" aria-labelledby="skills-title">
      <div className={sectionShell('grid gap-12 lg:grid-cols-12')}>
        <Reveal className="lg:col-span-4">
          <ChapterMark>{skills.eyebrow}</ChapterMark>
          <h2 id="skills-title" className="mt-5 font-display text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">
            {skills.title}
          </h2>
          <p className="mt-4 max-w-sm text-ink/75">{skills.subtitle}</p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {skills.groups.map((g, gi) => {
            const Icon = icons[g.icon] ?? Sparkles
            return (
              <Reveal key={g.category} className={`rounded-2xl p-6 ${cardTones[gi % cardTones.length]} ${gi === 0 ? 'sm:col-span-2' : ''}`}>
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-3 font-display text-lg font-semibold text-plum">
                    <span className="grid size-9 place-items-center rounded-full bg-cream text-plum">
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    {g.category}
                  </h3>
                  <span className="font-display text-xs text-muted">{String(g.items.length).padStart(2, '0')}</span>
                </div>
                <StaggerGroup className="mt-5 flex flex-wrap gap-2" gap={0.05}>
                  {g.items.map((s, i) => (
                    <motion.span
                      key={s}
                      variants={fadeUp}
                      whileHover={{ scale: 1.08, rotate: i % 2 ? 2 : -2 }}
                      className={`cursor-default rounded-full px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-plum hover:text-cream ${pillTones[(i + gi) % pillTones.length]}`}
                    >
                      {s}
                    </motion.span>
                  ))}
                </StaggerGroup>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
