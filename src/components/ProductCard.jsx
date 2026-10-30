import { useState } from 'react'
import { useCartStore } from '../store/useCartStore'
import { useFavoritesStore } from '../store/useFavoritesStore'
import { formatCategory, formatCurrency } from '../utils/format'
import { HeartIcon } from './Icons'

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
  const isFavorite = useFavoritesStore((state) =>
    state.favorites.some((item) => item.id === product.id),
  )

  return (
    <article className="product-card">
      <div className="product-media">
        <button
          type="button"
          className={`favorite-button ${isFavorite ? 'is-active' : ''}`}
          onClick={() => toggleFavorite(product)}
          aria-label={
            isFavorite
              ? `Quitar ${product.name} de favoritos`
              : `Agregar ${product.name} a favoritos`
          }
          aria-pressed={isFavorite}
        >
          <HeartIcon filled={isFavorite} />
        </button>

        {imageError || !product.image ? (
          <div className="product-placeholder" aria-hidden="true">
            {product.name.charAt(0)}
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <div className="product-body">
        <span className="product-category">
          {formatCategory(product.category)}
        </span>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-footer">
          <strong className="product-price">
            {formatCurrency(product.price)}
          </strong>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => addItem(product)}
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  )
}
