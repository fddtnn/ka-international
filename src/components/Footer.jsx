import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { useState } from 'react'
import { Icon } from './ui.jsx'
import Logo from './Logo.jsx'

const PAYMENTS = ['mada', 'Visa', 'Mastercard', 'Apple Pay', 'STC Pay', 'Tabby', 'Tamara']

export default function Footer() {
  const { t } = useLang()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <footer className="bg-charcoal-deep text-white mt-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-20">
        {/* newsletter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-14 border-b border-white/10">
          <div>
            <h3 className="editorial text-3xl md:text-4xl">{t.footer.newsletter}</h3>
            <p className="text-white/50 mt-2">{t.footer.newsletterSub}</p>
          </div>
          <form
            className="flex w-full md:w-auto gap-3"
            onSubmit={(e) => { e.preventDefault(); if (email) setDone(true) }}
          >
            <label className="sr-only" htmlFor="nl-email">{t.checkout.email}</label>
            <input
              id="nl-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder={t.checkout.email}
              className="bg-white/5 border border-white/15 rounded-full px-6 py-3.5 text-sm w-full md:w-80 placeholder:text-white/35 focus:border-olive-light focus:outline-none transition-colors duration-200"
            />
            <button type="submit" className="btn bg-olive text-white hover:bg-olive-light px-7 py-3.5 text-sm shrink-0">
              {done ? <Icon.Check size={16} /> : t.footer.subscribe}
            </button>
          </form>
        </div>

        {/* columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 py-14">
          <div className="col-span-2">
            <div className="mb-5">
              <Logo className="h-14 w-auto text-white" />
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">{t.footer.about}</p>
            <div className="flex gap-4 mt-6 text-white/50">
              {['instagram', 'x', 'tiktok', 'snapchat'].map((s) => (
                <a key={s} href="#" aria-label={s} className="hover:text-olive-light transition-colors duration-200">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    {s === 'instagram' && <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor"/></>}
                    {s === 'x' && <path d="M4 4l16 16M20 4 4 20"/>}
                    {s === 'tiktok' && <path d="M9 12a4 4 0 1 0 4 4V4c.8 2.5 2.6 4 5 4.3"/>}
                    {s === 'snapchat' && <path d="M12 3c3 0 4.5 2.2 4.5 5v1.5c1 .3 2 .8 2 1.5 0 1-1.7 1.3-2.3 2.2-.4.7 2 2.3 3.3 2.6-1 1.3-3 1-3.6 1.8-.5.6-1.7 1.4-3.9 1.4s-3.4-.8-3.9-1.4c-.6-.8-2.7-.5-3.6-1.8 1.2-.3 3.7-1.9 3.3-2.6C7.2 12.3 5.5 12 5.5 11c0-.7 1-1.2 2-1.5V8c0-2.8 1.5-5 4.5-5Z"/>}
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <nav aria-label={t.footer.shop}>
            <h4 className="text-xs uppercase tracking-[0.24em] text-white/40 mb-5">{t.footer.shop}</h4>
            <ul className="space-y-3 text-sm text-white/70">
              {Object.entries(t.categories).map(([id, label]) => (
                <li key={id}><Link to={`/collections/${id}`} className="hover:text-olive-light transition-colors duration-200">{label}</Link></li>
              ))}
            </ul>
          </nav>
          <nav aria-label={t.footer.company}>
            <h4 className="text-xs uppercase tracking-[0.24em] text-white/40 mb-5">{t.footer.company}</h4>
            <ul className="space-y-3 text-sm text-white/70">
              {[t.footer.story, t.footer.showrooms, t.footer.careers, t.footer.contact].map((l) => (
                <li key={l}><a href="#" className="hover:text-olive-light transition-colors duration-200">{l}</a></li>
              ))}
            </ul>
          </nav>
          <nav aria-label={t.footer.support}>
            <h4 className="text-xs uppercase tracking-[0.24em] text-white/40 mb-5">{t.footer.support}</h4>
            <ul className="space-y-3 text-sm text-white/70">
              {[t.footer.deliveryReturns, t.footer.warranty, t.footer.care, t.footer.faq].map((l) => (
                <li key={l}><a href="#" className="hover:text-olive-light transition-colors duration-200">{l}</a></li>
              ))}
            </ul>
          </nav>
        </div>

        {/* payments + legal */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2.5">
            {PAYMENTS.map((p) => (
              <span key={p} className="text-[11px] tracking-wide text-white/55 border border-white/15 rounded-md px-3 py-1.5">{p}</span>
            ))}
          </div>
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} KA International. {t.footer.rights} · {t.footer.vatNo}: 3101···· · {t.footer.cr}: 1010····
          </p>
        </div>
      </div>
    </footer>
  )
}
