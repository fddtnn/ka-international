import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import { useStore, cartTotal } from '../store.js'
import SEO from '../components/SEO.jsx'
import { Page, Reveal, Img, Icon } from '../components/ui.jsx'

const CITIES = ['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Makkah', 'Madinah', 'Abha', 'Tabuk']
const FEES = { Riyadh: 0, Jeddah: 250, Dammam: 250, Khobar: 250, Makkah: 350, Madinah: 350, Abha: 450, Tabuk: 450 }

const PAYMENT_METHODS = [
  { id: 'mada', label: 'mada · مدى', hint: 'Debit cards' },
  { id: 'visa', label: 'Visa / Mastercard', hint: 'Credit & debit' },
  { id: 'applepay', label: 'Apple Pay', hint: 'Pay with Face ID' },
  { id: 'stcpay', label: 'STC Pay', hint: 'Wallet' },
  { id: 'tabby', label: 'Tabby', hint: '4 interest-free payments' },
  { id: 'tamara', label: 'Tamara', hint: 'Split in 4. No fees' },
  { id: 'myfatoorah', label: 'MyFatoorah', hint: 'All local methods' },
]

const SAVED_ADDRESSES = [
  { id: 'home', label: 'Home — Al Nakheel, Riyadh', city: 'Riyadh', district: 'Al Nakheel', street: 'Prince Mohammed Rd, Villa 12' },
  { id: 'office', label: 'Office — Al Olaya, Riyadh', city: 'Riyadh', district: 'Al Olaya', street: 'Olaya Towers, Floor 21' },
]

