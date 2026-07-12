import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useLang } from '../i18n.jsx'
import { PRODUCTS, CATEGORIES, getProduct, defaultConfig } from '../data/products.js'
import ProductViewer from '../components/three/ProductViewer.jsx'
import ProductCard from '../components/ProductCard.jsx'
import SEO from '../components/SEO.jsx'
import { Reveal, SectionTitle, Img, Page, Icon } from '../components/ui.jsx'

export default function Home() {
  const { t, lang } = useLang()
  const hero = getProduct('meridian-sofa')
  const signature = PRODUCTS.filter((p) => p.signature).slice(0, 4)
  const featured = PRODUCTS.filter((p) => p.badge).slice(0, 4)

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yText = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacityText = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <Page>
      <SEO description="Luxury home furniture and interior design in Saudi Arabia. Interactive 3D collections for living, bedroom, dining, office and outdoor." />

      {/* ============ HERO ============ */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[640px] bg-charcoal-deep overflow-hidden">
        {/* ambience */}
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_20%,#3d4245_0%,#232628_60%,#1b1d1f_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-charcoal-deep to-transparent z-10" />

        {/* 3D sofa */}
        <div className="absolute inset-0">
          <ProductViewer
            product={hero}
            config={defaultConfig(hero)}
            autoRotate float showControls={false} enableZoom={false}
            camera={[4.4, 3.1, 6.9]} targetY={1.6}
            minDistance={5} maxDistance={9}
            className="!bg-transparent !rounded-none w-full h-full"
          />
        </div>

        {/* copy */}
        <motion.div
          style={{ y: yText, opacity: opacityText }}
          className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="text-olive-light text-xs md:text-sm uppercase tracking-[0.4em] mb-6"
          >
            {t.brand}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="editorial text-white text-5xl md:text-7xl lg:text-8xl max-w-5xl"
          >
            {t.tagline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.55 }}
            className="text-white/60 max-w-xl mt-8 text-base md:text-lg leading-relaxed"
          >
            {t.heroStatement}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.75 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-10 pointer-events-auto"
          >
            <Link to="/collections" className="btn-light">{t.exploreCollection}</Link>
            <Link to="/collections" className="btn bg-transparent border border-white/30 text-white hover:border-olive-light hover:text-olive-light px-8 py-4 text-sm">
              {t.shopNow}
            </Link>
          </motion.div>
        </motion.div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-20 flex flex-col items-center gap-3">
          <span className="text-white/40 text-[10px] uppercase tracking-[0.3em]">{t.scroll}</span>
          <div className="relative w-px h-14 bg-white/15 overflow-hidden scroll-line" />
        </div>
      </section>

      {/* ============ FEATURED COLLECTIONS ============ */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-24 md:pt-32">
        <div className="flex items-end justify-between gap-6 mb-12">
          <SectionTitle eyebrow={t.featuredCollections} title={t.featuredSub} />
          <Reveal delay={0.15} className="hidden md:block shrink-0">
            <Link to="/collections" className="btn-outline">{t.viewAll}</Link>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.06} className={i === 0 || i === 3 ? 'md:row-span-2' : ''}>
              <Link
                to={`/collections/${c.id}`}
                className={`group relative block rounded-luxe overflow-hidden bg-sand ${i === 0 || i === 3 ? 'aspect-[3/4] md:h-full md:aspect-auto' : 'aspect-[4/3]'}`}
              >
                <Img src={c.image} alt={t.categories[c.id]} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 flex items-end justify-between">
                  <h3 className="font-display text-white text-2xl md:text-3xl">{t.categories[c.id]}</h3>
                  <span className="text-white/70 group-hover:text-olive-light group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-all duration-300">
                    <Icon.ArrowR size={22} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ SIGNATURE 3D SERIES ============ */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-24 md:pt-32">
        <SectionTitle eyebrow={t.signatureTitle} title={t.signatureSub} center />
        <div className="grid md:grid-cols-2 gap-5 md:gap-7 mt-12">
          {signature.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <div className="group relative">
                <ProductViewer
                  product={p} config={defaultConfig(p)}
                  autoRotate={false} enableZoom={false}
                  camera={p.modelType === 'bed' ? [2.6, 1.7, 3.4] : [2.3, 1.5, 3]}
                  targetY={p.modelType === 'lamp' ? 0.8 : 0.4}
                  className="aspect-[5/4]"
                />
                <Link to={`/product/${p.id}`} className="flex items-center justify-between pt-5 cursor-pointer">
                  <div>
                    <h3 className="font-display text-xl group-hover:text-olive transition-colors duration-200">{p.name[lang]}</h3>
                    <p className="text-xs uppercase tracking-[0.18em] text-stone mt-1">{t.categories[p.category]}</p>
                  </div>
                  <span className="text-charcoal/40 group-hover:text-olive rtl:rotate-180 transition-colors duration-200"><Icon.ArrowR /></span>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ CRAFT / EDITORIAL ============ */}
      <section className="mt-24 md:mt-32 bg-charcoal-deep text-white">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-24 md:py-32 grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="relative rounded-luxe overflow-hidden aspect-[4/5] max-w-lg">
              <Img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80" alt="KA International atelier craftsmanship" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </Reveal>
          <div>
            <SectionTitle light eyebrow="Atelier" title={t.craftTitle} sub={t.craftBody} />
            <Reveal delay={0.2}>
              <div className="grid grid-cols-2 gap-x-8 gap-y-10 mt-14 max-w-md">
                {[['25', t.stats.years], ['140+', t.stats.pieces], ['40+', t.stats.cities], ['300+', t.stats.designers]].map(([n, l]) => (
                  <div key={l}>
                    <p className="font-display text-4xl md:text-5xl text-olive-light">{n}</p>
                    <p className="text-sm text-white/50 mt-2">{l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-24 md:pt-32">
        <div className="flex items-end justify-between gap-6 mb-12">
          <SectionTitle eyebrow={t.featuredCollections} title={t.nav.collections} />
          <Reveal delay={0.15} className="hidden md:block shrink-0">
            <Link to="/collections" className="btn-outline">{t.viewAll}</Link>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* ============ PROJECT CTA ============ */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-24 md:pt-32">
        <Reveal>
          <div className="relative rounded-luxe overflow-hidden bg-charcoal">
            <Img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80" alt="Interior design project by KA International studio" className="absolute inset-0 w-full h-full object-cover opacity-40" />
            <div className="relative z-10 px-8 md:px-16 py-20 md:py-28 max-w-2xl">
              <h2 className="editorial text-white text-4xl md:text-5xl">{t.ctaProject}</h2>
              <p className="text-white/60 mt-5 text-lg">{t.ctaProjectSub}</p>
              <Link to="/rooms" className="btn-olive mt-9">{t.ctaTalk}</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </Page>
  )
}
