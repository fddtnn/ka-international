import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.js'
import { getProduct, PRODUCTS, defaultConfig, priceOf, configSummary } from '../data/products.js'
import ProductViewer from '../components/three/ProductViewer.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ArmchairCollection from '../components/ArmchairCollection.jsx'
import SEO, { productSchema, breadcrumbSchema } from '../components/SEO.jsx'
import { Page, Reveal, Img, Icon, Stars } from '../components/ui.jsx'

const SWATCH_KEYS = ['fabric', 'leather', 'wood', 'marble', 'metal']

const REVIEWS = [
  { name: { en: 'Noura A.', ar: 'نورة أ.' }, rating: 5, text: { en: 'Exceptional quality — the delivery team assembled everything perfectly.', ar: 'جودة استثنائية — فريق التوصيل ركّب كل شيء بإتقان.' } },
  { name: { en: 'Fahad M.', ar: 'فهد م.' }, rating: 5, text: { en: 'Feels like a piece from a Milan showroom. Worth every riyal.', ar: 'تشعر وكأنها قطعة من معرض في ميلانو. تستحق كل ريال.' } },
  { name: { en: 'Sara K.', ar: 'سارة ك.' }, rating: 4, text: { en: 'Beautiful fabric and finish. Delivery took five weeks as promised.', ar: 'قماش وتشطيب رائعان. استغرق التوصيل خمسة أسابيع كما وُعدنا.' } },
]

