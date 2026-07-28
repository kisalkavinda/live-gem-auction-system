import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'

const CartContext = createContext(null)

const CART_KEY = 'gemhaven_cart'

function getUser() {
  try {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

function isLoggedIn() {
  const token = localStorage.getItem('token')
  const user = getUser()

  return Boolean(token && user)
}

function readCart() {
  try {
    const stored = localStorage.getItem(CART_KEY)

    if (!stored) {
      return []
    }

    const cart = JSON.parse(stored)

    return Array.isArray(cart) ? cart : []
  } catch (error) {
    console.error('Error reading cart:', error)
    return []
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))

  window.dispatchEvent(
    new CustomEvent('gemhaven-cart-updated')
  )
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  const loadCart = useCallback(() => {
    if (!isLoggedIn()) {
      setCartItems([])
      return
    }

    const cart = readCart()

    setCartItems(cart)
  }, [])

  useEffect(() => {
    loadCart()

    const handleCartUpdate = () => {
      loadCart()
    }

    const handleStorage = () => {
      loadCart()
    }

    window.addEventListener(
      'gemhaven-cart-updated',
      handleCartUpdate
    )

    window.addEventListener(
      'storage',
      handleStorage
    )

    return () => {
      window.removeEventListener(
        'gemhaven-cart-updated',
        handleCartUpdate
      )

      window.removeEventListener(
        'storage',
        handleStorage
      )
    }
  }, [loadCart])

  const addToCart = async (gem) => {
    if (!isLoggedIn()) {
      throw new Error('LOGIN_REQUIRED')
    }

    if (!gem || !gem.id) {
      throw new Error('INVALID_GEM')
    }

    try {
      setLoading(true)

      const cart = readCart()

      const existingItem = cart.find(
        item =>
          String(item.gemId) === String(gem.id)
      )

      if (existingItem) {
        setCartItems(cart)
        return true
      }

      const cartItem = {
        cartItemId: `${gem.id}-${Date.now()}`,

        gemId: gem.id,

        name: gem.name || 'Unnamed Gem',

        type: gem.type || '',

        price: Number(gem.price || 0),

        imageUrl: gem.imageUrl || null,

        color: gem.color || '#C9A84C',

        colorName: gem.colorName || '',

        caratWeight: gem.caratWeight || '',

        cut: gem.cut || '',

        clarity: gem.clarity || '',

        certNumber: gem.certNumber || '',

        certAuthority: gem.certAuthority || '',

        origin: gem.origin || '',

        description: gem.description || '',

        quantity: 1,
      }

      const updatedCart = [
        ...cart,
        cartItem,
      ]

      saveCart(updatedCart)

      setCartItems(updatedCart)

      return true
    } catch (error) {
      console.error(
        'Error adding item to cart:',
        error
      )

      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (gemId) => {
    if (!isLoggedIn()) {
      setCartItems([])
      return false
    }

    try {
      const cart = readCart()

      const updatedCart = cart.filter(
        item =>
          String(item.gemId) !== String(gemId)
      )

      saveCart(updatedCart)

      setCartItems(updatedCart)

      return true
    } catch (error) {
      console.error(
        'Error removing item from cart:',
        error
      )

      throw error
    }
  }

  const clearCart = async () => {
    try {
      saveCart([])

      setCartItems([])

      return true
    } catch (error) {
      console.error(
        'Error clearing cart:',
        error
      )

      throw error
    }
  }

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  )

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider'
    )
  }

  return context
}