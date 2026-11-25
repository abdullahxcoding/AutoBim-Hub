import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Toast from './components/Toast.jsx'
import EnquiryModal from './components/EnquiryModal.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import { AuthProvider } from './lib/AuthContext.jsx'
import { CartProvider } from './lib/CartContext.jsx'
import Home from './pages/Home.jsx'

const ProductPage = lazy(() => import('./pages/ProductPage.jsx'))
const DocsPage = lazy(() => import('./pages/DocsPage.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))
const Auth = lazy(() => import('./pages/Auth.jsx'))
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'))
const Account = lazy(() => import('./pages/Account.jsx'))
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess.jsx'))
const Cart = lazy(() => import('./pages/Cart.jsx'))

/** Scroll to top on page change, or to #section when the URL has a hash. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <CartProvider>
        <ScrollManager />
        <a className="skip-link" href="#main">Skip to content</a>
        <Navbar />
        <main id="main">
          <Suspense fallback={<div className="page-loading" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products/:slug" element={<ProductPage />} />
              <Route path="/products/:slug/docs" element={<DocsPage />} />
              <Route path="/products/:slug/docs/:page" element={<DocsPage />} />
              <Route path="/login" element={<Auth mode="login" />} />
              <Route path="/signup" element={<Auth mode="signup" />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout/success" element={<RequireAuth><CheckoutSuccess /></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Toast />
        <EnquiryModal />
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
