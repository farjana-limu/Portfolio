import { MotionConfig, motion } from 'framer-motion'
import { useEffect } from 'react'
import { About } from './components/About'
import { Academics } from './components/Academics'
import { BloomScrollbar } from './components/BloomScrollbar'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import data from './portfolioData.json'

const themeVars: Record<string, string> = {
  background: '--color-cream',
  linen: '--color-linen',
  mint: '--color-mint',
  mist: '--color-mist',
  peach: '--color-peach',
  pink: '--color-pink',
  rose: '--color-rose',
  plum: '--color-plum',
  sage: '--color-sage',
  lavender: '--color-lavender',
  charcoal: '--color-ink',
  muted: '--color-muted',
}

export default function App() {
  const { site, personal, ui } = data

  useEffect(() => {
    document.title = site.title
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = site.description
    document.documentElement.lang = 'en'
    Object.entries(site.theme).forEach(([k, v]) => themeVars[k] && document.documentElement.style.setProperty(themeVars[k], v))
  }, [site])

  return (
    <MotionConfig reducedMotion="user">
      <Navbar site={site} />
      <BloomScrollbar nav={site.navigation} />
      <motion.main id="main" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Hero personal={personal} buttons={ui.buttons} issueLabel={site.issueLabel} />
        <About about={data.about} personal={personal} downloadLabel={ui.buttons.downloadCv} />
        <Academics academics={data.academics} />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} viewLabel={ui.buttons.viewProject} />
        <Contact contact={data.contact} email={personal.email} avatar={personal.profileAvatar} />
      </motion.main>
      <Footer site={site} footer={ui.footer} name={personal.name} avatar={personal.profileAvatar} contact={data.contact} email={personal.email} backLabel={ui.buttons.backToTop} />
    </MotionConfig>
  )
}
