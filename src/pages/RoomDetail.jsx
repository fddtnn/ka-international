import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.js'
import { ROOMS, getProduct, defaultConfig, priceOf } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'
import SEO from '../components/SEO.jsx'
import { Page, Reveal, Img, Icon } from '../components/ui.jsx'

export default function RoomDetail() {
  const { id } = useParams()
  const { t, lang, fmtPrice } = useLang()
  const room = ROOMS.find((r) => r.id === id)
  const { addToCart, pushToast } = useStore()
  const [active, setActive] = useState(null)

  const products = useMemo(() => (room ? room.products.map(getProduct).filter(Boolean) : []), [room])
  const total = products.reduce((a, p) => a + p.price, 0)

  if (!room) return <Page className="pt-40 text-center"><p>{t.common.notFound}</p></Page>

  const addAll = () => {
    products.forEach((p) => {
      const cfg = defaultConfig(p)
      addToCart({ productId: p.id, name: p.name.en, nameAr: p.name.ar, image: p.images[0], unitPrice: priceOf(p, cfg), config: cfg })
    })
    pushToast(t.common.added)
  }

  return (
    <Page>
      <SEO title={room.name[lang]} description={room.description[lang]} />

      {/* immersive hero with hotspots */}
      <section className="relative pt-[76px]">
        <div className="relative h-[78vh] min-h-[520px] bg-charcoal overflow-hidden">
          <Img src={room.image} alt={room.name[lang]} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-charcoal/30" />

          {/* hotspots */}
          {room.hotspots.map((h) => {
            const p = getProduct(h.productId)
            if (!p) return null
            const isActive = active === h.productId
            return (
              <div key={h.productId} className="absolute z-20" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
                <button
                  onClick={() => setActive(isActive ? null : h.productId)}
                  aria-label={p.name[lang]}
                  className="relative -translate-x-1/2 -translate-y-1/2 w-9 h-9 cursor-pointer group"
                >
                  <span className="absolute inset-0 rounded-full bg-white/25 animate-ping group-hover:animate-none" style={{ animationDuration: '2.4s' }} />
                  <span className={`absolute inset-1.5 rounded-full border-2 transition-colors duration-200 ${isActive ? 'bg-olive border-olive' : 'bg-white/85 border-white'}`} />
                  <span className={`absolute inset-0 flex items-center justify-center text-[13px] font-medium transition-colors duration-200 ${isActive ? 'text-white' : 'text-charcoal'}`}>+</span>
                </button>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                      className="absolute top-6 start-0 -translate-x-1/4 w-64 glass rounded-3xl shadow-luxe p-4 z-30"
                    >
                      <Link to={`/product/${p.id}`} className="flex gap-3 group">
                        <span className="w-16 h-16 rounded-xl overflow-hidden bg-sand shrink-0">
                          <Img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display truncate group-hover:text-olive transition-colors duration-200">{p.name[lang]}</span>
                          <span className="block text-sm text-charcoal/60 mt-0.5">{fmtPrice(p.price)}</span>
                          <span className="inline-flex items-center gap-1 text-xs text-olive mt-1.5">{t.nav.collections} <Icon.ArrowR size={12} className="rtl:rotate-180" /></span>
                        </span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}

          <div className="absolute bottom-0 inset-x-0 z-10 mx-auto max-w-7xl px-5 md:px-8 pb-12">
            <nav aria-label="Breadcrumb" className="text-white/50 text-xs tracking-[0.2em] uppercase mb-4">
              <Link to="/rooms" className="hover:text-olive-light transition-colors duration-200">{t.rooms.title}</Link>
              <span className="mx-2">/</span>
              <span className="text-olive-light">{room.name[lang]}</span>
            </nav>
            <h1 className="editorial text-white text-5xl md:text-6xl">{room.name[lang]}</h1>
            <p className="text-white/65 mt-4 max-w-xl">{room.description[lang]}</p>
          </div>
        </div>
      </section>

      {/* shop the room bar */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 -mt-8 relative z-30">
        <Reveal>
          <div className="glass rounded-luxe shadow-luxe px-7 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-stone">{t.rooms.roomTotal} · {products.length} {t.rooms.pieces}</p>
              <p className="font-display text-3xl mt-1">{fmtPrice(total)}</p>
            </div>
            <button onClick={addAll} className="btn-primary"><Icon.Bag size={16} /> {t.rooms.addAll}</button>
          </div>
        </Reveal>
      </section>

      {/* pieces */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>
    </Page>
  )
}
