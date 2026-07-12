import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { useStore, cartTotal } from '../store.js'
import { Icon, Img } from './ui.jsx'

export default function CartDrawer({ open, onClose }) {
  const { t, lang, fmtPrice } = useLang()
  const { cart, setQty, removeFromCart } = useStore()
  const total = useStore(cartTotal)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/50 z-[60] backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 end-0 w-full max-w-md bg-ivory z-[70] flex flex-col shadow-luxe"
            aria-label={t.cart.title}
          >
            <div className="flex items-center justify-between px-7 py-6 border-b hairline">
              <h2 className="font-display text-2xl">{t.cart.title}</h2>
              <button onClick={onClose} aria-label={t.common.close} className="p-2 hover:text-olive transition-colors duration-200 cursor-pointer">
                <Icon.X />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
                <Icon.Bag size={40} className="text-stone" />
                <p className="font-display text-xl">{t.cart.empty}</p>
                <p className="text-sm text-charcoal/55">{t.cart.emptySub}</p>
                <Link to="/collections" onClick={onClose} className="btn-primary mt-4">{t.cart.continueShopping}</Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-7 py-5 space-y-6">
                  {cart.map((item) => (
                    <li key={item.key} className="flex gap-4">
                      <Link to={`/product/${item.productId}`} onClick={onClose} className="w-24 h-28 rounded-2xl overflow-hidden bg-sand shrink-0">
                        <Img src={item.image} alt="" className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <h3 className="font-display text-base truncate">{lang === 'ar' ? item.nameAr : item.name}</h3>
                          <button onClick={() => removeFromCart(item.key)} aria-label={t.cart.remove} className="text-stone hover:text-olive transition-colors duration-200 cursor-pointer shrink-0">
                            <Icon.Trash size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-charcoal/70 mt-1">{fmtPrice(item.unitPrice)}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-charcoal/15 rounded-full">
                            <button onClick={() => setQty(item.key, item.qty - 1)} aria-label="-" className="p-2 hover:text-olive cursor-pointer transition-colors duration-200"><Icon.Minus size={13} /></button>
                            <span className="w-6 text-center text-sm">{item.qty}</span>
                            <button onClick={() => setQty(item.key, item.qty + 1)} aria-label="+" className="p-2 hover:text-olive cursor-pointer transition-colors duration-200"><Icon.Plus size={13} /></button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="px-7 py-6 border-t hairline space-y-4 bg-white/60">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/60">{t.cart.subtotal}</span>
                    <span className="font-medium">{fmtPrice(total)}</span>
                  </div>
                  <Link to="/checkout" onClick={onClose} className="btn-primary w-full">{t.cart.checkout}</Link>
                  <Link to="/cart" onClick={onClose} className="btn-outline w-full">{t.cart.title}</Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
