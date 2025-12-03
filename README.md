## Upnova Test – React + Vite + Tailwind

This project is a React 18 single-page application built with Vite and TypeScript, using TailwindCSS for styling, Vitest + Testing Library for tests, and ESLint + Prettier for code quality.

## Tech stack

- **Build tool**: [Vite](https://vitejs.dev)
- **UI library**: [React](https://react.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [TailwindCSS](https://tailwindcss.com)
- **Routing**: [React Router](https://reactrouter.com)
- **Testing**: [Vitest](https://vitest.dev), [Testing Library](https://testing-library.com), [@testing-library/jest-dom](https://github.com/testing-library/jest-dom)
- **Linting & formatting**: [ESLint](https://eslint.org), [Prettier](https://prettier.io)

## Prerequisites

- **Node.js**: v18+ (recommended)
- **Package manager**: [pnpm](https://pnpm.io) (`npm install -g pnpm`)

## After you clone the repo, go to project root

## Install & run

From the project root:

- **Install dependencies**

```bash
pnpm install
```

- **Start dev server** (hot reload, default `http://localhost:5173`)

```bash
pnpm dev
```


## Linting & type checking

- **Run ESLint**

```bash
pnpm lint
```

- **Run TypeScript type checker**

```bash
pnpm typecheck
```

## Testing

- **Run test suite (Vitest, CLI)**

```bash
pnpm test
```

- **Run test UI (Vitest UI in the browser)**

```bash
pnpm test:ui
```

## Available scripts (summary)

- **`pnpm dev`**: Start Vite dev server
- **`pnpm build`**: Type-check and build production bundle
- **`pnpm serve`**: Preview the production build locally
- **`pnpm test`**: Run tests via Vitest
- **`pnpm test:ui`**: Run Vitest with browser UI
- **`pnpm lint`**: Run ESLint on `src` with `--max-warnings=0`
- **`pnpm typecheck`**: Run TypeScript compiler in no-emit mode

## License

This project is licensed under the **MIT License**.
