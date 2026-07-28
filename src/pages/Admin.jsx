import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { PRODUCTS, CATEGORIES, ROOMS } from '../data/products.js'
import SEO from '../components/SEO.jsx'
import { Page, Img, Icon } from '../components/ui.jsx'
import Logo from '../components/Logo.jsx'

const SALES = [42, 55, 48, 61, 58, 72, 66, 80, 74, 89, 84, 96, 90, 104, 98, 112, 106, 121, 116, 128, 122, 134, 130, 142, 138, 150, 146, 158, 152, 164]
const CAT_REV = [
  ['living', 52], ['bedroom', 25], ['dining', 15], ['fabrics', 8],
]
const DEMO_ORDERS = [
  { id: 'KA-8H2K4L', customer: 'Noura Alqahtani', total: 21390, status: 'delivered', date: '2026-07-10' },
  { id: 'KA-5R9T2M', customer: 'Fahad Almutairi', total: 16800, status: 'production', date: '2026-07-09' },
  { id: 'KA-2W7Y8P', customer: 'Sara Khalid', total: 6800, status: 'shipped', date: '2026-07-08' },
  { id: 'KA-9C4V1N', customer: 'Abdullah Otaibi', total: 31200, status: 'production', date: '2026-07-07' },
  { id: 'KA-7J3F6D', customer: 'Layla Harbi', total: 4600, status: 'delivered', date: '2026-07-05' },
]
const COUPONS = [
  { code: 'KA10', discount: '10%', used: 214, active: true },
  { code: 'RAMADAN25', discount: '25%', used: 892, active: false },
  { code: 'DESIGNER15', discount: '15%', used: 67, active: true },
]
const CITY_FEES = [
  ['Riyadh', 0], ['Jeddah', 250], ['Dammam', 250], ['Khobar', 250], ['Makkah', 350], ['Madinah', 350], ['Abha', 450], ['Tabuk', 450],
]

function LineChart({ data, className = '' }) {
  const w = 560, h = 160, max = Math.max(...data)
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - (v / max) * (h - 16)])
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${path} L${w},${h} L0,${h} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} role="img" aria-label="Sales trend chart">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#556B2F" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#556B2F" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lg)" />
      <path d={path} fill="none" stroke="#556B2F" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4" fill="#556B2F" />
    </svg>
  )
}

