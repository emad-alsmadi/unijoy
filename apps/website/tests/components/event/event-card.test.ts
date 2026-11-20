import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EventCard } from '@/components/ui/EventCard'

describe('EventCard Component', () => {
  it('renders event information', () => {
    render(<EventCard
      id="1"
      title="Test Event"
      date="2024-01-15"
      location="Test Location"
      capacity={200}
    />)
    expect(screen.getByText('Test Event')).toBeInTheDocument()
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
  })

  it('displays event details', () => {
    const { container } = render(<EventCard
      id="1"
      title="Test Event"
      date="2024-01-15"
      location="Test Location"
      capacity={200}
    />)
    expect(container).toMatchSnapshot()
  })
})