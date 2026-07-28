import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store.js'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/* ---------- SVG icon set (Lucide-style, 24 viewBox) ---------- */
const I = ({ children, size = 20, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>{children}</svg>
)
export const Icon = {
  Bag: (p) => <I {...p}><path d="M6 7V6a6 6 0 0 1 12 0v1"/><path d="M4 7h16l-1.2 13.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 7Z"/></I>,
  Heart: (p) => <I {...p}><path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 1 1 12 6.1a5 5 0 1 1 7.5 6.5Z"/></I>,
  HeartFill: (p) => <I {...p} fill="currentColor" stroke="none"><path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 1 1 12 6.1a5 5 0 1 1 7.5 6.5Z"/></I>,
  User: (p) => <I {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></I>,
  Search: (p) => <I {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></I>,
  Globe: (p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/></I>,
  Menu: (p) => <I {...p}><path d="M4 7h16M4 12h16M4 17h16"/></I>,
  X: (p) => <I {...p}><path d="M6 6l12 12M18 6 6 18"/></I>,
  ArrowR: (p) => <I {...p}><path d="M5 12h14m-6-6 6 6-6 6"/></I>,
  Star: (p) => <I {...p} fill="currentColor" stroke="none"><path d="m12 2 3 6.6 7 .8-5.2 4.8L18.3 21 12 17.4 5.7 21l1.5-6.8L2 9.4l7-.8Z"/></I>,
  Cube: (p) => <I {...p}><path d="m12 2 8 4.5v9L12 22l-8-6.5v-9L12 2Z"/><path d="M12 22V11.5M4 6.5l8 5 8-5"/></I>,
  AR: (p) => <I {...p}><path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><path d="m12 8 4 2.2v4L12 16l-4-1.8v-4L12 8Z"/></I>,
  Share: (p) => <I {...p}><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/></I>,
  Compare: (p) => <I {...p}><path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5M12 1v22"/></I>,
  Truck: (p) => <I {...p}><path d="M1 6h14v11H1zM15 10h4l4 4v3h-8"/><circle cx="6" cy="19" r="1.8"/><circle cx="18" cy="19" r="1.8"/></I>,
  Shield: (p) => <I {...p}><path d="M12 2 4 6v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-4Z"/><path d="m9 12 2 2 4-4"/></I>,
  Plus: (p) => <I {...p}><path d="M12 5v14M5 12h14"/></I>,
  Minus: (p) => <I {...p}><path d="M5 12h14"/></I>,
  Trash: (p) => <I {...p}><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a2 2 0 0 0 2 1.9h6A2 2 0 0 0 17 20l1-13"/></I>,
  Check: (p) => <I {...p}><path d="m4 12.5 5 5L20 6.5"/></I>,
  ChevD: (p) => <I {...p}><path d="m6 9 6 6 6-6"/></I>,
  Filter: (p) => <I {...p}><path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z"/></I>,
  Grid: (p) => <I {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></I>,
  Chart: (p) => <I {...p}><path d="M3 21h18M7 17V9m5 8V5m5 12v-6"/></I>,
  Box: (p) => <I {...p}><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z"/><path d="M3 7.5l9 4.5 9-4.5M12 12v9"/></I>,
  Tag: (p) => <I {...p}><path d="M3 3h8l10 10-8 8L3 11V3Z"/><circle cx="8" cy="8" r="1.6"/></I>,
  Users: (p) => <I {...p}><circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5M16 4.6a3.5 3.5 0 0 1 0 6.8M22 20c0-2.8-1.8-4.6-4.5-5.3"/></I>,
  Palette: (p) => <I {...p}><path d="M12 22a10 10 0 1 1 10-10c0 2.5-1.5 4-4 4h-2a2 2 0 0 0-2 2c0 1 .5 1.5.5 2.5S13.5 22 12 22Z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10.5" cy="6.8" r="1.2"/><circle cx="15.5" cy="6.8" r="1.2"/></I>,
  Home: (p) => <I {...p}><path d="m3 11 9-8 9 8v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9Z"/><path d="M9 22v-8h6v8"/></I>,
  Map: (p) => <I {...p}><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></I>,
  Card: (p) => <I {...p}><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/></I>,
  Bell: (p) => <I {...p}><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/></I>,
  Camera: (p) => <I {...p}><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="14" r="3.5"/></I>,
  Rotate: (p) => <I {...p}><path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6"/></I>,
  Save: (p) => <I {...p}><path d="M5 3h11l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M8 3v5h7V3M8 21v-7h8v7"/></I>,
  Logout: (p) => <I {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></I>,
  Eye: (p) => <I {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></I>,
  Download: (p) => <I {...p}><path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 18v1.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V18"/></I>,
}

/* ---------- image with graceful fallback ---------- */
export function Img({ src, alt = '', className = '', ...p }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  if (failed) {
    return (
      <div className={`bg-gradient-to-br from-charcoal-soft via-charcoal to-charcoal-deep flex items-center justify-center ${className}`} role="img" aria-label={alt}>
        <span className="font-display text-white/25 text-2xl tracking-[0.3em]">KA</span>
      </div>
    )
  }
  return (
    <img
      src={src} alt={alt} loading="lazy" decoding="async"
      onError={() => setFailed(true)} onLoad={() => setLoaded(true)}
      className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
      {...p}
    />
  )
}

/* ---------- scroll reveal ---------- */
export function Reveal({ children, delay = 0, y = 28, className = '', once = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SectionTitle({ eyebrow, title, sub, light = false, center = false }) {
  return (
    <Reveal className={center ? 'text-center' : ''}>
      {eyebrow && (
        <p className={`text-xs font-medium uppercase tracking-[0.28em] mb-4 ${light ? 'text-olive-light' : 'text-olive'}`}>{eyebrow}</p>
      )}
      <h2 className={`editorial text-4xl md:text-5xl ${light ? 'text-white' : 'text-charcoal'}`}>{title}</h2>
      {sub && <p className={`mt-4 text-base md:text-lg max-w-xl ${center ? 'mx-auto' : ''} ${light ? 'text-white/60' : 'text-charcoal/60'}`}>{sub}</p>}
    </Reveal>
  )
}

/* ---------- toasts ---------- */
export function Toasts() {
  const toasts = useStore((s) => s.toasts)
  return (
    <div className="fixed bottom-6 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-[90] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="glass-dark text-white text-sm px-6 py-3 rounded-full shadow-luxe"
        >
          {t.msg}
        </motion.div>
      ))}
    </div>
  )
}

/* ---------- scroll to top on navigation ---------- */
export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

/* ---------- page transition wrapper ---------- */
export function Page({ children, className = '' }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.main>
  )
}

/* ---------- rating stars ---------- */
export function Stars({ rating, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-olive" aria-label={`${rating} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon.Star key={i} size={size} className={i < Math.round(rating) ? 'opacity-100' : 'opacity-20'} />
      ))}
    </span>
  )
}
