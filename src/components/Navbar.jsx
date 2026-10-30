import { Link, NavLink } from 'react-router-dom'
import { useCartStore } from '../store/useCartStore'
import { useUiStore } from '../store/useUiStore'
import { CartIcon, MoonIcon, SunIcon } from './Icons'

export default function Navbar() {
  const totalItems = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.qty, 0),
  )
  const theme = useUiStore((state) => state.theme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)
  const openCart = useUiStore((state) => state.openCart)

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">TS</span>
          <span className="brand-text">
            <strong>Tienda SENA</strong>
            <small>Práctica de Zustand</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Navegación principal">
          <NavLink to="/" end className="nav-link">
            Catálogo
          </NavLink>
          <NavLink to="/favoritos" className="nav-link">
            Favoritos
          </NavLink>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="icon-button"
            onClick={toggleTheme}
            aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
            title={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>

          <button
            type="button"
            className="cart-button"
            onClick={openCart}
            aria-label={`Abrir carrito, ${totalItems} productos`}
          >
            <CartIcon />
            <span>Carrito</span>
            <span className="cart-badge">{totalItems}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
