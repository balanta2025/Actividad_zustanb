import { create } from 'zustand'

const API = import.meta.env.VITE_API_URL || 'https://fakestoreapi.com'

function normalizeProduct(product) {
  return {
    id: product.id,
    name: product.title ?? product.name ?? 'Producto sin nombre',
    price: Number(product.price) || 0,
    category: product.category ?? 'otros',
    image: product.image ?? '',
    description: product.description ?? '',
  }
}

function filterProducts(products, query, category) {
  const text = query.trim().toLowerCase()

  return products.filter((product) => {
    const matchesText =
      !text ||
      product.name.toLowerCase().includes(text) ||
      product.category.toLowerCase().includes(text) ||
      product.description.toLowerCase().includes(text)

    const matchesCategory = category === 'all' || product.category === category

    return matchesText && matchesCategory
  })
}

function getCategories(products) {
  return [...new Set(products.map((product) => product.category))].sort()
}

export const useProductStore = create((set, get) => ({
  products: [],
  filteredProducts: [],
  categories: [],
  query: '',
  category: 'all',
  loading: false,
  error: null,
  notice: null,
  source: null,

  fetchProducts: async (force = false) => {
    if (get().loading) return
    if (!force && get().products.length) return

    set({ loading: true, error: null, notice: null })

    try {
      const res = await fetch(`${API}/products`)
      if (!res.ok) {
        throw new Error(`La API respondió con el estado ${res.status}`)
      }

      const data = await res.json()
      const products = data.map(normalizeProduct)

      set({
        products,
        categories: getCategories(products),
        filteredProducts: filterProducts(
          products,
          get().query,
          get().category,
        ),
        loading: false,
        source: 'api',
      })
    } catch (apiError) {
      try {
        const res = await fetch('/products.json')
        if (!res.ok) {
          throw new Error(`El catálogo local respondió ${res.status}`)
        }

        const data = await res.json()
        const products = data.map(normalizeProduct)

        set({
          products,
          categories: getCategories(products),
          filteredProducts: filterProducts(
            products,
            get().query,
            get().category,
          ),
          loading: false,
          source: 'local',
          notice:
            'No fue posible conectar con la API. Se está mostrando el catálogo local.',
        })
      } catch (localError) {
        set({
          loading: false,
          error: `${apiError.message}. ${localError.message}.`,
        })
      }
    }
  },

  setQuery: (query) =>
    set((state) => ({
      query,
      filteredProducts: filterProducts(
        state.products,
        query,
        state.category,
      ),
    })),

  setCategory: (category) =>
    set((state) => ({
      category,
      filteredProducts: filterProducts(state.products, state.query, category),
    })),

  clearFilters: () =>
    set((state) => ({
      query: '',
      category: 'all',
      filteredProducts: filterProducts(state.products, '', 'all'),
    })),
}))
