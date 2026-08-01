import { useEffect, useMemo, useState } from 'react'
import { useLang } from '../i18n.jsx'
import { Reveal, Icon } from './ui.jsx'

// The armchair range cloned from ka-international.com/shop/en/armchairs.
// Prices are converted from the shop's EUR to SAR at build time; the images are
// served from the shop itself, so nothing is duplicated into this repo.
const PER_PAGE = 12

export default function ArmchairCollection() {
  const { t, lang } = useLang()
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState('name')
  const [open, setOpen] = useState(null) // product shown in the detail overlay

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}armchairs.json`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setFailed(true))
  }, [])

  const sorted = useMemo(() => {
    if (!data) return []
    const list = [...data.products]
    if (sort === 'priceLow') list.sort((a, b) => a.price - b.price)
    else if (sort === 'priceHigh') list.sort((a, b) => b.price - a.price)
    else list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [data, sort])

  if (failed || (data && !data.products.length)) return null

  const pages = Math.ceil(sorted.length / PER_PAGE)
  const items = sorted.slice(page * PER_PAGE, (page + 1) * PER_PAGE)
  const imageUrl = (p, i = 0, size = 'home_default') =>
    `${data.imageBase}${p.images[i]}-${size}/${p.slug}.jpg`
  const money = (n) => `${n.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')} ${t.common.sar}`

  return (
    <section className="mt-24">
      <Reveal className="flex flex-wrap items-end justify-between gap-5 mb-9">
        <div>
          <h2 className="editorial text-3xl md:text-4xl">{t.armchairs.title}</h2>
          <p className="text-stone text-sm mt-2">
            {data ? t.armchairs.count.replace('{n}', data.products.length) : t.armchairs.loading}
          </p>
        </div>
        {data && (
          <label className="flex items-center gap-2 text-sm">
            <span className="text-stone">{t.common.sortBy}</span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(0) }}
              className="border hairline rounded-full px-4 py-2 bg-white cursor-pointer"
            >
              <option value="name">{t.armchairs.sortName}</option>
              <option value="priceLow">{t.common.priceLow}</option>
              <option value="priceHigh">{t.common.priceHigh}</option>
            </select>
          </label>
        )}
      </Reveal>

      {!data ? (
        <div className="py-14 text-center text-sm text-stone">{t.armchairs.loading}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
            {items.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.04}>
                <button onClick={() => setOpen(p)} className="group w-full text-start cursor-pointer">
                  <div className="relative rounded-luxe overflow-hidden bg-sand aspect-square">
                    <img
                      src={imageUrl(p)}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                    {/* second shot on hover, exactly as the shop's cards behave */}
                    {p.images[1] && (
                      <img
                        src={imageUrl(p, 1)}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}
                    {p.flag && (
                      <span className="absolute top-3 start-3 bg-olive text-white text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-full">
                        {p.flag}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-sm leading-snug text-charcoal/85 group-hover:text-olive transition-colors duration-200">{p.name}</h3>
                  <p className="text-sm text-charcoal/60 mt-1">{money(p.price)}</p>
                </button>
              </Reveal>
            ))}
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-9 text-sm">
              <PageBtn disabled={page === 0} onClick={() => setPage(page - 1)}>«</PageBtn>
              {Array.from({ length: pages }, (_, n) => (
                <PageBtn key={n} activeState={n === page} onClick={() => setPage(n)}>{n + 1}</PageBtn>
              ))}
              <PageBtn disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>»</PageBtn>
            </div>
          )}
        </>
      )}

      {open && <Detail product={open} data={data} money={money} onClose={() => setOpen(null)} />}
    </section>
  )
}

function Detail({ product, data, money, onClose }) {
  const { t } = useLang()
  const [shot, setShot] = useState(0)
  const [picked, setPicked] = useState({})

  const imageUrl = (i, size = 'large_default') =>
    `${data.imageBase}${product.images[i]}-${size}/${product.slug}.jpg`

  return (
    <div onClick={onClose} className="fixed inset-0 z-[80] bg-charcoal/60 flex items-start md:items-center justify-center p-3 md:p-8 overflow-auto">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-luxe shadow-card w-full max-w-5xl my-auto">
        <div className="flex items-start justify-between gap-4 p-5 border-b hairline">
          <div>
            <h3 className="font-display text-xl">{product.title}</h3>
            <p className="text-xs uppercase tracking-[0.16em] text-stone mt-1">{product.slug}</p>
          </div>
          <button onClick={onClose} aria-label={t.common.close} className="text-stone hover:text-charcoal text-2xl leading-none cursor-pointer">×</button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-5">
          <div>
            <div className="rounded-lg overflow-hidden bg-sand">
              <img src={imageUrl(shot)} alt={product.name} className="w-full aspect-square object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setShot(i)}
                    className={`w-16 rounded overflow-hidden border-2 transition-colors duration-200 cursor-pointer ${shot === i ? 'border-olive' : 'border-transparent hover:border-charcoal/20'}`}
                  >
                    <img src={imageUrl(i, 'home_default')} alt="" loading="lazy" className="w-full aspect-square object-cover bg-sand" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="font-display text-2xl mb-4">{money(product.price)}</p>
            <p className="text-sm leading-relaxed text-charcoal/75 mb-5">{product.teaser}</p>

            {product.options.map((opt) => (
              <label key={opt.group} className="block mb-4">
                <span className="block text-xs uppercase tracking-[0.16em] text-stone mb-2">{opt.label}</span>
                <select
                  value={picked[opt.group] ?? opt.values[0]?.id}
                  onChange={(e) => setPicked({ ...picked, [opt.group]: e.target.value })}
                  className="w-full border hairline rounded-lg px-3 py-2.5 text-sm bg-white cursor-pointer"
                >
                  {opt.values.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
                </select>
              </label>
            ))}

            {product.description && (
              <div className="mt-5 pt-5 border-t hairline">
                <h4 className="text-xs uppercase tracking-[0.16em] text-stone mb-2">{t.armchairs.details}</h4>
                <p className="text-[13px] leading-relaxed text-charcoal/70">{product.description}</p>
              </div>
            )}

            <a
              href={product.url}
              target="_blank"
              rel="noreferrer"
              className="btn-outline inline-flex items-center gap-2 mt-6"
            >
              {t.armchairs.viewInShop} <Icon.ArrowR size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function PageBtn({ children, onClick, disabled, activeState }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-9 h-9 px-2.5 rounded border hairline transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-default ${activeState ? 'bg-charcoal text-white border-charcoal' : 'hover:border-olive hover:text-olive'}`}
    >
      {children}
    </button>
  )
}
