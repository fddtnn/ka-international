import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import SEO from '../components/SEO.jsx'
import { Page } from '../components/ui.jsx'

export default function NotFound() {
  const { t } = useLang()
  return (
    <Page>
      <SEO title="404" />
      <section className="mx-auto max-w-xl px-5 pt-[180px] pb-24 text-center">
        <p className="font-display text-8xl text-charcoal/15">404</p>
        <h1 className="editorial text-4xl mt-6">{t.common.notFound}</h1>
        <p className="text-charcoal/55 mt-3">{t.common.notFoundSub}</p>
        <Link to="/" className="btn-primary mt-9">{t.checkout.backHome}</Link>
      </section>
    </Page>
  )
}
