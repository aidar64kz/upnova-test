# Product Requirements Document: Cart Chain Event Manager

## Overview

A TypeScript-based Cart Chain Event Manager for Shopify that allows sequential execution of asynchronous cart modification actions. The manager processes events in a defined order, enabling complex cart operations like adding gifts based on cart value and updating cart attributes.

## Technology Stack

- **Vite** - Build tool and dev server
- **React 18** - UI framework
- **React Router DOM v7.10.0** - Client-side routing
- **TypeScript** - Type-safe development
- **Vitest** - Unit testing framework
- **@testing-library/react** - Component testing utilities
- **@testing-library/jest-dom** - DOM matchers for testing
- **TailwindCSS 3** - Utility-first CSS framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **@vitejs/plugin-react-swc** - Fast React plugin using SWC
- **vite-tsconfig-paths** - Path alias resolution
- **happy-dom** - Test environment

## Project Structure

```
src/
├── components/        # Reusable React components
├── pages/            # Page components (Task1, Task2, Task3)
├── utils/            # Utility functions
├── assets/           # Static assets (images, logos)
└── index.tsx         # Application entry point
```

## Path Aliases

The project uses TypeScript path aliases with `baseUrl: "./src"`, allowing imports like:

- `import Component from 'components/Component'`
- `import { util } from 'utils/index'`
- `import logo from 'assets/logo.svg'`

## Core Functionality

### Cart Chain Event Manager

A class that manages a sequence of cart modification events, executing them one after another with the ability to halt the chain if needed.

### Key Features

- **Add Chain Events** - Register named events with async actions
- **Execute Chain** - Trigger all events sequentially
- **Get Cart** - Retrieve current cart state
- **Chain Control** - Stop chain execution by returning null/undefined

## API Specification

### `addChainEvent(config)`

Registers a new event in the chain.

**Parameters:**

```typescript
{
  name: string
  action: (cart: ShopifyCart) => Promise<ShopifyCart | null | undefined>
}
```

**Behavior:**

- Adds event to the end of the chain
- Events execute in registration order

### `startChainEvent(cart)`

Executes all registered events sequentially.

**Parameters:**

- `cart: ShopifyCart` - Shopify cart object

**Returns:**

- `Promise<void>`

**Behavior:**

- Starts with the provided cart object
- Passes each event's return value to the next event
- Stops execution if any event returns null or undefined
- Updates internal cart state after successful completion

### `getCart()`

Returns the current cart state.

**Returns:**

- `ShopifyCart` object

**Behavior:**

- Returns the most recent cart object from the last successful chain execution

## Usage Example

```typescript
// Initialize manager
const cartEventManager = new CartChainEventManager()

// Add gift when cart value exceeds $100
cartEventManager.addChainEvent({
  name: 'CHECK_AND_ADD_GIFT',
  action: async (cart) => {
    if (cart.total_price < 10000) return null // Stop chain if under $100

    // Add gift product
    await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: GIFT_VARIANT_ID, quantity: 1 })
    })

    // Return updated cart
    return await fetch('/cart.json').then((res) => res.json())
  }
})

// Update cart attribute with gift info
cartEventManager.addChainEvent({
  name: 'UPDATE_CART_ATTRIBUTE',
  action: async (cart) => {
    return await fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attributes: { gift_variant_id: GIFT_VARIANT_ID }
      })
    }).then((res) => res.json())
  }
})

// Execute chain
const cart = await fetch('/cart.json').then((res) => res.json())
await cartEventManager.startChainEvent(cart)
console.log('CHAIN FINISHED')
```

## Type Definitions

```typescript
interface ShopifyCart {
  token: string
  note: string | null
  attributes: Record<string, any>
  total_price: number
  items: CartItem[]
  // ... other Shopify cart properties
}

interface ChainEvent {
  name: string
  action: (cart: ShopifyCart) => Promise<ShopifyCart | null | undefined>
}
```

## Testing Requirements

### Unit Tests (Vitest)

- Test event registration
- Test chain execution order
- Test chain stops when event returns null/undefined
- Test cart state updates after successful chain
- Test error handling in async actions

### Component Tests

- Test React components using `@testing-library/react`
- Test user interactions and UI behavior
- Use `@testing-library/jest-dom` matchers for assertions

### Test File Naming

Tests should be placed alongside components with the naming convention:

- `ComponentName.test.tsx` or `ComponentName.test.ts`

### Integration Tests

- Test with mock Shopify API responses
- Test multiple events modifying cart sequentially
- Test real-world scenarios (gift addition, attribute updates)

## Error Handling

- Log errors from individual events but continue chain execution (or stop based on requirements)
- Provide clear error messages with event names
- Handle network failures gracefully

## Implementation Notes

- Use TypeScript for type safety with strict mode enabled
- Maintain immutability where possible
- Events should be pure functions that don't modify input cart
- Follow project conventions: simple, DRY, KISS principles
- Use path aliases for imports (e.g., `import Component from 'components/Component'`)
- Consider adding event removal functionality for future iterations
- Consider adding event priority/ordering capabilities

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm test:ui` - Run tests with UI
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Type check without emitting files

## Success Criteria

- All events execute in registration order
- Chain stops correctly when event returns null/undefined
- Cart state is properly maintained and accessible
- All tests pass with >80% coverage
- Type-safe implementation with no TypeScript errors
- Code follows ESLint rules with zero warnings
- Implementation follows project's simple, DRY, and KISS principles
