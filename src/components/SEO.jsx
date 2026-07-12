import { useEffect } from 'react'
import { useLang } from '../i18n.jsx'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Lightweight SPA SEO: title, description, Open Graph, canonical + JSON-LD.
 * jsonLd may be a Product/BreadcrumbList schema object or array of them.
 */
export default function SEO({ title, description, jsonLd }) {
  const { lang } = useLang()
  useEffect(() => {
    const full = title ? `${title} — KA International` : 'KA International — Luxury Living. Designed for Life.'
    document.title = full
    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
    }
    setMeta('property', 'og:title', full)
    setMeta('property', 'og:locale', lang === 'ar' ? 'ar_SA' : 'en_US')

    let link = document.head.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = window.location.origin + window.location.pathname

    const id = 'ka-jsonld'
    document.getElementById(id)?.remove()
    if (jsonLd) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.id = id
      s.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(s)
    }
    return () => document.getElementById(id)?.remove()
  }, [title, description, jsonLd, lang])
  return null
}

export const productSchema = (p, lang, price) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: p.name[lang] || p.name.en,
  description: p.description[lang] || p.description.en,
  image: p.images,
  brand: { '@type': 'Brand', name: 'KA International' },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'SAR',
    price: price ?? p.price,
    availability: 'https://schema.org/MadeToOrder',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: p.rating,
    reviewCount: p.reviewCount,
  },
})

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: window.location.origin + it.path,
  })),
})
