import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('User Signup Page', () => {
  it('renders signup form', () => {
    render(screen.getByRole('heading', { name: 'Sign up' }))
    expect(screen.getByRole('heading', { name: 'Sign up' })).toBeInTheDocument()
  })

  it('contains name input', () => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
  })

  it('contains email input', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('contains role selection', () => {
    expect(screen.getByRole('radio', { name: /user/i })).toBeInTheDocument()
  })
})