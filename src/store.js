import { create } from 'zustand'
import { persist } from 'zustand/middleware'

let toastId = 0

export const useStore = create(
  persist(
    (set, get) => ({
      cart: [], // { id, productId, name, nameAr, image, unitPrice, qty, config }
      wishlist: [], // productIds
      compare: [], // productIds
      recentlyViewed: [], // productIds
      savedConfigs: [], // { productId, config, price, date }
      toasts: [],

      addToCart: (item) => {
        const key = item.productId + JSON.stringify(item.config || {})
        const existing = get().cart.find((c) => c.key === key)
        if (existing) {
          set({ cart: get().cart.map((c) => (c.key === key ? { ...c, qty: c.qty + (item.qty || 1) } : c)) })
        } else {
          set({ cart: [...get().cart, { ...item, key, qty: item.qty || 1 }] })
        }
      },
      removeFromCart: (key) => set({ cart: get().cart.filter((c) => c.key !== key) }),
      setQty: (key, qty) =>
        set({ cart: qty < 1 ? get().cart.filter((c) => c.key !== key) : get().cart.map((c) => (c.key === key ? { ...c, qty } : c)) }),
      clearCart: () => set({ cart: [] }),

      toggleWishlist: (id) =>
        set({ wishlist: get().wishlist.includes(id) ? get().wishlist.filter((w) => w !== id) : [...get().wishlist, id] }),

      toggleCompare: (id) =>
        set({
          compare: get().compare.includes(id)
            ? get().compare.filter((c) => c !== id)
            : [...get().compare.slice(-2), id],
        }),
      clearCompare: () => set({ compare: [] }),

      addRecentlyViewed: (id) =>
        set({ recentlyViewed: [id, ...get().recentlyViewed.filter((r) => r !== id)].slice(0, 8) }),

      saveConfig: (entry) => set({ savedConfigs: [entry, ...get().savedConfigs].slice(0, 20) }),

      pushToast: (msg) => {
        const id = ++toastId
        set({ toasts: [...get().toasts, { id, msg }] })
        setTimeout(() => set({ toasts: get().toasts.filter((t) => t.id !== id) }), 2600)
      },
    }),
    {
      name: 'ka-store',
      partialize: (s) => ({
        cart: s.cart, wishlist: s.wishlist, compare: s.compare,
        recentlyViewed: s.recentlyViewed, savedConfigs: s.savedConfigs,
      }),
    },
  ),
)

export const cartCount = (s) => s.cart.reduce((a, c) => a + c.qty, 0)
export const cartTotal = (s) => s.cart.reduce((a, c) => a + c.qty * c.unitPrice, 0)
