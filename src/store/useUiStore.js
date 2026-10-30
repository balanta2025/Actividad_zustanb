import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUiStore = create(
  persist(
    (set) => ({
      theme: 'light',
      cartOpen: false,

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),
      toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),
    }),
    {
      name: 'tienda-sena-ui',
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
)
