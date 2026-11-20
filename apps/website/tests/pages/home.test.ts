import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Routes } from '@/app/routes'

describe('Home Page', () => {
  it('renders home page heading', () => {
    render(screen.getByRole('heading', { name: 'Unijoy' }))
    expect(screen.getByRole('heading', { name: 'Unijoy' })).toBeInTheDocument()
  })

  it('displays hero section', () => {
    const { container } = render(screen.getByRole('main'))
    expect(container).toMatchSnapshot()
  })
})