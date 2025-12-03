import type { ShopifyCart } from 'types/shopify'

export const GIFT_VARIANT_ID = 123456789

export const createMockCart = (totalPrice: number): ShopifyCart => ({
  token: 'mock-cart-token',
  note: null,
  attributes: {},
  total_price: totalPrice,
  items: [
    {
      id: 1,
      product_id: 100,
      title: 'Sample Product',
      price: totalPrice,
      quantity: 1,
      variant_id: 200
    }
  ]
})

export const mockFetchCart = async (): Promise<ShopifyCart> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createMockCart(12000))
    }, 300)
  })
}

export const mockAddToCart = async (
  variantId: number
): Promise<ShopifyCart> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cart = createMockCart(15000)
      cart.items.push({
        id: 2,
        product_id: 101,
        title: 'Free Gift',
        price: 0,
        quantity: 1,
        variant_id: variantId
      })
      resolve(cart)
    }, 500)
  })
}

export const mockUpdateCart = async (
  attributes: Record<string, unknown>
): Promise<ShopifyCart> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cart = createMockCart(15000)
      cart.attributes = { ...cart.attributes, ...attributes }
      cart.items.push({
        id: 2,
        product_id: 101,
        title: 'Free Gift',
        price: 0,
        quantity: 1,
        variant_id: GIFT_VARIANT_ID
      })
      resolve(cart)
    }, 400)
  })
}
