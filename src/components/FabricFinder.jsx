import { useEffect, useState } from 'react'
import { useLang } from '../i18n.jsx'
import { Icon } from './ui.jsx'

// Shared fabric search panel, cloned from the KA portal on deco3dserver.
// Filter semantics mirror the source API exactly:
//   colors / styles / qualities / uses -> OR within the group
//   types + widths + properties        -> one shared param, AND within it
//   between groups                     -> AND
const OR_GROUPS = ['colors', 'styles', 'qualities', 'uses']
const AND_GROUPS = ['types', 'widths', 'properties']
const EMPTY = { colors: [], types: [], qualities: [], widths: [], styles: [], uses: [], properties: [] }

export function useCatalog() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}fabric-catalog.json`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError(true))
  }, [])
  return { data, error }
}

export function matchFilters(fabrics, picked) {
  const andPicked = AND_GROUPS.flatMap((g) => picked[g].map((v) => [g, v]))
  return fabrics.filter((fab) => {
    for (const g of OR_GROUPS) {
      if (picked[g].length && !picked[g].some((v) => fab[g].includes(v))) return false
    }
    for (const [g, v] of andPicked) if (!fab[g].includes(v)) return false
    return true
  })
}

export const fabricImage = (data, fab) => `${data.imageBase}${fab.image}`

export default function FabricFinder({ data, onResults }) {
  const { t } = useLang()
  const [panel, setPanel] = useState('finder')
  const [openFilter, setOpenFilter] = useState(null)
  const [picked, setPicked] = useState(EMPTY)
  const [refQuery, setRefQuery] = useState('')
  const [colQuery, setColQuery] = useState('')

  const f = data?.filters

  function toggle(group, value) {
    setPicked((p) => ({
      ...p,
      [group]: p[group].includes(value) ? p[group].filter((v) => v !== value) : [...p[group], value],
    }))
  }

  function applyFilters() {
    if (!data || !Object.values(picked).some((v) => v.length)) return
    onResults(matchFilters(data.fabrics, picked))
  }

  function searchByReference() {
    if (!data) return
    const q = refQuery.trim().toLowerCase().replace(/[.\s/]/g, '')
    if (!q) return
    onResults(data.fabrics.filter((x) => x.ref.toLowerCase().replace(/[.\s/]/g, '').includes(q)))
  }

  function searchByCollection() {
    if (!data) return
    const q = colQuery.trim().toLowerCase()
    if (!q) return
    onResults(data.fabrics.filter((x) => x.collection.toLowerCase().includes(q) || x.name.toLowerCase().includes(q)))
  }

  return (
    <>
      <Section label={t.fabricFinder.byReference} open={panel === 'reference'} onClick={() => setPanel(panel === 'reference' ? null : 'reference')}>
        <SearchRow value={refQuery} onChange={setRefQuery} onGo={searchByReference} placeholder={t.fabricFinder.refPlaceholder} />
      </Section>

      <Section label={t.fabricFinder.byCollection} open={panel === 'collection'} onClick={() => setPanel(panel === 'collection' ? null : 'collection')}>
        <SearchRow value={colQuery} onChange={setColQuery} onGo={searchByCollection} placeholder={t.fabricFinder.colPlaceholder} />
      </Section>

      <Section label={t.fabricFinder.finder} open={panel === 'finder'} onClick={() => setPanel(panel === 'finder' ? null : 'finder')}>
        {!f ? (
          <p className="text-sm text-stone px-1 py-2">{t.fabricFinder.loading}</p>
        ) : (
          <div className="border hairline rounded-lg p-2 bg-sand/40">
            <Filter id="colors" label={t.fabricFinder.byColor} open={openFilter} setOpen={setOpenFilter}>
              {/* One row per colour family, drawn as the source's seven-shade strip. */}
              <div className="p-2 space-y-1">
                {f.colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => toggle('colors', c.hex)}
                    aria-label={c.hex}
                    className={`flex w-full h-8 overflow-hidden rounded-sm border-2 transition-all duration-150 cursor-pointer ${picked.colors.includes(c.hex) ? 'border-olive' : 'border-transparent hover:brightness-105'}`}
                  >
                    {(c.shades || [c.hex]).map((shade, i) => (
                      <span key={i} className="flex-1" style={{ backgroundColor: shade }} />
                    ))}
                  </button>
                ))}
              </div>
            </Filter>

            <Filter id="types" label={t.fabricFinder.byType} open={openFilter} setOpen={setOpenFilter}>
              <Boxes options={f.types} group="types" picked={picked} toggle={toggle} />
            </Filter>
            <Filter id="qualities" label={t.fabricFinder.byQuality} open={openFilter} setOpen={setOpenFilter}>
              <Boxes options={f.qualities} group="qualities" picked={picked} toggle={toggle} />
            </Filter>
            <Filter id="widths" label={t.fabricFinder.byWidth} open={openFilter} setOpen={setOpenFilter}>
              <Boxes options={f.widths} group="widths" picked={picked} toggle={toggle} />
            </Filter>
            <Filter id="styles" label={t.fabricFinder.byStyle} open={openFilter} setOpen={setOpenFilter}>
              <Boxes options={f.styles} group="styles" picked={picked} toggle={toggle} />
            </Filter>
            <Filter id="uses" label={t.fabricFinder.byUse} open={openFilter} setOpen={setOpenFilter}>
              <Boxes options={f.uses} group="uses" picked={picked} toggle={toggle} />
            </Filter>
            <Filter id="properties" label={t.fabricFinder.byProperties} open={openFilter} setOpen={setOpenFilter} last>
              <Boxes options={f.properties} group="properties" picked={picked} toggle={toggle} />
            </Filter>

            <button onClick={applyFilters} className="btn-olive w-full mt-3 py-2.5 text-sm cursor-pointer">
              {t.fabricFinder.apply}
            </button>
          </div>
        )}
      </Section>
    </>
  )
}

function Section({ label, open, onClick, children }) {
  return (
    <div className="border-b hairline last:border-0">
      <button onClick={onClick} className={`w-full text-start py-3 text-sm transition-colors duration-200 cursor-pointer ${open ? 'text-charcoal' : 'text-charcoal/60 hover:text-charcoal'}`}>
        {label}
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  )
}

function SearchRow({ value, onChange, onGo, placeholder }) {
  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onGo()}
        placeholder={placeholder}
        className="flex-1 min-w-0 border hairline rounded-lg px-3 py-2 text-sm bg-white"
      />
      <button onClick={onGo} aria-label={placeholder} className="px-3 border hairline rounded-lg hover:border-olive hover:text-olive transition-colors duration-200 cursor-pointer">
        <Icon.Search size={16} />
      </button>
    </div>
  )
}

function Filter({ id, label, open, setOpen, children, last }) {
  const isOpen = open === id
  return (
    <div className={last ? '' : 'mb-1.5'}>
      <button
        onClick={() => setOpen(isOpen ? null : id)}
        className="w-full flex items-center justify-between gap-2 bg-white border hairline rounded-md px-3 py-2 text-sm text-charcoal/70 hover:text-charcoal transition-colors duration-200 cursor-pointer"
      >
        {label}
        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {isOpen && <div className="mt-1 bg-white border hairline rounded-md">{children}</div>}
    </div>
  )
}

function Boxes({ options, group, picked, toggle }) {
  return (
    <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => toggle(group, o)}
          className={`block w-full text-start px-2.5 py-1.5 rounded text-[13px] leading-snug transition-colors duration-200 cursor-pointer ${picked[group].includes(o) ? 'bg-olive text-white' : 'text-charcoal/75 hover:bg-sand'}`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

export { Section, Paginator }

function Paginator({ page, pages, onGo }) {
  if (pages <= 1) return null
  const size = 5
  const start = Math.max(0, Math.min(page - Math.floor(size / 2), pages - size))
  const nums = Array.from({ length: Math.min(size, pages) }, (_, i) => start + i)
  return (
    <div className="flex items-center justify-center gap-1 mt-6 text-sm">
      <PageBtn disabled={page === 0} onClick={() => onGo(page - 1)}>«</PageBtn>
      {nums.map((n) => (
        <PageBtn key={n} activeState={n === page} onClick={() => onGo(n)}>{n + 1}</PageBtn>
      ))}
      <PageBtn disabled={page >= pages - 1} onClick={() => onGo(page + 1)}>»</PageBtn>
    </div>
  )
}

function PageBtn({ children, onClick, disabled, activeState }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-8 h-8 px-2 rounded border hairline transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-default ${activeState ? 'bg-charcoal text-white border-charcoal' : 'hover:border-olive hover:text-olive'}`}
    >
      {children}
    </button>
  )
}
