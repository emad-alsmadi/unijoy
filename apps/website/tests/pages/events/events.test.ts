import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Events Page', () => {
  it('renders events page', () => {
    render(screen.getByRole('heading', { name: 'Events' }))
    expect(screen.getByRole('heading', { name: 'Events' })).toBeInTheDocument()
  })

  it('displays event cards', () => {
    const { container } = render(screen.getByRole('main'))
    expect(container).toMatchSnapshot()
  })
})