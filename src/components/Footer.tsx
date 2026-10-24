import { ArrowUp } from 'lucide-react'
import type data from '../portfolioData.json'
import { ChannelIcon, resolveChannels } from './channels'
import { Wordmark } from './Navbar'
import { Bloom } from './primitives'

type Props = {
  site: typeof data.site
  footer: typeof data.ui.footer
  name: string
  avatar?: string
  contact: typeof data.contact
  email: string
  backLabel: string
}

export function Footer({ site, footer, name, avatar, contact, email, backLabel }: Props) {
  const links = resolveChannels(contact.channels, email).filter((c) => c.href)
  return (
    <footer className="relative overflow-hidden bg-plum text-cream">
      <div className="relative h-[3px] stem-x" aria-hidden="true" />
      <div className="dots pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
      <Bloom className="pointer-events-none absolute -right-10 -top-10 size-44 opacity-25" petal="var(--color-pink)" core="var(--color-sage)" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <div className="flex items-center gap-3">
            {avatar && <img src={avatar} alt="" loading="lazy" className="size-11 rounded-full object-cover ring-2 ring-pink ring-offset-2 ring-offset-plum" />}
            <Wordmark site={site} dark />
          </div>
          <p className="mt-4 flex items-center gap-2 font-serif text-2xl italic text-pink">
            <Bloom className="size-5" /> {footer.message}
          </p>
          <p className="mt-4 text-sm text-cream/70">
            © {new Date().getFullYear()} · {footer.copyrightPrefix} {name}
          </p>
        </div>
        <div className="flex flex-col items-start gap-5 md:items-end">
          {links.length > 0 && (
            <ul className="flex gap-2" aria-label={footer.socialLabel}>
              {links.map((c) => (
                <li key={c.id}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    aria-label={c.label}
                    title={c.label}
                    className="grid size-10 place-items-center rounded-full border border-cream/25 text-cream transition hover:-translate-y-0.5 hover:border-pink hover:bg-pink hover:text-plum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink"
                  >
                    <ChannelIcon id={c.id} size={17} />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <a href="#home" className="inline-flex items-center gap-2 text-sm font-medium text-cream hover:text-pink">
            <ArrowUp size={15} /> {backLabel}
          </a>
        </div>
      </div>
    </footer>
  )
}
