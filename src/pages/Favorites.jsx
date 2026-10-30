import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useFavoritesStore } from '../store/useFavoritesStore'

export default function Favorites() {
  const favorites = useFavoritesStore((state) => state.favorites)
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites)

  return (
    <section className="page-section" aria-labelledby="favorites-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Ejercicio 3</span>
          <h1 id="favorites-title">Favoritos</h1>
          <p className="section-subtitle">
            Productos guardados en un store independiente y persistidos en el
            navegador.
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={clearFavorites}
          >
            Vaciar favoritos
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <h2>Todavía no tienes favoritos</h2>
          <p>Marca el corazón de un producto para guardarlo aquí.</p>
          <Link to="/" className="btn btn-primary">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
