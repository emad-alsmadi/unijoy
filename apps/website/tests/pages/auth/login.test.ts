import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Login Page', () => {
  it('renders login form', () => {
    render(screen.getByRole('heading', { name: 'Login' }))
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })

  it('contains email input', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('contains password input', () => {
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('contains submit button', () => {
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })
})