export default function Checkout() {
  const { t, lang, fmtPrice } = useLang()
  const { cart, clearCart } = useStore()
  const subtotal = useStore(cartTotal)

  const [step, setStep] = useState(0)
  const [mode, setMode] = useState('guest')
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: 'Riyadh', district: '', street: '', date: '', window: 'morning' })
  const [payment, setPayment] = useState('mada')
  const [promo, setPromo] = useState('')
  const [promoState, setPromoState] = useState(null) // 'ok' | 'bad'
  const [placed, setPlaced] = useState(null)

  const fee = FEES[form.city] ?? 350
  const discount = promoState === 'ok' ? Math.round(subtotal * 0.1) : 0
  const vat = Math.round((subtotal - discount + fee) * 0.15)
  const total = subtotal - discount + fee + vat

  const steps = [t.checkout.contact, t.checkout.address, t.checkout.schedule, t.checkout.payment]
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const applyPromo = () => setPromoState(promo.trim().toUpperCase() === 'KA10' ? 'ok' : 'bad')

  const canContinue =
    step === 0 ? form.name && form.phone :
    step === 1 ? form.city && form.district && form.street :
    step === 2 ? form.date : true

  const placeOrder = () => {
    setPlaced('KA-' + Math.random().toString(36).slice(2, 8).toUpperCase())
    clearCart()
    window.scrollTo({ top: 0 })
  }

  if (placed) {
    return (
      <Page>
        <SEO title={t.checkout.orderPlaced} />
        <section className="mx-auto max-w-xl px-5 pt-[160px] pb-24 text-center">
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.4 }}
            className="w-20 h-20 mx-auto rounded-full bg-olive text-white flex items-center justify-center mb-8">
            <Icon.Check size={34} />
          </motion.div>
          <h1 className="editorial text-5xl">{t.checkout.orderPlaced}</h1>
          <p className="text-charcoal/60 mt-5 leading-relaxed">{t.checkout.orderPlacedSub}</p>
          <p className="mt-7 text-sm text-stone">{t.checkout.orderNumber}</p>
          <p className="font-display text-2xl tracking-widest mt-1">{placed}</p>
          <Link to="/" className="btn-primary mt-10">{t.checkout.backHome}</Link>
        </section>
      </Page>
    )
  }

  if (cart.length === 0) {
    return (
      <Page>
        <SEO title={t.checkout.title} />
        <section className="mx-auto max-w-xl px-5 pt-[160px] pb-24 text-center">
          <p className="font-display text-2xl">{t.cart.empty}</p>
          <Link to="/collections" className="btn-primary mt-8">{t.cart.continueShopping}</Link>
        </section>
      </Page>
    )
  }

  return (
    <Page>
      <SEO title={t.checkout.title} />
      <section className="mx-auto max-w-6xl px-5 md:px-8 pt-[130px]">
        <Reveal><h1 className="editorial text-5xl mb-10">{t.checkout.title}</h1></Reveal>

        {/* stepper */}
        <Reveal delay={0.05}>
          <ol className="flex items-center gap-2 mb-12 overflow-x-auto no-scrollbar">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
                    i === step ? 'bg-charcoal text-white' : i < step ? 'text-olive cursor-pointer' : 'text-stone'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                    i === step ? 'border-white/40' : i < step ? 'bg-olive text-white border-olive' : 'border-stone/40'
                  }`}>
                    {i < step ? <Icon.Check size={12} /> : i + 1}
                  </span>
                  {s}
                </button>
                {i < steps.length - 1 && <span className="w-8 h-px bg-charcoal/15" />}
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start pb-8">
          {/* form column */}
          <div className="bg-white rounded-luxe shadow-card p-7 md:p-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 && (
                  <div className="space-y-6">
                    <div className="flex gap-2.5">
                      {[['guest', t.checkout.guest], ['login', t.checkout.login]].map(([m, label]) => (
                        <button key={m} onClick={() => setMode(m)}
                          className={`px-5 py-2.5 rounded-full text-sm border transition-colors duration-200 cursor-pointer ${
                            mode === m ? 'bg-charcoal text-white border-charcoal' : 'border-charcoal/20 text-charcoal/65 hover:border-olive hover:text-olive'
                          }`}>
                          {label}
                        </button>
                      ))}
                    </div>
                    <div>
                      <label className="label" htmlFor="co-name">{t.checkout.name}</label>
                      <input id="co-name" className="input" value={form.name} onChange={set('name')} autoComplete="name" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="label" htmlFor="co-email">{t.checkout.email}</label>
                        <input id="co-email" type="email" className="input" value={form.email} onChange={set('email')} autoComplete="email" />
                      </div>
                      <div>
                        <label className="label" htmlFor="co-phone">{t.checkout.phone}</label>
                        <input id="co-phone" type="tel" dir="ltr" placeholder="+966 5X XXX XXXX" className="input" value={form.phone} onChange={set('phone')} autoComplete="tel" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <p className="label">{t.checkout.savedAddresses}</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {SAVED_ADDRESSES.map((a) => (
                          <button key={a.id}
                            onClick={() => setForm((f) => ({ ...f, city: a.city, district: a.district, street: a.street }))}
                            className="text-start border border-charcoal/15 hover:border-olive rounded-2xl px-5 py-4 text-sm transition-colors duration-200 cursor-pointer group">
                            <span className="flex items-center gap-2 font-medium"><Icon.Map size={15} className="text-olive" /> {a.label}</span>
                            <span className="block text-stone mt-1.5">{a.street}</span>
                            <span className="inline-block text-olive text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">{t.checkout.useSaved} →</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="label" htmlFor="co-city">{t.checkout.city}</label>
                        <select id="co-city" className="input cursor-pointer" value={form.city} onChange={set('city')}>
                          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label" htmlFor="co-district">{t.checkout.district}</label>
                        <input id="co-district" className="input" value={form.district} onChange={set('district')} />
                      </div>
                    </div>
                    <div>
                      <label className="label" htmlFor="co-street">{t.checkout.street}</label>
                      <input id="co-street" className="input" value={form.street} onChange={set('street')} autoComplete="street-address" />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="label" htmlFor="co-date">{t.checkout.preferredDate}</label>
                        <input id="co-date" type="date" className="input cursor-pointer" value={form.date} onChange={set('date')}
                          min={new Date(Date.now() + 28 * 864e5).toISOString().slice(0, 10)} />
                      </div>
                      <div>
                        <p className="label">{t.checkout.preferredWindow}</p>
                        <div className="flex flex-wrap gap-2.5">
                          {[['morning', t.checkout.morning], ['afternoon', t.checkout.afternoon], ['evening', t.checkout.evening]].map(([w, label]) => (
                            <button key={w} onClick={() => setForm((f) => ({ ...f, window: w }))}
                              className={`px-4 py-2.5 rounded-full text-sm border transition-colors duration-200 cursor-pointer ${
                                form.window === w ? 'bg-charcoal text-white border-charcoal' : 'border-charcoal/20 text-charcoal/65 hover:border-olive hover:text-olive'
                              }`}>
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-charcoal/55 flex items-center gap-2.5 bg-sand rounded-2xl px-5 py-4">
                      <Icon.Truck size={17} className="text-olive shrink-0" /> {t.product.deliveryTime}
                    </p>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((pm) => (
                      <label key={pm.id}
                        className={`flex items-center gap-4 border rounded-2xl px-5 py-4 cursor-pointer transition-colors duration-200 ${
                          payment === pm.id ? 'border-olive bg-olive/5' : 'border-charcoal/12 hover:border-charcoal/30'
                        }`}>
                        <input type="radio" name="payment" value={pm.id} checked={payment === pm.id}
                          onChange={() => setPayment(pm.id)} className="accent-[#556B2F] w-4 h-4" />
                        <span className="flex-1">
                          <span className="block font-medium text-sm">{pm.label}</span>
                          <span className="block text-xs text-stone mt-0.5">{pm.hint}</span>
                        </span>
                        {payment === pm.id && <Icon.Check size={17} className="text-olive" />}
                      </label>
                    ))}
                    <p className="text-xs text-stone pt-2 flex items-center gap-2"><Icon.Shield size={14} /> {t.checkout.payNote}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-9 pt-6 border-t hairline">
              <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
                className={`text-sm cursor-pointer transition-colors duration-200 ${step === 0 ? 'text-stone/40 cursor-default' : 'text-charcoal/60 hover:text-olive'}`}>
                ← {t.checkout.backStep}
              </button>
              <span className="text-xs text-stone">{t.checkout.step} {step + 1} {t.checkout.of} {steps.length}</span>
              {step < 3 ? (
                <button onClick={() => canContinue && setStep((s) => s + 1)} disabled={!canContinue}
                  className={`btn-primary !py-3 ${!canContinue ? 'opacity-40 pointer-events-none' : ''}`}>
                  {t.checkout.continue}
                </button>
              ) : (
                <button onClick={placeOrder} className="btn-olive !py-3">{t.checkout.placeOrder}</button>
              )}
            </div>
          </div>

          {/* summary column */}
          <aside className="bg-white rounded-luxe shadow-card p-7 lg:sticky lg:top-24">
            <h2 className="font-display text-2xl mb-6">{t.checkout.summary}</h2>
            <ul className="space-y-4 max-h-64 overflow-y-auto pe-1">
              {cart.map((item) => (
                <li key={item.key} className="flex gap-3.5 items-center">
                  <span className="w-14 h-14 rounded-xl overflow-hidden bg-sand shrink-0 relative">
                    <Img src={item.image} alt="" className="w-full h-full object-cover" />
                    <span className="absolute -top-1 -end-1 bg-charcoal text-white text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">{item.qty}</span>
                  </span>
                  <span className="flex-1 text-sm truncate">{lang === 'ar' ? item.nameAr : item.name}</span>
                  <span className="text-sm font-medium whitespace-nowrap">{fmtPrice(item.unitPrice * item.qty)}</span>
                </li>
              ))}
            </ul>

            {/* promo */}
            <div className="flex gap-2.5 mt-6">
              <label className="sr-only" htmlFor="promo">{t.checkout.promo}</label>
              <input id="promo" className="input !py-3" placeholder={`${t.checkout.promo} (KA10)`} value={promo}
                onChange={(e) => { setPromo(e.target.value); setPromoState(null) }} />
              <button onClick={applyPromo} className="btn-outline !py-3 !px-5 shrink-0">{t.checkout.apply}</button>
            </div>
            {promoState === 'ok' && <p className="text-xs text-olive mt-2 flex items-center gap-1.5"><Icon.Check size={13} /> {t.checkout.promoApplied}</p>}
            {promoState === 'bad' && <p className="text-xs text-red-800 mt-2">{t.checkout.promoInvalid}</p>}

            <dl className="space-y-3 text-sm mt-6 pt-6 border-t hairline">
              <div className="flex justify-between"><dt className="text-charcoal/60">{t.cart.subtotal}</dt><dd>{fmtPrice(subtotal)}</dd></div>
              {discount > 0 && <div className="flex justify-between text-olive"><dt>{t.checkout.discount}</dt><dd>−{fmtPrice(discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-charcoal/60">{t.cart.delivery} ({form.city})</dt><dd>{fee === 0 ? t.cart.free : fmtPrice(fee)}</dd></div>
              <div className="flex justify-between"><dt className="text-charcoal/60">{t.checkout.vat}</dt><dd>{fmtPrice(vat)}</dd></div>
              <div className="flex justify-between pt-3.5 border-t hairline text-base"><dt className="font-medium">{t.cart.total}</dt><dd className="font-display text-2xl">{fmtPrice(total)}</dd></div>
            </dl>
          </aside>
        </div>
      </section>
    </Page>
  )
}
