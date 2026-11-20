import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HallCard } from '@/components/ui/HallCard'

describe('HallCard Component', () => {
  it('renders hall information', () => {
    render(<HallCard
      id="1"
      name="Main Hall"
      capacity={100}
      image="/test.jpg"
    />)
    expect(screen.getByText('Main Hall')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('displays hall image', () => {
    const { container } = render(<HallCard
      id="1"
      name="Test Hall"
      capacity={50}
      image="/test.jpg"
    />)
    expect(container).toMatchSnapshot()
  })
})