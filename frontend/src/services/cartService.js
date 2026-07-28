const CART_KEY = 'gemhaven_cart'

function readCart() {
  try {
    const stored =
      localStorage.getItem(
        CART_KEY
      )

    if (!stored) {
      return []
    }

    const cart =
      JSON.parse(stored)

    return Array.isArray(cart)
      ? cart
      : []
  } catch (error) {
    console.error(
      'Error reading cart:',
      error
    )

    return []
  }
}

function saveCart(cart) {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  )

  window.dispatchEvent(
    new CustomEvent(
      'gemhaven-cart-updated'
    )
  )
}

export function getCart() {
  return readCart()
}

export function addToCart(gem) {
  const cart =
    readCart()

  const existing =
    cart.find(
      item =>
        String(
          item.gemId
        ) ===
        String(gem.id)
    )

  if (existing) {
    return cart
  }

  const cartItem = {
    cartItemId:
      `${gem.id}-${Date.now()}`,

    gemId: gem.id,

    name:
      gem.name || '',

    type:
      gem.type || '',

    color:
      gem.color ||
      '#C9A84C',

    colorName:
      gem.colorName || '',

    caratWeight:
      gem.caratWeight || '',

    cut:
      gem.cut || '',

    clarity:
      gem.clarity || '',

    origin:
      gem.origin || '',

    certAuthority:
      gem.certAuthority || '',

    certNumber:
      gem.certNumber || '',

    description:
      gem.description || '',

    price: Number(
      gem.price || 0
    ),

    imageUrl:
      gem.imageUrl ||
      null,

    quantity: 1,
  }

  const updatedCart = [
    ...cart,
    cartItem,
  ]

  saveCart(updatedCart)

  return updatedCart
}

export function removeFromCart(
  gemId
) {
  const cart =
    readCart()

  const updatedCart =
    cart.filter(
      item =>
        String(
          item.gemId
        ) !==
        String(gemId)
    )

  saveCart(updatedCart)

  return updatedCart
}

export function clearCart() {
  saveCart([])
}

export function getCartCount() {
  return readCart().reduce(
    (total, item) =>
      total +
      Number(
        item.quantity || 1
      ),
    0
  )
}