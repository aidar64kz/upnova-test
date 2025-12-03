import type { ShopifyCart, ChainEvent } from 'types/shopify'

export class CartChainEventManager {
  private events: ChainEvent[] = []
  private cart: ShopifyCart | null = null

  addChainEvent(config: ChainEvent): void {
    this.events.push(config)
  }

  async startChainEvent(cart: ShopifyCart): Promise<void> {
    let currentCart = cart

    for (const event of this.events) {
      const result = await event.action(currentCart)

      if (result === null || result === undefined) {
        return
      }

      currentCart = result
    }

    this.cart = currentCart
  }

  getCart(): ShopifyCart | null {
    return this.cart
  }
}
