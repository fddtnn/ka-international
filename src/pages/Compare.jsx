import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.js'
import { getProduct, defaultConfig, priceOf } from '../data/products.js'
import SEO from '../components/SEO.jsx'
import { Page, Reveal, Img, Icon, Stars } from '../components/ui.jsx'

export default function Compare() {
  const { t, lang, fmtPrice } = useLang()
  const { compare, toggleCompare, clearCompare, addToCart, pushToast } = useStore()
  const products = compare.map(getProduct).filter(Boolean)

  const rows = [
    { label: t.comparePage.price, render: (p) => <span className="font-display text-lg">{fmtPrice(p.price)}</span> },
    { label: t.product.reviews, render: (p) => <span className="inline-flex items-center gap-2"><Stars rating={p.rating} /><span className="text-sm text-stone">{p.rating}</span></span> },
    { label: t.product.materials, render: (p) => <span className="text-sm text-charcoal/70">{p.materials[lang]}</span> },
    { label: t.product.dimensions, render: (p) => <span className="text-sm text-charcoal/70">{p.dims[lang]}</span> },
    { label: t.product.delivery, render: () => <span className="text-sm text-charcoal/70">{t.product.deliveryTime}</span> },
    { label: t.product.warranty, render: () => <span className="text-sm text-charcoal/70">{t.product.warrantyTime}</span> },
  ]

  return (
    <Page>
      <SEO title={t.comparePage.title} />
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-[130px]">
        <Reveal className="flex items-end justify-between gap-6 mb-12">
          <h1 className="editorial text-5xl">{t.comparePage.title}</h1>
          {products.length > 0 && (
            <button onClick={clearCompare} className="text-sm text-stone hover:text-olive transition-colors duration-200 cursor-pointer">{t.comparePage.clear}</button>
          )}
        </Reveal>

        {products.length === 0 ? (
          <Reveal className="text-center py-24">
            <Icon.Compare size={44} className="text-stone mx-auto mb-5" />
            <p className="font-display text-2xl">{t.comparePage.empty}</p>
            <Link to="/collections" className="btn-primary mt-8">{t.exploreCollection}</Link>
          </Reveal>
        ) : (
          <Reveal>
            <div className="overflow-x-auto rounded-luxe shadow-card bg-white">
              <table className="w-full min-w-[640px] text-start">
                <thead>
                  <tr>
                    <th className="p-5 w-40" />
                    {products.map((p) => (
                      <th key={p.id} className="p-5 text-start align-top">
                        <div className="relative rounded-2xl overflow-hidden bg-sand aspect-[4/3] mb-4">
                          <Img src={p.images[0]} alt={p.name[lang]} className="absolute inset-0 w-full h-full object-cover" />
                          <button onClick={() => toggleCompare(p.id)} aria-label={t.cart.remove}
                            className="absolute top-2.5 end-2.5 glass rounded-full p-2 text-charcoal hover:text-olive cursor-pointer transition-colors duration-200">
                            <Icon.X size={13} />
                          </button>
                        </div>
                        <Link to={`/product/${p.id}`} className="font-display text-lg hover:text-olive transition-colors duration-200">{p.name[lang]}</Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.label} className={i % 2 ? '' : 'bg-ivory/60'}>
                      <th className="p-5 text-start text-xs uppercase tracking-[0.16em] text-stone font-medium align-top">{row.label}</th>
                      {products.map((p) => <td key={p.id} className="p-5 align-top">{row.render(p)}</td>)}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-5" />
                    {products.map((p) => (
                      <td key={p.id} className="p-5">
                        <button
                          onClick={() => {
                            const cfg = defaultConfig(p)
                            addToCart({ productId: p.id, name: p.name.en, nameAr: p.name.ar, image: p.images[0], unitPrice: priceOf(p, cfg), config: cfg })
                            pushToast(t.common.added)
                          }}
                          className="btn-primary !py-3 w-full">
                          {t.product.addToCart}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>
        )}
      </section>
    </Page>
  )
}
