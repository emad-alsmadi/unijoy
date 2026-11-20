import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProfileDropdown } from '@/components/ui/ProfileDropdown'

describe('ProfileDropdown Component', () => {
  it('renders profile information', () => {
    render(<ProfileDropdown
      userName="John Doe"
      userRole="Admin"
    />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('displays dropdown menu', () => {
    const { container } = render(<ProfileDropdown
      userName="John Doe"
      userRole="Admin"
    />)
    expect(container).toMatchSnapshot()
  })
})