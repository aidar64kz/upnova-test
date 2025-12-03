import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CartChainEventManager } from 'utils/cartChainEventManager'
import {
  mockFetchCart,
  mockAddToCart,
  mockUpdateCart,
  GIFT_VARIANT_ID
} from 'utils/mockData'
import type { ShopifyCart } from 'types/shopify'

function Task1() {
  const [cart, setCart] = useState<ShopifyCart | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [events, setEvents] = useState<string[]>([])
  const [manager] = useState(() => {
    const m = new CartChainEventManager()

    m.addChainEvent({
      name: 'CHECK_AND_ADD_GIFT',
      action: async (cart) => {
        setEvents((prev) => [
          ...prev,
          'CHECK_AND_ADD_GIFT: Checking cart value...'
        ])
        if (cart.total_price < 10000) {
          setEvents((prev) => [
            ...prev,
            'CHECK_AND_ADD_GIFT: Cart value too low, stopping chain'
          ])
          return null
        }

        setEvents((prev) => [...prev, 'CHECK_AND_ADD_GIFT: Adding gift...'])
        const updatedCart = await mockAddToCart(GIFT_VARIANT_ID)
        return updatedCart
      }
    })

    m.addChainEvent({
      name: 'UPDATE_CART_ATTRIBUTE',
      action: async () => {
        setEvents((prev) => [
          ...prev,
          'UPDATE_CART_ATTRIBUTE: Updating attributes...'
        ])
        const updatedCart = await mockUpdateCart({
          gift_variant_id: GIFT_VARIANT_ID
        })
        return updatedCart
      }
    })

    return m
  })

  const handleRunChain = async () => {
    setIsRunning(true)
    setEvents([])
    setCart(null)

    try {
      const initialCart = await mockFetchCart()
      setCart(initialCart)
      setEvents((prev) => [...prev, 'Starting chain execution...'])

      await manager.startChainEvent(initialCart)

      const finalCart = manager.getCart()
      setCart(finalCart)
      setEvents((prev) => [...prev, 'Chain execution completed!'])
    } catch (error) {
      setEvents((prev) => [...prev, `Error: ${error}`])
    } finally {
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    setCart(null)
    setEvents([])
    setIsRunning(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Cart Chain Event Manager
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Sequential execution of cart modification events
          </p>
        </div>

        <div className="space-y-6 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex justify-center gap-4">
            <button
              onClick={handleRunChain}
              disabled={isRunning}
              className="rounded-md bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRunning ? 'Running...' : 'Run Chain'}
            </button>
            <button
              onClick={handleReset}
              disabled={isRunning}
              className="rounded-md border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset
            </button>
            <Link
              to="/"
              className="rounded-md border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Back to Home
            </Link>
          </div>

          {cart && (
            <div className="border-t pt-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Cart State
              </h2>
              <div className="space-y-2 rounded-md bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="font-medium">
                    ${(cart.total_price / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items Count:</span>
                  <span className="font-medium">{cart.items.length}</span>
                </div>
                {(cart.attributes.gift_variant_id as number) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gift Variant ID:</span>
                    <span className="font-medium">
                      {cart.attributes.gift_variant_id as number}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {events.length > 0 && (
            <div className="border-t pt-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Event Log
              </h2>
              <div className="max-h-64 overflow-y-auto rounded-md bg-gray-900 p-4">
                <div className="space-y-1 font-mono text-sm">
                  {events.map((event, index) => (
                    <div key={index} className="text-green-400">
                      {event}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Task1
