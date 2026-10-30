import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/useCartStore'
import { useUiStore } from '../store/useUiStore'
import { formatCurrency, formatUnits } from '../utils/format'
import { CloseIcon, TrashIcon } from './Icons'

export default function CartPanel() {
  const isOpen = useUiStore((state) => state.cartOpen)
  const closeCart = useUiStore((state) => state.closeCart)

  const items = useCartStore((state) => state.items)
  const updateQty = useCartStore((state) => state.updateQty)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const totalItems = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.qty, 0),
  )
  const totalPrice = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.price * item.qty, 0),
  )

  useEffect(() => {
    if (!isOpen) return undefined

    const handleEscape = (event) => {
      if (event.key === 'Escape') closeCart()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  return (
    <div className="cart-overlay" onClick={closeCart}>
      <aside
        className="cart-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="cart-header">
          <div>
            <h2>Tu carrito</h2>
            <p>{formatUnits(totalItems)}</p>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
          >
            <CloseIcon />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>El carrito está vacío.</p>
            <Link to="/" className="btn btn-primary" onClick={closeCart}>
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  {item.image ? (
                    <img src={item.image} alt="" className="cart-item-image" />
                  ) : (
                    <span className="cart-item-image" aria-hidden="true" />
                  )}

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>{formatCurrency(item.price)} c/u</p>

                    <div className="cart-item-actions">
                      <div className="qty-control">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          aria-label={`Quitar una unidad de ${item.name}`}
                        >
                          −
                        </button>
                        <span aria-label={`Cantidad: ${item.qty}`}>
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          aria-label={`Agregar una unidad de ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Eliminar ${item.name} del carrito`}
                      >
                        <TrashIcon /> Eliminar
                      </button>
                    </div>
                  </div>

                  <strong className="cart-item-total">
                    {formatCurrency(item.price * item.qty)}
                  </strong>
                </li>
              ))}
            </ul>

            <footer className="cart-footer">
              <div className="cart-summary">
                <span>Total de productos</span>
                <strong>{totalItems}</strong>
              </div>
              <div className="cart-summary cart-summary-total">
                <span>Total a pagar</span>
                <strong>{formatCurrency(totalPrice)}</strong>
              </div>

              <button
                type="button"
                className="btn btn-danger"
                onClick={clearCart}
              >
                Vaciar carrito
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
