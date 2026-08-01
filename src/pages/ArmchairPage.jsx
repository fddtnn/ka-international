import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.js'
import SEO from '../components/SEO.jsx'
import { Page, Reveal, Icon } from '../components/ui.jsx'
import ZoomImage from '../components/ZoomImage.jsx'

// Full product page for the armchair range cloned from the KA shop — the same
// layout the shop uses: gallery, price, variant selects, quantity, add to cart,
// the labelled description sections, then "You might also like".
export default function ArmchairPage() {
  const { slug } = useParams()
  const { t, lang } = useLang()
  const { addToCart, pushToast, toggleWishlist, wishlist } = useStore()

  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)
  const [shot, setShot] = useState(0)
  const [picked, setPicked] = useState({})
  const [qty, setQty] = useState(1)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}armchairs.json`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setFailed(true))
  }, [])

  const product = useMemo(() => data?.products.find((p) => p.slug === slug), [data, slug])

  useEffect(() => {
    setShot(0)
    setQty(1)
    setPicked({})
    window.scrollTo(0, 0)
  }, [slug])

  const others = useMemo(() => {
    if (!data || !product) return []
    return data.products.filter((p) => p.slug !== slug).slice(0, 4)
  }, [data, product, slug])

  if (failed) return <Page className="pt-40 text-center"><p>{t.fabricFinder.loadError}</p></Page>
  if (!data) return <Page className="pt-40 text-center"><p className="text-stone text-sm">{t.armchairs.loading}</p></Page>
  if (!product) return <Page className="pt-40 text-center"><p>{t.common.notFound}</p></Page>

  const img = (i, size = 'large_default') => `${data.imageBase}${product.images[i]}-${size}/${product.slug}.jpg`
  const money = (n) => `${n.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')} ${t.common.sar}`
  const saved = wishlist.includes(product.slug)

  const chosen = product.options
    .map((o) => (picked[o.group] ?? o.values[0]?.id))
    .map((id, i) => product.options[i].values.find((v) => v.id === id)?.label)
    .filter(Boolean)

  const add = () => {
    addToCart({
      productId: product.slug,
      name: product.title,
      nameAr: product.title,
      image: img(0, 'home_default'),
      unitPrice: product.price,
      qty,
      config: Object.fromEntries(product.options.map((o, i) => [o.label, chosen[i]])),
    })
    pushToast(t.common.added)
  }

  return (
    <Page>
      <SEO title={product.title} description={product.teaser} />

      <div className="mx-auto max-w-7xl px-5 md:px-8 pt-[104px] pb-20">
        <nav aria-label="Breadcrumb" className="text-stone text-xs tracking-[0.18em] uppercase mb-7">
          <Link to="/" className="hover:text-olive transition-colors duration-200">KA</Link>
          <span className="mx-2">/</span>
          <Link to="/collections/living" className="hover:text-olive transition-colors duration-200">{t.categories.living}</Link>
          <span className="mx-2">/</span>
          <Link to="/product/brasilia-armchair" className="hover:text-olive transition-colors duration-200">{t.armchairs.title}</Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal normal-case tracking-normal">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 xl:gap-16">
          {/* ============ gallery ============ */}
          <div>
            <motion.div
              key={shot}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45 }}
            >
              {/* product_fich is the shop's largest size — it feeds the magnifier */}
              <ZoomImage
                src={img(shot)}
                zoomSrc={img(shot, 'product_fich')}
                alt={product.title}
                className="rounded-luxe bg-sand aspect-square"
                imgClassName="w-full h-full object-cover"
              />
            </motion.div>
            {product.images.length > 1 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setShot(i)}
                    aria-label={`${product.title} ${i + 1}`}
                    className={`w-20 h-20 rounded-2xl overflow-hidden cursor-pointer border-2 transition-colors duration-200 ${shot === i ? 'border-olive' : 'border-transparent hover:border-charcoal/20'}`}
                  >
                    <img src={img(i, 'home_default')} alt="" loading="lazy" className="w-full h-full object-cover bg-sand" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ============ detail ============ */}
          <div>
            {product.flag && (
              <span className="inline-block bg-olive/12 text-olive text-[11px] uppercase tracking-[0.16em] px-3 py-1.5 rounded-full mb-4">
                {product.flag}
              </span>
            )}
            <h1 className="editorial text-3xl md:text-4xl leading-tight">{product.title}</h1>
            <p className="text-xs uppercase tracking-[0.18em] text-stone mt-2">{product.slug}</p>

            <p className="font-display text-3xl mt-6">{money(product.price)}</p>

            <p className="text-sm leading-relaxed text-charcoal/75 mt-5">{product.teaser}</p>

            {product.options.map((opt) => (
              <label key={opt.group} className="block mt-6">
                <span className="block text-xs uppercase tracking-[0.16em] text-stone mb-2">{opt.label}</span>
                <select
                  value={picked[opt.group] ?? opt.values[0]?.id}
                  onChange={(e) => setPicked({ ...picked, [opt.group]: e.target.value })}
                  className="w-full border hairline rounded-lg px-3 py-3 text-sm bg-white cursor-pointer"
                >
                  {opt.values.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
                </select>
              </label>
            ))}

            <div className="flex items-stretch gap-3 mt-8">
              <div className="flex items-center border hairline rounded-full">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="-" className="px-4 py-3 text-stone hover:text-charcoal cursor-pointer"><Icon.Minus size={15} /></button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} aria-label="+" className="px-4 py-3 text-stone hover:text-charcoal cursor-pointer"><Icon.Plus size={15} /></button>
              </div>
              <button onClick={add} className="btn-primary flex-1 cursor-pointer">{t.product.addToCart}</button>
              <button
                onClick={() => toggleWishlist(product.slug)}
                aria-label={t.nav.wishlist}
                className="px-4 border hairline rounded-full hover:border-olive hover:text-olive transition-colors duration-200 cursor-pointer"
              >
                {saved ? <Icon.HeartFill size={18} /> : <Icon.Heart size={18} />}
              </button>
            </div>

            {/* labelled description sections, as on the shop */}
            <div className="mt-10 border-t hairline">
              {product.sections.map((s, i) => (
                <div key={i} className="py-5 border-b hairline">
                  {s.label && <h2 className="text-xs uppercase tracking-[0.16em] text-stone mb-2">{s.label}</h2>}
                  <p className="text-[13px] leading-relaxed text-charcoal/75">{s.text}</p>
                </div>
              ))}
            </div>

            <a
              href={product.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-olive hover:underline mt-6"
            >
              {t.armchairs.viewInShop} <Icon.ArrowR size={15} />
            </a>
          </div>
        </div>

        {/* ============ you might also like ============ */}
        {others.length > 0 && (
          <section className="mt-24">
            <Reveal><h2 className="editorial text-3xl md:text-4xl mb-9">{t.armchairs.alsoLike}</h2></Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
              {others.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.05}>
                  <Link to={`/armchair/${p.slug}`} className="group block">
                    <div className="rounded-luxe overflow-hidden bg-sand aspect-square">
                      <img
                        src={`${data.imageBase}${p.images[0]}-home_default/${p.slug}.jpg`}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      />
                    </div>
                    <h3 className="mt-3 text-sm leading-snug text-charcoal/85 group-hover:text-olive transition-colors duration-200">{p.name}</h3>
                    <p className="text-sm text-charcoal/60 mt-1">{money(p.price)}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </Page>
  )
}
