import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.js'
import { getProduct } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'
import SEO from '../components/SEO.jsx'
import { Page, Reveal, Icon } from '../components/ui.jsx'

export default function Wishlist() {
  const { t } = useLang()
  const wishlist = useStore((s) => s.wishlist)
  const products = wishlist.map(getProduct).filter(Boolean)

  return (
    <Page>
      <SEO title={t.wishlistPage.title} />
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-[130px]">
        <Reveal><h1 className="editorial text-5xl mb-12">{t.wishlistPage.title}</h1></Reveal>
        {products.length === 0 ? (
          <Reveal className="text-center py-24">
            <Icon.Heart size={44} className="text-stone mx-auto mb-5" />
            <p className="font-display text-2xl">{t.wishlistPage.empty}</p>
            <Link to="/collections" className="btn-primary mt-8">{t.exploreCollection}</Link>
          </Reveal>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>
    </Page>
  )
}
