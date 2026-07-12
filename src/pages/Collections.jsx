import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { PRODUCTS, CATEGORIES } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'
import SEO, { breadcrumbSchema } from '../components/SEO.jsx'
import { Page, Reveal, Img } from '../components/ui.jsx'

export default function Collections() {
  const { category } = useParams()
  const { t, lang } = useLang()
  const [sort, setSort] = useState('featured')

  const list = useMemo(() => {
    let items = category ? PRODUCTS.filter((p) => p.category === category) : [...PRODUCTS]
    if (sort === 'low') items.sort((a, b) => a.price - b.price)
    if (sort === 'high') items.sort((a, b) => b.price - a.price)
    if (sort === 'new') items.sort((a, b) => (b.badge === 'new') - (a.badge === 'new'))
    return items
  }, [category, sort])

  const catMeta = CATEGORIES.find((c) => c.id === category)
  const title = category ? t.categories[category] : t.nav.collections

  return (
    <Page>
      <SEO
        title={title}
        description={`${title} — KA International luxury furniture, Saudi Arabia.`}
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: t.nav.collections, path: '/collections' },
          ...(category ? [{ name: title, path: `/collections/${category}` }] : []),
        ])}
      />

      {/* header */}
      <section className="relative pt-[76px]">
        <div className="relative h-[38vh] min-h-[300px] bg-charcoal overflow-hidden">
          {catMeta && <Img src={catMeta.image} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-50" />}
          {!catMeta && <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_0%,#3d4245,#232628)]" />}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
          <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8 h-full flex flex-col justify-end pb-12">
            <nav aria-label="Breadcrumb" className="text-white/50 text-xs tracking-[0.2em] uppercase mb-4">
              <Link to="/" className="hover:text-olive-light transition-colors duration-200">KA</Link>
              <span className="mx-2">/</span>
              <Link to="/collections" className="hover:text-olive-light transition-colors duration-200">{t.nav.collections}</Link>
              {category && (<><span className="mx-2">/</span><span className="text-olive-light">{title}</span></>)}
            </nav>
            <h1 className="editorial text-white text-5xl md:text-6xl">{title}</h1>
          </div>
        </div>
      </section>

      {/* category chips + sort */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-10">
        <Reveal className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/collections"
              className={`px-5 py-2.5 rounded-full text-sm transition-colors duration-200 border ${!category ? 'bg-charcoal text-white border-charcoal' : 'border-charcoal/20 text-charcoal/70 hover:border-olive hover:text-olive'}`}
            >
              {t.common.all}
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to={`/collections/${c.id}`}
                className={`px-5 py-2.5 rounded-full text-sm transition-colors duration-200 border ${category === c.id ? 'bg-charcoal text-white border-charcoal' : 'border-charcoal/20 text-charcoal/70 hover:border-olive hover:text-olive'}`}
              >
                {t.categories[c.id]}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone">{list.length} {t.common.results}</span>
            <label className="sr-only" htmlFor="sort">{t.common.sortBy}</label>
            <select
              id="sort" value={sort} onChange={(e) => setSort(e.target.value)}
              className="input !w-auto !py-2.5 !rounded-full cursor-pointer text-sm"
            >
              <option value="featured">{t.common.sortBy}</option>
              <option value="low">{t.common.priceLow}</option>
              <option value="high">{t.common.priceHigh}</option>
              <option value="new">{t.common.newest}</option>
            </select>
          </div>
        </Reveal>
      </section>

      {/* grid */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-10">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7">
          {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>
    </Page>
  )
}
