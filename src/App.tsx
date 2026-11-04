import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { BlogPage } from './pages/BlogPage'
import { BlogPostPage } from './pages/BlogPostPage'

function ScrollToTop({ lenisRef }: { lenisRef: React.RefObject<Lenis | null> }) {
  const { pathname } = useLocation()
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
    if (pathname === '/') {
      document.title = 'Tarun'
    }
  }, [pathname, lenisRef])
  return null
}

export default function App() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <BrowserRouter>
      <ScrollToTop lenisRef={lenisRef} />
      <div className="page">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
