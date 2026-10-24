import { motion } from 'framer-motion'
import { ArrowUpRight, Code2, Globe } from 'lucide-react'
import type data from '../portfolioData.json'
import { ChapterMark, HoverStem, Bloom, Eyebrow, ExternalLink, fadeUp, Media, Reveal, sectionShell, StaggerGroup } from './primitives'

type P = typeof data.projects
type Project = P['items'][number]

// On hover-capable devices actions reveal on hover/focus; on touch they stay visible.
const revealOnHover =
  '[@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100'

function ProjectCard({ p, i, labels, viewLabel }: { p: Project; i: number; labels: P; viewLabel: string }) {
  const primary = p.liveUrl || p.githubUrl
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ scale: 1.015 }}
      className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-plum/10 bg-cream ${
        p.featured ? 'md:col-span-2 lg:col-span-4 lg:row-span-2' : 'lg:col-span-2'
      }`}
    >
      <HoverStem />
      <Media src={p.image} alt={p.imageAlt || p.title} seed={i} className={p.featured ? 'h-60 md:h-80 lg:min-h-[18rem] lg:flex-1' : 'h-48'} />
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-2 font-display text-[11px] uppercase tracking-[0.18em] text-muted">
          <span>{String(i + 1).padStart(2, '0')}</span>
          <span aria-hidden="true">·</span>
          <span>{p.category}</span>
          {p.placeholder ? (
            <span className="ml-auto rounded-full border border-dashed border-plum/40 bg-lavender/60 px-2.5 py-0.5 normal-case tracking-normal text-plum">
              {labels.placeholderLabel}
            </span>
          ) : (
            p.status && <span className="ml-auto rounded-full bg-sage/45 px-2.5 py-0.5 normal-case tracking-normal text-ink">{p.status}</span>
          )}
        </div>
        <h3 className={`mt-3 font-display font-semibold tracking-tight text-plum ${p.featured ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>{p.title}</h3>
        <p className="mt-3 leading-relaxed text-ink/75">{p.description}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <li key={t} className="rounded-full bg-rose px-3 py-1 text-xs font-medium text-ink">
              {t}
            </li>
          ))}
        </ul>
        <div className={`mt-auto pt-6 transition duration-300 ${primary ? revealOnHover : ''}`}>
          {primary ? (
            <div className="flex flex-wrap items-center gap-4 border-t border-plum/10 pt-4 text-sm">
              <ExternalLink href={primary} className="inline-flex items-center gap-1 font-medium text-plum underline decoration-pink decoration-2 underline-offset-4">
                {viewLabel} <ArrowUpRight size={15} />
              </ExternalLink>
              {p.githubUrl && (
                <ExternalLink href={p.githubUrl} className="inline-flex items-center gap-1 text-muted hover:text-plum">
                  <Code2 size={15} /> {labels.githubLabel}
                </ExternalLink>
              )}
              {p.liveUrl && (
                <ExternalLink href={p.liveUrl} className="inline-flex items-center gap-1 text-muted hover:text-plum">
                  <Globe size={15} /> {labels.liveLabel}
                </ExternalLink>
              )}
            </div>
          ) : (
            <p className="border-t border-plum/10 pt-4 text-sm italic text-muted">{labels.noLinksLabel}</p>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export function Projects({ projects, viewLabel }: { projects: P; viewLabel: string }) {
  const items = [...projects.items].sort((a, b) => Number(b.featured) - Number(a.featured))
  return (
    <section id="projects" className="relative overflow-hidden bg-[radial-gradient(45%_35%_at_100%_0%,var(--color-peach),transparent),radial-gradient(40%_30%_at_0%_100%,var(--color-mist),transparent)] py-24 md:py-32">
      <div className={sectionShell()}>
        <Reveal className="flex flex-col justify-between gap-6 border-b border-plum/15 pb-10 md:flex-row md:items-end">
          <div>
            <ChapterMark>{projects.eyebrow}</ChapterMark>
            <h2 className="mt-5 font-display text-4xl font-semibold tracking-[-0.03em] text-ink md:text-6xl">
              {projects.titleLead} <span className="font-serif font-normal italic text-plum">{projects.titleAccent}</span>
            </h2>
          </div>
          <p className="max-w-sm text-ink/75">{projects.subtitle}</p>
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-6" gap={0.12}>
          {items.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} labels={projects} viewLabel={viewLabel} />
          ))}
          <motion.aside variants={fadeUp} className="relative flex min-h-64 flex-col justify-between overflow-hidden rounded-[1.75rem] bg-plum p-7 text-cream lg:col-span-2">
            <Bloom className="absolute -bottom-8 -right-8 size-36" petal="var(--color-pink)" core="var(--color-sage)" />
            <p className="font-display text-[11px] uppercase tracking-[0.24em] text-pink">{projects.noteCard.label}</p>
            <div className="relative mt-10 max-w-[15rem]">
              <p className="font-serif text-3xl italic leading-tight">{projects.noteCard.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-cream/80">{projects.noteCard.text}</p>
            </div>
          </motion.aside>
        </StaggerGroup>
      </div>
    </section>
  )
}
