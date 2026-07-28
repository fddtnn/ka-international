import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.js'
import { getProduct, configSummary, ROOMS } from '../data/products.js'
import SEO from '../components/SEO.jsx'
import { Page, Reveal, Img, Icon } from '../components/ui.jsx'

const DEMO_ORDERS = [
  { id: 'KA-8H2K4L', date: '2026-06-28', total: 21390, status: 'delivered', items: ['meridian-sofa', 'crescent-sideboard'] },
  { id: 'KA-5R9T2M', date: '2026-07-06', total: 16800, status: 'production', items: ['sahara-dining-table'] },
]

export default function Account() {
  const { t, lang, fmtPrice } = useLang()
  const { savedConfigs, wishlist } = useStore()
  const [tab, setTab] = useState('profile')

  const tabs = [
    ['profile', t.account.profile, Icon.User],
    ['orders', t.account.orders, Icon.Box],
    ['wishlist', t.account.wishlist, Icon.Heart],
    ['designs', t.account.designs, Icon.Palette],
    ['rooms', t.account.rooms, Icon.Home],
    ['notifications', t.account.notifications, Icon.Bell],
    ['addresses', t.account.addresses, Icon.Map],
    ['payments', t.account.payments, Icon.Card],
  ]

  const statusTone = { delivered: 'bg-olive/10 text-olive', production: 'bg-amber-100 text-amber-800', shipped: 'bg-sky-100 text-sky-800' }

  return (
    <Page>
      <SEO title={t.account.title} />
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-[130px]">
        <Reveal className="flex items-center gap-5 mb-12">
          <span className="w-16 h-16 rounded-full bg-charcoal text-white font-display text-2xl flex items-center justify-center">M</span>
          <div>
            <h1 className="editorial text-4xl">{t.account.title}</h1>
            <p className="text-sm text-stone mt-1">{t.account.member}</p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-[260px_1fr] gap-10 items-start">
          <Reveal className="bg-white rounded-luxe shadow-card p-3 lg:sticky lg:top-24">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
              {tabs.map(([id, label, IconC]) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                    tab === id ? 'bg-charcoal text-white' : 'text-charcoal/65 hover:bg-sand'
                  }`}>
                  <IconC size={16} /> {label}
                </button>
              ))}
              <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-charcoal/50 hover:text-olive transition-colors duration-200 cursor-pointer lg:mt-2 lg:border-t hairline">
                <Icon.Logout size={16} /> {t.account.signout}
              </button>
            </nav>
          </Reveal>

          <Reveal delay={0.08} key={tab} className="bg-white rounded-luxe shadow-card p-7 md:p-9 min-h-[420px]">
            {tab === 'profile' && (
              <div className="max-w-md space-y-6">
                <div><label className="label" htmlFor="p-name">{t.checkout.name}</label><input id="p-name" className="input" defaultValue="Mourad K." /></div>
                <div><label className="label" htmlFor="p-email">{t.checkout.email}</label><input id="p-email" className="input" dir="ltr" defaultValue="m@example.com" /></div>
                <div><label className="label" htmlFor="p-phone">{t.checkout.phone}</label><input id="p-phone" className="input" dir="ltr" defaultValue="+966 55 000 0000" /></div>
                <button className="btn-primary">{t.checkout.apply}</button>
              </div>
            )}

            {tab === 'orders' && (
              <div className="space-y-4">
                {DEMO_ORDERS.map((o) => (
                  <div key={o.id} className="border hairline rounded-2xl p-5 flex flex-wrap items-center gap-5">
                    <div className="flex -space-x-3 rtl:space-x-reverse">
                      {o.items.map((pid) => {
                        const p = getProduct(pid)
                        return p && (
                          <span key={pid} className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white bg-sand shadow-card">
                            <Img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                          </span>
                        )
                      })}
                    </div>
                    <div className="flex-1 min-w-32">
                      <p className="font-medium tracking-wide">{o.id}</p>
                      <p className="text-xs text-stone mt-1">{o.date}</p>
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-full capitalize ${statusTone[o.status]}`}>{o.status}</span>
                    <p className="font-display text-lg">{fmtPrice(o.total)}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === 'wishlist' && (
              wishlist.length === 0 ? <p className="text-charcoal/55">{t.wishlistPage.empty}</p> : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {wishlist.map(getProduct).filter(Boolean).map((p) => (
                    <Link key={p.id} to={`/product/${p.id}`} className="flex items-center gap-4 border hairline rounded-2xl p-4 hover:border-olive transition-colors duration-200 group">
                      <span className="w-16 h-16 rounded-xl overflow-hidden bg-sand shrink-0"><Img src={p.images[0]} alt="" className="w-full h-full object-cover" /></span>
                      <span className="min-w-0">
                        <span className="block font-display truncate group-hover:text-olive transition-colors duration-200">{p.name[lang]}</span>
                        <span className="text-sm text-stone">{fmtPrice(p.price)}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )
            )}

            {tab === 'designs' && (
              savedConfigs.length === 0 ? <p className="text-charcoal/55">{t.account.noDesigns}</p> : (
                <div className="space-y-4">
                  {savedConfigs.map((c, i) => {
                    const p = getProduct(c.productId)
                    if (!p) return null
                    return (
                      <div key={i} className="border hairline rounded-2xl p-5 flex items-center gap-5">
                        <span className="w-16 h-16 rounded-xl overflow-hidden bg-sand shrink-0"><Img src={p.images[0]} alt="" className="w-full h-full object-cover" /></span>
                        <div className="flex-1 min-w-0">
                          <p className="font-display">{t.account.configFor} {p.name[lang]}</p>
                          <p className="text-xs text-stone truncate mt-1">{configSummary(p, c.config, lang)}</p>
                        </div>
                        <p className="font-medium whitespace-nowrap">{fmtPrice(c.price)}</p>
                        <Link to={`/product/${p.id}`} className="btn-outline !py-2.5 !px-5 text-sm shrink-0">{t.account.view}</Link>
                      </div>
                    )
                  })}
                </div>
              )
            )}

            {tab === 'rooms' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {ROOMS.slice(0, 2).map((r) => (
                  <Link key={r.id} to={`/rooms/${r.id}`} className="group relative rounded-2xl overflow-hidden aspect-video">
                    <Img src={r.image} alt={r.name[lang]} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                    <span className="absolute bottom-4 start-5 font-display text-white text-xl">{r.name[lang]}</span>
                  </Link>
                ))}
              </div>
            )}

            {tab === 'notifications' && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Icon.Bell size={36} className="text-stone mb-4" />
                <p className="text-charcoal/55">{t.account.notifEmpty}</p>
              </div>
            )}

            {tab === 'addresses' && (
              <div className="space-y-4 max-w-lg">
                {[['Home — Al Nakheel, Riyadh', true], ['Office — Al Olaya, Riyadh', false]].map(([label, isDefault]) => (
                  <div key={label} className="border hairline rounded-2xl p-5 flex items-center gap-4">
                    <Icon.Map size={18} className="text-olive shrink-0" />
                    <p className="flex-1 text-sm">{label}</p>
                    {isDefault && <span className="text-[11px] bg-olive/10 text-olive px-2.5 py-1 rounded-full">{t.account.default}</span>}
                    <button className="text-sm text-stone hover:text-olive cursor-pointer transition-colors duration-200">{t.account.edit}</button>
                  </div>
                ))}
                <button className="btn-outline"><Icon.Plus size={15} /> {t.account.addAddress}</button>
              </div>
            )}

            {tab === 'payments' && (
              <div className="max-w-sm">
                <div className="rounded-luxe bg-charcoal text-white p-7 shadow-luxe">
                  <div className="flex justify-between items-start mb-10">
                    <Icon.Card size={22} className="text-olive-light" />
                    <span className="text-xs tracking-[0.2em] uppercase text-white/50">{t.account.savedCard}</span>
                  </div>
                  <p className="font-display text-xl tracking-[0.3em]" dir="ltr">•••• •••• •••• 4211</p>
                  <p className="text-xs text-white/50 mt-4">{t.account.expires} 09/28 · mada</p>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </Page>
  )
}
