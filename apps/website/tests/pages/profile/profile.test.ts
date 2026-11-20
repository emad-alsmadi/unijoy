import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Profile Page', () => {
  it('renders profile page', () => {
    render(screen.getByRole('heading', { name: 'Profile' }))
    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument()
  })

  it('displays user information', () => {
    const { container } = render(screen.getByRole('main'))
    expect(container).toMatchSnapshot()
  })
})