export default function Admin() {
  const { t, lang, fmtPrice } = useLang()
  const [view, setView] = useState('dashboard')
  const [query, setQuery] = useState('')
  const [stock, setStock] = useState(() => Object.fromEntries(PRODUCTS.map((p) => [p.id, 5 + (p.id.length % 9)])))

  const nav = [
    ['dashboard', t.admin.dashboard, Icon.Chart],
    ['products', t.admin.products, Icon.Box],
    ['categories', t.admin.categories, Icon.Grid],
    ['models3d', t.admin.models3d, Icon.Cube],
    ['materials', t.admin.materials, Icon.Palette],
    ['inventory', t.admin.inventory, Icon.Tag],
    ['orders', t.admin.orders, Icon.Bag],
    ['customers', t.admin.customers, Icon.Users],
    ['reviews', t.admin.reviews, Icon.Star],
    ['coupons', t.admin.coupons, Icon.Tag],
    ['banners', t.admin.banners, Icon.Eye],
    ['cities', t.admin.cities, Icon.Map],
  ]

  const filtered = useMemo(
    () => PRODUCTS.filter((p) => p.name.en.toLowerCase().includes(query.toLowerCase()) || p.name.ar.includes(query)),
    [query],
  )

  const statusTone = { delivered: 'bg-olive/10 text-olive', production: 'bg-amber-100 text-amber-800', shipped: 'bg-sky-100 text-sky-800' }

  return (
    <Page className="min-h-screen bg-ivory">
      <SEO title={t.admin.title} />
      <div className="flex min-h-screen">
        {/* sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-charcoal-deep text-white p-6 sticky top-0 h-screen overflow-y-auto">
          <Link to="/" className="flex flex-col items-start gap-2 mb-10">
            <Logo className="h-10 w-auto text-white" />
            <span className="text-[10px] uppercase tracking-[0.28em] text-white/50">{t.admin.title}</span>
          </Link>
          <nav className="flex flex-col gap-1 flex-1">
            {nav.map(([id, label, IconC]) => (
              <button key={id} onClick={() => setView(id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors duration-200 cursor-pointer text-start ${
                  view === id ? 'bg-olive text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}>
                <IconC size={15} /> {label}
              </button>
            ))}
          </nav>
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/50 hover:text-olive-light transition-colors duration-200 border-t border-white/10 pt-5 mt-5">
            <Icon.Logout size={15} /> {t.admin.exit}
          </Link>
        </aside>

        {/* main */}
        <main className="flex-1 p-5 md:p-10 overflow-x-hidden">
          {/* mobile nav */}
          <div className="md:hidden flex gap-2 overflow-x-auto no-scrollbar mb-6 -mx-5 px-5">
            {nav.map(([id, label]) => (
              <button key={id} onClick={() => setView(id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap cursor-pointer border transition-colors duration-200 ${
                  view === id ? 'bg-charcoal text-white border-charcoal' : 'border-charcoal/20 text-charcoal/60'
                }`}>
                {label}
              </button>
            ))}
          </div>

          {view === 'dashboard' && (
            <>
              <h1 className="editorial text-4xl mb-9">{t.admin.dashboard}</h1>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {[
                  [t.admin.revenue, fmtPrice(1284500), '+18%'],
                  [t.admin.ordersCount, '164', '+11%'],
                  [t.admin.aov, fmtPrice(7832), '+6%'],
                  [t.admin.conversion, '2.4%', '+0.3'],
                ].map(([label, value, delta]) => (
                  <div key={label} className="bg-white rounded-luxe shadow-card p-6">
                    <p className="text-xs uppercase tracking-[0.16em] text-stone">{label}</p>
                    <p className="font-display text-2xl xl:text-3xl mt-3">{value}</p>
                    <p className="text-xs text-olive mt-2">{delta}</p>
                  </div>
                ))}
              </div>
              <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4 mb-8">
                <div className="bg-white rounded-luxe shadow-card p-7">
                  <h2 className="font-display text-xl mb-5">{t.admin.salesTrend}</h2>
                  <LineChart data={SALES} className="w-full" />
                </div>
                <div className="bg-white rounded-luxe shadow-card p-7">
                  <h2 className="font-display text-xl mb-6">{t.admin.byCategory}</h2>
                  <div className="space-y-4">
                    {CAT_REV.map(([cat, pct]) => (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span>{t.categories[cat]}</span><span className="text-stone">{pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-sand overflow-hidden">
                          <div className="h-full rounded-full bg-olive" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-luxe shadow-card p-7">
                <h2 className="font-display text-xl mb-5">{t.admin.recentOrders}</h2>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="text-start text-xs uppercase tracking-[0.14em] text-stone border-b hairline">
                        <th className="text-start py-3 pe-4 font-medium">#</th>
                        <th className="text-start py-3 pe-4 font-medium">{t.admin.customer}</th>
                        <th className="text-start py-3 pe-4 font-medium">{t.admin.date}</th>
                        <th className="text-start py-3 pe-4 font-medium">{t.admin.status}</th>
                        <th className="text-end py-3 font-medium">{t.admin.amount}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEMO_ORDERS.map((o) => (
                        <tr key={o.id} className="border-b hairline last:border-0">
                          <td className="py-3.5 pe-4 font-medium">{o.id}</td>
                          <td className="py-3.5 pe-4">{o.customer}</td>
                          <td className="py-3.5 pe-4 text-stone">{o.date}</td>
                          <td className="py-3.5 pe-4"><span className={`text-xs px-2.5 py-1 rounded-full capitalize ${statusTone[o.status]}`}>{o.status}</span></td>
                          <td className="py-3.5 text-end font-medium">{fmtPrice(o.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {(view === 'products' || view === 'inventory' || view === 'models3d') && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className="editorial text-4xl">{view === 'inventory' ? t.admin.inventory : view === 'models3d' ? t.admin.models3d : t.admin.products}</h1>
                <div className="flex gap-3">
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.admin.search}
                    className="input !w-56 !py-2.5 !rounded-full" aria-label={t.admin.search} />
                  <button className="btn-primary !py-2.5"><Icon.Plus size={15} /> {t.admin.addProduct}</button>
                </div>
              </div>
              <div className="bg-white rounded-luxe shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-sm">
                    <thead>
                      <tr className="text-xs uppercase tracking-[0.14em] text-stone border-b hairline bg-ivory/60">
                        <th className="text-start p-4 font-medium">{t.admin.products}</th>
                        <th className="text-start p-4 font-medium">{t.admin.categories}</th>
                        <th className="text-start p-4 font-medium">{view === 'models3d' ? '3D' : t.admin.price}</th>
                        <th className="text-start p-4 font-medium">{t.admin.stock}</th>
                        <th className="text-start p-4 font-medium">{t.admin.status}</th>
                        <th className="text-end p-4 font-medium">{t.admin.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p) => (
                        <tr key={p.id} className="border-b hairline last:border-0 hover:bg-ivory/40 transition-colors duration-150">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <span className="w-11 h-11 rounded-xl overflow-hidden bg-sand shrink-0">
                                <Img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                              </span>
                              <span className="font-medium">{p.name[lang]}</span>
                            </div>
                          </td>
                          <td className="p-4 text-stone">{t.categories[p.category]}</td>
                          <td className="p-4">{view === 'models3d'
                            ? <span className="inline-flex items-center gap-1.5 text-olive"><Icon.Cube size={14} /> GLB · USDZ</span>
                            : fmtPrice(p.price)}</td>
                          <td className="p-4">
                            <input type="number" min="0" value={stock[p.id]}
                              onChange={(e) => setStock((s) => ({ ...s, [p.id]: +e.target.value }))}
                              className="w-20 border border-charcoal/15 rounded-lg px-3 py-1.5 focus:border-olive focus:outline-none" />
                          </td>
                          <td className="p-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full ${stock[p.id] > 0 ? 'bg-olive/10 text-olive' : 'bg-red-50 text-red-700'}`}>
                              {stock[p.id] > 0 ? t.admin.active : t.admin.draft}
                            </span>
                          </td>
                          <td className="p-4 text-end">
                            <Link to={`/product/${p.id}`} className="text-stone hover:text-olive transition-colors duration-200 inline-block"><Icon.Eye size={16} /></Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {view === 'categories' && (
            <>
              <h1 className="editorial text-4xl mb-8">{t.admin.categories}</h1>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {CATEGORIES.map((c) => (
                  <div key={c.id} className="bg-white rounded-luxe shadow-card overflow-hidden">
                    <div className="relative aspect-video"><Img src={c.image} alt="" className="absolute inset-0 w-full h-full object-cover" /></div>
                    <div className="p-5 flex items-center justify-between">
                      <p className="font-display text-lg">{t.categories[c.id]}</p>
                      <span className="text-sm text-stone">{PRODUCTS.filter((p) => p.category === c.id).length} {t.common.results}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {view === 'materials' && (
            <>
              <h1 className="editorial text-4xl mb-8">{t.admin.materials} · {t.admin.colors}</h1>
              <div className="bg-white rounded-luxe shadow-card p-7 space-y-8">
                {[
                  [t.product.fabric, 'fabric'], [t.product.leather, 'leather'], [t.product.wood, 'wood'], [t.product.marble, 'marble'], [t.product.metal, 'metal'],
                ].map(([label, key]) => {
                  const list = { fabric: 5, leather: 3, wood: 3, marble: 3, metal: 3 }
                  const src = {
                    fabric: ['#EDE8DF', '#3A3E41', '#5E6B41', '#C9B99A', '#6C7276'],
                    leather: ['#8B5A33', '#4A3428', '#DDD6C8'],
                    wood: ['#5D4433', '#B99C74', '#2A2523'],
                    marble: ['#EFEDE8', '#26262A', '#3E5747'],
                    metal: ['#B08D46', '#26282A', '#9FA6AB'],
                  }[key]
                  return (
                    <div key={key}>
                      <p className="text-sm font-medium mb-3">{label} <span className="text-stone font-normal">({list[key]})</span></p>
                      <div className="flex gap-3">
                        {src.map((hex) => (
                          <span key={hex} className="w-12 h-12 rounded-full border border-charcoal/10 shadow-card" style={{ backgroundColor: hex }} title={hex} />
                        ))}
                        <button className="w-12 h-12 rounded-full border-2 border-dashed border-charcoal/20 text-stone hover:border-olive hover:text-olive transition-colors duration-200 cursor-pointer flex items-center justify-center">
                          <Icon.Plus size={16} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {view === 'orders' && (
            <>
              <h1 className="editorial text-4xl mb-8">{t.admin.orders}</h1>
              <div className="bg-white rounded-luxe shadow-card p-7">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="text-xs uppercase tracking-[0.14em] text-stone border-b hairline">
                        <th className="text-start py-3 pe-4 font-medium">#</th>
                        <th className="text-start py-3 pe-4 font-medium">{t.admin.customer}</th>
                        <th className="text-start py-3 pe-4 font-medium">{t.admin.date}</th>
                        <th className="text-start py-3 pe-4 font-medium">{t.admin.status}</th>
                        <th className="text-end py-3 font-medium">{t.admin.amount}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...DEMO_ORDERS, ...DEMO_ORDERS].map((o, i) => (
                        <tr key={i} className="border-b hairline last:border-0">
                          <td className="py-3.5 pe-4 font-medium">{o.id}</td>
                          <td className="py-3.5 pe-4">{o.customer}</td>
                          <td className="py-3.5 pe-4 text-stone">{o.date}</td>
                          <td className="py-3.5 pe-4"><span className={`text-xs px-2.5 py-1 rounded-full capitalize ${statusTone[o.status]}`}>{o.status}</span></td>
                          <td className="py-3.5 text-end font-medium">{fmtPrice(o.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {view === 'customers' && (
            <>
              <h1 className="editorial text-4xl mb-8">{t.admin.customers}</h1>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {DEMO_ORDERS.map((o) => (
                  <div key={o.customer} className="bg-white rounded-luxe shadow-card p-6 flex items-center gap-4">
                    <span className="w-12 h-12 rounded-full bg-charcoal text-white font-display flex items-center justify-center">{o.customer[0]}</span>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{o.customer}</p>
                      <p className="text-xs text-stone mt-0.5">LTV {fmtPrice(o.total * 2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {view === 'reviews' && (
            <>
              <h1 className="editorial text-4xl mb-8">{t.admin.reviews}</h1>
              <div className="space-y-4">
                {PRODUCTS.slice(0, 5).map((p) => (
                  <div key={p.id} className="bg-white rounded-luxe shadow-card p-5 flex items-center gap-5">
                    <span className="w-12 h-12 rounded-xl overflow-hidden bg-sand shrink-0"><Img src={p.images[0]} alt="" className="w-full h-full object-cover" /></span>
                    <p className="flex-1 font-medium">{p.name[lang]}</p>
                    <span className="inline-flex items-center gap-1 text-olive"><Icon.Star size={14} /> {p.rating}</span>
                    <span className="text-sm text-stone">{p.reviewCount}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {view === 'coupons' && (
            <>
              <h1 className="editorial text-4xl mb-8">{t.admin.coupons}</h1>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {COUPONS.map((c) => (
                  <div key={c.code} className="bg-white rounded-luxe shadow-card p-6">
                    <div className="flex justify-between items-start">
                      <p className="font-display text-2xl tracking-widest">{c.code}</p>
                      <span className={`text-xs px-2.5 py-1 rounded-full ${c.active ? 'bg-olive/10 text-olive' : 'bg-sand text-stone'}`}>
                        {c.active ? t.admin.active : t.admin.draft}
                      </span>
                    </div>
                    <p className="text-sm text-stone mt-3">−{c.discount} · {c.used}×</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {view === 'banners' && (
            <>
              <h1 className="editorial text-4xl mb-8">{t.admin.banners}</h1>
              <div className="space-y-4">
                {ROOMS.slice(0, 3).map((r, i) => (
                  <div key={r.id} className="bg-white rounded-luxe shadow-card p-4 flex items-center gap-5">
                    <span className="w-32 h-16 rounded-xl overflow-hidden bg-sand shrink-0 relative">
                      <Img src={r.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    </span>
                    <p className="flex-1 font-medium">{r.name[lang]}</p>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${i === 0 ? 'bg-olive/10 text-olive' : 'bg-sand text-stone'}`}>
                      {i === 0 ? t.admin.active : t.admin.draft}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {view === 'cities' && (
            <>
              <h1 className="editorial text-4xl mb-8">{t.admin.cities} · {t.admin.fees}</h1>
              <div className="bg-white rounded-luxe shadow-card p-7 max-w-2xl">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.14em] text-stone border-b hairline">
                      <th className="text-start py-3 font-medium">{t.admin.cities}</th>
                      <th className="text-end py-3 font-medium">{t.admin.fees}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CITY_FEES.map(([city, fee]) => (
                      <tr key={city} className="border-b hairline last:border-0">
                        <td className="py-3.5">{city}</td>
                        <td className="py-3.5 text-end font-medium">{fee === 0 ? t.cart.free : fmtPrice(fee)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </Page>
  )
}
