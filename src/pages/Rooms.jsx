import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { ROOMS } from '../data/products.js'
import SEO from '../components/SEO.jsx'
import { Page, Reveal, SectionTitle, Img, Icon } from '../components/ui.jsx'

export default function Rooms() {
  const { t, lang } = useLang()
  return (
    <Page>
      <SEO title={t.rooms.title} description={t.rooms.sub} />
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-[130px]">
        <SectionTitle eyebrow={t.nav.rooms} title={t.rooms.title} sub={t.rooms.sub} />
        <div className="mt-14 space-y-8">
          {ROOMS.map((room, i) => (
            <Reveal key={room.id} delay={0.05}>
              <Link
                to={`/rooms/${room.id}`}
                className="group relative block rounded-luxe overflow-hidden bg-charcoal h-[52vh] min-h-[380px]"
              >
                <Img src={room.image} alt={room.name[lang]} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-70 group-hover:scale-[1.03] transition-all duration-700 ease-out" />
                <div className={`absolute inset-0 bg-gradient-to-t ${i % 2 ? 'md:bg-gradient-to-l' : 'md:bg-gradient-to-r'} from-charcoal/80 via-charcoal/20 to-transparent`} />
                <div className={`absolute inset-0 flex flex-col justify-end md:justify-center p-8 md:p-16 ${i % 2 ? 'md:items-end md:text-end' : ''}`}>
                  <p className="text-olive-light text-xs uppercase tracking-[0.3em] mb-4">{room.products.length} {t.rooms.pieces}</p>
                  <h2 className="editorial text-white text-4xl md:text-6xl max-w-lg">{room.name[lang]}</h2>
                  <p className="text-white/60 mt-4 max-w-md hidden md:block">{room.description[lang]}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-white group-hover:text-olive-light transition-colors duration-300 text-sm tracking-wide">
                    {t.rooms.shopRoom} <Icon.ArrowR size={18} className="rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </Page>
  )
}
