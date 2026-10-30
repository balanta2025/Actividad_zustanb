import { useShallow } from 'zustand/react/shallow'
import { useProductStore } from '../store/useProductStore'
import { formatCategory } from '../utils/format'
import { SearchIcon } from './Icons'

export default function FilterBar() {
  const {
    query,
    category,
    categories,
    setQuery,
    setCategory,
    clearFilters,
  } = useProductStore(
    useShallow((state) => ({
      query: state.query,
      category: state.category,
      categories: state.categories,
      setQuery: state.setQuery,
      setCategory: state.setCategory,
      clearFilters: state.clearFilters,
    })),
  )

  const hasFilters = query !== '' || category !== 'all'

  return (
    <section className="filter-bar" aria-label="Filtros del catálogo">
      <div className="filter-field">
        <label htmlFor="search">Buscar producto</label>
        <div className="search-input">
          <SearchIcon />
          <input
            id="search"
            type="search"
            placeholder="Nombre, categoría o descripción"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="filter-field">
        <label htmlFor="category">Categoría</label>
        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {formatCategory(item)}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="btn btn-secondary filter-clear"
        onClick={clearFilters}
        disabled={!hasFilters}
      >
        Limpiar filtros
      </button>
    </section>
  )
}
