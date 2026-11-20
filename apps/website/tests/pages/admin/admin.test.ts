import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Admin Page', () => {
  it('renders admin dashboard', () => {
    render(screen.getByRole('heading', { name: 'Admin Dashboard' }))
    expect(screen.getByRole('heading', { name: 'Admin Dashboard' })).toBeInTheDocument()
  })

  it('displays navigation menu', () => {
    const { container } = render(screen.getByRole('main'))
    expect(container).toMatchSnapshot()
  })
})