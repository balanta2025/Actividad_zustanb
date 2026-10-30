import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (product) =>
        set((state) => {
          const exists = state.favorites.some((item) => item.id === product.id)

          return {
            favorites: exists
              ? state.favorites.filter((item) => item.id !== product.id)
              : [...state.favorites, product],
          }
        }),

      isFavorite: (id) => get().favorites.some((item) => item.id === id),

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'tienda-sena-favorites',
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
)
