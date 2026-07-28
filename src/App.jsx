import { lazy, Suspense, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import { Toasts, ScrollToTop } from './components/ui.jsx'
import Home from './pages/Home.jsx'

const Collections = lazy(() => import('./pages/Collections.jsx'))
const FabricCatalog = lazy(() => import('./pages/FabricCatalog.jsx'))
const Studio = lazy(() => import('./pages/Studio.jsx'))
const ProductPage = lazy(() => import('./pages/ProductPage.jsx'))
const Rooms = lazy(() => import('./pages/Rooms.jsx'))
const RoomDetail = lazy(() => import('./pages/RoomDetail.jsx'))
const CartPage = lazy(() => import('./pages/CartPage.jsx'))
const Checkout = lazy(() => import('./pages/Checkout.jsx'))
const Wishlist = lazy(() => import('./pages/Wishlist.jsx'))
const Compare = lazy(() => import('./pages/Compare.jsx'))
const Account = lazy(() => import('./pages/Account.jsx'))
const Admin = lazy(() => import('./pages/Admin.jsx'))
const ARView = lazy(() => import('./pages/ARView.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function Loader() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="font-display text-3xl tracking-[0.2em] text-charcoal/30">KA</span>
        <div className="w-24 h-px bg-charcoal/10 relative overflow-hidden">
          <span className="absolute inset-0 scroll-line" />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isAR = location.pathname.startsWith('/ar/')

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && !isAR && <Navbar onCartOpen={() => setCartOpen(true)} />}
      <ScrollToTop />
      <div className="flex-1">
        <Suspense fallback={<Loader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/fabrics/catalog" element={<FabricCatalog />} />
              <Route path="/collections/fabrics/studio" element={<Studio />} />
              <Route path="/collections/:category" element={<Collections />} />
              <Route path="/product/:id" element={<ProductPage onCartOpen={() => setCartOpen(true)} />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/rooms/:id" element={<RoomDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/ar/:id" element={<ARView />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>
      {!isAdmin && !isAR && <Footer />}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Toasts />
    </div>
  )
}
