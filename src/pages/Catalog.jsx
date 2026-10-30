import { useEffect } from 'react'
import Counter from '../components/Counter'
import FilterBar from '../components/FilterBar'
import ProductCard from '../components/ProductCard'
import { useProductStore } from '../store/useProductStore'

export default function Catalog() {
  const products = useProductStore((state) => state.filteredProducts)
  const loading = useProductStore((state) => state.loading)
  const error = useProductStore((state) => state.error)
  const notice = useProductStore((state) => state.notice)
  const source = useProductStore((state) => state.source)
  const fetchProducts = useProductStore((state) => state.fetchProducts)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">React 19 + Vite + Zustand 5</span>
          <h1>Tienda SENA</h1>
          <p>
            Catálogo, carrito, favoritos, tema y filtros compartidos con estado
            global. Sin prop drilling y con persistencia en el navegador.
          </p>
        </div>
        <div className="hero-tags" aria-label="Funcionalidades de la práctica">
          <span>API de productos</span>
          <span>Carrito persistente</span>
          <span>Favoritos</span>
          <span>Tema claro/oscuro</span>
        </div>
      </section>

      <FilterBar />

      {(loading || error || notice || source) && (
        <div className="catalog-status">
          {loading && (
            <p className="status" role="status">
              <span className="spinner" aria-hidden="true" />
              Cargando productos...
            </p>
          )}

          {error && (
            <div className="alert alert-error" role="alert">
              <div>
                <strong>No se pudo cargar el catálogo.</strong>
                <p>{error}</p>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => fetchProducts(true)}
              >
                Reintentar
              </button>
            </div>
          )}

          {notice && !loading && (
            <div className="alert alert-info" role="status">
              <div>
                <strong>Modo de respaldo local</strong>
                <p>{notice}</p>
              </div>
            </div>
          )}

          {source && !loading && !error && (
            <p className="source-note">
              Origen de los datos:{' '}
              <strong>
                {source === 'api' ? 'Fake Store API' : 'archivo local'}
              </strong>
            </p>
          )}
        </div>
      )}

      {!loading && !error && (
        <section className="catalog-results" aria-labelledby="catalog-title">
          <div className="section-heading">
            <h2 id="catalog-title">Productos disponibles</h2>
            <span className="results-count">
              {products.length}{' '}
              {products.length === 1 ? 'resultado' : 'resultados'}
            </span>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <h3>Sin resultados</h3>
              <p>Prueba con otro término o cambia la categoría.</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}

      <Counter />
    </>
  )
}
