import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { useStore, cartTotal } from '../store.js'
import { getProduct, configSummary } from '../data/products.js'
import SEO from '../components/SEO.jsx'
import { Page, Reveal, Img, Icon } from '../components/ui.jsx'

export default function CartPage() {
  const { t, lang, fmtPrice } = useLang()
  const { cart, setQty, removeFromCart } = useStore()
  const total = useStore(cartTotal)

  return (
    <Page>
      <SEO title={t.cart.title} />
      <section className="mx-auto max-w-6xl px-5 md:px-8 pt-[130px]">
        <Reveal><h1 className="editorial text-5xl mb-12">{t.cart.title}</h1></Reveal>

        {cart.length === 0 ? (
          <Reveal className="text-center py-24">
            <Icon.Bag size={44} className="text-stone mx-auto mb-5" />
            <p className="font-display text-2xl">{t.cart.empty}</p>
            <p className="text-charcoal/55 mt-2">{t.cart.emptySub}</p>
            <Link to="/collections" className="btn-primary mt-8">{t.cart.continueShopping}</Link>
          </Reveal>
        ) : (
          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-10 items-start">
            <ul className="space-y-6">
              {cart.map((item) => {
                const p = getProduct(item.productId)
                return (
                  <Reveal key={item.key}>
                    <li className="bg-white rounded-luxe shadow-card p-5 flex gap-5">
                      <Link to={`/product/${item.productId}`} className="w-28 h-32 md:w-36 md:h-40 rounded-2xl overflow-hidden bg-sand shrink-0">
                        <Img src={item.image} alt="" className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="font-display text-xl truncate">{lang === 'ar' ? item.nameAr : item.name}</h2>
                            {p && <p className="text-xs text-stone mt-1.5 line-clamp-2">{configSummary(p, item.config, lang)}</p>}
                          </div>
                          <button onClick={() => removeFromCart(item.key)} aria-label={t.cart.remove} className="text-stone hover:text-olive transition-colors duration-200 cursor-pointer shrink-0 h-fit">
                            <Icon.Trash size={17} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-4">
                          <div className="flex items-center border border-charcoal/15 rounded-full">
                            <button onClick={() => setQty(item.key, item.qty - 1)} aria-label="-" className="p-2.5 hover:text-olive cursor-pointer transition-colors duration-200"><Icon.Minus size={13} /></button>
                            <span className="w-7 text-center text-sm">{item.qty}</span>
                            <button onClick={() => setQty(item.key, item.qty + 1)} aria-label="+" className="p-2.5 hover:text-olive cursor-pointer transition-colors duration-200"><Icon.Plus size={13} /></button>
                          </div>
                          <p className="font-medium">{fmtPrice(item.unitPrice * item.qty)}</p>
                        </div>
                      </div>
                    </li>
                  </Reveal>
                )
              })}
            </ul>

            <Reveal delay={0.1} className="lg:sticky lg:top-24">
              <div className="bg-white rounded-luxe shadow-card p-7">
                <h2 className="font-display text-2xl mb-6">{t.checkout.summary}</h2>
                <dl className="space-y-3.5 text-sm">
                  <div className="flex justify-between"><dt className="text-charcoal/60">{t.cart.subtotal}</dt><dd className="font-medium">{fmtPrice(total)}</dd></div>
                  <div className="flex justify-between"><dt className="text-charcoal/60">{t.cart.delivery}</dt><dd className="text-stone">{t.cart.deliveryNote}</dd></div>
                  <div className="flex justify-between pt-4 border-t hairline text-base"><dt className="font-medium">{t.cart.total}</dt><dd className="font-display text-xl">{fmtPrice(total)}</dd></div>
                </dl>
                <Link to="/checkout" className="btn-primary w-full mt-7">{t.cart.checkout}</Link>
                <Link to="/collections" className="btn-outline w-full mt-3">{t.cart.continueShopping}</Link>
              </div>
            </Reveal>
          </div>
        )}
      </section>
    </Page>
  )
}
