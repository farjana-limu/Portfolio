import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type data from '../portfolioData.json'
import { useActiveSection } from './primitives'

type Site = typeof data.site
type NavItem = Site['navigation'][number] & { highlight?: boolean }

export function Wordmark({ site, dark = false }: { site: Site; dark?: boolean }) {
  return (
    <span className={`inline-flex items-baseline font-display text-xl font-bold tracking-tight ${dark ? 'text-cream' : 'text-plum'}`}>
      {site.brand}
      <span>{site.brandMark}</span>
      <motion.span
        aria-hidden="true"
        className="ml-1 inline-block size-2 self-center rounded-full bg-pink ring-2 ring-pink/30"
        animate={{ scale: [1, 1.35, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </span>
  )
}

export function Navbar({ site }: { site: Site }) {
  const nav = site.navigation as NavItem[]
  const [active, jumpTo] = useActiveSection(nav.map((n) => n.target).join(','))
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const links = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [bar, setBar] = useState<{ x: number; w: number } | null>(null)
  const activeIsPill = !!nav.find((n) => n.target === active)?.highlight

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Close the mobile menu if the viewport grows to the desktop layout.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // One stem indicator, positioned from the active link's box inside the (fixed) nav, so page
  // scroll never enters the measurement.
  useLayoutEffect(() => {
    const wrap = listRef.current
    if (!wrap) return
    const measure = () => {
      const link = links.current[active]
      if (!link || !wrap.offsetParent) return setBar(null)
      const w = wrap.getBoundingClientRect()
      const r = link.getBoundingClientRect()
      setBar({ x: r.left - w.left + 12, w: Math.max(0, r.width - 24) })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [active])

  const go = (target: string) => {
    jumpTo(target)
    setOpen(false)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b backdrop-blur-md transition-colors duration-300 ${
        scrolled || open ? 'border-plum/10 bg-linen/85' : 'border-transparent bg-linen/40'
      }`}
    >
      <a href="#main" className="sr-only rounded bg-plum px-3 py-2 text-cream focus:not-sr-only focus:absolute focus:left-4 focus:top-3">
        {site.menuLabels.skipToContent}
      </a>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8" aria-label="Primary">
        <a href="#home" aria-label={`${site.brand} — home`}>
          <Wordmark site={site} />
        </a>
        <div ref={listRef} className="relative hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const isActive = active === item.target
              const ref = (el: HTMLAnchorElement | null) => {
                links.current[item.target] = el
              }
              if (item.highlight)
                return (
                  <li key={item.target} className="ml-3">
                    <a
                      ref={ref}
                      href={`#${item.target}`}
                      onClick={() => go(item.target)}
                      aria-current={isActive ? 'true' : undefined}
                      className={`inline-flex rounded-full bg-plum px-4 py-2 text-sm font-medium text-cream ring-offset-2 ring-offset-linen transition hover:bg-ink active:scale-95 ${
                        isActive ? 'ring-2 ring-pink' : ''
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              return (
                <li key={item.target}>
                  <a
                    ref={ref}
                    href={`#${item.target}`}
                    onClick={() => go(item.target)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative px-3 py-2 text-sm transition-colors ${isActive ? 'font-medium text-plum' : 'text-muted hover:text-plum'}`}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
          {bar && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-0.5 left-0 h-[3px] rounded-full stem-x"
              initial={false}
              animate={{ x: bar.x, width: bar.w, opacity: activeIsPill ? 0 : 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 38 }}
            />
          )}
        </div>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border border-plum/15 text-plum md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? site.menuLabels.close : site.menuLabels.open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-plum/10 md:hidden"
          >
            <ul className="flex flex-col px-5 py-4">
              {nav.map((item, i) => (
                <li key={item.target}>
                  <a
                    href={`#${item.target}`}
                    onClick={() => go(item.target)}
                    className={`flex items-baseline gap-3 border-b border-plum/5 py-3 font-display text-2xl ${
                      active === item.target || item.highlight ? 'text-plum' : 'text-ink/80'
                    } ${item.highlight ? 'font-semibold' : ''}`}
                  >
                    <span className="text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
