import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import App from './App'

describe('<App />', () => {
  it('should render the home page inside a router', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', {
        name: /Welcome!/i,
        level: 1
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Click on the tasks to see the implementation./i)
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: /Task 1/i
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: /Task 2/i
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: /Task 3/i
      })
    ).toBeInTheDocument()

    expect(container.firstChild).toBeInTheDocument()
  })
})
