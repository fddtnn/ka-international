import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import { useStore, cartCount } from '../store.js'
import { Icon } from './ui.jsx'
import Logo from './Logo.jsx'

export default function Navbar({ onCartOpen }) {
  const { t, lang, setLang } = useLang()
  const count = useStore(cartCount)
  const wishlist = useStore((s) => s.wishlist)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const onDark = pathname === '/' && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const links = [
    { to: '/collections', label: t.nav.collections },
    { to: '/rooms', label: t.nav.rooms },
    { to: '/catalogue', label: t.catalogue.title },
  ]

  const tone = onDark ? 'text-white' : 'text-charcoal'

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass shadow-card' : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-5 md:px-8 h-[76px] flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 lg:hidden">
            <button aria-label="Menu" onClick={() => setOpen(true)} className={`${tone} p-2 -ms-2 cursor-pointer`}>
              <Icon.Menu />
            </button>
          </div>

          <Link to="/" aria-label="KA International" className={`flex items-center ${tone}`}>
            <Logo className="h-11 w-auto" />
          </Link>

          <div className="hidden lg:flex items-center gap-9">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm tracking-wide transition-colors duration-200 ${
                    isActive ? 'text-olive font-medium' : `${onDark ? 'text-white/85 hover:text-white' : 'text-charcoal/75 hover:text-charcoal'}`
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className={`flex items-center gap-1.5 sm:gap-3 ${tone}`}>
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 text-sm p-2 hover:text-olive transition-colors duration-200 cursor-pointer"
              aria-label="Switch language"
            >
              <Icon.Globe size={18} />
              <span className="font-medium">{lang === 'en' ? 'العربية' : 'EN'}</span>
            </button>
            <Link to="/wishlist" aria-label={t.wishlistPage.title} className="relative p-2 hover:text-olive transition-colors duration-200">
              <Icon.Heart size={19} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -end-0.5 bg-olive text-white text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/account" aria-label={t.nav.account} className="p-2 hover:text-olive transition-colors duration-200 hidden sm:block">
              <Icon.User size={19} />
            </Link>
            <button onClick={onCartOpen} aria-label={t.cart.title} className="relative p-2 hover:text-olive transition-colors duration-200 cursor-pointer">
              <Icon.Bag size={19} />
              {count > 0 && (
                <span className="absolute -top-0.5 -end-0.5 bg-olive text-white text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-charcoal/50 z-[60] backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 start-0 w-[84%] max-w-sm bg-ivory z-[70] p-8 flex flex-col rtl:right-0 rtl:left-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <Logo className="h-9 w-auto text-charcoal" />
                <button onClick={() => setOpen(false)} aria-label={t.common.close} className="p-2 cursor-pointer"><Icon.X /></button>
              </div>
              <div className="flex flex-col gap-6">
                {[{ to: '/', label: t.brand }, ...links, { to: '/account', label: t.nav.account }, { to: '/admin', label: t.nav.admin }].map((l) => (
                  <Link key={l.to} to={l.to} className="editorial text-3xl text-charcoal hover:text-olive transition-colors duration-200">
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto pt-8 border-t hairline text-sm text-charcoal/60">© {new Date().getFullYear()} KA International</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
