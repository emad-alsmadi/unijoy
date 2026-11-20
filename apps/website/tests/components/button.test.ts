import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders with default styles', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /Click me/ })).toBeInTheDocument()
  })

  it('renders with primary variant', () => {
    render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button', { name: /Primary/ })).toBeInTheDocument()
  })

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button', { name: /Secondary/ })).toBeInTheDocument()
  })

  it('renders with disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button', { name: /Disabled/ })
    expect(button).toBeDisabled()
  })
})