export default function ProductPage({ onCartOpen }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, lang, fmtPrice } = useLang()
  const product = getProduct(id)
  const { addToCart, toggleWishlist, wishlist, pushToast, toggleCompare, addRecentlyViewed, recentlyViewed, saveConfig } = useStore()

  const [config, setConfig] = useState(() => (product ? defaultConfig(product) : {}))
  const [tab, setTab] = useState('3d')
  const [imgIdx, setImgIdx] = useState(0)
  const [fbtChecked, setFbtChecked] = useState({})

  useEffect(() => {
    if (product) {
      setConfig(defaultConfig(product))
      setTab('3d')
      setImgIdx(0)
      addRecentlyViewed(product.id)
    }
  }, [id]) // eslint-disable-line

  const price = useMemo(() => (product ? priceOf(product, config) : 0), [product, config])
  const related = useMemo(
    () => PRODUCTS.filter((p) => p.id !== id && p.category === product?.category).slice(0, 4),
    [id, product],
  )
  const fbt = useMemo(() => PRODUCTS.filter((p) => p.id !== id && p.category === product?.category).slice(0, 2), [id, product])
  const recent = useMemo(
    () => recentlyViewed.filter((r) => r !== id).map(getProduct).filter(Boolean).slice(0, 4),
    [recentlyViewed, id],
  )

  if (!product) return <Page className="pt-40 text-center"><p>{t.common.notFound}</p></Page>

  const saved = wishlist.includes(product.id)

  const doAdd = () => {
    addToCart({
      productId: product.id, name: product.name.en, nameAr: product.name.ar,
      image: product.images[0], unitPrice: price, config,
    })
    pushToast(t.common.added)
  }

  const share = async () => {
    const data = { title: `${product.name[lang]} — KA International`, url: window.location.href }
    if (navigator.share) { try { await navigator.share(data) } catch { /* dismissed */ } }
    else { await navigator.clipboard?.writeText(data.url); pushToast('Link copied') }
  }

  const optionEntries = Object.entries(product.options || {})

  return (
    <Page>
      <SEO
        title={product.name[lang]}
        description={product.description[lang]}
        jsonLd={[
          productSchema(product, lang, price),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: t.categories[product.category], path: `/collections/${product.category}` },
            { name: product.name[lang], path: `/product/${product.id}` },
          ]),
        ]}
      />

      <div className="mx-auto max-w-7xl px-5 md:px-8 pt-[104px]">
        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-stone text-xs tracking-[0.18em] uppercase mb-7">
          <Link to="/" className="hover:text-olive transition-colors duration-200">KA</Link>
          <span className="mx-2">/</span>
          <Link to={`/collections/${product.category}`} className="hover:text-olive transition-colors duration-200">{t.categories[product.category]}</Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal">{product.name[lang]}</span>
        </nav>

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 xl:gap-16">
          {/* ============ media ============ */}
          <div>
            <div className="flex gap-2 mb-4">
              {[
                { id: '3d', label: t.product.threeD, icon: <Icon.Cube size={15} /> },
                { id: 'gallery', label: t.product.gallery, icon: <Icon.Grid size={15} /> },
                { id: 'video', label: t.product.video, icon: <Icon.Eye size={15} /> },
              ].map((tb) => (
                <button
                  key={tb.id} onClick={() => setTab(tb.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-colors duration-200 cursor-pointer border ${
                    tab === tb.id ? 'bg-charcoal text-white border-charcoal' : 'border-charcoal/15 text-charcoal/65 hover:border-olive hover:text-olive'
                  }`}
                >
                  {tb.icon}{tb.label}
                </button>
              ))}
            </div>

            {tab === '3d' && (
              <ProductViewer
                product={product} config={config}
                autoRotate camera={product.modelType === 'lamp' ? [1.8, 1.6, 2.4] : [2.4, 1.5, 3.1]}
                targetY={product.modelType === 'lamp' ? 0.8 : 0.42}
                className="aspect-[5/4]"
              />
            )}

            {tab === 'gallery' && (
              <div>
                <motion.div key={imgIdx} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="rounded-luxe overflow-hidden bg-sand aspect-[5/4]">
                  <Img src={product.images[imgIdx]} alt={`${product.name[lang]} — ${imgIdx + 1}`} className="w-full h-full object-cover" />
                </motion.div>
                <div className="flex gap-3 mt-4">
                  {product.images.map((src, i) => (
                    <button
                      key={i} onClick={() => setImgIdx(i)} aria-label={`Image ${i + 1}`}
                      className={`w-20 h-20 rounded-2xl overflow-hidden cursor-pointer border-2 transition-colors duration-200 ${imgIdx === i ? 'border-olive' : 'border-transparent hover:border-charcoal/20'}`}
                    >
                      <Img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === 'video' && (
              <div className="relative rounded-luxe overflow-hidden bg-charcoal-deep aspect-[5/4] flex items-center justify-center">
                <Img src={product.images[1] || product.images[0]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                <div className="relative z-10 flex flex-col items-center gap-4 text-white">
                  <span className="w-20 h-20 rounded-full glass-dark flex items-center justify-center border border-white/20">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></svg>
                  </span>
                  <p className="text-sm text-white/60 tracking-[0.2em] uppercase">{t.product.video}</p>
                </div>
              </div>
            )}
          </div>

          {/* ============ details ============ */}
          <div>
            {product.badge && (
              <span className="inline-block bg-olive/10 text-olive text-[11px] font-medium uppercase tracking-[0.16em] px-3.5 py-1.5 rounded-full mb-4">
                {t.common[product.badge]}
              </span>
            )}
            <h1 className="editorial text-4xl md:text-5xl">{product.name[lang]}</h1>
            <div className="flex items-center gap-3 mt-4">
              <Stars rating={product.rating} />
              <span className="text-sm text-stone">{product.rating} · {product.reviewCount} {t.product.reviews}</span>
            </div>
            <p className="text-charcoal/65 leading-relaxed mt-5">{product.description[lang]}</p>

            <p className="font-display text-3xl mt-7">{fmtPrice(price)}</p>
            <p className="text-xs text-olive mt-1.5 flex items-center gap-1.5"><Icon.Check size={13} /> {t.product.inStock}</p>

            {/* customizer */}
            <div className="mt-8 space-y-6">
              <h2 className="text-xs font-medium uppercase tracking-[0.24em] text-stone">{t.product.customize}</h2>
              {optionEntries.map(([key, opts]) => (
                <fieldset key={key}>
                  <legend className="text-sm font-medium mb-3">
                    {t.product[key] || key}
                    <span className="text-stone font-normal ms-2">
                      {(opts.find((o) => o.id === config[key]) || {})[lang] || ''}
                    </span>
                  </legend>
                  <div className="flex flex-wrap gap-2.5">
                    {opts.map((o) =>
                      SWATCH_KEYS.includes(key) ? (
                        <button
                          key={o.id}
                          onClick={() => setConfig((c) => ({ ...c, [key]: o.id }))}
                          aria-label={o[lang] || o.en}
                          title={`${o[lang] || o.en}${o.delta ? ` +${fmtPrice(o.delta)}` : ''}`}
                          className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-all duration-200 ${
                            config[key] === o.id ? 'border-olive scale-110 shadow-card' : 'border-charcoal/10 hover:border-charcoal/40'
                          }`}
                          style={{ backgroundColor: o.hex }}
                        />
                      ) : (
                        <button
                          key={o.id}
                          onClick={() => setConfig((c) => ({ ...c, [key]: o.id }))}
                          className={`px-4 py-2.5 rounded-full text-sm cursor-pointer border transition-colors duration-200 ${
                            config[key] === o.id ? 'bg-charcoal text-white border-charcoal' : 'border-charcoal/20 text-charcoal/70 hover:border-olive hover:text-olive'
                          }`}
                        >
                          {o[lang] || o.en}
                          {o.delta > 0 && <span className="text-xs opacity-60 ms-1.5">+{fmtPrice(o.delta)}</span>}
                        </button>
                      ),
                    )}
                  </div>
                </fieldset>
              ))}

              <div className="bg-sand rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone">{t.product.configTotal}</p>
                  <p className="text-sm text-charcoal/70 truncate mt-1">{configSummary(product, config, lang)}</p>
                </div>
                <button
                  onClick={() => { saveConfig({ productId: product.id, config, price, date: new Date().toISOString() }); pushToast(t.product.configSaved) }}
                  className="flex items-center gap-2 text-sm text-olive hover:text-olive-light cursor-pointer shrink-0 transition-colors duration-200"
                >
                  <Icon.Save size={16} /> {t.product.saveConfig}
                </button>
              </div>
            </div>

            {/* actions */}
            <div className="mt-8 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={doAdd} className="btn-primary w-full"><Icon.Bag size={16} /> {t.product.addToCart}</button>
                <button onClick={() => { doAdd(); navigate('/checkout') }} className="btn-olive w-full">{t.product.buyNow}</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => { toggleWishlist(product.id); pushToast(saved ? t.common.removedWishlist : t.common.addedWishlist) }}
                  className={`btn-outline w-full !px-3 ${saved ? '!border-olive !text-olive' : ''}`}
                >
                  {saved ? <Icon.HeartFill size={15} /> : <Icon.Heart size={15} />}
                  <span className="hidden xl:inline">{t.product.wishlist}</span>
                </button>
                <Link to={`/ar/${product.id}`} className="btn-outline w-full !px-3">
                  <Icon.AR size={15} /><span className="hidden xl:inline">AR</span>
                </Link>
                <button onClick={share} className="btn-outline w-full !px-3">
                  <Icon.Share size={15} /><span className="hidden xl:inline">{t.product.share}</span>
                </button>
              </div>
              <button
                onClick={() => { toggleCompare(product.id); pushToast(t.common.addedCompare); navigate('/compare') }}
                className="text-sm text-stone hover:text-olive transition-colors duration-200 cursor-pointer flex items-center gap-2 mx-auto pt-1"
              >
                <Icon.Compare size={14} /> {t.product.compare}
              </button>
            </div>

            {/* trust rows */}
            <dl className="mt-9 divide-y hairline border-y hairline">
              {[
                [<Icon.Truck size={17} key="d" />, t.product.delivery, t.product.deliveryTime],
                [<Icon.Shield size={17} key="w" />, t.product.warranty, t.product.warrantyTime],
              ].map(([icon, dt, dd]) => (
                <div key={dt} className="flex items-center gap-4 py-4">
                  <span className="text-olive">{icon}</span>
                  <dt className="text-sm font-medium w-44">{dt}</dt>
                  <dd className="text-sm text-charcoal/60">{dd}</dd>
                </div>
              ))}
            </dl>

            {/* specs */}
            <details className="mt-6 group" open>
              <summary className="flex items-center justify-between cursor-pointer py-3 text-sm font-medium uppercase tracking-[0.18em]">
                {t.product.specifications}
                <Icon.ChevD size={16} className="group-open:rotate-180 transition-transform duration-200" />
              </summary>
              <dl className="text-sm space-y-3 pb-4">
                <div className="flex gap-6"><dt className="w-32 text-stone shrink-0">{t.product.materials}</dt><dd className="text-charcoal/75">{product.materials[lang]}</dd></div>
                <div className="flex gap-6"><dt className="w-32 text-stone shrink-0">{t.product.dimensions}</dt><dd className="text-charcoal/75">{product.dims[lang]}</dd></div>
              </dl>
            </details>
          </div>
        </div>

        {/* ============ frequently bought together ============ */}
        {fbt.length > 0 && (
          <section className="mt-24">
            <Reveal><h2 className="editorial text-3xl md:text-4xl mb-9">{t.product.frequentlyBought}</h2></Reveal>
            <Reveal delay={0.1}>
              <div className="bg-white rounded-luxe shadow-card p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1 grid sm:grid-cols-2 gap-4">
                  {fbt.map((p) => (
                    <label key={p.id} className="flex items-center gap-4 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={fbtChecked[p.id] ?? true}
                        onChange={(e) => setFbtChecked((c) => ({ ...c, [p.id]: e.target.checked }))}
                        className="accent-[#556B2F] w-4 h-4 shrink-0"
                      />
                      <span className="w-16 h-16 rounded-xl overflow-hidden bg-sand shrink-0">
                        <Img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      </span>
                      <span>
                        <span className="block font-display group-hover:text-olive transition-colors duration-200">{p.name[lang]}</span>
                        <span className="text-sm text-stone">{fmtPrice(p.price)}</span>
                      </span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => {
                    fbt.filter((p) => fbtChecked[p.id] ?? true).forEach((p) => {
                      const cfg = defaultConfig(p)
                      addToCart({ productId: p.id, name: p.name.en, nameAr: p.name.ar, image: p.images[0], unitPrice: priceOf(p, cfg), config: cfg })
                    })
                    pushToast(t.common.added)
                    onCartOpen?.()
                  }}
                  className="btn-primary shrink-0"
                >
                  {t.product.addSelected}
                </button>
              </div>
            </Reveal>
          </section>
        )}

        {/* ============ reviews ============ */}
        <section className="mt-24">
          <Reveal>
            <div className="flex items-end justify-between gap-6 mb-9">
              <h2 className="editorial text-3xl md:text-4xl">{t.product.reviews}</h2>
              <div className="flex items-center gap-3">
                <Stars rating={product.rating} size={16} />
                <span className="font-display text-2xl">{product.rating}</span>
              </div>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {REVIEWS.map((r, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <blockquote className="bg-white rounded-luxe shadow-card p-7 h-full">
                  <Stars rating={r.rating} />
                  <p className="text-charcoal/75 leading-relaxed mt-4">{r.text[lang]}</p>
                  <footer className="text-sm text-stone mt-5">— {r.name[lang]}</footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============ the real KA armchair range, cloned from the shop ============ */}
        {product.id === 'brasilia-armchair' && <ArmchairCollection />}

        {/* ============ related ============ */}
        {related.length > 0 && (
          <section className="mt-24">
            <Reveal><h2 className="editorial text-3xl md:text-4xl mb-9">{t.product.related}</h2></Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}

        {/* ============ recently viewed ============ */}
        {recent.length > 0 && (
          <section className="mt-24">
            <Reveal><h2 className="editorial text-3xl md:text-4xl mb-9">{t.product.recentlyViewed}</h2></Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
              {recent.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>

      {/* sticky mobile add-to-cart */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden glass border-t hairline px-5 py-3.5 flex items-center gap-4">
        <div className="min-w-0">
          <p className="font-display truncate">{product.name[lang]}</p>
          <p className="text-sm font-medium">{fmtPrice(price)}</p>
        </div>
        <button onClick={doAdd} className="btn-primary flex-1 !py-3.5">{t.product.addToCart}</button>
      </div>
    </Page>
  )
}
