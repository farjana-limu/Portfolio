import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import type data from '../portfolioData.json'
import { Bloom } from './primitives'

type Nav = typeof data.site.navigation
type Marker = Nav[number] & { pos: number }

const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight)

/**
 * Replaces the native page scrollbar on mouse/trackpad devices with a growing
 * "stem": the fill tracks progress, a bloom is the draggable thumb, and each
 * chapter is a clickable bud whose label appears when hovering the rail.
 */
export function BloomScrollbar({ nav }: { nav: Nav }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const [markers, setMarkers] = useState<Marker[]>([])
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 320, damping: 34, restDelta: 0.0005 })
  const top = useTransform(smooth, (v) => `${v * 100}%`)
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 540])

  useEffect(() => {
    const compute = () =>
      setMarkers(
        nav.map((n) => {
          const el = document.getElementById(n.target)
          const y = el ? el.getBoundingClientRect().top + window.scrollY : 0
          return { ...n, pos: Math.min(1, Math.max(0, y / maxScroll())) }
        }),
      )
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [nav])

  const scrollToPointer = (clientY: number) => {
    const r = trackRef.current?.getBoundingClientRect()
    if (!r) return
    const ratio = Math.min(1, Math.max(0, (clientY - r.top) / r.height))
    window.scrollTo({ top: ratio * maxScroll(), behavior: 'instant' })
  }

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    e.preventDefault()
    dragging.current = true
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    scrollToPointer(e.clientY)
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => dragging.current && scrollToPointer(e.clientY)
  const onUp = () => {
    dragging.current = false
    setIsDragging(false)
  }

  return (
    <div aria-hidden="true" className="fixed bottom-6 right-1.5 top-20 z-30 hidden w-7 [@media(pointer:fine)]:block">
      <div
        ref={trackRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className={`group/rail relative h-full w-full touch-none select-none ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`}
      >
        {/* stem */}
        <div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-plum/10 transition-[width] group-hover/rail:w-[5px]" />
        <motion.div
          style={{ scaleY: smooth }}
          className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 origin-top rounded-full bg-[linear-gradient(180deg,var(--color-sage),var(--color-pink)_55%,var(--color-plum))] transition-[width] group-hover/rail:w-[5px]"
        />

        {/* chapter buds */}
        {markers.map((m, i) => (
          <a
            key={m.target}
            href={`#${m.target}`}
            tabIndex={-1}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ top: `${m.pos * 100}%` }}
            className="group/bud absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-linen bg-sage transition-transform hover:scale-150"
          >
            <span className="pointer-events-none absolute right-6 top-1/2 flex -translate-y-1/2 translate-x-2 items-center gap-1.5 whitespace-nowrap rounded-full bg-plum px-2.5 py-1 font-display text-[10px] uppercase tracking-[0.16em] text-cream opacity-0 shadow-lg transition duration-300 group-hover/rail:translate-x-0 group-hover/rail:opacity-100 group-hover/bud:bg-pink group-hover/bud:text-plum">
              <span className="text-pink group-hover/bud:text-plum">{String(i + 1).padStart(2, '0')}</span>
              {m.label}
            </span>
          </a>
        ))}

        {/* bloom thumb */}
        <motion.div style={{ top }} className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div style={{ rotate }} className={`transition-transform duration-300 ${isDragging ? 'scale-125' : 'group-hover/rail:scale-110'}`}>
            <Bloom className="size-7 drop-shadow-[0_4px_8px_rgba(84,43,69,0.35)]" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
