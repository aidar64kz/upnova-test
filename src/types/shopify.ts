export interface CartItem {
  id: number
  product_id: number
  title: string
  price: number
  quantity: number
  variant_id: number
}

export interface ShopifyCart {
  token: string
  note: string | null
  attributes: Record<string, unknown>
  total_price: number
  items: CartItem[]
}

export interface ChainEvent {
  name: string
  action: (cart: ShopifyCart) => Promise<ShopifyCart | null | undefined>
}
