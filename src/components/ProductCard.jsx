import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import { useStore } from '../store.js'
import { defaultConfig, priceOf } from '../data/products.js'
import { Icon, Img } from './ui.jsx'

export default function ProductCard({ product, index = 0 }) {
  const { t, lang, fmtPrice } = useLang()
  const { toggleWishlist, wishlist, addToCart, pushToast, toggleCompare } = useStore()
  const saved = wishlist.includes(product.id)

  const quickAdd = (e) => {
    e.preventDefault()
    const cfg = defaultConfig(product)
    addToCart({
      productId: product.id, name: product.name.en, nameAr: product.name.ar,
      image: product.images[0], unitPrice: priceOf(product, cfg), config: cfg,
    })
    pushToast(t.common.added)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block cursor-pointer">
        <div className="relative rounded-luxe overflow-hidden bg-sand aspect-[4/5]">
          <Img
            src={product.images[0]}
            alt={product.name[lang]}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          />
          {product.badge && (
            <span className="absolute top-4 start-4 glass text-charcoal text-[11px] font-medium uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full">
              {t.common[product.badge]}
            </span>
          )}
          <div className="absolute top-3.5 end-3.5 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); pushToast(saved ? t.common.removedWishlist : t.common.addedWishlist) }}
              aria-label={t.product.wishlist}
              className={`glass rounded-full p-2.5 shadow-card cursor-pointer transition-colors duration-200 ${saved ? 'text-olive' : 'text-charcoal hover:text-olive'}`}
            >
              {saved ? <Icon.HeartFill size={16} /> : <Icon.Heart size={16} />}
            </button>
            <button
              onClick={(e) => { e.preventDefault(); toggleCompare(product.id); pushToast(t.common.addedCompare) }}
              aria-label={t.product.compare}
              className="glass rounded-full p-2.5 shadow-card text-charcoal hover:text-olive cursor-pointer transition-colors duration-200"
            >
              <Icon.Compare size={16} />
            </button>
          </div>
          {/* quick add */}
          <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <button onClick={quickAdd} className="w-full glass text-charcoal hover:text-olive text-sm font-medium py-3.5 rounded-full shadow-card cursor-pointer transition-colors duration-200 flex items-center justify-center gap-2">
              <Icon.Bag size={15} /> {t.product.addToCart}
            </button>
          </div>
          {/* 3D hint */}
          <span className="absolute bottom-4 start-4 text-charcoal/50 group-hover:opacity-0 transition-opacity duration-300">
            <Icon.Cube size={18} />
          </span>
        </div>
        <div className="pt-5 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg text-charcoal group-hover:text-olive transition-colors duration-200">{product.name[lang]}</h3>
            <p className="text-xs uppercase tracking-[0.18em] text-stone mt-1">{t.categories[product.category]}</p>
          </div>
          <p className="text-sm font-medium text-charcoal whitespace-nowrap pt-0.5">
            <span className="text-stone text-xs me-1">{t.common.from}</span>
            {fmtPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}
