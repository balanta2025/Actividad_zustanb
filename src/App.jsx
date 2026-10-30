import { useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import CartPanel from './components/CartPanel'
import Navbar from './components/Navbar'
import Catalog from './pages/Catalog'
import Favorites from './pages/Favorites'
import { useUiStore } from './store/useUiStore'

function NotFound() {
  return (
    <section className="empty-state">
      <h1>Página no encontrada</h1>
      <p>La ruta que buscas no existe en la aplicación.</p>
      <Link to="/" className="btn btn-primary">
        Volver al catálogo
      </Link>
    </section>
  )
}

export default function App() {
  const theme = useUiStore((state) => state.theme)

  useEffect(() => {
    document.body.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <p>
            Tienda SENA · Taller de Zustand para ADSO
          </p>
          <p>React 19 · Vite · Zustand 5</p>
        </div>
      </footer>

      <CartPanel />
    </div>
  )
}
