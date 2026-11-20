import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Halls Page', () => {
  it('renders halls page', () => {
    render(screen.getByRole('heading', { name: 'Halls' }))
    expect(screen.getByRole('heading', { name: 'Halls' })).toBeInTheDocument()
  })

  it('displays hall cards', () => {
    const { container } = render(screen.getByRole('main'))
    expect(container).toMatchSnapshot()
  })
})